import React from "react";
import { connect } from "react-redux";
import { withTheme } from "material-ui/styles";
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
import LazyAttachmentImage from "../Components/AttachmentImage/LazyAttachmentImage";
import TransactionHeader from "../Components/TransactionHeader";

import { masterCardActionInfoUpdate } from "../Actions/master_card_action_info";

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

class MasterCardActionInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    // componentDidMount() {
    //     if (this.props.initialBunqConnect) {
    //         const { requestResponseId, accountId } = this.props.match.params;
    //         this.props.requestResponseUpdate(
    //             this.props.user.id,
    //             accountId === undefined
    //                 ? this.props.accountsSelectedAccount
    //                 : accountId,
    //             requestResponseId
    //         );
    //     }
    // }

    // componentWillUpdate(nextProps, nextState) {
    //     if (
    //         this.props.initialBunqConnect &&
    //         this.props.match.params.requestResponseId !==
    //             nextProps.match.params.requestResponseId
    //     ) {
    //         const { requestResponseId, accountId } = nextProps.match.params;
    //         this.props.requestResponseUpdate(
    //             nextProps.user.id,
    //             accountId === undefined
    //                 ? nextProps.accountsSelectedAccount
    //                 : accountId,
    //             requestResponseId
    //         );
    //     }
    // }

    render() {
        return "Not implemented";
        const {
            accountsSelectedAccount,
            requestResponseInfo,
            requestResponseLoading,
            theme
        } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (requestResponseInfo === false || requestResponseLoading === true) {
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
            const requestResponse = requestResponseInfo.RequestResponse;
            // const paymentType = payment.type;
            const paymentDate = humanReadableDate(requestResponse.created);
            const paymentAmount = requestResponse.amount_inquired.value;
            const paymentColor =
                paymentAmount < 0
                    ? theme.palette.common.sentPayment
                    : theme.palette.common.receivedPayment;

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={requestResponse.counterparty_alias}
                        from={requestResponse.alias}
                        swap={paymentAmount > 0}
                    />

                    <Grid item xs={12}>
                        <h1
                            style={{
                                textAlign: "center",
                                color: paymentColor
                            }}
                        >
                            {formatMoney(paymentAmount)}
                        </h1>
                        <List style={styles.list}>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Description"}
                                    secondary={requestResponse.description}
                                />
                            </ListItem>
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
                                        requestResponse.counterparty_alias.iban
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
                    <title>{`BunqDesktop - Mastercard Info`}</title>
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
        requestResponseInfo: state.request_response_info.request_response_info,
        requestResponseLoading: state.request_response_info.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        masterCardActionInfoUpdate: (
            user_id,
            account_id,
            request_response_id
        ) =>
            dispatch(
                masterCardActionInfoUpdate(
                    BunqJSClient,
                    user_id,
                    account_id,
                    request_response_id
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(MasterCardActionInfo)
);
