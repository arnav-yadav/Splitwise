import React, { useState, useEffect } from 'react';
import ExpensesTab from './components/ExpensesTab';
import BalancesTab from './components/BalancesTab';
import NavigationTabs from './components/NavigationTabs';
import AddExpenseModal from './components/AddExpenseModal';
import AddUserModal from './components/AddUserModal';
import UsersTab from './components/UsresTab';

function App() {
  // Load data from localStorage on initial render
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('splitwise-users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, name: "Arnav", phone: "7265028743" },
    ];
  });
  
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('splitwise-expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  
  const [balances, setBalances] = useState({});
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  
  // Form state for new expense
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: users[0]?.id || 1,
    participants: users.map(user => user.id),
    splitType: 'equal'
  });
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    name: '',
    phone: ''
  });
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('splitwise-users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('splitwise-expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  // Calculate balances whenever expenses or users change
  useEffect(() => {
    calculateBalances();
  }, [expenses, users]);
  
  // Update participants in the new expense form when users change
  useEffect(() => {
    setNewExpense(prev => ({
      ...prev,
      participants: users.map(user => user.id),
      paidBy: users[0]?.id || 1
    }));
  }, [users]);
  
  // Calculate balances between all users
  const calculateBalances = () => {
    const newBalances = {};
    
    // Initialize balances
    users.forEach(user => {
      newBalances[user.id] = {};
      users.forEach(otherUser => {
        if (user.id !== otherUser.id) {
          newBalances[user.id][otherUser.id] = 0;
        }
      });
    });
    
    // Process each expense
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const participants = expense.participants;
      const amount = parseFloat(expense.amount);
      
      if (participants.length === 0) return;
      
      const perPersonAmount = amount / participants.length;
      
      // Update balances for each participant
      participants.forEach(participantId => {
        if (participantId !== paidBy) {
          // This participant owes the payer
          newBalances[participantId][paidBy] += perPersonAmount;
          // Symmetrically, payer is owed by this participant
          newBalances[paidBy][participantId] -= perPersonAmount;
        }
      });
    });
    
    // Simplify balances (remove zero balances and consolidate)
    users.forEach(user => {
      users.forEach(otherUser => {
        if (user.id !== otherUser.id) {
          if (newBalances[user.id][otherUser.id] < 0) {
            // Negative means this user is owed money, so flip the sign
            newBalances[otherUser.id][user.id] = Math.abs(newBalances[user.id][otherUser.id]);
            newBalances[user.id][otherUser.id] = 0;
          }
        }
      });
    });
    
    setBalances(newBalances);
  };
  
  // Handle adding a new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    
    if (!newExpense.description || !newExpense.amount || newExpense.participants.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    const expenseToAdd = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0]
    };
    
    setExpenses(prev => [...prev, expenseToAdd]);
    
    // Reset form and close modal
    setNewExpense({
      description: '',
      amount: '',
      paidBy: users[0]?.id || 1,
      participants: users.map(user => user.id),
      splitType: 'equal'
    });
    setShowAddExpense(false);
  };
  
  // Handle adding a new user
  const handleAddUser = (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.phone) {
      alert('Please provide both name and phone number');
      return;
    }
    
    const userToAdd = {
      id: Date.now(),
      ...newUser
    };
    
    setUsers(prev => [...prev, userToAdd]);
    
    // Reset form and close modal
    setNewUser({
      name: '',
      phone: ''
    });
    setShowAddUser(false);
  };
  
  // Handle participant selection for expense splitting
  const handleParticipantChange = (userId) => {
    const currentParticipants = [...newExpense.participants];
    
    if (currentParticipants.includes(userId)) {
      // Remove if already selected
      setNewExpense({
        ...newExpense,
        participants: currentParticipants.filter(id => id !== userId),
        // If the payer is removed as a participant, change the payer to the first participant
        paidBy: newExpense.paidBy === userId ? 
          (currentParticipants.filter(id => id !== userId)[0] || users[0]?.id || 1) : 
          newExpense.paidBy
      });
    } else {
      // Add if not yet selected
      setNewExpense({
        ...newExpense,
        participants: [...currentParticipants, userId]
      });
    }
  };
  
  // Format currency amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Get user by ID
  const getUserById = (userId) => {
    return users.find(user => user.id === userId) || { name: 'Unknown', phone: '' };
  };
  
  // Delete an expense
  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };
  
  // Delete a user
  const handleDeleteUser = (userId) => {
    // Check if user is involved in any expenses
    const userInvolved = expenses.some(expense => 
      expense.paidBy === userId || expense.participants.includes(userId)
    );
    
    if (userInvolved) {
      alert('Cannot delete user who is involved in expenses');
      return;
    }
    
    setUsers(users.filter(user => user.id !== userId));
  };
  
  // Settle up between two users
  const handleSettleUp = (payerId, payeeId) => {
    // Create a settlement expense
    const amount = balances[payerId][payeeId];
    
    if (amount <= 0) return;
    
    const settlementExpense = {
      id: Date.now(),
      description: `Settlement: ${getUserById(payerId).name} paid ${getUserById(payeeId).name}`,
      amount: amount,
      paidBy: payerId,
      participants: [payeeId],
      date: new Date().toISOString().split('T')[0],
      isSettlement: true
    };
    
    setExpenses(prev => [...prev, settlementExpense]);
  };
  
  // Fix for empty state
  if (users.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <header className="bg-green-500 text-white p-4">
            <h1 className="text-2xl font-bold">Splitwise Clone</h1>
          </header>
          <div className="p-4">
            <p className="text-center py-8">You need to add friends to use this app.</p>
            <div className="flex justify-center">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => setShowAddUser(true)}
              >
                Add Your First Friend
              </button>
            </div>
            
            <AddUserModal 
              show={showAddUser}
              onClose={() => setShowAddUser(false)}
              newUser={newUser}
              setNewUser={setNewUser}
              handleAddUser={handleAddUser}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <header className="bg-green-500 text-white p-4">
          <h1 className="text-2xl font-bold">Split Wise</h1>
        </header>
        
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'expenses' && (
          <ExpensesTab 
            expenses={expenses}
            setShowAddExpense={setShowAddExpense}
            getUserById={getUserById}
            formatCurrency={formatCurrency}
            handleDeleteExpense={handleDeleteExpense}
          />
        )}
        
        {activeTab === 'balances' && (
          <BalancesTab 
            users={users}
            balances={balances}
            getUserById={getUserById}
            formatCurrency={formatCurrency}
            handleSettleUp={handleSettleUp}
          />
        )}
        
        {activeTab === 'users' && (
          <UsersTab 
            users={users}
            setShowAddUser={setShowAddUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}
        
        <AddExpenseModal 
          show={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          users={users}
          handleAddExpense={handleAddExpense}
          handleParticipantChange={handleParticipantChange}
        />
        
        <AddUserModal 
          show={showAddUser}
          onClose={() => setShowAddUser(false)}
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
        />
      </div>
    </div>
  );
}

export default App;