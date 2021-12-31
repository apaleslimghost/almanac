import htm from 'htm/mini'
import { h } from 'jsx-dom'

const html = htm.bind(h)

export default class CardPlugin {
	// TODO button to clear card selection

	static toolbox = {
		title: 'Card',
		icon: '<i class="fa fa-id-card-o"></i>'
	}

	constructor({ data }) {
		this.data = data
	}

	render() {
		return html`
			<div
				data-controller="card-render"
				...${
					this.data.path
						? { 'data-card-render-path-value': this.data.path }
						: {}
					}
			>
				<input data-card-render-target="search" data-action="input->card-render#search" type="search" />
				<ul data-card-render-target="results"></ul>
				<div data-card-render-target="card" data-mutation-free="true"></div>
			</div>
		`
	}

	save(component) {
		return {
			path: component.dataset.cardRenderPathValue
		}
	}
}
