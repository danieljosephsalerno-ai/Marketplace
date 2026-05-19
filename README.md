# Wedding Officiant Portal

A marketplace for wedding ceremony scripts built with Next.js, Supabase, and Stripe.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danieljosephsalerno-ai/wedding-officiant-portal)

## Features

- Browse and purchase wedding ceremony scripts
- User authentication via Supabase
- Secure payments with Stripe
- Personal library of purchased scripts
- Favorites functionality

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase
- **Payments**: Stripe
- **Deployment**: Netlify

## Environment Variables

When deploying, set the following environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |

## Local Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

Click the "Deploy to Netlify" button above, or:

1. Push this repository to GitHub
2. Connect to Netlify via [app.netlify.com](https://app.netlify.com)
3. Import the GitHub repository
4. Set the environment variables
5. Deploy!

## License

MIT
