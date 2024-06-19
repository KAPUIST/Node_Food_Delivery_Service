export class OwnerService {
    constructor (UserRepository,RestaurantRepository) {
        this.UserRepository=UserRepository;
        this.RestaurantRepository=RestaurantRepository;
    }
    //업장 찾기
    findStore=async (condition) => {
        const store=await this.RestaurantRepository.findStore(condition);
        return store;
    }

    //업장 생성하기
    makeStore=async(storeData) =>{
        const condition={ownerId:storeData.ownerId};

        //이미 업장을 소유하고 있는 경우
        if (await this.RestaurantRepository.findStore(condition)){
            const error={status:401,errorMessage:`이미 업장을 소유하고 있습니다!
                업장 폐쇄 후 다시 등록해주시기 바랍니다.`};
            return error;
        }

        //업장 정보를 입력하지 않은 경우
        if (!storeData.name) {
            const error={status:401,errorMessage:"업장 정보를 작성해주세요!"};
            return error;
        }
        //기본적으로 받는 금액 1000000원
        storeData.totalRevenue=1000000;

        const createdStore=await this.RestaurantRepository.makeStore(storeData);
        return createdStore;
    }

    //업장 조회하기
    checkStore=async (condition) => {
        const store=await this.RestaurantRepository.findStore(condition);

        //업장이 존재하지 않는 경우
        if (!store) {
            const error={status:404,errorMessage:"업장이 존재하지 않습니다!"};
            return error;
        }

        return store;
    }

    //업장 수정하기
    updateStore=async(condition,changeData)=> {
        console.log(condition);
        const store=await this.findStore(condition);

        if (!store) {
            const error={status:404,errorMessage:"해당 업장이 존재하지 않습니다!"};
            return error;
        }

        //condition값에 id값도 추가
        condition.id=store.id;

        const modifiedStore=await this.RestaurantRepository.modifyStore(condition,changeData);
        
        const result=modifiedStore;

        return result;
    }

    //업장 삭제하기
    deleteStore=async(condition)=> {

        const store=await this.RestaurantRepository.findStore(condition);
        
        

        console.log(condition);

        //업장이 존재하지 않는 경우에 대한 케이스
        if (!store) {
            const error={status:404,errorMessage:"업장이 존재하지 않습니다!"};
            return error;
        }

        condition.id=store.id;

        //업장이 혹여 여러 존재할 경우 제일 첫번째의 하나를 제거
        condition.id=store.id;
        const deletedStore=await this.RestaurantRepository.deleteStore(condition);
        
        return deletedStore;
    }

    restoreStore=async(condition,number)=> {

        //에러타일
        if (await this.findStore(condition)) {
            const error= {status:403,errorMessage:"이미 업장이 존재합니다"};
            return error;
        }

        const not_ExistsStore=await this.RestaurantRepository.all_FindNoneExistStore(condition);
        
        condition.id=not_ExistsStore[number].id;
        const restoreStore=await this.RestaurantRepository.restoreStore(condition);

        
        return restoreStore;
    }

}