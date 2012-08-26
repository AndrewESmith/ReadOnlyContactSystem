# Readonly Contact system.
Please refer link below for Node-Neo4j Template below upon which this project is based. 

This app is a readonly contact management system. It's intention is to display clients of an accounting practice and their &nbsp;
associated tax returns. It has been developed as part of a coding competition where the prize is an iPad.&nbsp;
You can see the source at github (https://github.com/AndrewESmith/ReadOnlyContactSystem)
It is hosted on heroku here: http://readonlycontactsystem.herokuapp.com/

The goal is to implement a contact system using the following tools and technologies &nbsp;
    - neo4j
	- nodejs
	- git
	- http://www.heroku.com
	- html5
 
 As part of the exercise WebStorm (http://www.jetbrains.com/webstorm/) was used as the editor and debugger.

# Import
Visit 'List all individuals' and 'List all individual stocks' and click Import button if data hasn't already been loaded

# Neo4j Data Diagram
https://github.com/AndrewESmith/ReadOnlyContactSystem/blob/master/Data_Dictionary/Data_Analyzing.pptx

Major Outstanding issues
1. When importing on Heroku I encountered a time out. I think that I require a worker role in order to support long running processes. Web roles are limited to 30 seconds and imports
and long processes such as browse a list require more time. Worker role is added to Procfile. Worker role basics here: http://stackoverflow.com/questions/4762016/node-js-workers-background-processes
The answer is to use CloudAMQP (https://devcenter.heroku.com/articles/cloudamqp#use-with-nodejs)
2. Pretty much everything else ....

# Resources 
	- The Node Beginner Book (http://www.nodebeginner.org/)
	- yammer (http://www.yammer.com/)


-----------------------------------------------------------------------------------------------------------------
# Node-Neo4j Template
https://github.com/aseemk/node-neo4j-template#node-neo4j-template