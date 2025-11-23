import supabase from "../../lib/supabaseClient"

export const getCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*")
    if (error) throw new Error(error.message)
    return data
}

export const getSpacificCategory = async (id) => {
    // Ensure id is a number
    const numericId = typeof id === 'number' ? id : parseInt(id, 10);
    if (isNaN(numericId)) {
        throw new Error("Invalid category ID");
    }
    
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", numericId)
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}