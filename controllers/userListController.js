const db = require('../models/db');

const ITEMS_PER_PAGE = 10; // Adjust the number of items per page as needed

function getUserDetails(page, search) {
  return new Promise((resolve, reject) => {
    // Modify your SQL query based on the search criteria
    let sql = `
      SELECT
        users.user_id,
        users.username,
        users.role,
        user_details.full_name,
        user_details.email,
        user_details.address
      FROM
        users
      JOIN
        user_details ON users.user_id = user_details.user_id
      WHERE
        '' = ? OR
        users.username LIKE ? OR
        users.role LIKE ? OR
        user_details.full_name LIKE ? OR
        user_details.email LIKE ? OR
        user_details.address LIKE ?
      LIMIT ?, ?;
    `;

    // Using placeholders to prevent SQL injection
    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }

      // Fetch total count of items without pagination
      let countSql = `
        SELECT COUNT(*) AS total FROM users
        JOIN user_details ON users.user_id = user_details.user_id
        WHERE
          '' = ? OR
          users.username LIKE ? OR
          users.role LIKE ? OR
          user_details.full_name LIKE ? OR
          user_details.email LIKE ? OR
          user_details.address LIKE ?;
      `;

      const countValues = [
        search, searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern
      ];

      db.query(countSql, countValues, (countErr, countResults) => {
        if (countErr) {
          console.error('Error executing MySQL query for count:', countErr);
          reject(countErr);
          return;
        }

        const totalCount = countResults[0].total;
        resolve({ rows: results, total: totalCount });
      });
    });
  });
}



const deleteUser = (req, res) => {
  const userId = req.params.userId;
  let sql = 'DELETE FROM users WHERE user_id = ?';

  db.query(sql, [userId], (error, result) => {
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send(); // Respond with success status
      } else {
        res.status(404).send('User not found'); // User with the specified ID not found
      }
    }
  });
};





module.exports = {
    getUserDetails,
    deleteUser
};
