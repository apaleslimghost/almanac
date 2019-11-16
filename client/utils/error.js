import React from 'react'

export const Error = ({ error }) => (
	<div>
		<pre>{error.message}</pre>
		<pre>{error.componentStack}</pre>
		<small>
			<pre>{error.stack}</pre>
		</small>
	</div>
)
