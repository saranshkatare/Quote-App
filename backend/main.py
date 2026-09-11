import tempfile
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional

import models
import schemas
from database import engine, get_db
from seed import seed_database

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Life ke Dohe, Khatri ke Pohe - Quote API",
    description="Minimalist Quote API powering dohes, pohe vibes, timeless quotes, TTS and likes.",
    version="1.1.0"
)

# CORS middleware for local frontend and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Seed DB with default quotes if empty
    db = next(get_db())
    seed_database(db)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "app": "Life ke Dohe , Khatri ke Pohe - Quote API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/quotes/random", response_model=schemas.QuoteResponse, tags=["Quotes"])
def get_random_quote(db: Session = Depends(get_db)):
    """Fetch a single random quote from the database."""
    quote = db.query(models.Quote).order_by(func.random()).first()
    if not quote:
        raise HTTPException(
            status_code=404,
            detail="No quotes found in database."
        )
    return quote

@app.get("/quotes", response_model=List[schemas.QuoteResponse], tags=["Quotes"])
def get_all_quotes(
    category: Optional[str] = None,
    sort_by: Optional[str] = "newest",
    db: Session = Depends(get_db)
):
    """Fetch all quotes, sorted by newest or most liked."""
    query = db.query(models.Quote)
    if category and category.upper() != "ALL":
        query = query.filter(models.Quote.category.ilike(f"%{category}%"))
    
    if sort_by == "likes":
        quotes = query.order_by(models.Quote.likes.desc(), models.Quote.created_at.desc()).all()
    else:
        quotes = query.order_by(models.Quote.created_at.desc()).all()
    return quotes

@app.get("/quotes/popular", response_model=List[schemas.QuoteResponse], tags=["Quotes"])
def get_popular_quotes(limit: int = 5, db: Session = Depends(get_db)):
    """Fetch top liked quotes."""
    return db.query(models.Quote).order_by(models.Quote.likes.desc()).limit(limit).all()

@app.post("/quotes", response_model=schemas.QuoteResponse, status_code=status.HTTP_201_CREATED, tags=["Quotes"])
def create_quote(quote: schemas.QuoteCreate, db: Session = Depends(get_db)):
    """Upload a new quote to the database."""
    db_quote = models.Quote(
        text=quote.text.strip(),
        author=quote.author.strip() if quote.author else "Unknown",
        category=quote.category.strip() if quote.category else "General",
        likes=0
    )
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@app.post("/quotes/{quote_id}/like", response_model=schemas.QuoteResponse, tags=["Quotes"])
def like_quote(quote_id: int, db: Session = Depends(get_db)):
    """Increment like count for a specific quote."""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found.")
    db_quote.likes += 1
    db.commit()
    db.refresh(db_quote)
    return db_quote

@app.get("/quotes/{quote_id}/tts", tags=["TTS Audio"])
async def get_quote_tts(quote_id: int, db: Session = Depends(get_db)):
    """
    Generate deep poetic TTS audio using edge-tts (Microsoft Neural Voice).
    Deep baritone poet voice: en-IN-PrabhatNeural or en-US-ChristopherNeural with pitch/rate tuning.
    """
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found.")

    try:
        import edge_tts
        
        # Prepare text for deep narration
        narration_text = f"{db_quote.text}. By {db_quote.author}."
        
        # Deep poetic voice selection with rate & pitch adjustments for poetic baritone cadence
        voice = "en-IN-PrabhatNeural"
        rate = "-12%"
        pitch = "-10Hz"

        communicate = edge_tts.Communicate(narration_text, voice, rate=rate, pitch=pitch)
        
        # Write to temporary mp3 file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        await communicate.save(temp_file.name)

        return FileResponse(
            temp_file.name,
            media_type="audio/mpeg",
            filename=f"quote_{quote_id}.mp3"
        )
    except Exception as e:
        print(f"Error generating Edge TTS: {e}")
        raise HTTPException(
            status_code=500,
            detail="Neural TTS generation unavailable. Fallback to client speech synthesis."
        )

@app.delete("/quotes/{quote_id}", status_code=status.HTTP_200_OK, tags=["Quotes"])
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    """Delete a quote by ID."""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found.")
    db.delete(db_quote)
    db.commit()
    return {"detail": f"Quote {quote_id} deleted successfully."}
