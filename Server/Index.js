const express = require("express");
const app = express();
const userRoutes = require("./Route/User");
const profileRoutes = require("./Route/Profile");
const courseRoutes = require("./Route/Course");
const paymentRoutes = require("./Route/Payment");
const contactUsRoute = require("./Route/Contact");
const database = require("./Configuration/Database");
const { performanceMonitor } = require("./Middleware/performance");
const analyticsRoutes = require("./Route/Analytics");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./Configuration/Cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;


dotenv.config();


database.connect();
 
app.use(performanceMonitor);
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);


cloudinaryConnect();


app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/analytics", analyticsRoutes);

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Welcome To StudyNotion",
	});
});


app.listen(PORT, () => {
	  console.log(`🚀 StudyNotion Server is running on port ${PORT}`);
  console.log(`📊 Analytics available at: http://localhost:${PORT}/api/v1/analytics`);
  console.log(`💡 Performance metrics: http://localhost:${PORT}/api/v1/analytics/performance/summary`);
  console.log(`📈 Resume metrics: http://localhost:${PORT}/api/v1/analytics/resume-metrics`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/analytics/health`);
});


