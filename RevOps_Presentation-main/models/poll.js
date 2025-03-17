// models/poll.js

const { db } = require('../db/database');
const crypto = require('crypto');
const Contact = require('./contact');
const isHeroku = process.env.DATABASE_URL ? true : false;

// Get all poll definitions
async function getAllPollDefinitions() {
    try {
        if (isHeroku) {
            // PostgreSQL version uses COUNT with filter
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT pd.*, 
                        COUNT(DISTINCT pr.id) as response_count
                    FROM poll_definitions pd
                    LEFT JOIN poll_responses pr ON pd.id = pr.poll_definition_id
                    GROUP BY pd.id
                `;
                const result = await client.query(sql);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT pd.*, 
                    COUNT(DISTINCT pr.id) as response_count
                FROM poll_definitions pd
                LEFT JOIN poll_responses pr ON pd.id = pr.poll_definition_id
                GROUP BY pd.id
            `;
            const stmt = db.prepare(sql);
            return stmt.all();
        }
    } catch (error) {
        console.error('Error in getAllPollDefinitions:', error);
        return [];
    }
}

// Get poll response by ID
async function getPollResponseById(responseId) {
    try {
        console.log(`Getting poll response with ID: ${responseId}`);
        
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT pr.*, pd.poll_id
                    FROM poll_responses pr
                    JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                    WHERE pr.id = $1
                `;
                const result = await client.query(sql, [responseId]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT pr.*, pd.poll_id
                FROM poll_responses pr
                JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                WHERE pr.id = ?
            `;
            const stmt = db.prepare(sql);
            return stmt.get(responseId);
        }
    } catch (error) {
        console.error(`Error in getPollResponseById for ${responseId}:`, error);
        return null;
    }
}

// Delete a poll response by ID
async function deletePollResponse(responseId) {
    try {
        console.log(`Deleting poll response with ID: ${responseId}`);
        
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                await client.query('BEGIN');
                
                // First delete from poll_response_options (foreign key constraint)
                await client.query(
                    'DELETE FROM poll_response_options WHERE poll_response_id = $1',
                    [responseId]
                );
                
                // Then delete the response itself
                const result = await client.query(
                    'DELETE FROM poll_responses WHERE id = $1',
                    [responseId]
                );
                
                await client.query('COMMIT');
                return result.rowCount > 0;
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            return db.transaction(() => {
                // First delete from poll_response_options (foreign key constraint)
                const deleteOptions = db.prepare(`
                    DELETE FROM poll_response_options
                    WHERE poll_response_id = ?
                `);
                deleteOptions.run(responseId);
                
                // Then delete the response itself
                const deleteResponse = db.prepare(`
                    DELETE FROM poll_responses
                    WHERE id = ?
                `);
                const result = deleteResponse.run(responseId);
                
                return result.changes > 0;
            })();
        }
    } catch (error) {
        console.error(`Error in deletePollResponse for ${responseId}:`, error);
        return false;
    }
}

