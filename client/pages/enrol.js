import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import { compose, withProps, withHandlers } from 'recompact'
import { Forbidden } from 'http-errors'
import { toast } from 'react-toastify'
import { go } from '../utils/router'
import { withCampaignData } from '../data/campaign'
import { createAccountAndJoin, addMember } from '../../shared/methods'
import { CampaignSplash, HeroSubtitle } from '../visual/splash'
import Login from './login'
import { SignupForm } from './get-started'

const checkCampaignSecret = withProps(
	({ campaign, ready, campaignId, secret }) => {
		if (campaignId && ready && secret !== campaign.inviteSecret) {
			throw new Forbidden('Incorrect or expired campaign invite link')
		}
	}
)

const connectEnrol = compose(
	withCampaignData,
	checkCampaignSecret,
	withHandlers({
		addLoggedInUser: ({ campaign, secret }) => user => {
			const yours = campaign.owner === user._id
			const member = campaign.member.includes(user._id)

			// Redirect early so adding oneself to the campaign doesn't rerender
			// this page and cause confusing double messages. it's not like a
			// location.href, the rest of the function will still run
			go(`/${campaign._id}`)

			if (yours || member) {
				toast.info(
					yours
						? `That's your campaign!`
						: `You're already a member of ${campaign.title}`
				)
			} else {
				toast.success(`Welcome to ${campaign.title}!`)

				addMember(campaign, user, secret)
			}
		}
	}),
	withTracker(({ addLoggedInUser }) => {
		const user = Meteor.user()

		if (user) {
			addLoggedInUser(user)
			return { enrolling: false }
		}

		return { enrolling: true }
	})
)

export default connectEnrol(
	({ campaign, enrolling, secret }) =>
		enrolling ? (
			<>
				<CampaignSplash small noBlurb>
					<HeroSubtitle>Sign up or log in to join</HeroSubtitle>
				</CampaignSplash>

				<SignupForm
					createAccountMethod={user =>
						createAccountAndJoin(user, campaign, secret)
					}
				/>

				<Login
					onLogin={() => {
						/* Logging in will rerender this page and do the usual redirect */
					}}
				/>
			</>
		) : (
				'Redirecting...'
			)
)
