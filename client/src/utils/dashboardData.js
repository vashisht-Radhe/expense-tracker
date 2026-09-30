export const getCategoryData = (analytics) => {
  const categories = analytics?.categorySpending?.categories;

  if (!categories) return [];

  return Object.entries(categories)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
};

export const getTopCategories = (categoryData, limit = 5) => {
  return categoryData.slice(0, limit);
};

export const getWeeklyChartData = (trends) => {
  if (!trends?.weeklyCategoryComparison) return [];

  return trends.weeklyCategoryComparison.map((item) => ({
    week: item.week,
    highest: item.highestAmount,
    lowest:
      item.highestCategory === item.lowestCategory ? 0 : item.lowestAmount,
  }));
};

export const getGreeting = (hour) => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";

  return "Late night check-in?";
};

export const getCurrentMonth = () => {
  return new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};
