const db = require('../models/db');

async function getInstructorList() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.user_id, ud.full_name
        FROM users u
        INNER JOIN user_details ud ON u.user_id = ud.user_id
        WHERE u.role = 'instructor'
      `;
  
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
}


function validateSubjectName(subName) {

    // Validate username
    const subjectNameRegex = /^[a-zA-Z\s]{3,20}$/;
    if (!subName || !subjectNameRegex.test(subName)) {
        return false;
    }
    return true;
}


function createSubject(subName, instructorID){
    const query = 'INSERT INTO subjects (subject_name, taught_by) VALUES (?, ?)';
    const data = [subName, instructorID]; 
    db.query(query, data, (error, Result, fields) => {
        if (error) {
            console.error('Error inserting into users table:', error);
            return;
        }
    });

}



module.exports = {
    getInstructorList,
    validateSubjectName,
    createSubject
};
