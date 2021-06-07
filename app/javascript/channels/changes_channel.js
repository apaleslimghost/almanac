import consumer from "./consumer"

const [, campaignId] = location.pathname.match(/^\/campaigns\/([^\/]+)/) || []

console.log(campaignId)

if(campaignId) {
  consumer.subscriptions.create({
    channel: "ChangesChannel",
    campaign: campaignId
  }, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log('connected', arguments)
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    received(data) {
      console.log(data)
      // Called when there's incoming data on the websocket for this channel
    }
  })
}
