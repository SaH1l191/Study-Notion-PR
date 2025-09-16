const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../Middleware/Auth");
const { 
    getPerformanceMetrics, 
    getPerformanceSummary, 
    exportPerformanceData,
    resetMetrics
} = require("../Middleware/performance");
const { 
    getAnalytics, 
    getAnalyticsSummary, 
    generateAnalyticsReport,
    trackEvent
} = require("../Util/analytics");

// ********************************************************************************************************
//                                      PERFORMANCE ROUTES
// ********************************************************************************************************

//   working
router.get("/performance", (req, res) => {
    try {  
        const metrics = getPerformanceMetrics();
        return res.status(200).json({
            success: true,
            message: "Performance metrics retrieved successfully",
            data: metrics
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve performance metrics",
            error: error.message
        });
    }
});

//   working
router.get("/performance/summary",   (req, res) => {
    try {
        const summary = getPerformanceSummary();
        return res.status(200).json({
            success: true,
            message: "Performance summary retrieved successfully",
            data: summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve performance summary",
            error: error.message
        });
    }
});

// not working
router.post("/performance/export",   (req, res) => {
    try {
        const filePath = exportPerformanceData();
        return res.status(200).json({
            success: true,
            message: "Performance data exported successfully",
            data: { filePath }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to export performance data",
            error: error.message
        });
    }
});

// not working 
router.post("/performance/reset",   (req, res) => {
    try {
        resetMetrics();
        return res.status(200).json({
            success: true,
            message: "Performance metrics reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reset performance metrics",
            error: error.message
        });
    }
});

// ********************************************************************************************************
//                                      ANALYTICS ROUTES
// ********************************************************************************************************

// working 
router.get("/analytics",  async (req, res) => {
    try {
        const analytics = await getAnalytics();
        return res.status(200).json({
            success: true,
            message: "Analytics data retrieved successfully",
            data: analytics
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve analytics",
            error: error.message
        });
    }
});

// working 
router.get("/analytics/summary", async (req, res) => {
    try {
        const summary = getAnalyticsSummary();
        return res.status(200).json({
            success: true,
            message: "Analytics summary retrieved successfully",
            data: summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve analytics summary",
            error: error.message
        });
    }
});

// not woprking 
router.get("/analytics/report", auth, isAdmin, async (req, res) => {
    try {
        const report = await generateAnalyticsReport();
        return res.status(200).json({
            success: true,
            message: "Analytics report generated successfully",
            data: report
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate analytics report",
            error: error.message
        });
    }
});

// not working 
router.post("/analytics/track", async (req, res) => {
    try {
        const { eventType, eventData } = req.body;
        
        if (!eventType) {
            return res.status(400).json({
                success: false,
                message: "Event type is required"
            });
        }
        
        const event = trackEvent(eventType, eventData || {});
        
        return res.status(200).json({
            success: true,
            message: "Event tracked successfully",
            data: event
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to track event",
            error: error.message
        });
    }
});

// Get platform health status
router.get("/health", (req, res) => {
    try {
        const healthStatus = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
            environment: process.env.NODE_ENV || 'development',
            database: "connected", // You'd check actual DB connection here
            services: {
                authentication: "operational",
                paymentGateway: "operational",
                emailService: "operational",
                cloudStorage: "operational"
            },
            performance: getPerformanceSummary()
        };
        
        return res.status(200).json({
            success: true,
            message: "Platform health status retrieved",
            data: healthStatus
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve health status",
            error: error.message
        });
    }
});

// working 
router.get("/metrics" , async (req, res) => {
    try {

        const analytics = await getAnalytics();
        const performance = getPerformanceMetrics();
        
        const systemMetrics = {
            platform: {
                name: "StudyNotion EdTech Platform",
                version: "1.0.0",
                environment: process.env.NODE_ENV || 'development'
            },
            performance: {
                uptime: performance.uptime,
                memoryUsage: performance.memoryUsage,
                averageResponseTime: performance.averageResponseTime,
                totalRequests: performance.totalRequests,
                errorRate: performance.errorRate
            },
            business: {
                totalUsers: analytics.userMetrics.totalUsers,
                totalCourses: analytics.courseMetrics.totalCourses,
                totalEnrollments: analytics.courseMetrics.totalEnrollments,
                revenue: analytics.courseMetrics.revenueGenerated,
                conversionRate: analytics.businessMetrics.conversionRate
            },
            timestamp: new Date().toISOString()
        };
        
        return res.status(200).json({
            success: true,
            message: "System metrics retrieved successfully",
            data: systemMetrics
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve system metrics",
            error: error.message
        });
    }
}); 

module.exports = router;
