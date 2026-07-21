(function () {
  function finishPageLoading() {
    document.body.classList.remove('content-loading');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function renderAwardIcon(item, sourceType) {
    if (item && item.icon_image) {
      var iconUrl = window.VCPublicContent.resolveAssetUrl(item.icon_image, sourceType);
      var iconAlt = item.icon_alt || (item.title ? item.title + ' icon' : 'Award icon');
      return '<img src="' + escapeHtml(iconUrl) + '" class="award-img" alt="' + escapeHtml(iconAlt) + '">';
    }
    return escapeHtml(item && item.icon ? item.icon : '🏆');
  }

  function renderAwardLinks(links) {
    return asArray(links).map(function (link) {
      var label = link && link.label ? link.label : 'Learn more';
      var href = link && link.href ? link.href : '#';
      return '<a class="award-link" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + '</a>';
    }).join('');
  }

  function renderAwards(awards, sourceType) {
    var list = document.getElementById('awards-list');
    if (!list) return;

    var rows = asArray(awards && awards.items);
    if (!rows.length) return;

    list.innerHTML = rows.map(function (item) {
      var title = item && item.title ? item.title : 'Award';
      var date = item && item.date ? item.date : '';
      var description = item && item.description ? item.description : '';
      var links = renderAwardLinks(item && item.links);

      return '' +
        '<div class="award-item animate-item">' +
        '<div class="award-icon">' + renderAwardIcon(item, sourceType) + '</div>' +
        '<div class="award-details">' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        (date ? '<p class="award-date">' + escapeHtml(date) + '</p>' : '') +
        (description ? '<p>' + escapeHtml(description) + '</p>' : '') +
        links +
        '</div>' +
        '</div>';
    }).join('');
  }

  function activateAnimations() {
    var animateItems = document.querySelectorAll('.animate-item');
    if (!animateItems.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animateItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  async function initAwardsFromRepo() {
    if (!window.VCPublicContent) {
      finishPageLoading();
      return;
    }

    try {
      var payload = await window.VCPublicContent.loadRepoJson('content.json', './content.json');
      var awards = payload.data && payload.data.awards ? payload.data.awards : null;

      if (awards) {
        var titleNode = document.getElementById('awards-title');
        var subtitleNode = document.getElementById('awards-subtitle');

        if (titleNode && awards.title) titleNode.textContent = awards.title;
        if (subtitleNode && awards.subtitle) subtitleNode.textContent = awards.subtitle;

        renderAwards(awards, payload.sourceType);
      }

      activateAnimations();
    } catch (error) {
      // Keep static fallback content on failure.
      activateAnimations();
    } finally {
      finishPageLoading();
    }
  }

  document.addEventListener('DOMContentLoaded', initAwardsFromRepo);
})();
