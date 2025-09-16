const Course = require("../models/Course");
const User = require("../models/User");
const RatingAndReview = require("../models/RatingAndReview");
const CourseProgress = require("../models/CourseProgress");

// Analytics data storage
let analyticsData = {
    courseMetrics: {
        totalCourses: 0,
        totalEnrollments: 0,
        averageRating: 0,
        completionRate: 0,
        revenueGenerated: 0
    },
    userMetrics: {
        totalUsers: 0,
        activeStudents: 0,
        totalInstructors: 0,
        newRegistrationsToday: 0,
        userEngagementRate: 0
    },
    performanceMetrics: {
        averageVideoUploadTime: 0,
        successfulPayments: 0,
        failedPayments: 0, 
        systemUptime: 0
    },
    businessMetrics: {
        conversionRate: 0,
        averageRevenuePerUser: 0,
        coursePopularityIndex: {},
        monthlyGrowthRate: 0
    }
};

// Update course metrics
const updateCourseMetrics = async () => {
    try {
        // Get total courses
        const totalCourses = await Course.countDocuments({ status: "Published" });
        
        // Get all courses with student enrollments
        const coursesWithEnrollments = await Course.find({ status: "Published" })
            .populate('studentEnrolled')
            .populate('ratingAndReviews');
        
        // Calculate total enrollments
        let totalEnrollments = 0;
        let totalRevenue = 0;
        let totalRatings = 0;
        let ratingSum = 0;
        
        coursesWithEnrollments.forEach(course => {
            totalEnrollments += course.studentEnrolled.length;
            totalRevenue += course.price * course.studentEnrolled.length;
            
            if (course.ratingAndReviews.length > 0) {
                totalRatings += course.ratingAndReviews.length;
                course.ratingAndReviews.forEach(review => {
                    ratingSum += review.rating || 0;
                });
            }
        });
        
        // Calculate average rating
        const averageRating = totalRatings > 0 ? (ratingSum / totalRatings).toFixed(2) : 0;
        
        // Calculate completion rate (mock data - in real app, track from CourseProgress)
        const completedCourses = await CourseProgress.countDocuments({ completionDate: { $exists: true } });
        const completionRate = totalEnrollments > 0 ? ((completedCourses / totalEnrollments) * 100).toFixed(2) : 0;
        
        analyticsData.courseMetrics = {
            totalCourses,
            totalEnrollments,
            averageRating: parseFloat(averageRating),
            completionRate: parseFloat(completionRate),
            revenueGenerated: totalRevenue
        };
        
        console.log('📈 Course metrics updated');
        return analyticsData.courseMetrics;
    } catch (error) {
        console.error('Error updating course metrics:', error);
        return null;
    }
};

// Update user metrics
const updateUserMetrics = async () => {
    try {
        // Get total users
        const totalUsers = await User.countDocuments();
        
        // Get active students (users with at least one enrolled course)
        const activeStudents = await User.countDocuments({
            accountType: "Student",
            courses: { $exists: true, $ne: [] }
        });
        
        // Get total instructors
        const totalInstructors = await User.countDocuments({ accountType: "Instructor" });
        
        // Get new registrations today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newRegistrationsToday = await User.countDocuments({
            createdAt: { $gte: today }
        });
        
        // Calculate user engagement rate (students with courses / total students)
        const totalStudents = await User.countDocuments({ accountType: "Student" });
        const userEngagementRate = totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(2) : 0;
        
        analyticsData.userMetrics = {
            totalUsers,
            activeStudents,
            totalInstructors,
            newRegistrationsToday,
            userEngagementRate: parseFloat(userEngagementRate)
        };
        
        console.log('👥 User metrics updated');
        return analyticsData.userMetrics;
    } catch (error) {
        console.error('Error updating user metrics:', error);
        return null;
    }
};

// Update business metrics
const updateBusinessMetrics = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const enrolledUsers = await User.countDocuments({
            courses: { $exists: true, $ne: [] }
        });
        
        // Calculate conversion rate
        const conversionRate = totalUsers > 0 ? ((enrolledUsers / totalUsers) * 100).toFixed(2) : 0;
        
        // Calculate average revenue per user
        const averageRevenuePerUser = enrolledUsers > 0 ? 
            (analyticsData.courseMetrics.revenueGenerated / enrolledUsers).toFixed(2) : 0;
        
        // Get course popularity index
        const courses = await Course.find({ status: "Published" })
            .populate('studentEnrolled');
        
        const coursePopularityIndex = {};
        courses.forEach(course => {
            coursePopularityIndex[course.courseName] = {
                enrollments: course.studentEnrolled.length,
                revenue: course.price * course.studentEnrolled.length,
                popularityScore: course.studentEnrolled.length * (course.price / 1000) // Weighted by price
            };
        });
        
        analyticsData.businessMetrics = {
            conversionRate: parseFloat(conversionRate),
            averageRevenuePerUser: parseFloat(averageRevenuePerUser),
            coursePopularityIndex,
            monthlyGrowthRate: 15.5 // Mock data - would be calculated from historical data
        };
        
        console.log('💼 Business metrics updated');
        return analyticsData.businessMetrics;
    } catch (error) {
        console.error('Error updating business metrics:', error);
        return null;
    }
};

