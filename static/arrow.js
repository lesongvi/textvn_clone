var tabLink = window.location.pathname,
    RQN9Api = "YOUR RQN9 TOKEN", // Your RQN9 token, generate: https://rqn9.com/developers
    Webpagetitle = "Source code"; //Your webpage tile
tokenUnderfined = "Vui lòng kiểm tra lại thông tin giá trị token RQN9Api trong tại đường dẫn /static/arrow.js", somethingWrong = "Đã có lỗi xảy ra, dữ liệu của bạn không được lưu.", document.title = window.location.hostname + " / " + window.location.pathname.replace("/", "") + " | " + Webpagetitle;
var url = new URL(window.location);

function makeid(e = 8) {
    for (var t = "", o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = o.length, a = 0; a < e; a++) t += o.charAt(Math.floor(Math.random() * n));
    return t
}

function validLink(e) {
    return new RegExp("(([a-z\\d]([a-z\\d-]*[a-z\\d])*))").test(e)
}

function noteEncrypt(e, t) {
    var o = getNoteKey();
    void 0 !== t && (o = getNormalizeKey(normalizeKey(t)));
    var n = aesjs.utils.utf8.toBytes(e),
        a = new aesjs.ModeOfOperation.ctr(o, new aesjs.Counter(5)).encrypt(n);
    return aesjs.utils.hex.fromBytes(a)
}

function setNoteKey(e) {
    e = normalizeKey(e), sessionStorage.NOTE_PASS = e
}

function getNoteKey() {
    return getNormalizeKey(sessionStorage.NOTE_PASS)
}

function normalizeKey(e) {
    if (null != e) {
        for (; e.length < 16;) e = "0" + e;
        return e.substr(0, 16)
    }
}

function spell_check() {
    $(".spell-check").hasClass("color") ? ($(".spell-check").removeClass("color"), $(".textarea").attr("spellcheck", !1), document.cookie = "spell_check=false; expires=Fri, 31 Dec 9999 23:59:59 GMT") : ($(".spell-check").addClass("color"), $(".textarea").attr("spellcheck", !0), document.cookie = "spell_check=true; expires=Fri, 31 Dec 9999 23:59:59 GMT")
}

function monospace() {
    $(".monospace").hasClass("color") ? ($(".monospace").removeClass("color"), $(".textarea").css("font-family", "Arial,Helvetica,sans-serif"), document.cookie = "monospace=false; expires=Fri, 31 Dec 9999 23:59:59 GMT") : ($(".monospace").addClass("color"), $(".textarea").css("font-family", "monospace"), document.cookie = "monospace=true; expires=Fri, 31 Dec 9999 23:59:59 GMT")
}

function getCookieValue(e) {
    var t = document.cookie.match("(^|[^;]+)\\s*" + e + "\\s*=\\s*([^;]+)");
    return t ? t.pop() : ""
}

function getNormalizeKey(e) {
    return aesjs.utils.utf8.toBytes(e)
}

