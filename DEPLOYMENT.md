# MedMatch Deployment Guide

This document provides instructions for deploying the MedMatch application to Vercel with MongoDB Atlas.

## Prerequisites

- A [Vercel](https://vercel.com/) account
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- Git repository with your MedMatch code

## Local Testing Before Deployment

Before deploying to production, test that everything is working correctly:

1. Make sure both backend and frontend are running locally:
   ```
   # In one terminal (backend)
   cd backend && npm run dev
   
   # In another terminal (frontend)
   npm run dev
   ```

2. Run the deployment test script to verify everything is set up correctly:
   ```
   ./test-deployment.sh
   ```

3. Resolve any issues that the test script identifies.

## Setting Up MongoDB Atlas

1. Log in to MongoDB Atlas and create a new project.
2. Create a new cluster (the free tier is sufficient for testing).
3. Set up a database user with read/write privileges.
4. Configure network access to allow connections from anywhere (for Vercel serverless functions).
5. Get your MongoDB connection string, which will look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/medmatch
   ```

## Deploying to Vercel

### Step 1: Configure Environment Variables

In Vercel, you'll need to set up the following environment variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for signing JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time (e.g., `7d`)
- `NODE_ENV`: Set to `production`

### Step 2: Link Your GitHub Repository

1. Import your project from GitHub to Vercel.
2. Select the repository containing your MedMatch code.
3. Configure the project:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Deploy

1. Click "Deploy" to start the deployment process.
2. Wait for the build and deployment to complete.
3. Once deployed, you'll get a deployment URL like `https://your-project.vercel.app`.

### Step 4: Seed the Production Database

After deployment, you need to create the test users in your production database:

1. Create a temporary file with MongoDB connection details:
   ```
   # .env.production
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

2. Run the seed script with this environment file:
   ```
   cd backend
   NODE_ENV=production MONGODB_URI=your_mongodb_atlas_connection_string node utils/seedTestUsers.js
   ```

3. Verify the users were created by testing the login endpoints.

## Testing the Deployment

Once deployed, verify that everything is working correctly:

1. Visit your Vercel deployment URL.
2. Try logging in with the guest account:
   - Email: `guest@example.com`
   - Password: `guest123`
3. Verify that the navigation shows the appropriate links based on authentication state.
4. Check that the admin login works at `/admin`:
   - Email: `admin@example.com`
   - Password: `password123`

## Troubleshooting

### API Endpoints Not Working

If the API endpoints aren't working, check:

1. That your Vercel configuration is properly routing API requests to the backend.
2. That the MongoDB connection string is correct.
3. That the necessary environment variables are set.

### Authentication Issues

If login doesn't work:

1. Check that the JWT secret is properly set.
2. Verify that the test users exist in the production database.
3. Check browser console for error messages.

### Database Connection Problems

If there are problems connecting to MongoDB:

1. Ensure network access is configured to allow connections from Vercel.
2. Verify the connection string format.
3. Check if the database user has appropriate permissions.

## Custom Domain Setup (Optional)

To use a custom domain:

1. Go to your Vercel project settings.
2. Navigate to "Domains".
3. Add your custom domain and follow the instructions to configure DNS.

## CI/CD Pipeline (Optional)

Vercel automatically deploys when you push to your main branch. To set up a more complex pipeline:

1. Configure branch deployments for feature branches.
2. Set up preview deployments for pull requests.
3. Configure automatic rollbacks if needed.

## Maintaining the Deployment

- Regularly backup your MongoDB Atlas database.
- Monitor application performance and logs in Vercel.
- Keep dependencies updated to patch security vulnerabilities. 