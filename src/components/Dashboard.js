import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { generateId } from "./CommonHelpers";
import firebase from "firebase";
import { CreateOrder } from "./CreateOrder";
import { OrderFood } from "./OrderFood";
import { ViewOrder } from "./ViewOrder";
import { OrderBox } from "./OrderBox";
import { OrderStatus } from "../constants/enums";
import moment from "moment";

const Dashboard = () => {
  const [error, setError] = useState("");
  const [myUserInfo, setMyUserInfo] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOrder, setIsViewOrder] = useState(false);
  const [isOrderFood, setIsOrderFood] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { currentUser, logout } = useAuth();
  const histroy = useHistory();
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userInfo = doc.data();
          setMyUserInfo(userInfo);
        } else {
          handleLogOut();
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [currentUser.uid]);

  useEffect(() => {
    fetchData();
  }, [myUserInfo]);

  useEffect(() => {
    if (orders.length === 0) {
      return;
    }
    const batch = db.batch();
    orders.forEach((item) => {
      const hours = moment
        .duration(moment().diff(moment(item.createdAt)))
        .asHours();
      if (hours > 5) {
        const toRemoveOrder = db.collection("orders").doc(item.id);
        batch.delete(toRemoveOrder);
      }
    });
    batch.commit();
  }, [orders]);

  const fetchData = async () => {
    if (!myUserInfo) {
      return;
    }
    const unsubscribeUsers = db
      .collection("users")
      .where("companyId", "==", myUserInfo.companyId)
      .onSnapshot((querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            users.push(doc.data());
          }
        });
        setAllUsers(users);
      });
    const unsubscribeOrders = db
      .collection("orders")
      .where("companyId", "==", myUserInfo.companyId)
      .onSnapshot((querySnapshot) => {
        let orders = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const order = doc.data();
            orders.push(order);
          }
        });
        debugger;
        // db.collection("orders").doc(item.id).delete();

        setOrders(orders);
      });
    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
    };
  };

  const handleLogOut = async () => {
    setError("");
    try {
      await logout();
      histroy.push("/");
    } catch {
      setError("Failed to logout");
    }
  };

  const createOrder = (restaurant, selectedGuests, isPublic, minutes = 15) => {
    if (!restaurant) {
      return;
    }
    const dateNow = new Date();
    let endsAt = new Date();
    const id = generateId();
    endsAt.setMinutes(dateNow.getMinutes() + minutes);
    const order = {
      id,
      createdAt: dateNow.toISOString(),
      endsAt: endsAt.toISOString(),
      author: myUserInfo,
      isPublic,
      guests: isPublic ? allUsers : selectedGuests,
      restaurant,
      status: OrderStatus.ACTIVE,
      companyId: myUserInfo.companyId,
    };
    setModalIsOpen(false);
    db.collection("orders")
      .doc(id)
      .set(order)
      .then(() => {
        console.log("Order successfully created!");
      })
      .catch((error) => {
        console.error("Error creating an order: ", error);
      });
  };

  const canCreateOrder = () => {
    const myOrders = orders.filter(
      (order) => order.author.id === currentUser.uid
    );
    return myOrders.length > 2;
  };

  const tryCreateOrder = () => {
    if (canCreateOrder()) {
      alert("You can't create more than 3 orders at once");
      return;
    }
    setModalIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-md navbar-dark bg-dark  "
        style={{ height: "60px" }}
      >
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto"></ul>
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        {currentUser.emailVerified && (
          <>
            {myUserInfo && (
              <h1 className="display-4">Welcome {myUserInfo.name}</h1>
            )}
            {orders.length > 0 && (
              <p className="lead">
                You can choose from the list below or you can create a new order
                yourself
              </p>
            )}
          </>
        )}
        {!currentUser.emailVerified && (
          <>
            {myUserInfo && (
              <h1 className="display-4">Welcome {myUserInfo.name}</h1>
            )}
            {myUserInfo && (
              <>
                <p className="lead">
                  You just created an account. You should shortly receive an
                  email with the activation link on this email: "
                  {myUserInfo.email}".
                </p>
                <p className="lead">
                  Please activate your account in order to continue.
                </p>
                <button
                  type="button"
                  className="btn btn-primary cursor-pointer"
                  onClick={currentUser.sendEmailVerification}
                >
                  Resend Link
                </button>
              </>
            )}
          </>
        )}
        {currentUser.emailVerified && (
          <button
            type="button"
            onClick={tryCreateOrder}
            className="btn btn-primary"
          >
            Create an Order
          </button>
        )}
      </div>

      {currentUser.emailVerified && (
        <>
          <div className="container margin-bottom-container">
            <div className="row justify-content-start">
              {orders.map((order) => {
                return (
                  <OrderBox
                    order={order}
                    myUserInfo={myUserInfo}
                    setSelectedOrder={setSelectedOrder}
                    allUsers={allUsers}
                    setIsViewOrder={setIsViewOrder}
                    setIsOrderFood={setIsOrderFood}
                  />
                );
              })}
            </div>
          </div>

          {isOrderFood && selectedOrder && (
            <OrderFood
              order={orders.find((order) => order.id === selectedOrder.id)}
              setSelectedOrder={setSelectedOrder}
              setIsOrderFood={setIsOrderFood}
              myUserInfo={myUserInfo}
            ></OrderFood>
          )}
          {isViewOrder && selectedOrder && (
            <ViewOrder
              setIsViewOrder={setIsViewOrder}
              order={orders.find((order) => order.id === selectedOrder.id)}
              setSelectedOrder={setSelectedOrder}
              myUserInfo={myUserInfo}
            ></ViewOrder>
          )}
          {modalIsOpen && (
            <CreateOrder
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
              allUsers={allUsers}
              createOrder={createOrder}
              myUserInfo={myUserInfo}
            />
          )}
        </>
      )}
      {error}
    </>
  );
};

export default Dashboard;
