import { MESSAGES } from '../constants/message.constant.js';

export class OwnerController {
    constructor(OwnerService) {
        this.OwnerService = OwnerService;
    }

    generateStore = async (req, res, next) => {
        try {
            const storeData = req.body;
            storeData.ownerId = req.user.id;
            await this.OwnerService.makeStore(storeData);
            return res.status(200).json({ Message: MESSAGES.OWNER.COMMON.CREATE_STORE.SUCCESS });
        } catch (err) {
            next(err);
        }
    };
    //내 업장 조회하기
    checkStore = async (req, res, next) => {
        try {
            const condition = { ownerId: req.user.id };
            const store = await this.OwnerService.checkStore(condition);
            return res.status(200).json({ store });
        } catch (err) {
            next(err);
        }
    };
    //내 업장 수정하기
    updateStore = async (req, res, next) => {
        try {
            const condition = { ownerId: req.user.id };
            const changeData = req.body;
            const updatedStore = await this.OwnerService.updateStore(condition, changeData);
            return res.status(200).json({ updatedStore });
        } catch (err) {
            next(err);
        }
    };
    //내 업장 삭제하기
    deleteStore = async (req, res, next) => {
        try {
            const condition = { ownerId: req.user.id };
            await this.OwnerService.deleteStore(condition);
            return res.status(200).json({ Message: MESSAGES.OWNER.COMMON.DELETE_STORE.SUCCESS });
        } catch (err) {
            next(err);
        }
    };
    restoreStore = async (req, res, next) => {
        try {
            const { number } = req.body;
            const condition = { ownerId: req.user.id };
            //인덱스 값으로 전환하여 number는 -1로 서비스 계층에 넘긴다.
            const restoreStore = await this.OwnerService.restoreStore(condition, number - 1);
            return res.status(201).json({ restoreStore });
        } catch (err) {
            next(err);
        }
    };
}
