$(function () {
  $(".faq-list dt").on("click", function () {
    $(this).parent("dl").toggleClass("on");
    $(this).next("dd").slideToggle(500);
  });
})