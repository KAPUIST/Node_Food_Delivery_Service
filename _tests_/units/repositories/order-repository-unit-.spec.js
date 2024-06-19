// __tests__/unit/ordersRepository.unit.test.js

import OrdersRepository from '../../../src/repositories/orders.repository'; // 실제 경로로 수정
import { jest } from '@jest/globals';

// Prisma 클라이언트 모킹
const mockPrisma = {
    restaurants: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    orders: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    },
    $transaction: jest.fn(),
};

describe('OrdersRepository 유닛 테스트!!', () => {
    let ordersRepository;

    beforeAll(() => {
        ordersRepository = new OrdersRepository(mockPrisma);
    });

    beforeEach(() => {
        jest.clearAllMocks(); // 각 테스트 시작 전 모킹된 모든 호출 기록을 초기화
    });

    test('findOwnerByRestaurantId 함수는 레스토랑 오너 아이디를 리턴해야합니다.', async () => {
        const mockReturn = { ownerId: 123 };
        mockPrisma.restaurants.findUnique.mockResolvedValue(mockReturn);

        const ownerId = await ordersRepository.findOwnerByRestaurantId(1);

        expect(mockPrisma.restaurants.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            select: { ownerId: true },
        });
        expect(ownerId).toBe(123);
    });

    test('findOrderById 함수는 오더 아이디와 아이템을 함께 리턴해야 합니다.', async () => {
        const mockReturn = { id: 1, orderItems: [{ id: 1, menuId: 1, quantity: 2, price: 1000 }] };
        mockPrisma.orders.findUnique.mockResolvedValue(mockReturn);

        const order = await ordersRepository.findOrderById(1);

        expect(mockPrisma.orders.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { orderItems: true },
        });
        expect(order).toEqual(mockReturn);
    });

    test('findOrdersByStatus 상태별로 주문을 조회하면 항목을 포함한 주문을 반환해야 합니다', async () => {
        const mockReturn = [
            { id: 1, status: 'ORDER_PLACED', orderItems: [{ id: 1, menuId: 1, quantity: 2, price: 1000 }] },
        ];
        mockPrisma.orders.findMany.mockResolvedValue(mockReturn);

        const orders = await ordersRepository.findOrdersByStatus('ORDER_PLACED', 1);

        expect(mockPrisma.orders.findMany).toHaveBeenCalledWith({
            where: { status: 'ORDER_PLACED', restaurantId: 1 },
            include: { orderItems: true },
            orderBy: { createdAt: 'desc' },
        });
        expect(orders).toEqual(mockReturn);
    });

    test('isUserOwnerOfRestaurant 주문 상태를 업데이트하고 업데이트된 주문을 반환해야 합니다.', async () => {
        const mockReturn = { id: 1, ownerId: 123 };
        mockPrisma.restaurants.findUnique.mockResolvedValue(mockReturn);

        const result = await ordersRepository.isUserOwnerOfRestaurant(123, 1);

        expect(mockPrisma.restaurants.findUnique).toHaveBeenCalledWith({
            where: { id: 1, ownerId: 123 },
        });
        expect(result).toEqual(mockReturn);
    });

    test('updateOrderStatus should update and return order', async () => {
        const mockReturn = { id: 1, status: 'DELIVERED' };
        mockPrisma.orders.update.mockResolvedValue(mockReturn);

        const updatedOrder = await ordersRepository.updateOrderStatus(1, 'DELIVERED');

        expect(mockPrisma.orders.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { status: 'DELIVERED' },
        });
        expect(updatedOrder).toEqual(mockReturn);
    });

    test('최근 10개의 주문을 반환해야 합니다', async () => {
        const mockReturn = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, orderItems: [] }));
        mockPrisma.orders.findMany.mockResolvedValue(mockReturn);

        const recentOrders = await ordersRepository.findRecentOrders(1);

        expect(mockPrisma.orders.findMany).toHaveBeenCalledWith({
            where: { restaurantId: 1 },
            take: 30,
            include: { orderItems: true },
            orderBy: { createdAt: 'desc' },
        });
        expect(recentOrders).toEqual(mockReturn);
    });

    test('completeOrderTx 트랜잭션을 통해 주문을 완료해야 합니다.', async () => {
        const mockOrder = { id: 1, status: 'DELIVERED' };
        const mockTransaction = jest.fn().mockImplementation((callback) =>
            callback({
                orders: {
                    update: jest.fn().mockResolvedValue(mockOrder),
                },
                restaurants: {
                    update: jest.fn(),
                },
            }),
        );

        mockPrisma.$transaction = mockTransaction;

        const mockCallback = jest.fn();

        const result = await ordersRepository.completeOrderTx(1, 1, 1000, mockCallback);

        expect(mockTransaction).toHaveBeenCalled();
        expect(result).toEqual(mockOrder);
    });

    test('createOrderTx 트랜잭션을 사용하여 주문을 생성해야 합니다.', async () => {
        const mockOrder = {
            id: 1,
            customerId: 1,
            restaurantId: 1,
            orderItems: [{ menuId: 1, quantity: 2, price: 1000 }],
        };
        const mockTransaction = jest.fn().mockImplementation((callback) =>
            callback({
                orders: {
                    create: jest.fn().mockResolvedValue(mockOrder),
                },
            }),
        );

        mockPrisma.$transaction = mockTransaction;

        const mockCallback = jest.fn();

        const orderData = await ordersRepository.createOrderTx(
            1,
            1,
            [{ menuId: 1, quantity: 2, price: 1000 }],
            2000,
            mockCallback,
        );

        expect(mockTransaction).toHaveBeenCalled();
        expect(orderData).toEqual(mockOrder);
    });
    test('createOrderTx 함수는 트랜잭션 내에서 포인트 차감 콜백 함수를 호출해야 합니다.', async () => {
        const mockOrder = {
            id: 1,
            customerId: 1,
            restaurantId: 1,
            orderItems: [{ menuId: 1, quantity: 2, price: 1000 }],
        };

        const mockTransaction = jest.fn().mockImplementation((callback) =>
            callback({
                orders: {
                    create: jest.fn().mockResolvedValue(mockOrder),
                },
            }),
        );

        mockPrisma.$transaction = mockTransaction;

        const mockCallback = jest.fn();

        const orderData = await ordersRepository.createOrderTx(
            1,
            1,
            [{ menuId: 1, quantity: 2, price: 1000 }],
            2000,
            mockCallback,
        );

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith(1, 2000, expect.anything()); // 콜백이 올바른 인수로 호출됨
        expect(orderData).toEqual(mockOrder);
    });
    test('completeOrderTx 함수에서 트랜잭션 중 하나의 작업이 실패하면 롤백되어야 합니다.', async () => {
        const mockOrder = { id: 1, status: 'DELIVERED' };
        const mockError = new Error('Transaction failed');

        const mockTransaction = jest.fn().mockImplementation((callback) => {
            // 트랜잭션 중 하나의 작업이 실패하도록 설정
            return callback({
                orders: {
                    update: jest.fn().mockResolvedValue(mockOrder),
                },
                restaurants: {
                    update: jest.fn().mockRejectedValue(mockError), // 레스토랑 업데이트 중 실패
                },
            });
        });

        mockPrisma.$transaction = mockTransaction;

        const mockCallback = jest.fn();

        await expect(ordersRepository.completeOrderTx(1, 1, 1000, mockCallback)).rejects.toThrow('Transaction failed');

        expect(mockTransaction).toHaveBeenCalled();
        expect(mockCallback).not.toHaveBeenCalled(); // 트랜잭션 실패 시 콜백이 호출되지 않음
    });
    test('findOrdersByStatus 함수가 특정 상태의 주문이 없을 때 빈 배열을 반환해야 합니다.', async () => {
        mockPrisma.orders.findMany.mockResolvedValue([]); // 빈 배열을 반환하도록 설정

        const orders = await ordersRepository.findOrdersByStatus(undefined, 1);

        expect(mockPrisma.orders.findMany).toHaveBeenCalledWith({
            where: { status: undefined, restaurantId: 1 },
            include: { orderItems: true },
            orderBy: { createdAt: 'desc' },
        });
        expect(orders).toEqual([]); // 주문이 없을 때 빈 배열 반환
    });
    test('findOrderById 함수가 주문을 찾지 못하면 null을 반환해야 합니다.', async () => {
        mockPrisma.orders.findUnique.mockResolvedValue(null);

        const order = await ordersRepository.findOrderById(999); // 존재하지 않는 ID

        expect(mockPrisma.orders.findUnique).toHaveBeenCalledWith({
            where: { id: 999 },
            include: { orderItems: true },
        });
        expect(order).toBeNull(); // 주문을 찾지 못하면 null을 반환
    });
});
