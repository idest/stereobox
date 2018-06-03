export default function EventBus() {
  const eventCallbacksPairs = [];

  this.subscribe = function(eventType, callback) {
    const eventCallbacksPair = findEventCallbacksPair(eventType);
    if (eventCallbacksPair) {
      eventCallbacksPair.callbacks.push(callback);
    } else {
      eventCallbacksPairs.push(new EventCallbacksPair(eventType, callback));
    }
  };

  this.post = function(eventType, argument) {
    const eventCallbacksPair = findEventCallbacksPair(eventType);
    if (!eventCallbacksPair) {
      console.error('No suscribers for event ' + eventType);
      return;
    }
    eventCallbacksPair.callbacks.forEach(callback => callback(argument));
  };

  function findEventCallbacksPair(eventType) {
    return eventCallbacksPairs.find(
      eventCallbacksPair => eventCallbacksPair.eventType === eventType
    );
  }

  function EventCallbacksPair(eventType, callback) {
    this.eventType = eventType;
    this.callbacks = [callback];
  }
}
