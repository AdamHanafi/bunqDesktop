export const requestResponseText = (requestResponse, t) => {
    let requestType = t("Request");
    switch (requestResponse.type) {
        case "DIRECT_DEBIT":
        case "DIRECT_DEBIT_B2B":
            requestType = "direct debit";
            break;
        case "SOFORT":
            requestType = "SOFORT";
            break;
        case "IDEAL":
            requestType = "iDEAL";
            break;
        case "INTERNAL":
        default:
            break;
    }

    const ACCEPTED = `${requestType} ${t(`payment accepted`)}`;
    const PENDING = `${requestType} ${t(`payment is pending`)} `;
    const REJECTED = `${t(`You denied the`)} ${requestType} ${t(`payment`)}`;
    const REVOKED = `${t(`The`)} ${requestType} ${t(`payment was cancelled`)}`;
    const EXPIRED = `${t(`The`)} ${requestType} ${t(`payment has expired`)}`;
    switch (requestResponse.status) {
        case "ACCEPTED":
            return ACCEPTED;
        case "PENDING":
            return PENDING;
        case "REJECTED":
            return REJECTED;
        case "REVOKED":
            return REVOKED;
        case "EXPIRED":
            return EXPIRED;
        default:
            return requestResponse.status;
    }
};

// type	= DIRECT_DEBIT, DIRECT_DEBIT_B2B, IDEAL, SOFORT or INTERNAL.
// sub_type	= ONCE or RECURRING for DIRECT_DEBIT RequestInquiries and NONE

export const requestInquiryText = (requestInquiry, t) => {
    const ACCEPTED = t("Your request was accepted");
    const PENDING = t("Request sent and pending");
    const REJECTED = t("Your request was denied");
    const REVOKED = t("You cancelled the request");
    const EXPIRED = t("Request has expired");
    switch (requestInquiry.status) {
        case "ACCEPTED":
            return ACCEPTED;
        case "PENDING":
            return PENDING;
        case "REJECTED":
            return REJECTED;
        case "REVOKED":
            return REVOKED;
        case "EXPIRED":
            return EXPIRED;
        default:
            return requestInquiry.status;
    }
};

export const paymentText = (payment, t) => {
    const sentPaymentLabel = t("Sent payment with ");
    const receivedPaymentLabel = t("Received payment with ");
    const label =
        payment.amount.value < 0 ? sentPaymentLabel : receivedPaymentLabel;

    return `${label}${paymentTypeParser(payment.type, t)}`;
};

export const paymentTypeParser = (paymentType, t) => {
    switch (paymentType) {
        case "BUNQ":
            return "bunq";
        case "BUNQME":
            return "bunq.me";
        case "IDEAL":
            return "iDEAL";
        case "EBA_SCT":
            return "SEPA credit transfer";
        case "EBA_SDD":
            return "SEPA direct debit";
    }
    return paymentType;
};

export const masterCardActionText = (masterCardAction, t) => {
    switch (masterCardAction.authorisation_status) {
        case "AUTHORISED":
            return `${t("Sent payment with ")}${masterCardActionParser(
                masterCardAction,
                t
            )}`;
        case "BLOCKED":
            return `${t("The payment was blocked due to ")}${
                masterCardAction.decision_description
            }`;
        case "CLEARING_REFUND":
            return `${t("Payment was refunded due to ")}${
                masterCardAction.decision_description
            }`;
        case "REVERSED":
            return t("The payment was reversed");
        default:
            return `${t("The payment currently has the status ")}${
                masterCardAction.authorisation_status
            } - ${masterCardAction.authorisation_type}`;
    }
};

export const masterCardActionParser = (masterCardAction, t) => {
    const defaultMessage = t("Card payment");
    const paymentText = t("Payment");
    const refundText = t("Refund");

    let secondaryText = paymentText;
    if (masterCardAction.authorisation_status === "CLEARING_REFUND") {
        secondaryText = refundText;
    }

    if (masterCardAction.label_card) {
        if (masterCardAction.wallet_provider_id === "103") {
            return "Apple Pay " + secondaryText;
        }

        switch (masterCardAction.label_card.type) {
            case "MAESTRO_MOBILE_NFC":
                if (masterCardAction.wallet_provider_id === null) {
                    return defaultMessage;
                }
                return "Tap & Pay " + secondaryText;
            case "MASTERCARD":
                return "Mastercard " + secondaryText;
            case "MAESTRO":
                return "Maestro " + secondaryText;
        }
    }
    return defaultMessage;
};
