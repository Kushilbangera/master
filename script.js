/* ---------- LOGIN ---------- */
function studentLogin() {
  let name = document.getElementById("username").value;
  if (!name) return alert("Enter name");
  localStorage.setItem("user", name);
  window.location = "quiz.html";
}

function adminLogin() {
  let pass = prompt("Admin password:");
  if (pass === "admin123") window.location = "admin.html";
  else alert("Wrong password");
}

/* ---------- QUESTIONS ---------- */
let questions = JSON.parse(localStorage.getItem("questions")) || [];

function addQuestion() {
  let q = document.getElementById("q").value;
  let o1 = document.getElementById("o1").value;
  let o2 = document.getElementById("o2").value;
  let o3 = document.getElementById("o3").value;
  let o4 = document.getElementById("o4").value;
  let c = document.getElementById("c").value;

  questions.push({ q, options:[o1,o2,o3,o4], correct:c });
  localStorage.setItem("questions", JSON.stringify(questions));
  alert("Question added");
}

/* ---------- QUIZ ---------- */
let index = 0;
let score = 0;
let time = 10;
let timer;

function loadQuestion() {
  let q = questions[index];
  document.getElementById("question").innerText = q.q;

  let html = "";
  q.options.forEach((opt,i)=>{
    html += `<div class="option">
      <input type="radio" name="opt" value="${i+1}"> ${opt}
    </div>`;
  });

  document.getElementById("options").innerHTML = html;
  startTimer();
}

if (document.getElementById("question")) {
  questions.sort(()=>Math.random()-0.5);
  loadQuestion();
}

function startTimer() {
  clearInterval(timer);
  time = 10;
  timer = setInterval(()=>{
    time--;
    document.getElementById("timer").innerText = "⏱ " + time;
    document.getElementById("bar").style.width = time*10 + "%";
    if(time===0) nextQuestion();
  },1000);
}

function nextQuestion() {
  clearInterval(timer);
  let selected = document.querySelector('input[name="opt"]:checked');
  if (selected && selected.value == questions[index].correct) score++;

  index++;
  if (index < questions.length) loadQuestion();
  else {
    localStorage.setItem("score", score);
    saveScore();
    window.location = "result.html";
  }
}

/* ---------- SCORE ---------- */
function saveScore() {
  let board = JSON.parse(localStorage.getItem("board")) || [];
  board.push({ name: localStorage.getItem("user"), score });
  localStorage.setItem("board", JSON.stringify(board));
}

/* ---------- RESULT ---------- */
if (document.getElementById("score")) {
  let s = localStorage.getItem("score");
  document.getElementById("score").innerText = "Score: " + s;

  let reward = "🎯 Try Again";
  if (s >= 8) reward = "🏆 Champion";
  else if (s >= 5) reward = "🥈 Pro Learner";

  document.getElementById("reward").innerText = reward;
}

/* ---------- LEADERBOARD ---------- */
if (document.getElementById("board")) {
  let board = JSON.parse(localStorage.getItem("board")) || [];
  board.sort((a,b)=>b.score-a.score);
  document.getElementById("board").innerHTML =
    board.map(b=>`${b.name} - ${b.score}`).join("<br>");
}
