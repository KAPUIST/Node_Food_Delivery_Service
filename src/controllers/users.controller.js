export class UsersController {
    constructor (UsersService) {
        this.UsersService=UsersService;
    }

    //내 계정 정보확인
    myInfo=async(req,res,next)=>{
        try {
            const userId=req.user.id;
            const user=await this.UsersService.myInfo({id:userId});


            // 해당 계정의 에러메세지가 존재하면 에러가 존재하는 것으로 판별
            if (user.errorMessage) {
                return res
                .status(user.errorMessage)
                .json({errorMessage:user.errorMessage});
            }

            return res.status(200).json(user);
        }
    
        catch(err) {
            next(err);
        }
        // return res.status(200).json({Message:"코드 검증 완료"});
    }

    //내 계정 정보 수정
    myInfoEdit=async (req,res,next)=> {
        try {
            const user=req.user;
            
            const changeData = req.body;
            const changedUser=await this.UsersService.myInfoEdit({id:user.id},changeData);
            
            if (changedUser.errorMessage) {
                return res.status(changedUser.status).
                    json({errorMessage:changedUser.errorMessage});
            }

            return res.status(200).json({Message:"성공적으로 정보가 수정되었습니다!"});
        }
        catch(err) {
            next(err);
        }
    }

    //내 계정 삭제
    deleteAccount=async(req,res,next)=>{
        try {
            const {password}=req.body;
            const userId=req.user.id;
            const result=await this.UsersService.deleteUser({id:userId},password);

            //사용자 입력에 문제 발생시
            if (result.errorMessage) {
                return res.status(result.status).json({errorMessage:result.errorMessage});
            }

            return res.status(200).json({Message:"성공적으로 삭제되었습니다!"});
        }
        catch (err) {
            next(err);
        }
    }
    chargePoint=async(req,res,next)=>{
        try {
            const {chargeMoney}=req.body;
            const condition={id:req.user.id};

            
            const account_point=await this.UsersService.chargePoint(condition,chargeMoney);

            if (account_point.errorMessage) {
                return res.status(account_point.status).json({errorMessage:account_point.errorMessage});
            }

            return res.status(200).json({account_point});
        }
        catch(err) {
            next(err);
        }
    }
    


}