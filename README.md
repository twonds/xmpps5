== Hacking s5 to be remote controlled and shared via XMPP and Strophe.js ==

I was asked to give talks at two conferences recently. One talk was for
POSSCON (http://posscon.org) and the other was for CREATESouth (http://createsouth.org). 

The POSSCON talk was about XMPP and I like to show stuff off when doing talks. 
First, I had a rock, paper, scissors XMPP based game to talk about but I 
thought it may end up not being interactive enough. I then thought it would be 
cooler to embed an XMPP MUC chat room and also control the presentation via 
XMPP. With that idea I created this hack using Strophe.js and s5 presentation 
software. 

People could follow the presentation and chat from a URL (http://thetofu.com/xmpp/). I then controlled the presentation from my iPhone for added effect.

WARNING: Network latency can cause problems with the controls and lead to 
embarassing results. :) 

WARNING: This is a good simple example and hack but not a complete project. 

NOTE: These were two great conferences and I highly recommend them.

== How did I do it? == 

I downloaded s5 and put together the presentation normally. 

Since Speeqe (http://speeqe.com) is XMPP MUC and Strophe.js I used it to embed 
an XMPP MUC into the presentation. Just added an iframe next to the presentation
content. You can see that in index.html.

I then created a quick client to contol the presentation via pubsub. The 
client is xmpp.js and has three parts.

The first part is establishing an XMPP connection. In Strophe.js its easy.

I just added the following at the end of xmpp.js:

<pre>

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE); // Create connection
    connection.rawInput = rawInput; // Add some debugging callbacks
    connection.rawOutput = rawOutput;

    // Make the anonymous connection and add onConnect callback for when 
    // we have established the connection.
    connection.connect(XMPP_SERVER,
		       null,
		       onConnect);
  
});

</pre>


The second part is basic debugging callbacks and you can see them in the xmpp.js
code.

The last part is making the subscription and handling an event callback to move
the presentation page to the correct one. 

I added the following code when a connection was established to send presence 
and send a subscription.

<pre>

	log('Strophe is connected.');
	connection.send($pres());
	connection.pubsub.subscribe(connection.jid,
				    PUBSUB_SERVER,
				    PUBSUB_NODE,
				    [],
				    onEvent,
				    onSubscribe
				    );
</pre>

onSubscribe just logs an message when a subscription is successful. 

onEvent handles the pubsub events and uses s5 code to move the page to the
correct place.

You can see the entire function in xmpp.js but the important parts are the
following:

<pre>

    // Grab pubsub entry page number
    var event = $(message).children('event')
      .children('items')
      .children('item')
      .children('entry').text();


    go_page = parseInt(event); // The event should be the current page #

    goTo(go_page); // User s5 goTo to hop to the correct page.

</pre>

That is all I had to do to get the client part working. I think created a basic
control page in javascript. I went to this page and logged in from my iPhone.
control.html and control.js are the code for controlling the presentation.

When you click the forward, back, or home button you will publish the page 
number representing those pages to the PubSub node.

