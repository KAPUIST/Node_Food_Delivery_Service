import { PrismaClient } from '@prisma/client';
import { fakerKO as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 기존 데이터 삭제
    // await prisma.orderItems.deleteMany();
    // await prisma.orders.deleteMany();
    // await prisma.menus.deleteMany();
    // await prisma.reviews.deleteMany();
    // await prisma.images.deleteMany();
    // await prisma.points.deleteMany();
    // await prisma.tokens.deleteMany();
    // await prisma.restaurants.deleteMany();
    // await prisma.users.deleteMany();

    // 비밀번호는 모두 같은 값으로 설정
    const passwordHash = '$2b$10$1LOh6xAWYSZRIl0AjuDLA.HR3//CVLE9ahxqPp1/Gz3PuCyYLQN0S';

    // Cuisine type mapping
    const CUISINE_TYPE_MAPPING = {
        한식: 'KOREAN',
        양식: 'WESTERN',
        중식: 'CHINESE',
        일식: 'JAPANESE',
    };

    // Faker로 20명의 사용자 생성 (10명은 사장님, 10명은 고객님)
    const users = [];
    for (let i = 0; i < 20; i++) {
        const user = await prisma.users.create({
            data: {
                email: faker.internet.email(),
                password: passwordHash,
                role: i < 10 ? 'OWNER' : 'CUSTOMER', // 첫 10명은 사장님, 나머지는 고객님
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                name: `${faker.person.lastName()}${faker.person.firstName()}`,
                phoneNumber: faker.phone.imei('010-####-####'),
            },
        });
        users.push(user);
    }

    // 각 사용자에게 포인트 생성
    const pointsPromises = users.map((user) =>
        prisma.points.create({
            data: {
                userId: user.id,
                point: user.role === 'OWNER' ? 0 : faker.number.int({ min: 10000000, max: 1000000000 }),
            },
        }),
    );

    await Promise.all(pointsPromises);

    // 각 사용자에게 토큰 생성
    const tokensPromises = users.map((user) =>
        prisma.tokens.create({
            data: {
                userId: user.id,
                token: faker.string.uuid(),
            },
        }),
    );

    await Promise.all(tokensPromises);

    // Faker로 10개의 레스토랑 생성 (각 사장님은 하나의 레스토랑만 소유)
    const restaurants = [];
    for (let i = 0; i < 10; i++) {
        const owner = users[i]; // 첫 10명은 사장님
        const restaurant = await prisma.restaurants.create({
            data: {
                ownerId: owner.id,
                name: faker.company.name(),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                cuisineType: CUISINE_TYPE_MAPPING[faker.helpers.arrayElement(Object.keys(CUISINE_TYPE_MAPPING))], // 한식, 양식, 중식, 일식 중 하나
                totalRevenue: 0, // 초기 매출액은 0으로 시작
            },
        });
        restaurants.push(restaurant);
    }

    // 각 레스토랑에 Faker로 10개의 메뉴 생성
    const menusPromises = restaurants.map((restaurant) => {
        const menus = [];
        for (let i = 0; i < 10; i++) {
            menus.push(
                prisma.menus.create({
                    data: {
                        restaurantId: restaurant.id,
                        name: faker.commerce.productName(),
                        price: faker.number.int({ min: 5000, max: 50000 }),
                    },
                }),
            );
        }
        return menus;
    });

    const menus = await Promise.all(menusPromises.flat());
    const flatMenus = menus.flat();

    // 모든 주문 생성
    const ordersPromises = restaurants.map((restaurant) => {
        const orders = [];
        for (let i = 0; i < 20; i++) {
            const customer = users[faker.number.int({ min: 10, max: 19 })]; // 고객들 중 한 명이 주문 (index 10 ~ 19)
            const status = faker.helpers.arrayElement([
                'ORDER_PLACED',
                'PREPARING',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELED',
            ]);
            const order = prisma.orders.create({
                data: {
                    customerId: customer.id,
                    restaurantId: restaurant.id,
                    status,
                },
            });
            orders.push(order);
        }
        return orders;
    });

    const createdOrders = await Promise.all(
        ordersPromises.flat(), // 모든 주문을 생성
    );

    // 각 주문에 2~5개의 주문 항목 추가
    const orderItemsPromises = createdOrders.map(async (order) => {
        const orderItems = [];
        for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
            const menu = flatMenus[faker.number.int({ min: 0, max: flatMenus.length - 1 })]; // 모든 메뉴 중 랜덤 선택
            orderItems.push(
                prisma.orderItems.create({
                    data: {
                        orderId: order.id,
                        menuId: menu.id,
                        quantity: faker.number.int({ min: 1, max: 5 }),
                        price: menu.price,
                    },
                }),
            );
        }
        return await Promise.all(orderItems); // 생성된 모든 orderItems를 비동기적으로 처리
    });

    await Promise.all(orderItemsPromises.flat());

    // 배달 완료된 주문에 대해 포인트 처리 및 매출 업데이트
    const deliveredOrders = createdOrders.filter((order) => order.status === 'DELIVERED');
    for (const order of deliveredOrders) {
        const orderItems = await prisma.orderItems.findMany({
            where: { orderId: order.id },
        });
        const totalOrderPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await prisma.points.update({
            where: { userId: order.customerId },
            data: { point: { decrement: totalOrderPrice } },
        });

        const restaurant = await prisma.restaurants.findUnique({
            where: { id: order.restaurantId },
        });

        await prisma.points.update({
            where: { userId: restaurant.ownerId },
            data: { point: { increment: totalOrderPrice } },
        });

        await prisma.restaurants.update({
            where: { id: order.restaurantId },
            data: { totalRevenue: { increment: totalOrderPrice } },
        });
    }

    // 각 레스토랑에 대한 리뷰 생성
    const reviewsPromises = deliveredOrders.map((order) => {
        const rating = faker.number.int({ min: 1, max: 5 });
        const comment = faker.lorem.sentence();
        return prisma.reviews.create({
            data: {
                customerId: order.customerId,
                restaurantId: order.restaurantId,
                rating,
                comment,
            },
        });
    });

    await Promise.all(reviewsPromises);

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
