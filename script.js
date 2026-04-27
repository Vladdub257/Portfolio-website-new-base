/**
 * Freelance Portfolio - Vanilla JavaScript
 * Handles mobile navigation, smooth scrolling, scroll animations, and contact form state.
 */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNavigation();
  initHeaderScrollState();
  initSmoothScroll();
  initFadeInAnimations();
  initContactForm();
});

/**
 * Mobile navigation
 */
function initMobileNavigation() {
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    var clickedInsideToggle = navToggle.contains(event.target);
    var clickedInsideMenu = navMenu.contains(event.target);

    if (!clickedInsideToggle && !clickedInsideMenu) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

/**
 * Header scroll state
 */
function initHeaderScrollState() {
  var header = document.getElementById('header');

  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/**
 * Smooth scroll for same-page anchor links
 */
function initSmoothScroll() {
  var header = document.getElementById('header');
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var href = anchor.getAttribute('href');

      if (!href || href === '#') return;

      var target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      var headerOffset = header ? header.offsetHeight : 0;
      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Fade-in animations on scroll
 */
function initFadeInAnimations() {
  var fadeGroups = [
    { selector: '.about-column', stagger: true },
    { selector: '.process-step', stagger: true },
    { selector: '.pricing', stagger: false },
    { selector: '.project', stagger: true },
    { selector: '.contact-form-wrapper', stagger: false }
  ];

  var fadeElements = [];

  fadeGroups.forEach(function (group) {
    var elements = document.querySelectorAll(group.selector);

    elements.forEach(function (element, index) {
      element.classList.add('fade-in');

      if (group.stagger && index < 3) {
        element.classList.add('fade-in-delay-' + (index + 1));
      }

      fadeElements.push(element);
    });
  });

  function checkVisibility() {
    var triggerPoint = window.innerHeight * 0.88;

    fadeElements.forEach(function (element) {
      if (element.getBoundingClientRect().top < triggerPoint) {
        element.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility();
}

/**
 * Contact form handling
 */
function initContactForm() {
  var contactForm = document.getElementById('contact-form');
  var formHeader = document.getElementById('form-header');
  var formSuccess = document.getElementById('form-success');

  if (!contactForm || !formSuccess) return;

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    var submitButton = contactForm.querySelector('button[type="submit"]');
    var originalButtonText = submitButton ? submitButton.textContent : '';

    var formData = {
      name: getInputValue('name'),
      email: getInputValue('email'),
      projectType: getInputValue('project-type'),
      budget: getInputValue('budget'),
      description: getInputValue('description')
    };

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      var response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      var result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Form submission failed');
      }

      contactForm.classList.add('hidden');

      if (formHeader) {
        formHeader.classList.add('hidden');
      }

      formSuccess.classList.add('visible');
      formSuccess.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || 'Send Project Inquiry';
      }
    }
  });
}

/**
 * Safely reads a form field value by id.
 */
function getInputValue(id) {
  var input = document.getElementById(id);
  return input ? input.value.trim() : '';
}