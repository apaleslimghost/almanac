import React from 'react'
import { render } from 'react-dom'
import Modal from 'react-modal'

import { errorTest } from '../shared/methods'
import Layout, { Basic as BasicLayout } from './pages/layout'
import App from './app'

import 'formdata-polyfill'
import './visual/global'

import Dashboard from './pages/dashboard'
import Control from './pages/control'
import Home from './pages/home'
import Login, { loggedInRedirect } from './pages/login'
import GetStarted from './pages/get-started'
import Campaign from './pages/campaign'
import CampaignSettings from './pages/campaign-settings'
import CampaignPlayers from './pages/campaign-players'
import NewCampaign from './pages/new-campaign'
import Verify from './pages/verify'
import Enrol from './pages/enrol'
import Card from './pages/card'
import EditCard from './pages/edit-card'

const root = document.createElement('div')
root.id = 'react-root'
document.body.appendChild(root)

Modal.setAppElement('#' + root.id)

render(
	<App
		routes={{
			'/:campaignId/dashboard'({ campaignId }) {
				return (
					<BasicLayout campaignId={campaignId}>
						<Dashboard />
					</BasicLayout>
				)
			},

			'/:campaignId/dashboard-control'({ campaignId }) {
				return (
					<Layout campaignId={campaignId}>
						<Control />
					</Layout>
				)
			},

			'/:campaignId/join/:secret'({ campaignId, secret }) {
				return (
					<Layout campaignId={campaignId} secret={secret}>
						<Enrol secret={secret} />
					</Layout>
				)
			},

			'/:campaignId/settings'({ campaignId }) {
				return (
					<Layout campaignId={campaignId}>
						<CampaignSettings />
					</Layout>
				)
			},

			'/:campaignId/players'({ campaignId }) {
				return (
					<Layout campaignId={campaignId}>
						<CampaignPlayers />
					</Layout>
				)
			},

			'/:campaignId/new'({ campaignId }) {
				return (
					<Layout campaignId={campaignId}>
						<EditCard />
					</Layout>
				)
			},

			'/:campaignId/:cardId'({ campaignId, cardId }) {
				if (!cardId) return false

				return (
					<Layout campaignId={campaignId}>
						<Card cardId={cardId} />
					</Layout>
				)
			},

			'/:campaignId/:cardId/edit'({ campaignId, cardId }) {
				if (!cardId) return false

				return (
					<Layout campaignId={campaignId}>
						<EditCard cardId={cardId} />
					</Layout>
				)
			},

			'/:campaignId'({ campaignId }) {
				if (!campaignId) return false

				return (
					<Layout campaignId={campaignId}>
						<Campaign />
					</Layout>
				)
			},

			'/new-campaign'() {
				return (
					<Layout>
						<NewCampaign />
					</Layout>
				)
			},

			'/get-started'(params, { title }) {
				return (
					loggedInRedirect() || (
						<Layout>
							<GetStarted title={title} />
						</Layout>
					)
				)
			},

			'/login'() {
				return (
					loggedInRedirect() || (
						<Layout>
							<Login />
						</Layout>
					)
				)
			},

			'/verify/:token'({ token }) {
				return (
					loggedInRedirect() || (
						<Layout>
							<Verify token={token} />
						</Layout>
					)
				)
			},

			'/debug'() {
				return (
					<Layout>
						<button type='button' onClick={() => errorTest()}>
							throw a meteor.call error
						</button>
					</Layout>
				)
			},

			'/'() {
				return (
					<Layout>
						<Home />
					</Layout>
				)
			},
		}}
	/>,
	root,
)
