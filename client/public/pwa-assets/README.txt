PWA assets for DC Emergency.

Copy the 'public' folder contents into your client/public.
- manifest.webmanifest
- sw.js
- icons/...png

Then ensure index.html includes:
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#050508" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

And register the SW in client/src/main.jsx (example in chat).
