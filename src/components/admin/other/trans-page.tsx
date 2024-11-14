import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, SelectChangeEvent, Select, MenuItem, TextField } from '@mui/material';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, updateTransactionStatus } from '../../../store/other/transactionSlice';
import { OrderStatusEnum } from '../../utils/orderStatusEnum';

export default function Transaction() {
    const dispatch = useDispatch<AppDispatch>();
    const { data: transactions, loading, error } = useSelector((state: RootState) => state.transactions);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    console.log('Transactions:', transactions);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Filter orders based on search term
    const filteredTransactions = transactions.filter((transaction) =>
        transaction.orderNumber.split('-')[1]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" flexDirection="row" ml={2} mb={-2}>
                <h2>Transaction</h2>
            </Box>
            <TextField
                label="Search Order ID"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: '300px', mb: '10px', ml: '10px', display: 'flex' }}
            />


            <TableContainer component={Paper} sx={{ marginLeft: '10px', marginRight: '10px', width: '99%' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '10%' }}>No</TableCell>
                            <TableCell sx={{ width: '30%' }}>Order</TableCell>
                            <TableCell sx={{ width: '30%' }}>Status</TableCell>
                            <TableCell sx={{ width: '30%' }}>Payment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ fontWeight: 'bold', color: 'red' }}>
                                    The Order You're Searching For is Nowhere to Be Found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTransactions.map((transaction, index) => (
                                <TableRow key={transaction.id} sx={{
                                    backgroundColor: index % 2 === 0 ? '#4F4F4F' : '#6E6E6E', // Alternate row colors
                                }}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{transaction.orderNumber}</TableCell>
                                    <TableCell align="center" sx={{ display: 'flex' }}>
                                        <Select
                                            value={transaction.status}
                                            onChange={async (event: SelectChangeEvent) => {
                                                const newStatus = event.target.value as OrderStatusEnum;
                                                await dispatch(updateTransactionStatus({id: transaction.id, status:newStatus}))
                                                
                                                dispatch(fetchTransactions());
                                                
                                                console.log(`Status for order ${transaction.orderNumber} change to ${event.target.value}`)
                                            }}
                                            sx={{
                                                minWidth: 120, '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none', // Remove the outline
                                                },
                                                '&:focus': {
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                        >
                                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="PACKING">Packing</MenuItem>
                                            <MenuItem value="DELIVERING">Delivering</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{transaction.paymentMethod}</TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
