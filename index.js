/**
 * swipe-4dir.js 0.0.0
 * author: Yoshiya Hinosawa (@kt3k)
 * license: MIT lisence
 */

this.Swipe4Dir = (function (window, $) {
    'use strict';

    /* module constants */

    var DIRECTION = {
        UP: 0,
        DOWN: 1,
        RIGHT: 2,
        LEFT: 3
    };

    var SWIPE = {
        THRESHOLD: 3
    };

    var EVENT = {
        SWIPE: {
            START: 'swipestart',
            CHANGE: 'swipechange',
            UP: 'swipeup',
            RIGHT: 'swiperight',
            DOWN: 'swipedown',
            LEFT: 'swipeleft',
            CANCEL: 'swipecancel',
        }
    }

    var exports = function (options) {
        options = options || {};

        this.elm = options.elm;

        this.phase = null;
        this.fingerCount = 0;

        this.touchCurrent = null;
        this.touchInitial = null;


        this.bindEvents();

        this.touchReset();
    };

    var prototype = exports.prototype;

    prototype.dispatchEvent = function (eventName) {
        this.elm.dispatchEvent(new CustomEvent(eventName, {
            startX: this.touchInitial.pageX,
            startY: this.touchInitial.pageY,
            endX: this.touchCurrent.pageX,
            endY: this.touchCurrent.pageY
        }));
    };

    /**
     * Calculate uniform distance between the initial position and the last position.
     * @private
     */
    prototype.swipeDistance = function () {

        var x = this.touchCurrent.pageX - this.touchInitial.pageX;
        var y = this.touchCurrent.pageY - this.touchInitial.pageY;

        return Math.max(Math.abs(x), Math.abs(y));

    };

    /**
     * Returns swipe angle in degree (0 < angle < 360).
     * @private
     */
    prototype.swipeAngle = function () {

        var rad = Math.atan2(
            this.touchCurrent.pageY - this.touchInitial.pageY,
            this.touchCurrent.pageX - this.touchInitial.pageX
        );

        return (Math.floor(rad * 180 / Math.PI) + 360) % 360;

    };

    /**
     *
     */
    prototype.swipeDirection = function () {

        var angle = swipeAngle();

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

    prototype.swipeEnd = function () {
        var dist = swipeDistance();

        if (dist < SWIPE.THRESHOLD) {
            return;
        }

        var dir = swipeDirection();

        if (dir === DIRECTION.UP) {

            this.dispatchEvent(EVENT.SWIPE.UP);

        } else if (dir === DIRECTION.RIGHT) {

            this.dispatchEvent(EVENT.SWIPE.RIGHT);

        } else if (dir === DIRECTION.DOWN) {

            this.dispatchEvent(EVENT.SWIPE.DOWN);

        } else if (dir === DIRECTION.LEFT) {

            this.dispatchEvent(EVENT.SWIPE.LEFT);

        }
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
        this.phase = PHASE.END;

        this.swipeEnd();
    };

    prototype.touchCancel = function () {
        this.phase = PHASE.NONE;

        this.dispatchEvent(EVENT.SWIPE.CANCEL);
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

            }
        };
    };

    prototype.bindEvents = function () {
        var elm = this.elm;

        this.createHandlers();

        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            elm.addEventListener('touchstart', this.handlers.touchStart, false);
            elm.addEventListener('touchmove', this.handlers.touchMove, false);
            elm.addEventListener('touchend', this.handlers.touchEnd, false);
            elm.addEventListener('touchcancel', this.handlers.touchCancel, false);
        } else {
            elm.addEventListener('mousedown', this.handlers.mouseDown, false);
            elm.addEventListener('mousemove', this.handlers.mouseMove, false);
            elm.addEventListener('mouseup', this.handlers.mouseUp, false);
        }
    };

    prototype.unbindEvents = function () {
        var elm = this.elm;

        if (window.document.documentElement.hasOwnProperty('ontouchstart')) {
            elm.removeEventListener('touchstart', this.handlers.touchStart, false);
            elm.removeEventListener('touchmove', this.handlers.touchMove, false);
            elm.removeEventListener('touchend', this.handlers.touchEnd, false);
            elm.removeEventListener('touchcancel', this.handlers.touchCancel, false);
        } else {
            elm.removeEventListener('mousedown', this.handlers.mouseDown, false);
            elm.removeEventListener('mousemove', this.handlers.mouseMove, false);
            elm.removeEventListener('mouseup', this.handlers.mouseUp, false);
        }
    };

    exports.EVENT = EVENT;
    exports.DIRECTION = DIRECTION;
    exports.SWIPE = SWIPE;

    if ($ != null) {

        $.fn.swipeEvent = function () {
            this._swipeEvent = new exports({elm: $(this)[0]});
        };

        $.fn.swipeEventUnbind = function () {
            this._swipeEvent.unbindEvents();

            this._swipeEvent = null;
        }

    }

    return exports;

}(window, window.$));
