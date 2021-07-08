import { Controller } from 'stimulus'
import Turbolinks from 'turbolinks'
import consumer from '../consumer'

export default class Dashboard extends Controller {
	static values = { slug: String }

	connect() {
		this.subscription = consumer.subscriptions.create({
			channel: "DashboardChannel",
			slug: this.slugValue
		}, {
			received: ({ campaign, location }) => {
				Turbolinks.visit(
					`/campaigns/${campaign}/dashboard/${location}`,
					{ action: 'replace' }
				)
			}
		})
	}

	disconnect() {
		this.subscription.unsubscribe()
	}
}
