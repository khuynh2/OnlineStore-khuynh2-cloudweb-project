export class Comment {
    constructor(data) {
        this.itemName = data.itemName;
        this.uid = data.uid;
        this.email = data.email;
        this.timestamp = data.timestamp;
        this.content = data.content;


    }

    serialize() {
        return {
            itemName: this.itemName,
            uid: this.uid,
            email: this.email,
            timestamp: this.timestamp,
            content: this.content,
        }
    }

    serializeForUpdate() {
        const c = {};
        if(this.itemName) c.itemName = this.itemName;
        if(this.uid) c.uid = this.uid;     
        if(this.timestamp) c.timestamp = this.timestamp;
        if(this.content) c.content = this.content;
        return c;
    }

}