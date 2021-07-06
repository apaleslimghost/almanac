import { Controller } from 'stimulus'
import consumer from '../consumer'

export default class Dashboard extends Controller {
	static values = { slug: String }

   connect() {
      this.subscription = consumer.subscriptions.create({
         channel: "DashboardChannel",
			slug: this.slugValue
      }, {
         received: console.log
      })
   }

   disconnect() {
      this.subscription.unsubscribe()
   }
}
