/*globals Markdown */
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

    // var markdownExtra = new Extension("markdownExtra", "Markdown Extra", true);

    var markdownExtraFun = function() {

        // var config = undefined;
            // markdownExtra.settingsBlock = markdownExtraSettingsBlockHTML;
        var config = {
            extensions: [
                "fenced_code_gfm",
                "tables",
                "def_list",
                "attr_list",
                "footnotes",
                "smartypants",
                "strikethrough",
                "newlines"
            ],
            intraword: true,
            comments: true,
            highlighter: "highlight"
        };

        var MarkdownExtra = function() {
        }

        MarkdownExtra.prototype.onLoadSettings = function() {
            function hasExtension(extensionName) {
                return _.some(markdownExtra.config.extensions, function(extension) {
                    return extension == extensionName;
                });
            }

            utils.setInputChecked("#input-markdownextra-fencedcodegfm", hasExtension("fenced_code_gfm"));
            utils.setInputChecked("#input-markdownextra-tables", hasExtension("tables"));
            utils.setInputChecked("#input-markdownextra-deflist", hasExtension("def_list"));
            utils.setInputChecked("#input-markdownextra-attrlist", hasExtension("attr_list"));
            utils.setInputChecked("#input-markdownextra-footnotes", hasExtension("footnotes"));
            utils.setInputChecked("#input-markdownextra-smartypants", hasExtension("smartypants"));
            utils.setInputChecked("#input-markdownextra-strikethrough", hasExtension("strikethrough"));
            utils.setInputChecked("#input-markdownextra-newlines", hasExtension("newlines"));
            utils.setInputChecked("#input-markdownextra-intraword", markdownExtra.config.intraword);
            utils.setInputChecked("#input-markdownextra-comments", markdownExtra.config.comments);
            utils.setInputValue("#input-markdownextra-highlighter", markdownExtra.config.highlighter);
        };

        MarkdownExtra.prototype.onSaveSettings = function(newConfig) {
            newConfig.extensions = [];
            utils.getInputChecked("#input-markdownextra-fencedcodegfm") && newConfig.extensions.push("fenced_code_gfm");
            utils.getInputChecked("#input-markdownextra-tables") && newConfig.extensions.push("tables");
            utils.getInputChecked("#input-markdownextra-deflist") && newConfig.extensions.push("def_list");
            utils.getInputChecked("#input-markdownextra-attrlist") && newConfig.extensions.push("attr_list");
            utils.getInputChecked("#input-markdownextra-footnotes") && newConfig.extensions.push("footnotes");
            utils.getInputChecked("#input-markdownextra-smartypants") && newConfig.extensions.push("smartypants");
            utils.getInputChecked("#input-markdownextra-strikethrough") && newConfig.extensions.push("strikethrough");
            utils.getInputChecked("#input-markdownextra-newlines") && newConfig.extensions.push("newlines");
            newConfig.intraword = utils.getInputChecked("#input-markdownextra-intraword");
            newConfig.comments = utils.getInputChecked("#input-markdownextra-comments");
            newConfig.highlighter = utils.getInputValue("#input-markdownextra-highlighter");
        };

        var eventMgr;
        MarkdownExtra.prototype.onEventMgrCreated = function(eventMgrParameter) {
            eventMgr = eventMgrParameter;
        };

        var previewContentsElt;
        MarkdownExtra.prototype.onReady = function() {
            // previewContentsElt = document.getElementById('preview-contents');
        };

        MarkdownExtra.prototype.onPagedownConfigure = function(editor) {

        	previewContentsElt = editor.ele.find('#preview-contents');

            var converter = editor.markdown.getConverter();

            var extraOptions = {
                extensions: config.extensions,
                highlighter: "prettify"
            };

            if (config.intraword === true) {
                var converterOptions = {
                    _DoItalicsAndBold: function(text) {
                        text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                        text = text.replace(/([^\w*]|^)(\*|_)(?=\S)(.+?)(?=\S)\2(?=[^\w*]|$)/g, "$1<em>$3</em>");
                        // Redo bold to handle _**word**_
                        text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                        return text;
                    }
                };
                converter.setOptions(converterOptions);
            }
            if (config.comments === true) {
                converter.hooks.chain("postConversion", function(text) {
                    return text.replace(/<!--.*?-->/g, function(wholeMatch) {
                        return wholeMatch.replace(/^<!---(.+?)-?-->$/, ' <span class="comment label label-danger">$1</span> ');
                    });
                });
            }
            if (config.highlighter == "highlight") {
                var previewContentsElt = document.getElementById('preview-contents');
                editor.markdown.hooks.chain("onPreviewRefresh", function() {
                    _.each(previewContentsElt.querySelectorAll('.prettyprint > code'), function(elt) {
                        !elt.highlighted && hljs.highlightBlock(elt);
                        elt.highlighted = true;
                    });
                });
            } else if (markdownExtra.config.highlighter == "prettify") {
                editor.markdown.hooks.chain("onPreviewRefresh", prettify.prettyPrint);
            }
            Markdown.Extra.init(converter, extraOptions);
        };

        MarkdownExtra.prototype.onInitPreview = function(review){

            var converter = review.converter;

            var extraOptions = {
                extensions: config.extensions,
                highlighter: "prettify"
            };

            if (config.intraword === true) {
                var converterOptions = {
                    _DoItalicsAndBold: function(text) {
                        text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                        text = text.replace(/([^\w*]|^)(\*|_)(?=\S)(.+?)(?=\S)\2(?=[^\w*]|$)/g, "$1<em>$3</em>");
                        // Redo bold to handle _**word**_
                        text = text.replace(/([^\w*]|^)(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\2(?=[^\w*]|$)/g, "$1<strong>$3</strong>");
                        return text;
                    }
                };
                converter.setOptions(converterOptions);
            }

            Markdown.Extra.init(converter, extraOptions);
        }

        MarkdownExtra.prototype.onReview = function(review) {

            previewContentsElt = review.ele.find('#preview-contents');

            
            if (config.comments === true) {
                converter.hooks.chain("postConversion", function(text) {
                    return text.replace(/<!--.*?-->/g, function(wholeMatch) {
                        return wholeMatch.replace(/^<!---(.+?)-?-->$/, ' <span class="comment label label-danger">$1</span> ');
                    });
                });
            }
            if (config.highlighter == "highlight") {

                    _.each(previewContentsElt[0].querySelectorAll('.prettyprint > code'), function(elt) {
                        !elt.highlighted && hljs.highlightBlock(elt);
                        elt.highlighted = true;
                    });

            } else if (markdownExtra.config.highlighter == "prettify") {
                // editor.markdown.hooks.chain("onPreviewRefresh", prettify.prettyPrint);
                prettify.prettyPrint();
            }
            
        };
        return MarkdownExtra;
    }

    // return markdownExtra;

    var MarkdownExtra = (function() {

        // rangy.init();

        function MarkdownExtra() {

            var conFun = markdownExtraFun();

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
        return MarkdownExtra;
    })();

    window.lin = window.lin || {};
    window.lin.eventExtensions = window.lin.eventExtensions || {};
    window.lin.eventExtensions.MarkdownExtra = MarkdownExtra;

    return MarkdownExtra;
}));