"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Smooth scrolling that uses native scrolling.
 * @class SmoothScroller
 * @since 1.0.0
 */
var SmoothScroller = /** @class */ (function () {
    //--------------------------------------------------------------------------
    // Methods
    //--------------------------------------------------------------------------
    /**
     * @constructor
     * @since 1.0.0
     */
    function SmoothScroller(element, direction) {
        var _this = this;
        //--------------------------------------------------------------------------
        // Properties
        //--------------------------------------------------------------------------
        /**
         * The scrolling direction.
         * @property direction
         * @since 1.0.0
         */
        this.direction = 'y';
        /**
         * The scrolling velocity.
         * @property velocity
         * @since 1.0.0
         */
        this.velocity = 30;
        /**
         * The scrolling deceleration rate.
         * @property friction
         * @since 1.0.0
         */
        this.friction = 10;
        /**
         * Multiplies the wheel delta.
         * @property wheelDeltaScale
         * @since 1.0.0
         */
        this.wheelDeltaScale = 3.75;
        /**
         * Whether to disable interaction with iframe during animations.
         * @property disableIframes
         * @since 1.0.0
         */
        this.disableIframes = true;
        /**
         * @property offsetX
         * @since 1.0.0
         * @hidden
         */
        this.offsetX = 0;
        /**
         * @property scrollY
         * @since 1.0.0
         * @hidden
         */
        this.offsetY = 0;
        /**
         * @property animated
         * @since 1.0.0
         * @hidden
         */
        this.animated = false;
        /**
         * @property lastDist
         * @since 1.0.0
         * @hidden
         */
        this.lastDist = 0;
        /**
         * @property lastTime
         * @since 1.0.0
         * @hidden
         */
        this.lastTime = 0;
        //--------------------------------------------------------------------------
        // Events
        //--------------------------------------------------------------------------
        /**
         * @method onScroll
         * @since 1.0.0
         * @hidden
         */
        this.onScroll = function (e) {
            if (_this.animated == false) {
                _this.offsetX = _this.getScroll().x;
                _this.offsetY = _this.getScroll().y;
            }
        };
        /**
         * @method onWheel
         * @since 1.0.0
         * @hidden
         */
        this.onWheel = function (e) {
            e.preventDefault();
            var scrollableX = _this.canScrollX();
            var scrollableY = _this.canScrollY();
            switch (_this.direction) {
                case 'x':
                    scrollableY = false;
                    break;
                case 'y':
                    scrollableX = false;
                    break;
                case 'xy':
                    break;
            }
            var off = 0;
            var min = 0;
            var max = 0;
            var cur = 0;
            switch (true) {
                case scrollableX:
                    off = _this.offsetX;
                    cur = _this.getScroll().x;
                    min = _this.getScrollXMin();
                    max = _this.getScrollXMax();
                    break;
                case scrollableY:
                    off = _this.offsetY;
                    cur = _this.getScroll().y;
                    min = _this.getScrollYMin();
                    max = _this.getScrollYMax();
                    break;
            }
            var delta = _this.getDelta(e);
            if (delta > +1)
                delta = +1;
            if (delta < -1)
                delta = -1;
            off += delta * _this.wheelDeltaScale * _this.velocity;
            if (off < min)
                off = min;
            if (off > max)
                off = max;
            switch (true) {
                case scrollableX:
                    _this.offsetX = off;
                    break;
                case scrollableY:
                    _this.offsetY = off;
                    break;
            }
            if (_this.animated == false) {
                if (_this.disableIframes) {
                    _this.disableIframesPointerEvents();
                }
                _this.update();
            }
        };
        if (navigator.userAgent.indexOf('Edge') > -1) {
            return;
        }
        this.direction = direction;
        this.element = this.getElement(element);
        this.offsetY = this.element.scrollTop;
        this.offsetX = this.element.scrollLeft;
        this.attach();
    }
    /**
     * Destroyes the smooth scroller.
     * @method destroy
     * @since 1.0.0
     */
    SmoothScroller.prototype.destroy = function () {
        this.detach();
    };
    /**
     * @method getElement
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getElement = function (element) {
        return element instanceof Document ? document.documentElement : element;
    };
    /**
     * @method getWrapper
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getWrapper = function () {
        return this.element == document.documentElement ? document : this.element;
    };
    /**
     * @method attach
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.attach = function () {
        var wrapper = this.getWrapper();
        wrapper.addEventListener('wheel', this.onWheel, { passive: false });
        wrapper.addEventListener('scroll', this.onScroll, { passive: true });
    };
    /**
     * @method detach
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.detach = function () {
        var wrapper = this.getWrapper();
        wrapper.removeEventListener('wheel', this.onWheel);
        wrapper.removeEventListener('scroll', this.onScroll);
    };
    /**
     * @method getBounds
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getBounds = function () {
        if (this.element == document.documentElement) {
            return {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        return this.element.getBoundingClientRect();
    };
    /**
     * @method canScrollX
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.canScrollX = function () {
        var s = this.getScroll().width;
        var b = this.getBounds().width;
        return s > b;
    };
    /**
     * @method canScrollY
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.canScrollY = function () {
        var s = this.getScroll().height;
        var b = this.getBounds().height;
        return s > b;
    };
    /**
     * @method getScroll
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getScroll = function () {
        return {
            y: this.element.scrollTop,
            x: this.element.scrollLeft,
            width: this.element.scrollWidth,
            height: this.element.scrollHeight
        };
    };
    /**
     * @method getScrollXMin
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getScrollXMin = function () {
        return 0;
    };
    /**
     * @method getScrollXMax
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getScrollXMax = function () {
        var s = this.getScroll().width;
        var b = this.getBounds().width;
        return Math.floor(s - b);
    };
    /**
     * @method getScrollYMin
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getScrollYMin = function () {
        return 0;
    };
    /**
     * @method getScrollYMax
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.getScrollYMax = function () {
        var s = this.getScroll().height;
        var b = this.getBounds().height;
        return Math.floor(s - b);
    };
    /**
     * @method setScrollX
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.setScrollX = function (value) {
        this.element.scrollLeft = value;
    };
    /**
     * @method setScrollY
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.setScrollY = function (value) {
        this.element.scrollTop = value;
    };
    /**
     * @method update
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.update = function () {
        var _this = this;
        var time = Date.now();
        var scrollableX = this.canScrollX();
        var scrollableY = this.canScrollY();
        switch (this.direction) {
            case 'x':
                scrollableY = false;
                break;
            case 'y':
                scrollableX = false;
                break;
            case 'xy':
                break;
        }
        this.animated = true;
        var offset = 0;
        var scroll = 0;
        switch (true) {
            case scrollableX:
                offset = this.offsetX;
                scroll = this.getScroll().x;
                break;
            case scrollableY:
                offset = this.offsetY;
                scroll = this.getScroll().y;
                break;
        }
        var delta = (offset - scroll) / this.friction;
        var sign = Math.sign(delta);
        var dist = Math.ceil(Math.abs(delta));
        scroll = scroll + (dist * sign);
        switch (true) {
            case scrollableX:
                this.setScrollX(scroll);
                break;
            case scrollableY:
                this.setScrollY(scroll);
                break;
        }
        var next = true;
        if (this.lastDist == dist) {
            var duration = time - this.lastTime;
            if (duration > 250) {
                this.lastTime = 0;
                this.lastDist = 0;
                next = false;
            }
        }
        else {
            this.lastDist = dist;
            this.lastTime = time;
        }
        if (next) {
            requestAnimationFrame(function () { return _this.update(); });
            return;
        }
        if (this.disableIframes) {
            this.disableIframesPointerEvents(false);
        }
        this.animated = false;
    };
    /**
     * @method disableIframesPointerEvents
     * @since 1.0.0
     * @hidden
     */
    SmoothScroller.prototype.disableIframesPointerEvents = function (disable) {
        if (disable === void 0) { disable = true; }
        document.querySelectorAll('iframe').forEach(function (element) {
            element.style.pointerEvents = disable ? 'none' : '';
        });
    };
    SmoothScroller.prototype.getDelta = function (e) {
        if ('wheelDeltaY' in e)
            return -e.wheelDeltaY / 160;
        if ('deltaY' in e) {
            return e.deltaY;
        }
        return 0;
    };
    return SmoothScroller;
}());
exports.SmoothScroller = SmoothScroller;
window.SmoothScroller = SmoothScroller;
