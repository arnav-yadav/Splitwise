import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b">
      <button 
        className={`px-4 py-2 flex-1 ${activeTab === 'expenses' ? 'bg-green-100 border-b-2 border-green-500' : ''}`}
        onClick={() => setActiveTab('expenses')}
      >
        Expenses
      </button>
      <button 
        className={`px-4 py-2 flex-1 ${activeTab === 'balances' ? 'bg-green-100 border-b-2 border-green-500' : ''}`}
        onClick={() => setActiveTab('balances')}
      >
        Balances
      </button>
      <button 
        className={`px-4 py-2 flex-1 ${activeTab === 'users' ? 'bg-green-100 border-b-2 border-green-500' : ''}`}
        onClick={() => setActiveTab('users')}
      >
        Friends
      </button>
    </div>
  );
};

export default NavigationTabs;