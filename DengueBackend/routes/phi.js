const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Violation = require("../models/Violation");
const BreedingSpot = require("../models/BreedingSpot");
const CaseReport = require("../models/CaseReport");

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ── POST /api/phi/violations — Issue fine + send email ──
router.post("/violations", async (req, res) => {
    try {
        const {
            ownerName, ownerEmail, address, district,
            violationType, fineAmount, notes, officerName, officerBadge, imageBase64
        } = req.body;

        // Save to MongoDB
        const violation = new Violation({
            ownerName, ownerEmail, address, district,
            violationType, fineAmount, notes, officerName, officerBadge, imageBase64
        });
        await violation.save();

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ownerEmail,
            subject: `Dengue Prevention Violation Notice — Fine #${violation._id.toString().slice(-6).toUpperCase()}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0D9488; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🦟 DengueSafe — Violation Notice</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <p>Dear <strong>${ownerName}</strong>,</p>
            <p>A dengue prevention violation has been recorded at your premises during a PHI inspection.</p>
            
            <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0;">
              <h3 style="color: #0D9488; margin: 0 0 12px 0;">Violation Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748b;">Fine Reference</td><td style="padding: 8px 0; font-weight: bold;">#${violation._id.toString().slice(-6).toUpperCase()}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Violation Type</td><td style="padding: 8px 0;">${violationType}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Address</td><td style="padding: 8px 0;">${address}, ${district}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Fine Amount</td><td style="padding: 8px 0; color: #EF4444; font-weight: bold; font-size: 18px;">Rs. ${fineAmount.toLocaleString()}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Issued By</td><td style="padding: 8px 0;">${officerName} (Badge: ${officerBadge})</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b;">Date</td><td style="padding: 8px 0;">${new Date().toLocaleDateString('en-GB')}</td></tr>
              </table>
            </div>

            ${notes ? `<p><strong>Officer Notes:</strong> ${notes}</p>` : ''}

            <div style="background: #FEF3C7; padding: 12px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0; color: #92400E;">⚠️ Please pay this fine within <strong>14 days</strong> at your nearest Municipal Council office.</p>
            </div>

            <p style="color: #64748b; font-size: 13px;">This is an automated notice from the DengueSafe PHI Monitoring System.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        // Update emailSent flag
        violation.emailSent = true;
        await violation.save();

        res.json({ success: true, message: "Fine issued and email sent", data: violation });
    } catch (error) {
        console.error("Violation error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── GET /api/phi/violations — Get all violations ──
router.get("/violations", async (req, res) => {
    try {
        const violations = await Violation.find().sort({ issuedAt: -1 });
        res.json({ success: true, data: violations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── POST /api/phi/breeding-spots — Record breeding spot ──
router.post("/breeding-spots", async (req, res) => {
    try {
        const {
            district, address, latitude, longitude,
            spotType, description, imageBase64, severity, officerName
        } = req.body;

        const spot = new BreedingSpot({
            district, address, latitude, longitude,
            spotType, description, imageBase64, severity, officerName
        });
        await spot.save();

        res.json({ success: true, message: "Breeding spot recorded", data: spot });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── GET /api/phi/breeding-spots — Get all breeding spots ──
router.get("/breeding-spots", async (req, res) => {
    try {
        const spots = await BreedingSpot.find().sort({ recordedAt: -1 });
        res.json({ success: true, count: spots.length, data: spots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── GET /api/phi/dashboard-stats — MongoDB Dashboard Stats ──
router.get("/dashboard-stats", async (req, res) => {
    try {
        const now = new Date();
        const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const weekAgo = new Date(Date.now() - 7 * 24 * 3600000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000);

        const [todayStats, thisWeek, allTimeDeaths] = await Promise.all([
            CaseReport.aggregate([
                { $match: { reportedAt: { $gte: todayUTC } } },
                { $group: { _id: null, cases: { $sum: "$caseCount" }, deaths: { $sum: "$deathCount" } } }
            ]),
            CaseReport.aggregate([
                { $match: { reportedAt: { $gte: weekAgo } } },
                { $group: { _id: null, total: { $sum: "$caseCount" } } }
            ]),
            CaseReport.aggregate([{ $group: { _id: null, total: { $sum: "$deathCount" } } }]),
        ]);

        const todayVal = todayStats[0]?.cases || 0;
        const todayDeaths = todayStats[0]?.deaths || 0;
        const thisWeekVal = thisWeek[0]?.total || 0;
        const totalDeaths = allTimeDeaths[0]?.total || 0;

        const activeDistricts = await CaseReport.aggregate([
            { $match: { reportedAt: { $gte: weekAgo } } },
            { $group: { _id: "$district", total: { $sum: "$caseCount" } } },
            { $match: { total: { $gte: 100 } } },
        ]);

        const highRiskAgg = await CaseReport.aggregate([
            { $match: { reportedAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: "$district", total: { $sum: "$caseCount" } } },
            { $match: { total: { $gte: 100 } } }
        ]);

        res.json({
            success: true,
            data: {
                todayCases: todayVal,
                todayDeaths: todayDeaths,
                weeklyCases: thisWeekVal,
                totalDeaths: totalDeaths,
                highRiskAreas: highRiskAgg.length,
                activeOutbreaks: activeDistricts.length,
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;