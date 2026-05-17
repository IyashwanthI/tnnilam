# Tamil Nilam Citizen Portal - F-Line Appeal

Full-stack portal built with Angular 17 + Spring Boot 3 + PostgreSQL.

## Features

- Citizen Registration with OTP verification (phone)
- Login via OTP (phone)
- F-Line Appeal submission and tracking
- District / Taluk / Village cascading dropdowns

## Structure

```
tnnilam/
├── frontend/   (Angular 17)
└── backend/    (Spring Boot 3)
```

## Setup

### Prerequisites

- Java 17+ (Java 21 confirmed working)
- Node.js 18+ and Angular CLI

### Backend (PowerShell)

```powershell
# From e:\tnnilam\backend\
.\mvnw.ps1 spring-boot:run
```

### Frontend

```powershell
# From e:\tnnilam\frontend\
npm install
ng serve
```

### Notes

- OTP is in **mock mode** by default — check Spring Boot logs for the OTP value
- Update `src/main/resources/application.yml` with your PostgreSQL credentials before running
- The `fline_appeal` table is auto-created by Hibernate on first run
