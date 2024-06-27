import { Controller } from '@hotwired/stimulus'
import consumer from '../consumer'

export default class LiveRender extends Controller {
   static values = { type: String, id: Number }

   connect() {
      this.subscription = consumer.subscriptions.create({
         channel: "ChangesChannel",
         type: this.typeValue,
         id: this.idValue
      }, {
         received: data => {
            this.element.outerHTML = data.html
         }
      })
   }

   disconnect() {
      this.subscription.unsubscribe()
   }
}
