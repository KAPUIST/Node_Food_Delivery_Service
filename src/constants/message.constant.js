export const MESSAGES = {
    AUTH: {
        ERROR: {
            ETC: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
            JOI_ERR_NAME: 'ValidationError',
        },
        COMMON: {
            EMAIL: {
                BASE: '이메일은 문자열입니다.',
                REQUIRED: '이메일을 입력해 주세요.',
                INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
                DUPLICATED_EMAIL: '이미 가입 된 사용자입니다.',
                DUPLICATED_NAME: '동일한 닉네임이 있습니다.',
            },
            PASSWORD: {
                BASE: '비밀번호는 문자열입니다.',
                REQUIRED: '비밀번호를 입력해 주세요.',
                MIN: '비밀번호는 6자리 이상입니다.',
                INCONSISTENT: '비밀번호가 일치하지 않습니다.',
            },
            PASSWORD_CONFIRM: {
                BASE: '비밀번호 확인은 문자입니다.',
                REQUIRED: '비밀번호 확인을 입력해 주세요.',
                MIN: '비밀번호는 6자리 이상입니다.',
                NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
            },
            ROLE: {
                BASE: '역할은 문자열입니다.',
                REQUIRED: '역할을 입력해 주세요.',
                INVALID_ROLE: '유효하지 않은 역할입니다.',
            },
            CITY: {
                BASE: '지역은 문자열입니다.',
                REQUIRED: '지역을 입력해 주세요.',
            },
            ADDRESS: {
                BASE: '주소는 문자열입니다.',
                REQUIRED: '주소를 입력해 주세요.',
            },
            NAME: {
                BASE: '닉네임은 문자열입니다.',
                REQUIRED: '닉네임을 입력해 주세요.',
                DUPLICATED: '닉네임이 이미 존재합니다.',
            },
            PHONE_NUMBER: {
                BASE: '전화번호는 문자열입니다.',
                REQUIRED: '전화번호를 입력해 주세요.',
            },
            POINT: {
                BASE: '포인트는 정수형입니다.',
                REQUIRED: '포인트를 입력해 주세요.',
            },
            VERIFICATION_CODE: {
                BASE: '이메일 인증 코드는 정수입니다.',
                REQUIRED: '이메일 인증 코드를 입력해 주세요.',
            },
            UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
            FORBIDDEN: '접근 권한이 없습니다.',
            JWT: {
                NO_TOKEN: '인증 정보가 없습니다.',
                NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
                EXPIRED: '인증 정보가 만료되었습니다.',
                NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
                INVALID: '인증 정보가 유효하지 않습니다.',
            },
        },
        SIGN_UP: {
            SUCCEED: '회원가입에 성공했습니다.',
            EMAIL: {
                DUPLICATED: '이메일이나 별명이 이미 존재합니다.',
            },
            VERIFICATION_CODE: {
                INCONSISTENT: '발송된 인증 코드와 다릅니다.',
                EXPIRED: '메일 인증코드가 만료되었습니다.',
                SUCCEED: '메일 인증이 완료되었습니다.',
            },
        },
        SIGN_IN: {
            SUCCEED: '로그인에 성공했습니다.',
        },
        SIGN_OUT: {
            SUCCEED: '로그아웃에 성공했습니다.',
        },
        MAIL: {
            SUCCEED: '메일 전송에 성공했습니다.',
            FAIL: '메일 전송에 실패했습니다.',
        },
        TOKEN: {
            SUCCEED: '토큰 재발급에 성공했습니다.',
        },
    },
    SEARCH: {
        COMMON: {
            KEYWORD: '검색 내용을 입력해 주세요.',
            BASE: '검색 내용은 문자열이어야 합니다.',
        },
    },
    MENU: {
        COMMON: {
            NOT_FOUND: '메뉴가 존재하지 않습니다.',
            MENU_NOT_FOUND_IN_RESTAURANT: '레스토랑 에서 메뉴를 가지고있지 않습니다.',
        },
        CREATED:{
            SUCCEED: '메뉴가 생성되었습니다'
        },
        UPDATE:{
            SUCCEED: '메뉴가 수정되었습니다'
        },
        DELETE: {
            SUCCEED: '메뉴가 삭제되었습니다' 
        }
        
    },
    POINTS: {
        COMMON: {
            NOT_ENOUGH_POINT: '포인트가 부족합니다.',
        },
    },
    ORDER: {
        COMMON: {
            ORDER_NOT_FOUND: '해당 주문이 존재 하지않습니다.',
            RESTAURANT_ID_IS_REQUIRED: '레스토랑 Id는 필수 요소입니다.',
            UNKNOWN_STATUS: '유효하지 않은 상태입니다.',
            ALREADY_COMPLETED: '이미 정산이 완료된 주문입니다.',

            ORDER_ITEMS: {
                BASE: 'orderItems는 배열 형태여야 합니다.',
                MIN: 'orderItems의 길이는 1이상이어야 합니다.',
                REQUIRED: 'orderItems를 입력해 주세요.',
            },
            RESTAURANT_ID: {
                BASE: 'restaurantId는 숫자입니다.',
                REQUIRED: 'restaurantId를 입력해 주세요.',
            },
            MENU_ID: {
                BASE: 'quantity는 정수형입니다.',
                REQUIRED: 'quantity를 입력해 주세요.',
            },
            QUANTITY: {
                BASE: 'menuId는 정수형입니다.',
                REQUIRED: 'menuId를 입력해 주세요.',
            },
            STATUS: {
                BASE: '주문 상태는 문자열입니다.',
                REQUIRED: '주문 상태를를 입력해 주세요.',
                INVALID_STATUS: '유효하지 않은 주문 상태입니다.',
            },
            ORDER_ID: {
                BASE: '주문 ID는 정수형입니다.',
                REQUIRED: '주문 ID를 입력해 주세요.',
            },
        },
    },
    RESTAURANTS: {
        NOT_ALLOW: '권한이 존재하지않습니다.',
    },
    REVIEW: {
        COMMON: {
            REQUIRED: '리뷰를 입력해 주세요.',
            NOT_FOUND: '리뷰가 존재하지 않습니다.',
        },

        RATING: {
            MAX: '평점은 최대 5점까지 입니다.',
            BASE: '평점은 숫자만 입력해주세요.',
            REQUIRED: '평점을 입력해 주세요.',
        },
        CREATE: {
            SUCCEED: '리뷰가 등록되었습니다,',
        },
        UPDATE:{
            SUCCEED: '리뷰가 수정되었습니다,',
        },
        DELETE:{
            SUCCEED: '리뷰가 삭제되었습니다.',
        },
}
}
