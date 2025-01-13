// const fs = require('fs');

// let Data = {};

// // Đọc file levels.csv
// Data.Levels = fs.readFileSync('levels.csv', 'utf-8').split('\r\n'); // Sử dụng hàm đồng bộ đúng cách

// // Đọc file operators.csv
// Data.Operators = fs.readFileSync('operators.csv', 'utf-8').split('\r\n');

// // Đọc file options.csv
// Data.Options = fs.readFileSync('options.csv', 'utf-8').split('\r\n');

const problemNumber = 7;
const numberOfOptions = 4;
const randomRange = 9;

function run(data){
    const mark = '+';
  const type = {
    '+': 'add',
    '-': 'subtract',
    '×': 'multiply',
    '÷': 'divide',
  }[mark] || 'divide';

  const range = '99';

  if (!data) return;

  const levelHeaders = data.Levels[0].split(',');
  const typeIndex = levelHeaders.indexOf('OperatorType');
  const rangeIndex = levelHeaders.indexOf('RangeMaxNumber');

  if (typeIndex === -1 || rangeIndex === -1) {
    console.error('Không tìm thấy các cột OperatorType hoặc RangeMaxNumber.');
    return;
  }

  const LevelID = data.Levels.slice(1)
    .map(row => row.split(','))
    .find(row => row[typeIndex] === type && row[rangeIndex] === range)?.[0];

  if (!LevelID) {
    console.error('Không tìm thấy LevelID phù hợp.');
    return;
  }

  const OperatorHeaders = data.Operators[0].split(',');
  const OperatorNumber1Id = OperatorHeaders.indexOf('Number1');
  const OperatorNumber2Id = OperatorHeaders.indexOf('Number2');
  const OperatorLevelID = OperatorHeaders.indexOf('LevelID');

  const numbers = [];
  const OperationID = data.Operators.slice(1)
    .map(row => row.split(','))
    .filter(row => row[OperatorLevelID] === LevelID)
    .map(row => {
      numbers.push([row[OperatorNumber1Id], row[OperatorNumber2Id]]);
      return row[0];
    });

  const optionHeaders = data.Options[0].split(',');
  const optionOperationIDIndex = optionHeaders.indexOf('OperationID');
  const optionValueIndex = optionHeaders.indexOf('Value');

  const options = OperationID.map(id =>
    data.options.slice(1)
      .map(row => row.split(','))
      .filter(row => row[optionOperationIDIndex] === id)
      .map(row => row[optionValueIndex])
      .slice(0, numberOfOptions)
  );

  if (numbers.length < numberOfOptions || options.length < numberOfOptions) {
    console.error('Không đủ dữ liệu để hiển thị.');
    return;
  }
  console.log({Numbers: numbers, options: options});
}

let problems = [];
for( let i = 0 ; i < problemNumber ; i++){
  const problem = (Math.floor(Math.random()*randomRange) + 1);
  problems.push(problem);
}
console.log(problems);
