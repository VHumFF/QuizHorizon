document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var quizId = window.location.pathname.split('/').pop();
    getQuizName(quizId)
    getQuestion(quizId);


    
    document.getElementById('submit-button').addEventListener("click", () => {
        
        const questions = document.getElementById('quiz-questions');
        const answer = getData(questions)
        if (answer === "NOTCHECKED") {
            alert("Please answer all questions before submitting.");
        } else {
            fetch('/submitQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answer: answer })
              })
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }

                  return response.json();
              })
              .catch(error => {
                console.error('Error:', error);
              });
        }
        location.href = '/student_subject_list';
    });

    document.getElementById("exit-btn").onclick = function () {
        location.href = "/student_subject_list";
    };
});


function getQuizName(quiz_id) {
    fetch(`/api/getQuizName?quizId=${quiz_id}`)
      .then(response => response.json())
      .then(data => {
        const quizName = document.getElementById('quiz-title');
        const title = document.createElement('h1');
        title.innerHTML = `${data}`;
        quizName.appendChild(title);
    })
    .catch(error => console.error('Error:', error));
}

function getQuestion(quiz_id){
    fetch(`/api/getQuizQuestion?quizId=${quiz_id}`)
      .then(response => response.json())
      .then(data => {
        const questions = document.getElementById('quiz-questions');

        data.rows.forEach((question, index) => {
            const questionblock = document.createElement('div');
            questionblock.classList.add('questionBlock');

            const optionsArray = question.options.split('|');
            const optionsHTML = optionsArray.map((option, index) => `
            <div class="radio">
                <label>
                    <input type="radio" name="${question.question_id}" value=${index+1}>
                    <span>${option}</span>
                </label>
            </div>`).join('');
            questionblock.innerHTML = `
                <div>
                    <p>${index + 1}. ${question.question}</p>
                </div>
                <div class="options">
                    ${optionsHTML}
                </div>`;

            questions.appendChild(questionblock);
        });

    })
    .catch(error => console.error('Error:', error));
}


function getData(questions) {
    // Initialize an empty array to store the extracted data
    let data = {
        answers: [],
    };

    // Extract answer from each question
    const questionBlocks = questions.querySelectorAll('.questionBlock');
    let allQuestionsAnswered = true; // Initialize a variable to track if all questions are answered
    questionBlocks.forEach((questionBlock) => {
        // Find the selected radio button within each question block
        const selectedRadioButton = questionBlock.querySelector('input[type="radio"]:checked');
        
        // If a radio button is selected, add its value to the answers array
        if (selectedRadioButton) {
            data.answers.push({
                questionID: selectedRadioButton.name, // Index of the question block
                answer: selectedRadioButton.value // Value of the selected radio button
            });
        } else {
            // If no radio button is checked for a question block, set allQuestionsAnswered to false
            allQuestionsAnswered = false;
        }
    });

    // If any question block doesn't have a checked radio button, return false
    if (!allQuestionsAnswered) {
        return "NOTCHECKED";
    }

    return data;
}

//const answerForQuestion1 = answer.answers[0].questionID;

