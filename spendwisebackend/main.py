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
  {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": 50,
    "category": "Food",
    "expense_date": "2026-02-11",
    "description": "Weekly groceries",
    "payment_method": "Card"
  },
  {
    "id": 2,
    "title": "Gas",
    "amount": 40,
    "category": "Transport",
    "expense_date": "2026-02-09",
    "description": "Fuel for car",
    "payment_method": "Card"
  },
  {
    "id": 3,
    "title": "Movie Tickets",
    "amount": 25,
    "category": "Entertainment",
    "expense_date": "2026-02-06",
    "description": "Cinema visit",
    "payment_method": "Cash"
  },
  {
    "id": 4,
    "title": "Electricity Bill",
    "amount": 120,
    "category": "Bills",
    "expense_date": "2026-02-04",
    "description": "Monthly electricity",
    "payment_method": "Online"
  },
  {
    "id": 5,
    "title": "Restaurant",
    "amount": 60,
    "category": "Food",
    "expense_date": "2026-02-03",
    "description": "Dinner out",
    "payment_method": "Card"
  }
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
  new_id = (max((e['id'] for e in EXPENSES), default=0) +1) # This is used to check for the max id and assign the new id to the post
  data = expense.model_dump() # This is used to convert the Pydantic model to a dictionary
  data["id"] = new_id # This is used to assign the new id to the data dictionary
  EXPENSES.append(data) # This is used to add the new expense to the list of expenses
  return HTTPException(status_code=201, detail="Expense created successfully")


@app.put("/expenses")
def update_expenses(id: int, new_expenses: ExpenseCreate):
  for expense in EXPENSES:
    data = new_expenses.model_dump()
    if expense['id'] == id:
      expense['title'] = data['title']
      expense['amount'] = data['amount']
      expense['category'] = data['category']
      expense['expense_date'] = str(data['expense_date'])
      expense['description'] = data['description']
      expense['payment_method'] = data['payment_method']

  return HTTPException(status_code=200, detail="Expense updated successfully")

