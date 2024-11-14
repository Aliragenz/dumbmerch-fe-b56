import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card } from '@mui/material';
import { Chart } from 'react-google-charts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PieChartIcon from '@mui/icons-material/PieChart';

export default function Dashboard() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        // Update the time every second
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup the timer on unmount
    }, []);

    // Sample data for the Google Chart
    const chartData = [
        ["Month", "Sales", "Expenses", "Profit"],
        ["January", 12000, 8000, 4000],  // Post-holiday dip, manageable expenses
        ["February", 18000, 12000, 6000],  // Valentine's Day boost
        ["March", 15000, 10000, 5000],  // Steady month
        ["April", 14000, 9000, 5000],  // Slight dip before summer sales
        ["May", 20000, 13000, 7000],  // Spring sale effect
        ["June", 16000, 11000, 5000],  // Average month
        ["July", 17000, 12000, 5000],  // Mid-year clearance
        ["August", 15000, 10000, 5000],  // Back-to-school season
        ["September", 14000, 9000, 5000],  // Steady, no special events
        ["October", 16000, 10000, 6000],  // Halloween boost
        ["November", 22000, 15000, 7000],  // Pre-holiday shopping
        ["December", 30000, 20000, 10000],  // Peak sales season
    ];

    // Dummy data
    const incomingOrders = 25; // Example: number of new orders received today
    const dailyIncome = 1500; // Example: Income generated today
    const totalSales = 7906; // Example: total sales amount accumulated over time

    const formatCurrency = (value: number | bigint) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };


    const chartOptions = {
        chart: {
            title: "Company Performance",
            subtitle: "Sales and Incomes over the Months",
        },
        colors: ["#4285F4", "#DB4437", "#4CAF50"],
    };



    return (
        <Box>
            {/* Top Section: Clock and Date */}
            <Paper variant="outlined" style={{ padding: 15, marginBottom: 16, width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        {dateTime.toLocaleTimeString()}
                    </Typography>
                    <Typography variant="h6">
                        {dateTime.toLocaleDateString()}
                    </Typography>
                </Box>
            </Paper>
            {/* Main Content Area for Charts */}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Paper sx={{ width: '30%', marginRight: '10px', padding: '16px' }}>
                    <Box display="flex" alignItems="center" justifyContent= 'center'>
                        <ShoppingCartIcon />
                        <Box ml={1}>Incoming Order</Box>
                    </Box>
                    <Box>New Orders: {incomingOrders}</Box>
                </Paper>
                <Paper sx={{ width: '30%', marginRight: '10px', padding: '16px' }}>
                    <Box display="flex" alignItems="center" justifyContent= 'center'>
                        <MonetizationOnIcon />
                        <Box ml={1}>Daily Income</Box>
                    </Box>
                    <Box>Today's Revenue: {formatCurrency(dailyIncome)}</Box>
                </Paper>
                <Paper sx={{ width: '30%', padding: '16px' }}>
                    <Box display="flex" alignItems="center" justifyContent= 'center'>
                        <PieChartIcon />
                        <Box ml={1}>Total Sales</Box>
                    </Box>
                    <Box>Total Sales: {formatCurrency(totalSales)}</Box>
                </Paper>
            </Box>
            {/* New Chart Below Existing Charts */}
            <Box sx={{ marginTop: '20px', backgroundColor: '#181818' }}>
                <Paper sx={{ padding: '5px', backgroundColor: 'transparent' }}>
                    <Card style={{ backgroundColor: 'red', color: 'red' }}>
                        <Chart
                            chartType="Bar"
                            width="100%"
                            height={400}
                            data={chartData}
                            options={chartOptions}
                        />
                    </Card>
                </Paper>
            </Box>
        </Box>
    );
};

