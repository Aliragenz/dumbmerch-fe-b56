import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie'
import { OrderStatusEnum } from '../../components/utils/orderStatusEnum';

interface TransactionItem {
    id: number;
    transactionId: number;
    productId: number;
    quantity: number;
    price: number;
}

interface Transaction {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: OrderStatusEnum;
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingMethod: string;
  transactionItems: TransactionItem[]
}

interface TransactionState {
  data: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async () => {
  const token = Cookies.get('authToken');
  const response = await axios.get('http://localhost:3000/api/transaction/get-all', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });
  return response.data; // This should be the array directly
});

export const updateTransactionStatus = createAsyncThunk(
    'transactions/updateTransactionStatus',
    async ({ id, status }: { id: number; status: OrderStatusEnum }) => {
      const token = Cookies.get('authToken');
      const response = await axios.put(`http://localhost:3000/api/transaction/update/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      return response.data; // Return the updated transaction
    }
  );
  

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.data = action.payload; // Should be the array of categories
        state.loading = false;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.data.findIndex(transaction => transaction.id === action.payload.id);
        if (index !== -1){
            state.data[index] = action.payload
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch Transaction';
        state.loading = false;
      });
  },
});

export default transactionSlice.reducer;
