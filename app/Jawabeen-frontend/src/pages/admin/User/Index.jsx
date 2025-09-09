import React, { useState, useEffect } from "react";
import DataTable from "../../../components/common/DataTable";
import UserModal from "./UserModal";
import SearchBar from "../../../components/common/SearchBar";
import { useToast } from "../../../context/ToastProvider";
import Modal from "../../../components/common/Modal.jsx";
import UserAvatar from "../../../components/common/UserAvatar.jsx";
import UserService from "../../../services/userService.js";


const UserList = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userDelete, setUserDelete] = useState(null);

  // Fetch users from service
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersArray = await UserService.fetchUsers();
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();
  }, []);

  // Filter users
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query)
    );
    setFilteredUsers(searchQuery.trim() ? filtered : users);
  }, [searchQuery, users]);

  const isAllSelected = users.length && selectedUser.length === users.length;

  const handleSelectAll = (e) =>
    setSelectedUser(e.target.checked ? users.map((u) => u.id) : []);

  const handleSelectOne = (id) =>
    setSelectedUser((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleContactAction = (userData = null) => {
    setUser(userData);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const ids = userDelete?.isBulk ? selectedUser : [userDelete?.id];
    UserService.deleteUsers(ids)
      .then(() =>
        showToast({
          message: "User deleted successfully!",
          severity: "success",
        })
      )
      .catch((error) =>
        showToast({ message: error.message, severity: "error" })
      )
      .finally(() => {
        setShowDeleteModal(false);
        setUserDelete(null);
        setSelectedUser([]);
      });
  };

  const columns = [
    {
      label: (
        <div className="form-check text-center">
          <input
            type="checkbox"
            className="form-check-input primary"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
        </div>
      ),
      render: (row) => (
        <div className="form-check text-center">
          <input
            type="checkbox"
            className="form-check-input contact-chkbox primary"
            checked={selectedUser.includes(row.id)}
            onChange={() => handleSelectOne(row.id)}
          />
        </div>
      ),
    },
    {
      label: "Name",
      render: (row) => (
        <div className="d-flex align-items-center">
          <UserAvatar avatar={row.avatar} name={row.name} size={35} />
          <div className="ms-3">
            <h6 className="user-name mb-0">{row.name}</h6>
            <span className="user-work fs-3">{row.occupation}</span>
          </div>
        </div>
      ),
    },
    { label: "Email", accessor: "email" },
    { label: "Phone", accessor: "phone" },
    {
      label: "Action",
      render: (row) => (
        <div className="action-btn">
          <button
            className="btn text-primary p-0 me-2"
            onClick={() => handleContactAction(row)}
          >
            <i className="ti ti-eye fs-5"></i>
          </button>
          <button
            className="btn text-dark p-0"
            onClick={() => {
              setUserDelete(row);
              setShowDeleteModal(true);
            }}
          >
            <i className="ti ti-trash fs-5"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="widget-content searchable-container list">
        <div className="card card-body">
          <div className="row">
            <div className="col-md-4 col-xl-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
              {selectedUser.length > 0 && (
                <button
                  className="btn btn-danger me-2 d-flex align-items-center"
                  onClick={() => {
                    setUserDelete({ name: "selected contacts", isBulk: true });
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="ti ti-trash me-1 fs-5"></i> Delete All Row
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => handleContactAction()}
              >
                <i className="ti ti-users me-1"></i> Add User
              </button>
            </div>
          </div>
        </div>

        <UserModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          user={user}
        />

        <DataTable
          columns={columns}
          data={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      <Modal
        show={showDeleteModal}
        title="Confirm Delete"
        onClose={() => setShowDeleteModal(false)}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>
            {userDelete?.isBulk
              ? `${selectedUser.length} selected contacts`
              : userDelete?.name}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};

export default UserList;
