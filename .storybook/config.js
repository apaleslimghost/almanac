import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'
import GlobalStyles from '../client/visual/global'

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module)

const Wrapper = styled.div`
	margin: 1rem;
`

addDecorator(storyFn => (
	<Wrapper>
		<GlobalStyles />
		{storyFn()}
	</Wrapper>
))
