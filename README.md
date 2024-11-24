# SQL Injection Project
## Description
This project demonstrates the risks of SQL Injection vulnerabilities and showcases secure coding practices to mitigate them. The application consists of two main components:
1. **Vulnerable Login Page**: Demonstrates how SQL Injection attacks can exploit insecure code.
2. **Mitigation Page**: Implements secure coding practices using regex validation and parameterized queries to prevent SQL Injection.
The project uses:
- **Node.js**: Backend server
- **SQLite**: Lightweight database
- **Express.js**: Web framework
## Getting Started
### Prerequisites
Make sure you have the following installed on your machine:
1. **Node.js** (v14 or newer):
- Download and install from [https://nodejs.org]
2. **Git**:
- Download and install from [https://git-scm.com/]
### Clone the Repository
To get a copy of the project, clone it using Git:
```bash
git clone https://github.com/StellarLaw/SQL-PROJ.git
cd SQL-PROJ
```
### Install Dependencies
Install the required Node.js packages:
```bash
npm install
```
This command will install the following dependencies:
- express: Web framework for Node.js
- sqlite3: Database library for SQLite
- body-parser: Middleware for parsing request bodies
## Running the Project
### Start the Application
Run the following command to start the Node.js server:
```bash
node app.js
```
You should see output like this:
```
Server running at http://localhost:3000
Connected to SQLite database.
```
### Access the Application
Open your web browser and navigate to:
- Home Page: http://localhost:3000
- SQL Injection Demo Page: http://localhost:3000/demo.html
- Mitigation Page: http://localhost:3000/mitigation.html
- References Page: http://localhost:3000/references.html
## File Structure
```
SQL-PROJ/
├── app.js          # Backend server
├── database.db     # SQLite database
├── package.json    # Project dependencies and metadata
├── public/         # Static files served by Express
│   ├── index.html       # Home Page
│   ├── demo.html        # SQL Injection Demonstration Page
│   ├── mitigation.html  # Mitigation Techniques Page
│   ├── references.html  # References Page
│   ├── styles.css       # Global CSS Styles
└── node_modules/   # Installed dependencies
```
### Setting Up SQLite Database:
- The database will be created automatically when you run the server for the first time.
- If you encounter issues, delete the database.db file and restart the server to recreate it.
### Starting Over:
- To reset the database, delete database.db, and ensure the app.js file has the logic to recreate the table on startup.

## Testing the Application
### Vulnerable Login Page
Use SQL Injection payloads like:
- Username: `' OR '1'='1`
- Password: Leave blank or input anything.
### Mitigation Page
Input containing potential SQL Injection patterns (e.g., `' OR '1'='1`) will be rejected with an error message.
