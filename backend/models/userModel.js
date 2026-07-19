const pool = require('../config/database');

// Get all users (Admin only)
const getAllUsers = async () => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, region, gender, role, created_at FROM users WHERE is_deleted = FALSE ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE',
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, region, gender, role, avatar_url FROM users WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Create user
const createUser = async (userData) => {
  try {
    const { name, email, phone, passwordHash, region, gender, role = 'customer' } = userData;
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, region, gender, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, phone, region, gender, role',
      [name, email, phone, passwordHash, region, gender, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Update user profile
const updateUserProfile = async (userId, updates) => {
  try {
    const { name, phone, region, gender, avatarUrl } = updates;
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), region = COALESCE($3, region), gender = COALESCE($4, gender), avatar_url = COALESCE($5, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, name, email, phone, region, gender, avatar_url',
      [name, phone, region, gender, avatarUrl, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Update password
const updatePassword = async (userId, newPasswordHash) => {
  try {
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Soft delete user
const softDeleteUser = async (userId) => {
  try {
    await pool.query(
      'UPDATE users SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// Restore soft-deleted user (within 14 days)
const restoreUser = async (userId) => {
  try {
    const result = await pool.query(
      'SELECT deleted_at FROM users WHERE id = $1 AND is_deleted = TRUE',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found or not deleted');
    }

    const deletedAt = result.rows[0].deleted_at;
    const daysSince = Math.floor((new Date() - deletedAt) / (1000 * 60 * 60 * 24));

    if (daysSince > 14) {
      throw new Error('Recovery period expired (14 days)');
    }

    await pool.query(
      'UPDATE users SET is_deleted = FALSE, deleted_at = NULL WHERE id = $1',
      [userId]
    );
    return true;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUserProfile,
  updatePassword,
  softDeleteUser,
  restoreUser,
};
