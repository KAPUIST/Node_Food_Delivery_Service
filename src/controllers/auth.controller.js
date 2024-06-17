import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    // 회원가입 - controller
    signUpUser = async (req, res, next) => {
        try {
            const createdUser = await this.authService.signUpUser(req.body);
            return res
                .status(HTTP_STATUS.CREATED)
                .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.AUTH.SIGN_UP.SUCCEED, data: createdUser });
        } catch (err) {
            next(err);
        }
    };
    // 로그인 - controller
    signInUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const tokens = await this.authService.signInUser(email, password);

            return res
                .status(HTTP_STATUS.OK)
                .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN.SUCCEED, data: tokens });
        } catch (err) {
            next(err);
        }
    };
}
