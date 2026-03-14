(function () {
  var EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function toDate(value) {
    if (!value) return null;
    var v = String(value).trim().toLowerCase();
    if (v === 'present' || v === 'now') return new Date();

    // Support YYYY, YYYY-MM, YYYY-MM-DD
    var parts = v.split('-');
    var year = parseInt(parts[0], 10);
    if (!year || isNaN(year)) return null;
    var month = parts.length > 1 ? parseInt(parts[1], 10) - 1 : 0;
    var day = parts.length > 2 ? parseInt(parts[2], 10) : 1;
    return new Date(year, month, day);
  }

  function diffInMonths(start, end) {
    if (!start || !end) return 0;
    var months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    // If the end day is before the start day, subtract one month.
    if (end.getDate() < start.getDate()) {
      months -= 1;
    }

    return Math.max(0, months);
  }

  function formatDuration(months) {
    if (months <= 0) return '0 mos';
    var years = Math.floor(months / 12);
    var rem = months % 12;
    var parts = [];
    if (years > 0) parts.push(years + (years === 1 ? ' yr' : ' yrs'));
    if (rem > 0) parts.push(rem + (rem === 1 ? ' mo' : ' mos'));
    return parts.join(' ');
  }

  function setExperienceDurations() {
    var nodes = document.querySelectorAll('[data-experience-start]');
    nodes.forEach(function (node) {
      var start = toDate(node.getAttribute('data-experience-start'));
      var endAttr = node.getAttribute('data-experience-end');
      var end = endAttr ? toDate(endAttr) : new Date();
      var months = diffInMonths(start, end);
      node.textContent = formatDuration(months);
    });
  }

  function setCopyrightYears() {
    var year = new Date().getFullYear();
    var nodes = document.querySelectorAll('.js-copyright-year');
    nodes.forEach(function (node) {
      var start = parseInt(node.getAttribute('data-start-year'), 10);
      if (start && start < year) {
        node.textContent = start + '-' + year;
      } else {
        node.textContent = String(year);
      }
    });
  }

  function createNavLink(href, label) {
    var link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    return link;
  }

  function hasBlogLink(container) {
    if (!container) return false;
    var links = container.querySelectorAll('a');
    return Array.prototype.some.call(links, function (link) {
      return /\/?Blogs(?:\.html)?$/.test(link.getAttribute('href') || '') ||
        (link.textContent || '').trim().toLowerCase() === 'blog';
    });
  }

  function injectBlogNavLink() {
    var containers = document.querySelectorAll('.desktop-nav, .nav-sheet-content');
    containers.forEach(function (container) {
      if (hasBlogLink(container)) return;

      var blogLink = createNavLink('./Blogs', 'Blog');
      var contactLink = Array.prototype.find.call(container.querySelectorAll('a'), function (link) {
        return (link.textContent || '').trim().toLowerCase() === 'contact';
      });

      if (contactLink) {
        container.insertBefore(blogLink, contactLink);
      } else {
        container.appendChild(blogLink);
      }
    });
  }

  function setRevealMotion() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targets = document.querySelectorAll([
      '.hero',
      '.project-item',
      '.practice-item',
      '.overview-item',
      '.preview-item',
      '.resume-section',
      '.vcook-section',
      '.main-block',
      '.project-details > *',
      '.blog-card',
      '.blog-shell',
      '.blog-layout'
    ].join(','));

    if (!targets.length) return;

    targets.forEach(function (el, idx) {
      el.classList.add('js-reveal');
      el.style.setProperty('--reveal-index', String(idx % 8));
      if (reduceMotion) {
        el.classList.add('is-visible');
      }
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.style.transitionTimingFunction = EASE_OUT_QUINT;
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectBlogNavLink();
    setExperienceDurations();
    setCopyrightYears();
    setRevealMotion();
  });
})();
