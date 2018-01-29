export default {
	quest: {
		name: 'Quest',
		fields: {
			completed: {
				label: 'Completed',
				type: 'checkbox',
			}
		}
	},

	objective: {
		name: 'Objective',
		fields: {
			completed: {
				label: 'Completed',
				type: 'checkbox',
			}
		}
	},

	faction: {
		name: 'Faction',
		fields: {
			relationship: {
				label: 'Relationship',
				type: 'number',
				min: -2,
				max: +2,
			}
		}
	},
};
