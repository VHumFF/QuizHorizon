
document.addEventListener('DOMContentLoaded', () => {
    // This ensures that the script runs after the DOM has been fully loaded
    let currentPage = 1;
    let searchQuery = "";
    fetchSubjectList(currentPage, searchQuery);
  
    document.getElementById('searchInput').addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      fetchSubjectList(currentPage, searchQuery); // Reset to page 1 and apply the search
    });
    // Handle pagination button clicks
    document.getElementById('nextPage').addEventListener('click', () => {
      currentPage++;
      fetchSubjectList(currentPage, searchQuery);
    });
  
    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchSubjectList(currentPage, searchQuery);
      }
    });
    
    document.getElementById('subjectTableBody').addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.deleteButton');
    
      if (deleteButton) {
        const subjectToDelete = deleteButton.getAttribute('data-subjectID');
        const confirmationModal = document.getElementById('confirmationModal');
        confirmationModal.style.display = 'block';
    
        const confirmDeleteButton = document.getElementById('confirmDelete');
        confirmDeleteButton.addEventListener('click', handleConfirmDelete);
    
        document.getElementById('cancelDelete').addEventListener('click', () => {
          confirmationModal.style.display = 'none';
          confirmDeleteButton.removeEventListener('click', handleConfirmDelete);
        });
    
        
        function handleConfirmDelete() {
          fetch(`/subject/${subjectToDelete}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (response.ok) {
                console.log('subject deleted successfully');
                currentPage = 1;
                fetchSubjectList(currentPage, searchQuery);
              } else {
                console.error('Failed to delete subject');
                throw new Error('Failed to delete subject');
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
  
  
  
  
  function fetchSubjectList(page, searchQuery) {
    fetch(`/api/subject-list?page=${page}&search=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('subjectTableBody');
        tbody.innerHTML = ''; // Clear the table
  
        // Loop through the subject and create rows
        data.rows.forEach((subjects, index) => {
          const row = document.createElement('tr');
  
          if (index % 2 === 0) {
            row.classList.add('even');
          } else {
            row.classList.add('odd');
          }
  
          row.innerHTML = `
            <td>${subjects.subject_name}</td>
            <td>${subjects.full_name}</td>
            <td><button class="deleteButton" data-subjectID="${subjects.subject_id}">Delete</button></td>
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
    console.log("the item per page is ", totalCount)
    const nextPageButton = document.getElementById('nextPage');
    const prevPageButton = document.getElementById('prevPage');
  
    nextPageButton.disabled = currentPage >= totalPages;
    prevPageButton.disabled = currentPage <= 1;
  }