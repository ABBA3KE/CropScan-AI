# CropScan AI: AI-Powered Crop Disease Detection Web Application

**Author / Researcher:** Musa Musa  
**Project Type:** Final Year Computer Science / Agritech Project  
**Academic Focus:** Machine Learning, Computer Vision, Tropical Plant Pathology, Mobile Web Engineering  
**Version:** 1.0.0 (Production-Ready)  

---

## 1. Executive Summary & System Overview

**CropScan AI** is an intelligent, mobile-first progressive web application (PWA) designed to empower smallholder farmers, agricultural extension officers, and agronomists across Nigeria and West Africa with instant, field-level crop pathology diagnosis.

Farmers simply snap a photo of a crop using their smartphone camera or upload an existing image. The application analyzes the visual symptoms using Google Gemini's latest multimodal vision architecture (`@google/genai`), identifies the crop, classifies whether it is healthy or diseased, names the causal pathogen, details observed symptoms, evaluates severity, and formulates actionable, dual-tier treatment recommendations:
1. **Low-Cost & Organic Farm Remedies:** Practical, culturally accessible treatments (e.g. neem oil extract, wood ash dusting into leaf whorls, rogueing, hot water seed dips, companion planting) suited for resource-constrained smallholders.
2. **Standard Chemical Active Ingredients:** Common commercial fungicides and insecticides stocked in local Nigerian agro-dealer shops (e.g. Mancozeb, Ridomil Gold [Metalaxyl+Mancozeb], Apron Star, Tricyclazole, Emamectin benzoate).

Unlike traditional crop models that only inspect flat green leaves, **CropScan AI** evaluates multiple plant organs:
- **Maize:** Leaves, cobs, tassels, and stalks.
- **Pearl Millet:** Leaves, green ear heads, and stems.
- **Sorghum (Guinea corn):** Leaves, panicles, heads, and grain clusters.
- **Rice:** Leaves, flag leaves, stems/sheaths, and panicle necks.
- **Tomato:** Leaves, green & ripe fruits, stems, and blossoms.

---

## 2. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Next.js 14 PWA)                   │
│                                                                        │
│  - Mobile-First Container (Centered Phone Frame on Desktop)            │
│  - getUserMedia Camera Stream (Rear Facing Camera Default + Fallback)  │
│  - HTML5 Canvas Client-Side Resizing (~1280px / <1MB upload)           │
│  - PWA Service Worker (sw.js) + Web Manifest (manifest.json)           │
│  - React Context Auth & Unsaved Guest Scan Auto-Save Pipeline          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (Multipart & JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Node.js & Express)                 │
│                                                                        │
│  - Security: Helmet, CORS Whitelisting, Rate Limiting (express-rate)  │
│  - File Uploads: Multer Memory Storage (5 MB constraint, MIME check)   │
│  - Auth Engine: Bcrypt Password Hashing + httpOnly JWT Cookies         │
│  - Failover Store: Mongoose DB with In-Memory Active Fallback          │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
               ▼                                          ▼
┌──────────────────────────────┐        ┌────────────────────────────────┐
│   DATABASE & CLOUD STORAGE   │        │     AI PATHOLOGY ENGINE        │
│                              │        │                                │
│ - MongoDB Atlas (Users/Scans)│        │ - Google Gemini Multimodal     │
│ - Cloudinary (Uploaded Scans)│        │   Flash API (@google/genai)    │
│ - Local /uploads Disk Storage│        │ - Tropical Pathologist Prompt  │
│   (Automatic Zero-Key Fallback)       │ - Controlled JSON Schema Output│
└──────────────────────────────┘        │ - Fallback Model Chain (3.8/3.5)│
                                        └────────────────────────────────┘
