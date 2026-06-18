const { DatabaseService } = require('./database/database.service');

async function testDatabase() {
  const dbService = new DatabaseService();
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    console.log('=== Testing Database ===');
    
    console.log('\n--- Getting all metrics for child_id 1 ---');
    const metrics = dbService.getMetricsByChildId(1);
    console.log('Metrics:', JSON.stringify(metrics, null, 2));
    
    console.log('\n--- Testing getMetric with ID 1 ---');
    const metric1 = dbService.getMetric(1);
    console.log('Metric 1:', JSON.stringify(metric1, null, 2));
    
    console.log('\n--- Testing getMetric with ID 2 ---');
    const metric2 = dbService.getMetric(2);
    console.log('Metric 2:', JSON.stringify(metric2, null, 2));
    
    console.log('\n--- Testing getMetric with ID 5 ---');
    const metric5 = dbService.getMetric(5);
    console.log('Metric 5:', JSON.stringify(metric5, null, 2));
    
    console.log('\n--- Testing getWeightMetrics ---');
    const weightMetrics = dbService.getWeightMetrics();
    console.log('Weight metrics:', JSON.stringify(weightMetrics, null, 2));
    
    console.log('\n--- Testing getHeightMetrics ---');
    const heightMetrics = dbService.getHeightMetrics();
    console.log('Height metrics:', JSON.stringify(heightMetrics, null, 2));
    
    console.log('\n--- Testing getFeedingMetrics ---');
    const feedingMetrics = dbService.getFeedingMetrics();
    console.log('Feeding metrics:', JSON.stringify(feedingMetrics, null, 2));
    
    console.log('\n--- Testing getSleepMetrics ---');
    const sleepMetrics = dbService.getSleepMetrics();
    console.log('Sleep metrics:', JSON.stringify(sleepMetrics, null, 2));

    console.log('\n--- Testing getFeedingByDayAndChild ---');
    const today = new Date();
    console.log('Today:', today.toString());
    const feedingByDay = dbService.getFeedingByDayAndChild(1, today);
    console.log('Feeding by day:', JSON.stringify(feedingByDay, null, 2));

    console.log('\n--- Testing getSleepByDayAndChild ---');
    const sleepByDay = dbService.getSleepByDayAndChild(1, today);
    console.log('Sleep by day:', JSON.stringify(sleepByDay, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    dbService.close();
  }
}

testDatabase();
