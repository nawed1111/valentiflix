import os
import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

app = Flask(__name__)
app.secret_key = Config.SECRET_KEY

# --- CONFIGURATION ---
# Set this to False to enforce real dates. Set to True to see everything now.
# DEV_MODE is now loaded from Config

print(f"❤️  VALENTIFLIX STARTING... DEV_MODE={Config.DEV_MODE}")

# Users
USERS = {
    Config.ADMIN_USERNAME: generate_password_hash(Config.ADMIN_PASSWORD)
}

# The "Episodes" (Valentine Week)
# Dates are YYYY-MM-DD. 
CONTENT_DATA = [
    {
        "id": "rose",
        "date": "2026-02-07",
        "title": "Ep 1: The Red Rose",
        "subtitle": "Rose Day Special",
        "description": "Like a rose, you bring color and fragrance to my life. A small start to a big week.",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "memory_text": "Remember when we first met? I knew then that life would be rosier with you.",
        "secret_answer": "rose",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk&list=RDSAz5dqeWzyk&start_radio=1",
        "sound_file": "rose.mp3",
        "effect_type": "floating_roses",
        "surprise_type": "rose_bouquet"
    },
    {
        "id": "propose",
        "date": "2026-02-08",
        "title": "Ep 2: The Question",
        "subtitle": "Propose Day",
        "description": "It takes courage to ask, but it's easy when the answer is in the heart.",
        "image": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
        "memory_text": "If I had to ask you a thousand times, I would choose you every single time.",
        "secret_answer": "yes",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "propose.mp3",
        "effect_type": "cinematic_glow",
        "surprise_type": "propose_card"
    },
    {
        "id": "chocolate",
        "date": "2026-02-09",
        "title": "Ep 3: Sweetness",
        "subtitle": "Chocolate Day",
        "description": "Life is like a box of chocolates, but you are the sweetest truffle in the box.",
        "image": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80",
        "memory_text": "You are sweeter than any dessert I've ever had.",
        "secret_answer": "sweet",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "chocolate.mp3",
        "effect_type": "sparkles",
        "surprise_type": "chocolate_box"
    },
    {
        "id": "teddy",
        "date": "2026-02-10",
        "title": "Ep 4: Cuddles",
        "subtitle": "Teddy Day",
        "description": "Soft, warm, and always there to hold. Sending you a virtual bear hug.",
        "image": "https://images.unsplash.com/photo-1559570278-eb8d71d06403?auto=format&fit=crop&w=800&q=80",
        "memory_text": "I wish I could shrink you down and carry you in my pocket like a teddy bear.",
        "secret_answer": "hug",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "teddy.mp3",
        "effect_type": "soft_glow",
        "surprise_type": "teddy_hug"
    },
    {
        "id": "promise",
        "date": "2026-02-11",
        "title": "Ep 5: The Vow",
        "subtitle": "Promise Day",
        "description": "Promises are the glue of love. Here is mine to you, written in code and stone.",
        "image": "https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=800&q=80",
        "memory_text": "I promise to be your debugger when life throws runtime errors.",
        "secret_answer": "forever",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "promise.mp3",
        "effect_type": "particles",
        "surprise_type": "promise_contract"
    },
    {
        "id": "hug",
        "date": "2026-02-12",
        "title": "Ep 6: Embrace",
        "subtitle": "Hug Day",
        "description": "Sometimes words are not enough. A hug says everything the heart feels.",
        "image": "https://images.unsplash.com/photo-1517677130602-23a321cf7b98?auto=format&fit=crop&w=800&q=80",
        "memory_text": "Your arms are my favorite place to be.",
        "secret_answer": "warmth",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "hug.mp3",
        "effect_type": "warm_glow",
        "surprise_type": "hug_interaction"
    },
    {
        "id": "kiss",
        "date": "2026-02-13",
        "title": "Ep 7: Spark",
        "subtitle": "Kiss Day",
        "description": "A touch of lips, a seal of love. The anticipation before the big day.",
        "image": "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80",
        "memory_text": "Sealed with a kiss.",
        "secret_answer": "mwah",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "kiss.mp3",
        "effect_type": "heart_burst",
        "surprise_type": "kiss_mark"
    },
    {
        "id": "valentine",
        "date": "2026-02-14",
        "title": "Season Finale: Us",
        "subtitle": "Valentine's Day",
        "description": "The grand finale. The reason for the season. My Forever Valentine.",
        "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
        "memory_text": "You are my favorite movie, my favorite song, and my favorite person.",
        "secret_answer": "love",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk",
        "sound_file": "valentine.mp3",
        "effect_type": "pulse_beat",
        "surprise_type": "finale"
    }
]

