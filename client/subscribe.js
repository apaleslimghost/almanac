import {Meteor} from 'meteor/meteor'

export default (...subs) => subs.map(Meteor.subscribe).every(sub => sub.ready());
