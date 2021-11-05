import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import { Comment } from '../model/comment.js'


export function addReviewButtonListeners(){
    const reviewButtonForm = document.getElementsByClassName('review-product-form');
    for (let i = 0; i < reviewButtonForm.length; i++){
        addReviewSubmitEvent(reviewButtonForm[i])
    }
}

export function addReviewSubmitEvent(form){
    form.addEventListener('submit', async e=>{
        e.preventDefault();
        let productId = e.target.productId.value;
        let productName = e.target.productName.value;
        history.pushState(null, null, Route.routePathname.REVIEW + '#' + productId);
        await review_page(productName);
    })
}


export async function review_page(productName) {

    // if (!productId) {
    //     Util.info('Error', 'Product Id is null: invalid access')
    //     return;
    // }

    let product;
    let commentList;

    let html = '<h1>Review</h1>';

    try{
        commentList = await FirebaseController.getCommentList(productName);
        if (! commentList) {
            Util.info('Error', 'Comments do not exist');
            return;
        }

    }catch(e){
        if (Constant.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e))
        return;
    }

    buildReview (commentList);
   
    Element.root.innerHTML = html;

}



export function addCommentButtonListeners(itemName){
    const commentButtonForm = document.getElementsByClassName('form-comment-product');
    console.log(commentButtonForm.length)
    for (let i = 0; i < commentButtonForm.length; i++){
           
           commentButtonForm[i].addEventListener('submit',async e=>{
           e.preventDefault();
           itemName = e.target.itemName.value;     
           Element.modalCommentTitle.innerHTML = `Review for: ${itemName}`;
           Element.modalTransactionView.hide();
           Element.modalComment.clear();
           Element.modalComment.show();
           createCommentListener(itemName);
        })
    }
}

// this.itemName = data.itemName;
// this.uid = data.uid;
// this.email = data.email;
// this.timestamp = data.timestamp;
// this.content = data.content;

export function createCommentListener(productName){
    Element.formComment.form.addEventListener('submit', async e=>{
        e.preventDefault();
        const itemName = productName;
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        const content = e.target.comment.value;

        const comment = new Comment({
            itemName, uid, email, timestamp,content
        })

        try{
           const docId =  FirebaseController.addComment(comment);
           Util.info('Thank you for your feedback!', ``, Element.modalComment);

        }catch{
            if (Constant.DEV) console.log(e)
            Util.info('Commnent failed', JSON.stringify(e), Element.modalAddProduct);
        }


    })
}


export function buildReview (commentList){
   
    commentList.forEach(comment => {
        console.log(comment.itemName)
    })
}