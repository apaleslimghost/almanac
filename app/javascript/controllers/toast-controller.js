import { Controller } from "@hotwired/stimulus";
import toast from 'sonner-js';

toast.config({
	toastOptions: {
    position: 'top-right',
    closeButton: true,
    richColors: true,
	},
	visibleToasts: Infinity
});

export default class Toast extends Controller {
  static targets = ['content']
  static values = { type: String }

	connect() {
		switch(this.typeValue) {
			case 'error':
				toast.error(this.element.innerHTML, {
					duration: 0
				})
				break;
			case 'alert':
				toast.warning(this.element.innerHTML, {
					duration: 0
				})
				break;
			case 'success':
				toast.success(this.element.innerHTML, {
					duration: 10000
				})
				break;
			default:
				toast(this.element.innerHTML, {
					duration: 10000
				})
		}

		this.element.remove()
	}
}
