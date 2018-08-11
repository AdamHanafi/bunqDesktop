import React from "react";
import { connect } from "react-redux";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import AddIcon from "@material-ui/icons/Add";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import AccountListItemChip from "../AccountList/AccountListItemChip";

import {
    addAccountIdFilter,
    removeAccountIdFilter
} from "../../Actions/filters";

const styles = {
    listItem: {
        display: "flex",
        flexWrap: "wrap",
        padding: "0 0 0 8px"
    },
    subheaderTitle: {
        height: 40
    }
};

class AccountSelection extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            anchorEl: null
        };
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = event => {
        this.setState({ anchorEl: null });
    };

    addAccountId = accountId => event => {
        this.props.addAccountIdFilter(accountId);
    };
    removeAccountId = index => event => {
        this.props.removeAccountIdFilter(index);
    };

    render() {
        const { anchorEl } = this.state;
        const { accounts, selectedAccountIds } = this.props;

        // limit size if a lot of accounts are selected
        const bigChips = selectedAccountIds.length <= 6;

        const selectedAccountChipItems = selectedAccountIds.map(
            (accountId, key) => {
                const account = accounts.find(
                    account => account.id === accountId
                );

                // ensure account exists
                if (!account) return null;

                // display big chip or smaller icon
                return bigChips ? (
                    <AccountListItemChip
                        key={key}
                        account={account}
                        onDelete={this.removeAccountId(account.id)}
                    />
                ) : (
                    <IconButton>btn icon</IconButton>
                );
            }
        );

        const accountMenuItems = Object.keys(accounts)
            .filter(accountIndex => {
                const account = accounts[accountIndex];
                if (account && account.status !== "ACTIVE") {
                    return false;
                }
                return true;
            })
            .map((accountIndex, key) => {
                const account = accounts[accountIndex];

                // don't display already selected items
                if (selectedAccountIds.includes(account.id)) {
                    return null;
                }

                return (
                    <MenuItem key={key} onClick={this.addAccountId(account.id)}>
                        <ListItemIcon>
                            <Avatar style={styles.bigAvatar}>
                                <LazyAttachmentImage
                                    width={40}
                                    BunqJSClient={this.props.BunqJSClient}
                                    imageUUID={
                                        account.avatar.image[0]
                                            .attachment_public_uuid
                                    }
                                />
                            </Avatar>
                        </ListItemIcon>
                        {account.description}
                    </MenuItem>
                );
            });

        return (
            <React.Fragment>
                <ListSubheader style={styles.subheaderTitle}>
                    {t("Account filter")}

                    <ListItemSecondaryAction>
                        <IconButton
                            aria-haspopup="true"
                            onClick={this.handleClick}
                        >
                            <AddIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    <Menu
                        anchorEl={this.state.anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={this.handleClose}
                    >
                        {accountMenuItems}
                    </Menu>
                </ListSubheader>
                <ListItem style={styles.listItem}>
                    {selectedAccountChipItems}
                </ListItem>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        selectedAccountIds: state.account_id_filter.selected_account_ids
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addAccountIdFilter: accountId =>
            dispatch(addAccountIdFilter(accountId)),
        removeAccountIdFilter: index => dispatch(removeAccountIdFilter(index))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelection);
