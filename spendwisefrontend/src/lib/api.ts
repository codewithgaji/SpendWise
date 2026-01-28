import { Expense, ExpenseCreate, ExpenseUpdate } from "@/types/expense";

const API_BASE_URL = "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, errorText);
  }
  return response.json();
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out - Is the backend server running?");
    }
    throw error;
  }
}

export const expenseApi = {
  // GET /expenses - List all expenses
  async getAll(): Promise<Expense[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses`);
      return handleResponse<Expense[]>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // GET /expenses/:id - Get single expense
  async getById(id: number): Promise<Expense> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/${id}`);
      return handleResponse<Expense>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // POST /expenses - Create new expense
  async create(expense: ExpenseCreate): Promise<Expense> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });
      return handleResponse<Expense>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // PUT /expenses/:id - Update expense
  async update(id: number, expense: ExpenseUpdate): Promise<Expense> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });
      return handleResponse<Expense>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // DELETE /expenses/:id - Delete expense
  async delete(id: number): Promise<void> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new ApiError(response.status, errorText);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // GET /expenses/summary/category - Get category breakdown
  async getCategorySummary(): Promise<{ category: string; total: number; count: number }[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/summary/category`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },

  // GET /expenses/summary/monthly - Get monthly breakdown
  async getMonthlySummary(): Promise<{ month: string; total: number; count: number }[]> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses/summary/monthly`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to backend server. Make sure FastAPI is running on http://localhost:8000"
        );
      }
      throw error;
    }
  },
};
