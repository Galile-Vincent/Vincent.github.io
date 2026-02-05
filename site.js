(function () {
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

  document.addEventListener('DOMContentLoaded', function () {
    setExperienceDurations();
    setCopyrightYears();
  });
})();
