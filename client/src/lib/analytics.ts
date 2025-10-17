function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class AnalyticsTracker {
  private sessionId: string;
  private currentPageViewId: string | null = null;
  private pageStartTime: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = generateUUID();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private getDeviceInfo() {
    return {
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      platform: navigator.platform,
      language: navigator.language,
      userAgent: navigator.userAgent
    };
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const response = await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          deviceInfo: this.getDeviceInfo()
        })
      });

      if (response.ok) {
        this.isInitialized = true;
        this.trackPageView();
        this.setupEventListeners();
        this.setupBeforeUnload();
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async trackPageView() {
    if (this.currentPageViewId) {
      await this.endPageView();
    }

    this.pageStartTime = Date.now();
    
    try {
      const response = await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pageUrl: window.location.pathname + window.location.search,
          pageTitle: document.title,
          referrer: document.referrer
        })
      });

      const data = await response.json();
      if (data.success && data.pageView) {
        this.currentPageViewId = data.pageView.id;
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  private async endPageView() {
    if (!this.currentPageViewId) return;

    const timeSpent = Math.floor((Date.now() - this.pageStartTime) / 1000);

    try {
      await fetch(`/api/analytics/pageview/${this.currentPageViewId}/time`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSpent })
      });
    } catch (error) {
      console.error('Failed to update page view time:', error);
    }
  }

  private async trackEvent(eventType: string, element: HTMLElement | null, metadata?: any) {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          eventType,
          elementId: element?.id || null,
          elementText: element?.textContent?.slice(0, 100) || null,
          elementTag: element?.tagName.toLowerCase() || null,
          pageUrl: window.location.pathname + window.location.search,
          metadata: metadata || {}
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private setupEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.trackEvent('click', target, {
        x: e.clientX,
        y: e.clientY,
        button: e.button
      });
    });

    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        this.trackEvent('scroll', null, { scrollPercentage });
      }, 500);
    });

    const handleNavigation = () => {
      this.trackPageView();
    };

    window.addEventListener('popstate', handleNavigation);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleNavigation();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleNavigation();
    };
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', async () => {
      await this.endPageView();
      
      try {
        await fetch(`/api/analytics/session/${this.sessionId}/end`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true
        });
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    });
  }

  public trackCustomEvent(eventType: string, metadata?: any) {
    this.trackEvent(eventType, null, metadata);
  }
}

export const analytics = new AnalyticsTracker();
