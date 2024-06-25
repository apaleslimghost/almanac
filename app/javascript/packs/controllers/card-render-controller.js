import { Controller } from '@hotwired/stimulus'
import api from '../lib/api'
import htm from 'htm'
import { h } from 'jsx-dom'
import debounce from 'lodash.debounce'

const html = htm.bind(h)

export default class CardRender extends Controller {
   static values = { path: String }
	static targets = ['search', 'results', 'card']

	connect() {
		console.log(this.element.lol)
		this.search = debounce(this.search.bind(this), 500)
	}

	pathValueChanged() {
		if(this.pathValue) {
			this.cardTarget.hidden = false
			this.searchTarget.hidden = this.resultsTarget.hidden = true
			this.renderCard()
		} else {
			this.cardTarget.hidden = true
			this.searchTarget.hidden = this.resultsTarget.hidden = false
		}
	}

	async renderCard() {
		const { content } = await api(this.pathValue, null, { method: 'GET' })
      this.cardTarget.innerHTML = content
	}

	renderResults(results) {
		this.resultsTarget.innerHTML = ''

		for(const {name, href, description} of results) {
			this.resultsTarget.appendChild(html`
				<a data-action="click->card-render#select" href="${href}">
					${name}
				</a>
			`)
		}
	}

	async search(event) {
		const query = event.target.value
		// TODO unhardcode
		const { items } = await api(`/campaigns/the-broken-crown/cards/search?q=${encodeURIComponent(query)}`, null, {method: 'GET'})

		this.renderResults(items)
	}

	select(event) {
		event.preventDefault()
		this.pathValue = event.target.pathname.replace(/\/campaigns\/([^\/]+)\/[^\/]+\/([^\/]+)/, '/campaigns/$1/cards/$2.json')
	}
}
