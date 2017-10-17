import React from "react";
import { connect } from "react-redux";
import List, {
    ListItem,
    ListItemSecondaryAction,
    ListSubheader
} from "material-ui/List";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";

import PaymentListItem from "./PaymentListItem";
import ClearBtn from "../../Components/FilterComponents/ClearFilter";
import DisplayDrawerBtn from "../../Components/FilterComponents/FilterDrawer";

class PaymentList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    paymentFilter = payment => {
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

    render() {
        let payments = [];
        let loadingContent = this.props.paymentsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        if (this.props.payments !== false) {
            payments = this.props.payments
                .filter(this.paymentFilter)
                .map(payment => (
                    <PaymentListItem
                        payment={payment.Payment}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                ));
        }

        return (
            <List>
                <ListSubheader>
                    Payments - {payments.length}
                    <ListItemSecondaryAction>
                        <ClearBtn />
                        <DisplayDrawerBtn />
                    </ListItemSecondaryAction>
                </ListSubheader>
                {loadingContent}
                <List>{payments}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type,
        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentList);
