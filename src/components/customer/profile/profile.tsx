import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Logo from '../image/DUMB MERCH.png';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { format } from 'date-fns';

interface UserProfile {
    id: number;
    userName: string;
    email: string;
    role: string;
    profile: {
        id: number;
        fullName: string;
        image: string | null;
        phone: string | null;
        gender: string | null;
        street: string | null;
        city: string | null;
        zip: string | null;
        country: string | null;
    };
}

interface Transaction {
    id: number;
    orderNumber: string;
    createdAt: string;
    price: number;
    totalAmount: number;
    image: string;
}


export default function Profile() {

    const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
    const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
    const formatPrice = (price: number): string => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
        return `Rp. ${formattedPrice}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const restOfDate = format(date, 'dd MMMM yyyy');
        const day = format(date, 'EEEE');
        return { day, restOfDate };
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('authToken');
                const response = await axios.get('http://localhost:3000/api/profile/get-profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserProfile(response.data);
                console.log('response:', response.data)
            } catch (error) {
                console.error("Error fetching profile data", error)
            }
        };
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const fetchUserTransactions = async () => {
            try {
                const token = Cookies.get('authToken');
                const userTrans = await axios.get('http://localhost:3000/api/transaction/get-user-trans', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserTransactions(userTrans.data);
                console.log('Transactions:', userTrans.data)
            } catch (error) {
                console.error("Error fetching user transactions", error)
            }
        }
        fetchUserTransactions();
    }, [])

    return (
        <Box sx={{ overflow: 'hidden' }}>
            <Box display="flex"
                flexWrap="wrap"
                flexDirection="row"
                ml={5}
                mb={-2}
                sx={{
                    color: '#F74D4D',
                    display: 'flex',
                    overflow: 'hidden'
                }}
            >
                <h2>Profile</h2>
                <h2 style={{ flexGrow: 1, marginLeft: '370px' }}>My Transactions</h2>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
            }}>
                <Card key={userProfile?.id} sx={{ display: 'flex', width: '65%', ml: '40px', boxShadow: 'none', height: '400px', }}>
                    <Box>
                        <CardMedia
                            component="img"
                            sx={{
                                height: '365px',
                                width: '280px',
                                objectFit: 'cover',
                                bgcolor: '#181818',
                                boxShadow: 'none'
                            }}
                            image={userProfile?.profile.image || 'https://placehold.co/300x365'}
                            alt="Profile Photo" draggable="false"
                        />

                        <Button variant="contained" color="error" sx={{ width: '280px' }} component={Link} to="edit-profile">Edit Profile</Button>
                    </Box>
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', bgcolor: '#181818', width: '100%'
                        ,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '-ms-overflow-style': 'none', // For Internet Explorer
                        'scrollbar-width': 'none',    // For Firefox
                    }}>
                        <CardContent sx={{ flex: '1 0 auto', ml: '5px', alignItems: 'start', display: 'flex', flexDirection: 'column', position: 'relative', bottom: '22.5px', maxWidth: '100%' }}>
                            {/* Name */}
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold'
                            }}>
                                Name
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                {userProfile?.profile.fullName}
                            </Typography>
                            {/* Email */}
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold'
                            }}>
                                Email
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                {userProfile?.email}
                            </Typography>
                            {/* Phone */}
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold'
                            }}>
                                Phone
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                {userProfile?.profile.phone}
                            </Typography>
                            {/* Gender */}
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold'
                            }}>
                                Gender
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                {userProfile?.profile.gender}
                            </Typography>
                            {/* Address */}
                            <Typography component="div" variant="h6" sx={{
                                color: '#F74D4D',
                                fontWeight: 'bold'
                            }}>
                                Address
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary', textAlign: 'justify' }}
                            >
                                {`${userProfile?.profile.street || ''}, ${userProfile?.profile.city || ''}, ${userProfile?.profile.zip || ''}, ${userProfile?.profile.country || ''}`}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        </Box>
                    </Box>

                </Card>
                <Box
                    sx={{
                        width: '46.5%',
                        height: '400px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        ml: '30px',
                        boxShadow: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '-ms-overflow-style': 'none', // For Internet Explorer
                        'scrollbar-width': 'none',    // For Firefox
                    }}
                >
                    {userTransactions.map((transaction) => (
                        <Card
                            key={transaction.id}
                            sx={{
                                display: 'flex',
                                width: '90%',
                                ml: '30px',
                                boxShadow: 'none',
                                height: '150px',
                                mb: 2,
                            }}
                        >
                            <CardActionArea sx={{ display: 'flex', width: '100%' }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: '150px',
                                        width: '110px',
                                        objectFit: 'cover',
                                        bgcolor: '#181818',

                                    }}
                                    image={transaction.image}
                                    alt="Transaction Image"
                                    draggable="false"
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        width: '285px',
                                        p: 1,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'start',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            component="div"
                                            variant="h6"
                                            sx={{
                                                color: '#F74D4D',
                                                fontWeight: 'bold',
                                                position: 'relative',
                                                bottom: '10px',
                                                right: '10px',
                                            }}
                                        >
                                            {transaction.orderNumber}
                                        </Typography>

                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: '#F74D4D',
                                                fontSize: '13px',
                                                position: 'relative',
                                                bottom: '20px',
                                                right: '10px',
                                            }}
                                        >
                                            {(() => {
                                                const { day, restOfDate } = formatDate(transaction.createdAt);
                                                return (
                                                    <>
                                                        <strong>{day}</strong>, {restOfDate}
                                                    </>
                                                )
                                            })()}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                position: 'relative',
                                                bottom: '25px',
                                                right: '10px',
                                            }}
                                        >
                                            Price: {formatPrice(transaction.totalAmount)}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                fontWeight: 'bold',
                                                position: 'relative',
                                                right: '10px',
                                            }}
                                        >
                                            Sub Total: {formatPrice(transaction.totalAmount)}
                                        </Typography>
                                    </CardContent>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        right: '25px',
                                    }}
                                >
                                    <img
                                        draggable="false"
                                        src={Logo}
                                        width={73}
                                        height={73}
                                        alt="DUMB MERCH Logo"
                                    />
                                </Box>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>


            </Box>
        </Box >
    );
}
