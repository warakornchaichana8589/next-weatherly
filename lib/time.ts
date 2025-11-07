export function getLocalDateKey(iso: string, timeZone: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-CA', { timeZone });
}

// คืนช่วง 7 วันที่แล้วถึงวันนี้ ตาม timezone
export function lastNDaysRangeInTZ(n: number, timeZone: string) {
  const now = new Date();
  const end = now.toLocaleDateString('en-CA', { timeZone }); // YYYY-MM-DD
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - n + 1);
  const start = startDate.toLocaleDateString('en-CA', { timeZone });
  return { start, end }; // ใช้กับ Open-Meteo start_date / end_date
}