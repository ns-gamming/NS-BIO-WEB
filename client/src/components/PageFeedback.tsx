import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getSessionId } from '@/lib/analytics';

interface PageFeedbackProps {
  pageName: string;
  toolName?: string;
}

export default function PageFeedback({ pageName, toolName }: PageFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ 
        title: "Rating Required", 
        description: "Please select a star rating before submitting",
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionId = getSessionId();
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageName, 
          toolName: toolName || null,
          rating, 
          feedbackText: feedback.trim() || null,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setHasSubmitted(true);
        setRating(0);
        setFeedback('');
        toast({ 
          title: "Thank You! 🎉", 
          description: "Your feedback helps us improve!" 
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
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border-2 border-green-500/30 dark:border-green-500/50 rounded-2xl p-8 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 dark:from-green-500/20 dark:via-emerald-500/10 dark:to-green-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-3xl animate-pulse"></div>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500 dark:text-green-400" />
          </motion.div>
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
          >
            Feedback Received! ✨
          </motion.h3>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Thank you for helping us improve!
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden border-2 border-primary/20 dark:border-primary/40 rounded-2xl p-6 sm:p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-primary/40 dark:hover:border-primary/60 transition-all duration-500"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-purple-500/20 animate-gradient-shift"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute top-4 right-8 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-8 left-12 w-2 h-2 bg-purple-400 rounded-full"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Share Your Feedback
          </h3>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-5"
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Rate your experience:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="transition-all duration-200"
                >
                  <Star
                    className={`h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Additional comments (optional):</p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 focus:scale-[1.02] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              rows={4}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </motion.span>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}