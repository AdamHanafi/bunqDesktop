import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function requestResponseSetInfo(
    request_response_info,
    account_id,
    request_response_id
) {
    return {
        type: "REQUEST_RESPONSE_INFO_SET_INFO",
        payload: {
            request_response_info: request_response_info,
            request_response_id: request_response_id,
            account_id: account_id
        }
    };
}

export function requestResponseUpdate(
    BunqJSClient,
    user_id,
    account_id,
    request_response_id
) {
    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .get(user_id, account_id, request_response_id)
            .then(requestResponseInfo => {
                dispatch(
                    requestResponseSetInfo(
                        requestResponseInfo,
                        account_id,
                        request_response_id
                    )
                );
                dispatch(requestResponseNotLoading());
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load the request information"
                );
            });
    };
}

export function requestResponseLoading() {
    return { type: "REQUEST_RESPONSE_INFO_IS_LOADING" };
}

export function requestResponseNotLoading() {
    return { type: "REQUEST_RESPONSE_INFO_IS_NOT_LOADING" };
}

export function requestResponseClear() {
    return { type: "REQUEST_RESPONSE_INFO_CLEAR" };
}