// Get a poll definition by poll_id
async function getPollDefinitionByPollId(pollId) {
    try {
        console.log(`Getting poll definition for poll_id: "${pollId}"`);
        
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM poll_definitions 
                    WHERE poll_id = $1
                `;
                const result = await client.query(sql, [pollId]);
                const foundPoll = result.rows && result.rows.length > 0 ? result.rows[0] : null;
                
                if (foundPoll) {
                    console.log(`Found poll definition in PostgreSQL: ${JSON.stringify(foundPoll)}`);
                } else {
                    console.log(`No poll found with poll_id "${pollId}" in PostgreSQL`);
                }
                
                return foundPoll;
            } finally {
                client.release();
            }
        } else {
            // SQLite version with better error handling
            try {
                console.log(`Preparing SQLite query to find poll with poll_id "${pollId}"`);
                
                const sql = `
                    SELECT * FROM poll_definitions 
                    WHERE poll_id = ?
                `;
                const stmt = db.prepare(sql);
                const result = stmt.get(pollId);
                
                if (result) {
                    console.log(`Found poll definition in SQLite: ${JSON.stringify(result)}`);
                    
                    // Ensure the id field is a number
                    if (result.id) {
                        result.id = parseInt(result.id, 10);
                    }
                } else {
                    console.log(`No poll found with poll_id "${pollId}" in SQLite`);
                }
                
                return result;
            } catch (sqliteError) {
                console.error(`SQLite error in getPollDefinitionByPollId:`, sqliteError);
                console.error(`Error stack:`, sqliteError.stack);
                throw sqliteError;
            }
        }
    } catch (error) {
        console.error(`Error in getPollDefinitionByPollId for ${pollId}:`, error);
        throw error; // Propagate the error for better debugging
    }
}

// Update poll status (active/inactive)
async function updatePollStatus(pollId, isActive) {
    try {
        console.log(`Updating poll status for ${pollId} to ${isActive ? 'active' : 'inactive'}`);
        console.log(`Environment: ${isHeroku ? 'Heroku/PostgreSQL' : 'Local/SQLite'}`);
        
        // Get the poll definition ID first
        const pollDefinition = await getPollDefinitionByPollId(pollId);
        if (!pollDefinition) {
            console.error(`Poll not found: ${pollId}`);
            throw new Error(`Poll not found: ${pollId}`);
        }
        
        console.log(`Found poll definition with ID ${pollDefinition.id} for poll ${pollId}`);
        console.log(`Full poll definition: ${JSON.stringify(pollDefinition)}`);
        
        // Different approach for PostgreSQL vs SQLite
        if (isHeroku) {
            // PostgreSQL version 
            console.log('Using PostgreSQL update query for poll status');
            console.log(`Poll Definition ID: ${pollDefinition.id}, Type: ${typeof pollDefinition.id}`);
            console.log(`isActive Value: ${isActive}, Type: ${typeof isActive}`);
            
            // Convert boolean to integer for PostgreSQL
            const activeValue = isActive ? 1 : 0;
            console.log(`Converted is_active value: ${activeValue}`);
            
            const client = await db.client.connect();
            try {
                // First check if is_active column exists
                console.log('Checking if is_active column exists...');
                try {
                    const columnCheck = await client.query(`
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name = 'poll_definitions' AND column_name = 'is_active'
                    `);
                    
                    console.log(`Column check result: ${JSON.stringify(columnCheck.rows)}`);
                    
                    if (columnCheck.rows.length === 0) {
                        console.log('is_active column does not exist, adding it now...');
                        await client.query(`
                            ALTER TABLE poll_definitions 
                            ADD COLUMN is_active INTEGER DEFAULT 1
                        `);
                        console.log('is_active column added successfully');
                    } else {
                        console.log('is_active column exists, proceeding with update');
                    }
                } catch (columnError) {
                    console.error('Error checking/adding is_active column:', columnError);
                }
                
                // Use parameterized query for PostgreSQL
                const query = `
                    UPDATE poll_definitions
                    SET is_active = $1
                    WHERE id = $2
                    RETURNING *
                `;
                
                console.log(`Executing PostgreSQL update with values: [${activeValue}, ${pollDefinition.id}]`);
                const result = await client.query(query, [activeValue, pollDefinition.id]);
                console.log(`PostgreSQL update result:`, result);
                console.log(`Rows affected: ${result.rowCount}, Success: ${result.rowCount > 0}`);
                
                if (result.rowCount === 0) {
                    console.log(`No rows updated. Verifying poll exists...`);
                    const checkPoll = await client.query(`
                        SELECT * FROM poll_definitions WHERE id = $1
                    `, [pollDefinition.id]);
                    
                    console.log(`Poll check result: ${JSON.stringify(checkPoll.rows)}`);
                }
                
                return {
                    success: result.rowCount > 0,
                    pollId,
                    isActive
                };
            } catch (e) {
                console.error('Error in PostgreSQL updatePollStatus:', e);
                console.error('Error stack:', e.stack);
                throw e;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            console.log('Using SQLite update query for poll status');
            try {
                console.log('Preparing SQLite statement for poll status update');
                console.log(`Poll Definition ID: ${pollDefinition.id}, Type: ${typeof pollDefinition.id}`);
                console.log(`isActive Value: ${isActive}, Type: ${typeof isActive}`);
                
                // Ensure numeric ID and proper boolean to integer conversion
                const id = parseInt(pollDefinition.id, 10);
                const activeValue = isActive ? 1 : 0;
                
                console.log(`Converted Values - ID: ${id}, Active: ${activeValue}`);
                
                const stmt = db.prepare(`
                    UPDATE poll_definitions
                    SET is_active = ?
                    WHERE id = ?
                `);
                
                console.log('Statement prepared, executing...');
                const result = stmt.run(activeValue, id);
                console.log('Statement executed');
                console.log('SQLite update result:', result);
                console.log(`Changes: ${result.changes}, Success: ${result.changes > 0 ? 'yes' : 'no'}`);
                
                return {
                    success: result.changes > 0,
                    pollId,
                    isActive
                };
            } catch (error) {
                console.error('Error in SQLite update execution:', error);
                console.error('Error stack:', error.stack);
                throw error;
            }
        }
    } catch (error) {
        console.error(`Error in updatePollStatus for ${pollId}:`, error);
        throw error;
    }
}

// Clear all responses for a poll
async function clearPollResponses(pollId) {
    try {
        // Get the poll definition ID first
        const pollDefinition = await getPollDefinitionByPollId(pollId);
        if (!pollDefinition) {
            console.error(`Poll not found: ${pollId}`);
            throw new Error(`Poll not found: ${pollId}`);
        }
        
        // Different approach for SQLite vs PostgreSQL
        if (isHeroku) {
            // PostgreSQL: Use client for transaction
            const client = await db.client.connect();
            try {
                await client.query('BEGIN');
                
                // Get all response IDs for this poll
                const responseIdsResult = await client.query(
                    'SELECT id FROM poll_responses WHERE poll_definition_id = $1',
                    [pollDefinition.id]
                );
                
                const responseIds = responseIdsResult.rows.map(row => row.id);
                
                // Delete all response options
                for (const responseId of responseIds) {
                    await client.query(
                        'DELETE FROM poll_response_options WHERE poll_response_id = $1',
                        [responseId]
                    );
                }
                
                // Delete all responses
                const deleteResult = await client.query(
                    'DELETE FROM poll_responses WHERE poll_definition_id = $1',
                    [pollDefinition.id]
                );
                
                await client.query('COMMIT');
                
                return {
                    success: true,
                    pollId,
                    responsesDeleted: deleteResult.rowCount
                };
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        } else {
            // SQLite: Use transaction function
            try {
                console.log('Using SQLite for clearing poll responses');
                console.log(`Poll Definition ID: ${pollDefinition.id}`);
                
                const result = db.transaction(() => {
                    // Get all response IDs for this poll
                    console.log('Getting response IDs...');
                    const responseIds = db.prepare(`
                        SELECT id FROM poll_responses
                        WHERE poll_definition_id = ?
                    `).all(pollDefinition.id).map(row => row.id);
                    
                    console.log(`Found ${responseIds.length} responses to delete`);
                    
                    // Delete all response options
                    console.log('Deleting response options...');
                    const deleteOptions = db.prepare(`
                        DELETE FROM poll_response_options
                        WHERE poll_response_id = ?
                    `);
                    
                    for (const responseId of responseIds) {
                        deleteOptions.run(responseId);
                        console.log(`Deleted options for response ID ${responseId}`);
                    }
                    
                    // Delete all responses
                    console.log('Deleting responses...');
                    const deleteResponses = db.prepare(`
                        DELETE FROM poll_responses
                        WHERE poll_definition_id = ?
                    `);
                    
                    const result = deleteResponses.run(pollDefinition.id);
                    console.log(`Deleted ${result.changes} responses`);
                    
                    return {
                        success: true,
                        pollId,
                        responsesDeleted: result.changes
                    };
                })();
                
                console.log('SQLite transaction completed:', result);
                return result;
            } catch (error) {
                console.error('Error in SQLite transaction:', error);
                console.error('Error stack:', error.stack);
                throw error;
            }
        }
    } catch (error) {
        console.error(`Error in clearPollResponses for ${pollId}:`, error);
        throw error;
    }
}

// Get poll options for a poll definition
async function getPollOptions(pollDefinitionId) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM poll_options 
                    WHERE poll_definition_id = $1
                    ORDER BY display_order
                `;
                const result = await client.query(sql, [pollDefinitionId]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM poll_options 
                WHERE poll_definition_id = ?
                ORDER BY display_order
            `;
            const stmt = db.prepare(sql);
            return stmt.all(pollDefinitionId);
        }
    } catch (error) {
        console.error(`Error in getPollOptions for poll_definition_id ${pollDefinitionId}:`, error);
        return [];
    }
}

// Get all poll options for a poll_id
async function getPollOptionsByPollId(pollId) {
    try {
        if (isHeroku) {
            // PostgreSQL version with $1 parameter
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT po.* 
                    FROM poll_options po
                    JOIN poll_definitions pd ON po.poll_definition_id = pd.id
                    WHERE pd.poll_id = $1
                    ORDER BY po.display_order
                `;
                const result = await client.query(sql, [pollId]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT po.* 
                FROM poll_options po
                JOIN poll_definitions pd ON po.poll_definition_id = pd.id
                WHERE pd.poll_id = ?
                ORDER BY po.display_order
            `;
            const stmt = db.prepare(sql);
            return stmt.all(pollId);
        }
    } catch (error) {
        console.error(`Error in getPollOptionsByPollId for ${pollId}:`, error);
        return [];
    }
}

// Get results for a poll
async function getPollResults(pollId) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT po.option_id, po.option_text, COUNT(pro.id) as vote_count
                    FROM poll_definitions pd
                    JOIN poll_options po ON pd.id = po.poll_definition_id
                    LEFT JOIN poll_response_options pro ON po.id = pro.poll_option_id
                    LEFT JOIN poll_responses pr ON pro.poll_response_id = pr.id
                    WHERE pd.poll_id = $1
                    GROUP BY po.id, po.option_id, po.option_text, po.display_order
                    ORDER BY po.display_order
                `;
                const result = await client.query(sql, [pollId]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT po.option_id, po.option_text, COUNT(pro.id) as vote_count
                FROM poll_definitions pd
                JOIN poll_options po ON pd.id = po.poll_definition_id
                LEFT JOIN poll_response_options pro ON po.id = pro.poll_option_id
                LEFT JOIN poll_responses pr ON pro.poll_response_id = pr.id
                WHERE pd.poll_id = ?
                GROUP BY po.id
                ORDER BY po.display_order
            `;
            const stmt = db.prepare(sql);
            return stmt.all(pollId);
        }
    } catch (error) {
        console.error(`Error in getPollResults for ${pollId}:`, error);
        return [];
    }
}

// Save a poll response
async function savePollResponse(pollId, userId, selectedOptions, metadata = {}) {
    try {
        console.log(`Saving poll response for ${pollId} from user ${userId}: ${JSON.stringify(selectedOptions)}`);
        
        // Get the poll definition
        const pollDefinition = await getPollDefinitionByPollId(pollId);
        if (!pollDefinition) {
            console.error(`Poll not found: ${pollId}`);
            throw new Error(`Poll not found: ${pollId}`);
        }
        
        // Generate a unique ID in format "por-{000}"
        const timestamp = Date.now();
        const randomVal = Math.floor(Math.random() * 1000);
        const uniqueId = `por-${(timestamp % 10000 + randomVal).toString().padStart(3, '0')}`;
        
        // Generate IP hash for identification
        const ipAddress = metadata.ipAddress || '';
        const ipHash = crypto.createHash('md5').update(ipAddress).digest('hex');
        
        console.log(`Generated unique ID: ${uniqueId} and IP hash: ${ipHash}`);
        
        // Check if user already voted for this poll based on user ID
        const existingVote = await checkExistingVote(pollDefinition.id, userId);
        
        // Also check by IP hash
        const existingVoteByIp = await checkExistingVoteByIp(pollDefinition.id, ipHash);
        
        if (existingVote || existingVoteByIp) {
            const voteId = existingVote ? existingVote.id : existingVoteByIp.id;
            console.log(`User ${userId} (IP hash: ${ipHash}) already voted for poll ${pollId}, returning current results`);
            // Return current results without adding another vote
            const pollResults = await getPollResults(pollId);
            const formattedResults = {};
            pollResults.forEach(result => {
                formattedResults[result.option_id] = result.vote_count;
            });
            
            return {
                responseId: voteId,
                results: formattedResults,
                alreadyVoted: true
            };
        }
        
        // Try to find a contact with this IP hash
        let contactUniqueId = null;
        const contact = await Contact.getContactByIpHash(ipHash);
        if (contact) {
            contactUniqueId = contact.unique_id;
            console.log(`Found matching contact with unique ID: ${contactUniqueId}`);
        }
        
        // Different approach for SQLite vs PostgreSQL
        if (isHeroku) {
            // PostgreSQL: Use client for transaction
            const client = await db.client.connect();
            try {
                await client.query('BEGIN');
                
                // Double-check if the user already voted to prevent race conditions
                const checkVoteAgain = await client.query(
                    'SELECT id FROM poll_responses WHERE poll_definition_id = $1 AND (user_id = $2 OR ip_hash = $3)',
                    [pollDefinition.id, userId, ipHash]
                );
                
                if (checkVoteAgain.rows && checkVoteAgain.rows.length > 0) {
                    // User already voted, return current results
                    console.log(`Race condition detected: User ${userId} already voted for poll ${pollId}`);
                    await client.query('ROLLBACK');
                    
                    const pollResults = await getPollResults(pollId);
                    const formattedResults = {};
                    pollResults.forEach(result => {
                        formattedResults[result.option_id] = result.vote_count;
                    });
                    
                    return {
                        responseId: checkVoteAgain.rows[0].id,
                        results: formattedResults,
                        alreadyVoted: true
                    };
                }
                
                // Insert the poll response with unique ID and contact links
                const insertResponseResult = await client.query(
                    `INSERT INTO poll_responses 
                    (poll_definition_id, user_id, slide_id, user_agent, ip_address, screen_size, 
                     unique_id, ip_hash, contact_unique_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    RETURNING id`,
                    [
                        pollDefinition.id,
                        userId,
                        metadata.slideId || null,
                        metadata.userAgent || null,
                        metadata.ipAddress || null,
                        metadata.screenSize || null,
                        uniqueId,
                        ipHash,
                        contactUniqueId
                    ]
                );
                
                const responseId = insertResponseResult.rows[0].id;
                console.log(`Created poll_response with ID ${responseId} and unique ID ${uniqueId}`);
                
                // Get the option IDs
                const optionsResult = await client.query(
                    'SELECT * FROM poll_options WHERE poll_definition_id = $1',
                    [pollDefinition.id]
                );
                
                const options = optionsResult.rows;
                const optionMap = {};
                options.forEach(option => {
                    optionMap[option.option_id] = option.id;
                });
                
                // Insert selected options
                for (const optionId of selectedOptions) {
                    if (optionMap[optionId]) {
                        await client.query(
                            'INSERT INTO poll_response_options (poll_response_id, poll_option_id) VALUES ($1, $2)',
                            [responseId, optionMap[optionId]]
                        );
                        console.log(`Added option ${optionId} to response ${responseId}`);
                    } else {
                        console.warn(`Option ID ${optionId} not found for poll ${pollId}`);
                    }
                }
                
                await client.query('COMMIT');
                
                // Get updated results
                const pollResults = await getPollResults(pollId);
                
                // Convert to a simplified format for the client
                const formattedResults = {};
                pollResults.forEach(result => {
                    formattedResults[result.option_id] = result.vote_count;
                });
                
                return {
                    responseId,
                    uniqueId,
                    contactUniqueId,
                    results: formattedResults
                };
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        } else {
            // SQLite: Use transaction function
            return db.transaction(() => {
                // Double-check if the user already voted (prevent race conditions)
                const checkVoteAgain = db.prepare(`
                    SELECT id FROM poll_responses 
                    WHERE poll_definition_id = ? AND (user_id = ? OR ip_hash = ?)
                `).get(pollDefinition.id, userId, ipHash);
                
                if (checkVoteAgain) {
                    // User already voted, return current results
                    console.log(`Race condition detected: User ${userId} already voted for poll ${pollId}`);
                    
                    const pollResults = db.prepare(`
                        SELECT po.option_id, po.option_text, COUNT(pro.id) as vote_count
                        FROM poll_definitions pd
                        JOIN poll_options po ON pd.id = po.poll_definition_id
                        LEFT JOIN poll_response_options pro ON po.id = pro.poll_option_id
                        LEFT JOIN poll_responses pr ON pro.poll_response_id = pr.id
                        WHERE pd.poll_id = ?
                        GROUP BY po.id
                        ORDER BY po.display_order
                    `).all(pollId);
                    
                    const formattedResults = {};
                    pollResults.forEach(result => {
                        formattedResults[result.option_id] = result.vote_count;
                    });
                    
                    return {
                        responseId: checkVoteAgain.id,
                        results: formattedResults,
                        alreadyVoted: true
                    };
                }
                
                // Insert the poll response with unique ID and contact links
                const insertResponse = db.prepare(`
                    INSERT INTO poll_responses 
                    (poll_definition_id, user_id, slide_id, user_agent, ip_address, screen_size,
                     unique_id, ip_hash, contact_unique_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                const responseInfo = insertResponse.run(
                    pollDefinition.id,
                    userId,
                    metadata.slideId || null,
                    metadata.userAgent || null,
                    metadata.ipAddress || null,
                    metadata.screenSize || null,
                    uniqueId,
                    ipHash,
                    contactUniqueId
                );
                
                const responseId = responseInfo.lastInsertRowid;
                console.log(`Created poll_response with ID ${responseId} and unique ID ${uniqueId}`);
                
                // Get the option IDs
                const options = db.prepare(`
                    SELECT * FROM poll_options 
                    WHERE poll_definition_id = ?
                    ORDER BY display_order
                `).all(pollDefinition.id);
                
                const optionMap = {};
                options.forEach(option => {
                    optionMap[option.option_id] = option.id;
                });
                
                // Insert selected options
                const insertOption = db.prepare(`
                    INSERT INTO poll_response_options
                    (poll_response_id, poll_option_id)
                    VALUES (?, ?)
                `);
                
                for (const optionId of selectedOptions) {
                    if (optionMap[optionId]) {
                        insertOption.run(responseId, optionMap[optionId]);
                        console.log(`Added option ${optionId} to response ${responseId}`);
                    } else {
                        console.warn(`Option ID ${optionId} not found for poll ${pollId}`);
                    }
                }
                
                // Get updated results
                const pollResults = db.prepare(`
                    SELECT po.option_id, po.option_text, COUNT(pro.id) as vote_count
                    FROM poll_definitions pd
                    JOIN poll_options po ON pd.id = po.poll_definition_id
                    LEFT JOIN poll_response_options pro ON po.id = pro.poll_option_id
                    LEFT JOIN poll_responses pr ON pro.poll_response_id = pr.id
                    WHERE pd.poll_id = ?
                    GROUP BY po.id
                    ORDER BY po.display_order
                `).all(pollId);
                
                // Convert to a simplified format for the client
                const formattedResults = {};
                pollResults.forEach(result => {
                    formattedResults[result.option_id] = result.vote_count;
                });
                
                return {
                    responseId,
                    uniqueId,
                    contactUniqueId,
                    results: formattedResults
                };
            })();
        }
    } catch (error) {
        console.error(`Error in savePollResponse for ${pollId}:`, error);
        throw error;
    }
}

// Helper function to check if a user has already voted by user ID
async function checkExistingVote(pollDefinitionId, userId) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const result = await client.query(
                    'SELECT id FROM poll_responses WHERE poll_definition_id = $1 AND user_id = $2',
                    [pollDefinitionId, userId]
                );
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT id FROM poll_responses 
                WHERE poll_definition_id = ? AND user_id = ?
            `;
            const stmt = db.prepare(sql);
            return stmt.get(pollDefinitionId, userId);
        }
    } catch (error) {
        console.error(`Error checking for existing vote by user ID:`, error);
        return null;
    }
}

// Helper function to check if a user has already voted by IP hash
async function checkExistingVoteByIp(pollDefinitionId, ipHash) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const result = await client.query(
                    'SELECT id FROM poll_responses WHERE poll_definition_id = $1 AND ip_hash = $2',
                    [pollDefinitionId, ipHash]
                );
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT id FROM poll_responses 
                WHERE poll_definition_id = ? AND ip_hash = ?
            `;
            const stmt = db.prepare(sql);
            return stmt.get(pollDefinitionId, ipHash);
        }
    } catch (error) {
        console.error(`Error checking for existing vote by IP hash:`, error);
        return null;
    }
}

