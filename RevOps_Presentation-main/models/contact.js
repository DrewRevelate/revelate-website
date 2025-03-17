// models/contact.js

const { db } = require('../db/database');
const crypto = require('crypto');
const isHeroku = process.env.DATABASE_URL ? true : false;

// Save a contact submission
async function saveContactSubmission(formData) {
    try {
        console.log('Saving contact submission:', JSON.stringify(formData, null, 2));
        
        // Generate a unique ID in format "con-{000}"
        const timestamp = Date.now();
        const randomVal = Math.floor(Math.random() * 1000);
        const uniqueId = `con-${(timestamp % 10000 + randomVal).toString().padStart(3, '0')}`;
        
        // Generate IP hash for identification
        const ipAddress = formData.ipAddress || '';
        const ipHash = crypto.createHash('md5').update(ipAddress).digest('hex');
        
        console.log(`Generated unique ID: ${uniqueId} and IP hash: ${ipHash}`);
        
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    INSERT INTO contact_submissions 
                    (first_name, last_name, email, phone, major, grad_year, career_goals, 
                     session_id, user_agent, ip_address, screen_size, unique_id, ip_hash)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING id
                `;
                
                const params = [
                    formData.firstName,
                    formData.lastName,
                    formData.email,
                    formData.phone || null,
                    formData.major || null,
                    formData.gradYear || null,
                    formData.careerGoals || null,
                    formData.sessionId || null,
                    formData.userAgent || null,
                    formData.ipAddress || null,
                    formData.screen || null,
                    uniqueId,
                    ipHash
                ];
                
                const result = await client.query(sql, params);
                
                // PostgreSQL returns rows with id field
                const insertId = result.rows && result.rows[0] ? result.rows[0].id : null;
                console.log(`Contact submission created with ID ${insertId} (PostgreSQL)`);
                
                return {
                    id: insertId,
                    uniqueId: uniqueId,
                    success: true
                };
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                INSERT INTO contact_submissions 
                (first_name, last_name, email, phone, major, grad_year, career_goals, 
                 session_id, user_agent, ip_address, screen_size, unique_id, ip_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phone || null,
                formData.major || null,
                formData.gradYear || null,
                formData.careerGoals || null,
                formData.sessionId || null,
                formData.userAgent || null,
                formData.ipAddress || null,
                formData.screen || null,
                uniqueId,
                ipHash
            ];
            
            const stmt = db.prepare(sql);
            const result = await stmt.run(...params);
            
            // SQLite returns lastInsertRowid
            const insertId = result.lastInsertRowid;
            console.log(`Contact submission created with ID ${insertId} (SQLite)`);
            
            return {
                id: insertId,
                uniqueId: uniqueId,
                success: true
            };
        }
    } catch (error) {
        console.error('Error in saveContactSubmission:', error);
        throw error;
    }
}

// Get all contact submissions with debug logging
async function getAllContactSubmissions(limit = 1000) {
    try {
        console.log(`Retrieving up to ${limit} contact submissions`);
        
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_submissions
                    ORDER BY created_at DESC
                    LIMIT $1
                `;
                
                const result = await client.query(sql, [limit]);
                const contactResults = result.rows || [];
                
                console.log(`Retrieved ${contactResults.length} contact submissions from PostgreSQL`);
                
                // Debug log the first result if available
                if (contactResults.length > 0) {
                    console.log('First submission sample:', JSON.stringify(contactResults[0], null, 2));
                }
                
                return contactResults;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM contact_submissions
                ORDER BY created_at DESC
                LIMIT ?
            `;
            
            const stmt = db.prepare(sql);
            const contactResults = stmt.all(limit);
            
            console.log(`Retrieved ${contactResults.length} contact submissions from SQLite`);
            
            // Debug log the first result if available
            if (contactResults.length > 0) {
                console.log('First submission sample:', JSON.stringify(contactResults[0], null, 2));
            }
            
            return contactResults;
        }
    } catch (error) {
        console.error('Error in getAllContactSubmissions:', error);
        console.error('Stack trace:', error.stack);
        return [];
    }
}

// Get contact submission by ID
async function getContactSubmissionById(id) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_submissions
                    WHERE id = $1
                `;
                
                const result = await client.query(sql, [id]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM contact_submissions
                WHERE id = ?
            `;
            
            const stmt = db.prepare(sql);
            return stmt.get(id);
        }
    } catch (error) {
        console.error(`Error in getContactSubmissionById for ${id}:`, error);
        return null;
    }
}

// Search contact submissions
async function searchContactSubmissions(query) {
    try {
        let sql;
        let params;
        
        if (isHeroku) {
            // PostgreSQL uses ILIKE for case-insensitive search and $1, $2, etc for parameterization
            sql = `
                SELECT * FROM contact_submissions
                WHERE first_name ILIKE $1 OR last_name ILIKE $2 OR email ILIKE $3 OR major ILIKE $4
                ORDER BY created_at DESC
                LIMIT 100
            `;
            const searchParam = `%${query}%`;
            params = [searchParam, searchParam, searchParam, searchParam];
        } else {
            // SQLite uses ? for parameterization
            sql = `
                SELECT * FROM contact_submissions
                WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR major LIKE ?
                ORDER BY created_at DESC
                LIMIT 100
            `;
            const searchParam = `%${query}%`;
            params = [searchParam, searchParam, searchParam, searchParam];
        }
        
        const stmt = db.prepare(sql);
        const results = await stmt.all(...params);
        
        // Handle different return formats
        return isHeroku ? (results.rows || []) : results;
    } catch (error) {
        console.error(`Error in searchContactSubmissions for query "${query}":`, error);
        return [];
    }
}

// Count total submissions
async function countContactSubmissions() {
    try {
        // This query is the same for both databases with no parameters
        const sql = 'SELECT COUNT(*) as count FROM contact_submissions';
        
        const stmt = db.prepare(sql);
        const result = await stmt.get();
        
        // Handle different return formats
        if (isHeroku) {
            return result && result.count ? parseInt(result.count) : 0;
        } else {
            return result.count;
        }
    } catch (error) {
        console.error('Error in countContactSubmissions:', error);
        return 0;
    }
}

// Delete a contact submission (for admin use)
async function deleteContactSubmission(id) {
    try {
        let sql;
        let params;
        
        if (isHeroku) {
            // PostgreSQL uses $1 instead of ?
            sql = 'DELETE FROM contact_submissions WHERE id = $1';
            params = [id];
        } else {
            // SQLite version
            sql = 'DELETE FROM contact_submissions WHERE id = ?';
            params = [id];
        }
        
        const stmt = db.prepare(sql);
        const result = await stmt.run(...params);
        
        // Handle different return formats
        if (isHeroku) {
            return result.rowCount > 0;
        } else {
            return result.changes > 0;
        }
    } catch (error) {
        console.error(`Error in deleteContactSubmission for ${id}:`, error);
        return false;
    }
}

// Get contact by IP hash
async function getContactByIpHash(ipHash) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_submissions
                    WHERE ip_hash = $1
                    ORDER BY created_at DESC
                    LIMIT 1
                `;
                
                const result = await client.query(sql, [ipHash]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM contact_submissions
                WHERE ip_hash = ?
                ORDER BY created_at DESC
                LIMIT 1
            `;
            
            const stmt = db.prepare(sql);
            return stmt.get(ipHash);
        }
    } catch (error) {
        console.error(`Error in getContactByIpHash for ${ipHash}:`, error);
        return null;
    }
}

// Get contact by unique ID
async function getContactByUniqueId(uniqueId) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_submissions
                    WHERE unique_id = $1
                `;
                
                const result = await client.query(sql, [uniqueId]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM contact_submissions
                WHERE unique_id = ?
            `;
            
            const stmt = db.prepare(sql);
            return stmt.get(uniqueId);
        }
    } catch (error) {
        console.error(`Error in getContactByUniqueId for ${uniqueId}:`, error);
        return null;
    }
}

module.exports = {
    saveContactSubmission,
    getAllContactSubmissions,
    getContactSubmissionById,
    searchContactSubmissions,
    countContactSubmissions,
    deleteContactSubmission,
    getContactByIpHash,
    getContactByUniqueId
};