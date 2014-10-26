/**
 * swipe-cross.js 0.0.0
 * author: Yoshiya Hinosawa (@kt3k)
 * license: MIT lisence
 */

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
    };

    var exports = function (options) {
        options = options || {};

        this.elm = options.elm;

        this.bindEvents();
    };

    var crossSwipePrototype = exports.prototype;

    crossSwipePrototype.createHandlers = function () {

        var self = this;

        this.handler = function (event) {
            event.preventDefault();

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
        };
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
    };

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
                this._swipeEvent = new window.SwipeEvent({elm: this[0]});
            }

            this._swipeCross = new exports({elm: this[0]});

            return this;
        };

        $.fn.swipeCrossUnbind = function () {

            if (this._swipeEvent != null) {
                this._swipeEvent.unbindEvents();

                this._swipeEvent = null;
            }

            this._swipeCross.unbindEvents();

            this._swipeCross = null;

            return this;
        };

    }

    return exports;

}(window, window.$));
