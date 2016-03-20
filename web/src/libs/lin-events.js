(function() {


    var eventFun = function() {

        var extensionList = [];
        var extensionListeners = {};
        var eventListenerListMap = {};
        var eventHooks = [];

        function Event() {

        }

        function getExtensionListenerList(eventName) {
            var extensionListener = [];
            for (var n = 0; n < extensionList.length; n++) {
                if (extensionList[n] && extensionList[n][eventName] && typeof extensionList[n][eventName] == 'function') {
                    extensionListener.push(extensionList[n][eventName]);
                }
            }
            return extensionListener;
        }

        Event.prototype.addExtendsion = function(obj) {
            extensionList.push(obj);
            if (obj && obj.onCreated && typeof obj.onCreated == 'function') {
                obj.onCreated(this);
            }

            for (var n = 0; n < eventHooks.length; n++) {
                Event.prototype[eventHooks[n]] = createEventHook(eventHooks[n]);
            }
        }

        Event.prototype.removeExtendsion = function(obj) {
            extensionList.push(obj);
            var tmpExtensionList = [];
            for (var n = 0; n < extensionList.length; n++) {
                if (obj != extensionList[n]) {
                    tmpExtensionList.push(extensionList[n]);
                }
            }
            extensionList = tmpExtensionList;
            // if(obj && obj.onCreated && typeof obj.onCreated == 'function'){
            // 	obj.onCreated(this);
            // }

            for (var n = 0; n < eventHooks.length; n++) {
                Event.prototype[eventHooks[n]] = createEventHook(eventHooks[n]);
            }
        }

        Event.prototype.listeners = function(eventName) {
            var eventListeners = eventListenerListMap[eventName];
            var es = extensionListeners[eventName];

            if (!es || !(es instanceof Array)) {
                es = [];
            }
            if (eventListeners && eventListeners instanceof Array) {
                return es.concat(tmpExtensionList);
            }
            return es;
        }


        function createEventHook(eventName) {

            var extensions = getExtensionListenerList(eventName);
            extensionListeners[eventName] = extensions;

            return function() {

                var eventArguments = arguments;

                for (var n = 0; n < extensions.length; n++) {
                    extensions[n].apply(null, eventArguments);
                }

                var listeners = eventListenerListMap[eventName];
                if (listeners && listeners instanceof Array) {
                    for (var n = 0; n < listeners.length; n++) {
                        listeners[n].apply(null, eventArguments);
                    }
                }
            }
        }
        Event.prototype.addEventHook = function(eventName) {
            if (eventName == 'addExtendsion' ||
                eventName == 'addExtendsion' ||
                eventName == 'addEventHook' ||
                eventName == 'removeEventHook' ||
                eventName == 'addListener' ||
                eventName == 'onCreated' ||
                eventName == 'removeExtendsion' ||
                eventName == 'listeners') {
                return;
            }
            eventHooks.push(eventName);
            Event.prototype[eventName] = createEventHook(eventName);
        }

        Event.prototype.removeEventHook = function(eventName) {
            eventHooks.pop(eventName);
            delete extensionListeners[eventName];
            delete Event.prototype[eventName];
        }

        Event.prototype.addListener = function(event, listener) {
            if (!eventListenerListMap[event]) {
                eventListenerListMap[event] = [];
            }
            eventListenerListMap[event].push(listener);
        }
        return Event;
    };



    var Event = (function() {

        function Event() {

            var conFun = eventFun();

            if (!arguments || arguments.length == 0) {
                return new conFun();
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

        var event = new Event();

        Event.addExtendsion = function() {
            event.addExtendsion.apply(event, arguments);
        }

        Event.removeExtendsion = function() {
            event.removeExtendsion.apply(event, arguments);
        }

        Event.addEventHook = function() {
            if (!arguments || arguments.length < 1) {
                return;
            }
            if (eventName == 'addExtendsion' ||
                eventName == 'addExtendsion' ||
                eventName == 'addEventHook' ||
                eventName == 'removeEventHook' ||
                eventName == 'addListener' ||
                eventName == 'onCreated' ||
                eventName == 'removeExtendsion' ||
                eventName == 'listeners') {
                return;
            }
            var eventName = arguments[0];
            Event[eventName] = function() {
                event[eventName].apply(event, arguments);
            }
            event.addEventHook.apply(event, arguments);

        }

        Event.removeEventHook = function() {
            if (!arguments || arguments.length < 1) {
                return;
            }
            var eventName = arguments[0];
            if (eventName == 'addExtendsion' ||
                eventName == 'addExtendsion' ||
                eventName == 'addEventHook' ||
                eventName == 'removeEventHook' ||
                eventName == 'addListener' ||
                eventName == 'listeners') {
                return;
            }
            event.removeEventHook.apply(event, arguments);
            delete event[eventName];
        }

        Event.addListener = function() {
            event.addListener.apply(event, arguments);
        }

        return Event;
    })();


    window.lin = window.lin || {};
    window.lin.Event = Event;
    return Event;



})();