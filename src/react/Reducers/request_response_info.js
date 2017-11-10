export const defaultState = {
    request_response_info: false,
    account_id: false,
    request_response_id: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REQUEST_RESPONSE_INFO_SET_INFO":
            return {
                ...state,
                request_response_info: action.payload.request_response_info,
                account_id: action.payload.account_id,
                request_response_id: action.payload.request_response_id
            };

        case "REQUEST_RESPONSE_INFO_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "REQUEST_RESPONSE_INFO_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REQUEST_RESPONSE_INFO_CLEAR":
        case "REGISTRATION_CLEAR_API_KEY":
        case "REGISTRATION_CLEAR_USER_INFO":
            return {
                request_response_info: false,
                account_id: 0,
                request_response_id: 0,
                loading: false
            };
    }
    return state;
};
