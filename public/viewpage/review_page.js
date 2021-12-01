import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import { Comment } from '../model/comment.js'
import * as EditReview from '../controller/edit_comment.js'

import * as Review from './review_page.js'
import * as Rate from '../controller/rating.js'
import * as Sort from '../controller/sort_comment.js'

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
        await review_page("sort-time", productName, productURL);
    })

}


export async function review_page(sortType, productName, productURL) {

    if (!productName) {
        // Util.info('Error', 'Product Id is null: invalid access')
        return;
    }

    let product;
    let commentList;

    let html = `<h1>Review for ${productName}</h1>
                <div>
                <img src="${productURL}" width = "150px">
                </div>
    `;


    commentList = await Sort.sortReviews(sortType, productName);


    if (commentList.length == 0) {
        html += `<h4>No reviews have been made</h4>`
    } else {

        html += `
        <br>
        <div class="btn-group" id = "review-sort">
                <button id = "review-sort-button" type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Sort by
                </button>
            <ul class="dropdown-menu">
            <li><a class="dropdown-item" id = "sort-time">Most recent</a></li>
            <li><a class="dropdown-item" id = "sort-hrate">Highest rating</a></li>
            <li><a class="dropdown-item" id = "sort-lrate">Lowest rating</a></li>
     
            </ul>
        </div> 
        
    `;
    }


    html += buildReview(commentList);

    Element.root.innerHTML = html;

    if (Auth.currentUser && !Constant.adminEmails.includes(Auth.currentUser.email)) {
        let elements = document.getElementsByClassName('btn-post-auth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block';
        }
    }
    else if (Auth.currentUser && Constant.adminEmails.includes(Auth.currentUser.email)) {
        let adminElements = document.getElementsByClassName('btn-post-auth-admin');
        for (let i = 0; i < adminElements.length; i++) {
            adminElements[i].style.display = 'block';
        }
        let elements = document.getElementsByClassName('btn-post-auth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    // let editAuth = document.getElementById("edit-" + Auth.currentUser.id);
    // console.log(Auth.currentUser.id);
    // editAuth.style.display = "block";


    EditReview.addReviewDeleteListeners();
    EditReview.addReviewEditListeners();
    EditReview.addEventListeners();
    EditReview.addReviewAdminDeleteListeners();
    Sort.addSortListeners(productName, productURL);



}



export function addCommentButtonListeners() {
    const commentButtonForm = Element.modalTransactionBody;
    //document.getElementsByClassName('form-comment-product');
    //console.log(commentButtonForm.length)
    let itemName
    // for (let i = 0; i < commentButtonForm.length; i++) {
    //     commentButtonForm[i].addEventListener('submit', async e => {
    //         e.preventDefault();

    //         itemName = e.target.itemName.value;
    //         Element.modalCommentItemName.value = itemName;
    //         Element.modalContent.value = ``;

    //        // Element.formComment.form.reset();
    //         Element.modalCommentTitle.innerHTML = `Review for: ${itemName}`;
    //         Element.modalRate.innerHTML = rateDislay(0);
    //         Element.modalTransactionView.hide();
    //         Element.modalComment.show();


    //         //createCommentListener();


    //     }, )

    // }


    commentButtonForm.addEventListener('submit', async e => {
        e.preventDefault();

        itemName = e.target.itemName.value;
        Element.modalCommentItemName.value = itemName;
        Element.modalContent.value = ``;

        // Element.formComment.form.reset();
        Element.modalCommentTitle.innerHTML = `Review for: ${itemName}`;
        Element.modalRate.innerHTML = rateDislay(0);
        Element.modalTransactionView.hide();
        Element.modalComment.show();


        //createCommentListener();


    })

}



export function createCommentListener() {
    let leaveCommentBtn = Element.formComment.form.addEventListener('submit', async e => {
        e.preventDefault();

        const itemName = e.target.itemName.value;
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        const content = e.target.comment.value;
        const rate = e.target.score.value;
        const label = Util.disableButton(Element.buttonReview);
        const comment = new Comment({
            itemName, uid, email, timestamp, content, rate
        })

        // console.log("run");

        try {
            await FirebaseController.addComment(comment);
            Rate.resetRating(0);
            Util.info('Thank you for your feedback!', ``, Element.modalComment);


        } catch (err) {
            if (Constant.DEV) console.log(err)
            Util.info('Commnent failed', JSON.stringify(err), Element.modalComment);
        }
        Util.enableButton(Element.buttonReview, label);



    }, { once: true })
}


export function buildReview(commentList) {

    let html = ``;



    commentList.forEach(comment => {



        let display = displayUserAuth(comment.uid);
        html += `   
        <br>
        <div id ="comment-${comment.docId}">
            <div  class = "w-75  border border-primary rounded">

                <div class="p-3   bg-primary text-white">
                        <div class = "comment-author " >
                        Author: ${comment.email} 
                        </div>

                <form class="form-admin-delete-comment" style=" display: inline-block; float: right;">  
                        <input type = "hidden" name="docId" value="${comment.docId}">
                        <button  type="submit" class="btn btn-outline-danger btn-sm ms-1 btn-post-auth-admin" > 
                                    Delete
                        </button>
                </form>


                <form class="form-delete-comment" style=" display: inline-block; float: right;">  
                    <input type = "hidden" name="docId" value="${comment.docId}">
                    <button  type="submit" class="btn btn-outline-warning btn-sm ms-1" style=" display: ${display};" > 
                                Delete
                    </button>
                </form>
              
               

                <form class="form-edit-comment" style=" display: inline-block; float: right;">  
                    <input type = "hidden" name="docId" value="${comment.docId}">
                    <button  type="submit" class="btn btn-outline-warning btn-sm " style=" display: ${display};" > 
                                Edit
                    </button>
                </form>
            </div>

          

            <div class = "comment-time border border-bottom">  
                (At ${new Date(comment.timestamp).toString()})   
            </div>   
                
            <div class="comment-score" >
                `



        html += rateDislay(comment.rate)

        html +=
            `   </div>
            


                <div class = "comment-content"> 
                ${comment.content} 
                </div>
            <br>
            </div>
        </div>
         `
    })

    return html;
}

function displayUserAuth(commentUid) {

    if (Auth.currentUser == null) {
        return "none";
    }

    if (commentUid == Auth.currentUser.uid) {
        return "block";
    }
    else {
        return "none";
    }
}


export function rateDislay(rate) {
    // let stars = document.getElementById('stars').childNodes;

    // stars.forEach(star =>{
    //     console.log(i);
    // })

    if (Number.isNaN(rate) || rate == null) {
        return `   `
    }

    if (rate == 0) {
        return `<i class="fa fa-star " ></i>
       <i class="fa fa-star " ></i>
       <i class="fa fa-star " ></i>
       <i class="fa fa-star " ></i>
       <i class="fa fa-star " ></i>
       `
    }


    rate = Number.parseFloat(rate).toFixed(1);

    let html = ``

    for (let i = 1; i <= 5; i++) {
        if (i <= rate) {
            html += `<i class="fa fa-star checked" ></i>`
        }
        else {
            html += `<i class="fa fa-star unchecked" ></i>`
        }
    }


    return html

}