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
        
        if (__jupyter_scroll.debug) {
            console.debug("current scroll top: " + scroll.scrollTop());
            console.debug("scroll height: " + scroll.height());
            console.debug("number of children: " + scroll.children().length);
            if (scroll.children().length > 0) {
                console.debug("last child position: " + scroll.children().last().position().top);
                console.debug("last child height: " + scroll.children().last().height());
            }
        }

        // scroll.children() are the those div.output_area
        // 3 types:
        //     1) stdout stream (has a ".output_subarea.output_text" child, with ".output_stream.output_stdout"),
        //     2) stderr stream (has a ".output_subarea.output_text" child, with ".output_stream.output_stderr"), and
        //     3) error (different from stderr! has a ".output_subarea.output_text" child, with ".output_error")
        // logging uses stderr
        // if different types of output are used alternatively, many areas are generated
        // if error come out (including KeyboardInterrupt), the process will stop and no more area will be added
        // my strategy is:
        //     scroll to the very bottom if no error (only stdout and stderr),
        //     and to between error and the 2nd to the last area else-wise

        if (scroll.children().length == 0) {
            // if no children, nothing is printed and we shall sit tight
            return;
        }

        // prepare for the calculation
        var scroll_to = 0;
        // finish all animations (to get every position up-to-date)
        scroll.finish();
        
        if (scroll.children().last().children(".output_subarea.output_text").hasClass("output_error")) {
            // error (or anything more than this) is out
            // scroll to between the std out and the error
            // do the calculation
            scroll_to = scroll.scrollTop() + scroll.children().last().position().top - 0.5 * scroll.height();
        } else {
            // no error, but logging and std out
            // just to to end of std out
            scroll_to = scroll.scrollTop() + scroll.children().last().position().top + scroll.children().last().height() - scroll.height();
        }

        // do a little animation that looks more smooth
        scroll.animate({scrollTop:scroll_to}, __jupyter_scroll.speed);
        // scroll.scrollTop(scroll_to);

        if (__jupyter_scroll.debug) console.debug("scroll to: " + scroll_to);
    });

    if (__jupyter_scroll.debug) console.debug("setup script finished");
});
