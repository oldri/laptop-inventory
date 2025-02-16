# Laptop Inventory Management Application

This application manages a company's laptop inventory using a full-stack architecture with a modern tech stack.

---

## Device Management System

### Overview

The **Device Management System** is a web-based platform designed to help organizations efficiently manage their IT assets. The system provides **user management, device tracking, warranty integration, and request handling** for laptop assignments and purchases.

## Table of Contents

-   [Overview](#overview)
-   [User Roles and Access](#user-roles-and-access)
-   [Explanation of Models](#explanation-of-models)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Contributing](#contributing)
-   [License](#license)

---

## User Roles and Access

### Super Admin

-   **Responsibilities:**

    -   Create, update, and delete Admins.
    -   Process requests made by Admins (e.g., approve/reject `NEW_DEVICE` or `DEVICE_ASSIGNMENT` requests).
    -   Oversee all system activities (e.g., view logs, monitor performance).

-   **Access:**
    -   Full CRUD access to all entities (users, devices, warranties, requests).
    -   Ability to assign devices to Employees or other Admins.

### Admin

-   **Responsibilities:**

    -   Manage devices (create, update, delete, assign).
    -   Submit requests for new devices or device assignments.
    -   Assign devices to Employees (once approved by the Super Admin).

-   **Access:**
    -   CRUD access to devices and warranties.
    -   Read-only access to Employee details.
    -   Can only process requests if delegated by the Super Admin.

### Employee

-   **Responsibilities:**

    -   Use the assigned device.
    -   Report issues (e.g., device malfunction, warranty claims).

-   **Access:**
    -   View their assigned devices and warranty details.
    -   No access to the management system.

---

## Explanation of Models

### Device

-   **Purpose:** Represents a laptop in the inventory, tracking details, status, and user assignment.
-   **Fields:**
    -   `id`: Unique identifier for the device (auto-generated).
    -   `serialNumber`: Unique identifier for the device.
    -   `manufacturer`: Manufacturer of the device.
    -   `modelName`: The model of the device.
    -   `status`: Current status (`AVAILABLE`, `ASSIGNED`, `MAINTENANCE`).
    -   `assignedUser`: User to whom the device is assigned (nullable if unassigned).
    -   `purchaseDate`: Date the device was purchased.
    -   `condition`: Condition of the device (`NEW`, `USED`, `REFURBISHED`, `DAMAGED`).
    -   `location`: Current location of the device (`WAREHOUSE`, `OFFICE_HQ`, `OFFICE_BRANCH`, `WITH_EMPLOYEE`, `IN_TRANSIT`).
    -   `warranties`: List of associated warranties.
    -   `createTime`: Timestamp when the device was created.
    -   `updateTime`: Timestamp when the device was last updated.
-   **Relationships:**
    -   Many-to-One with User (assigned user).
    -   One-to-Many with Warranty.
-   **Journey:**
    -   **Creation:** Added by Admin or Super Admin.
    -   **Assignment:** Assigned via `DEVICE_ASSIGNMENT` request.
    -   **Maintenance:** Status updated if malfunctioning.
    -   **Decommissioning:** Deleted if no longer in use.

---

### DeviceRequest

-   **Purpose:** Handles requests for new devices or device assignments.
-   **Fields:**
    -   `id`: Unique identifier for the request (auto-generated).
    -   `requester`: Admin or Super Admin who made the request.
    -   `processedBy`: Admin or Super Admin who processed the request.
    -   `requestedDate`: Date the request was made.
    -   `type`: Request type (`NEW_DEVICE` or `DEVICE_ASSIGNMENT`).
    -   `status`: Request status (`PENDING`, `APPROVED`, `REJECTED`).
    -   `device`: Device being assigned (nullable for `NEW_DEVICE` requests).
    -   `quantity`: Number of devices requested (for `NEW_DEVICE` requests).
    -   `notes`: Additional request details.
    -   `reasonForRejection`: Reason for rejecting the request (if applicable).
    -   `priority`: Priority of the request (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
    -   `createTime`: Timestamp when the request was created.
    -   `updateTime`: Timestamp when the request was last updated.
-   **Relationships:**
    -   Many-to-One with User (requester and processedBy).
    -   Many-to-One with Device (for `DEVICE_ASSIGNMENT` requests).
-   **Journey:**
    -   **Creation:** Request created by Admin or Super Admin.
    -   **Processing:** Reviewed and processed by Super Admin or delegated Admin.
    -   **Fulfillment:** New devices added or assigned to specified user.

---

### Warranty

-   **Purpose:** Tracks warranty details for devices.
-   **Fields:**
    -   `id`: Unique identifier for the warranty (auto-generated).
    -   `warrantyId`: Unique identifier for the warranty.
    -   `startDate`: Warranty start date.
    -   `endDate`: Warranty end date.
    -   `type`: Warranty type (`STANDARD`, `EXTENDED`, `PREMIUM`, `THIRD_PARTY`).
    -   `description`: Additional warranty details.
    -   `createTime`: Timestamp when the warranty was created.
    -   `updateTime`: Timestamp when the warranty was last updated.
-   **Relationships:**
    -   Many-to-One with Device.
-   **Journey:**
    -   **Creation:** Added when a device is created or updated.
    -   **Linking:** Linked to a specific device.
    -   **Expiration:** Marked as expired when `endDate` is reached.

---

### User

-   **Purpose:** Represents individuals interacting with the system, tracking details, roles, and assigned devices.
-   **Fields:**
    -   `id`: Unique identifier for the user (auto-generated).
    -   `username`: Unique identifier for the user.
    -   `password`: Encrypted password for authentication.
    -   `email`: User's email address.
    -   `firstName`: User's first name.
    -   `lastName`: User's last name.
    -   `phoneNumber`: User's phone number (in international format).
    -   `role`: User's role (`ADMIN`, `SUPER_ADMIN`, `EMPLOYEE`).
    -   `department`: User's department (`HR`, `TECH`, `CONSULTING`, `MANAGEMENT`, `FINANCE`, `OPERATIONS`).
    -   `isActive`: Indicates if the user account is active.
    -   `requests`: List of requests made by the user (for Admins/Super Admins).
    -   `assignedDevices`: List of devices assigned to the user (for Employees/Admins).
    -   `createTime`: Timestamp when the user was created.
    -   `updateTime`: Timestamp when the user was last updated.
-   **Relationships:**
    -   One-to-Many with `DeviceRequest` (as requester).
    -   One-to-Many with `Device` (as assigned user).
-   **Journey:**
    -   **Creation:** Created by Super Admin or Admin (for Employees).
    -   **Authentication:** Logs in using username and password.
    -   **Role-Based Access:**
        -   **Super Admin:** Full system access.
        -   **Admin:** Limited access to manage devices and requests.
        -   **Employee:** Access to view assigned devices and warranties.
    -   **Deactivation:** Account deactivated if no longer needed.

---

## Summary of Model Functionality

| Model           | Purpose                                                 | Key Fields                                                                                                                     | Relationships                                               |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `User`          | Represents individuals interacting with the system.     | `username`, `password`, `email`, `firstName`, `lastName`, `phoneNumber`, `role`, `department`, `isActive`                      | One-to-Many with `DeviceRequest`, One-to-Many with `Device` |
| `Device`        | Represents a laptop in the inventory.                   | `serialNumber`, `manufacturer`, `modelName`, `status`, `assignedUser`, `purchaseDate`, `condition`, `location`                 | Many-to-One with User, One-to-Many with Warranty            |
| `DeviceRequest` | Handles requests for new devices or device assignments. | `requester`, `processedBy`, `requestedDate`, `type`, `status`, `device`, `quantity`, `notes`, `reasonForRejection`, `priority` | Many-to-One with User, Many-to-One with Device              |
| `Warranty`      | Tracks warranty details for devices.                    | `warrantyId`, `startDate`, `endDate`, `type`, `description`                                                                    | Many-to-One with Device                                     |

---

## Enums

### Department

-   `HR`: Human Resources
-   `TECH`: Technology
-   `CONSULTING`: Consulting
-   `MANAGEMENT`: Management
-   `FINANCE`: Finance
-   `OPERATIONS`: Operations

### DeviceCondition

-   `NEW`: Brand New
-   `USED`: Used
-   `REFURBISHED`: Refurbished
-   `DAMAGED`: Damaged

### DeviceLocation

-   `OFFICE_HQ`: Headquarters
-   `OFFICE_BRANCH`: Branch Office
-   `WAREHOUSE`: Warehouse
-   `WITH_EMPLOYEE`: With Employee
-   `IN_TRANSIT`: In Transit

### DeviceStatus

-   `AVAILABLE`: Available
-   `ASSIGNED`: Assigned
-   `MAINTENANCE`: Maintenance

### RequestPriority

-   `LOW`: Low Priority
-   `MEDIUM`: Medium Priority
-   `HIGH`: High Priority
-   `URGENT`: Urgent

### RequestStatus

-   `PENDING`: Pending
-   `APPROVED`: Approved
-   `REJECTED`: Rejected

### RequestType

-   `NEW_DEVICE`: New Device
-   `DEVICE_ASSIGNMENT`: Device Assignment

### UserRole

-   `ADMIN`: Admin
-   `SUPER_ADMIN`: Super Admin
-   `EMPLOYEE`: Employee

### WarrantyStatus

-   `PENDING`: Not Yet Active
-   `ACTIVE`: Active
-   `EXPIRED`: Expired

### WarrantyType

-   `STANDARD`: Standard Warranty
-   `EXTENDED`: Extended Warranty
-   `PREMIUM`: Premium Warranty
-   `THIRD_PARTY`: Third Party Warranty

---

## Data Transfer Objects (DTOs)

### DeviceCreateDTO

-   **Purpose:** Used for creating a new device.

-   **Fields:**
    -   `serialNumber`: Unique identifier for the device (required, max 50 characters).
    -   `manufacturer`: Manufacturer of the device (required, max 100 characters).
    -   `modelName`: Model of the device (required, max 100 characters).
    -   `purchaseDate`: Date the device was purchased (required).
    -   `condition`: Condition of the device (required, enum: `NEW`, `USED`, `REFURBISHED`, `DAMAGED`).
    -   `location`: Current location of the device (required, enum: `WAREHOUSE`, `OFFICE_HQ`, `OFFICE_BRANCH`, `WITH_EMPLOYEE`, `IN_TRANSIT`).

### DeviceDTO

-   **Purpose:** Represents a device in the system.

-   **Fields:**
    -   `id`: Unique identifier for the device.
    -   `serialNumber`: Unique identifier for the device.
    -   `manufacturer`: Manufacturer of the device.
    -   `modelName`: Model of the device.
    -   `status`: Current status of the device (enum: `AVAILABLE`, `ASSIGNED`, `MAINTENANCE`).
    -   `condition`: Condition of the device (enum: `NEW`, `USED`, `REFURBISHED`, `DAMAGED`).
    -   `location`: Current location of the device (enum: `WAREHOUSE`, `OFFICE_HQ`, `OFFICE_BRANCH`, `WITH_EMPLOYEE`, `IN_TRANSIT`).
    -   `purchaseDate`: Date the device was purchased.
    -   `assignedUser`: User to whom the device is assigned (nullable).
    -   `warranties`: List of associated warranties.
    -   `createTime`: Timestamp when the device was created.
    -   `updateTime`: Timestamp when the device was last updated.

### DeviceRequestCreateDTO

-   **Purpose:** Used for creating a new device request.

-   **Fields:**
    -   `type`: Type of request (required, enum: `NEW_DEVICE`, `DEVICE_ASSIGNMENT`).
    -   `deviceId`: ID of the device being assigned (required for `DEVICE_ASSIGNMENT`).
    -   `quantity`: Number of devices requested (required for `NEW_DEVICE`, min value: 1).
    -   `requestedDate`: Date the request was made (required).
    -   `priority`: Priority of the request (required, enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT`).
    -   `notes`: Additional request details.

### DeviceRequestDTO

-   **Purpose:** Represents a device request in the system.

-   **Fields:**
    -   `id`: Unique identifier for the request.
    -   `requester`: User who made the request.
    -   `processedBy`: User who processed the request.
    -   `type`: Type of request (enum: `NEW_DEVICE`, `DEVICE_ASSIGNMENT`).
    -   `status`: Status of the request (enum: `PENDING`, `APPROVED`, `REJECTED`).
    -   `priority`: Priority of the request (enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT`).
    -   `device`: Device being assigned (nullable for `NEW_DEVICE` requests).
    -   `quantity`: Number of devices requested.
    -   `notes`: Additional request details.
    -   `reasonForRejection`: Reason for rejecting the request (nullable).
    -   `requestedDate`: Date the request was made.
    -   `createTime`: Timestamp when the request was created.
    -   `updateTime`: Timestamp when the request was last updated.

### UserCreateDTO

-   **Purpose:** Used for creating a new user.

-   **Fields:**
    -   `username`: Unique identifier for the user (required, max 50 characters).
    -   `password`: Encrypted password for authentication (required, min 8 characters).
    -   `email`: User's email address (required, valid email format).
    -   `firstName`: User's first name (required, max 50 characters).
    -   `lastName`: User's last name (required, max 50 characters).
    -   `phoneNumber`: User's phone number (required, international format).
    -   `role`: User's role (required, enum: `ADMIN`, `SUPER_ADMIN`, `EMPLOYEE`).
    -   `department`: User's department (required, enum: `HR`, `TECH`, `CONSULTING`, `MANAGEMENT`, `FINANCE`, `OPERATIONS`).

### UserDTO

-   **Purpose:** Represents a user in the system.

-   **Fields:**
    -   `id`: Unique identifier for the user.
    -   `username`: Unique identifier for the user.
    -   `email`: User's email address.
    -   `firstName`: User's first name.
    -   `lastName`: User's last name.
    -   `phoneNumber`: User's phone number.
    -   `role`: User's role (enum: `ADMIN`, `SUPER_ADMIN`, `EMPLOYEE`).
    -   `department`: User's department (enum: `HR`, `TECH`, `CONSULTING`, `MANAGEMENT`, `FINANCE`, `OPERATIONS`).
    -   `isActive`: Indicates if the user account is active.

### WarrantyCreateDTO

-   **Purpose:** Used for creating a new warranty.

-   **Fields:**
    -   `warrantyId`: Unique identifier for the warranty (required, max 50 characters).
    -   `startDate`: Warranty start date (required).
    -   `endDate`: Warranty end date (required).
    -   `type`: Warranty type (required, enum: `STANDARD`, `EXTENDED`, `PREMIUM`, `THIRD_PARTY`).
    -   `description`: Additional warranty details.

### WarrantyDTO

-   **Purpose:** Represents a warranty in the system.

-   **Fields:**
    -   `id`: Unique identifier for the warranty.
    -   `warrantyId`: Unique identifier for the warranty.
    -   `startDate`: Warranty start date.
    -   `endDate`: Warranty end date.
    -   `type`: Warranty type (enum: `STANDARD`, `EXTENDED`, `PREMIUM`, `THIRD_PARTY`).
    -   `description`: Additional warranty details.
    -   `status`: Computed warranty status (enum: `PENDING`, `ACTIVE`, `EXPIRED`).

### AuthenticationRequest

-   **Purpose:** Used for authenticating a user.

-   **Fields:**
    -   `username`: Username of the user (required).
    -   `password`: Password of the user (required).

### AuthenticationResponse

-   **Purpose:** Represents the response after a successful authentication.

-   **Fields:**
    -   `token`: Authentication token generated upon successful login.
    -   `user`: User details represented by `UserDTO`.

---

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
│ │ │ │ ├── /exception # Exceptions
│ │ │ │ ├── /controller # REST controllers
│ │ │ │ │ ├── /auth # Auth controllers
│ │ │ │ │ └── /device # Device controllers
│ │ │ │ ├── /service # Service layer
│ │ │ │ │ ├── /auth # Auth services
│ │ │ │ │ └── /device # Device services
│ │ │ │ ├── /repository # Repository layer
│ │ │ │ ├── /model # Entity models
│ │ │ │ ├── /dto # Data Transfer Objects
│ │ │ │ ├── /config # Configuration files
│ │ │ │ │ ├── /local # Local environment config
│ │ │ │ │ ├── /dev # Development environment config
│ │ │ │ │ └── /prod # Production environment config
│ │ │ │ ├── /security # Security files
│ │ │ │ │ ├── /utils # Utils config
│ │ │ │ │ ├── /config # Security config
│ │ │ │ │ └── /jwt # Jwt config
│ │ │ │ └── Application.java # Main application class
│ │ │ └── /resources
│ │ │ │ ├── /db # Database files
│ │ │ │ │ └── /migration # Migration files
│ │ │ │ ├── V1__create_users_table.sql
│ │ │ │ ├── V2__create_devices_table.sql
│ │ │ │ ├── V3__create_warranties_table.sql
│ │ │ │ ├── V4__create_device_requests_table.sql
│ │ │ │ ├── V5__insert_super_admin_user.sql
│ │ │ │ ├── V6__insert_dummy_data_into_devices_table.sql
│ │ │ │ └── V7__insert_warranty_data_into_warranty_table.sql
│ │ │ │ ├── application.properties # Application properties
│ │ │ │ ├── application-local.properties # Local environment properties
│ │ │ │ ├── application-dev.properties # Development environment properties
│ │ │ │ ├── application-prod.properties # Production environment properties
│ │ │ │ └── logback.xml # Logback configuration
│ │ └── /test
│ │ ├── /controller # Controller tests
│ │ ├── /service # Service tests
│ │ └── /repository # Repository tests
│ ├── build.gradle # Gradle build file
│ └── Dockerfile # Docker configuration
│
├── /frontend # Frontend code
│ ├── /public # Static files
│ ├── /src
│ │ ├── /assets # App assets
│ │ ├── /types # Types for data, API responses, etc
│ │ ├── /components # Reusable React components
│ │ │ ├── device # Device components
│ │ │ └── /common # Common components shared across the app
│ │ ├── /pages # Page components
│ │ ├── /routes # Route components
│ │ ├── /layouts # Layout components
│ │ ├── /store # Redux store and slices
│ │ │ ├── auth # Auth store
│ │ │ ├── device # Device store
│ │ │ └── index.ts
│ │ ├── /services # API services
│ │ ├── /utils # Utility functions
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
├── .env # Environment variables
├── .env.example # Example environment variables
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
    git clone git@github.com:oldri/laptop-inventory.git
    cd laptop-inventory-app
    ```

2. **Set up environment variables**:

    - Copy `.env.example` to `.env.local` and update the values:
        ```bash
        cp .env.example .env.local
        ```
    - Ensure the following variables are set in `.env.local`:
        ```bash
        POSTGRES_DB=laptop_inventory
        POSTGRES_USER=oldri
        POSTGRES_PASSWORD=oldri
        SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/laptop_inventory
        SPRING_DATASOURCE_USERNAME=oldri
        SPRING_DATASOURCE_PASSWORD=oldri
        SPRING_FLYWAY_ENABLED=true
        VITE_API_URL=http://localhost:8080
        ```

3. **Set up the backend**:

    ```bash
    cd backend
    ./gradlew build # Builds the backend
    ```

4. **Set up the frontend**:

    ```bash
    cd frontend
    npm install # Installs dependencies
    ```

5. **Database Migrations**:
   This project uses **Flyway** for database migrations. Migrations are located in `src/main/resources/db/migration`.

    #### Running Migrations

    Migrations are applied automatically when the backend service starts. To apply migrations manually, you can use the following command:

    ```bash
    cd backend
    ./gradlew flywayMigrate
    ```

    #### Verifying Migrations

    - Check the logs for Flyway messages:
        ```bash
        docker-compose logs backend
        ```
    - Connect to the database and verify the tables:
        ```bash
        docker exec -it <db_container_id> psql -U oldri -d laptop_inventory
        \dt
        ```

    #### Adding New Migrations

    - Create a new SQL script in `src/main/resources/db/migration` following the naming convention:
        ```
        V<version>__<description>.sql
        ```
    - Restart the backend service to apply the new migration:
        ```bash
        docker-compose up --build backend
        ```

6. **Run the application**:

    ```bash
    docker-compose down -v
    docker-compose up --build
    ```

7. **Access the application**:
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **Backend**: [http://localhost:8080](http://localhost:8080)
    - **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## Customization

-   **Environment Variables**: Ensure `.env.local`, `.env.dev`, and `.env.prod` are configured.
-   **CI/CD**: GitHub Actions or another tool can automate testing and deployment.
-   **Database Migrations**: Flyway migrations are applied automatically when the backend starts.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.
