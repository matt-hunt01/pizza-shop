import React, { Component } from "react";
import "./App.css";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

const PIZZA_SIZE = gql`
  query PizzaSizeByName($size: PizzaSizes!) {
    pizzaSizeByName(name: $size) {
      maxToppings
      basePrice
      name
      toppings {
        topping {
          name
          price
        }
        defaultSelected
      }
    }
  }
`;

class Pizza extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizeSelected: "SMALL",
      PizzaToppings: null,
      totalPrice: 0,
      maxToppings: 0,
      checkedToppings: [],
      checkedToppingsCount: 0
    };
    this.onSizeChange = this.onSizeChange.bind(this);
    this.fetchPizzaSizes = this.fetchPizzaSizes.bind(this);
    this.onToppingsSelected = this.onToppingsSelected.bind(this);
    this.onAddCart = this.onAddCart.bind(this);
  }
  componentWillMount() {
    this.fetchPizzaSizes();
  }
  fetchPizzaSizes() {
    this.props.client
      .query({
        query: PIZZA_SIZE,
        variables: { size: `${this.state.sizeSelected}` }
      })
      .then(result => {
        return this.setState({
          PizzaToppings: result.data.pizzaSizeByName.toppings,
          checkedToppings: result.data.pizzaSizeByName.toppings.map(
            selected => selected.defaultSelected
          ),
          totalPrice:
            result.data.pizzaSizeByName.toppings
              .filter(item => item.defaultSelected)
              .reduce((acc, curr) => curr.topping.price + acc, 0) +
            result.data.pizzaSizeByName.basePrice,
          maxToppings: result.data.pizzaSizeByName.maxToppings
        });
      })
      .catch(err => console.error(err));
  }

  onSizeChange(e) {
    const { value } = e.target;
    this.setState({ sizeSelected: value }, this.fetchPizzaSizes);
  }

  onToppingsSelected(e, index) {
    const { checked, value } = e.target;
    let arr = this.state.checkedToppings;
    if (checked) {
      arr[index] = true;
      this.setState({
        totalPrice: parseFloat(this.state.totalPrice) + parseFloat(value),
        checkedToppings: arr,
        checkedToppingsCount: this.state.checkedToppings.filter(item => item)
          .length
      });
    } else {
      arr[index] = false;
      this.setState({
        totalPrice: parseFloat(this.state.totalPrice) - parseFloat(value),
        checkedToppings: arr,
        checkedToppingsCount: this.state.checkedToppings.filter(item => item)
          .length
      });
    }
  }

  onAddCart(e) {
    e.preventDefault();
    this.props.addCart(this.state.totalPrice, this.state.sizeSelected);
  }

  render() {
    const {
      totalPrice,
      PizzaToppings,
      checkedToppings,
      maxToppings,
      checkedToppingsCount
    } = this.state;
    console.log(this.props);
    return (
      <div className="pizza-wrapper">
        <div className="pizza-item">
          <h1 className="heading">Pizza Shop</h1>
          <h2>Select your pizza size:</h2>
          <input
            onChange={this.onSizeChange}
            id="small"
            type="radio"
            name="pizza-size"
            value="SMALL"
            defaultChecked
          />
          <label htmlFor="small">Small</label>
          <input
            onChange={this.onSizeChange}
            id="medium"
            type="radio"
            name="pizza-size"
            value="MEDIUM"
          />
          <label htmlFor="medium">Medium</label>
          <input
            onChange={this.onSizeChange}
            id="large"
            type="radio"
            name="pizza-size"
            value="LARGE"
          />
          <label htmlFor="large">Large</label>

          <h3 style={{ textAlign: "left" }}>Select your toppings:</h3>
          <div className="pizza-topping">
            {PizzaToppings ? (
              PizzaToppings.map((data, index) => {
                return (
                  <div className="pizza-topping-item" key={index}>
                    <input
                      type="checkbox"
                      name={data.topping.name}
                      value={data.topping.price}
                      id={data.topping.name}
                      checked={checkedToppings[index]}
                      disabled={
                        checkedToppingsCount >=
                          (!maxToppings ? 10 : maxToppings) &&
                        checkedToppings[index] === false
                      }
                      onChange={e => this.onToppingsSelected(e, index)}
                    />
                    <label htmlFor={data.topping.name}>
                      {data.topping.name}
                    </label>
                  </div>
                );
              })
            ) : (
              <div>Loading Toppings ...</div>
            )}
          </div>
          {maxToppings !== null && checkedToppingsCount >= maxToppings && (
            <div className="max-toppings-error">
              You can select maximum {maxToppings} toppings.
            </div>
          )}

          <div className="pizza-price">
            Total:{" "}
            {totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            })}
          </div>

          <div className="add-to-cart">
            {PizzaToppings && (
              <button
                className="add-to-cart-btn btn"
                type="button"
                name="Add to Cart"
                onClick={this.onAddCart}
              >
                + Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(Pizza);
