/**
 * swipe-event.js 0.0.0
 * author: Yoshiya Hinosawa (@kt3k)
 * license: MIT lisence
 */

this.SwipeEvent = (function (window, $) {
    'use strict';


    var EVENT = {
        SWIPE: {
            CANCEL: 'swipecancel',
            END: 'swipeend'
        }
    }

    var exports = function (options) {
        options = options || {};

        this.elm = options.elm;

        this.fingerCount = 0;

        this.touchCurrent = null;
        this.touchInitial = null;


        this.bindEvents();
    };

    var prototype = exports.prototype;

    prototype.dispatchEvent = function (eventName) {
        this.elm.dispatchEvent(new CustomEvent(eventName, {
            detail: {
                startX: this.touchInitial.pageX,
                startY: this.touchInitial.pageY,
                endX: this.touchCurrent.pageX,
                endY: this.touchCurrent.pageY
            }
        }));
    };


    prototype.swipeEnd = function () {
        if (this.fingerCount != 1) {
            this.fingerCount = 0;

            return;
        }

        this.fingerCount = 0;

        this.dispatchEvent(EVENT.SWIPE.END);

    };

    // touch event handlers and a resetter
    prototype.touchStart = function (touch) {
        this.touchInitial = touch;
        this.touchCurrent = touch;
        this.fingerCount = 1;
    };

    prototype.touchMove = function (touch) {
        this.touchCurrent = touch;
    };

    prototype.touchEnd = function () {
        this.swipeEnd();
    };

    prototype.touchCancel = function () {
        if (this.fingerCount > 0) {
            this.fingerCount = 0;

            this.dispatchEvent(EVENT.SWIPE.CANCEL);
        }
    };

    prototype.createHandlers = function () {

        var self = this;

        this.handlers = {
            touchStart: function (event) {

                event.preventDefault();

                if (event.touches.length === 1) {
                    self.touchStart(event.touches[0]);
                } else {
                    self.touchCancel();
                }
            },

            touchMove: function (event) {

                event.preventDefault();

                if (self.fingerCount === 1) {
                    self.touchMove(event.touches[0]);
                } else {
                    self.touchCancel();
                }
            },

            touchEnd: function (event) {

                event.preventDefault();

                if (self.fingerCount === 1) {
                    self.touchEnd();
                } else {
                    self.touchCancel();
                }
            },

            touchCancel: function (event) {

                event.preventDefault();

                self.touchCancel();

            },

            mouseDown: function (event) {

                event.preventDefault();

                self.touchStart(event);

            },

            mouseMove: function (event) {

                event.preventDefault();

                self.touchMove(event);

            },

            mouseUp: function (event) {

                event.preventDefault();

                self.touchEnd();

            },

            mouseOut: function (event) {

                event.preventDefault();

                self.touchCancel();

            }
        };
    };

    prototype.bindEvents = function () {

        this.createHandlers();

        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            this.elm.addEventListener('touchstart', this.handlers.touchStart, false);
            this.elm.addEventListener('touchmove', this.handlers.touchMove, false);
            this.elm.addEventListener('touchend', this.handlers.touchEnd, false);
            this.elm.addEventListener('touchcancel', this.handlers.touchCancel, false);
        } else {
            this.elm.addEventListener('mousedown', this.handlers.mouseDown, false);
            this.elm.addEventListener('mousemove', this.handlers.mouseMove, false);
            this.elm.addEventListener('mouseout', this.handlers.mouseOut, false);
            this.elm.addEventListener('mouseup', this.handlers.mouseUp, false);
        }
    };

    prototype.unbindEvents = function () {

        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            this.elm.removeEventListener('touchstart', this.handlers.touchStart, false);
            this.elm.removeEventListener('touchmove', this.handlers.touchMove, false);
            this.elm.removeEventListener('touchend', this.handlers.touchEnd, false);
            this.elm.removeEventListener('touchcancel', this.handlers.touchCancel, false);
        } else {
            this.elm.removeEventListener('mousedown', this.handlers.mouseDown, false);
            this.elm.removeEventListener('mousemove', this.handlers.mouseMove, false);
            this.elm.removeEventListener('mouseout', this.handlers.mouseOut, false);
            this.elm.removeEventListener('mouseup', this.handlers.mouseUp, false);
        }
    };

    if ($ != null && $.fn != null) {

        $.fn.swipeEvent = function () {
            this._swipeEvent = new exports({elm: this[0]});
        };

        $.fn.swipeEventUnbind = function () {
            this._swipeEvent.unbindEvents();

            this._swipeEvent = null;
        }

    }

    return exports;

}(window, window.$));


