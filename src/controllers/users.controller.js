import { MESSAGES } from '../constants/message.constant.js';
export class UsersController {
    constructor(UsersService) {
        this.UsersService = UsersService;
    }

    //내 계정 정보확인
    myInfo = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const user = await this.UsersService.myInfo({ id: userId });
            return res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    };

    //내 계정 정보 수정
    myInfoEdit = async (req, res, next) => {
        try {
            const user = req.user;
            const changeData = req.body;
            await this.UsersService.myInfoEdit({ id: user.id }, changeData);
            return res.status(200).json({ Message: MESSAGES.USER.COMMON.EDIT_USER.SUCCESS });
        } catch (err) {
            next(err);
        }
    };

    //내 계정 삭제
    deleteAccount = async (req, res, next) => {
        try {
            const { password } = req.body;
            const userId = req.user.id;
            await this.UsersService.deleteUser({ id: userId }, password);
            return res.status(200).json({ Message: '성공적으로 삭제되었습니다!' });
        } catch (err) {
            next(err);
        }
    };
    chargePoint = async (req, res, next) => {
        try {
            const { chargeMoney } = req.body;
            const condition = { id: req.user.id };

            const account_point = await this.UsersService.chargePoint(condition, chargeMoney);
            return res.status(200).json({ account_point });
        } catch (err) {
            next(err);
        }
    };
}
