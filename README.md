# Nawoda Lakshani — Portfolio

Personal portfolio site for Nawoda Lakshani (M.N. Lakshani Perera), a software engineering undergraduate at The Open University of Sri Lanka.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Contact email setup (Vercel)

The contact form sends messages through the Vercel serverless function at
`/api/send-email`. Delivery uses the Resend SDK. The sender address must be
verified with Resend; the visitor address is used only as the reply-to address.

Add these environment variables in Vercel (Project Settings → Environment
Variables) for each deployment environment:

```text
RESEND_API_KEY=re_...
CONTACT_RECEIVER_EMAIL=your-inbox@example.com
CONTACT_SENDER_EMAIL=Portfolio <verified-sender@yourdomain.com>
```

For local development, create a `.env.local` file with the same variables.
`.env.local` is ignored by Git. Run `npm run dev` for the Vite frontend; Vite
does not execute Vercel functions, so test `/api/send-email` through a Vercel
deployment or the Vercel CLI (`vercel dev`) with the environment variables
configured. Never put these secrets in `VITE_*` variables or frontend code.

Deploy the project by importing the repository in Vercel and setting the
environment variables above. Vercel detects the root `api/` function
automatically; the existing Vite build remains the frontend build. After
changing environment variables, redeploy the relevant environment.

The current backend targets Vercel. For a Netlify deployment, the endpoint
needs to be ported to a Netlify Function and configured with Netlify's
environment variables and function routing; this repository does not include
a second competing backend implementation.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Framer Motion
- Resend

## Content notes

Project copy is based on Nawoda’s CV, local Green Nest / Plant Atelier source, and public GitHub repositories under [Na-woda](https://github.com/Na-woda). LinkedIn could not be read without sign-in; the LinkedIn URL is included because it is listed on the CV and was provided for this site.
