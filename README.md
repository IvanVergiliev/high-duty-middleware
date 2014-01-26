high-duty-middleware
====================

This is the server for "Shepherd's run" that coordinates the communication between web clients that act as controllers, and the game instance.

It requires node.js and npm to be installed on the system before-hand.
To install, cd to the main project directory and enter the following commands:
`npm install`
`./node_modules/bower/bin/bower install`.

You should then be able to run the server by typing `node .` in the main directory. It binds to port 3000 for HTTP and WS communication, and on port 3001 for TCP communication.
The mobile client can be open on a (recent) mobile browser by going to `http://IP:3000/`. The UI is tested mainly on iPhone 5+, but the functionality should be working on any recent version of Chrome or Safari.
