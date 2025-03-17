/**
 * Revelate Operations - Google Drive Integration
 * Connects the website with Google Drive for CRM functionality
 */

// Google API credentials
const CLIENT_ID = '297511422418-3rrhv6akmi5275nvtgobn1f14l298tmd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCsRn0qT036yHS0B3SXnhBqTAx9CrR-BJ4'; // Replace with actual API key (not client secret)

// Discovery docs and scopes for Google Sheets API only (reduced scope)
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Spreadsheet IDs for contacts and assessments
const CONTACTS_SPREADSHEET_ID = '1av_zXI-ObPQmOPzFtoWVe2oQQ7ei8IcBJz74-Fj3yzI';
const ASSESSMENT_SPREADSHEET_ID = '1av_zXI-ObPQmOPzFtoWVe2oQQ7ei8IcBJz74-Fj3yzI'; // Using same sheet for now

// Status tracking
let apiInitialized = false;
let authPromptShown = false;

// Initialize the Google API client
function initGoogleApi() {
  // Only initialize once
  if (apiInitialized) return;
  
  console.log('Initializing Google API client...');
  
  // Create hidden auth buttons if they don't exist
  if (\!document.getElementById('authorize_button')) {
    const authButton = document.createElement('button');
    authButton.id = 'authorize_button';
    authButton.style.display = 'none';
    document.body.appendChild(authButton);
  }
  
  // Load the API client library
  gapi.load('client:auth2', initClient);
}

// Initialize the API client library
function initClient() {
  console.log('Setting up client...');
  
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    ux_mode: 'popup' // Ensure popup mode for better UX
  }).then(() => {
    apiInitialized = true;
    
    // Listen for sign-in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    
    // Handle the initial sign-in state
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    
    // Add auth button listeners
    document.getElementById('authorize_button')?.addEventListener('click', handleAuthClick);
    
    console.log('Google API client initialized');
  }).catch(error => {
    console.error('Error initializing Google API client:', error);
    // Try to provide more helpful error message
    if (error.details && typeof error.details === 'string' && error.details.includes('origin')) {
      console.error('This may be due to an unauthorized origin. Make sure your domain is added to the allowed origins in Google Cloud Console.');
    }
  });
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  console.log('Google API signed in:', isSignedIn);
}

// Handle login click
function handleAuthClick() {
  console.log('Requesting auth...');
  return gapi.auth2.getAuthInstance().signIn({
    prompt: 'consent'  // Force consent screen
  }).catch(error => {
    console.error('Auth error:', error);
    // Check for common errors
    if (error.error === 'popup_blocked') {
      alert('Please allow popups for this site to enable Google Drive integration.');
    }
    return Promise.reject(error);
  });
}

// Handle logout click
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

// Ensure user is authenticated, showing auth UI if needed
function ensureAuthenticated() {
  if (\!apiInitialized) {
    console.error('Google API not initialized yet. Please try again in a moment.');
    return Promise.reject(new Error('API not initialized'));
  }

  if (\!gapi.auth2.getAuthInstance().isSignedIn.get()) {
    if (\!authPromptShown) {
      console.log('User not signed in, requesting authentication...');
      authPromptShown = true;
      return handleAuthClick();
    } else {
      // Don't prompt multiple times in the same session
      return Promise.reject(new Error('Authentication required'));
    }
  }

  return Promise.resolve();
}

// Save contact form data to Google Sheets
function saveContactToGoogleSheets(contactData) {
  return new Promise((resolve, reject) => {
    console.log('Saving contact data to Google Sheets:', contactData);
    
    ensureAuthenticated()
      .then(processContactData)
      .catch(error => {
        console.error('Authentication error:', error);
        reject(error);
      });
    
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
      
      console.log('Sending data to sheets...');
      
      // Use the Sheets API to append data
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: CONTACTS_SPREADSHEET_ID,
        range: 'Sheet1\!A:H', // Changed to Sheet1 which is the default first sheet name
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS', // Ensure it adds new rows
        resource: { values }
      }).then(response => {
        console.log('Contact saved successfully:', response);
        resolve(response);
      }).catch(error => {
        console.error('Error saving contact to Sheets API:', error);
        
        // More detailed error logging
        if (error.result && error.result.error) {
          console.error('API Error details:', error.result.error);
        }
        
        reject(error);
      });
    }
  });
}

// Save assessment data to Google Sheets
function saveAssessmentToGoogleSheets(assessmentData) {
  return new Promise((resolve, reject) => {
    console.log('Saving assessment data to Google Sheets');
    
    ensureAuthenticated()
      .then(processAssessmentData)
      .catch(error => {
        console.error('Authentication error:', error);
        reject(error);
      });
    
    function processAssessmentData() {
      // Format date
      const timestamp = new Date().toISOString();
      
      // Extract scores from assessment data - with better error handling
      const getScore = (field) => {
        const value = parseInt(assessmentData[field]);
        return isNaN(value) ? 0 : value; // Default to 0 if invalid
      };
      
      try {
        // Calculate scores more safely
        const dataInfrastructureScore = calculateDimensionScore([
          getScore('crmImplementation'),
          getScore('systemIntegration'),
          getScore('dataQuality')
        ]);
        
        const analyticsScore = calculateDimensionScore([
          getScore('analyticsCapabilities'),
          getScore('revenueAttribution'),
          getScore('dataDrivenDecisions')
        ]);
        
        const processScore = calculateDimensionScore([
          getScore('salesProcess'),
          getScore('leadProcess'),
          getScore('retentionProcess')
        ]);
        
        const teamScore = calculateDimensionScore([
          getScore('teamAlignment'),
          getScore('revenueForecasting'),
          getScore('revopsLeadership')
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
            assessmentData.fullName || 'Unknown',
            assessmentData.email || 'No email',
            assessmentData.companyName || 'Unknown',
            assessmentData.jobTitle || 'Unknown',
            assessmentData.industry || 'Unknown',
            assessmentData.companySize || 'Unknown',
            dataInfrastructureScore.toFixed(2),
            analyticsScore.toFixed(2),
            processScore.toFixed(2),
            teamScore.toFixed(2),
            overallScore.toFixed(2),
            getMaturityLevel(overallScore),
            // Individual question scores with default values
            getScore('crmImplementation'),
            getScore('systemIntegration'),
            getScore('dataQuality'),
            getScore('analyticsCapabilities'),
            getScore('revenueAttribution'),
            getScore('dataDrivenDecisions'),
            getScore('salesProcess'),
            getScore('leadProcess'),
            getScore('retentionProcess'),
            getScore('teamAlignment'),
            getScore('revenueForecasting'),
            getScore('revopsLeadership')
          ]
        ];
        
        // Use the Sheets API to append data
        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: ASSESSMENT_SPREADSHEET_ID,
          range: 'Sheet2\!A:Z', // Using Sheet2 for assessments
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          resource: { values }
        }).then(response => {
          console.log('Assessment saved successfully:', response);
          resolve(response);
        }).catch(error => {
          console.error('Error saving assessment to Sheets API:', error);
          
          // More detailed error logging
          if (error.result && error.result.error) {
            console.error('API Error details:', error.result.error);
          }
          
          reject(error);
        });
      } catch (error) {
        console.error('Error processing assessment data:', error);
        reject(error);
      }
    }
  });
}

// Helper function to calculate dimension score (average) with error handling
function calculateDimensionScore(scores) {
  // Filter out any invalid scores to prevent NaN results
  const validScores = scores.filter(score => \!isNaN(score));
  
  if (validScores.length === 0) return 0; // Prevent division by zero
  
  return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
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
