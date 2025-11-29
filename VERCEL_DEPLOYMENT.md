# Vercel Deployment Guide

This guide will help you deploy the Gas Safety Booking application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A Supabase project for production
3. EmailJS account (if using email functionality)

## Step 1: Prepare Your Production Database

1. **Create a Production Supabase Project**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Create a new project (separate from your development project)
   - Note down your project URL and anon key

2. **Set up the Database Schema**:
   - In your production Supabase project, go to SQL Editor
   - Run the SQL from `supabase_schema.sql`
   - Verify tables are created correctly

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Import Project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Build Settings**:
   - Framework Preset: Vite (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Set Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   VITE_SUPABASE_URL=https://your-prod-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-prod-anon-key
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=your-strong-production-password
   VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
   VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
   VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
   ```
   
   **Important**: 
   - Set these for "Production", "Preview", and "Development" environments
   - Use different values for each environment if needed

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Set environment variables when prompted

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificates

## Step 4: Post-Deployment Checklist

- [ ] Test the production URL
- [ ] Verify admin login works
- [ ] Test booking form submission
- [ ] Test booking completion flow
- [ ] Verify email sending works (if configured)
- [ ] Check that all environment variables are set correctly
- [ ] Test on mobile devices
- [ ] Verify database connections are working

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `VITE_ADMIN_USERNAME` | Admin login username | Yes |
| `VITE_ADMIN_PASSWORD` | Admin login password | Yes |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | Optional |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Optional |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | Optional |

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working

1. Ensure variables are prefixed with `VITE_`
2. Redeploy after adding/changing variables
3. Check browser console for missing variable warnings

### Routing Issues (404 on refresh)

- The `vercel.json` file includes rewrites to handle React Router
- If issues persist, check that `vercel.json` is in the root directory

### Database Connection Issues

1. Verify Supabase URL and keys are correct
2. Check Supabase project is active
3. Verify RLS policies allow public access (if needed)
4. Check Supabase project region matches your Vercel region

## Updating Your Deployment

After making changes:

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Vercel will automatically deploy** (if connected to GitHub)
   - Or manually trigger: `vercel --prod`

## Rollback

If something goes wrong:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

## Support

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

