/** @format */

import supabase from "../../lib/supabaseClient";
import { toast } from "react-hot-toast";

//get cart for a specific user
export const getCartProducts = async (userId) => {
	if (!userId) {
		toast.error("You must login first");
		return [];
	}

	// Ensure userId is a number
	const numericUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);
	if (isNaN(numericUserId)) {
		console.error("Invalid user ID:", userId);
		return {};
	}

	const { data, error } = await supabase
		.from("carts")
		.select("id, cart_items(*, products(*))")
		.eq("user_id", numericUserId)
		.single();

	if (error && error.code !== "PGRST116") throw new Error(error.message);
	return data || {};
};

// add product to user cart
export const addToCart = async (userId, productId) => {
	if (!userId) {
		toast.error("Please login first to add to cart");
		return;
	}

	if (!productId) {
		toast.error("Product ID is missing");
		throw new Error("Product ID is required");
	}

	// Ensure userId is a number (not string)
	const numericUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);
	if (isNaN(numericUserId)) {
		throw new Error("Invalid user ID format");
	}

	console.log("Adding to cart - userId:", numericUserId, "productId:", productId, "type:", typeof numericUserId);

	// check if user already has a cart
	let { data: cart, error: cartError } = await supabase
		.from("carts")
		.select("id")
		.eq("user_id", numericUserId)
		.single();

	if (cartError && cartError.code === "PGRST116") {
		// no cart found → create new one
		console.log("No cart found, creating new cart for user:", numericUserId);
		const { data: newCart, error: newCartError } = await supabase
			.from("carts")
			.insert([{ user_id: numericUserId }])
			.select()
			.single();

		if (newCartError) {
			console.error("Error creating cart:", newCartError);
			throw new Error(newCartError.message);
		}
		cart = newCart;
		console.log("Cart created:", cart);
	} else if (cartError) {
		console.error("Error fetching cart:", cartError);
		throw new Error(cartError.message);
	}

	// check if product already exists in cart_items
	const { data: existingItem, error: existingItemError } = await supabase
		.from("cart_items")
		.select("id, quantity")
		.eq("cart_id", cart.id)
		.eq("product_id", productId)
		.maybeSingle();

	if (existingItemError && existingItemError.code !== "PGRST116") {
		throw new Error(existingItemError.message);
	}

	if (existingItem) {
		// update quantity
		console.log("Item exists, updating quantity:", existingItem);
		const { data, error } = await supabase
			.from("cart_items")
			.update({ quantity: existingItem.quantity + 1 })
			.eq("id", existingItem.id)
			.select()
			.single();

		if (error) {
			console.error("Error updating cart item:", error);
			throw new Error(error.message);
		}
		console.log("Cart item updated:", data);
		return data;
	} else {
		// insert new item
		console.log("Inserting new cart item - cart_id:", cart.id, "product_id:", productId);
		const { data, error } = await supabase
			.from("cart_items")
			.insert([{ cart_id: cart.id, product_id: productId, quantity: 1 }])
			.select()
			.single();

		if (error) {
			console.error("Error inserting cart item:", error);
			throw new Error(error.message);
		}
		console.log("Cart item inserted:", data);
		return data;
	}
};

// remove product from user cart
export const removeProductFromCart = async (userId, productId) => {
	if (!userId) {
		toast.error("You must login first");
		return;
	}

	// Ensure userId is a number
	const numericUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);
	if (isNaN(numericUserId)) {
		throw new Error("Invalid user ID format");
	}

	// get cart
	const { data: cart } = await supabase
		.from("carts")
		.select("id")
		.eq("user_id", numericUserId)
		.single();

	if (!cart) return;

	const { data, error } = await supabase
		.from("cart_items")
		.delete()
		.eq("cart_id", cart.id)
		.eq("product_id", productId);

	if (error) throw new Error(error.message);
	return data;
};

// update product quantity
export const updateProductInCart = async (userId, productId, quantity) => {
	if (!userId) {
		toast.error("You must login first");
		return;
	}

	// Ensure userId is a number
	const numericUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);
	if (isNaN(numericUserId)) {
		throw new Error("Invalid user ID format");
	}

	const { data: cart } = await supabase
		.from("carts")
		.select("id")
		.eq("user_id", numericUserId)
		.single();

	if (!cart) return;

	const { data, error } = await supabase
		.from("cart_items")
		.update({ quantity })
		.eq("cart_id", cart.id)
		.eq("product_id", productId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
};
