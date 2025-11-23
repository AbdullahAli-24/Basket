import supabase from "./supabaseClient";
import { toast } from "react-hot-toast";

// Create a new user in the database
export const createUserInDatabase = async (username, email, password) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          password, // Note: In production, you should hash passwords!
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in createUserInDatabase:", error);
    throw error;
  }
};

// Get user from database by username and password
export const getUserFromDatabase = async (username, password) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error in getUserFromDatabase:", error);
    throw error;
  }
};

// Get user from database by ID
export const getUserByIdFromDatabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserByIdFromDatabase:", error);
    return null;
  }
};

