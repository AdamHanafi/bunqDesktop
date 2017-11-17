import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import ArrowForwardIcon from "material-ui-icons/ArrowForward";
import ArrowUpIcon from "material-ui-icons/ArrowUpward";
import ArrowDownIcon from "material-ui-icons/ArrowDownward";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Typography from "material-ui/Typography";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import { requestInquiryText } from "../Helpers/StatusTexts";
import LazyAttachmentImage from "../Components/AttachmentImage/LazyAttachmentImage";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";

import { requestInquiryUpdate } from "../Actions/request_inquiry_info";

const styles = {
    btn: {},
    paper: {
        padding: 24
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class RequestInquiryInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            const { requestInquiryId, accountId } = this.props.match.params;
            this.props.requestInquiryUpdate(
                this.props.user.id,
                accountId === undefined
                    ? this.props.accountsSelectedAccount
                    : accountId,
                requestInquiryId
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            this.props.initialBunqConnect &&
            this.props.match.params.requestInquiryId !==
                nextProps.match.params.requestInquiryId
        ) {
            const { requestInquiryId, accountId } = nextProps.match.params;
            this.props.requestInquiryUpdate(
                nextProps.user.id,
                accountId === undefined
                    ? nextProps.accountsSelectedAccount
                    : accountId,
                requestInquiryId
            );
        }
    }

    render() {
        const {
            accountsSelectedAccount,
            requestInquiryInfo,
            requestInquiryLoading
        } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (requestInquiryInfo === false || requestInquiryLoading === true) {
            content = (
                <Grid container spacing={24} justify={"center"}>
                    <Grid item xs={12}>
                        <div style={{ textAlign: "center" }}>
                            <CircularProgress />
                        </div>
                    </Grid>
                </Grid>
            );
        } else {
            const requestInquiry = requestInquiryInfo.RequestInquiry;
            const paymentDate = humanReadableDate(requestInquiry.created);
            const paymentAmount = requestInquiry.amount_inquired.value;
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const requestInquiryLabel = requestInquiryText(requestInquiry);

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <Grid item xs={12} md={5} style={styles.textCenter}>
                        <LazyAttachmentImage
                            width={90}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={
                                requestInquiry.user_alias_created.avatar.image[0]
                                    .attachment_public_uuid
                            }
                        />
                        <Typography type="subheading">
                            {requestInquiry.user_alias_created.display_name}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        md={2}
                        hidden={{ smDown: true }}
                        style={styles.textCenter}
                    >
                        {paymentAmount < 0 ? (
                            <ArrowForwardIcon />
                        ) : (
                            <ArrowBackIcon />
                        )}
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        hidden={{ mdUp: true }}
                        style={styles.textCenter}
                    >
                        {paymentAmount < 0 ? (
                            <ArrowDownIcon />
                        ) : (
                            <ArrowUpIcon />
                        )}
                    </Grid>

                    <Grid item xs={12} md={5} style={styles.textCenter}>
                        <LazyAttachmentImage
                            width={90}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={
                                requestInquiry.counterparty_alias.avatar
                                    .image[0].attachment_public_uuid
                            }
                        />

                        <Typography type="subheading">
                            {requestInquiry.counterparty_alias.display_name}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <MoneyAmountLabel
                            component={"h1"}
                            style={{ textAlign: "center" }}
                            info={requestInquiry}
                            type="requestInquiry"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>

                        <Typography
                            style={{ textAlign: "center" }}
                            type={"body1"}
                        >
                            {requestInquiryLabel}
                        </Typography>

                        <List style={styles.list}>
                            {requestInquiry.description.length > 0 ? (
                                [
                                    <Divider />,
                                    <ListItem>
                                        <ListItemText
                                            primary={"Description"}
                                            secondary={
                                                requestInquiry.description
                                            }
                                        />
                                    </ListItem>
                                ]
                            ) : null}

                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Date"}
                                    secondary={paymentDate}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"IBAN"}
                                    secondary={
                                        requestInquiry.counterparty_alias.iban
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </List>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Request Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>{content}</Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        requestInquiryInfo: state.request_inquiry_info.request_inquiry_info,
        requestInquiryLoading: state.request_inquiry_info.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        requestInquiryUpdate: (user_id, account_id, request_inquiry_id) =>
            dispatch(
                requestInquiryUpdate(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_inquiry_id
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestInquiryInfo);
