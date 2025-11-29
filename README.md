# Gas Safety Booking System

A web application for managing gas safety certificate bookings and renewals.

## Features

- Public booking form for certificate expiry registration
- Admin dashboard for managing leads and quotes
- Email notifications with booking links
- Secure booking completion flow
- Soft delete functionality for leads

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Supabase (Database)
- EmailJS (Email Service)
- React Router

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- EmailJS account (optional, for email functionality)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd gas-safety-booking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=your_password
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Set up the database**:
   - Create a Supabase project
   - Run the SQL from `supabase_schema.sql` in the SQL Editor

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to `http://localhost:5173`

## Deployment to Vercel

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables in Vercel
4. Deploy!

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.jsx
│   ├── BookingForm.jsx
│   ├── BookingCompletion.jsx
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   └── ProtectedRoute.jsx
├── lib/                # Utility libraries
│   ├── supabaseClient.js
│   ├── auth.js
│   └── emailService.js
└── App.jsx             # Main app component
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `VITE_ADMIN_USERNAME` - Admin login username
- `VITE_ADMIN_PASSWORD` - Admin login password
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID (optional)
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID (optional)
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key (optional)

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords in production
- Use separate Supabase projects for development and production
- Review Row Level Security (RLS) policies before production

## License

Private project
