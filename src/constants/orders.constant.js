export const OrderStatus = {
    ORDER_PLACED: 'ORDER_PLACED', // 주문 접수
    PREPARING: 'PREPARING', // 음식 준비 중
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY', // 배달 중
    DELIVERED: 'DELIVERED', // 배달 완료
    CANCELED: 'CANCELED', // 주문 취소
};

export const CommonOrderStatus = {
    PREPARING: 'PREPARING', // 음식 준비 중
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY', // 배달 중
};

export const CompleteOrderStatus = {
    DELIVERED: 'DELIVERED', // 배달 완료
};

export const ORDER_VALIDATOR = {
    // 유효성 검사시 orderItems 배열 최소 길이
    ARRAY_MIN_LENGTH: 1,
    STATUS: {
        ORDER_PLACED: 'ORDER_PLACED',
        PREPARING: 'PREPARING',
        OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
        DELIVERED: 'DELIVERED',
        CANCELED: 'CANCELED',
    },
};
