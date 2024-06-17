import { HTTP_STATUS } from '../constants/http-status.constant.js';

export const errorHandler = (err, req, res, next) => {
    // 조이 에러 처리 구현 후 추가
    // Http Error 처리
    // 눈에 보이는 에러가 필요해보여서 추가했습니다.

    if (err.status && err.message) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
        });
    }
    // 눈에 보이는 에러가 필요해보여서 추가했습니다.
    console.error(err);
    // 나머지 에러 처리
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
    });
};
