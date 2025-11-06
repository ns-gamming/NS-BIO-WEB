# 🎮 NS GAMMING — Nishant Sarkar’s Portfolio & Gaming Universe

**Domain:** [nsgaming.xyz](https://nsgaming.xyz) • **Owner / Developer:** [Nishant Sarkar (Naboraj Sarkar)](mailto:nishant.ns.business@gmail.com)
Built with 💙 TypeScript | React | Vite | Tailwind | Supabase | Google Gemini AI

---

## 🧑‍💻 About Me

Hey there! 👋
I’m **Nishant Sarkar** aka **NS GAMMING**, a self-taught developer and content creator from Siliguri, India 🇮🇳.
I started coding because I wanted to *build things that feel alive* — games, tools, and AI-powered experiences that connect people.

💡 **Age:** Born 19 Aug 2010 | 💻 **Passion:** Coding & Gaming | 🎯 **Goal:** To run my own tech brand
🎥 **YouTube:** [@Nishant_sarkar](https://youtube.com/@Nishant_sarkar) | 📸 **Instagram:** [@nishant_sarkar__10k](https://instagram.com/nishant_sarkar__10k)
🕹️ **Favorite Game:** Free Fire | 🌈 **Theme Color:** Neon Blue
💬 **Fun Fact:** My AI assistant actually talks like a real friend 😄

---

## 🚀 Project Overview

**NS GAMMING** is not just a portfolio — it’s an ecosystem.
It’s a mix of developer portfolio + gaming hub + Free Fire tools + AI assistant + interactive community portal.
Everything was hand-coded from scratch using TypeScript and Supabase with hundreds of micro-animations, utilities, and games.

✨ **Highlights:**

* 🕹️ **14+ Playable Games** (TicTacToe, Snake, 2048, Flappy Bird, Memory, and more)
* 🤖 **AI Assistant:** Gemini-powered chatbot with personality and context awareness
* 🧠 **Supabase Integration:** Realtime storage, auth, and rate-limiting for FF Bots
* ⚙️ **FF Bots Hub:** Likes Bot, Info Bot, Spam Bot, Visit Bot — built for Free Fire players
* 🪄 **Tools & Utilities Hub:** QR generator, password maker, image converter, and more
* 💰 **AdSense Ready + GDPR Compliant** (monetization integrated across pages)
* 💬 **Dynamic UI:** Time-based greetings + custom chat messages in natural Hinglish
* ⚡ **Performance first:** Built with Vite & optimized for instant loads

---

## 🏗️ Architecture Snapshot

| Layer               | Tech / Purpose                                                               |
| :------------------ | :--------------------------------------------------------------------------- |
| **Frontend**        | React 18 + TypeScript + Vite • Tailwind CSS • Shadcn/UI • Framer Motion      |
| **Backend**         | Express (TypeScript) • Drizzle ORM • Supabase (Postgres + Realtime)          |
| **AI Engine**       | Google Gemini API (1.5-flash model) • Client-side + Serverless Proxy Support |
| **Auth & Data**     | Supabase Auth • Realtime Leaderboards • User Usage Logs                      |
| **Deployment**      | Vercel (Production) • Replit (Development & Preview)                         |
| **Analytics & Ads** | Google AdSense • Vercel Analytics • Custom Page Events                       |

---

## 💾 Supabase Core Usage

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Features using Supabase**

* ⚙️ FF Bots rate-limiting (1 use / IP / day)
* 🏆 Game scores & leaderboards (Realtime subscriptions)
* 🔐 Auth for admin and users
* 🗂️ Content editor data storage
* 🧩 Admin audit logs & content backup

---

## 🤖 AI Assistant (Gemini Integration)

**Model:** `gemini-1.5-flash`
**Mode:** 100 % Client-Side (no backend needed)
**API:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

```ts
async function chat(prompt: string) {
  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: { text: prompt } })
    }
  )
  return r.json()
}
```

🧩 **Highlights**

* Typing animation & error recovery
* Personalized Hinglish greetings (“Game badlo yaar!” vibes 😄)
* Gemini API key stored securely in environment variable
* Compatible with Vercel and Replit

---

## 🛠️ Setup & Environment

```bash
git clone https://github.com/ns-gamming/nsgaming.git
cd nsgaming
npm install
npm run dev
```

### `.env` Example

```env
VITE_GEMINI_API_KEY=your_google_gemini_key
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
VITE_ADSENSE_PUBID=ca-pub-4779140243670658
DATABASE_URL=postgres://user:pass@host:5432/dbname
JWT_SECRET=your_secret_key
```

🧠 Never commit `.env` to GitHub.
Use **Vercel Environment Variables** for deployment.

---

## 🎨 UI & Design System

* 🧱 **Layout:** Grid + Flex with sticky nav and QuickNav sidebar
* 🌗 **Theme:** Dark/Light toggle with CSS variables
* ✨ **Primary Color:** Neon Blue (hsl 193°, 100%, 50%)
* 💫 **Fonts:** Orbitron (Headings) • Inter (Body)
* 🌀 **Effects:** Particles, gradients, glow, hover rotations
* 🧩 **Components:** Radix UI primitives + custom Shadcn variants

---

## 📄 Pages & Sections

| Page                  | Function                                                |
| :-------------------- | :------------------------------------------------------ |
| **Home**              | Profile intro + FF Bots promo + featured projects       |
| **About**             | Biography + skills + coding journey                     |
| **Portfolio**         | Showcases projects & YouTube content                    |
| **FF Bots Hub**       | Likes Bot • Info Bot • Spam Bot • Visit Bot             |
| **Games**             | 14+ browser games with leaderboards                     |
| **Tools & Utilities** | QR Maker • Base64 Encoder • Password Generator          |
| **AI Chatbot**        | Floating Gemini Assistant with context                  |
| **Contact**           | Email form + WhatsApp chat link                         |
| **Legal Pages**       | Privacy Policy • Terms • Disclaimer (AdSense compliant) |

---

## 📊 Performance & Compliance

* ✅ Google AdSense ready (policy verified)
* ✅ Cookie consent banner (GDPR + EU rights compliant)
* ✅ Privacy Policy / Terms / Disclaimer included
* ✅ Analytics opt-out links (Google & NAI)
* ⚡ Optimized assets and lazy loading
* 🧱 SEO-optimized meta & Open Graph tags
* 🔐 Security headers enabled (Vercel config)

---

## 🧪 Testing & Quality

```bash
npm run lint
npm run test
npm run build
```

* ✅ ESLint + Prettier
* ✅ Vitest unit tests
* ✅ Manual QA on desktop + mobile
* ✅ Replit & Vercel preview tested

---

## 📦 Deployment Steps (Vercel)

1. Push your repo to GitHub
2. Connect to [Vercel Dashboard](https://vercel.com)
3. Add Environment Variables in **Settings > Environment Variables**
4. Deploy ✅

Vercel automatically builds with Vite and serves your SPA.
Custom domain: **nsgaming.xyz**

---

## 🧩 Project Stats

| Metric            | Count                               |
| :---------------- | :---------------------------------- |
| Total Pages       | 25+                                 |
| Total Games       | 14                                  |
| Total Bots        | 4                                   |
| Tools & Utilities | 8                                   |
| Animations        | 100 +                               |
| Lines of Code     | ~ 9,500 (TypeScript + CSS combined) |
| Deployment Time   | ~ 18 s (Vercel)                     |

---

## 📜 License & Usage Rights

```
Copyright © 2025 Nishant Sarkar (NS GAMMING)
All Rights Reserved.

This project is proprietary software.
Copying, redistributing, or reusing any part of this site
without written permission is strictly prohibited.

Violations will trigger takedowns and popular strikes.

For licenses or custom builds, contact:
📧 nishant.ns.business@gmail.com
```

---

## 🌐 Contact & Socials

| Platform             | Link                                                                     |
| :------------------- | :----------------------------------------------------------------------- |
| 💌 Email             | [nishant.ns.business@gmail.com](mailto:nishant.ns.business@gmail.com)    |
| 💬 WhatsApp          | [+91 8900653250](https://wa.me/918900653250)                             |
| 🎮 YouTube           | [@Nishant_sarkar](https://youtube.com/@Nishant_sarkar)                   |
| 📸 Instagram         | [@nishant_sarkar__10k](https://instagram.com/nishant_sarkar__10k)        |
| 💼 LinkedIn          | [linkedin.com/in/naboraj-sarkar](https://linkedin.com/in/naboraj-sarkar) |
| 🧠 GitHub            | [github.com/ns-gamming](https://github.com/ns-gamming)                   |
| 🗨️ Telegram Channel | [t.me/nsgamming69](https://t.me/nsgamming69)                             |

---

## 💬 Final Note

This is a living project — a fusion of creativity, tech, and gaming.
Every pixel and line of code was crafted with dedication by me, **Nishant Sarkar**.
If you like what you see, feel free to connect — I’m always happy to collaborate and build something crazy next 🚀💙

---

> 🪄 **Pro Tip:** Keep this README as your GitHub front page too — it’ll boost credibility and SEO ranking instantly.

---
