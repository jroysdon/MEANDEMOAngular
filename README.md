# MEAN DEMO - ANGULAR
## A demonstration application - JRoysdon (July 2020)

I wrote this through a course in **MEAN** Development. This is the front end (Angular) code. The Back End (Mongo/Express/Node) portion can be found here: https://github.com/jroysdon/MEANDEMOAPI

The live Demo can be found here: http://meandemoforjim.s3-website-us-east-1.amazonaws.com

This code is to show I can work in the **MEAN** full stack: 

* Mongo (and other NoSQL databases), though I also have worked in Relational DBs)/n
* Express (to serve up micro services)
* Angular (the Front End)
* NodeJS (the back end)

I am often asked for examples of my work. The issue is that much of what I've done is behind corporate firewalls and is proprietary and I've used several methodologies and technologies. *I've programmed in over 20 languages in my career, depending on the needs of my clients, working in both waterfall and agile methodologies.*  

The course work was a simple POST and USERbase.

I have added the following capabilities:
- [x] The ability to register and verify the EMAIL address by using *NodeMail* to send an confirmation email. 
- [x] The ability to reset the user's password from the profile
- [x] Request a new password (again, sending a link)
- [x] Ability to delete completely the user's profile
- [x] The option to delete all the user's content when deleting their profile. 
- [x] Add the user's name and Date to the post (this was brought up when I and a few people reviewing it)

Still to do:
- [ ]  Apple App, written in Swift calling the existing API
- [ ]  Android App, written in JAVA calling the existing API

I also have plans to use this code on another application I am writing.

Finally, this application is served up through *AWS S3* on the front end, *AWS Elastic Beanstalk* on the back end, and MongoDB through *Cloud Atlas*.  