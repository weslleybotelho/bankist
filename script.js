'use strict';

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const imgTargets = document.querySelectorAll('img[data-src]');

const modalOpenAccount = function () {
  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};

modalOpenAccount();

const learnMoreSmooth = function () {
  btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
  });
};

learnMoreSmooth();

const menuScrollSmooth = function () {
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();

    if (e.target.classList.contains('nav__link')) {
      const idToScroll = e.target.getAttribute('href');
      document.querySelector(idToScroll).scrollIntoView({ behavior: 'smooth' });
    }
  });
};

menuScrollSmooth();

const operationsTabs = function () {
  tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));

    // Activate tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};

operationsTabs();

const menuOpacityBehavior = function () {
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) {
          el.style.opacity = this;
          logo.style.opacity = this;
        }
      }, this);
    }
  };

  nav.addEventListener('mouseover', handleHover.bind(0.5));

  nav.addEventListener('mouseout', handleHover.bind(1));
};

menuOpacityBehavior();

const enableMenuAfterHeader = function () {
  const navHeight = nav.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    // get the first element
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null, // observe all the window
    threshold: 0, //end of the header element
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
};

enableMenuAfterHeader();

const revealSectionsDueScroll = function () {
  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
};

const lazyLoadingImgs = function () {
  const loadImg = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
  });

  imgTargets.forEach(img => imgObserver.observe(img));
};

lazyLoadingImgs();

const slider = function () {
  let currentSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots_dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;

    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const initSliders = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };

  initSliders();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // easy way to get the 'slide' property from dataset.slide
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

slider();
