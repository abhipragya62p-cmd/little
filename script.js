const scenes = ["intro", "envelope", "letter", "puzzle", "reveal", "dateTimeScene"];
const progress = document.getElementById("progress");

function showScene(id) {
  document.querySelectorAll(".scene").forEach(scene => scene.classList.remove("active"));
  const target = document.getElementById(id);
  target.classList.add("active");
  const index = scenes.indexOf(id);
  progress.style.width = `${((index + 1) / scenes.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("beginBtn").addEventListener("click", () => showScene("envelope"));

const envelopeBtn = document.getElementById("envelopeBtn");
let envelopeOpened = false;
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelopeBtn.classList.add("opened");
  document.getElementById("envelopeInstruction").textContent = "THE LETTER IS YOURS";
  setTimeout(() => showScene("letter"), 1050);
}
envelopeBtn.addEventListener("click", openEnvelope);
document.getElementById("skipEnvelope").addEventListener("click", () => showScene("letter"));

document.getElementById("toPuzzle").addEventListener("click", () => showScene("puzzle"));

const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
function checkAnswer() {
  const raw = answerInput.value.trim();
  if (!raw) {
    feedback.textContent = "Enter a value first. Take your time.";
    feedback.style.color = "#d8ad7d";
    answerInput.focus();
    return;
  }
  if (Math.abs(Number(raw) - 58) < 0.000001) {
    feedback.textContent = "Exactly right. Some mysteries have beautiful answers. ♡";
    feedback.style.color = "#b9d5b9";
    document.getElementById("submitAnswer").disabled = true;
    setTimeout(() => showScene("reveal"), 1400);
  } else {
    feedback.textContent = "Not quite. Try spotting the product rule hiding in the expression.";
    feedback.style.color = "#d6a0a5";
    answerInput.select();
  }
}
document.getElementById("submitAnswer").addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", event => {
  if (event.key === "Enter") checkAnswer();
});

const hintBtn = document.getElementById("hintBtn");
const hintText = document.getElementById("hintText");
hintBtn.addEventListener("click", () => {
  const willShow = hintText.hidden;
  hintText.hidden = !willShow;
  hintBtn.innerHTML = willShow ? 'HIDE HINT <span>−</span>' : 'NEED A HINT? <span>＋</span>';
});

// The final answer is one-time per browser. Both choices are equally valid.
const decisionKey = "the58thReasonDecision";
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const responseFeedback = document.getElementById("responseFeedback");
const yesResult = document.getElementById("yesResult");
const noResult = document.getElementById("noResult");

function lockDecision(choice, isRestoring = false) {
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.classList.toggle("chosen", choice === "yes");
  noBtn.classList.toggle("chosen", choice === "no");
  yesResult.hidden = choice !== "yes";
  noResult.hidden = choice !== "no";
  document.getElementById("decisionBox").classList.toggle("answered-yes", choice === "yes");
  responseFeedback.textContent = isRestoring
    ? "Your answer has already been recorded on this browser."
    : "Your answer is locked. Thank you for being honest.";
  if (!isRestoring) {
    try { localStorage.setItem(decisionKey, choice); }
    catch (error) {
      responseFeedback.textContent = "Your answer is locked for this visit. Thank you for being honest.";
    }
  }
}

yesBtn.addEventListener("click", () => lockDecision("yes"));
noBtn.addEventListener("click", () => lockDecision("no"));

try {
  const savedDecision = localStorage.getItem(decisionKey);
  if (savedDecision === "yes" || savedDecision === "no") {
    lockDecision(savedDecision, true);
  }
} catch (error) {
  // If browser storage is unavailable, the choice still locks for this visit.
}


const toDateTimeBtn = document.getElementById("toDateTimeBtn");
if (toDateTimeBtn) toDateTimeBtn.addEventListener("click", () => showScene("dateTimeScene"));
const meetDate = document.getElementById("meetDate");
const meetForm = document.getElementById("meetForm");
const meetFeedback = document.getElementById("meetFeedback");
if (meetDate) {
  const now = new Date();
  meetDate.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
meetForm.addEventListener("submit", event => {
  event.preventDefault();
  const date = meetDate.value;
  const time = document.getElementById("meetTime").value;
  meetFeedback.textContent = date && time
    ? `Your preference: ${date} at ${time}. This stays on this page only.`
    : "Please choose both a date and a time, if you'd like to.";
});
document.getElementById("backToReveal").addEventListener("click", () => showScene("reveal"));

document.getElementById("restartBtn").addEventListener("click", () => {
  envelopeOpened = false;
  envelopeBtn.classList.remove("opened");
  document.getElementById("envelopeInstruction").innerHTML = '<span class="pulse-dot"></span> TAP THE SEAL TO OPEN';
  answerInput.value = "";
  feedback.textContent = "A hint is available if the mystery gets stubborn.";
  feedback.style.color = "";
  document.getElementById("submitAnswer").disabled = false;
  hintText.hidden = true;
  hintBtn.innerHTML = 'NEED A HINT? <span>＋</span>';
  document.getElementById("responseFeedback").textContent = "";
  showScene("intro");
});

// Subtle ambient star field; no external audio or tracking.
const ambient = document.getElementById("ambient");
for (let i = 0; i < 42; i++) {
  const star = document.createElement("span");
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--duration", `${12 + Math.random() * 22}s`);
  star.style.setProperty("--delay", `${-Math.random() * 28}s`);
  star.style.setProperty("--drift", `${Math.random() * 100 - 50}px`);
  star.style.setProperty("--opacity", `${0.12 + Math.random() * 0.4}`);
  ambient.appendChild(star);
}
progress.style.width = `${100 / scenes.length}%`;
