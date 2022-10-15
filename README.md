# CloudCraft
CloudCraft is a real-time chat and task manager application designed for organizations to assist in team communication and task management. Our team was tasked to create a responsive and minimalistic chat application for users to improve productivity and increase collaboration across team members. Our team challenged ourselves with new technologies such as socket.io for communication between users, bcrypt for user authentication, and recoil for global state storage.

## Table of Contents

- [Features](#features)
  - [User Login](#user-login)
  - [User List](#user-list)
  - [Group List](#group-list)
  - [Current Chat](#current-chat)
  - [Task List](#task-list)
- [Tech Used](#tech-used)
- [Developement](#developement)
  - [Pre-installation Requirements](#pre-installation-requirements)
  - [Environment Variables Management](#environment-variables-management)
  - [Installation](#installation)
- [Contributors](#contributors)

## Features

### User Login
Each user will need to create an account with a unique username and password. Once logged in users will stay logged in on page refresh and will only need to log in again after leaving the page for 10 minutes.

### User list
The user list contains a list of users the logged-in user can chat with. The user currently being chatted with, if any, is highlighted.

### Group list
The group list contains a list of groups the logged-in user is a member of and can chat with. The group currently being chatted with, if any, is highlighted. Users can create their own groups by adding at least 2 other members to a group and all members will be automatically added to the group.

### Current chat
The chat with the currently-selected user is displayed in the main pane. Messages are shown and updated in real time. When another user is typing, other members of the current chat can see what the user is typing. Users can edit their own messages and delete them. All messages can be added to the task list on the left side.

### Task list
The task list displays all the tasks for the current user. Tasks can be associated with a message or created by the user. Tasks can also be sorted by dragging the task into position on the list. Tasks can be checked off to indicate completion, once marked completed the task is moved to the bottom half of the list.


## Tech Used
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=plastic&logo=appveyor)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white&style=plastic&logo=appveyor)
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=plastic&logo=appveyor)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=plastic&logo=appveyor)
![Axios](https://img.shields.io/badge/-Axios-373747?logo=axios&logoColor=white&style=plastic&logo=appveyor)
![AWS](https://img.shields.io/badge/-AWS-000000?logo=amazon-aws&logoColor=white&style=plastic&logo=appveyor)
![Socket.io](https://img.shields.io/badge/-Socket.io-blueviolet?logo=socket.io&logoColor=blueviolet&style=plastic&logo=appveyor)
![Recoil](https://img.shields.io/badge/-Recoil-yellow?logo=Recoil&logoColor=yellow&?style=plastic&logo=appveyor)
![Bcrypt](https://img.shields.io/badge/-Bcrypt-blue?logo=Bcrypt&logoColor=blue&?style=plastic&logo=appveyor)
![JWT](https://img.shields.io/badge/-JWT-red?logo=JWT&logoColor=red&?style=plastic&logo=appveyor)

## Developement

### Pre-installation Requirements

```
Node v16.14.2
NPM v8.5.0
```

### Environment Variables Management

This project uses [dotenv](https://github.com/motdotla/dotenv).

When using this application, you will need to create a .env file with the following information.

<details>
  <summary>.env file requirements</summary>
  
```
PORT= Port number of postgres server
NAME= Name of postgres user
PASSWORD= Postgres user password
HOST= URL of postgres server
DATABASE= Name of postgres database
SERVERPORT= Port number for this application
AUTHPORT= Port number of authentication server
AUTHDATABASE= Database name of authentication server
AUTHHOST= URL of authentication server
ACCESS_TOKEN_SECRET= Token for accessing authentication
REFRESH_TOKEN_SECRET= Token for refreshing tokens
```

</details>

### Installation

<details>
  <summary>Installation instructions</summary>
  
Install dependencies
```
npm install
```
Bundle files
```
npm run build
```

You will need an available postgres database to run this application.

Run the following files to programmatically create the needed tables
```
server/authdb/makeAuthTable.js
server/db/makeTables.js
```

Run the servers
```
npm run auth-server 
npm run dev-server
```
</details>

### Contributors
User Login - [Alexander Lee](https://github.com/theaznkid9) and [Christopher Garcia](https://github.com/Chrisgood2go)\
User List & Group List - [Daniel Shin](https://github.com/dshinny)\
Current Chat - [Yong Tang](https://github.com/yota88), [Daniel Shin](https://github.com/dshinny), and [Brian Vose](https://github.com/Banzubie)\
Task List - [James Anderson](https://github.com/jamesanderson40)
