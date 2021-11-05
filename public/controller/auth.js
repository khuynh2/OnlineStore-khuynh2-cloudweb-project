import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js';
import * as Util from '../viewpage/util.js'
import * as Route from './route.js'
import * as Home from '../viewpage/home_page.js'
import * as Profile from '../viewpage/profile_page.js'

export let currentUser

export function addEventListners() {
    Element.formSignin.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!Constant.adminEmails.includes(email)) {

        }

        if (Constant.adminEmails.includes(email)) {
            Util.info('Welcome', 'Accessing Admin Page');

        }


        try {
            await FirebaseController.signIn(email, password);
            Element.modalSignIn.hide();
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Sign In Error', JSON.stringify(e), Element.modalSignIn)

        }
    })

    Element.menuSignout.addEventListener('click', async () => {
        try {
            await FirebaseController.signOut();
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Sign out Error: Try again', JSON.stringify(e))
        }

    })

    firebase.auth().onAuthStateChanged(
        async user => {

                    
       
            //sign in admin
            if (user && Constant.adminEmails.includes(user.email)) {
                currentUser = user;
                await Profile.getAccountInfo(user) 
                Home.initShoppingCart();
                let elements = document.getElementsByClassName('modal-pre-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('modal-post-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                elements = document.getElementsByClassName('modal-post-auth-admin');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }

                Route.routing(window.location.pathname, window.location.hash);
            }
            // sign in user
            else if (user && !Constant.adminEmails.includes(user.email)) {
                currentUser = user;
                await Profile.getAccountInfo(user) 
                Home.initShoppingCart();
                let elements = document.getElementsByClassName('modal-pre-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('modal-post-auth-admin');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('modal-post-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }

                Route.routing(window.location.pathname, window.location.hash);
            }
            else {
                //sign out
                currentUser = null;
                let elements = document.getElementsByClassName('modal-pre-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                elements = document.getElementsByClassName('modal-post-auth-admin');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('modal-post-auth');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }

                history.pushState(null, null, Route.routePathname.HOME);
                Route.routing(window.location.pathname, window.location.hash);

            }

        }
    );


    Element.buttonSignup.addEventListener('click', () => {
        //show sign up modal
        Element.modalSignIn.hide();
        Element.formSignUp.reset();
        Element.formSignUpPasswordError.innerHTML = '';
        Element.modalSignUp.show();
    })

    Element.formSignUp.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        Element.formSignUpPasswordError.innerHTML = '';
        if (password != passwordConfirm) {
            Element.formSignUpPasswordError.innerHTML = 'Two password do not match';
            return;
        }

        try {
            await FirebaseController.createUser(email, password);
            Util.info('Account Created!', `You are now signed in as ${email}`, Element.modalSignUp);
        } catch (err) {
            if (Constant.DEV) console.log(err);
            Util.info('Failed to create new account', JSON.stringify(err), Element.modalSignUp);

        }
    })



}