/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavBar from './components/Navbar/navbar';
import {RootStack} from './routes/navigationRoutes';
import Footer from './components/Footer/footer';
import { connect } from "react-redux";
import * as Actions from "./actions";
import { getCookie } from "./services/helpers";
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Immutable from "immutable";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import createReducers from "./reducers";
import rootSaga from "./sagas";

const AppContainer = createAppContainer(RootStack);

type Props = {};

function demoAsyncCall() {
  return new Promise(resolve => setTimeout(() => resolve(), 2500));
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { token: "null", loaded: true, loading: true };
    const initialState = Immutable.Map();


    //create saga middleware
    const sagaMiddleware = createSagaMiddleware();

    //array of middlewares. In future if we add any other middleware we can add here.
    const middlewares = [sagaMiddleware];

    const enhancers = [applyMiddleware(...middlewares)];

    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
      process.env.NODE_ENV !== "production" &&
      typeof window === "object" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
            // Prevent recomputing reducers for `replaceReducer`
            shouldHotReload: false
          })
        : compose;
    this.store = createStore(
      createReducers(),
      initialState,
      composeEnhancers(...enhancers)
    );

    sagaMiddleware.run(rootSaga);
  }


  render() {
      return (
        <Provider store={this.store}>
          <NavBar />
          <AppContainer />
          <Footer />
        </Provider>
        );
      }
}

export default App;