window.SwipeEvent.SwipeCross = (function (window, $) {
    'use strict';


    var SWIPE = {
        THRESHOLD: 3
    };

    var DIRECTION = {
        UP: 0,
        DOWN: 1,
        RIGHT: 2,
        LEFT: 3
    };

    var EVENT = {
        SWIPE: {
            UP: 'swipeup',
            RIGHT: 'swiperight',
            DOWN: 'swipedown',
            LEFT: 'swipeleft'
        }
    }

    var exports = function (options) {
        options = options || {};

        this.elm = options.elm;

        this.bindEvents();
    };

    var crossSwipePrototype = exports.prototype;

    crossSwipePrototype.createHandlers = function () {

        var self = this;

        this.handler = function (event) {
            event.preventDefault

            var stroke = new SwipeStroke(event.detail.startX, event.detail.startY, event.detail.endX, event.detail.endY);

            if (stroke.distance() <= SWIPE.THRESHOLD) {
                return;
            }

            var direction = stroke.direction();

            if (direction === DIRECTION.UP) {
                self.dispatchEvent(EVENT.SWIPE.UP);
            } else if (direction === DIRECTION.LEFT) {
                self.dispatchEvent(EVENT.SWIPE.LEFT);
            } else if (direction === DIRECTION.RIGHT) {
                self.dispatchEvent(EVENT.SWIPE.RIGHT);
            } else {
                self.dispatchEvent(EVENT.SWIPE.DOWN);
            }
        }
    };

    crossSwipePrototype.bindEvents = function () {
        this.createHandlers();

        this.elm.addEventListener('swipeend', this.handler, false);
    };

    crossSwipePrototype.unbindEvents = function () {
        this.elm.removeEventListener('swipeend', this.handler, false);
    };

    crossSwipePrototype.dispatchEvent = function (eventName) {
        this.elm.dispatchEvent(new CustomEvent(eventName, {}));
    };

    /**
     * @class
     */
    var SwipeStroke = function (startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    var prototype = SwipeStroke.prototype;

    /**
     * Calculate uniform distance between the initial position and the last position.
     * @private
     */
    prototype.distance = function () {

        var x = this.endX - this.startX;
        var y = this.endY - this.startY;

        return Math.max(Math.abs(x), Math.abs(y));

    };

    /**
     * Returns swipe angle in degree (0 < angle < 360).
     * @private
     */
    prototype.angle = function () {

        var rad = Math.atan2(
            this.endY - this.startY,
            this.endX - this.startX
        );

        return (Math.floor(rad * 180 / Math.PI) + 360) % 360;

    };

    /**
     *
     */
    prototype.direction = function () {

        var angle = this.angle();

        if (angle < 45 || 315 <= angle) {
            return DIRECTION.RIGHT;
        } else if (45 <= angle && angle < 135) {
            return DIRECTION.DOWN;
        } else if (135 <= angle && angle < 225) {
            return DIRECTION.LEFT;
        } else {
            return DIRECTION.UP;
        }
    };

    if ($ != null && $.fn != null) {

        $.fn.swipeCross = function () {

            if (this._swipeEvent == null) {
                this._swipeEvent = new SwipeEvent({elm: this[0]});
            }

            this._swipeCross = new exports({elm: this[0]});
        };

        $.fn.swipeCrossUnbind = function () {

            if (this._swipeEvent != null) {
                this._swipeEvent.unbindEvents();

                this._swipeEvent = null;
            }

            this._swipeCross.unbindEvents();

            this._swipeCross = null;
        }

    }

    return exports;

}(window, window.$));
