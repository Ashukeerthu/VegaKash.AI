"""
Database Models for VegaKash.AI
Currently not used in Phase 1 (no authentication/database)

This file is a placeholder for Phase 2 when we add:
- User accounts and authentication
- Persistent storage of financial plans
- Historical tracking of financial data
"""

# TODO: Phase 2 - Implement database models using SQLAlchemy
# 
# Example structure for Phase 2:
#
# from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import relationship
# from datetime import datetime
#
# Base = declarative_base()
#
# class User(Base):
#     """User account model"""
#     __tablename__ = "users"
#     
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     hashed_password = Column(String, nullable=False)
#     full_name = Column(String)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     is_active = Column(Boolean, default=True)
#     
#     # Relationships
#     financial_plans = relationship("FinancialPlan", back_populates="user")
#
#
# class FinancialPlan(Base):
#     """Saved financial plan model"""
#     __tablename__ = "financial_plans"
#     
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     name = Column(String, nullable=False)  # e.g., "January 2024 Plan"
#     
#     # Financial data (stored as JSON)
#     financial_input = Column(JSON, nullable=False)
#     summary = Column(JSON, nullable=False)
#     ai_plan = Column(JSON, nullable=True)
#     
#     # Metadata
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     
#     # Relationships
#     user = relationship("User", back_populates="financial_plans")
#
#
# class FinancialSnapshot(Base):
#     """Monthly snapshot of financial data for tracking progress"""
#     __tablename__ = "financial_snapshots"
#     
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     month = Column(Integer, nullable=False)  # 1-12
#     year = Column(Integer, nullable=False)
#     
#     # Key metrics
#     total_income = Column(Float, nullable=False)
#     total_expenses = Column(Float, nullable=False)
#     net_savings = Column(Float, nullable=False)
#     savings_rate_percent = Column(Float, nullable=False)
#     
#     created_at = Column(DateTime, default=datetime.utcnow)


# Phase 2 Implementation Notes:
# 
# 1. Database Setup:
#    - Add PostgreSQL or SQLite database
#    - Use Alembic for migrations
#    - Update config.py with DATABASE_URL
#
# 2. Authentication:
#    - Implement JWT-based authentication
#    - Add password hashing (bcrypt)
#    - Create login/register endpoints
#
# 3. CRUD Operations:
#    - Create endpoints to save/retrieve financial plans
#    - Add endpoints for user profile management
#    - Implement plan history and comparison
#
# 4. Security:
#    - Add rate limiting
#    - Implement proper authorization (users can only access their own data)
#    - Add input sanitization
#
# 5. Features to Add:
#    - Save multiple financial plans per user
#    - Track financial progress over time
#    - Compare plans month-over-month
#    - Set and track financial goals
#    - Generate reports and insights

"""
Placeholder for Phase 1
No database models are used in Phase 1 as there is no authentication or data persistence.
All data is processed in-memory and not stored.
"""
