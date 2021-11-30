import * as FirebaseController from './firebase_controller.js'
import * as Constants from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import * as Util from '../viewpage/util.js'
import { Comment } from '../model/comment.js'
import * as ReviewPage from '../viewpage/review_page.js'
import * as Constant from '../model/constant.js'


export async function addSortListeners(productName, productURL) {
     document.getElementById("sort-time").addEventListener('click',
        async e => {
            e.preventDefault();
            await ReviewPage.review_page("sort-time",productName, productURL);
            document.getElementById("review-sort-button").innerHTML = "Sort by: Time";
            
        })
    document.getElementById("sort-hrate").addEventListener('click',
        async e => {
            e.preventDefault();
            await ReviewPage.review_page("sort-hrate",productName, productURL);
            document.getElementById("review-sort-button").innerHTML = "Sort by: Highest rating";
        })
    document.getElementById("sort-lrate").addEventListener('click',
        async e => {
            e.preventDefault();
            await ReviewPage.review_page("sort-lrate",productName, productURL);
            document.getElementById("review-sort-button").innerHTML = "Sort by: Lowest rating";
        })
}


export async function sortReviews(sortType, productName) {

    let commentList;

    switch (sortType) {
        case 'sort-hrate':

            try {
                commentList = await FirebaseController.getCommentListRateDesc(productName);
                if (!commentList) {
                    Util.info('Error', 'Comments do not exist');
                    return;
                }
                return commentList;
            } catch (e) {
                if (Constant.DEV) console.log(e);
                Util.info('Error', JSON.stringify(e))
                return;
            }
            break;
        case 'sort-lrate':

            try {
                commentList = await FirebaseController.getCommentListRateAsc(productName);
                if (!commentList) {
                    Util.info('Error', 'Comments do not exist');
                    return;
                }
                return commentList;
            } catch (e) {
                if (Constant.DEV) console.log(e);
                Util.info('Error', JSON.stringify(e))
                return;
            }
            break;
        default:
            try {
                commentList = await FirebaseController.getCommentList(productName);
                if (!commentList) {
                    Util.info('Error', 'Comments do not exist');
                    return;
                }
                return commentList;
            } catch (e) {
                if (Constant.DEV) console.log(e);
                Util.info('Error', JSON.stringify(e))
                return;
            }
    }
}