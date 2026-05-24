# Database Schema

## Overview
AttendEase uses PostgreSQL as the relational database. The schema includes support for user management, attendance tracking, and token refresh functionality.

## Table Definitions

### users
Stores user account information.

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### attendance
Tracks user attendance records.

```sql
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(date);
```

### refresh_tokens
Stores JWT refresh tokens for session management.

```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

## Enums

### UserRole
- STUDENT
- ADMIN

### AttendanceStatus
- PRESENT
- ABSENT
- LATE

## Relationships

```
users (1) ──── (M) attendance
users (1) ──── (M) refresh_tokens
```

## Initialization

To initialize the database:

1. Create PostgreSQL database:
```sql
CREATE DATABASE attendease;
```

2. Connect to the database and apply the schema using Spring Boot's Hibernate (DDL auto).

3. Or manually run the SQL statements above.

## Data Validation Rules

- **email**: Must be unique and valid email format
- **password_hash**: Must be hashed using bcrypt (never store plaintext)
- **firstname/lastname**: Required, max 100 characters
- **role**: Must be either STUDENT or ADMIN
- **status**: Must be PRESENT, ABSENT, or LATE
- **expiry_date**: Must be in the future

## Backup & Recovery

Regular backups are recommended:

```bash
pg_dump attendease > attendease_backup.sql
psql attendease < attendease_backup.sql
```
