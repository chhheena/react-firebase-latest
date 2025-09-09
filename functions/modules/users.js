const { db } = require("../config/firebaseAdmin");

async function saveUserHandler(data) {
  // frontend se jo aa raha hai use directly destructure karo
  const { id, ...formData } = data; // id ko alag karo, baki sab formData me
  console.log("formData ", formData);
  console.log("data ", data);

  if (id) {
    // UPDATE
    await db.ref(`users/${id}`).update({ ...formData, id });
    return { success: true, message: "User updated successfully" };
  } else {
    // ADD
    const newRef = db.ref("users").push();
    const userData = { ...formData, id: newRef.key };
    await newRef.set(userData);
    return { success: true, message: "User added successfully", id: newRef.key };
  }
}


async function fetchUsersHandler() {
  const snapshot = await db.ref("users").once("value");
  const data = snapshot.val();
  const usersArray = data ? Object.values(data) : [];
  return usersArray;
}

async function deleteUsersHandler(ids) {
  console.log(ids)
  try {
    const updates = {};
    ids.forEach((id) => {
      updates[`users/${id}`] = null;
    });
    await db.ref().update(updates);
    return { success: true, message: "User(s) deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { saveUserHandler, fetchUsersHandler, deleteUsersHandler };
