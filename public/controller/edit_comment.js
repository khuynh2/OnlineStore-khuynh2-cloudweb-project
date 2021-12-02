import * as FirebaseController from './firebase_controller.js'
import * as Constants from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import * as Util from '../viewpage/util.js'
import { Comment } from '../model/comment.js'
import * as Auth from './auth.js'
import * as Rate from '../controller/rating.js'
import * as ReviewPage from '../viewpage/review_page.js'


// itemName: this.itemName,
// uid: this.uid,
// email: this.email,
// timestamp: this.timestamp,
// content: this.content,


export function addEventListeners() {
    Element.formEditComment.form.addEventListener('submit', async e => {
        e.preventDefault();

        const c = new Comment({
            itemName: e.target.itemName.value,
            uid: Auth.currentUser.uid,
            email: Auth.currentUser.email,
            timestamp: Date.now(),
            content: e.target.comment.value,
            rate: e.target.score.value,
        });
        c.docId = e.target.docId.value;

        try {
            await FirebaseController.updateComment(c);
            const cardTag = document.getElementById('comment-' + c.docId);
            cardTag.getElementsByClassName('comment-time')[0].innerHTML = new Date(c.timestamp).toString();
            cardTag.getElementsByClassName('comment-content')[0].innerHTML = c.content;
            cardTag.getElementsByClassName('comment-score')[0].innerHTML = ReviewPage.rateDislay(c.rate);
            
            Element.modalEditComment.hide();


        } catch (e) {
            if (Constants.DEV) console.log(e);
            Util.info('Update comment error', JSON.stringify(e), Element.modalEditComment);
        }

       

    })
}





export function addReviewDeleteListeners() {

      
    const reviewDeleteForm = document.getElementsByClassName('form-delete-comment');
    for (let i = 0; i < reviewDeleteForm.length; i++) {
        reviewDeleteForm[i].addEventListener('submit', async e => {
            e.preventDefault();
            let id = e.target.docId.value
            try {
                await FirebaseController.deleteComment(id);
                Util.info('Deleted!', `${id} has been deleted`);

            } catch (e) {
                if (Constants.DEV) console.log(e);
                Util.info('Delete comment error', JSON.stringify(e));
                return;
            }

            const commentCard = document.getElementById('comment-' + id);        
            commentCard.remove();


        })
    }
}

export function addReviewEditListeners() {
    const reviewEditForm = document.getElementsByClassName('form-edit-comment');
    for (let i = 0; i < reviewEditForm.length; i++) {
        reviewEditForm[i].addEventListener('submit', async e => {
            e.preventDefault();
            let comment;
            try {
                comment = await FirebaseController.getCommentById(e.target.docId.value);
                if (!comment) {
                    Util.info('getCommentById error', 'No comment found by the id');
                    return;
                }

            } catch (e) {
                if (Constants.DEV) console.log(e);
                Util.info('getProductById Error', JSON.stringify(e));
                return;
            }

            let itemName = comment.itemName;
            Element.modalEditCommentItemName.value = itemName; 
            Element.formEditComment.form.docId.value = comment.docId;
            Element.modalEditContent.value = `${comment.content}`;
            Element.modalEditCommentTitle.innerHTML = `Review for: ${itemName}`;
            Element.modalEditRate.value = comment.rate;
            Rate.initialRating('edit-', comment.rate);
          //  Element.modalStarEdit.innerHTML = ReviewPage.rateDislay(comment.rate);
            console.log(Element.modalStarEdit.innerHTML)
           // Rate.resetRating('edit-'); 
            Element.modalEditComment.show();
            Rate.ratingEditEventListener();
         
        })
    }
}

export function addReviewAdminDeleteListeners() {

    const reviewAdminDeleteForm = document.getElementsByClassName('form-admin-delete-comment');
    for (let i = 0; i < reviewAdminDeleteForm.length; i++) {
        reviewAdminDeleteForm[i].addEventListener('submit', async e => {
            e.preventDefault();
            let id = e.target.docId.value
            try {
                await FirebaseController.deleteCommentAdmin(id);
                Util.info('Deleted!', `${id} has been deleted`);

            } catch (e) {
                if (Constants.DEV) console.log(e);
                Util.info('Delete comment error', JSON.stringify(e));
                return;
            }

            const commentCard = document.getElementById('comment-' + id);
            commentCard.remove();


        })
    }
}


