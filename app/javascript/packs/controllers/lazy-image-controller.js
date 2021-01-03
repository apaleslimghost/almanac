import { Controller } from 'stimulus'
import { decode } from 'blurhash'

const observer = new IntersectionObserver(entries => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			entry.target['lazy-image'].loadImage()
		}
	}
})

export default class LazyImage extends Controller {
	static values = { blurhash: String, src: String }
	static targets = ['canvas', 'image']

	connect() {
		this.element[this.identifier] = this

		if (!this.imageTarget.src) {
			this.ctx = this.canvasTarget.getContext("2d")
			this.renderBlur()
			observer.observe(this.element)
		}
	}

	renderBlur() {
		const pixels = decode(this.blurhashValue, 32, 32);
		const imageData = this.ctx.createImageData(32, 32);
		imageData.data.set(pixels);
		this.ctx.putImageData(imageData, 0, 0);
		this.showBlur()
	}

	loadImage() {
		this.imageTarget.src = this.srcValue
		if (this.imageTarget.complete) {
			this.showImageImmediately()
		}
	}

	showBlur() {
		this.element.classList.add('loading')
	}

	showImage() {
		this.element.classList.remove('loading')
		this.element.classList.add('loaded')
	}

	showImageImmediately() {
		this.showImage()
		this.element.classList.add('loaded-instant')
	}

	disconnect() {
		observer.unobserve(this.element)
	}
}
