# 🚀 Vercel Deployment Guide - KelSun Ventures Portal

## 📋 Required Environment Variables

You need to set these environment variables in your Vercel project:

### 🔑 **Essential Variables**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | `your-32-char-secret-key` | ✅ Yes |
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` | ✅ Yes |

### 🔧 **Optional Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXTAUTH_DEBUG` | Enable debug mode | `false` | ❌ No |

## 🗄️ Database Setup Options

### 1. **Vercel Postgres (Recommended)**

**Pros:**
- Built-in integration with Vercel
- Automatic connection pooling
- Easy setup through dashboard
- Free tier available

**Setup:**
1. Go to your Vercel project dashboard
2. Navigate to "Storage" tab
3. Click "Create Database" → "Postgres"
4. Choose a name and region
5. Vercel will automatically set `DATABASE_URL`

### 2. **PlanetScale**

**Pros:**
- Serverless MySQL platform
- Great for scaling
- Free tier available
- Branching for databases

**Setup:**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection string from dashboard
4. Set `DATABASE_URL` in Vercel

### 3. **Supabase**

**Pros:**
- Open source Firebase alternative
- PostgreSQL with real-time features
- Free tier available
- Built-in authentication

**Setup:**
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Set `DATABASE_URL` in Vercel

### 4. **Railway**

**Pros:**
- Simple PostgreSQL hosting
- Good for small to medium applications
- Easy setup

**Setup:**
1. Create account at [railway.app](https://railway.app)
2. Create a new PostgreSQL service
3. Get connection string from Variables tab
4. Set `DATABASE_URL` in Vercel

## 🚀 Step-by-Step Vercel Deployment

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `gethsun1/kelsun-ventures-`
4. Choose your repository and click "Import"

### Step 2: Configure Project
1. **Project Name**: `kelsun-ventures-portal` (or your preferred name)
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `.next` (default)
6. **Install Command**: `npm install` (default)

### Step 3: Set Environment Variables
1. In the "Environment Variables" section, add:

```
DATABASE_URL = postgresql://username:password@host:port/database
NEXTAUTH_SECRET = your-super-secret-key-here-minimum-32-characters
NEXTAUTH_URL = https://your-app-name.vercel.app
```

2. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

> Note: Migrations should not run during Vercel build. Run them separately via CLI after the first deploy.

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. After the first successful build, run migrations from your machine:

```bash
vercel login
vercel link
npx prisma migrate deploy
```
4. Your app will be available at `https://your-app-name.vercel.app`

## 🗄️ Database Migration

After deployment, you need to run database migrations:

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run database migrations
npx prisma migrate deploy
```

### Option 2: Manual Migration
1. Go to your Vercel project dashboard
2. Navigate to "Functions" tab
3. Create a new serverless function to run migrations
4. Or use a database management tool

### Option 3: One-time Migration Script
Create a migration script and run it once:

```bash
# Add to package.json scripts
"migrate": "prisma migrate deploy"

# Run via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

## 🔧 Post-Deployment Setup

### 1. **Seed Initial Data (Optional)**
```bash
# Run the seed script
npm run seed
```

### 2. **Verify Deployment**
- ✅ Check if the app loads correctly
- ✅ Test user registration
- ✅ Test login functionality
- ✅ Verify database connections
- ✅ Check all pages load properly

### 3. **Set Up Custom Domain (Optional)**
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## 🛠️ Troubleshooting

### Common Issues

#### **Database Connection Errors**
```
Error: Can't reach database server
```
**Solution:**
- Verify `DATABASE_URL` is correct
- Check if database allows external connections
- Ensure SSL is enabled for production databases

#### **NextAuth.js Errors**
```
Error: NEXTAUTH_SECRET is not set
```
**Solution:**
- Ensure `NEXTAUTH_SECRET` is set in Vercel
- Redeploy after adding environment variables
- Check that the secret is at least 32 characters

#### **Build Failures**
```
Error: Module not found
```
**Solution:**
- Check if all dependencies are in `package.json`
- Ensure build command is `prisma generate && next build` (migrations run separately)
- Check for TypeScript errors

#### **Migration Issues**
```
Error: Migration failed
```
**Solution:**
- Run `npx prisma generate` before migration
- Check database permissions
- Verify connection string format

### Debug Mode
Enable debug mode temporarily:
```
NEXTAUTH_DEBUG = true
```

## 📊 Performance Optimization

### 1. **Database Optimization**
- Use connection pooling (Vercel Postgres includes this)
- Add database indexes for frequently queried fields
- Use Prisma's query optimization features

### 2. **Next.js Optimization**
- Enable static generation where possible
- Use Next.js Image optimization
- Implement proper caching strategies

### 3. **Vercel Optimization**
- Use Vercel's Edge Functions for global performance
- Enable Vercel Analytics
- Use Vercel's CDN for static assets

## 🔒 Security Checklist

- ✅ Use strong, unique `NEXTAUTH_SECRET`
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Use production database with SSL
- ✅ Set up proper CORS policies
- ✅ Implement rate limiting (consider Vercel's built-in protection)
- ✅ Regular security updates
- ✅ Monitor for vulnerabilities

## 📈 Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor performance metrics
3. Track user behavior and errors

### Database Monitoring
- Monitor database performance
- Set up alerts for connection issues
- Track query performance

## 🎯 Next Steps

1. **Set up monitoring** and error tracking
2. **Configure backups** for your database
3. **Set up CI/CD** for automated deployments
4. **Implement testing** in your deployment pipeline
5. **Set up staging environment** for testing

Your KelSun Ventures Portal is now ready for production! 🚀
