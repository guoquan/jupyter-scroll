// ==UserScript==
// @name         Jupyter Scroll
// @namespace    http://guoquan.org/
// @version      0.1
// @description  Jupyter Notebook is a web application that allows you to create and run live code online. This script automatically scroll down the output scroll in jupyter to show the final result. This is useful when long pages of output are generated but you only want to track the latest one.
// @author       Guo Quan <guoquanscu@gmail.com>
// @homepage     https://github.com/guoquan/jupyter-scroll
// @downloadURL  https://raw.githubusercontent.com/guoquan/jupyter-scroll/master/jupyter-scroll.js
// @updateURL    https://raw.githubusercontent.com/guoquan/jupyter-scroll/master/jupyter-scroll.js
// @include      
// @exclude      
// @match        
// @run-at       document-idle
// @grant        none
// ==/UserScript==
/* jshint -W097 */

_jupyter_scroll_debug_ = true;
_jupyter_scroll_speed_ = 500;

$(document).ready(function(){
    'use strict';

    window.alert("Hello.. My Extension processed you..");

    // use the "DOMSubtreeModified" event to track the scroll box
    //$("div.output_scroll").off("DOMSubtreeModified")
    $("div.output_scroll").on("DOMSubtreeModified", function() {
        scroll = $(this);
        if (scroll.children().length > 0) {
            // if scroll has child, let's do the hack
            if (_jupyter_scroll_debug_) {
                console.debug("current scroll top: " + scroll.scrollTop());
                console.debug("last child position: " + scroll.children().last().position().top);
                console.debug("scroll height: " + scroll.height());
            }

            // finish all animations
            scroll.finish()
            // I want to show half the final output and half the error message
            // if no error message, it just over scroll, and that is fine
            // do the calculation
            scroll_to = (scroll.scrollTop() + scroll.children().last().position().top - 0.5 * scroll.height());
            // do a little animation that looks more smooth
            scroll.animate({scrollTop:scroll_to}, _jupyter_scroll_speed_);
            //scroll.scrollTop(scroll_to);

            if (_jupyter_scroll_debug_) {
                console.debug("scroll to: " + scroll_to);
            }
        }
    });
});
