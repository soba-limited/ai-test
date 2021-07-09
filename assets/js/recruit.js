$(document).ready(function () {
    $(".slide-list").slick({
        arrows: false,
        dots: false,
        fade: true
    });
});

$(".toggle-button").on("click", function () {
    $(this).toggleClass("on");
    $(this).next().slideToggle(500);
});