// TODO(you): Write the JavaScript necessary to complete the assignment.
const buttonStart = document.querySelector("#btn-start");
const buttonSubmit = document.querySelector("#btn-submit");
const buttonTryAgain = document.querySelector("#btn-try-again");
const screen1 = document.querySelector("#introduction");
const screen2 = document.querySelector("#attempt-quiz");
const screen3 = document.querySelector("#review-quiz");
const courseName = document.querySelector("#course-name");
const attempt = document.querySelector("#attempt");
const review = document.querySelector("#review");
const score = document.querySelector(".score");
const percentage = document.querySelector(".score-percent");
const advice = document.querySelector(".advice");

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function startQuiz() {
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");
  courseName.scrollIntoView();
  attempt.innerHTML = "";
  id = "";
  fetch("http://localhost:3000/attempts", {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      id = data._id;
      for (i = 0; i < data.questions.length; i++) {
        attempt.innerHTML += `
                    <div class="question">
                        <div class="question-index">
                            <h2>Question ${i + 1} of 10</h2>
                        </div>
                
                        <div class="question-text">
                            <p>${escapeHtml(data.questions[i].text)}</p>
                        </div>

                        ${data.questions[i].answers
                          .map(function (answer) {
                            const escapeAnswer = escapeHtml(answer);
                            return `
                              <div class="question-box">
                                <div class="option" id="${data.questions[i]._id}">
                                    <label class="options" >
                                        <input type="radio" name="${data.questions[i]._id}">
                                        ${escapeAnswer}
                                    </label>
                                </div>
                              </div>`;
                          })
                          .join("")}
                    </div>
              `;
      }
    });
}

function submitQuiz() {
  const submitConfirm = confirm("Are you sure you want to finish this quiz?");
  if (submitConfirm == true) {
    screen2.classList.add("hidden");
    screen3.classList.remove("hidden");
    courseName.scrollIntoView();
  }
}

function tryAgain() {
  screen3.classList.add("hidden");
  screen1.classList.remove("hidden");
  courseName.scrollIntoView();
}

buttonStart.addEventListener("click", startQuiz);
buttonSubmit.addEventListener("click", submitQuiz);
buttonTryAgain.addEventListener("click", tryAgain);
