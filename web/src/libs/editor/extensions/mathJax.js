// /*defines MathJax */
// define([
// 	"utils",
// 	"classes/Extension",
// 	"text!html/mathJaxSettingsBlock.html",
// 	"mathjax"
// ], function(utils, Extension, mathJaxSettingsBlockHTML) {

(function(global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("jQuery requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

    'use strict'
    // var mathJax = new Extension("mathJax", "MathJax", true);
    // mathJax.settingsBlock = mathJaxSettingsBlockHTML;//用于设置时显示的内容

    var mathJaxFun = function() {
            var MathJax = function() {};
            var preview;
            MathJax.defaultConfig = {
                tex: "{}",
                tex2jax: '{ inlineMath: [["$","$"],["\\\\\\\\(","\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\[","\\\\]"]], processEscapes: true }'
            };

            // mathJax.onLoadSettings = function() {
            // 	// debugger
            // 	utils.setInputValue("#input-mathjax-config-tex", mathJax.config.tex);
            // 	utils.setInputValue("#input-mathjax-config-tex2jax", mathJax.config.tex2jax);
            // };

            // mathJax.onSaveSettings = function(newConfig, event) {
            // 	// debugger
            // 	newConfig.tex = utils.getInputJsValue("#input-mathjax-config-tex", event);
            // 	newConfig.tex2jax = utils.getInputJsValue("#input-mathjax-config-tex2jax", event);
            // };

            /*jshint ignore:start */
            MathJax.prototype.onPagedownConfigure = function(editorObject) {
                // debugger
                // console.log('mathJax.onPagedownConfigure = function(editorObject)');
                // preview = document.getElementById("preview-contents");
                preview = editorObject.ele.find('#preview-contents')[0];

                var converter = editorObject.markdown.getConverter();
                converter.hooks.chain("preConversion", removeMath);
                converter.hooks.chain("postConversion", replaceMath);
            };

            var afterRefreshCallback;
            MathJax.prototype.onAsyncPreview = function(callback) {
                // debugger
                // console.log('mathJax.onAsyncPreview = function(callback)');
                afterRefreshCallback = callback;
                UpdateMJ();
            };

            // From math.stackexchange.com...

            //
            //  The math is in blocks i through j, so
            //    collect it into one block and clear the others.
            //  Replace &, <, and > by named entities.
            //  For IE, put <br> at the ends of comments since IE removes \n.
            //  Clear the current math positions and store the index of the
            //    math, then push the math string onto the storage array.
            //
            function processMath(i, j, unescape) {
                // debugger
                // console.log('function processMath(i, j, unescape)');
                var block = blocks.slice(i, j + 1).join("")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                for (HUB.Browser.isMSIE && (block = block.replace(/(%[^\n]*)\n/g, "$1<br/>\n")); j > i;)
                    blocks[j] = "", j--;
                blocks[i] = "@@" + math.length + "@@";
                unescape && (block = unescape(block));
                math.push(block);
                start = end = last = null;
            }

            function removeMath(text) {
                // debugger
                // console.log('function removeMath(text)');
                start = end = last = null;
                math = [];
                var unescape;
                if (/`/.test(text)) {
                    text = text.replace(/~/g, "~T").replace(/(^|[^\\])(`+)([^\n]*?[^`\n])\2(?!`)/gm, function(text) {
                        return text.replace(/\$/g, "~D")
                    });
                    unescape = function(text) {
                        return text.replace(/~([TD])/g,
                            function(match, n) {
                                return {
                                    T: "~",
                                    D: "$"
                                }[n]
                            })
                    };
                } else {
                    unescape = function(text) {
                        return text
                    };
                }
                blocks = split(text.replace(/\r\n?/g, "\n"), splitDelimiter);
                for (var i = 1, m = blocks.length; i < m; i += 2) {
                    var block = blocks[i];
                    if ("@" === block.charAt(0)) {
                        //
                        //  Things that look like our math markers will get
                        //  stored and then retrieved along with the math.
                        //
                        blocks[i] = "@@" + math.length + "@@";
                        math.push(block)
                    } else if (start) {
                        // Ignore inline maths that are actually multiline (fixes #136)
                        if (end == inline && block.charAt(0) == '\n') {
                            if (last) {
                                i = last;
                                processMath(start, i, unescape);
                            }
                            start = end = last = null;
                            braces = 0;
                        }
                        //
                        //  If we are in math, look for the end delimiter,
                        //    but don't go past double line breaks, and
                        //    and balance braces within the math.
                        //
                        else if (block === end) {
                            if (braces) {
                                last = i
                            } else {
                                processMath(start, i, unescape)
                            }
                        } else {
                            if (block.match(/\n.*\n/)) {
                                if (last) {
                                    i = last;
                                    processMath(start, i, unescape);
                                }
                                start = end = last = null;
                                braces = 0;
                            } else {
                                if ("{" === block) {
                                    braces++
                                } else {
                                    "}" === block && braces && braces--
                                }
                            }
                        }
                    } else {
                        if (block === inline || "$$" === block) {
                            start = i;
                            end = block;
                            braces = 0;
                        } else {
                            if ("begin" === block.substr(1, 5)) {
                                start = i;
                                end = "\\end" + block.substr(6);
                                braces = 0;
                            }
                        }
                    }

                }
                last && processMath(start, last, unescape);
                return unescape(blocks.join(""))
            }

            //
            //  Put back the math strings that were saved,
            //    and clear the math array (no need to keep it around).
            //
            function replaceMath(text) {
                // debugger
                // console.log('function replaceMath(text)');


                text = text.replace(/@@(\d+)@@/g, function(match, n) {
                    return math[n]
                });

                // console.log(text);
                // console.log(math);

                // text = text.replace(/@@(\d+)@@/g, function(text){
                //     return function(match, n) {
                //         console.log('text:'+text);
                //         return math[n]
                //     }
                // }(text));
                // math = null;
                return text
            }

            //
            //  This is run to restart MathJax after it has finished
            //    the previous run (that may have been canceled)
            //
            function RestartMJ() {
                // console.log('function RestartMJ()');
                pending = false;
                HUB.cancelTypeset = false;
                HUB.Queue([
                    "Typeset",
                    HUB,
                    preview
                ]);
                HUB.Queue(afterRefreshCallback); //benweet
            }

            //
            //  When the preview changes, cancel MathJax and restart,
            //    if we haven't done that already.
            //
            function UpdateMJ() {
                // console.log('function UpdateMJ()');
                if (!pending /*benweet (we need to call our afterRefreshCallback) && ready */ ) {
                    pending = true;
                    HUB.Cancel();
                    HUB.Queue(RestartMJ);
                }
            }

            var ready = false,
                pending = false,
                preview = null,
                inline = "$",
                blocks, start, end, last, braces, math, HUB = window.MathJax.Hub;

            //
            //  Runs after initial typeset
            //
            HUB.Queue(function() {
                // console.log('HUB.Queue(function() {');
                ready = true;
                HUB.processUpdateTime = 50;
                // HUB.Config({
                //     "HTML-CSS": {
                //         EqnChunk: 10,
                //         EqnChunkFactor: 1
                //     },
                //     SVG: {
                //         EqnChunk: 10,
                //         EqnChunkFactor: 1
                //     }
                // })
                HUB.Config({
                    skipStartupTypeset: true,
                    "HTML-CSS": {
                        preferredFont: "TeX",
                        availableFonts: [
                            "TeX"
                        ],
                        linebreaks: {
                            automatic: true
                        },
                        EqnChunk: 10,
                        imageFont: null
                    },
                    tex2jax: {
                        inlineMath: [
                            ["$", "$"],
                            ["\\\\(", "\\\\)"]
                        ],
                        displayMath: [
                            ["$$", "$$"],
                            ["\\[", "\\]"]
                        ],
                        processEscapes: true
                    },
                    TeX: $.extend({
                        noUndefined: {
                            attributes: {
                                mathcolor: "red",
                                mathbackground: "#FFEEEE",
                                mathsize: "90%"
                            }
                        },
                        Safe: {
                            allow: {
                                URLs: "safe",
                                classes: "safe",
                                cssIDs: "safe",
                                styles: "safe",
                                fontsize: "all"
                            }
                        }
                    }, undefined),
                    messageStyle: "none"
                });
            });


            /*benweet
	 Don't hash inline math $...$ (see https://github.com/benweet/stackedit/issues/136)
	 var u = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[\\{}$]|[{}]|(?:\n\s*)+|@@\d+@@)/i, r;
	 */


            //
            //  The pattern for math delimiters and special symbols
            //    needed for searching for math in the page.
            //
            var splitDelimiter = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[\\{}$]|[{}]|(?:\n\s*)+|@@\d+@@)/i;
            var split;

            if (3 === "aba".split(/(b)/).length) {
                split = function(text, delimiter) {
                    return text.split(delimiter)
                };
            } else {
                split = function(text, delimiter) {
                    var b = [],
                        c;
                    if (!delimiter.global) {
                        c = delimiter.toString();
                        var d = "";
                        c = c.replace(/^\/(.*)\/([im]*)$/, function(a, c, b) {
                            d = b;
                            return c
                        });
                        delimiter = RegExp(c, d + "g")
                    }
                    for (var e = delimiter.lastIndex = 0; c = delimiter.exec(text);) {
                        b.push(text.substring(e, c.index));
                        b.push.apply(b, c.slice(1));
                        e = c.index + c[0].length;
                    }
                    b.push(text.substring(e));
                    return b
                };
            }

            (function() {
                var HUB = window.MathJax.Hub;
                if (!HUB.Cancel) {
                    HUB.cancelTypeset = !1;
                    HUB.Register.StartupHook("HTML-CSS Jax Config", function() {
                        var HTMLCSS = window.MathJax.OutputJax["HTML-CSS"],
                            TRANSLATE = HTMLCSS.Translate;
                        HTMLCSS.Augment({
                            Translate: function(script, state) {
                                if (HUB.cancelTypeset || state.cancelled)
                                    throw Error("MathJax Canceled");
                                return TRANSLATE.call(HTMLCSS, script, state)
                            }
                        })
                    });
                    HUB.Register.StartupHook("SVG Jax Config", function() {
                        // debugger
                        var SVG = window.MathJax.OutputJax.SVG,
                            TRANSLATE = SVG.Translate;
                        SVG.Augment({
                            Translate: function(script, state) {
                                if (HUB.cancelTypeset || state.cancelled)
                                    throw Error("MathJax Canceled");
                                return TRANSLATE.call(SVG,
                                    script, state)
                            }
                        })
                    });
                    HUB.Register.StartupHook("TeX Jax Config", function() {
                        var TEX = window.MathJax.InputJax.TeX,
                            TRANSLATE = TEX.Translate;
                        TEX.Augment({
                            Translate: function(script, state) {
                                if (HUB.cancelTypeset || state.cancelled)
                                    throw Error("MathJax Canceled");
                                return TRANSLATE.call(TEX, script, state)
                            }
                        })
                    });
                    var PROCESSERROR = HUB.processError;
                    HUB.processError = function(error, state, type) {
                        if ("MathJax Canceled" !== error.message)
                            return PROCESSERROR.call(HUB, error, state, type);
                        MathJax.Message.Clear(0, 0);
                        state.jaxIDs = [];
                        state.jax = {};
                        state.scripts = [];
                        state.i = state.j = 0;
                        state.cancelled = true;
                        return null
                    };
                    HUB.Cancel = function() {
                        this.cancelTypeset = true
                    }
                }
            })();

            MathJax.prototype.onPreview = function(preview){
                if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {

                    // debugger
                    MathJax.Hub.cancelTypeset = false;
                    MathJax.Hub.Queue([
                        "Typeset",
                        MathJax.Hub,
                        preview.ele[0]
                    ]);
                }
            }
            return MathJax;
        }
        /*jshint ignore:end */


    var MathJax = (function() {

        // rangy.init();

        function MathJax() {

            var conFun = mathJaxFun();

            if (!arguments || arguments.length == 0) {
                return new conFun();
            }

            if (arguments.length == 1) {
                return new conFun(arguments[0]);
            }

            var cs = 'new conFun(';
            for (var n = 0; n < arguments.length; n++) {
                cs += 'arguments[' + n + ']';
                if (n != arguments.length - 1) {
                    cs += ","
                }
            }
            cs += ')';
            return eval(cs);

        }
        return MathJax;
    })();

    window.lin = window.lin || {};
    window.lin.eventExtensions = window.lin.eventExtensions || {};
    window.lin.eventExtensions.MathJax = MathJax;

    return MathJax;
}));