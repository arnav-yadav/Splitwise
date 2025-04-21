import React from 'react';

const ExpensesTab = ({ 
  expenses, 
  setShowAddExpense, 
  getUserById, 
  formatCurrency, 
  handleDeleteExpense 
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowAddExpense(true)}
        >
          Add Expense
        </button>
      </div>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No expenses yet. Add one to get started!</p>
      ) : (
        <ul className="divide-y">
          {expenses.map(expense => (
            <li key={expense.id} className="py-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {expense.date} • Paid by {getUserById(expense.paidBy).name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Split among: {expense.participants.map(id => getUserById(id).name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-green-600">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button 
                    className="ml-2 text-red-500 hover:text-red-700 text-xl"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpensesTab;