# Deployment Guide

## Prerequisites

- All components are built and tested
- Database is set up and migrated
- Environment variables are configured
- SSL certificates are ready for production

## Backend Deployment (Spring Boot)

### Docker Deployment

1. **Create Dockerfile** in `backend/`:

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/attendease-backend-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

2. **Build Docker Image**:

```bash
cd backend
mvn clean package
docker build -t attendease-api:1.0.0 .
```

3. **Run Container**:

```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/attendease \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=password \
  -e JWT_SECRET=production-secret-key \
  --name attendease-api \
  attendease-api:1.0.0
```

### Kubernetes Deployment

1. **Create Deployment YAML**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: attendease-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: attendease-api
  template:
    metadata:
      labels:
        app: attendease-api
    spec:
      containers:
      - name: api
        image: attendease-api:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
```

2. **Deploy**:

```bash
kubectl apply -f deployment.yaml
kubectl expose deployment attendease-api --type=LoadBalancer --port=8080
```

### Traditional Server Deployment

1. **Build JAR**:

```bash
cd backend
mvn clean package
```

2. **Transfer to Server**:

```bash
scp target/attendease-backend-1.0.0.jar user@server:/opt/attendease/
```

3. **Create systemd Service** (`/etc/systemd/system/attendease.service`):

```ini
[Unit]
Description=AttendEase API
After=network.target

[Service]
Type=simple
User=attendease
WorkingDirectory=/opt/attendease
ExecStart=/usr/bin/java -jar attendease-backend-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

4. **Start Service**:

```bash
sudo systemctl start attendease
sudo systemctl enable attendease
```

## Web Frontend Deployment

### Vercel Deployment

1. **Connect Repository**:
   - Push code to GitHub
   - Sign in to Vercel
   - Import project from GitHub

2. **Configure Build**:
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
   - Root Directory: `web`

3. **Deploy**:
   - Vercel will automatically deploy on push

### Netlify Deployment

1. **Build Locally**:

```bash
cd web
npm run build
```

2. **Deploy**:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

1. **Build**:

```bash
cd web
npm run build
```

2. **Upload to S3**:

```bash
aws s3 sync dist/ s3://attendease-web/
```

3. **Invalidate CloudFront Cache**:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name attendease.com;

    location / {
        root /var/www/attendease;
        try_files $uri /index.html;
    }

    location /api/v1/ {
        proxy_pass http://localhost:8080/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Mobile Deployment

### Play Store Deployment

1. **Create Signed APK**:

```bash
cd mobile
./gradlew assembleRelease
```

2. **Sign APK**:

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore keystore.jks app-release-unsigned.apk alias_name
```

3. **Zipalign**:

```bash
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

4. **Upload to Play Store**:
   - Go to Google Play Console
   - Create new app
   - Upload APK
   - Fill in app details
   - Submit for review

### Firebase App Distribution (Beta Testing)

1. **Configure Firebase**:

```bash
cd mobile
firebase init
```

2. **Build and Deploy**:

```bash
./gradlew assembleRelease
firebase appdistribution:distribute app-release.apk \
  --release-notes "Beta version" \
  --testers-file testers.txt
```

## Database Deployment

### PostgreSQL Setup

1. **Install PostgreSQL**:

```bash
sudo apt-get install postgresql postgresql-contrib
```

2. **Create Database**:

```sql
CREATE DATABASE attendease_prod;
CREATE USER attendease_prod WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE attendease_prod TO attendease_prod;
```

3. **Backup Strategy**:

```bash
# Daily backup
0 2 * * * pg_dump attendease_prod > /backups/attendease_$(date +\%Y\%m\%d).sql
```

### RDS (AWS)

1. **Create RDS Instance**:
   - Engine: PostgreSQL 12+
   - Instance Class: db.t3.micro (or higher)
   - Storage: 20 GB (or as needed)

2. **Configure Security Group**:
   - Allow inbound on port 5432 from app servers

3. **Backup Configuration**:
   - Backup retention: 30 days
   - Multi-AZ: Yes (for production)

## SSL/TLS Certificate

### Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d attendease.com
```

### Update Nginx

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/attendease.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/attendease.com/privkey.pem;
}
```

## Monitoring & Logging

### Application Performance Monitoring (APM)

```properties
# In Spring Boot
management.endpoints.web.exposure.include=health,metrics
management.metrics.export.prometheus.enabled=true
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
docker-compose up -d elasticsearch logstash kibana
```

### CloudWatch (AWS)

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-cloudwatch</artifactId>
</dependency>
```

## Environment Variables (Production)

Set these securely:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db.com:5432/attendease
export SPRING_DATASOURCE_USERNAME=attendease_user
export SPRING_DATASOURCE_PASSWORD=<secure_password>
export JWT_SECRET=<very-long-random-string-32-chars-min>
export JWT_EXPIRATION=86400000
export CORS_ALLOWED_ORIGINS=https://attendease.com
```

## Health Checks

### Backend

```bash
curl https://api.attendease.com/api/v1/auth/health
```

### Frontend

```bash
# Check if site loads
curl -I https://attendease.com
```

## Rollback Plan

1. **Keep Previous Version**:
   ```bash
   # Tag releases
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Quick Rollback**:
   ```bash
   # Docker
   docker run -d -p 8080:8080 attendease-api:0.9.0
   
   # Kubernetes
   kubectl rollout undo deployment/attendease-api
   ```

## Post-Deployment Checks

- [ ] API health check endpoint responds
- [ ] Database connections successful
- [ ] JWT tokens generate correctly
- [ ] Authentication flow works
- [ ] Frontend loads without errors
- [ ] Mobile app connects to API
- [ ] Logs are being collected
- [ ] Monitoring/alerting is active
- [ ] Backups are scheduled
- [ ] SSL certificate is valid

## Support & Troubleshooting

For deployment issues, check:
- Application logs: `docker logs <container_id>`
- Database connection
- Network/firewall rules
- Environment variables
- Disk space and memory
