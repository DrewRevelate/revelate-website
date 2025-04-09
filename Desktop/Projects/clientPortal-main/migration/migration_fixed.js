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
  accounts: new Map(), // Map from company name/softr ID to new UUID
  users: new Map(),    // Map from email/softr ID to new UUID
  projects: new Map()  // Map from project name/softr ID to new UUID
};

// Helper functions
const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      }
    });
  });
};

const statusMap = (status) => {
  // Map status values to standardized ones
  if (!status) return 'new';
  
  const statusLower = status.toLowerCase();
  if (statusLower.includes('active') || statusLower.includes('in progress')) return 'active';
  if (statusLower.includes('plan')) return 'planning';
  if (statusLower.includes('hold')) return 'on-hold';
  if (statusLower.includes('complete')) return 'completed';
  if (statusLower.includes('new')) return 'new';
  if (statusLower.includes('review')) return 'review';
  return status;
};

const priorityMap = (priority) => {
  // Map priority values to standardized ones
  if (!priority) return 'medium';
  
  const priorityLower = priority.toLowerCase();
  if (priorityLower.includes('high')) return 'high';
  if (priorityLower.includes('medium') || priorityLower.includes('med')) return 'medium';
  if (priorityLower.includes('low')) return 'low';
  return 'medium'; // Default
};

// Check if a table exists
const tableExists = async (tableName, schema = 'app') => {
  const { data, error } = await supabase.rpc('check_table_exists', { 
    schema_name: schema, 
    table_name: tableName 
  });
  
  if (error) {
    console.error(`Error checking if table ${schema}.${tableName} exists:`, error);
    return false;
  }
  
  return data;
};

