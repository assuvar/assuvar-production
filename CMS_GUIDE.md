# Structura IT - CMS & Translation Guide

This system allows you to manage content via a graphical admin panel and automatically translate it into 18+ languages.

## 1. Accessing the Admin Panel

### Local Development
1.  Ensure the development server is running: `npm run dev`
2.  Ensure the proxy server is running: `npx netlify-cms-proxy-server`
3.  Go to: **[http://localhost:3000/admin](http://localhost:3000/admin)**
4.  Click **Login**. (No credentials needed in local mode).

### Production (Netlify)
1.  Go to `your-site.com/admin`.
2.  Log in with your Netlify Identity credentials.

## 2. Publishing Content

### Creating a Blog Post
1.  Click **Blog** in the left sidebar.
2.  Click **New Blog**.
3.  Fill in the fields:
    *   **Title**: The headline of the post.
    *   **Publish Date**: When it should appear.
    *   **Thumbnail**: Upload an image.
    *   **Summary**: Short description for the list page.
    *   **Body**: The full article content (Markdown supported).
4.  Click **Publish** -> **Publish now**.

### Creating a News Article
1.  Click **News** in the left sidebar.
2.  Click **New News**.
3.  Fill in the fields (Title, Date, Image, Body).
4.  Toggle **Highlight** if it's a major announcement.
5.  Click **Publish**.

## 3. Automatic Translation

After publishing new content, you need to generate translations for the other languages (Arabic, Chinese, German, etc.).

1.  Open your terminal.
2.  Run the translation script:
    ```bash
    npm run translate
    ```
3.  The script will:
    *   Scan your new Blog/News posts.
    *   Extract the Title, Summary, and Body.
    *   Translate them using the LibreTranslate API.
    *   Save the translations to `lang/xx-XX.json`.

## 4. Verifying on the Website

1.  Go to `http://localhost:3000/blog` or `http://localhost:3000/news`.
2.  You should see your new post in English.
3.  Use the **Language Switcher** in the navbar to switch to "Arabic" or "German".
4.  You should see the translated version of your post.

## 5. Troubleshooting

*   **"Failed to load config"**: Make sure `public/admin/config.yml` exists.
*   **Login button doesn't work**: Ensure `npx netlify-cms-proxy-server` is running in a separate terminal window.
*   **Translations missing**: Did you run `npm run translate` after publishing?
