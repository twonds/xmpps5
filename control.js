var BOSH_SERVICE = '/xmpp-httpbind'
var connection = null;
var current_page = 0;

function log(msg) 
{
    $('#log').prepend('<div></div>').prepend(document.createTextNode(msg));
}

function debug(msg) 
{
    $('#debug').append('<div></div>').append(document.createTextNode(msg));
}

function rawInput(data)
{
    debug('RECV: ' + data);
}

function rawOutput(data)
{
    debug('SENT: ' + data);
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
	$('#log').empty();
	$('#debug').empty();
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	connection.send($pres());
    }
}



$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';

	    connection.connect($('#jid').get(0).value,
			       $('#pass').get(0).value,
			       onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });

    $('#back').bind('click', function () {
	log("back");
	connection.pubsub.publish(connection.jid,
				  "pubsub.thetofu.com",
				  "/home/thetofu.com/tofu",
				  [(current_page-1).toString()],
				  log
				  );
	current_page = current_page - 1;
      });

    $('#home').bind('click', function () {
	log("home");
	connection.pubsub.publish(connection.jid,
				  "pubsub.thetofu.com",
				  "/home/thetofu.com/tofu",
				  ["0"],
				  log
				  );
	current_page = 0;
      });

    $('#forward').bind('click', function () {
	log("forward");
	connection.pubsub.publish(connection.jid,
				  "pubsub.thetofu.com",
				  "/home/thetofu.com/tofu",
				  [(current_page + 1).toString()],
				  log
				  );
	current_page = current_page + 1;
      });

});