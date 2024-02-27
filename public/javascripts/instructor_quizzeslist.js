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
    

    document.getElementById("openModal").addEventListener("click", function() {
        document.getElementById("modal").style.display = "block";
    });
    
    document.getElementById("closeModal").addEventListener("click", function() {
        document.getElementById("modal").style.display = "none";
    });
    
    document.getElementById("createQuiz").addEventListener("click", function(event) {
        var quizNameInput = document.getElementById("quizName");
        var quizName = quizNameInput.value;
        // Do something with the quiz name, like creating a quiz
        

        fetch('/validateQuizName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quizName: quizName })
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(quizNameValid  => {
              if(quizNameValid) {
                fetch('/createQuiz', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ quizName: quizName, subjectId:subjectId})
                })
                .then(response => {
                  if (response.ok) {
                        document.getElementById('quizError').style.display = 'none';
                        console.log('Quiz created successfully');
                        console.log("Quiz Name: ", quizName);
                        quizNameInput.value = ""; // Clear the textbox
                        document.getElementById("modal").style.display = "none";
                        currentPage = 1;
                        searchQuery = "";
                        fetchQuizzesList(currentPage, searchQuery, subjectId);
                  } else {
                        console.error('Failed to create quiz');
                        throw new Error('Failed to create quiz');
                  }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
    
              }
              else {
                document.getElementById('quizError').style.display = 'block';
              }
          })
          .catch(error => {
            console.error('Error:', error);
          });

    });



    document.getElementById('quizTableBody').addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.deleteButton');
      
        if (deleteButton) {
          const quizToDelete = deleteButton.getAttribute('data-quizID');
          const confirmationModal = document.getElementById('confirmationModal');
          confirmationModal.style.display = 'block';
      
          const confirmDeleteButton = document.getElementById('confirmDelete');
          confirmDeleteButton.addEventListener('click', handleConfirmDelete);
      
          document.getElementById('cancelDelete').addEventListener('click', () => {
            confirmationModal.style.display = 'none';
            confirmDeleteButton.removeEventListener('click', handleConfirmDelete);
          });
      
          
          function handleConfirmDelete() {
            fetch(`/quizzes/${quizToDelete}`, {
              method: 'DELETE',
            })
              .then(response => {
                if (response.ok) {
                  console.log('quiz deleted successfully');
                  currentPage = 1;
                  fetchQuizzesList(currentPage, searchQuery, subjectId);
                } else {
                  console.error('Failed to delete quiz');
                  throw new Error('Failed to delete quiz');
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




function fetchQuizzesList(page, searchQuery, subjectId) {
    fetch(`/api/ins-quizzeslist?page=${page}&search=${searchQuery}&subjectID=${subjectId}`)
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
            <td>${quiz.status}</td>
            <td><a href="/questions/${quiz.quiz_id}"><img src="/images/editing.png" alt="Description of the image" class="editIcon"></a>
            <a href="/student-attempt/${quiz.quiz_id}"><img src="/images/results.png" alt="Description of the image" class="resultIcon"></a>
    <button class="deleteButton" data-quizID="${quiz.quiz_id}"><span class="deleteIcon"></span></button></td>
    
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