export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  // Only run on client side to avoid hydration mismatch
  if (typeof window === "undefined") {
    return dateString;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543; // Convert to Buddhist year

  return `${day} ${month} ${year}`;
};
