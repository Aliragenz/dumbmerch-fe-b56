import Box from '@mui/material/Box';
import NavbarCustomized from "./navbar/navbar";
import Category from './category/category';
import ProductTable from './product/list-product';
import ComplainAdmin from './complain/complain-admin';
import { Route, Routes } from 'react-router-dom';
import AddOrEditCategory from './category/add-or-edit-category';
import AddOrEditProduct from './product/add-or-edit-product';
import Transaction from './other/trans-page';
import Dashboard from './dashboard';

export default function DashboardAdmin() {
  return (
    <Box>
      <NavbarCustomized />
      <Box 
      sx={{
        pt: 5,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto', 
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none', // For Internet Explorer
        'scrollbar-width': 'none',    // For Firefox
      }}>
        <Routes>
            <Route path='category' element={<Category />} />
            <Route path='category/add' element={<AddOrEditCategory />} />
            <Route path='category/edit/:id' element={<AddOrEditCategory />} />
            <Route path='products/add' element={<AddOrEditProduct />} />
            <Route path='products/edit/:id' element={<AddOrEditProduct />} />
            <Route path='complain' element={<ComplainAdmin />} />
            <Route path='products' element={<ProductTable />} />
            <Route path='transaction' element={<Transaction />} />
            <Route path='home' element={<Dashboard />} />
          </Routes>
      </Box>
    </Box>
  );
}
