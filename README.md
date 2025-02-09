# Laptop Inventory Management Application

This application manages a company's laptop inventory using a full-stack architecture with a modern tech stack.

## Tech Stack

### Frontend

-   **Framework**: React with Vite
-   **Language**: TypeScript
-   **State Management**: Redux
-   **Routing**: React Router
-   **Styling**: Tailwind CSS (or Material-UI)
-   **API Client**: Axios
-   **Testing**: Jest, React Testing Library

### Backend

-   **Language**: Java
-   **Framework**: Spring Boot
-   **ORM**: Hibernate
-   **Database**: PostgreSQL
-   **Security**: Spring Security
-   **Validation**: Spring Boot Starter Validation
-   **Testing**: Spring Boot Starter Test, Spring Security Test
-   **API Documentation**: Springdoc OpenAPI (Swagger)

### DevOps

-   **Containerization**: Docker
-   **Orchestration**: Docker Compose
-   **CI/CD**: GitHub Actions
-   **Monitoring**: Prometheus, Grafana

## Project Structure

/laptop-inventory-app
│
├── /backend # Backend code
│ ├── /src
│ │ ├── /main
│ │ │ ├── /java/com/yourcompany/laptopinventory
│ │ │ │ ├── /controller # REST controllers
│ │ │ │ ├── /service # Service layer
│ │ │ │ ├── /repository # Repository layer
│ │ │ │ ├── /model # Entity models
│ │ │ │ ├── /dto # Data Transfer Objects
│ │ │ │ ├── /config # Configuration files
│ │ │ │ │ ├── /local # Local environment config
│ │ │ │ │ ├── /dev # Development environment config
│ │ │ │ │ └── /prod # Production environment config
│ │ │ │ ├── /security # Security configuration
│ │ │ │ └── Application.java # Main application class
│ │ │ └── /resources
│ │ │ ├── application.properties # Application properties
│ │ │ ├── application-local.properties # Local environment properties
│ │ │ ├── application-dev.properties # Development environment properties
│ │ │ ├── application-prod.properties # Production environment properties
│ │ │ └── logback.xml # Logback configuration
│ │ └── /test
│ │ └── /java/com/yourcompany/laptopinventory
│ │ ├── /controller # Controller tests
│ │ ├── /service # Service tests
│ │ └── /repository # Repository tests
│ ├── build.gradle # Gradle build file
│ └── Dockerfile # Docker configuration
│
├── /frontend # Frontend code
│ ├── /public # Static files
│ ├── /src
│ │ ├── /components # Reusable React components
│ │ │ └── /common # Common components shared across the app
│ │ ├── /pages # Page components
│ │ ├── /store # Redux store and slices
│ │ ├── /services # API services
│ │ ├── /utils # Utility functions
│ │ ├── /dtos # Data Transfer Objects for API responses
│ │ ├── /config # Configuration files
│ │ │ ├── env.local # Local environment variables
│ │ │ ├── env.dev # Development environment variables
│ │ │ └── env.prod # Production environment variables
│ │ ├── App.tsx # Main App component
│ │ ├── index.tsx # Entry point
│ │ └── setupTests.ts # Test setup
│ ├── package.json # NPM dependencies and scripts
│ ├── tsconfig.json # TypeScript configuration
│ └── Dockerfile # Docker configuration
│
├── /docs # Documentation
│ ├── /api # API documentation (e.g., Swagger)
│ └── /architecture # Architecture diagrams and documents
│
├── /devops # DevOps scripts and configurations
│ ├── /kubernetes # Kubernetes manifests
│ │ ├── /local # Local Kubernetes config
│ │ ├── /dev # Development Kubernetes config
│ │ └── /prod # Production Kubernetes config
│ ├── /ci-cd # CI/CD pipeline configurations
│ └── docker-compose.yml # Docker Compose configuration
│
├── .env.local # Local environment variables
├── .env.dev # Development environment variables
├── .env.prod # Production environment variables
├── .gitignore # Git ignore file
├── README.md # Project README
└── LICENSE # Project license

## Getting Started

### Prerequisites

-   Node.js and npm
-   Java Development Kit (JDK)
-   Docker
-   PostgreSQL

### Installation

1. **Clone the repository**:

    ```bash
    git clone git@github.com\:oldri/laptop-inventory.git
    cd laptop-inventory-app
    ```

2. **Set up the backend**:
   cd backend
   ./gradlew build

3. **Set up the frontend**:
   cd frontend
   npm install

4. **Run the application**:
   sudo docker-compose down -v
   sudo docker-compose up --build

5. **Access the application**:
   Frontend: http://localhost:5173
   Backend: http://localhost:8080
   Swagger UI: http://localhost:8080/swagger-ui.html

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

This project is licensed under the MIT License.

### Customization

-   **Environment Variables**: Ensure that your environment variable files (`.env.local`, `.env.dev`, `.env.prod`) are correctly set up with your database credentials and other configurations.
-   **CI/CD**: Set up GitHub Actions or another CI/CD tool to automate testing and deployment.
-   **Documentation**: Add more detailed documentation as needed, especially for API endpoints and usage instructions.

This `README.md` should provide a solid foundation for your project. Adjust the content as needed to fit your specific project details.
