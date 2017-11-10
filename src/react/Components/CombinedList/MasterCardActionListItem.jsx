import React from "react";
import { withTheme } from "material-ui/styles";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import PaymentIcon from "material-ui-icons/Payment";

import { formatMoney, humanReadableDate } from "../../Helpers/Utils";
import NavLink from "../../Components/Routing/NavLink";
import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class MasterCardActionListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            id: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.masterCardAction.id !== this.props.masterCardAction.id;
    }

    render() {
        const { masterCardAction, theme } = this.props;

        let imageUUID = false;
        if (masterCardAction.counterparty_alias.avatar) {
            imageUUID =
                masterCardAction.counterparty_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName = masterCardAction.counterparty_alias.display_name;
        const paymentAmount = masterCardAction.amount_billing.value;
        const formattedPaymentAmount = formatMoney(paymentAmount);

        return [
            <ListItem button>
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText primary={displayName} secondary={"Mastercard payment"} />
                <ListItemSecondaryAction>
                    <p
                        style={{
                            marginRight: 20,
                            color: theme.palette.common.sentPayment
                        }}
                    >
                        {formattedPaymentAmount}
                    </p>
                </ListItemSecondaryAction>
            </ListItem>,
            <Divider />
        ];
    }
}

export default withTheme()(MasterCardActionListItem);
