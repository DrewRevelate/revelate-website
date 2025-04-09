require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { v4: uuidv4 } = require('uuid');

// Supabase connection setup
const supabaseUrl = 'https://ynkuozdffpsogpziaize.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV file paths
const csvDir = '/Users/drewlambert/Desktop';
const accountsPath = path.join(csvDir, 'Project Management - Accounts.csv');
const contactsPath = path.join(csvDir, 'Project Management - Contacts.csv');
const projectsPath = path.join(csvDir, 'Project Management - Projects.csv');
const tasksPath = path.join(csvDir, 'Project Management - Tasks.csv');
const meetingsPath = path.join(csvDir, 'Project Management - Meetings.csv');
const documentsPath = path.join(csvDir, 'Project Management - Documents.csv');
const purchasesPath = path.join(csvDir, 'Project Management - Client Purchases.csv');
const scheduleLinksPath = path.join(csvDir, 'Project Management - Schedule Links.csv');

// Track ID mappings from old to new
const idMappings = {
  accounts: new Map(), // Map from company name to new UUID
  users: new Map(),    // Map from email to new UUID
  projects: new Map()  // Map from project name to new UUID
};

// Helper functions
const parseCSV = async (filePath) => {
  console.log(`Reading CSV file: ${filePath}`);
  const csvFile = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(`CSV parsed successfully with ${results.data.length} rows.`);
        resolve(results.data);
      }
    });
  });
};

// Migration functions
const migrateAccounts = async () => {
  console.log('Migrating accounts...');
  const accounts = await parseCSV(accountsPath);
  
  for (const account of accounts) {
    if (!account.Company) continue;
    
    const newId = uuidv4();
    idMappings.accounts.set(account.Company, newId);
    
    const { data, error } = await supabase
      .from('companies')
      .insert({
        id: newId,
        company: account.Company,
        photo: account.Photo,
        ltv: account.LTV,
        email_alias: account['Email Alias'],
        website: account.Website,
        primary_need: account['Primary Need'],
        crm: account.CRM,
        email: account.Email,
        engagement_platform: account['Engagement Platform'],
        finance_tools: account['Finance Tools'],
        other: account.Other,
        link_to_notes: account['Link to Notes'],
        username: account.Username,
        pw: account.PW,
        other_username: account['Other Username'],
        other_pw: account['Other PW'],
        purchased_hours: account['Purchased Hours'] || 0,
        used_hours: account['Used Hours'] || 0,
        remaining_hours: account['Remaining Hours'] || 0
      });
    
    if (error) {
      console.error('Error inserting account:', error);
    } else {
      console.log(`Successfully migrated account: ${account.Company}`);
    }
  }
  
  console.log(`${accounts.length} accounts migrated.`);
};

const migrateUsers = async () => {
  console.log('Migrating users...');
  const contacts = await parseCSV(contactsPath);
  
  let validContacts = 0;
  
  for (const contact of contacts) {
    // Skip empty records
    if (!contact.Email && !contact['Full Name']) continue;
    
    validContacts++;
    
    const newId = uuidv4();
    if (contact.Email) {
      idMappings.users.set(contact.Email, newId);
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: newId,
        email: contact.Email,
        account: contact.Account,
        full_name: contact['Full Name'],
        title: contact.Title,
        phone: contact.Phone ? String(contact.Phone) : null,
        address: contact.Address,
        photo: contact.Photo,
        retainer_agreement_accepted: contact['Retainer Agreement Accepted'] === 'Yes',
        hourly_agreement_accepted: contact['Hourly Agreement Accepted'] === 'Yes',
        customer_portal_access: contact['Customer Portal Access'] === true
      });
    
    if (error) {
      console.error(`Error inserting user ${contact.Email || contact['Full Name']}:`, error);
    } else {
      console.log(`Successfully migrated user: ${contact.Email || contact['Full Name']}`);
    }
  }
  
  console.log(`${validContacts} users migrated.`);
};

const migrateProjects = async () => {
  console.log('Migrating projects...');
  const projects = await parseCSV(projectsPath);
  
  for (const project of projects) {
    if (!project['Project Name']) continue;
    
    const newId = uuidv4();
    idMappings.projects.set(project['Project Name'], newId);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        id: newId,
        project_name: project['Project Name'],
        description: project.Description,
        status: project.Status,
        start_date: project['Start Date'],
        created_date: project['Created Date'] ? new Date(project['Created Date']).toISOString() : null,
        created_by: project['Created By'],
        account: project.Account,
        account_website: project['Account Website'],
        formatted_status: project['Formatted Status']
      });
    
    if (error) {
      console.error(`Error inserting project ${project['Project Name']}:`, error);
    } else {
      console.log(`Successfully migrated project: ${project['Project Name']}`);
    }
  }
  
  console.log(`${projects.length} projects migrated.`);
};

