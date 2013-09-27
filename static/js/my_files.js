// Generated by CoffeeScript 1.6.3
(function() {
  $(function() {
    var currentFilename, edit, load_btn_values, remove, root, str_contains, update_videolist_element;
    root = this;
    root.resources = [];
    root.load_resources = function() {
      var resource, resources, _i, _len, _results;
      root.resources = [];
      resources = document.getElementsByClassName('resource_storage');
      _results = [];
      for (_i = 0, _len = resources.length; _i < _len; _i++) {
        resource = resources[_i];
        _results.push(root.resources.push($(resource).html()));
      }
      return _results;
    };
    root.load_resources();
    root.checked_btns = new Array();
    load_btn_values = function() {
      return $('.btn-group > div').each(function() {
        if ($(this).hasClass('btn-primary')) {
          return root.checked_btns[this.id] = 1;
        }
      });
    };
    load_btn_values();
    $(document).on('keyup', '#searchfield', function(event) {
      var word;
      word = this.value;
      return $.each(root.resources, function() {
        var $this, btn;
        $this = $('#' + this);
        btn = $this.attr('class').split('_')[0] + '_btn';
        if (str_contains(this, word)) {
          $this.removeClass('no_match');
        } else {
          $this.addClass('no_match');
        }
        if (!$this.hasClass('no_match') && root.checked_btns[btn]) {
          return $this.parent().show();
        } else {
          return $this.parent().hide();
        }
      });
    });
    str_contains = function(str, word) {
      return str.indexOf(word) !== -1;
    };
    $('.btn-group > .btn').click(function() {
      var selected_btn, toggle;
      toggle = 'btn-primary';
      selected_btn = $(this).attr('id');
      if ($(this).hasClass(toggle)) {
        $(this).removeClass(toggle);
        root.checked_btns[selected_btn] = 0;
        if (selected_btn === 'created_btn') {
          return $('.created_resource').hide();
        } else {
          return $('.shared_resource').hide();
        }
      } else {
        $(this).addClass(toggle);
        root.checked_btns[selected_btn] = 1;
        if (selected_btn === 'created_btn') {
          return $('.created_resource:not(.no_match)').show();
        } else {
          return $('.shared_resource:not(.no_match)').show();
        }
      }
    });
    currentFilename = '';
    edit = function() {
      var fname, vlink;
      vlink = $(this).parent().children('.videolink');
      fname = vlink.html();
      if (fname.substring(0, 6) !== "<input") {
        currentFilename = fname;
        return vlink.html('<input type="text" class="editbox" autofocus="true" placeholder="' + fname + '">');
      }
    };
    $('.editbutton').click(edit);
    update_videolist_element = function(name, new_name, $target) {
      var resource_store;
      $target.html(new_name);
      return resource_store = $('#' + name + '> .resource_storage').html(this.value);
    };
    $(document).on('keypress', '.editbox', function(event) {
      var $storage, $target, new_name;
      if (event.which === 13 || event.keycode === 13) {
        $target = $(this).parent();
        $storage = $(this).parent().parent().parent().parent().siblings('.resource_storage');
        new_name = this.value;
        $.ajax({
          url: window.change_name_URL,
          type: 'POST',
          dataType: 'json',
          data: {
            'filename': currentFilename,
            'newname': new_name
          },
          success: function(json) {
            $target.siblings('.errormsg').html('');
            $target.html(json.message);
            $storage.html(json.message);
            $storage.parent().attr('id', json.message);
            return root.load_resources();
          },
          error: function(xhr, json) {
            return $target.siblings('.errormsg').html(errorMessage(xhr));
          }
        });
        return event.preventDefault();
      }
    });
    remove = function() {
      var fname, target;
      target = $(this).parent();
      fname = target.children('.videolink').html();
      target.parent().parent().remove();
      return $.ajax({
        url: window.remove_resource_URL,
        type: 'POST',
        dataType: 'json',
        data: {
          'filename': fname
        },
        success: function(json) {
          return $('#result').append('<li>' + json.response + '</li>');
        },
        error: function(xhr) {
          return $target.siblings('.errormsg').html(errorMessage(xhr));
        }
      });
    };
    $('.removebutton').click(remove);
    return $('.videolink').on('click', function() {
      var clicked, myVideo;
      clicked = $(event.target);
      myVideo = document.getElementById('video');
      $(myVideo).attr('poster', '/static/media/' + clicked.attr('id') + '.png');
      myVideo.src = '/static/media/' + clicked.attr('id') + '.webm';
      return myVideo.load();
    });
  });

}).call(this);
