import { Controller } from '@hotwired/stimulus'
import debounce from 'lodash.debounce'

export default class extends Controller {
  static targets = ['form']

  connect() {
	 this.save = debounce(this.save.bind(this), 500)
  }

  save() {
    this.formTarget.requestSubmit()
  }
}
