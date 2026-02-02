# 🎬 Valentiflix

Valentiflix is a Netflix-themed, cinematic web experience designed as a romantic surprise for Valentine's Week. It features a daily "content unlock" system where specific messages and memories become available only on their respective days (Rose Day, Propose Day, etc.), building anticipation until the season finale on February 14th.

## ✨ Features

*   **Cinematic UI**: Dark mode, hero banners, and horizontal scrolling rows inspired by Netflix.
*   **Time-Locked Content**: Episodes (Rose, Propose, Chocolate, etc.) only unlock on specific dates.
*   **Authentication**: A login screen to keep your messages private.
*   **Interactive Elements**: Secret codes to unlock hidden messages, confetti effects, and a "Season Finale" surprise.
*   **Responsive**: Works beautifully on mobile and desktop.

## 🛠️ Prerequisites

*   Python 3.8+
*   Git

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### 1. Clone the Repository

```bash
git clone <repo-url>
cd valentiflix
```

### 2. Set Up Virtual Environment

It's best practice to run Python apps in a virtual environment.

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

The app handles sensitive data (like secret keys and passwords) using environment variables.

1.  Create a `.env` file in the root directory (same level as `app.py`).
2.  Copy the content from `.env.example` or use the template below.
3.  Modify the values to secure your app (especially `SECRET_KEY`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`).

**Example `.env` content:**

```ini
# Security
SECRET_KEY="change-me-to-a-long-random-string"

# Configuration
DEV_MODE=true
FLASK_ENV=development
PORT=5000

# Database (Optional/Future Use)
DATABASE_URL="sqlite:///valentiflix.db"

# Admin Credentials (The "Seed" User)
ADMIN_USERNAME=user@example.com
ADMIN_PASSWORD=password123
```

### 5. Initialize Database

Run the initialization script to verify configuration and seed the environment.

```bash
python db_init.py
```

### 6. Run the Application

```bash
python app.py
```

Visit `http://127.0.0.1:5000` in your browser.

---

## 🔑 Login Credentials

Use these credentials to log in:

*   **Email/Username**: `user@example.com` (or whatever you set for `ADMIN_USERNAME` in `.env`)
*   **Password**: `password123` (or whatever you set for `ADMIN_PASSWORD` in `.env`)

---

## 🛠️ Configuration & Customization

### DEV_MODE Explanation

*   **`DEV_MODE=true`**: Unlocks ALL episodes immediately. Useful for testing and verifying content.
*   **`DEV_MODE=false`**: Enforces the date-based logic. Episodes will only unlock on their specific dates (Feb 7 - Feb 14).

### Personalizing Content

Open `app.py` to customize:
*   **`CONTENT_DATA`**: Edit descriptions, images, and video URLs for each day.
*   **`MEMORIES_DATA`**: Update the "Memories" section with your own photos and stories.
*   **`USERS`**: The default user is seeded from `.env`, but logic can be extended in `app.py`.

---

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on hosting with Render, Railway, or PythonAnywhere.

## ❤️ License

Built with love. Free to use for any romantic endeavor.
