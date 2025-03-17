// db/migrations/run-unified-system.js
// Script to run the unified system migration

const { runMigration } = require('./unified_system');

// Run the migration
runMigration().then(() => {
    console.log('Migration completed successfully');
}).catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});