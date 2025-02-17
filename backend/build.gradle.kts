plugins {
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("java")
    id("org.flywaydb.flyway") version "9.22.0" // Add the Flyway Gradle plugin
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
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    
    // Database and Flyway
    implementation("org.postgresql:postgresql") // Ensure this is present
    // JWT Authentication
    implementation("io.jsonwebtoken:jjwt-api:0.11.5") 
    implementation("io.jsonwebtoken:jjwt-impl:0.11.5")  
    implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")  
    
    // Swagger (Springdoc OpenAPI)
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")

    // Flyway for database migration
    implementation("org.flywaydb:flyway-core")

    // ModelMapper for DTO conversions
    implementation("org.modelmapper:modelmapper:3.1.1")

    // Logging
    implementation("org.slf4j:slf4j-api")

    // Lombok
    implementation("org.projectlombok:lombok:1.18.24")
    annotationProcessor("org.projectlombok:lombok:1.18.24")

    // Jackson Dependencies (Added for JSON mapping)
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")

    // Runtime only
    runtimeOnly("org.postgresql:postgresql")

    // Development
    developmentOnly("org.springframework.boot:spring-boot-devtools")
}

flyway {
    url = "jdbc:postgresql://localhost:5432/laptop_inventory"
    user = "oldri" // Replace with your database username
    password = "oldri" // Replace with your database password
    driver = "org.postgresql.Driver" // Explicitly specify the driver
    locations = listOf("filesystem:src/main/resources/db/migration").toTypedArray() // Convert to Array
}

tasks.withType<org.flywaydb.gradle.task.AbstractFlywayTask> {
    notCompatibleWithConfigurationCache("Flyway tasks are not compatible with the configuration cache")
}

tasks.test {
    useJUnitPlatform()
}

tasks.bootRun {
    mainClass.set("com.oldri.laptopinventory.Application") 
}