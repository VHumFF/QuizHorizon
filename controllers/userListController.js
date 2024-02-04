const db = require('../models/db');

function getUserDetails() {
    return new Promise((resolve, reject) => {
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
          user_details ON users.user_id = user_details.user_id;`;
  
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          reject(err);
          return;
        }
        const rows = results;
        resolve(rows);
      }
    );
  });
};


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
