// Utility to get current user ID from localStorage
// Returns numeric ID from database
export const getCurrentUserId = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.id) {
      // Ensure ID is a number (database uses numeric IDs)
      const userId = typeof currentUser.id === 'number' 
        ? currentUser.id 
        : parseInt(currentUser.id, 10);
      
      if (!isNaN(userId) && userId > 0) {
        return userId;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

// Utility to get current user object
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser"));
  } catch (error) {
    return null;
  }
};

// Utility to set current user
// Expects user object with numeric ID from database
export const setCurrentUser = (user) => {
  // Ensure user has a numeric ID
  if (!user.id) {
    console.error("User object missing ID");
    return;
  }
  
  // Ensure ID is a number
  if (typeof user.id !== 'number') {
    user.id = parseInt(user.id, 10);
    if (isNaN(user.id)) {
      console.error("Invalid user ID:", user.id);
      return;
    }
  }
  
  localStorage.setItem("currentUser", JSON.stringify(user));
};

