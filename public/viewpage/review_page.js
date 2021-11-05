import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import { Comment } from '../model/comment.js'


export function addReviewButtonListeners() {
    const reviewButtonForm = document.getElementsByClassName('review-product-form');
    for (let i = 0; i < reviewButtonForm.length; i++) {
        addReviewSubmitEvent(reviewButtonForm[i])
    }
}

export function addReviewSubmitEvent(form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        let productId = e.target.productId.value;
        let productName = e.target.productName.value;
        let productURL = e.target.productURL.value;
        history.pushState(null, null, Route.routePathname.REVIEW + '#' + productId);
        await review_page(productName, productURL);
    })
}


export async function review_page(productName, productURL) {

    if (!productName) {
        Util.info('Error', 'Product Id is null: invalid access')
        return;
    }

    let product;
    let commentList;

    let html = `<h1>Review for ${productName}</h1>
                <img src="${productURL}" width = "150px">
    `;

    try {
        commentList = await FirebaseController.getCommentList(productName);
        if (!commentList) {
            Util.info('Error', 'Comments do not exist');
            return;
        }

    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e))
        return;
    }

    html += buildReview(commentList);

    Element.root.innerHTML = html;

}



export function addCommentButtonListeners() {
    const commentButtonForm = document.getElementsByClassName('form-comment-product');
    console.log(commentButtonForm.length)
    let itemName
    for (let i = 0; i < commentButtonForm.length; i++) {

        commentButtonForm[i].addEventListener('submit', async e => {
            e.preventDefault();
        //    let index = e.target.index.value;
            itemName = e.target.itemName.value;
            Element.modalCommentItemName.value  = itemName;
            Element.modalContent.value = ``;
            Element.formComment.form.reset();
            Element.modalCommentTitle.innerHTML = `Review for: ${itemName}`;
            Element.modalTransactionView.hide();     
            Element.modalComment.show();
            await createCommentListener();
            
        })
    }
    
}



export function createCommentListener() {
    Element.formComment.form.addEventListener('submit', async e => {
        e.preventDefault();
        const itemName = e.target.itemName.value;
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        const content = e.target.comment.value;

        const comment = new Comment({
            itemName, uid, email, timestamp, content
        })
        

        try {
            const docId = FirebaseController.addComment(comment);
            Util.info('Thank you for your feedback!', ``, Element.modalComment);
            return;
          //  Element.formComment.form.reset();
            

        } catch {
            if (Constant.DEV) console.log(e)
            Util.info('Commnent failed', JSON.stringify(e), Element.modalAddProduct);
        }


    })
}


export function buildReview(commentList) {
    let html = ``;

    commentList.forEach(comment => {
        html += `   
        <div class = "border border-primary">
        <div class= "bg-info text-white" name= "reply-delete">
          Replied by ${comment.email} (At ${new Date(comment.timestamp).toString()})
          <button  type="button" class="btn btn-dark button-reply" value = "${comment.docId}">Delete</button>
       </div>
       
       ${comment.content}
  </div>
 
  <hr>`
    })

    return html;
}