/*document.addEventListener('DOMContentLoaded', function () {
  // Animation pour le header
  gsap.from('header', { duration: 0.5, y: -100, opacity: 0, ease: 'expo.out' });

  // Animation pour les sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    gsap.from(section, {
      duration: 0.6,
      x: index % 2 === 0 ? -200 : 200,
      opacity: 0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    });
  });

  // Animation pour les formulaires
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    gsap.from(form, {
      duration: 0.5,
      y: 100,
      opacity: 0,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: form,
        start: 'top 75%',
      },
    });
  });

  // Animation pour les divs
  const divs = document.querySelectorAll('div');
  gsap.from(divs, {
    duration: 0.6,
    y: 100,
    opacity: 0,
    ease: 'expo.out',
    stagger: 0.12,
  });

  // Animation pour le footer
  gsap.from('footer', {
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 75%',
    },
    onComplete: function () {
      document.querySelector('footer').style.opacity = 1;
    },
  });

});

*/
