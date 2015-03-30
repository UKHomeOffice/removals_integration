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


**Test Automation - Background**

The purpose of the automation framework for Removals Integration is so
that tests can be run following any development changes to the core code
to the Removals Integration. It acts as regression activity to ensure no
errors have been introduced following a change in code. Its purpose
essentially is to make sure code that was previously working **still**
works.

The automated tests populates the Removals Integration API with test
data as defined by the test analysts within the automated test script (a
behat \*.feature file). The API then processes the data and passes to
the database and onto the website. The automated test then verifies that
the data displayed on the website is the same as the data that was input
at the start of the test

**JSON API Database Removals Integration website**

The automated tests can be configured to include as much or as little
test data as required (by populating the table within the script), this
decision is to be determined by the Test Analyst on the project .

In order to run the automated tests, the following pre requisites need
to be in place (Behat installation, local web server, MySQL). Details of
installation can be found in the sections below

**NOTE: The automation framework has been developed to work on the alpha
delivery of Removals Integration. Once go ahead is received to move into
beta, the framework and automated tests will require further development
to test the new functionality.**

**Download Master branch from GitHub**

1.  Install behat in the following location on computer. Details
    available
    [here](http://lin-clark.com/blog/2013/11/26/quickstart-testing-with-behat-mink-selenium/)

    **C:\\GIT Projects\\removals\_integration\\express\\automation**

2.  Copy **Removals Integration** master branch of the project into the
    same location

    **git checkout master**

    **git pull**

**Database preparation**

1.  Start MySQL console and use the **dt\_removal\_test** database

2.  Run the query **select name, current\_beds\_male male,
    current\_beds\_female female, current\_beds\_ooc ooc, updatedAt from
    centres;**

3.  The query will enable the tester to establish that the API has
    updated the DB correctly

**Start the Removals Integration**

1.  Open a command prompt and navigate to

    **C:\\GIT Projects\\removals\_integration\\express\\removals**

2.  Run the command **node bin\\www** to start the Removals Integration
    server

3.  Open a browser window and navigate to the Removals Integration
    website (local copy) located at
    [**http://localhost/dashboard**](http://localhost/dashboard)
    **(**for test purposes use port 80)

**Run the test**

1.  Open a command prompt and navigate to

    **C:\\GIT Projects\\removals\_integration\\express\\automation**

2.  Run the command **behat**




**JSON Verification - Background**

As part of the Removals Integration development process the team
developed a **schema** to test and verify the data we expect to receive
(in the form of JSON files from the third parties) is in the correct
format. The schema can be shared with the third parties and as long as
they produce and send a JSON file that conforms to the schema then the
**Removal Integration** API will be able to process it

**How to verify Removals Integration JSON files**


1. Create the following folder **C:\\GIT Projects\\removals\_integration\\express\\automation** 

2. Copy **Removals Integration** master branch of the project into the same folder

    **git checkout master**

    **git pull**

3.  Navigate to **C:\\GIT
    Projects\\removals\_integration\\express\\automation\\features\\schema**

4.  Using a text editor (e.g. notepad) open the file labelled
    **sample\_input.schema**

5.  Inside the Select All the text and copy into the clipboard

6.  Navigate to the following website
    <http://json-schema-validator.herokuapp.com/>

7.  Paste the text from your clipboard into the section labelled
    **Schema**

8.  In the section labelled Data enter the JSON file that you propose to
    send to the **Removal Integration** API

9.  Select the button labelled Validate. In the right side of the screen
    in the section labelled **Validation results** you will expect to
    see Success (if not, the online tool will indicate if the JSON is
    invalid with suggestions why the data may be incorrect)

10.  NOTE: a sample JSON input file (see **sample\_input.json** located
    in the same folder as the schema file) is provided to assist the
    third party/tester