```

---

## 3. Supported Crops & Target Pathologies

Crop parameters and diseases are consolidated in single configuration files (`server/src/config/crops.config.js` and `client/lib/crops.config.js`) for easy customization and extensibility:

| Crop | Scientific Name | Target Diseases & Conditions |
| :--- | :--- | :--- |
| **Maize** | *Zea mays* | Northern leaf blight, gray leaf spot, common rust, maize streak virus, ear rot, common smut, fall armyworm damage, healthy crop, nutrient deficiency, pest damage |
| **Pearl Millet** | *Pennisetum glaucum* | Downy mildew (green ear), ergot, millet smut, rust, blast, healthy crop, nutrient deficiency |
| **Sorghum** | *Sorghum bicolor* | Anthracnose, leaf blight, grain mold, head smut, downy mildew, healthy crop, nutrient deficiency |
| **Rice** | *Oryza sativa* | Rice blast (leaf & neck), brown spot, bacterial leaf blight, sheath blight, false smut, rice yellow mottle virus (RYMV), healthy crop |
| **Tomato** | *Solanum lycopersicum* | Early blight, late blight, Septoria leaf spot, bacterial spot, yellow leaf curl virus (TYLCV), blossom end rot, fruit rot (anthracnose), healthy crop |

---

## 4. Key Features & Implementation Highlights

### 4.1 Mobile-First & Installable PWA
- **Installable PWA:** Full Web App Manifest (`manifest.json`), service worker (`sw.js`) with shell caching, theme color `#15803d`, and custom high-resolution SVG agricultural icons.
- **Desktop Responsiveness:** Centers inside an elegant mobile container frame on large displays while delivering a full-bleed app feel on mobile devices.
- **Bottom Navigation:** Persistent 48px+ tap target bar: Home, Scan (elevated center button), History, and Profile.

### 4.2 Robust Camera & Upload Subsystem
- **Live Camera:** Leverages browser `navigator.mediaDevices.getUserMedia` with `{ facingMode: { ideal: "environment" } }` for rear-camera field shooting, complete with a viewfinder alignment reticle, flip-camera toggle, and retake controls.
- **Permission Fallback:** Gracefully falls back to `<input type="file" capture="environment">` if camera permissions are blocked.
- **Client Compression:** Pre-compresses photos down to ~1280px via HTML5 Canvas before network transmission, saving mobile data for rural farmers.

### 4.3 Seamless Guest & Account Experience
- **Public Guest Access:** Any farmer can scan and view an exhaustive diagnosis immediately without registering.
- **Local Persistence:** Guest scans are stored locally in `localStorage` without bloating the database.
- **Lossless Auto-Save:** When a guest taps *Save Result* or registers, the pending guest scan is automatically uploaded and saved to their new account!

### 4.4 Defensive AI Pipeline (Server-Only)
- **Zero Client Exposure:** The Gemini API key is never transmitted or exposed to the client browser.
- **System Instruction:** Guides the AI model as *Dr. Amina Bello*, senior tropical plant pathologist with 20+ years of West African field experience.
- **Controlled JSON Output:** Enforces strict response schema adhering to `isPlant`, `isSupportedCrop`, `crop`, `plantPart`, `status`, `diseaseName`, `causalAgent`, `confidence`, `severity`, `symptomsObserved`, `immediateActions`, `chemicalTreatment`, `organicTreatment`, `prevention`, and `otherPossibilities`.
- **Model Fallback Chain:** Automatically handles high-demand spikes (HTTP 503) by trying `gemini-3.8-flash`, `gemini-3.5-flash`, and `gemini-flash-latest`.

---

## 5. Project Directory Structure

