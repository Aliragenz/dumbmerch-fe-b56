import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Category {
    id: number;
    categoryName: string;
}

export default function AddOrEditProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the URL has a product ID for editing
    const isEdit = location.pathname.includes('/products/edit');

    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState("Image.jpg");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const token = Cookies.get('authToken'); // Get the token from cookies
                const response = await axios.get('http://localhost:3000/api/category/get', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(response.data); // Set fetched categories to state
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            // Fetch existing product data if in edit mode
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const token = Cookies.get('authToken'); // Get the token from cookies
                    const response = await axios.get(`http://localhost:3000/api/product/edit/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const { productName, detail, category } = response.data; // Adjust based on your API response
                    const { price, productDesc, quantity, photo } = detail; // Access detail properties

                    setProductName(productName);
                    setProductDescription(productDesc || '');
                    setProductPrice(price);
                    setProductQuantity(quantity);

                    const selectedCategory = categories.find(cat => cat.id === category.id);
                    setCategory(selectedCategory || category);

                    setImageName(photo.split('/').pop() || "Image.jpg"); // Extract the image name from URL
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [isEdit, id, categories]);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setImageFile(event.target.files[0]);
            setImageName(event.target.files[0].name);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('authToken'); // Get the token from cookies
            const categoryId = category && category.id ? category.id.toString() : '';
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productDesc', productDescription);
            formData.append('price', productPrice);
            formData.append('quantity', productQuantity);
            formData.append('categoryId', categoryId);

            if (imageFile) {
                formData.append('photo', imageFile); // Only include if you've uploaded and gotten the URL
            }

            if (isEdit) {
                await axios.patch(`http://localhost:3000/api/product/update/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('http://localhost:3000/api/product/add', formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/admin/products'); // Redirect to the product list after saving
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box width='99%'>
            <Box display='flex' ml={1}>
                <h2>
                    {isEdit ? 'Edit Product' : 'Add Product'}
                </h2>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Box sx={{ display: 'flex' }}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Button
                            color="error"
                            variant="contained"
                            sx={{
                                color: 'white',
                                ml: '10px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                width: 'auto',
                                display: 'flex',
                            }}
                            onClick={handleButtonClick}
                        >
                            Upload Image
                        </Button>
                        <Typography sx={{ mt: '7px', ml: '20px' }}>
                            {imageName} {/* Show the name of the selected file */}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{ marginX: '10px', width: '100%' }}>
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            sx={{ width: '98%', mt: "15px" }}
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{ marginX: '10px', width: '100%' }}>
                        <Autocomplete
                            disablePortal
                            options={categories}
                            getOptionLabel={(option) => option.categoryName}
                            sx={{ width: '98%', mt: "15px" }}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                            value={category}
                            onChange={(_event, newValue) => setCategory(newValue)}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{ marginX: '10px', width: '100%' }}>
                        <TextField
                            label="Product Description"
                            variant="outlined"
                            multiline
                            sx={{ width: '98%', mt: "15px" }}
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{ marginX: '10px', width: '100%' }}>
                        <TextField
                            label="Product Price"
                            variant="outlined"
                            sx={{ width: '98%', mt: "15px" }}
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row" sx={{ marginX: '10px', width: '100%' }}>
                        <TextField
                            label="Product Quantity"
                            variant="outlined"
                            sx={{ width: '98%', mt: "15px" }}
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                        />
                    </Box>
                    <Box mt={3} ml={1.5} width='98%'>
                        <Button
                            color="error"
                            variant="contained"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                width: '49%',
                            }}
                            onClick={() => navigate('/admin/products')}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                width: '49%',
                                ml: '22px'
                            }}
                            onClick={handleSubmit}
                        >
                            {isEdit ? 'Save' : 'Add Product'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
