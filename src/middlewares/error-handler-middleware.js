import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    // 조이 에러 처리
    if (err.name === MESSAGES.AUTH.ERROR.JOI_ERR_NAME) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: HTTP_STATUS.BAD_REQUEST,
            message: err.message,
        });
    }

    // Http Error 처리
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
        message: MESSAGES.AUTH.ERROR.ETC,
    });
};
