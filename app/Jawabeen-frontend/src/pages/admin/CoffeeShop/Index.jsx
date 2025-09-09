import React, { useState, useEffect } from "react";
import DataTable from "../../../components/common/DataTable.jsx";
import CoffeeShopModal from "./CoffeeShopModal.jsx";
import SearchBar from "../../../components/common/SearchBar.jsx";
import { useToast } from "../../../context/ToastProvider.jsx";
import Modal from "../../../components/common/Modal.jsx";
import UserAvatar from "../../../components/common/UserAvatar.jsx"; // Can reuse for shop logos
import CoffeeShopService from "../../../services/coffeeshopService.js";


const CoffeeShopList = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [shop, setShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShops, setSelectedShops] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shopDelete, setShopDelete] = useState(null);

  // Fetch coffee shops from service
  useEffect(() => {
    const loadShops = async () => {
      try {
        const shopsArray = await CoffeeShopService.fetchCoffeeShops();
        setShops(shopsArray);
        setFilteredShops(shopsArray);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    loadShops();
  }, []);

  // Filter coffee shops
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = shops.filter(
      (s) =>
        s.name?.toLowerCase().includes(query) ||
        s.contactEmail?.toLowerCase().includes(query) ||
        s.contactPhone?.toLowerCase().includes(query)
    );
    setFilteredShops(searchQuery.trim() ? filtered : shops);
  }, [searchQuery, shops]);

  const isAllSelected = shops.length && selectedShops.length === shops.length;

  const handleSelectAll = (e) =>
    setSelectedShops(e.target.checked ? shops.map((s) => s.id) : []);

  const handleSelectOne = (id) =>
    setSelectedShops((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleCoffeeShopAction = (shopData = null) => {
    setShop(shopData);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const ids = shopDelete?.isBulk ? selectedShops : [shopDelete?.id];
    CoffeeShopService.deleteCoffeeShops(ids)
      .then(() =>
        showToast({
          message: "Coffee shop deleted successfully!",
          severity: "success",
        })
      )
      .catch((error) =>
        showToast({ message: error.message, severity: "error" })
      )
      .finally(() => {
        setShowDeleteModal(false);
        setShopDelete(null);
        setSelectedShops([]);
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
            checked={selectedShops.includes(row.id)}
            onChange={() => handleSelectOne(row.id)}
          />
        </div>
      ),
    },
    {
      label: "Name",
      render: (row) => (
        <div className="d-flex align-items-center">
          <UserAvatar avatar={row.logo} name={row.shopName} size={35} />
          <div className="ms-3">
            <h6 className="shop-name mb-0">{row.name}</h6>
            <span className="shop-contact fs-3">{row.shopName}</span>
          </div>
        </div>
      ),
    },
    { label: "Email", accessor: "contactEmail" },
    { label: "Phone", accessor: "contactPhone" },
    {
      label: "Action",
      render: (row) => (
        <div className="action-btn">
          <button
            className="btn text-primary p-0 me-2"
            onClick={() => handleCoffeeShopAction(row)}
          >
            <i className="ti ti-eye fs-5"></i>
          </button>
          <button
            className="btn text-dark p-0"
            onClick={() => {
              setShopDelete(row);
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
              {selectedShops.length > 0 && (
                <button
                  className="btn btn-danger me-2 d-flex align-items-center"
                  onClick={() => {
                    setShopDelete({ name: "selected shops", isBulk: true });
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="ti ti-trash me-1 fs-5"></i> Delete Selected
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => handleCoffeeShopAction()}
              >
                <i className="ti ti-users me-1"></i> Add Coffee Shop
              </button>
            </div>
          </div>
        </div>

        <CoffeeShopModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          shop={shop}
        />

        <DataTable
          columns={columns}
          data={filteredShops}
          selectedUser={selectedShops}
          setSelectedUser={setSelectedShops}
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
            {shopDelete?.isBulk
              ? `${selectedShops.length} selected shops`
              : shopDelete?.name}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};

export default CoffeeShopList;
