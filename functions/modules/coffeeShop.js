const { firestore } = require("../config/firebaseAdmin"); // Firestore instance

// Save or update coffee shop
async function saveCoffeeShopHandler(data) {
  const { id, ...formData } = data;

  try {
    if (id) {
      // UPDATE existing document
      await firestore.collection("coffeeShops").doc(id).set(formData, { merge: true });
      return { success: true, message: "Coffee Shop updated successfully" };
    } else {
      // ADD new document
      const docRef = await firestore.collection("coffeeShops").add(formData);
      const shopData = { ...formData, id: docRef.id };
      await docRef.set(shopData, { merge: true }); // Save the id inside document
      return { success: true, message: "Coffee Shop added successfully", id: docRef.id };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}



// Fetch all coffee shops
async function fetchCoffeeShopsHandler() {
  try {
    const snapshot = await firestore.collection("coffeeShops").get();
    const shopsArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return shopsArray;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Delete coffee shops by ids
async function deleteCoffeeShopsHandler(ids) {
  try {
    const batch = firestore.batch();
    ids.forEach((id) => {
      const docRef = firestore.collection("coffeeShops").doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
    return { success: true, message: "Coffee Shop(s) deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  saveCoffeeShopHandler,
  fetchCoffeeShopsHandler,
  deleteCoffeeShopsHandler,
};
