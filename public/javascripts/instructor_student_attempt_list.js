document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var quizId = window.location.pathname.split('/').pop();


    let currentPage = 1;
    let searchQuery = "";
    fetchStudentList(currentPage, searchQuery, quizId);
  
    document.getElementById('searchInput').addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      fetchStudentList(currentPage, searchQuery, quizId);
    });
    // Handle pagination button clicks
    document.getElementById('nextPage').addEventListener('click', () => {
      currentPage++;
      fetchStudentList(currentPage, searchQuery, quizId);
    });
  
    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchStudentList(currentPage, searchQuery, quizId);
      }

    });
    
});




function fetchStudentList(page, searchQuery, quizId) {
    fetch(`/api/ins-attemptList?page=${page}&search=${searchQuery}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('quizTableBody');
        tbody.innerHTML = '';

        data.rows.forEach((quiz, index) => {
          const row = document.createElement('tr');
  
          if (index % 2 === 0) {
            row.classList.add('even');
          } else {
            row.classList.add('odd');
          }
  
          row.innerHTML = `
            <td>${quiz.full_name}</td>
            <td><a href="/viewAttempt/${quizId}/${quiz.user_id}"><img src="/images/view.png" alt="Description of the image" class="viewIcon"></a></td>`;
  
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