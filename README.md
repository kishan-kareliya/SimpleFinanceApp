# SimpleFinanceApp

SimpleFinanceApp is a beginner-friendly financial application built with the MERN stack (MongoDB, Express, React, Node.js). This app allows users to sign up, sign in, view their dashboard, see other users, and send money. Upon account creation, users are assigned a random fund amount between 1 and 10,000. This project demonstrates basic CRUD operations, user authentication with JWT, and simple money transfer functionality.

## Features

- **User Authentication**: Secure user sign-up and sign-in using JWT tokens.
- **Dashboard**: Users can view their account balance in dashboard.
- **User Management**: View and search other users.
- **Money Transfer**: Transfer funds between users with robust transaction management using MongoDB sessions to ensure consistency.
- **Error Handling**: Comprehensive error messages and state management.
- **Frontend Loaders**: Display loaders during API calls for better user experience.
- **Random Fund Assignment**: New users are assigned a random fund amount between 1 and 10,000 upon account creation.

## Key Technologies

- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: JSON Web Tokens (JWT), LocalStorage
- **Error Handling**: Custom error messages, Loaders


## API Endpoints

### Users

- **POST /api/v1/user/signup**: Create a new user account.
- **POST /api/v1/user/signin**: Authenticate a user and return a JWT token.
- **PUT /api/v1/user**: Update user details (requires authentication).
- **GET /api/v1/user/bulk**: Retrieve a list of users with optional filtering.


### Account

- **GET /api/v1/account/balance**: Retrieve the account balance of the authenticated user (use authentication middleware).
- **POST /api/v1/account/transfer**: Transfer funds between users (use authentication middleware).


## Transaction Management

The transaction endpoint uses MongoDB sessions to ensure that money transfers are handled reliably. If an error occurs during the transaction, all changes are rolled back to maintain data consistency. Here is an below transaction logic used:

```javascript
router.post('/transfer', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const { amount, to } = req.body;
    
    // Find user account and check if the balance is available for the transaction amount
    const account = await Account.findOne({ userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: 'Insufficient balance'
        });
    }

    // Find account to which money needs to be transferred, if not found show invalid account
    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: 'Invalid Account'
        });
    }

    // Perform transaction
    await Account.updateOne({ userId: userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.json({
        message: 'Transaction successful!'
    });
});
