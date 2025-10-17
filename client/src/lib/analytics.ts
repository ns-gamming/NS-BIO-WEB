
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
  private mouseMovements: any[] = [];
  private lastMousePosition = { x: 0, y: 0 };
  private interactionStartTime: number = 0;

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
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth
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
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      connection: this.getConnectionInfo(),
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      maxTouchPoints: navigator.maxTouchPoints || 0
    };
  }

  private getConnectionInfo() {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!conn) return 'unknown';
    return {
      effectiveType: conn.effectiveType || 'unknown',
      downlink: conn.downlink || 'unknown',
      rtt: conn.rtt || 'unknown',
      saveData: conn.saveData || false
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
      const checkResponse = await fetch(`/api/analytics/session/${this.sessionId}/check`);
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
          console.error('Failed to create session');
          return;
        }
      }

      this.isInitialized = true;
      this.trackPageView();
      this.setupEventListeners();
      this.setupBeforeUnload();
      this.trackMouseMovements();
      this.trackPerformanceMetrics();
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
          referrer: document.referrer,
          metadata: {
            hash: window.location.hash,
            protocol: window.location.protocol,
            host: window.location.host,
            timestamp: new Date().toISOString()
          }
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
    const scrollDepth = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    try {
      await fetch(`/api/analytics/pageview/${this.currentPageViewId}/time`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timeSpent,
          scrollDepth: scrollDepth || 0
        })
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
          elementClass: element?.className || null,
          pageUrl: window.location.pathname + window.location.search,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
            pageX: (metadata as any)?.x || 0,
            pageY: (metadata as any)?.y || 0
          },
          mousePosition: {
            x: this.lastMousePosition.x,
            y: this.lastMousePosition.y
          },
          viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        })
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private trackMouseMovements() {
    let mouseMoveTimeout: NodeJS.Timeout;
    
    document.addEventListener('mousemove', (e) => {
      this.lastMousePosition = { x: e.clientX, y: e.clientY };
      this.mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      if (this.mouseMovements.length > 100) {
        this.mouseMovements = this.mouseMovements.slice(-50);
      }

      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        this.saveMouseMovements();
      }, 5000);
    });
  }

  private async saveMouseMovements() {
    if (this.mouseMovements.length === 0) return;

    try {
      await fetch('/api/analytics/mouse-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pageUrl: window.location.pathname + window.location.search,
          mousePath: this.mouseMovements,
          timestamp: new Date().toISOString()
        })
      });
      this.mouseMovements = [];
    } catch (error) {
      console.error('Failed to save mouse movements:', error);
    }
  }

  private async trackPerformanceMetrics() {
    if (!window.performance || !window.performance.timing) return;

    setTimeout(() => {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaint = timing.responseStart - timing.navigationStart;

      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          pageUrl: window.location.pathname + window.location.search,
          loadTimeMs: loadTime,
          domReadyMs: domReady,
          firstPaintMs: firstPaint,
          networkSpeed: this.getConnectionInfo().effectiveType || 'unknown',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Failed to track performance:', err));
    }, 1000);
  }

  private setupEventListeners() {
    // Click tracking with detailed metadata
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const metadata: any = {
        x: e.clientX,
        y: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        button: e.button,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        timestamp: new Date().toISOString()
      };

      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        metadata.buttonType = button?.getAttribute('type') || 'button';
        metadata.buttonText = button?.textContent?.trim().slice(0, 50);
        metadata.buttonId = button?.id;
      }

      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        metadata.href = link?.getAttribute('href');
        metadata.linkText = link?.textContent?.trim().slice(0, 50);
        metadata.linkTarget = link?.getAttribute('target');
      }

      this.trackEvent('click', target, metadata);
    });

    // Form submission tracking
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('form_submit', form, {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method,
        timestamp: new Date().toISOString()
      });
    });

    // Input focus tracking with duration
    document.addEventListener('focus', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.interactionStartTime = Date.now();
        this.trackEvent('input_focus', target, {
          inputType: target.getAttribute('type'),
          inputName: target.getAttribute('name'),
          timestamp: new Date().toISOString()
        });
      }
    }, true);

    // Input blur tracking with time spent
    document.addEventListener('blur', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const timeSpent = Date.now() - this.interactionStartTime;
        this.trackEvent('input_blur', target, {
          inputType: target.getAttribute('type'),
          inputName: target.getAttribute('name'),
          timeSpentMs: timeSpent,
          timestamp: new Date().toISOString()
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
        this.trackEvent('scroll', null, { 
          scrollPercentage,
          scrollY: window.scrollY,
          timestamp: new Date().toISOString()
        });
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
        hidden: document.hidden,
        timestamp: new Date().toISOString()
      });
    });

    // Track page errors with full details
    window.addEventListener('error', (e) => {
      this.trackEvent('error', null, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Track copy/paste events
    document.addEventListener('copy', () => {
      this.trackEvent('copy', null, { timestamp: new Date().toISOString() });
    });

    document.addEventListener('paste', () => {
      this.trackEvent('paste', null, { timestamp: new Date().toISOString() });
    });

    // Track selection
    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        this.trackEvent('text_select', null, {
          selectedText: selection.toString().slice(0, 100),
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', async () => {
      await this.endPageView();
      await this.saveMouseMovements();
      
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
    this.trackEvent(eventType, null, {
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }
}

export const analytics = new AnalyticsTracker();

export function trackEvent(eventType: string, metadata?: any) {
  analytics.trackCustomEvent(eventType, metadata);
}
