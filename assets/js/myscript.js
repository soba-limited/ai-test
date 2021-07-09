/*-------------------go top-------------------- */
$(function () {
    $('.go-top').hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.go-top').fadeIn();
        } else {
            $('.go-top').fadeOut();
        }
    });

    $(".switch-m").mouseover(function () {
        $(".sub-menu").addClass("on");
    });

    $("header").mouseleave(function () {
        $(".sub-menu").removeClass("on");
    });
});

$(document).ready(function () {
    if ($('div').hasClass("wp-pagenavi") && !$("a").hasClass("previouspostslink")) {
        $("div.wp-pagenavi").prepend("<span class='previouspostslink dummy'></span>");
    } else if ($('div').hasClass("wp-pagenavi") && !$("a").hasClass("nextpostslink")) {
        $("div.wp-pagenavi").append("<span class='nextpostslink dummy'></span>");
    }
    if ($("span").hasClass("mwform-checkbox-field-text")) {
        const privacy = "<a href='./privacy'>プライバシーポリシー</a>に同意する";
        $("span.mwform-checkbox-field-text").html(privacy);
    }
});

$(document).ready(function () {
    $(".fs-c-checkbox__labelText").children("a").each(function () {
        var nowlink = $(this).attr("href");
        console.log(nowlink);
        if (nowlink == "/p/about/member-agreement") {
            $(this).attr("href", "https://www.lensdo.jp/f/kiyaku");
        } else if (nowlink == "/p/about/privacy-policy") {
            $(this).attr("href", "https://www.lensdo.jp/f/privacy");
        }
    });
});