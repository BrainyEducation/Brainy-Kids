[![CircleCI](https://circleci.com/gh/jvt/Brainy-Kids.svg?style=svg)](https://circleci.com/gh/jvt/Brainy-Kids)

#  Brainy Kids Administration panel and Analytics Platform

This is the codebase for the Brainy Kids backend and administration panel. This repository also includes the code required for ingesting analytics from the various applications. Keep in mind that this application has to be running only on a single computer/server. All other teachers, administrators, etc will access it through the web.

## Pre-requisites

1.  Make sure you have Node.js installed (Make sure `node --version` prints out a version number)
2.  Make sure you have the latest version of MongoDB set up either locally or point it to a remote server (see "Getting Started")
3.  If you want to install this for actual use, make sure you install it on a server that can be accessed by any computer that wants to use it. This usually means the server should have a static IP address and correct port forwarding/firewall configuration.
4. You must have npm installed. Run `npm --version` in your terminal and expect to see a version number printed out

## Getting started

1.  Clone this repository (`git clone git@github.com:jvt/Brainy-Kidz.git`)
2.  Open the repository (`cd Brainy-Kidz`)
3.  Install the dependencies (`npm install`)
4.  Duplicate `.env.example` and rename it to `.env`
5.  Open the `.env` file and add a JWT_SECRET. It should be a random series of letters / numbers. This string is used to encrypt all the tokens for access to the site.
6.  Also set `MONGODB_URI` to either point to your local machine or wherever your MongoDB is.
7.  Make sure your instance of MongoDB is running
8.  Start the application with `npm run dev`
9.  Navigate your browser to `localhost:3000`

## Common issues

1. The program will exit on startup if it is unable to find an instance of MongoDB running at the set URI. Be sure that the instance of MongoDB is running before you start the program.
2. If the program crashes on startup with error messages mentioning the word "dependicies" run `npm install` in the root directory of the project again.
3. MongoDB version of > 2.4 is required – if you see issues related to MongoDB on startup check your version and update

## Get Started 
Review the Information on the Wiki to get an overview of setting up external Apps to use the DAP
[https://github.com/BrainyEducation/Brainy-Kids/wiki](https://github.com/BrainyEducation/Brainy-Kids/wiki)

## Examples 
A small set of examples can be seen in `examples/` 
– Login using a Student ID Number receiving a JWT to use for authenticated API endpoints
– Create Program
– Create Focus Item
– Create Analytic data for individual students against Focus items
– Get Student/Program Data

## Release Notes November 30th: v1.0.0
### New Features
1. Various REST API endpoints is available now to access and manipulate information for student, focus items, program, analytics. 
2. You can access information for all students, focus items, programs, and analytics in addition to create, retrieve, update, and delete information for a single student, focus item, program, and analytic. 
3. Our application provides secured access to all information. Authentication of users is done through the use of Json Web Token (JWT)
4. If you are a teacher, there is a web interface designed specifically for you. It facilitates you in managing your students' accounts and monitoring their learning progresses.
5. Concerned about FERPA regulations for sensitive information regarding your students, Our application is not storing any of the identifiable information at any time.
6. You can upload data on students, focues items, program, analytics from csv files.
7. In addition, anlytics to assess learning performances of each and all of your students is supported, and you can easily access these analytics in your web portal.

### Bug Fixes  
[None]

### Known Bugs
[None]
## Developer notes

### Viewing the Redux store

1.  From any page on the website, press `CTRL + h` (Configured in `/frontend/components/DevTools.js`) to open the Redux DevTools panel
2.  From here, you can view the global state of the application.
3.  To move the window around, press `CTRL + w`

### Running API Tests

1.  From a terminal window, run `npm run test` or `npm test` (both do the same thing)
2.  Let the tests run, it will generate a coverage window in the terminal once all the tests have completed running

### Continuous Integration

CI is provided by CircleCI and runs on every pull request to ensure tests pass. Merging is disabled until tests pass.