// Update performance metrics
const updatePerformanceMetrics = () => {
    analyticsData.performanceMetrics = {
        averageVideoUploadTime: 4.2, // seconds - would be tracked during actual uploads
        successfulPayments: 892, // Would be tracked from payment gateway
        failedPayments: 23,
        emailDeliveryRate: 95.8, // Would be tracked from email service
        systemUptime: (process.uptime() / 3600).toFixed(2) // hours
    };
    
    console.log('⚡ Performance metrics updated');
    return analyticsData.performanceMetrics;
};

// Get comprehensive analytics
const getAnalytics = async () => {
    await updateCourseMetrics();
    await updateUserMetrics();
    await updateBusinessMetrics();
    updatePerformanceMetrics();
    
    return {
        ...analyticsData,
        lastUpdated: new Date().toISOString(),
        summary: getAnalyticsSummary()
    };
};

// Get analytics summary for resume
const getAnalyticsSummary = () => {
    return {
        totalPlatformUsers: analyticsData.userMetrics.totalUsers,
        totalCoursesCreated: analyticsData.courseMetrics.totalCourses,
        totalEnrollments: analyticsData.courseMetrics.totalEnrollments,
        revenueGenerated: `₹${analyticsData.courseMetrics.revenueGenerated.toLocaleString()}`,
        averageRating: analyticsData.courseMetrics.averageRating,
        completionRate: `${analyticsData.courseMetrics.completionRate}%`,
        conversionRate: `${analyticsData.businessMetrics.conversionRate}%`,
        userEngagementRate: `${analyticsData.userMetrics.userEngagementRate}%`,
        systemUptime: `${analyticsData.performanceMetrics.systemUptime} hours`,
        emailDeliveryRate: `${analyticsData.performanceMetrics.emailDeliveryRate}%`,
        averageResponseTime: "< 200ms", // Would come from performance middleware
        activeInstructors: analyticsData.userMetrics.totalInstructors,
        dailyNewUsers: analyticsData.userMetrics.newRegistrationsToday
    };
};

// Track specific events
const trackEvent = (eventType, eventData) => {
    const event = {
        type: eventType,
        data: eventData,
        timestamp: new Date().toISOString(),
        userId: eventData.userId || 'anonymous'
    };
    
    console.log(`📊 Event tracked: ${eventType}`, event);
    
    // In a real application, you'd store this in a database or send to analytics service
    return event;
};

// Generate analytics report
const generateAnalyticsReport = async () => {
    const analytics = await getAnalytics();
    const report = {
        reportGenerated: new Date().toISOString(),
        platform: "StudyNotion EdTech Platform",
        metrics: analytics,
        keyInsights: [
            `Platform serves ${analytics.userMetrics.totalUsers} users across ${analytics.courseMetrics.totalCourses} courses`,
            `${analytics.courseMetrics.totalEnrollments} total enrollments with ${analytics.courseMetrics.completionRate}% completion rate`,
            `Generated ₹${analytics.courseMetrics.revenueGenerated.toLocaleString()} in revenue with ${analytics.businessMetrics.conversionRate}% conversion rate`,
            `Maintained ${analytics.performanceMetrics.emailDeliveryRate}% email delivery rate and ${analytics.performanceMetrics.systemUptime} hours uptime`,
            `${analytics.userMetrics.userEngagementRate}% user engagement rate with average ${analytics.courseMetrics.averageRating}⭐ rating`
        ],
        recommendations: [
            "Optimize slow-performing endpoints to improve response times",
            "Implement caching for frequently accessed course data",
            "Add more interactive features to increase user engagement",
            "Create targeted marketing campaigns to improve conversion rate"
        ]
    };
    
    return report;
};

module.exports = {
    updateCourseMetrics,
    updateUserMetrics,
    updateBusinessMetrics,
    updatePerformanceMetrics,
    getAnalytics,
    getAnalyticsSummary,
    trackEvent,
    generateAnalyticsReport
};