function randLink() {
    window.location.href = window.location.protocol + "//" + window.location.hostname + "/" + makeid()
}
"true" == getCookieValue("spell_check") && spell_check(), "true" == getCookieValue("monospace") && monospace(), setTimeout(function() {
    validLink(tabLink) || (window.location.href = window.location.protocol + "//" + window.location.hostname + "/" + makeid())
}, 500), setTimeout(function() {
    try {
        var e = (t = $(".textarea")).val().match(/\S+/g);
        $(".word_count").html(e.length)
    } catch (e) {}
}, 2e3), $(document).ready(function() {
    $(window).on("load resize", function() {
        var e = .6 * $(window).height(),
            t = .2 * $(window).height() / 4;
        $(".textarea").height(e), $(".container").css({
            margin: t + "px auto 0"
        })
    });

    function e(e, t, o) {
        var n;
        return function() {
            var a = this,
                i = arguments,
                s = o && !n;
            clearTimeout(n), n = setTimeout(function() {
                n = null, o || e.apply(a, i)
            }, t), s && e.apply(a, i)
        }
    }

    function t(e, t) {
        alertify.prompt("Nhập mật khẩu", "Nhập mật khẩu để mở khóa tab", "", function(o, n) {
            var a = n;
            sessionStorage.setItem("noteData" + window.location.pathname, n), a = noteEncrypt(window.location.pathname, a), $.get("https://api.rqn9.com/data/1.0/textvn/" + e + t + "&password=" + a, function(e) {
                var t = jQuery.parseJSON(e).response;
                "correct_password" == t.status && "wrong password" != t.message ? (alertify.success("Đúng mật khẩu"), icon = $("#locker").find("i"), icon.addClass("ion-locked").removeClass("ion-unlocked"), console.log(icon), $(".textarea").val(t.message), null == t.views ? $(".view_count").html(0) : $(".view_count").html(t.views), sessionStorage.setItem(window.location.pathname, a), $(".textarea").prop("disabled", !1)) : alertify.error("Sai mật khẩu")
            })
        }, function() {
            alertify.error("Hủy bỏ")
        })
    }
    $("#tabLinkinput").val(url), $("#randTab").click(function() {
        randLink()
    }), $("#newTab").click(function() {
        alertify.prompt("Tạo tab mới", "Bí danh bạn muốn", "", function(e, t) {
            var o = t;
            alertify.success("Vui lòng chờ chút"), window.location.href = window.location.protocol + "//" + window.location.hostname + "/" + o
        }, function() {
            alertify.error("Đã hủy")
        })
    }), $.get("https://api.rqn9.com/data/1.0/textvn/" + RQN9Api + tabLink, function(e) {
        try {
            var o = jQuery.parseJSON(e).response;
            if ("success" == o.status) {
                $(".textarea").val(o.message);
                var n = $(".textarea").val();
                null == o.views ? $(".view_count").html(0) : $(".view_count").html(o.views), $("#locker").click(function() {
                    alertify.prompt("Nhập mật khẩu", "Nhập mật khẩu để khóa tab", "", function(e, t) {
                        var o = t;
                        sessionStorage.setItem("noteData" + window.location.pathname, t), o = noteEncrypt(window.location.pathname, o), $.get("https://api.rqn9.com/data/1.0/textvn/" + RQN9Api + tabLink + "&password=" + o + "&data=" + encodeURIComponent(n), function(e) {
                            var t = jQuery.parseJSON(e).response;
                            "correct_password" == t.status ? (alertify.success("Đã cài mật khẩu thành công!"), $(".textarea").val(t.message), $(".view_count").html(t.views), sessionStorage.setItem(window.location.pathname, o), icon = $("#locker").find("i"), icon.addClass("ion-locked").removeClass("ion-unlocked")) : alertify.alert().setting({
                                message: somethingWrong
                            }).show()
                        })
                    }, function() {
                        alertify.error("Đã hủy")
                    })
                })
            } else sessionStorage.getItem(window.location.pathname) ? sessionStorage.getItem(window.location.pathname) == noteEncrypt(window.location.pathname, sessionStorage.getItem("noteData" + window.location.pathname)) && ($("#locker").click(function() {
                $(".textarea").prop("disabled", !0).val(""), icon = $("#locker").find("i"), icon.addClass("ion-unlocked").removeClass("ion-locked"), sessionStorage.removeItem("noteData"), sessionStorage.removeItem(window.location.pathname), t(RQN9Api, tabLink)
            }), $.get("https://api.rqn9.com/data/1.0/textvn/" + RQN9Api + tabLink + "&password=" + sessionStorage.getItem(window.location.pathname), function(e) {
                var t = jQuery.parseJSON(e).response;
                "correct_password" == t.status && ($(".textarea").val(t.message), $(".view_count").html(t.views), icon = $("#locker").find("i"), icon.addClass("ion-locked").removeClass("ion-unlocked"))
            })) : ($("#locker").click(function() {
                t(RQN9Api, tabLink)
            }), $(".textarea").prop("disabled", !0), t(RQN9Api, tabLink))
        } catch (e) {
            alertify.alert().setting({
                message: tokenUnderfined
            }).show()
        }
    }).fail(function() {
        alertify.alert().setting({
            message: tokenUnderfined
        }).show()
    }), $(".textarea").on("keyup", e(function() {
        ! function(e) {
            var t = $(".textarea").val();
            sessionStorage.getItem(window.location.pathname) ? sessionStorage.getItem(window.location.pathname) == noteEncrypt(window.location.pathname, sessionStorage.getItem("noteData" + window.location.pathname)) && $.get("https://api.rqn9.com/data/1.0/textvn/" + e + tabLink + "&password=" + sessionStorage.getItem(window.location.pathname) + "&data=" + encodeURIComponent(t), function(e) {
                var t = jQuery.parseJSON(e).response;
                "correct_password" == t.status && $(".updated").find(".autosaved").remove(), $(".updated").addClass("color").append(' <span class="autosaved" style="font-size:11px;">Đã lưu!</span>')
            }) : $.get("https://api.rqn9.com/data/1.0/textvn/" + e + tabLink + "&data=" + encodeURIComponent(t), function(e) {
                var t = jQuery.parseJSON(e).response;
                "error" != t.status && "password protected" != t.message || alertify.alert().setting({
                    message: somethingWrong
                }).show(), $(".updated").find(".autosaved").remove(), $(".updated").addClass("color").append(' <span class="autosaved" style="font-size:11px;">Đã lưu!</span>')
            })
        }(RQN9Api)
    }, 500)), $(".textarea").on("keydown", e(function() {
        $(".updated").removeClass("color"), $(".updated").find(".autosaved").remove()
    })), $("#share-link").click(function() {
        var e, t;
        e = window.location.protocol + "//" + window.location.hostname + window.location.pathname, t = $("<input>"), $("body").append(t), t.val(e).select(), document.execCommand("copy"), t.remove()
    }), $(selector).animate({
        opacity: 1
    }, function() {
        $(this).get(0).style.removeAttribute("filter")
    })
});
