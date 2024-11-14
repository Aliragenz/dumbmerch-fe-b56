import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link
import { fetchCategories } from '../../../store/other/categorySlice';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie'
import axios from 'axios';
import ConfirmationModal from '../../modal/confirmation-modal';

export default function Category() {
    const dispatch = useDispatch<AppDispatch>();
    const { data: categories, loading, error } = useSelector((state: RootState) => state.categories);
    const [openModal, setOpenModal] = React.useState(false); // State to manage modal visibility
    const [categoryToDelete, setCategoryToDelete] = React.useState<number | null>(null); // Track which category to delete


    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Log the categories to debug
    console.log('Categories:', categories);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const checkIfCategoryInUse = async (categoryId: number): Promise<boolean> => {
        const token = Cookies.get('authToken');
        try {
            const response = await axios.get(`http://localhost:3000/api/category/in-use/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('API response:', response.data);
            return response.data.inUse;
        } catch (error) {
            console.error('Error checking category usage:', error);
            return false;
        }
    };

    const handleDeleteClick = async (categoryId: number) => {
        console.log('Attempting to check if category is in use for ID:', categoryId);
        const inUse = await checkIfCategoryInUse(categoryId);
        console.log('Category in use:', inUse)
        if (inUse) {
            alert('This category cannot be deleted because it is currently in use.');
        } else {
            setCategoryToDelete(categoryId);
            setOpenModal(true);
        }
    };

    const handleDelete = async () => {
        if (categoryToDelete) {
            const token = Cookies.get('authToken'); // Get the token from cookies
            try {
                await axios.delete(`http://localhost:3000/api/category/delete/${categoryToDelete}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Optionally, you can dispatch an action to refresh the category list
                dispatch(fetchCategories());
            } catch (error) {
                console.error('Error deleting category:', error);
            } finally {
                setOpenModal(false); // Close the modal after deletion
                setCategoryToDelete(null); // Reset category to delete
            }
        }
    };

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" flexDirection="row" ml={2} mb={-2}>
                <h2>List Category</h2>
                {/* Wrap the Button with Link */}
                <Button
                    component={Link}
                    to="add" // Set the path to AddOrEditCategory
                    variant='contained'
                    color='inherit'
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        width: 'auto',
                        height: '30px',
                        position: 'relative',
                        left: '15px',
                        top: '22px',
                    }}
                >
                    Add New Category
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ marginLeft: '10px', marginRight: '10px', width: '99%' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '10%' }}>No</TableCell>
                            <TableCell sx={{ width: '60%' }}>Category</TableCell>
                            <TableCell sx={{ width: '30%' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category, index) => (
                                <TableRow key={category.id} sx={{ backgroundColor: index % 2 === 0 ? '#4F4F4F ' : '#6E6E6E' }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{category.categoryName}</TableCell>
                                    <TableCell>
                                        <Button component={Link}
                                            to={`edit/${category.id}`} variant='contained' color='success' sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                width: '150px'
                                            }} >Edit</Button>

                                        <Button color='error' variant='contained' sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            width: '150px',
                                            ml: '15px'
                                        }}
                                            onClick={() => handleDeleteClick(category.id)}
                                        >
                                            Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No categories available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Confirmation Modal */}
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this category?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Box>
    );
}
