import * as FirebaseController from './firebase_controller.js'
import * as Constants from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import * as Util from '../viewpage/util.js'
import { Comment } from '../model/comment.js'
import * as Auth from './auth.js'

let rates = ['one', 'two', 'three', 'four', 'five']


export function ratingEventListener() {


    for (let i = 0; i < rates.length; i++) {
        document.getElementById(rates[i]).addEventListener('click', e => {
            e.preventDefault();
            Element.modalCommentRate.value = i + 1;

            for (let j = 0; j < 5; j++) {
                let check = document.getElementById(rates[j]).className;

                if (j <= i) {
                    document.getElementById(rates[j]).classList.add("checked");
                } else {
                    document.getElementById(rates[j]).classList.remove("checked");
                }
            }

        })

    };

}


export function ratingEditEventListener() {

    // rates.forEach(score =>{
    //     document.getElementById('edit-'  + score).addEventListener('click', e => {
    //         console.log(score);
    //         Element.modalEditRate.value = score;
    //     })
    // })

    for (let i = 0; i < rates.length; i++) {
        document.getElementById('edit-' + rates[i]).addEventListener('click', e => {
            //console.log(score);
            Element.modalEditRate.value = i + 1;

        
            for (let j = 0; j < 5; j++) {
                let check = document.getElementById('edit-' + rates[j]).className;

                if (j <= i) {
                    document.getElementById('edit-' + rates[j]).classList.add("checked");
                } else {
                    document.getElementById('edit-' + rates[j]).classList.remove("checked");
                }
            }

        })
    };

}


