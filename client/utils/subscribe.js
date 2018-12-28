import {Meteor} from 'meteor/meteor'

export default (...subs) =>
	subs.map(name => Meteor.subscribe(name)).every(sub => sub.ready())
