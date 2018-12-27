import React, { Component } from "react";
import "./App.css";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = { cart: [], totalPrice: 0 };
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onClearCart = this.onClearCart.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cart: [...this.state.cart, nextProps.item],
      totalPrice: this.state.totalPrice + nextProps.item.pizzaPrice
    });
  }

  onRemoveItem(e, item, index) {
    e.preventDefault();
    this.setState({
      cart: this.state.cart.filter(curr => curr !== item),
      totalPrice: this.state.totalPrice - item.pizzaPrice
    });
  }

  onClearCart(e) {
    e.preventDefault();
    this.setState({
      cart: [],
      totalPrice: 0
    });
  }

  render() {
    const { cart, totalPrice } = this.state;
    return (
      <div className="cart">
        <div className="cart-wrapper">
          <h1 className="heading">Cart</h1>
          {cart &&
            cart.map((item, index) => {
              return (
                <div className="cart-item" key={index}>
                  <strong className="cart-item-header">Pizza</strong>
                  <span
                    className="remove-cart-item"
                    onClick={e => this.onRemoveItem(e, item, index)}
                  >
                    -
                  </span>
                  <span className="pizza-size-cart">
                    Pizza Size: {item.pizzaSize}
                  </span>
                  <span className="pizza-price-cart">
                    {item.pizzaPrice.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD"
                    })}
                  </span>
                </div>
              );
            })}
          <div className="cart-footer">
            <button className="btn clear-cart" onClick={this.onClearCart}>
              Clear Cart
            </button>
            <span className="cart-total">
              {totalPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
