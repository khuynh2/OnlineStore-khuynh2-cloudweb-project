export class Comment {
    constructor(data) {
        this.itemName = data.itemName;
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;
        this.rate = data.rate;

    }

    serialize() {
        return {
            itemName: this.itemName,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
            rate: this.rate,
        }
    }

    serializeForUpdate() {
        const c = {};
        if(this.itemName) c.itemName = this.itemName;
        if(this.uid) c.uid = this.uid;     
        if(this.timestamp) c.timestamp = this.timestamp;
        if(this.content) c.content = this.content;
        if(this.rate) c.rate = this.rate;
        return c;
    }

}