import {floatViewToDecimal} from "./DecimalView.js";
import {createViewFloat} from "./ViewFloat.js";
import {sumTwoFloatNumbers} from "./SumOfNumbers.js";




console.log(createViewFloat(5), floatViewToDecimal(createViewFloat(5)));
console.log(createViewFloat(1), floatViewToDecimal(createViewFloat(1)));
console.log(createViewFloat(-1), floatViewToDecimal(createViewFloat(-1)));
console.log(createViewFloat(-5), floatViewToDecimal(createViewFloat(-5)));
console.log(createViewFloat(0), floatViewToDecimal(createViewFloat(0)));
console.log(createViewFloat(-0), floatViewToDecimal(createViewFloat(-0)), "\n\n");

console.log("Тесты для функции суммы двух чисел в двоичном представлении:\n\n");

let numberConst = createViewFloat(5);

for (let number = 2.0; number <= 5; number += 0.25)
{
    let number2 = createViewFloat(number);
    let summary = sumTwoFloatNumbers(numberConst, number2);

    console.log(summary, "  --->  ", floatViewToDecimal(summary));
}