import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {fetchProducts} from '../../../store/other/productSlice';
import {AppDispatch, RootState} from '../../../store/store'

const truncateText = (text: string | any[], maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
};

export default function DashboardCustomerCard() {

    const dispatch = useDispatch<AppDispatch>();
    const {data: products, loading, error} = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const formatPrice = (price: number): string => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
        return `Rp. ${formattedPrice}`;
    };
    

    const sortedProducts = [...products].sort((a, b) => a.id - b.id);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="left"
            alignItems="start"
            flexDirection='column'          
            ml={15.5}
        >
            <Box display="flex"
                flexWrap="wrap"
                flexDirection="row"
                ml={2}
                mb={-2}
                sx={{
                    color: '#F74D4D'
                }}
            >
                <h2>Products</h2>
            </Box>
            <Box
                display="flex"
                flexWrap="wrap"
                flexDirection="row"
            >
                {sortedProducts.map((product) => (
                    <Card key={product.id} sx={{ maxWidth: 210, margin: 2, width: 210 }}>
                        <CardActionArea component={Link} to={`detail-product/${product.id}`}>
                            <CardMedia
                                component="img"
                                height="270px"
                                draggable="false"
                                image={product.detail.photo}

                                alt="Product Photo"
                                sx={{
                                    objectFit: 'cover', display: 'flex',
                                }}
                            />
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'start',
                                    width: 'auto',
                                }}
                            >
                                <Typography
                                    color="error"
                                    fontWeight="bold"
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    fontSize={20}
                                >
                                    {truncateText(product.productName, 12)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {formatPrice(product.detail.price)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Stock: {product.detail.quantity}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
