import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Eye, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useLiveViewCounter } from '@/hooks/useLiveViewCounter';
import type { BlogPost } from '@shared/schema';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const { toast } = useToast();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog', params?.slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${params?.slug}`);
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    },
  });

  const liveViews = useLiveViewCounter(post?.views || 100, 3000);

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({ title: "Copied!", description: "Link copied to clipboard" });
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Post Not Found</h1>
          <Link href="/blog">
            <Button className="dark:bg-cyan-500 dark:hover:bg-cyan-600" data-testid="button-back-to-blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <article className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 dark:text-cyan-400 dark:hover:bg-cyan-500/10" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="mb-6">
          <Badge className="dark:bg-cyan-500/20 dark:text-cyan-400" data-testid="badge-category">
            {post.category}
          </Badge>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white" data-testid="text-post-title">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 flex-wrap">
          <span className="flex items-center" data-testid="text-post-date">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center" data-testid="text-post-readtime">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime} min read
          </span>
          <span className="flex items-center text-green-600 dark:text-green-400 font-semibold animate-pulse" data-testid="text-post-views">
            <Eye className="h-4 w-4 mr-2 animate-pulse" />
            {liveViews.toLocaleString()}+ views
            <TrendingUp className="h-4 w-4 ml-2 animate-bounce" />
          </span>
        </div>

        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto"
              data-testid="img-post-featured"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8" data-testid="content-post-body">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed dark:text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="dark:bg-gray-800 dark:text-gray-300" data-testid={`badge-tag-${tag}`}>
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-lg font-semibold dark:text-white">Share this article</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('facebook')}
                className="dark:border-gray-700 dark:hover:bg-gray-800"
                data-testid="button-share-facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('twitter')}
                className="dark:border-gray-700 dark:hover:bg-gray-800"
                data-testid="button-share-twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sharePost('copy')}
                className="dark:border-gray-700 dark:hover:bg-gray-800"
                data-testid="button-share-copy"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
