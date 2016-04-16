// define([
//     "underscore",
//     "extensions/markdownExtra",
//     "extensions/mathJax",
//     "extensions/partialRendering",
//     "classes/Extension",
//     "crel",
// ], function(_, markdownExtra, mathJax, partialRendering, Extension, crel) {

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

    // var markdownSectionParser = new Extension("markdownSectionParser", "Markdown section parser");

    // var eventMgr;
    // markdownSectionParser.onEventMgrCreated = function(eventMgrParameter) {
    //     eventMgr = eventMgrParameter;
    // };

    var markdownSectionParserFun = function() {
        var events;

        // var markdownSectionParser = {};
        var MarkdownSectionParser = function(){}

        // markdownSectionParser.onCreated = function(eventsParameter) {
        MarkdownSectionParser.prototype.onCreated = function(eventsParameter) {
            events = eventsParameter;
        }

        var sectionList = [];
        var previewContentsElt;

        var editor;
        // Regexp to look for section delimiters
        var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters
        // markdownSectionParser.onPagedownConfigure = function(editorParam) {
        MarkdownSectionParser.prototype.onPagedownConfigure = function(editorParam) {
            // if(markdownExtra.enabled) {
            //     if(_.some(markdownExtra.config.extensions, function(extension) {
            //         return extension == "fenced_code_gfm";
            //     })) {
            editor = editorParam;

            previewContentsElt = editor.ele.find('#preview-contents')[0];

            regexp = '^```[^`\\n]*\\n[\\s\\S]*?\\n```|' + regexp; // Fenced block delimiters
            //     }
            // }
            // if(mathJax.enabled) {
            // Math delimiter has to follow 1 empty line to be considered as a section delimiter
            regexp = '^[ \\t]*\\n\\$\\$[\\s\\S]*?\\$\\$|' + regexp; // $$ math block delimiters
            regexp = '^[ \\t]*\\n\\\\\\\\[[\\s\\S]*?\\\\\\\\]|' + regexp; // \\[ \\] math block delimiters
            regexp = '^[ \\t]*\\n\\\\?\\\\begin\\{[a-z]*\\*?\\}[\\s\\S]*?\\\\end\\{[a-z]*\\*?\\}|' + regexp; // \\begin{...} \\end{...} math block delimiters
            // }
            regexp = new RegExp(regexp, 'gm');

            var converter = editor.markdown.getConverter();
            // if(!partialRendering.enabled) {
            converter.hooks.chain("preConversion", function() {
                // debugger
                return _.reduce(sectionList, function(result, section) {
                    return result + '\n<div class="se-preview-section-delimiter"></div>\n\n' + section.text + '\n\n';
                }, '');
            });

            editor.markdown.hooks.chain("onPreviewRefresh", function() {
                var wmdPreviewElt = document.getElementById("wmd-preview");
                var childNode = wmdPreviewElt.firstChild;

                function createSectionElt() {
                    var sectionElt = crel('div', {
                        class: 'wmd-preview-section preview-content'
                    });
                    var isNextDelimiter = false;
                    while (childNode) {
                        var nextNode = childNode.nextSibling;
                        var isDelimiter = childNode.className == 'se-preview-section-delimiter';
                        if (isNextDelimiter === true && childNode.tagName == 'DIV' && isDelimiter) {
                            // Stop when encountered the next delimiter
                            break;
                        }
                        isNextDelimiter = true;
                        isDelimiter || sectionElt.appendChild(childNode);
                        childNode = nextNode;
                    }
                    return sectionElt;
                }

                var newSectionEltList = document.createDocumentFragment();
                sectionList.forEach(function(section) {
                    newSectionEltList.appendChild(createSectionElt(section));
                });
                previewContentsElt.innerHTML = '';
                previewContentsElt.appendChild(wmdPreviewElt);
                previewContentsElt.appendChild(newSectionEltList);
            });
            // }
        };

        // markdownSectionParser.onReady = function() {
        //     previewContentsElt = document.getElementById("preview-contents");
        // };

        var fileDesc;
        MarkdownSectionParser.prototype.onFileSelected = function(fileDescParam) {
            fileDesc = fileDescParam;
        };

        var sectionCounter = 0;

        function parseFileContent(fileDescParam, content) {
            // if (fileDescParam !== fileDesc) {
            //     return;
            // }
            //var frontMatter = (fileDesc.frontMatter || {})._frontMatter || '';
            var frontMatter = '';
            var text = content.substring(frontMatter.length);
            var tmpText = text + "\n\n";

            function addSection(startOffset, endOffset) {
                var sectionText = tmpText.substring(offset, endOffset);
                sectionList.push({
                    id: ++sectionCounter,
                    text: sectionText,
                    textWithFrontMatter: frontMatter + sectionText
                });
                frontMatter = '';
            }
            sectionList = [];
            var offset = 0;
            // Look for delimiters
            tmpText.replace(regexp, function(match, matchOffset) {
                // Create a new section with the text preceding the delimiter
                addSection(offset, matchOffset);
                offset = matchOffset;
            });
            // Last section
            addSection(offset, text.length);
            events.onSectionsCreated(sectionList);
        }

        MarkdownSectionParser.prototype.onFileOpen = parseFileContent;
        MarkdownSectionParser.prototype.onContentChanged = parseFileContent;

        return MarkdownSectionParser;
    }


    var MarkdownSectionParser = (function() {

        // rangy.init();

        function MarkdownSectionParser() {

            var conFun = markdownSectionParserFun();

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
        return MarkdownSectionParser;
    })();

    window.lin = window.lin || {};
    window.lin.eventExtensions = window.lin.eventExtensions || {};
    window.lin.eventExtensions.MarkdownSectionParser = MarkdownSectionParser;

    return MarkdownSectionParser;
}));