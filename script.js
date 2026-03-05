/**
 * ADHD Quiz Logic - Neo-Minimalist 2026 Edition
 * Simulates a psychometric evaluation with clinical weighting and a 
 * simulated conversion paywall.
 */

// --- 1. QUIZ DATA (Psychometric structure based on DSM-5-TR themes) ---
const questions = [
    // Inattention Axis (9 questions)
    {
        id: 1,
        axis: 'Desatenção',
        text: 'Com que frequência você comete erros por falta de atenção a detalhes em seu trabalho ou atividades diárias?',
        weight: 1
    },
    {
        id: 2,
        axis: 'Desatenção',
        text: 'Qual a sua dificuldade em manter o foco em tarefas prolongadas, como ler um texto longo ou preencher formulários?',
        weight: 1
    },
    {
        id: 3,
        axis: 'Desatenção',
        text: 'Com que frequência parece que você não está ouvindo quando alguém fala diretamente com você?',
        weight: 1
    },
    {
        id: 4,
        axis: 'Desatenção',
        text: 'Com que frequência você tem dificuldade em seguir instruções até o fim e acaba não terminando tarefas (sem ser por rebeldia)?',
        weight: 1
    },
    {
        id: 5,
        axis: 'Desatenção',
        text: 'Qual a sua dificuldade em organizar tarefas e atividades que exigem sequência ou gerenciamento de tempo?',
        weight: 1
    },
    {
        id: 6,
        axis: 'Desatenção',
        text: 'Com que frequência você evita ou reluta em se envolver em tarefas que exigem esforço mental sustentado?',
        weight: 1
    },
    {
        id: 7,
        axis: 'Desatenção',
        text: 'Com que frequência você perde coisas necessárias para suas tarefas e atividades (ex: chaves, carteira, celular, documentos)?',
        weight: 1
    },
    {
        id: 8,
        axis: 'Desatenção',
        text: 'Com que facilidade você se distrai com estímulos externos (barulhos, movimento) ou pensamentos não relacionados ao que está fazendo?',
        weight: 1
    },
    {
        id: 9,
        axis: 'Desatenção',
        text: 'Com que frequência você esquece de compromissos ou de realizar atividades cotidianas (ex: pagar contas, retornar ligações)?',
        weight: 1
    },
    // Hyperactivity/Impulsivity Axis (6 questions)
    {
        id: 10,
        axis: 'Hiperatividade',
        text: 'Com que frequência você balança as mãos ou os pés ou se remexe na cadeira enquanto está sentado?',
        weight: 1
    },
    {
        id: 11,
        axis: 'Hiperatividade',
        text: 'Com que frequência você tem dificuldade de permanecer sentado em situações em que se espera que você fique (ex: reuniões, aulas)?',
        weight: 1
    },
    {
        id: 12,
        axis: 'Hiperatividade',
        text: 'Com que frequência você tem a sensação constante de estar "a mil por hora" ou sente agitação interna?',
        weight: 1
    },
    {
        id: 13,
        axis: 'Hiperatividade',
        text: 'Com que frequência você tem dificuldade em se envolver silenciosamente em atividades de lazer?',
        weight: 1
    },
    {
        id: 14,
        axis: 'Hiperatividade',
        text: 'Com que frequência você fala excessivamente ou "atropela" as palavras e falas de outras pessoas?',
        weight: 1
    },
    {
        id: 15,
        axis: 'Hiperatividade',
        text: 'Com que frequência você responde perguntas antes que elas sejam concluídas ou tem dificuldade em aguardar sua vez?',
        weight: 1
    }
];

const likertOptions = [
    { value: 0, label: 'Nunca' },
    { value: 1, label: 'Raramente' },
    { value: 2, label: 'Às vezes' },
    { value: 3, label: 'Frequentemente' },
    { value: 4, label: 'Muito frequentemente' }
];


// --- 2. STATE MANAGEMENT ---
const state = {
    currentQuestionIndex: 0,
    answers: new Array(questions.length).fill(null),
    scores: {
        inattention: 0,
        hyperactivity: 0,
        total: 0
    }
};


// --- 3. DOM ELEMENTS ---
const screens = {
    hero: document.getElementById('hero-section'),
    quiz: document.getElementById('quiz-section'),
    loading: document.getElementById('loading-section'),
    paywall: document.getElementById('paywall-section'),
    result: document.getElementById('result-section')
};

