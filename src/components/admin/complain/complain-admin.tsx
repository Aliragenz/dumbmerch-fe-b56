import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import userAvatar from '../image/Man.png';
import userAvatar2 from '../image/Woman.png';
import adminAvatar from '../image/Notebook.png';
import io from 'socket.io-client';

interface Message {
    sender: 'admin' | 'user';
    text: string;
}

const socket = io('http://localhost:3000');  // Socket connection

const ComplainAdmin: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'user', text: 'Hello Admin, I need your help' },
        { sender: 'admin', text: 'Yes, is there anything I can help?' },
    ]);
    const [newMessage, setNewMessage] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageToSend: Message = { sender: 'admin', text: newMessage };
            setMessages((prevMessages) => [...prevMessages, messageToSend]);
            socket.emit('sendMessage', messageToSend); // Emit message to the server
            setNewMessage('');
        }
    };

    useEffect(() => {
        socket.on('receiveMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        return () => {
            socket.off('receiveMessage');
        };
    }, [messages]);

    return (
        <Box sx={{ display: 'flex', height: '82.5vh', backgroundColor: '#181818' }}>
            {/* Left Side - Navigation */}
            <Box sx={{ width: '25%', backgroundColor: 'Transparent', display: 'flex', flexDirection: 'column', alignItems: 'start', paddingTop: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                    <Avatar src={userAvatar} alt="User Avatar" sx={{ width: 56, height: 56 }} />
                    <Box ml={2}>
                        <Typography variant="body1" color="#fff">User 1</Typography>
                        <Typography variant="caption" color="#ccc">{newMessage}</Typography>
                    </Box>
                </Box>
                <Box display="flex" alignItems="center">
                    <Avatar src={userAvatar2} alt="User Avatar" sx={{ width: 56, height: 56 }} />
                    <Box ml={2}>
                        <Typography variant="body1" color="#fff">User 2</Typography>
                        <Typography variant="caption" color="#ccc">{newMessage}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#333333' }} />

            {/* Right Side - Chat Section */}
            <Box sx={{ width: '75%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', p: 2 }}>
                    {messages.map((message, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'admin' ? 'flex-end' : 'flex-start', mb: 2 }}>
                            {message.sender === 'admin' && <Avatar src={adminAvatar} alt="Admin Avatar" sx={{ width: 40, height: 40, mr: 1 }} />}
                            <Paper elevation={3} sx={{ p: 1.5, maxWidth: '60%', backgroundColor: message.sender === 'admin' ? '#4a4a4a' : '#3f51b5', color: '#fff' }}>
                                <Typography variant="body1">{message.text}</Typography>
                            </Paper>
                            {message.sender === 'user' && <Avatar src={userAvatar} alt="User Avatar" sx={{ width: 40, height: 40, ml: 1 }} />}
                        </Box>
                    ))}
                    <div ref={chatEndRef}></div>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#181818', p: 2 }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder='Type your messages here'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ input: { color: 'white', bgcolor: '#333333' } }}
                    />
                    <IconButton color="primary" onClick={handleSendMessage}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default ComplainAdmin;
