import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export const STORED_ACCOUNTS = "BUNQDESKTOP_STORED_ACCOUNTS";

export function accountsSetInfo(accounts, BunqJSClient = false) {
    return {
        type: "ACCOUNTS_SET_INFO",
        payload: {
            accounts: accounts,
            BunqJSClient
        }
    };
}

export function loadStoredAccounts(BunqJSClient) {
    return dispatch => {
        BunqJSClient.Session
            .loadEncryptedData(STORED_ACCOUNTS)
            .then(data => {
                console.log(data);
                if (data && data.items) {
                    dispatch(accountsSetInfo(data.items, BunqJSClient));
                }
            })
            .catch(error => {});
    };
}

export function accountsUpdate(BunqJSClient, userId) {
    return dispatch => {
        dispatch(accountsLoading());
        BunqJSClient.api.monetaryAccount
            .list(userId)
            .then(accounts => {
                dispatch(accountsSetInfo(accounts, BunqJSClient));
                dispatch(accountsNotLoading());
            })
            .catch(error => {
                dispatch(accountsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We failed to load your monetary accounts"
                );
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
