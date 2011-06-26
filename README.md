Node Application Reloader
=========

This script run your application and restart it on each files modification. This is useful for small web app
developpement. DO NOT USE in production mode.

Usage
----

    $ node-app-reloader yourscript.js -- yourscript.js

With Express
-----

    $ find . -type f \( -regex ".*\.js" \! -regex "\./public/.*" \)  | node-app-reloader app.js --
