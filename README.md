# MERN E-commerce Platform

A full-stack e-commerce application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, featuring separate frontend and admin panels, and a robust backend API.

## 🚀 Live Demo

- **Main E-commerce Frontend:** [https://mern-e-commerce-frontend-0xif.onrender.com/](https://mern-e-commerce-frontend-0xif.onrender.com/)
- **Admin Panel:** [https://mern-e-commerce-admin-0lf5.onrender.com/](https://mern-e-commerce-admin-0lf5.onrender.com/) (Replace with your actual deployed admin URL)
- **Backend API:** [https://mern-e-commerce-backend-9xbi.onrender.com/](https://mern-e-commerce-backend-9xbi.onrender.com/) (API endpoint, not a browsable website, but should show "Express App is Running")

## ✨ Features

**Frontend (User-facing Application):**
* Browse products by categories (Men, Women, Kids).
* View product details (images, price, description, size selection).
* Add products to cart.
* User authentication (Signup/Login).
* View New Collections and Popular items.

**Admin Panel:**
* Add new products with details and images.
* View and manage (remove) existing products.
* (Expand with more admin features if implemented: order management, user management, etc.)

**Backend (API & Database):**
* RESTful API endpoints for products, users, and cart management.
* MongoDB Atlas for robust NoSQL database storage.
* JWT-based authentication for secure user sessions.
* Image upload functionality (requires external persistent storage in production, see Deployment notes).

## 🛠️ Technologies Used

* **Frontend:** React.js, React Router DOM, CSS
* **Admin Panel:** React.js, React Router DOM, CSS (Built with Vite - *ensure your Vite build is configured correctly*)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **Image Uploads:** Multer (local storage, **requires external service for persistence in production**)
* **Deployment:** Render (Separate services for Backend API, Frontend Static Site, Admin Static Site)
* **Version Control:** Git, GitHub

## ⚙️ Local Setup and Installation

To run this project locally, follow these steps. Ensure you have Node.js and npm (or Yarn/Bun) installed.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Tejaswipriya1219/MERN-E-commerce.git](https://github.com/Tejaswipriya1219/MERN-E-commerce.git)
    cd MERN-E-commerce
    ```

2.  **Configure Environment Variables (Local `.env`):**
    Create a `.env` file in the **`backend/`** directory with the following content. Replace placeholders with your actual values.
    *(Note: For local development, you might need to install `dotenv` package in your backend if not already a dependency: `npm install dotenv` and add `require('dotenv').config();` at the very top of your `backend/index.js`)*
    ```env
    MONGODB_URI=mongodb+srv://<your-atlas-username>:<your-atlas-password>@cluster0.98ncow4.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=your_super_secret_local_jwt_key
    BACKEND_PUBLIC_URL=http://localhost:4000
    PORT=4000
    ```
    *Make sure your MongoDB Atlas Network Access allows connections from your current IP address.*

3.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    node index.js  # or npm start if you have a start script
    ```
    The backend should start on `http://localhost:4000`.

4.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm start # or npm run dev if using Vite locally (check frontend/package.json scripts)
    ```
    The frontend should start on `http://localhost:3000` (or another port like `5173` for Vite). Remember to point frontend fetch calls to `http://localhost:4000` for local backend.

5.  **Admin Panel Setup:**
    ```bash
    cd ../admin
    npm install
    npm run dev # or npm start (check admin/package.json scripts)
    ```
    The admin panel should start on a local development port (e.g., `http://localhost:5173`). Remember to point admin fetch calls to `http://localhost:4000` for local backend.

## 🚀 Deployment

This project is deployed on [Render](https://render.com/). It utilizes three separate Render services for optimal separation of concerns:

* **Web Service:** For the Node.js/Express backend API.
    * **Root Directory:** `backend/`
    * **Build Command:** `npm install`
    * **Start Command:** `node index.js` (or `node server.js` if your main file is `server.js`)
    * **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, `BACKEND_PUBLIC_URL` (set in Render Dashboard)
    * **CORS Configuration:** Backend is configured to allow requests from your deployed frontend and admin URLs.

* **Static Site:** For the main React.js frontend.
    * **Root Directory:** `frontend/`
    * **Build Command:** `npm install && npm run build`
    * **Publish Directory:** `build` (for Create React App)
    * **API URL in Code:** Updated to point to `https://mern-e-commerce-backend-9xbi.onrender.com`

* **Static Site:** For the React.js/Vite admin panel.
    * **Root Directory:** `admin/`
    * **Build Command:** `npm install && npm run build`
    * **Publish Directory:** `dist` (for Vite)
    * **API URL in Code:** Updated to point to `https://mern-e-commerce-backend-9xbi.onrender.com`

**Persistent Image Storage:**
On Render's free tier, images uploaded using Multer's disk storage will be lost on service restarts. For persistent storage in a production environment, it is highly recommended to integrate a cloud storage solution like [Cloudinary](https://cloudinary.com/) or [AWS S3](https://aws.amazon.com/s3/). Alternatively, Render's paid instances offer [Persistent Disks](https://render.com/docs/disks).


## 🤝 Contributing

Feel free to fork the repository, create a new branch, and submit pull requests. Any contributions are welcome!

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

Tejaswipriya
Email: tejaswipriya1929@gmail.com
GitHub: [Tejaswipriya1219](https://github.com/Tejaswipriya1219)
