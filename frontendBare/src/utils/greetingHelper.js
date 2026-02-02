export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon';
  } else {
    return 'Evening';
  }
};

export const getMotivationalQuote = () => {
  const quotes = [
    "Every step counts towards your goal",
    "Progress, not perfection",
    "Your body can do it, it's your mind you need to convince",
    "The only bad workout is the one that didn't happen",
    "Believe in yourself and you will be unstoppable",
    "Success starts with self-discipline",
    "Push yourself because no one else will",
    "Great things never come from comfort zones",
    "Dream it. Wish it. Do it.",
    "Your health is an investment, not an expense",
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};
