    var tabLink = window.location.pathname;
    var RQN9Api = 'YOUR RQN9 TOKEN'; //Create your RQN9 token: https://rqn9.com/developers
    var Webpagetitle = 'Source code'; //Your webpage title
    tokenUnderfined = 'Vui lòng kiểm tra lại thông tin giá trị token RQN9Api trong tại đường dẫn /static/arrow.js';
    somethingWrong = 'Đã có lỗi xảy ra, dữ liệu của bạn không được lưu.';
    document.title = window.location.hostname + ' / ' + window.location.pathname.replace('/', '') + ' | ' + Webpagetitle;
    var url = new URL(window.location);

    function makeid(length = 8) {
     var result = '';
     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
    }

    function validLink(Tab) {
     var pattern = new RegExp('(([a-z\\d]([a-z\\d-]*[a-z\\d])*))');
     return pattern.test(Tab);
    }

    function noteEncrypt(e, t) {
     var o = getNoteKey();
     void 0 !== t && (o = getNormalizeKey(normalizeKey(t)));
     var s = aesjs.utils.utf8.toBytes(e),
      n = new aesjs.ModeOfOperation.ctr(o, new aesjs.Counter(5)).encrypt(s),
      r = aesjs.utils.hex.fromBytes(n);
     return r
    }

    function setNoteKey(e) {
     e = normalizeKey(e), sessionStorage.NOTE_PASS = e
    }

    function getNoteKey() {
     return getNormalizeKey(sessionStorage.NOTE_PASS)
    }

    function normalizeKey(e) {
     if (e != null) {
      for (; e.length < 16;) e = "0" + e;
      return e = e.substr(0, 16)
     }
    }

    function getNormalizeKey(e) {
     return aesjs.utils.utf8.toBytes(e)
    }

    function randLink() {
     window.location.href = window.location.protocol + '//' + window.location.hostname + "/" + makeid();
    }
    setTimeout(function() {
     if (!validLink(tabLink)) {
      window.location.href = window.location.protocol + '//' + window.location.hostname + "/" + makeid();
     }
    }, 500);
    setTimeout(function() {
     try {
      var e = (t = $(".textarea")).val().match(/\S+/g);
      $(".word_count").html(e.length);
     } catch (err) {
      //
     };
    }, 2e3);
    $(document).ready(function() {
     $(window).on("load resize", function() {
      var e = .6 * $(window).height(),
       t = .2 * $(window).height() / 4;
      $(".textarea").height(e), $(".container").css({
       margin: t + "px auto 0"
      })
     });
     var timer = null;
     $('#randTab').click(function() {
      randLink();
     });
     $('#newTab').click(function() {
      alertify.prompt('Tạo tab mới', 'Bí danh bạn muốn', '', function(evt, value) {
       var newTab = value;
       alertify.success('Vui lòng chờ chút');
       window.location.href = window.location.protocol + '//' + window.location.hostname + "/" + newTab;
      }, function() {
       alertify.error('Đã hủy')
      });
     });
     $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink, function(data) {
      try {
       var textvnApi = jQuery.parseJSON(data).response;
       if (textvnApi.status == 'success') {
        $(".textarea").val(textvnApi.message);
        var tabdata = $('.textarea').val();
        textvnApi.views == null ? $(".view_count").html(0) : $(".view_count").html(textvnApi.views);
        $('#locker').click(function() {
         alertify.prompt('Nhập mật khẩu', 'Nhập mật khẩu để khóa tab', '', function(evt, value) {
          var noteData = value;
          sessionStorage.setItem("noteData" + window.location.pathname, value);
          noteData = noteEncrypt(window.location.pathname, noteData);
          $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink + '&password=' + noteData + '&data=' + encodeURI(tabdata), function(data) {
           var textvnApi = jQuery.parseJSON(data).response;
           if (textvnApi.status == 'correct_password') {
            alertify.success('Đã cài mật khẩu thành công!');
            $(".textarea").val(textvnApi.message);
            $(".view_count").html(textvnApi.views);
            sessionStorage.setItem(window.location.pathname, noteData);
            icon = $('#locker').find("i");
            icon.addClass("ion-locked").removeClass("ion-unlocked");
           } else {
            alertify.alert()
             .setting({
              'message': somethingWrong
             }).show();
           }
          });
         }, function() {
          alertify.error('Đã hủy')
         });
        });
       } else if (sessionStorage.getItem(window.location.pathname)) {
        if (sessionStorage.getItem(window.location.pathname) == noteEncrypt(window.location.pathname, sessionStorage.getItem("noteData" + window.location.pathname))) {
         $('#locker').click(function() {
          $(".textarea").prop('disabled', true).val("");
          icon = $('#locker').find("i");
          icon.addClass("ion-unlocked").removeClass("ion-locked");
          sessionStorage.removeItem("noteData");
          sessionStorage.removeItem(window.location.pathname);
          PasswordEnter(RQN9Api, tabLink);
         });
         $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink + '&password=' + sessionStorage.getItem(window.location.pathname), function(data) {
          var textvnApi = jQuery.parseJSON(data).response;
          if (textvnApi.status == 'correct_password') {
           $(".textarea").val(textvnApi.message);
           $(".view_count").html(textvnApi.views);
           icon = $('#locker').find("i");
           icon.addClass("ion-locked").removeClass("ion-unlocked");
          }
         });
        }
       } else {
        $('#locker').click(function() {
         PasswordEnter(RQN9Api, tabLink);
        });
        //var isBookPrivate = $("#makeBookPrivate").is(":checked");
        $(".textarea").prop('disabled', true);
        PasswordEnter(RQN9Api, tabLink);
       }
      } catch (err) {
       alertify.alert()
        .setting({
         'message': tokenUnderfined
        }).show();
      }
     }).fail(function() {
      alertify.alert()
       .setting({
        'message': tokenUnderfined
       }).show();
     });
     $('.textarea').on('keyup', funct(function() {
      Tabsave(RQN9Api)
     }, 500));
     $('.textarea').on('keydown', funct(function() {
      $('.updated').removeClass('color');
     }));

     function funct(func, wait, immediate) {
      var timeout;
      return function() {
       var context = this,
        args = arguments;
       var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
       };
       var callNow = immediate && !timeout;
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
       if (callNow) func.apply(context, args);
      };
     };

     function PasswordEnter(e, g) {
      alertify.prompt('Nhập mật khẩu', 'Nhập mật khẩu để mở khóa tab', '', function(evt, value) {
       var noteData = value;
       sessionStorage.setItem("noteData" + window.location.pathname, value);
       noteData = noteEncrypt(window.location.pathname, noteData);
       $.get('https://api.rqn9.com/data/1.0/textvn/' + e + g + '&password=' + noteData, function(data) {
        var textvnApi = jQuery.parseJSON(data).response;
        if (textvnApi.status == 'correct_password' && textvnApi.message != 'wrong password') {
         alertify.success('Đúng mật khẩu');
         icon = $('#locker').find("i");
         icon.addClass("ion-locked").removeClass("ion-unlocked");
         console.log(icon);
         $(".textarea").val(textvnApi.message);
         textvnApi.views == null ? $(".view_count").html(0) : $(".view_count").html(textvnApi.views);
         sessionStorage.setItem(window.location.pathname, noteData);
         $(".textarea").prop('disabled', false);
        } else {
         alertify.error('Sai mật khẩu');
        }
       });
      }, function() {
       alertify.error('Hủy bỏ')
      });
     }

     function Tabsave(RQN9Api) {
      var tabdata = $('.textarea').val();
      if (sessionStorage.getItem(window.location.pathname)) {
       if (sessionStorage.getItem(window.location.pathname) == noteEncrypt(window.location.pathname, sessionStorage.getItem("noteData" + window.location.pathname))) {
        $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink + '&password=' + sessionStorage.getItem(window.location.pathname) + '&data=' + encodeURI(tabdata), function(data) {
         var textvnApi = jQuery.parseJSON(data).response;
         if (textvnApi.status == 'correct_password') {
          $('.updated').addClass('color');
         }
        });
       }
      } else {
       $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink + '&data=' + encodeURI(tabdata), function(data) {
        var textvnApi = jQuery.parseJSON(data).response;
        if (textvnApi.status == 'error' || textvnApi.message == 'password protected') {
         alertify.alert()
          .setting({
           'message': somethingWrong
          }).show();
        }
        $('.updated').addClass('color');
       });
      }
     }

     function copyToClipboard(text) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove()
     }
     $('#share-link').click(function() {
      copyToClipboard(window.location.protocol + '//' + window.location.hostname + window.location.pathname)
     });
     $(selector).animate({
      opacity: 1
     }, function() {
      $(this).get(0).style.removeAttribute('filter')
     });
    });
