from fastapi import FastAPI, HTTPException
from schemas import ExpenseBase, ExpenseCreate, ExpenseWithID, Category, PaymentMethod
from datetime import date
from fastapi.middleware.cors import CORSMiddleware





app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_headers=["*"],
  allow_origins = ["*"],
  allow_credentials = True
)




EXPENSES = [
  {"id": 1, 
   "title": "Grocery Shopping", 
   "amount": 50, 
   "category": Category.FOOD, 
   "date": str(date.today()), 
   "description": "Weekly groceries", "payment_method": PaymentMethod.CARD},

  {"id": 2, 
   "title": "Gas", 
   "amount": 40, "category": 
   Category.TRANSPORT, 
   "date": str(date.today()), 
   "description": "Fuel for car", 
   "payment_method": PaymentMethod.CARD},

  {"id": 3, 
   "title": "Movie Tickets", 
   "amount": 25, 
   "category": Category.ENTERTAINMENT, 
   "date": str(date.today()), 
   "description": "Cinema visit", 
   "payment_method": PaymentMethod.CASH},

  {"id": 4, 
   "title": "Electricity Bill", 
   "amount": 120, 
   "category": Category.BILLS, 
   "date": str(date.today()), 
   "description": "Monthly electricity", "payment_method": PaymentMethod.ONLINE},

  {"id": 5, 
   "title": "Restaurant", 
   "amount": 60, 
   "category": Category.FOOD, 
   "date": str(date.today()), 
   "description": "Dinner out", 
   "payment_method": PaymentMethod.CARD},
]



@app.get("/expenses")# The response_model parameter specifies that the endpoint will return a list of ExpenseWithID objects. FastAPI will automatically convert the returned data into the specified format and validate it against the model.
async def get_expenses():
  return EXPENSES


# Basic Python Dictionary manipulation
@app.get("/expenses/{expense_id}")
def get_expense_with_id(expense_id: int):
  expense = next((e for e in EXPENSES if e["id"] == expense_id), None)
  if expense is None:
    raise ValueError("Expense not found")
  return expense
  # for expense in EXPENSES:
  #   if expense["id"] == expense_id:
  #     return expense
    



@app.post("/expenses")
async def create_expense(expense: ExpenseCreate):
  EXPENSES.append(expense)
  raise HTTPException(status_code=200, detail="Expenses Created")