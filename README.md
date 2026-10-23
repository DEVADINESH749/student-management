# Student Management System

## Project Overview

The Student Management System is a microservices-based web application for managing students and courses.

The project uses React.js for the frontend, FastAPI for backend microservices, SQLite for databases, and an API Gateway for communication between the frontend and backend services.

The system provides secure authentication, student management, course management, course enrollment, and API testing using Postman.

## Features

- User registration and login
- JWT-based authentication
- Student CRUD operations
- Course CRUD operations
- Assign courses to students
- View enrolled students
- API Gateway for centralized communication
- Responsive React.js frontend
- SQLite database for each microservice
- Postman API testing
- Swagger API documentation

## Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Lucide React

### Backend

- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- Uvicorn

### Database

- SQLite

### API Testing

- Postman
- Swagger UI

### Development Tools

- Visual Studio Code
- Git
- GitHub

## Microservices Architecture

The application is divided into independent services:

- **Auth Service** - Handles user registration, login, JWT authentication, and user validation.
- **Student Service** - Handles student creation, retrieval, updating, and deletion.
- **Course Service** - Handles course management and student course enrollment.
- **API Gateway** - Provides a single entry point for frontend requests and routes requests to the appropriate backend service.

## Service Ports

| Service | Port |
|---|---:|
| Frontend | 5173 |
| API Gateway | 8000 |
| Auth Service | 8001 |
| Student Service | 8002 |
| Course Service | 8003 |

## Project Structure

```text
student-management/
+-- frontend/
+-- api-gateway/
+-- auth-service/
+-- student-service/
+-- course-service/
+-- postman/
+-- .gitignore
+-- README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/me` | Get current authenticated user |

### Students

| Method | Endpoint | Description |
|---|---|---|
| POST | `/students` | Create a student |
| GET | `/students` | Get all students |
| GET | `/students/{student_id}` | Get a student |
| PUT | `/students/{student_id}` | Update a student |
| DELETE | `/students/{student_id}` | Delete a student |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| POST | `/courses` | Create a course |
| GET | `/courses` | Get all courses |
| GET | `/courses/{course_id}` | Get a course |
| PUT | `/courses/{course_id}` | Update a course |
| DELETE | `/courses/{course_id}` | Delete a course |
| POST | `/courses/{course_id}/students/{student_id}` | Assign a student to a course |
| GET | `/courses/{course_id}/students` | View enrolled students |

## Running the Project

Start each service in a separate PowerShell terminal.

### 1. Auth Service

```powershell
cd auth-service
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8001
```

### 2. Student Service

```powershell
cd student-service
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8002
```

### 3. Course Service

```powershell
cd course-service
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8003
```

### 4. API Gateway

```powershell
cd api-gateway
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

### 5. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the application:

```text
http://localhost:5173
```

## Swagger API Documentation

Swagger documentation is available at:

- API Gateway: `http://127.0.0.1:8000/docs`
- Auth Service: `http://127.0.0.1:8001/docs`
- Student Service: `http://127.0.0.1:8002/docs`
- Course Service: `http://127.0.0.1:8003/docs`

## Testing

The following features have been tested:

- User registration
- User login
- JWT authentication
- Current user authentication
- Student creation
- Student retrieval
- Student update
- Student deletion
- Course creation
- Course retrieval
- Course update
- Course deletion
- API Gateway routing
- React frontend integration
- Postman API testing

## Project Status

The Student Management System is completed with authentication, student management, course management, API Gateway integration, and React frontend functionality.
## Final Project Update

Project finalized and synchronized on 23 October 2026. Backend microservices, React frontend, API Gateway, Postman API testing, responsive UI, and project screenshots have been completed and verified.
