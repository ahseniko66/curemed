# CureMed - Medical Hospital Routing System

## Project Overview
CureMed is a  web application designed to assist residents of Astana in finding appropriate medical facilities based on their symptoms. The system analyzes user-described symptoms, matches them to specialized hospital departments, provides hospital recommendations with location visualization via Google Maps, and includes a secure patient portal for appointment booking and management.

## Features
- Symptom analysis with intelligent hospital matching
- Google Maps integration for hospital location visualization
- Secure user authentication system (registration and login)
- Complete appointment booking system with CRUD functionality
- Real-time appointment viewing and management
- Responsive web design compatible with all devices

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing
- **Frontend:** HTML, CSS, JavaScript
- **External APIs:** Google Maps JavaScript API

## Deployment
** The project was deployed using Render: ** https://curemed-backend.onrender.com/ 

## Setup and Installation Instructions

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google Maps API key
- Modern web browser

### Installation Steps
1. **Clone the repository:** git clone https://github.com/ahseniko66/curemed.git
2. **Install dependencies:** npm install
3. **Create a .env file in the root directory and add:**
   
PORT=3000 

MONGO_URI=your_secret_key_mongo

JWT_SECRET=your_secret_key

GOOGLE_MAPS_API_KEY=your_secret_key

### Executing the Program
1. **Start the server:** node server.js
2. **Visit in your browser:** http://localhost:3000

### API Documentation

**Public Endpoints**
1. 
User Registration
Endpoint: /auth/register
Method: POST
Access Type: Public

2. 
User Login
Endpoint: /auth/login
Method: POST
Access Type: Public
3. 
Symptom Analysis
Endpoint: /resource/diagnose
Method: POST
Access Type: Public

**Private Endpoints (Require JWT Token)**
1. 
Get User Profile
Endpoint: /users/profile
Method: GET
Access Type: Private
2. 
Update User Profile
Endpoint: /users/profile
Method: PUT
Access Type: Private
3. 
Create Appointment
Endpoint: /resource
Method: POST
Access Type: Private
4. 
Get Appointments
Endpoint: /resource
Method: GET
Access Type: Private
5. 
Delete Appointment
Endpoint: /resource/:id
Method: DELETE
Access Type: Private

