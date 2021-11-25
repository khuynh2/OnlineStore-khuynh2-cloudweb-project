const functions = require("firebase-functions");


const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const Constant = require('./constant.js')

exports.cf_addProduct = functions.https.onCall(addProduct);
exports.cf_getProductList = functions.https.onCall(getProductList);
exports.cf_getProductById = functions.https.onCall(getProductById);
exports.cf_updateProduct = functions.https.onCall(updateProduct);
exports.cf_deleteProduct = functions.https.onCall(deleteProduct);
exports.cf_getUserList = functions.https.onCall(getUserList);
exports.cf_updateUser = functions.https.onCall(updateUser);
exports.cf_deleteUser = functions.https.onCall(deleteUser);
exports.cf_deleteComment = functions.https.onCall(deleteComment);

function isAdmin(email) {
  return Constant.adminEmails.includes(email);
}

async function deleteUser(data, context){
  // data => uid
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }

  try{
    await admin.auth().deleteUser(data);


  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('internal', 'deleteUser failed');
  }


}

async function updateUser(data,context){
  // dta => {uid, update} ==> update = {key: value}
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }

  try{
     const uid = data.uid;
     const update = data.update;
     await admin.auth().updateUser(uid, update);

  }catch(e){
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('internal', 'updateUser failed');
  }

}

async function getUserList(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }

  const userList = [];
  const MAXRESULTS = 2;

  try {
    let result = await admin.auth().listUsers(MAXRESULTS);
    userList.push(...result.users); //spread operator
    let nextPageToken = result.pageToken;

    while (nextPageToken) {
      result = await admin.auth().listUsers(MAXRESULTS, nextPageToken);
      userList.push(...result.users);
      nextPageToken = result.pageToken;
    }
    return userList;

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('unauthenticated', 'getUserList failed');


  }

}

async function deleteProduct(docId, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }
  try {
    await admin.firestore().collection(Constant.collectionNames.PRODUCT)
      .doc(docId).delete();

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('unauthenticated', 'deleteProduct failed');

  }

}

async function updateProduct(productInfo, context) {
  //productInfo = {docId, data}
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }

  try {
    await admin.firestore().collection(Constant.collectionNames.PRODUCT)
      .doc(productInfo.docId).update(productInfo.data);

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('unauthenticated', 'updateProduct failed');

  }

}

//@data ==> document (prodcut) id
async function getProductById(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }
  try {
    const doc = await admin.firestore().collection(Constant.collectionNames.PRODUCT)
      .doc(data).get();
    if (doc.exists) {
      const { name, summary, price, imageName, imageURL, tags } = doc.data();
      const p = { name, summary, price, imageName, imageURL, tags };
      p.docId = doc.id;
      return p;
    } else {
      return null; //document does not exists
    }

  } catch (error) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('internal', 'get product list failed');

  }




}

async function getProductList(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }

  try {
    let products = [];
    const snapShot = await admin.firestore().collection(Constant.collectionNames.PRODUCT)
      .orderBy('name')
      .get();
    snapShot.forEach(doc => {
      const { name, price, summary, imageName, imageURL } = doc.data();
      const p = { name, price, summary, imageName, imageURL };
      p.docId = doc.id;
      products.push(p);
    });
    return products;

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('internal', 'get product list failed');
  }

}

async function addProduct(data, context) {

  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }
  //data: serialized product object
  try {
    await admin.firestore().collection(Constant.collectionNames.PRODUCT)
      .add(data);

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('internal', 'addProduct failed');

  }
}



async function deleteComment(docId, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log('not admin', context.auth.token.email);
    throw new functions.https.HttpsError('unauthenticated', 'Only admin may invoked this function');
  }
  try {
    await admin.firestore().collection(Constant.collectionNames.COMMENT)
      .doc(docId).delete();

  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError('unauthenticated', 'deleteComment failed');

  }

}