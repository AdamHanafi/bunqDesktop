import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import TranslateButton from "../TranslationHelpers/Button";

import ShowOnly from "./ShareInviteBankTypes/ShowOnly";
import FullAccess from "./ShareInviteBankTypes/FullAccess";
import ParentChild from "./ShareInviteBankTypes/ParentChild";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiry";

const styles = {
    smallAvatar: {
        width: 50,
        height: 50
    },
    buttons: {
        marginRight: 8
    }
};

class ShareInviteBankInquiryListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            open: false
        };
    }

    cancel = event => {
        const { t, BunqJSClient, user, shareInviteBankInquiry } = this.props;

        const success = t("The share request was successfully revoked");
        const failed = t("Failed to revoke the share request");

        if (!this.state.loading) {
            this.setState({ loading: true });

            BunqJSClient.api.shareInviteBankInquiry
                .putStatus(
                    user.id,
                    shareInviteBankInquiry.monetary_account_id,
                    shareInviteBankInquiry.id,
                    "REVOKED"
                )
                .then(response => {
                    // trigger an update
                    this.props.shareInviteBankInquiriesInfoUpdate(
                        user.id,
                        shareInviteBankInquiry.monetary_account_id
                    );

                    this.setState({ loading: false });
                    this.props.openSnackbar(success);
                })
                .catch(error => {
                    this.setState({ loading: false });
                    this.props.openSnackbar(failed);
                });
        }
    };

    render() {
        const { t, shareInviteBankInquiry } = this.props;

        if (
            !shareInviteBankInquiry ||
            !shareInviteBankInquiry.counter_user_alias
        ) {
            return null;
        }

        let imageUUID = false;
        if (shareInviteBankInquiry.counter_user_alias.avatar) {
            imageUUID =
                shareInviteBankInquiry.counter_user_alias.avatar.image[0]
                    .attachment_public_uuid;
        }
        const displayName =
            shareInviteBankInquiry.counter_user_alias.display_name;

        const connectActions = (
            <React.Fragment>
                <TranslateButton
                    style={styles.buttons}
                    variant="raised"
                    color="secondary"
                    onClick={this.cancel}
                    disabled={this.state.loading}
                >
                    Cancel
                </TranslateButton>
            </React.Fragment>
        );

        const shareDetailTypes = Object.keys(
            shareInviteBankInquiry.share_detail
        );
        const shareDetailType = shareDetailTypes[0];

        let shareTypeObject = null;
        switch (shareDetailType) {
            case "ShareDetailPayment":
                shareTypeObject = (
                    <FullAccess t={t} secondaryActions={connectActions} />
                );
                break;
            case "ShareDetailDraftPayment":
                shareTypeObject = (
                    <ParentChild t={t} secondaryActions={connectActions} />
                );
                break;
            case "ShareDetailReadOnly":
                shareTypeObject = (
                    <ShowOnly t={t} secondaryActions={connectActions} />
                );
                break;
        }

        return [
            <ListItem
                button
                onClick={e => this.setState({ open: !this.state.open })}
            >
                <Avatar style={styles.smallAvatar}>
                    <LazyAttachmentImage
                        width={50}
                        BunqJSClient={this.props.BunqJSClient}
                        imageUUID={imageUUID}
                    />
                </Avatar>
                <ListItemText
                    primary={displayName}
                    secondary={t("Connect invite sent")}
                />
                <ListItemSecondaryAction />
            </ListItem>,
            <Collapse in={this.state.open} unmountOnExit>
                {shareTypeObject}
            </Collapse>,
            <Divider />
        ];
    }
}

ShareInviteBankInquiryListItem.defaultProps = {
    displayAcceptedRequests: true,
    minimalDisplay: false
};

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsSelectedId: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        shareInviteBankInquiriesInfoUpdate: userId =>
            dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(ShareInviteBankInquiryListItem)
);
