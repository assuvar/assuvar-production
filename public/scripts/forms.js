// Global Form Handler for Netlify Forms
// Usage: Include this script to automatically handle form submissions with AJAX

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-netlify="true"], form[netlify]');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerText : '';

            // Loading State
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }

            const formData = new FormData(form);

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString(),
                });

                if (response.ok) {
                    window.location.href = '/success';
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form Error:', error);
                window.location.href = '/error';
            } finally {
                // Reset State (if not redirected)
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }
            }
        });
    });
});
