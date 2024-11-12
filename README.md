# **International Payment System - Risk Rangers**

Welcome to the **International Payment System**. This system allows customers to register and securely make international payments while providing bank employees with the tools to monitor and verify transactions. The project has been developed by **The Risk Rangers** team.

Click the link to view a video demonstration of the application:
[![Video Demonstration](https://img.youtube.com/vi/Ji18npE8pRs/0.jpg)](https://youtu.be/Ji18npE8pRs)

---

## **Table of Contents**

1. [Project Overview](#project-overview)
2. [Team Members](#team-members)
3. [Project Setup Instructions](#project-setup-instructions)
    - [Pre-requisites](#pre-requisites)
    - [Clone the Repository](#clone-the-repository)
    - [Setting Up SSL for Local Development](#setting-up-ssl-for-local-development)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
4. [Technologies Used](#technologies-used)
5. [Features](#features)
    - [1. User Registration](#1-user-registration)
    - [2. User Login](#2-user-login)
    - [3. International Payment](#3-international-payment)
    - [4. Employee Dashboard](#4-employee-dashboard)
    - [5. Protected Routes](#5-protected-routes)
    - [6. Customer Transaction History](#6-customer-transaction-history)
    - [7. Admin Management](#7-admin-management)
    - [8. Currency Converter API](#8-currency-converter-api)
6. [Upcoming Features](#upcoming-features)
7. [API Endpoints](#api-endpoints)
    - [User Authentication](#user-authentication)
    - [Transaction Routes](#transaction-routes)
    - [Admin Routes](#admin-routes)
    - [Currency Converter API](#currency-converter-api-endpoints)
8. [Testing the API](#testing-the-api)
9. [Seeding Default Admin](#seeding-default-admin)
10. [Known Issues](#known-issues)
11. [References](#references)
12. [License](#license)

---

## **Project Overview**

The **International Payment System** is designed for a fictional international bank, enabling users to:

- **Register** an account using their ID and password.
- **Log in** using their credentials.
- **Make international payments** by entering account information, SWIFT codes, and the payment amount.
- **View and manage transactions** securely.
- **Bank employees** can access a protected portal to verify and forward payments through SWIFT.
- **Admins** can manage other admin accounts and authorize payments.
- **Currency Conversion** functionality to assist users in making informed payment decisions.

---

## **Team Members**

- **Mpho Ndlela** - Team Lead
- **Alec Cowan** - Developer
- **Lucian Young** - UI Designer
- **Anele Siwela** - Back-End Developer

---

## **Project Setup Instructions**

### **Pre-requisites**

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **MongoDB** (Local or Cloud Instance) - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **OpenSSL** for creating SSL certificates - [OpenSSL Downloads](https://www.openssl.org/source/)
- **mkcert** for generating local SSL certificates - [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- **Postman** or **cURL** for API testing - [Postman](https://www.postman.com/)
- **Axios** for making HTTP requests in the frontend - [Axios Documentation](https://axios-http.com/)

### **Clone the Repository**

Begin by cloning the repository to your local machine:

```bash
git clone https://github.com/your-repo/international-payment-system.git
cd international-payment-system
```

### **Setting Up SSL for Local Development**

Secure communication is essential for handling sensitive financial data. Follow these steps to set up SSL for local development:

1. **Generate SSL Keys**

   **Using mkcert:**

   mkcert simplifies the process of generating locally trusted SSL certificates.

   - **Install mkcert on Windows:**

     ```bash
     choco install mkcert
     ```

     For other operating systems, refer to the [mkcert installation guide](https://github.com/FiloSottile/mkcert#installation).

   - **Install the Local CA:**

     ```bash
     mkcert -install
     ```

   - **Generate the Local Certificate for `localhost`:**

     ```bash
     mkcert localhost 127.0.0.1 ::1
     ```

     This command will generate two files:
     - `localhost+2.pem` (Certificate)
     - `localhost+2-key.pem` (Private Key)

2. **Move the Keys to the Keys Folder**

   Organize the SSL certificates within your project structure:

   ```bash
   /Customer_Portal
   ├── backend
   ├── frontend
   ├── keys
       ├── privatekey.pem
       ├── server.crt
   ```

   Rename and move the generated files:

   - `localhost+2.pem` → `server.crt`
   - `localhost+2-key.pem` → `privatekey.pem`

3. **Update the Server Configuration**

   Configure your server to use the SSL certificates by updating the `server.js` file:

   ```javascript
   const https = require('https');
   const fs = require('fs');
   const app = require('./app'); // Assuming your Express app is exported from app.js

   const sslOptions = {
     key: fs.readFileSync('keys/privatekey.pem'), // Path to your private key
     cert: fs.readFileSync('keys/server.crt')    // Path to your certificate
   };

   https.createServer(sslOptions, app).listen(5000, () => {
     console.log('Secure server running on https://localhost:5000');
   });
   ```

   Ensure that the paths to `privatekey.pem` and `server.crt` are correct.

4. **Verify HTTPS is Working**

   Start your server:

   ```bash
   node server.js
   ```

   Open your browser and navigate to: [https://localhost:5000](https://localhost:5000)

   You should see a security warning due to the self-signed certificate. Proceed to view your application over HTTPS.

### **Backend Setup**

1. **Install Dependencies**

   Navigate to the backend directory and install necessary packages:

   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` File**

   Create a `.env` file in the `backend/` directory with the following environment variables:

   ```env
   MONGO_URI=mongodb+srv://lubertyoung:lucian5y@customer-portal.jjyzu.mongodb.net/?retryWrites=true&w=majority&appName=Customer-Portal
   JWT_SECRET=supersecretjwtkey12345
   HTTPS=true
   SSL_CRT_FILE=keys/server.crt
   SSL_KEY_FILE=keys/privatekey.pem
   REACT_APP_EXCHANGE_API_KEY=f94f4079a907ed37eb70b4b9
   ```

   **Note:** Replace the `MONGO_URI` with your actual MongoDB connection string. For security reasons, avoid hardcoding sensitive information and consider using environment variables management tools.

3. **Run the Server**

   Start the backend server using `nodemon` for automatic restarts on code changes:

   ```bash
   nodemon server.js
   ```

   Alternatively, use:

   ```bash
   node server.js
   ```

   The backend server will run on **https://localhost:5000**.

### **Frontend Setup**

1. **Navigate to Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` File**

   Create a `.env` file in the `frontend/` directory with the following environment variables:

   ```env
   REACT_APP_EXCHANGE_API_KEY=f94f4079a907ed37eb70b4b9
   JWT_SECRET=supersecretjwtkey12345
   ```

   **Note:** Ensure that `REACT_APP_EXCHANGE_API_KEY` corresponds to a valid API key from a currency conversion service (e.g., [ExchangeRate-API](https://www.exchangerate-api.com/)).

4. **Run the Frontend**

   Start the frontend application:

   ```bash
   npm start
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000). Ensure the backend server is running to handle API requests.

---

## **Technologies Used**

- **Frontend:**
  - **React.js:** For building the user interface.
  - **Tailwind CSS:** For styling and responsive design.
  - **Axios:** For handling HTTP requests.
  
- **Backend:**
  - **Node.js & Express:** For API and server-side operations.
  - **MongoDB:** For storing user and transaction data.
  - **bcrypt.js:** For password hashing and encryption.
  - **jsonwebtoken:** For authentication tokens (JWT).
  - **OpenSSL & mkcert:** For secure HTTPS communication.
  
- **Deployment and Hosting:**
  - **Local Development:** Secured with HTTPS using mkcert.
  - **Cloud Deployment Ready:** Compatible with platforms like AWS, Azure, and Heroku.
  
- **Additional Tools:**
  - **Postman & cURL:** For API testing.
  - **nodemon:** For automatic server restarts during development.

---

## **Features**

### **1. User Registration**

- **Functionality:**
  - Customers can register by providing their full name, ID number, and password.
  - Passwords are securely hashed using `bcrypt` before being stored in the database.
  
- **Process:**
  1. User fills out the registration form.
  2. Password is hashed on the backend.
  3. User data is saved to MongoDB.

### **2. User Login**

- **Functionality:**
  - Users can log in using their ID number and password.
  - Utilizes JWT (JSON Web Token) for secure authentication.
  - Successful login stores a JWT in `localStorage` for subsequent API requests.
  
- **Process:**
  1. User submits login credentials.
  2. Backend verifies credentials and issues a JWT.
  3. Frontend stores the JWT and includes it in the `Authorization` header for protected routes.

### **3. International Payment**

- **Functionality:**
  - Customers can make international payments by entering:
    - Recipient's account details.
    - SWIFT code.
    - Payment amount.
  - Includes a currency converter to display amounts in different currencies.
  
- **Process:**
  1. User navigates to the payment page.
  2. Enters required payment details.
  3. Currency converter API fetches current exchange rates.
  4. Payment details are submitted and saved securely.

### **4. Employee Dashboard**

- **Functionality:**
  - Bank employees access a protected dashboard to:
    - View pending transactions.
    - Verify and authorize payments.
    - Forward verified transactions to SWIFT for processing.
  
- **Features:**
  - List of transactions with status indicators.
  - Options to approve or reject transactions.
  - Secure communication with SWIFT integration.

### **5. Protected Routes**

- **Functionality:**
  - Backend routes are protected using JWT authentication.
  - Only authorized users (customers, employees, admins) can access specific routes.
  - Unauthorized access attempts are redirected to the login page.
  
- **Implementation:**
  - Middleware checks for valid JWT in the `Authorization` header.
  - Role-based access control ensures users access only permitted functionalities.

### **6. Customer Transaction History**

- **Functionality:**
  - Customers can view their past transactions.
  - Transaction details are securely stored in MongoDB and retrieved upon request.
  
- **Features:**
  - Paginated list of transactions.
  - Search and filter options based on date, amount, or status.
  - Detailed view of each transaction.

### **7. Admin Management**

- **Functionality:**
  - Admins can log in to manage other admin accounts.
  - Capabilities include:
    - Adding new admins.
    - Removing existing admins.
    - Authorizing high-level payments.
  
- **Features:**
  - Admin dashboard with user management tools.
  - Secure routes for admin-specific actions.
  - Role assignments and permissions handling.

### **8. Currency Converter API**

- **Functionality:**
  - Integrates with a currency conversion API to provide real-time exchange rates.
  - Assists users in understanding payment amounts in different currencies.
  
- **Features:**
  - Dropdown selection for source and target currencies.
  - Automatic fetching and updating of exchange rates.
  - Display of converted amounts during payment processing.

---

## **Upcoming Features**

### **Task 3 - Next Developments**

1. **Employee Verification System**
   - Develop a dashboard for bank employees to verify SWIFT codes and account information before forwarding to SWIFT.
   - Add the ability for employees to mark payments as "Verified" and submit them.
   
2. **Notification System**
   - Implement an email notification system to inform customers when their payments have been successfully processed.
   
3. **User Profile Management**
   - Allow customers to update their account information (e.g., name, password).
   - Ensure password encryption and strong validation for profile updates.
   
4. **Enhanced Security**
   - Implement additional security layers, such as Two-Factor Authentication (2FA), for both customers and employees.
   - Review and enhance encryption mechanisms for sensitive data like account numbers.
   
5. **Data Analytics and Reporting**
   - Add reporting tools for bank employees to generate reports based on processed payments.
   - Utilize data visualization tools like `recharts` to provide insights into payment volumes over time.
   
6. **Multi-Language Support**
   - Introduce support for multiple languages to cater to a diverse user base.
   
7. **Mobile Responsiveness**
   - Enhance the frontend to ensure seamless functionality across various devices and screen sizes.

---

## **API Endpoints**

### **User Authentication**

- **POST** `/api/user/register`: Register a new customer.
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "idNumber": "123456789",
      "password": "password123"
    }
    ```
  - **Response:**
    - **201 Created:** User successfully registered.
    - **400 Bad Request:** Validation errors.

- **POST** `/api/user/login`: Log in as a customer, employee, or admin.
  - **Request Body:**
    ```json
    {
      "idNumber": "123456789",
      "password": "password123"
    }
    ```
  - **Response:**
    - **200 OK:** Returns JWT token.
    - **401 Unauthorized:** Invalid credentials.

- **GET** `/api/user/protected`: Access a protected route after login (JWT required).
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer your_token"
    }
    ```
  - **Response:**
    - **200 OK:** Access granted.
    - **401 Unauthorized:** Invalid or missing token.

### **Transaction Routes**

- **POST** `/api/transactions`: Create a new international payment.
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer your_token"
    }
    ```
  - **Request Body:**
    ```json
    {
      "recipientAccount": "987654321",
      "swiftCode": "ABCDEF12",
      "amount": 1000,
      "currency": "USD"
    }
    ```
  - **Response:**
    - **201 Created:** Transaction successfully created.
    - **400 Bad Request:** Validation errors.
    - **401 Unauthorized:** Invalid or missing token.

- **GET** `/api/transactions`: Retrieve all transactions for the authenticated user.
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer your_token"
    }
    ```
  - **Response:**
    - **200 OK:** Returns list of transactions.
    - **401 Unauthorized:** Invalid or missing token.

### **Admin Routes**

- **POST** `/api/admin/add`: Add a new admin user.
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer admin_token"
    }
    ```
  - **Request Body:**
    ```json
    {
      "name": "Jane Smith",
      "idNumber": "0000002",
      "username": "janeadmin",
      "password": "securepassword",
      "accountNumber": "123456780"
    }
    ```
  - **Response:**
    - **201 Created:** Admin successfully added.
    - **400 Bad Request:** Validation errors.
    - **401 Unauthorized:** Invalid or missing token.

- **DELETE** `/api/admin/remove/:id`: Remove an existing admin by ID.
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer admin_token"
    }
    ```
  - **Response:**
    - **200 OK:** Admin successfully removed.
    - **404 Not Found:** Admin not found.
    - **401 Unauthorized:** Invalid or missing token.

### **Currency Converter API Endpoints**

- **GET** `/api/currency/convert`: Convert an amount from one currency to another.
  - **Query Parameters:**
    - `from`: Source currency code (e.g., `USD`)
    - `to`: Target currency code (e.g., `EUR`)
    - `amount`: Amount to convert
  - **Example:** `/api/currency/convert?from=USD&to=EUR&amount=100`
  - **Response:**
    - **200 OK:**
      ```json
      {
        "from": "USD",
        "to": "EUR",
        "originalAmount": 100,
        "convertedAmount": 85
      }
      ```
    - **400 Bad Request:** Invalid query parameters.
    - **500 Internal Server Error:** Issues with external API.

---

## **Testing the API**

Testing is crucial to ensure the reliability and security of the API endpoints. Utilize tools like **Postman** or **cURL** for this purpose.

### **Using Postman**

1. **Import API Collection:**
   - Create a new collection in Postman and add the endpoints as per the [API Endpoints](#api-endpoints) section.

2. **Set Up Environment Variables:**
   - Define variables for `baseURL`, `token`, etc., to streamline requests.

3. **Test Scenarios:**
   - **Registration:** Test user registration with valid and invalid data.
   - **Login:** Verify login functionality and JWT token retrieval.
   - **Protected Routes:** Access protected routes using valid and invalid tokens.
   - **Transactions:** Create and retrieve transactions.
   - **Admin Management:** Add and remove admins (requires admin token).
   - **Currency Conversion:** Test currency conversion with various parameters.

### **Using cURL**

**Example: Testing User Login**

```bash
curl -X POST https://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"idNumber": "123456789", "password": "password123"}'
```

**Example: Creating a Transaction**

```bash
curl -X POST https://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"recipientAccount": "987654321", "swiftCode": "ABCDEF12", "amount": 1000, "currency": "USD"}'
```

---

## **Seeding Default Admin**

To facilitate initial administrative access, a default admin account is seeded into the database. This ensures that administrative functionalities are accessible upon initial setup.

### **Default Admin Credentials**

- **Username:** `admin`
- **ID Number:** `0000001`
- **Password:** `adminpassword`

**Important:** For security reasons, it is highly recommended to change the default admin password immediately after the first login.

### **Seeding Function**

The following function checks if an admin exists and creates one if not:

```javascript
// File: backend/seedAdmin.js

const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path as necessary

// Function to seed a default admin
async function seedDefaultAdmin() {
  try {
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10); // Hash the admin password
      const defaultAdmin = new User({
        name: 'Admin',
        idNumber: '0000001',
        username: 'admin',
        accountNumber: '123456789',
        password: hashedPassword,
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin created.');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// Execute the seeding function
seedDefaultAdmin();
```

### **Executing the Seeding Script**

1. **Ensure Dependencies are Installed:**

   ```bash
   cd backend
   npm install
   ```

2. **Run the Seeding Script:**

   ```bash
   node seedAdmin.js
   ```

   **Output:**
   - If no admin exists:
     ```
     Default admin created.
     ```
   - If an admin already exists:
     ```
     Admin already exists.
     ```

**Note:** This script should be run once during the initial setup. Avoid running it multiple times to prevent duplicate admin accounts.

---

## **Known Issues**

- **SSL Certificate Trust Issues:**
  - In development mode, browsers may not trust self-signed SSL certificates. To resolve:
    - **Option 1:** Allow self-signed certificates in your browser settings.
    - **Option 2:** Configure Axios to accept self-signed certificates by using `https.Agent({ rejectUnauthorized: false })` for local testing purposes only.
  
- **Limited Error Handling:**
  - Additional validation is needed for form inputs and response error handling to enhance user experience and security.
  
- **Default Admin Password:**
  - The default admin password is hardcoded. It is imperative to change this password immediately after setup to prevent unauthorized access.

- **Environment Variables Exposure:**
  - Sensitive information is stored in `.env` files. Ensure that these files are excluded from version control systems like Git by adding them to `.gitignore`.

---

## **References**

1. **React.js Documentation:** [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)
2. **Express.js Documentation:** [https://expressjs.com/](https://expressjs.com/)
3. **MongoDB Documentation:** [https://docs.mongodb.com/](https://docs.mongodb.com/)
4. **bcrypt.js Documentation:** [https://github.com/kelektiv/node.bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
5. **jsonwebtoken Documentation:** [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
6. **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
7. **Axios Documentation:** [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)
8. **mkcert GitHub Repository:** [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)
9. **OpenSSL Official Site:** [https://www.openssl.org/](https://www.openssl.org/)
10. **nodemon Documentation:** [https://nodemon.io/](https://nodemon.io/)
11. **ExchangeRate-API:** [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
12. **Postman Learning Center:** [https://learning.postman.com/](https://learning.postman.com/)
13. **cURL Documentation:** [https://curl.se/docs/](https://curl.se/docs/)

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

By following this comprehensive guide, you should be able to set up and run the **International Payment System** on your local machine. Future updates and additional features will continue to enhance the system's functionality and security.

For any issues or contributions, please refer to the [Contributing Guidelines](CONTRIBUTING.md).

---

**Disclaimer:** This system is a fictional representation developed for educational purposes. It is not intended for real-world financial transactions.
