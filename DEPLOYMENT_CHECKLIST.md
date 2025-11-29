# Pre-Deployment Checklist

Use this checklist before deploying to Vercel production.

## Database Setup

- [ ] Create a separate Supabase project for production
- [ ] Run `supabase_schema.sql` in production database
- [ ] Test database connection with production credentials
- [ ] Verify RLS policies are configured correctly
- [ ] Set up database backups (Supabase dashboard)

## Environment Variables

- [ ] `VITE_SUPABASE_URL` - Production Supabase URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Production Supabase anon key
- [ ] `VITE_ADMIN_USERNAME` - Strong admin username
- [ ] `VITE_ADMIN_PASSWORD` - Strong production password (not default)
- [ ] `VITE_EMAILJS_SERVICE_ID` - Production EmailJS service ID
- [ ] `VITE_EMAILJS_TEMPLATE_ID` - Production EmailJS template ID
- [ ] `VITE_EMAILJS_PUBLIC_KEY` - Production EmailJS public key

## Code Review

- [ ] Remove any console.log statements (or use proper logging)
- [ ] Verify all hardcoded values are in environment variables
- [ ] Test all functionality in development
- [ ] Verify email template is correct
- [ ] Check that booking links use secure tokens (UUIDs)

## Vercel Configuration

- [ ] `vercel.json` is in root directory
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] All environment variables set in Vercel dashboard
- [ ] Custom domain configured (if applicable)

## Testing

- [ ] Test booking form submission
- [ ] Test admin login
- [ ] Test quote application
- [ ] Test email sending (if configured)
- [ ] Test booking completion flow
- [ ] Test on mobile devices
- [ ] Test all routes work correctly

## Security

- [ ] Strong admin password set
- [ ] No sensitive data in code
- [ ] `.env` files are in `.gitignore`
- [ ] Separate dev/prod databases
- [ ] RLS policies reviewed for production

## Post-Deployment

- [ ] Verify production URL works
- [ ] Test admin login on production
- [ ] Monitor error logs in Vercel
- [ ] Set up monitoring/alerts (optional)
- [ ] Document production URL and credentials securely

