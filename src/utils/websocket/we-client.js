import WebSocket from 'ws';

// 사장님 WebSocket 클라이언트
const ownerClient = new WebSocket('ws://localhost:3000');

ownerClient.on('open', () => {
    console.log('Connected to WebSocket server as Owner');
    ownerClient.send(JSON.stringify({ type: 'New Order', userId: 2, role: 'owner' }));
});

ownerClient.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'New Order') {
        console.log(`Received New Order notification: ${data.message}`);
    }
});

ownerClient.on('error', (error) => {
    console.error('Owner WebSocket error:', error);
});

ownerClient.on('close', () => {
    console.log('Owner WebSocket connection closed');
});

// 고객님 WebSocket 클라이언트
const customerClient = new WebSocket('ws://localhost:3000');

customerClient.on('open', () => {
    console.log('Connected to WebSocket server as Customer');
    customerClient.send(JSON.stringify({ type: 'Change Order Status', userId: 1, role: 'customer' }));
});

customerClient.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'Change Order Status') {
        console.log(`Received Change Order Status notification: ${data.message}`);
    }
});

customerClient.on('error', (error) => {
    console.error('Customer WebSocket error:', error);
});

customerClient.on('close', () => {
    console.log('Customer WebSocket connection closed');
});
