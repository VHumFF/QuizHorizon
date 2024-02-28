document.addEventListener('DOMContentLoaded', function() {

    var subjectId = window.location.pathname.split('/').pop();


    let currentPage = 1;
    let searchQuery = "";
    fetchQuizzesList(currentPage, searchQuery, subjectId);
  
    document.getElementById('searchInput').addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      fetchQuizzesList(currentPage, searchQuery, subjectId);
    });

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
      tbody.innerHTML = '';

      data.rows.forEach((quiz, index) => {
        const row = document.createElement('tr');

        if (index % 2 === 0) {
          row.classList.add('even');
        } else {
          row.classList.add('odd');
        }
        
        fetch(`/api/get_attempt?quizId=${quiz.quiz_id}`)
        .then(response => response.json())
        .then(attempt => {
            if(attempt > 0){
              row.innerHTML = `
                    <td>${quiz.quiz_name}</td>
                    <td><a href="/quiz/review/${quiz.quiz_id}">review</a></td>
                  `;
            }
            else{
              row.innerHTML = `
                    <td>${quiz.quiz_name}</td>
                    <td><a href="/quiz/attempt/${quiz.quiz_id}">attempt</a></td>
                  `;
            }
        })
        .catch(error => console.error('Error:', error));

        tbody.appendChild(row);
      });
      const pageCountDisplay = document.getElementById('pageCount');
      pageCountDisplay.textContent = `Page ${page} of ${Math.ceil(data.total / 10)}`;

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