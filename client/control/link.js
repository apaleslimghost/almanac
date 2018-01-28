import React from 'react';
import {go} from '../../router';
import preventingDefault from '../../preventing-default';

export default ({href, ...props}) =>
	<a href={href} onClick={preventingDefault(() => go(href))} {...props} />
