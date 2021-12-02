import * as Constant from '../model/constant.js';
import { Product } from '../model/product.js';

import { AccountInfo } from '../model/account_info.js';
import { ShoppingCart } from '../model/ShoppingCart.js';
import { Comment } from '../model/comment.js'

export async function signIn(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);

}

export async function signOut() {
    await firebase.auth().signOut();
}

const cf_addProduct = firebase.functions().httpsCallable('cf_addProduct')
export async function addProduct(product) {
    await cf_addProduct(product);
}

export async function uploadImage(imageFile, imageName) {
    if (!imageName) imageName = Date.now() + imageFile.name;

    const ref = firebase.storage().ref()
        .child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName);

    const taskSnapShot = await ref.put(imageFile);
    const imageURL = await taskSnapShot.ref.getDownloadURL();
    return { imageName, imageURL };


}

const cf_getProductlist = firebase.functions().httpsCallable('cf_getProductList');
export async function getProductList() {
    const products = [];
    const result = await cf_getProductlist(); //result.data
    result.data.forEach(data => {
        const p = new Product(data)
        p.docId = data.docId;
        products.push(p)
    });
    return products
}

const cf_getProductById = firebase.functions().httpsCallable('cf_getProductById');
export async function getProductById(docId) {
    const result = await cf_getProductById(docId);
    if (result.data) {
        const product = new Product(result.data);
        product.docId = result.data.docId;
        return product;
    } else {
        return null;
    }

}

const cf_updateProduct = firebase.functions().httpsCallable('cf_updateProduct');
export async function updateProduct(product) {
    const docId = product.docId;
    const data = product.serializeForUpdate();
    await cf_updateProduct({ docId, data });
    // call cf

}

const cf_deleteProduct = firebase.functions().httpsCallable('cf_deleteProduct');
export async function deleteProduct(docId, imageName) {
    await cf_deleteProduct(docId);
    const ref = firebase.storage().ref()
        .child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName);
    await ref.delete();
}

const cf_getUserList = firebase.functions().httpsCallable('cf_getUserList');
export async function getUserList() {
    const result = await cf_getUserList();
    return result.data;
}

const cf_updateUser = firebase.functions().httpsCallable('cf_updateUser');
export async function updateUser(uid, update) {
    await cf_updateUser({ uid, update });

}

const cf_deleteUser = firebase.functions().httpsCallable('cf_deleteUser');
export async function deleteUser(uid) {
    await cf_deleteUser(uid);
}


const cf_deleteComment = firebase.functions().httpsCallable('cf_deleteComment');
export async function deleteCommentAdmin(docId) {
    await cf_deleteComment(docId);
}

//Client

export async function getProductListClient() {
    const products = [];
    const snapShot = await firebase.firestore().collection(Constant.collectionNames.PRODUCTS)
        .orderBy('name')
        .get();

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.docId = doc.id;
        products.push(p);
    })
    return products;
}

export async function checkOut(cart) {
    const data = cart.serialize(Date.now());
    await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY)
        .add(data);
}

export async function getPurchaseHistory(uid) {
    const snapShot = await firebase.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY)
        .where('uid', '==', uid)
        .orderBy('timestamp', 'desc')
        .get();
    const carts = [];
    snapShot.forEach(doc => {
        const sc = ShoppingCart.deserialize(doc.data());
        carts.push(sc);
    })
    return carts;
}

export async function createUser(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function getAccountInfo(uid) {
    const doc = await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
        .doc(uid).get();
    if (doc.exists) {
        return new AccountInfo(doc.data());
    }
    else {
        const defaultInfo = AccountInfo.instance();
        await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
            .doc(uid).set(defaultInfo.serialize());
        return defaultInfo;
    }
}

export async function updateAccountInfo(uid, updateInfo) {
    // updateInfo ={key: value}
    await firebase.firestore().collection(Constant.collectionNames.ACCOUNT_INFO)
        .doc(uid).update(updateInfo);
}


export async function uploadProfilePhoto(photoFile, imageName) {
    const ref = firebase.storage().ref()
        .child(Constant.storageFolderNames.PROFILE_PHOTOS + imageName);
    const taskSnapShot = await ref.put(photoFile);
    const photoURL = await taskSnapShot.ref.getDownloadURL();
    return photoURL;
}

//comment
export async function addComment(comment) {
    const ref = await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .add(comment.serialize());


    return ref.id;
}

export async function deleteComment(commentId) {
    await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .doc(commentId)
        .delete();
};

export async function getCommentList(itemName) {
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .where('itemName', '==', itemName)
        .orderBy('timestamp', "desc")
        .get();

    const comments = [];
    snapShot.forEach(doc => {
        const r = new Comment(doc.data())
        r.docId = doc.id;
        comments.push(r);
    })

    return comments;

}



export async function getCommentById(commentId) {
    const doc = await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .doc(commentId)
        .get();

    if (doc.exists) {
        const { itemName, uid, timestamp, content, rate} = doc.data();
        const c = { itemName, uid, timestamp, content, rate };
        c.docId = doc.id;
        return c;
    } else {
        return null; //document does not exists
    }

}

export async function updateComment(commentInfo) {
    await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .doc(commentInfo.docId)
        .update(commentInfo.serialize());
}

export async function averageRate(itemName) {
    let commentList = await getCommentList(itemName);
    let sum = 0;
    let length = 0;
    //    for (let i =0; i<comments.length; i++){
    //        sum += comments[i].rate;
    //    }

    commentList.forEach(comment => {
        let i = parseFloat(comment.rate);
        
        if (!isNaN(i) && i != 0) {
            sum += i;
            length++;
        }
    })

    return sum / length;

}

export async function searchProducts(keywordsArray){
    const productList = [];
    const snapShot = await firebase.firestore()
           .collection(Constant.collectionNames.PRODUCTS)
           .where ('tags', 'array-contains-any', keywordsArray)
  //         .orderBy('name', 'desc')
           .get()

    snapShot.forEach(doc => {
        const p = new Product(doc.data());
        p.docId = doc.id;
        productList.push(p);
    })

    return productList;

}




export async function getCommentListRateDesc(itemName) {
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .where('itemName', '==', itemName)
        .orderBy('rate', "desc")
        .get();

    const comments = [];
    snapShot.forEach(doc => {
        const r = new Comment(doc.data())
        r.docId = doc.id;
        comments.push(r);
    })

    return comments;

}

export async function getCommentListRateAsc(itemName) {
    const snapShot = await firebase.firestore()
        .collection(Constant.collectionNames.COMMENT)
        .where('itemName', '==', itemName)
        .orderBy('rate')
        .get();

    const comments = [];
    snapShot.forEach(doc => {
        const r = new Comment(doc.data())
        r.docId = doc.id;
        comments.push(r);
    })

    return comments;

}