document.addEventListener('DOMContentLoaded', () => {
    fetchUserDetails()
  
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