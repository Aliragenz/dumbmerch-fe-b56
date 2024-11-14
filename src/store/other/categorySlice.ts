import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie'

interface Category {
  id: number;
  categoryName: string;
}

interface CategoryState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const token = Cookies.get('authToken');
  const response = await axios.get('http://localhost:3000/api/category/get', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });
  return response.data; // This should be the array directly
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.data = action.payload; // Should be the array of categories
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch categories';
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
