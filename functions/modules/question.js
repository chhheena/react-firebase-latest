const { firestore } = require("../config/firebaseAdmin"); // Firestore instance

// Save or update 
async function saveQuestionCategoryHandler(data) {
  const { id, ...formData } = data;

  try {
    if (id) {
      // UPDATE existing document
      await firestore.collection("questionCategories").doc(id).set(formData, { merge: true });
      return { success: true, message: "Category updated successfully" };
    } else {
      // ADD new document
      const docRef = await firestore.collection("questionCategories").add(formData);
      const shopData = { ...formData, id: docRef.id };
      await docRef.set(shopData, { merge: true }); // Save the id inside document
      return { success: true, message: "Category added successfully", id: docRef.id };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}



// Fetch all 
async function fetchQuestionCategoryHandler() {
  try {
    const snapshot = await firestore.collection("questionCategories").get();
    const questioncategoryArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return questioncategoryArray;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Delete by ids
async function deleteQuestionCategoryHandler(ids) {
  try {
    const batch = firestore.batch();
    ids.forEach((id) => {
      const docRef = firestore.collection("questionCategories").doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


async function saveQuestionHandler(data) {
  const { id, ...formData } = data;

  try {
    if (id) {
      // UPDATE existing document
      await firestore.collection("questions").doc(id).set(formData, { merge: true });
      return { success: true, message: "questions updated successfully" };
    } else {
      // ADD new document
      const docRef = await firestore.collection("questions").add(formData);
      const shopData = { ...formData, id: docRef.id };
      await docRef.set(shopData, { merge: true }); // Save the id inside document
      return { success: true, message: "questions added successfully", id: docRef.id };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function fetchQuestionHandler() {
  try {
    const snapshot = await firestore.collection("questions").get();
    const questioncategoryArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return questioncategoryArray;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteQuestionHandler(ids) {
  try {
    const batch = firestore.batch();
    ids.forEach((id) => {
      const docRef = firestore.collection("questions").doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  saveQuestionCategoryHandler,
  fetchQuestionCategoryHandler,
  deleteQuestionCategoryHandler,
  saveQuestionHandler,
  fetchQuestionHandler,
  deleteQuestionHandler
};
