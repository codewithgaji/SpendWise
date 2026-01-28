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
  @validator("category", pre=True)
  def category_validator(cls, value):
    return value.title()


class ExpenseWithID(ExpenseBase):
  id: int
  # @validator("category", pre=True)
  # def category_validator(cls, value):
  #   return value.title()
    
  




  