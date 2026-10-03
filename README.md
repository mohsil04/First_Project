# Expense Tracker

A full-stack Expense Tracker application for managing personal expenses.

The application consists of a REST API backend built with Node.js, Express, and PostgreSQL, and a responsive frontend built with HTML, CSS, JavaScript, and Bootstrap.

## Project Structure


Expense Tracker/
├── backend/
│   ├── server.js
│   ├── schema.sql
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js


## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- CSS Grid
- Chart.js
- Node.js
- Express.js
- PostgreSQL
- REST API
- Fetch API
- async/await


## How to Run

### 1. Database Setup

Create a PostgreSQL database named:

```text
expense_tracker
```

Run the `schema.sql` file to create the `expenses` table and insert the sample data.

### 2. Backend Setup

Open the `backend` folder in the terminal and install the required packages:

```bash
npm install
```

Create a `.env` file based on `.env.example` and add your PostgreSQL connection details:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PORT=5432
```

Start the backend server:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:3000
```

### 3. Frontend Setup

Make sure the backend server is running.

Open the `frontend/index.html` file in a web browser.

The frontend communicates with the backend API using the Fetch API.


## API Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/expenses`     | Get all expenses  |
| GET    | `/api/expenses/:id` | Get one expense   |
| POST   | `/api/expenses`     | Add a new expense |
| PUT    | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Features

### Backend

* REST API for expense management
* PostgreSQL database storage
* Add expenses
* Edit expenses
* Delete expenses
* Get all expenses
* Get a single expense
* Server-side input validation
* Category validation
* Amount validation
* ID validation
* Parameterized SQL queries
* Automatic database-generated IDs
* CORS support
* Data persistence after server restart

### Frontend

* Responsive Expense Tracker interface
* Summary cards showing:

  * Total amount
  * Number of expenses
  * Highest expense
* Add expense form
* Custom client-side validation
* Edit expense using a Bootstrap modal
* Delete confirmation using a Bootstrap modal
* Category filter
* Colored category badges
* Loading spinner during API operations
* Bootstrap error alerts
* Server connection error handling
* Refreshes data from the API after add, edit, and delete operations
* Mobile-responsive layout
* Responsive expenses table using Bootstrap's table-responsive
* CSS Grid for summary cards
* Sortable table columns
* Expenses by category chart using Chart.js
* Dark Mode
* Uses Fetch API with async/await and try/catch

## Allowed Categories

The following categories are supported:

* Food
* Transport
* Bills
* Entertainment
* Other

## Validation

The application validates expense data on both the frontend and backend.

### Frontend Validation

The Add and Edit forms validate:

* Title is required
* Amount is required
* Amount must be greater than 0
* Category is required
* Date is required

### Backend Validation

The backend validates:

* Title
* Amount
* Category
* Date
* Expense ID

Invalid requests return appropriate error responses.

## Data and Filtering

The category filter affects the expenses table only.

The summary cards always calculate their values using all expenses, regardless of the selected category filter.

After adding, editing, or deleting an expense, the frontend requests the latest data from the backend to keep the interface synchronized with the database.

## Database

The project uses PostgreSQL.

The `expenses` table contains:

* `id`
* `title`
* `amount`
* `category`
* `date`

The database generates the expense ID automatically.

## Testing

The backend API was tested using Thunder Client.

Tests include:

* Successful GET requests
* Successful POST request
* Successful PUT request
* Successful DELETE request
* Invalid expense data
* Invalid expense ID
* Non-existing expense ID
* Data persistence after server restart

The frontend was tested for:

* Loading expenses from the API
* Adding expenses
* Editing expenses
* Deleting expenses
* Category filtering
* Form validation
* Error handling
* Server-off handling
* Responsive layout

## Screenshots

Screenshots of successful and failed API requests using Thunder Client are included as part of the project submission.

## What Was Hardest Part?

The most challenging part was building and connecting the Express backend to PostgreSQL and making sure that the API correctly handles validation, database errors, and different request scenarios.

Another important part was connecting the frontend directly to the REST API using the Fetch API and keeping the interface synchronized with the database after adding, editing, and deleting expenses.



* Video Link - Google Drive -
  https://drive.google.com/file/d/1Ueb-l4zC4L0dR7dtqtBDFYhqTefpOfnx/view?usp=sharing
