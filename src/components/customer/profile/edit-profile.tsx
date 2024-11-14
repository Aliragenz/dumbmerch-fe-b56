import { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { GenderEnum } from '../../utils/genderEnum';

interface CustomJwtPayload extends JwtPayload {
    id: string; // Adjust type based on your implementation
    email: string;
    role: string;
}

const EditProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        email: '',
        profile: {
            fullName: '',
            phone: '',
            gender: '',
            image: '',
            street: '',
            city: '',
            zip: '',
            country: '',
        },
    });

    const token = Cookies.get('authToken');
    let userId = '';

    if (token) {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        userId = decodedToken.id;
        console.log('userId:', userId)
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/profile/get-profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserProfile(response.data);
                setImagePreview(response.data.profile.image);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    if (loading) return <p>Loading...</p>

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setUserProfile((prevState) => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                [name]: value,
            },
        }));
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const selectedFile = event.target.files[0];
            setImageFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile)
        }
    };

    

    const handleSave = async () => {
        setLoading(true);
        try {
            const profileData = new FormData();
            profileData.append('email', userProfile.email);
            profileData.append('fullName', userProfile.profile.fullName);
            profileData.append('phone', userProfile.profile.phone);
            profileData.append('street', userProfile.profile.street);
            profileData.append('city', userProfile.profile.city);
            profileData.append('zip', userProfile.profile.zip);
            profileData.append('country', userProfile.profile.country);
            profileData.append('gender', userProfile.profile.gender);

            if (imageFile) {
                profileData.append('image', imageFile);
            }
            
            await axios.put(`http://localhost:3000/api/profile/profile-update`,
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                });
            alert('Profile updated succesfully!');
            navigate('/customer/profile')
        } catch (error) {
            console.error('Error updating profile:', error)
            console.log('userProfile data:', userProfile);

            alert('Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Box sx={{ padding: '20px',display: 'flex', flexDirection:'column', backgroundColor: 'transparent', height: '100vh', justifyContent: 'center', alignItems: 'center', overFlow: 'hidden', position: 'relative', zIndex: 1, mt: "280px"  }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Edit Profile
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: 'auto', width: 'auto', alignContent: 'center', display: 'flex', flexDirection: ' column'}}>
                    {imagePreview ? (
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Profile"
                            sx={{ maxHeight: '365px', width: '100%', objectFit: 'cover' }}
                            draggable="false"
                        />
                    ) : (
                        <Typography variant="h6" sx={{ height: '365px', width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc' }}>
                            No Image Uploaded
                        </Typography>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" color="error" sx={{ width: '300px' }}
                        onClick={handleButtonClick} >Upload Photo</Button>
                </Paper>
            </Box>

            {/* Input Fields */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 3,
                    width: '600px',
                }}
            >
                <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="fullName"
                    value={userProfile.profile.fullName}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={userProfile.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    name="phone"
                    value={userProfile.profile.phone}
                    onChange={handleChange}
                />
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Gender</InputLabel>
                    <Select
                        label="Gender"
                        name="gender"
                        value={userProfile.profile.gender}
                        onChange={handleChange}
                        sx={{ textAlign: 'start' }}
                    >
                        {Object.values(GenderEnum).map((gender) => (
                            <MenuItem key={gender} value={gender}>
                                {gender}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Street Address"
                    variant="outlined"
                    fullWidth
                    name="street"
                    value={userProfile.profile.street}
                    onChange={handleChange}
                />
                <TextField
                    label="City"
                    variant="outlined"
                    fullWidth
                    name="city"
                    value={userProfile.profile.city}
                    onChange={handleChange}
                />
                <TextField
                    label="Zip"
                    variant="outlined"
                    fullWidth
                    name="zip"
                    value={userProfile.profile.zip}
                    onChange={handleChange}
                />
                <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    name="country"
                    value={userProfile.profile.country}
                    onChange={handleChange}
                />
            </Box>

            {/* Footer Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <Button variant="contained" color="error" sx={{ width: '200px' }} onClick={() => navigate('/customer/profile')}>
                    Cancel
                </Button>
                <Button variant="contained" color="success" sx={{ width: '200px' }}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfilePage;
