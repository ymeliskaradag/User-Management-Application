// const API_URL = "http:localhost:5000/api/v2/users";
const API_URL = "http://localhost:5000/api/v2/users";


//get users with pagination
export const getUsers = async (page = 1, limit = 5) => {
    const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed fetching users");
    return res.json();
};

//search users
export const searchUsers = async (term = "", page = 1, limit = 5) => {
    const res = await fetch(`${API_URL}/search/${encodeURIComponent(term)}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to search users");
    return res.json();
};

//get status informations
export const getStats = async () => {
    const res = await fetch(`${API_URL}/stats`);
    if (!res.ok) throw new Error("Failed to get status informations of users");
    return res.json();
};

//add new user
export const addUser = async (data) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    /* if (!res.ok) throw new Error("Failed to add user");
    return res.json(); */
    const result = await res.json(); // Önce gelen JSON verisini (veya hatayı) oku

    if (!res.ok) {
        // Backend'deki res.status(400).json({message: "..."}) buradaki result.message'dır
        throw new Error(result.message || "Failed to add user");
    }

    return result;
};

//update existing user
export const updateUser = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    /* if (!res.ok) throw new Error("Failed to update user");
    return res.json(); */
    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to update user");
    }

    return result;
};

//delete user
export const deleteUser = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    /* if (!res.ok) throw new Error("Failed to delete user");
    return res.json(); */
    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to delete user");
    }

    return result;
};