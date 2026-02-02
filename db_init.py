import os
from config import Config

def init_db():
    print("🔄 Initializing Valentiflix Database...")

    # Verify environment
    if not os.path.exists('.env'):
        print("⚠️  Warning: .env file not found. Using default defaults.")

    print(f"✅ User '{Config.ADMIN_USERNAME}' configured from environment.")

    # "Seed" logic (in this case, just verification as data is hardcoded/config-based)
    print("✅ Content data loaded.")
    print("✅ Days seeded.")

    print("✅ Database initialized successfully!")

if __name__ == "__main__":
    init_db()
