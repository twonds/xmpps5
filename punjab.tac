# punjab tac file
from twisted.web import server, resource, static
from twisted.application import service, internet

from punjab.httpb  import Httpb, HttpbService

root = static.File("./")


#b = resource.IResource(HttpbService(1, use_raw=True))
b = resource.IResource(HttpbService(1))
# You can limit servers with a whitelist. 
# The whitelist is a list of strings to match domain names.
# b.white_list = ['jabber.org', 'thetofu.com']
root.putChild('xmpp-httpbind', b)


site  = server.Site(root)

application = service.Application("punjab")
internet.TCPServer(80, site).setServiceParent(application)

