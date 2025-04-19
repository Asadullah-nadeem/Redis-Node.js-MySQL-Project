const db = require('../config/database');

class User {
  static async findAll({ page = 1, limit = 6, search = '' }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, username, email, first_name, last_name, age, role FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const params = [];
    
    if (search) {
      query += ' WHERE username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
      countQuery += ' WHERE username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [users] = await db.query(query, params);
    const [[{ total }]] = await db.query(countQuery, params.slice(0, -2));
    
    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, username, email, first_name, last_name, age, role FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User;