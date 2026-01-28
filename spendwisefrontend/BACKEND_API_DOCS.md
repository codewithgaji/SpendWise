# SpendWise Backend API Documentation

This document provides complete specifications for building the FastAPI backend that powers the SpendWise expense tracking application.

## Table of Contents
- [API Endpoints](#api-endpoints)
- [Pydantic Schemas](#pydantic-schemas)
- [SQLAlchemy Models](#sqlalchemy-models)
- [Frontend-Backend Integration Map](#frontend-backend-integration-map)
- [CORS Configuration](#cors-configuration)
- [Example Request/Response](#example-requestresponse)
- [Testing Checklist](#testing-checklist)
- [Database Setup](#database-setup)
- [Notes on Field Handling](#notes-on-field-handling)

---

## API Endpoints

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| `GET` | `/expenses` | List all expenses | - | `List[Expense]` |
| `GET` | `/expenses/{id}` | Get single expense by ID | - | `Expense` |
| `POST` | `/expenses` | Create new expense | `ExpenseCreate` | `Expense` |
| `PUT` | `/expenses/{id}` | Update existing expense | `ExpenseUpdate` | `Expense` |
| `DELETE` | `/expenses/{id}` | Delete expense | - | `204 No Content` |
| `GET` | `/expenses/summary/category` | Get spending by category | - | `List[CategorySummary]` |
| `GET` | `/expenses/summary/monthly` | Get monthly spending | - | `List[MonthlySummary]` |

---

## Pydantic Schemas

Copy these directly into your FastAPI project:

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from enum import Enum


class CategoryEnum(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    BILLS = "Bills"
    ENTERTAINMENT = "Entertainment"
    HEALTH = "Health"
    OTHER = "Other"


class PaymentMethodEnum(str, Enum):
    CASH = "cash"
    CARD = "card"
    ONLINE = "online"


# Base schema with common fields
class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    amount: float = Field(..., gt=0, description="Expense amount in dollars")
    category: CategoryEnum
    date: date
    description: Optional[str] = Field(None, max_length=500)
    payment_method: PaymentMethodEnum


# Schema for creating a new expense
class ExpenseCreate(ExpenseBase):
    pass


# Schema for updating an expense (all fields optional)
class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[CategoryEnum] = None
    date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)
    payment_method: Optional[PaymentMethodEnum] = None


# Schema for expense response (includes DB-generated fields)
class Expense(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Allows ORM model conversion


# Schema for category summary
class CategorySummary(BaseModel):
    category: str
    total: float
    count: int


# Schema for monthly summary
class MonthlySummary(BaseModel):
    month: str  # Format: "Jan 2025"
    total: float
    count: int
```

---

## SQLAlchemy Models

```python
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from database import Base
import enum


class CategoryEnum(enum.Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    BILLS = "Bills"
    ENTERTAINMENT = "Entertainment"
    HEALTH = "Health"
    OTHER = "Other"


class PaymentMethodEnum(enum.Enum):
    CASH = "cash"
    CARD = "card"
    ONLINE = "online"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(SQLEnum(CategoryEnum), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String(500), nullable=True)
    payment_method = Column(SQLEnum(PaymentMethodEnum), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

---

## Frontend-Backend Integration Map

| Frontend Function | File | API Endpoint | HTTP Method |
|-------------------|------|--------------|-------------|
| `expenseApi.getAll()` | `src/lib/api.ts` | `/expenses` | GET |
| `expenseApi.getById(id)` | `src/lib/api.ts` | `/expenses/{id}` | GET |
| `expenseApi.create(expense)` | `src/lib/api.ts` | `/expenses` | POST |
| `expenseApi.update(id, expense)` | `src/lib/api.ts` | `/expenses/{id}` | PUT |
| `expenseApi.delete(id)` | `src/lib/api.ts` | `/expenses/{id}` | DELETE |
| `expenseApi.getCategorySummary()` | `src/lib/api.ts` | `/expenses/summary/category` | GET |
| `expenseApi.getMonthlySummary()` | `src/lib/api.ts` | `/expenses/summary/monthly` | GET |

### React Query Hooks

| Hook | Purpose | Uses |
|------|---------|------|
| `useExpenses()` | Fetch all expenses | `expenseApi.getAll()` |
| `useExpense(id)` | Fetch single expense | `expenseApi.getById(id)` |
| `useCreateExpense()` | Create expense mutation | `expenseApi.create()` |
| `useUpdateExpense()` | Update expense mutation | `expenseApi.update()` |
| `useDeleteExpense()` | Delete expense mutation | `expenseApi.delete()` |
| `useCategorySummary()` | Fetch category breakdown | `expenseApi.getCategorySummary()` |
| `useMonthlySummary()` | Fetch monthly breakdown | `expenseApi.getMonthlySummary()` |

---

## CORS Configuration

Add this to your FastAPI `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SpendWise API", version="1.0.0")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # Alternative dev port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Example Request/Response

### Create Expense

**Request:**
```http
POST /expenses
Content-Type: application/json

{
  "title": "Grocery shopping",
  "amount": 85.50,
  "category": "Food",
  "date": "2025-01-28",
  "description": "Weekly groceries from Whole Foods",
  "payment_method": "card"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Grocery shopping",
  "amount": 85.50,
  "category": "Food",
  "date": "2025-01-28",
  "description": "Weekly groceries from Whole Foods",
  "payment_method": "card",
  "created_at": "2025-01-28T10:30:00Z",
  "updated_at": "2025-01-28T10:30:00Z"
}
```

### Get All Expenses

**Request:**
```http
GET /expenses
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Grocery shopping",
    "amount": 85.50,
    "category": "Food",
    "date": "2025-01-28",
    "description": "Weekly groceries from Whole Foods",
    "payment_method": "card",
    "created_at": "2025-01-28T10:30:00Z",
    "updated_at": "2025-01-28T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Uber ride",
    "amount": 25.00,
    "category": "Transport",
    "date": "2025-01-27",
    "description": null,
    "payment_method": "online",
    "created_at": "2025-01-27T18:45:00Z",
    "updated_at": "2025-01-27T18:45:00Z"
  }
]
```

### Update Expense

**Request:**
```http
PUT /expenses/1
Content-Type: application/json

{
  "amount": 92.75,
  "description": "Weekly groceries - added snacks"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Grocery shopping",
  "amount": 92.75,
  "category": "Food",
  "date": "2025-01-28",
  "description": "Weekly groceries - added snacks",
  "payment_method": "card",
  "created_at": "2025-01-28T10:30:00Z",
  "updated_at": "2025-01-28T11:15:00Z"
}
```

### Delete Expense

**Request:**
```http
DELETE /expenses/1
```

**Response (204 No Content):**
```
(empty body)
```

### Get Category Summary

**Request:**
```http
GET /expenses/summary/category
```

**Response (200 OK):**
```json
[
  { "category": "Food", "total": 450.25, "count": 12 },
  { "category": "Transport", "total": 180.00, "count": 8 },
  { "category": "Shopping", "total": 320.50, "count": 5 },
  { "category": "Bills", "total": 550.00, "count": 3 },
  { "category": "Entertainment", "total": 85.00, "count": 4 }
]
```

### Get Monthly Summary

**Request:**
```http
GET /expenses/summary/monthly
```

**Response (200 OK):**
```json
[
  { "month": "Jan 2025", "total": 1250.75, "count": 25 },
  { "month": "Dec 2024", "total": 1580.25, "count": 32 },
  { "month": "Nov 2024", "total": 980.50, "count": 18 }
]
```

---

## Testing Checklist

### Basic CRUD Operations
- [ ] `GET /expenses` returns empty array when no expenses exist
- [ ] `POST /expenses` creates expense and returns it with ID
- [ ] `GET /expenses/{id}` returns correct expense
- [ ] `GET /expenses/{id}` returns 404 for non-existent ID
- [ ] `PUT /expenses/{id}` updates only provided fields
- [ ] `PUT /expenses/{id}` returns 404 for non-existent ID
- [ ] `DELETE /expenses/{id}` removes expense
- [ ] `DELETE /expenses/{id}` returns 404 for non-existent ID

### Validation
- [ ] `POST /expenses` rejects empty title
- [ ] `POST /expenses` rejects negative amount
- [ ] `POST /expenses` rejects invalid category
- [ ] `POST /expenses` rejects invalid payment_method
- [ ] `POST /expenses` rejects invalid date format
- [ ] Description over 500 characters is rejected

### Summary Endpoints
- [ ] `GET /expenses/summary/category` returns correct totals
- [ ] `GET /expenses/summary/monthly` returns data sorted by month
- [ ] Summary endpoints work with empty database

### CORS
- [ ] Frontend at localhost:5173 can make requests
- [ ] Preflight OPTIONS requests succeed
- [ ] Credentials are handled correctly

---

## Database Setup

### SQLite for Development

1. **Create `database.py`:**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./spendwise.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

2. **Create tables in `main.py`:**

```python
from database import engine, Base
from models import Expense  # Import your models

# Create tables on startup
Base.metadata.create_all(bind=engine)
```

3. **Run the server:**

```bash
uvicorn main:app --reload --port 8000
```

---

## Notes on Field Handling

### Decimal/Float Fields
- SQLAlchemy uses `Float` for the `amount` field
- Pydantic handles conversion automatically
- For production, consider using `Numeric(10, 2)` for precise currency handling:
  ```python
  from sqlalchemy import Numeric
  amount = Column(Numeric(10, 2), nullable=False)
  ```

### Date Fields
- Frontend sends dates as ISO strings: `"2025-01-28"`
- Pydantic's `date` type handles parsing automatically
- SQLAlchemy stores as `Date` type
- Returned dates are ISO formatted

### DateTime Fields
- `created_at` and `updated_at` are auto-managed by SQLAlchemy
- Use `server_default=func.now()` for creation timestamp
- Use `onupdate=func.now()` for automatic update timestamp
- Frontend receives ISO 8601 format: `"2025-01-28T10:30:00Z"`

### Enum Fields
- Define enums in both Pydantic and SQLAlchemy
- SQLAlchemy stores enum values as strings
- Use `.value` when comparing or querying:
  ```python
  db.query(Expense).filter(Expense.category == CategoryEnum.FOOD)
  ```

### Optional Fields
- `description` is the only optional field
- Use `Optional[str]` in Pydantic
- Use `nullable=True` in SQLAlchemy
- Frontend sends `null` or omits the field entirely

---

## Complete Main.py Example

```python
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime

from database import engine, Base, get_db
from models import Expense as ExpenseModel
from schemas import (
    Expense, ExpenseCreate, ExpenseUpdate,
    CategorySummary, MonthlySummary
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpendWise API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/expenses", response_model=List[Expense])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(ExpenseModel).all()


@app.get("/expenses/summary/category", response_model=List[CategorySummary])
def get_category_summary(db: Session = Depends(get_db)):
    results = db.query(
        ExpenseModel.category,
        func.sum(ExpenseModel.amount).label("total"),
        func.count(ExpenseModel.id).label("count")
    ).group_by(ExpenseModel.category).all()
    
    return [
        CategorySummary(category=r.category.value, total=r.total, count=r.count)
        for r in results
    ]


@app.get("/expenses/summary/monthly", response_model=List[MonthlySummary])
def get_monthly_summary(db: Session = Depends(get_db)):
    results = db.query(
        extract('year', ExpenseModel.date).label('year'),
        extract('month', ExpenseModel.date).label('month'),
        func.sum(ExpenseModel.amount).label("total"),
        func.count(ExpenseModel.id).label("count")
    ).group_by('year', 'month').order_by('year', 'month').all()
    
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    return [
        MonthlySummary(
            month=f"{months[int(r.month)-1]} {int(r.year)}",
            total=r.total,
            count=r.count
        )
        for r in results
    ]


@app.get("/expenses/{expense_id}", response_model=Expense)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@app.post("/expenses", response_model=Expense, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = ExpenseModel(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.put("/expenses/{expense_id}", response_model=Expense)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return None
```

---

## File Structure for Backend

```
backend/
├── main.py           # FastAPI app and routes
├── database.py       # SQLAlchemy engine and session
├── models.py         # SQLAlchemy ORM models
├── schemas.py        # Pydantic schemas
├── requirements.txt  # Dependencies
└── spendwise.db      # SQLite database (auto-created)
```

### requirements.txt

```
fastapi>=0.109.0
uvicorn>=0.27.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
```

---

This documentation provides everything needed to build a FastAPI backend that integrates seamlessly with the SpendWise frontend. The frontend will display clear error messages when the backend is not running, allowing you to verify your implementation step by step.