```
cropscan-ai/
├── client/                     # Next.js 14 Frontend (Plain JavaScript)
│   ├── app/                    # App Router Pages
│   │   ├── layout.jsx          # Root Layout (PWA Manifest, MobileContainer, AuthProvider)
│   │   ├── page.jsx            # Home Screen (Hero Scan CTA, Crop Cards, Tips)
│   │   ├── globals.css         # Tailwind directives & mobile styles
│   │   ├── scan/page.jsx       # Scan Screen (Camera, Upload, Scanning State, Result)
│   │   ├── history/page.jsx    # Scan History (Search, Filter, Detail Modal, Delete)
│   │   ├── crops/page.jsx      # Crop Pathology Guide Hub
│   │   ├── crops/[id]/page.jsx # Individual Crop Disease Breakdown
│   │   ├── profile/page.jsx    # Profile, Scan Counters, Password Change, Delete Account
│   │   └── auth/page.jsx       # Direct Login / Registration Page
│   ├── components/             # Reusable UI Components
│   │   ├── MobileContainer.jsx # Desktop phone-frame layout wrapper
│   │   ├── BottomNav.jsx       # Fixed bottom navigation bar
│   │   ├── CameraCapture.jsx   # getUserMedia camera interface
│   │   ├── ScanningOverlay.jsx # Laser scan animation & status ticker
│   │   ├── ResultCard.jsx      # Full pathology diagnosis display
│   │   ├── AuthModal.jsx       # Frictionless login/signup modal
│   │   └── Toast.jsx           # Floating status alerts
│   ├── lib/                    # Client Utilities
│   │   ├── api.js              # REST API Client
│   │   ├── AuthContext.js      # React Context Auth Provider
│   │   ├── crops.config.js     # Single source of truth for crops & diseases
│   │   ├── imageUtils.js       # Canvas image compressor (~1280px)
│   │   └── storage.js          # Guest local storage & pending scan manager
│   ├── public/                 # Static Assets, PWA Manifest, Service Worker
│   │   ├── manifest.json       # PWA Manifest
│   │   ├── sw.js               # Service Worker
│   │   └── icon.svg            # Agricultural App Icon
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── .env.local.example
│   └── .env.local
│
├── server/                     # Node.js & Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── crops.config.js # Central project & pathology definition
│   │   │   ├── db.js           # Mongoose connector with in-memory fallback
│   │   │   └── cloudinary.js   # Cloudinary image uploader with local disk fallback
│   │   ├── controllers/
│   │   │   ├── scan.controller.js  # Scan, save, pagination, delete
│   │   │   ├── auth.controller.js  # Register, login, cookie management, session me
│   │   │   └── user.controller.js  # Profile update, change password, delete account
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT cookie & header verification
│   │   │   ├── upload.js       # Multer memory storage & 5MB file filter
│   │   │   ├── rateLimiter.js  # Rate limiters for scan & auth endpoints
│   │   │   └── errorHandler.js # Central JSON error handler
│   │   ├── models/
│   │   │   ├── User.js         # Mongoose User schema with bcrypt
│   │   │   ├── Scan.js         # Mongoose Scan schema
│   │   │   └── fallbackStore.js# Offline in-memory repository for zero-DB testing
│   │   ├── routes/
│   │   │   ├── scan.routes.js  # /api/scan, /api/scans, /api/config
│   │   │   ├── auth.routes.js  # /api/auth/register, login, logout, me
│   │   │   └── user.routes.js  # /api/users/me
│   │   └── server.js           # Server entrypoint (Helmet, CORS, Routes)
│   ├── uploads/                # Local uploaded photos storage fallback
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── evaluation/                 # Project Defence Benchmark Suite
│   ├── dataset/                # Labelled test dataset across 5 crops
│   │   ├── labels.json         # Ground-truth annotations
│   │   ├── maize/
│   │   ├── millet/
│   │   ├── sorghum/
│   │   ├── rice/
│   │   └── tomato/
│   ├── generate_dataset_samples.js # Test sample generator
│   ├── evaluate.js             # Benchmark runner calculating per-crop accuracy
│   ├── evaluation_results.json # Generated benchmark data
│   └── evaluation_report.md    # Formatted Markdown report for project write-up
│
├── package.json                # Root package with unified dev/build scripts
└── README.md                   # This documentation
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (tested on v22.19.0)
- npm v9+

### Step 1: Install Dependencies
From the root directory:
```bash
# Option A: One-step installation
npm run install:all

# Option B: Manual
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure Environment Variables

**Server Configuration (`server/.env`):**
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

JWT_SECRET=cropscan_ai_super_secret_jwt_key_2026_musa_final_year_project
JWT_EXPIRES_IN=7d

# MongoDB (Local or Atlas URI)
# If left as is and local MongoDB is offline, the server automatically
# activates in-memory fallback so you can demonstrate immediately!
MONGODB_URI=mongodb://127.0.0.1:27017/cropscan_ai

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash

