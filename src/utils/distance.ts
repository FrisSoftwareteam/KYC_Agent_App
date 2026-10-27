// "85 m", "1.2 km", "34 km"
export const formatDistance = (metres?: number | string | null) => {
  const m = Number(metres);
  if (!Number.isFinite(m)) {
    return '';
  }
  if (m < 1000) {
    return `${Math.round(m)} m`;
  }
  return m < 10000
    ? `${(m / 1000).toFixed(1)} km`
    : `${Math.round(m / 1000)} km`;
};
