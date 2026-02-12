# Setup Guide - Kinchana's Bakery Review Form

Complete setup instructions for deploying your luxury review form.

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase Database

#### Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

#### Create the Database Table
1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL:

```sql
-- Create reviews table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) DEFAULT 'Anonymous',
  phone VARCHAR(20) DEFAULT '',
  item VARCHAR(50) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  would_order_again VARCHAR(50) NOT NULL,
  favorite VARCHAR(500),
  improvements VARCHAR(500),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert
CREATE POLICY "Enable insert for service role" ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow service role to read
CREATE POLICY "Enable read for service role" ON reviews
  FOR SELECT
  USING (true);
```

### Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **service_role key** (NOT anon key!)
3. Create `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

⚠️ **IMPORTANT**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your form!

---

## 🌐 Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/your-username/your-repo.git
     git push -u origin main
     ```

2. **Import to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - **No need to set a root directory** - deploy from the repository root

3. **Add Environment Variables**
   - In the Vercel project settings, add:
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
     - `SUPABASE_SERVICE_KEY` = Your Supabase service role key

4. **Deploy!**
   - Click **Deploy**
   - Your form will be live in ~2 minutes

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts, then add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY

# Deploy to production
vercel --prod
```

---

## 📊 View Submitted Reviews

### Via Supabase Dashboard
1. Go to **Table Editor** in Supabase
2. Select `reviews` table
3. View all submissions in real-time

### Export as CSV
1. Go to **Table Editor**
2. Select `reviews` table
3. Click **Export** button
4. Choose CSV format

---

## 🔒 Security Checklist

Before going live, ensure:

- ✅ `.env.local` is in `.gitignore` (already included)
- ✅ Using `SUPABASE_SERVICE_KEY` (not anon key) for server-side operations
- ✅ Supabase Row Level Security (RLS) is enabled
- ✅ Environment variables set in Vercel
- ✅ HTTPS enabled (automatic with Vercel)

---

## 🆘 Troubleshooting

### "Failed to submit review"
- Check environment variables in Vercel dashboard
- Verify Supabase URL and service key are correct
- Check Supabase SQL editor - ensure table was created
- Check browser console for specific errors

### Build fails on Vercel
- Ensure all dependencies are in `package.json`
- Check build logs for specific TypeScript errors
- Verify environment variables are set

### Form not displaying correctly
- Clear browser cache
- Check browser console for errors
- Verify all fonts are loading (check Network tab)

### Phone validation not working
- Ensure phone input accepts only 10 digits
- Check that "+91-" prefix is displayed correctly
- Verify regex validation in `app/api/submit/route.ts`

---

## 🎨 Customization Tips

### Change Bakery Name
Update `"Kinchana's"` in `app/page.tsx` (appears in 3 places):
- Intro screen header (line ~189)
- Form screen header (line ~363)
- Thank you screen (if applicable)

### Change Tagline
Update `"Baked with Love"` in `app/page.tsx` (appears in 2 places)

### Change Item Options
Edit the `items` array in `app/page.tsx` (line ~170):
```tsx
const items = ['Cakes', 'Brownies', 'Cheesecakes', 'Cookies'];
```

### Change Color Theme
Edit `tailwind.config.ts`:
```ts
colors: {
  crimson: '#8B0000',  // Change to your brand color
  // ...
}
```

---

## 💡 Optional Enhancements

### Add Email Notifications
Use Supabase Database Webhooks to trigger notifications when reviews are submitted.

### Add Analytics
Integrate Vercel Analytics or Google Analytics to track form submissions.

### Add Admin Dashboard
Create a protected `/admin` route to view reviews with authentication.


---

## 📝 Post-Deployment Checklist

- [ ] Form loads correctly at your Vercel URL
- [ ] Submit a test review (anonymous and identified)
- [ ] Verify review appears in Supabase dashboard
- [ ] Test on mobile device
- [ ] Test all validation (phone number, rating, etc.)
- [ ] Share form link with test users
- [ ] Monitor Supabase usage (free tier: 500MB database, 2GB bandwidth)

---

## 🎉 You're All Set!

Your luxury review form is now live and ready to collect valuable feedback from your customers.

**Share your form URL:**
- Add to Instagram bio
- Include in order confirmation emails
- Print QR code on receipts
- Share via WhatsApp/SMS

---

## 🙏 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

Enjoy collecting thoughtful feedback! 🎨✨
