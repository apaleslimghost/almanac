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
			received: () => {
				Turbolinks.visit(location.pathname, { action: 'replace' })
			}
		})
	}

	disconnect() {
		this.subscription.unsubscribe()
	}
}
