# Campus Complaint Management System
## Frontend Development Specification (Student + Faculty Portal)

---

# Project Overview

The Campus Complaint Management System is a role-based web application where students can raise complaints related to campus infrastructure and faculty members can review, manage, and resolve those complaints.

Backend is already completed using:

- Spring Boot
- Spring Security
- JWT Authentication
- PostgreSQL (Neon Database)
- Cloudinary Image Storage
- Swagger/OpenAPI Documentation

Frontend must be developed separately and connected to the existing backend APIs.

---

# Technology Stack

Frontend should use:

- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Context API
- Recharts
- React Hook Form
- React Toastify

---

# Roles

There are ONLY TWO ROLES.

## STUDENT

Can:

- Register
- Login
- Create Complaint
- View Own Complaints
- View Complaint Details

Cannot:

- View Faculty Dashboard
- View All Complaints
- Update Complaint Status
- Access Faculty Routes

---

## FACULTY

Can:

- Login
- View Dashboard Analytics
- View All Complaints
- View Complaint Details
- Update Complaint Status
- Add Remarks

Cannot:

- Register
- Submit Complaint

---

# Authentication

Uses JWT Authentication.

Every protected API request must include:

```http
Authorization: Bearer <JWT_TOKEN>
```

Token is returned after login.

Store token in:

```javascript
localStorage.setItem("token", token);
```

---

# Backend Base URL

Development:

```text
http://localhost:8080
```

Example:

```text
http://localhost:8080/api/auth/login
```

---

# Authentication APIs

---

## Register Student

Endpoint:

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Piyush",
  "email": "piyush@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "jwt-token",
  "message": "Registration successful"
}
```

---

## Login

Endpoint:

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "piyush@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "jwt-token",
  "message": "Login successful"
}
```

Frontend must decode JWT and determine role.

Possible Roles:

```text
STUDENT
FACULTY
```

---

# Complaint APIs

---

## Create Complaint

Endpoint:

```http
POST /api/complaints
```

Student Only

Request:

```json
{
  "title": "Broken Fan",
  "description": "Fan not working",
  "location": "Room 203",
  "imageUrl": "uploaded-image-url"
}
```

Response:

```json
{
  "message": "Complaint submitted successfully"
}
```

---

## Get My Complaints

Endpoint:

```http
GET /api/complaints/my
```

Student Only

Returns:

