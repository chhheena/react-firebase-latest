const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall } = require("firebase-functions/v2/https");
const { saveUserHandler, fetchUsersHandler, deleteUsersHandler } = require("./modules/users");
const {
  saveCoffeeShopHandler,
  fetchCoffeeShopsHandler,
  deleteCoffeeShopsHandler,
} = require("./modules/coffeeShop"); // naya module

setGlobalOptions({ maxInstances: 10 });

// Save or Update User
exports.saveUser = onCall(async (request) => {
  try {
    return await saveUserHandler(request.data);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Fetch All Users
exports.fetchUsers = onCall(async () => {
  try {
    const users = await fetchUsersHandler();
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Delete Users
exports.deleteUsers = onCall(async (request) => {
  try {
    const ids = request.data.ids;
    return await deleteUsersHandler(ids);
  } catch (error) {
    return { success: false, message: error.message };
  }
});



// Save or Update Coffee Shop
exports.saveCoffeeShop = onCall(async (request) => {
  try {
    return await saveCoffeeShopHandler(request.data);
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Fetch All Coffee Shops
exports.fetchCoffeeShops = onCall(async () => {
  try {
    const shops = await fetchCoffeeShopsHandler();
    return { success: true, data: shops };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Delete Coffee Shops
exports.deleteCoffeeShops = onCall(async (request) => {
  try {
    const ids = request.data.ids;
    return await deleteCoffeeShopsHandler(ids);
  } catch (error) {
    return { success: false, message: error.message };
  }
});
