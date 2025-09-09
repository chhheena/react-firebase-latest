// services/UserService.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseConfig.js";
import { ref, remove } from "firebase/database"; // for delete only

class UserService {
  // Fetch users via backend callable function
  static async fetchUsers() {
    try {
      const functions = getFunctions(app);
      const fetchUsersFn = httpsCallable(functions, "fetchUsers");
      const result = await fetchUsersFn();

      if (result.data.success) {
        return result.data.data; // array of users
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete users by ids (still using RTDB)
    static async deleteUsers(ids) {
    try {
      const functions = getFunctions(app);
      const deleteUsersFn = httpsCallable(functions, "deleteUsers");
      const result = await deleteUsersFn({ ids });

      if (result.data.success) {
        return result.data; // { success: true, message: "Users deleted successfully" }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Save or update user via backend callable function
  static async saveUser(userData) {
    try {
      const functions = getFunctions(app);
      const saveUserFn = httpsCallable(functions, "saveUser");
      const result = await saveUserFn(userData);

      if (result.data.success) {
        return result.data; // { success, message, id? }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