// Quiz Elements
const DOM = {
    startBtn: document.getElementById('start-btn'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressBar: document.getElementById('progress-bar'),
    questionCounter: document.getElementById('question-counter'),
    axisIndicator: document.getElementById('axis-indicator'),
    prevBtn: document.getElementById('prev-btn'),

    // Paywall Elements
    pixTimer: document.getElementById('pix-timer'),
    simulatePaymentBtn: document.getElementById('simulate-payment-btn'),

    // Result Elements
    scoreInattention: document.getElementById('score-inattention'),
    barInattention: document.getElementById('bar-inattention'),
    scoreHyperactivity: document.getElementById('score-hyperactivity'),
    barHyperactivity: document.getElementById('bar-hyperactivity'),
    resultLevel: document.getElementById('result-level'),
    resultExplanation: document.getElementById('result-explanation'),
    resultRecommendations: document.getElementById('result-recommendations'),
    restartBtn: document.getElementById('restart-btn')
};


// --- 4. NAVIGATION LOGIC ---
function switchScreen(screenKey) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    screens[screenKey].classList.remove('hidden');
    // small delay for transition effect
    setTimeout(() => {
        screens[screenKey].classList.add('active');
    }, 10);
}

function startQuiz() {
    state.currentQuestionIndex = 0;
    state.answers.fill(null);
    DOM.prevBtn.classList.add('hidden');
    renderQuestion();
    switchScreen('quiz');
}


// --- 5. QUIZ LOGIC ---
function renderQuestion() {
    const qIndex = state.currentQuestionIndex;
    const qData = questions[qIndex];

    // Update Header
    DOM.questionCounter.textContent = `Pergunta ${qIndex + 1} de ${questions.length}`;
    DOM.axisIndicator.textContent = `Eixo: ${qData.axis}`;
    DOM.questionText.textContent = qData.text;

    // Update Progress Bar
    const progress = ((qIndex) / questions.length) * 100;
    DOM.progressBar.style.width = `${progress}%`;

    // Render Options
    DOM.optionsContainer.innerHTML = '';

    likertOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        if (state.answers[qIndex] === opt.value) {
            btn.classList.add('selected');
        }

        btn.innerHTML = `
            <span style="flex:1;">${opt.label}</span>
            <div style="width:16px; height:16px; border-radius:50%; border:1px solid ${state.answers[qIndex] === opt.value ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'}; background:${state.answers[qIndex] === opt.value ? 'var(--accent-primary)' : 'transparent'}; transition:all 0.2s;"></div>
        `;

        btn.onclick = () => handleAnswer(opt.value);
        DOM.optionsContainer.appendChild(btn);
    });

    // Handle Back Button
    if (qIndex > 0) {
        DOM.prevBtn.classList.remove('hidden');
    } else {
        DOM.prevBtn.classList.add('hidden');
    }
}

