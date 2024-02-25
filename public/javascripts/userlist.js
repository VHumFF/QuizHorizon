
document.addEventListener('DOMContentLoaded', () => {
  // This ensures that the script runs after the DOM has been fully loaded
  let currentPage = 1;
  let searchQuery = "";
  fetchUserDetails(currentPage, searchQuery);

  document.getElementById('searchInput').addEventListener('input', function () {
    searchQuery = this.value.trim();
    currentPage = 1;
    fetchUserDetails(currentPage, searchQuery); // Reset to page 1 and apply the search
  });
  // Handle pagination button clicks
  document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchUserDetails(currentPage, searchQuery);
  });

  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUserDetails(currentPage, searchQuery);
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
              fetchUserDetails(currentPage, searchQuery);
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




function fetchUserDetails(page, searchQuery = '') {
  fetch(`/api/user-details?page=${page}&search=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('userTableBody');
      tbody.innerHTML = ''; // Clear the table

      // Loop through the user details and create rows
      data.rows.forEach((user, index) => {
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
          <td><button class="deleteButton" data-userID="${user.user_id}"><span class="deleteIcon"></span></button></td>
          
        `;

        tbody.appendChild(row);
      });
      const pageCountDisplay = document.getElementById('pageCount');
      pageCountDisplay.textContent = `Page ${page} of ${Math.ceil(data.total / 10)}`;
      // Update pagination buttons based on total count and current page
      updatePaginationButtons(page, data.total);
    })
    .catch(error => console.error('Error:', error));
}

function updatePaginationButtons(currentPage, totalCount) {
  const totalPages = Math.ceil(totalCount / 10);
  console.log("the item perpage is ", totalCount)
  const nextPageButton = document.getElementById('nextPage');
  const prevPageButton = document.getElementById('prevPage');

  nextPageButton.disabled = currentPage >= totalPages;
  prevPageButton.disabled = currentPage <= 1;
}