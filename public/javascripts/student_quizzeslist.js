document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var subjectId = window.location.pathname.split('/').pop();

    // This ensures that the script runs after the DOM has been fully loaded
    let currentPage = 1;
    let searchQuery = "";
    fetchQuizzesList(currentPage, searchQuery, subjectId);
  
    document.getElementById('searchInput').addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      fetchQuizzesList(currentPage, searchQuery, subjectId); // Reset to page 1 and apply the search
    });
    // Handle pagination button clicks
    document.getElementById('nextPage').addEventListener('click', () => {
      currentPage++;
      fetchQuizzesList(currentPage, searchQuery, subjectId);
    });
  
    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchQuizzesList(currentPage, searchQuery, subjectId);
      }

    });

});




function fetchQuizzesList(page, searchQuery, subjectId) {
    fetch(`/api/stu-quizzeslist?page=${page}&search=${searchQuery}&subjectID=${subjectId}`)
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('quizTableBody');
        tbody.innerHTML = ''; // Clear the table
  
        // Loop through the subject and create rows
        data.rows.forEach((quiz, index) => {
          const row = document.createElement('tr');
  
          if (index % 2 === 0) {
            row.classList.add('even');
          } else {
            row.classList.add('odd');
          }
  
          row.innerHTML = `
            <td>${quiz.quiz_name}</td>
            <td><a href="/quiz/attempt/${quiz.quiz_id}">attempt</a></td>
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