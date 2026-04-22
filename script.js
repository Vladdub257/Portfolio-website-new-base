/**
 * Freelance Portfolio - Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var header = document.getElementById('header');
  var navLinks = document.querySelectorAll('.nav-link');

  // Mobile navigation
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Header scroll state
  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var offset = header.offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Fade-in on scroll with staggered delays
  var fadeGroups = [
    { selector: '.about-column', stagger: true },
    { selector: '.process-step', stagger: true },
    { selector: '.pricing', stagger: false },
    { selector: '.project', stagger: true },
    { selector: '.contact-intro', stagger: false },
    { selector: '.contact-form-wrapper', stagger: false }
  ];

  var fadeElements = [];

  fadeGroups.forEach(function (group) {
    var elements = document.querySelectorAll(group.selector);
    elements.forEach(function (el, index) {
      el.classList.add('fade-in');
      if (group.stagger && index < 3) {
        el.classList.add('fade-in-delay-' + (index + 1));
      }
      fadeElements.push(el);
    });
  });

  function checkVisibility() {
    var trigger = window.innerHeight * 0.88;
    fadeElements.forEach(function (el) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility();

  // Contact Form Handling
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var formHeader = document.getElementById('form-header');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      var formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        projectType: document.getElementById('project-type').value,
        budget: document.getElementById('budget').value,
        description: document.getElementById('description').value
      };

      // Log form data for debugging (remove in production)
      console.log('Form submitted:', formData);

      // Simulate form submission
      // In production, replace this with actual form submission logic
      // For example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })

      // Show success message
      contactForm.classList.add('hidden');
      if (formHeader) {
        formHeader.classList.add('hidden');
      }
      formSuccess.classList.add('visible');

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
