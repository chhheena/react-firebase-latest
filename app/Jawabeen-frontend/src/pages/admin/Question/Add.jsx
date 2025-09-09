import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastProvider.jsx";
import QuestionService from "../../../services/questionService.js";

const AddQuestion = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if question data is passed via state
  const question = location.state?.question || null;

  const [formData, setFormData] = useState({
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

  const [categories, setCategories] = useState([]);

  // Load categories
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
    loadCategories();
  }, []);

  // Load question data if editing
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
      const mediaType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        media: { ...prev.media, [mediaType]: files[0] },
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
      navigate("/admin/questions"); // Go back to question list
    } catch (error) {
      showToast({
        title: "Error Saving Question",
        message: error.message,
        severity: "danger",
      });
    }
  };

  const cancel = () => {
    navigate("/admin/questions"); // Go back to question list
  };

  return (
  <div className="widget-content searchable-container list">
    <div className="card card-body">
      <h2 className="mb-4">{question ? "Edit Question" : "Add Question"}</h2>
      <form>
        {/* Question Text */}
        <div className="row g-3 mb-3">
          {["en", "ar"].map((lang) => (
            <div className="col-md-6" key={lang}>
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
        </div>

        {/* Options */}
        <div className="mb-3">
          <label className="form-label">Options</label>
          {formData.options.map((opt, index) => (
            <div className="row g-3 mb-2" key={index}>
              {["en", "ar"].map((lang) => (
                <div className="col-md-6" key={lang}>
                  <input
                    type="text"
                    name={`option${index}`}
                    className="form-control"
                    placeholder={`Option ${index + 1} (${lang})`}
                    value={opt[lang]}
                    onChange={(e) => handleChange(e, index, lang)}
                  />
                </div>
              ))}
              <div className="col-md-6 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-danger btn-sm mt-1"
                  onClick={() => removeOption(index)}
                >
                  X
                </button>
              </div>
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

        {/* Correct Answer, Category, Difficulty, Points */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
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

          <div className="col-md-6">
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

          <div className="col-md-6">
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

          <div className="col-md-6">
            <label className="form-label">Points</label>
            <input
              type="number"
              name="points"
              className="form-control"
              value={formData.points}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Media */}
        <div className="row g-3 mb-3">
          {["image", "audio", "video"].map((type) => (
            <div className="col-md-6" key={type}>
              <label className="form-label">{type.toUpperCase()}</label>
              <input
                type="file"
                name={`media.${type}`}
                className="form-control"
                onChange={handleChange}
              />
            </div>
          ))}


          <div className="col-md-6">
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
        </div>

       
        

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-danger"
            onClick={cancel}
          >
            Cancel
          </button>
          <button type="button" className="btn btn-success" onClick={saveData}>
            {question ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AddQuestion;
