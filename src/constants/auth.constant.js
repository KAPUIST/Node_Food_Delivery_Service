export const AUTH_CONS = {
    // 토큰 유효기간
    ACCESS_EXPIRE_TIME: '12h',
    REFRESH_EXPIRE_TIME: '7d',
    // 이메일 인증 관련
    AUTH_EMAIL: {
        FROM: process.env.MAIL_AUTH_USER,
        SUBJECT: '인증 관련 메일입니다.',
        HTML: '인증번호입니다.',
    },
    // 역할 관련
    ROLE: {
        CUSTOMER: 'CUSTOMER',
        OWNER: 'OWNER',
    },
    // 유효성 검사시 비밀번호 최소 길이
    PASSWORD_MIN_LENGTH: 6,
    //유효성 검사시 최소 도메인 요소
    MIN_DOMAIN_SEGMENTS: 2,
    // 유효성 검사시 이메일 형식
    TLDS: ['com', 'net', 'kr'],
};
