import React from 'react';
import OdreianDate from 'odreian-date';
import _ from 'lodash';
import {H1, H2} from './heading';
import {Objectives, Quests} from '../../shared/collections';
import {createContainer} from 'meteor/react-meteor-data';

const CompletedObjectives = createContainer(
	() => ({
		objectives: Objectives.find(
			{completed: true},
			{sort: [['completedDate', 'desc']]}
		).fetch(),
		questsById: _.groupBy(Quests.find().fetch(), '_id'),
	}),
	({objectives, questsById}) => (
		<div>
			<H1>Completed</H1>
			<ul>
				{objectives.map(objective => (
					<li key={objective._id}>
						<b>{questsById[objective.quest].name}</b> {objective.text}
						<div>
							✓{' '}
							<time>
								{new OdreianDate(objective.completedDate).llll}
							</time>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
);

export {CompletedObjectives as display, CompletedObjectives as control};
