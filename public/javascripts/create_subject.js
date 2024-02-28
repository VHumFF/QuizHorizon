document.addEventListener('DOMContentLoaded', () => {
  fetchUserDetails();

  var submitButton = document.getElementById('createBtn');

  submitButton.addEventListener("click", function(event) {
      event.preventDefault();

      var subNameInput = document.querySelector('.form_item input[name="subjectname"]');
      var subName = subNameInput.value;

      var selectElement = document.getElementById("selectInstructor");
      var selectedValue = selectElement.value;

      fetch('/validateSubjectName', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subName: subName })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(subNameValid  => {
          if(subNameValid) {
            fetch('/createSubject', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ subName: subName,  selectedValue:selectedValue})
            })
            .then(response => {
              if (response.ok) {
                  document.getElementById('subjectError').style.display = 'none';
                  console.log('Subject created successfully');
                  document.getElementById('subjectForm').submit();
              } else {
                  console.error('Failed to create subject');
                  throw new Error('Failed to create subject');
              }
            })
            .catch(error => {
                console.error('Error:', error);
            })

          }
          else {
            document.getElementById('subjectError').style.display = 'block';
          }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});


//fetch the user details
function fetchUserDetails() {
  fetch(`/api/instructorList`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectInstructor');

      data.instructorList.forEach(instructor => {
        const optionElement = document.createElement('option');
        optionElement.value = instructor.user_id;
        optionElement.textContent = instructor.full_name;
        select.appendChild(optionElement);

      });
    })
    .catch(error => console.error('Error:', error));
}