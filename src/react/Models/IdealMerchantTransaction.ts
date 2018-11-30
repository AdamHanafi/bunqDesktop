import Payment from "./Payment";
import EventType, { EventTypeValue } from "../Types/Event";

export default class IdealMerchantTransaction implements EventType {
    // the original raw object
    private _rawData: any;

    public IdealMerchantTransaction = this;
    get eventType(): EventTypeValue {
        return "IdealMerchantTransaction";
    }

    private _id: number;
    private _created: Date;
    private _label_schedule_user_canceled: any;
    private _label_schedule_user_created: any;
    private _monetary_account_id: number;
    private _payment: Payment;
    private _schedule: any;
    private _status: string;
    private _updated: Date;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.IdealMerchantTransaction;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
        });

        this._payment = new Payment({ Payment: this._payment });
        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
    }

    /**
     * Used to store this object in JSON
     * @returns {string}
     */
    public toJSON(): any {
        return this._rawData;
    }

    /**
     * @returns {number}
     */
    public getAmount(): number {
        if (this.payment) {
            return this.payment.getDelta();
        }
        return 0;
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        return -this.getAmount();
    }

    get id(): number {
        return this._id;
    }
    get created(): Date {
        return this._created;
    }
    get updated(): Date {
        return this._updated;
    }
    get rawData(): any {
        return this._rawData;
    }
    get label_schedule_user_canceled(): any {
        return this._label_schedule_user_canceled;
    }
    get label_schedule_user_created(): any {
        return this._label_schedule_user_created;
    }
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get payment(): Payment {
        return this._payment;
    }
    get schedule(): any {
        return this._schedule;
    }
    get status(): string {
        return this._status;
    }
}
