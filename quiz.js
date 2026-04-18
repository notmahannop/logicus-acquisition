// =============================================
//  LOGICUS ACQUISITION — Quiz Logic (funnel.html)
// =============================================

let currentStep = 1;
const totalSteps = 4;
const answers = {};

// Called when user clicks a quiz option card
function selectOption(el, stepId, value) {
  // Highlight the selected card
  const step = el.closest('.quiz-step');
  step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');

  // Store the answer
  answers[stepId] = value;

  if (currentStep < totalSteps) {
    // Auto-advance to next question after short pause
    setTimeout(() => goToStep(currentStep + 1), 380);
  } else {
    // Last question: unlock the submit button
    const btn = document.getElementById('submit-btn');
    btn.disabled = false;
  }
}

function goToStep(n) {
  document.querySelector('.quiz-step.active').classList.remove('active');
  document.querySelector(`.quiz-step[data-step="${n}"]`).classList.add('active');
  currentStep = n;
  updateUI();
}

function goBack() {
  if (currentStep <= 1) return;
  goToStep(currentStep - 1);
}

function updateUI() {
  // Progress bar
  const pct = (currentStep / totalSteps) * 100;
  document.querySelector('.quiz-progress-fill').style.width = pct + '%';
  document.querySelector('.quiz-progress-text').textContent =
    'Question ' + currentStep + ' of ' + totalSteps;

  // Back button visibility
  const backBtn = document.getElementById('back-btn');
  backBtn.dataset.hidden = currentStep <= 1 ? 'true' : 'false';

  // Right side of footer: hint on steps 1-3, submit button on step 4
  document.getElementById('quiz-hint').style.display   = currentStep < totalSteps ? 'block' : 'none';
  document.getElementById('submit-wrap').style.display = currentStep === totalSteps ? 'block' : 'none';

  // Re-disable submit if coming back to step 4 without re-selecting
  if (currentStep === totalSteps) {
    const btn = document.getElementById('submit-btn');
    btn.disabled = !answers['goal'];
  }
}

function submitQuiz() {
  // Determine segment from the kids-age answer (Question 1)
  const segment = answers['kids_age'] || '2';

  // Replace quiz card with loading state
  document.querySelector('.quiz-card').innerHTML = `
    <div class="quiz-loading">
      <div class="spinner"></div>
      <p>Matching you with the right guide&hellip;</p>
    </div>
  `;

  // Redirect after brief pause
  setTimeout(() => {
    window.location.href = 'confirmation.html?segment=' + segment;
  }, 1400);
}

// =============================================
//  Audit Form — index.html
// =============================================
(function () {
  const form = document.getElementById('auditForm');
  if (!form) return;

  const successBox = document.getElementById('auditSuccess');

  function validate() {
    let ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      el.classList.remove('field-error');
      const empty = el.tagName === 'SELECT'
        ? !el.value
        : !el.value.trim();
      if (empty) {
        el.classList.add('field-error');
        ok = false;
      }
    });
    // Basic email format check
    const emailEl = document.getElementById('auditEmail');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('field-error');
      ok = false;
    }
    return ok;
  }

  // Clear error state on input
  form.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('field-error'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    form.style.display = 'none';
    successBox.style.display = 'block';
  });
}());
