import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { formatMoney } from "../../Helpers/Utils";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";

const styles = {
    formControl: {
        width: "100%"
    },
    selectField: {
        width: "100%"
    },
    bigAvatar: {
        width: 50,
        height: 50
    }
};

const AccountItem = ({ account, onClick, BunqJSClient, hideBalance }) => {
    const formattedBalance = formatMoney(
        account.balance ? account.balance.value : 0,
        true
    );
    return (
        <ListItem button onClick={onClick}>
            <Avatar style={styles.bigAvatar}>
                <LazyAttachmentImage
                    width={50}
                    BunqJSClient={BunqJSClient}
                    imageUUID={account.avatar.image[0].attachment_public_uuid}
                />
            </Avatar>
            <ListItemText
                primary={account.description}
                secondary={hideBalance ? "" : formattedBalance}
            />
        </ListItem>
    );
};

class AccountSelectorDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    // Handles click events for account items
    onClickHandler = id => {
        return event => {
            this.setState({ open: false });
            this.props.onChange(id);
        };
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    openDialog = () => {
        this.setState({ open: true });
    };

    render() {
        const { BunqJSClient, accounts, value, t, ...otherProps } = this.props;
        const style = otherProps.style ? otherProps.style : {};

        const accountItems = accounts.map((account, accountKey) => {
            if (account.status !== "ACTIVE") {
                return null;
            }
            return (
                <AccountItem
                    account={account}
                    onClick={this.onClickHandler(accountKey)}
                    hideBalance={this.props.hideBalance}
                    BunqJSClient={BunqJSClient}
                />
            );
        });

        let selectedAccountItem = null;
        if (value !== "" && accounts[value]) {
            selectedAccountItem = (
                <AccountItem
                    account={accounts[value]}
                    onClick={this.openDialog}
                    BunqJSClient={BunqJSClient}
                    hideBalance={this.props.hideBalance}
                />
            );
        } else {
            selectedAccountItem = (
                <ListItem button onClick={this.displaySelectDialog}>
                    <ListItemText primary={t("Select an account")} />
                </ListItem>
            );
        }

        return (
            <FormControl style={{ ...styles.formControl, ...style }}>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleRequestClose}
                >
                    <DialogTitle>{t("Select an account")}</DialogTitle>
                    <DialogContent>
                        <List>{accountItems}</List>
                    </DialogContent>
                </Dialog>
                {selectedAccountItem}
            </FormControl>
        );
    }
}

AccountSelectorDialog.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};

AccountSelectorDialog.defaultProps = {
    style: styles.formControl,
    selectStyle: styles.selectField
};

const mapStateToProps = store => {
    return {
        hideBalance: store.options.hide_balance
    };
};

export default connect(mapStateToProps)(
    translate("translations")(AccountSelectorDialog)
);
