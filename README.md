# Splitwise Clone 💰

A React-based expense sharing application that helps friends and roommates track shared expenses and settle balances.

## [Deployed Website](https://splitwise-6sxlvzs7x-arnavs-projects-83a078ef.vercel.app)

## App Screenshots

![image](https://github.com/user-attachments/assets/61e61177-43e5-4ed0-8c71-fb337cab9ffa)
![image](https://github.com/user-attachments/assets/233ad954-57dd-4b9b-836c-68ef5be2d901)
![image](https://github.com/user-attachments/assets/ce813365-f232-4991-8db5-4b32a62d84df)

## Features ✨

- 💸 **Expense Tracking**: Add expenses with descriptions, amounts, and dates
- 👥 **Friend Management**: Add/remove friends with name and phone number
- ⚖️ **Auto-balancing**: Real-time calculation of who owes whom
- ✅ **Settle Up**: One-click debt clearance between users
- 📱 **Responsive Design**: Works on mobile and desktop
- 💾 **Data Persistence**: Saves all data in browser's localStorage
- 📊 **Tab Navigation**: 
  - Expenses list with delete functionality
  - Visual balances overview
  - Friends management console

## Technologies Used 🛠️

- **React** with functional components and hooks
- **Tailwind CSS** for utility-first styling
- **JavaScript Intl API** for INR currency formatting
- **LocalStorage** for persistent data storage

## Key React Learnings 🧠

Building this project helped me master several React concepts:

### State Management
- Used `useState` for component-level state management
- Implemented complex state logic for expense calculations
- Created derived state for balances from expenses data

### Component Architecture
- Designed modular components with single responsibility
- Separated container and presentational components
- Implemented compound components for tabs system

### Hooks Mastery
- `useEffect` for side effects and localStorage operations
- Custom hooks pattern for reusable logic (potential extension)
- Proper dependency array management to optimize renders

### Advanced Patterns
- Lifting state up to share across multiple components
- Prop drilling for deep component communication
- Controlled components for all form inputs

## Challenges Faced & Solutions 🚧

### Bidirectional Balance Calculation
**Problem**: Tracking who owes whom was mathematically complex  
**Solution**: Implemented a balance matrix that tracks each pairwise debt and then simplified to net amounts

```javascript
// Simplified balance calculation snippet
users.forEach(payer => {
  users.forEach(receiver => {
    if (payer !== receiver) {
      netBalances[payer.id][receiver.id] = calculateNet(payer, receiver);
    }
  });
});
```

## Usage Guide 📖

1. **Add Friends**:
   - Navigate to "Friends" tab
   - Click "Add Friend" → Enter details → Save

2. **Record Expenses**:
   - Go to "Expenses" tab
   - Click "Add Expense"
   - Fill details (₹317 automatically formats)
   - Select participants (defaults to all)

3. **Settle Debts**:
   - Check "Balances" tab
   - Click "Settle Up" next to any debt
   - Automatically records as special expense


## Future Enhancements 🔮

- [ ] User authentication
- [ ] Expense categories and tags
- [ ] Charts for spending visualization
- [ ] Multi-currency support
