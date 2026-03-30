# College_Event_Management_System

## The modular structure of the backend system and the flow of request and response 

<img width="237" height="492" alt="image" src="https://github.com/user-attachments/assets/6d93b327-15d4-4d57-9e7e-49914301806c" />

Request -> route -> middleware -> controller -> service -> database/utilities -> response.

This floder structure helps us to maintain scalable system, Easier to maintain, Easier for testing and modification, Easier for larger system Understanding

## The purpose of the each folder is 

config- this handles the intital setup of the external system when integrated with current project like for example prisma databse orm.

controller - this helps to handle the request and response cycle by getting the request from the client and then pass it to the service which handles the business logic and again gets back the response and sends them to the client through routes.

middleware - it is present between the request and the controller this is mainly used for the authentiction, authorization, validation and logging also.

routes- This handles the API endpoints of the system where this implements the connection of the api endpoints and with its repective controller or middleware.

services - this handles the business logics whereas the controller handles the basics things the services handles the systems larger complex logics like creating users, deleting, databse quering,sending emails.

utils- it implements the reusable helper functions which are not only used by the single app compontent
