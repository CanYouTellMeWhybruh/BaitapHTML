const fs = require('fs');
  let Data = {};

  Data.Levels = fs.readFileSync('levels.csv', 'utf-8').split('\r\n'); 

  Data.Operators = fs.readFileSync('operators.csv', 'utf-8').split('\r\n');

  Data.Options = fs.readFileSync('options.csv', 'utf-8').split('\r\n');


function run(Data) {
  const selectedOperation = document.querySelector('input[name="operation"]:checked');
  if (!selectedOperation) {
    alert('Vui lòng chọn một phép toán');
    return;
  }

  const mark = selectedOperation.value;
  const type = {
    '+': 'add',
    '-': 'subtract',
    '×': 'multiply',
    '÷': 'divide',
  }[mark] || 'divide';

  const selectedRange = document.querySelector('input[name="check2"]:checked');
  if (!selectedRange) {
    alert('Vui lòng chọn phạm vi tính toán');
    return;
  }
  const range = selectedRange.value;

  doSomething();
  if (!Data) return;

  const LevelHeaders = Data.Levels[0].split(',');
  const typeIndex = LevelHeaders.indexOf('OperatorType');
  const rangeIndex = LevelHeaders.indexOf('RangeMaxNumber');

  if (typeIndex === -1 || rangeIndex === -1) {
    console.error('Không tìm thấy các cột OperatorType hoặc RangeMaxNumber.');
    return;
  }

  const LevelID = Data.Levels.slice(1)
    .map(row => row.split(','))
    .find(row => row[typeIndex] === type && row[rangeIndex] === range)?.[0];

  if (!LevelID) {
    console.error('Không tìm thấy LevelID phù hợp.');
    return;
  }

  const OperatorHeaders = Data.Operators[0].split(',');
  const OperatorNumber1Id = OperatorHeaders.indexOf('Number1');
  const OperatorNumber2Id = OperatorHeaders.indexOf('Number2');
  const OperatorLevelID = OperatorHeaders.indexOf('LevelID');

  const Numbers = [];
  const OperationID = Data.Operators.slice(1)
    .map(row => row.split(','))
    .filter(row => row[OperatorLevelID] === LevelID)
    .map(row => {
      Numbers.push([row[OperatorNumber1Id], row[OperatorNumber2Id]]);
      return row[0];
    });

  const OptionHeaders = Data.Options[0].split(',');
  const OptionOperationIDIndex = OptionHeaders.indexOf('OperationID');
  const OptionValueIndex = OptionHeaders.indexOf('Value');

  const Options = OperationID.map(id =>
    Data.Options.slice(1)
      .map(row => row.split(','))
      .filter(row => row[OptionOperationIDIndex] === id)
      .map(row => row[OptionValueIndex])
      .slice(0, 4)
  );

  if (Numbers.length < 4 || Options.length < 4) {
    console.error('Không đủ dữ liệu để hiển thị.');
    return;
  }

  for (let i = 1; i <= 4; i++) {
    const pointerHTML = `.content-math-${i}`;
    const pointToElement = document.querySelector(pointerHTML);
    if (!pointToElement) {
      console.error(`Không tìm thấy phần tử: ${pointerHTML}`);
      continue;
    }
    pointToElement.innerHTML = `
      <div class="operation-math">
        <div class="mark"><p>${mark}</p></div>
        <div class="number">
          <div class="number-1"><p>${Numbers[i - 1][0]}</p></div>
          <div class="number-2"><p>${Numbers[i - 1][1]}</p></div>
        </div>
      </div>
      <div class="answer">
        <div>${Options[i - 1][0]}</div>
        <div>${Options[i - 1][1]}</div>
        <div>${Options[i - 1][2]}</div>
        <div>${Options[i - 1][3]}</div>
      </div>`;
  }
}

function doSomething() {
  document.body.innerHTML = `
<header>
  <div class="header-text">
    <p>Select a problem below and then select an answer.</p>
    <p>When you are finished, select "Done" to see your score.</p>
  </div>
  <button class="done-button" onclick="renderMenu()">Done</button>
</header>
<main>
  <div class="content"></div>
</main>`;
  renderMath();
}

function renderMath() {
  let Create_ContentHTML = document.querySelector('.content');
  let html = '';
  for (let i = 1; i <= 4; i++) {
    const createContainer = `content-math-${i}`;
    html += `<div class="content-math content-math-transition ${createContainer}">
    </div>`;
  }
  Create_ContentHTML.innerHTML = html;
}

function renderMenu() {
  const doneButton = document.querySelector('.done-button');
  if (doneButton.innerText === 'Done') {
    doneButton.innerHTML = 'New';
  } else {
    document.body.innerHTML = `
    <div class="container">
      <h1 id="title">MATH TEST</h1>
      <div class="operation"><ul>
        <li>
          <div class="border-radio"><input type="radio" id="Addition" name="operation" value="+"></div> Addition
        </li>
        <li>
          <div class="border-radio"><input type="radio" id="Subtraction" name="operation" value="-"></div> Subtraction
        </li>
        <li>
          <div class="border-radio"><input type="radio" id="Multiplication" name="operation" value="×"></div> Multiplication
        </li>
        <li>
          <div class="border-radio"><input type="radio" id="Division" name="operation" value="÷"></div> Division
        </li>
      </ul></div>
      <div class="scope">
        <ul>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-9" value="9"></div> 1 to 9</li>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-19" value="19"></div> 1 to 19</li>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-29" value="29"></div> 1 to 29</li>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-39" value="39"></div> 1 to 39</li>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-49" value="49"></div> 1 to 49</li>
          <li><div class="border-radio"><input type="radio" name="check2" id="1-99" value="99"></div> 1 to 99</li>
        </ul>
        <button id="start-button" onclick="run();">Start</button>
      </div>
    </div>`;
  }
}
