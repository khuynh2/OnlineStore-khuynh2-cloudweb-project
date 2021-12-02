import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import { Product } from '../model/product.js'
import * as Home from './home_page.js'

export function addEventListeners(){
    Element.formSearch.addEventListener('submit', async e =>{
        e.preventDefault();
        const searchKeys = e.target.searchKeys.value.trim();
        if (searchKeys.length ==0){
            Util.info('Error', 'No search keys');
            return;
        }

        const button = Element.formSearch.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);

        const searchKeysInArray = searchKeys.toLowerCase().match(/\S+/g);
        const joinedSearchKeys = searchKeysInArray.join('+');
        await search_page(joinedSearchKeys);
        Util.enableButton(button, label);
    })
}


export async function  search_page (joinedSearchKeys){
    if(!joinedSearchKeys){
        Util.info('Error', 'No search keys')
        return
    }

    const searchKeysInArray = joinedSearchKeys.split('+');
    if (searchKeysInArray.length == 0 ){
        Util.info('Error', 'No search keys')
        return
    }

    let productList
    try{
        productList = await FirebaseController.searchProducts(searchKeysInArray);
       
    }
    catch(e){
        if (Constant.DEV) console.log(e)
        Util.info('Search Error', JSON.stringify(e));
        return;
    }

   Home.buildHomeScreen(productList);
   

}