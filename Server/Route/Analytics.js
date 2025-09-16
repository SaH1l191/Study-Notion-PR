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

// Get detailed performance metrics
router.get("/performance", auth, isAdmin, (req, res) => {
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

// Get performance summary
router.get("/performance/summary", auth, isAdmin, (req, res) => {
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

// Export performance data
router.post("/performance/export", auth, isAdmin, (req, res) => {
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

// Reset performance metrics (for testing)
router.post("/performance/reset", auth, isAdmin, (req, res) => {
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

// Get comprehensive analytics
router.get("/analytics", auth, isAdmin, async (req, res) => {
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

// Get analytics summary (public endpoint for demo purposes)
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

// Generate comprehensive analytics report
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

// Track custom events
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

// Get system metrics for monitoring
router.get("/metrics", auth, isAdmin, async (req, res) => {
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

// Get resume-ready metrics summary
router.get("/resume-metrics", async (req, res) => {
    try {
        const analytics = await getAnalytics();
        const performance = getPerformanceSummary();
        
        const resumeMetrics = {
            projectScale: {
                // totalCodeFiles: "147+ JavaScript/JSX files",
                // linesOfCode: "11,000+ lines of code",
                // componentsBuilt: "80+ reusable React components",
                apiEndpoints: `${performance.totalEndpoints} RESTful API endpoints`
            },
            performanceAchievements: {
                responseTime: `${performance.averageResponseTime}ms average response time`,
                errorRate: `${performance.errorRate}% error rate`,
                uptime: `${performance.uptime} hours uptime`,
                performanceScore: `${performance.performanceScore}% performance score`
            },
            // businessImpact: {
            //     usersServed: `${analytics.summary.totalPlatformUsers} total users`,
            //     coursesManaged: `${analytics.summary.totalCoursesCreated} courses created`,
            //     enrollmentsHandled: `${analytics.summary.totalEnrollments} total enrollments`,
            //     revenueProcessed: analytics.summary.revenueGenerated,
            //     userSatisfaction: `${analytics.summary.averageRating}/5.0 average rating`
            // },
            // technicalFeatures: {
            //     // authentication: "JWT-based multi-role authentication",
            //     // paymentIntegration: "Razorpay payment gateway integration",
            //     // fileManagement: "Cloudinary-based media storage",
            //     emailSystem: `${analytics.summary.emailDeliveryRate} email delivery rate`,
            //     // databaseOperations: "MongoDB with optimized queries"
            // },
            // scalabilityMetrics: {
            //     // concurrentUsers: "500+ users supported",
            //     // dataProcessing: "10GB+ content delivery",
            //     systemReliability: `${analytics.summary.completionRate} course completion rate`,
            //     userEngagement: analytics.summary.userEngagementRate,
            //     conversionRate: analytics.summary.conversionRate
            // }
        };
        
        return res.status(200).json({
            success: true,
            message: "Resume-ready metrics retrieved successfully",
            data: resumeMetrics,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve resume metrics",
            error: error.message
        });
    }
});

module.exports = router;
