const db = require('../models/db');

function validateUsername(username) {

    // Validate username
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!username || !usernameRegex.test(username)) {
        return true;
    }
    return false;
}

function checkUsernameExists(username, callback) {
    const sql = `SELECT COUNT(*) AS count FROM users WHERE username = ?`;

    // Perform the database query
    db.query(sql, [username], (error, results) => {
        if (error) {
            // Pass any errors to the callback
            callback(error, null);
            return;
        }
        // Extract the username count from the query results
        const usernameCount = results[0].count;
        if(usernameCount > 0){
            callback(null, true);
        }
        else{
            callback(null, false);
        }
        // Pass the username existence status to the callback
        
    });
}

function validateFullName(fullname) {
    // Validate fullname
    const fullnameRegex = /^[a-zA-Z\s]{4,20}$/;
    if (!fullname || !fullnameRegex.test(fullname)) {
        return true;
    }
    return false;
}

function validateaddress(address) {
    // Validate address
    const addressRegex = /^[a-zA-Z0-9\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{4,40}$/;
    if (!address || address.length < 4 || address.length > 40 || !addressRegex.test(address)) {
        return true;
    }
    return false;
}
function validateContact(contact) {
    // Validate contact
    const contactRegex = /^\d{7,11}$/; // Assuming contact is between 7 and 11 digits
    if (!contact || contact.length < 7 || contact.length > 11 || !contactRegex.test(contact)) {
        return true;
    }

    return false;
}

function validateEmail(email) {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return true;
    }

    return false;
}


function registerUser(username, fullname, email, address, contact, role){
    const userQuery = 'INSERT INTO users (username, role, password) VALUES (?, ?, ?)';
    const userData = [username, role, username]; // Assuming password is same as username
    db.query(userQuery, userData, (error, userResult, fields) => {
    if (error) {
        console.error('Error inserting into users table:', error);
        return;
    }
    
    // Step 2: Use the auto-generated userid to insert user details into user_details table
    const userid = userResult.insertId; // Get the auto-generated userid
    const userDetailsQuery = 'INSERT INTO user_details (user_id, full_name, email, address, contact) VALUES (?, ?, ?, ?, ?)';
    const userDetailsData = [userid, fullname, email, address, contact];
    db.query(userDetailsQuery, userDetailsData, (error, userDetailsResult, fields) => {
        if (error) {
        console.error('Error inserting into user_details table:', error);
        return;
        }
        console.log('User and user details inserted successfully');
    });
    });
}

// Export the controller functions
module.exports = {
    validateUsername,
    checkUsernameExists,
    validateContact,
    validateEmail,
    validateFullName,
    validateaddress,
    registerUser
};
