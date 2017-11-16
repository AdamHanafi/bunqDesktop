import React from "react";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";
import List, { ListItemSecondaryAction, ListSubheader } from "material-ui/List";

import BunqMeTabListItem from "./ListItems/BunqMeTabListItem";
import PaymentListItem from "./ListItems/PaymentListItem";
import MasterCardActionListItem from "./ListItems/MasterCardActionListItem";
import RequestResponseListItem from "./ListItems/RequestResponseListItem";
import RequestInquiryListItem from "./ListItems/RequestInquiryListItem";

import ClearBtn from "../Components/FilterComponents/ClearFilter";
import DisplayDrawerBtn from "../Components/FilterComponents/FilterDrawer";
import { openSnackbar } from "../Actions/snackbar";
import { bunqMeTabPut } from "../Actions/bunq_me_tab";

const styles = {
    list: {
        textAlign: "left"
    }
};

class CombinedList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    paymentMapper = () => {
        return this.props.payments.filter(this.paymentFilter).map(payment => {
            return {
                component: (
                    <PaymentListItem
                        payment={payment.Payment}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                ),
                filterDate: payment.Payment.updated,
                info: payment.Payment
            };
        });
    };

    paymentFilter = payment => {
        if (this.props.paymentVisibility === false) {
            return false;
        }
        const paymentInfo = payment.Payment;
        if (this.props.paymentType === "received") {
            if (paymentInfo.amount.value <= 0) {
                return false;
            }
        } else if (this.props.paymentType === "sent") {
            if (paymentInfo.amount.value >= 0) {
                return false;
            }
        }
        return true;
    };

    masterCardActionMapper = () => {
        return this.props.masterCardActions
            .filter(this.masterCardActionFilter)
            .map(masterCardAction => {
                return {
                    component: (
                        <MasterCardActionListItem
                            masterCardAction={masterCardAction.MasterCardAction}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: masterCardAction.MasterCardAction.updated,
                    info: masterCardAction.MasterCardAction
                };
            });
    };

    masterCardActionFilter = masterCardAction => {
        if (this.props.paymentVisibility === false) {
            return false;
        }
        if (this.props.paymentType === "received") {
            return false;
        }
        return true;
    };

    bunqMeTabsMapper = () => {
        return this.props.bunqMeTabs
            .filter(this.bunqMeTabsFilter)
            .map(bunqMeTab => {
                return {
                    component: (
                        <BunqMeTabListItem
                            bunqMeTab={bunqMeTab.BunqMeTab}
                            BunqJSClient={this.props.BunqJSClient}
                            copiedValue={this.copiedValue}
                            bunqMeTabLoading={this.props.bunqMeTabLoading}
                            bunqMeTabsLoading={this.props.bunqMeTabsLoading}
                            bunqMeTabPut={this.props.bunqMeTabPut}
                            user={this.props.user}
                        />
                    ),
                    filterDate: bunqMeTab.BunqMeTab.updated,
                    info: bunqMeTab.BunqMeTab
                };
            });
    };
    bunqMeTabsFilter = bunqMeTab => {
        if (this.props.bunqMeTabVisibility === false) {
            return false;
        }
        switch (this.props.bunqMeTabType) {
            case "active":
                if (bunqMeTab.BunqMeTab.status !== "WAITING_FOR_PAYMENT") {
                    console.log(bunqMeTab.BunqMeTab.status);
                    return false;
                }
            case "cancelled":
                if (bunqMeTab.BunqMeTab.status !== "CANCELLED") {
                    return false;
                }
            case "expired":
                if (bunqMeTab.BunqMeTab.status !== "EXPIRED") {
                    return false;
                }
            case "default":
            default:
                console.log(bunqMeTab.BunqMeTab.status);
                return true;
        }
        console.log(bunqMeTab.BunqMeTab.status);
        return true;
    };

    requestResponseMapper = () => {
        return this.props.requestResponses
            .filter(this.requestResponseFilter)
            .map(requestResponse => {
                return {
                    component: (
                        <RequestResponseListItem
                            requestResponse={requestResponse.RequestResponse}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestResponse.RequestResponse.updated,
                    info: requestResponse.RequestResponse
                };
            });
    };

    requestResponseFilter = requestResponse => {
        if (this.props.requestVisibility === false) {
            return false;
        }
        if (
            this.props.requestType !== "received" &&
            this.props.requestType !== "default"
        ) {
            return false;
        }
        return true;
    };

    requestInquiryFilter = () => {
        return this.props.requestInquiries
            .filter(this.requestInquiryFilter)
            .map(requestInquiry => {
                return {
                    component2: (
                        <RequestInquiryListItem
                            requestInquiry={requestInquiry.RequestInquiry}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    component: null,
                    filterDate: requestInquiry.RequestInquiry.updated,
                    info: requestInquiry.RequestInquiry
                };
            });
    };

    requestInquiryMapper = requestInquiry => {
        if (this.props.requestVisibility === false) {
            return false;
        }
        if (
            this.props.requestType !== "sent" &&
            this.props.requestType !== "default"
        ) {
            return false;
        }
        return true;
    };

    render() {
        let loadingContent =
            this.props.bunqMeTabsLoading ||
            this.props.paymentsLoading ||
            this.props.requestResponsesLoading ||
            this.props.requestInquiriesLoading ||
            this.props.masterCardActionsLoading ? (
                <LinearProgress />
            ) : (
                <Divider />
            );

        // create arrays of the different endpoint types
        const bunqMeTabs = this.bunqMeTabsMapper();
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();
        const requestResponses = this.requestResponseMapper();
        const requestInquiries = this.requestInquiryMapper();

        // combine the list and order by the prefered date for this item
        const combinedFilteredList = [
            ...bunqMeTabs,
            ...requestResponses,
            ...requestInquiries,
            ...payments,
            ...masterCardActions
        ].sort(function(a, b) {
            return new Date(b.filterDate) - new Date(a.filterDate);
        });

        // get only the component from the item
        const combinedComponentList = combinedFilteredList.map(
            item => item.component
        );

        return (
            <List style={styles.left}>
                <ListSubheader>
                    Payments and requests
                    <ListItemSecondaryAction>
                        <ClearBtn />
                        <DisplayDrawerBtn />
                    </ListItemSecondaryAction>
                </ListSubheader>
                {loadingContent}
                <List>{combinedComponentList}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsAccountId: state.accounts.selectedAccount,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        bunqMeTabLoading: state.bunq_me_tab.loading,

        requestInquiries: state.request_inquiries.request_inquiries,
        requestInquiriesLoading: state.request_inquiries.loading,

        requestResponses: state.request_responses.request_responses,
        requestResponsesLoading: state.request_responses.loading,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        bunqMeTabPut: (userId, accountId, tabId, status) =>
            dispatch(
                bunqMeTabPut(BunqJSClient, userId, accountId, tabId, status)
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CombinedList);
