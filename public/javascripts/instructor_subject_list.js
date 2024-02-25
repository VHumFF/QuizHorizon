
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
      const openButton = event.target.closest('.openButton');
    
      if (openButton) {
        const subjectToOpen = openButton.getAttribute('data-subjectID');

        openButton.addEventListener('click', handleOpen);

    
        function handleOpen() {
          
        }
        
      }
    });

});
  
  
  
  
function fetchSubjectList(page, searchQuery) {
  fetch(`/api/ins-subject-list?page=${page}&search=${searchQuery}`)
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
          <td><a href="/subjects/${subjects.subject_id}/quizzes" class="openLink">Open</a></td>
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