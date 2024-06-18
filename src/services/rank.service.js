export default class RankService {
    constructor(restaurantsRepository) {
        this.restaurantsRepository = restaurantsRepository;
    }

    getHighestRevenueRestaurants = async () => {
        try {
            // RestaurantsRepository에서 가장 매출이 높은 레스토랑을 가져오는 메서드 호출
            const highestRevenueRestaurants = await this.restaurantsRepository.findHeighRevenueRestaurant();
            return highestRevenueRestaurants;
        } catch (error) {
            next(error);
        }
    };
}
