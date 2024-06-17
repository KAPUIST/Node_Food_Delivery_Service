import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // 트랜잭션 내에서 시드 데이터 삽입
    await prisma.$transaction(async (prisma) => {
        // 기존 데이터 삭제
        await prisma.orderItems.deleteMany();
        await prisma.orders.deleteMany();
        await prisma.menus.deleteMany();
        await prisma.reviews.deleteMany();
        await prisma.images.deleteMany();
        await prisma.points.deleteMany();
        await prisma.tokens.deleteMany();
        await prisma.restaurants.deleteMany();
        await prisma.users.deleteMany();

        // Users
        const user1 = await prisma.users.create({
            data: {
                email: 'customer1@example.com',
                password: 'password123',
                role: 'CUSTOMER',
                city: '서울',
                address: '강남구 역삼동 123-4',
                name: '김철수',
                phoneNumber: '010-1234-5678',
            },
        });

        const user2 = await prisma.users.create({
            data: {
                email: 'owner1@example.com',
                password: 'password123',
                role: 'OWNER',
                city: '서울',
                address: '강남구 삼성동 567-8',
                name: '이영희',
                phoneNumber: '010-9876-5432',
            },
        });

        const user3 = await prisma.users.create({
            data: {
                email: 'customer2@example.com',
                password: 'password123',
                role: 'CUSTOMER',
                city: '서울',
                address: '서초구 서초동 789-1',
                name: '박영수',
                phoneNumber: '010-2345-6789',
            },
        });

        const user4 = await prisma.users.create({
            data: {
                email: 'customer3@example.com',
                password: 'password123',
                role: 'CUSTOMER',
                city: '서울',
                address: '용산구 한남동 123-2',
                name: '최민수',
                phoneNumber: '010-3456-7890',
            },
        });

        // Points 초기 설정
        await prisma.points.create({
            data: {
                userId: user1.id,
                point: 1000000, // 사용자는 초기 100만 포인트
            },
        });

        await prisma.points.create({
            data: {
                userId: user2.id,
                point: 0, // 오너는 초기 0 포인트
            },
        });

        await prisma.points.create({
            data: {
                userId: user3.id,
                point: 1000000, // 새로운 사용자도 초기 100만 포인트
            },
        });

        await prisma.points.create({
            data: {
                userId: user4.id,
                point: 1000000, // 새로운 사용자도 초기 100만 포인트
            },
        });

        // Tokens
        await prisma.tokens.create({
            data: {
                userId: user1.id,
                token: 'access_token_123',
            },
        });

        await prisma.tokens.create({
            data: {
                userId: user2.id,
                token: 'access_token_456',
            },
        });

        await prisma.tokens.create({
            data: {
                userId: user3.id,
                token: 'access_token_789',
            },
        });

        await prisma.tokens.create({
            data: {
                userId: user4.id,
                token: 'access_token_012',
            },
        });

        // Restaurants
        const restaurant1 = await prisma.restaurants.create({
            data: {
                ownerId: user2.id,
                name: '스시집',
                city: '서울',
                address: '강남구 삼성동 567-8',
                cuisineType: 'JAPANESE',
                totalRevenue: 0, //초기에는 0원시작
            },
        });

        // Menus
        const menu1 = await prisma.menus.create({
            data: {
                restaurantId: restaurant1.id,
                name: '스시 롤',
                price: 15000,
            },
        });

        const menu2 = await prisma.menus.create({
            data: {
                restaurantId: restaurant1.id,
                name: '참치 사시미',
                price: 20000,
            },
        });

        const menu3 = await prisma.menus.create({
            data: {
                restaurantId: restaurant1.id,
                name: '연어 사시미',
                price: 18000,
            },
        });

        const menu4 = await prisma.menus.create({
            data: {
                restaurantId: restaurant1.id,
                name: '우동',
                price: 10000,
            },
        });

        // Orders - 배달 준비 중 (user1)
        const order1 = await prisma.orders.create({
            data: {
                customerId: user1.id,
                restaurantId: restaurant1.id,
                status: 'PREPARING',
            },
        });

        // OrderItems - 배달 준비 중 (user1)

        await prisma.orderItems.create({
            data: {
                orderId: order1.id,
                menuId: menu1.id,
                quantity: 2,
                price: menu1.price * 2, // quantity에 맞게 가격 계산
            },
        });

        await prisma.orderItems.create({
            data: {
                orderId: order1.id,
                menuId: menu2.id,
                quantity: 1,
                price: menu2.price * 1, // 참치 사시미 1개 주문
            },
        });

        // Orders - 배달 준비 중 (user3)
        const order2 = await prisma.orders.create({
            data: {
                customerId: user3.id,
                restaurantId: restaurant1.id,
                status: 'PREPARING',
            },
        });

        // OrderItems - 배달 준비 중 (user3)

        await prisma.orderItems.create({
            data: {
                orderId: order2.id,
                menuId: menu3.id,
                quantity: 1,
                price: menu3.price * 1, // quantity에 맞게 가격 계산
            },
        });

        await prisma.orderItems.create({
            data: {
                orderId: order2.id,
                menuId: menu4.id,
                quantity: 1,
                price: menu4.price * 1, // 우동 1개 주문
            },
        });

        // Orders - 배달 완료 (user4)
        const order3 = await prisma.orders.create({
            data: {
                customerId: user4.id,
                restaurantId: restaurant1.id,
                status: 'DELIVERED',
            },
        });

        // OrderItems - 배달 완료 (user4)
        const totalOrderPrice3_1 = menu1.price * 2; // 스시 롤 2개
        const totalOrderPrice3_2 = menu2.price * 1; // 참치 사시미 1개
        const totalOrderPrice3 = totalOrderPrice3_1 + totalOrderPrice3_2;

        await prisma.orderItems.create({
            data: {
                orderId: order3.id,
                menuId: menu1.id,
                quantity: 2,
                price: totalOrderPrice3_1, // 스시 롤 2개,  가격 계산
            },
        });

        await prisma.orderItems.create({
            data: {
                orderId: order3.id,
                menuId: menu2.id,
                quantity: 1,
                price: totalOrderPrice3_2, // 참치 사시미 1개 가격 계산
            },
        });

        // 사용자의 포인트 차감 및 오너의 포인트 증가 (배달 완료된 주문)
        await prisma.points.update({
            where: { userId: user4.id },
            data: { point: { decrement: totalOrderPrice3 } }, // 사용자의 포인트 감소
        });

        await prisma.points.update({
            where: { userId: user2.id },
            data: { point: { increment: totalOrderPrice3 } }, // 오너의 포인트 증가
        });
        await prisma.restaurants.update({
            where: { id: restaurant1.id },
            data: { totalRevenue: { increment: totalOrderPrice3 } }, // 레스토랑의 총 수익 증가
        });

        // Reviews
        // Reviews - 배달 완료된 유저만 작성 가능
        // Review with image
        const reviewWithImage = await prisma.reviews.create({
            data: {
                customerId: user4.id,
                restaurantId: restaurant1.id,
                rating: 5,
                comment: '최고의 스시 롤입니다!',
            },
        });

        // 이미지가 포함된 리뷰
        await prisma.images.create({
            data: {
                reviewId: reviewWithImage.id,
                url: 'https://i.namu.wiki/i/8UUOgQH48PzR9fy_6xIPx6xvYrvdg7YUnUVEfs-_rFA5HzPxKJn0KgYINe8WMcmpsQ_hcP-v5AkdRy9DGcQVfQ.webp', // 이미지 URL 예시
            },
        });
        // Images - 각 메뉴에 여러 이미지를 추가
        await prisma.images.create({
            data: {
                menuId: menu1.id,

                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmYGsgw8raj3L2woUWqOkYIIcM5x4wrTdEig&s', // 이미지 URL 예시
            },
        });

        await prisma.images.create({
            data: {
                menuId: menu1.id,

                url: 'https://m.asia-mart.co.kr/web/product/big/asiamart_375.jpg', // 이미지 URL 예시
            },
        });

        await prisma.images.create({
            data: {
                menuId: menu2.id,

                url: 'https://shop-hongli.com/data/item/1675384084/thumb-64iI64uk656R7Ja067GD7IK0_600x600.png', // 이미지 URL 예시
            },
        });

        await prisma.images.create({
            data: {
                menuId: menu3.id,

                url: 'https://previews.123rf.com/images/yhh5807531/yhh58075311411/yhh5807531141101219/33780925-%EC%97%B0%EC%96%B4-%EC%82%AC%EC%8B%9C%EB%AF%B8.jpg', // 이미지 URL 예시
            },
        });

        await prisma.images.create({
            data: {
                menuId: menu4.id,

                url: 'https://images.chosun.com/resizer/WpDgQoaJ3Ctplx_lJ-oW9lhaS2M=/616x0/smart/cloudfront-ap-northeast-1.images.arcpublishing.com/chosun/ZA7435F2DBB3FPSHLUVLJAJD4Y.jpg', // 이미지 URL 예시
            },
        });

        await prisma.images.create({
            data: {
                menuId: menu4.id,

                url: 'https://i.namu.wiki/i/7Zu0RCSIGqsUkoz_zGMQQqHskoVeWmMt3Lj7whQ1oTmUeFzcHbX7r-Ig6E3W7PTTMhqAa255j-XY1YW0TjeQrA.webp', // 이미지 URL 예시
            },
        });
    });

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
