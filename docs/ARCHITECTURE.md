# AttendEase Project Structure

## Directory Layout

```
Laspiñas_AttendEase/
│
├── backend/                              # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/attendease/
│   │   │   │   ├── AttendEaseApplication.java    # Main app entry
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java       # Spring Security config
│   │   │   │   ├── controller/
│   │   │   │   │   └── AuthController.java       # Authentication endpoints
│   │   │   │   ├── service/
│   │   │   │   │   └── AuthService.java          # Auth business logic
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── AttendanceRepository.java
│   │   │   │   │   └── RefreshTokenRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Attendance.java
│   │   │   │   │   └── RefreshToken.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   └── UserDto.java
│   │   │   │   ├── security/
│   │   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   │   └── util/
│   │   │   │       └── JwtUtil.java              # JWT utilities
│   │   │   └── resources/
│   │   │       └── application.properties         # App configuration
│   │   └── test/                                 # Unit tests
│   ├── pom.xml                           # Maven dependencies
│   ├── Dockerfile                        # Docker config
│   └── .gitignore
│
├── web/                                  # React + TypeScript Web App
│   ├── src/
│   │   ├── main.tsx                      # React entry point
│   │   ├── App.tsx                       # Main App component
│   │   ├── App.css
│   │   ├── index.css                     # Global styles
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── HomePage.tsx
│   │   ├── components/                   # Reusable components
│   │   ├── services/
│   │   │   ├── api.ts                    # Axios instance
│   │   │   └── authService.ts            # Auth API calls
│   │   └── styles/
│   │       ├── auth.css
│   │       ├── home.css
│   │       └── tailwind.css
│   ├── public/
│   ├── index.html                        # HTML template
│   ├── vite.config.ts                    # Vite config
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── package.json                      # NPM dependencies
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.cjs
│   ├── Dockerfile                        # Docker config
│   ├── nginx.conf                        # Nginx config
│   └── .gitignore
│
├── mobile/                               # Android (Kotlin + Jetpack Compose)
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/attendease/
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   ├── api/
│   │   │   │   │   │   ├── ApiService.kt
│   │   │   │   │   │   └── RetrofitClient.kt
│   │   │   │   │   └── ui/
│   │   │   │   │       └── theme/
│   │   │   │   │           └── Theme.kt
│   │   │   │   ├── res/
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── test/
│   │   ├── build.gradle
│   │   └── proguard-rules.pro
│   ├── build.gradle
│   └── settings.gradle
│
├── docs/                                 # Documentation
│   ├── README.md                         # Project overview
│   ├── API.md                            # API documentation
│   ├── DATABASE.md                       # Database schema
│   ├── SETUP.md                          # Development setup guide
│   └── DEPLOYMENT.md                     # Deployment guide
│
├── README.md                             # Root README
├── docker-compose.yml                    # Docker Compose config
├── .gitignore                            # Git ignore rules
└── .env.example                          # Environment variables template

```

## File Count Summary

- Backend Java Files: 15+
- Backend Configuration Files: 4
- Web TypeScript Files: 10+
- Web Configuration Files: 8
- Mobile Kotlin Files: 5+
- Mobile Configuration Files: 4
- Documentation Files: 6
- Configuration Files: 3

**Total: 60+ files**

## Key Technologies by Layer

### Backend
- Framework: Spring Boot 3.1.5
- Language: Java 17
- Database: PostgreSQL 12+
- Authentication: JWT
- Build Tool: Maven
- Server: Embedded Tomcat

### Web Frontend
- Framework: React 18.2
- Language: TypeScript
- Styling: Tailwind CSS + Custom CSS
- HTTP Client: Axios
- Router: React Router v6
- Build Tool: Vite

### Mobile
- Language: Kotlin
- UI Framework: Jetpack Compose
- HTTP Client: Retrofit 2
- Build Tool: Gradle
- Min SDK: Android 24 (API 24)
- Target SDK: Android 34 (API 34)

## Configuration Files

### Backend
- `application.properties`: Spring Boot configuration
- `pom.xml`: Maven dependencies and build config
- `Dockerfile`: Container image definition

### Web
- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: NPM dependencies and scripts
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS plugins
- `.eslintrc.cjs`: ESLint rules

### Mobile
- `build.gradle` (project-level): Gradle plugins
- `build.gradle` (app-level): App dependencies and build config
- `settings.gradle`: Project settings
- `AndroidManifest.xml`: App metadata and permissions

## API Endpoints (Phase 1 Implementation)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |
| GET | `/auth/health` | API health check |

## Database Tables

| Table | Columns | Purpose |
|-------|---------|---------|
| users | id, email, password_hash, firstname, lastname, role, created_at, updated_at | User accounts |
| attendance | id, user_id, date, status, created_at | Attendance records |
| refresh_tokens | id, user_id, token, expiry_date | JWT refresh tokens |

## Build & Run Commands

### Backend
```bash
mvn clean install
mvn spring-boot:run
```

### Web
```bash
npm install
npm run dev
```

### Mobile
```bash
./gradlew build
./gradlew assembleDebug
```

### All Services (Docker)
```bash
docker-compose up -d
```

## Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview and quick start |
| docs/API.md | Detailed API documentation |
| docs/DATABASE.md | Database schema and relationships |
| docs/SETUP.md | Development environment setup |
| docs/DEPLOYMENT.md | Production deployment guide |
| docs/ARCHITECTURE.md | System architecture details |

## Development Phase Checklist

- [x] Phase 1: Planning & Design - API Specs ✅
- [x] Phase 1: Planning & Design - Database Design ✅
- [x] Phase 1: Planning & Design - UI Wireframes ✅
- [ ] Phase 2: Backend Development - User APIs
- [ ] Phase 2: Backend Development - Product APIs
- [ ] Phase 2: Backend Development - Shopping Cart APIs
- [ ] Phase 3: Web Application - User Interface
- [ ] Phase 3: Web Application - Product Catalog
- [ ] Phase 3: Web Application - Shopping Cart Feature
- [ ] Phase 4: Mobile Application - Android App
- [ ] Phase 4: Mobile Application - API Integration
- [ ] Phase 5: Integration & Deployment - Testing
- [ ] Phase 5: Integration & Deployment - Security Review
- [ ] Phase 5: Integration & Deployment - Production Launch

## Next Steps

1. **Develop Additional Backend APIs**
   - Product management endpoints
   - Shopping cart endpoints
   - Order management endpoints
   - Attendance tracking endpoints

2. **Enhance Web Frontend**
   - Product listing and filtering
   - Shopping cart functionality
   - Checkout process
   - Admin dashboard

3. **Complete Mobile Application**
   - Navigation implementation
   - Product browsing screens
   - Cart management
   - Authentication screens

4. **Set Up CI/CD Pipeline**
   - GitHub Actions for testing
   - Automated deployment
   - Code quality checks

5. **Security Hardening**
   - HTTPS enforcement
   - Rate limiting
   - Input validation
   - SQL injection prevention

6. **Performance Optimization**
   - Database query optimization
   - Frontend code splitting
   - Caching strategies

## Support Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- Android Jetpack Compose: https://developer.android.com/compose
- PostgreSQL Documentation: https://www.postgresql.org/docs/
