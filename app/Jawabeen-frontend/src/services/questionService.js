// services/QuestionService.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseConfig.js";

class QuestionService {
  /** -------------------- CATEGORY FUNCTIONS -------------------- **/

  // Fetch all categories
  static async fetchCategories() {
    try {
      const functions = getFunctions(app);
      const fetchCategoriesFn = httpsCallable(functions, "fetchQuestionCategory");
      const result = await fetchCategoriesFn();

      if (result.data.success) {
        return result.data.data; // array of categories
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Save or update category
  static async saveCategory(categoryData) {
    try {
      const functions = getFunctions(app);
      const saveCategoryFn = httpsCallable(functions, "saveQuestionCategory");
      const result = await saveCategoryFn(categoryData);

      if (result.data.success) {
        return result.data; // { success, message, id? }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete categories by IDs
  static async deleteCategories(ids) {
    try {
      const functions = getFunctions(app);
      const deleteCategoryFn = httpsCallable(functions, "deleteQuestionCategory");
      const result = await deleteCategoryFn({ ids });

      if (result.data.success) {
        return result.data; // { success: true, message: "Categories deleted" }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }


  



  static async fetchQuestions() {
    try {
      const functions = getFunctions(app);
      const fetchQuestionFn = httpsCallable(functions, "fetchQuestion");
      const result = await fetchQuestionFn();

      if (result.data.success) {
        return result.data.data; // array of categories
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  static async saveQuestion(questionData) {
    try {
      const functions = getFunctions(app);
      const saveQuestionFn = httpsCallable(functions, "saveQuestion");
      const result = await saveQuestionFn(questionData);

      if (result.data.success) {
        return result.data; // { success, message, id? }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteQuestions(ids) {
    try {
      const functions = getFunctions(app);
      const deleteQuestionFn = httpsCallable(functions, "deleteQuestion");
      const result = await deleteQuestionFn({ ids });

      if (result.data.success) {
        return result.data; // { success: true, message: "Categories deleted" }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

}

export default QuestionService;
