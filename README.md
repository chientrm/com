# Software Requirements Specification (SRS)

## Table of Contents

1. [Introduction](#introduction)
2. [System Features](#system-features)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [External Interfaces](#external-interfaces)
6. [Assumptions and Constraints](#assumptions-and-constraints)
7. [Installation and Setup](#installation-and-setup)

---

## Introduction

This application is a web-based system designed to provide user authentication, system administration tools, and log management. It includes features for user registration, login, and role-based access control. Administrators can view system logs and manage services.

---

## System Features

### 1. User Authentication

-   Users can register and log in using a username and password.
-   CAPTCHA verification is required for registration and login to prevent automated abuse.
-   JSON Web Tokens (JWT) are used for session management.

### 2. Role-Based Access Control

-   Users are assigned roles (`user` or `admin`).
-   Admin users have access to additional features like system logs and service management.

### 3. System Logs

-   Admin users can view system logs using `journalctl`.
-   Logs are displayed in a structured format with details like timestamp, hostname, service, PID, priority, and message.

### 4. Service Management

-   Admin users can view and search for active system services using `systemctl`.

### 5. Photo Gallery

-   Users can upload photos to the gallery.
-   Users can preview uploaded photos.
-   Users can delete photos from the gallery.

---

## Functional Requirements

### User Authentication

-   **Register**: Users must provide a valid username, password, and CAPTCHA token.
-   **Login**: Users must provide valid credentials and a CAPTCHA token to receive a JWT.
-   **Token Verification**: JWTs are verified for protected routes.

### Role-Based Access Control

-   **Admin Access**: Only users with the `admin` role can access admin-specific routes.

### System Logs

-   **View Logs**: Admin users can view the latest 100 system logs.
-   **Filter Logs by Service**: Admin users can view logs for a specific service.

### Service Management

-   **View Services**: Admin users can view a list of active services.
-   **Search Services**: Admin users can search for services by name.

### Photo Gallery

-   **Upload Photo**: Users can upload photos in JPEG, PNG, or GIF format.
-   **View Photos**: Users can view all uploaded photos.
-   **Delete Photo**: Users can delete photos from the gallery.

---

## Non-Functional Requirements

-   **Security**:
    -   Passwords are hashed using `bcrypt`.
    -   JWTs are signed and verified using a secret key.
    -   CAPTCHA is used to prevent automated abuse.
-   **Performance**:
    -   The system should handle up to 100 concurrent users.
    -   Log retrieval and service management commands should execute within 2 seconds.
-   **Scalability**:
    -   The application should be easily deployable on different environments.
-   **Maintainability**:
    -   The codebase is modular and follows best practices for readability and maintainability.

---

## External Interfaces

### 1. User Interface

-   The frontend is built using React and provides a responsive design for both desktop and mobile users.

### 2. API Endpoints

-   `/api/login`: User login.
-   `/api/register`: User registration.
-   `/api/check-auth`: Verify user authentication.
-   `/api/admin/journalctl`: Retrieve system logs.
-   `/api/admin/systemctl`: Retrieve active services.
-   `/api/admin/journalctl/:serviceName`: Retrieve logs for a specific service.
-   `/api/gallery`: Retrieve all photos (GET) or upload a photo (POST).
-   `/api/gallery/:photoName`: Delete a specific photo (DELETE).

### 3. External Services

-   **CAPTCHA Verification**: Cloudflare Turnstile API is used for CAPTCHA validation.
-   **System Commands**: `journalctl` and `systemctl` are used for log and service management.

---

## Assumptions and Constraints

-   The application assumes the availability of `journalctl` and `systemctl` commands on the server.
-   The database is a local SQLite database (`local.db`).
-   Environment variables must be configured for the application to function correctly:
    -   `PORT`: Port number for the server.
    -   `TURNSTILE_SECRET`: Secret key for CAPTCHA verification.
    -   `JWT_SECRET`: Secret key for JWT signing.

---

## Installation and Setup

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   SQLite installed on the server

### Steps

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=3000
    TURNSTILE_SECRET=<your-turnstile-secret>
    JWT_SECRET=<your-jwt-secret>
    ```

4. Start the server:

    ```bash
    npm start
    ```

5. Access the application:
   Open your browser and navigate to `http://localhost:<PORT>`.

6. Ensure the `uploads` directory exists in the project root:

    ```bash
    mkdir uploads
    ```

---

## Future Enhancements

-   Add support for multi-language localization.
-   Implement advanced log filtering and export options.
-   Integrate with external monitoring tools for enhanced system insights.
