import React from 'react'
import { Bleed } from '../visual/grid'
import Grid from '../visual/grid'
import { List } from '../visual/primitives'

const Bar = Bleed.extend`
	background: #e0d8d2;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	margin-top: -1rem;
`

export default ({ children }) => <Bar>
	<Grid>
		<List>
			{children}
		</List>
	</Grid>
</Bar>