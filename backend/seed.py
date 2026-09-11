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
        "text": "दुख में सुमिरन सब करे, सुख में करे न कोय । जो सुख में सुमिरन करे, तो दुख काहे को होय ॥",
        "author": "कबीर दास",
        "category": "हिंदी दोहे",
        "likes": 48
    },
    {
        "text": "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय । ढाई आखर प्रेम का, पढ़े सो पंडित होय ॥",
        "author": "कबीर दास",
        "category": "हिंदी दोहे",
        "likes": 45
    },
    {
        "text": "विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥",
        "author": "हितोपदेश",
        "category": "संस्कृत श्लोक",
        "likes": 39
    },
    {
        "text": "Dukh mein simran sab kare, sukh mein kare na koye. Jo sukh mein simran kare, to dukh kahe ko hoye.",
        "author": "Kabir Das",
        "category": "Dohe",
        "likes": 38
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
        "text": "Khatri ke Pohe gives fuel to the body, Life ke Dohe gives peace to the mind.",
        "author": "Anonymous",
        "category": "Humor",
        "likes": 50
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
        print("Database seeded with initial multi-language dohes & wisdom quotes successfully.")
