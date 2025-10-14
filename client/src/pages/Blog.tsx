import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = Array.from(new Set(posts?.map(p => p.category) || []));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection
        title="Gaming & Tech Blog"
        subtitle="Expert tips, tutorials, and guides for Free Fire, coding, and content creation 📚"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fadeUp">
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md dark:bg-gray-800 dark:text-white transition-all duration-300 hover:scale-105 focus:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
            data-testid="input-blog-search"
          />
        </div>

        {!isLoading && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 animate-slideInFromBottom">
            {categories.map((cat, index) => (
              <Badge
                key={cat}
                variant="outline"
                className="cursor-pointer dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30 animate-bounceIn"
                onClick={() => setSearchQuery(cat)}
                data-testid={`badge-category-${cat}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Top Ad Placement */}
        <div className="mb-8 animate-fadeUp">
          <AdSenseAd />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(0, 6).map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-cyan-500 dark:hover:shadow-cyan-500/30 animate-zoomIn" data-testid={`card-post-${post.slug}`} style={{ animationDelay: `${index * 0.15}s` }}>
                    {post.imageUrl && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          data-testid={`img-post-${post.slug}`}
                        />
                      </div>
                    )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="dark:bg-cyan-500/20 dark:text-cyan-400 animate-pulse-slow" data-testid={`badge-post-category-${post.slug}`}>
                        {post.category}
                      </Badge>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 animate-fadeIn" data-testid={`text-views-${post.slug}`}>
                        <Eye className="h-3 w-3 mr-1 animate-pulse" />
                        {post.views}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 dark:text-white transition-colors hover:text-cyan-500 dark:hover:text-cyan-400" data-testid={`text-title-${post.slug}`}>
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 dark:text-gray-400" data-testid={`text-excerpt-${post.slug}`}>
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center" data-testid={`text-readtime-${post.slug}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime} min read
                        </span>
                        <span className="flex items-center" data-testid={`text-date-${post.slug}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300 transition-all hover:scale-110" data-testid={`badge-tag-${tag}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>

            {/* Middle Ad Placement */}
            {filteredPosts.length > 6 && (
              <div className="my-12 animate-fadeUp">
                <AdSenseAd />
              </div>
            )}

            {/* Remaining Posts */}
            {filteredPosts.length > 6 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredPosts.slice(6).map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-cyan-500 dark:hover:shadow-cyan-500/30 animate-zoomIn" data-testid={`card-post-${post.slug}`} style={{ animationDelay: `${index * 0.15}s` }}>
                      {post.imageUrl && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            data-testid={`img-post-${post.slug}`}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="dark:bg-cyan-500/20 dark:text-cyan-400 animate-pulse-slow" data-testid={`badge-post-category-${post.slug}`}>
                            {post.category}
                          </Badge>
                          <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 animate-fadeIn" data-testid={`text-views-${post.slug}`}>
                            <Eye className="h-3 w-3 mr-1 animate-pulse" />
                            {post.views}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2 dark:text-white transition-colors hover:text-cyan-500 dark:hover:text-cyan-400" data-testid={`text-title-${post.slug}`}>
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 dark:text-gray-400" data-testid={`text-excerpt-${post.slug}`}>
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center" data-testid={`text-readtime-${post.slug}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {post.readTime} min read
                            </span>
                            <span className="flex items-center" data-testid={`text-date-${post.slug}`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-800 dark:text-gray-300 transition-all hover:scale-110" data-testid={`badge-tag-${tag}`}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 animate-fadeUp">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No articles found matching your search.</p>
            <Button onClick={() => setSearchQuery('')} variant="outline" className="dark:border-cyan-500 dark:text-cyan-400 transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/30" data-testid="button-clear-search">
              Clear Search
            </Button>
          </div>
        )}

        {/* AdSense Ad */}
        <div className="mt-12">
          <AdSenseAd />
        </div>
      </div>
    </div>
  );
}
