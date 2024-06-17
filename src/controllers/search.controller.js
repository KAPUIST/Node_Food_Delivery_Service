import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
export default class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }

    searchRestaurants = async (req, res, next) => {
        try {
            const { keyword } = req.query;
            if (!keyword) {
                throw new HttpError.BadRequest(MESSAGES.SEARCH.COMMON.KEYWORD);
            }
            const searchResult = await this.searchService.findRestaurants(keyword);
            res.status(HTTP_STATUS.OK).json({
                result: searchResult,
            });
        } catch (error) {
            next(error);
        }
    };
}
