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

}