// Create RPC function to check if table exists
const createCheckTableFunction = async () => {
  const { data, error } = await supabase.rpc('create_table_check_function', {});
  
  if (error) {
    // Create the function manually if RPC doesn't exist
    const { data: manualCreate, error: manualError } = await supabase.sql(`
      CREATE OR REPLACE FUNCTION check_table_exists(schema_name text, table_name text)
      RETURNS boolean AS $$
      DECLARE
        exists boolean;
      BEGIN
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = schema_name
          AND table_name = table_name
        ) INTO exists;
        RETURN exists;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    if (manualError) {
      console.error('Error creating check table function:', manualError);
    }
  }
};

// Create a basic companies table if it doesn't exist
const ensureCompaniesTable = async () => {
  // Check if companies table exists first
  const { data, error } = await supabase.from('companies').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Companies table does not exist. Creating it...');
    
    // Create the companies table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.companies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        website TEXT,
        email_alias TEXT,
        crm TEXT,
        engagement_platform TEXT,
        finance_tools TEXT,
        primary_need TEXT,
        notes_link TEXT,
        photo_url TEXT,
        ltv TEXT,
        purchased_hours INTEGER DEFAULT 0,
        used_hours INTEGER DEFAULT 0,
        remaining_hours INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating companies table:', createError);
    } else {
      console.log('Companies table created successfully.');
    }
  }
};

// Create a basic profiles table if it doesn't exist
const ensureProfilesTable = async () => {
  // Check if profiles table exists first
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Profiles table does not exist. Creating it...');
    
    // Create the profiles table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        company INTEGER REFERENCES public.companies(id),
        position TEXT,
        avatar_url TEXT,
        retainer_agreement BOOLEAN DEFAULT FALSE,
        hourly_agreement BOOLEAN DEFAULT FALSE,
        portal_access BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating profiles table:', createError);
    } else {
      console.log('Profiles table created successfully.');
    }
  }
};

// Create a basic projects table if it doesn't exist
const ensureProjectsTable = async () => {
  // Check if projects table exists first
  const { data, error } = await supabase.from('projects').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Projects table does not exist. Creating it...');
    
    // Create the projects table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.projects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'Planning',
        start_date DATE,
        client_id INTEGER REFERENCES public.companies(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating projects table:', createError);
    } else {
      console.log('Projects table created successfully.');
    }
  }
};

// Create a basic tasks table if it doesn't exist
const ensureTasksTable = async () => {
  // Check if tasks table exists first
  const { data, error } = await supabase.from('tasks').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Tasks table does not exist. Creating it...');
    
    // Create the tasks table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'Pending',
        priority TEXT NOT NULL DEFAULT 'Medium',
        project_id INTEGER REFERENCES public.projects(id),
        client_id INTEGER REFERENCES public.companies(id),
        requester TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating tasks table:', createError);
    } else {
      console.log('Tasks table created successfully.');
    }
  }
};

// Create a basic meetings table if it doesn't exist
const ensureMeetingsTable = async () => {
  // Check if meetings table exists first
  const { data, error } = await supabase.from('meetings').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Meetings table does not exist. Creating it...');
    
    // Create the meetings table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.meetings (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT NOT NULL DEFAULT 'Scheduled',
        meeting_link TEXT,
        recording_link TEXT,
        transcript_link TEXT,
        project_id INTEGER REFERENCES public.projects(id),
        client_id INTEGER REFERENCES public.companies(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating meetings table:', createError);
    } else {
      console.log('Meetings table created successfully.');
    }
  }
};

// Create a basic documents table if it doesn't exist
const ensureDocumentsTable = async () => {
  // Check if documents table exists first
  const { data, error } = await supabase.from('documents').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Documents table does not exist. Creating it...');
    
    // Create the documents table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.documents (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        file_path TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'Current',
        project_id INTEGER REFERENCES public.projects(id),
        client_id INTEGER REFERENCES public.companies(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating documents table:', createError);
    } else {
      console.log('Documents table created successfully.');
    }
  }
};

// Create a basic time_packages table if it doesn't exist
const ensureTimePackagesTable = async () => {
  // Check if time_packages table exists first
  const { data, error } = await supabase.from('time_packages').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Time packages table does not exist. Creating it...');
    
    // Create the time_packages table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.time_packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        hours DECIMAL(8,2) NOT NULL,
        hours_used DECIMAL(8,2) DEFAULT 0,
        purchase_date DATE NOT NULL,
        expiration_date DATE,
        status TEXT NOT NULL DEFAULT 'Active',
        client_id INTEGER REFERENCES public.companies(id) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating time_packages table:', createError);
    } else {
      console.log('Time packages table created successfully.');
    }
  }
};

// Create a basic schedule_links table if it doesn't exist
const ensureScheduleLinksTable = async () => {
  // Check if schedule_links table exists first
  const { data, error } = await supabase.from('schedule_links').select('*').limit(1);
  
  if (error && error.code === '42P01') { // Table doesn't exist
    console.log('Schedule links table does not exist. Creating it...');
    
    // Create the schedule_links table
    const { error: createError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.schedule_links (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        use_case TEXT,
        duration TEXT,
        url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    if (createError) {
      console.error('Error creating schedule_links table:', createError);
    } else {
      console.log('Schedule links table created successfully.');
    }
  }
};

// Migration functions
const migrateAccounts = async () => {
  console.log('Migrating accounts...');
  const accounts = await parseCSV(accountsPath);
  
  for (const account of accounts) {
    if (!account.Company) continue;
    
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: account.Company,
        website: account.Website,
        email_alias: account['Email Alias'],
        crm: account.CRM,
        engagement_platform: account['Engagement Platform'],
        finance_tools: account['Finance Tools'],
        primary_need: account['Primary Need'],
        notes_link: account['Link to Notes'],
        photo_url: account.Photo,
        ltv: account.LTV,
        purchased_hours: account['Purchased Hours'] || 0,
        used_hours: account['Used Hours'] || 0,
        remaining_hours: account['Remaining Hours'] || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error(`Error inserting account ${account.Company}:`, error);
    } else if (data && data.length > 0) {
      console.log(`Successfully migrated account: ${account.Company} with ID ${data[0].id}`);
      idMappings.accounts.set(account.Company, data[0].id);
      if (account['🔐 Softr Record ID']) {
        idMappings.accounts.set(account['🔐 Softr Record ID'], data[0].id);
      }
    }
  }
  
  console.log(`${accounts.length} accounts migration attempted.`);
};

const migrateUsers = async () => {
  console.log('Migrating users...');
  const contacts = await parseCSV(contactsPath);
  
  let validContacts = 0;
  
  for (const contact of contacts) {
    // Skip if no email (required field)
    if (!contact.Email) continue;
    
    validContacts++;
    
    const newId = uuidv4();
    idMappings.users.set(contact.Email, newId);
    if (contact['🔐 Softr Record ID']) {
      idMappings.users.set(contact['🔐 Softr Record ID'], newId);
    }
    
    // Look up account ID
    let companyId = null;
    if (contact.Account && idMappings.accounts.has(contact.Account)) {
      companyId = idMappings.accounts.get(contact.Account);
    }
    
    // Parse name
    let firstName = '';
    let lastName = '';
    if (contact['Full Name']) {
      const nameParts = contact['Full Name'].split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: newId,
        email: contact.Email,
        first_name: firstName,
        last_name: lastName,
        company: companyId,
        position: contact.Title,
        phone: contact.Phone ? String(contact.Phone) : null,
        avatar_url: contact.Photo,
        retainer_agreement: contact['Retainer Agreement Accepted'] === 'Yes',
        hourly_agreement: contact['Hourly Agreement Accepted'] === 'Yes',
        portal_access: contact['Customer Portal Access'] === true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting user ${contact.Email}:`, error);
    } else {
      console.log(`Successfully migrated user: ${contact.Email}`);
    }
  }
  
  console.log(`${validContacts} users migration attempted.`);
};

