import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import NavbarCustomized from "./navbar/navbar";
import DashboardCustomerCard from "./list-product/product-card";
import Profile from './profile/profile';
import DetailProduct from './list-product/detail-product';
import Complain from './complain/complain';
import CartPage from './other/cart-page';
import CheckoutPage from './other/checkout';
import ScrollToTop from './utils/scroll-to-top';
import EditProfilePage from './profile/edit-profile';

export default function DashboardCustomer() {
  return (
    <Box>
      <Box>
        <NavbarCustomized />
        <Box
          sx={{
            pt: 5,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            // backgroundColor: 'rgba(255, 0, 0, 0.5)', // Temporary background for debugging
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none', // For Internet Explorer
            'scrollbar-width': 'none',    // For Firefox
          }}>
            <ScrollToTop />
          <Routes>
            <Route path='profile' element={<Profile />} />
            <Route path='profile/edit-profile' element={<EditProfilePage />} />
            <Route path='complain' element={<Complain />} />
            <Route path='home/detail-product/:id' element={<DetailProduct />} />
            <Route path='my-cart' element={<CartPage />} />
            <Route path='my-cart/checkout' element={<CheckoutPage />} />
            <Route path='home' element={<DashboardCustomerCard />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
