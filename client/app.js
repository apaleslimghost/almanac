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

const App = ({ routes }) => {
	const { children } = useRoutes(routes)
	return children
}

export default props => (
	<RenderError>
		<GlobalStyles />
		<App {...props} />
	</RenderError>
)
