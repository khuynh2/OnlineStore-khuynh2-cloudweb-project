import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'
import { ShoppingCart } from '../model/ShoppingCart.js'
import * as Review from './review_page.js'
import { Product } from '../model/product.js'


export function addEventListeners() {
    Element.menuHome.addEventListener('click', async () => {
        history.pushState(null, null, Route.routePathname.HOME)
        const label = Util.disableButton(Element.menuHome);
        await home_page();
        Util.enableButton(Element.menuHome, label);
    })
}

export let cart;

export async function home_page() {
    let html = '<h1> Welcome to Online Shopping Store </h1>';

    let products;


    try {
        products = await FirebaseController.getProductListClient();
        if (cart) {
            cart.items.forEach(item => {
                const product = products.find(p => item.docId == p.docId)
                product.qty = item.qty;
            })
        }

    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Cannot get product info', JSON.stringify(e));
    }


    html += buildHomeScreen(products);



    
}


export async function buildHomeScreen(products){

    let html = '';
    
    for (let i = 0; i < products.length; i++) {
        html += await buildProductView(products[i], i);
    }
    Element.root.innerHTML = html;



    const decForms = document.getElementsByClassName('form-dec-qty');
    for (let i = 0; i < decForms.length; i++) {
        decForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const p = products[e.target.index.value]; // 
            //remove product p to shopping cart
            cart.removeItem(p);
            document.getElementById('qty-' + p.docId).innerHTML = (p.qty == null || p.qty == 0) ? 'Add' : p.qty;
            Element.shoppingCartCount.innerHTML = cart.getTotalQty();

        })
    };

    const incForms = document.getElementsByClassName('form-inc-qty');
    for (let i = 0; i < decForms.length; i++) {
        incForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const p = products[e.target.index.value]; // 
            //add product p to shopping cart
            cart.addItem(p);
            document.getElementById('qty-' + p.docId).innerHTML = p.qty;
            Element.shoppingCartCount.innerHTML = cart.getTotalQty();

        })
    }
    Review.addReviewButtonListeners();

    return html;

}

async function buildProductView(product, index) {
    let avg = await FirebaseController.averageRate(product.name);

    let html = `
    <div class="card rounded" style="width: 18rem; display: inline-block;">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body" >
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
                ${Util.currency(product.price)} <br>
                ${product.summary}
                </p>
                `
    html+=Review.rateDislay(avg);


    html += `
             <div class = "container pt-3 bg-light ${Auth.currentUser ? 'd-block' : 'd-none'}">
                <form method = "post" class="d-inline form-dec-qty">
                      <input type = "hidden" name ="index" value="${index}">
                      <button class="btn btn-outline-danger"> &minus;</button>
                </form>
                <div id = "qty-${product.docId}" class = "container rounded text-center text-white  bg-primary d-inline-block w-50">
                ${product.qty == null || product.qty == 0 ? 'Add' : product.qty}
                </div>
                 <form method = "post" class="d-inline form-inc-qty">
                      <input type = "hidden" name ="index" value="${index}">
                      <button class="btn btn-outline-primary"> &plus;</button>
                </form>             
             </div>
             <hr>
             <form method = "post" class = "review-product-form">
                <input type = "hidden" name = "productName" value = "${product.name}">
                <input type = "hidden" name = "productId" value = "${product.docId}">
                <input type = "hidden" name = "productURL" value = "${product.imageURL}">
                <button id="button-review-product" class = "btn btn-outline-primary"> Review </button>
             </form>
         </div>
    </div>
    `;


    return html
}

export function initShoppingCart() {
    let cartString = window.localStorage.getItem('cart-' + Auth.currentUser.uid);

    cart = ShoppingCart.parse(cartString);
    if (!cart || !cart.isValid() || cart.uid != Auth.currentUser.uid) {
        window.localStorage.removeItem('cart-' + Auth.currentUser.uid);
        cart = new ShoppingCart(Auth.currentUser.uid);
    }

    Element.shoppingCartCount.innerHTML = cart.getTotalQty();
    // console.log(cart.getTotalQty());

}