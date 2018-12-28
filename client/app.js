import { compose, withState, withPropsOnChange } from 'recompact'
import withRouter from './utils/router'
import withCatch from './utils/catch'
import displayError from './utils/error'

const errorState = withState('error', 'setError', null)

const mainCatch = withCatch((error, info, props) => {
	props.setError(Object.assign(error, info))
})

const connectApp = compose(
	withRouter,
	errorState,
	mainCatch,
	displayError,
	withPropsOnChange('currentRoute', ({ setError }) => {
		setError(null)
	})
)

const App = connectApp(({ children }) => children)

export default App
