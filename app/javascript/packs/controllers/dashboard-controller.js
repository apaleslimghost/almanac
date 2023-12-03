import { Controller } from 'stimulus'
import Turbolinks from 'turbolinks'
import consumer from '../consumer'

export default class Dashboard extends Controller {
	static values = { slug: String }

	connect() {
		const presenting = new URLSearchParams(location.search).has('present')

		this.subscription = consumer.subscriptions.create({
			channel: "DashboardChannel",
			slug: this.slugValue
		}, {
			received: ({ campaign, location }) => {
				Turbolinks.visit(
					`/campaigns/${campaign}/dashboard/${location}${presenting ? '?present=true' : ''}`,
					{ action: 'replace' }
				)
			}
		})
	}

	disconnect() {
		this.subscription.unsubscribe()
	}
}
