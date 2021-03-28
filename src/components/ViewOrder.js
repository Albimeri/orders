import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { restaurants } from "../restaurants";

export const ViewOrder = (props) => {
  const [guests, setGuests] = useState([]);

  useEffect(() => { 
    setGuests(props.order.guests.filter((guest) => guest.itemOrdered));
  }, [props.order]);

  const getTotal = () => {
    let result = 0;
    props.order.guests
      .filter((guest) => guest.itemOrdered)
      .forEach((guest) => (result += guest.itemOrdered.price));
    return result;
  };

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === props.order.restaurantId
  );

  return (
    <Modal
      ariaHideApp={false}
      isOpen={true}
      contentLabel="Order View"
      style={{
        overlay: {
          bottom: 65,
        },
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-11">
            <h1>{selectedRestaurant.name}</h1>
          </div>
          <div
            className="col-1"
            onClick={() => {
              props.setIsViewOrder(false);
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
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Item</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest, index) => (
                  <>
                    <tr key={guest.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        {guest.name} {guest.lastName}
                      </td>
                      <td>{guest.itemOrdered.title}</td>
                      <td>{guest.itemOrdered.price}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <p>
              <b>Total price:</b> {getTotal()}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
