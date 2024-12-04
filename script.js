let questions = [];

function submitQuestion() {
    const subject = document.getElementById('subject').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!subject || !title || !content) {
        Swal.fire({
            icon: 'warning',
            title: '입력 확인',
            text: '모든 필드를 입력해주세요!',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    const question = {
        id: Date.now(),
        subject: subject,
        title: title,
        content: content,
        answers: [],
        timestamp: new Date().toLocaleString()
    };

    questions.unshift(question);
    saveQuestions();
    renderQuestions();
    clearForm();

    Swal.fire({
        icon: 'success',
        title: '등록 완료!',
        text: '질문이 성공적으로 등록되었습니다.',
        showConfirmButton: false,
        timer: 1500
    });
}

function submitAnswer(questionId) {
    const answerInput = document.getElementById(`answer-${questionId}`);
    const answerText = answerInput.value;

    if (!answerText) {
        Swal.fire({
            icon: 'warning',
            title: '입력 확인',
            text: '답변을 입력해주세요!',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
        questions[questionIndex].answers.push({
            content: answerText,
            timestamp: new Date().toLocaleString()
        });
        saveQuestions();
        renderQuestions();
        answerInput.value = '';

        Swal.fire({
            icon: 'success',
            title: '답변 완료!',
            text: '답변이 등록되었습니다.',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = questions.map(question => `
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-primary">${question.subject}</span>
                    <small class="text-muted">${question.timestamp}</small>
                </div>
                <h5 class="card-title">${question.title}</h5>
                <p class="card-text">${question.content}</p>
                
                <div class="answers">
                    <h6 class="text-muted mb-3">
                        <i class="bi bi-chat-dots me-2"></i>답변 ${question.answers.length}개
                    </h6>
                    ${question.answers.map(answer => `
                        <div class="answer">
                            <p class="mb-1">${answer.content}</p>
                            <small class="text-muted">${answer.timestamp}</small>
                        </div>
                    `).join('')}
                    
                    <div class="answer-form mt-3">
                        <textarea id="answer-${question.id}" 
                            class="form-control mb-2" 
                            placeholder="답변을 입력하세요"
                            rows="3"></textarea>
                        <button onclick="submitAnswer(${question.id})" 
                            class="btn btn-primary">
                            <i class="bi bi-reply-fill me-1"></i>답변
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function clearForm() {
    document.getElementById('subject').value = '';
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
}

function saveQuestions() {
    localStorage.setItem('questions', JSON.stringify(questions));
}

function loadQuestions() {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
        renderQuestions();
    }
}

function deleteQuestion(questionId) {
    Swal.fire({
        title: '정말 삭제하시겠습니까?',
        text: "삭제된 질문은 복구할 수 없습니다.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            questions = questions.filter(q => q.id !== questionId);
            saveQuestions();
            renderQuestions();
            
            Swal.fire({
                icon: 'success',
                title: '삭제 완료!',
                text: '질문이 삭제되었습니다.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

window.onload = loadQuestions;
