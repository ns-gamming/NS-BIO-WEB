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
    title: 'NS GAMMING - Nishant Sarkar | Free Fire Tools, Gaming & Coding',
    description: 'Welcome to NS GAMMING! Created by Nishant Sarkar (Naboraj Sarkar). Get Free Fire tools, advanced sensitivity settings, gaming tutorials, coding guides, and tech content. Join the NS community!',
    keywords: 'NS GAMMING, Nishant Sarkar, Naboraj Sarkar, NS, NS TEAM, Free Fire tools, Free Fire sensitivity calculator, Free Fire name generator, gaming channel, coding tutorials, tech blog, content creator Siliguri, West Bengal gaming, Free Fire tips India',
    type: 'website' as const,
  },
  about: {
    title: 'About Nishant Sarkar (Naboraj Sarkar) - NS GAMMING',
    description: 'Meet Nishant Sarkar (Naboraj Sarkar), the creator of NS GAMMING. A passionate gamer, developer, and content creator from Siliguri, West Bengal. Learn about his journey, mission, and vision.',
    keywords: 'Nishant Sarkar, Naboraj Sarkar, NS GAMMING creator, gaming content creator, developer Siliguri, West Bengal gamer, Free Fire player, coding enthusiast, NS biography, about NS GAMMING',
    type: 'profile' as const,
  },
  blog: {
    title: 'Gaming & Tech Blog - NS GAMMING',
    description: 'Read expert gaming tips, Free Fire guides, coding tutorials, and tech articles by Nishant Sarkar. Stay updated with the latest gaming strategies, programming tutorials, and technology trends.',
    keywords: 'NS GAMMING blog, Nishant Sarkar blog, Free Fire guides, gaming tips, coding tutorials, tech articles, programming guides, JavaScript tutorials, Python tutorials, game strategies, technology blog',
    type: 'website' as const,
  },
  tools: {
    title: 'Free Fire Tools & Utilities - NS GAMMING',
    description: 'Free tools for Free Fire players! Advanced sensitivity calculator (max 200), stylish name generator, UID generator, and secure password generator. Optimized for all devices with DPI settings.',
    keywords: 'Free Fire tools, FF sensitivity calculator, Free Fire sensitivity generator, Free Fire name generator, FF stylish names, FF UID generator, Free Fire max sensitivity 200, DPI settings Free Fire, Free Fire tools India, FF password generator',
    type: 'website' as const,
  },
  ffbots: {
    title: 'Free Fire Bots Hub - Get Free Likes, Info & More | NS GAMMING',
    description: 'Free Fire Bots Hub by NS GAMMING! Get free likes for your FF profile, check player stats, and boost your visibility. Tools for all regions: India, Singapore, Brazil, and more.',
    keywords: 'Free Fire bots, FF likes bot, Free Fire free likes, FF profile booster, Free Fire tools India, FF stat checker, Free Fire profile visits, FF spam bot, Free Fire info bot, NS GAMMING bots',
    type: 'website' as const,
  },
  portfolio: {

  googleAdsCloud: {
    title: 'Google Ads & Google Cloud 2025: Complete Digital Marketing & Cloud Computing Guide',
    description: 'Master Google Ads and Google Cloud in 2025! Complete guide to PPC advertising, cloud computing, AI integration, keyword bidding, scalable infrastructure, and how to grow your business with Google\'s powerful platforms.',
    keywords: 'Google Ads, Google Cloud, Google Ads 2025, Google Cloud Platform, GCP, digital marketing, PPC advertising, cloud computing, AI in cloud, machine learning, keyword bidding, ad targeting, cloud infrastructure, scalable apps, Vertex AI, BigQuery, Cloud Run, Google advertising, NS GAMMiNG, nsgamming.xyz',
    type: 'article' as const,
  },

    title: 'Portfolio - Nishant Sarkar Projects & Work',
    description: 'Explore projects and work by Nishant Sarkar (Naboraj Sarkar). Web development, gaming tools, content creation, and more. See the innovative solutions and creative projects.',
    keywords: 'Nishant Sarkar portfolio, Naboraj Sarkar projects, NS GAMMING projects, web development portfolio, gaming tools, developer portfolio, coding projects, React projects, JavaScript portfolio',
    type: 'website' as const,
  },
  games: {
    title: 'Games & Gaming Content - NS GAMMING',
    description: 'Gaming content, Free Fire highlights, gameplay tips, and gaming guides by Nishant Sarkar. Watch gameplay videos, learn pro strategies, and improve your gaming skills.',
    keywords: 'NS GAMMING games, Free Fire gameplay, gaming highlights, Free Fire tips, gaming tutorials, pro gaming strategies, FF gameplay, gaming content India, Free Fire videos',
    type: 'website' as const,
  },
  contact: {
    title: 'Contact Nishant Sarkar - NS GAMMING',
    description: 'Get in touch with Nishant Sarkar (Naboraj Sarkar) from NS GAMMING. Connect via WhatsApp, email, or social media. Available for collaborations, website development, and gaming partnerships.',
    keywords: 'contact Nishant Sarkar, NS GAMMING contact, Naboraj Sarkar email, collaborate with NS GAMMING, website development services, gaming collaboration, NS GAMMING WhatsApp',
    type: 'website' as const,
  },
  utilityTools: {
    title: 'Free Utility Tools - Image Compressor, QR Generator, Text-to-Speech | NS GAMMING',
    description: 'Free productivity tools by NS GAMMING: Image compressor, QR code generator, text-to-speech converter, and clipboard manager. Fast, free, and easy to use!',
    keywords: 'free utility tools, image compressor online, QR code generator, text to speech converter, clipboard manager, online tools free, productivity tools, image optimization, NS GAMMING tools',
    type: 'website' as const,
  },
};