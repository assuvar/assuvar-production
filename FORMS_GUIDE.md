# Netlify Forms Integration Guide

This project is set up to use Netlify Forms without a backend.

## 1. How it Works
Netlify automatically detects forms in your HTML at build time. When a user submits a form, Netlify captures the POST request and saves the data.

## 2. Using the Reusable Components (Recommended for Next.js)

We have created a set of React components in `components/forms/`.

### Example Usage:

```tsx
import { Form } from '@/components/forms/Form';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { Button } from '@/components/forms/Button';

export default function ContactPage() {
  return (
    <Form name="contact-us">
      <Input name="name" label="Full Name" required />
      <Input name="email" type="email" label="Email Address" required />
      <Textarea name="message" label="Your Message" required />
      <Button type="submit">Send Message</Button>
    </Form>
  );
}
```

**Key Features:**
*   **Automatic Submission**: The `<Form>` component handles the POST request to Netlify.
*   **Loading State**: The `<Form>` component passes an `isLoading` prop to children (if using render props) or handles it internally.
*   **Redirection**: Automatically redirects to `/success` on success or `/error` on failure.

## 3. Using Static HTML Forms (Legacy/Alternative)

If you prefer using plain HTML files (e.g., in `public/forms/`), you must include the `scripts/forms.js` file to handle the submission via AJAX, or let Netlify handle the redirect naturally.

```html
<form name="contact" netlify>
  <input name="email" />
  <button>Send</button>
</form>
<script src="/scripts/forms.js"></script>
```

## 4. Important: Form Detection

Netlify needs to "see" your forms at build time.
*   For **Static HTML**: It sees them automatically.
*   For **React/Next.js**: We have added a hidden detection form in `public/__netlify-forms.html`.
    *   **CRITICAL**: If you add a *new* form name in React (e.g., `<Form name="new-campaign" ...>`), you **MUST** also add a corresponding hidden input or form definition in `public/__netlify-forms.html` or ensure the form exists in the static HTML export.
    *   *Best Practice*: Just add a simple `<form name="new-campaign" netlify hidden><input name="email"></form>` to `public/__netlify-forms.html` whenever you create a new form name.

## 5. Email Notifications

1.  Log in to Netlify.
2.  Go to **Site Settings > Forms > Form Notifications**.
3.  Add your email address to receive alerts for new submissions.

## 6. Multi-language Support

The form components support `next-intl`. You can pass translated strings to the `label` and `placeholder` props.

```tsx
const t = useTranslations('Contact');
<Input label={t('nameLabel')} placeholder={t('namePlaceholder')} />
```
