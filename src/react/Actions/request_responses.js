import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function requestResponsesSetInfo(
    requestResponses,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems
        ? "REQUEST_RESPONSES_SET_INFO"
        : "REQUEST_RESPONSES_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            requestResponses,
            account_id
        }
    };
}

export function requestResponsesUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 50,
        newer_id: false,
        older_id: false
    }
) {
    return dispatch => {
        dispatch(requestResponsesLoading());
        BunqJSClient.api.requestResponse
            .list(userId, accountId, options)
            .then(requestResponses => {
                dispatch(requestResponsesSetInfo(requestResponses, accountId, false, BunqJSClient));
                dispatch(requestResponsesNotLoading());
            })
            .catch(error => {
                dispatch(requestResponsesNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while loading your request responses"
                );
            });
    };
}

export function requestResponsesLoading() {
    return { type: "REQUEST_RESPONSES_IS_LOADING" };
}

export function requestResponsesNotLoading() {
    return { type: "REQUEST_RESPONSES_IS_NOT_LOADING" };
}

export function requestResponsesClear() {
    return { type: "REQUEST_RESPONSES_CLEAR" };
}
