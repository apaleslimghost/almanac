import {Meteor} from 'meteor/meteor';
import nest from './nest';

const publish = nest(Meteor.publish);

export default publish;
