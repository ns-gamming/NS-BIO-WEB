import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, Sparkles } from 'lucide-react';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';

interface QAItem {
  q: string;
  a: string;
  source: string;
}

interface ArticleQAProps {
  slug: string;
}

export default function ArticleQA({ slug }: ArticleQAProps) {
  const [question, setQuestion] = useState('');
  const [qaData, setQaData] = useState<QAItem[]>([]);
  const [answer, setAnswer] = useState<QAItem | null>(null);
  const [fuse, setFuse] = useState<Fuse<QAItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQAData = async () => {
      try {
        const response = await fetch(`/content/qa/${slug}.json`);
        if (response.ok) {
          const data: QAItem[] = await response.json();
          setQaData(data);
          
          const fuseInstance = new Fuse(data, {
            keys: ['q', 'a'],
            threshold: 0.3,
            includeScore: true,
          });
          setFuse(fuseInstance);
        }
      } catch (error) {
        console.error('Failed to load Q&A data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQAData();
  }, [slug]);

  const searchAnswer = () => {
    if (!fuse || !question.trim()) return;

    const results = fuse.search(question);
    if (results.length > 0 && results[0].item) {
      setAnswer(results[0].item);
    } else {
      setAnswer({
        q: question,
        a: "I couldn't find a specific answer to that question in this article. Try rephrasing your question or check out our general chatbot for more help!",
        source: "No match found"
      });
    }
  };

  const handleQuickQuestion = (q: string) => {
    setQuestion(q);
    if (!fuse) return;
    
    const results = fuse.search(q);
    if (results.length > 0 && results[0].item) {
      setAnswer(results[0].item);
    }
  };

  if (isLoading || !qaData.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-12"
    >
      <Card className="dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500 animate-pulse" />
            <CardTitle className="dark:text-white">Ask About This Article</CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">
            Get instant answers from the article content using AI-powered search
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="What would you like to know?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchAnswer()}
              className="dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-cyan-500 transition-all"
              data-testid="input-article-question"
            />
            <Button 
              onClick={searchAnswer} 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-105 transition-all"
              data-testid="button-ask-question"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {qaData.length > 0 && !answer && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {qaData.slice(0, 3).map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(item.q)}
                    className="dark:border-cyan-500/30 dark:text-cyan-400 dark:hover:bg-cyan-500/10 text-xs hover:scale-105 transition-all"
                    data-testid={`button-quick-question-${index}`}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {item.q.substring(0, 40)}...
                  </Button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-500/20 dark:border-cyan-500/40 space-y-3"
                data-testid="answer-container"
              >
                <div>
                  <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-1">Question:</p>
                  <p className="dark:text-white">{answer.q}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-1">Answer:</p>
                  <p className="dark:text-gray-300 leading-relaxed">{answer.a}</p>
                </div>
                {answer.source !== "No match found" && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    Source: {answer.source}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAnswer(null);
                    setQuestion('');
                  }}
                  className="dark:hover:bg-gray-800 text-xs"
                  data-testid="button-clear-answer"
                >
                  Ask another question
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}