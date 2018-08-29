import React from 'react';
import {renderComponent, branch} from 'recompact';

export const Loading = () => <div>Loading...</div>;

export default branch(
	({ready}) => !ready,
	renderComponent(Loading)
);
