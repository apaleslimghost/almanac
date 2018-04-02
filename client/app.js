import React from 'react';
import {compose, withState} from 'recompose';
import withRouter from './utils/router';
import withCatch from './utils/catch';
import displayError from './utils/error';

const errorState = withState('error', 'setError', null);

const mainCatch = withCatch((error, info, props) => {
	props.setError(Object.assign(error, info));
});

const connectApp = compose(
	withRouter,
	errorState,
	mainCatch,
	displayError
);

const App = connectApp(({children}) => <div>
	{children}
</div>);

export default App;
