# **International Payment System - Risk Rangers**

Welcome to the **International Payment System**. This system allows customers to register and securely make international payments, while providing bank employees with the tools to monitor and verify transactions. The project has been developed by **The Risk Rangers** team.

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

### **Backend Setup**

1. **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2. **Create `.env` File**
   Create a `.env` file in the `backend/` directory and add the following environment variables:
   ```bash
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/yourDatabase?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   SSL_KEY_PATH=D:/Downloads/Customer_portal/privatekey.pem
   SSL_CERT_PATH=D:/Downloads/Customer_portal/server.crt
   ```

3. **Run the Server**
    Start the backend server:
    ```bash
    nodemon server.js
    ```
    The backend server will run on **https://localhost** (port 443 for HTTPS).

### **Frontend Setup**

1. **Navigate to Frontend Directory**
    ```bash
    cd ../frontend
    ```

2. **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3. **Run the Frontend**
    ```bash
    npm start
    ```
    The frontend will be available at **http://localhost:3000**. Make sure the backend is running to handle API requests.

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

---

## **Upcoming Features**

### **Task 3 - Next Developments**

1. **Customer Transaction History**
   - Implement a feature where customers can view their past transactions.
   - Store transaction details securely in the MongoDB database.
   
2. **Employee Verification System**
   - Develop a dashboard for bank employees to verify SWIFT code and account information before forwarding to SWIFT.
   - Add the ability for employees to mark payments as "Verified" and submit them.

3. **Notification System**
   - Add an email notification system to notify customers when their payments have been successfully processed.

4. **User Profile Management**
   - Customers will be able to update their account information (e.g., name, password).
   - Ensure password encryption and strong validation for profile updates.

5. **Enhanced Security**
   - Implement additional layers of security (e.g., Two-Factor Authentication) for both customers and employees.
   - Review and enhance the encryption mechanism for sensitive data like account numbers.

6. **Data Analytics and Reporting**
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

