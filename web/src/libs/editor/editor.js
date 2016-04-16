/************************************************************************
 *
 * 任务：
 *
 * 1、在右下角加浮动菜单，包括：隐藏预览、全屏预览、目录、统计、帮助
 * 2、处理预览刷新问题
 * 3、得到生成的html内容
 * 4、添加插件
 * 5、waitForImages
 * 6、在工具栏上添加自定义按钮
 onAsyncPreview 第一次不执行

 Editor增加属性：

 htmlWithComments = utils.trim(html);
                    var htmlWithoutComments

 *
 *
 *  6、实现 编辑高度自动变化
 *
 *************************************************************************/


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


    // Faster than setTimeout (see http://dbaron.org/log/20100309-faster-timeouts)
    var defer = (function() {
        var timeouts = [];
        var messageName = "deferMsg";
        window.addEventListener("message", function(evt) {
            if (evt.source == window && evt.data == messageName) {
                evt.stopPropagation();
                if (timeouts.length > 0) {
                    timeouts.shift()();
                }
            }
        }, true);
        return function(fn) {
            timeouts.push(fn);
            window.postMessage(messageName, "*");
        };
    })();

    var debounce = function(func, context) {
        var isExpected = false;

        function later() {
            isExpected = false;
            func.call(context);
        }

        return function() {
            if (isExpected === true) {
                return;
            }
            isExpected = true;
            //utils.defer(later);
            defer(later);
        };
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////


    // var ht


    //////////////////////////////////////////////////////////////////////////////////////////////////////////


    var editorHtml = '<div class="editor editor-div">' +
        '<!-- <div class="layout-wrapper-l1"> -->' + '<!--  <div class="layout-wrapper-l2"> -->' +
        '	<div class="navbar navbar-default">' +
        '    	<div class="navbar-inner">' +
        // '        <div class="nav left-space"></div>' + 
        // '        <div class="nav right-space pull-right"></div>' + 
        '        	<div class="buttons-dropdown dropdown">' +
        '            	<div class="nav">' +
        '                	<button class="btn btn-success" data-toggle="dropdown"' +
        '                    	title="Show buttons">' +
        '                    	<i class="icon-th-large"></i>' +
        '                	</button>' +
        '                	<div class="dropdown-menu">' +
        '                	</div>' +
        '            	</div>' +
        '        	</div> ' +
        '        	<ul class="nav left-buttons">' +
        '            	<li class="wmd-button-group1 btn-group"></li>' +
        '        	</ul>' +
        '        	<ul class="nav left-buttons">' +
        '            	<li class="wmd-button-group2 btn-group"></li>' +
        '        	</ul>' +
        '        	<ul class="nav left-buttons">' +
        '            	<li class="wmd-button-group3 btn-group"></li>' +
        '        	</ul>' +
        '        	<ul class="nav left-buttons">' +
        '            	<li class="wmd-button-group5 btn-group"></li>' +
        '        	</ul>' +
        '        	<ul class="nav left-buttons">' +
        '            	<li class="wmd-button-group4 btn-group">' +
        '                	<a class="btn btn-success button-open-discussion" title="Comments Ctrl/Cmd+M"><i class="icon-comment-alt"></i></a>' +
        '            	</li>' +
        '        	</ul>' +
        '        	<!-- <ul class="nav pull-right right-buttons">' +
        '            	<li class="offline-status hide">' +
        '                	<div class="text-danger">' +
        '                    	<i class="icon-attention-circled"></i>offline' +
        '                	</div>' +
        '            	</li>' +
        '            	<li class="extension-buttons"></li>' +
        '        	</ul>' +
        '        	<ul class="nav pull-right title-container">' +
        '            	<li><div class="working-indicator"></div></li>' +
        '            	<li><a class="btn btn-success file-title-navbar" href="#"' +
        '                	title="Rename document"> </a></li>' +
        '            	<li><div class="input-file-title-container"><input type="text"' +
        '                	class="col-sm-4 form-control hide input-file-title"' +
        '                	placeholder="Document title" /></div></li>' +
        '        	</ul> -->' +
        '    	</div>' +
        '	</div>' +
        '	<div id="wmd-button-bar" class="hide"></div>' +
        '	<div style="position: absolute;width: 100%;top: 40px;bottom: 0px;">' +
        '    	<div class="layout-wrapper-l3" style="bottom: 0px;left: 0px;width: 50%;position: absolute;top: 0px;">' +
        '			<div style="position:absolute;left:3px;top:0px;bottom:3px;right:2px;">' +
        '        		<pre id="wmd-input" class="wmd-input form-control" style="padding: 5px;height:100%;"><div class="editor-content" contenteditable=true style="padding-bottom:20px;"></div></pre>' +
        '        		<!-- <textarea class="wmd-input" id="wmd-input" style="width:100%;height:100%;"></textarea> -->' +
        '			</div>' +
        '    	</div>' +
        '		<div class="preview-container" style="position: absolute;top: 0;-webkit-box-shadow: inset 1px 0 rgba(128, 128, 128, 0.06);box-shadow: inset 1px 0 rgba(128, 128, 128, 0.06);z-index: 10;bottom: 0px;left: 50%;right: 0px;overflow: auto;">' +
        '			<div id="preview-contents" style="padding:5px;position:absolute;left:2px;top:0px;bottom:3px;right:3px;background-color: #f6f6f6;">' +
        '    			<div id="wmd-preview" class="preview-panel"></div>' +
        '			</div>' +
        '		</div>' +
        '	</div>' +
        // '   <div style="position: absolute;bottom: 10px;right: 18px;width: 36px;height: 36px;z-index: 20;background-color: rgba(128,128,128,0.2);border-radius: 18px;">ok</div>'
        '</div>';

    var editorFun = function() {

        rangy.init();

        var converter = undefined;
        var pagedownEditor = undefined;

        var inputElt;
        var $inputElt;
        var contentElt;
        var $contentElt;
        var marginElt;
        var $marginElt;
        var previewElt;

        var textContent;

        var trailingLfNode;
        var fileChanged = true;

        var fileDesc = {};
        var scrollTop;
        var sectionList = [];
        var diffMatchPatch = new diff_match_patch();

        var editorEle;

        var events = lin.Event();

        var editorConfig;


        var refreshPreviewLater = (function() {
            var elapsedTime = 0;
            var timeoutId;
            var refreshPreview = function() {
                var startTime = Date.now();
                pagedownEditor.refreshPreview();
                elapsedTime = Date.now() - startTime;
            };
            //if(settings.lazyRendering === true) {
            return _.debounce(refreshPreview, 500);
            // }
            // return function() {
            // 	clearTimeout(timeoutId);
            // 	timeoutId = setTimeout(refreshPreview, elapsedTime < 2000 ? elapsedTime : 2000);
            // };
        })();

        var sectionList = [];
        var sectionsToRemove = [];
        var modifiedSections = [];
        var insertBeforeSection;



        function updateSectionList(newSectionList) {

            modifiedSections = [];
            sectionsToRemove = [];
            insertBeforeSection = undefined;

            // Render everything if file changed
            if (fileChanged === true) {
                sectionsToRemove = sectionList;
                sectionList = newSectionList;
                modifiedSections = newSectionList;
                return;
            }

            // Find modified section starting from top
            var leftIndex = sectionList.length;
            _.some(sectionList, function(section, index) {
                var newSection = newSectionList[index];
                if (index >= newSectionList.length ||
                    // Check modified
                    section.textWithFrontMatter != newSection.textWithFrontMatter ||
                    // Check that section has not been detached or moved
                    section.elt.parentNode !== contentElt ||
                    // Check also the content since nodes can be injected in sections via copy/paste
                    section.elt.textContent != newSection.textWithFrontMatter) {
                    leftIndex = index;
                    return true;
                }
            });

            // Find modified section starting from bottom
            var rightIndex = -sectionList.length;
            _.some(sectionList.slice().reverse(), function(section, index) {
                var newSection = newSectionList[newSectionList.length - index - 1];
                if (index >= newSectionList.length ||
                    // Check modified
                    section.textWithFrontMatter != newSection.textWithFrontMatter ||
                    // Check that section has not been detached or moved
                    section.elt.parentNode !== contentElt ||
                    // Check also the content since nodes can be injected in sections via copy/paste
                    section.elt.textContent != newSection.textWithFrontMatter) {
                    rightIndex = -index;
                    return true;
                }
            });

            if (leftIndex - rightIndex > sectionList.length) {
                // Prevent overlap
                rightIndex = leftIndex - sectionList.length;
            }

            // Create an array composed of left unmodified, modified, right
            // unmodified sections
            var leftSections = sectionList.slice(0, leftIndex);
            modifiedSections = newSectionList.slice(leftIndex, newSectionList.length + rightIndex);
            var rightSections = sectionList.slice(sectionList.length + rightIndex, sectionList.length);
            insertBeforeSection = _.first(rightSections);
            sectionsToRemove = sectionList.slice(leftIndex, sectionList.length + rightIndex);
            sectionList = leftSections.concat(modifiedSections).concat(rightSections);
        }

        function highlightSections() {
            var newSectionEltList = document.createDocumentFragment();
            modifiedSections.forEach(function(section) {
                highlight(section);
                newSectionEltList.appendChild(section.elt);
            });
            watcher.noWatch(function() {
                if (fileChanged === true) {
                    contentElt.innerHTML = '';
                    contentElt.appendChild(newSectionEltList);
                } else {
                    // Remove outdated sections
                    sectionsToRemove.forEach(function(section) {
                        // section may be already removed
                        section.elt.parentNode === contentElt && contentElt.removeChild(section.elt);
                        // To detect sections that come back with built-in undo
                        section.elt.generated = false;
                    });

                    if (insertBeforeSection !== undefined) {
                        contentElt.insertBefore(newSectionEltList, insertBeforeSection.elt);
                    } else {
                        contentElt.appendChild(newSectionEltList);
                    }

                    // Remove unauthorized nodes (text nodes outside of sections or duplicated sections via copy/paste)
                    var childNode = contentElt.firstChild;
                    while (childNode) {
                        var nextNode = childNode.nextSibling;
                        if (!childNode.generated) {
                            contentElt.removeChild(childNode);
                        }
                        childNode = nextNode;
                    }
                }
                addTrailingLfNode();
                selectionMgr.updateSelectionRange();
                selectionMgr.updateCursorCoordinates();
            });
        }

        var escape = (function() {
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                "\u00a0": ' '
            };
            return function(str) {
                return str.replace(/[&<\u00a0]/g, function(s) {
                    return entityMap[s];
                });
            };
        })();

        function highlight(section) {
            var text = escape(section.text);
            if (!window.viewerMode) {
                text = Prism.highlight(text, Prism.languages.md);
            }

            var frontMatter = section.textWithFrontMatter.substring(0, section.textWithFrontMatter.length - section.text.length);
            if (frontMatter.length) {
                // Front matter highlighting
                frontMatter = escape(frontMatter);
                frontMatter = frontMatter.replace(/\n/g, '<span class="token lf">\n</span>');
                text = '<span class="token md">' + frontMatter + '</span>' + text;
            }
            var sectionElt = crel('span', {
                id: 'wmd-input-section-' + section.id,
                class: 'wmd-input-section'
            });
            sectionElt.generated = true;
            sectionElt.innerHTML = text;
            section.elt = sectionElt;
        }

        var isComposing = 0;
        events.addListener('onSectionsCreated', function(newSectionList) {
            if (!isComposing) {
                updateSectionList(newSectionList);
                highlightSections();
            }
            // console.log('fileChanged:' + fileChanged);
            if (fileChanged === true) { //跟踪fileChanged的作用
                // Refresh preview synchronously
                pagedownEditor.refreshPreview();
            } else {
                //注意
                refreshPreviewLater();
            }
        });



        // events.addEventHook('onPagedownConfigure');
        // events.addEventHook('onPagedownConfigure');
        // events.addEventHook('onPagedownConfigure');
        var navbarBtnGroups = [];
        var navbar;
        var navbarDropdownElt;

        //        var titleMinWidth = 2;
        // var navbarMarginWidth = 18 * 2 + 25 + 25;
        // var buttonsDropdownWidth = 40;
        // var viewerButtonGroupWidth = 100;
        // var workingIndicatorWidth = 18 + 70;
        var $navbarTitleElt;
        var navbarInnerElt;
        var navbarTitleContainerElt;
        var $navbarDropdownBtnElt;
        var $previewContentsElt;
        var previewContentsElt;

        var htmlWithComments;
        var htmlWithoutComments;

        var navbarBtnGroupsWidth = [
            80,
            80,
            160,
            160,
            80,
            40
        ].map(function(width) {
            return width + 18; // Add margin
        });

        var onResize = function() {

            var windowSize = {
                // width: window.innerWidth,
                // height: window.innerHeight
                width: editorEle.width(),
                height: editorEle.height()
            };

            // var maxWidth = navbarMarginWidth + workingIndicatorWidth + titleMinWidth + buttonsDropdownWidth;
            // if(window.viewerMode) {
            // 	maxWidth = navbarMarginWidth + workingIndicatorWidth + titleMinWidth + viewerButtonGroupWidth;
            // }
            // var maxWidth = navbar.$elt.find('[data-toggle=dropdown]').width() + 80;
            var maxWidth = 100;

            var titleWidth = windowSize.width - maxWidth + 40;

            navbarBtnGroups.forEach(function(group, index) {
                maxWidth += group.width;
                index === navbarBtnGroups.length - 1 && (maxWidth -= 10);
                if (windowSize.width < maxWidth) {
                    navbarDropdownElt.appendChild(group.elt);
                } else {
                    navbarInnerElt.insertBefore(group.elt, navbarTitleContainerElt);
                    titleWidth = windowSize.width - maxWidth + 40;
                }
            });

            //           $navbarTitleElt.css({
            // 	maxWidth: titleWidth
            // });
            $navbarDropdownBtnElt.toggleClass('hide', navbarDropdownElt.children.length === 0);
        }

        function DomObject(selector) {
            this.selector = selector;
            // this.elt = document.querySelector(selector);
            // this.$elt = $(this.elt);
            this.$elt = editorEle.find(selector);
            this.elt = this.$elt[0];
        }

        var onAsyncPreview = function() {
            // debugger
            // console.log('onAsyncPreview');
            var onAsyncPreviewListenerList = events.listeners('onAsyncPreview');
            // logger.log("onAsyncPreview");
            function recursiveCall(callbackList) {
                var callback = callbackList.length ? callbackList.shift() : function() {
                    setTimeout(function() {
                        var html = "";
                        _.each(previewContentsElt.children, function(elt) {
                            if (!elt.exportableHtml) {
                                var clonedElt = elt.cloneNode(true);
                                _.each(clonedElt.querySelectorAll('.MathJax, .MathJax_Display, .MathJax_Preview'), function(elt) {
                                    elt.parentNode.removeChild(elt);
                                });
                                elt.exportableHtml = clonedElt.innerHTML;
                            }
                            html += elt.exportableHtml;
                        });
                        // var htmlWithComments = utils.trim(html);
                        htmlWithComments = $.trim(html);
                        htmlWithoutComments = htmlWithComments.replace(/ <span class="comment label label-danger">.*?<\/span> /g, '');

                        events.onPreviewFinished(htmlWithComments, htmlWithoutComments);
                        // console.log('===========')
                        // console.log(htmlWithoutComments)
                    }, 10);
                };
                callback(function() {
                    recursiveCall(callbackList);
                });
            }

            recursiveCall(onAsyncPreviewListenerList.concat([
                function(callback) {
                    // We assume some images are loading asynchronously after the preview
                    // $previewContentsElt.waitForImages(callback);
                    callback();
                }
            ]));
        };

        function Watcher() {
            // debugger
            this.isWatching = false;
            var contentObserver;
            this.startWatching = function() {
                this.isWatching = true;
                contentObserver = contentObserver || new MutationObserver(checkContentChange);
                contentObserver.observe(contentElt, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            };
            this.stopWatching = function() {
                contentObserver.disconnect();
                this.isWatching = false;
            };
            this.noWatch = function(cb) {
                if (this.isWatching === true) {
                    this.stopWatching();
                    cb();
                    this.startWatching();
                } else {
                    cb();
                }
            };
        };

        var watcher = new Watcher();

        function setValueNoWatch(value) {
            setValue(value);
            textContent = value;
        }

        function UndoMgr() {
            var undoStack = [];
            var redoStack = [];
            var lastTime;
            var lastMode;
            var currentState;
            var selectionStartBefore;
            var selectionEndBefore;
            this.setCommandMode = function() {
                this.currentMode = 'command';
            };
            this.setMode = function() {}; // For compatibility with PageDown
            this.onButtonStateChange = function() {}; // To be overridden by PageDown
            this.saveState = debounce(function() {
                redoStack = [];
                var currentTime = Date.now();
                if (this.currentMode == 'comment' ||
                    this.currentMode == 'replace' ||
                    lastMode == 'newlines' ||
                    this.currentMode != lastMode ||
                    currentTime - lastTime > 1000) {
                    undoStack.push(currentState);
                    // Limit the size of the stack
                    while (undoStack.length > 100) {
                        undoStack.shift();
                    }
                } else {
                    // Restore selectionBefore that has potentially been modified by saveSelectionState
                    selectionStartBefore = currentState.selectionStartBefore;
                    selectionEndBefore = currentState.selectionEndBefore;
                }
                currentState = {
                    selectionStartBefore: selectionStartBefore,
                    selectionEndBefore: selectionEndBefore,
                    selectionStartAfter: selectionMgr.selectionStart,
                    selectionEndAfter: selectionMgr.selectionEnd,
                    content: textContent,
                    discussionListJSON: fileDesc.discussionListJSON
                };
                lastTime = currentTime;
                lastMode = this.currentMode;
                this.currentMode = undefined;
                this.onButtonStateChange();
            }, this);
            this.saveSelectionState = _.debounce(function() {
                // Should happen just after saveState
                if (this.currentMode === undefined) {
                    selectionStartBefore = selectionMgr.selectionStart;
                    selectionEndBefore = selectionMgr.selectionEnd;
                }
            }, 50);
            this.canUndo = function() {
                return undoStack.length;
            };
            this.canRedo = function() {
                return redoStack.length;
            };

            function restoreState(state, selectionStart, selectionEnd) {
                // Update editor
                watcher.noWatch(function() {
                    if (textContent != state.content) {
                        setValueNoWatch(state.content);
                        fileDesc.content = state.content;
                        //eventMgr.onContentChanged(fileDesc, state.content);
                        events.onContentChanged(fileDesc, state.content);
                    }
                    selectionMgr.setSelectionStartEnd(selectionStart, selectionEnd);
                    selectionMgr.updateSelectionRange();
                    selectionMgr.updateCursorCoordinates(true);
                    var discussionListJSON = fileDesc.discussionListJSON;
                    if (discussionListJSON != state.discussionListJSON) {
                        var oldDiscussionList = fileDesc.discussionList;
                        fileDesc.discussionListJSON = state.discussionListJSON;
                        var newDiscussionList = fileDesc.discussionList;
                        var diff = jsonDiffPatch.diff(oldDiscussionList, newDiscussionList);
                        var commentsChanged = false;
                        _.each(diff, function(discussionDiff, discussionIndex) {
                            if (!_.isArray(discussionDiff)) {
                                commentsChanged = true;
                            } else if (discussionDiff.length === 1) {
                                eventMgr.onDiscussionCreated(fileDesc, newDiscussionList[discussionIndex]);
                            } else {
                                eventMgr.onDiscussionRemoved(fileDesc, oldDiscussionList[discussionIndex]);
                            }
                        });
                        commentsChanged && eventMgr.onCommentsChanged(fileDesc);
                    }
                });

                selectionStartBefore = selectionStart;
                selectionEndBefore = selectionEnd;
                currentState = state;
                this.currentMode = undefined;
                lastMode = undefined;
                this.onButtonStateChange();
                adjustCursorPosition();
            }

            this.undo = function() {
                var state = undoStack.pop();
                if (!state) {
                    return;
                }
                redoStack.push(currentState);
                restoreState.call(this, state, currentState.selectionStartBefore, currentState.selectionEndBefore);
            };
            this.redo = function() {
                var state = redoStack.pop();
                if (!state) {
                    return;
                }
                undoStack.push(currentState);
                restoreState.call(this, state, state.selectionStartAfter, state.selectionEndAfter);
            };
            this.init = function() {
                //debugger
                var content = editorConfig.content; //"test!$\\alpha$"; //fileDesc.content;
                undoStack = [];
                redoStack = [];
                lastTime = 0;
                currentState = {
                    selectionStartAfter: undefined, //fileDesc.selectionStart,
                    selectionEndAfter: undefined, //fileDesc.selectionEnd,
                    content: content,
                    discussionListJSON: '{}' //fileDesc.discussionListJSON
                };
                this.currentMode = undefined;
                lastMode = undefined;
                contentElt.textContent = content;
                // Force this since the content could be the same
                // debugger
                checkContentChange();
            };
        }

        var undoMgr = new UndoMgr();


        function SelectionMgr() {
            var self = this;
            var lastSelectionStart = 0,
                lastSelectionEnd = 0;
            this.selectionStart = 0;
            this.selectionEnd = 0;
            this.cursorY = 0;
            this.adjustTop = 0;
            this.adjustBottom = 0;
            this.findOffsets = function(offsetList) {
                var result = [];
                if (!offsetList.length) {
                    return result;
                }
                var offset = offsetList.shift();
                var walker = document.createTreeWalker(contentElt, 4, null, false);
                var text = '';
                var walkerOffset = 0;
                while (walker.nextNode()) {
                    text = walker.currentNode.nodeValue || '';
                    var newWalkerOffset = walkerOffset + text.length;
                    while (newWalkerOffset > offset) {
                        result.push({
                            container: walker.currentNode,
                            offsetInContainer: offset - walkerOffset,
                            offset: offset
                        });
                        if (!offsetList.length) {
                            return result;
                        }
                        offset = offsetList.shift();
                    }
                    walkerOffset = newWalkerOffset;
                }
                do {
                    result.push({
                        container: walker.currentNode,
                        offsetInContainer: text.length,
                        offset: offset
                    });
                    offset = offsetList.shift();
                }
                while (offset);
                return result;
            };
            this.createRange = function(start, end) {
                start = start < 0 ? 0 : start;
                end = end < 0 ? 0 : end;
                var range = document.createRange();
                var offsetList = [],
                    startIndex, endIndex;
                if (_.isNumber(start)) {
                    offsetList.push(start);
                    startIndex = offsetList.length - 1;
                }
                if (_.isNumber(end)) {
                    offsetList.push(end);
                    endIndex = offsetList.length - 1;
                }
                offsetList = this.findOffsets(offsetList);
                var startOffset = _.isObject(start) ? start : offsetList[startIndex];

                // console.log('startOffset.container:'+startOffset.container);
                // console.log('startOffset.offsetInContainer:'+startOffset.offsetInContainer);

                range.setStart(startOffset.container, startOffset.offsetInContainer);
                var endOffset = startOffset;
                if (end && end != start) {
                    endOffset = _.isObject(end) ? end : offsetList[endIndex];
                }
                range.setEnd(endOffset.container, endOffset.offsetInContainer);
                return range;
            };
            var adjustScroll;
            // var debouncedUpdateCursorCoordinates = utils.debounce(function() {
            var debouncedUpdateCursorCoordinates = debounce(function() {
                $inputElt.toggleClass('has-selection', this.selectionStart !== this.selectionEnd);
                var coordinates = this.getCoordinates(this.selectionEnd, this.selectionEndContainer, this.selectionEndOffset);
                if (this.cursorY !== coordinates.y) {
                    this.cursorY = coordinates.y;
                    //eventMgr.onCursorCoordinates(coordinates.x, coordinates.y);
                }
                if (adjustScroll) {
                    var adjustTop, adjustBottom;
                    adjustTop = adjustBottom = inputElt.offsetHeight / 2 * 0.5; //settings.cursorFocusRatio;
                    adjustTop = this.adjustTop || adjustTop;
                    adjustBottom = this.adjustBottom || adjustTop;
                    if (adjustTop && adjustBottom) {
                        var cursorMinY = inputElt.scrollTop + adjustTop;
                        var cursorMaxY = inputElt.scrollTop + inputElt.offsetHeight - adjustBottom;
                        if (selectionMgr.cursorY < cursorMinY) {
                            inputElt.scrollTop += selectionMgr.cursorY - cursorMinY;
                        } else if (selectionMgr.cursorY > cursorMaxY) {
                            inputElt.scrollTop += selectionMgr.cursorY - cursorMaxY;
                        }
                    }
                }
                adjustScroll = false;
            }, this);
            this.updateCursorCoordinates = function(adjustScrollParam) {
                adjustScroll = adjustScroll || adjustScrollParam;
                debouncedUpdateCursorCoordinates();
            };
            this.updateSelectionRange = function() {
                var min = Math.min(this.selectionStart, this.selectionEnd);
                var max = Math.max(this.selectionStart, this.selectionEnd);
                var range = this.createRange(min, max);
                var selection = rangy.getSelection();
                selection.removeAllRanges();
                selection.addRange(range, this.selectionStart > this.selectionEnd);
            };
            var saveLastSelection = _.debounce(function() {
                lastSelectionStart = self.selectionStart;
                lastSelectionEnd = self.selectionEnd;
            }, 50);
            this.setSelectionStartEnd = function(start, end) {
                if (start === undefined) {
                    start = this.selectionStart;
                }
                if (start < 0) {
                    start = 0;
                }
                if (end === undefined) {
                    end = this.selectionEnd;
                }
                if (end < 0) {
                    end = 0;
                }
                this.selectionStart = start;
                this.selectionEnd = end;
                fileDesc.editorStart = start;
                fileDesc.editorEnd = end;
                saveLastSelection();
            };
            this.saveSelectionState = (function() {
                function save() {
                    if (fileChanged === false) {
                        var selectionStart = self.selectionStart;
                        var selectionEnd = self.selectionEnd;
                        var selection = rangy.getSelection();
                        if (selection.rangeCount > 0) {
                            var selectionRange = selection.getRangeAt(0);
                            var node = selectionRange.startContainer;
                            if ((contentElt.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) || contentElt === node) {
                                var offset = selectionRange.startOffset;
                                if (node.hasChildNodes() && offset > 0) {
                                    node = node.childNodes[offset - 1];
                                    offset = node.textContent.length;
                                }
                                var container = node;
                                while (node != contentElt) {
                                    while (node = node.previousSibling) {
                                        if (node.textContent) {
                                            offset += node.textContent.length;
                                        }
                                    }
                                    node = container = container.parentNode;
                                }

                                if (selection.isBackwards()) {
                                    selectionStart = offset + selectionRange.toString().length;
                                    selectionEnd = offset;
                                } else {
                                    selectionStart = offset;
                                    selectionEnd = offset + selectionRange.toString().length;
                                }

                                if (selectionStart === selectionEnd && selectionRange.startContainer.textContent == '\n' && selectionRange.startOffset == 1) {
                                    // In IE if end of line is selected, offset is wrong
                                    // Also, in Firefox cursor can be after the trailingLfNode
                                    selectionStart = --selectionEnd;
                                    self.setSelectionStartEnd(selectionStart, selectionEnd);
                                    self.updateSelectionRange();
                                }
                            }
                        }
                        self.setSelectionStartEnd(selectionStart, selectionEnd);
                    }
                    undoMgr.saveSelectionState();
                }

                var nextTickAdjustScroll = false;
                // var debouncedSave = utils.debounce(function() {
                var debouncedSave = debounce(function() {
                    save();
                    self.updateCursorCoordinates(nextTickAdjustScroll);
                    // In some cases we have to wait a little bit more to see the selection change (Cmd+A on Chrome/OSX)
                    longerDebouncedSave();
                });
                // var longerDebouncedSave = utils.debounce(function() {
                var longerDebouncedSave = debounce(function() {
                    save();
                    if (lastSelectionStart === self.selectionStart && lastSelectionEnd === self.selectionEnd) {
                        nextTickAdjustScroll = false;
                    }
                    self.updateCursorCoordinates(nextTickAdjustScroll);
                    nextTickAdjustScroll = false;
                }, 10);

                return function(debounced, adjustScroll, forceAdjustScroll) {
                    if (forceAdjustScroll) {
                        lastSelectionStart = undefined;
                        lastSelectionEnd = undefined;
                    }
                    if (debounced) {
                        nextTickAdjustScroll = nextTickAdjustScroll || adjustScroll;
                        return debouncedSave();
                    } else {
                        save();
                    }
                };
            })();
            this.getSelectedText = function() {
                var min = Math.min(this.selectionStart, this.selectionEnd);
                var max = Math.max(this.selectionStart, this.selectionEnd);
                return textContent.substring(min, max);
            };
            this.getCoordinates = function(inputOffset, container, offsetInContainer) {
                if (!container) {
                    var offset = this.findOffsets([inputOffset])[0];
                    container = offset.container;
                    offsetInContainer = offset.offsetInContainer;
                }
                var x = 0;
                var y = 0;
                if (container.textContent == '\n') {
                    y = container.parentNode.offsetTop + container.parentNode.offsetHeight / 2;
                } else {
                    var selectedChar = textContent[inputOffset];
                    var startOffset = {
                        container: container,
                        offsetInContainer: offsetInContainer,
                        offset: inputOffset
                    };
                    var endOffset = {
                        container: container,
                        offsetInContainer: offsetInContainer,
                        offset: inputOffset
                    };
                    if (inputOffset > 0 && (selectedChar === undefined || selectedChar == '\n')) {
                        if (startOffset.offset === 0) {
                            // Need to calculate offset-1
                            startOffset = inputOffset - 1;
                        } else {
                            startOffset.offsetInContainer -= 1;
                        }
                    } else {
                        if (endOffset.offset === container.textContent.length) {
                            // Need to calculate offset+1
                            endOffset = inputOffset + 1;
                        } else {
                            endOffset.offsetInContainer += 1;
                        }
                    }
                    var selectionRange = this.createRange(startOffset, endOffset);
                    var selectionRect = selectionRange.getBoundingClientRect();
                    y = selectionRect.top + selectionRect.height / 2 - inputElt.getBoundingClientRect().top + inputElt.scrollTop;
                }
                return {
                    x: x,
                    y: y
                };
            };
            this.getClosestWordOffset = function(offset) {
                var offsetStart = 0;
                var offsetEnd = 0;
                var nextOffset = 0;
                textContent.split(/\s/).some(function(word) {
                    if (word) {
                        offsetStart = nextOffset;
                        offsetEnd = nextOffset + word.length;
                        if (offsetEnd > offset) {
                            return true;
                        }
                    }
                    nextOffset += word.length + 1;
                });
                return {
                    start: offsetStart,
                    end: offsetEnd
                };
            };
        }

        function focus() {
            $contentElt.focus();
            selectionMgr.updateSelectionRange();
            inputElt.scrollTop = scrollTop;
        }

        function getValue() {
            return textContent;
        }

        var editorInit = function() {
            //inputElt = document.getElementById('wmd-input');
            //$inputElt = $(inputElt);

            // debugger
            $inputElt = editorEle.find('#wmd-input');
            inputElt = $inputElt[0];

            // contentElt = inputElt.querySelector('.editor-content');
            // $contentElt = $(contentElt);
            $contentElt = $inputElt.find('.editor-content');
            contentElt = $contentElt[0];


            // marginElt = inputElt.querySelector('.editor-margin');
            // $marginElt = $(marginElt);
            $marginElt = $inputElt.find('.editor-margin');
            marginElt = $marginElt[0];

            //previewElt = document.querySelector('.preview-container');
            previewElt = editorEle.find('.preview-container');

            $inputElt.addClass('font-rich'); // $inputElt.addClass(settings.editorFontClass);

            watcher.startWatching();

            $(inputElt).scroll(function() {
                scrollTop = inputElt.scrollTop;
                if (fileChanged === false) {
                    fileDesc.editorScrollTop = scrollTop;
                }
            });
            $(previewElt).scroll(function() {
                if (fileChanged === false) {
                    fileDesc.previewScrollTop = previewElt.scrollTop;
                }
            });

            // See https://gist.github.com/shimondoodkin/1081133
            if (/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) {
                var $editableFix = $('<input style="width:1px;height:1px;border:none;margin:0;padding:0;" tabIndex="-1">').appendTo('html');
                $contentElt.blur(function() {
                    $editableFix[0].setSelectionRange(0, 0);
                    $editableFix.blur();
                });
            }

            inputElt.focus = focus;
            inputElt.adjustCursorPosition = adjustCursorPosition;

            Object.defineProperty(inputElt, 'value', {
                get: function() {
                    return textContent;
                },
                set: setValue
            });

            Object.defineProperty(inputElt, 'selectionStart', {
                get: function() {
                    return Math.min(selectionMgr.selectionStart, selectionMgr.selectionEnd);
                },
                set: function(value) {
                    selectionMgr.setSelectionStartEnd(value);
                    selectionMgr.updateSelectionRange();
                    selectionMgr.updateCursorCoordinates();
                },

                enumerable: true,
                configurable: true
            });

            Object.defineProperty(inputElt, 'selectionEnd', {
                get: function() {
                    return Math.max(selectionMgr.selectionStart, selectionMgr.selectionEnd);
                },
                set: function(value) {
                    selectionMgr.setSelectionStartEnd(undefined, value);
                    selectionMgr.updateSelectionRange();
                    selectionMgr.updateCursorCoordinates();
                },

                enumerable: true,
                configurable: true
            });

            var clearNewline = false;

            $contentElt
                .on('keydown', function(evt) {
                    if (
                        evt.which === 17 || // Ctrl
                        evt.which === 91 || // Cmd
                        evt.which === 18 || // Alt
                        evt.which === 16 // Shift
                    ) {
                        return;
                    }
                    selectionMgr.saveSelectionState();
                    adjustCursorPosition();

                    var cmdOrCtrl = evt.metaKey || evt.ctrlKey;

                    switch (evt.which) {
                        case 9: // Tab
                            if (!cmdOrCtrl) {
                                action('indent', {
                                    inverse: evt.shiftKey
                                });
                                evt.preventDefault();
                            }
                            break;
                        case 13:
                            action('newline');
                            evt.preventDefault();
                            break;
                    }
                    if (evt.which !== 13) {
                        clearNewline = false;
                    }
                })
                .on('compositionstart', function() {
                    isComposing++;
                })
                .on('compositionend', function() {
                    setTimeout(function() {
                        isComposing--;
                    }, 0);
                })
                .on('mouseup', _.bind(selectionMgr.saveSelectionState, selectionMgr, true, false))
                .on('paste', function(evt) {
                    undoMgr.currentMode = 'paste';
                    evt.preventDefault();
                    var data, clipboardData = (evt.originalEvent || evt).clipboardData;
                    if (clipboardData) {
                        data = clipboardData.getData('text/plain');
                    } else {
                        clipboardData = window.clipboardData;
                        data = clipboardData && clipboardData.getData('Text');
                    }
                    if (!data) {
                        return;
                    }
                    replace(selectionMgr.selectionStart, selectionMgr.selectionEnd, data);
                    adjustCursorPosition();
                })
                .on('cut', function() {
                    undoMgr.currentMode = 'cut';
                    adjustCursorPosition();
                })
                .on('focus', function() {
                    selectionMgr.hasFocus = true;
                })
                .on('blur', function() {
                    selectionMgr.hasFocus = false;
                });

            var action = function(action, options) {
                var textContent = getValue();
                var min = Math.min(selectionMgr.selectionStart, selectionMgr.selectionEnd);
                var max = Math.max(selectionMgr.selectionStart, selectionMgr.selectionEnd);
                var state = {
                    selectionStart: min,
                    selectionEnd: max,
                    before: textContent.slice(0, min),
                    after: textContent.slice(max),
                    selection: textContent.slice(min, max)
                };

                actions[action](state, options || {});
                setValue(state.before + state.selection + state.after);
                selectionMgr.setSelectionStartEnd(state.selectionStart, state.selectionEnd);
                selectionMgr.updateSelectionRange();
            };

            var indentRegex = /^ {0,3}>[ ]*|^[ \t]*(?:[*+\-]|(\d+)\.)[ \t]|^\s+/;
            var actions = {
                indent: function(state, options) {
                    function strSplice(str, i, remove, add) {
                        remove = +remove || 0;
                        add = add || '';
                        return str.slice(0, i) + add + str.slice(i + remove);
                    }

                    var lf = state.before.lastIndexOf('\n') + 1;
                    if (options.inverse) {
                        if (/\s/.test(state.before.charAt(lf))) {
                            state.before = strSplice(state.before, lf, 1);

                            state.selectionStart--;
                            state.selectionEnd--;
                        }
                        state.selection = state.selection.replace(/^[ \t]/gm, '');
                    } else {
                        var previousLine = state.before.slice(lf);
                        if (state.selection || previousLine.match(indentRegex)) {
                            state.before = strSplice(state.before, lf, 0, '\t');
                            state.selection = state.selection.replace(/\r?\n(?=[\s\S])/g, '\n\t');
                            state.selectionStart++;
                            state.selectionEnd++;
                        } else {
                            state.before += '\t';
                            state.selectionStart++;
                            state.selectionEnd++;
                            return;
                        }
                    }

                    state.selectionEnd = state.selectionStart + state.selection.length;
                },

                newline: function(state) {
                    var lf = state.before.lastIndexOf('\n') + 1;
                    if (clearNewline) {
                        state.before = state.before.substring(0, lf);
                        state.selection = '';
                        state.selectionStart = lf;
                        state.selectionEnd = lf;
                        clearNewline = false;
                        return;
                    }
                    clearNewline = false;
                    var previousLine = state.before.slice(lf);
                    var indentMatch = previousLine.match(indentRegex);
                    var indent = (indentMatch || [''])[0];
                    if (indentMatch && indentMatch[1]) {
                        var number = parseInt(indentMatch[1], 10);
                        indent = indent.replace(/\d+/, number + 1);
                    }
                    if (indent.length) {
                        clearNewline = true;
                    }

                    undoMgr.currentMode = 'newlines';

                    state.before += '\n' + indent;
                    state.selection = '';
                    state.selectionStart += indent.length + 1;
                    state.selectionEnd = state.selectionStart;
                }
            };
        };

        function addTrailingLfNode() {
            trailingLfNode = crel('span', {
                class: 'token lf'
            });
            trailingLfNode.textContent = '\n';
            contentElt.appendChild(trailingLfNode);
        }

        function adjustCommentOffsets(oldTextContent, newTextContent, discussionList) {
            if (!discussionList.length) {
                return;
            }
            var changes = diffMatchPatch.diff_main(oldTextContent, newTextContent);
            var changed = false;
            var startOffset = 0;
            changes.forEach(function(change) {
                var changeType = change[0];
                var changeText = change[1];
                if (changeType === 0) {
                    startOffset += changeText.length;
                    return;
                }
                var endOffset = startOffset;
                var diffOffset = changeText.length;
                if (changeType === -1) {
                    endOffset += diffOffset;
                    diffOffset = -diffOffset;
                }
                discussionList.forEach(function(discussion) {
                    // selectionEnd
                    if (discussion.selectionEnd > endOffset) {
                        discussion.selectionEnd += diffOffset;
                        discussion.discussionIndex && (changed = true);
                    } else if (discussion.selectionEnd > startOffset) {
                        discussion.selectionEnd = startOffset;
                        discussion.discussionIndex && (changed = true);
                    }
                    // selectionStart
                    if (discussion.selectionStart >= endOffset) {
                        discussion.selectionStart += diffOffset;
                        discussion.discussionIndex && (changed = true);
                    } else if (discussion.selectionStart > startOffset) {
                        discussion.selectionStart = startOffset;
                        discussion.discussionIndex && (changed = true);
                    }
                });
                if (changeType === 1) {
                    startOffset += changeText.length;
                }
            });
            return changed;
        }

        function checkContentChange() {
            // debugger
            var newTextContent = inputElt.textContent;
            // console.log('-------------')
            // console.log(newTextContent);
            if (contentElt.lastChild === trailingLfNode && trailingLfNode.textContent.slice(-1) == '\n') {
                newTextContent = newTextContent.slice(0, -1);
            }
            newTextContent = newTextContent.replace(/\r\n?/g, '\n'); // Mac/DOS to Unix

            // console.log(newTextContent);
            // console.log(textContent)

            // debugger
            if (fileChanged === false) {
                if (newTextContent == textContent) {
                    // User has removed the empty section
                    if (contentElt.children.length === 0) {
                        contentElt.innerHTML = '';
                        sectionList.forEach(function(section) {
                            contentElt.appendChild(section.elt);
                        });
                        addTrailingLfNode();
                    }
                    return;
                }
                undoMgr.currentMode = undoMgr.currentMode || 'typing';
                var discussionList = _.values(fileDesc.discussionList);
                fileDesc.newDiscussion && discussionList.push(fileDesc.newDiscussion);
                var updateDiscussionList = adjustCommentOffsets(textContent, newTextContent, discussionList);
                // debugger
                textContent = newTextContent;
                if (updateDiscussionList === true) {
                    fileDesc.discussionList = fileDesc.discussionList; // Write discussionList in localStorage
                }
                fileDesc.content = textContent;
                selectionMgr.saveSelectionState();

                // debugger
                events.onContentChanged(fileDesc, textContent);
                //先实现 Event Manager
                // pagedownEditor.refreshPreview();

                updateDiscussionList && events.onCommentsChanged(fileDesc);
                undoMgr.saveState();
                //triggerSpellCheck();
            } else {
                textContent = newTextContent;
                // fileDesc.content = textContent;
                //selectionMgr.setSelectionStartEnd(fileDesc.editorStart, fileDesc.editorEnd);
                selectionMgr.setSelectionStartEnd(undefined, undefined);
                selectionMgr.updateSelectionRange();
                selectionMgr.updateCursorCoordinates();
                undoMgr.saveSelectionState();
                //eventMgr.onFileOpen(fileDesc, textContent);
                events.onFileOpen(fileDesc, textContent);
                //previewElt.scrollTop = 0;//fileDesc.previewScrollTop;
                scrollTop = 0; //fileDesc.editorScrollTop;
                inputElt.scrollTop = scrollTop;
                fileChanged = false;
            }
        }

        function adjustCursorPosition(force) {
            if (inputElt === undefined) {
                return;
            }
            selectionMgr.saveSelectionState(true, true, force);
        }

        function replace(selectionStart, selectionEnd, replacement) {
            undoMgr.currentMode = undoMgr.currentMode || 'replace';
            var range = selectionMgr.createRange(
                Math.min(selectionStart, selectionEnd),
                Math.max(selectionStart, selectionEnd)
            );
            if ('' + range != replacement) {
                range.deleteContents();
                range.insertNode(document.createTextNode(replacement));
            }
            var endOffset = selectionStart + replacement.length;
            selectionMgr.setSelectionStartEnd(endOffset, endOffset);
            selectionMgr.updateSelectionRange();
            selectionMgr.updateCursorCoordinates(true);
        }


        var selectionMgr = new SelectionMgr();
        //editor.selectionMgr = selectionMgr;
        //$(document).on('selectionchange', '.editor-content', _.bind(selectionMgr.saveSelectionState, selectionMgr, true, false));


        function setValue(value) {
            //debugger
            var startOffset = diffMatchPatch.diff_commonPrefix(textContent, value);
            if (startOffset === textContent.length) {
                startOffset--;
            }
            var endOffset = Math.min(
                diffMatchPatch.diff_commonSuffix(textContent, value),
                textContent.length - startOffset,
                value.length - startOffset
            );
            var replacement = value.substring(startOffset, value.length - endOffset);
            var range = selectionMgr.createRange(startOffset, textContent.length - endOffset);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacement));
            return {
                start: startOffset,
                end: value.length - endOffset
            };
        }

        var Editor = function(config) {
            config = config || {};
            editorConfig = config;

            editorEle = $(editorHtml);

// .editor .btn-group > .btn{
//     /* border-top-right-radius: 0; */
//     /* border-bottom-right-radius: 0; */
//     border-radius: 5px;
// }
            var css = config.css || {};

            for(var name in css){
                editorEle.css(name,css[name]);
            }

            var render = $(config.render);
            if (render) {
                render.append(editorEle);
            }

            Object.defineProperty(this, 'events', {
                readable: true,
                writeable: false,
                value: events
            });

            Object.defineProperty(this, 'ele', {
                readable: true,
                writeable: false,
                value: editorEle
            });

            if (config.extensions) {
                if (config.extensions instanceof Array) {
                    for (var n = 0; n < config.extensions.length; n++) {
                        events.addExtendsion(config.extensions[n]);
                    }
                } else {
                    events.addExtendsion(config.extensions);
                }
            }

            events.addEventHook('onPagedownConfigure');
            events.addEventHook('onReady');
            events.addEventHook('onFileSelected');
            events.addEventHook('onContentChanged');
            events.addEventHook('onCursorCoordinates');
            events.addEventHook('onFileSelected');
            events.addEventHook('onSectionsCreated');
            events.addEventHook('onAsyncPreview');
            events.addEventHook('onCommentsChanged');
            events.addEventHook('onPreviewFinished');
            events.addEventHook('onFileOpen');


            //处理工具栏

            navbar = new DomObject('.navbar');
            navbarDropdownElt = navbar.elt.querySelector('.editor .buttons-dropdown .dropdown-menu');
            $navbarTitleElt = navbar.$elt.find('.editor .file-title-navbar, .input-file-title');
            navbarInnerElt = navbar.elt.querySelector('.editor .navbar-inner');
            navbarTitleContainerElt = navbar.elt.querySelector('.editor .title-container');
            $navbarDropdownBtnElt = navbar.$elt.find('.editor .buttons-dropdown');

            $previewContentsElt = editorEle.find('#preview-contents');
            previewContentsElt = $previewContentsElt[0];

            //     previewContentsElt = document.getElementById('preview-contents');
            // $previewContentsElt = $(previewContentsElt);

            _.each(navbar.elt.querySelectorAll('.editor .right-buttons'), function(btnGroupElt) {
                navbarBtnGroups.push({
                    elt: btnGroupElt,
                    width: navbarBtnGroupsWidth.shift()
                });
                // $(btnGroupElt).css('borderRadius','5px');
            });
            _.each(navbar.elt.querySelectorAll('.editor .left-buttons'), function(btnGroupElt) {
                navbarBtnGroups.push({
                    elt: btnGroupElt,
                    width: navbarBtnGroupsWidth.shift()
                });
                // $(btnGroupElt).css('borderRadius','5px');
            });



            onResize();
            // console.log(editorEle.find('.btn-group > .btn'))
            // editorEle.find('.btn-group > .btn').css('borderRadius','5px');
            $(window).resize(onResize);

            // navbar.$elt.find('[data-toggle=dropdown]').on('click',function(){
            // $navbarDropdownBtnElt.toggleClass('hide', navbarDropdownElt.children.length === 0);
            //  console.log('==========')
            //  $(navbarDropdownElt).show();
            // });
            editorEle.on('selectionchange', '.editor-content', _.bind(selectionMgr.saveSelectionState, selectionMgr, true, false));

            Object.defineProperty(this, 'content', {
                get: function() {
                    return textContent;
                },
                set: function(value) {
                    // fileChanged = true;
                    // console.log(fileDesc)
                    //     // textContent = value;
                    // fileDesc.content = value;
                    setValueNoWatch(value);
                    events.onContentChanged(fileDesc, value);
                }
            });

            Object.defineProperty(this, 'html', {
                get: function() {
                    return htmlWithComments;
                }
            });

            Object.defineProperty(this, 'htmlWithoutComments', {
                get: function() {
                    return htmlWithoutComments;
                }
            });
        }

        Editor.focus = focus;

        Editor.prototype.init = function() {


            //lin.events.addEventHook("onContentChanged");
            editorInit();

            converter = new Markdown.Converter();

            var options = {
                _DoItalicsAndBold: function(text) {
                    // Restore original markdown implementation
                    text = text.replace(/(\*\*|__)(?=\S)(.+?[*_]*)(?=\S)\1/g,
                        "<strong>$2</strong>");
                    text = text.replace(/(\*|_)(?=\S)(.+?)(?=\S)\1/g,
                        "<em>$2</em>");
                    return text;
                }
            };
            // converter.setOptions(options);
            //var converter = Markdown.getSanitizingConverter();
            pagedownEditor = new Markdown.Editor(converter, undefined, {
                undoManager: undoMgr
            });
            // pagedownEditor.hooks.chain("onPreviewRefresh", function() {
            //     console.log('==============')

            //     var preview = document.getElementById("wmd-preview");

            //     //debugger
            //     if (!MathJax || !MathJax.Hub || !MathJax.Hub.Queue) {
            //         return;
            //     }
            //     // debugger
            //     MathJax.Hub.cancelTypeset = false;
            //     MathJax.Hub.Queue([
            //         "Typeset",
            //         MathJax.Hub,
            //         preview
            //     ]);
            // });
            // events.onPagedownConfigure(pagedownEditor);
            Object.defineProperty(this, 'markdown', {
                readable: true,
                writeable: false,
                value: pagedownEditor
            });

            events.onPagedownConfigure(this);
        };

        Editor.prototype.run = function() {

            //htmlSanitizer.onPagedownConfigure(pagedownEditor);
            // pagedownEditor.hooks.chain("onPreviewRefresh", events.onAsyncPreview);
            pagedownEditor.hooks.chain("onPreviewRefresh", onAsyncPreview);
            pagedownEditor.run();

            //checkContentChange();
            undoMgr.init();

            $(".wmd-button-row li").addClass("btn btn-success").css("left", 0).find("span").hide();

            // Add customized buttons
            var $btnGroupElt = $('.wmd-button-group1');
            $("#wmd-bold-button").append($('<i class="icon-bold">')).appendTo($btnGroupElt);
            $("#wmd-italic-button").append($('<i class="icon-italic">')).appendTo($btnGroupElt);
            $btnGroupElt = $('.wmd-button-group2');
            $("#wmd-link-button").append($('<i class="icon-globe">')).appendTo($btnGroupElt);
            $("#wmd-quote-button").append($('<i class="icon-indent-right">')).appendTo($btnGroupElt);
            $("#wmd-code-button").append($('<i class="icon-code">')).appendTo($btnGroupElt);
            $("#wmd-image-button").append($('<i class="icon-picture">')).appendTo($btnGroupElt);
            $btnGroupElt = $('.wmd-button-group3');
            $("#wmd-olist-button").append($('<i class="icon-list-numbered">')).appendTo($btnGroupElt);
            $("#wmd-ulist-button").append($('<i class="icon-list-bullet">')).appendTo($btnGroupElt);
            $("#wmd-heading-button").append($('<i class="icon-text-height">')).appendTo($btnGroupElt);
            $("#wmd-hr-button").append($('<i class="icon-ellipsis">')).appendTo($btnGroupElt);
            $btnGroupElt = $('.wmd-button-group5');
            $("#wmd-undo-button").append($('<i class="icon-reply">')).appendTo($btnGroupElt);
            $("#wmd-redo-button").append($('<i class="icon-forward">')).appendTo($btnGroupElt);

        };

        return Editor;
    };

    var Editor = (function() {

        // rangy.init();

        function Editor() {

            var conFun = editorFun();

            if (!arguments || arguments.length == 0) {
                return new conFun();
            }

            if (arguments.length == 1) {
                return new conFun(arguments[0]);
            }

            if (arguments.length == 2) {
                return new conFun(arguments[0], arguments[1]);
            }

            if (arguments.length == 3) {
                return new conFun(arguments[0], arguments[1], arguments[2]);
            }

            if (arguments.length == 4) {
                return new conFun(arguments[0], arguments[1], arguments[2], arguments[3]);
            }

            if (arguments.length == 5) {
                return new conFun(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
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
        return Editor;
    })();



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// preview
//
////////////////////////////////////////////////////////////////////////////////////////////////////////

    var previewFun = function(){

        var previewConfig;
        var converter;
        var render;

        var Preview = function(config) {
            config = config || {};
            previewConfig = config;


            var css = config.css || {};

            for(var name in css){
                editorEle.css(name,css[name]);
            }


            converter = new Markdown.Converter();
            render = $(previewConfig.render);

            Object.defineProperty(this,'ele',{
                writeable:false,
                value:render
            })

            Object.defineProperty(this,'converter',{
                writeable:false,
                value:converter
            })

            // var render = $(config.render);
            // if (render) {
            //     render.append(editorEle);
            // }

            //var converter = new Markdown.Converter();

        }
    
        Preview.prototype.render = function(){
            if (render) {

                var events = new lin.Event();
                if (previewConfig.extensions) {
                    if (previewConfig.extensions instanceof Array) {
                        for (var n = 0; n < previewConfig.extensions.length; n++) {
                            events.addExtendsion(previewConfig.extensions[n]);
                        }
                    } else {
                        events.addExtendsion(previewConfig.extensions);
                    }
                }

                events.addEventHook('onPreview');
                events.addEventHook('onInitPreview');

                events.onInitPreview(this);

                var v = $(converter.makeHtml(previewConfig.content || ''));
                render.append(v);


                events.onPreview(this)

                 //     //debugger
                // if (MathJax && MathJax.Hub && MathJax.Hub.Queue) {
                        
                //     // debugger
                //     MathJax.Hub.cancelTypeset = false;
                //     MathJax.Hub.Queue([
                //         "Typeset",
                //         MathJax.Hub,
                //         v[0]
                //     ]);
                // }
            }
        }
        return Preview;
    };
    Editor.Preview =  (function() {

        // rangy.init();

        function Preview() {

            var conFun = previewFun();

            if (!arguments || arguments.length == 0) {
                return new conFun();
            }

            if (arguments.length == 1) {
                return new conFun(arguments[0]);
            }

            if (arguments.length == 2) {
                return new conFun(arguments[0], arguments[1]);
            }

            if (arguments.length == 3) {
                return new conFun(arguments[0], arguments[1], arguments[2]);
            }

            if (arguments.length == 4) {
                return new conFun(arguments[0], arguments[1], arguments[2], arguments[3]);
            }

            if (arguments.length == 5) {
                return new conFun(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
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
        return Preview;
    })();

    window.lin = window.lin || {};
    window.lin.Editor = Editor;
    return Editor;
}));