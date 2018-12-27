import React, { Component } from "react";
import "./App.css";
import Pizza from "./Pizza";
import Cart from "./Cart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pizzaPrice: null,
      pizzaSize: null
    };
    this.addCart = this.addCart.bind(this);
  }

  addCart(price, size) {
    this.setState({ pizzaPrice: price, pizzaSize: size });
  }

  render() {
    const { pizzaPrice, pizzaSize } = this.state;
    return (
      <div className="App">
        <Pizza addCart={this.addCart} />
        <Cart item={!pizzaPrice || !pizzaSize ? null : this.state} />
      </div>
    );
  }
}

export default App;
