import React, { useState } from "react";
import Modal from "react-modal";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { SelectUsers } from "./SelectUsers";
import { restaurants } from "../restaurants";

export const CreateOrder = (props) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

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

  const onSelectItem = (event, restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const saveOrder = () => {
    props.createOrder(selectedRestaurant.id, selectedGuests, isPublic);
  };

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={() => props.setModalIsOpen(false)}
      contentLabel="Example Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="container">
        <div className="row">
          <h1 className="col-11">New Order</h1>
          <div
            className="col-1"
            onClick={() => {
              props.setModalIsOpen(false);
              setIsPublic(false);
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
              clearOnBlur
              id="combo-box-demo"
              options={restaurants}
              getOptionLabel={(option) => option.name}
              style={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Restaurant"
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <br></br>
        {!isPublic && (
          <>
            <div className="row">
              <div className="col-12">
                <SelectUsers
                  users={props.allUsers.filter(
                    (user) => user.id !== props.myUserInfo.id
                  )}
                  setSelectedGuests={setSelectedGuests}
                />
              </div>
            </div>
            <br></br>
          </>
        )}
        <div className="row">
          <div className="col-2">
            <div
              className="form-check cursor-pointer"
              onClick={() => setIsPublic(true)}
            >
              <input
                className="form-check-input cursor-pointer"
                type="radio"
                checked={isPublic}
                onChange={() => {}}
              />
              <label className="form-check-label cursor-pointer">Public</label>
            </div>
          </div>
          <div className="col-2">
            <div
              className="form-check cursor-pointer"
              onClick={() => setIsPublic(false)}
            >
              <input
                className="form-check-input cursor-pointer"
                type="radio"
                checked={!isPublic}
                onChange={() => {}}
              />
              <label className="form-check-label cursor-pointer">Private</label>
            </div>
          </div>
        </div>
        <br></br>
        <div>
          <button
            type="button"
            disabled={!selectedRestaurant}
            className="btn btn-primary"
            onClick={saveOrder}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              props.setModalIsOpen(false);
              setIsPublic(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
