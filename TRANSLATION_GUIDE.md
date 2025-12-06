# Automatic Translation System Guide

This project uses a fully automated translation system powered by LibreTranslate.

## 🚀 How it Works

1.  **Write Code**: You write your content in `app` or `components` using `data-i18n` attributes for new text, or just rely on existing keys.
    ```tsx
    <h1 data-i18n="home.title">Welcome to Structura IT</h1>
    ```
2.  **Run Translator**: Run the translation script.
    ```bash
    npm run translate
    ```
3.  **Magic Happens**:
    *   The script scans your code for `data-i18n` attributes.
    *   It updates `lang/en-US.json` with any new or changed English text.
    *   It automatically translates missing keys to **18 other languages** (German, French, Spanish, Arabic, Chinese, etc.).
    *   It saves the results to `lang/xx-XX.json`.

## 📂 Folder Structure

*   `lang/`: Contains all translation files (e.g., `en-US.json`, `fr-FR.json`).
*   `scripts/translate.js`: The automation script.
*   `components/LanguageSwitcher.tsx`: The UI component for switching languages.

## 🌍 Supported Languages

| Locale | Language |
| :--- | :--- |
| `en-US` | English (United States) |
| `en-GB` | English (United Kingdom) |
| `de-DE` | Deutsch (Germany) |
| `fr-FR` | Français (France) |
| `es-ES` | Español (Spain) |
| `ar-SA` | العربية (Saudi Arabia) |
| `zh-CN` | 中文 (China) |
| ... and many more. |

## 🛠️ Adding New Content

To add a new translatable text:

1.  Add the text in your React component with a unique `data-i18n` key.
    ```tsx
    <p data-i18n="about.description">
      We provide top-tier IT solutions.
    </p>
    ```
2.  Run `npm run translate`.
3.  The text "We provide top-tier IT solutions" will be added to `en-US.json` and translated to all other languages automatically.

## ⚠️ Notes

*   **API Limits**: The free LibreTranslate API has rate limits. The script includes a delay to avoid hitting them, so it might take a minute to run for many keys.
*   **Manual Edits**: You should avoid manually editing `lang/*.json` files as they might be overwritten if the source code changes. Always update the English text in the code (inside `data-i18n` tags) and run the script.
*   **RTL Support**: Arabic (`ar-SA`) is automatically handled with `dir="rtl"` in the layout.

## 🔍 Troubleshooting

*   **Missing Translations**: If a key is not translating, check if `data-i18n` is correctly formatted.
*   **API Errors**: If the API fails, the script will fallback to English. You can try running it again later.
