import { useEffect, useCallback } from "react";

export function useEasterEggs() {
  const showToast = useCallback((message: string, duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-2xl z-[9999] animate-pulse-neon';
    toast.style.animation = 'fadeUp 0.5s ease-out forwards';
    toast.innerHTML = `
      <div class="text-center">
        <div class="text-lg font-semibold text-primary">${message}</div>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeUp 0.5s ease-out reverse forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, duration);
  }, []);

  const createConfettiPiece = useCallback((container: HTMLElement) => {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '100vh';
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    container.appendChild(piece);

    setTimeout(() => {
      if (piece.parentNode) {
        piece.parentNode.removeChild(piece);
      }
    }, 600);
  }, []);

  const triggerConfettiEasterEgg = useCallback(() => {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;

    // Create confetti pieces
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        createConfettiPiece(confettiContainer);
      }, i * 50);
    }

    // Show personal message
    setTimeout(() => {
      showToast("Thank you for stopping by — you rock! 🎉❤️", 3000);
    }, 500);
  }, [createConfettiPiece, showToast]);

  const showPersonalMessage = useCallback(() => {
    const messages = [
      "Keep going, keep building! 💪",
      "You're not alone — join the family! ❤️",
      "Coding se duniya badlegi! 🌟",
      "Thank you yaar — you mean a lot! 🙏",
      "Chalo next level! 🚀"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    showToast(randomMessage, 2500);
  }, [showToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // N key confetti easter egg
      if (e.key.toLowerCase() === 'n') {
        triggerConfettiEasterEgg();
      }
      
      // Escape key to close mobile menu
      if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    };

    const handleAvatarClick = () => {
      showPersonalMessage();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    
    // Add click listeners to avatars
    const avatars = document.querySelectorAll('[class*="rounded-full"]');
    avatars.forEach(avatar => {
      avatar.addEventListener('click', handleAvatarClick);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      avatars.forEach(avatar => {
        avatar.removeEventListener('click', handleAvatarClick);
      });
    };
  }, [triggerConfettiEasterEgg, showPersonalMessage]);
}
