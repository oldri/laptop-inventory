FROM --platform=linux/arm64/v8 openjdk:17-slim
WORKDIR /app
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]