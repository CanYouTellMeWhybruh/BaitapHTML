
let problems = [];
let operationRadios,scopeRadios;
function doSomething() {
    let mark, range;
    const selectedOperation = document.querySelector('input[name="operation"]:checked');
    if (!selectedOperation) {
        alert('Vui lòng chọn một phép toán');
        return;
    }
    operationRadios = selectedOperation.value;
    mark = selectedOperation.value;

    const selectedRange = document.querySelector('input[name="check2"]:checked');
    if (!selectedRange) {
        alert('Vui lòng chọn phạm vi tính toán');
        return;
    }
    scopeRadios = selectedRange.value;
    range = Number(selectedRange.value);

    document.body.innerHTML = `
<header>
    <div class="header-text">
        <p>Select a problem below and then select an answer.</p>
        <p>When you are finished, select "Done" to see your score.</p>
    </div>
    <button class="done-button">Done</button>
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
        createProblem(index, problem, content, doneButton);
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

function createProblem(index, problem, content, doneButton) {
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
        if (doneButton.textContent !== 'Done' && problemDiv.dataset.answered !== 'true' ){
            const correctAnswer = document.createElement('div');
            correctAnswer.classList.add('selected-answer');
            correctAnswer.textContent = `${problem.answer}`;
            problemDiv.appendChild(correctAnswer);
            problemDiv.style.pointerEvents = 'none';
            return;
        }
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

                // if (document.querySelectorAll('.content-math[data-answered="true"]').length === problems.length) {
                //     doneButton.style.display = 'block';
                // }
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
        headerText.innerHTML = `
                                <h1 style="font-size: 40px;">Correct : ${correctCount}</h1><p>The green problems are correct.</p>
                                <p>The white problems are incorrect.</p><p>Select the white problem to see the answer.</p>`;
        event.target.textContent = 'New';
        event.target.addEventListener('click', renderMenu);
    }
});


function renderMenu() {
    problems = [];
    document.body.innerHTML = `
    <div class="container">
        <div class="operation">
            <ul>
                ${createRadioButton('operation', 'Addition', '+', 'Addition', operationRadios)}
                ${createRadioButton('operation', 'Subtraction', '-', 'Subtraction', operationRadios)}
                ${createRadioButton('operation', 'Multiplication', '×', 'Multiplication', operationRadios)}
                ${createRadioButton('operation', 'Division', '÷', 'Division', operationRadios)}
            </ul>
        </div>
        <div class="scope">
            <ul>
                ${createRadioButton('check2', '1-9', '9', '1 to 9', scopeRadios)}
                ${createRadioButton('check2', '1-19', '19', '1 to 19', scopeRadios)}
                ${createRadioButton('check2', '1-29', '29', '1 to 29', scopeRadios)}
                ${createRadioButton('check2', '1-39', '39', '1 to 39', scopeRadios)}
                ${createRadioButton('check2', '1-49', '49', '1 to 49', scopeRadios)}
                ${createRadioButton('check2', '1-99', '99', '1 to 99', scopeRadios)}
            </ul>
            <button id="start-button" onclick="doSomething();">Start</button>
        </div>
    </div>`;
}

function createRadioButton(name, id, value, label, selectedValue) {
    const checked = selectedValue === value ? 'checked' : '';
    return `
    <li>
        <div class="border-radio">
            <input type="radio" name="${name}" id="${id}" value="${value}" ${checked}>
        </div> ${label}
    </li>`;
}
