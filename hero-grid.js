// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Select elements needed later
    const heroSection = document.querySelector(".hero-section");
    const allWraps = gsap.utils.toArray(".hero-img-mask-wrap");
    const specialElements = document.querySelectorAll(".pq-route, .video-trigger");
    const mouseParallaxIntensity = 10; // Lower intensity for subtle background effect
    const wrapData = []; // To store quickTo functions

    // --- Initial Animation (REMOVED - Now handled by CSS) ---
    /*
    gsap.to(allWraps, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      onComplete: setupMouseInteractions
    });
    */

    // --- Scroll Parallax ---
    const scrollParallaxSpeeds = { col1: -20, col2: -40, col3: -60, col4: -80 };
    Object.keys(scrollParallaxSpeeds).forEach((colKey, index) => {
      const colNum = index + 1;
      const speed = scrollParallaxSpeeds[colKey];
      gsap.to(`.hero-bg-grid [id$="-col${colNum}"]`, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // --- Setup Mouse Interactions (Called directly now) ---
    setupMouseInteractions();

    // --- Mouse Interactions Setup Function ---
    function setupMouseInteractions() {
      // Setup quickTo for General Mouse Parallax
      allWraps.forEach((wrap, i) => {
        const duration = gsap.utils.random(0.6, 1.0);
        wrapData.push({
          element: wrap,
          xTo: gsap.quickTo(wrap, "x", { duration: duration, ease: "power2" }),
          yTo: gsap.quickTo(wrap, "y", { duration: duration, ease: "power2" }),
        });
      });

      const handleMouseMove = (e) => {
        let x = e.clientX - window.innerWidth / 2;
        let y = e.clientY - window.innerHeight / 2;
        let moveX = (x / (window.innerWidth / 2)) * mouseParallaxIntensity;
        let moveY = (y / (window.innerHeight / 2)) * mouseParallaxIntensity;

        wrapData.forEach((data) => {
          data.xTo(moveX);
          data.yTo(moveY);
        });
      };

      const handleMouseLeave = () => {
        wrapData.forEach((data) => {
          data.xTo(0);
          data.yTo(0);
        });
      };

      // Add general parallax listeners only if heroSection exists
      if (heroSection) {
        heroSection.addEventListener("mousemove", handleMouseMove);
        heroSection.addEventListener("mouseleave", handleMouseLeave);
      }

      // Setup Specific Hover Effects
      specialElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            scale: 1.08,
            filter: "brightness(1.1)",
            duration: 0.3,
            ease: "power1.out",
            overwrite: "auto",
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            scale: 1,
            filter: "brightness(1)",
            duration: 0.5,
            ease: "power1.out",
            overwrite: "auto",
          });
        });
      });
    }
  } else {
    console.error("GSAP or ScrollTrigger is not loaded.");
  }
});
