const fs = require('fs');
const path = require('path');

// Performance metrics storage
let performanceMetrics = {
    totalRequests: 0,
    averageResponseTime: 0,
    slowQueries: [],
    apiEndpointStats: {},
    dailyStats: {},
    errorRate: 0,
    totalErrors: 0
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
    const startTime = Date.now();
    const originalSend = res.send;
    
    // Override the send method to capture response time
    res.send = function(body) {
        const responseTime = Date.now() - startTime;
        
        // Update performance metrics
        updatePerformanceMetrics(req, res, responseTime);
        
        // Log slow queries (>500ms)
        if (responseTime > 500) {
            logSlowQuery(req, responseTime);
        }
        
        // Call original send method
        originalSend.call(this, body);
    };
    
    next();
};

// Update performance metrics
const updatePerformanceMetrics = (req, res, responseTime) => {
    const endpoint = `${req.method} ${req.route ? req.route.path : req.path}`;
    const today = new Date().toISOString().split('T')[0];
    
    // Update total requests and average response time
    performanceMetrics.totalRequests++;
    performanceMetrics.averageResponseTime = 
        ((performanceMetrics.averageResponseTime * (performanceMetrics.totalRequests - 1)) + responseTime) 
        / performanceMetrics.totalRequests;
    
    // Update endpoint-specific stats
    if (!performanceMetrics.apiEndpointStats[endpoint]) {
        performanceMetrics.apiEndpointStats[endpoint] = {
            totalRequests: 0,
            averageResponseTime: 0,
            minResponseTime: responseTime,
            maxResponseTime: responseTime,
            errorCount: 0
        };
    }
    
    const endpointStats = performanceMetrics.apiEndpointStats[endpoint];
    endpointStats.totalRequests++;
    endpointStats.averageResponseTime = 
        ((endpointStats.averageResponseTime * (endpointStats.totalRequests - 1)) + responseTime) 
        / endpointStats.totalRequests;
    endpointStats.minResponseTime = Math.min(endpointStats.minResponseTime, responseTime);
    endpointStats.maxResponseTime = Math.max(endpointStats.maxResponseTime, responseTime);
    
    // Update daily stats
    if (!performanceMetrics.dailyStats[today]) {
        performanceMetrics.dailyStats[today] = {
            requests: 0,
            averageResponseTime: 0,
            errors: 0
        };
    }
    
    const dailyStats = performanceMetrics.dailyStats[today];
    dailyStats.requests++;
    dailyStats.averageResponseTime = 
        ((dailyStats.averageResponseTime * (dailyStats.requests - 1)) + responseTime) 
        / dailyStats.requests;
    
    // Update error rate
    if (res.statusCode >= 400) {
        performanceMetrics.totalErrors++;
        endpointStats.errorCount++;
        dailyStats.errors++;
        performanceMetrics.errorRate = 
            (performanceMetrics.totalErrors / performanceMetrics.totalRequests) * 100;
    }
};

// Log slow queries
const logSlowQuery = (req, responseTime) => {
    const slowQuery = {
        endpoint: `${req.method} ${req.path}`,
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
    };
    
    performanceMetrics.slowQueries.push(slowQuery);
    
    // Keep only last 100 slow queries
    if (performanceMetrics.slowQueries.length > 100) {
        performanceMetrics.slowQueries = performanceMetrics.slowQueries.slice(-100);
    }
    
    console.warn(`⚠️  Slow Query Detected: ${slowQuery.endpoint} - ${responseTime}ms`);
};

// Get performance metrics
const getPerformanceMetrics = () => {
    return {
        ...performanceMetrics,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    };
};

// Get performance summary for resume metrics
const getPerformanceSummary = () => {
    const totalEndpoints = Object.keys(performanceMetrics.apiEndpointStats).length;
    const fastQueries = performanceMetrics.totalRequests - performanceMetrics.slowQueries.length;
    const performanceScore = ((fastQueries / performanceMetrics.totalRequests) * 100).toFixed(2);
    
    return {
        totalRequests: performanceMetrics.totalRequests,
        totalEndpoints: totalEndpoints,
        averageResponseTime: Math.round(performanceMetrics.averageResponseTime),
        errorRate: performanceMetrics.errorRate.toFixed(2),
        performanceScore: performanceScore,
        slowQueriesCount: performanceMetrics.slowQueries.length,
        uptime: Math.round(process.uptime() / 3600), // in hours
        memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    };
};

// Reset metrics (useful for testing)
const resetMetrics = () => {
    performanceMetrics = {
        totalRequests: 0,
        averageResponseTime: 0,
        slowQueries: [],
        apiEndpointStats: {},
        dailyStats: {},
        errorRate: 0,
        totalErrors: 0
    };
};

// Export performance data to JSON file
const exportPerformanceData = () => {
    const exportData = {
        metrics: performanceMetrics,
        summary: getPerformanceSummary(),
        exportedAt: new Date().toISOString()
    };
    console.log("__dirname  ",__dirname)
    const filePath = path.join(__dirname, '../logs', `performance_${Date.now()}.json`);
    
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    console.log(`📊 Performance data exported to: ${filePath}`);
    
    return filePath;
};

module.exports = {
    performanceMonitor,
    getPerformanceMetrics,
    getPerformanceSummary,
    resetMetrics,
    exportPerformanceData
};
