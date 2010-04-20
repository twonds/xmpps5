var BOSH_SERVICE = '/xmpp-httpbind'
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
  if ($(message).attr('from').match(/^pubsub.thetofu.com/)) {
    var event = $(message).children('event')
      .children('items')
      .children('item')
      .children('entry').text();
    if (ignore) {
      //short circuit first event
      ignore = false;
      return true;
    }
    go_page = parseInt(event);
    if (go_page >= 0) {
      log(current_page);
      log(go_page);
      if (current_page+1 == go_page) {
	go(1);
      } else if (current_page-1 == go_page) {
	go(-1);
      } else {
	goTo(go_page);
      }
      current_page = go_page;
    }
    return true;
  }
}

function onSubscribe(sub) {
  log("Subscribed");
  return true;
}

function onConnect(status)
{
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
				    "pubsub.thetofu.com", 
				    "/home/thetofu.com/tofu", 
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

    

    connection.connect("speeqe.com",
		       null,
		       onConnect);
  

});