function handleAnswer(value) {
    state.answers[state.currentQuestionIndex] = value;

    // Add visual feedback to clicked button before advancing
    renderQuestion();

    setTimeout(() => {
        if (state.currentQuestionIndex < questions.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 400); // Tiny pause to see the click
}

function handlePrev() {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
}

function finishQuiz() {
    // Force progress bar to 100%
    DOM.progressBar.style.width = '100%';

    calculateScores();
    switchScreen('loading');

    // Fake loading steps
    const loadingTitle = document.getElementById('loading-title');
    const loadingStep = document.getElementById('loading-step');

    setTimeout(() => {
        loadingStep.textContent = "Cruzando eixos neurodivergentes de Desatenção e Hiperatividade...";
    }, 1500);

    setTimeout(() => {
        loadingStep.textContent = "Gerando Laudo Personalizado e Plano de Estratégia...";
    }, 3000);

    setTimeout(() => {
        switchScreen('paywall');
        startPixTimer();
    }, 4500);
}


// --- 6. SCORING & RESULTS LOGIC ---
function calculateScores() {
    let inattention = 0;
    let hyperactivity = 0;

    questions.forEach((q, index) => {
        const val = state.answers[index] || 0;
        if (q.axis === 'Desatenção') {
            inattention += val;
        } else {
            hyperactivity += val;
        }
    });

    state.scores.inattention = inattention;
    state.scores.hyperactivity = hyperactivity;
    state.scores.total = inattention + hyperactivity;
}

function generateResultContent() {
    const { inattention, hyperactivity, total } = state.scores;
    const maxScore = questions.length * 4; // 60

    // Thresholds (Simplified for simulation purposes)
    let level = '';
    let explanation = '';
    let recommendations = [];

    // Note: Scientific thresholds are complex, this is a mock rule for UX demonstration
    const pct = total / maxScore;

    if (pct < 0.33) {
        level = 'Nível Baixo (Padrão)';
        explanation = 'Sua pontuação indica que você relata poucos comportamentos associados ao TDAH. As dificuldades de atenção ou agitação que você vivencia parecem estar dentro da média populacional, possivelmente ligadas a cansaço pontual ou estresse rotineiro.';
        recommendations = [
            'Mantenha uma rotina de sono e alimentação saudáveis.',
            'Utilize técnicas simples de produtividade (como Pomodoro) se precisar de foco extra.',
            'Procure relaxar em momentos de sobrecarga mental.'
        ];
    } else if (pct < 0.66) {
        level = 'Atenção Moderada';
        explanation = 'Sua pontuação sugere uma presença moderada de traços relacionados à desatenção ou hiperatividade/impulsividade. Esses padrões podem estar gerando alguns atritos na sua organização pessoal, trabalho ou estudos.';
        recommendations = [
            'Considere adotar sistemas estruturados de organização (agendas, alarmes, listas visuais).',
            'Se esses sintomas causam sofrimento ou impacto real na sua vida, uma avaliação profissional pode esclarecer dúvidas.',
            'Evite multitarefas e foque em um objetivo por vez.'
        ];
    } else {
        level = 'Alto Indicativo Clínico';
        explanation = 'Os resultados apontam para uma alta frequência de comportamentos e sintomas fortemente associados ao TDAH. É altamente provável que essas características estejam causando impacto significativo na sua vida pessoal, acadêmica ou profissional.';
        recommendations = [
            '**Recomendação prioritária:** Procure um psiquiatra, neurologista ou neuropsicólogo para uma avaliação clínica formal.',
            'Não inicie tratamentos baseados apenas em testes online. O diagnóstico médico é essencial.',
            'Busque entender mais sobre o funcionamento neurodivergente por fontes científicas confiáveis enquanto aguarda a consulta.'
        ];
    }

    // Bind to DOM
    DOM.scoreInattention.textContent = inattention;
    DOM.scoreHyperactivity.textContent = hyperactivity;

    // Set widths based on max possible per axis (Inattention: 9 Qs -> 36 max, Hyper: 6 Qs -> 24 max)
    const inattentionMax = 36;
    const hyperMax = 24;

    DOM.barInattention.style.width = `${(inattention / inattentionMax) * 100}%`;
    DOM.barHyperactivity.style.width = `${(hyperactivity / hyperMax) * 100}%`;

    DOM.resultLevel.textContent = level;
    DOM.resultExplanation.textContent = explanation;

    DOM.resultRecommendations.innerHTML = recommendations.map((rec, index) => {
        // Simple markdown-to-html for bolding
        const formatted = rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `
            <div class="strategy-card">
                <strong>Passo ${index + 1}</strong>
                <p>${formatted}</p>
            </div>
        `;
    }).join('');
}


// --- 7. PAYWALL MOCK LOGIC ---
let timerInterval;

function startPixTimer() {
    let timeLeft = 5 * 60; // 5 minutes

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        DOM.pixTimer.textContent = `Expira em: ${m}:${s}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            DOM.pixTimer.textContent = "QR Code Expirado";
        }
        timeLeft--;
    }, 1000);
}

function simulatePayment() {
    const btn = DOM.simulatePaymentBtn;
    const originalText = btn.innerHTML;

    // Disable and show loading
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.innerHTML = 'Pagamento Confirmado! ✓';
        btn.style.backgroundColor = 'var(--accent-hover)';

        clearInterval(timerInterval);

        setTimeout(() => {
            generateResultContent();
            switchScreen('result');
            // reset button for future
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1500);

    }, 2000); // Fake 2 seconds processing
}


// --- 8. PRELOADER & INIT ---
function hidePreloader() {
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        // Wait 2.5 seconds to easily show the "brain" effect
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600); // Wait for CSS transition
        }, 2500);
    }
}

function init() {
    hidePreloader();
    DOM.startBtn.addEventListener('click', startQuiz);
    DOM.prevBtn.addEventListener('click', handlePrev);
    DOM.simulatePaymentBtn.addEventListener('click', simulatePayment);
    DOM.restartBtn.addEventListener('click', () => switchScreen('hero'));
}

// Boot application
init();
