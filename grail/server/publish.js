import {Meteor} from 'meteor/meteor';

const publish = (publications, path = []) => Object.keys(publications).forEach(key => {
	const nextPath = path.concat(key);
	if(typeof publications[key] === 'function') {
		Meteor.publish(nextPath.join('.'), publications[key]);
	} else {
		publish(publications[key], nextPath);
	}
});

export default publish;
