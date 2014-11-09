(function($) {
  Drupal.behaviors.search_api_ranges = {
    attach: function(context, settings) {

      var submitTimeout = '';

      $('div.search-api-ranges-widget').each(function() {

        var widget = $(this);
        var slider = widget.find('div.range-slider');
        var rangeMin = widget.find('input[name=range-min]');
        var rangeMax = widget.find('input[name=range-max]');
        var rangeFrom = widget.find('input[name=range-from]');
        var rangeTo = widget.find('input[name=range-to]');

        slider.slider({
          range: true,
          animate: true,
          step: 1,
          min: parseInt(rangeMin.val()),
          max: parseInt(rangeMax.val()),
          values: [parseInt(rangeFrom.val()), parseInt(rangeTo.val())],

          // on change: when clicking somewhere in the bar
          change: function(event, ui) {
              widget.find('input[name=range-from]').val(ui.values[0]);
              widget.find('input[name=range-to]').val(ui.values[1]);
          },

          // on slide: when sliding with the controls
          slide: function(event, ui) {
            widget.find('input[name=range-from]').val(ui.values[0]);
            widget.find('input[name=range-to]').val(ui.values[1]);
          }
        });

        // submit once user stops changing values
        slider.bind('slidestop', function(event, ui) {
          clearTimeout(submitTimeout);
          delaySubmit(widget);
        });

        rangeFrom.numeric();
        rangeFrom.bind('keyup', function(e) {
          clearTimeout(submitTimeout);
          if (!isNaN(rangeFrom.val()) && rangeFrom.val() !== '') {
            var value = parseInt(rangeFrom.val());
            if (value > parseInt(rangeTo.val())) {
              value = parseInt(rangeTo.val());
            }
            if (value < parseInt(rangeMin.val())) {
              value = parseInt(rangeMin.val());
            }
            slider.slider("option", "values", [value, parseInt(rangeTo.val())]);

            if (e.keyCode == 13) {
              $(this).val(value);
              delaySubmit(widget);
            }
          }
        });
        // Autoselect text on focus
        // @source: http://stackoverflow.com/a/13065073/1050554
        rangeFrom.focus(function () {
          $(this).select().one('mouseup', function (e) {
            $(this).off('keyup');
            e.preventDefault();
          }).one('keyup', function () {
            $(this).select().off('mouseup');
          });
        });

        rangeTo.numeric();
        rangeTo.bind('keyup', function(e) {
          clearTimeout(submitTimeout);
          if (!isNaN(rangeTo.val()) && rangeTo.val() !== '') {
            var value = parseInt(rangeTo.val());
            if (value < parseInt(rangeFrom.val())) {
              value = parseInt(rangeFrom.val());
            }
            if (value > parseInt(rangeMax.val())) {
              value = parseInt(rangeMax.val());
            }
            slider.slider("option", "values", [parseInt(rangeFrom.val()), value]);

            if (e.keyCode == 13) {
              $(this).val(value);
              delaySubmit(widget);
            }
          }
        });
        rangeTo.focus(function () {
          $(this).select().one('mouseup', function (e) {
            $(this).off('keyup');
            e.preventDefault();
          }).one('keyup', function () {
            $(this).select().off('mouseup');
          });
        });

        // When the focus is lost: submit the form. But exclude cases when
        // 1) focus is passed between range from/to elements,
        // 2) values was not changed.
        var valFrom = rangeFrom.val();
        var valTo = rangeTo.val();
        var onBlur = function() {
          // We need to run our handler asynchronously, so that the
          // document.activeElement is initialized by browser and we know the
          // next focused element.
          setTimeout(function() {
            var focusLost = (document.activeElement != rangeFrom[0] && document.activeElement != rangeTo[0]);
            var valuesChanged = (valFrom != rangeFrom.val() || valTo != rangeTo.val());
            if (focusLost && valuesChanged) {
              widget.find('form').submit();
            }
          }, 0);
        };
        rangeFrom.blur(onBlur);
        rangeTo.blur(onBlur);
      });

      function delaySubmit(widget) {
        var autoSubmitDelay = widget.find('input[name=delay]').val();
        if (autoSubmitDelay != undefined && autoSubmitDelay != 0) {
          submitTimeout = setTimeout(function() {
            widget.find('form').submit();
          }, autoSubmitDelay);
        }
      };
    }
  };
})(jQuery);
