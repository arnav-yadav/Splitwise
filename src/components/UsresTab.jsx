import React from 'react';

const UsersTab = ({ users, setShowAddUser, handleDeleteUser }) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowAddUser(true)}
        >
          Add Friend
        </button>
      </div>
      
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No friends added yet.</p>
      ) : (
        <ul className="divide-y">
          {users.map(user => (
            <li key={user.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersTab;