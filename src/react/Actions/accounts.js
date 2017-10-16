const Logger = require("../Helpers/Logger");

export function accountsSetInfo(accounts) {
    return {
        type: "ACCOUNTS_SET_INFO",
        payload: {
            accounts: accounts
        }
    };
}

export function accountsUpdate(BunqJSClient, userId) {
    return dispatch => {
        dispatch(accountsLoading());
        BunqJSClient.api.monetaryAccount
            .list(userId)
            .then(accounts => {
                dispatch(accountsSetInfo(accounts));
                dispatch(accountsNotLoading());
            })
            .catch(err => {
                Logger.trace(err);
                dispatch(accountsNotLoading());
            });
    };
}

export function accountsLoading() {
    return { type: "ACCOUNTS_IS_LOADING" };
}

export function accountsSelectAccount(account_id) {
    return {
        type: "ACCOUNTS_SELECT_ACCOUNT",
        payload: {
            selectedAccount: account_id
        }
    };
}

export function accountsNotLoading() {
    return { type: "ACCOUNTS_IS_NOT_LOADING" };
}

export function accountsClear() {
    return { type: "ACCOUNTS_CLEAR" };
}
