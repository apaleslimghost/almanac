import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {withCampaignData} from '../data/campaign';
import {compose, withProps} from 'recompact';
import {Forbidden} from 'http-errors';
import {go} from '../utils/router';
import {toast} from 'react-toastify';
import {addMember} from '../../shared/methods';
import {CampaignSplash, HeroSubtitle} from '../visual/splash';

const checkCampaignSecret = withProps(({campaign, ready, campaignId, secret}) => {
	if(campaignId && ready && secret !== campaign.inviteSecret) {
		throw new Forbidden('Incorrect or expired campaign invite link');
	}
});

const connectEnrol = compose(
	withCampaignData,
	checkCampaignSecret,
	withTracker(({campaign}) => {
		const user = Meteor.user();

		if(user) {
			const yours = campaign.owner === user._id;
			const member = campaign.member.includes(user._id);

			// redirect early so adding oneself to the campaign doesn't rerender
			// this page and cause confusing double messages. it's not like a
			// location.href, the rest of the function will still run
			go(`/${campaign._id}`);

			if(yours || member) {
				toast.info(
					yours
						? `That's your campaign!`
						: `You're already a member of ${campaign.title}`
				);
			} else {
				toast.success(
					`Welcome to ${campaign.title}!`
				);

				addMember(campaign, user);
			}

			return {enrolling: false};
		}

		return {enrolling: true};
	}),
);

export default connectEnrol(({campaign, enrolling}) => enrolling ? <>
	<CampaignSplash small noBlurb>
		<HeroSubtitle>Sign up or log in to join</HeroSubtitle>
	</CampaignSplash>
</> : 'Redirecting...');
