document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var quizId = window.location.pathname.split('/').pop();

    // This ensures that the script runs after the DOM has been fully loaded
    let currentPage = 1;
    let searchQuery = "";
    fetchQuestionList(currentPage, searchQuery, quizId);
  
    document.getElementById('searchInput').addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      fetchQuestionList(currentPage, searchQuery, quizId); // Reset to page 1 and apply the search
    });
    // Handle pagination button clicks
    document.getElementById('nextPage').addEventListener('click', () => {
      currentPage++;
      fetchQuestionList(currentPage, searchQuery, quizId);
    });
  
    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchQuestionList(currentPage, searchQuery, quizId);
      }

    });

    document.getElementById('addButton').addEventListener('click', () => {
        document.getElementById('viewModal').style.display = 'block';
        addQuestion(currentPage, searchQuery, quizId);
        
    })

    document.getElementById('questionTableBody').addEventListener('click', (event) => {


        const viewButton = event.target.closest('.viewButton');
        if (viewButton) {
            const questionToView = viewButton.getAttribute('data-questionID');
            document.getElementById('viewModal').style.display = 'block';
            viewQuestion(questionToView);
        }
        
        const editButton = event.target.closest('.editButton');
        if (editButton) {
            const questionToEdit = editButton.getAttribute('data-questionID');
            document.getElementById('viewModal').style.display = 'block';
            editQuestion(questionToEdit, currentPage, searchQuery, quizId);
        }
        
    
        const deleteButton = event.target.closest('.deleteButton');
      
        if (deleteButton) {
          const questionToDelete = deleteButton.getAttribute('data-questionID');
          const confirmationModal = document.getElementById('confirmationModal');
          confirmationModal.style.display = 'block';
      
          const confirmDeleteButton = document.getElementById('confirmDelete');
          confirmDeleteButton.addEventListener('click', handleConfirmDelete);
      
          document.getElementById('cancelDelete').addEventListener('click', () => {
            confirmationModal.style.display = 'none';
            confirmDeleteButton.removeEventListener('click', handleConfirmDelete);
          });
      
          
          function handleConfirmDelete() {
            fetch(`/question/${questionToDelete}`, {
              method: 'DELETE',
            })
              .then(response => {
                if (response.ok) {
                  console.log('quiz deleted successfully');
                  currentPage = 1;
                  fetchQuestionList(currentPage, searchQuery, quizId);
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

document.addEventListener('click', function(event) {
    // Check if the clicked element is the close-view button
    if (event.target && event.target.id === 'close-view') {
        // Call function to close the modal
        document.getElementById('viewModal').style.display = 'none';
    }

    if (event.target && event.target.id === 'update-question') {

        document.getElementById('viewModal').style.display = 'none';
    }
});

function viewQuestion(question_id){
    fetch(`/api/question?questionId=${question_id}`)
      .then(response => response.json())
      .then(data => {
        const viewModal = document.querySelector('#viewModal .view-modal-content');

        data.rows.forEach((question) => {
            const optionsArray = question.options.split('|');
            const optionsHTML = optionsArray.map((option, index) => `
                <div>
                    <label>Option ${index + 1}</label>
                    <input type="text" class="option" value="${option}" readonly>
                </div>`).join('');
            viewModal.innerHTML = `
            <div>
                <div>
                    <label>Question</label>
                    <textarea class="question" readonly>${question.question}</textarea>
                </div>
                <div>
                    <label>Correct Answer</label>
                    <input type="number" class="answer" value="${question.answer}" readonly>
                </div>
                <div class="options">
                    ${optionsHTML}
                </div>
                <button id="close-view">Close</button>
            </div>`;
        });

    })
    .catch(error => console.error('Error:', error));
}


function editQuestion(question_id, currentPage, searchQuery, quizId){
    fetch(`/api/question?questionId=${question_id}`)
      .then(response => response.json())
      .then(data => {
        const viewModal = document.querySelector('#viewModal .view-modal-content');

        data.rows.forEach((question) => {
            const optionsArray = question.options.split('|');
            let optionsHTML = optionsArray.map((option, index) => `
                <div class="option-container">
                    <label>Option ${index + 1}</label>
                    <button class="delete-option" data-index="${index}">Delete</button>
                    <input type="text" class="option" value="${option}">
                </div>`).join('');

            viewModal.innerHTML = `
                <div>
                    <div>
                        <label>Question</label>
                        <textarea class="question">${question.question}</textarea>
                    </div>
                    <div>
                        <button id="add-option">Add Option</button>
                    </div>
                    <div>
                        <label>Correct Answer</label>
                        <input type="number" class="answer" value="${question.answer}" min="1">
                    </div>
                    <div class="options">
                        ${optionsHTML}
                    </div>
                    <button id="update-question">Update</button>
                    <button id="close-view">Close</button>
                </div>`;
            
            const $answerInput = viewModal.querySelector('.answer');
            $answerInput.max = optionsArray.length;
        
            viewModal.querySelector('#add-option').addEventListener('click', function() {
                const optionsContainer = viewModal.querySelector('.options');
                const optionCount = optionsContainer.querySelectorAll('.option-container').length;
                const newOptionHTML = `
                    <div class="option-container">
                        <label>Option ${optionCount + 1}</label>
                        <input type="text" class="option">
                        <button class="delete-option" data-index="${optionCount}">Delete</button>
                    </div>`;
                optionsContainer.insertAdjacentHTML('beforeend', newOptionHTML);
                $answerInput.max = optionCount + 1;
            });

            // Add event listener for deleting options using event delegation
            viewModal.querySelector('.options').addEventListener('click', function(event) {
                const target = event.target;
                if (target.classList.contains('delete-option')) {
                    const $optionContainer = target.closest('.option-container');
                    const op_count = viewModal.querySelectorAll('.option-container').length;
            
                    // Check if there are only 2 or more options
                    if (op_count > 2) {
            
                        // Remove the option container
                        $optionContainer.remove();
            
                        const $options = viewModal.querySelectorAll('.option');
                        // Update the answer input's max attribute
                        const $answerInput = viewModal.querySelector('.answer');
                        if ($answerInput.value > op_count-1) {
                            $answerInput.value = 1;
                        }
                        $answerInput.max = op_count -1;
            
                        // Update option labels and data-index attributes
                        $options.forEach((option, i) => {
                            const optionLabel = option.parentNode.querySelector('label');
                            optionLabel.textContent = `Option ${i + 1}`;
                        });
                    } else {
                        alert("At least two options are required.");
                    }
                }
            });

            viewModal.querySelector('#update-question').addEventListener('click', function () {
                const questionData = getData(viewModal, question_id);
                var isEmpty = false;
                var isAnswerMoreOp = false;
                if(questionData === "Empty"){
                    isEmpty = true;
                }else if(questionData === "answer more than option"){
                    isAnswerMoreOp = true;
                }
                else{
                    isEmpty = false;
                }
                

                if(!isAnswerMoreOp){
                    if (!isEmpty) {
                        fetch('/updateQuestion', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ questionData: questionData })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Handle successful update
                            console.log('Question updated successfully:', data);
                            fetchQuestionList(currentPage, searchQuery, quizId);
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    } else {
                        alert('Question content or options cannot be empty');

                    }
                }
                else{
                    alert('Answer cannot be more than option');
                }
                
            });
            


            
        });

      })
      .catch(error => console.error('Error:', error));
}


function fetchQuestionList(page, searchQuery, quizId) {
    fetch(`/api/ins-questionlist?page=${page}&search=${searchQuery}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('questionTableBody');
        tbody.innerHTML = ''; // Clear the table
  
        // Loop through the subject and create rows
        data.rows.forEach((question, index) => {
          const row = document.createElement('tr');
  
          if (index % 2 === 0) {
            row.classList.add('even');
          } else {
            row.classList.add('odd');
          }
  
          row.innerHTML = `
            <td>${question.question}</td>
            <td><button class="viewButton" data-questionID="${question.question_id}"><span class="viewIconb"></span></button>
            <button class="editButton" data-questionID="${question.question_id}"><span class="editIconb"></span></button>
            <button class="deleteButton" data-questionID="${question.question_id}"><span class="deleteIcon"></span></button></td>
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


function getData(viewModal, questionID) {
    // Initialize an empty object to store the extracted data
    let data = {
        question: "",
        answer: "",
        options: "",
        question_id: questionID,
        quizId: window.location.pathname.split('/').pop()
    };

    // Extract question text
    const questionTextarea = viewModal.querySelector('.question');
    data.question = questionTextarea.value.trim();

    // Extract correct answer
    const answerInput = viewModal.querySelector('.answer');
    data.answer = answerInput.value.trim();
    let isEmpty = false;
    // Extract options
    const optionInputs = viewModal.querySelectorAll('.option');
    optionInputs.forEach((optionInput, index) => {
        const optionValue = optionInput.value.trim();
        if (optionValue !== "") {
            if(index == 0){
                data.options = optionValue;
            }
            else{
                data.options = data.options + "|" + optionValue;
            }
        }
        else{
            isEmpty = true;
        }
    });

    if(parseInt(data.answer) > optionInputs.length) {
        return "answer more than option";
    }

    if(data.question === ""){
        isEmpty = true;
    }
    if (isEmpty) {
        return "Empty";
    }
    // Return the extracted data object
    return data;
}


function addQuestion(currentPage, searchQuery, quizId) {
    const viewModal = document.querySelector('#viewModal .view-modal-content');
    viewModal.innerHTML = `
        <div>
            <div>
                <label>Question</label>
                <textarea class="question"></textarea>
            </div>
            <div>
                <button id="add-option">Add Option</button>
            </div>
            <div>
                <label>Correct Answer</label>
                <input type="number" class="answer" value="1" min="1">
            </div>
            <div class="options">
                <div class="option-container">
                    <label>Option 1</label>
                    <button class="delete-option" data-index="0">Delete</button>
                    <input type="text" class="option" value="">
                </div>
                <div class="option-container">
                    <label>Option 2</label>
                    <button class="delete-option" data-index="1">Delete</button>
                    <input type="text" class="option" value="">
                </div>
            </div>
            <button id="add-question">Add</button>
            <button id="close-view">Close</button>
        </div>`;

    // Event listener for adding options
    document.getElementById('add-option').addEventListener('click', function() {
        const optionsContainer = document.querySelector('.options');
        const optionCount = optionsContainer.querySelectorAll('.option-container').length;
        const newOptionHTML = `
            <div class="option-container">
                <label>Option ${optionCount + 1}</label>
                <input type="text" class="option">
                <button class="delete-option" data-index="${optionCount}">Delete</button>
            </div>`;
        optionsContainer.insertAdjacentHTML('beforeend', newOptionHTML);
        const answerInput = document.querySelector('.answer');
        answerInput.max = optionCount + 1;
    });

    // Event delegation for deleting options
    document.querySelector('.options').addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('delete-option')) {
            const $optionContainer = target.closest('.option-container');
            const op_count = viewModal.querySelectorAll('.option-container').length;
            if (op_count > 2) {
                $optionContainer.remove();

                const $options = viewModal.querySelectorAll('.option');
            // Update the answer input's max attribute
            const $answerInput = viewModal.querySelector('.answer');
            if ($answerInput.value > op_count-1) {
                $answerInput.value = 1;
            }
            $answerInput.max = op_count -1;

            // Update option labels and data-index attributes
            $options.forEach((option, i) => {
                const optionLabel = option.parentNode.querySelector('label');
                optionLabel.textContent = `Option ${i + 1}`;
            });
        } else {
            alert("At least two options are required.");
        }
        }
    });

    // Event listener for adding the question
    document.getElementById('add-question').addEventListener('click', function() {
        const questionData = getData(viewModal, "");
        var isEmpty = false;
        var isAnswerMoreOp = false;
        if(questionData === "Empty"){
            isEmpty = true;
        }else if(questionData === "answer more than option"){
            isAnswerMoreOp = true;
        }
        else{
            isEmpty = false;
        }
        if(!isAnswerMoreOp){
            if (!isEmpty) {
                fetch('/addQuestion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ questionData: questionData })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle successful update
                    console.log('Question added successfully:', data);
                    document.getElementById('viewModal').style.display = 'none';
                    fetchQuestionList(currentPage, searchQuery, quizId);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('Question content or options cannot be empty');
                
            }
        }
        else{
            alert('answer cannot be larger than option');
        }
        
    });
}
