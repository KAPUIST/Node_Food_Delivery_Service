import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

export class OwnerService {
    constructor(UserRepository, RestaurantRepository) {
        this.UserRepository = UserRepository;
        this.RestaurantRepository = RestaurantRepository;
    }
    //업장 찾기
    findStore = async (condition) => {
        const store = await this.RestaurantRepository.findStore(condition);
        return store;
    };

    //업장 생성하기
    makeStore = async (storeData) => {
        const condition = { ownerId: storeData.ownerId };

        //이미 업장을 소유하고 있는 경우
        if (await this.RestaurantRepository.findStore(condition)) {
            throw new HttpError.Unauthorized(MESSAGES.OWNER.COMMON.CREATE_STORE.EXISTED);
        }

        //업장 정보를 입력하지 않은 경우
        if (!storeData.name) {
            throw new HttpError.Unauthorized(MESSAGES.OWNER.COMMON.CREATE_STORE.UN_WRITE);
        }

        const createdStore = await this.RestaurantRepository.makeStore(storeData);
        return createdStore;
    };

    //업장 조회하기
    checkStore = async (condition) => {
        const store = await this.RestaurantRepository.findStore(condition);

        //업장이 존재하지 않는 경우
        if (!store) {
            throw new HttpError.NotFound(MESSAGES.OWNER.COMMON.CHECK_STORE.NOT_EXISTED);
        }
        //출력되는 정보 삭제
        delete store.id;
        delete store.ownerId;
        delete store.flag;

        return store;
    };

    //업장 수정하기
    updateStore = async (condition, changeData) => {
        console.log(condition);
        const currentStore = await this.findStore(condition);

        if (!currentStore) {
            throw new HttpError.NotFound(MESSAGES.OWNER.COMMON.UPDATE_STORE.NOT_EXISTED);
        }

        //condition값에 id값도 추가
        condition.id = currentStore.id;

        const modifiedStore = await this.RestaurantRepository.modifyStore(condition, changeData);

        const store = modifiedStore;

        delete store.id;
        delete store.ownerId;
        delete store.flag;
        delete store.totalRevenue;
        return store;
    };

    //업장 삭제하기
    deleteStore = async (condition) => {
        const store = await this.RestaurantRepository.findStore(condition);

        console.log(condition);

        //업장이 존재하지 않는 경우에 대한 케이스
        if (!store) {
            throw new HttpError.NotFound(MESSAGES.OWNER.COMMON.DELETE_STORE.NOT_EXISTED);
        }
        condition.id = store.id;
        //업장이 혹여 여러 존재할 경우 제일 첫번째의 하나를 제거
        condition.id = store.id;
        const deletedStore = await this.RestaurantRepository.deleteStore(condition);

        return deletedStore;
    };

    //업장 복구하기
    restoreStore = async (condition, number) => {
        //에러타일
        if (await this.findStore(condition)) {
            throw new HttpError.Unauthorized(MESSAGES.OWNER.COMMON.RESTORE_STORE.EXISTED);
        }

        const not_ExistsStore = await this.RestaurantRepository.all_FindNoneExistStore(condition);

        condition.id = not_ExistsStore[number].id;
        const store = await this.RestaurantRepository.restoreStore(condition);

        delete store.id;
        delete store.ownerId;
        delete store.flag;

        return store;
    };
}
