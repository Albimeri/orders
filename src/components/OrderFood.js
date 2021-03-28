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
      width: "600px",
      transform: "translate(-50%, -50%)",
    },
  };

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
    db.collection("orders").doc(order.id).set(order);
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
    db.collection("orders").doc(order.id).set(order);
    props.setIsOrderFood(false);
  };

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === props.order.restaurantId
  );

  const canCancelOrder = ()=>{
    const selectedGuest = props.order.guests.find((guest) => guest.id === props.myUserInfo.id);
    return selectedGuest && selectedGuest.itemOrdered
  }

  return (
    <Modal
      isOpen={true}
      contentLabel="Order View"
      style={customStyles}
      ariaHideApp={false}
    >
      <h1>{selectedRestaurant.name}</h1>
      <div>
        <Autocomplete
          clearOnEscape
          onChange={onSelectItem}
          value={selectedFood}
          clearOnBlur
          id="combo-box-demo"
          options={selectedRestaurant.menu}
          getOptionLabel={(option) => `${option.title}  ${option.price} €`}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search Food"
              variant="outlined"
            />
          )}
        />
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
        {props.order.guests.find((guest) => guest.id === props.myUserInfo.id)
          .itemOrdered && (
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
    </Modal>
  );
};
