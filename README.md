# 📰 News App Backend

This repository contains the backend services for a News Application, designed to provide a robust and scalable API for managing news articles, categories, and user interactions.

---

## 📚 Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the Application](#running-the-application)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)

---

## ✅ Features

- **Article Management**: CRUD operations for news articles.  
- **Category Management**: Organize news articles into categories.  
- **User Authentication**: Secure registration and login using JWT.  
- **Search Functionality**: Search articles by keywords, categories, or authors.  
- **Pagination & Filtering**: Efficient handling of large datasets.  
- **Admin Panel**: (Optional) Routes for administrative tasks.

---

## 🛠 Technologies Used

- **Node.js** – JavaScript runtime environment  
- **Express.js** – Web framework for Node.js  
- **MongoDB / Mongoose** – NoSQL database and ODM  
- **JWT** – JSON Web Token for authentication  
- **Bcrypt** – Password hashing  
- **Dotenv** – Environment variable management  
- **Nodemon** – Dev tool for auto-restarting server  

---

## 🚀 Getting Started

Follow these steps to run the project locally for development and testing.

### 📦 Prerequisites

Make sure you have the following installed:

- Node.js (LTS recommended)  
- npm (comes with Node.js)  
- MongoDB (for NoSQL) or PostgreSQL (if using Sequelize)

### 🔧 Installation

```bash
git clone https://github.com/thesujaljaiswal/news-app-backend.git
cd news-app-backend
npm install
