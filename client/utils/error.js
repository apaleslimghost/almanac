import React from 'react';
import {branch, renderComponent} from 'recompact';

export const Error = ({error}) => <div>
	<pre>{error.message}</pre>
	<pre>{error.componentStack}</pre>
	<small>
		<pre>{error.stack}</pre>
	</small>
</div>;

const displayError = branch(
	({error}) => !!error,
	renderComponent(Error)
);

export default displayError;
