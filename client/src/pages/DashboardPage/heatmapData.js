export const generateHeatmapData = (yearSetting) => {
  const startYear = yearSetting;
  const today = new Date();
  const currentDate = new Date(startYear, 0, 1); // Starting from January 1, 2023
  const data = [];

  while (currentDate <= today) {
    data.push({
      value: Math.floor(Math.random() * (400 - 40 + 1)) + 40, // Random value between 40 and 400
      day: currentDate.toISOString().split("T")[0], // Extracting date in 'YYYY-MM-DD' format
    });
    currentDate.setDate(currentDate.getDate() + 1); // Incrementing the day
  }

  return data;
};

export const heatmapData = generateHeatmapData();
