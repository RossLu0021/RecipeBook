export function trimText(text: string, limit = 60) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "…" : text;
}

export function safeNum(v: string | number) {
  const num = Number(v);
  return !isNaN(num) ? num : null;
}
