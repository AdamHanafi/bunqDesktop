import React from "react";
import PropTypes from "prop-types";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";

import AttachmentImage from "../AttachmentImage";
import {formatMoney} from "../../Helpers/Utils";

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

class AccountSelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { accounts, onChange, value, ...otherProps } = this.props;

        const selectId = otherProps.id ? otherProps.id : "account-selector";
        const style = otherProps.style ? otherProps.style : {};

        const accountItems = accounts.map((account, accountKey) => {
            const bankAccount = account.MonetaryAccountBank;
            const balance = bankAccount.balance.value;
            const description = bankAccount.description;

            return (
                <MenuItem value={accountKey}>
                    {description} - {balance}
                </MenuItem>
            );
        });

        let selectedAccountItem = null;
        if (value !== "" && accounts[value]) {
            const account = accounts[value].MonetaryAccountBank;
            if (account.status !== "ACTIVE") {
                return null;
            }
            const formattedBalance = formatMoney(
                account.balance ? account.balance.value : 0
            );
            selectedAccountItem = (
                <ListItem button>
                    <Avatar style={styles.bigAvatar}>
                        <AttachmentImage
                            width={50}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={
                                account.avatar.image[0].attachment_public_uuid
                            }
                        />
                    </Avatar>
                    <ListItemText
                        primary={account.description}
                        secondary={formattedBalance}
                    />
                </ListItem>
            );
        }

        return (
            <FormControl style={{ ...styles.formControl, ...style }}>
                <InputLabel htmlFor={selectId}>Account</InputLabel>
                <Select
                    required
                    value={value}
                    onChange={onChange}
                    input={<Input id={selectId} />}
                >
                    {accountItems}
                </Select>
                {selectedAccountItem}
            </FormControl>
        );
    }
}

AccountSelector.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};

AccountSelector.defaultProps = {
    style: styles.formControl,
    selectStyle: styles.selectField
};

export default AccountSelector;
