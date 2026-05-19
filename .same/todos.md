# Wedding Script Marketplace - TODO List

## Completed
- [x] Set up Next.js project with shadcn UI
- [x] Create marketplace UI with script cards
- [x] Implement cart functionality
- [x] Add Supabase integration for auth
- [x] Create login/signup pages
- [x] Set up environment variables
- [x] Fix Netlify deployment issues
- [x] Create server-side purchase and download API routes
- [x] Add Stripe secret key to environment variables
- [x] Create Stripe checkout API route (`/api/checkout`)
- [x] Create Stripe webhook handler (`/api/webhooks/stripe`)
- [x] Update CartSidebar to use real Stripe checkout
- [x] Add forgot password functionality
- [x] Add Profile page with user info and editing
- [x] Add Settings page with notification, language, and security settings
- [x] Fix UserProfile dropdown navigation (My Library, Profile, Settings now work)
- [x] Fix Netlify build error - removed duplicate npm install, added NODE_VERSION=20
- [x] Fix corrupted files in GitHub repo (package.json, tsconfig.json, UserProfile.tsx)
- [x] Add package-lock.json for Netlify npm compatibility
- [x] Fix lazy Stripe initialization to avoid build-time errors
- [x] Fix Supabase client defensive checks for static generation
- [x] Fix AuthContext infinite loop - added refs to prevent duplicate user loads
- [x] Add better error handling for missing profiles (406 error)
- [x] Add checkout success/cancelled handler and banner notifications
- [x] Clear cart after successful checkout

## In Progress
- [ ] Deploy updated code to Netlify and test checkout flow

## Pending
- [ ] Test Stripe checkout on live site after deployment succeeds
- [ ] Set up Stripe webhook secret in Netlify environment (optional)
- [ ] Create purchases table in Supabase (if not exists)
- [ ] Configure webhook URL in Stripe dashboard after deployment

## Notes
- Stripe test mode is enabled - use test card numbers like 4242 4242 4242 4242
- Webhook secret is optional for development but required for production
- Profile and Settings pages now accessible from user dropdown menu
- Netlify build command updated: removed "npm install &&" prefix, added NODE_VERSION=20
- Fixed corrupted files that had heredoc shell content appended
- Fixed React Error #185 (infinite loop) by adding refs to prevent duplicate user data loads
- Fixed 406 error on profiles by adding error handling and auto-profile creation
