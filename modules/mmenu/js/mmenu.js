/**
 * @file
 * Utility functions to handle the mmenus.
 */

mmenu_enabled_callback = function () {
  'use strict';
  return window.innerWidth <= 480;
};

(function ($, Drupal, drupalSettings) {

  'use strict';

  Drupal.mmenu = Drupal.mmenu || {};
  Drupal.mmenu.settings = Drupal.mmenu.settings || {};

  Drupal.mmenu.resetDragOpen = function () {
    Drupal.mmenu.settings = drupalSettings.mmenu;
    if (Drupal.mmenu.settings) {
      for (var key in Drupal.mmenu.settings) {
        if (Drupal.mmenu.settings.hasOwnProperty(key)) {
          var mmenu = Drupal.mmenu.settings[key];

          // To check if we need to enable/disable the mmenu.
          var flag = true;
          if (typeof mmenu.enabled_callback !== 'undefined') {
            if (mmenu.enabled_callback.js) {
              for (var i in mmenu.enabled_callback.js) {
                if (mmenu.enabled_callback.js.hasOwnProperty(i)) {
                  // Function we want to run.
                  var callbackString = mmenu.enabled_callback.js[i];
                  // Finds object.
                  var callback = window[callbackString];
                  // Is object a function?
                  if (typeof callback === 'function') {
                    flag = callback();
                    if (!flag) {
                      break;
                    }
                  }
                }
              }
            }
          }

          // Updates the dragOpen threshold value to enable/disable drag to open event.
          var _menu = $('#' + mmenu.name).data('mmenu');
          if (typeof _menu !== 'undefined' && _menu.opts) {
            if (!_menu.opts.dragOpen.oriThreshold) {
              _menu.opts.dragOpen.oriThreshold = _menu.opts.dragOpen.threshold;
            }
            _menu.opts.dragOpen.threshold = flag ? _menu.opts.dragOpen.oriThreshold : 1000000000;
          }
        }
      }
    }
  };

  Drupal.behaviors.mmenu = {
    attach: function (context, settings) {
      Drupal.mmenu.resetDragOpen();
      $(window).on('resize', function () {
        Drupal.mmenu.resetDragOpen();
      });

      if (Drupal.mmenu.settings) {
        for (var key in Drupal.mmenu.settings) {
          if (Drupal.mmenu.settings.hasOwnProperty(key)) {
            var mmenu = Drupal.mmenu.settings[key];
            var $mmenu = $('#' + mmenu.name);

            // Initializes single mmenu.
            $mmenu.mmenu(
                mmenu.options,
                mmenu.configurations
            );

            // Handles clickOpen event.
            if (mmenu.options.clickOpen) {
              if (mmenu.options.clickOpen.open && mmenu.options.clickOpen.selector) {
                $(mmenu.options.clickOpen.selector).bind('click', {name: mmenu.name}, function (e) {
                  e.preventDefault();
                  var API = $('#' + e.data.name).data('mmenu');
                  API.open();
                });
              }
            }
          }
        }

        // In order to support the special_menu_items and menu_firstchild modules.
        // Opens the next level menu if click the <nolink> and <firstchild> links.
        $('.mmenu-mm-subopen').click(function () {
          $(this).siblings('a.mm-subopen').trigger('click');
        });
      }
    }
  };

})(jQuery, Drupal, drupalSettings);