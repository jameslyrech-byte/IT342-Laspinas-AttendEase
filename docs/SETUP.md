# Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Java Development Kit (JDK) 17+**
  - Download: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
  - Verify: `java -version` and `javac -version`

- **Apache Maven 3.6+**
  - Download: https://maven.apache.org/download.cgi
  - Verify: `mvn -version`

- **Node.js & npm (18+)**
  - Download: https://nodejs.org/
  - Verify: `node -v` and `npm -v`

- **PostgreSQL 12+**
  - Download: https://www.postgresql.org/download/
  - Verify: `psql --version`

- **Android Studio** (for mobile development)
  - Download: https://developer.android.com/studio
  - Install SDK 34 and above

- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`

## Backend Setup

### 1. Database Configuration

Create a PostgreSQL database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE attendease;
```

### 2. Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/attendease
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 3. Build and Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`

### Environment Variables (Optional)

Create a `.env` file in the backend directory:

```
DATABASE_URL=jdbc:postgresql://localhost:5432/attendease
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=86400000
```

## Web Frontend Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure API URL

Check `src/services/api.ts` for the API base URL:

```typescript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### 3. Development Server

```bash
npm run dev
```

The web app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview
```

### Environment Variables

Create a `.env` file in the web directory:

```
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=AttendEase
```

## Mobile Setup

### 1. Open in Android Studio

```bash
cd mobile
```

Open the `mobile` directory in Android Studio.

### 2. Configure SDK

- Go to File → Settings → Appearance & Behavior → System Settings → Android SDK
- Ensure SDK 34+ is installed
- API Level min: 24, target: 34

### 3. Create Emulator

- Tools → Device Manager → Create Device
- Select Pixel 4 or higher
- Target API: Android 13+ (API 33+)

### 4. Run Application

Press the "Run" button or use:

```bash
./gradlew installDebug
```

## IDE Configuration

### VS Code (Recommended for Web)

Extensions to install:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- TypeScript Vue Plugin
- Thunder Client (for API testing)

### IntelliJ IDEA (For Backend)

Plugins:
- Spring Boot
- Kubernetes
- Git Integration

### Android Studio

Built-in support for Kotlin and Android development.

## Common Issues

### Issue: Java Version Mismatch
```bash
java -version
# Should show Java 17+
```

### Issue: PostgreSQL Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# Start PostgreSQL (Mac)
brew services start postgresql

# Start PostgreSQL (Windows)
# Use Services app or PostgreSQL installer
```

### Issue: Port Already in Use
```bash
# Find process using port 8080 (Backend)
lsof -i :8080

# Find process using port 3000 (Web)
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Issue: npm packages not found
```bash
cd web
rm -rf node_modules
npm cache clean --force
npm install
```

## Testing

### Backend Unit Tests
```bash
cd backend
mvn test
```

### Web Component Tests
```bash
cd web
npm test
```

### API Testing with cURL
```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code in backend, web, or mobile

3. **Test Changes**
   - Run tests
   - Verify in browser/emulator

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "Feature: description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Debugging

### Backend Debugging
Edit `pom.xml` to enable debug mode and attach debugger in IDE.

### Web Debugging
Use Chrome DevTools (F12) or VS Code debugger.

### Mobile Debugging
Use Android Studio's built-in debugger.

## Performance Optimization

### Backend
- Enable query optimization
- Use connection pooling (HikariCP)
- Cache frequently accessed data

### Web
- Use React.memo for component optimization
- Implement code splitting with React Router
- Optimize images and assets

### Mobile
- Use ProGuard for release builds
- Optimize layout performance
- Test on real devices

## Next Steps

1. Review the [API Documentation](./API.md)
2. Check the [Database Schema](./DATABASE.md)
3. Start implementing features according to the development plan
4. Write unit and integration tests
5. Set up CI/CD pipeline (optional)
