import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { blogPosts, polls } from "../shared/schema";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const db = drizzle(pool);

const samplePosts = [
  {
    title: "Free Fire Pro Tips: Master BR Ranked Mode in 2025",
    slug: "free-fire-pro-tips-br-ranked-2025",
    excerpt: "Learn advanced strategies to climb the BR ranked ladder with expert tips on landing, looting, rotations, and endgame tactics that pro players use.",
    content: `Free Fire's Battle Royale ranked mode is one of the most competitive gaming experiences mobile gamers can have. After analyzing thousands of matches and interviewing top-tier Heroic players, we've compiled the ultimate guide to help you dominate BR ranked in 2025.

**1. Perfect Your Landing Strategy**

Your match begins the moment you board the plane. Top players always have 3-4 pre-planned landing spots based on the flight path. Hot drops like Clock Tower and Peak might give you early kills, but they're high-risk. For consistent ranked climbing, consider mid-tier loot zones like Mars Electric or Rim Nam Village where you can gear up safely while securing 2-3 kills.

**2. Loot Efficiency is Everything**

Don't waste time looting aimlessly. Follow this priority order:
- First 60 seconds: Get any AR/SMG and level 2 vest
- Next 2 minutes: Find your preferred weapon combo (AR + Sniper or AR + Shotgun)
- Remaining time: Upgrade to level 3 gear and stock consumables

Pro tip: Always carry 2 gloo walls and 2 medkits minimum. Many players lose fights because they run out of utility items.

**3. Zone Rotation Mastery**

The difference between Diamond and Heroic players often comes down to rotation timing. Start moving when the zone is at 60% closure, not when it's fully closed. Use vehicles wisely - they're great for early rotations but become death traps in final circles.

**4. Combat Fundamentals**

- **Pre-aim corners** when entering buildings
- **Use headglitch spots** on high ground
- **Strafe while shooting** to make yourself harder to hit
- **Don't peek the same angle twice** - reposition after each engagement

**5. Communication in Squad Mode**

If you're playing squad ranked, communication wins games:
- Call out enemy positions with clock directions (e.g., "One enemy, 2 o'clock, behind rock")
- Coordinate gloo wall placements during rushes
- Always announce your healing status

**6. Endgame Tactics**

Final circles require a completely different playstyle:
- Prioritize positioning over kills
- Keep multiple gloo walls ready
- Use grenades to force enemies out of cover
- Stay near zone edge to avoid getting sandwiched

**7. Sensitivity Settings for 2025**

After OB40 update, many pros adjusted their sensitivity. Try these settings:
- General: 60-70
- Red Dot: 50-60  
- 2x Scope: 45-55
- 4x Scope: 40-50

**8. Weapon Meta in Current Season**

Top tier weapons:
- **MP40**: Best close-range weapon, insane fire rate
- **AK47**: Still king at mid-range with headshot potential
- **M1887**: One-shot potential makes it deadly in final circles
- **AWM**: When you can land headshots, nothing beats it

**9. Character Combinations**

Best solo push combo: Alok + K + DJ Alok (pet)
Best support combo: Kelly + Jai + Ottero (pet)
Best tank combo: DJ Alok + Skyler + Mr. Waggor (pet)

**10. Mental Game and Consistency**

- Don't tilt after bad games - take 5 minute breaks
- Focus on placement points, not just kills
- Review your deaths to identify patterns
- Play 5-8 games daily for muscle memory

**Bonus: Common Mistakes to Avoid**
- Fighting in open areas without cover
- Looting death boxes in dangerous situations  
- Using all gloo walls in one engagement
- Staying in buildings too long
- Not checking minimap every 5 seconds

Follow these strategies consistently, and you'll see significant rank improvement within 2-3 weeks. Remember, every Heroic player started at Bronze - it's about learning from mistakes and staying disciplined.

What's your biggest BR ranked challenge? Let us know in the comments!`,
    category: "Free Fire",
    tags: ["free fire", "gaming tips", "battle royale", "ranked mode", "pro strategies"],
    readTime: 8,
    published: true,
  },
  {
    title: "YouTube Growth Hacks 2025: How I Got 10K Subscribers in 3 Months",
    slug: "youtube-growth-hacks-10k-subscribers",
    excerpt: "Proven strategies that helped me grow from 0 to 10,000 YouTube subscribers in just 90 days. No clickbait, just real tactics that work.",
    content: `Growing a YouTube channel in 2025 might seem impossible with increased competition, but I managed to reach 10,000 subscribers in just 3 months using these proven strategies. Here's exactly what worked for me.

**The Foundation: Niche Selection**

I started with gaming content focused on Free Fire, but the key was going ULTRA-specific. Instead of "Free Fire tips," I focused on "Free Fire sensitivity settings for low-end devices." This hyper-targeted approach meant less competition and more engaged viewers who desperately needed this specific content.

**Content Strategy That Actually Works**

1. **The 3-Video Rule**: For every topic, I created 3 videos:
   - Beginner guide
   - Advanced techniques
   - Common mistakes
   
This keeps viewers on my channel longer and YouTube's algorithm loves it.

2. **Thumbnail Psychology**: I A/B tested every thumbnail and found that:
   - Faces with exaggerated expressions get 40% more clicks
   - Text should be 6 words maximum
   - High contrast colors (cyan + orange) perform best
   - Include the number "2025" for recency

3. **Title Formula**: [Number] + [Adjective] + [Keyword] + [Year]
   Example: "7 INSANE Free Fire Tricks Pros Use in 2025"

**Upload Schedule That Boosts Algorithm**

Don't just upload randomly. I discovered YouTube heavily favors consistent uploaders:
- Monday, Wednesday, Friday at 6 PM IST (prime time for my audience)
- 8-12 minute videos (sweet spot for ad revenue and watch time)
- Never miss a scheduled upload - algorithm punishes inconsistency

**The Secret Weapon: Community Tab**

Most small creators ignore this, but posting in Community tab 2x daily:
- Polls about next video topics
- Behind-the-scenes content
- Quick tips
- Memes related to your niche

This kept my channel active even on non-upload days.

**SEO Optimization (This Alone Got Me 3K Subs)**

I used:
- VidIQ for keyword research
- TubeBuddy for tag optimization
- At least 5 longtail keywords in description
- Timestamp chapters (YouTube loves these)
- 3-5 hashtags (#freefire #gaming #tips)

**Engagement Hacks**

1. **Pin a comment** asking viewers to answer a question
2. **Respond to every comment** in first 24 hours
3. **Create community** by featuring viewer suggestions
4. **End screens** directing to 2 other videos + subscribe button

**Collaboration Strategy**

I reached out to channels with 5-20K subs (not too big, not too small):
- Offered value first (promoted their videos)
- Suggested collaboration ideas that benefit both
- Did 4 collaborations in month 2 - each brought 500+ new subs

**Thumbnail + Title A/B Testing**

After 48 hours, I'd check analytics. If CTR < 6%, I'd change thumbnail. If AVD < 50%, I'd trim intro. This constant optimization doubled my growth rate.

**The Content Mix (Weekly Breakdown)**

- Monday: Trending topic (capitalize on current events)
- Wednesday: Evergreen content (always relevant)
- Friday: Entertainment/fun content (highest engagement day)

**Promotion Strategy**

Where I shared every video:
- Discord servers (gaming communities)
- Facebook gaming groups
- Reddit (r/freefire, r/gaming - carefully, no spam)
- Instagram Reels (30-second clips from videos)
- Telegram channels

**Analytics That Matter**

I obsessed over:
- Click-through rate (target: 8%+)
- Average view duration (target: 55%+)
- Subscriber conversion (target: 4%+)

Ignored vanity metrics like total views - focus on percentages.

**Monetization Milestones**

- 1K subs + 4K watch hours: Applied for monetization
- 3K subs: Started getting sponsorship offers
- 5K subs: Launched membership program
- 10K subs: Multiple revenue streams active

**Common Mistakes I Made (So You Don't Have To)**

1. Copying big creators (doesn't work for small channels)
2. Focusing on production quality over content value
3. Not responding to comments quickly
4. Posting at random times
5. Ignoring YouTube Shorts (huge mistake early on)

**The Shorts Strategy (Added 2K Subs)**

From month 2, I:
- Posted 1 Short daily
- Repurposed best moments from long videos
- Added captions (80% watch without sound)
- Hooked viewers in first 1 second

**Key Takeaways**

- Consistency beats perfection
- Niche down until it hurts, then niche down more
- Engage with your community religiously
- Study analytics weekly and adjust strategy
- Patience + smart work = inevitable growth

**Your Turn**

What's stopping you from reaching 10K? The strategies are here - now it's about execution. Start today, stay consistent, and I'll see you at 10K!

Drop your channel name below - I'll check it out and give personalized feedback!`,
    category: "YouTube",
    tags: ["youtube", "content creation", "social media growth", "monetization", "youtube algorithm"],
    readTime: 10,
    published: true,
  },
  {
    title: "Web Development in 2025: Complete Roadmap for Beginners",
    slug: "web-development-roadmap-2025-beginners",
    excerpt: "Everything you need to know to become a professional web developer in 2025. Step-by-step guide with resources, timelines, and career advice.",
    content: `Web development continues to be one of the most in-demand tech skills in 2025. This comprehensive roadmap will take you from complete beginner to job-ready developer.

**Phase 1: Foundation (Month 1-2)**

Start with the holy trinity of web development:

**HTML (2 weeks)**
- Semantic HTML5 elements
- Forms and validations
- Accessibility basics (ARIA labels)
- SEO-friendly structure

**CSS (3 weeks)**
- Box model and layouts
- Flexbox and Grid (MUST KNOW)
- Responsive design (mobile-first)
- CSS animations and transitions
- Tailwind CSS (industry standard now)

**JavaScript (3 weeks)**  
- Variables, data types, operators
- Functions and arrow functions
- DOM manipulation
- Events and event listeners
- ES6+ features (spread, destructuring, etc.)
- Async/await and Promises

**Projects to Build**:
- Personal portfolio website
- Todo list with local storage
- Weather app using API
- Calculator with advanced operations

**Phase 2: Front-End Framework (Month 3-4)**

In 2025, React still dominates, but choose based on job market:

**React (Recommended)**
- Components and Props
- State and useState hook
- useEffect and lifecycle
- React Router for navigation
- Context API for state management
- React Query for data fetching

**Alternative Options**:
- Vue.js (easier learning curve)
- Next.js (React framework - full-stack ready)
- Svelte (gaining popularity)

**Projects**:
- Social media dashboard
- E-commerce product page
- Real-time chat application
- Blog with CMS integration

**Phase 3: Back-End Basics (Month 5-6)**

**Node.js + Express**
- Server setup and routing
- RESTful API design
- Authentication (JWT)
- Database integration
- Error handling
- Security best practices

**Database (Choose One)**
- PostgreSQL (relational - recommended for beginners)
- MongoDB (NoSQL - good for rapid prototyping)
- Supabase (backend-as-a-service)

**Projects**:
- User authentication system
- CRUD API for blog
- File upload service
- Real-time notification system

**Phase 4: Advanced Concepts (Month 7-8)**

**TypeScript**
- Type safety basics
- Interfaces and types
- Generic types
- TypeScript with React

**State Management**
- Redux Toolkit (for complex apps)
- Zustand (lightweight alternative)
- React Context (for simpler state)

**Testing**
- Unit testing with Vitest
- Component testing with React Testing Library
- E2E testing with Playwright

**Phase 5: DevOps & Deployment (Month 9)**

**Version Control**
- Git fundamentals
- GitHub workflows
- Pull requests and code review

**Deployment**
- Vercel (easiest for Next.js)
- Netlify (great for static sites)
- Railway (good for full-stack)
- Docker basics (advanced)

**CI/CD**
- GitHub Actions
- Automated testing
- Deployment pipelines

**Phase 6: Polish & Portfolio (Month 10-12)**

**Build 3-5 Production-Ready Projects**:

1. **Full-Stack E-commerce**
   - Payment integration (Stripe)
   - Admin dashboard
   - Order management
   - Email notifications

2. **SaaS Application**
   - User authentication
   - Subscription billing
   - Data visualization
   - Team collaboration features

3. **Social Platform**
   - User profiles
   - Real-time features (WebSocket)
   - Image uploads
   - Notification system

4. **API-Heavy Project**
   - Third-party integrations
   - Data aggregation
   - Caching strategies
   - Rate limiting

**Essential Skills for 2025**

**Must-Know Tools**:
- VS Code + essential extensions
- Chrome DevTools
- Postman/Insomnia for API testing
- Figma basics (for design implementation)

**Soft Skills**:
- Problem-solving approach
- Reading documentation
- Debugging techniques
- Code review etiquette
- Communication skills

**Career Paths**

**Junior Developer (0-2 years)**
- Salary: ₹3-6 LPA
- Focus: Writing clean code, learning from seniors
- Projects: Bug fixes, small features

**Mid-Level Developer (2-5 years)**
- Salary: ₹8-15 LPA
- Focus: Architecture decisions, mentoring juniors
- Projects: Complete features, system design

**Senior Developer (5+ years)**
- Salary: ₹20-40 LPA
- Focus: Technical leadership, strategy
- Projects: System architecture, team leadership

**Job Search Strategy**

**Portfolio Must-Haves**:
- Live projects with source code
- Case studies explaining your process
- Blog posts about what you learned
- Active GitHub profile

**Where to Apply**:
- LinkedIn (update profile with keywords)
- AngelList (for startups)
- Naukri.com (Indian market)
- YC Companies (ambitious founders)

**Interview Preparation**:
- LeetCode (2-3 problems daily)
- System design basics
- Behavioral questions
- Portfolio project deep-dives

**Resources**

**Free Learning**:
- freeCodeCamp (complete curriculum)
- MDN Web Docs (reference)
- JavaScript.info (JS deep-dive)
- Web.dev (Google's guide)

**Paid (Worth It)**:
- Frontend Masters (in-depth courses)
- Udemy (project-based learning)
- Scrimba (interactive learning)

**Common Mistakes to Avoid**

1. Tutorial hell - build projects while learning
2. Trying to learn everything - focus on fundamentals
3. Neglecting soft skills - communication is key
4. Not building a portfolio - projects prove skills
5. Giving up too early - persistence wins

**Daily Routine for Success**

Morning (2 hours):
- Learn new concept through video/article
- Take notes and understand deeply

Afternoon (3 hours):
- Code the concept into a project
- Debug and problem-solve

Evening (1 hour):
- LeetCode/DSA practice
- Review what you learned

Weekend:
- Build portfolio projects
- Contribute to open source
- Write blog posts

**Final Tips**

- **Start now**: Perfect time never comes
- **Build in public**: Share your journey
- **Network**: Join dev communities
- **Stay updated**: Follow tech Twitter
- **Be patient**: Skills take time

Remember: Every expert was once a beginner. The difference is they didn't quit.

**Your Move**

Pick one technology from Phase 1 and start TODAY. Not tomorrow. TODAY.

What's your biggest web development question? Drop it below!`,
    category: "Coding",
    tags: ["web development", "programming", "react", "javascript", "career guide"],
    readTime: 12,
    published: true,
  }
];

const samplePolls = [
  {
    question: "What's your favorite Free Fire game mode?",
    options: ["Battle Royale", "Clash Squad", "Lone Wolf", "Craftland"],
    votes: ["45", "32", "18", "23"],
    active: true,
  },
  {
    question: "Which web framework should I learn next?",
    options: ["React", "Vue.js", "Angular", "Svelte"],
    votes: ["78", "34", "12", "25"],
    active: true,
  }
];

async function seed() {
  console.log("Seeding database with blog posts...");
  
  for (const post of samplePosts) {
    await db.insert(blogPosts).values(post);
    console.log(`✓ Created post: ${post.title}`);
  }

  console.log("\nSeeding database with polls...");
  
  for (const poll of samplePolls) {
    await db.insert(polls).values(poll);
    console.log(`✓ Created poll: ${poll.question}`);
  }

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
