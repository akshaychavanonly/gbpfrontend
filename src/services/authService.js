const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "gbpbackend-production-618a.up.railway.app/api";

/*
 * Register
 */
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Registration failed.");
  }

  return data;
}

/*
 * Login
 */
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}

/*
 * Logout
 */
export async function logoutUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Logout failed.");
  }

  return data;
}
