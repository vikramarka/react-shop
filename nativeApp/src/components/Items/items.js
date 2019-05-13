import React, { Component } from "react";
import { connect } from "react-redux";
import Footer from '../../components/Footer/footer';
import * as Actions from "../../actions";
import {styles} from '../../containers/Home/home-styles';
//import "react-confirm-alert/src/react-confirm-alert.css";

import {Alert, Text, View,Button, TouchableOpacity, Image, ScrollView} from 'react-native';
import NavigationService from '../../routes/NavigationService.js';
class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonStyles: {},
      cart: {}
    };
  }
  componentDidMount() {
    const props = this.props;
    let state = this.state;
    state["buttonStyles"] = {};
    if (props.cart) {
      if (props.cart.count !== undefined && props.cart.count != null) {
        if (props.cart.count <= 0) {
          state["buttonStyles"] = {};
        }
        state["cart"] = props.cart;
      }
    }
   
    if(props.cart){
      if (props.cart.count !== undefined && props.cart.count !== null) {
        if (
          this.state.cart.count === undefined ||
          this.state.cart.count === null
        ) {
          this.props.getCartProducts({
            token: props.token,
            inCartId: props.cart.inCartId
          });
        } else if (props.cart.count >0 && props.cart.products.length<=0) {
          this.props.getCartProducts({
            token: props.token,
            inCartId: props.cart.inCartId
          });
        }
        if (props.cart.count <= 0) {
          state["buttonStyles"] = {};
        }
        state["cart"] = props.cart;
      }
    }
    this.setState(state);
  }
  componentWillReceiveProps(props) {
    let state = this.state;
    state["buttonStyles"] = {};    
    if(props.cart){
      if (props.cart.count !== undefined && props.cart.count !== null) {
        if (
          this.state.cart.count === undefined ||
          this.state.cart.count === null
        ) {
          this.props.getCartProducts({
            token: props.token,
            inCartId: props.cart.inCartId
          });
        } else if (props.cart.count !== this.state.cart.count) {
          this.props.getCartProducts({
            token: props.token,
            inCartId: props.cart.inCartId
          });
        }
        if (props.cart.count <= 0) {
          state["buttonStyles"] = {};
        }
        state["cart"] = props.cart;
      }
    }
    this.setState(state);
  }
  remove(pid, pname) {
    let props = this.props;
    let this_ref = this;
    let item = pid;    
    Alert.alert(
      pname,
      'remove this product?',
      [  
        {text: 'Yes', onPress: () => {
          let state = this_ref.state;
          this_ref.setState(state);
          return props.removeFromCart({ token: props.token, inItemId: item });
        }},      
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        
      ],
      {cancelable: false},
    );    
  }
  update(pid, pqty, qtyNum) {   
    let state = this.state;   
    state["buttonStyles"] = {};
    this.setState(state);
    let count = parseInt(pqty);    
    let param = parseInt(qtyNum);    
    count = count + param;
    if (count < 0) {
      let state = this.state;
      state["buttonStyles"] = {};
      this.setState(state);
    } else {
      this.props.updateProductQuantity({
        token: this.props.token,
        inItemId: pid,
        inQuantity: count
      });
    }
  }
  render() {
    let cart = { count: 0, products: [] };
    if (this.props.cart) cart = this.props.cart;
    let hasItems = cart.count > 0 ? true : false;
    let this_ref = this;
    return (
      <ScrollView style={styles.home}>       
        {hasItems ? (
          <View style={styles.cart_page_wraper}>            
              <View style={styles.cart_page_block}>         
                    <View style={styles.cart_top_block}>
		 					<Text style={{...styles.h2, ...styles.black, ...styles.ptitle}}>{cart.count} Items In Your Cart</Text>
                      {cart.products.map(function(product, key) {
                        return (
                          <View key={key}>
                            <View style={styles.cart_single_block}>
                              <View style={styles.product_img}>
                                <Image style={{width: 100, height: 100,}}
                                  source={require("../../images/product_images/afghan-flower-2.gif")}
                                />                                                                 
                              </View>
										<View style={styles.img_right_block}>
											<Text style={{ fontSize:16, fontWeight: '700', color:'#2e2e2e', marginBottom: 15}}>{product.name}</Text>
                              	<Text style={{ fontSize:14, fontWeight: '400', color:'#2e2e2e', marginBottom: 15}}>Men BK3569</Text>                                  
                                <Text style={{ fontSize:10, fontWeight: '400', color:'#f62f5e'}} onPress={this_ref.remove.bind(this_ref, product.item_id, product.name)}>&#10005; Remove	</Text>
										</View> 
                            </View>  
									<View style={styles.cart_size_block}>
										<Text style={{color: '#b4b4b4', fontWeight: '700', fontSize: 14,}}>XXL</Text>
                              <View style={{ flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'center', width: 150,}}>
                                  <Text style={styles.quantity} onPress={this_ref.update.bind(this_ref, product.item_id, product.quantity, -1)}                                  >
                                    &#8722;
                                  </Text> 
											 
                                <Text style={{paddingLeft: 10, paddingRight: 10, color: '#2e2e2e', fontSize: 20, fontWeight: '700',}}>
                                  {product.quantity}
                                </Text>  
                                  <Text style={styles.quantity} onPress={this_ref.update.bind(this_ref, product.item_id, product.quantity, 1)}>
                                    &#43;
                                  </Text>
                              </View>
                              <Text style={{fontSize: 22, fontWeight: '700', color: '#2e2e2e',}}>
                                ${(product.quantity * product.price).toFixed(2)}
                              </Text>
									</View>
                          </View>
                        );
                      })}
                    </View>                  
              </View>
              <View style={styles.cart_bottom_block}>                              
					 <TouchableOpacity onPress={() => {
					 NavigationService.navigate('Categories', {
						itemId: 1,
						categoryName: "Regional",
					 });
					 }}><Text style={styles.button}>Back to shop</Text></TouchableOpacity>

					 <TouchableOpacity onPress={() => {
					 NavigationService.navigate('Checkout');
					 }}><Text style={styles.button}>Checkout</Text></TouchableOpacity>
              </View>            
          </View>
        ) : (
          <View style={styles.no_items_block}>            
              <View>                
                  <Text style={styles.loggedin_text}>There no items in the cart.</Text>                
              </View>
              <View style={styles.back_to_shop_btn}>                               
						<TouchableOpacity onPress={() => {
                    NavigationService.navigate('Categories', {
                      itemId: 1,
                      categoryName: "Regional",
                    });
                    }}><Text style={styles.button}>Back to shop</Text></TouchableOpacity>
              </View>            
          </View>
        )}
        <Footer />        
      </ScrollView>
    );
  }
}
const mapStateToProps = state => {
  return {    
    cart: state.get("products").cart,
    token: state.get("user").token
  };
};

const mapStateToDispatch = dispatch => ({  
  updateProductQuantity: data =>
  dispatch(Actions.updateProductQuantity.request(data)),
  removeFromCart: data => dispatch(Actions.removeFromCart.request(data)),
  getCartProducts: data => dispatch(Actions.getCartProducts.request(data))
});

export default connect(
  mapStateToProps,
  mapStateToDispatch,
  null,
  {pure:false}
)(Items);
