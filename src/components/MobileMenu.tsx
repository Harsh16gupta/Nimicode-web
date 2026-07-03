import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star, Terminal, Github } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState('1,428');

  useEffect(() => {
    // Fetch GitHub stars count
    fetch('https://api.github.com/repos/Harsh16gupta/Nimicode-web')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count.toLocaleString());
        }
      })
      .catch(() => {
        // Fallback to static count
        setStars('1,428');
      });
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { name: 'Docs', href: 'https://github.com/Harsh16gupta/Nimicode-web#readme' },
    { name: 'Tools', href: '/tools' },
    { name: 'Providers', href: '/providers' },
    { name: 'GitHub', href: 'https://github.com/Harsh16gupta/Nimicode-web' },
    { name: 'Roadmap', href: '/roadmap' }
  ];

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const sheetVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0, 
      transition: { 
        ease: [0.22, 1, 0.36, 1], 
        duration: 0.42 
      } 
    },
    exit: { 
      x: '100%', 
      transition: { 
        ease: [0.22, 1, 0.36, 1], 
        duration: 0.3 
      } 
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: 0.16 + i * 0.06,
        ease: [0.22, 1, 0.36, 1], 
        duration: 0.4 
      }
    })
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-text/80 hover:text-text transition-colors rounded-lg hover:bg-black/5"
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-[rgba(20,22,26,0.28)] backdrop-blur-[4px]"
            />

            {/* Sheet */}
            <motion.div
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 z-[101] w-full max-w-[340px] h-[100dvh] bg-surface shadow-[-12px_0_48px_rgba(20,22,26,0.12)] border-l border-border flex flex-col p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="none">
                    <path d="M32 32 L96 32 L96 96 L160 96 L160 32 L224 32 L224 224 L160 224 L160 128 L96 128 L96 224 L32 224 Z" fill="var(--color-text)"/>
                    <rect x="96" y="96" width="64" height="64" fill="var(--color-accent)"/>
                  </svg>
                  <span className="font-mono text-base font-semibold tracking-tight">nimicode</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text/75 hover:text-text transition-colors rounded-lg hover:bg-black/5"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-border w-full my-2" />

              {/* Navigation Links */}
              <nav className="flex flex-col gap-6 py-6">
                {links.map((link, i) => (
                  <motion.a
                    key={link.name}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-text-muted hover:text-text transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              {/* Spacer */}
              <div className="flex-grow" />

              {/* Bottom CTAs */}
              <div className="flex flex-col gap-3 pt-6 border-t border-border">
                {/* GitHub star pill */}
                <a
                  href="https://github.com/Harsh16gupta/Nimicode-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border rounded-full px-4 py-2.5 text-sm font-mono flex items-center justify-center gap-1.5 hover:border-text transition-colors bg-bg/50"
                >
                  <Star size={14} className="fill-current" />
                  <span>Star</span>
                  <span className="text-text-muted text-xs">|</span>
                  <span className="text-text font-semibold">{stars}</span>
                </a>

                {/* Install action */}
                <a
                  href="#install"
                  onClick={() => setIsOpen(false)}
                  className="bg-accent hover:bg-accent-hover text-white rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Terminal size={16} />
                  <span>Install nimicode</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
