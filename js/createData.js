const fs = require("fs");

class Level {
  constructor(
    id,
    operationType,
    rangeMinNumber,
    rangeMaxNumber,
    rowCount,
    colCount,
    status
  ) {
    this.id = id;
    this.operationType = operationType;
    this.rangeMinNumber = rangeMinNumber;
    this.rangeMaxNumber = rangeMaxNumber;
    this.rowCount = rowCount;
    this.colCount = colCount;
    this.status = status;
  }

  toString() {
    return (
      "Level id: " +
      this.id +
      ", operationType: " +
      this.operationType +
      ", rangeMinNumber: " +
      this.rangeMinNumber +
      ", rangeMaxNumber: " +
      this.rangeMaxNumber +
      ", rowCount: " +
      this.rowCount +
      ", colCount: " +
      this.colCount +
      ", status: " +
      this.status
    );
  }

  toCSVRecord() {
    return [
      this.id,
      this.operationType,
      this.rangeMinNumber,
      this.rangeMaxNumber,
      this.rowCount,
      this.colCount,
      this.status,
    ].join(",");
  }
}
class Operation {
  constructor(
    id,
    indexNumber,
    levelID,
    Number1,
    Number2,
    levelNewStatus,
    operationType
  ) {
    this.id = id;
    this.indexNumber = indexNumber;
    this.levelID = levelID;
    this.Number1 = Number1;
    this.Number2 = Number2;
    this.levelNewStatus = levelNewStatus;
    this.operationType = operationType;
  }
  toCSVRecord() {
    return [
      this.id,
      this.indexNumber,
      this.levelID,
      this.Number1,
      this.Number2,
      this.levelNewStatus,
      this.operationType,
    ].join(",");
  }
}
class Option {
  constructor(id, index, OperationID, Value) {
    this.id = id;
    this.index = index;
    this.OperationID = OperationID;
    this.Value = Value;
  }
  toCSVRecord() {
    return [this.id, this.index, this.OperationID, this.Value].join(",");
  }
}

const OPERATION_TYPE_ENUM = ["add", "subtract", "multiply", "divide"];
const LEVEL_STATUS_ENUM = ["new", "done"];
const RANGE_MIN_NUMBER_ENUM = [1, 1, 1, 1, 1, 1];
const RANGE_MAX_NUMBER_ENUM = [9, 19, 29, 39, 49, 99];
const LEVEL_STATUS_DEFAULT = LEVEL_STATUS_ENUM[0];
const LEVEL_ROW_COUNT_DEFAULT = 4;
const LEVEL_COL_COUNT_DEFAULT = 4;
const OPERATION_STATUS_DEFAULT = "NEW";
const OPTION_COUNT_PER_OPERATION = 4;

