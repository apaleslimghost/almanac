class ChangesChannel < ApplicationCable::Channel
  def subscribed
    # TODO this is probably hilariously insecure
    type = params[:type].constantize
    thing = type.find(params[:id])

    stream_for thing, coder: ActiveSupport::JSON do |message|
      Current.user = current_user
      thing = type.find(message["id"])

      transmit({
        html: ApplicationController.render(thing.specific)
      })
    end
  end
end
