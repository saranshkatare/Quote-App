from sqlalchemy.orm import Session
from models import Quote

INITIAL_QUOTES = [
    {
        "text": "Life ke Dohe, Khatri ke Pohe: Life is best enjoyed with warm tea, delicious pohe, and timeless wisdom.",
        "author": "Khatri Ji",
        "category": "Life"
    },
    {
        "text": "Dukh mein simran sab kare, sukh mein kare na koye. Jo sukh mein simran kare, to dukh kahe ko hoye.",
        "author": "Kabir Das",
        "category": "Dohe"
    },
    {
        "text": "Pothi padhi padhi jag mua, pandit bhaya na koye. Dhai akshar prem ka, padhe so pandit hoye.",
        "author": "Kabir Das",
        "category": "Dohe"
    },
    {
        "text": "Bura jo dekhn main chala, bura na milya koye. Jo dil khoja aapna, mujhse bura na koye.",
        "author": "Kabir Das",
        "category": "Dohe"
    },
    {
        "text": "Simplicity is the ultimate sophistication.",
        "author": "Leonardo da Vinci",
        "category": "Minimalism"
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "category": "Inspiration"
    },
    {
        "text": "In the middle of difficulty lies opportunity.",
        "author": "Albert Einstein",
        "category": "Growth"
    },
    {
        "text": "Khatri ke Pohe gives fuel to the body, Life ke Dohe gives peace to the mind.",
        "author": "Anonymous",
        "category": "Humor"
    },
    {
        "text": "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        "author": "Gautama Buddha",
        "category": "Mindfulness"
    }
]

def seed_database(db: Session):
    existing_count = db.query(Quote).count()
    if existing_count == 0:
        for item in INITIAL_QUOTES:
            quote = Quote(text=item["text"], author=item["author"], category=item["category"])
            db.add(quote)
        db.commit()
        print("Database seeded with initial dohes & wisdom quotes successfully.")
