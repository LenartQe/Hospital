# Hospital Management System — Spitali i Prizrenit

Full-stack hospital management: public website, admin panel, **patient portal**, and **doctor portal**.

## Tech stack

- **Frontend:** React (Material Dashboard) — `frontend/`
- **Backend:** Spring Boot — `backend/`
- **Database:** MySQL (`hospital_system`)

## Features

- Menaxhimi i departamenteve, mjekëve, barnave dhe termineve (admin)
- Portali i **pacientit**: diagnoza, recetat, terminet, profili shëndetësor
- Portali i **mjekut**: terminet, diagnoza dhe receta për pacientët
- Faqja publike e spitalit (rezervim termini)

## Structure

| Folder | Description |
|--------|-------------|
| `backend/` | Spring Boot API (port **8082**) |
| `frontend/` | React app (port **3000**) — **run all npm commands here** |

Legacy duplicate folders at the repo root (`src/`, `public/`, `package.json`) are deprecated; use `frontend/` only.

## Quick start

1. Start **MySQL** (XAMPP) and ensure `hospital_system` can be created.
2. Backend:
   ```bash
   cd backend
   ..\tools\maven\bin\mvn.cmd spring-boot:run
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Demo logins (password: `hospital123`)

| Role | Email |
|------|--------|
| Patient | `patient@hospital.local` |
| Doctor | `s.mitchell@hospital.local` |
| Admin | `admin@hospital.local` |

Patients can register at **Hyrja → Regjistrohu si pacient**.

## API

- Public: departments, doctors, appointment booking
- Auth: `POST /api/auth/login`, `POST /api/auth/register/patient`
- Patient: `GET /api/patient/dashboard`
- Doctor: `GET /api/doctor/dashboard`, patient diagnoses & prescriptions
- Admin: existing `/api/*` CRUD (requires admin JWT)

## Team

- **Backend:** Lenart Qollaku
- **Frontend:** Albion Kryeziu