// Get responses for a poll
async function getPollResponses(pollId, limit = 100) {
    try {
        if (isHeroku) {
            // PostgreSQL version uses STRING_AGG instead of GROUP_CONCAT
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT pr.id, pr.user_id, pr.created_at, pr.slide_id, pr.user_agent, pr.screen_size,
                           STRING_AGG(po.option_id, ',') as selected_options
                    FROM poll_responses pr
                    JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                    JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                    JOIN poll_options po ON pro.poll_option_id = po.id
                    WHERE pd.poll_id = $1
                    GROUP BY pr.id, pr.user_id, pr.created_at, pr.slide_id, pr.user_agent, pr.screen_size
                    ORDER BY pr.created_at DESC
                    LIMIT $2
                `;
                const result = await client.query(sql, [pollId, limit]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT pr.id, pr.user_id, pr.created_at, pr.slide_id, pr.user_agent, pr.screen_size,
                       GROUP_CONCAT(po.option_id) as selected_options
                FROM poll_responses pr
                JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                JOIN poll_options po ON pro.poll_option_id = po.id
                WHERE pd.poll_id = ?
                GROUP BY pr.id
                ORDER BY pr.created_at DESC
                LIMIT ?
            `;
            const stmt = db.prepare(sql);
            return stmt.all(pollId, limit);
        }
    } catch (error) {
        console.error(`Error in getPollResponses for ${pollId}:`, error);
        return [];
    }
}

