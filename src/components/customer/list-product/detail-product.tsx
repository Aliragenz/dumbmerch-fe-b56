import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DetailProduct {
    productName: string;
    price: number; // Keep price as a number
    productDesc: string;
    quantity: string;
    photo: string;
}

export default function DetailProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        productName: '',
        price: 0,
        productDesc: '',
        quantity: '',
        photo: ''
    });

    const formatPrice = (price: number): string => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
        return `Rp. ${formattedPrice}`;
    };
    

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('authToken');
            await axios.post('http://localhost:3000/api/cart/add', {
                productId: id, // or product.id based on how you fetch your product
                quantity: 1, // You can adjust this based on user input or default to 1
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Optionally, you can show a success message or update local state
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Optionally, show an error message to the user
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get(`http://localhost:3000/api/product/edit/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { productName, detail } = response.data;

                const { price, productDesc, quantity, photo } = detail;

                setProduct({
                    productName,
                    price: Number(price),
                    productDesc,
                    quantity,
                    photo
                })
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return <p>Loading...</p>

    return (
        <Box sx={{
            overflow: 'hidden',
            position: 'relative',
            top: '35px', left: '50px',
            maxWidth: '95.5%',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
            }}>
                <Card sx={{
                    display: 'flex', width: '75%', ml: '40px', boxShadow: 'none', height: 'auto', mt: '10px', bgcolor: '#0C0C0C', maxwidth: '100%',
                }}>
                    <CardMedia
                        component="img"
                        sx={{
                            height: '400px',
                            width: '300px',
                            objectFit: 'cover',
                            bgcolor: '#181818',
                            boxShadow: 'none',
                        }}
                        image={product.photo}
                        alt="Product Photo" draggable="false"
                    />
                    {/* From Here */}
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', bgcolor: '#181818', height: '100%', width: '100%'
                    }}>
                        <CardContent sx={{
                            flex: '1 0 auto', ml: '5px', alignItems: 'start', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '22.5px', overflowX: 'hidden', overflowY: 'auto', // Enable vertical scrolling
                            height: '350px', pr: '30px',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                            '-ms-overflow-style': 'none', // For Internet Explorer
                            'scrollbar-width': 'none',    // For Firefox
                        }}>
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold',
                                position: 'relative',
                                left: '30px',
                                top: '10px',
                                fontSize: '40px',
                                textAlign: 'start',
                                gap: '0px',
                                
                            }}>
                                {product.productName}
                            </Typography>
                            <Typography component="div" variant="h6" sx={{
                                position: 'relative',
                                left: '30px',
                                top: '5px',
                                fontSize: '15px',
                                mb: '25px'
                            }}>
                                Stock: {product.quantity}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{
                                    textAlign: 'justify',
                                    position: 'relative',
                                    left: '30px',
                                    top: '20px',
                                    fontSize: '15px',
                                    pr: '10px',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {product.productDesc}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                pl: 2,
                                pb: 1,
                                pr: 2,
                                pt: 3,
                                position: 'relative',
                                left: '40px',
                                width: '100%',
                            }}>
                                <Typography component="div" variant="h6" sx={{
                                    color: '#F74D4D',
                                    fontWeight: 'bold',
                                    fontSize: '30px',
                                    flexGrow: 1, // Allow this to take up space
                                    textAlign: 'right', // Ensure the price is right-aligned
                                }}>
                                    {formatPrice(product.price)}
                                </Typography>
                            </Box>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <Button variant="contained" color='primary' sx={{ fontWeight: 'bold', width: '50%', ml: '42.5px' }}
                            onClick={() => navigate('/customer/home')}
                            >Back</Button>
                            <Button variant="contained" color='error' sx={{ fontWeight: 'bold', width: '50%', ml: '42.5px' }}
                            onClick={handleAddToCart}
                            >Add to Cart</Button>
                        </Box>
                    </Box>
                    {/* To Here */}

                </Card>
            </Box>
        </Box >
    );
}
