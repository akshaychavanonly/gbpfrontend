export function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function truncateText(text, maxLength = 100) {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

export function getLocationName(location) {
  if (!location) {
    return "Unknown location";
  }

  return location.businessName || "Unknown location";
}

export function getLocationAddress(location) {
  if (!location) {
    return "";
  }

  const parts = [location.address, location.city].filter(Boolean);

  return parts.join(", ");
}

export function getStatusBadgeClasses(status) {
  if (status === "Published") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Draft") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-slate-100 text-slate-700";
}

export function sortPostsByLatest(posts = []) {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);

    return dateB - dateA;
  });
}
