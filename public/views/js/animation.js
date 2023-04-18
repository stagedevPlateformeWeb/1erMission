document.addEventListener('DOMContentLoaded', function () {
  // Animation pour le header
  gsap.from('header', { duration: 1, y: -100, opacity: 0, ease: 'back' });

  // Animation pour les sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    gsap.from(section, {
      duration: 1,
      x: index % 2 === 0 ? -200 : 200,
      opacity: 0,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
      },
    });
  });

  // Animation pour les formulaires
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    gsap.from(form, {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: form,
        start: 'top 80%',
      },
    });
  });

  // Animation pour les divs
  const divs = document.querySelectorAll('div');
  divs.forEach((div) => {
    gsap.from(div, {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: 'power4.out',
    });
  });
  

  // Animation pour le footer
  gsap.from('footer', {
    duration: 1,
    ease: 'back',
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 80%',
    },
    onComplete: function () {
      document.querySelector('footer').style.opacity = 1;
    },
  });
});
