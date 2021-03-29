import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import firebase from "firebase";
import { restaurants } from "../restaurants";
import { OrderStatus } from "../constants/enums";
const db = firebase.firestore();

export const OrderFood = (props) => {
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    setSelectedFood(getMyFood());
  }, []);

  useEffect(() => {
    if (props.order.status !== OrderStatus.ACTIVE) {
      props.setIsOrderFood(false);
    }
  }, [props.order]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      padding: "50px",
      width: "500px",
      transform: "translate(-50%, -50%)",
    },
  };

  const me = props.order.guests.find(
    (guest) => guest.id === props.myUserInfo.id
  );

  const onSelectItem = (event, food) => {
    setSelectedFood(food);
  };

  const getMyFood = () => {
    const me = props.order.guests.find(
      (guest) => guest.id === props.myUserInfo.id
    );
    return me ? me.itemOrdered : null;
  };

  const saveOrder = () => {
    const order = { ...props.order };
    let selectedGuest = order.guests.find(
      (guest) => guest.id === props.myUserInfo.id
    );
    if (selectedGuest) {
      selectedGuest.itemOrdered = selectedFood;
      order.guests = [
        ...order.guests.filter((guest) => guest.id !== props.myUserInfo.id),
        selectedGuest,
      ];
    } else {
      selectedGuest = props.myUserInfo;
      selectedGuest.itemOrdered = selectedFood;
      order.guests = [...order.guests, selectedGuest];
    }
    db.collection("orders").doc(order.id).update(order);
    props.setIsOrderFood(false);
  };

  const cancelOrder = () => {
    const order = { ...props.order };
    let selectedGuest = order.guests.find(
      (guest) => guest.id === props.myUserInfo.id
    );
    selectedGuest.itemOrdered = null;
    order.guests = [
      ...order.guests.filter((guest) => guest.id !== props.myUserInfo.id),
      selectedGuest,
    ];
    db.collection("orders").doc(order.id).update(order);
    props.setIsOrderFood(false);
  };

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === props.order.restaurantId
  );

  return (
    <Modal
      isOpen={true}
      contentLabel="Order View"
      style={customStyles}
      ariaHideApp={false}
      onRequestClose={() => props.setIsOrderFood(false)}
    >
      <div className="container">
        <div className="row">
          <div className="col-10">
            <h1>{selectedRestaurant.name}</h1>
          </div>
          <div
            className="col-1"
            onClick={() => {
              props.setIsOrderFood(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Autocomplete
              clearOnEscape
              onChange={onSelectItem}
              value={selectedFood}
              clearOnBlur
              id="combo-box-demo"
              options={selectedRestaurant.menu}
              getOptionLabel={(option) => `${option.title}  ${option.price} €`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Food"
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <br></br>
        <div>
          <button
            type="button"
            disabled={!selectedFood}
            className="btn btn-primary"
            onClick={saveOrder}
          >
            Save
          </button>
          {me && me.itemOrdered && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={cancelOrder}
            >
              Cancel Order
            </button>
          )}
          <button
            type="button"
            className="btn btn-light"
            onClick={() => props.setIsOrderFood(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
