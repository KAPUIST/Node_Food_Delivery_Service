export default class SearchRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    findRestaurants = async (keyword, mappedCuisineType) => {
        const searchConditions = [
            { name: { contains: keyword } },
            { city: { contains: keyword } },
            { address: { contains: keyword } },
            { menus: { some: { name: { contains: keyword } } } },
        ];

        /*매핑된 cuisineType이 있는 경우에만 조건을 추가합니다.
        이렇게 작성하는 이유는 enum 타입에는 contains 를 사용할수없고 equals로 비교해야 합니다,
        유저가 만약 "스시" 를 검색할시 equals 로 일치하는 값이 없을경우 에러를 돌려줍니다
        */
        if (mappedCuisineType) {
            searchConditions.push({ cuisineType: { equals: mappedCuisineType } });
        }
        return await this.prisma.restaurants.findMany({
            where: {
                OR: searchConditions,
            },
            select: {
                id: true,
                name: true,
                cuisineType: true,
            },
        });
    };
}
