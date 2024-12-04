// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyCOY90A-K6AoBw74wM7kOQPQj2kxbCHamg",
    authDomain: "qna2-e669d.firebaseapp.com",
    projectId: "qna2-e669d",
    storageBucket: "qna2-e669d.firebasestorage.app",
    messagingSenderId: "1601174509",
    appId: "1:1601174509:web:379071f86f39bcdbf685e4",
    measurementId: "G-M6RSMLYF4C"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 질문 제출
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
        subject: subject,
        title: title,
        content: content,
        answers: [],
        timestamp: new Date().toLocaleString(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("questions").add(question)
        .then(() => {
            clearForm();
            Swal.fire({
                icon: 'success',
                title: '등록 완료!',
                text: '질문이 성공적으로 등록되었습니다.',
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            Swal.fire({
                icon: 'error',
                title: '오류 발생',
                text: '질문 등록 중 오류가 발생했습니다.'
            });
        });
}

// 답변 제출
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

    const answer = {
        content: answerText,
        timestamp: new Date().toLocaleString(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("questions").doc(questionId).update({
        answers: firebase.firestore.FieldValue.arrayUnion(answer)
    }).then(() => {
        answerInput.value = '';
        Swal.fire({
            icon: 'success',
            title: '답변 완료!',
            text: '답변이 등록되었습니다.',
            showConfirmButton: false,
            timer: 1500
        });
    }).catch((error) => {
        console.error("Error updating document: ", error);
        Swal.fire({
            icon: 'error',
            title: '오류 발생',
            text: '답변 등록 중 오류가 발생했습니다.'
        });
    });
}

// 질문 목록 렌더링
function renderQuestions() {
    db.collection("questions")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
            const questionsList = document.getElementById('questionsList');
            questionsList.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const question = doc.data();
                questionsList.innerHTML += `
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
                                    <textarea id="answer-${doc.id}" 
                                        class="form-control mb-2" 
                                        placeholder="답변을 입력하세요"
                                        rows="3"></textarea>
                                    <button onclick="submitAnswer('${doc.id}')" 
                                        class="btn btn-primary">
                                        <i class="bi bi-reply-fill me-1"></i>답변
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
}

// 폼 초기화
function clearForm() {
    document.getElementById('subject').value = '';
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
}

// 페이지 로드 시 실행
window.onload = () => {
    renderQuestions();
};


