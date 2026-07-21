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

  function normalizePageHref(href) {
    if (!href) return '#';
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
    if (/\.html(?:[?#]|$)/i.test(href)) return href;
    if (/^\.\/[A-Za-z0-9_-]+(?:[?#].*)?$/.test(href)) {
      return href.replace(/^(\.\/[A-Za-z0-9_-]+)(.*)$/, '$1.html$2');
    }
    return href;
  }

  function renderProjects(projects, sourceType) {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;

    var items = asArray(projects && projects.items);
    if (!items.length) return;

    grid.innerHTML = items.map(function (item) {
      var href = normalizePageHref(item && item.href ? item.href : '#');
      var title = item && item.title ? item.title : 'Untitled';
      var description = item && item.description ? item.description : '';
      var image = item && item.image ? window.VCPublicContent.resolveAssetUrl(item.image, sourceType) : '';
      var imageAlt = item && item.image_alt ? item.image_alt : title;
      var variant = item && item.variant_class ? ' ' + item.variant_class : '';

      return '' +
        '<a href="' + escapeHtml(href) + '" class="project-item' + escapeHtml(variant) + '">' +
        (image ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(imageAlt) + '">' : '') +
        '<h2>' + escapeHtml(title) + '</h2>' +
        '<p>' + escapeHtml(description) + '</p>' +
        '</a>';
    }).join('');
  }

  async function initProjectsFromRepo() {
    if (!window.VCPublicContent) {
      finishPageLoading();
      return;
    }

    try {
      var payload = await window.VCPublicContent.loadRepoJson('content.json', './content.json');
      var projects = payload.data && payload.data.projects ? payload.data.projects : null;
      if (!projects) return;

      var titleNode = document.getElementById('projects-title');
      var subtitleNode = document.getElementById('projects-subtitle');

      if (titleNode && projects.title) titleNode.textContent = projects.title;
      if (subtitleNode && projects.subtitle) subtitleNode.textContent = projects.subtitle;

      renderProjects(projects, payload.sourceType);
    } catch (error) {
      // Keep static fallback content on failure.
    } finally {
      finishPageLoading();
    }
  }

  document.addEventListener('DOMContentLoaded', initProjectsFromRepo);
})();
