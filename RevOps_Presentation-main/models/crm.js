// models/crm.js
// Enhanced CRM functionality to connect contacts and polls

const { db } = require('../db/database');
const Contact = require('./contact');
const Poll = require('./poll');
const isHeroku = process.env.DATABASE_URL ? true : false;

// Get a contact by user_id (for matching with poll responses)
async function getContactByUserId(userId) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_submissions
                    WHERE user_id = $1
                    ORDER BY created_at DESC
                    LIMIT 1
                `;
                
                const result = await client.query(sql, [userId]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                SELECT * FROM contact_submissions
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 1
            `;
            
            const stmt = db.prepare(sql);
            return stmt.get(userId);
        }
    } catch (error) {
        console.error(`Error in getContactByUserId for ${userId}:`, error);
        return null;
    }
}

// Update existing contact with user_id
async function updateContactWithUserId(contactId, userId) {
    try {
        if (isHeroku) {
            // PostgreSQL version
            const client = await db.client.connect();
            try {
                const sql = `
                    UPDATE contact_submissions
                    SET user_id = $1
                    WHERE id = $2
                    RETURNING *
                `;
                
                const result = await client.query(sql, [userId, contactId]);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            const sql = `
                UPDATE contact_submissions
                SET user_id = ?
                WHERE id = ?
            `;
            
            const stmt = db.prepare(sql);
            const result = stmt.run(userId, contactId);
            
            if (result.changes > 0) {
                // Get the updated contact
                const getContact = db.prepare(`
                    SELECT * FROM contact_submissions
                    WHERE id = ?
                `);
                return getContact.get(contactId);
            }
            return null;
        }
    } catch (error) {
        console.error(`Error in updateContactWithUserId for contact ${contactId}:`, error);
        return null;
    }
}

// Get all poll responses for a given contact (by user_id, unique_id, or ip_hash)
async function getPollResponsesForContact(contactId) {
    try {
        // First get the contact to get the user_id, unique_id, and ip_hash
        let contact;
        
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `SELECT * FROM contact_submissions WHERE id = $1`;
                const result = await client.query(sql, [contactId]);
                contact = result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            const sql = `SELECT * FROM contact_submissions WHERE id = ?`;
            const stmt = db.prepare(sql);
            contact = stmt.get(contactId);
        }
        
        if (!contact) {
            return [];
        }
        
        // Now get all poll responses for this contact using multiple identifiers
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT pr.*, pd.poll_id,
                           STRING_AGG(po.option_text, ', ') as selected_options_text
                    FROM poll_responses pr
                    JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                    LEFT JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                    LEFT JOIN poll_options po ON pro.poll_option_id = po.id
                    WHERE (
                        (pr.user_id = $1 AND pr.user_id IS NOT NULL) OR
                        (pr.ip_hash = $2 AND pr.ip_hash IS NOT NULL) OR
                        (pr.contact_unique_id = $3 AND pr.contact_unique_id IS NOT NULL)
                    )
                    GROUP BY pr.id, pd.poll_id
                    ORDER BY pr.created_at DESC
                `;
                
                const result = await client.query(sql, [
                    contact.user_id || '', 
                    contact.ip_hash || '',
                    contact.unique_id || ''
                ]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT pr.*, pd.poll_id,
                       GROUP_CONCAT(po.option_text, ', ') as selected_options_text
                FROM poll_responses pr
                JOIN poll_definitions pd ON pr.poll_definition_id = pd.id
                LEFT JOIN poll_response_options pro ON pr.id = pro.poll_response_id
                LEFT JOIN poll_options po ON pro.poll_option_id = po.id
                WHERE (
                    (pr.user_id = ? AND pr.user_id IS NOT NULL) OR
                    (pr.ip_hash = ? AND pr.ip_hash IS NOT NULL) OR
                    (pr.contact_unique_id = ? AND pr.contact_unique_id IS NOT NULL)
                )
                GROUP BY pr.id
                ORDER BY pr.created_at DESC
            `;
            
            const stmt = db.prepare(sql);
            return stmt.all(
                contact.user_id || '', 
                contact.ip_hash || '',
                contact.unique_id || ''
            );
        }
    } catch (error) {
        console.error(`Error in getPollResponsesForContact for ${contactId}:`, error);
        return [];
    }
}