// Get all responses across all polls
async function getAllResponses(limit = 1000) {
    try {
        if (isHeroku) {
            // PostgreSQL version uses STRING_AGG
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT pr.id, pd.poll_id, pr.user_id, pr.created_at, pr.slide_id, 
                           pr.user_agent, pr.screen_size,
                           STRING_AGG(po.option_id, ',') as selected_options
                    FROM poll_responses pr
                    JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                    LEFT JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                    LEFT JOIN poll_options po ON pro.poll_option_id = po.id
                    GROUP BY pr.id, pd.poll_id, pr.user_id, pr.created_at, pr.slide_id, 
                             pr.user_agent, pr.screen_size
                    ORDER BY pr.created_at DESC
                    LIMIT $1
                `;
                const result = await client.query(sql, [limit]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT pr.id, pd.poll_id, pr.user_id, pr.created_at, pr.slide_id, 
                       pr.user_agent, pr.screen_size,
                       GROUP_CONCAT(po.option_id) as selected_options
                FROM poll_responses pr
                JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                LEFT JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                LEFT JOIN poll_options po ON pro.poll_option_id = po.id
                GROUP BY pr.id
                ORDER BY pr.created_at DESC
                LIMIT ?
            `;
            const stmt = db.prepare(sql);
            return stmt.all(limit);
        }
    } catch (error) {
        console.error(`Error in getAllResponses:`, error);
        return [];
    }
}

