import React from 'react';
import App from './app';

const Layout = ({children}) => <App>
	<nav>toolbar lol</nav>
	{children}
</App>;

export default Layout;
