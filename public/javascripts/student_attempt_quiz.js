document.addEventListener('DOMContentLoaded', function() {
    // Extract subject ID from the URL
    var quizId = window.location.pathname.split('/').pop();
    getQuestion(quizId);


    

});



function getQuestion(quiz_id){
    fetch(`/api/getQuizQuestion?quizId=${quiz_id}`)
      .then(response => response.json())
      .then(data => {
        const questions = document.getElementById('quiz-questions');

        data.rows.forEach((question) => {
            const questionblock = document.createElement('div');

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
                    <p>${question.question}</p>
                </div>
                <div class="options">
                    ${optionsHTML}
                </div>`;

            questions.appendChild(questionblock);
        });

    })
    .catch(error => console.error('Error:', error));
}
