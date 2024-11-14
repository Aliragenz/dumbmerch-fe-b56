import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'
import ConfirmationModal from '../../modal/confirmation-modal';
import { fetchProducts } from '../../../store/other/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';


export default function ProductTable() {

    const dispatch = useDispatch<AppDispatch>();
    const { data: products, loading, error } = useSelector((state: RootState) => state.products);
    const [openModal, setOpenModal] = React.useState(false);
    const [productToDelete, setProductToDelete] = React.useState<number | null>(null);

    const formatPrice = (price: number): string => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
        return `Rp. ${formattedPrice}`;
    };


    const truncateText = (text: string | any[], maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Sort products to maintain a consistent order
    const sortedProducts = [...products].sort((a, b) => a.id - b.id);


    console.log('Products:', products);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleDeleteClick = (productId: number) => {
        setProductToDelete(productId);
        setOpenModal(true);
    };

    const handleDelete = async () => {
        if (productToDelete) {
            const token = Cookies.get('authToken');
            try {
                await axios.delete(`http://localhost:3000/api/product/delete/${productToDelete}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(fetchProducts()); // Refresh the product list
            } catch (error) {
                console.error('Error deleting product:', error);
            } finally {
                setOpenModal(false);
                setProductToDelete(null);
            }
        }
    };
    return (
        <Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Box display="flex"
                        flexWrap="wrap"
                        flexDirection="row"
                        ml={2}
                        mb={-2}
                    >
                        <h2>List Product</h2>
                        <Button component={Link}
                            to="add" variant='contained' color='inherit' sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                width: 'auto',
                                height: '30px',
                                position: 'relative',
                                left: '15px',
                                top: '22px',


                            }} >Add New Product</Button>
                    </Box>
                    <TableContainer component={Paper} sx={{
                        marginLeft: '10px',
                        marginRight: '10px',
                        width: '99%'
                    }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple  table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '5%' }}>No</TableCell>
                                    <TableCell sx={{ width: '10%' }}>Photo</TableCell>
                                    <TableCell sx={{ width: '10%' }}>Category</TableCell>
                                    <TableCell sx={{ width: '13%' }}>Product Name</TableCell>
                                    <TableCell sx={{ width: '15%' }}>Product Desc</TableCell>
                                    <TableCell sx={{ width: '10%' }}>Price</TableCell>
                                    <TableCell sx={{ width: '5%' }}>Qty</TableCell>
                                    <TableCell sx={{ width: '30%' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedProducts.map((product, index) => (
                                    <TableRow key={product.id} sx={{
                                        backgroundColor: index % 2 === 0 ? '#4F4F4F ' : '#6E6E6E  '
                                    }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <img src={product.detail.photo} width="120px" />
                                        </TableCell>
                                        <TableCell>{product.category.categoryName}</TableCell>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{truncateText(product.detail.productDesc, 15)}</TableCell>
                                        <TableCell>{formatPrice(product.detail.price)}</TableCell>
                                        <TableCell>{product.detail.quantity}</TableCell>
                                        <TableCell>
                                            <Button component={Link}
                                                to={`edit/${product.id}`} variant='contained' color='success' sx={{
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
                                                onClick={() => handleDeleteClick(product.id)}
                                            >Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                </>
            )}
        </Box>
    );
}
