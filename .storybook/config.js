import React from 'react'
import { configure } from '@storybook/react'
import { addDecorator } from '@storybook/react'
import GlobalStyles from '../client/visual/global'

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module)

addDecorator(storyFn => (
	<>
		<GlobalStyles />
		{storyFn()}
	</>
))
