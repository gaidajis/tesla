# 🚗 Tesla Fleet App Dashboard

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue.svg)
![React](https://img.shields.io/badge/react-19-blue?logo=react)
![Tailwind](https://img.shields.io/badge/tailwindcss-4-38B2AC?logo=tailwind-css)

A highly polished, ultra-secure, static web dashboard for managing your Tesla via the official Fleet API. Hosted completely on GitHub Pages with zero backend required.

## 🌟 Features

- **Sleek Automotive UI:** Dark-mode-first design inspired by modern automotive interfaces, built with Tailwind CSS and Framer Motion.
- **BYOT Security:** "Bring Your Own Token" architecture.
- **Client-Side Encryption:** Your Tesla OAuth tokens are encrypted locally in your browser using AES (CryptoJS) and a Master Password. Tokens never leave your device except to communicate directly with Tesla's API.
- **Live Telemetry:** View battery level, range, odometer, and climate state.
- **Vehicle Controls:** Lock/Unlock, Flash Lights, Honk Horn, and Start/Stop HVAC directly from the dashboard.
- **Data Export:** Download a snapshot of your vehicle's telemetry as a JSON file.
- **GitHub Pages Ready:** Pre-configured GitHub Actions workflow for zero-maintenance hosting.

## 🔐 Architecture & Security

This application is **100% static**. It is designed to be hosted on GitHub Pages or any static file host.

Because we cannot use a backend to securely store API tokens, we rely on **Client-Side Encryption**:
1. You visit the app and enter your Tesla Access Token, Refresh Token, and a Master Password.
2. The tokens are encrypted using AES and stored in your browser's `localStorage`.
3. The original tokens are never sent anywhere except directly to `https://fleet-api.prd.eu.vn.cloud.tesla.com`.
4. When you return to the app, you only need to enter your Master Password to decrypt your tokens and access your dashboard.

> ⚠️ **Disclaimer:** While client-side encryption protects your tokens at rest in the browser, any malicious browser extensions or compromised devices could potentially access them. Use this software at your own risk. The authors are not responsible for any damage or unauthorized access to your vehicle.

## 🚀 Step-by-Step Setup Guide

### 1. Generate Tesla API Credentials
You need a Tesla Fleet API Access Token and Refresh Token. You can generate these using tools like [Tesla Auth](https://github.com/adriankumpf/tesla_auth) or similar OAuth flow wrappers for the Fleet API.

### 2. Configure Domain Verification
To execute commands (like locking the doors or honking the horn), Tesla requires domain verification.
1. Generate an EC private/public key pair as per Tesla's Fleet API documentation.
2. Open `public/.well-known/appspecific/com.tesla.3p.public-key.pem` in this repository.
3. Replace the placeholder text with your actual PEM-encoded public key.
4. Ensure your GitHub Pages domain is registered in your Tesla Developer Application dashboard.

### 3. Deploy via GitHub Actions
1. Fork or clone this repository.
2. Go to your repository settings on GitHub -> **Pages**.
3. Set the source to **GitHub Actions**.
4. Push your changes (including your public key) to the `main` branch.
5. The included `.github/workflows/deploy.yml` will automatically build and deploy the site.

### 4. Run Locally (Development)

```bash
npm install
npm start
```

Visit `http://localhost:5173` to view the app.

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License.

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit.
- **NonCommercial** — You may not use the material for commercial purposes.

See the [LICENSE](LICENSE) file for more details.