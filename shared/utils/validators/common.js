export const isLoggedIn = (data, userId, verb) => {
	if(userId) {
		return true;
	}

	throw new Meteor.Error('not-logged-in', `Can't ${verb} something if you're not logged in`);
};
