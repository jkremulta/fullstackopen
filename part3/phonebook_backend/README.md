# Phonebook Backend

This is a simple **Phonebook** backend built with **Node.js** and **Express**.  
It provides a RESTful API to manage contacts, allowing users to add, read, update, and delete contacts.  

## Table of Contents

- [Features](#features)  
- [Technologies](#technologies)  
- [Setup](#setup)  
- [Available Endpoints](#available-endpoints)  
- [License](#license)  

## Features

- Get all contacts  
- Get a contact by ID  
- Add a new contact  
- Update an existing contact  
- Delete a contact  
- Prevent duplicate names  
- Simple logging using **Morgan**  
- Returns phonebook info with the current date and number of contacts  

## Technologies

- Node.js  
- Express  
- Morgan (HTTP request logger)  
- CORS  

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd phonebook-backend
```

2. View the live backend here:  
https://fullstackopen-haxo.onrender.com/

## Available Endpoints

| Method | Endpoint | Description |
|-------|---------|-------------|
| GET | /api/persons | Get all contacts |
| GET | /api/persons/:id | Get a contact by ID |
| POST | /api/persons | Add a new contact |
| PUT | /api/persons/:id | Update a contact |
| DELETE | /api/persons/:id | Delete a contact |
| GET | /info | Get phonebook info |

## License

This project is for learning purposes as part of **Full Stack Open**.
