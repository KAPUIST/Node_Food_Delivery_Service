export const ORDER_STATUS = {
    ORDER_PLACED: 'ORDER_PLACED', // 주문 접수
    PREPARING: 'PREPARING', // 음식 준비 중
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY', // 배달 중
    DELIVERED: 'DELIVERED', // 배달 완료
    CANCELED: 'CANCELED', // 주문 취소
};

export const COMMON_ORDER_STATUS = {
    PREPARING: 'PREPARING', // 음식 준비 중
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY', // 배달 중
};

export const COMPLETE_ORDER_STATUS = {
    DELIVERED: 'DELIVERED', // 배달 완료
};

export const ORDER_VALIDATOR = {
    ARRAY_MIN_LENGTH: 1, // 유효성 검사 시 orderItems 배열 최소 길이
};
export const COMMON = {
    ORDER_ID: '주문 번호',
};
