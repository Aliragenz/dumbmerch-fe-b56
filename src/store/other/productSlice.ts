import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Updated interfaces
interface ProductDetail {
    id: number;
    price: number;
    photo: string;
    productDesc: string;
    quantity: number;
    productId: number;
}

interface Category {
    id: number;
    categoryName: string;
}

interface FullProduct {
    id: number;
    productName: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    detail: ProductDetail;
    category: Category;
}

interface ProductState {
    data: FullProduct[]; // State holds FullProduct array
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    data: [],
    loading: false,
    error: null,
};

// Fetch products including their details
export const fetchProducts = createAsyncThunk('product/fetchProducts', async () => {
    const token = Cookies.get('authToken');
    const response = await axios.get('http://localhost:3000/api/product/get', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return response.data; // This is expected to be an array of FullProduct
});

// Slice definition
const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<FullProduct[]>) => {
                state.data = action.payload; // Store the fetched product data
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch products';
                state.loading = false;
            });
    },
});

// Export the reducer
export default productSlice.reducer;
