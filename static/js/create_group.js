// Generated by CoffeeScript 1.6.3
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var cache, create_category_list_item, create_group_complete_box, create_username_clickable_box, create_username_complete_box, currently_selected_users, deselect_user, dom_complete_box, dom_create_button, dom_group_name_box, dom_result, dom_selected_group_column, dom_selected_group_list, dom_selected_group_name, dom_selected_user_column, dom_selected_users_list, filter_selected_users, get_group_selection_class, get_username_selection_class, past_selected_users, refresh_gui, select_group, select_user, selected_group, selected_group_members, sorted;
    dom_complete_box = $("#username_input");
    dom_selected_users_list = $('#selected_users');
    dom_selected_user_column = $('#usercolumn');
    dom_selected_group_column = $('#groupcolumn');
    dom_selected_group_list = $('#selected_group');
    dom_selected_group_name = $('#group_name');
    dom_create_button = $('#create_group_button');
    dom_group_name_box = $('#groupnameinput');
    dom_result = $('#result');
    currently_selected_users = [];
    past_selected_users = [];
    selected_group = '';
    selected_group_members = [];
    cache = {};
    select_user = function(username) {
      if (__indexOf.call(currently_selected_users, username) >= 0) {
        return;
      }
      currently_selected_users.push(username);
      past_selected_users.push(username);
      return refresh_gui();
    };
    deselect_user = function(username) {
      if (__indexOf.call(currently_selected_users, username) < 0) {
        return;
      }
      currently_selected_users.remove(username);
      return refresh_gui();
    };
    select_group = function(group_name, group_members) {
      if (group_name === selected_group) {
        return;
      }
      selected_group = group_name;
      selected_group_members = group_members;
      return refresh_gui();
    };
    sorted = function(usernames) {
      return _.sortBy(usernames, function(uname) {
        return uname.toUpperCase();
      });
    };
    refresh_gui = function() {
      var username, users_to_show, _i, _j, _len, _len1, _ref;
      dom_selected_users_list.empty();
      dom_selected_group_list.empty();
      users_to_show = _.union(currently_selected_users, past_selected_users);
      users_to_show = sorted(users_to_show);
      if (users_to_show === []) {
        dom_selected_user_column.hide();
      } else {
        dom_selected_user_column.show();
        for (_i = 0, _len = users_to_show.length; _i < _len; _i++) {
          username = users_to_show[_i];
          dom_selected_users_list.append(create_username_clickable_box(username));
        }
      }
      if (selected_group === '') {
        return dom_selected_group_column.hide();
      } else {
        dom_selected_group_name.text(selected_group);
        _ref = sorted(selected_group_members);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          username = _ref[_j];
          dom_selected_group_list.append(create_username_clickable_box(username));
        }
        return dom_selected_group_column.show();
      }
    };
    get_username_selection_class = function(username) {
      if (__indexOf.call(currently_selected_users, username) >= 0) {
        return "added_user";
      } else {
        return "non_added_user";
      }
    };
    get_group_selection_class = function(group_name, group_members) {
      var all_members_selected, any_member_selected, username, _i, _len;
      all_members_selected = true;
      any_member_selected = false;
      for (_i = 0, _len = group_members.length; _i < _len; _i++) {
        username = group_members[_i];
        if (__indexOf.call(currently_selected_users, username) >= 0) {
          any_member_selected = true;
        } else {
          all_members_selected = false;
        }
      }
      if (all_members_selected) {
        return 'all_selected_group';
      } else if (any_member_selected) {
        return 'some_selected_group';
      } else {
        return 'none_selected_group';
      }
    };
    create_username_complete_box = function(username) {
      return $("<li class='" + (get_username_selection_class(username)) + "'><a>" + username + "</a></li>");
    };
    create_group_complete_box = function(group_name, group_members) {
      var css_selection_class;
      css_selection_class = get_group_selection_class(group_name, group_members);
      return $("<li class='" + css_selection_class + "'><a>" + group_name + "</a></li>");
    };
    create_username_clickable_box = function(username) {
      var box;
      box = $("<li class='" + (get_username_selection_class(username)) + "'>" + username + "</li>");
      return box.on('click', function() {
        if (__indexOf.call(currently_selected_users, username) >= 0) {
          return deselect_user(username);
        } else {
          return select_user(username);
        }
      });
    };
    create_category_list_item = function(category_name) {
      return $("<li class='ui-autocomplete-category'>" + category_name + "</li>");
    };
    filter_selected_users = function(user_group_list) {
      return _.filter(user_group_list, function(item) {
        var _ref;
        if (item.category === '' && (_ref = item.value, __indexOf.call(currently_selected_users, _ref) >= 0)) {
          return false;
        }
        return true;
      });
    };
    $.widget("custom.user_group_complete", $.ui.autocomplete, {
      _renderItem: function(ul, item) {
        if (item.category === '') {
          return create_username_complete_box(item.value).appendTo(ul);
        } else {
          return create_group_complete_box(item.value, item.members).appendTo(ul);
        }
      },
      _renderMenu: function(ul, items) {
        var current_category, item, that, _i, _len, _results;
        that = this;
        current_category = '';
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (current_category !== item.category) {
            ul.append(create_category_list_item(item.category));
            current_category = item.category;
          }
          _results.push(that._renderItemData(ul, item));
        }
        return _results;
      }
    });
    dom_complete_box.user_group_complete({
      source: function(request, response) {
        var search_string;
        search_string = request.term;
        if (search_string in cache) {
          return response(filter_selected_users(cache[search_string]));
        }
        return $.getJSON("/account/complete_users_and_groups/" + request.term, function(data, status, xhr) {
          cache[search_string] = data;
          return response(filter_selected_users(data));
        });
      },
      minLength: 2,
      select: function(event, ui) {
        if (ui.item != null) {
          if (ui.item.category === '') {
            select_user(ui.item.value);
          } else if (ui.item.category === 'groups') {
            select_group(ui.item.value, ui.item.members);
          }
        }
        dom_complete_box.val('');
        return false;
      }
    });
    return dom_create_button.on("click", function() {
      var group_name;
      group_name = dom_group_name_box.val();
      if (group_name != null ? group_name.length : void 0) {
        null;
      }
      return $.ajax({
        url: 'create_group/',
        type: 'POST',
        dataType: 'JSON',
        data: {
          groupname: group_name,
          users: currently_selected_users
        },
        success: function(result) {
          return dom_result.text(result);
        },
        error: function(xhr, errmsg, err) {
          return dom_result.text('ERROR: ' + xhr + errmsg + err);
        }
      });
    });
  });

}).call(this);
