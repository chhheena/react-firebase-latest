// services/CoffeeShopService.js
import { getFunctions, httpsCallable } from "firebase/functions";
import { app, storage } from "../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

class CoffeeShopService {
  // Fetch all coffee shops
  static async fetchCoffeeShops() {
    try {
      const functions = getFunctions(app);
      const fetchFn = httpsCallable(functions, "fetchCoffeeShops");
      const result = await fetchFn();
      if (result.data.success) {
        return result.data.data; // array of coffee shops
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }

  // Save or update coffee shop
  static async saveCoffeeShop(shopData) {
  try {
    let finalData = { ...shopData };

    // 🔹 Call Firebase Function to save/update Firestore
    const functions = getFunctions(app);
    const saveFn = httpsCallable(functions, "saveCoffeeShop");
    const result = await saveFn({ ...finalData, id: shopData.id });

    if (!result.data.success) throw new Error(result.data.message);
    return result.data;
  } catch (error) {
    throw error;
  }
}


  // Delete coffee shops
  static async deleteCoffeeShops(ids) {
    try {
      const functions = getFunctions(app);
      const deleteFn = httpsCallable(functions, "deleteCoffeeShops");
      const result = await deleteFn({ ids });
      if (result.data.success) {
        return result.data; // { success: true, message: "Deleted successfully" }
      } else {
        throw new Error(result.data.message);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default CoffeeShopService;
