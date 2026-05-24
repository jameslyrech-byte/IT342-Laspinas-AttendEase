FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the Maven build file
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the application
RUN apt-get update && apt-get install -y maven && \
    mvn clean package -DskipTests && \
    mv target/attendease-backend-*.jar app.jar && \
    rm -rf target ~/.m2

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
