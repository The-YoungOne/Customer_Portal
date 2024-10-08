# **International Payment System - Risk Rangers**

Welcome to the **International Payment System**. This system allows customers to register and securely make international payments, while providing bank employees with the tools to monitor and verify transactions. The project has been developed by **The Risk Rangers** team.

click the link to view a video demonstration of the application:
https://youtu.be/rpVu8z6tO5c

## **Project Overview**

This system is designed for a fictional international bank where users can:
- Register an account using their ID and password.
- Log in using their credentials.
- Make international payments by entering account information, SWIFT codes, and the payment amount.
- Have the payment details saved and displayed securely.
- Bank employees can access the protected portal to verify and forward payments through SWIFT.

### **Team Members:**
- **Mpho Ndlela** - Team Lead
- **Alec Cowan** - Developer
- **Lucian Young** - UI Designer
- **Anele Siwela** - Back-End Developer

---

## **Project Setup Instructions**

### **Pre-requisites**
- Node.js (v14 or higher)
- MongoDB (You can use a local or cloud MongoDB instance)
- OpenSSL for creating SSL certificates
- Postman or CURL (for API testing)
- Axios (for making HTTP requests)

### **Clone the Repository**
```bash
git clone https://github.com/your-repo/international-payment-system.git
cd international-payment-system
```

Setting Up SSL for Local Development
To enable HTTPS for your local development environment, you'll need to generate SSL certificates and configure your server to use them. Follow these steps to set up your own SSL keys and configure them in the project:

1. Generate SSL Keys
You can generate SSL keys locally using OpenSSL. If you don't have OpenSSL installed, you can download it here.

Run the following commands to generate the required SSL key and certificate files:

bash
Copy code
# Generate a private key
openssl genrsa -out privatekey.pem 2048

# Generate a certificate signing request (CSR)
openssl req -new -key privatekey.pem -out csr.pem

# Generate a self-signed certificate
openssl x509 -req -days 365 -in csr.pem -signkey privatekey.pem -out server.crt
2. Move the Keys to the Keys Folder
Once you’ve generated the keys, move them to the appropriate folder in your project. Typically, these files should go into a folder called keys within your project directory:

perl
Copy code
/Customer_Portal
  ├── backend
  ├── frontend
  ├── keys
      ├── privatekey.pem
      ├── server.crt
Ensure that both the privatekey.pem and server.crt files are inside the keys folder.

3. Update the Server Configuration
Next, ensure that your server.js file is correctly configured to use the SSL certificates. Open the server.js file and verify the following section:

javascript
Copy code
const https = require('https');
const fs = require('fs');
const sslOptions = {
  key: fs.readFileSync('keys/privatekey.pem'),  // Path to your private key
  cert: fs.readFileSync('keys/server.crt')      // Path to your certificate
};

// Start the HTTPS server
https.createServer(sslOptions, app).listen(5000, () => {
  console.log('Secure server running on port 5000');
});
Ensure that the paths to your privatekey.pem and server.crt files are correct and point to the keys folder.

4. Verify HTTPS is Working
To verify that HTTPS is working, start your server by running:

bash
Copy code
node server.js
In your browser, navigate to https://localhost:5000. You should see a security warning since the certificate is self-signed, but this is expected in local development. You can safely proceed to view your application over HTTPS.




### **Backend Setup**

1. **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2. **Create `.env` File**
   Create a `.env` file in the `backend/` directory and add the following environment variables:
   ```bash
   MONGO_URI=mongodb+srv://lubertyoung:lucian5y@customer-portal.jjyzu.mongodb.net/?retryWrites=true&w=majority&appName=Customer-Portal
    JWT_SECRET=supersecretjwtkey12345

    HTTPS=true
    SSL_CRT_FILE=D:/Downloads/Customer_portal/server.crt
    SSL_KEY_FILE=D:/Downloads/Customer_portal/privatekey.pem
    REACT_APP_EXCHANGE_API_KEY=f94f4079a907ed37eb70b4b9
   ```

