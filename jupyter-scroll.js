// ==UserScript==
// @name         Jupyter Scroll
// @namespace    http://guoquan.org/
// @version      0.1
// @description  Jupyter Notebook is a web application that allows you to create and run live code online. This script automatically scroll down the output scroll in jupyter to show the final result. This is useful when long pages of output are generated but you only want to track the latest one.
// @author       Guo Quan <guoquanscu@gmail.com>
// @homepage     https://github.com/guoquan/jupyter-scroll
// @downloadURL  https://raw.githubusercontent.com/guoquan/jupyter-scroll/master/jupyter-scroll.js
// @updateURL    https://raw.githubusercontent.com/guoquan/jupyter-scroll/master/jupyter-scroll.js
// @include      /^https?://.*/notebook/
// @exclude      
// @match        
// @run-at       document-end
// @grant        none
// ==/UserScript==

var __jupyter_scroll = {};
__jupyter_scroll.debug = false;
__jupyter_scroll.speed = 500;

$(function(){
    // strict mode
    'use strict';

    if (__jupyter_scroll.debug) console.debug("setup script running");

    // use the "DOMSubtreeModified" event to track the scroll box
    //$("document").off("DOMSubtreeModified")
    // bind the event to document so it can be valid for nodes loaded later
    $(document).on("DOMSubtreeModified", "div.output_scroll", function() {
        if (__jupyter_scroll.debug) console.debug("Change event triggered.");
        scroll = $(this);
        if (scroll.children().length > 0) {
            // if scroll has child, let's do the hack
            if (__jupyter_scroll.debug) {
                console.debug("current scroll top: " + scroll.scrollTop());
                console.debug("last child position: " + scroll.children().last().position().top);
                console.debug("scroll height: " + scroll.height());
            }

            // finish all animations
            scroll.finish()
            // I want to show half the final output and half the error message
            // if no error message, it just over scroll, and that is fine
            // do the calculation
            var scroll_to = (scroll.scrollTop() + scroll.children().last().position().top - 0.5 * scroll.height());
            // do a little animation that looks more smooth
            scroll.animate({scrollTop:scroll_to}, __jupyter_scroll.speed);
            //scroll.scrollTop(scroll_to);

            if (__jupyter_scroll.debug) {
                console.debug("scroll to: " + scroll_to);
            }
        }
    });

    if (__jupyter_scroll.debug) console.debug("setup script finished");
});
