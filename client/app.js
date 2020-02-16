import React, { Component } from 'react'
import useRoutes from 'boulevard-react'
import { Error } from './utils/error'
import GlobalStyles from './visual/global'

class RenderError extends Component {
	state = { error: null }

	static getDerivedStateFromError(error) {
		return { error }
	}

	render() {
		if (this.state.error) {
			return <Error error={this.state.error} />
		}

		return this.props.children
	}
}

export default function App({ routes }) {
	const { children } = useRoutes(routes)
	return (
		<RenderError>
			<GlobalStyles />
			{children}
		</RenderError>
	)
}
