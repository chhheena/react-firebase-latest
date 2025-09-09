import React, { useState, useEffect } from "react";
import DataTable from "../../../components/common/DataTable.jsx";
import QuestionModal from "./QuestionModal.jsx";
import SearchBar from "../../../components/common/SearchBar.jsx";
import { useToast } from "../../../context/ToastProvider.jsx";
import Modal from "../../../components/common/Modal.jsx";
import QuestionService from "../../../services/questionService.js";
import { useNavigate } from "react-router-dom";


const QuestionList = () => {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]); // to map categoryId -> name
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionDelete, setQuestionDelete] = useState(null);

  // Fetch categories first
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryArray = await QuestionService.fetchCategories();
        setCategories(categoryArray); // [{ id: 'xyz', name: 'Math' }, ...]
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Fetch questions and map category names
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionArray = await QuestionService.fetchQuestions();
        const mappedQuestions = questionArray.map((q) => ({
          ...q,
          text: q.questionText?.en || "",
          textAr: q.questionText?.ar || "",
          status: q.isActive ? "Active" : "Inactive",
          categoryName:
            categories.find((c) => c.id === q.categoryId)?.name || "", // map id -> name
        }));
        setQuestions(mappedQuestions);
        setFilteredQuestions(mappedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    if (categories.length) {
      loadQuestions(); // only load questions after categories are loaded
    }
  }, [categories]);

  // Filter questions
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = questions.filter(
      (q) =>
        q.text.toLowerCase().includes(query) ||
        q.textAr.toLowerCase().includes(query) ||
        q.categoryName.toLowerCase().includes(query)
    );
    setFilteredQuestions(searchQuery.trim() ? filtered : questions);
  }, [searchQuery, questions]);

  const isAllSelected =
    questions.length && selectedQuestions.length === questions.length;

  const handleSelectAll = (e) =>
    setSelectedQuestions(e.target.checked ? questions.map((q) => q.id) : []);
const navigate = useNavigate();
  const handleSelectOne = (id) =>
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  // const handleQuestionAction = (questionData = null) => {
  //   setQuestion(questionData);
  //   setShowModal(true);
  // };
  const handleQuestionAction = (question = null) => {
    // question === null → Add
    // question !== null → Edit
    navigate("/admin/add-question", { state: { question } });
  };

  const confirmDelete = () => {
    const ids = questionDelete?.isBulk ? selectedQuestions : [questionDelete?.id];
    QuestionService.deleteQuestions(ids)
      .then(() =>
        showToast({
          message: "Question deleted successfully!",
          severity: "success",
        })
      )
      .catch((error) =>
        showToast({ message: error.message, severity: "error" })
      )
      .finally(() => {
        setShowDeleteModal(false);
        setQuestionDelete(null);
        setSelectedQuestions([]);
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
            checked={selectedQuestions.includes(row.id)}
            onChange={() => handleSelectOne(row.id)}
          />
        </div>
      ),
    },
    { label: "Question (English)", accessor: "text" },
    { label: "Question (Arabic)", accessor: "textAr" },
    { label: "Category", accessor: "categoryName" },
    { label: "Status", accessor: "status" },
    {
      label: "Action",
      render: (row) => (
        <div className="action-btn">
          <button
            className="btn text-primary p-0 me-2"
            onClick={() => handleQuestionAction(row)}
          >
            <i className="ti ti-eye fs-5"></i>
          </button>
          <button
            className="btn text-dark p-0"
            onClick={() => {
              setQuestionDelete(row);
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
              {selectedQuestions.length > 0 && (
                <button
                  className="btn btn-danger me-2 d-flex align-items-center"
                  onClick={() => {
                    setQuestionDelete({ name: "selected questions", isBulk: true });
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="ti ti-trash me-1 fs-5"></i> Delete Selected
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={() => handleQuestionAction()}
              >
                <i className="ti ti-plus me-1"></i> Add Question
              </button>
            </div>
          </div>
        </div>

        <QuestionModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          question={question}
        />

        <DataTable
          columns={columns}
          data={filteredQuestions}
          selectedUser={selectedQuestions}
          setSelectedUser={setSelectedQuestions}
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
            {questionDelete?.isBulk
              ? `${selectedQuestions.length} selected questions`
              : questionDelete?.text}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
};

export default QuestionList;
