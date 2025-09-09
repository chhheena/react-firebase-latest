import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal.jsx";
import { useToast } from "../../../context/ToastProvider";
import { ModalModes } from "../../../utils/enum.js";
import { app } from "../../../firebaseConfig";
import UserService from "../../../services/userService.js";


import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

const UserModal = ({ show, handleClose, user = null }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    console.log("Saving user:", { formData, id: user?.id }); // ✅ move here

    try {
      const result = await UserService.saveUser({
        ...formData,
        id: user?.id, // If user exists, update; else add new
      });

      showToast({ message: result.message, severity: "success" });
      handleCloseModal();
    } catch (error) {
      showToast({
        title: "Error Saving User",
        message: error.message,
        type: "danger",
      });
    }
  };

  const handleCloseModal = () => {
    setFormData({});
    handleClose();
  };

  const footer = (
    <>
      <button
        className="btn bg-danger-subtle text-danger"
        type="button"
        onClick={handleCloseModal}
      >
        Cancel
      </button>

      <button className="btn btn-success" type="button" onClick={saveData}>
        {user ? "Update" : "Save"}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      title={user ? "Update" : "Save"}
      footer={footer}
      onClose={handleCloseModal}
    >
      <form>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="phone"
            className="form-control"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
