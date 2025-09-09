import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal.jsx";
import { useToast } from "../../../context/ToastProvider.jsx";
import QuestionService from "../../../services/questionService.js";

const QuestionModal = ({ show, handleClose, question = null }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    questionText: { en: "", ar: "" }, // multi-language
    options: [], // array of { en, ar }
    correctAnswerIndex: 0,
    categoryId: "",
    difficulty: "easy",
    points: 200,
    isActive: true,
    countryFlags: [], // optional
    media: { image: "", audio: "", video: "" }, // URLs
  });

  const [categories, setCategories] = useState([]);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await QuestionService.fetchCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast({
          title: "Error",
          message: "Failed to load categories",
          severity: "danger",
        });
      }
    };

    if (show) loadCategories();
  }, [show]);

  // Load question data into form
  useEffect(() => {
    if (question) {
      setFormData({
        questionText: question.questionText || { en: "", ar: "" },
        options: question.options || [],
        correctAnswerIndex: question.correctAnswerIndex ?? 0,
        categoryId: question.categoryId || "",
        difficulty: question.difficulty || "easy",
        points: question.points || 200,
        isActive: question.isActive ?? true,
        countryFlags: question.countryFlags || [],
        media: question.media || { image: "", audio: "", video: "" },
      });
    }
  }, [question]);

  const handleChange = (e, index = null, lang = "en") => {
    const { name, value, type, checked, files } = e.target;

    if (name === "questionText") {
      setFormData((prev) => ({
        ...prev,
        questionText: { ...prev.questionText, [lang]: value },
      }));
    } else if (name.startsWith("option") && index !== null) {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = { ...updatedOptions[index], [lang]: value };
      setFormData((prev) => ({ ...prev, options: updatedOptions }));
    } else if (name.startsWith("media")) {
      const mediaType = name.split(".")[1]; // image/audio/video
      setFormData((prev) => ({
        ...prev,
        media: { ...prev.media, [mediaType]: files[0] }, // store File
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { en: "", ar: "" }],
    }));
  };

  const removeOption = (index) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctAnswerIndex:
        formData.correctAnswerIndex >= updatedOptions.length
          ? 0
          : formData.correctAnswerIndex,
    }));
  };

  const saveData = async () => {
    try {
      const result = await QuestionService.saveQuestion({
        ...formData,
        id: question?.id,
      });

      showToast({ message: result.message, severity: "success" });
      handleCloseModal();
    } catch (error) {
      showToast({
        title: "Error Saving Question",
        message: error.message,
        severity: "danger",
      });
    }
  };

  const handleCloseModal = () => {
    setFormData({
      questionText: { en: "", ar: "" },
      options: [],
      correctAnswerIndex: 0,
      categoryId: "",
      difficulty: "easy",
      points: 200,
      isActive: true,
      countryFlags: [],
      media: { image: "", audio: "", video: "" },
    });
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
        {question ? "Update" : "Save"}
      </button>
    </>
  );

  return (
    <Modal
      show={show}
      title={question ? "Update Question" : "Add Question"}
      footer={footer}
      onClose={handleCloseModal}
    >
      <form>
        {/* Question Text */}
        {["en", "ar"].map((lang) => (
          <div className="mb-3" key={lang}>
            <label className="form-label">
              Question ({lang.toUpperCase()})
            </label>
            <textarea
              name="questionText"
              className="form-control"
              rows={3}
              placeholder={`Enter question in ${lang}`}
              value={formData.questionText[lang]}
              onChange={(e) => handleChange(e, null, lang)}
            />
          </div>
        ))}

        {/* Options */}
        <div className="mb-3">
          <label className="form-label">Options</label>
          {formData.options.map((opt, index) => (
            <div className="d-flex mb-2" key={index}>
              {["en", "ar"].map((lang) => (
                <input
                  key={lang}
                  type="text"
                  name={`option${index}`}
                  className="form-control me-2"
                  placeholder={`Option ${index + 1} (${lang})`}
                  value={opt[lang]}
                  onChange={(e) => handleChange(e, index, lang)}
                />
              ))}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeOption(index)}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addOption}
          >
            Add Option
          </button>
        </div>

        {/* Correct Answer */}
        <div className="mb-3">
          <label className="form-label">Correct Answer</label>
          <select
            name="correctAnswerIndex"
            className="form-control"
            value={formData.correctAnswerIndex}
            onChange={handleChange}
          >
            {formData.options.map((_, idx) => (
              <option key={idx} value={idx}>
                Option {idx + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="categoryId"
            className="form-control"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            name="difficulty"
            className="form-control"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Points */}
        <div className="mb-3">
          <label className="form-label">Points</label>
          <input
            type="number"
            name="points"
            className="form-control"
            value={formData.points}
            onChange={handleChange}
          />
        </div>

        {/* Media */}
        {["image", "audio", "video"].map((type) => (
          <div className="mb-3" key={type}>
            <label className="form-label">{type.toUpperCase()}</label>
            <input
              type="file"
              name={`media.${type}`}
              className="form-control"
              onChange={handleChange}
            />
          </div>
        ))}

        {/* Active */}
        {/* Active / Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="isActive"
            className="form-control"
            value={formData.isActive ? "active" : "inactive"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "active",
              }))
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </form>
    </Modal>
  );
};

export default QuestionModal;