const migrateTasks = async () => {
  console.log('Migrating tasks...');
  const tasks = await parseCSV(tasksPath);
  
  for (const task of tasks) {
    // Tasks have the title in column "1"
    if (!task['1'] && !task.Description) continue;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: uuidv4(),
        title: task['1'],
        description: task.Description,
        project: task.Project,
        account: task.Account,
        status: task.Status,
        priority: task.Priority,
        created_date: task['Created Date'],
        formatted_status: task['Formatted Status'],
        time_spent: task['Time spent'],
        completed_date: task['Completed Date'],
        requester: task.Requester
      });
    
    if (error) {
      console.error(`Error inserting task ${task['1'] || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated task: ${task['1'] || 'Untitled'}`);
    }
  }
  
  console.log(`${tasks.length} tasks migrated.`);
};

const migrateMeetings = async () => {
  console.log('Migrating meetings...');
  const meetings = await parseCSV(meetingsPath);
  
  for (const meeting of meetings) {
    if (!meeting['Event Name'] && !meeting.Date) continue;
    
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        id: uuidv4(),
        date: meeting.Date,
        duration: meeting.Duration,
        organizer: meeting.organizer,
        organizer_name: meeting['Organizer Name'],
        attendees: meeting.attendees,
        event_name: meeting['Event Name'],
        meeting_link: meeting['Meeting Link'],
        agenda: meeting.Agenda,
        transcript: meeting.Transcript,
        recording: meeting.Recording,
        summary: meeting.Summary
      });
    
    if (error) {
      console.error(`Error inserting meeting ${meeting['Event Name'] || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated meeting: ${meeting['Event Name'] || 'Untitled'}`);
    }
  }
  
  console.log(`${meetings.length} meetings migrated.`);
};

const migrateDocuments = async () => {
  console.log('Migrating documents...');
  const documents = await parseCSV(documentsPath);
  
  for (const document of documents) {
    if (!document['Document Link']) continue;
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        id: uuidv4(),
        account: document.Account,
        document_link: document['Document Link']
      });
    
    if (error) {
      console.error(`Error inserting document for ${document.Account || 'Unknown'}:`, error);
    } else {
      console.log(`Successfully migrated document for: ${document.Account || 'Unknown'}`);
    }
  }
  
  console.log(`${documents.length} documents migrated.`);
};

const migrateTimePackages = async () => {
  console.log('Migrating time packages...');
  
  // Migrate from Client Purchases
  const purchases = await parseCSV(purchasesPath);
  
  for (const purchase of purchases) {
    if (!purchase.Client || !purchase['Quantity (Hours)']) continue;
    
    const { data, error } = await supabase
      .from('time_packages')
      .insert({
        id: uuidv4(),
        client: purchase.Client,
        date: purchase.Date,
        quantity_hours: purchase['Quantity (Hours)']
      });
    
    if (error) {
      console.error(`Error inserting time package for ${purchase.Client}:`, error);
    } else {
      console.log(`Successfully migrated time package for: ${purchase.Client}`);
    }
  }
  
  console.log(`${purchases.length} time packages migrated.`);
};

const migrateScheduleLinks = async () => {
  console.log('Migrating schedule links...');
  const scheduleLinks = await parseCSV(scheduleLinksPath);
  
  for (const link of scheduleLinks) {
    if (!link.Name && !link.Link && !link['Formatted Link']) continue;
    
    const { data, error } = await supabase
      .from('schedule_links')
      .insert({
        id: uuidv4(),
        name: link.Name,
        use_case: link['Use Case'],
        duration: link.Duration,
        link: link.Link,
        formatted_link: link['Formatted Link']
      });
    
    if (error) {
      console.error(`Error inserting schedule link ${link.Name || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated schedule link: ${link.Name || 'Untitled'}`);
    }
  }
  
  console.log(`${scheduleLinks.length} schedule links migrated.`);
};

// Run the migration
const runMigration = async () => {
  try {
    console.log('Starting migration...');
    
    // Migrate in order of dependencies
    await migrateAccounts();
    await migrateUsers();
    await migrateProjects();
    await migrateTasks();
    await migrateMeetings();
    await migrateDocuments();
    await migrateTimePackages();
    await migrateScheduleLinks();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

runMigration();
