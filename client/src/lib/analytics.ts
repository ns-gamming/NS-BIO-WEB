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
      languages: navigator.languages || [navigator.language],
      userAgent: navigator.userAgent,
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      referrer: document.referrer || 'direct',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check if session already exists
      const checkResponse = await fetch(`/api/analytics/session/${this.sessionId}/check`);
      
      // Silently fail if analytics endpoint is unavailable (e.g., database not configured)
      if (!checkResponse.ok) {
        console.log('Analytics not available - continuing without tracking');
        this.isInitialized = true;
        return;
      }
      
      const { exists } = await checkResponse.json();

      if (!exists) {
        const response = await fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: this.sessionId,
            deviceInfo: this.getDeviceInfo()
          })
        });

        if (!response.ok) {
          console.log('Analytics session creation failed - continuing without tracking');
          this.isInitialized = true;
          return;
        }
      }

      this.isInitialized = true;
      this.trackPageView();
      this.setupEventListeners();
      this.setupBeforeUnload();
    } catch (error) {
      console.log('Analytics disabled - continuing without tracking');
      this.isInitialized = true;
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
        console.log(`Page view tracked: ${data.pageView.page_url} from IP: ${data.pageView.ip_address}`);
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
    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const metadata: any = {
        x: e.clientX,
        y: e.clientY,
        button: e.button
      };

      // Track button clicks specifically
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        metadata.buttonType = button?.getAttribute('type') || 'button';
        metadata.buttonText = button?.textContent?.trim().slice(0, 50);
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        metadata.href = link?.getAttribute('href');
        metadata.linkText = link?.textContent?.trim().slice(0, 50);
      }

      this.trackEvent('click', target, metadata);
    });

    // Form submission tracking
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('form_submit', form, {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method
      });
    });

    // Input focus tracking
    document.addEventListener('focus', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.trackEvent('input_focus', target, {
          inputType: target.getAttribute('type'),
          inputName: target.getAttribute('name')
        });
      }
    }, true);

    // Scroll tracking
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

    // Navigation tracking
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

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', null, {
        hidden: document.hidden
      });
    });

    // Track page errors
    window.addEventListener('error', (e) => {
      this.trackEvent('error', null, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });
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

  public getSessionId(): string {
    return this.sessionId;
  }
}

export const analytics = new AnalyticsTracker();

// Named export for convenience
export function trackEvent(eventType: string, metadata?: any) {
  analytics.trackCustomEvent(eventType, metadata);
}

// Export session ID getter
export function getSessionId(): string {
  return analytics.getSessionId();
}
