/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Nodemailer setup with your email provider
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other providers like SendGrid, Mailgun, etc.
    auth: {
        user: 'muzzom1@gmail.com', // Replace with your email
        pass: 'MartinaJ@Ondangwa12'    // Replace with your email password or app-specific password
    }
});

// Cloud Function to send acknowledgment email
exports.sendAcknowledgmentEmail = functions.firestore
    .document('Acknowledgments/{acknowledgmentId}')
    .onCreate(async (snap, context) => {
        const acknowledgmentData = snap.data();

        // Retrieve the user's email based on the user ID
        const userId = acknowledgmentData.userId;
        const userRecord = await admin.auth().getUser(userId);
        const userEmail = userRecord.email;

        // Email content
        const mailOptions = {
            from: 'your-email@gmail.com', // Sender address
            to: userEmail,                // Recipient's email from Firebase Auth
            subject: 'Accreditation Application Submitted',
            text: acknowledgmentData.message // Message from the Firestore acknowledgment document
        };

        try {
            // Send the email
            await transporter.sendMail(mailOptions);
            console.log('Acknowledgment email sent to:', userEmail);
        } catch (error) {
            console.error('Error sending acknowledgment email:', error);
        }
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
