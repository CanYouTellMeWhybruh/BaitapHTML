const fs = require('fs');

class Level {
    constructor(id, operationType, rangeMinNumber, rangeMaxNumber, rowCount, colCount, status) {
        this.id = id;
        this.operationType = operationType;
        this.rangeMinNumber = rangeMinNumber;
        this.rangeMaxNumber = rangeMaxNumber;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.status = status;
    }

    toString() {
        return 'Level id: ' + this.id + ', operationType: ' + this.operationType + ', rangeMinNumber: ' + this.rangeMinNumber + ', rangeMaxNumber: ' + this.rangeMaxNumber
            + ', rowCount: ' + this.rowCount + ', colCount: ' + this.colCount + ', status: ' + this.status;
    }

    toCSVRecord() {
        return [this.id, this.operationType, this.rangeMinNumber, this.rangeMaxNumber, this.rowCount, this.colCount, this.status].join(',');
    }
}
class Operation {
    constructor(id, indexNumber, levelID, Number1, Number2, levelNewStatus, Type){
        this.id = id;
        this.indexNumber = indexNumber;
        this.levelID = levelID;
        this.Number1 = Number1;
        this.Number2 = Number2;
        this.levelNewStatus = levelNewStatus;
        this.Type = Type;
    }
    toCSVRecord(){
        return [this.id, this.indexNumber, this.levelID, this.Number1, this.Number2, this.levelNewStatus, this.Type].join(',');
    }
}
class Option {
    constructor(id, index, OperationID, Value){
        this.id = id;
        this.index = index;
        this.OperationID = OperationID;
        this.Value = Value;
    }
    toCSVRecord(){
        return [this.id, this.index, this.OperationID, this.Value].join(',');
    }
}


