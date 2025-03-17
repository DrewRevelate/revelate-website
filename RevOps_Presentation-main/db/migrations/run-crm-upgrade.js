// db/migrations/run-crm-upgrade.js

const { applyMigration } = require('./crm_upgrade');

// Run the CRM upgrade migration
applyMigration().then(() => {
  console.log('CRM upgrade migration completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('CRM upgrade migration failed:', err);
  process.exit(1);
});