# Supabase Setup Guide

This guide will help you set up Supabase for the Wedding Script Marketplace application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase project URL and anon key (already in `.env.local`)

## Database Setup

### Step 1: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste the entire contents of `supabase-schema.sql` into the SQL editor
4. Click **Run** to execute the SQL script

This will create:
- `profiles` table - User profiles extending Supabase auth
- `scripts` table - Script catalog
- `purchases` table - User purchases
- `favorites` table - User favorites
- Row Level Security (RLS) policies for data protection
- Triggers for automatic profile creation on signup

### Step 2: Populate Scripts Data

After creating the tables, you'll need to add your script data to the `scripts` table.

You can do this via the Supabase dashboard:
1. Go to **Table Editor** → `scripts`
2. Click **Insert row** and add your scripts

Or run SQL to insert the demo scripts:

```sql
-- Insert demo scripts
INSERT INTO public.scripts (id, title, description, full_description, price, rating, reviews, category, type, language, author, tags, preview_content, is_popular) VALUES
(1, 'Classic Traditional Wedding Ceremony', 'A timeless script perfect for traditional Christian weddings with beautiful, meaningful vows.', 'This comprehensive wedding ceremony script has been carefully crafted to honor traditional Christian values while creating a warm, memorable experience for all attendees.', 29.99, 4.8, 127, 'Christian', 'Wedding', 'English', 'Rev. Sarah Johnson', ARRAY['Traditional', 'Christian', 'Formal'], 'Opening Words: Dearly beloved, we are gathered here today...', true),
(2, 'Ceremonia de Boda Católica Tradicional', 'Script tradicional en español para bodas católicas con lecturas bíblicas y bendiciones.', 'Este guión completo de ceremonia de boda católica incluye todas las lecturas, bendiciones y rituales tradicionales.', 34.99, 4.9, 89, 'Catholic', 'Wedding', 'Spanish', 'Padre Miguel Rodriguez', ARRAY['Católica', 'Tradicional', 'Español'], 'Palabras de Apertura: Queridos hermanos, nos hemos reunido aquí hoy...', true),
(3, 'Modern Secular Wedding Script', 'Contemporary non-religious ceremony script focusing on love, commitment, and personal vows.', 'A beautifully crafted non-religious ceremony script that celebrates love, partnership, and commitment.', 24.99, 4.7, 203, 'Secular', 'Wedding', 'English', 'Jennifer Park', ARRAY['Modern', 'Secular', 'Personal'], 'Welcome: Welcome, everyone. We are gathered here today...', true);
-- Add more scripts as needed
```

### Step 3: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates (optional):
   - Confirm signup
   - Reset password
   - Magic link

### Step 4: Configure Storage (Optional - For Script Files)

If you want to store actual PDF/DOCX files:

1. Go to **Storage** → **Create a new bucket**
2. Name it `scripts`
3. Set it to **Private** (only authenticated users can access)
4. Create a policy to allow downloads only for purchased scripts

Example storage policy:
```sql
CREATE POLICY "Users can download purchased scripts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scripts'
  AND auth.uid() IN (
    SELECT user_id FROM public.purchases
    WHERE script_id = (storage.foldername(name))::int
  )
);
```

## Authentication Flow

The app uses Supabase Auth with the following flow:

1. **Signup**: User creates an account with email/password
   - A profile is automatically created via database trigger
   - User metadata (name, user_type) is stored in the profile

2. **Login**: User logs in with email/password
   - Session is managed by Supabase
   - User data is loaded from the database

3. **Session Management**:
   - Middleware refreshes the session on each request
   - Client-side auth state is synced with Supabase

## API Routes

The app includes these server-side API routes:

- `POST /api/purchase` - Process purchases (stores in database)
- `GET /api/download/[id]` - Secure download (verifies purchase)
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites?scriptId=X` - Remove from favorites

## Testing the Setup

### Create a Test User

1. Use the signup form in the app, or
2. Go to **Authentication** → **Users** → **Add user**

### Test the Flow

1. Sign up/login
2. Add scripts to favorites
3. "Purchase" scripts (demo payment)
4. Download purchased scripts from the library

## Security Notes

✅ **Implemented:**
- Row Level Security (RLS) on all tables
- Server-side download verification
- Authentication-protected API routes
- Secure session management

⚠️ **For Production:**
- Integrate real payment processing (Stripe, PayPal)
- Store actual script files in Supabase Storage or S3
- Add rate limiting on API routes
- Set up proper email templates
- Configure custom domain for emails
- Add database backups

## Troubleshooting

### "User not found" errors
- Check that the `handle_new_user()` trigger is working
- Verify RLS policies are correctly set
- Check browser console for auth errors

### Downloads failing
- Ensure user is authenticated
- Verify the script exists in the database
- Check that the purchase record exists
- Check browser network tab for API errors

### Environment variables
- Ensure `.env.local` has correct Supabase URL and anon key
- Restart dev server after changing env vars

## Next Steps

1. Run the SQL schema in Supabase
2. Insert script data
3. Test signup/login flow
4. Test purchase and download flow
5. Deploy to Netlify (environment variables will be configured automatically)

For more information, see the [Supabase Documentation](https://supabase.com/docs).
