document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails()
    const changePasswordForm = document.querySelector('#change_password form');

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission behavior

            // Retrieve form data
            const currentPassword = document.querySelector('#current_password').value;
            const newPassword = document.querySelector('#new_password').value;
            const confirmPassword = document.querySelector('#confirm_password').value;

            if(currentPassword === "" || newPassword === "" || confirmPassword === ""){
              alert("Please ensure all fields are filled");
              document.getElementById("ChangeNotMatch").style.display = "none";
              document.getElementById("changeIncorrect").style.display = "none";
              document.getElementById("changeSuccess").style.display = "none";
              document.getElementById("changeFormat").style.display = "none";
            }
            else if(newPassword !== confirmPassword){
              document.getElementById("ChangeNotMatch").style.display = "block";
              document.getElementById("changeIncorrect").style.display = "none";
              document.getElementById("changeSuccess").style.display = "none";
              document.getElementById("changeFormat").style.display = "none";
            }
            else if(newPassword.length < 7 || newPassword.length > 20){
              document.getElementById("ChangeNotMatch").style.display = "none";
              document.getElementById("changeIncorrect").style.display = "none";
              document.getElementById("changeSuccess").style.display = "none";
              document.getElementById("changeFormat").style.display = "block";
            }
            else{
              fetch('/api/change_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
              })
              .then(response => {
                if (response.ok) {
                  // Parse the JSON response
                  return response.json();
                } else {
                    // If the response is not successful, throw an error
                    throw new Error('Failed to change password');
                }
              })
              .then(data => {
                if(data.message === "Passwords do not match"){
                  document.getElementById("ChangeNotMatch").style.display = "block";
                  document.getElementById("changeIncorrect").style.display = "none";
                  document.getElementById("changeSuccess").style.display = "none";
                  document.getElementById("changeFormat").style.display = "none";

                }else if(data.message === "Current password incorrect"){
                  document.getElementById("ChangeNotMatch").style.display = "none";
                  document.getElementById("changeIncorrect").style.display = "block";
                  document.getElementById("changeSuccess").style.display = "none";
                  document.getElementById("changeFormat").style.display = "none";
                }
                else if(data.message === "Password updated successfully"){
                  document.getElementById("ChangeNotMatch").style.display = "none";
                  document.getElementById("changeIncorrect").style.display = "none";
                  document.getElementById("changeSuccess").style.display = "block";
                  document.getElementById("changeFormat").style.display = "none";

                  document.getElementById("current_password").value = "";
                  document.getElementById("new_password").value = "";
                  document.getElementById("confirm_password").value = "";
                }
                else if(data.message === "Password format wrong"){
                  document.getElementById("ChangeNotMatch").style.display = "none";
                  document.getElementById("changeIncorrect").style.display = "none";
                  document.getElementById("changeSuccess").style.display = "none";
                  document.getElementById("changeFormat").style.display = "block";
                }
              })
              .catch(error => {
                  console.error('Error:', error)
              });
            }
        });
    }
});


function fetchUserDetails() {
    fetch(`/profile_info`)
      .then(response => response.json())
      .then(data => {
        // Populate user details in the HTML elements
        document.getElementById('name').innerText = `NAME: ${data.full_name}`;
        document.getElementById('contact').innerText = `CONTACT: ${data.contact}`;
        document.getElementById('address').innerText = `ADDRESS: ${data.address}`;
        document.getElementById('email').innerText = `EMAIL: ${data.email}`;
      })
      .catch(error => console.error('Error:', error));
}