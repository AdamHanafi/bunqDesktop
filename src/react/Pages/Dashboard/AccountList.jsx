import React from "react";
import { connect } from "react-redux";
import { LinearProgress } from "material-ui/Progress";
import Divider from "material-ui/Divider";
import List, { ListSubheader } from "material-ui/List";

import AccountListItem from "./AccountListItem";

import { accountsSelectAccount, accountsUpdate } from "../../Actions/accounts";
import { paymentsUpdate } from "../../Actions/payments";

class AccountList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        this.checkUpdateRequirement();
    }

    componentWillUpdate(nextprops) {
        this.checkUpdateRequirement(nextprops);
    }

    checkUpdateRequirement = (props = this.props) => {
        const {
            accountsAccountId,
            paymentsAccountId,
            paymentsLoading,
            initialBunqConnect,
            accounts,
            user
        } = props;

        if (initialBunqConnect) {
            // check if the stored selected account isn't already loaded
            if (
                accountsAccountId !== false &&
                accountsAccountId !== paymentsAccountId &&
                paymentsLoading === false
            ) {
                this.props.paymentsUpdate(user.id, accountsAccountId);
            }

            // check if both account and payment have nothing selected
            if (
                accountsAccountId === false &&
                paymentsAccountId === false &&
                paymentsLoading === false
            ) {
                // both are false, just load the first item from the accounts
                if (accounts.length > 0) {
                    const accountId = accounts[0].MonetaryAccountBank.id;

                    // select this account for next time
                    this.props.selectAccount(accountId);
                    // fetch payments for the account
                    this.props.paymentsUpdate(user.id, accountId);
                }
            }
        }

        // no accounts loaded
        if (accounts.length === 0) {
            props.accountsUpdate(user.id);
        }
    };

    render() {
        let accounts = [];
        let loadingContent = this.props.accountsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        if (this.props.accounts !== false) {
            accounts = this.props.accounts.map(account => (
                <AccountListItem
                    BunqJSClient={this.props.BunqJSClient}
                    account={account.MonetaryAccountBank}
                />
            ));
        }

        return (
            <List>
                <ListSubheader>Accounts - {accounts.length}</ListSubheader>
                {loadingContent}
                <List>{accounts}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts,

        // selected accounts and loading state
        paymentsLoading: state.payments.loading,
        paymentsAccountId: state.payments.account_id,
        accountsAccountId: state.accounts.selectedAccount,
        // accounts are loading
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        paymentsUpdate: (userId, accountId) =>
            dispatch(paymentsUpdate(BunqJSClient, userId, accountId)),
        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),
        selectAccount: acountId => dispatch(accountsSelectAccount(acountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
