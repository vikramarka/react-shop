const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
}

//Action Types
export const PRODUCTS = createRequestTypes("PRODUCTS");
export const PRODUCT = createRequestTypes("PRODUCT");
export const ADDPRODUCTTOCART = createRequestTypes("ADDPRODUCTTOCART");
export const REMOVEFROMCART = createRequestTypes("REMOVEFROMCART");
export const UPDATEQUANTITY = createRequestTypes("UPDATEQUANTITY");
export const GETCARTPRODUCTS = createRequestTypes("GETCARTPRODUCTS");
export const GETSHIPPINGREGIONS = createRequestTypes("GETSHIPPINGREGIONS");
export const GETSHIPPINGOPTIONS = createRequestTypes("GETSHIPPINGOPTIONS");
export const CHECKUSERLOGIN = createRequestTypes("CHECKUSERLOGIN");
export const SETUSER = "SETUSER";
export const SETREGION = "SETREGION";
export const SETSHIPPINGOPTION = "SETSHIPPINGOPTION";
export const CATEGORIES = createRequestTypes("CATEGORIES");
export const SUBCATEGORIES = createRequestTypes("SUBCATEGORIES");
export const CATEGORYPRODUCTS = createRequestTypes("CATEGORYPRODUCTS");
export const SEARCH = createRequestTypes("SEARCH");

export function setUser(payload) {
  return { type: "SETUSER", payload };
}

export function setRegion(payload) {
  return { type: "SETREGION", payload };
}

export function setShippingOption(payload) {
  return { type: "SETSHIPPINGOPTION", payload };
}

function action(type, payload = {}) {
  return { type, ...payload };
}

export const product = {
  request: productId => action(PRODUCT[REQUEST], { productId }),
  success: (productId, response) =>
    action(PRODUCT[SUCCESS], { productId, response }),
  failure: (productId, error) => action(PRODUCT[FAILURE], { productId, error })
};

export const products = {
  request: category => action(PRODUCTS[REQUEST], { category }),
  success: (category, response) =>
    action(PRODUCTS[SUCCESS], { category, response }),
  failure: (category, error) => action(PRODUCTS[FAILURE], { category, error })
};

export const AddToCart = {
  request: data => action(ADDPRODUCTTOCART[REQUEST], { data }),
  success: (data, response) =>
    action(ADDPRODUCTTOCART[SUCCESS], { data, response }),
  failure: (data, error) => action(ADDPRODUCTTOCART[FAILURE], { data, error })
};

export const removeFromCart = {
  request: inItemId =>{console.log(inItemId); return action(REMOVEFROMCART[REQUEST], { inItemId })},
  success: (inItemId, response) =>{ console.log(response);
    return action(REMOVEFROMCART[SUCCESS], { inItemId, response })},
  failure: (inItemId, error) => action(REMOVEFROMCART[FAILURE], { inItemId, error })
};

export const updateProductQuantity = {
  request: data => action(UPDATEQUANTITY[REQUEST], { data }),
  success: (data, response) =>
    action(UPDATEQUANTITY[SUCCESS], { data, response }),
  failure: (data, error) => action(UPDATEQUANTITY[FAILURE], { data, error })
};

export const getCartProducts = {
  request: inCartId => action(GETCARTPRODUCTS[REQUEST], { inCartId }),
  success: (inCartId, response) =>
    action(GETCARTPRODUCTS[SUCCESS], { inCartId, response }),
  failure: (inCartId, error) =>
    action(GETCARTPRODUCTS[FAILURE], { inCartId, error })
};

export const getShippingRegions = {
  request: () => action(GETSHIPPINGREGIONS[REQUEST], {}),
  success: (status, response) => {
    return action(GETSHIPPINGREGIONS[SUCCESS], { response });
  },
  failure: error => action(GETSHIPPINGREGIONS[FAILURE], { error })
};

export const getShippingOptions = {
  request: inShippingRegionId =>
    action(GETSHIPPINGOPTIONS[REQUEST], { inShippingRegionId }),
  success: (inShippingRegionId, response) => {
    return action(GETSHIPPINGOPTIONS[SUCCESS], {
      inShippingRegionId,
      response
    });
  },
  failure: (inShippingRegionId, error) =>
    action(GETSHIPPINGOPTIONS[FAILURE], { inShippingRegionId, error })
};

export const checkUserLogin = {
  request: token => action(CHECKUSERLOGIN[REQUEST], { token }),
  success: (token, response) => action(CHECKUSERLOGIN[SUCCESS], { response }),
  failure: (token, error) => action(CHECKUSERLOGIN[FAILURE], { error })
};

export const getCategories = {
  request: () => action(CATEGORIES[REQUEST]),
  success: (id, response) => action(CATEGORIES[SUCCESS], { response }),
  failure: (id, error) => action(CATEGORIES[FAILURE], { error })
};

export const getSubCategories = {
  request: departmentId => action(SUBCATEGORIES[REQUEST], { departmentId }),
  success: (departmentId, response) =>
    action(SUBCATEGORIES[SUCCESS], { departmentId, response }),
  failure: (departmentId, error) =>
    action(SUBCATEGORIES[FAILURE], { departmentId, error })
};

export const getCategoryProducts = {
  request: data => action(CATEGORYPRODUCTS[REQUEST], { data }),
  success: (data, response) =>
    action(CATEGORYPRODUCTS[SUCCESS], { data, response }),
  failure: (data, error) => action(CATEGORYPRODUCTS[FAILURE], { data, error })
};

export const getSearchItems = {
  request: data => action(SEARCH[REQUEST], { data }),
  success: (data, response) => action(SEARCH[SUCCESS], { data, response }),
  failure: (data, error) => action(SEARCH[FAILURE], { data, error })
};
