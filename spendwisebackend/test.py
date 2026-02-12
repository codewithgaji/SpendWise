from fastapi import FastAPI, HTTPException
from schemas import ExpenseBase, ExpenseCreate, ExpenseWithID, Category, PaymentMethod


# Is this a dictionary? or a list?


EXPENSES = [
  {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": 50,
    "category": "Food",
    "date": "2026-02-11",
    "description": "Weekly groceries",
    "payment_method": "Card"
  },
  {
    "id": 2,
    "title": "Gas",
    "amount": 40,
    "category": "Transport",
    "date": "2026-02-09",
    "description": "Fuel for car",
    "payment_method": "Card"
  },
  {
    "id": 3,
    "title": "Movie Tickets",
    "amount": 25,
    "category": "Entertainment",
    "date": "2026-02-06",
    "description": "Cinema visit",
    "payment_method": "Cash"
  },
  {
    "id": 4,
    "title": "Electricity Bill",
    "amount": 120,
    "category": "Bills",
    "date": "2026-02-04",
    "description": "Monthly electricity",
    "payment_method": "Online"
  },
  {
    "id": 5,
    "title": "Restaurant",
    "amount": 60,
    "category": "Food",
    "date": "2026-02-03",
    "description": "Dinner out",
    "payment_method": "Card"
  }
]



for expense in EXPENSES:
  print(expense["id"]) # This is used to print the id of each expense in the list of expenses. This is just a test to check if the data is being stored correctly and if we can access it.

print("TESTING ENUMERATE")
print("")

for i, expense in enumerate(EXPENSES): # Enumerate is used to get the index of each expense in the list of expenses.
  print(expense["title"])
  print("")
  print(i)
  print("")

def update_expenses(id: int, new_expenses: ExpenseCreate):
  data = new_expenses.model_dump()
  print(data.keys())

update_expenses(5, ExpenseCreate(title="Test", amount=100, category="Food", description="Test description", payment_method="Card"))