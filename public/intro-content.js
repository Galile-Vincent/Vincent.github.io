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

  function renderSocialLinks(links) {
    var container = document.getElementById('intro-social-links');
    if (!container) return;

    container.innerHTML = asArray(links).map(function (item) {
      var href = item && item.url ? item.url : '#';
      var label = item && item.label ? item.label : 'Link';
      var iconClass = item && item.icon_class ? item.icon_class : 'fas fa-link';
      return '' +
        '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(label) + '">' +
        '<i class="' + escapeHtml(iconClass) + '"></i>' +
        '</a>';
    }).join('');
  }

  function renderParagraphs(paragraphs) {
    var container = document.getElementById('intro-text-content');
    if (!container) return;

    container.innerHTML = asArray(paragraphs).map(function (line) {
      return '<p>' + escapeHtml(line) + '</p>';
    }).join('');
  }

  async function initIntroFromRepo() {
    if (!window.VCPublicContent) {
      finishPageLoading();
      return;
    }

    try {
      var payload = await window.VCPublicContent.loadRepoJson('content.json', './content.json');
      var intro = payload.data && payload.data.intro ? payload.data.intro : null;
      if (!intro) return;

      var name = document.getElementById('intro-name');
      var subtitle = document.getElementById('intro-subtitle');
      var image = document.getElementById('intro-profile-image');

      if (name && intro.name) name.textContent = intro.name;
      if (subtitle && intro.subtitle) subtitle.textContent = intro.subtitle;
      if (image && intro.image) {
        image.src = window.VCPublicContent.resolveAssetUrl(intro.image, payload.sourceType);
        image.alt = intro.image_alt || intro.name || 'Profile image';
      }

      renderSocialLinks(intro.social_links);
      renderParagraphs(intro.paragraphs);
    } catch (error) {
      // Keep static fallback content on failure.
    } finally {
      finishPageLoading();
    }
  }

  document.addEventListener('DOMContentLoaded', initIntroFromRepo);
})();