```json
[
  {
    "id": 1,
    "title": "Broken Fan",
    "description": "...",
    "location": "Room 203",
    "imageUrl": "...",
    "remarks": "...",
    "status": "PENDING",
    "studentName": "Piyush",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

## Get Complaint By ID

Endpoint:

```http
GET /api/complaints/{id}
```

Returns:

```json
{
  "id": 1,
  "title": "Broken Fan",
  "description": "...",
  "location": "...",
  "imageUrl": "...",
  "remarks": "...",
  "status": "PENDING",
  "studentName": "Piyush",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Get All Complaints

Endpoint:

```http
GET /api/complaints
```

Returns all complaints.

---

# Faculty APIs

---

## Dashboard Analytics

Endpoint:

```http
GET /api/faculty/dashboard
```

Returns:

```json
{
  "totalComplaints": 100,
  "pendingComplaints": 25,
  "inProgressComplaints": 30,
  "resolvedComplaints": 45
}
```

---

## View All Complaints

Endpoint:

```http
GET /api/faculty/complaints
```

Returns:

```json
[
  {
    "id": 1,
    "title": "...",
    "description": "...",
    "location": "...",
    "imageUrl": "...",
    "remarks": "...",
    "status": "PENDING",
    "studentName": "Piyush",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

## Update Complaint Status

Endpoint:

```http
PUT /api/faculty/complaints/{id}/status
```

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

or

```json
{
  "status": "RESOLVED"
}
```

Response:

```json
{
  "message": "Status Updated Successfully"
}
```

---

# DTO Structures

## AuthResponse

```json
{
  "token": "jwt-token",
  "message": "Login successful"
}
```

Fields:

```text
token
message
```

---

## ComplaintResponse

```json
{
  "id": 1,
  "title": "Broken Fan",
  "description": "Fan not working",
  "location": "Room 203",
  "imageUrl": "https://...",
  "remarks": "Assigned to maintenance",
  "status": "IN_PROGRESS",
  "studentName": "Piyush",
  "createdAt": "2026-06-05T12:00:00",
  "updatedAt": "2026-06-05T13:00:00"
}
```

Fields:

```text
id
title
description
location
imageUrl
remarks
status
studentName
createdAt
updatedAt
```

---

## DashboardStatsResponse

```json
{
  "totalComplaints": 100,
  "pendingComplaints": 25,
  "inProgressComplaints": 30,
  "resolvedComplaints": 45
}
```

---

# Complaint Status

Frontend must support:

```text
PENDING
IN_PROGRESS
RESOLVED
```

Status Colors:

```text
PENDING      -> Yellow
IN_PROGRESS  -> Blue
RESOLVED     -> Green
```

---

# Application Structure

```text
src
│
├── api
│   └── axios.js
│
├── context
│   └── AuthContext.jsx
│
├── routes
│   └── ProtectedRoute.jsx
│
├── layouts
│   ├── StudentLayout.jsx
│   └── FacultyLayout.jsx
│
├── pages
│   ├── auth
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── student
│   │   ├── Dashboard.jsx
│   │   ├── CreateComplaint.jsx
│   │   ├── MyComplaints.jsx
│   │   └── ComplaintDetails.jsx
│   │
│   └── faculty
│       ├── Dashboard.jsx
│       ├── AllComplaints.jsx
│       └── ComplaintDetails.jsx
│
├── components
│   ├── common
│   ├── student
│   └── faculty
│
└── App.jsx
```

---

# Routing Structure

## Public Routes

```text
/login
/register
```

---

## Student Routes

```text
/student/dashboard
/student/create
/student/complaints
/student/complaints/:id
```

---

## Faculty Routes

```text
/faculty/dashboard
/faculty/complaints
/faculty/complaints/:id
```

---

# Student Dashboard

Show:

### Statistics Cards

- Total Complaints
- Pending
- In Progress
- Resolved

---

### Recent Complaints

Show latest complaints.

Columns:

```text
Title
Status
Created Date
Action
```

---

# Create Complaint Page

Form Fields:

```text
Title
Description
Location
Image Upload
```

Validation:

```text
Required
```

Submit Button:

```text
Submit Complaint
```

---

# Student Complaint List

Display:

```text
Complaint ID
Title
Location
Status
Date
```

Action:

```text
View Details
```

---

# Complaint Detail Page

Show:

```text
Title
Description
Location
Student Name
Status
Remarks
Created Date
Updated Date
Complaint Image
```

---

# Faculty Dashboard

Use DashboardStatsResponse.

Show:

### Statistics Cards

```text
Total Complaints
Pending Complaints
In Progress Complaints
Resolved Complaints
```

---

### Pie Chart

Using Recharts

Sections:

```text
Pending
In Progress
Resolved
```

---

### Bar Chart

Using Recharts

Values:

```text
Pending
In Progress
Resolved
```

---

# Faculty Complaint Management

Table Columns:

```text
ID
Student Name
Title
Location
Status
Created At
Updated At
Actions
```

Actions:

```text
View
Update Status
```

---

# Update Status Modal

Dropdown:

```text
PENDING
IN_PROGRESS
RESOLVED
```

Remarks Textarea:

```text
Faculty Remarks
```

Button:

```text
Update
```

---

# Sidebar

## Student Sidebar

```text
Dashboard
Create Complaint
My Complaints
Logout
```

---

## Faculty Sidebar

```text
Dashboard
All Complaints
Logout
```

---

# Security Requirements

Very Important.

Frontend MUST NOT show faculty pages to students.

Even if a student manually types:

```text
/faculty/dashboard
```

they must be redirected.

Example:

```javascript
if(role !== "FACULTY"){
    navigate("/student/dashboard");
}
```

---

# Authentication Flow

1. User Login
2. Save JWT
3. Decode JWT
4. Extract Role
5. Redirect

Student:

```text
/student/dashboard
```

Faculty:

```text
/faculty/dashboard
```

---

# UI Requirements

Design Style:

- Modern
- Professional
- Clean
- Mobile Responsive
- Dashboard Style

Theme:

```text
Primary: #2563EB
Secondary: #0F172A
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
Background: #F8FAFC
```

---

# Important Development Rules

1. Use Axios Interceptors.
2. Use JWT Authentication.
3. Use Protected Routes.
4. Use Role-Based Routing.
5. Use Tailwind CSS.
6. Use React Context for Auth.
7. Use Recharts for Analytics.
8. Use Toast Notifications.
9. Fully Responsive Design.
10. Production Ready Code.

---

# AI Frontend Generation Prompt

Build a complete production-ready React + Vite + Tailwind CSS frontend for a Campus Complaint Management System.

Roles:
- STUDENT
- FACULTY

Authentication:
- JWT Based
- Role Based Access Control

Backend APIs:

POST /api/auth/register
POST /api/auth/login

GET /api/complaints
POST /api/complaints
GET /api/complaints/{id}
GET /api/complaints/my

GET /api/faculty/dashboard
GET /api/faculty/complaints
PUT /api/faculty/complaints/{id}/status

Requirements:
- Axios
- JWT Storage
- React Context
- Protected Routes
- Role Guards
- Tailwind CSS
- Responsive Design
- Recharts Dashboard
- Faculty Complaint Management
- Student Complaint Portal
- Clean Folder Structure
- Production Ready Architecture

Generate complete source code.
