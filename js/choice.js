// const fs = require('fs');

// let Data = {};

// // Đọc file levels.csv
// Data.Levels = fs.readFileSync('levels.csv', 'utf-8').split('\r\n'); // Sử dụng hàm đồng bộ đúng cách

// // Đọc file operators.csv
// Data.Operators = fs.readFileSync('operators.csv', 'utf-8').split('\r\n');

// // Đọc file options.csv
// Data.Options = fs.readFileSync('options.csv', 'utf-8').split('\r\n');

function run(Data){
    const mark = '+';
  const type = {
    '+': 'add',
    '-': 'subtract',
    '×': 'multiply',
    '÷': 'divide',
  }[mark] || 'divide';

  const range = '99';

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
  console.log({Numbers, Options});
}

let problems = [];
for( let i = 0 ; i < 7 ; i++){
  const problem = (Math.floor(Math.random()*9) + 1);
  problems.push(problem);
}
console.log(problems);
