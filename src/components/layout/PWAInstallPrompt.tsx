'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Smartphone, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);

  React.useEffect(() => {
    // Hide completely during active learning/speaking sessions to avoid blocking questions
    if (pathname.includes('/learn/session') || pathname.includes('/speaking')) {
      setShowBanner(false);
      return;
    }

    // Check if user previously dismissed prompt
    const isDismissed = localStorage.getItem('lingosnap_pwa_dismissed');
    if (isDismissed) return;

    // Check if already in standalone mode (already installed as PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIphoneOrIpad = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(isIphoneOrIpad);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner on iOS if not installed
    if (isIphoneOrIpad) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('lingosnap_pwa_dismissed', 'true');
  };

  // Do not render banner during active learning/quiz session
  if (!showBanner || pathname.includes('/learn/session') || pathname.includes('/speaking')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      <div className="bg-[var(--color-surface)] border-2 border-[var(--color-primary)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-black text-xs sm:text-sm text-[var(--color-foreground)] truncate">
                LingoSnap 앱 설치
              </h3>
              <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 shrink-0">
                <WifiOff className="w-2.5 h-2.5" /> 오프라인
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[var(--color-muted-foreground)] font-medium truncate">
              {isIOS ? '공유 ➔ 홈 화면에 추가를 눌러 설치' : '인터넷 없이 오프라인 앱으로 사용하세요'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> 설치
            </button>
          )}

          <button
            onClick={handleDismiss}
            aria-label="닫기"
            className="p-1.5 rounded-full text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
