import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, TextField, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../modal/confirmation-modal';
import Cookies from 'js-cookie'
import axios from 'axios';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

async function fetchCartData(setCartItems: Function, setQuantities: Function): Promise<void> {

    try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`http://localhost:3000/api/cart/get`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data);
        if (!response.data) {
            throw new Error('Failed to fetch cart data');
        }
        const cartData = await response.data.cartItems.map((item: any) => {
            console.log(item);
            const productDetail = item.product?.detail || {};
            return {
                id: item.id,
                productId: item.productId,
                name: item.product?.productName || 'Unknown Product',
                price: item.price,
                quantity: item.quantity,
                image: productDetail.photo || 'default_image',
            }
        });
        setCartItems(cartData);
        setQuantities(cartData.map((item: CartItem) => item.quantity));
    } catch (error) {
        console.error('Error fetching cart data:', error)
    }
}


export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('authToken');

    useEffect(() => {
        fetchCartData(setCartItems, setQuantities);
        // Check for order_id in URL parameters
        const params = new URLSearchParams(location.search);
        const orderIdFromParams = params.get('order_id');
        if (orderIdFromParams) {
            setOrderId(orderIdFromParams);
            setSnackbarOpen(true);
        }
    }, [location.search])

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleSelectItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleQuantityChange = (index: number, value: number) => {
        const newQuantities = [...quantities];
        newQuantities[index] = value > 0 ? value : 1;
        setQuantities(newQuantities);

        setCartItems((prevItems) => prevItems.map((item, i) => i === index ? { ...item, quantity: newQuantities[i] } : item))
    };

    const formatPrice = (price: number): string => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
        return `Rp. ${formattedPrice}`;
    };

    const handleDeleteCartItem = () => {
        setModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await Promise.all(
                selectedItems.map(async (productId) => {
                    await axios.delete(`http://localhost:3000/api/cart/remove/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
            );

            console.log("Item deleted");
            setModalOpen(false);
            fetchCartData(setCartItems, setQuantities);
        } catch (error) {
            console.error('Error deleting cart item:', error)
        }
    };

    const handleOrder = () => {
        const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id)).map((item, index) => ({
            ...item,
            quantity: quantities[index] || 1
        }));
        console.log('Incoming Cart Items:', selectedCartItems)
        navigate('/customer/my-cart/checkout', { state: { cartItems: selectedCartItems } });
    };

    return (
        <Box sx={{ padding: '20px', backgroundColor: 'transparent', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Typography display='flex' variant="h4" sx={{ mb: 3, position: 'sticky', top: -8, backgroundColor: '#181818', zIndex: 1 }}>
                My Cart
            </Typography>

            <Box>
                {cartItems.map((product, index) => (
                    <Paper key={product.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
                        {/* Checkbox to select product */}
                        <Checkbox
                            checked={selectedItems.includes(product.id)}
                            onChange={() => handleSelectItem(product.id)}
                        />

                        <Box
                            component="img"
                            sx={{
                                height: 100,
                                width: 100,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                            }}
                            src={product.image}
                            alt="Product Image"
                            ml={5}
                        />

                        {/* Product Details */}
                        <Box sx={{ flexGrow: 1, ml: 2, display: 'flex', flexDirection: 'column' }}  >
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body1">Price: {formatPrice(product.price)}</Typography>
                        </Box>

                        {/* Quantity Selector */}
                        <TextField
                            type="number"
                            value={quantities[index]}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                            sx={{ width: '80px', ml: 2 }}
                        />
                    </Paper>
                ))}
            </Box>

            {/* Footer Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: '15px', position: 'fixed', bottom: 8, right: 0, left: 0, backgroundColor: '#181818', zIndex: 1, pt: 2, mr: 6.5 }}>
                <Box sx={{ width: '20%' }}>
                    <Button variant="contained" color="error" sx={{ width: '100%' }} onClick={handleDeleteCartItem}>
                        Remove
                    </Button>

                </Box>
                <Button variant="contained" color="success" sx={{ width: '20%' }} onClick={handleOrder} >
                    Order
                </Button>

            </Box>

            <ConfirmationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remove Item From Cart"
                message="Are you sure you want to delete this item from your cart?"
                confirmText="Yes, remove it"
                cancelText="Cancel"
            />

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Order ID: {orderId}
                </Alert>
            </Snackbar>

        </Box>
    );
}
