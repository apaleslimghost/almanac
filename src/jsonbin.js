import getFetch from 'fetch-ponyfill';
import guard from '@quarterto/promise-guard';

const {fetch} = getFetch();

export const read = (remotePath, storePath, defaultValue) => async ({dispatch}) => {
	try {
		const response = await fetch(`https://jsonbin.org/${remotePath}`);
		await guard(() => response.ok);
		const data = await response.json();
		dispatch(storePath, () => data, {noRemote: true});
	} catch(e) {
		dispatch('_error', () => e);
	}
};

export const write = (remotePath, storePath, defaultValue) => async ({subscribe, dispatch, meta = {}}) => {
	try {
		const value = subscribe(storePath, defaultValue);
		if(meta.noRemote) return;
		await fetch(`https://jsonbin.org/${remotePath}`, {
			method: 'POST',
			headers: {
				authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFDQkplSllqcEkybCIsInBhdGgiOiJhbG1hbmFjIiwiaWF0IjoxNDkwNjUwOTYxLCJleHAiOjQ2NDY0MTA5NjF9.-WKZQhsM5tvj6q7raPy8jtV-clyaLcyhg8HXmASvdD8'
			},
			body: JSON.stringify(value)
		});
	} catch(e) {
		dispatch('_error', () => e);
	}
};

export default (...args) => connect => [read, write].map(e => e(...args)).map(e => connect(e));
