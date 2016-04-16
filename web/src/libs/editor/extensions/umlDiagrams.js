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

    var umlDiagramsFun = function() {
        // var umlDiagrams = new Extension("umlDiagrams", "UML Diagrams", true);
        // umlDiagrams.settingsBlock = umlDiagramsSettingsBlockHTML;
        var config = {
            flowchartOptions: [
                '{',
                '   "line-width": 2,',
                '   "font-family": "sans-serif",',
                '   "font-weight": "normal"',
                '}'
            ].join('\n')
        };

        var UmlDiagrams = function() {}

        UmlDiagrams.prototype.onLoadSettings = function() {
            utils.setInputValue("#textarea-umldiagram-flowchart-options", umlDiagrams.config.flowchartOptions);
        };

        UmlDiagrams.prototype.onSaveSettings = function(newConfig, event) {
            newConfig.flowchartOptions = utils.getInputJSONValue("#textarea-umldiagram-flowchart-options", event);
        };

        var umlDiagramsDrawFun = function(previewContentsElt) {

            _.each(previewContentsElt.querySelectorAll('.prettyprint > .language-sequence'), function(elt) {
                try {
                    var diagram = Diagram.parse(elt.textContent);
                    var preElt = elt.parentNode;
                    var containerElt = crel('div', {
                        class: 'sequence-diagram'
                    });
                    preElt.parentNode.replaceChild(containerElt, preElt);
                    diagram.drawSVG(containerElt, {
                        theme: 'simple'
                    });
                } catch (e) {
                    console.log(e)
                }
            });
            _.each(previewContentsElt.querySelectorAll('.prettyprint > .language-flow'), function(elt) {
                try {
                    var chart = flowchart.parse(elt.textContent);
                    var preElt = elt.parentNode;
                    var containerElt = crel('div', {
                        class: 'flow-chart'
                    });
                    preElt.parentNode.replaceChild(containerElt, preElt);
                    chart.drawSVG(containerElt, JSON.parse(config.flowchartOptions));
                } catch (e) {
                    console.log(e)
                }
            });
        };

        UmlDiagrams.prototype.onPreview = function(preview) {
        	// setTimeout(function(){
	            umlDiagramsDrawFun(preview.ele[0]);
	        // },5000);
        }

        UmlDiagrams.prototype.onPagedownConfigure = function(editor) {
            var previewContentsElt = editor.ele.find('#preview-contents')[0];
            editor.markdown.hooks.chain("onPreviewRefresh", function() {
                umlDiagramsDrawFun(previewContentsElt);
            });
        };

        return UmlDiagrams;
    }

    var UmlDiagrams = (function() {

        // rangy.init();

        function UmlDiagrams() {

            var conFun = umlDiagramsFun();

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
        return UmlDiagrams;
    })();

    window.lin = window.lin || {};
    window.lin.eventExtensions = window.lin.eventExtensions || {};
    window.lin.eventExtensions.UmlDiagrams = UmlDiagrams;

    return UmlDiagrams;
}));