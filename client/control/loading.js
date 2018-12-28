import React from 'react'
import { renderComponent, branch } from 'recompact'
import styled from 'styled-components'

export const Loading = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&::before {
		content: 'Loading';
		display: block;
		font-size: 1.4em;
	}
`

export const withLoadingComponent = loading => branch(
	({ ready }) => ready === false,
	renderComponent(loading)
)

export default withLoadingComponent(Loading)