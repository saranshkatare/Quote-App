from fastapi import FastAPI, Depends, HTTPException, status
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
    description="Minimalist Quote API powering dohes, pohe vibes, and timeless quotes.",
    version="1.0.0"
)

# CORS middleware for local frontend and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for easy deployment (Vercel, Render, Railway)
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
            status_code=status.HTTP_444_NOT_FOUND if hasattr(status, 'HTTP_444_NOT_FOUND') else 404,
            detail="No quotes found in database."
        )
    return quote

@app.get("/quotes", response_model=List[schemas.QuoteResponse], tags=["Quotes"])
def get_all_quotes(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Fetch all quotes from the database, newest first."""
    query = db.query(models.Quote)
    if category:
        query = query.filter(models.Quote.category.ilike(f"%{category}%"))
    quotes = query.order_by(models.Quote.created_at.desc()).all()
    return quotes

@app.post("/quotes", response_model=schemas.QuoteResponse, status_code=status.HTTP_201_CREATED, tags=["Quotes"])
def create_quote(quote: schemas.QuoteCreate, db: Session = Depends(get_db)):
    """Upload a new quote to the database."""
    db_quote = models.Quote(
        text=quote.text.strip(),
        author=quote.author.strip() if quote.author else "Unknown",
        category=quote.category.strip() if quote.category else "General"
    )
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@app.delete("/quotes/{quote_id}", status_code=status.HTTP_200_OK, tags=["Quotes"])
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    """Delete a quote by ID."""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found.")
    db.delete(db_quote)
    db.commit()
    return {"detail": f"Quote {quote_id} deleted successfully."}
