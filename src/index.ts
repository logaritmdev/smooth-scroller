/**
 * Smooth scrolling that uses native scrolling.
 * @class SmoothScroller
 * @since 1.0.0
 */
export class SmoothScroller {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The scrolling velocity.
	 * @property velocity
	 * @since 1.0.0
	 */
	public velocity: number = 30

	/**
	 * The scrolling deceleration rate.
	 * @property friction
	 * @since 1.0.0
	 */
	public friction: number = 10

	/**
	 * Multiplies the wheel delta.
	 * @property wheelDeltaScale
	 * @since 1.0.0
	 */
	public wheelDeltaScale: number = 5

	/**
	 * Whether to disable interaction with iframe during animations.
	 * @property disableIframes
	 * @since 1.0.0
	 */
	public disableIframes: boolean = true

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 1.0.0
	 */
	constructor(element: Document | HTMLElement) {

		this.element = this.getElement(element)
		this.offsetY = this.element.scrollTop
		this.offsetX = this.element.scrollLeft

		this.attach()
	}

	/**
	 * Destroyes the smooth scroller.
	 * @method destroy
	 * @since 1.0.0
	 */
	public destroy() {
		this.detach()
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property element
	 * @since 1.0.0
	 * @hidden
	 */
	private element: HTMLElement

	/**
	 * @property offsetX
	 * @since 1.0.0
	 * @hidden
	 */
	private offsetX: number = 0

	/**
	 * @property scrollY
	 * @since 1.0.0
	 * @hidden
	 */
	private offsetY: number = 0

	/**
	 * @property animated
	 * @since 1.0.0
	 * @hidden
	 */
	private animated: boolean = false

	/**
	 * @method getElement
	 * @since 1.0.0
	 * @hidden
	 */
	private getElement(element: Document | HTMLElement) {
		return element instanceof Document ? element.documentElement : element
	}

	/**
	 * @method getWrapper
	 * @since 1.0.0
	 * @hidden
	 */
	private getWrapper() {
		return this.element == document.documentElement ? document : this.element
	}

	/**
	 * @method attach
	 * @since 1.0.0
	 * @hidden
	 */
	private attach() {
		let wrapper = this.getWrapper()
		wrapper.addEventListener('wheel', this.onWheel, { passive: false })
		wrapper.addEventListener('scroll', this.onScroll, { passive: true })
	}

	/**
	 * @method detach
	 * @since 1.0.0
	 * @hidden
	 */
	private detach() {
		let wrapper = this.getWrapper()
		wrapper.removeEventListener('wheel', this.onWheel)
		wrapper.removeEventListener('scroll', this.onScroll)
	}

	/**
	 * @method getBounds
	 * @since 1.0.0
	 * @hidden
	 */
	private getBounds() {

		if (this.element == document.documentElement) {
			return new DOMRect(
				0, 0,
				window.innerWidth,
				window.innerHeight
			)
		}

		return this.element.getBoundingClientRect()
	}

	/**
	 * @method canScrollX
	 * @since 1.0.0
	 * @hidden
	 */
	private canScrollX() {

		let s = this.getScroll().width
		let b = this.getBounds().width

		return s > b
	}

	/**
	 * @method canScrollY
	 * @since 1.0.0
	 * @hidden
	 */
	private canScrollY() {

		let s = this.getScroll().height
		let b = this.getBounds().height

		return s > b
	}

	/**
	 * @method getScroll
	 * @since 1.0.0
	 * @hidden
	 */
	private getScroll() {
		return {
			y: this.element.scrollTop,
			x: this.element.scrollLeft,
			width: this.element.scrollWidth,
			height: this.element.scrollHeight
		}
	}

	/**
	 * @method getScrollXMin
	 * @since 1.0.0
	 * @hidden
	 */
	private getScrollXMin() {
		return 0
	}

	/**
	 * @method getScrollXMax
	 * @since 1.0.0
	 * @hidden
	 */
	private getScrollXMax() {

		let s = this.getScroll().width
		let b = this.getBounds().width

		return Math.floor(s - b)
	}

	/**
	 * @method getScrollYMin
	 * @since 1.0.0
	 * @hidden
	 */
	private getScrollYMin() {
		return 0
	}

	/**
	 * @method getScrollYMax
	 * @since 1.0.0
	 * @hidden
	 */
	private getScrollYMax() {

		let s = this.getScroll().height
		let b = this.getBounds().height

		return Math.floor(s - b)
	}

	/**
	 * @method setScrollX
	 * @since 1.0.0
	 * @hidden
	 */
	private setScrollX(value: number) {
		this.element.scrollLeft = value
	}

	/**
	 * @method setScrollY
	 * @since 1.0.0
	 * @hidden
	 */
	private setScrollY(value: number) {
		this.element.scrollTop = value
	}

	/**
	 * @method update
	 * @since 1.0.0
	 * @hidden
	 */
	private update() {

		let scrollableX = this.canScrollX()
		let scrollableY = this.canScrollY()

		this.animated = true

		let offset = 0
		let scroll = 0

		switch (true) {

			case scrollableX:
				offset = this.offsetX
				scroll = this.getScroll().x
				break

			case scrollableY:
				offset = this.offsetY
				scroll = this.getScroll().y
				break
		}

		let delta = (offset - scroll) / this.friction

		let sign = Math.sign(delta)
		let dist = Math.ceil(Math.abs(delta))

		scroll = scroll + (dist * sign)

		switch (true) {

			case scrollableX:
				this.setScrollX(scroll)
				break

			case scrollableY:
				this.setScrollY(scroll)
				break
		}

		if (dist > 0) {
			requestAnimationFrame(() => this.update())
			return
		}

		if (this.disableIframes) {
			this.disableIframesPointerEvents(false)
		}

		this.animated = false
	}

	/**
	 * @method disableIframesPointerEvents
	 * @since 1.0.0
	 * @hidden
	 */
	private disableIframesPointerEvents(disable: boolean = true) {
		document.querySelectorAll('iframe').forEach(element => {
			element.style.pointerEvents = disable ? 'none' : ''
		})
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @method onScroll
	 * @since 1.0.0
	 * @hidden
	 */
	private onScroll = (e: Event) => {
		if (this.animated == false) {
			this.offsetX = this.getScroll().x
			this.offsetY = this.getScroll().y
		}
	}

	/**
	 * @method onWheel
	 * @since 1.0.0
	 * @hidden
	 */
	private onWheel = (ev: Event) => {

		let e = ev as WheelEvent // Meh!

		e.preventDefault()

		let scrollableX = this.canScrollX()
		let scrollableY = this.canScrollY()

		let off = 0
		let min = 0
		let max = 0

		switch (true) {

			case scrollableX:
				off = this.offsetX
				min = this.getScrollXMin()
				max = this.getScrollXMax()
				break

			case scrollableY:
				off = this.offsetY
				min = this.getScrollYMin()
				max = this.getScrollYMax()
				break
		}

		off += Math.sign(e.deltaY) * this.wheelDeltaScale * this.velocity

		if (off < min) off = min
		if (off > max) off = max

		switch (true) {

			case scrollableX:
				this.offsetX = off
				break

			case scrollableY:
				this.offsetY = off
				break
		}

		if (this.animated == false) {

			if (this.disableIframes) {
				this.disableIframesPointerEvents()
			}

			this.update()
		}
	}
}