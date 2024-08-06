# Test-App

This is a test application where users can come and attempt a test, and admins can create tests and see details of a particular test. The project is divided into two main parts: the backend and the frontend.

## Project Structure

- `backend`: Contains the backend code written in TypeScript using PostgreSQL, Prisma ORM, Express.js, and Node.js.
- `frontend`: Contains the frontend code written in React with Tailwind CSS.

## Setup Instructions

### Prerequisites

- Node.js (v14.x or later)
- PostgreSQL (v13 or later)
- Docker (optional, for containerized setup)

### Backend Setup

1. **Clone the repository**

    ```sh
    git clone https://github.com/NitinGurawaliya/test-app.git
    cd test-app/backend
    ```

2. **Install dependencies**

    ```sh
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the `backend` folder and add the following environment variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/testdb"
    JWT_SECRET="your_jwt_secret"
    ```

4. **Generate Prisma Client**

    ```sh
    npx prisma generate
    ```

5. **Run database migrations**

    ```sh
    npx prisma migrate dev
    ```

6. **Build and start the server**

    ```sh
    npm run build
    npm start
    ```

    For development mode with hot-reloading:

    ```sh
    npm run dev
    ```

### Frontend Setup

1. **Navigate to the frontend directory**

    ```sh
    cd ../frontend
    ```

2. **Install dependencies**

    ```sh
    npm install
    ```

3. **Start the development server**

    ```sh
    npm run dev
    ```

4. **Build the frontend for production**

    ```sh
    npm run build
    ```

5. **Preview the production build**

    ```sh
    npm run preview
    ```

## Scripts

### Backend

- `npm start`: Start the server in production mode.
- `npm run dev`: Start the server in development mode with hot-reloading.
- `npm run build`: Compile TypeScript to JavaScript.

### Frontend

- `npm run dev`: Start the development server.
- `npm run build`: Build the frontend for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Run ESLint for code linting.

## Technologies Used

### Backend

- TypeScript
- PostgreSQL
- Prisma ORM
- Express.js
- Node.js
- JWT for authentication

### Frontend

- React
- Tailwind CSS
- Axios for API requests
- React Router for routing
- React Toastify for notifications

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.
