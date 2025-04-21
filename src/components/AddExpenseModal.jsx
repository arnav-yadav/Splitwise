import React from 'react';

const AddExpenseModal = ({ 
  show, 
  onClose, 
  newExpense, 
  setNewExpense, 
  users, 
  handleAddExpense, 
  handleParticipantChange 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Expense</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleAddExpense}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Paid By</label>
            <select
              className="w-full p-2 border rounded"
              value={newExpense.paidBy}
              onChange={(e) => setNewExpense({...newExpense, paidBy: parseInt(e.target.value)})}
              required
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Split Among</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {users.map(user => (
                <div key={user.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={newExpense.participants.includes(user.id)}
                    onChange={() => handleParticipantChange(user.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user.id}`}>{user.name}</label>
                </div>
              ))}
            </div>
            {newExpense.participants.length === 0 && (
              <p className="text-red-500 text-xs mt-1">Please select at least one person</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 text-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={newExpense.participants.length === 0}
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;