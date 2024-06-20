export class OwnerController {
    constructor(OwnerService) {
        this.OwnerService = OwnerService;
    }

    generateStore = async (req, res, next) => {
        try {
            const storeData = req.body;
            storeData.ownerId = req.user.id;

            const createdStore = await this.OwnerService.makeStore(storeData);

            //에러 발생 시
            if (createdStore.errorMessage) {
                return res.status(createdStore.status).json({ errorMessage: createdStore.errorMessage });
            }
            return res.status(200).json({ Message: '성공적으로 식당이 생성 되었습니다!' });
        } catch (err) {
            next(err);
        }
    };
    //내 업장 조회하기
    checkStore = async (req, res, next) => {
        const condition = { ownerId: req.user.id };

        const store = await this.OwnerService.checkStore(condition);
        return res.status(200).json({ store });
    };

    //내 업장 수정하기
    updateStore = async (req, res, next) => {
        const condition = { ownerId: req.user.id };
        const changeData = req.body;

        const updatedStore = await this.OwnerService.updateStore(condition, changeData);

        //사용자 입력에 에러
        if (updatedStore.errorMessage) {
            return res.status(updatedStore.status).json({ errorMessage: updatedStore.errorMessage });
        }

        return res.status(200).json({ updatedStore });
    };

    //내 업장 삭제하기
    deleteStore = async (req, res, next) => {
        const condition = { ownerId: req.user.id };
        const deletedStore = await this.OwnerService.deleteStore(condition);

        if (deletedStore.errorMessage) {
            return res.status(deletedStore.status).json({ Message: deletedStore.errorMessage });
        }

        return res.status(200).json({ Message: '성공적으로 폐업 완료' });
    };
    restoreStore = async (req, res, next) => {
        const user = req.user;
        const { number } = req.body;
        const condition = { ownerId: req.user.id };

        //인덱스 값으로 전환하여 number는 -1로 서비스 계층에 넘긴다.
        const restoreStore = await this.OwnerService.restoreStore(condition, number - 1);

        //에러타일
        if (restoreStore.errorMessage) {
            return res.status(restoreStore.status).json({ Message: restoreStore.errorMessage });
        }

        return res.status(201).json({ restoreStore });
    };
}
