// ==UserScript==
// @name         Jupyter Scroll
// @namespace    http://guoquan.org/
// @version      0.1
// @description  Jupyter Notebook is a web application that allows you to create and run live code online. This script automatically scroll down the output scroll in jupyter to show the final result. This is useful when long pages of output are generated but you only want to track the latest one.
// @author       Guo Quan
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

// use the "DOMSubtreeModified" event to track the scroll box
_jupyter_scroll_debug_ = false;
_jupyter_scroll_speed_ = 500;
//$("div.output_scroll").unbind("DOMSubtreeModified")
$("div.output_scroll").bind("DOMSubtreeModified",function() {
    if (_jupyter_scroll_debug_) {
        console.debug("current scroll top: " + $(this).scrollTop());
        console.debug("last child position: " + $(this).children(":last").position().top);
        console.debug("scroll height: " + $(this).height());
    }

    // finish all animations
    $(this).finish()
    // I want to show half the final output and half the error message
    // if no error message, it just over scroll, and that is fine
    // do the calculation
    scroll_to = ($(this).scrollTop() + $(this).children(":last").position().top - 0.5 * $(this).height());
    // do a little animation that looks more smooth
    $(this).animate({scrollTop:scroll_to}, _jupyter_scroll_speed_);
    //$(this).scrollTop(scroll_to);

    if (_jupyter_scroll_debug_) {
        console.debug("scroll to: " + scroll_to);
    }
});
