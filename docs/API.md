# API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses are in JSON format with the following structure:

### Success Response
```json
{
  "data": { ... },
  "message": "Success",
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400/401/403/500
}
```

## Endpoints

### Authentication

#### 1. Register User
- **Endpoint**: `POST /auth/register`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe",
  "role": "CUSTOMER"
}
```
- **Response** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "role": "CUSTOMER"
}
```
- **Error Cases**:
  - 400: Email already registered
  - 400: Invalid input format

#### 2. Login
- **Endpoint**: `POST /auth/login`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": "CUSTOMER"
  }
}
```
- **Error Cases**:
  - 401: Invalid email or password
  - 400: Missing required fields

#### 3. Health Check
- **Endpoint**: `GET /auth/health`
- **Authentication**: None
- **Response** (200 OK):
```
"AttendEase API is running"
```

## Status Codes

- **200**: OK - Request successful
- **201**: Created - Resource created successfully
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required or invalid
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error

## Rate Limiting

Currently not implemented. To be added in future versions.

## CORS Policy

The API accepts requests from:
- `http://localhost:3000` (Web Frontend)
- `http://localhost:8081` (Local Development)
- `http://localhost:19006` (React Native)

## Error Handling

All errors include a message and appropriate HTTP status code:

```json
{
  "error": "Invalid email or password",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 401
}
```

## Token Expiration

- **Access Token**: 24 hours (configurable in `application.properties`)
- **Refresh Token**: 7 days

## Future Endpoints

Planned endpoints for future phases:

### Products
- `GET /products` - List all products
- `GET /products/{id}` - Get product details
- `POST /products` - Create product (Admin only)
- `PUT /products/{id}` - Update product (Admin only)
- `DELETE /products/{id}` - Delete product (Admin only)

### Cart
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/{itemId}` - Update cart item
- `DELETE /cart/{itemId}` - Remove item from cart

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get user's orders
- `GET /orders/{id}` - Get order details

## Testing

Use tools like Postman or cURL to test the API:

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password",
    "firstname": "Test",
    "lastname": "User",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'

# Health Check
curl http://localhost:8080/api/v1/auth/health
```
