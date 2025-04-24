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

      // Animate columns
      Object.keys(scrollParallaxSpeeds).forEach((colKey, index) => {
        const colNum = index + 1;
        const speed = scrollParallaxSpeeds[colKey];
        const targetSelector = `.hero-bg-grid [id$=\"-col${colNum}\"]`;
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

          // --- REMOVED: Animate image within col1 to reveal ---
          // --- END REMOVED ---
        } else {
          console.log("No elements found for selector: " + targetSelector);
        }
      });

      // Refresh ScrollTrigger once after setting up all tweens, with a tiny delay
      setTimeout(() => {
        console.log("Refreshing ScrollTrigger...");
        ScrollTrigger.refresh();
      }, 10); // Maybe increase delay slightly if needed? 50ms?
    }

    // --- GSAP Initial Entrance Animation ---
    // Set initial state (hidden)
    gsap.set(allWraps, { opacity: 0, y: 20 });

    // Animate to final state (visible)
    gsap.to(allWraps, {
      opacity: 1,
      y: 0,
      duration: 0.8, // Duration of the fade/move up
      stagger: 0.1, // Stagger amount between items
      ease: "power2.out",
      delay: 0.2, // Small delay before starting the whole sequence
      onComplete: () => {
        console.log("GSAP entrance animation complete.");
        // Initialize ScrollTrigger Parallax ONLY AFTER entrance animation finishes
        initializeScrollTrigger();
      },
    });

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

      // Store the original dash array value from the main path
      const originalDasharray = arrowPathMain.getAttribute("stroke-dasharray") || "none"; // Fallback to none

      // Set initial state: hide paths by making dash offset equal to length
      // Temporarily set dasharray to full length to make it solid for the draw animation
      gsap.set([arrowPathMain, arrowPathHead], {
        strokeDasharray: (i, target) => target.getTotalLength(), // Solid line = dash = length
        strokeDashoffset: (i, target) => target.getTotalLength(), // Offset = length (hidden)
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

      // Animate the drawing (solid line appears)
      arrowTl
        .to(arrowPathMain, { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" })
        .to(arrowPathHead, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, "-=1.2")
        // After drawing, instantly set the main path back to its original dasharray
        .set(arrowPathMain, { strokeDasharray: originalDasharray }, ">"); // ">" places it at the very end
    }

    // Call the arrow animation setup function
    // Ensure this is called after potential waits (like animationend) if needed,
    // but for now, let's try calling it directly after mouse interactions setup.
    // Now that ScrollTrigger init is delayed, ensure this isn't called too early if it depends on ScrollTrigger's setup.
    // However, this specific arrow animation seems independent or triggers later, so likely okay here.
    // If the arrow SVG is part of the initially animated grid, it might need adjustment.
    initializeArrowAnimation();
  } else {
    console.error("GSAP or ScrollTrigger is not loaded.");
  }
});
