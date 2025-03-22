# Blogging Platform Backend

A robust RESTful API backend for a blogging platform, built with Node.js, Express, and PostgreSQL. This project handles user authentication, blog post CRUD operations, comments, and image storage. It uses Sequelize as the ORM for database management and Docker for containerization.

## Features

### User Authentication:
- Signup and login with JWT-based authentication.
- Password hashing using bcrypt.
- Access tokens for secure sessions.

### Blog Post Management:
- Create, read, update, and delete (CRUD) blog posts.
- Fetch all blog posts.
- Associate blog posts with users.

### Comment System:
- Users can add comments to blog posts.
- Create comments for blog posts.

### Image Storage:
- Upload and store images for blog posts.
- Serve images via API endpoints.

### Database:
- PostgreSQL for data storage.
- Sequelize as the ORM for database management.

### Testing:
- Comprehensive unit tests.
- 100% test coverage for critical parts.

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Image Storage:** Multer (for file uploads)
- **Testing:** c8, mocha
- **Containerization:** Docker, Docker Compose

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js (v16 or higher) installed (optional, for local development).

### Steps

#### Clone the Repository:
```bash
git clone git@github.com:mohammad-jebreen-1/blogging-platform-backend.git
cd blogging-platform-backend
```

#### Build and Start the Docker Containers:
```bash
docker-compose up --build
```

#### Run Database Migrations:
After the containers are up, run the following command to apply database migrations:
```bash
docker-compose exec app npx sequelize-cli db:migrate
```

#### Access the API:
The API will be running at `http://localhost:3500`.

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Register a new user.
- `POST /auth/login` - Log in and receive a JWT token.

### Blog Posts (`/blogs`)
- `GET /blogs` - Get all blog posts (requires authentication).
- `GET /blogs/user/:id` - Get blog posts belonging to a specific user (requires authentication).
- `POST /blogs` - Create a new blog post (requires authentication).
- `PATCH /blogs/:id` - Update a blog post (requires authentication).
- `DELETE /blogs/:id` - Delete a blog post (requires authentication).

### Comments (`/comments`)
- `POST /comments` - Add a comment to a blog post (requires authentication).

### Images
- Included in create and edit blog post APIs.
- Stored in the uploads folder.


## Testing

### Run Tests
To run the tests, execute the following command:
```bash
npm test
```

## Environment Variables
The following environment variables are required:

```env
APP_ENVIRONMENT=development
SERVER_PORT=3500
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_HOST=blogging-postgres-db
DB_PORT=5432
PASSWORD_SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=36000
```

## Docker Configuration
The project includes a `Dockerfile` and `docker-compose.yml` for containerization:

- **Dockerfile:** Defines the Node.js environment and application setup.
- **docker-compose.yml:** Orchestrates the application and PostgreSQL database.

### Docker Commands

#### Build and Start Containers:
```bash
docker-compose up --build
```

#### Stop and Remove Containers:
```bash
docker-compose down
```

#### Restart Containers:
```bash
docker-compose restart
```