3. **Run the Server**
    Start the backend server:
    ```bash
    nodemon server.js
    or
    node server.js
    ```
    The backend server will run on **https://localhost** (port 5000 for HTTPS).

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
   Create a `.env` file in the `frontend/` directory and add the following environment variables:
   ```bash
   REACT_APP_EXCHANGE_API_KEY=f94f4079a907ed37eb70b4b9
    JWT_SECRET=supersecretjwtkey12345

   ```

4. **Run the Frontend**
    ```bash
    npm start
    ```
    The frontend will be available at **http://localhost:5000**. Make sure the backend is running to handle API requests.

---

## **Technologies Used**

- **Frontend:**
  - React.js (for the user interface)
  - Tailwind CSS (for styling)
  - Axios (for handling HTTP requests)

- **Backend:**
  - Node.js and Express (for API and server-side operations)
  - MongoDB (for storing user and transaction data)
  - bcrypt.js (for password encryption)
  - jsonwebtoken (for authentication tokens)
  - OpenSSL (for secure HTTPS communication)

- **Deployment and Hosting:**
  - Local development with HTTPS using OpenSSL.
  - Ready for cloud deployment (e.g., AWS, Azure, or Heroku).

---

## **Features**

### **1. User Registration**
- Customers can register by entering their full name, ID number, and password.
- Passwords are hashed using `bcrypt` before being saved to the database.

### **2. User Login**
- Users can log in with their ID number and password.
- JWT (JSON Web Token) is used for secure authentication.
- Successful login stores a JWT in `localStorage` for further API requests.

### **3. International Payment**
- Customers can make payments by entering account details, SWIFT code, and payment amount.
- Transactions are securely saved and displayed for the bank employees to verify.

### **4. Employee Dashboard**
- Bank employees can log in to a protected route to view and verify transactions.
- Once verified, transactions can be forwarded to SWIFT for processing.

### **5. Protected Routes**
- The backend has protected routes that require a valid JWT token for access.
- Unauthorized users will be redirected to log in.

- ### **6. Customer Transaction History**
- Implement a feature where customers can view their past transactions.
- Store transaction details securely in the MongoDB database.

---

## **Upcoming Features**

### **Task 3 - Next Developments**
   
1. **Employee Verification System**
   - Develop a dashboard for bank employees to verify SWIFT code and account information before forwarding to SWIFT.
   - Add the ability for employees to mark payments as "Verified" and submit them.

2. **Notification System**
   - Add an email notification system to notify customers when their payments have been successfully processed.

3. **User Profile Management**
   - Customers will be able to update their account information (e.g., name, password).
   - Ensure password encryption and strong validation for profile updates.

4. **Enhanced Security**
   - Implement additional layers of security (e.g., Two-Factor Authentication) for both customers and employees.
   - Review and enhance the encryption mechanism for sensitive data like account numbers.

5. **Data Analytics and Reporting**
   - Add reporting tools for bank employees to generate reports based on payments processed.
   - Use data visualization tools like `recharts` to provide insights into the volume of payments processed over time.

---

## **API Endpoints**

Here are the key API routes available:

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
  
- **POST** `/api/user/login`: Log in as a customer or employee.
  - **Request Body:**
    ```json
    {
      "idNumber": "123456789",
      "password": "password123"
    }
    ```

- **GET** `/api/user/protected`: Access a protected route after login (JWT required).
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer your_token"
    }
    ```

### **Transaction Routes**
- To be added as part of the upcoming **Customer Transaction History** feature.

---

## **Testing the API**

You can use tools like **Postman** or **CURL** to test the API endpoints. Make sure you have the backend server running and accessible.

Example CURL request to test login:
```bash
curl -X POST https://localhost/api/user/login -H "Content-Type: application/json" -d '{"idNumber": "123456789", "password": "password123"}'
```

---

## **Known Issues**

- **SSL Certificate Trust Issues:** In development mode, browsers may not trust your self-signed SSL certificate. You may need to allow self-signed certificates or use `https.Agent({ rejectUnauthorized: false })` in Axios for local testing.
- **Limited error handling:** Additional validation may be needed for form inputs and response error handling.

---

## **License**

This project is licensed under the MIT License.

---

By following this guide, you should be able to set up and run the **International Payment System** on your local machine. More features and improvements will be implemented as part of Task 3 and beyond.

