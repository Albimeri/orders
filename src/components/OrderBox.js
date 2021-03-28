import React, { useState, useEffect } from "react";
import { restaurants } from "../restaurants";
import { OrderStatus } from "../constants/enums";
import { SelectUsers } from "./SelectUsers";
import firebase from "firebase";
import Modal from "react-modal";
const db = firebase.firestore();

export const OrderBox = ({
  order,
  myUserInfo,
  setSelectedOrder,
  setIsOrderFood,
  allUsers,
  setIsViewOrder,
}) => {
  const [isDeletePromp, setIsDeletePrompt] = useState(false); 
  
  const deleteOrder = (orderId) => {
    db.collection("orders")
      .doc(orderId)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const isMyOrder = (order) => {
    return order.author.id === myUserInfo.id;
  };

  const canSeeOrder = (order) => {
    if (!myUserInfo) {
      return false;
    }
    const guestIds = order.guests.map((guest) => guest.id);
    return (
      guestIds.includes(myUserInfo.id) ||
      order.author.id === myUserInfo.id ||
      order.isPublic
    );
  };

  const cancelOrder = (order, isCanceled) => {
    db.collection("orders")
      .doc(order.id)
      .set({
        ...order,
        status: isCanceled ? OrderStatus.CANCELED : OrderStatus.ACTIVE,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const closeOrder = (order, isClosed) => {
    db.collection("orders")
      .doc(order.id)
      .set({
        ...order,
        status: isClosed ? OrderStatus.CLOSED : OrderStatus.ACTIVE,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const setIsPublic = (order, isPublic) => {
    db.collection("orders")
      .doc(order.id)
      .set({ ...order, isPublic })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const setSelectedGuests = (guests, order) => {
    db.collection("orders")
      .doc(order.id)
      .set({ ...order, guests })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const getPeopleWhoOrdered = (guests) => {
    const fullList = guests.filter((guest) => guest.itemOrdered);
    let result = "";
    if (!fullList) {
      return result;
    }
    if (fullList.length === 0) {
      result = `None ordered yet`;
    }
    if (fullList.length === 1) {
      result = `${fullList[0].name} already ordered`;
    }
    if (fullList.length === 2) {
      result = `${fullList[0].name} and ${fullList[1].name} already ordered`;
    }
    if (fullList.length === 3) {
      result = `${fullList[0].name}, ${fullList[1].name} and ${
        fullList.length - 2
      } other already ordered`;
    }
    if (fullList.length > 3) {
      result = `${fullList[0].name}, ${fullList[1].name} and ${
        fullList.length - 2
      } others already ordered`;
    }
    return result;
  };

  const getStatusTag = (status) => {
    switch (status) {
      case OrderStatus.CANCELED: {
        return <span className="badge badge-danger">Canceled</span>;
      }
      case OrderStatus.CLOSED: {
        return <span className="badge badge-dark">Closed</span>;
      }
      case OrderStatus.EXPIRED: {
        return <span className="badge badge-dark">Expired</span>;
      }
      default: {
        return <span className="badge badge-success">Active</span>;
      }
    }
  };

  return (
    <>
      {canSeeOrder(order) && (
        <div className="col-4 min-width-order" key={order.id}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className={isMyOrder(order) ? "col-6" : "col-9"}>
                  <h5 className="card-title">
                    {
                      restaurants.find(
                        (restaurant) => order.restaurantId === restaurant.id
                      ).name
                    }
                  </h5>
                </div>
                <div className="col-3">{getStatusTag(order.status)}</div>

                {isMyOrder(order) && (
                  <>
                    {order.status !== OrderStatus.CLOSED &&
                      order.status !== OrderStatus.EXPIRED && (
                        <div
                          className="col-1 cursor-pointer"
                          onClick={() => closeOrder(order, true)}
                        >
                          <img
                            width="20"
                            height="20"
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Ic_lock_outline_48px.svg"
                            alt="Close order"
                          />
                        </div>
                      )}
                    {order.status === OrderStatus.CLOSED &&
                      order.status !== OrderStatus.EXPIRED && (
                        <div
                          className="col-1 cursor-pointer "
                          onClick={() => closeOrder(order, false)}
                        >
                          <img
                            width="20"
                            height="20"
                            src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Ic_lock_open_48px.svg"
                            alt="Open order"
                          />
                        </div>
                      )}
                    <div className="col-1 cursor-pointer">
                      <svg
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDeletePrompt(true);
                        }}
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
                  </>
                )}
              </div>
              <div>
                <h6>
                  Created by
                  {myUserInfo.id === order.author.id
                    ? " you"
                    : ` ${order.author.name} ${order.author.lastName}`}
                </h6>
              </div>
              <p className="card-text">{getPeopleWhoOrdered(order.guests)}</p>
              {/* <p className="card-text">
                <small className="text-muted">
               
                </small>
              </p> */}
              {isMyOrder(order) && order.status === OrderStatus.ACTIVE && (
                <>
                  <div className="row">
                    <div className="col-3">
                      <div
                        className="form-check cursor-pointer"
                        onClick={() => setIsPublic(order, true)}
                      >
                        <input
                          className="form-check-input cursor-pointer"
                          type="radio"
                          onChange={() => {}}
                          checked={order.isPublic}
                        />
                        <label className="form-check-label cursor-pointer">
                          Public
                        </label>
                      </div>
                    </div>

                    <div className="col-3 ">
                      <div
                        className="form-check cursor-pointer"
                        onClick={() => setIsPublic(order, false)}
                      >
                        <input
                          className="form-check-input cursor-pointer"
                          type="radio"
                          onChange={() => {}}
                          checked={!order.isPublic}
                        />
                        <label className="form-check-label cursor-pointer">
                          Private
                        </label>
                      </div>
                    </div>
                  </div>
                  {!order.isPublic && (
                    <>
                      <br></br>
                      <div className="row">
                        <SelectUsers
                          users={allUsers.filter(
                            (user) => user.id !== myUserInfo.id
                          )}
                          setSelectedGuests={(guests) =>
                            setSelectedGuests(guests, order)
                          }
                          width={"100%"}
                          defaultValue={order.guests.filter(
                            (guest) => guest.id !== order.author.id
                          )}
                        />
                      </div>
                    </>
                  )}
                  <br></br>
                </>
              )}
              {OrderStatus.ACTIVE === order.status && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsOrderFood(true);
                  }}
                >
                  Order
                </button>
              )}
              <button
                type="button"
                className="btn btn-white"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsViewOrder(true);
                }}
              >
                View
              </button>
              {OrderStatus.ACTIVE === order.status && isMyOrder(order) && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => cancelOrder(order, true)}
                >
                  Cancel
                </button>
              )}
              {OrderStatus.CANCELED === order.status && isMyOrder(order) && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => cancelOrder(order, false)}
                >
                  Reactivate Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {isDeletePromp && (
        <Modal
          ariaHideApp={false}
          isOpen={isDeletePromp}
          onRequestClose={() => setIsDeletePrompt(false)}
          contentLabel="Example Modal"
          style={{
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
          }}
        >
          <h5>
            Are you sure you want te delete "
            {
              restaurants.find(
                (restaurant) => restaurant.id === order.restaurantId
              ).name
            }
            " order?
          </h5>
          <br></br>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                deleteOrder(order.id);
                setIsDeletePrompt(false);
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                setIsDeletePrompt(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};
