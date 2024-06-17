export class UsersController {
    constructor (UsersService) {
        this.UsersService=UsersService;
    }

    myInfo=async(req,res,next)=>{
        try {
            const userId=req.user.userId;

            const user=await this.UsersService.myInfo(userId);

            //해당 계정의 에러메세지가 존재하면 에러가 존재하는 것으로 판별
            if (user.errorMessage) {
                return res
                .status(user.errorMessage)
                .json({errorMessage:user.errorMessage});
            }

            return res.status(200).json({Message:user});
        }
        catch(err) {
            next(err);
        }
    }

}