import {Mongo} from 'meteor/mongo';

//TODO nest quests instead of quests → objectives
export const Objectives = new Mongo.Collection('objectives');
export const Quests = new Mongo.Collection('quests');
