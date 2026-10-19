import {floatViewToDecimal} from "./DecimalView.js";
import {createViewFloat} from "./ViewFloat.js";
import {sumTwoFloatNumbers} from "./SumOfNumbers.js";

/* Сделать объекты для формата  IEEE754  -- минус беск. плюс беск NaN*/ 
// Добавить вывод для суммы с бесконечностью !!!!!

console.log(createViewFloat(3.4 * Math.pow(10, 37)), floatViewToDecimal(createViewFloat(3.4 * Math.pow(10, 7))));
console.log(createViewFloat(1), floatViewToDecimal(createViewFloat(1)));
console.log(createViewFloat(-1), floatViewToDecimal(createViewFloat(-1)));
console.log(createViewFloat(-5), floatViewToDecimal(createViewFloat(-5)));
console.log(createViewFloat(0), floatViewToDecimal(createViewFloat(0)));
console.log(createViewFloat(-0), floatViewToDecimal(createViewFloat(-0)), "\n\n");

console.log("Тесты для функции суммы двух чисел в двоичном представлении:\n\n");

let numberConst = createViewFloat(-1111111111111); //createViewFloat(5);

for (let number = 2.0; number <= 5; number += 0.25)
{
    let number2 = createViewFloat(number);
    let summary = sumTwoFloatNumbers(numberConst, createViewFloat(+111111111111111111));

    console.log(summary, "  --->  ", floatViewToDecimal(summary));
}