import * as Home from '../viewpage/home_page.js'
import * as Product from '../viewpage/product_page.js'
import * as User from '../viewpage/user_page.js'

import * as Purchase from '../viewpage/purchase_page.js'
import * as Cart from '../viewpage/cart.js'
import * as Profile from '../viewpage/profile_page.js'

import * as Review from '../viewpage/review_page.js'

export const routePathname = {
    HOME: '/',
    PRODUCTS: '/products',
    USERS: '/users',
    PURCHASE: '/purchase',
    PROFILE: '/profile',
    CART: '/cart',
    REVIEW: '/review',
}

export const routes = [
    {pathname: routePathname.HOME, page: Home.home_page},
    {pathname: routePathname.PRODUCTS, page: Product.product_page},
    {pathname: routePathname.USERS, page: User.users_page},
    {pathname: routePathname.PURCHASE, page: Purchase.purchase_page},
    {pathname: routePathname.CART, page: Cart.cart_page},
    {pathname: routePathname.PROFILE, page: Profile.profile_page},
    {pathname: routePathname.REVIEW, page: Review.review_page},
];

export function routing(pathname, hash){
    const route = routes.find(r => r.pathname == pathname);
    if (route) route.page();
    else routes[0].page();
}