# Cloudinary (Optional - leaves blank to save scans to server /uploads disk)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Client Configuration (`client/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_APP_NAME=CropScan AI
```

### Step 3: Run the Application
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server starts at http://localhost:5001
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Frontend starts at http://localhost:3000
```

Open your browser and navigate to `http://localhost:3000`. You can now take photos, upload crop images, inspect diagnoses, register accounts, and manage scan histories!

---

## 7. MongoDB Atlas & Cloudinary Setup

### Setting up MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new cluster selecting the **M0 Free Tier** (AWS, eu-west-1 or af-south-1).
3. Under **Security > Database Access**, add a database user with username and password (e.g. `musa_admin` / `Password123!`).
4. Under **Security > Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render and local testing can connect.
5. Under **Deployment > Database**, click **Connect > Drivers > Node.js**.
6. Copy the connection string:
   ```env
   MONGODB_URI=mongodb+srv://musa_admin:Password123!@cluster0.abcde.mongodb.net/cropscan_ai?retryWrites=true&w=majority
   ```
7. Paste this into `server/.env`.

### Setting up Cloudinary (Free Tier)
1. Sign up at [Cloudinary](https://cloudinary.com/).
2. On your Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Paste them into `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
*(Note: If left empty, CropScan AI automatically saves scans locally in `server/uploads/` and serves them statically at `/uploads/...`, ensuring zero runtime failures during offline demonstrations).*

---

## 8. Deployment Guide (Production)

### 8.1 Backend Deployment on Render
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Add Environment Variables on Render:
   - `PORT`: `5001` (or let Render set default `10000`)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-cropscan-frontend.vercel.app`
   - `JWT_SECRET`: your secret key
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `GEMINI_API_KEY`: your Google Gemini key
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: your Cloudinary credentials
6. Click **Deploy Web Service**. Note your Render URL (e.g., `https://cropscan-api.onrender.com`).

### 8.2 Frontend Deployment on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository.
3. Configure project settings:
   - **Root Directory:** Edit and select `client`.
   - **Framework Preset:** Next.js
4. Add Environment Variables on Vercel:
   - `NEXT_PUBLIC_API_URL`: `https://cropscan-api.onrender.com`
   - `NEXT_PUBLIC_APP_NAME`: `CropScan AI`
5. Click **Deploy**. Vercel will build and assign a production URL (e.g., `https://cropscan-ai.vercel.app`).
6. Update `CLIENT_URL` on Render to match your Vercel URL so CORS cookies function across domains.

---

## 9. Evaluation Benchmark Suite

To generate quantitative accuracy data for your project report and defence presentation:

```bash
# Run from repository root
npm run evaluate
# or
node evaluation/evaluate.js
```

The script runs the labelled test dataset through the diagnostic pipeline and generates:
1. Terminal classification matrix showing per-crop accuracy and latency.
2. `evaluation/evaluation_results.json`: Raw benchmark metrics.
3. `evaluation/evaluation_report.md`: Markdown tables you can copy-paste directly into your project report!

---

## 10. Design Decisions & Presentation Notes

When presenting this project in your final year defence, highlight these design decisions:
1. **Plain JavaScript for Pedagogical Clarity:** The frontend was built with React in pure JavaScript (ES6+) rather than TypeScript so the underlying DOM, state flows, and logic can be clearly explained to external examiners without TypeScript compiler overhead.
2. **Dual-Tier Recommendations:** Recognizing that rural Nigerian farmers often lack immediate access or capital for synthetic chemicals, every diagnosis pairs commercial active ingredients with low-cost organic options (wood ash, neem oil, rogueing).
3. **Multimodal Organ Recognition:** Standard datasets (like PlantVillage) only evaluate leaves. CropScan AI evaluates cobs (maize), heads (millet/sorghum), panicles (rice), and fruits (tomato).
4. **Client-Side Image Optimization:** Image compression is performed in the farmer's browser using HTML5 Canvas before network transfer, conserving mobile data and ensuring fast analysis even on 3G network connections.
5. **Decoupled Architecture:** Client and Server operate as independent services communicating over REST with rate limiting and JWT cookies, ensuring security and high scalability.
