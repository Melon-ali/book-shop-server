# Book Shop Server

Using **Node.js**, **Express**, and **MongoDB**. This API handles Book inventory, orders, and revenue calculations. It supports CRUD operations for Books, manages orders with automatic stock updates, and integrates secure payment processing. The application also features role-based access control (RBAC) for user permissions and provides a robust error-handling mechanism to ensure stability and security.

## 📋 Features

- **User Authentication & Management**: Secure user authentication with JWT-based authorization and role-based access control (RBAC).
- **Store Book Data**: Store and manage Book details in the database.
- **Create, Read, Update, and Delete Book Details**: Fully manage Book records via API endpoints.
- **Store Orders**: Create orders and automatically update the stock quantity.
- **Process Payments**: Integrate a secure payment gateway to handle transactions efficiently.
- **Calculate Total Revenue**: Calculate the total revenue generated from all orders.
- **Search Books**: Retrieve Books based on query search terms.
- **Validate User Inputs**: Ensure data integrity using **Zod** for input validation.
- **Error Handling**: Provides meaningful error messages for a better user experience.
- **TypeScript Integration**: Type annotations for reliability and maintainability of the application.
- **MongoDB Integration**: Use **Mongoose** to interact with MongoDB for efficient data handling and validation.
- **Code Linting & Formatting**: Enforce code quality with **ESLint** and **Prettier** for consistent code style.

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have the following installed:

- **Node.js** (>=14.x.x)
- **MongoDB** (local or hosted, e.g., MongoDB Atlas)
- **Git**
- **TypeScript** (Optional: If you prefer to install globally)


## 🛠️ Scripts

The project includes several npm scripts for development and production:

- `npm run start`: Starts the application in production mode.
- `npm run start:dev`: Starts the application in development mode with live reloading using `ts-node-dev`.
- `npm run build`: Builds the production application.
- `npm run dev`: Watches for changes and compiles TypeScript files automatically.
- `npm run lint`: Lints the codebase using **ESLint**.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run format`: Formats the codebase using **Prettier**.
- `npm run format:fix`: Automatically fixes formatting issues with **Prettier**.

## API Endpoints

### Authentication

- **POST /api/auth/login**: Authenticate a user and return an access token.
- **POST /api/auth/change-password**: Allows an authenticated user to change their password.
- **POST /api/auth/refresh-token**: Generate a new access token using a refresh token.

### User

- **GET /api/users**: Retrieve a list of all registered users (Admin access required).
- **GET /api/users/me**: Retrieve the authenticated user's profile information.
- **POST /api/users/create-user**: Register a new user account.
- **PATCH /api/users/change-status/:id**: Update the status (active/blocked) of a user (Admin access required).

### Products (Books)

- **GET /api/products**: Retrieve a list of all Books in the inventory.
- **GET /api/products/:id**: Retrieve detailed information for a specific Book by its ID.
- **GET /api/brands**: Retrieve a list of all Book brands available.
- **POST /api/products**: Add a new Book to the inventory.
- **PUT /api/products/:id**: Update the details of a specific Book (identified by ID).
- **DELETE /api/products/:id**: Delete a specific Book from the inventory (identified by ID).

### Orders

- **GET /api/orders**: Retrieve a list of all orders.
- **GET /api/orders/my-orders/:userId**: Retrieve a list of all orders made by a specific customer.
- **GET /api/verify/:paymentId**: Verify the payment status for a given payment ID.
- **GET /api/orders/revenue**: Get the total revenue generated from all orders.
- **POST /api/orders**: Create a new order, automatically updating the stock quantity.
- **PATCH /api/orders/change-status/:id**: Update the status of a specific order (identified by ID).


## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for Node.js for building the API.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB to facilitate data handling and validation.
- **TypeScript**: Type-safe JavaScript for a more reliable and maintainable codebase.
- **ShurjoPay**: Payment gateway integration for processing transactions.
- **JWT (JSON Web Token)**: For user authentication and secure token handling.
- **Bcrypt**: For hashing passwords and ensuring security.
- **Zod**: Schema validation library to ensure input data integrity.
- **ESLint**: Linting tool to enforce consistent coding styles.
- **Prettier**: Code formatter to maintain consistent formatting across the codebase.

## Project Live Link

[Live API](https://assignment-4-book-shop-server.vercel.app)
