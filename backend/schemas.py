from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class QuoteBase(BaseModel):
    text: str = Field(..., min_length=3, description="The quote text content")
    author: str = Field(default="Unknown", min_length=1, description="The quote author")
    category: str = Field(default="General", min_length=1, description="Category or tag")

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=3)
    author: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)

class QuoteResponse(QuoteBase):
    id: int
    likes: int = 0
    created_at: datetime

    class Config:
        from_attributes = True
