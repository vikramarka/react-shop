import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "../../scss/cart.scss";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";
import { confirmAlert } from 'react-confirm-alert'; 
import * as Actions from "../../actions";
import 'react-confirm-alert/src/react-confirm-alert.css'

class Items extends Component {
  constructor(props) {
    super(props);
    this.state={
      buttonStyles:{cursor:"pointer"},
      cart:{}
    }
  }
  componentWillReceiveProps(props)
  {
    let state=this.state;
    state["buttonStyles"]={pointerEvents: "auto","cursor":"pointer"};
    console.log(props.cart.count,this.state.cart.count)
    if(props.cart.count)
     {
        if(!this.state.cart.count)
        {
            this.props.getCartProducts(props.cart.inCartId);
        }
        else if(props.cart.count!=this.state.cart.count)
        {
          this.props.getCartProducts(props.cart.inCartId);
        }
        state["cart"]=props.cart;
     }
    this.setState(state);

  }
  remove(e)
  {
    let props=this.props;
    let this_ref=this;
    let item=e.currentTarget.getAttribute("data-item");
    confirmAlert({
      title: e.currentTarget.getAttribute("data-name"),
      message: 'remove this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let state=this_ref.state;
            state["buttonStyles"]={pointerEvents: "none"};
            this_ref.setState(state);
            return props.removeFromCart(item);

          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }
  update(e)
  {
    let state=this.state;
    let this_ref=this;
    state["buttonStyles"]={pointerEvents: "none"};
    this.setState(state);
    let count=parseInt(e.currentTarget.getAttribute("data-quantity"));
    let param=parseInt(e.currentTarget.getAttribute("data-param"));
    count=count+param;
    if(count<0)
    {
      let state=this.state;
      state["buttonStyles"]={pointerEvents: "auto","cursor":"pointer"};
      this.setState(state);
    }
    else
    {
      this.props.updateProductQuantity({inItemId:e.currentTarget.getAttribute("data-item"),inQuantity:count});
    }
    
  }
  render() {
    let cart = { count: 0, products: [] };
    if (this.props.cart) cart = this.props.cart;
    let this_ref=this;
    return (
      <React.Fragment>
        <div class="pt-5 mb-5">
          <div class="container">
            <div class="bg-white cart-block">
              <div class="row">
                <div class="col-md-10 offset-md-1">
                  <h2>{cart.count} Items In Your Cart</h2>
                  <div class="cart-top-block pt-2 pb-2 mb-3">
                    <ul class="list-unstyled">
                      <li>Item</li>
                      <li>Size</li>
                      <li>Quantity</li>
                      <li>Price</li>
                    </ul>
                    <div class="clearfix" />
                  </div>
                  <div class="cart-bot-block">
                    {cart.products.map(function(product) {
                      return (
                        <div class="cart-single-block">
                          <ul class="list-unstyled">
                            <li class="img-block">
                              <img
                                src={require(`../../images/product_images/${
                                  product.thumbnail
                                    ? product.thumbnail
                                    : "afghan-flower-2.gif"
                                }`)}
                              />
                              <span>
                                <h3>{product.name}</h3>
                                <p>Men BK3569</p>
                                <p class="remove">
                                  <a data-item={product.item_id} data-name={product.name} style={this_ref.state.buttonStyles} onClick={this_ref.remove.bind(this_ref)}>
                                    <span>&#10005;</span> Remove
                                  </a>
                                </p>
                              </span>
                            </li>
                            <li>XXL</li>
                            <li class="quantity-block">
                              <span>
                                <a data-param="-1" data-item={product.item_id} data-quantity={product.quantity} style={this_ref.state.buttonStyles} onClick={this_ref.update.bind(this_ref)} >&#8722;</a>
                              </span>
                              <span class="number-block">
                                {product.quantity}
                              </span>
                              <span>
                                <a data-param="1" data-item={product.item_id} style={this_ref.state.buttonStyles} data-quantity={product.quantity} onClick={this_ref.update.bind(this_ref)}  >&#43;</a>
                              </span>
                            </li>
                            <li class="price">&#163;{product.price}</li>
                          </ul>
                          <div class="clearfix" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div class="container cart-bottom-block">
              <div class="row">
                <div class="col-md-10 offset-md-1">
                  <LinkContainer to={"/"} className="btn btn-md btn-white">
                    <a>Back to Shop</a>
                  </LinkContainer>
                  <LinkContainer to={"/checkout"} className="btn btn-md">
                    <a>Checkout</a>
                  </LinkContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    cart: state.get("products").cart
  };
};

const mapStateToDispatch = dispatch => ({
  updateProductQuantity: (data) => dispatch(Actions.updateProductQuantity.request(data)),
  removeFromCart:(inItemId) => dispatch(Actions.removeFromCart.request(inItemId)),
  getCartProducts: token => dispatch(Actions.getCartProducts.request(token))

});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Items);
