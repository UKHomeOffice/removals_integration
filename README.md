Removals Integration
-----

INSTALL node.js SERVER

In a convenient directory run:

\> git clone git@github.com:UKHomeOffice/removals_integration.git

Download and install node.js (if you don't have it) from https://nodejs.org/download/

then

\> cd removals_integration/express/removals

\> npm install

To start the node server:

\> node bin/www --build-data=y

(the --build-data=y part is only required on the first run, or if you need to rebuild the database)

The dashboard will be visible at 

    localhost:3000/dashboard

Post JSON updates to 

    localhost:3000/update-centres

eg

\> curl -d @<filename.json> localhost:3000/update-centres

JSON example at /express/removals/tests/sample_input.json

Post tests available in /express/removals/tests

eg

\> node tests/http_tests0.js

