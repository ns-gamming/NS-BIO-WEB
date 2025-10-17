import { useState } from "react";
import { MessageSquare, X, Star, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackWidgetProps {
  pageName: string;
  toolName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export default function FeedbackWidget({ 
  pageName, 
  toolName,
  position = "bottom-right" 
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-20 right-6",
    "top-left": "top-20 left-6",
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageName,
          toolName,
          rating,
          feedbackText: feedback || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Thank You! 🎉",
          description: "Your feedback helps us improve the website!",
        });
        setHasSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setRating(0);
          setFeedback("");
          setHasSubmitted(false);
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to submit feedback");
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Failed",
        description: "Couldn't submit your feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFeedback = async (isPositive: boolean) => {
    const quickRating = isPositive ? 5 : 2;
    
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageName,
          toolName,
          rating: quickRating,
          feedbackText: isPositive ? "Quick positive feedback" : "Quick negative feedback",
        }),
      });

      toast({
        title: isPositive ? "Thanks! 😊" : "Sorry to hear that 😔",
        description: isPositive 
          ? "Glad you enjoyed it!" 
          : "We'll work on improving this page.",
      });
    } catch (error) {
      console.error("Error submitting quick feedback:", error);
    }
  };

  return (
    <>
      <div 
        className={`fixed ${positionClasses[position]} z-40 flex gap-2 animate-fadeIn`}
        data-testid="feedback-widget-container"
      >
        <Button
          onClick={() => handleQuickFeedback(true)}
          size="sm"
          variant="outline"
          className="glass hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300"
          data-testid="button-quick-positive"
        >
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => handleQuickFeedback(false)}
          size="sm"
          variant="outline"
          className="glass hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
          data-testid="button-quick-negative"
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="glass neon-btn-sm group"
          data-testid="button-open-feedback"
        >
          <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-bounce" />
          Feedback
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Share Your Feedback
            </DialogTitle>
            <DialogDescription>
              Help us improve {toolName ? `the ${toolName} tool` : "this page"}. Your feedback matters!
            </DialogDescription>
          </DialogHeader>

          {!hasSubmitted ? (
            <div className="space-y-6 mt-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 hover:scale-125"
                      data-testid={`star-${star}`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-primary animate-fadeIn">
                    {rating === 5 && "Awesome! 🎉"}
                    {rating === 4 && "Great! 😊"}
                    {rating === 3 && "Good 👍"}
                    {rating === 2 && "Could be better 😕"}
                    {rating === 1 && "Sorry to hear that 😔"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Tell us more (optional)
                </label>
                <Textarea
                  placeholder="What did you like or what could we improve?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px] resize-none glass"
                  data-testid="textarea-feedback"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                  data-testid="button-cancel-feedback"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting || rating === 0}
                  data-testid="button-submit-feedback"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 animate-bounceIn">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                Your feedback has been submitted successfully.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
