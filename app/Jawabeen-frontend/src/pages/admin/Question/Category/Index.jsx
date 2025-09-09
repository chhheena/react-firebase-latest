import React, { useState, useEffect } from "react";
import DataTable from "../../../../components/common/DataTable.jsx";
import CategoryModal from "./CategoryModal.jsx";
import SearchBar from "../../../../components/common/SearchBar.jsx";
import { useToast } from "../../../../context/ToastProvider.jsx";
import Modal from "../../../../components/common/Modal.jsx";
import QuestionService from "../../../../services/questionService.js";
import coffeeShopService from "../../../../services/coffeeshopService.js"; // 👈 shops ke liye import

const CategoryList = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryDelete, setCategoryDelete] = useState(null);
  const [shops, setShops] = useState([]); // 👈 shops state

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await QuestionService.fetchCategories();
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Fetch shops
  useEffect(() => {
    const loadShops = async () => {
      try {
        const data = await coffeeShopService.fetchCoffeeShops();
        setShops(data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    loadShops();
  }, []);

  // Map shop IDs to names
  const getShopNames = (ids = []) => {
    return ids
      .map((id) => shops.find((s) => s.id === id)?.shopName || id)
      .join(", ");
  };

  // Filter categories
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(query) ||
        c.nameAr?.toLowerCase().includes(query)
    );
    setFilteredCategories(searchQuery.trim() ? filtered : categories);
  }, [searchQuery, categories]);

  const isAllSelected =
    categories.length && selectedCategories.length === categories.length;

  const handleSelectAll = (e) =>
    setSelectedCategories(e.target.checked ? categories.map((c) => c.id) : []);

  const handleSelectOne = (id) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleCategoryAction = (categoryData = null) => {
    setCategory(categoryData);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const ids = categoryDelete?.isBulk ? selectedCategories : [categoryDelete?.id];
    QuestionService.deleteCategories(ids)
      .then(() =>
        showToast({
          message: "Category deleted successfully!",
          severity: "success",
        })
      )
      .catch((error) =>
        showToast({ message: error.message, severity: "error" })
      )
      .finally(() => {
        setShowDeleteModal(false);
        setCategoryDelete(null);
        setSelectedCategories([]);
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
            checked={selectedCategories.includes(row.id)}
            onChange={() => handleSelectOne(row.id)}
          />
        </div>
      ),
    },
    { label: "Name (English)", accessor: "name" },
    { label: "Name (Arabic)", accessor: "nameAr" },
    {
      label: "Enabled Shops",
      accessor: "enabledShops",
      render: (row) => getShopNames(row.enabledShops), // 👈 ID → Name mapping
    },
    { label: "Status", accessor: "status" },
    {
      label: "Action",
      render: (row) => (
        <div className="action-btn">
          <button
            className="btn text-primary p-0 me-2"
            onClick={() => handleCategoryAction(row)}
          >
            <i className="ti ti-eye fs-5"></i>
          </button>
          <button
            className="btn text-dark p-0"
            onClick={() => {
              setCategoryDelete(row);
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
              {selectedCategories.length > 0 && (
                <button
                  className="btn btn-danger me-2 d-flex align-items-center"
                  onClick={() => {
                    setCategoryDelete({
                      name: "selected categories",
                      isBulk: true,
                    });
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="ti ti-trash me-1 fs-5"></i> Delete Selected
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => handleCategoryAction()}
              >
                <i className="ti ti-users me-1"></i> Add Category
              </button>
            </div>
          </div>
        </div>

        <CategoryModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          category={category}
        />

        <DataTable
          columns={columns}
          data={filteredCategories}
          selectedUser={selectedCategories}
          setSelectedUser={setSelectedCategories}
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
            {categoryDelete?.isBulk
              ? `${selectedCategories.length} selected categories`
              : categoryDelete?.name}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};

export default CategoryList;
