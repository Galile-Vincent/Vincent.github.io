(function () {
  function finishPageLoading() {
    document.body.classList.remove('content-loading');
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function decodeEntities(text) {
    return String(text)
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'');
  }

  function resolveMarkdownAssetUrl(url, markdownUrl) {
    if (!url) return '';
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(url)) return url;
    if (!markdownUrl) return url;
    try {
      return new URL(url, markdownUrl).href;
    } catch (error) {
      return url;
    }
  }

  function inlineMarkdown(text, options) {
    var markdownUrl = options && options.markdownUrl ? options.markdownUrl : '';
    var escaped = escapeHtml(text);
    return escaped
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (match, alt, src) {
        var resolvedSrc = resolveMarkdownAssetUrl(decodeEntities(src), markdownUrl);
        return '<img src="' + escapeHtml(resolvedSrc) + '" alt="' + alt + '" loading="lazy">';
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, label, href) {
        var resolvedHref = resolveMarkdownAssetUrl(decodeEntities(href), markdownUrl);
        if (/^https?:\/\//i.test(resolvedHref)) {
          return '<a href="' + escapeHtml(resolvedHref) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
        }
        return '<a href="' + escapeHtml(resolvedHref) + '">' + label + '</a>';
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function markdownToHtml(markdown, options) {
    var lines = String(markdown || '').replace(/\r/g, '').split('\n');
    var html = [];
    var i = 0;
    var inCode = false;
    var codeLines = [];

    function pushCodeBlock() {
      if (!codeLines.length) return;
      html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
      codeLines = [];
    }

    while (i < lines.length) {
      var line = lines[i];

      if (/^```/.test(line.trim())) {
        if (inCode) {
          pushCodeBlock();
          inCode = false;
        } else {
          inCode = true;
        }
        i += 1;
        continue;
      }

      if (inCode) {
        codeLines.push(line);
        i += 1;
        continue;
      }

      if (!line.trim()) {
        i += 1;
        continue;
      }

      var heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        var level = heading[1].length;
        html.push('<h' + level + '>' + inlineMarkdown(heading[2].trim(), options) + '</h' + level + '>');
        i += 1;
        continue;
      }

      if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
        html.push('<hr>');
        i += 1;
        continue;
      }

      if (/^>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          quote.push(lines[i].replace(/^>\s?/, ''));
          i += 1;
        }
        html.push('<blockquote>' + inlineMarkdown(quote.join(' '), options) + '</blockquote>');
        continue;
      }

      if (/^\d+\.\s+/.test(line.trim())) {
        var ordered = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          ordered.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i += 1;
        }
        html.push('<ol>' + ordered.map(function (item) {
          return '<li>' + inlineMarkdown(item, options) + '</li>';
        }).join('') + '</ol>');
        continue;
      }

      if (/^[-*]\s+/.test(line.trim())) {
        var unordered = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          unordered.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i += 1;
        }
        html.push('<ul>' + unordered.map(function (item) {
          return '<li>' + inlineMarkdown(item, options) + '</li>';
        }).join('') + '</ul>');
        continue;
      }

      var paragraph = [line.trim()];
      i += 1;
      while (i < lines.length && lines[i].trim() &&
        !/^(#{1,6})\s+/.test(lines[i]) &&
        !/^```/.test(lines[i].trim()) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i].trim()) &&
        !/^[-*]\s+/.test(lines[i].trim()) &&
        !/^(-{3,}|\*{3,})$/.test(lines[i].trim())) {
        paragraph.push(lines[i].trim());
        i += 1;
      }
      html.push('<p>' + inlineMarkdown(paragraph.join(' '), options) + '</p>');
    }

    if (inCode) pushCodeBlock();
    return html.join('');
  }

  function toText(value) {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    return value.en || value['zh-TW'] || '';
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function ensureMarkdownUrl(markdownPath, sourceType) {
    if (!markdownPath) return '';
    if (/^https?:\/\//i.test(markdownPath)) return markdownPath;

    if (window.VCPublicContent && sourceType === 'remote') {
      return window.VCPublicContent.toRawUrl(markdownPath);
    }

    return markdownPath;
  }

  function resolveImageUrl(imagePath, sourceType) {
    if (!imagePath) return '';
    if (!window.VCPublicContent) return imagePath;
    return window.VCPublicContent.resolveAssetUrl(imagePath, sourceType);
  }

  function normalizePost(post, sourceType) {
    return {
      id: String(post.id || post.slug || '').trim(),
      title: toText(post.title || ''),
      intro: toText(post.intro || post.sub_title || ''),
      image: resolveImageUrl(post.image_link || post.image || 'img/vc.jpeg', sourceType),
      publishDate: post.publish_date || post.date || '',
      markdownUrl: ensureMarkdownUrl(post.markdown_url || post.markdown_path, sourceType)
    };
  }

  async function loadBlogData() {
    var payload = await window.VCPublicContent.loadRepoJson('blogs.json', './blogs.json');
    var sourceType = payload.sourceType || 'local';
    var source = Array.isArray(payload.data && payload.data.blogs) ? payload.data.blogs : [];

    return source.map(function (post) {
      return normalizePost(post, sourceType);
    }).filter(function (post) {
      return post.id && post.title && post.markdownUrl;
    });
  }

  function renderBlogList(posts) {
    var container = document.getElementById('blog-list');
    var empty = document.getElementById('blog-empty');
    if (!container) return;

    if (!posts.length) {
      empty.hidden = false;
      return;
    }

    container.innerHTML = posts.map(function (post) {
      return '' +
        '<a class="blog-card" href="./Blog.html?id=' + encodeURIComponent(post.id) + '">' +
        '<figure class="blog-card__image-wrap">' +
        '<img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
        '</figure>' +
        '<div class="blog-card__body">' +
        '<p class="blog-card__date">' + escapeHtml(formatDate(post.publishDate)) + '</p>' +
        '<h2 class="blog-card__title">' + escapeHtml(post.title) + '</h2>' +
        '<p class="blog-card__intro">' + escapeHtml(post.intro) + '</p>' +
        '</div>' +
        '</a>';
    }).join('');

    activateReveals(container.querySelectorAll('.blog-card'));
  }

  function renderError(message, selector) {
    var node = document.querySelector(selector);
    if (!node) return;
    node.innerHTML = '<p class="blog-error">' + escapeHtml(message) + '</p>';
  }

  function activateReveals(nodes) {
    if (!nodes || !nodes.length) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    nodes.forEach(function (node, idx) {
      node.classList.add('js-reveal');
      node.style.setProperty('--reveal-index', String(idx % 8));
      if (reduceMotion) node.classList.add('is-visible');
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  async function renderBlogDetail(posts) {
    var article = document.getElementById('blog-article');
    if (!article) return;

    var params = new URLSearchParams(window.location.search);
    var postId = params.get('id');

    if (!postId) {
      renderError('No blog id was provided. Open a post from the Blog page.', '#blog-markdown');
      return;
    }

    var post = posts.find(function (item) { return item.id === postId; });
    if (!post) {
      renderError('Post not found in blogs.json. Please check the id.', '#blog-markdown');
      return;
    }

    document.title = 'Vincent | ' + post.title;
    document.getElementById('blog-article-title').textContent = post.title;
    document.getElementById('blog-article-intro').textContent = post.intro;
    document.getElementById('blog-article-date').textContent = formatDate(post.publishDate);

    var image = document.getElementById('blog-article-image');
    if (post.image) {
      image.src = post.image;
      image.alt = post.title;
      image.parentElement.hidden = false;
    } else {
      image.parentElement.hidden = true;
    }

    try {
      var markdownResponse = await fetch(post.markdownUrl, { cache: 'no-store' });
      if (!markdownResponse.ok) throw new Error('Unable to load markdown from remote source.');
      var markdown = await markdownResponse.text();
      document.getElementById('blog-markdown').innerHTML = markdownToHtml(markdown, { markdownUrl: post.markdownUrl });
    } catch (error) {
      renderError('Could not load markdown content. Check the markdown URL in blogs.json.', '#blog-markdown');
    }
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var blogListPage = document.getElementById('blog-list');
    var blogDetailPage = document.getElementById('blog-article');
    if (!blogListPage && !blogDetailPage) {
      finishPageLoading();
      return;
    }

    if (!window.VCPublicContent) {
      if (blogListPage) {
        renderError('Missing site loader. Please include site.js before blog.js.', '#blog-list');
      }
      if (blogDetailPage) {
        renderError('Missing site loader. Please include site.js before blog.js.', '#blog-markdown');
      }
      finishPageLoading();
      return;
    }

    try {
      var posts = await loadBlogData();
      renderBlogList(posts);
      await renderBlogDetail(posts);
    } catch (error) {
      if (blogListPage) {
        renderError('Unable to load blog data. Please verify blogs.json in VC_Blog or local fallback.', '#blog-list');
      }
      if (blogDetailPage) {
        renderError('Unable to load blog data. Please verify blogs.json and try again.', '#blog-markdown');
      }
    } finally {
      finishPageLoading();
    }
  });
})();
