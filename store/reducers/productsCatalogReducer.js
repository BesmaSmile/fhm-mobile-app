import { constants } from './actions';
const initialState={
    productCategories:[]
}

function productsCatalogReducer(state = initialState, action) {
    switch(action.type) {
        case constants.LOAD_PRODUCTS_CATALOG_REQUEST:
            return {
                ...state,
                loadingProductsCatalog:true,
                loadingProductsCatalogError:undefined
            }
        case constants.LOAD_PRODUCTS_CATALOG_SUCCESS:
            return {
                ...state,
                loadingProductsCatalog:false,
                productCategories: action.productCategories,
                productsCatalog : action.productsCatalog
            }
        case constants.LOAD_PRODUCTS_CATALOG_FAILURE:
            return {
                ...state,
                loadingProductsCatalog:false,
                loadingProductsCatalogError:action.error
            }
        case constants.ADD_NEW_PRODUCT:
            return {
                ...state,
                productsCatalog : [action.prduct, ...productsCatalog]
            }
        default:
            return state
    }
}

export const getProductCategories= (state)=> state.productCategories
export const getProductCategory= (state, category) => state.productCategories.find(c=>c.name==category)

export const getProductsCatalog=(state)=>state.productsCatalog//category && state.productsCatalog ? state.productsCatalog.filter(product=>product.categorie==category) : state.productsCatalog
export const loadingProductsCatalog=(state)=> state.loadingProductsCatalog
export const loadingProductsCatalogError=(state)=>state.loadingProductsCatalogError

export default productsCatalogReducer