// Add a tag to a contact
async function addTagToContact(contactId, tagName) {
    try {
        // First, ensure the tag exists
        let tagId;
        
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                // Begin a transaction
                await client.query('BEGIN');
                
                // Check if tag exists
                let tagResult = await client.query(`
                    SELECT id FROM contact_tags WHERE tag_name = $1
                `, [tagName]);
                
                // Create tag if it doesn't exist
                if (!tagResult.rows || tagResult.rows.length === 0) {
                    const insertResult = await client.query(`
                        INSERT INTO contact_tags (tag_name)
                        VALUES ($1)
                        RETURNING id
                    `, [tagName]);
                    
                    tagId = insertResult.rows[0].id;
                } else {
                    tagId = tagResult.rows[0].id;
                }
                
                // Add tag to contact if not already added
                const existingMapping = await client.query(`
                    SELECT id FROM contact_tag_mapping
                    WHERE contact_id = $1 AND tag_id = $2
                `, [contactId, tagId]);
                
                if (!existingMapping.rows || existingMapping.rows.length === 0) {
                    await client.query(`
                        INSERT INTO contact_tag_mapping (contact_id, tag_id)
                        VALUES ($1, $2)
                    `, [contactId, tagId]);
                }
                
                await client.query('COMMIT');
                return true;
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } else {
            // SQLite transaction
            return db.transaction(() => {
                // Check if tag exists
                const getTag = db.prepare(`SELECT id FROM contact_tags WHERE tag_name = ?`);
                const existingTag = getTag.get(tagName);
                
                // Create tag if it doesn't exist
                if (!existingTag) {
                    const insertTag = db.prepare(`INSERT INTO contact_tags (tag_name) VALUES (?)`);
                    const result = insertTag.run(tagName);
                    tagId = result.lastInsertRowid;
                } else {
                    tagId = existingTag.id;
                }
                
                // Check if mapping already exists
                const getMapping = db.prepare(`
                    SELECT id FROM contact_tag_mapping
                    WHERE contact_id = ? AND tag_id = ?
                `);
                const existingMapping = getMapping.get(contactId, tagId);
                
                // Add mapping if it doesn't exist
                if (!existingMapping) {
                    const insertMapping = db.prepare(`
                        INSERT INTO contact_tag_mapping (contact_id, tag_id)
                        VALUES (?, ?)
                    `);
                    insertMapping.run(contactId, tagId);
                }
                
                return true;
            })();
        }
    } catch (error) {
        console.error(`Error in addTagToContact for contact ${contactId} and tag ${tagName}:`, error);
        return false;
    }
}

