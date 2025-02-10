plugins {
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("java")
}

group = "com.oldri.laptopinventory"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Dependencies
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // Database and Flyway
    implementation("org.postgresql:postgresql") 
    // JWT Authentication
    implementation("io.jsonwebtoken:jjwt-api:0.11.5") 
    implementation("io.jsonwebtoken:jjwt-impl:0.11.5")  
    implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")  
    
    // SpringDoc for OpenAPI Documentation (optional)
    implementation("org.springdoc:springdoc-openapi-ui:1.6.14")

    // Flyway for database migration
    implementation("org.flywaydb:flyway-core")

    // Lombok
    implementation("org.projectlombok:lombok:1.18.24")
    annotationProcessor("org.projectlombok:lombok:1.18.24")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")

    // Development
    developmentOnly("org.springframework.boot:spring-boot-devtools")
}


tasks.test {
    useJUnitPlatform()
}

tasks.bootRun {
    mainClass.set("com.oldri.laptopinventory.Application") 
}