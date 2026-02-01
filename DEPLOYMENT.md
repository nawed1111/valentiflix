# 🚀 Deployment Guide for Valentiflix

This guide outlines the best ways to deploy your Flask application. Since your app involves media files (videos, audio) and potentially a database, here are the top 3 recommended platforms.

## ✅ Option 1: Render (Best for Simplicity & Free Tier)

**Render** is a modern cloud provider that is very easy to set up.

### Pros
- **Free Tier:** Generous free tier for web services (though it spins down after inactivity).
- **Easy Setup:** Connect GitHub, select repo, and it builds automatically.
- **Native Python Support:** Detects `requirements.txt` automatically.

### Cons
- **Spin Down:** Free instances go to sleep after 15 mins of inactivity (first request takes 30s+).
- **Persistent Disk:** Free tier does not support persistent disks (uploaded files will be lost on restart), but your code/static assets are fine.

### ⚙️ Configuration
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`
- **Environment Variables:** Add `SECRET_KEY`, `DEV_MODE`, etc. in the Render Dashboard under "Environment".

### 📦 Static Files & Videos
- Small static files (CSS, JS, Images) are served fine by Flask/Gunicorn.
- **Videos:** If your repo size < 500MB, you can keep videos in `static/videos/`. For better performance or larger libraries, use an external service like **Cloudinary** or **AWS S3**.

### 🗄 Database
- **SQLite:** Not recommended on Render Free Tier because the filesystem is ephemeral (resets on deploy/restart).
- **Postgres:** Render offers a managed Postgres database (Free tier valid for 90 days, then paid).

---

## ✅ Option 2: Railway (Best for Performance & Database)

**Railway** provides a very robust infrastructure with easy database provisioning.

### Pros
- **Fast:** No "spin down" on paid/trial plans.
- **Database:** One-click Postgres/Redis setup.
- **Developer Experience:** Excellent UI and CLI.

### Cons
- **Trial Only:** No permanent free tier (credits based). Eventually requires a small monthly fee ($5/mo).

### ⚙️ Configuration
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`
- **Procfile:** Create a file named `Procfile` with: `web: gunicorn app:app`

### 📦 Static Files & Videos
- Similar to Render, serves static files well.
- **Videos:** Better bandwidth than free tiers usually.

### 🗄 Database
- **Postgres:** Highly recommended. Use `DATABASE_URL` env var which Railway provides automatically when you add a plugin.

---

## ✅ Option 3: PythonAnywhere (Best for "Pure" Python Hosting)

**PythonAnywhere** is specialized for Python Flask/Django apps.

### Pros
- **Forever Free:** Basic tier is free forever (manual "renewal" click every 3 months).
- **Filesystem:** Persistent filesystem (SQLite works great here!).
- **No Spin Down:** Always active.

### Cons
- **Old School UI:** Not as modern as Render/Railway.
- **No Native Git Push to Deploy:** You have to pull code manually via console or set up a webhook script (on free tier).
- **Limited Outbound:** Free tier blocks outgoing requests (except whitelisted sites).

### ⚙️ Configuration
- **WSGI:** Configured via their dashboard (not Gunicorn directly, they use uWSGI).
- **Environment Variables:** Set in the WSGI configuration file or `.env` (needs manual loading code).

### 📦 Static Files & Videos
- **Mapping:** You MUST map `/static` to your folder in the "Web" tab.
- **Videos:** Works fine, but storage is limited (512MB on free tier).

### 🗄 Database
- **SQLite:** **Works perfectly** here because the disk is persistent.
- **MySQL:** Free tier includes a MySQL database.

---

## 💡 Best Practices

### 1. WSGI Server
Do not use `python app.py` (Flask dev server) in production. Use **Gunicorn**.
- Install: `pip install gunicorn`
- Add `gunicorn` to `requirements.txt`.
- Run: `gunicorn app:app`

### 2. Handling Videos (MP4)
- **Local (Simple):** Keep in `static/videos/` if total size is small (<200MB). Git handles this fine.
- **Cloud (Pro):** If you have many large videos, upload them to **Cloudinary** (Free tier is generous) or AWS S3. Store the URL in your data instead of the filename.

### 3. Environment Variables
- Never commit `.env`.
- Set variables in the host's dashboard (Render/Railway).
- Ensure `DEV_MODE=False` in production to enforce date locks!
