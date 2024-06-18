export default class RankController {
    constructor(rankService) {
        this.rankService = rankService;
    }
    getHighestRevenueRestaurants = async (req, res, next) => {
        try {
            const highestRevenueRestaurants = await this.rankService.getHighestRevenueRestaurants();

            // 성공적으로 데이터를 가져온 경우, 클라이언트에 JSON 응답으로 반환
            if (highestRevenueRestaurants.length < 1) {
                res.status(200).json({
                    message: '텅..',
                    result: [],
                });
            }
            res.status(200).json({
                result: highestRevenueRestaurants,
            });
        } catch (error) {
            // 에러가 발생하면 next를 사용하여 에러 핸들러로 전달
            next(error);
        }
    };
}
