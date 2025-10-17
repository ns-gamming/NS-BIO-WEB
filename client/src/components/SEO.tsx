import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

const DEFAULT_SEO = {
  siteName: 'NS GAMMING',
  defaultTitle: 'NS GAMMING - Nishant Sarkar | Gaming, Coding & Content Creation',
  defaultDescription: 'Official website of NS GAMMING by Nishant Sarkar (Naboraj Sarkar). Free Fire tools, coding tutorials, gaming guides, and tech content. Best Free Fire sensitivity settings, name generators, and more!',
  defaultKeywords: 'NS GAMMING, Nishant Sarkar, Naboraj Sarkar, Nishant, Naboraj, NS, NS TEAM, NS GROUP, Free Fire tools, Free Fire sensitivity, Free Fire name generator, gaming tutorials, coding tutorials, web development, tech blog, content creator, Siliguri, West Bengal, India, YouTube NS GAMMING, Free Fire likes bot, Free Fire UID generator, gaming tips, programming tutorials, JavaScript tutorials, React tutorials, Python tutorials',
  defaultImage: 'https://nsgamming.xyz/og-image.png',
  siteUrl: 'https://nsgamming.xyz',
  twitterHandle: '@NSGAMMING699',
  author: 'Nishant Sarkar (Naboraj Sarkar)',
};

