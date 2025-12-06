'use client';

import { useEffect } from 'react';

export default function AdminPage() {
    useEffect(() => {
        // Dynamically load the Netlify CMS script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js';
        script.async = true;
        document.body.appendChild(script);

        // Load Identity widget
        const identityScript = document.createElement('script');
        identityScript.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
        identityScript.async = true;
        document.body.appendChild(identityScript);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(identityScript);
        };
    }, []);

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            {/* CMS will mount here */}
            <link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
        </div>
    );
}
