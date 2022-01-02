import { Node, mergeAttributes } from '@tiptap/core'
import React from 'jsx-dom'

export default Node.create({
	name: 'card',
	group: 'block',
	atom: true,
	// TODO button to clear card selection

	// static toolbox = {
	// 	title: 'Card',
	// 	icon: '<i class="fa fa-id-card-o"></i>'
	// }

	addAttributes() {
		return {
			path: {
				default: null
			}
		}
	},

	addNodeView() {
		console.log('hello')
		return ({ node }) => {
			const dom = <div
				data-controller="card-render"
				{...node.attrs.path
					? { 'data-card-render-path-value': node.attrs.path }
					: {}
				}
			>
				<input data-card-render-target="search" data-action="input->card-render#search" type="search" />
				<ul data-card-render-target="results"></ul>
				<div data-card-render-target="card" data-mutation-free="true"></div>
			</div>
			console.log(node, dom)

			dom.lol = 'lol hello'

			return { dom }
		}
	},

	parseHTML() {
		return [
		  { tag: 'card-render' },
		]
	 },

	 renderHTML({ HTMLAttributes }) {
		return ['card-render', HTMLAttributes]
	 },
})
