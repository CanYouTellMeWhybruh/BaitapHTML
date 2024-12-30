let problems = [];
function doSomething() {
    let mark, range;
    const selectedOperation = document.querySelector('input[name="operation"]:checked');
    if (!selectedOperation) {
        alert('Vui lòng chọn một phép toán');
        return;
    }
    mark = selectedOperation.value;

    const selectedRange = document.querySelector('input[name="check2"]:checked');
    if (!selectedRange) {
        alert('Vui lòng chọn phạm vi tính toán');
        return;
    }
    range = Number(selectedRange.value);

    document.body.innerHTML = `
<header>
    <div class="header-text">
        <p>Select a problem below and then select an answer.</p>
        <p>When you are finished, select "Done" to see your score.</p>
    </div>
    <button class="done-button" style="display: none;">Done</button>
</header>
<main>
    <div class="content"></div>
</main>
`;
    const content = document.querySelector('.content');
    const doneButton = document.querySelector('.done-button');

    for (let i = 0; i < 16; i++) {
        let number1 = Math.floor(Math.random() * range) + 1;
        let number2 = Math.floor(Math.random() * range) + 1;

        if (mark === '-') {
            while (number1 < number2) {
                number1 = Math.floor(Math.random() * range) + 1;
            }
        } else if (mark === '÷') {
            while (number2 === 0) {
                number2 = Math.floor(Math.random() * range) + 1;
            }
            number1 = number2 * (Math.floor(Math.random() * range) + 1);
        }

        const answer = calculateAnswer(mark, number1, number2);
        problems.push({ number1, number2, mark, answer });
    }

    problems.forEach((problem, index) => {
        createProblem(index, problem, content, doneButton, problems);
    });
}

function calculateAnswer(mark, number1, number2) {
    switch (mark) {
        case '+': return number1 + number2;
        case '-': return number1 - number2;
        case '×': return number1 * number2;
        case '÷': return number1 / number2;
        default: return null;
    }
}

function createProblem(index, problem, content, doneButton, problems) {
    const optionArray = generateOptions(problem.answer);
    const problemDiv = document.createElement('div');
    problemDiv.classList.add('content-math');
    problemDiv.dataset.index = index;

    problemDiv.innerHTML = `
        <div class="operation-math">
            <div class="mark"><p>${problem.mark}</p></div>
            <div class="number">
                <div class="number1"><p>${problem.number1}</p></div>
                <div class="number2"><p>${problem.number2}</p></div>
            </div>
        </div>`;

    problemDiv.addEventListener('click', function () {
        if (problemDiv.classList.contains('active') || problemDiv.dataset.answered === 'true') return;

        document.querySelectorAll('.content-math.active').forEach(contentMath => {
            contentMath.classList.remove('active');
            const options = contentMath.querySelector('.options');
            if (options) options.remove();
        });

        problemDiv.classList.add('active');

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        optionArray.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => {
                problemDiv.dataset.answered = 'true';
                problemDiv.dataset.selectedAnswer = option;
                problemDiv.classList.remove('active');
                optionsDiv.remove();

                const selectedAnswerDiv = document.createElement('div');
                selectedAnswerDiv.classList.add('selected-answer');
                selectedAnswerDiv.textContent = `${option}`;
                problemDiv.appendChild(selectedAnswerDiv);

                problemDiv.style.pointerEvents = 'none';

                if (document.querySelectorAll('.content-math[data-answered="true"]').length === problems.length) {
                    doneButton.style.display = 'block';
                }
            });
            optionsDiv.appendChild(button);
        });

        problemDiv.appendChild(optionsDiv);
    });

    content.appendChild(problemDiv);
}

function generateOptions(correctAnswer) {
    const options = new Set([]);
    const randomIndex = Math.floor(Math.random() * 4);
    let i = 0;
    while (options.size < 4) {
        if(i === randomIndex) {
            options.add(correctAnswer);
        }else{
        const randomAnswer = correctAnswer + Math.floor(Math.random() * 10);
        if (randomAnswer !== correctAnswer) {
            options.add(randomAnswer);
        }
    }
    i++;
    }
    return Array.from(options);
}

document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('done-button')) {
        let problemDivs = document.querySelectorAll('.content-math');
        let correctCount = 0;

        problemDivs.forEach((problemDiv) => {
            const index = parseInt(problemDiv.dataset.index, 10);
            const selectedAnswer = parseInt(problemDiv.dataset.selectedAnswer, 10);

            if (isNaN(index) || isNaN(selectedAnswer)) {
                console.error('Invalid index or selected answer:', {
                    index,
                    selectedAnswer,
                });
                return;
            }

            const correctAnswer = problems[index].answer;
            if (selectedAnswer === correctAnswer) {
                problemDiv.classList.add('correct');
                correctCount++;
            } else {
                problemDiv.classList.add('incorrect');
            }
        });

        const headerText = document.querySelector('.header-text');
        headerText.textContent = `You got ${correctCount} out of ${problems.length} correct.`;
        event.target.textContent = 'New';
        event.target.addEventListener('click', renderMenu);
    }
});


function renderMenu() {
    problems = [];
    document.body.innerHTML = `
    <div class="container">
        <h1 id="title">MATH TEST</h1>
        <div class="operation">
            <ul>
                ${createRadioButton('operation', 'Addition', '+', 'Addition')}
                ${createRadioButton('operation', 'Subtraction', '-', 'Subtraction')}
                ${createRadioButton('operation', 'Multiplication', '×', 'Multiplication')}
                ${createRadioButton('operation', 'Division', '÷', 'Division')}
            </ul>
        </div>
        <div class="scope">
            <ul>
                ${createRadioButton('check2', '1-9', '9', '1 to 9')}
                ${createRadioButton('check2', '1-19', '19', '1 to 19')}
                ${createRadioButton('check2', '1-29', '29', '1 to 29')}
                ${createRadioButton('check2', '1-39', '39', '1 to 39')}
                ${createRadioButton('check2', '1-49', '49', '1 to 49')}
                ${createRadioButton('check2', '1-99', '99', '1 to 99')}
            </ul>
            <button id="start-button" onclick="doSomething();">Start</button>
        </div>
    </div>`;
}

function createRadioButton(name, id, value, label) {
    return `
    <li>
        <div class="border-radio">
            <input type="radio" name="${name}" id="${id}" value="${value}">
        </div> ${label}
    </li>`;
}
