document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var quizId = window.location.pathname.split('/').pop();
    getQuizName(quizId)
    getQuestion(quizId);


    document.getElementById('close-button').addEventListener("click", () => {
        location.href = '/student_subject_list';
        
    });
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
    fetch(`/api/getQuizQuestionAnswer?quizId=${quiz_id}`)
      .then(response => response.json())
      .then(data => {
        const questions = document.getElementById('quiz-questions');

        data.rows.forEach((question, index) => {
            const questionblock = document.createElement('div');
            questionblock.classList.add('questionBlock');

            const optionsArray = question.options.split('|');
            const optionsHTML = optionsArray.map((option, optionIndex) => {
                const isChecked = optionIndex + 1 == question.user_attempt; // Check if the option is the user's attempt
                const isCorrect = optionIndex + 1 == question.answer; // Check if the option is the correct answer

                let radioStyle = '';
                if (isChecked && isCorrect) {
                    radioStyle = 'background-color: #AFE1AF;'; // Style the radio button for the user's attempt
                } else if (isCorrect) {
                    radioStyle = 'background-color: #AFE1AF;'; // Style the radio button for the correct answer
                } else if (isChecked){
                    radioStyle = 'background-color: #FF5733;'
                }

                return `
                    <div class="radio" style="${radioStyle}">
                        <label>
                            <input type="radio" name="${question.question_id}" value="${optionIndex+1}" ${isChecked ? 'checked' : ''} disabled>
                            <span>${option}</span>
                        </label>
                    </div>`;
            }).join('');

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






