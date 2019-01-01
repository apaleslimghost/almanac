export default {
	log: {
		name: 'Log',
		fields: {
			completed: {
				label: 'Date',
				type: 'text'
			}
		}
	},

	quest: {
		name: 'Quest',
		fields: {
			completed: {
				label: 'Completed',
				type: 'checkbox',
				format: val => (val ? '✔︎' : '✘')
			}
		}
	},

	objective: {
		name: 'Objective',
		fields: {
			completed: {
				label: 'Completed',
				type: 'checkbox',
				format: val => (val ? '✔︎' : '✘')
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
				max: +2
			}
		}
	}
}