const migrateProjects = async () => {
  console.log('Migrating projects...');
  const projects = await parseCSV(projectsPath);
  
  for (const project of projects) {
    if (!project['Project Name']) continue;
    
    // Look up client ID
    let clientId = null;
    if (project.Account && idMappings.accounts.has(project.Account)) {
      clientId = idMappings.accounts.get(project.Account);
    }
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: project['Project Name'],
        description: project.Description,
        status: statusMap(project.Status || ''),
        start_date: project['Start Date'] ? new Date(project['Start Date']).toISOString() : null,
        client_id: clientId,
        created_at: project['Created Date'] ? new Date(project['Created Date']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error(`Error inserting project ${project['Project Name']}:`, error);
    } else if (data && data.length > 0) {
      console.log(`Successfully migrated project: ${project['Project Name']} with ID ${data[0].id}`);
      idMappings.projects.set(project['Project Name'], data[0].id);
      if (project['🔐 Softr Record ID']) {
        idMappings.projects.set(project['🔐 Softr Record ID'], data[0].id);
      }
    }
  }
  
  console.log(`${projects.length} projects migration attempted.`);
};

const migrateTasks = async () => {
  console.log('Migrating tasks...');
  const tasks = await parseCSV(tasksPath);
  
  for (const task of tasks) {
    // Skip if no title (first column)
    if (!task['1'] && !task.Description) continue;
    
    // Look up project ID
    let projectId = null;
    if (task.Project && idMappings.projects.has(task.Project)) {
      projectId = idMappings.projects.get(task.Project);
    }
    
    // Look up client ID
    let clientId = null;
    if (task.Account && idMappings.accounts.has(task.Account)) {
      clientId = idMappings.accounts.get(task.Account);
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task['1'] || 'Untitled Task',
        description: task.Description || '',
        status: statusMap(task.Status || ''),
        priority: priorityMap(task.Priority || ''),
        project_id: projectId,
        client_id: clientId,
        requester: task.Requester || null,
        created_at: task['Created Date'] ? new Date(task['Created Date']).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting task ${task['1'] || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated task: ${task['1'] || 'Untitled'}`);
    }
  }
  
  console.log(`${tasks.length} tasks migration attempted.`);
};

const migrateMeetings = async () => {
  console.log('Migrating meetings...');
  const meetings = await parseCSV(meetingsPath);
  
  for (const meeting of meetings) {
    if (!meeting['Event Name'] && !meeting.Date) continue;
    
    // Parse duration to minutes
    let durationMinutes = 60; // Default 1 hour
    if (meeting.Duration) {
      const durationMatch = String(meeting.Duration).match(/(\d+)/);
      if (durationMatch) durationMinutes = parseInt(durationMatch[1]);
    }
    
    // Calculate end time (duration in minutes)
    const startTime = meeting.Date ? new Date(meeting.Date) : new Date();
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    
    // Find client ID based on attendees
    let clientId = null;
    if (meeting.Account) {
      if (idMappings.accounts.has(meeting.Account)) {
        clientId = idMappings.accounts.get(meeting.Account);
      }
    } else if (meeting.attendees) {
      const emails = String(meeting.attendees).split(',').map(email => email.trim());
      for (const email of emails) {
        if (idMappings.users.has(email)) {
          // Look up the user's company
          const { data, error } = await supabase
            .from('profiles')
            .select('company')
            .eq('id', idMappings.users.get(email))
            .single();
          
          if (!error && data && data.company) {
            clientId = data.company;
            break;
          }
        }
      }
    }
    
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title: meeting['Event Name'] || 'Untitled Meeting',
        description: meeting.Agenda || '',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'completed', // Assuming historical meetings are completed
        meeting_link: meeting['Meeting Link'] || '',
        recording_link: meeting.Recording || '',
        transcript_link: meeting.Transcript || '',
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting meeting ${meeting['Event Name'] || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated meeting: ${meeting['Event Name'] || 'Untitled'}`);
    }
  }
  
  console.log(`${meetings.length} meetings migration attempted.`);
};

