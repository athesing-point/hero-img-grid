// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Select elements needed later
    const heroSection = document.querySelector(".hero-section");
    const allWraps = gsap.utils.toArray(".hero-img-mask-wrap");
    const specialElements = document.querySelectorAll(".pq-route, .video-trigger");
    // const mouseParallaxIntensity = 10; // REMOVED
    // const wrapData = []; // REMOVED

    // --- Function to Initialize ScrollTrigger Parallax ---
    function initializeScrollTrigger() {
      console.log("Attempting to initialize ScrollTrigger parallax...");
      const scrollParallaxSpeeds = { col1: -20, col2: -40, col3: -60, col4: -80 };
      Object.keys(scrollParallaxSpeeds).forEach((colKey, index) => {
        const colNum = index + 1;
        const speed = scrollParallaxSpeeds[colKey];
        const targetSelector = `.hero-bg-grid [id$="-col${colNum}"]`;
        const targets = gsap.utils.toArray(targetSelector);
        console.log(`Found ${targets.length} elements for selector: ${targetSelector}`);

        if (targets.length > 0) {
          gsap.to(targets, {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-section",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        } else {
          console.log("No elements found for selector: " + targetSelector);
        }
      });
      // Refresh ScrollTrigger once after setting up all tweens, with a tiny delay
      setTimeout(() => {
        console.log("Refreshing ScrollTrigger...");
        ScrollTrigger.refresh();
      }, 10);
    }

    // --- Wait for CSS animation to end on the last item before initializing ScrollTrigger ---
    const lastAnimatedItem = document.querySelector(".hero-bg-grid > .hero-img-mask-wrap:nth-child(9)"); // Adjust if more items

    if (lastAnimatedItem) {
      // Check if animation has already ended (e.g., if loaded quickly or scrolled past)
      // We check computed style opacity; assumes opacity is 1 only after animation
      if (window.getComputedStyle(lastAnimatedItem).opacity === "1") {
        initializeScrollTrigger();
      } else {
        lastAnimatedItem.addEventListener(
          "animationend",
          () => {
            console.log("animationend event fired on last item.");
            initializeScrollTrigger();
          },
          { once: true }
        );
      }
    } else {
      // Fallback: If the 9th item doesn't exist (e.g., fewer items), initialize immediately or with a small delay
      // For simplicity here, we'll initialize immediately, but a short setTimeout could be used.
      initializeScrollTrigger();
      // setTimeout(initializeScrollTrigger, 100); // Alternative fallback
    }

    // --- Setup Mouse Interactions (Called directly now) ---
    setupMouseInteractions();

    // --- SVG Arrow Drawing Animation ---
    function initializeArrowAnimation() {
      const arrowSvg = document.querySelector("#hero-arrow-svg");
      if (!arrowSvg) {
        console.log("Arrow SVG (#hero-arrow-svg) not found. Skipping animation. Ensure it's embedded inline.");
        return;
      }
      const arrowPathMain = arrowSvg.querySelector("#arrow-path-main");
      const arrowPathHead = arrowSvg.querySelector("#arrow-path-head");

      if (!arrowPathMain || !arrowPathHead) {
        console.log("Arrow paths (#arrow-path-main or #arrow-path-head) not found within the SVG.");
        return;
      }

      // Get lengths of paths
      const mainLength = arrowPathMain.getTotalLength();
      const headLength = arrowPathHead.getTotalLength();

      // Set initial state: hide paths by making dash offset equal to length
      gsap.set([arrowPathMain, arrowPathHead], {
        strokeDasharray: (i, target) => target.getTotalLength(),
        strokeDashoffset: (i, target) => target.getTotalLength(),
        autoAlpha: 1, // Ensure paths are visible once drawn
      });

      // Create timeline for drawing animation triggered by scroll
      const arrowTl = gsap.timeline({
        scrollTrigger: {
          trigger: arrowSvg,
          start: "top 85%", // Start animation when 85% of the SVG top hits the viewport bottom
          end: "bottom 60%", // Adjust timing as needed
          scrub: 1, // Smooth scrubbing effect
          // markers: true, // Uncomment for debugging ScrollTrigger bounds
        },
      });

      // Animate the drawing
      arrowTl.to(arrowPathMain, { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" }).to(arrowPathHead, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, "-=1.2"); // Start head slightly before main line finishes
    }

    // Call the arrow animation setup function
    // Ensure this is called after potential waits (like animationend) if needed,
    // but for now, let's try calling it directly after mouse interactions setup.
    // If the arrow SVG is part of the initially animated grid, it might need adjustment.
    initializeArrowAnimation();

    // --- Mouse Interactions Setup Function ---
    function setupMouseInteractions() {
      // Setup quickTo for General Mouse Parallax (REMOVED)
      /*
      allWraps.forEach((wrap, i) => {
        const duration = gsap.utils.random(0.6, 1.0);
        wrapData.push({
          element: wrap,
          xTo: gsap.quickTo(wrap, "x", { duration: duration, ease: "power2" }),
          yTo: gsap.quickTo(wrap, "y", { duration: duration, ease: "power2" }),
        });
      });
      */

      // REMOVED handleMouseMove and handleMouseLeave functions
      /*
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
      */

      // Add general parallax listeners only if heroSection exists (REMOVED)
      /*
      if (heroSection) {
        heroSection.addEventListener("mousemove", handleMouseMove);
        heroSection.addEventListener("mouseleave", handleMouseLeave);
      }
      */

      // Setup Specific Hover Effects
      specialElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            scale: 1.03, // Reduced scale
            // filter: "brightness(1.05)", // Optional: Reduced brightness or remove
            duration: 0.3,
            ease: "power1.out",
            overwrite: "auto",
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            scale: 1,
            // filter: "brightness(1)", // Match removal if filter was removed above
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
