/* eslint-disable strict */
/* eslint-disable no-undef */
(function ($) {
    "use strict";

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $(".sidebar .collapse").collapse("hide");
        }
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function () {
        if ($(window).width() < 768) {
            $(".sidebar .collapse").collapse("hide");
        }
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on("scroll", function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $(".scroll-to-top").fadeIn();
        } else {
            $(".scroll-to-top").fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on("click", "a.scroll-to-top", function (e) {
        var $anchor = $(this);
        var href = $anchor.attr("href");
        if (href && $(href).length) {
            $("html, body").stop().animate({
                scrollTop: $(href).offset().top
            }, 1000, "easeInOutExpo");
        }
        e.preventDefault();
    });

})(jQuery);

// Document ready function
$(document).ready(function () {
    $("#myBtn").click(function () {
        $(".modal").modal("show");
    });
    $("#modalLong").click(function () {
        $(".modal").modal("show");
    });
    $("#modalScroll").click(function () {
        $(".modal").modal("show");
    });
    $("#modalCenter").click(function () {
        $(".modal").modal("show");
    });
});

// Initialize popovers
$(function () {
    $('[data-toggle="popover"]').popover();
    $(".popover-dismiss").popover({
        trigger: "focus"
    });
});

// Set version if element exists
var version = document.getElementById("version-ruangadmin");
if (version) {
    version.innerHTML = "Version 1.1";
}
