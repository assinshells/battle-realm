const pad = (n) => String(n).padStart(2, "0");

/** 3725000 мс → "01:02:05" (не меньше нуля). */
export const formatDuration = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return `${pad(h)}:${pad(m)}:${pad(total % 60)}`;
};
