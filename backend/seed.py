from sqlalchemy.orm import Session
from models import Quote

INITIAL_QUOTES = [
    {
        "text": "Life ke Dohe, Khatri ke Pohe: Life is best enjoyed with warm tea, delicious pohe, and timeless wisdom.",
        "author": "Khatri Ji",
        "category": "Life",
        "likes": 42
    },
    {
        "text": "Dukh mein simran sab kare, sukh mein kare na koye. Jo sukh mein simran kare, to dukh kahe ko hoye.",
        "author": "Kabir Das",
        "category": "Dohe",
        "likes": 38
    },
    {
        "text": "Pothi padhi padhi jag mua, pandit bhaya na koye. Dhai akshar prem ka, padhe so pandit hoye.",
        "author": "Kabir Das",
        "category": "Dohe",
        "likes": 29
    },
    {
        "text": "Bura jo dekhn main chala, bura na milya koye. Jo dil khoja aapna, mujhse bura na koye.",
        "author": "Kabir Das",
        "category": "Dohe",
        "likes": 35
    },
    {
        "text": "Simplicity is the ultimate sophistication.",
        "author": "Leonardo da Vinci",
        "category": "Minimalism",
        "likes": 24
    },
    {
        "text": "The only way to do great work is to love what you do.",
        "author": "Steve Jobs",
        "category": "Inspiration",
        "likes": 31
    },
    {
        "text": "In the middle of difficulty lies opportunity.",
        "author": "Albert Einstein",
        "category": "Growth",
        "likes": 27
    },
    {
        "text": "Khatri ke Pohe gives fuel to the body, Life ke Dohe gives peace to the mind.",
        "author": "Anonymous",
        "category": "Humor",
        "likes": 50
    },
    {
        "text": "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
        "author": "Gautama Buddha",
        "category": "Mindfulness",
        "likes": 22
    }
]

def seed_database(db: Session):
    existing_count = db.query(Quote).count()
    if existing_count == 0:
        for item in INITIAL_QUOTES:
            quote = Quote(
                text=item["text"], 
                author=item["author"], 
                category=item["category"],
                likes=item.get("likes", 0)
            )
            db.add(quote)
        db.commit()
        print("Database seeded with initial dohes & wisdom quotes successfully.")