function generateOptions(operations) {
  const Options = [];
  let optionId = 1;
  operations.forEach((operation, operationID) => {
    operationID++;
    let optionValues = generateValue(
      operation.Number1,
      operation.Number2,
      operation.operationType
    );
    for (
      let optionIndex = 1;
      optionIndex <= OPTION_COUNT_PER_OPERATION;
      optionIndex++
    ) {
      let options = new Option(
        optionId,
        optionIndex,
        operationID,
        optionValues[optionIndex - 1]
      );
      Options.push(options);
      optionId++;
    }
  });
  return Options;
}
function generateOperations(levels) {
  let operationID = 1;
  const operations = [];
  levels.forEach((level, levelIndex) => {
    levelIndex++;
    // Generate Operation Numbers
    for (let size = 1; size <= level.rowCount * level.colCount; size++) {
      const numbers = generateNumbers(
        level.operationType,
        level.rangeMinNumber,
        level.rangeMaxNumber
      );
      let operation = new Operation(
        operationID,
        size,
        levelIndex,
        numbers[0],
        numbers[1],
        OPERATION_STATUS_DEFAULT,
        level.operationType
      );
      operations.push(operation);
      operationID++;
    }
  });
  return operations;
}
function generateLevels() {
  const levels = [];
  let levelIndex = 0;
  for (
    let operationIndex = 0;
    operationIndex < OPERATION_TYPE_ENUM.length;
    operationIndex++
  ) {
    const operationType = OPERATION_TYPE_ENUM[operationIndex];
    for (
      let rangeIndex = 0;
      rangeIndex < RANGE_MIN_NUMBER_ENUM.length;
      rangeIndex++
    ) {
      const rangeMinNumber = RANGE_MIN_NUMBER_ENUM[rangeIndex];
      const rangeMaxNumber = RANGE_MAX_NUMBER_ENUM[rangeIndex];
      let level = new Level(
        ++levelIndex,
        operationType,
        rangeMinNumber,
        rangeMaxNumber,
        LEVEL_ROW_COUNT_DEFAULT,
        LEVEL_COL_COUNT_DEFAULT,
        LEVEL_STATUS_DEFAULT
      );
      levels.push(level);
    }
  }
  return levels;
}
function generateValue(number1, number2, Type) {
  let answer;
  if (Type === "add") {
    answer = number1 + number2;
  } else if (Type === "subtract") {
    answer = number1 - number2;
  } else if (Type === "multiply") {
    answer = number1 * number2;
  } else {
    answer = number1 / number2;
  }
  let optionValues = [];
  const randomIndex = Math.floor(Math.random() * 4);
  for (let j = 0; j < 4; j++) {
    if (j === randomIndex) {
      optionValues.push(answer);
    } else {
      let randomAnswer;
      do {
        randomAnswer = answer + 10 - Math.floor(Math.random() * 9) + 1;
      } while (optionValues.includes(randomAnswer));
      optionValues.push(randomAnswer);
    }
  }
  return optionValues;
}
function generateNumbers(operatorType, rangeMinNumber, rangeMaxNumber) {
  let number1 =
    Math.floor(Math.random() * (rangeMaxNumber - rangeMinNumber + 1)) +
    rangeMinNumber;
  let number2 =
    Math.floor(Math.random() * (rangeMaxNumber - rangeMinNumber + 1)) +
    rangeMinNumber;
  if (operatorType === "subtract") {
    number2 = Math.floor(Math.random() * number1 + 1);
  } else if (operatorType === "divide") {
    number2 = Math.max(
      Math.floor(Math.random() * (rangeMaxNumber - rangeMinNumber)) +
        rangeMinNumber,
      1
    );
    number1 =
      number2 *
      (Math.floor(Math.random() * (rangeMaxNumber - rangeMinNumber)) +
        rangeMinNumber); // Make sure the number 2 is divisable by number 1
  }
  return [number1, number2];
}
function writeDataToJson() {
  // let levelString = "";
  // let operationString = "";
  // let optionString = "";
  // const LEVEL_FIELDS_NAME = [
  //   "Id",
  //   "OperatorType",
  //   "RangeMinNumber",
  //   "RangeMaxNumber",
  //   "RowCount",
  //   "ColCount",
  //   "Status",
  //   "Type",
  // ];
  // const LEVEL_FIELDS_TYPE = [
  //   "number",
  //   "string",
  //   "number",
  //   "number",
  //   "number",
  //   "number",
  //   "string",
  //   "string",
  // ];
  // const OPERATION_FIELDS_NAME = [
  //   "Id",
  //   "IndexNumber",
  //   "LevelID",
  //   "Number1",
  //   "Number2",
  //   "LevelNewStatus",
  // ];
  // const OPERATION_FIELDS_TYPE = [
  //   "number",
  //   "number",
  //   "number",
  //   "number",
  //   "number",
  //   "string",
  // ];
  // const OPTION_FIELDS_NAME = ["Id", "Index", "OperationID", "Value"];
  // const OPTION_FIELDS_TYPE = ["number", "number", "number", "number"];
  // const headerOPString = OPERATION_FIELDS_NAME.join(",");
  // const headerOPTypeString = OPERATION_FIELDS_TYPE.join(",");
  // const headerString = LEVEL_FIELDS_NAME.join(",");
  // const typeString = LEVEL_FIELDS_TYPE.join(",");
  // const headerOptionString = OPTION_FIELDS_NAME.join(",");
  // const headerOptionTypeString = OPTION_FIELDS_TYPE.join(",");
  // operationString += headerOPString + "\r\n";
  // operationString += headerOPTypeString + "\r\n";
  // levelString += headerString + "\r\n";
  // levelString += typeString + "\r\n";
  // optionString += headerOptionString + "\r\n";
  // optionString += headerOptionTypeString + "\r\n";

  const levels = generateLevels();
  const operations = generateOperations(levels);
  const Options = generateOptions(operations);
  // for (let level of levels) {
  //   levelString += level.toCSVRecord() + "\r\n";
  // }
  // for (let operation of operations) {
  //   operationString += operation.toCSVRecord() + "\r\n";
  // }
  // for (let option of Options) {
  //   optionString += option.toCSVRecord() + "\r\n";
  // }

  // fs.writeFileSync("Ver2levels.csv", levelString);
  // fs.writeFileSync("Ver2operators.csv", operationString);
  // fs.writeFileSync("Ver2options.csv", optionString);

  const jsonData = {
    levels: levels.map(level => ({
      id: level.id,
      operationType: level.operationType,
      rangeMinNumber: level.rangeMinNumber,
      rangeMaxNumber: level.rangeMaxNumber,
      rowCount: level.rowCount,
      colCount: level.colCount,
      status: level.status,
    })),
    operations: operations.map(operation => ({
      id: operation.id,
      indexNumber: operation.indexNumber,
      levelID: operation.levelID,
      number1: operation.Number1,
      number2: operation.Number2,
      levelNewStatus: operation.levelNewStatus,
      operationType: operation.operationType,
    })),
    options: Options.map(option => ({
      id: option.id,
      index: option.index,
      operationID: option.OperationID,
      value: option.Value,
    })),
  };

  fs.writeFileSync("Ver2data.json", JSON.stringify(jsonData, null, 2));

  console.log("Data has been saved to Ver2data.json");
}
writeDataToJson();
