    var tabLink = window.location.pathname;
    var RQN9Api = 'YOUR RQN9 TOKEN'; //Create your RQN9 token: https://rqn9.com/developers
    var Webpagetitle = 'Source code'; //Your webpage title
    document.title = window.location.hostname + ' / ' + window.location.pathname.replace('/','') + ' | ' + Webpagetitle;
    var url = new URL(window.location);
    function makeid(length = 8) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    function validLink(Tab) {
            var pattern = new RegExp('(([a-z\\d]([a-z\\d-]*[a-z\\d])*))');
            return pattern.test(Tab);
    }
    setTimeout(function() {
        if(!validLink(tabLink)){
            window.location.href = window.location.protocol + '//' + window.location.hostname + "/" + makeid();
        }
    }, 500);
    setTimeout(function() {
        var e = (t = $(".textarea")).val().match(/\S+/g);
        $(".word_count").html(e.length);
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
        $.get( 'https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink, function(data) {
                var textvnApi = jQuery.parseJSON(data).response;
                if (textvnApi.status == 'success'){
                    $(".textarea").val(textvnApi.message);
                } else {
                    alertify.confirm("Hiện tính năng này đang được phát triển, vui lòng quay lại sau.", function(){
                        window.location.href = window.location.protocol + '//' + window.location.hostname;
                    }).set({labels:{ok:'OK'}});
                }
            }).fail(function() {
                alertify.alert()
                  .setting({
                    'message': 'Vui lòng kiểm tra lại thông tin giá trị token RQN9Api trong tại đường dẫn /static/arrow.js'
                  }).show();
            });
        $('.textarea').keydown(function(){
               clearTimeout(timer); 
               timer = setTimeout(Tabsave(RQN9Api), 1000)
        });
        $('.textarea').focus(function() {
              $('.updated').removeClass('color');
        });
        function Tabsave(RQN9Api){
            console.log($('.textarea').val());
            var tabdata = $('.textarea').val();
            $.get('https://api.rqn9.com/data/1.0/textvn/' + RQN9Api + tabLink + '&data=' + encodeURI(tabdata), function(data) {
                var textvnApi = jQuery.parseJSON(data).response;
                if (textvnApi.status == 'error'||textvnApi.message == 'password protected'){
                        alertify.alert()
                          .setting({
                            'message': 'Đã có lỗi xảy ra, dữ liệu của bạn không được lưu.'
                          }).show();
                            }
                $('.updated').addClass('color');
            });
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