// Remove a tag from a contact
async function removeTagFromContact(contactId, tagId) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    DELETE FROM contact_tag_mapping
                    WHERE contact_id = $1 AND tag_id = $2
                `;
                
                const result = await client.query(sql, [contactId, tagId]);
                return result.rowCount > 0;
            } finally {
                client.release();
            }
        } else {
            const sql = `
                DELETE FROM contact_tag_mapping
                WHERE contact_id = ? AND tag_id = ?
            `;
            
            const stmt = db.prepare(sql);
            const result = stmt.run(contactId, tagId);
            return result.changes > 0;
        }
    } catch (error) {
        console.error(`Error in removeTagFromContact for contact ${contactId} and tag ${tagId}:`, error);
        return false;
    }
}

// Get all tags for a contact
async function getTagsForContact(contactId) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT ct.id, ct.tag_name
                    FROM contact_tags ct
                    JOIN contact_tag_mapping ctm ON ct.id = ctm.tag_id
                    WHERE ctm.contact_id = $1
                    ORDER BY ct.tag_name
                `;
                
                const result = await client.query(sql, [contactId]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT ct.id, ct.tag_name
                FROM contact_tags ct
                JOIN contact_tag_mapping ctm ON ct.id = ctm.tag_id
                WHERE ctm.contact_id = ?
                ORDER BY ct.tag_name
            `;
            
            const stmt = db.prepare(sql);
            return stmt.all(contactId);
        }
    } catch (error) {
        console.error(`Error in getTagsForContact for ${contactId}:`, error);
        return [];
    }
}

// Add an interaction record for a contact
async function addContactInteraction(contactId, interactionType, description, metadata = {}) {
    try {
        const metadataJson = JSON.stringify(metadata);
        
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    INSERT INTO contact_interactions
                    (contact_id, interaction_type, description, metadata)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                
                const result = await client.query(sql, [contactId, interactionType, description, metadataJson]);
                return result.rows && result.rows.length > 0 ? result.rows[0].id : null;
            } finally {
                client.release();
            }
        } else {
            const sql = `
                INSERT INTO contact_interactions
                (contact_id, interaction_type, description, metadata)
                VALUES (?, ?, ?, ?)
            `;
            
            const stmt = db.prepare(sql);
            const result = stmt.run(contactId, interactionType, description, metadataJson);
            return result.lastInsertRowid;
        }
    } catch (error) {
        console.error(`Error in addContactInteraction for contact ${contactId}:`, error);
        return null;
    }
}

// Get all interactions for a contact
async function getContactInteractions(contactId, limit = 100) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT * FROM contact_interactions
                    WHERE contact_id = $1
                    ORDER BY created_at DESC
                    LIMIT $2
                `;
                
                const result = await client.query(sql, [contactId, limit]);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT * FROM contact_interactions
                WHERE contact_id = ?
                ORDER BY created_at DESC
                LIMIT ?
            `;
            
            const stmt = db.prepare(sql);
            return stmt.all(contactId, limit);
        }
    } catch (error) {
        console.error(`Error in getContactInteractions for ${contactId}:`, error);
        return [];
    }
}

// Update contact lead status
async function updateContactStatus(contactId, status, notes = null) {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                let sql, params;
                
                if (notes !== null) {
                    sql = `
                        UPDATE contact_submissions
                        SET status = $1, notes = $2
                        WHERE id = $3
                        RETURNING *
                    `;
                    params = [status, notes, contactId];
                } else {
                    sql = `
                        UPDATE contact_submissions
                        SET status = $1
                        WHERE id = $2
                        RETURNING *
                    `;
                    params = [status, contactId];
                }
                
                const result = await client.query(sql, params);
                return result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            let sql, params;
            
            if (notes !== null) {
                sql = `
                    UPDATE contact_submissions
                    SET status = ?, notes = ?
                    WHERE id = ?
                `;
                params = [status, notes, contactId];
            } else {
                sql = `
                    UPDATE contact_submissions
                    SET status = ?
                    WHERE id = ?
                `;
                params = [status, contactId];
            }
            
            const stmt = db.prepare(sql);
            const result = stmt.run(...params);
            
            if (result.changes > 0) {
                // Get the updated contact
                const getContact = db.prepare(`
                    SELECT * FROM contact_submissions
                    WHERE id = ?
                `);
                return getContact.get(contactId);
            }
            return null;
        }
    } catch (error) {
        console.error(`Error in updateContactStatus for contact ${contactId}:`, error);
        return null;
    }
}

// Get all available tags
async function getAllTags() {
    try {
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `
                    SELECT id, tag_name,
                           (SELECT COUNT(*) FROM contact_tag_mapping WHERE tag_id = contact_tags.id) as usage_count
                    FROM contact_tags
                    ORDER BY tag_name
                `;
                
                const result = await client.query(sql);
                return result.rows || [];
            } finally {
                client.release();
            }
        } else {
            const sql = `
                SELECT id, tag_name,
                       (SELECT COUNT(*) FROM contact_tag_mapping WHERE tag_id = contact_tags.id) as usage_count
                FROM contact_tags
                ORDER BY tag_name
            `;
            
            const stmt = db.prepare(sql);
            return stmt.all();
        }
    } catch (error) {
        console.error('Error in getAllTags:', error);
        return [];
    }
}

// Get contacts with filters and sorting
async function getFilteredContacts(filters = {}, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 20) {
    try {
        const offset = (page - 1) * limit;
        let whereConditions = [];
        let params = [];
        let paramCount = 1; // For PostgreSQL parameterized queries
        
        // Build WHERE clause based on filters
        if (filters.status && filters.status !== 'all') {
            if (isHeroku) {
                whereConditions.push(`status = $${paramCount++}`);
                params.push(filters.status);
            } else {
                whereConditions.push('status = ?');
                params.push(filters.status);
            }
        }
        
        if (filters.tag) {
            if (isHeroku) {
                whereConditions.push(`id IN (
                    SELECT contact_id FROM contact_tag_mapping 
                    JOIN contact_tags ON contact_tag_mapping.tag_id = contact_tags.id 
                    WHERE contact_tags.tag_name = $${paramCount++}
                )`);
                params.push(filters.tag);
            } else {
                whereConditions.push(`id IN (
                    SELECT contact_id FROM contact_tag_mapping 
                    JOIN contact_tags ON contact_tag_mapping.tag_id = contact_tags.id 
                    WHERE contact_tags.tag_name = ?
                )`);
                params.push(filters.tag);
            }
        }
        
        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            if (isHeroku) {
                whereConditions.push(`(
                    first_name ILIKE $${paramCount} OR 
                    last_name ILIKE $${paramCount} OR 
                    email ILIKE $${paramCount} OR 
                    major ILIKE $${paramCount}
                )`);
                params.push(searchTerm);
                paramCount++;
            } else {
                whereConditions.push(`(
                    first_name LIKE ? OR 
                    last_name LIKE ? OR 
                    email LIKE ? OR 
                    major LIKE ?
                )`);
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }
        }
        
        // Construct the SQL query
        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // For PostgreSQL, we need to add parameters for LIMIT and OFFSET
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                // Count total contacts matching the filter
                const countSql = `
                    SELECT COUNT(*) as total_count
                    FROM contact_submissions
                    ${whereClause}
                `;
                
                const countResult = await client.query(countSql, params);
                const totalCount = parseInt(countResult.rows[0].total_count);
                
                // Get contacts
                const sql = `
                    SELECT *
                    FROM contact_submissions
                    ${whereClause}
                    ORDER BY ${sortBy} ${sortOrder}
                    LIMIT $${paramCount++} OFFSET $${paramCount++}
                `;
                
                const paginatedParams = [...params, limit, offset];
                const result = await client.query(sql, paginatedParams);
                
                return {
                    contacts: result.rows || [],
                    totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
                };
            } finally {
                client.release();
            }
        } else {
            // SQLite version
            // Count total contacts matching the filter
            const countSql = `
                SELECT COUNT(*) as total_count
                FROM contact_submissions
                ${whereClause}
            `;
            
            const countStmt = db.prepare(countSql);
            const totalCount = countStmt.get(...params).total_count;
            
            // Get contacts
            const sql = `
                SELECT *
                FROM contact_submissions
                ${whereClause}
                ORDER BY ${sortBy} ${sortOrder}
                LIMIT ? OFFSET ?
            `;
            
            const stmt = db.prepare(sql);
            const contacts = stmt.all(...params, limit, offset);
            
            return {
                contacts,
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            };
        }
    } catch (error) {
        console.error('Error in getFilteredContacts:', error);
        return {
            contacts: [],
            totalCount: 0,
            page,
            limit,
            totalPages: 0
        };
    }
}

// Get full contact details including tags and poll responses
async function getContactDetails(contactId) {
    try {
        // Get the contact information
        let contact;
        if (isHeroku) {
            const client = await db.client.connect();
            try {
                const sql = `SELECT * FROM contact_submissions WHERE id = $1`;
                const result = await client.query(sql, [contactId]);
                contact = result.rows && result.rows.length > 0 ? result.rows[0] : null;
            } finally {
                client.release();
            }
        } else {
            const sql = `SELECT * FROM contact_submissions WHERE id = ?`;
            const stmt = db.prepare(sql);
            contact = stmt.get(contactId);
        }
        
        if (!contact) {
            return null;
        }
        
        // Get tags for this contact
        const tags = await getTagsForContact(contactId);
        
        // Get poll responses
        const pollResponses = await getPollResponsesForContact(contactId);
        
        // Get interactions
        const interactions = await getContactInteractions(contactId);
        
        // Return full contact details
        return {
            ...contact,
            tags,
            pollResponses,
            interactions
        };
    } catch (error) {
        console.error(`Error in getContactDetails for ${contactId}:`, error);
        return null;
    }
}

// Export functions
module.exports = {
    getContactByUserId,
    updateContactWithUserId,
    getPollResponsesForContact,
    addTagToContact,
    removeTagFromContact,
    getTagsForContact,
    addContactInteraction,
    getContactInteractions,
    updateContactStatus,
    getAllTags,
    getFilteredContacts,
    getContactDetails
};