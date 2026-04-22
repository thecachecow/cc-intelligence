# Deployment Guide

This project is configured for deployment to **Google Cloud Run** using GitHub Actions.

## Prerequisites

1.  **Google Cloud Project**: You need a GCP project with the following APIs enabled:
    *   Cloud Run API
    *   Artifact Registry API
    *   Cloud Build API
2.  **Service Account**: Create a Service Account with the following roles:
    *   `Cloud Run Admin`
    *   `Storage Admin`
    *   `Artifact Registry Administrator`
    *   `Service Account User`
3.  **GitHub Secrets**: Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):
    *   `GCP_PROJECT_ID`: Your Google Cloud Project ID.
    *   `GCP_SA_KEY`: The JSON key of your Service Account.
    *   `GEMINI_API_KEY`: Your Gemini API key.
    *   `FIREBASE_CONFIG`: The content of your `firebase-applet-config.json` (optional, if you want to inject it at runtime).

## How it works

1.  **Push to `main`**: Any push to the `main` branch triggers the `.github/workflows/deploy.yml` workflow.
2.  **Build**: The workflow builds a Docker image using the `Dockerfile`.
3.  **Push**: The image is pushed to Google Artifact Registry.
4.  **Deploy**: The image is deployed to Cloud Run as a service named `cachecow-app`.

## Local Deployment (via Desktop App)

If you are using a Desktop app (like Docker Desktop or a specific cloud CLI):

1.  **Build locally**:
    ```bash
    docker build -t cachecow-app .
    ```
2.  **Run locally**:
    ```bash
    docker run -p 3000:3000 --env-file .env cachecow-app
    ```

## Environment Variables

Ensure all variables in `.env.example` are configured in your deployment environment (Cloud Run environment variables).
