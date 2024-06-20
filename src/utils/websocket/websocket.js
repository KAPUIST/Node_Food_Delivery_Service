import { WebSocketServer } from 'ws';

const clients = new Map();
export const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const { type, userId, role } = JSON.parse(message);
            if (userId && role) {
                if (!clients.has(userId)) {
                    clients.set(userId, {});
                }
                clients.get(userId)[type] = { ws, role };
                console.log(`User ${userId} with role ${role} registered for ${type} notifications`);
            }
        });

        ws.on('close', () => {
            // 연결 종료 시 클라이언트 제거
            for (let [userId, types] of clients.entries()) {
                for (let [notificationType, { ws: clientWs }] of Object.entries(types)) {
                    if (clientWs === ws) {
                        delete types[notificationType];
                        console.log(`User ${userId} unregistered from ${notificationType} notifications`);
                    }
                }
                if (Object.keys(types).length === 0) {
                    clients.delete(userId);
                    console.log(`User ${userId} completely unregistered`);
                }
            }
        });
    });

    console.log('WebSocket server initialized');
};
// 특정 사용자에게 알림을 보내는 헬퍼 함수
const sendNotification = (userId, type, message) => {
    const userNotifications = clients.get(userId);
    if (userNotifications && userNotifications[type]) {
        const { ws } = userNotifications[type];
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
            console.log(`Notified user ${userId} for ${type}`);
        } else {
            console.log(`User ${userId} is not connected for ${type}`);
        }
    }
};
export const notifyNewOrder = (ownerId) => {
    sendNotification(ownerId, 'New Order', {
        type: 'New Order',
        message: '새로운 주문이 접수되었습니다.',
    });
};

// 주문 상태 변경 시 알림을 보내는 함수
export const notifyChangedOrderStatus = (userId, orderStatus) => {
    sendNotification(userId, 'Change Order Status', {
        type: 'Change Order Status',
        message: `요청하신 주문이 ${orderStatus} 상태로 변경되었습니다.`,
        orderStatus,
    });
};
