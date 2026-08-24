const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/*
 * GET all locations
 */
export async function getLocations(
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/locations`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load locations."
    );
  }

  return data;
}

/*
 * GET single location
 */
export async function getLocationById(
  locationId,
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/locations/${locationId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to load location."
    );
  }

  return data;
}

/*
 * POST location
 */
export async function createLocation(
  locationData,
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/locations`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(
        locationData
      ),
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to add location."
    );
  }

  return data;
}

/*
 * PUT location
 */
export async function updateLocation(
  locationId,
  locationData,
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/locations/${locationId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(
        locationData
      ),
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to update location."
    );
  }

  return data;
}

/*
 * DELETE location
 */
export async function deleteLocation(
  locationId,
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/locations/${locationId}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to delete location."
    );
  }

  return data;
}