# Memories Data
MEMORIES_DATA = [
    {
        "key": "siliguri",
        "title": "Siliguri",
        "description": "Where we met and our love blossomed",
        "poetic_lines": "In the city of tea and timber,\nOur souls found a reason to remember.\nThe chaos of streets faded away,\nLeaving only us, night and day.",
        "thumbnail": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    },
    {
        "key": "islampur",
        "title": "Islampur",
        "description": "Your hometown, where you risked to meet...",
        "poetic_lines": "A hometown secret, a risk you took,\nWritten in destiny's own book.\nTo see you smile was worth the mile,\nA memory kept in my heart's file.",
        "thumbnail": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    },
    {
        "key": "kolkata",
        "title": "Kolkata",
        "description": "Place where you came for me to see and make me feel...",
        "poetic_lines": "The City of Joy, where you came for me,\nA love as deep as the endless sea.\nYou made me feel what words can't say,\nA sunrise on my darkest day.",
        "thumbnail": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    },
    {
        "key": "mandarmani",
        "title": "Mandarmani",
        "description": "Your first trip to a beach",
        "poetic_lines": "Waves crashing at our feet,\nA melody of love, soft and sweet.\nThe sand, the sea, and your hand in mine,\nA moment frozen in endless time.",
        "thumbnail": "https://images.unsplash.com/photo-1559570278-eb8d71d06403?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    },
    {
        "key": "darjeeling",
        "title": "Darjeeling",
        "description": "First trip to a cold place",
        "poetic_lines": "Amidst the mist and mountain air,\nI found a warmth beyond compare.\nThe cold was sharp, but you were near,\nChasing away every doubt and fear.",
        "thumbnail": "https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    },
    {
        "key": "manifestation",
        "title": "Manifestation",
        "description": "Our endless trips to the world in future, In Sha Allah",
        "poetic_lines": "A map of dreams we have yet to trace,\nEvery corner of the world, every space.\nHand in hand, we'll roam the earth,\nA love that's proved its endless worth.",
        "thumbnail": "https://images.unsplash.com/photo-1517677130602-23a321cf7b98?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://www.youtube.com/watch?v=SAz5dqeWzyk"
    }
]

# Trivia Questions
TRIVIA_DATA = {
    "rose": [
        {"q": "What is the classic color of a rose given on Rose Day?", "options": ["Pink", "Red", "Yellow", "White"], "correct": 1},
        {"q": "How many roses signify 'I Love You'?", "options": ["1", "12", "100", "3"], "correct": 3},
        {"q": "Which goddess is often associated with roses?", "options": ["Athena", "Aphrodite", "Hera", "Artemis"], "correct": 1}
    ],
    "propose": [
        {"q": "What is the traditional knee to propose on?", "options": ["Left", "Right", "Either", "Both"], "correct": 0},
        {"q": "Which finger is the engagement ring worn on?", "options": ["Index", "Middle", "Ring", "Pinky"], "correct": 2},
        {"q": "Where is the most popular place to propose?", "options": ["Paris", "Venice", "New York", "Home"], "correct": 0}
    ],
    "chocolate": [
        {"q": "Which country consumes the most chocolate?", "options": ["USA", "Switzerland", "Belgium", "France"], "correct": 1},
        {"q": "What mood-boosting chemical is in chocolate?", "options": ["Serotonin", "Dopamine", "Oxytocin", "Adrenaline"], "correct": 0},
        {"q": "What type of chocolate is healthiest?", "options": ["White", "Milk", "Dark", "Ruby"], "correct": 2}
    ],
    "teddy": [
        {"q": "Who is the most famous teddy bear?", "options": ["Paddington", "Pooh", "Ted", "Yogi"], "correct": 1},
        {"q": "When was the teddy bear invented?", "options": ["1902", "1920", "1950", "1890"], "correct": 0},
        {"q": "What US President is the teddy bear named after?", "options": ["Lincoln", "Roosevelt", "Washington", "Kennedy"], "correct": 1}
    ],
    "promise": [
        {"q": "A promise ring is a symbol of?", "options": ["Commitment", "Friendship", "Wealth", "Style"], "correct": 0},
        {"q": "How long should a promise last?", "options": ["A day", "A year", "Forever", "Until hungry"], "correct": 2},
        {"q": "What is the best way to keep a promise?", "options": ["Write it down", "Don't make it", "Honor it", "Forget it"], "correct": 2}
    ],
    "hug": [
        {"q": "How long of a hug releases oxytocin?", "options": ["5 seconds", "10 seconds", "20 seconds", "1 minute"], "correct": 2},
        {"q": "A hug is a universal sign of?", "options": ["Comfort", "Anger", "Confusion", "Hunger"], "correct": 0},
        {"q": "Hugging boosts your?", "options": ["Ego", "Immune System", "Height", "Speed"], "correct": 1}
    ],
    "kiss": [
        {"q": "Philematology is the science of?", "options": ["Hugging", "Kissing", "Loving", "Talking"], "correct": 1},
        {"q": "How many muscles does a kiss use?", "options": ["10", "20", "34", "100"], "correct": 2},
        {"q": "Kissing burns how many calories per minute?", "options": ["2-6", "10-20", "50", "0"], "correct": 0}
    ],
    "valentine": [
        {"q": "Who is Cupid the son of?", "options": ["Venus", "Mars", "Jupiter", "Apollo"], "correct": 0},
        {"q": "What is the flower of Valentine's Day?", "options": ["Lily", "Rose", "Tulip", "Orchid"], "correct": 1},
        {"q": "What does 'X' stand for in XOXO?", "options": ["Hugs", "Kisses", "Love", "No"], "correct": 1}
    ]
}

# --- CONTEXT PROCESSORS ---
@app.context_processor
def inject_globals():
    return dict(dev_mode=Config.DEV_MODE)

# --- HELPERS ---
def get_content_status():
    """Determines which episodes are locked based on current date."""
    today = datetime.date.today().isoformat()
    processed_content = []
    
    for item in CONTENT_DATA:
        # Create a copy so we don't mutate the global state permanently
        item_copy = item.copy()
        
        if Config.DEV_MODE:
            item_copy['locked'] = False
        else:
            item_copy['locked'] = item['date'] > today
            
        processed_content.append(item_copy)
    
    return processed_content

def get_episode_by_id(ep_id):
    content = get_content_status()
    for item in content:
        if item['id'] == ep_id:
            return item
    return None

# --- ROUTES ---

@app.route('/')
def index():
    if 'user' in session:
        return redirect(url_for('profiles'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username in USERS and check_password_hash(USERS[username], password):
            session['user'] = username
            return redirect(url_for('profiles'))
        else:
            flash('Invalid credentials. Try "love" and "you".')
            
    return render_template('login.html')

@app.route('/profiles')
def profiles():
    if 'user' not in session: return redirect(url_for('login'))
    return render_template('profiles.html')

@app.route('/browse')
def browse():
    if 'user' not in session: return redirect(url_for('login'))
    
    content = get_content_status()
    # Feature the first unlocked item, or the last one if all unlocked
    featured = next((item for item in reversed(content) if not item['locked']), content[0])
    
    return render_template('browse.html', content=content, featured=featured, memories=MEMORIES_DATA)

@app.route('/watch/<ep_id>')
def watch(ep_id):
    if 'user' not in session: return redirect(url_for('login'))
    
    episode = get_episode_by_id(ep_id)
    
    if not episode:
        return redirect(url_for('browse'))
        
    if episode['locked']:
        flash("Not available yet! Patience is romantic.")
        return redirect(url_for('browse'))
        
    trivia = TRIVIA_DATA.get(ep_id, [])

    return render_template('watch.html', episode=episode, is_finale=(ep_id == 'valentine'), trivia=trivia)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)