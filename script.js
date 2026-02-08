/* ================= LOGIN ================= */

function studentLogin() {
  const name = document.getElementById("username").value;
  if (!name) {
    alert("Enter your name");
    return;
  }
  localStorage.setItem("currentUser", name);
  window.location.href = "quiz.html";
}

function adminLogin() {
  const password = prompt("Enter Admin Password");
  if (password === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Wrong admin password");
  }
}

/* ================= ADMIN ================= */

function addQuestion() {
  const q = document.getElementById("q").value;
  const o1 = document.getElementById("o1").value;
  const o2 = document.getElementById("o2").value;
  const o3 = document.getElementById("o3").value;
  const o4 = document.getElementById("o4").value;
  const c = document.getElementById("c").value;

  if (!q || !o1 || !o2 || !o3 || !o4 || !c) {
    alert("Fill all fields");
    return;
  }

  let questions = JSON.parse(localStorage.getItem("questions")) || [];

  questions.push({
    question: q,
    options: [o1, o2, o3, o4],
    correct: c
  });

  localStorage.setItem("questions", JSON.stringify(questions));
  document.getElementById("msg").innerText = "✅ Question Added";

  document.getElementById("q").value = "";
  document.getElementById("o1").value = "";
  document.getElementById("o2").value = "";
  document.getElementById("o3").value = "";
  document.getElementById("o4").value = "";
  document.getElementById("c").value = "";
}

/* ================= QUIZ ================= */

let questions = JSON.parse(localStorage.getItem("questions")) || [];
let index = 0;
let score = 0;

function loadQuestion() {
  if (questions.length === 0) {
    alert("No questions added by admin");
    return;
  }

  const q = questions[index];
  document.getElementById("question").innerText = q.question;

  let html = "";
  q.options.forEach((opt, i) => {
    html += `
      <label class="option">
        <input type="radio" name="opt" value="${i + 1}">
        ${opt}
      </label>
    `;
  });

  document.getElementById("options").innerHTML = html;
}

function nextQuestion() {
  const selected = document.querySelector('input[name="opt"]:checked');
  if (selected && selected.value == questions[index].correct) {
    score++;
  }

  index++;
  if (index < questions.length) {
    loadQuestion();
  } else {
    saveScore();
    window.location.href = "leaderboard.html";
  }
}

if (document.getElementById("question")) {
  loadQuestion();
}

/* ================= LEADERBOARD ================= */

function saveScore() {
  let board = JSON.parse(localStorage.getItem("board")) || [];
  board.push({
    name: localStorage.getItem("currentUser"),
    score: score
  });
  localStorage.setItem("board", JSON.stringify(board));
}

if (document.getElementById("board")) {
  let board = JSON.parse(localStorage.getItem("board")) || [];
  board.sort((a, b) => b.score - a.score);

  document.getElementById("board").innerHTML =
    board.map(b => `${b.name} - ${b.score}`).join("<br>");
}
