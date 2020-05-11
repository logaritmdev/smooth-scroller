/**
 * Smooth scrolling that uses native scrolling.
 * @class SmoothScroller
 * @since 1.0.0
 */
export declare class SmoothScroller {
    /**
     * The scrolling velocity.
     * @property velocity
     * @since 1.0.0
     */
    velocity: number;
    /**
     * The scrolling deceleration rate.
     * @property friction
     * @since 1.0.0
     */
    friction: number;
    /**
     * Multiplies the wheel delta.
     * @property wheelDeltaScale
     * @since 1.0.0
     */
    wheelDeltaScale: number;
    /**
     * Whether to disable interaction with iframe during animations.
     * @property disableIframes
     * @since 1.0.0
     */
    disableIframes: boolean;
    /**
     * @constructor
     * @since 1.0.0
     */
    constructor(element: Document | HTMLElement);
    /**
     * Destroyes the smooth scroller.
     * @method destroy
     * @since 1.0.0
     */
    destroy(): void;
    /**
     * @property element
     * @since 1.0.0
     * @hidden
     */
    private element;
    /**
     * @property offsetX
     * @since 1.0.0
     * @hidden
     */
    private offsetX;
    /**
     * @property scrollY
     * @since 1.0.0
     * @hidden
     */
    private offsetY;
    /**
     * @property animated
     * @since 1.0.0
     * @hidden
     */
    private animated;
    /**
     * @property lastDist
     * @since 1.0.0
     * @hidden
     */
    private lastDist;
    /**
     * @property lastTime
     * @since 1.0.0
     * @hidden
     */
    private lastTime;
    /**
     * @method getElement
     * @since 1.0.0
     * @hidden
     */
    private getElement;
    /**
     * @method getWrapper
     * @since 1.0.0
     * @hidden
     */
    private getWrapper;
    /**
     * @method attach
     * @since 1.0.0
     * @hidden
     */
    private attach;
    /**
     * @method detach
     * @since 1.0.0
     * @hidden
     */
    private detach;
    /**
     * @method getBounds
     * @since 1.0.0
     * @hidden
     */
    private getBounds;
    /**
     * @method canScrollX
     * @since 1.0.0
     * @hidden
     */
    private canScrollX;
    /**
     * @method canScrollY
     * @since 1.0.0
     * @hidden
     */
    private canScrollY;
    /**
     * @method getScroll
     * @since 1.0.0
     * @hidden
     */
    private getScroll;
    /**
     * @method getScrollXMin
     * @since 1.0.0
     * @hidden
     */
    private getScrollXMin;
    /**
     * @method getScrollXMax
     * @since 1.0.0
     * @hidden
     */
    private getScrollXMax;
    /**
     * @method getScrollYMin
     * @since 1.0.0
     * @hidden
     */
    private getScrollYMin;
    /**
     * @method getScrollYMax
     * @since 1.0.0
     * @hidden
     */
    private getScrollYMax;
    /**
     * @method setScrollX
     * @since 1.0.0
     * @hidden
     */
    private setScrollX;
    /**
     * @method setScrollY
     * @since 1.0.0
     * @hidden
     */
    private setScrollY;
    /**
     * @method update
     * @since 1.0.0
     * @hidden
     */
    private update;
    /**
     * @method disableIframesPointerEvents
     * @since 1.0.0
     * @hidden
     */
    private disableIframesPointerEvents;
    /**
     * @method onScroll
     * @since 1.0.0
     * @hidden
     */
    private onScroll;
    /**
     * @method onWheel
     * @since 1.0.0
     * @hidden
     */
    private onWheel;
}
