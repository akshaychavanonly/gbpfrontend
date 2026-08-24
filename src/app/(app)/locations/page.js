"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import LocationList from "@/components/locations/LocationList";

import { useAuth } from "@/context/AuthContext";

import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/services/locationService";

export default function LocationsPage() {
  const { token } = useAuth();

  const [
    locations,
    setLocations,
  ] = useState([]);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    isFormModalOpen,
    setIsFormModalOpen,
  ] = useState(false);

  const [
    editingLocation,
    setEditingLocation,
  ] = useState(null);

  const [
    deletingLocation,
    setDeletingLocation,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    address: "",
    city: "",
    category: "",
  });

  const [
    error,
    setError,
  ] = useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /*
   * Convert backend MongoDB object
   * to shape expected by LocationCard.
   */
  const normalizeLocation = (
    location
  ) => ({
    id:
      location._id ||
      location.id,

    businessName:
      location.name,

    address:
      location.address,

    city:
      location.city,

    category:
      location.category,
  });

  /*
   * GET locations
   */
  const loadLocations =
    useCallback(async () => {
      if (!token) {
        return;
      }

      setPageLoading(true);
      setError("");

      try {
        const data =
          await getLocations(token);

        const formattedLocations =
          data.locations.map(
            normalizeLocation
          );

        setLocations(
          formattedLocations
        );
      } catch (error) {
        setError(
          error.message ||
            "Unable to load locations."
        );
      } finally {
        setPageLoading(false);
      }
    }, [token]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  /*
   * Form input
   */
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /*
   * Open Add modal
   */
  const openAddModal = () => {
    setEditingLocation(null);

    setFormData({
      name: "",
      address: "",
      city: "",
      category: "",
    });

    setError("");

    setIsFormModalOpen(true);
  };

  /*
   * Open Edit modal
   */
  const openEditModal = (
    location
  ) => {
    setEditingLocation(location);

    setFormData({
      name:
        location.businessName,
      address:
        location.address,
      city:
        location.city,
      category:
        location.category,
    });

    setError("");

    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    if (actionLoading) {
      return;
    }

    setIsFormModalOpen(false);

    setEditingLocation(null);

    setFormData({
      name: "",
      address: "",
      city: "",
      category: "",
    });

    setError("");
  };

  /*
   * CREATE or UPDATE
   */
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.category.trim()
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (!token) {
      setError(
        "Authentication required."
      );

      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const payload = {
        name:
          formData.name.trim(),

        address:
          formData.address.trim(),

        city:
          formData.city.trim(),

        category:
          formData.category.trim(),
      };

      /*
       * EDIT
       */
      if (editingLocation) {
        const data =
          await updateLocation(
            editingLocation.id,
            payload,
            token
          );

        const updatedLocation =
          normalizeLocation(
            data.location
          );

        setLocations((prev) =>
          prev.map((location) =>
            location.id ===
            updatedLocation.id
              ? updatedLocation
              : location
          )
        );
      } else {
        /*
         * ADD
         */
        const data =
          await createLocation(
            payload,
            token
          );

        const newLocation =
          normalizeLocation(
            data.location
          );

        setLocations((prev) => [
          newLocation,
          ...prev,
        ]);
      }

      setIsFormModalOpen(false);

      setEditingLocation(null);

      setFormData({
        name: "",
        address: "",
        city: "",
        category: "",
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to save location."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * DELETE
   */
  const handleDelete = async () => {
    if (
      !deletingLocation ||
      !token
    ) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await deleteLocation(
        deletingLocation.id,
        token
      );

      setLocations((prev) =>
        prev.filter(
          (location) =>
            location.id !==
            deletingLocation.id
        )
      );

      setDeletingLocation(null);
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete location."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Locations
        </h1>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          + Add Location
        </button>
      </div>

      {/* Page error */}
      {error &&
        !isFormModalOpen && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

      {/* Loading */}
      {pageLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center">
          <p className="text-sm text-slate-500">
            Loading locations...
          </p>
        </div>
      ) : (
        <LocationList
          locations={locations}
          onEdit={openEditModal}
          onDelete={(location) =>
            setDeletingLocation(
              location
            )
          }
        />
      )}

      {/* Add / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <h2 className="text-lg font-semibold text-slate-900">
                {editingLocation
                  ? "Edit Location"
                  : "Add Location"}
              </h2>

              <button
                type="button"
                onClick={
                  closeFormModal
                }
                disabled={
                  actionLoading
                }
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4 p-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Smile Dental Clinic"
                  disabled={
                    actionLoading
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="12 MG Road"
                  disabled={
                    actionLoading
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Bangalore"
                  disabled={
                    actionLoading
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Dental Clinic"
                  disabled={
                    actionLoading
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closeFormModal
                  }
                  disabled={
                    actionLoading
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    actionLoading
                  }
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading
                    ? "Saving..."
                    : editingLocation
                    ? "Update Location"
                    : "Add Location"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-slate-900">
              Delete Location
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to
              delete{" "}
              <span className="font-semibold text-slate-900">
                {
                  deletingLocation.businessName
                }
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setDeletingLocation(
                    null
                  )
                }
                disabled={
                  actionLoading
                }
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  actionLoading
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}