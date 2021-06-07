class ChangesQueue
   def self.exchange
      @exchange ||= channel.topic('changes')
   end

   def self.channel
      @channel ||= connection.create_channel
   end

   def self.connection
      @connection ||= Bunny.new.tap do |c|
         c.start
      end
   end

   def self.queue
      @queue ||= channel.queue('', exclusive: true)
   end

   def self.broadcast(object)
      exchange.publish(
         object.to_broadcast,
         routing_key: object.routing_key
      )
   end

   def self.subscribe(routing_key)
      queue.bind(
         exchange,
         routing_key: routing_key
      )

      queue.subscribe do |delivery_info, _properties, body|
         message = JSON.parse body
         yield message['type'].constantize.find(message['id'])
      end
   end
end
