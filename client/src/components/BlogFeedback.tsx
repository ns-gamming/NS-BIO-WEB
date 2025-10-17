import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogFeedbackProps {
  slug: string;
}

export default function BlogFeedback({ slug }: BlogFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, [slug]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}/feedback-stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ 
        title: "Rating Required", 
        description: "Please select a rating before submitting",
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blog/${slug}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback: feedback.trim() || null }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setHasSubmitted(true);
        setRating(0);
        setFeedback('');
        fetchStats();
        toast({ 
          title: "Thank You!", 
          description: "Your feedback has been submitted successfully" 
        });
      } else {
        toast({ 
          title: "Error", 
          description: data.message || "Failed to submit feedback",
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Thank You for Your Feedback! 🎉</h3>
          <p className="text-gray-600 dark:text-gray-400">Your input helps us improve our content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
      <h3 className="text-2xl font-bold mb-4 dark:text-white">Rate This Article</h3>

      {stats.totalRatings > 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {stats.averageRating.toFixed(1)} ({stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Rating:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Feedback (Optional):</p>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about this article..."
            className="dark:bg-gray-800 dark:border-gray-700"
            rows={4}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full dark:bg-cyan-500 dark:hover:bg-cyan-600"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
}