const migrateDocuments = async () => {
  console.log('Migrating documents...');
  const documents = await parseCSV(documentsPath);
  
  for (const document of documents) {
    if (!document['Document Link']) continue;
    
    // Look up client ID
    let clientId = null;
    if (document.Account && idMappings.accounts.has(document.Account)) {
      clientId = idMappings.accounts.get(document.Account);
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        name: 'Document', // No name in CSV
        description: '', // No description in CSV
        file_path: document['Document Link'] || '',
        file_type: 'unknown', // No file type in CSV
        file_size: 0, // No file size in CSV
        status: 'Current',
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting document for ${document.Account || 'Unknown'}:`, error);
    } else {
      console.log(`Successfully migrated document for: ${document.Account || 'Unknown'}`);
    }
  }
  
  console.log(`${documents.length} documents migration attempted.`);
};

const migrateTimePackages = async () => {
  console.log('Migrating time packages...');
  
  // First, migrate from Client Purchases
  const purchases = await parseCSV(purchasesPath);
  
  for (const purchase of purchases) {
    if (!purchase.Client || !purchase['Quantity (Hours)']) continue;
    
    // Look up client ID
    let clientId = null;
    if (purchase.Client && idMappings.accounts.has(purchase.Client)) {
      clientId = idMappings.accounts.get(purchase.Client);
    }
    
    if (!clientId) continue;
    
    const { data, error } = await supabase
      .from('time_packages')
      .insert({
        name: `${purchase.Client} - ${purchase.Date || 'No Date'}`,
        hours: purchase['Quantity (Hours)'] || 0,
        hours_used: 0, // Will update from accounts if needed
        purchase_date: purchase.Date ? new Date(purchase.Date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiration_date: null, // No expiration date in CSV
        status: 'Active',
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting time package for ${purchase.Client}:`, error);
    } else {
      console.log(`Successfully migrated time package for: ${purchase.Client}`);
    }
  }
  
  // Additionally, create time packages from Accounts data if needed
  const accounts = await parseCSV(accountsPath);
  
  for (const account of accounts) {
    if (!account.Company || !account['Purchased Hours']) continue;
    
    const accountId = idMappings.accounts.get(account.Company);
    if (!accountId) continue;
    
    // Check if there's already a time package for this account
    const { data: existingPackages, error: fetchError } = await supabase
      .from('time_packages')
      .select('*')
      .eq('client_id', accountId);
    
    if (fetchError) {
      console.error(`Error fetching time packages for ${account.Company}:`, fetchError);
      continue;
    }
    
    // If no time package exists, create one
    if (!existingPackages || existingPackages.length === 0) {
      const { data, error } = await supabase
        .from('time_packages')
        .insert({
          name: `${account.Company} - Initial Package`,
          hours: account['Purchased Hours'] || 0,
          hours_used: account['Used Hours'] || 0,
          purchase_date: new Date().toISOString().split('T')[0],
          expiration_date: null, // No expiration date in CSV
          status: 'Active',
          client_id: accountId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`Error inserting time package for ${account.Company}:`, error);
      } else {
        console.log(`Successfully created time package for: ${account.Company}`);
      }
    }
  }
  
  console.log('Time packages migration attempted.');
};

const migrateScheduleLinks = async () => {
  console.log('Migrating schedule links...');
  const scheduleLinks = await parseCSV(scheduleLinksPath);
  
  for (const link of scheduleLinks) {
    if (!link.Name && !link.Link && !link['Formatted Link']) continue;
    
    const { data, error } = await supabase
      .from('schedule_links')
      .insert({
        name: link.Name || 'Untitled Link',
        use_case: link['Use Case'] || '',
        duration: link.Duration || '',
        url: link.Link || link['Formatted Link'] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error inserting schedule link ${link.Name || 'Untitled'}:`, error);
    } else {
      console.log(`Successfully migrated schedule link: ${link.Name || 'Untitled'}`);
    }
  }
  
  console.log(`${scheduleLinks.length} schedule links migration attempted.`);
};

// Run the migration
const runMigration = async () => {
  try {
    console.log('Starting migration...');
    
    // Ensure all tables exist
    await ensureCompaniesTable();
    await ensureProfilesTable();
    await ensureProjectsTable();
    await ensureTasksTable();
    await ensureMeetingsTable();
    await ensureDocumentsTable();
    await ensureTimePackagesTable();
    await ensureScheduleLinksTable();
    
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
