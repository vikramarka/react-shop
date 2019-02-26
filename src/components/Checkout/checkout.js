import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "../../scss/checkout.scss";
import Delivery from "./delivery";
import Conformation from "./conformation";
import Payment from "./payment";
import Image from "react-bootstrap/Image";
import successimage from "../../images/success-image.png";
import * as Actions from "../../actions";

import { connect } from "react-redux";

import {
  StripeProvider,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      stages: [
        {
          next: "Next step",
          back: "Back",
          name:"delivery"
        },
        {
          next: "Next step",
          back: "Back",
          name:"conformation"
        },
        {
          next: "Pay",
          back: "Back",
          name:"payment"
        },
        {
          next: "Back to Shop",
          name:"finish"
        }
      ],
      delivery:{},
      conformation:{},
      payment:{},
      finish:{},
      errors:[]
    };
  }
  setDelivarydetails(e,child)
  {
    let state=this.state;
    state["delivery"]=child;
    state["delivery"]["errors"]=[]
    
    this.setState(state);
  }
  showstages() {
    if (this.state.stage == 0) {
      return <Delivery setDelivarydetails={this.setDelivarydetails.bind(this)}/>;
    } else if (this.state.stage == 1) {
      return <Conformation />;
    } else if (this.state.stage == 2) {
      return (
        <StripeProvider apiKey="pk_test_7bmdPQNsz569HDDDKiNUn76k">
          <Elements>
            <Payment />
          </Elements>
        </StripeProvider>
      );
    } else {
      return (
        <Row className="success-block">
          <Col
            md={6}
            lg={4}
            className="offset-md-3 offset-lg-4 pb-5 text-center"
          >
            <div>
              <Image
                src={successimage}
                className="justify-content-start nav-logo"
                fluid
              />
              <h1>Success!</h1>
              <p>
                Your items will be shipped shortly, you will get email with
                details.
              </p>
            </div>
            <button type="button" className="btn btn-md next_step mt-4">
              Back to shop
            </button>
          </Col>
        </Row>
      );
    }
  }
  backStage() {
    let state = this.state;
    state["stage"] = state["stage"] - 1;
    this.setState(state);
  }
  nextStage() {
    // if(){
    //   if(!state["delivery"]["address1"])
    //   {
    //       state["delivery"]["errors"].push("Name is required");
    //   }
    //   if(!state["delivery"]["city"])
    //   {
    //       state["delivery"]["errors"].push("City is required");
    //   }
    //   if(!state["delivery"]["zip"])
    //   {
    //       state["delivery"]["errors"].push("Zip code is required");
    //   }
    //   if(!state["delivery"]["country"])
    //   {
    //       state["delivery"]["errors"].push("Country code is required");
    //   }
    //   if(!state["delivery"]["region"])
    //   {
    //       state["delivery"]["errors"].push("Should select a region");
    //   }
    //   if(!state["delivery"]["shippingOption"])
    //   {
    //       state["delivery"]["errors"].push("Should select a delivery option.");
    //   }
    // }
    let state = this.state;
    state["stage"] = state["stage"] + 1;
    this.setState(state);
  }

  showErrors()
  {
      let errors=this.state[this.state.stages[this.state.stage].name]["errors"]
      if(errors)
      {
          return(
            <div>
              {
                errors.map(function(error){
                  return(
                    <div className="alert alert-danger">{error}</div>
                  )
                })
              }
            </div>
          )
      }
  }

  render() {
    console.log(this.props);
    let finalstage = false;
    if (this.state.stage >= 3) finalstage = true;
    return (
      <React.Fragment>
        <Container>
          <div className="checkout_information">
            <form>
              <Row className="checkout_block">
                <Col md={12}>
                  {this.showErrors()}
                  <h2>Checkout</h2>
                  <ul className="list-unstyled color-codes">
                    <li
                      className={
                        this.state.stage >= 0
                          ? "bg-red dot  active_next"
                          : "bg-red dot"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 1 ? "bar active_next" : "bar"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 1
                          ? "bg-red dot  active_next"
                          : "bg-red dot"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 2 ? "bar active_next" : "bar"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 2
                          ? "bg-red dot  active_next"
                          : "bg-red dot"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 3 ? "bar active_next" : "bar"
                      }
                    />
                    <li
                      className={
                        this.state.stage >= 3
                          ? "bg-red dot  active_next"
                          : "bg-red dot"
                      }
                    />
                  </ul>
                </Col>
                <Col md={12}>
                  <ul className="list-unstyled progress-txt">
                    <li>
                      <a href="#">
                        <h3>Delivery</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <h3>Conformation</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <h3>Payment</h3>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <h3>Finish</h3>
                      </a>
                    </li>
                  </ul>
                </Col>

                {this.showstages()}
              </Row>
              {finalstage ? (
                <div />
              ) : (
                <div className="checkout_next">
                  <button
                    onClick={this.backStage.bind(this)}
                    type="button"
                    className="btn btn-md btn-white back"
                  >
                    {this.state.stages[this.state.stage].back}
                  </button>
                  <button
                    onClick={this.nextStage.bind(this)}
                    type="button"
                    className="btn btn-md next_step"
                  >
                    {this.state.stages[this.state.stage].next}
                  </button>
                </div>
              )}
            </form>
          </div>
        </Container>
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
  getCartProducts: () => dispatch(Actions.getCartProducts.request())
});

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Checkout);
