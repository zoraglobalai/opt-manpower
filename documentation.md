# Optimus Manpower Project Documentation

Welcome to the Optimus Manpower platform! This documentation is designed to help you quickly understand where files are stored, how the system architectures are connected, how to modify pages, and how to start the project. 

## 1. File Structure Overview

The project is structured into three main blocks: **Backend**, **Frontend**, and **Deployment Infrastructure** (Nginx & Docker).

### Frontend (React + Vite + TypeScript)
**Directory**: `frontend/`

The frontend powers the User Interface and Client-side Dashboard for Candidates, Recruiters, and Admins.
- `frontend/src/pages/`: Contains all the page-level views like `Home.tsx`, `JobDetails.tsx`, `CandidateDashboard.tsx`, and `RecruiterDashboard.tsx`. To edit how a page looks, search for the corresponding `.tsx` file here!
- `frontend/src/components/`: Modular, reusable UI pieces (e.g. `Navbar.tsx`, `Footer.tsx`, `JobCard.tsx`).
- `frontend/src/admin/`: Components specifically for the `AdminPanel`.
- `frontend/src/services/api.ts`: API handler file connecting your frontend calls directly to the Django backend.
- `frontend/src/context/`: Contains the state and user-authentication context logic (`AuthContext.tsx`).
- `frontend/src/index.css`: Tailwind utility imports and global CSS styles.

### Backend (Django + Django REST Framework)
**Directory**: `backend/`

The backend handles the APIs, business logic, PostgreSQL database connection, security, and jobs management.
- `backend/optimus/`: Core configuration directory storing `settings.py` (database, app config, secrets) and `urls.py` (base route imports).
- `backend/core/models.py`: Database table definitions (User, Job, Application, Profile). Modify this file if you need to add new data columns (like adding an “Age” field to Candidates).
- `backend/core/views.py`: The brains of the API. Determines what happens when a frontend user loads a route or submits a form.
- `backend/core/serializers.py`: Formats the `models.py` database data into JSON readable formats for the Frontend React app.
- `backend/core/urls.py`: Backend routing map connecting endpoints (e.g., `/api/jobs/`) directly to their respective `views.py` functions.

### Deployment & Server (Nginx + Docker)
These files manage how the platform runs on a live production server. 
- `nginx/nginx.conf`: The reverse-proxy config. It controls traffic, redirecting frontend requests directly to the static React bundle, and intercepting `/api/` traffic automatically towards the Django server backend.
- `docker-compose.yml` / `docker-compose.prod.yml`: Defines the structural containers using Docker (Database, Redis, Backend, Frontend). This helps orchestrate multiple services simultaneously.

---

## 2. Test Credentials

The system has preset test accounts for all standard roles. You can login using the following credentials:
- **Admin**: `admin@optimus.com` / ` `
- **Candidate Account**: `test@optimus.com` / `test1234`
- **Recruiter Account**: `recruiter@optimus.com` / `employer1234`

---

## 3. How to Run the Project Locally

To run the project locally without Docker, follow these steps using your command prompt or terminal. Make sure you load the backend and frontend simultaneously in **two separate terminal windows**.

### Step A: Starting the Django Backend
1. Open a terminal and navigate to your `backend` directory.
   ```bash
   cd d:\Optimus-manpower\backend
   ```
2. Activate your Virtual Environment (Windows).
   ```bash
   .\venv\Scripts\activate
   ```
3. Run the development server (Binding explicitly to host `8000`).
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Step B: Starting the React Frontend
1. Open a new, **second terminal** and navigate to your `frontend` directory.
   ```bash
   cd d:\Optimus-manpower\frontend
   ```
2. Start the Vite server (Binding to your local IPv4 host address).
   ```bash
   npm run dev
   ```
3. After starting the server, Vite will provide a localized IP address link, such as `http://127.0.0.1:5173/`. Copy and paste that link into your browser to view your website!
