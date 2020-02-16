import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/quarterto:hooks'
import React from 'react'
import { Forbidden } from 'http-errors'
import { toast } from 'react-toastify'
import { navigate as go } from 'use-history'
import { useCampaignData } from '../data/campaign'
import { addMember } from '../../shared/methods'
import { CampaignSplash, HeroSubtitle } from '../visual/splash'
import Login from './login'
import { SignupForm } from './get-started'

export default ({ campaignId, secret }) => {
	const { campaign, ready } = useCampaignData()

	if (campaignId && ready && secret !== campaign.inviteSecret) {
		throw new Forbidden('Incorrect or expired campaign invite link')
	}

	const enrolling = useTracker(() => {
		const user = Meteor.user()
		if (user) {
			const yours = campaign.owner === user._id
			const member = campaign.member.includes(user._id)

			// redirect early so adding oneself to the campaign doesn't rerender
			// this page and cause confusing double messages. it's not like a
			// location.href, the rest of the function will still run
			go(`/${campaign._id}`)

			if (yours || member) {
				toast.info(
					yours
						? `That's your campaign!`
						: `You're already a member of ${campaign.title}`,
				)
			} else {
				toast.success(`Welcome to ${campaign.title}!`)

				// TODO i dunno bro sounds race conditioney
				addMember(campaign, user, secret)
			}

			return false
		}

		return true
	})

	return enrolling ? (
		<>
			<CampaignSplash small noBlurb>
				<HeroSubtitle>Sign up or log in to join</HeroSubtitle>
			</CampaignSplash>

			<SignupForm secret={secret} />

			<Login
				onLogin={() => {
					/* Logging in will rerender this page and do the usual redirect */
				}}
			/>
		</>
	) : (
		'Redirecting...'
	)
}
