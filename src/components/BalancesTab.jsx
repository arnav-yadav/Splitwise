import React from 'react';

const BalancesTab = ({ 
  users, 
  balances, 
  getUserById, 
  formatCurrency, 
  handleSettleUp 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Balances</h2>
      
      {users.length < 2 ? (
        <p className="text-gray-500 text-center py-4">Add at least two friends to see balances.</p>
      ) : (
        <div>
          {users.map(user => (
            <div key={user.id} className="mb-4">
              {Object.entries(balances[user.id] || {}).some(([_, amount]) => amount > 0) && (
                <div>
                  <h3 className="font-medium">{user.name} owes:</h3>
                  <ul className="ml-4">
                    {Object.entries(balances[user.id] || {}).map(([userId, amount]) => {
                      if (amount > 0) {
                        const otherUser = getUserById(parseInt(userId));
                        return (
                          <li key={userId} className="flex justify-between items-center py-1">
                            <span>{otherUser.name}</span>
                            <div>
                              <span className="font-semibold text-red-600 mr-2">
                                {formatCurrency(amount)}
                              </span>
                              <button
                                className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={() => handleSettleUp(user.id, parseInt(userId))}
                              >
                                Settle Up
                              </button>
                            </div>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
          
          {!users.some(user => 
            Object.values(balances[user.id] || {}).some(amount => amount > 0)
          ) && (
            <p className="text-center py-4 text-green-600">Everyone is settled up! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BalancesTab;