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

  function normalizeTarget(item) {
    if (item && item.new_tab === true) return ' target="_blank" rel="noopener noreferrer"';
    return '';
  }

  function renderContacts(items) {
    var container = document.getElementById('contact-items');
    if (!container) return;

    var rows = asArray(items);
    if (!rows.length) return;

    container.innerHTML = rows.map(function (item) {
      var iconClass = item && item.icon_class ? item.icon_class : 'fas fa-link';
      var title = item && item.title ? item.title : 'Contact';
      var value = item && item.value ? item.value : '';
      var href = item && item.href ? item.href : '';

      var body = href
        ? '<a href="' + escapeHtml(href) + '"' + normalizeTarget(item) + '>' + escapeHtml(value) + '</a>'
        : '<p>' + escapeHtml(value) + '</p>';

      return '' +
        '<div class="contact-item">' +
        '<i class="' + escapeHtml(iconClass) + '"></i>' +
        '<h2>' + escapeHtml(title) + '</h2>' +
        body +
        '</div>';
    }).join('');
  }

  async function initContactFromRepo() {
    if (!window.VCPublicContent) {
      finishPageLoading();
      return;
    }

    try {
      var payload = await window.VCPublicContent.loadRepoJson('content.json', './content.json');
      var contact = payload.data && payload.data.contact ? payload.data.contact : null;
      if (!contact) return;

      var titleNode = document.getElementById('contact-title');
      var subtitleNode = document.getElementById('contact-subtitle');

      if (titleNode && contact.title) titleNode.textContent = contact.title;
      if (subtitleNode && contact.subtitle) subtitleNode.textContent = contact.subtitle;

      renderContacts(contact.items);
    } catch (error) {
      // Keep static fallback content on failure.
    } finally {
      finishPageLoading();
    }
  }

  document.addEventListener('DOMContentLoaded', initContactFromRepo);
})();
