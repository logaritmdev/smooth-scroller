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
	 * The scrolling direction.
	 * @property direction
	 * @since 1.0.0
	 */
	public direction: string = 'y'

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
	public wheelDeltaScale: number = 3.75

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
	constructor(element: Document | HTMLElement, direction: string) {

		if (navigator.userAgent.indexOf('Edge') > -1) {
			return
		}

		this.direction = direction
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
	 * @property lastDist
	 * @since 1.0.0
	 * @hidden
	 */
	private lastDist: number = 0

	/**
	 * @property lastTime
	 * @since 1.0.0
	 * @hidden
	 */
	private lastTime: number = 0

	/**
	 * @method getElement
	 * @since 1.0.0
	 * @hidden
	 */
	private getElement(element: Document | HTMLElement) {
		return element instanceof Document ? document.documentElement : element
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
			return {
				x: 0,
				y: 0,
				width: window.innerWidth,
				height: window.innerHeight
			}
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

		let time = Date.now()

		let scrollableX = this.canScrollX()
		let scrollableY = this.canScrollY()

		switch (this.direction) {

			case 'x':
				scrollableY = false
				break

			case 'y':
				scrollableX = false
				break

			case 'xy':
				break
		}

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
		let dist = Math.abs(delta)

		scroll = scroll + (dist * sign)

		switch (true) {

			case scrollableX:
				this.setScrollX(scroll)
				break

			case scrollableY:
				this.setScrollY(scroll)
				break
		}

		let next = true

		if (this.lastDist == dist) {

			let duration = time - this.lastTime
			if (duration > 250) {
				this.lastTime = 0
				this.lastDist = 0
				next = false
			}

		} else {

			this.lastDist = dist
			this.lastTime = time

		}

		if (next) {
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

	private getDelta(e: any) {

		if ('wheelDeltaY' in e)
			return -e.wheelDeltaY / 160

		if ('deltaY' in e) {
			return e.deltaY
		}

		return 0

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
	private onWheel = (e: any) => {

		let delta = this.getDelta(e)

		let stop = this.hasOverflowScroll(e.target, Math.sign(delta))
		if (stop) {
			return
		}

		e.preventDefault()

		let scrollableX = this.canScrollX()
		let scrollableY = this.canScrollY()

		switch (this.direction) {

			case 'x':
				scrollableY = false
				break

			case 'y':
				scrollableX = false
				break

			case 'xy':
				break
		}

		let off = 0
		let min = 0
		let max = 0
		let cur = 0

		switch (true) {

			case scrollableX:
				off = this.offsetX
				cur = this.getScroll().x
				min = this.getScrollXMin()
				max = this.getScrollXMax()
				break

			case scrollableY:
				off = this.offsetY
				cur = this.getScroll().y
				min = this.getScrollYMin()
				max = this.getScrollYMax()
				break
		}

		if (delta > +1) delta = +1
		if (delta < -1) delta = -1

		off += delta * this.wheelDeltaScale * this.velocity

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

	/**
	 * @method hasOverflowScroll
	 * @since 1.0.0
	 * @hidden
	 */
	private hasOverflowScroll(element: HTMLElement, dir: number): boolean {

		if (element == this.element) {
			return false
		}

		let styles = getComputedStyle(element)

		let frameW = Math.ceil(element.getBoundingClientRect().width)
		let frameH = Math.ceil(element.getBoundingClientRect().height)
		let scrollW = Math.ceil(element.scrollWidth)
		let scrollH = Math.ceil(element.scrollHeight)

		if (styles.overflowX == 'visible' &&
			styles.overflowY == 'visible') {

			let parent = element.parentElement
			if (parent) {
				return this.hasOverflowScroll(parent, dir)
			}

			return false
		}

		if (styles.overflowX == 'auto' ||
			styles.overflowX == 'scroll') {
			if (scrollW > frameW) {
				return this.canOverflowElementScrollX(element, dir)
			}
		}

		if (styles.overflowY == 'auto' ||
			styles.overflowY == 'scroll') {
			if (scrollH > frameH) {
				return this.canOverflowElementScrollY(element, dir)
			}
		}

		return false
	}

	/**
	 * @method canOverflowElementScrollX
	 * @since 1.0.0
	 * @hidden
	 */
	private canOverflowElementScrollX(element: HTMLElement, dir: number) {
		return dir == 1 ? Math.ceil(element.scrollLeft + element.getBoundingClientRect().width) < Math.ceil(element.scrollWidth) : element.scrollLeft > 0
	}

	/**
	 * @method canOverflowElementScrollY
	 * @since 1.0.0
	 * @hidden
	 */
	private canOverflowElementScrollY(element: HTMLElement, dir: number) {
		return dir == 1 ? Math.ceil(element.scrollTop + element.getBoundingClientRect().height) < Math.ceil(element.scrollHeight) : element.scrollTop > 0
	}
}

(window as any).SmoothScroller = SmoothScroller