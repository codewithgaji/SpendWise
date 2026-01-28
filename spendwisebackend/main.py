from fastapi import FastAPI
from schemas import ExpenseBase, ExpenseCreate, ExpenseWithID, Category, PaymentMethod
from datetime import date



app = FastAPI()


EXPENSES = [
  {"title": "Grocery Shopping", "amount": 50, "category": Category.FOOD, "date": str(date.today()), "description": "Weekly groceries", "payment_method": PaymentMethod.CARD},
  {"title": "Gas", "amount": 40, "category": Category.TRANSPORT, "date": str(date.today()), "description": "Fuel for car", "payment_method": PaymentMethod.CARD},
  {"title": "Movie Tickets", "amount": 25, "category": Category.ENTERTAINMENT, "date": str(date.today()), "description": "Cinema visit", "payment_method": PaymentMethod.CASH},
  {"title": "Electricity Bill", "amount": 120, "category": Category.BILLS, "date": str(date.today()), "description": "Monthly electricity", "payment_method": PaymentMethod.ONLINE},
  {"title": "Restaurant", "amount": 60, "category": Category.FOOD, "date": str(date.today()), "description": "Dinner out", "payment_method": PaymentMethod.CARD},
]



@app.get("/expenses", response_model=list[ExpenseWithID])
async def get_expenses():
  expenses = [ExpenseWithID(id=i+1, **b) for i, b in enumerate(EXPENSES)]
  return expenses