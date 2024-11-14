import { Box, Button, TextField, CircularProgress } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie'

export default function AddOrEditCategory() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming the URL has a category ID for editing
    const isEdit = location.pathname.includes('/category/edit');

    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            // Fetch existing category data if in edit mode
            const fetchCategory = async () => {
                setLoading(true);
                try {
                    const token = Cookies.get('authToken'); // Get the token from cookies
                    const response = await axios.get(`http://localhost:3000/api/category/edit/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCategoryName(response.data.categoryName);
                } catch (error) {
                    console.error('Error fetching category:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategory();
        }
    }, [isEdit, id]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('authToken'); // Get the token from cookies
            if (isEdit) {
                // Update category
                await axios.put(`http://localhost:3000/api/category/update/${id}`, { categoryName }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Add new category
                await axios.post('http://localhost:3000/api/category/add', { categoryName }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate('/admin/category'); // Redirect to the category list after saving
        } catch (error) {
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <Box>
            <Box display='flex' ml={1}>
                <h2>
                    {isEdit ? 'Edit Category' : 'Add Category'}
                </h2>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (


                <Box
                    display="flex"
                    flexDirection="row"
                    sx={{ marginX: '10px', width: '99%' }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Category"
                        variant="outlined"
                        sx={{ width: '98%', mt: "15px" }}
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </Box>
            )}

            <Box mt={3} ml={1.5} width='98%' >
                <Button
                    color="error"
                    variant="contained"
                    sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        width: '49%',

                    }}
                    onClick={() => navigate('/admin/category')}
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
                    Save
                </Button>
            </Box>
        </Box>
    );
}
