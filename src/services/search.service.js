import { cuisineTypeMapping } from '../constants/search.constant.js';
export default class SearchService {
    constructor(searchRepository) {
        this.searchRepository = searchRepository;
    }
    findRestaurants = async (keyword) => {
        // 한식,일식 등 키워드를 포함하는경우
        const mappedCuisineType = cuisineTypeMapping[keyword];

        const searchResult = await this.searchRepository.findRestaurants(keyword, mappedCuisineType);

        return searchResult;
    };
}
