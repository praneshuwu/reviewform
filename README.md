# Kinchana's Bakery - Customer Review Form

A beautifully crafted, luxury-themed customer feedback form built with Next.js 14, designed to collect meaningful reviews with elegance and intention.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

---

## ✨ Features

### User Experience
- **Anonymous or Identified** - Users choose whether to share their identity before starting
- **Luxury Aesthetic** - Refined, elegant design with smooth Framer Motion animations
- **Mobile-First** - Fully responsive with optimized touch interactions
- **Real-time Validation** - Instant feedback with visual indicators (✓/✕)
- **Progress Tracking** - Subtle progress bar guides users to completion
- **Indian Phone Support** - Fixed +91 prefix with smart 10-digit validation

### Data Collection
- ⭐ **Star Ratings** - Interactive 5-star rating with celebration animation
- 📦 **Product Selection** - Cakes, Brownies, Cheesecakes, Cookies
- 🔄 **Repeat Purchase Intent** - Would order again? (Yes/Maybe/No)
- 💭 **Open Feedback** - What resonated? How to improve? Additional thoughts
- 📱 **Optional Contact** - Name and phone number (both optional for identified users)

### Technical Excellence
- **Full-Stack Ready** - Next.js 14 App Router with API routes
- **Type-Safe** - TypeScript with Zod validation
- **Secure** - Server-side validation, RLS enabled, environment variables
- **Fast** - Optimized fonts, minimal bundle size, edge-ready
- **Production-Ready** - One-click Vercel deployment

---

## 🎨 Design Philosophy

**"Every word you share shapes our craft with intention"**

This form embodies:
- **Minimal Luxury** - Refined elegance inspired by high-end experiences
- **Warmth & Trust** - Personal prompts that invite genuine feedback
- **Attention to Detail** - Typography, spacing, animations—every pixel intentional
- **Respect for Privacy** - Anonymous option, clear data policies, optional contact info

### Color Palette
- **Crimson** (`#8B0000`) - Accent color for focus states and highlights
- **Charcoal** (`#2C2C2C`) - Primary text color
- **Pearl** (`#FEFEFE`) - Background and surfaces
- **Rose Tints** - Subtle gradients for depth

### Typography
- **Cormorant Garamond** - Elegant serif for headings and key text
- **Raleway** - Clean sans-serif for labels and UI elements

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works great)
- Vercel account for deployment (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reviewform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   ```

4. **Set up database**

   Run the SQL schema in your Supabase dashboard (see [SETUP.md](./SETUP.md))

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
reviewform/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # API endpoint for form submission
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Main form component
├── public/                       # Static assets
├── .env.local.example            # Environment variables template
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── SETUP.md                      # Detailed setup guide
└── README.md                     # This file
```

---

## 🗄️ Database Schema

```sql
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
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Supabase** | PostgreSQL database + auth |
| **Zod** | Schema validation |
| **Vercel** | Hosting and deployment |

---

## 🎯 Form Flow

```
1. Intro Screen
   └── Choose: Anonymous or Share Identity

2. Form Screen
   ├── [If Identified] Name (required) + Phone (optional)
   ├── Product Selection (required)
   ├── Star Rating (required)
   ├── Would Order Again? (required)
   ├── What Resonated? (optional)
   ├── How to Improve? (optional)
   └── Additional Thoughts (optional)

3. Thank You Screen
   └── Gracious acknowledgment + floating particles
```

---

## 📊 Features Breakdown

### Phone Number Validation
- Fixed **+91-** prefix (non-editable)
- Accepts exactly **10 digits**
- Must start with **6-9** (valid Indian mobile range)
- Real-time validation with visual feedback
- **Optional** - users can skip entirely

### Rating System
- Interactive star icons with hover effects
- Keyboard navigation (arrow keys)
- Contextual feedback messages based on rating
- **Special celebration** for 5-star ratings ✨

### Progress Tracking
- Sticky top bar shows completion percentage
- Counts all fields (required + optional)
- Smooth animation on progress updates
- Provides gentle nudge to complete everything

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

---

## 🔒 Security

- ✅ Server-side validation with Zod
- ✅ Environment variables for sensitive data
- ✅ Supabase Row Level Security (RLS) enabled
- ✅ Input sanitization
- ✅ HTTPS by default (Vercel)
- ✅ No client-side storage of sensitive data

---

## 🎨 Customization

### Change Business Name
Update `"Kinchana's"` in `app/page.tsx`

### Change Tagline
Update `"Baked with Love"` in `app/page.tsx`

### Change Product Options
Edit the `items` array:
```tsx
const items = ['Cakes', 'Brownies', 'Cheesecakes', 'Cookies'];
```

### Change Brand Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  crimson: '#8B0000',    // Your primary color
  charcoal: '#2C2C2C',   // Text color
  pearl: '#FEFEFE',      // Background
  // ...
}
```

---

## 📈 Analytics & Monitoring

### View Submissions
- **Supabase Dashboard** - Real-time table view
- **CSV Export** - Built-in Supabase export feature
- **Custom Admin** - Build your own dashboard (see SETUP.md)

### Track Form Performance
- Vercel Analytics (optional)
- Google Analytics integration (optional)
- Monitor submission rate, completion rate, average rating

---

## 🤝 Contributing

This is a custom project for Kinchana's Bakery. Feel free to fork and adapt for your own use!

---

## 📄 License

MIT License - feel free to use this as a starting point for your own projects.

---

## 🙏 Acknowledgments

Built with care for collecting meaningful customer feedback. Every review shapes the craft with intention.

**Tech Stack Credits:**
- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vercel](https://vercel.com/) - Deployment platform

---


**Made with ❤️ for Kinchana's Bakery**
