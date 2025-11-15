/**
 * Sample Health Connect Service (Fallback when real data is not available)
 */
class HealthConnectService {
  generateSampleData(days = 7) {
    const data = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 8000) + 2000,
        calories_burned: Math.floor(Math.random() * 400) + 150,
        distance: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        active_minutes: Math.floor(Math.random() * 50) + 10,
      });
    }

    return {
      health_data: data,
      heart_rate_data: [],
      sleep_data: [],
      workout_sessions: [],
    };
  }
}

export default new HealthConnectService();
