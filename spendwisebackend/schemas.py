from pydantic import BaseModel
from enum import Enum
from datetime import date
from pydantic import validator, Field



class Category(str, Enum):
  FOOD = "Food"
  TRANSPORT = "Transport"
  SHOPPING = "Shopping"
  BILLS = "Bills"
  ENTERTAINMENT = "Entertainment"
  HEALTH = "Health"
  OTHER = "Other"

class PaymentMethod(str, Enum):
  CASH = "Cash"
  CARD = "Card"
  ONLINE = "Online"


class ExpenseBase(BaseModel):
  title: str
  amount: int
  category: Category
  expense_date: date = Field(default_factory=date.today)
  description: str
  payment_method: PaymentMethod



class ExpenseCreate(ExpenseBase):
  id: int
  @validator("category", pre=True)
  def category_validator(cls, value):
    return value.title() # This gets the value of the category field and converts it to title case (first letter capitalized) before validation. This allows for case-insensitive input while ensuring that the stored value is consistently formatted.
  @validator("payment_method")
  def payment_validator(cls, value):
    return value.lower()


class ExpenseWithID(ExpenseBase):
  id: int
  # @validator("category", pre=True)
  # def category_validator(cls, value):
  #   return value.title()
    
  




  