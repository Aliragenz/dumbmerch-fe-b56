import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/auth-slice'
import categoryReducer from './other/categorySlice'
import productReducer from './other/productSlice'
import transactionReducer from './other/transactionSlice'
// import log from 'loglevel';

// Initialize log level (You can use different levels in dev vs prod)
// const savedLogLevel: string = localStorage.getItem('loglevel') || 'warn';

// log.setLevel((savedLogLevel as any));  // Set the log level

// log.info('App initialized, log level set to:', savedLogLevel);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
        products: productReducer,
        transactions: transactionReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch