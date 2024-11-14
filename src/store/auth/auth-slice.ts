import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStoreDTO } from '../../auth/types/dto';
// import { UserStoreDTO } from '@/auth/types/dto';

const initialState: UserStoreDTO = {} as UserStoreDTO;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserStoreDTO>) {
      const { id, email, role, profile } = action.payload;
      const userData = {
        id,
        email,
        role,
        profile,
      };

      // Persist the user data to localStorage
      console.log("Saving user data to localStorage:", userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        ...state,
        ...userData
      };
    },
    clearUser() {
      // Clear user data from localStorage
      localStorage.removeItem("user");

      return {} as UserStoreDTO;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;