const OPERATION_TYPE_ENUM = ['add', 'subtract', 'multiply', 'divide'];
const LEVEL_STATUS_ENUM = ['new', 'done'];
const RANGE_MIN_NUMBER_ENUM = [1, 1, 1, 1, 1, 1];
const RANGE_MAX_NUMBER_ENUM = [9, 19, 29, 39, 49, 99];
const LEVEL_STATUS_DEFAULT = LEVEL_STATUS_ENUM[0];
const LEVEL_ROW_COUNT_DEFAULT = 2;
const LEVEL_COL_COUNT_DEFAULT = 2;
const OPERATION_STATUS_DEFAULT = 'NEW'; 
function generateOptions(Operators){
    const Options = [];
    let OptionIndex = 0;
    let OperationId = 0;
    for ( let OptionId = 0 ; OptionId < Operators.length ; OptionId++){
        const Number1 = Operators[OptionId].Number1;
        OperationId  = OptionId + 1;
        const Number2 = Operators[OptionId].Number2;
        const Type = Operators[OptionId].Type;
        let optionIndex = 0;
        const optionValues = generateValue(Number1,Number2,Type);
        for ( let optionId = 0 ; optionId < 4 ; optionId++){
            let optionRandom = new Option(++OptionIndex, ++optionIndex, OperationId, optionValues[optionId]);
            Options.push(optionRandom);
        }
    }
    return Options;
}
function generateOperations(levels){
    let OperationIndex = 0;
    const Operators = [];
    for(let operationIndex = 0 ; operationIndex < levels.length ; operationIndex++){
        let indexNumber = 0;
        const OperationID = operationIndex+1;
        const operationType = levels[operationIndex].operationType;
        const rangeMin = levels[operationIndex].rangeMinNumber;
        const rangeMax = levels[operationIndex].rangeMaxNumber;
        const rowCount = levels[operationIndex].rowCount;
        const colCount = levels[operationIndex].colCount;
        const Type = levels[operationIndex].operationType;
        for(let square = 0 ; square < rowCount*colCount ; square++){
            const numbers = generateNumbers(operationType, rangeMax, rangeMin);
            let Operator = new Operation(++OperationIndex, ++indexNumber, OperationID, numbers[0], numbers[1], OPERATION_STATUS_DEFAULT, Type);
            Operators.push(Operator);
        }
    }   
    return Operators;
}
function generateLevels() {
    const levels = [];
    let levelIndex = 0;
    for (let operationIndex = 0; operationIndex < OPERATION_TYPE_ENUM.length; operationIndex++) {
        const operationType = OPERATION_TYPE_ENUM[operationIndex];
        for (let rangeIndex = 0; rangeIndex < RANGE_MIN_NUMBER_ENUM.length; rangeIndex++) {
            const rangeMinNumber = RANGE_MIN_NUMBER_ENUM[rangeIndex];
            const rangeMaxNumber = RANGE_MAX_NUMBER_ENUM[rangeIndex];
            let level = new Level(++levelIndex, operationType, rangeMinNumber, rangeMaxNumber, LEVEL_ROW_COUNT_DEFAULT, LEVEL_COL_COUNT_DEFAULT, LEVEL_STATUS_DEFAULT);
            levels.push(level);
        }
    }
    return levels;
}
function generateValue(number1,number2,Type){
    let answer;
        if(Type === 'add'){
            answer = number1 + number2;
        }else if(Type === 'subtract'){
            answer = number1 - number2;
        }else if(Type === 'multiply'){
            answer = number1 * number2;
        }else{
            answer = number1 / number2;
        }
        let optionValues = [];
        const randomIndex = Math.floor(Math.random() * 4);
        for(let j = 0 ; j < 4 ; j++){
            if(j === randomIndex){
                optionValues.push(answer);
            }
            else{
                let randomAnswer;
                do{
                 randomAnswer = answer + 10 - Math.floor(Math.random()*9) + 1;
                }while(optionValues.includes(randomAnswer));
                optionValues.push(randomAnswer);
                
            }
        }
        return optionValues;

}
function generateNumbers(OperatorType,RangeMaxNumber,RangeMinNumber){
    let numbers = [];
    let number1 = Math.floor(Math.random()*(RangeMaxNumber - RangeMinNumber + 1)) + RangeMinNumber;
    let number2 = Math.floor(Math.random()*(RangeMaxNumber - RangeMinNumber + 1)) + RangeMinNumber;
    if(OperatorType === 'subtract'){
        while(number2 > number1){
            number1 = Math.floor(Math.random()*(RangeMaxNumber - RangeMinNumber + 1)) + RangeMinNumber;
        }
    }else if(OperatorType === 'divide'){
        while(number2 === 0){
            number2 = Math.floor(Math.random()*(RangeMaxNumber - RangeMinNumber)) + RangeMinNumber;
        }
        number1 = number2*(Math.floor(Math.random()*(RangeMaxNumber - RangeMinNumber)) + RangeMinNumber);
    }
    numbers.push(number1);
    numbers.push(number2);
    return numbers;
}
function writeLevelsToCSV() {
    let levelString = '';
    let operationString = '';
    let optionString = '';
    const LEVEL_FIELDS_NAME = ['Id', 'OperatorType', 'RangeMinNumber', 'RangeMaxNumber', 'RowCount', 'ColCount', 'Status', 'Type'];
    const LEVEL_FIELDS_TYPE = ['number', 'string', 'number', 'number', 'number', 'number', 'string', 'string'];
    const OPERATION_FIELDS_NAME = ['Id', 'IndexNumber', 'LevelID', 'Number1', 'Number2', 'LevelNewStatus'];
    const OPERATION_FIELDS_TYPE = ['number', 'number', 'number', 'number', 'number', 'string'];
    const OPTION_FIELDS_NAME = ['Id', 'Index', 'OperationID', 'Value'];
    const OPTION_FIELDS_TYPE = ['number', 'number', 'number', 'number'];
    const headerOPString = OPERATION_FIELDS_NAME.join(',');
    const headerOPTypeString = OPERATION_FIELDS_TYPE.join(',');
    const headerString = LEVEL_FIELDS_NAME.join(',');
    const typeString = LEVEL_FIELDS_TYPE.join(',');
    const headerOptionString = OPTION_FIELDS_NAME.join(',');
    const headerOptionTypeString = OPTION_FIELDS_TYPE.join(',');
    operationString += (headerOPString + '\r\n');
    operationString += (headerOPTypeString + '\r\n');
    levelString += (headerString + '\r\n');
    levelString += (typeString + '\r\n');
    optionString += (headerOptionString + '\r\n');
    optionString += (headerOptionTypeString + '\r\n');
    const levels = generateLevels();
    const operators = generateOperations(levels);
    const Options = generateOptions(operators);
    for(let level of levels) {
        levelString += (level.toCSVRecord() + '\r\n');
    }
    for(let operation of operators) {
        operationString += (operation.toCSVRecord() + '\r\n');
    }
    for(let option of Options){
        optionString += (option.toCSVRecord() + '\r\n');
    }
    
    fs.writeFileSync('levels.csv', levelString);
    fs.writeFileSync('operators.csv', operationString);
    fs.writeFileSync('options.csv', optionString);
}
writeLevelsToCSV();
