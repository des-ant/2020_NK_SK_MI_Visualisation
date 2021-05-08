gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollToPlugin);


// This pins the SVG animation wrapper when it hits the center of the viewport
// and releases the pin when the final textbox meets the bottom of the svg
// We use a function to define the end point to line up the top of the
// title box with the bottom of the svg
ScrollTrigger.create({
  trigger: '#svg-1-1',
  toggleActions: "play pause resume reset",
  endTrigger: '#svg-end-1-1',
  start: 'center center',
  end: () => {
    const height = window.innerHeight;
    const svgHeight = document.querySelector('#svg-1-1')
      .offsetHeight;
    return `top ${svgHeight + (height - svgHeight) / 2}px`;
  },
  pin: true,
  pinSpacing: false,
  markers: true,
  scrub: true,
  id: 'svg-pin-1-1'
});

// Svg animation
var t1 = gsap.timeline({
  repeat: -1,
  scrollTrigger: {
    trigger: '#svg-1-1',
    toggleActions: "play pause resume reset",
    endTrigger: '#svg-end-1-1',
    start: 'top 80%',
    end: 'top 20%',
    // markers: true,
    id: 'svg-1-1'
  }
});

