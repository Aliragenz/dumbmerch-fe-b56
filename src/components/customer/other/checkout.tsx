import {
  Box, Typography, TextField, Button, RadioGroup,
  FormControlLabel, Radio, Divider
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Navigation hook
import { QRCodeSVG } from 'qrcode.react'; // Import the QRCode component
import generateOrderNumber from '../utils/generateOrderNumber';
import axios from 'axios';
import Cookies from 'js-cookie';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemDetail {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface UserProfile {
  profile: {
    street: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
  };
}

export default function CheckoutPage() {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [creditCardDetails, setCreditCardDetails] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserProfile = async () => {
      const token = Cookies.get('authToken');
      try {
        const profile = await axios.get('http://localhost:3000/api/profile/get-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(profile.data);
        if (profile) {
          setAddress(profile.data.address)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }
    fetchUserProfile();
  }, []);

  const navigate = useNavigate(); // Navigation hook

  const formatPrice = (price: number): string => {
    const formattedPrice = new Intl.NumberFormat('id-ID').format(price);
    return `Rp. ${formattedPrice}`;
  };


  const totalPrice = cartItems.reduce((acc: number, item: CartItem) => {
    return acc + (item.price * item.quantity);
  }, 0);
  
  const orderNumber = generateOrderNumber();



  const bankTransferInfo = `
  Bank Name: Evan Bank
  Account Number: 1234567890
  Amount: ${formatPrice(totalPrice)}
  Reference: ${orderNumber}`;

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const handleCreditCardChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCreditCardDetails(event.target.value);
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method!');
      return;
    }


    console.log(orderNumber)

    const addressAtProfile = `${userProfile?.profile.street || ''}, ${userProfile?.profile.city || ''}, ${userProfile?.profile.zip || ''}, ${userProfile?.profile.country || ''}`;


    const finalAddress = address || (userProfile ? addressAtProfile : '')

    if (!finalAddress) {
      alert('Please enter your address!')
      return;
    }

    if (paymentMethod === 'credit' && !creditCardDetails) {
      alert('Please enter your credit card details!');
      return;
    }

    const transactionData = {
      orderNumber,
      address: finalAddress,
      paymentMethod,
      items: cartItems.map((item: CartItemDetail) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "PENDING",
      paymentStatus: 'PENDING',
      shippingMethod: 'Standard',
    };

    console.log('INCOMING DATA:', transactionData);

    const token = Cookies.get('authToken');
    try {
      const response = await axios.post(`http://localhost:3000/api/payment/addPayments`, { transactionData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data);

      const midtransRedirectUrl = response.data.paymentUrl;
      if (midtransRedirectUrl) {
        window.location.href = midtransRedirectUrl;
      }
    } catch (error) {
      console.error('error during checkout:', error)
    }
  };

  return (
    <Box sx={{ width: '80%', margin: '20px auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <TextField
        label="Address"
        variant="outlined"
        fullWidth
        multiline
        value={address}
        onChange={handleAddressChange}
        sx={{ marginBottom: '20px' }}
      />

      {/* Cart Summary Section */}
      <Box>
        <Typography variant="h6" gutterBottom>Your Items</Typography>
        {cartItems.map((item: CartItem) => (
          <Box key={item.id} display="flex" justifyContent="space-between" mb={2}>
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{ height: 100, width: 100, borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <Typography sx={{ mt: '35px' }}>{item.name} (x{item.quantity})</Typography>
            <Typography sx={{ mt: '35px' }}>{formatPrice(item.price)}</Typography>
          </Box>
        ))}
        <Divider />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">{formatPrice(totalPrice)}</Typography>
        </Box>
      </Box>

      {/* Back to Cart Button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(-1)} // Redirect to cart page
        sx={{ marginTop: '20px' }}
      >
        Back to Cart
      </Button>

      {/* Payment Method Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Choose Payment Method</Typography>
        <RadioGroup value={paymentMethod} onChange={handlePaymentChange}>
          <FormControlLabel
            value="CREDIT"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <CreditCardIcon /> Credit Card
              </Box>
            }
          />
          <FormControlLabel
            value="BANK"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <AccountBalanceIcon /> Bank Transfer
              </Box>
            }
          />
          <FormControlLabel
            value="CASH"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShippingIcon /> Cash on Delivery
              </Box>
            }
          />
        </RadioGroup>
      </Box>

      {paymentMethod === 'credit' && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Credit Card Details</Typography>
          <TextField
            label="Credit Card Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={creditCardDetails}
            onChange={handleCreditCardChange}
            inputProps={{ maxLength: 16 }}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Expiration (MM/YY)"
              variant="outlined"
              margin="normal"
              placeholder="MM/YY"
              inputProps={{ maxLength: 5 }} // Limit to MM/YY format
            />
            <TextField
              label="CVV"
              variant="outlined"
              margin="normal"
              inputProps={{ maxLength: 4 }} // Limit to CVV length
            />
          </Box>
        </Box>
      )}

      {paymentMethod === 'bank' && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Bank Transfer</Typography>
          <QRCodeSVG value={bankTransferInfo} size={150} style={{ margin: '0 auto' }} />
          <Typography>Scan the QR code to transfer the payment.</Typography>
        </Box>
      )}

      {paymentMethod === 'cash' && (
        <Typography mt={3} variant="h6">
          You chose Cash on Delivery. Please have the exact amount ready when the order arrives.
        </Typography>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          fullWidth
          sx={{ padding: '10px', fontSize: '16px' }}
        >
          Complete Checkout
        </Button>
      </Box>
    </Box>
  );
}
