import React from 'react'
import Markdown from 'react-markdown'
import { withProps } from 'recompact'
import behead from 'remark-behead'

export default withProps(({ excerpt }) => ({
	plugins: [[behead, { depth: 1 }]],
	renderers: {
		root: ({ children }) => (
			<>
				{excerpt
					? children.find(child => child.type === 'p') || children[0]
					: children}
			</>
		),
	},
}))(Markdown)
