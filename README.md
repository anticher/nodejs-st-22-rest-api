- git clone rep

- git switch <last branch>

- rename .env.example => .env

- npm i

- if you want to use your db - add to .env file enviroment data for your db

- if you want to use my db - download docker app and start it, then use $ npm run start-docker-db

- start rest server with $ npm run start

----------

- if you use my db in docker container you can connect to pgadmin4 by the url: http://localhost:8080/browser/


# Tasks

#### TASK 3.1
Write a simple REST service with CRUD operations for User entity.

#### TASK 3.2
Add server-side validation for create/update operations of User entity.

#### TASK 4.1
Configure your REST service to work with PostgreSQL.

#### TASK 4.2
The service should adhere to 3-layer architecture principles.

#### TASK 5.1
Add Group entity to already existing REST service with CRUD operations.

#### TASK 5.2
Link User records in one table with Group.

#### TASK 5.3
Add addUsersToGroup(groupId, userIds)method which will allow adding users to a certain group. Use transactions to save records in DB.

#### TASK 6.1
Add middleware which will log which service method has been invoked and which arguments have been passed to it.

#### TASK 6.2
Add error handling to process.on(‘uncaughtException’,...). Add Unhandled promise rejection listener to log errors.

#### TASK 6.3
Every method in the controllers should log the errors.

#### TASK 7.1
Add authorization to the already existing REST service.

#### TASK 7.2
Add CORS middleware to access service methods from WEB applications hosted on another domains.

#### TASK 8.1
Add unit tests for User and Group entities controllers methods using Jestlibrary.