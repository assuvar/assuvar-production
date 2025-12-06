const fs = require('fs');
const path = require('path');
const https = require('https');
const matter = require('gray-matter');

// --- Configuration ---
const LANG_DIR = path.join(__dirname, '../lang');
const MESSAGES_DIR = path.join(__dirname, '../messages'); // Legacy
const APP_DIR = path.join(__dirname, '../app');
const COMPONENTS_DIR = path.join(__dirname, '../components');
const DATA_DIR = path.join(__dirname, '../data');

const LOCALES = [
    'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN',
    'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'nl-NL', 'sv-SE',
    'pt-BR', 'es-MX', 'ar-SA', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'ru-RU'
];

// Map full locales to LibreTranslate supported codes
const API_LANG_MAP = {
    'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en', 'en-CA': 'en', 'en-IN': 'en',
    'de-DE': 'de', 'fr-FR': 'fr', 'es-ES': 'es', 'it-IT': 'it', 'nl-NL': 'nl', 'sv-SE': 'sv',
    'pt-BR': 'pt', 'es-MX': 'es', 'ar-SA': 'ar', 'zh-CN': 'zh', 'zh-TW': 'zh',
    'ja-JP': 'ja', 'ko-KR': 'ko', 'ru-RU': 'ru'
};

const MASTER_LOCALE = 'en-US';

// --- Helpers ---

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getFiles(dir, ext = '.tsx') {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file, ext));
        } else {
            if (file.endsWith(ext)) {
                results.push(file);
            }
        }
    });
    return results;
}

function getMarkdownFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getMarkdownFiles(file));
        } else {
            if (file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}

// Extract keys and text from data-i18n attributes AND markdown files
function extractKeys() {
    const extracted = {};

    // 1. Scan Code
    const codeFiles = [...getFiles(APP_DIR), ...getFiles(COMPONENTS_DIR)];
    const regex = /data-i18n=["']([^"']+)["'][^>]*>([^<]+)</g;

    codeFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            const key = match[1];
            const text = match[2].trim();
            if (key && text) {
                extracted[key] = text;
            }
        }
    });

    // 2. Scan Markdown (Blog/News)
    const mdFiles = getMarkdownFiles(DATA_DIR);
    mdFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const parsed = matter(content);
        const id = path.basename(file, '.md');
        const type = path.basename(path.dirname(file)); // blog or news

        // Title
        if (parsed.data.title) {
            extracted[`${type}.${id}.title`] = parsed.data.title;
        }
        // Summary
        if (parsed.data.summary) {
            extracted[`${type}.${id}.summary`] = parsed.data.summary;
        }
        // Body (Simple approach: translate whole body as one block for now)
        // In production, you'd split by paragraphs to avoid API limits
        if (parsed.content) {
            extracted[`${type}.${id}.body`] = parsed.content.trim();
        }
    });

    return extracted;
}

async function translateText(text, source, target) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: 'text'
        });

        const options = {
            hostname: 'translate.argosopentech.com',
            port: 443,
            path: '/translate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.translatedText) {
                        resolve(json.translatedText);
                    } else {
                        console.error(`API Error for ${target}:`, json);
                        resolve(text); // Fallback to original
                    }
                } catch (e) {
                    console.error('JSON Parse Error:', e);
                    resolve(text);
                }
            });
        });

        req.on('error', (e) => {
            console.error('Request Error:', e);
            resolve(text);
        });

        req.write(data);
        req.end();
    });
}

// --- Main ---

async function main() {
    console.log('🔵 Starting Translation System...');
    ensureDir(LANG_DIR);

    // 1. Migration / Initialization
    // If en-US doesn't exist but messages/en.json does, copy it.
    const masterPath = path.join(LANG_DIR, `${MASTER_LOCALE}.json`);
    if (!fs.existsSync(masterPath)) {
        const legacyEn = path.join(MESSAGES_DIR, 'en.json');
        if (fs.existsSync(legacyEn)) {
            console.log('Migrating en.json to en-US.json...');
            fs.copyFileSync(legacyEn, masterPath);
        } else {
            fs.writeFileSync(masterPath, '{}');
        }
    }

    // 2. Extraction
    console.log('🔍 Scanning for data-i18n attributes and Markdown content...');
    const extracted = extractKeys();
    const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    let masterChanged = false;

    for (const [key, text] of Object.entries(extracted)) {
        if (!masterContent[key] || masterContent[key] !== text) {
            console.log(`🆕 Found new/updated key: ${key}`);
            masterContent[key] = text;
            masterChanged = true;
        }
    }

    if (masterChanged) {
        fs.writeFileSync(masterPath, JSON.stringify(masterContent, null, 2));
        console.log(`💾 Updated ${MASTER_LOCALE}.json`);
    } else {
        console.log(`✅ ${MASTER_LOCALE} is up to date.`);
    }

    // 3. Translation
    for (const locale of LOCALES) {
        if (locale === MASTER_LOCALE) continue;

        const localePath = path.join(LANG_DIR, `${locale}.json`);
        let localeContent = {};
        if (fs.existsSync(localePath)) {
            localeContent = JSON.parse(fs.readFileSync(localePath, 'utf8'));
        } else {
            // Try to migrate from legacy if exists
            const legacyCode = locale.split('-')[0]; // e.g. fr from fr-FR
            const legacyPath = path.join(MESSAGES_DIR, `${legacyCode}.json`);
            if (fs.existsSync(legacyPath)) {
                console.log(`Migrating ${legacyCode}.json to ${locale}.json...`);
                localeContent = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
            }
        }

        const targetLang = API_LANG_MAP[locale];
        const missingKeys = [];

        for (const key in masterContent) {
            if (!localeContent[key]) {
                missingKeys.push(key);
            }
        }

        if (missingKeys.length > 0) {
            console.log(`🌍 Translating ${missingKeys.length} keys for ${locale} (${targetLang})...`);
            for (const key of missingKeys) {
                const sourceText = masterContent[key];
                let translated = sourceText;

                if (targetLang === 'en') {
                    // Just copy for English variants
                    translated = sourceText;
                } else {
                    // Call API
                    // Add small delay to be nice to free API
                    await new Promise(r => setTimeout(r, 1000));
                    translated = await translateText(sourceText, 'en', targetLang);
                    process.stdout.write('.');
                }
                localeContent[key] = translated;
            }
            console.log('\n');
            fs.writeFileSync(localePath, JSON.stringify(localeContent, null, 2));
            console.log(`💾 Saved ${locale}.json`);
        } else {
            // If file doesn't exist but we have content (migrated), save it
            if (!fs.existsSync(localePath) && Object.keys(localeContent).length > 0) {
                fs.writeFileSync(localePath, JSON.stringify(localeContent, null, 2));
                console.log(`💾 Saved migrated ${locale}.json`);
            } else {
                console.log(`✅ ${locale} is up to date.`);
            }
        }
    }

    console.log('🎉 Translation complete!');
}

main();
