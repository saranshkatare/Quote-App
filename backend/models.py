from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False, default="Unknown")
    category = Column(String, nullable=False, default="General", index=True)
    likes = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
