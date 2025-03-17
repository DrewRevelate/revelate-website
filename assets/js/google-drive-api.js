/**
 * Revelate Operations - Google Drive Integration
 * Connects the website with Google Drive for CRM functionality
 */

// Google API credentials - Replace with your actual client ID from Google Cloud Console
const CLIENT_ID = '297511422418-3rrhv6akmi5275nvtgobn1f14l298tmd.apps.googleusercontent.com';
const API_KEY = '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';

// Discovery docs and scopes for Google Sheets/Drive APIs
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';

// Spreadsheet IDs for contacts and assessments
const CONTACTS_SPREADSHEET_ID = 'YOUR_CONTACTS_SPREADSHEET_ID';
const ASSESSMENT_SPREADSHEET_ID = 'YOUR_ASSESSMENT_SPREADSHEET_ID';

// Initialize the Google API client
function initGoogleApi() {
  gapi.load('client:auth2', initClient);
}

// Initialize the API client library
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    // Listen for sign-in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    
    // Handle the initial sign-in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    
    // Add auth button listeners if you have them
    document.getElementById('authorize_button')?.addEventListener('click', handleAuthClick);
    document.getElementById('signout_button')?.addEventListener('click', handleSignoutClick);
  }).catch(error => {
    console.error('Error initializing Google API client', error);
  });
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  // You can update UI elements here based on sign-in status
  console.log('Google API signed in:', isSignedIn);
}

// Handle login click
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

// Handle logout click
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

// Save contact form data to Google Sheets
function saveContactToGoogleSheets(contactData) {
  return new Promise((resolve, reject) => {
    // Check if signed in
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn().then(processContactData);
    } else {
      processContactData();
    }
    
    function processContactData() {
      // Format date
      const timestamp = new Date().toISOString();
      
      // Prepare the values to append
      const values = [
        [
          timestamp,
          contactData.name,
          contactData.email,
          contactData.phone || '',
          contactData.company || '',
          contactData.interest,
          contactData.message,
          'Website Contact Form'
        ]
      ];
      
      // Use the Sheets API to append data
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: 1av_zXI-ObPQmOPzFtoWVe2oQQ7ei8IcBJz74-Fj3yzI,
        range: 'Contacts!A:H', // Assuming columns A-H are for the contact data
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      }).then(response => {
        console.log('Contact saved:', response);
        resolve(response);
      }).catch(error => {
        console.error('Error saving contact:', error);
        reject(error);
      });
    }
  });
}

// Save assessment data to Google Sheets
function saveAssessmentToGoogleSheets(assessmentData) {
  return new Promise((resolve, reject) => {
    // Check if signed in
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn().then(processAssessmentData);
    } else {
      processAssessmentData();
    }
    
    function processAssessmentData() {
      // Format date
      const timestamp = new Date().toISOString();
      
      // Extract scores from assessment data
      const dataInfrastructureScore = calculateDimensionScore([
        parseInt(assessmentData.crmImplementation),
        parseInt(assessmentData.systemIntegration),
        parseInt(assessmentData.dataQuality)
      ]);
      
      const analyticsScore = calculateDimensionScore([
        parseInt(assessmentData.analyticsCapabilities),
        parseInt(assessmentData.revenueAttribution),
        parseInt(assessmentData.dataDrivenDecisions)
      ]);
      
      const processScore = calculateDimensionScore([
        parseInt(assessmentData.salesProcess),
        parseInt(assessmentData.leadProcess),
        parseInt(assessmentData.retentionProcess)
      ]);
      
      const teamScore = calculateDimensionScore([
        parseInt(assessmentData.teamAlignment),
        parseInt(assessmentData.revenueForecasting),
        parseInt(assessmentData.revopsLeadership)
      ]);
      
      // Calculate overall score
      const overallScore = calculateDimensionScore([
        dataInfrastructureScore,
        analyticsScore,
        processScore,
        teamScore
      ]);
      
      // Prepare the values to append - adjust columns as needed
      const values = [
        [
          timestamp,
          assessmentData.fullName,
          assessmentData.email,
          assessmentData.companyName,
          assessmentData.jobTitle,
          assessmentData.industry,
          assessmentData.companySize,
          dataInfrastructureScore.toFixed(2),
          analyticsScore.toFixed(2),
          processScore.toFixed(2),
          teamScore.toFixed(2),
          overallScore.toFixed(2),
          getMaturityLevel(overallScore),
          // Individual question scores
          assessmentData.crmImplementation,
          assessmentData.systemIntegration,
          assessmentData.dataQuality,
          assessmentData.analyticsCapabilities,
          assessmentData.revenueAttribution,
          assessmentData.dataDrivenDecisions,
          assessmentData.salesProcess,
          assessmentData.leadProcess,
          assessmentData.retentionProcess,
          assessmentData.teamAlignment,
          assessmentData.revenueForecasting,
          assessmentData.revopsLeadership
        ]
      ];
      
      // Use the Sheets API to append data
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: ASSESSMENT_SPREADSHEET_ID,
        range: 'Assessments!A:Z', // Assuming we have multiple columns for all the data
        valueInputOption: 'USER_ENTERED',
        resource: { values }
      }).then(response => {
        console.log('Assessment saved:', response);
        resolve(response);
      }).catch(error => {
        console.error('Error saving assessment:', error);
        reject(error);
      });
    }
  });
}

// Helper function to calculate dimension score (average)
function calculateDimensionScore(scores) {
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Helper function to determine maturity level based on score
function getMaturityLevel(score) {
  if (score < 1.5) return 'Beginning';
  if (score < 2.5) return 'Developing';
  if (score < 3.5) return 'Established';
  if (score < 4.5) return 'Advanced';
  return 'Leading';
}

// Export functions for use in other files
window.RevOpsAPI = {
  initGoogleApi,
  saveContactToGoogleSheets,
  saveAssessmentToGoogleSheets
};