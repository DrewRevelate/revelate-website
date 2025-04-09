import { supabase } from '@/lib/supabase/client';

/**
 * Schema validation utility for debugging database issues
 */
export const validateSchema = async (tableName: string) => {
  try {
    // Get all columns for the table
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', tableName);
    
    if (error) {
      console.error(`Error fetching schema for ${tableName}:`, error);
      return null;
    }
    
    return columns;
  } catch (err) {
    console.error(`Error in schema validation for ${tableName}:`, err);
    return null;
  }
};

/**
 * Test database connectivity and provide debug information
 */
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_misc').select('version()');
    
    if (error) {
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }
    
    return {
      connected: true,
      version: data?.[0]?.version || 'Unknown',
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message || 'Unknown error',
      details: err
    };
  }
};

/**
 * Check if a table exists and get its structure
 */
export const checkTableExists = async (tableName: string) => {
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .single();
    
    if (error || !data) {
      console.warn(`Table "${tableName}" does not exist or is not accessible`);
      return { exists: false, error: error?.message };
    }
    
    // Get the table structure
    const columns = await validateSchema(tableName);
    
    return {
      exists: true,
      columns
    };
  } catch (err: any) {
    console.error(`Error checking table "${tableName}":`, err);
    return {
      exists: false,
      error: err.message || 'Unknown error'
    };
  }
};

/**
 * Debug helper to be called in components to diagnose database issues
 */
export const debugDatabaseIssue = async (options: {
  tableName: string;
  operation: 'select' | 'insert' | 'update' | 'delete';
  data?: any;
  id?: string;
}) => {
  const { tableName, operation, data, id } = options;
  
  console.group(`Database Debug: ${operation} on ${tableName}`);
  
  // Check connection
  console.log('Testing database connection...');
  const connectionStatus = await testDatabaseConnection();
  console.log('Connection status:', connectionStatus);
  
  // Check table
  console.log(`Checking if table "${tableName}" exists...`);
  const tableStatus = await checkTableExists(tableName);
  console.log('Table status:', tableStatus);
  
  // For data operations, validate data against schema
  if (data && tableStatus.exists && tableStatus.columns) {
    console.log('Validating data against schema...');
    const columns = tableStatus.columns as { column_name: string; data_type: string; is_nullable: string }[];
    
    const issues = columns.reduce((acc: any[], column) => {
      const columnName = column.column_name;
      const isNullable = column.is_nullable === 'YES';
      
      // Check if required column is present
      if (!isNullable && data[columnName] === undefined) {
        acc.push({
          column: columnName,
          issue: 'Missing required field',
          dataType: column.data_type
        });
      }
      
      return acc;
    }, []);
    
    if (issues.length > 0) {
      console.warn('Data validation issues:', issues);
    } else {
      console.log('Data validation passed');
    }
  }
  
  console.groupEnd();
  
  return {
    connection: connectionStatus,
    table: tableStatus,
    timestamp: new Date().toISOString()
  };
};
