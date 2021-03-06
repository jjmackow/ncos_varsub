/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/'use strict';

(function (Drupal, drupalSettingsl, $) {
  var types = {
    page: {
      id: 1,
      labels: {
        Document: Drupal.t('Node'),
        document: Drupal.t('Node'),
        posts: Drupal.t('Nodes')
      },
      name: 'Page',
      rest_base: 'pages',
      slug: 'page',
      supports: {
        author: false,
        comments: false,
        'custom-fields': true,
        editor: true,
        excerpt: false,
        discussion: false,
        'page-attributes': false,
        revisions: false,
        thumbnail: false,
        title: false },
      taxonomies: [],
      viewable: false,
      saveable: false,
      publishable: false,
      autosaveable: false
    },
    block: {
      capabilities: {},
      name: 'Blocks',
      rest_base: 'blocks',
      slug: 'block',
      description: '',
      hierarchical: false,
      supports: {
        title: true,
        editor: true
      },
      viewable: true
    }
  };

  var requestPaths = {
    'save-page': {
      method: 'PUT',
      regex: /\/wp\/v2\/page\/(\d*)/g,
      process: function process(matches, data) {
        window.wp.node = {
          pathType: 'save-post',
          id: 1,
          type: 'page',
          title: {
            raw: document.title
          },
          content: {
            raw: data
          }
        };

        return new Promise(function (resolve) {
          resolve(window.wp.node);
        });
      }
    },
    'load-node': {
      method: 'GET',
      regex: /\/wp\/v2\/pages\/(\d*)/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve(window.wp.node);
        });
      }
    },
    'media-options': {
      method: 'OPTIONS',
      regex: /\/wp\/v2\/media/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve({
            headers: {
              get: function get(value) {
                if (value === 'allow') {
                  return ['POST'];
                }
              }
            }
          });
        });
      }
    },
    'load-media': {
      method: 'GET',
      regex: /\/wp\/v2\/media\/(\d*)/g,
      process: function process(matches) {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'GET',
            url: drupalSettings.path.baseUrl + 'editor/media/load/' + matches[1],
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function () {
            reject(Error);
          });
        });
      }
    },
    'save-media': {
      method: 'POST',
      regex: /\/wp\/v2\/media/g,
      process: function process(matches, data, body) {
        return new Promise(function (resolve, reject) {
          var file = void 0;
          var entries = body.entries();

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var pair = _step.value;

              if (pair[0] === 'file') {
                file = pair[1];
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var formData = new FormData();
          formData.append('files[fid]', file);
          formData.append('fid[fids]', '');
          formData.append('attributes[alt]', 'Test');
          formData.append('_drupal_ajax', '1');
          formData.append('form_id', $('[name="form_id"]').val());
          formData.append('form_build_id', $('[name="form_build_id"]').val());
          formData.append('form_token', $('[name="form_token"]').val());

          $.ajax({
            method: 'POST',
            url: drupalSettings.path.baseUrl + 'editor/media/upload/gutenberg',

            data: formData,
            processData: false,
            contentType: false,
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },
    'load-medias': {
      method: 'GET',
      regex: /\/wp\/v2\/media/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve([]);
        });
      }
    },
    categories: {
      method: 'GET',
      regex: /\/wp\/v2\/categories\?(.*)/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve([]);
        });
      }
    },
    users: {
      method: 'GET',
      regex: /\/wp\/v2\/users\/\?(.*)/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve([{
            id: 1,
            name: 'Human Made',
            url: '',
            description: '',
            link: 'https://demo.wp-api.org/author/humanmade/',
            slug: 'humanmade',
            avatar_urls: {
              24: 'http://2.gravatar.com/avatar/83888eb8aea456e4322577f96b4dbaab?s=24&d=mm&r=g',
              48: 'http://2.gravatar.com/avatar/83888eb8aea456e4322577f96b4dbaab?s=48&d=mm&r=g',
              96: 'http://2.gravatar.com/avatar/83888eb8aea456e4322577f96b4dbaab?s=96&d=mm&r=g'
            },
            meta: [],
            _links: {
              self: [],
              collection: []
            }
          }]);
        });
      }
    },
    taxonomies: {
      method: 'GET',
      regex: /\/wp\/v2\/taxonomies/g,
      process: function process() {
        return new Promise(function (resolve) {
          resolve([]);
        });
      }
    },
    embed: {
      method: 'GET',
      regex: /\/oembed\/1\.0\/proxy\?(.*)/g,
      process: function process(matches) {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'GET',

            url: (drupalSettings.path.baseUrl === '/' ? '' : drupalSettings.path.baseUrl) + '/editor/oembed?url=' + encodeURIComponent('http://open.iframe.ly/api/oembed?' + matches[1] + '&origin=drupal'),

            processData: false,
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },
    root: {
      method: 'GET',
      regex: /(^\/$|^$)/g,
      process: function process() {
        return new Promise(function (resolve) {
          return resolve({
            theme_supports: {
              formats: ['standard', 'aside', 'image', 'video', 'quote', 'link', 'gallery', 'audio'],
              'post-thumbnails': true
            }
          });
        });
      }
    },
    themes: {
      method: 'GET',
      regex: /\/wp\/v2\/themes\?(.*)/g,
      process: function process() {
        return new Promise(function (resolve) {
          return resolve([{
            theme_supports: {
              formats: ['standard', 'aside', 'image', 'video', 'quote', 'link', 'gallery', 'audio'],
              'post-thumbnails': true,
              'responsive-embeds': false
            }
          }]);
        });
      }
    },

    'load-type-page': {
      method: 'GET',
      regex: /\/wp\/v2\/types\/page/g,
      process: function process() {
        return new Promise(function (resolve) {
          return resolve(types.page);
        });
      }
    },
    'load-type-block': {
      method: 'GET',
      regex: /\/wp\/v2\/types\/wp_block/g,
      process: function process() {
        return new Promise(function (resolve) {
          return resolve(types.block);
        });
      }
    },
    'load-types': {
      method: 'GET',
      regex: /\/wp\/v2\/types($|\?(.*))/g,
      process: function process() {
        return new Promise(function (resolve) {
          return resolve(types);
        });
      }
    },

    'update-block': {
      method: 'PUT',
      regex: /\/wp\/v2\/blocks\/(\d*)/g,
      process: function process(matches, data) {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'PUT',
            url: drupalSettings.path.baseUrl + 'editor/reusable-blocks/' + data.id,
            data: JSON.stringify(data),
            processData: false,
            contentType: false,
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },

    'delete-block': {
      method: 'DELETE',
      regex: /\/wp\/v2\/blocks\/(\d*)/g,
      process: function process(matches) {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'DELETE',
            url: drupalSettings.path.baseUrl + 'editor/reusable-blocks/' + matches[1],
            processData: false,
            contentType: false,
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },

    'insert-block': {
      method: 'POST',
      regex: /\/wp\/v2\/blocks/g,
      process: function process(matches, data) {
        return new Promise(function (resolve, reject) {
          var formData = new FormData();
          formData.append('title', data.title);
          formData.append('content', data.content);

          $.ajax({
            method: 'POST',
            url: drupalSettings.path.baseUrl + 'editor/reusable-blocks',
            data: formData,
            processData: false,
            contentType: false,
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },
    'load-block': {
      method: 'GET',
      regex: /\/wp\/v2\/blocks\/(\d*)/g,
      process: function process(matches) {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'GET',
            url: drupalSettings.path.baseUrl + 'editor/reusable-blocks/' + matches[1],
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    },
    'load-blocks': {
      method: 'GET',
      regex: /\/wp\/v2\/blocks\?(.*)/g,
      process: function process() {
        return new Promise(function (resolve, reject) {
          $.ajax({
            method: 'GET',
            url: drupalSettings.path.baseUrl + 'editor/reusable-blocks',
            accepts: {
              json: 'application/json, text/javascript, */*; q=0.01'
            }
          }).done(function (result) {
            resolve(result);
          }).fail(function (err) {
            reject(err);
          });
        });
      }
    }
  };

  function processPath(options) {
    for (var key in requestPaths) {
      if (requestPaths.hasOwnProperty(key)) {
        var requestPath = requestPaths[key];
        requestPath.regex.lastIndex = 0;
        var matches = requestPath.regex.exec('' + options.path);

        if (matches && matches.length > 0 && (options.method && options.method === requestPath.method || requestPath.method === 'GET')) {
          return requestPath.process(matches, options.data, options.body);
        }
      }
    }

    return new Promise(function (resolve, reject) {
      return reject(new Error('API handler not found.'));
    });
  }

  function apiFetch(options) {
    return processPath(options);
  }

  function addQueryArgs(url, args) {
    if (url === 'post.php') {
      return '?save=1';
    }

    if (url === 'edit.php' && args.post_type && args.post_type === 'wp_block') {
      return Drupal.url('') + 'admin/content/reusable-blocks';
    }

    if (url === '/oembed/1.0/proxy') {
      return url + '?url=' + args.url;
    }

    return url;
  }

  window.wp = {
    apiFetch: apiFetch
  };
})(Drupal, drupalSettings, jQuery);