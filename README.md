# AttendEase - E-Commerce System

A comprehensive three-tier e-commerce platform with backend API, web application, and mobile application.

## Project Structure

```
AttendEase/
├── backend/          # Spring Boot REST API
├── web/              # React + TypeScript Web Application
├── mobile/           # Android (Kotlin + Jetpack Compose)
└── docs/             # Documentation
```

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- Android Studio (for mobile)

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API will be available at `http://localhost:8080/api/v1`

### Web Frontend Setup

```bash
cd web
npm install
npm run dev
```

Web app will be available at `http://localhost:3000`

### Mobile Setup

```bash
cd mobile
./gradlew build
```

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication

### Web Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router

### Mobile
- Kotlin
- Jetpack Compose
- Retrofit
- OkHttp

## Features

### User Management
- User registration and login
- JWT-based authentication
- Role-based access control (STUDENT, ADMIN)
- Password hashing with bcrypt

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/health` - API health check

## Database Schema

### users
- id (PK)
- email (UNIQUE)
- password_hash
- firstname
- lastname
- role (ENUM: STUDENT, ADMIN)
- created_at
- updated_at

### attendance
- id (PK)
- user_id (FK)
- date
- status (ENUM: PRESENT, ABSENT, LATE)
- created_at

### refresh_tokens
- id (PK)
- user_id (FK)
- token (UNIQUE)
- expiry_date

## API Documentation

All endpoints require `Content-Type: application/json` header.

### Authentication

#### Register User
```
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe",
  "role": "STUDENT"
}
```

#### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": "STUDENT"
  }
}
```

## Configuration

### Backend (application.properties)
- `server.port`: API port (default: 8080)
- `spring.datasource.url`: PostgreSQL connection URL
- `spring.datasource.username`: Database username
- `spring.datasource.password`: Database password
- `jwt.secret`: JWT signing secret
- `jwt.expiration`: JWT token expiration (milliseconds)

### Web Frontend
- API base URL configured in `src/services/api.ts`
- CORS enabled for localhost:3000

### Mobile
- Base API URL: `http://10.0.2.2:8080/api/v1/` (Android emulator)

## Development Timeline

- **Phase 1** (Weeks 1-2): Planning & Design
- **Phase 2** (Weeks 3-4): Backend Development
- **Phase 3** (Weeks 5-6): Web Application
- **Phase 4** (Weeks 7-8): Mobile Application
- **Phase 5** (Weeks 9-10): Integration & Deployment

## Security

- HTTPS communication (production)
- JWT authentication with expiration
- Password hashing using bcrypt
- SQL injection prevention via parameterized queries
- CORS configuration
- Role-based access control

## Performance Targets

- API response time: ≤ 2 seconds
- Page load time: ≤ 3 seconds
- Support for 100 concurrent users

## Browser & Device Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Android API 24+

## License

Proprietary - AttendEase 2024

## Contact

For questions, contact the development team.
