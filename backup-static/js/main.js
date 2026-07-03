// Nimicode Website Global Scripts

document.addEventListener("DOMContentLoaded", () => {
  setupNavbarScroll();
  setupCopyToClipboard();
  setupScrollAnimations();
  fetchGithubStars();
});

/**
 * Translucent navbar scroll effect
 */
function setupNavbarScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  // Initial check
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * Copy to clipboard utility
 */
function setupCopyToClipboard() {
  const copyButtons = document.querySelectorAll(".install-copy-btn, .copy-btn");
  
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-copy-target");
      let textToCopy = "";

      if (targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        textToCopy = targetElement ? targetElement.textContent.trim() : "";
      } else {
        // Fallback to siblings or parent parsing
        const parent = btn.closest(".install-command-box, pre");
        if (parent) {
          const textEl = parent.querySelector(".install-command-text, code");
          textToCopy = textEl ? textEl.textContent.trim() : "";
        }
      }

      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        btn.classList.add("copied");
        const originalHtml = btn.innerHTML;
        
        // Show check icon
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = originalHtml;
        }, 2000);
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    });
  });
}

/**
 * Intersection Observer for staggered entry animations
 */
function setupScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (elements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -8% 0px", // Trigger slightly before element enters fully
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add subtle staggered delay for multiple siblings entering at once
        const element = entry.target;
        
        // Check if there is an existing delay requested via style
        if (!element.style.transitionDelay) {
          const stagger = element.getAttribute("data-stagger") || 0;
          if (stagger > 0) {
            element.style.transitionDelay = `${stagger * 60}ms`;
          }
        }
        
        element.classList.add("revealed");
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  elements.forEach((el, index) => {
    // Add data-stagger based on child position in grid structures
    const parent = el.parentElement;
    if (parent && (parent.classList.contains("tools-grid") || parent.classList.contains("loop-steps"))) {
      const children = Array.from(parent.children);
      const childIndex = children.indexOf(el);
      if (childIndex !== -1) {
        el.setAttribute("data-stagger", childIndex);
      }
    }
    observer.observe(el);
  });
}

/**
 * Fetch stars count from GitHub
 */
function fetchGithubStars() {
  const starsBadge = document.querySelector(".github-stars-count");
  if (!starsBadge) return;

  const repo = "Harsh16gupta/Nimicode-web"; // Target repository

  // Fetch with fallback
  fetch(`https://api.github.com/repos/${repo}`)
    .then(response => {
      if (!response.ok) throw new Error("API Limit or Error");
      return response.json();
    })
    .then(data => {
      if (data.stargazers_count !== undefined) {
        let stars = data.stargazers_count;
        if (stars >= 1000) {
          stars = (stars / 1000).toFixed(1) + "k";
        }
        starsBadge.textContent = stars;
      }
    })
    .catch(err => {
      // Quiet fail - keep beautiful static default
      console.log("Using default fallback star count:", err.message);
    });
}
