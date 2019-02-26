import React, { Component } from "react";
import * as Actions from "../../actions";
import { connect } from "react-redux";
import ProductList from "../../components/Product/productlist";
import bag from "../../images/bag.png";
import "../../scss/categories.scss";

class Categories extends Component {
  componentDidMount() {
    console.log(this.props, this.props.categories);
    if (this.props.categories) {
      console.log("loadCategoryProducts");
      Object.values(this.props.categories).map((category, index) => {
        this.props.loadCategoryProducts({
          departmentId: category.department_id,
          descriptionLength: 120
        });
      });
    }
  }

  render() {
    // console.log(this);
    let productsList = [];
    let productCategoriesList = this.props.categoryProducts
      ? Object.values(this.props.categoryProducts)
      : [];
    productCategoriesList.map((category, index) => {
      category.map((item, ind) => {
        productsList.push(item);
      });
    });
    // console.log("productsList", productsList);
    return (
      <div className="container">
        <div className="product_filter_panel">
          <div className="row">
            <div className="col-md-12 items_block">
              <div className="pb-3">
                <h2>ALL PRODUCTS</h2>
              </div>
              <section>
                {<ProductList products={productsList ? productsList : []} />}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.get("products").categories);
  return {
    subCategories: state.get("products").subCategories,
    categories: state.get("products").categories,
    categoryProducts: state.get("products").categoryProducts,
    searchitem: state.get("products").searchItem
  };
};

const mapStateToDispatch = dispatch => ({
  loadSubCategories: categoryId =>
    dispatch(Actions.getSubCategories.request(categoryId)),
  loadCategoryProducts: data =>
    dispatch(Actions.getCategoryProducts.request(data))
});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Categories);