// Create a poll definition if it doesn't exist (useful for initialization)
async function ensurePollDefinitionExists(pollId, title, description, options) {
    try {
        // Check if poll exists
        const existingPoll = await getPollDefinitionByPollId(pollId);
        if (existingPoll) {
            console.log(`Poll ${pollId} already exists with ID ${existingPoll.id}`);
            return existingPoll.id;
        }
        
        // Create new poll definition based on database type
        if (isHeroku) {
            // PostgreSQL approach
            const client = await db.client.connect();
            try {
                await client.query('BEGIN');
                
                // Insert poll definition
                const insertPollResult = await client.query(
                    `INSERT INTO poll_definitions (poll_id, title, description)
                     VALUES ($1, $2, $3) RETURNING id`,
                    [pollId, title, description]
                );
                
                const pollDefinitionId = insertPollResult.rows[0].id;
                
                // Add options
                if (options && options.length) {
                    for (let i = 0; i < options.length; i++) {
                        const option = options[i];
                        await client.query(
                            `INSERT INTO poll_options (poll_definition_id, option_id, option_text, display_order)
                             VALUES ($1, $2, $3, $4)`,
                            [pollDefinitionId, option.id, option.text, i]
                        );
                    }
                }
                
                await client.query('COMMIT');
                console.log(`Created new poll ${pollId} with ID ${pollDefinitionId}`);
                return pollDefinitionId;
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        } else {
            // SQLite approach
            const insertPoll = db.prepare(`
                INSERT INTO poll_definitions (poll_id, title, description)
                VALUES (?, ?, ?)
            `);
            
            const result = insertPoll.run(pollId, title, description);
            const pollDefinitionId = result.lastInsertRowid;
            
            // Add options
            if (options && options.length) {
                const insertOption = db.prepare(`
                    INSERT INTO poll_options (poll_definition_id, option_id, option_text, display_order)
                    VALUES (?, ?, ?, ?)
                `);
                
                options.forEach((option, index) => {
                    insertOption.run(pollDefinitionId, option.id, option.text, index);
                });
            }
            
            console.log(`Created new poll ${pollId} with ID ${pollDefinitionId}`);
            return pollDefinitionId;
        }
    } catch (error) {
        console.error(`Error in ensurePollDefinitionExists for ${pollId}:`, error);
        throw error;
    }
}

module.exports = {
    getAllPollDefinitions,
    getPollDefinitionByPollId,
    getPollResponseById,
    deletePollResponse,
    getPollOptions,
    getPollOptionsByPollId,
    getPollResults,
    savePollResponse,
    getPollResponses,
    getAllResponses,
    ensurePollDefinitionExists,
    updatePollStatus,
    clearPollResponses,
    checkExistingVote,
    checkExistingVoteByIp
};