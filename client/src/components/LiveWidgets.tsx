import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, TrendingUp, Users, Newspaper, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WeatherWidget() {
  const { data: weather } = useQuery<any>({
    queryKey: ['/api/weather'],
    refetchInterval: 300000,
  });

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
          <CloudRain className="h-4 w-4 text-cyan-500" />
          Live Weather - Siliguri
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weather ? (
          <div className="space-y-2">
            <div className="text-3xl font-bold dark:text-white" data-testid="text-temperature">
              {weather.temp}°C
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize" data-testid="text-weather-desc">
              {weather.description}
            </div>
            {weather.humidity && (
              <div className="text-xs text-gray-500 dark:text-gray-500" data-testid="text-humidity">
                Humidity: {weather.humidity}%
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CryptoWidget() {
  const { data: crypto } = useQuery<any>({
    queryKey: ['/api/crypto'],
    refetchInterval: 60000,
  });

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Crypto Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        {crypto ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between" data-testid="text-btc-price">
              <span className="dark:text-gray-400">BTC:</span>
              <span className="font-semibold dark:text-white">₹{crypto.bitcoin?.inr?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between" data-testid="text-eth-price">
              <span className="dark:text-gray-400">ETH:</span>
              <span className="font-semibold dark:text-white">₹{crypto.ethereum?.inr?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between" data-testid="text-bnb-price">
              <span className="dark:text-gray-400">BNB:</span>
              <span className="font-semibold dark:text-white">₹{crypto.binancecoin?.inr?.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function VisitorCounter() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['/api/visitor-count'],
    refetchInterval: 30000,
  });

  useEffect(() => {
    fetch('/api/visitor-count', { method: 'POST' }).catch(console.error);
  }, []);

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
          <Users className="h-4 w-4 text-purple-500" />
          Today's Visitors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="text-3xl font-bold text-purple-500 dark:text-purple-400" data-testid="text-visitor-count">
            {data?.count || 0}
          </div>
        ) : (
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
        )}
      </CardContent>
    </Card>
  );
}

export function GamingNewsWidget() {
  const { data: news } = useQuery<any>({
    queryKey: ['/api/gaming-news'],
    refetchInterval: 600000,
  });

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
          <Newspaper className="h-4 w-4 text-orange-500" />
          Gaming News
        </CardTitle>
      </CardHeader>
      <CardContent>
        {news && news.length > 0 ? (
          <div className="space-y-3">
            {news.slice(0, 5).map((item: any, index: number) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors line-clamp-2"
                data-testid={`link-news-${index}`}
              >
                {item.title}
              </a>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 dark:text-white">
          <Clock className="h-4 w-4 text-cyan-500" />
          Live Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold font-mono dark:text-white" data-testid="text-live-time">
            {time.toLocaleTimeString('en-US', { hour12: true })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400" data-testid="text-live-date">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
