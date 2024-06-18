export const ENV_CONS = {
    SERVER_PORT: process.env.PORT,
    BCRYPT_ROUND: +process.env.BCRYPT_SOLT_ROUND,
    ACCESS_TOKEN_KEY: process.env.JWT_ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.JWT_REFRESH_TOKEN_KEY,
    MAIL_MAX_CONNECTION: process.env.MAIL_MAX_CONNECTION,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_AUTH_USER: process.env.MAIL_AUTH_USER,
    MAIL_AUTH_PASS: process.env.MAIL_AUTH_PASS,
};
