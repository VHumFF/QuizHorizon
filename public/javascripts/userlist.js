
document.addEventListener('DOMContentLoaded', () => {
  // This ensures that the script runs after the DOM has been fully loaded
  let currentPage = 1;

  fetchUserDetails(currentPage);

  // Handle pagination button clicks
  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchUserDetails(currentPage);
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUserDetails(currentPage);
    }
  });
  
  document.getElementById('userTableBody').addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.deleteButton');
  
    if (deleteButton) {
      const userToDelete = deleteButton.getAttribute('data-userID');
      const confirmationModal = document.getElementById('confirmationModal');
      confirmationModal.style.display = 'block';
  
      const confirmDeleteButton = document.getElementById('confirmDelete');
      confirmDeleteButton.addEventListener('click', handleConfirmDelete);
  
      document.getElementById('cancelDelete').addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        confirmDeleteButton.removeEventListener('click', handleConfirmDelete);
      });
  
      
      function handleConfirmDelete() {
        fetch(`/users/${userToDelete}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (response.ok) {
              console.log('User deleted successfully');
              currentPage = 1;
              fetchUserDetails(1);
            } else {
              console.error('Failed to delete user');
              throw new Error('Failed to delete user');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          })
          .finally(() => {
            confirmationModal.style.display = 'none';
            confirmDeleteButton.removeEventListener('click', handleConfirmDelete);
          });
      }
      
    }
  });

});




function fetchUserDetails(page) {
  fetch(`/api/user-details?page=${page}`)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('userTableBody');
      tbody.innerHTML = ''; // Clear the table
    // Loop through the user details and create rows
      data.forEach((user, index) => {
        const row = document.createElement('tr');

        if (index % 2 === 0) {
          row.classList.add('even');
        } else {
          row.classList.add('odd');
        }

        row.innerHTML = `
          <td>${user.username}</td>
          <td>${user.role}</td>
          <td>${user.full_name}</td>
          <td>${user.email}</td>
          <td>${user.address}</td>
          <td><button class="deleteButton" data-userID="${user.user_id}">Delete</button></td>
        `;

        tbody.appendChild(row);
      });
    })
    .catch(error => console.error('Error:', error));
};