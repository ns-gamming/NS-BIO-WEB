import { Link } from 'wouter';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { useLiveViewCounter } from '@/hooks/useLiveViewCounter';
import { getAllBlogPosts, type BlogPost } from '@/data/blogPosts';
import { motion } from 'framer-motion';

function LiveBlogCard({ post }: { post: BlogPost }) {
  const liveViews = useLiveViewCounter(post.views, 3000);

  return (
    <Link key={post.id} href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all cursor-pointer hover:scale-105 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-cyan-500 animate-fadeUp" data-testid={`card-post-${post.slug}`}>
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              data-testid={`img-post-${post.slug}`}
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="dark:bg-cyan-500/20 dark:text-cyan-400 animate-pulse" data-testid={`badge-post-category-${post.slug}`}>
              {post.category}
            </Badge>
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 group animate-slideRight" data-testid={`text-views-${post.slug}`}>
              <Eye className="h-3 w-3 mr-1 text-green-500 animate-pulse" />
              <span className="font-semibold text-green-600 dark:text-green-400 transition-all duration-300">
                {liveViews.toLocaleString()}+
              </span>
              <TrendingUp className="h-3 w-3 ml-1 text-green-500 animate-bounce" />
            </span>
          </div>
          <CardTitle className="line-clamp-2 dark:text-white hover:text-primary transition-colors" data-testid={`text-title-${post.slug}`}>
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 dark:text-gray-400" data-testid={`text-excerpt-${post.slug}`}>
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center animate-fadeUp" data-testid={`text-readtime-${post.slug}`}>
                <Clock className="h-3 w-3 mr-1" />
                {post.readTime} min read
              </span>
              <span className="flex items-center animate-fadeUp" data-testid={`text-date-${post.slug}`} style={{ animationDelay: '0.1s' }}>
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300 animate-bounceIn" data-testid={`badge-tag-${tag}`} style={{ animationDelay: `${index * 0.1}s` }}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const posts = useMemo(() => getAllBlogPosts(), []);

  const filteredPosts = useMemo(() => 
    posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [posts, searchQuery]
  );

  const categories = useMemo(() => 
    Array.from(new Set(posts.map(p => p.category))),
    [posts]
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-950"
    >
      <HeroSection
        title="Gaming & Tech Blog"
        subtitle="Expert tips, tutorials, and guides for Free Fire, coding, and content creation 📚"
      />

      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 transition-all"
            data-testid="input-blog-search"
          />
        </motion.div>

        {categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500/10 hover:scale-105 transition-all"
                  onClick={() => setSearchQuery(cat)}
                  data-testid={`badge-category-${cat}`}
                >
                  {cat}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredPosts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <LiveBlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No articles found matching your search.
            </p>
            <Button 
              onClick={() => setSearchQuery('')} 
              variant="outline" 
              className="dark:border-cyan-500 dark:text-cyan-400 hover:scale-105 transition-transform" 
              data-testid="button-clear-search"
            >
              Clear Search
            </Button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <AdSenseAd />
        </motion.div>
      </div>
    </motion.div>
  );
}
