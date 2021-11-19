//single page root
export const root = document.getElementById('root');

//menu
export const menuHome = document.getElementById('menu-home');
export const menuProducts = document.getElementById('menu-products');
export const menuUsers = document.getElementById('menu-users');
export const menuSignout = document.getElementById('menu-signout');

export const menuSignIn = document.getElementById('menu-signin');
export const menuPurchases = document.getElementById('menu-purchases');
export const menuCart = document.getElementById('menu-cart');
export const menuProfile = document.getElementById('menu-profile');
export const shoppingCartCount = document.getElementById('shoppingcart-count');

//forms
export const formSignin = document.getElementById('form-signin');

export const formSignUp = document.getElementById('form-signup');
export const formSignUpPasswordError = document.getElementById('form-signup-password-error');
export const buttonSignup = document.getElementById('button-signup');
export const buttonReview = document.getElementById('create-comment');

export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    error: document.getElementById('form-add-product-error-name'),
    errorPrice: document.getElementById('form-add-product-error-price'),
    errorSummary: document.getElementById('form-add-product-error-summary'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
    errorImage: document.getElementById('form-add-product-error-image'),
}
export const formEditProduct = {
    form: document.getElementById('form-edit-product'),
    imageTag: document.getElementById('form-edit-product-image-tag'),
    imageButton: document.getElementById('form-edit-product-image-button'),
    errorName: document.getElementById('form-edit-product-error-name'),
    errorPrice: document.getElementById('form-edit-product-error-price'),
    errorSummary: document.getElementById('form-edit-product-error-summary'),
    errorImage: document.getElementById('form-edit-product-error-image'),
}
export const formComment = {
    form: document.getElementById('form-leave-comment'),
    rate: document.getElementsByClassName('rating'),

}
export const formEditComment = {
    form: document.getElementById('form-edit-comment'),
    rateEdit: document.getElementsByClassName('rate-edit'),
}

//modal bootstrap object
export const modalInfobox = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'});
export const modalInfoboxTitleElement = document.getElementById('modal-info-title');
export const modalInfoboxBodyElement = document.getElementById('modal-info-body');
export const modalSignIn = new bootstrap.Modal(document.getElementById('modal-signin'), {backdrop: 'static'});
export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'), {backdrop: 'static'});
export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'));

export const modalTransactionView = new bootstrap.Modal(document.getElementById('modal-transaction-view'), {backdrop: 'static'});
export const modalTransactionTitle = document.getElementById('modal-transaction-title');
export const modalTransactionBody = document.getElementById('modal-transaction-body');
export const modalSignUp = new bootstrap.Modal(document.getElementById('modal-signup'), {backdrop: 'static'});

export const modalCommentTitle = document.getElementById('modal-comment-title');
export const modalComment = new bootstrap.Modal(document.getElementById('modal-comment'), {backdrop: 'static'});
export const modalContent = document.getElementById('modal-comment-content');
export const modalCommentItemName = document.getElementById('modal-comment-item');
export const modalCommentRate = document.getElementById('modal-comment-rate');

export const modalEditComment = new bootstrap.Modal(document.getElementById('modal-edit-comment'), {backdrop: 'static'})
export const modalEditCommentTitle = document.getElementById('modal-edit-comment-title');
export const modalEditContent = document.getElementById('modal-edit-comment-content');
export const modalEditCommentItemName = document.getElementById('modal-edit-comment-item');
export const modalEditRate = document.getElementById('modal-edit-rate');