document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const instructorChecked = document.getElementById('instructor').checked;
    const studentChecked = document.getElementById('student').checked;

    if (!instructorChecked && !studentChecked) {
        document.getElementById('roleError').style.display = 'block';
        return;
    }

    const role = instructorChecked ? 'instructor' : 'student';
    
    const formData = {
        username: document.querySelector('input[name="username"]').value,
        fullname: document.querySelector('input[name="fullname"]').value,
        email: document.querySelector('input[name="email"]').value,
        contact: document.querySelector('input[name="contact"]').value,
        address: document.querySelector('input[name="address"]').value,
        role: role
    };

    
    fetch('/validation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        
        if (data.usernameError) {
            document.getElementById('usernameError').style.display = 'block';
        } else {
            document.getElementById('usernameError').style.display = 'none';
        }
        

        if (data.fullnameError) {
            document.getElementById('fullnameError').style.display = 'block';
        } else {
            document.getElementById('fullnameError').style.display = 'none';
        }
        if (data.emailError) {
            document.getElementById('emailError').style.display = 'block';
        } else {
            document.getElementById('emailError').style.display = 'none';
        }
        if (data.addressError) {
            document.getElementById('addressError').style.display = 'block';
        } else {
            document.getElementById('addressError').style.display = 'none';
        }
        if (data.contactError) {
            document.getElementById('contactError').style.display = 'block';
        } else {
            document.getElementById('contactError').style.display = 'none';
        }

        // If no errors, submit the form
        
        if (!data.usernameError && !data.fullnameError && !data.emailError && !data.addressError && !data.contactError) {
            
            checkUsernameExistence(document.querySelector('input[name="username"]').value)
                .then(userExists => {
                    if (userExists) {
                        document.getElementById('usernameExist').style.display = 'block';
                    } else {
                        document.getElementById('usernameExist').style.display = 'none';
                        const confirmationModal = document.getElementById('confirmationModal');
                        confirmationModal.style.display = 'block';
                        
                        const confirmRegisterButton = document.getElementById('confirmRegister');
                        confirmRegisterButton.addEventListener('click', handleConfirmRegister);
                    
                        document.getElementById('cancelRegistration').addEventListener('click', () => {
                            confirmationModal.style.display = 'none';
                            confirmRegisterButton.removeEventListener('click', handleConfirmRegister);
                        })
                        
                        function handleConfirmRegister() {
                            fetch(`/register`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                            })
                            .then(response => {
                                if (response.ok) {
                                    console.log('User register successfully');

                                    confirmationModal.style.display = 'none';
                                    confirmRegisterButton.removeEventListener('click', handleConfirmRegister); 

                                    document.getElementById('registerForm').submit();
                                } else {
                                    console.error('Failed to register user');
                                    throw new Error('Failed to register user');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            })
                        }
                    }
                })
                .catch(error => {
                    console.error('Error checking username existence:', error);
                    // Handle errors as needed
                });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



async function checkUsernameExistence(username) {
    try {
      const response = await fetch('/userexist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.userExist;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Return null or handle the error as needed
      return null;
    }
  }