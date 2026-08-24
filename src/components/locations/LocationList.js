import LocationCard from "./LocationCard";

export default function LocationList({
  locations = [],
  onEdit,
  onDelete,
}) {
  if (locations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No locations found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Add your first business location to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {locations.map(
        (location) => (
          <LocationCard
            key={location.id}
            location={location}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
}