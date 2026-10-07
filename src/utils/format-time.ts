export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const getPercentage = (seconds: number) => {
  return (seconds / 60) * 100;
};

export const playPercentage = (old: number, x: number) => {
  return ((old - x) / old) * 100;
};