export function SEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    const fullTitle = title 
      ? `${title} | ${DEFAULT_SEO.siteName}` 
      : DEFAULT_SEO.defaultTitle;

    const metaDescription = description || DEFAULT_SEO.defaultDescription;
    const metaKeywords = keywords || DEFAULT_SEO.defaultKeywords;
    const metaImage = image || DEFAULT_SEO.defaultImage;
    const metaAuthor = author || DEFAULT_SEO.author;
    const url = canonicalUrl || `${DEFAULT_SEO.siteUrl}${location}`;

    // Update document title
    document.title = fullTitle;

    // Helper function to set or create meta tags
    const setMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    setMetaTag('description', metaDescription);
    setMetaTag('keywords', metaKeywords);
    setMetaTag('author', metaAuthor);
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('googlebot', 'index, follow');
    setMetaTag('language', 'English');
    setMetaTag('revisit-after', '7 days');
    setMetaTag('rating', 'General');
    setMetaTag('distribution', 'global');

    // Open Graph tags for Facebook, LinkedIn, etc.
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', metaDescription, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:image', metaImage, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:site_name', DEFAULT_SEO.siteName, true);
    setMetaTag('og:locale', 'en_US', true);

    // Article specific tags
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime, true);
      }
      setMetaTag('article:author', metaAuthor, true);
      setMetaTag('article:publisher', DEFAULT_SEO.siteUrl, true);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:site', DEFAULT_SEO.twitterHandle);
    setMetaTag('twitter:creator', DEFAULT_SEO.twitterHandle);
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', metaImage);
    setMetaTag('twitter:image:alt', fullTitle);

    // Mobile & App tags
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    setMetaTag('theme-color', '#06b6d4');
    setMetaTag('mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    setMetaTag('apple-mobile-web-app-title', DEFAULT_SEO.siteName);

    // Google Site Verification (you'll need to add your actual verification code)
    // setMetaTag('google-site-verification', 'YOUR_GOOGLE_VERIFICATION_CODE');

    // Microsoft/Bing verification
    // setMetaTag('msvalidate.01', 'YOUR_BING_VERIFICATION_CODE');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Structured Data (JSON-LD) for better SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : type === 'profile' ? 'Person' : 'WebSite',
      ...(type === 'website' && {
        name: DEFAULT_SEO.siteName,
        url: DEFAULT_SEO.siteUrl,
        description: metaDescription,
        publisher: {
          '@type': 'Person',
          name: 'Nishant Sarkar',
          alternateName: 'Naboraj Sarkar',
          jobTitle: 'Content Creator, Developer, Gamer',
          url: DEFAULT_SEO.siteUrl,
          sameAs: [
            'https://youtube.com/@Nishant_sarkar',
            'https://instagram.com/nishant_sarkar__10k',
            'https://twitter.com/NSGAMMING699',
            'https://linkedin.com/in/naboraj-sarkar',
            'https://github.com/ns-gamming69',
          ],
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${DEFAULT_SEO.siteUrl}/blog?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }),
      ...(type === 'article' && {
        headline: title,
        description: metaDescription,
        image: metaImage,
        author: {
          '@type': 'Person',
          name: metaAuthor,
        },
        publisher: {
          '@type': 'Organization',
          name: DEFAULT_SEO.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${DEFAULT_SEO.siteUrl}/logo.png`,
          },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
      }),
      ...(type === 'profile' && {
        name: 'Nishant Sarkar',
        alternateName: 'Naboraj Sarkar',
        description: metaDescription,
        image: metaImage,
        url: url,
        sameAs: [
          'https://youtube.com/@Nishant_sarkar',
          'https://instagram.com/nishant_sarkar__10k',
          'https://twitter.com/NSGAMMING699',
          'https://linkedin.com/in/naboraj-sarkar',
          'https://github.com/ns-gamming69',
        ],
        jobTitle: 'Content Creator, Developer, Gamer',
        worksFor: {
          '@type': 'Organization',
          name: 'NS GAMMING',
        },
        alumniOf: 'Your School/College Name', // Update with actual info
        birthDate: '2008-08-19', // Approximate based on age 16+
        gender: 'Male',
        nationality: 'Indian',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Siliguri',
          addressRegion: 'West Bengal',
          addressCountry: 'India',
        },
      }),
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, image, type, author, publishedTime, modifiedTime, canonicalUrl, location]);

  return null;
}

// Pre-defined SEO configurations for common pages
export const SEO_CONFIG = {
  home: {
    title: 'NS GAMMING - Nishant Sarkar (Naboraj) | Free Fire Tools, Gaming & Web Development',
    description: 'Welcome to NS GAMMING by Nishant Sarkar (Naboraj Sarkar)! Your ultimate destination for Free Fire tools, advanced sensitivity calculator, stylish name generator, coding tutorials, gaming guides, and tech content. Join the NS GAMMING Family today and level up your gaming and coding skills!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Free Fire tools, Free Fire sensitivity calculator, Free Fire name generator, gaming channel, coding tutorials, web development, tech blog, content creator Siliguri, West Bengal gaming, Free Fire tips India, FF sensitivity max 200, DPI calculator, gaming tools 2025',
    type: 'website' as const,
  },
  about: {
    title: 'About Nishant Sarkar (Naboraj Sarkar) - Creator of NS GAMMING Family',
    description: 'Meet Nishant Sarkar, also known as Naboraj Sarkar - the visionary creator behind NS GAMMING. A 16+ year old passionate gamer, full-stack web developer, and content creator from Siliguri, West Bengal, India. Discover his inspiring journey from coding enthusiast to successful entrepreneur building his digital empire. Learn about his mission to create impactful products, share knowledge, and build a thriving community.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Nishant Sarkar biography, Naboraj Sarkar about, NS GAMMING creator, young developer India, gaming content creator, full-stack developer Siliguri, West Bengal gamer, Free Fire player, coding enthusiast, tech entrepreneur, student developer, youth programmer India',
    type: 'profile' as const,
  },
  blog: {
    title: 'Gaming & Tech Blog - Expert Guides by NS GAMMING',
    description: 'Explore in-depth gaming tips, Free Fire pro strategies, coding tutorials, web development guides, and technology articles by Nishant Sarkar. Get the latest gaming strategies, programming best practices, tech trends 2025, and expert advice from the NS GAMMING community. Your go-to resource for gaming and coding knowledge.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, gaming blog, tech blog, Free Fire guides, Free Fire tips 2025, Free Fire sensitivity guide, coding tutorials, JavaScript tutorials, Python tutorials, React tutorials, web development blog, game strategies, programming guides, technology trends 2025, developer blog India',
    type: 'website' as const,
  },
  tools: {
    title: 'Free Fire Tools & Utilities - Advanced Gaming Tools by NS GAMMING',
    description: 'Discover powerful Free Fire tools by NS GAMMING! Advanced sensitivity calculator with max 200 settings and DPI support, stylish name generator with fancy fonts, UID generator, secure password generator, QR code creator, image compressor, and more. All tools are 100% free, mobile-optimized, and designed for gamers by gamers. Boost your FF gameplay today!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Free Fire tools, FF sensitivity calculator, Free Fire sensitivity generator max 200, Free Fire name generator fancy fonts, FF stylish names, FF UID generator, Free Fire DPI settings, gaming tools free, Free Fire tools India 2025, FF password generator, QR code generator, image compressor, utility tools',
    type: 'website' as const,
  },
  ffbots: {
    title: 'FF Bots Hub - Free Fire Free Likes, Stats & Profile Booster | NS GAMMING',
    description: 'Ultimate Free Fire Bots Hub by NS GAMMING! Get unlimited free likes for your FF profile, check detailed player stats and info, boost profile visibility, and increase followers. Support for all regions: India, Singapore, Pakistan, Bangladesh, Brazil, Thailand, Vietnam, Middle East. Safe, secure, and 100% free tools to dominate Free Fire!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Free Fire bots, FF likes bot free, Free Fire free likes 2025, FF profile booster, Free Fire tools India, FF stat checker, Free Fire player info, FF spam bot, Free Fire visibility boost, FF visit bot, Free Fire profile visits, FF followers boost, gaming bots free',
    type: 'website' as const,
  },
  portfolio: {
    title: 'Portfolio - Nishant Sarkar (Naboraj) Web Development Projects & Work',
    description: 'Explore the impressive portfolio of Nishant Sarkar (Naboraj Sarkar) - Full-stack web developer and creator of NS GAMMING. Discover innovative web applications, gaming tools, responsive websites, React projects, and creative digital solutions. Skills: React, TypeScript, Node.js, Python, Tailwind CSS, and more. Available for freelance web development projects and collaborations.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Nishant Sarkar portfolio, Naboraj Sarkar projects, web development portfolio, full-stack developer portfolio, React developer India, gaming tools developer, freelance web developer Siliguri, coding projects, JavaScript portfolio, Python projects, TypeScript developer, student developer portfolio',
    type: 'website' as const,
  },
  games: {
    title: 'Play Free Games - Fun Browser Games by NS GAMMING',
    description: 'Play awesome free browser games created by NS GAMMING! Enjoy classic games like Tic Tac Toe, Snake, Memory Match, Flappy Bird, 2048, Pong, and more. All games are mobile-friendly, no download required, and built with love by Nishant Sarkar. Challenge yourself and have fun!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, free online games, browser games, play games online, Tic Tac Toe, Snake game, Memory game, Flappy Bird, 2048 game, Pong game, free games no download, mobile games, casual games, mini games, game collection',
    type: 'website' as const,
  },
  contact: {
    title: 'Contact Nishant Sarkar (Naboraj) - NS GAMMING Collaboration & Services',
    description: 'Get in touch with Nishant Sarkar (Naboraj Sarkar), founder of NS GAMMING! Available for website development projects, gaming collaborations, content partnerships, and business inquiries. Connect via WhatsApp, Telegram, email, or social media. Fast response guaranteed. Located in Siliguri, West Bengal, India. Let\'s build something amazing together!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, Contact NS GAMMING, Nishant Sarkar contact, Naboraj Sarkar email, NS GAMMING WhatsApp, gaming collaborations, website development services, hire web developer, freelance developer India, Siliguri web developer contact, business inquiries, content partnerships',
    type: 'website' as const,
  },
  social: {
    title: 'Follow NS GAMMING - Social Media Links | Nishant Sarkar',
    description: 'Connect with NS GAMMING across all social media platforms! Follow Nishant Sarkar (Naboraj Sarkar) on YouTube, Instagram, Telegram, Discord, Twitter, Facebook, Reddit, LinkedIn, and more. Join the NS GAMMING Family for daily updates, exclusive content, gaming tips, coding tutorials, and community events. 10K+ followers worldwide!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, NS GAMMING social media, Nishant Sarkar YouTube, NS Instagram, NS Telegram channel, NS Discord server, follow NS GAMMING, gaming community, content creator social media, NS Twitter, NS Facebook, NS LinkedIn, Naboraj Sarkar social',
    type: 'website' as const,
  },
  coding: {
    title: 'Coding Journey - Programming & Development by Nishant Sarkar',
    description: 'Explore the coding journey of Nishant Sarkar (Naboraj Sarkar) - From first Python line to building complex web applications. Learn about tech stack expertise in React, TypeScript, Node.js, Python, JavaScript, Tailwind CSS, and more. Get inspired by real projects, coding philosophy, and development best practices from a young passionate developer.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, coding journey, programming developer, web development, React developer, TypeScript projects, Node.js backend, Python programming, JavaScript expert, full-stack development, coding tutorials, developer story, tech stack, programming philosophy',
    type: 'website' as const,
  },
  content: {
    title: 'Content Creation - YouTube, Gaming & Tech Videos by NS GAMMING',
    description: 'Discover content creation by NS GAMMING! Watch gaming videos, Free Fire gameplay, coding tutorials, tech reviews, and creative content by Nishant Sarkar. Subscribe to YouTube channel with 8K+ subscribers, join Instagram with 2K+ followers. Weekly uploads, live streams, and exclusive community content. Content made with passion and love!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, content creation, YouTube creator, gaming videos, Free Fire content, coding videos, tech reviews, content creator India, YouTube gaming channel, Instagram content, video tutorials, live streams, creative content',
    type: 'website' as const,
  },
  community: {
    title: 'Join NS GAMMING Community - Gaming & Coding Family',
    description: 'Join the thriving NS GAMMING Family community! 15K+ members on Telegram, 1.3K+ on Discord, 8K+ YouTube subscribers. Connect with gamers, developers, and creators. Participate in weekly giveaways, gaming tournaments, coding challenges, and community events. Love, support, and growth mindset - everyone is welcome!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, gaming community, coding community, Discord server, Telegram group, YouTube community, community events, gaming tournaments, weekly giveaways, developer community India, inclusive community, online community',
    type: 'website' as const,
  },
  gaming: {
    title: 'Gaming Life - Free Fire, Minecraft & More | NS GAMMING',
    description: 'Experience the gaming life with NS GAMMING! Master Free Fire with pro tips, explore Minecraft creativity, play Among Us with friends, and discover Farlight 84 strategies. Join tournaments, watch gameplay highlights, and learn from gaming achievements. Gaming is not just a hobby, it\'s a lifestyle and life balance!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, gaming life, Free Fire gameplay, Free Fire tips, Minecraft gaming, Among Us strategies, Farlight 84, gaming tournaments, gaming achievements, pro gamer, gameplay highlights, gaming lifestyle, esports India',
    type: 'website' as const,
  },
  goals: {
    title: 'Goals & Vision - Building My Empire | Nishant Sarkar',
    description: 'Discover the ambitious goals and vision of Nishant Sarkar (Naboraj Sarkar). Learn about the mission to master coding, build impactful products, grow NS GAMMING community, maintain life balance with football, and build a digital empire. Get inspired by the journey from Siliguri to changing the future. Dream big, work hard, achieve more!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, career goals, life goals, developer vision, entrepreneurship goals, building empire, content creator goals, YouTube growth, football passion, life balance, future plans, mission vision, student entrepreneur',
    type: 'website' as const,
  },
  privacypolicy: {
    title: 'Privacy Policy - Data Protection & Security | NS GAMMING',
    description: 'Read NS GAMMING Privacy Policy - Learn how we protect your data, handle FF Bots usage, manage cookies, and ensure your privacy. We respect user privacy, use secure encryption, never sell personal data, and comply with international privacy standards. Transparent data practices for FF tools, blog, and website services.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, privacy policy, data protection, user privacy, data security, GDPR compliance, privacy terms, secure website, data encryption, cookie policy, FF bots privacy, user data protection',
    type: 'website' as const,
  },
  terms: {
    title: 'Terms & Conditions - Website Usage Policy | NS GAMMING',
    description: 'NS GAMMING Terms & Conditions - Understand website usage policies, FF tools terms, user responsibilities, and service limitations. Learn about acceptable use, intellectual property, disclaimers, and legal obligations. By using NS GAMMING services, you agree to these terms. Read carefully before using FF Bots and other tools.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, terms and conditions, terms of service, usage policy, website terms, FF tools terms, user agreement, legal terms, service terms, website policy, user responsibilities',
    type: 'website' as const,
  },
  disclaimer: {
    title: 'Disclaimer - Important Information & Limitations | NS GAMMING',
    description: 'NS GAMMING Disclaimer - Important information about service limitations, FF tools usage, third-party affiliations, and liability disclaimers. Not affiliated with Garena Free Fire. Use FF Bots at your own risk. Educational content only. Understand risks and limitations before using any tools or services.',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, website disclaimer, service disclaimer, FF tools disclaimer, liability limitations, risk disclaimer, not affiliated Garena, educational content, use at own risk, service limitations',
    type: 'website' as const,
  },
  fflikes: {
    title: 'FF Likes Bot - Get Free Fire Free Likes Daily | NS GAMMING',
    description: 'Get unlimited Free Fire free likes with NS GAMMING FF Likes Bot! Support for all regions: India (IND), Singapore (SG), Pakistan (PK), Bangladesh (BD), Brazil (BR), Thailand (TH), Vietnam (VN), Middle East (ME), and more. 1 free use per day, instant delivery, safe and secure. Boost your FF profile now!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, FF likes bot, Free Fire free likes, FF profile likes, Free Fire likes generator, FF likes India, FF likes daily, Free Fire profile boost, FF likes bot 2025, safe FF likes, instant FF likes',
    type: 'website' as const,
  },
  ffinfo: {
    title: 'FF Info Bot - Free Fire Player Stats & Info Checker | NS GAMMING',
    description: 'Check Free Fire player stats and detailed information with NS GAMMING FF Info Bot! Get complete player statistics, level, achievements, match history, guild info, and performance data. Coming soon with advanced features. Support for all FF regions. Your ultimate FF stat checker tool!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, FF info bot, Free Fire stats, FF player info, Free Fire stat checker, FF player stats, FF match history, Free Fire achievements, FF guild info, player statistics, FF info tool',
    type: 'website' as const,
  },
  ffspam: {
    title: 'FF Spam Bot - Boost Free Fire Profile Visibility | NS GAMMING',
    description: 'Boost your Free Fire profile visibility with NS GAMMING FF Spam Bot! Increase profile engagement, gain more followers, become popular in FF community. Automated engagement, safe process, instant results. Coming soon with powerful features. Dominate Free Fire with increased visibility!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, FF spam bot, Free Fire visibility, FF profile boost, Free Fire engagement, FF popularity boost, FF followers, profile visibility, FF fame, auto engagement',
    type: 'website' as const,
  },
  ffvisit: {
    title: 'FF Visit Bot - Increase Free Fire Profile Visits & Followers | NS GAMMING',
    description: 'Increase Free Fire profile visits and gain followers with NS GAMMING FF Visit Bot! Get thousands of organic profile views, boost follower count, become a FF star player. Safe, natural growth, no fake accounts. Coming soon with amazing features. Achieve FF fame today!',
    keywords: 'NS, NABORAJ SARKAR, NABORAJ, NISHANT, Nishant Sarkar, NS GAMMING, NS Gamming Family, FF visit bot, Free Fire profile visits, FF followers boost, Free Fire visibility, FF profile views, follower growth, FF star player, organic growth, FF fame',
    type: 'website' as const,
  },
};