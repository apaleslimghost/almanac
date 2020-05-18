import React from 'react'
import Markdown from 'react-markdown'
import behead from 'remark-behead'
import styled from 'styled-components'

export default ({ excerpt, ...props }) => (
	<Markdown
		plugins={[[behead, { depth: 1 }]]}
		renderers={{
			root: ({ children }) => (
				<>
					{excerpt
						? children.find(child => child.type === 'p') || children[0]
						: children}
				</>
			),
			blockquote: styled.blockquote`
				border-left: 3px solid rgba(0, 0, 0, 20%);
				margin: 0;
				padding: 0em 1em;
				overflow: hidden; // prevent paragraph margins collapsing
				font-size: 1.1em;
				font-family: 'Libre Baskerville', serif;
			`,
		}}
		{...props}
	/>
)
