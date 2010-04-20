var connection = null;
var ignore = true;
var current_page = 0;

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data)
{
    log('RECV: ' + data);
}

function rawOutput(data)
{
    log('SENT: ' + data);
}

function onEvent(message) {
  // Only handle messages from the PubSub Server. 
  if ($(message).attr('from').match(/^PUBSUB_SERVER/)) {
    // Grab pubsub entry page number
    var event = $(message).children('event')
      .children('items')
      .children('item')
      .children('entry').text();

    if (ignore) {
      //short circuit first event
      ignore = false;
      return true;
    }

    go_page = parseInt(event); // The event should be the current page #
    if (go_page >= 0) { // Only handle page # events
      // I would have liked to use goTo but the function would cause and odd
      // jump to the home page then the correct page. So I added a bit off 
      // logic to make it look good when transitioning pages.
      if (current_page+1 == go_page) {
	go(1);
      } else if (current_page-1 == go_page) {
	go(-1);
      } else {
	goTo(go_page);
      }
      current_page = go_page;
    }
    // Return true or we loose this callback.
    return true;
  }
}

function onSubscribe(sub) {
  // Log when we are subscribed.
  log("Subscribed");
  return true;
}

function onConnect(status)
{
  // This function is taken from the basic example and 
  // when we are connected we send presence and subscribe to
  // the presentation node. 
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	connection.send($pres());
	connection.pubsub.subscribe(connection.jid,
				    PUBSUB_SERVER,
				    PUBSUB_NODE,
				    [],
				    onEvent,
				    onSubscribe
				    );
    }
    return true;
}

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    

    connection.connect(XMPP_SERVER,
		       null,
		       onConnect);
  

});