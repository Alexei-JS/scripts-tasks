function additionMantissas(firstMantissa, secondMantissa)
{
    let resultMantissa = Array(firstMantissa.length).fill(0);
    let save = 0;

    for (let index = firstMantissa.length - 1; index >= 0; --index)
    {
        let sum = firstMantissa[index] + secondMantissa[index] + save;
        
        resultMantissa[index] = sum % 2;
        save = Math.floor(sum / 2);
    }

    if (save === 1) { resultMantissa.unshift(1); } // Добавляем единицу в начало

    return resultMantissa;
}

function substractMantissas(firstMantissa, secondMantissa)
{
    let resultMantissa = Array(firstMantissa.length).fill(0);
    let borrow = 0;

    for (let index = firstMantissa.length - 1; index >= 0; --index)
    {
        let difference = firstMantissa[index] - secondMantissa[index] - borrow;

        if (difference < 0)
        {
            difference += 2; // Компенисировали текущий отрицательный баланс в данном разряде
            borrow = 1;      // Записали долг в больший разряд
        }
        else
            { borrow = 0; }

        resultMantissa[index] = difference;
    }

    return resultMantissa;
}

function normalizeMantissa(resultMantissa)
{
    let shiftExponent = 0;

    let isZerosArray = true;
    for (let index = 0; index < resultMantissa.length; ++index)
        if (resultMantissa[index] != 0) { isZerosArray = false; break; }

    if (isZerosArray) { return { mantissa: Array(23).fill(0), shiftExponent: 0 }; }


    if (resultMantissa.length > 27)
    {
        resultMantissa.pop();
        shiftExponent = 1;
    }
    else
    {
        while (resultMantissa[0] === 0)
        {
            resultMantissa.shift(); // Удаляем первый элемент из начала
            resultMantissa.push(0); // Добавляем нолик в конец массива

            shiftExponent -= 1;
        }
    }

    return { mantissa: resultMantissa.slice(1, 24), shiftExponent: shiftExponent };
}

function shiftMantissaRight(mantissa, shift)
{
    let shiftedMantissa = Array(mantissa.length).fill(0);

    for (let index = 0; index < mantissa.length; ++index)
    {
        const newIndex = index + shift;

        if (newIndex < mantissa.length)
        {
            shiftedMantissa[newIndex] = mantissa[index];
        }
    }

    return shiftedMantissa;
}

function compareMantissas(firstMantissa, secondMantissa)
{
    for (let index = 0; index < firstMantissa.length; ++index)
    {
        if (firstMantissa[index] > secondMantissa[index])
            { return 1; }

        if (firstMantissa[index] < secondMantissa[index])
            { return -1; }
    }

    return 0;
}

function createExponentView(exponent)
{
    let exponentWithBias = exponent + 127;
    let exponentString = exponentWithBias .toString(2).padStart(8, "0");
    let exponentView = [];

    for (let index = 0; index < exponentString.length; ++index)
        { exponentView.push(Number(exponentString[index])); }

    return exponentView;
}

/* Основная Функция */

export function sumTwoFloatNumbers(firstNumber, secondNumber)
{
    // Обработка, если одно из чисел будет нуль
    let firstFillZeros = true;
    let secondFillZeros = true;
    for (let index = 1; index < 32; ++index)
        {
            if (firstNumber[index] !== 0) { firstFillZeros = false;}
            if (secondNumber[index] !== 0) { secondFillZeros = false;}
        }

    if (firstFillZeros && secondFillZeros)
        { return Array(32).fill(0); }
    else if (firstFillZeros)
        { return secondNumber; }
    else if (secondFillZeros)
        { return firstNumber; }




    // Определяем знаки первого и второго чила
    let firstNumberSign = firstNumber[0];
    let secondNumberSign = secondNumber[0];


    // Достаем для каждого из чисел экспоненты
    let firstNumberExponent = -127;
    let secondNumberExponent = -127;

    for (let index = 1; index < 9; ++index) {
        firstNumberExponent += firstNumber[index] * (2 ** (8 - index));
        secondNumberExponent += secondNumber[index] * (2 ** (8 - index));
    }
    



    let differenceExponents = Math.abs(firstNumberExponent - secondNumberExponent);
    let firstMantissa;
    let secondMantissa;

    let resultMantissa;                                                                                              // Мантисса итогового числа
    let resultExponent = (firstNumberExponent >= secondNumberExponent) ? firstNumberExponent : secondNumberExponent; // Экспонента итогового числа


    // Запись мантисс, для последуюещго сложния
    // по стандарту IEEE754 добавим биты Guard - защиты, Round - округления, Sticky - липкий
    if (firstNumberExponent >= secondNumberExponent)
    {
        firstMantissa = [1, ...firstNumber.slice(9, 32), 0, 0, 0 ]; // ... троеточие это типо итератора для распаковки каждого объекта
        // Сдвиг для второй мантиссы по экспоненте
        secondMantissa = shiftMantissaRight([1, ...secondNumber.slice(9, 32), 0, 0, 0 ], differenceExponents);
        
    }
    else
    {
        secondMantissa = [1, ...secondNumber.slice(9, 32), 0, 0, 0 ];
        // Сдвиг для первой мантиссы по экспоненте
        firstMantissa = shiftMantissaRight([1, ...firstNumber.slice(9, 32), 0, 0, 0 ], differenceExponents);
    }
    


    let greatestExponentSign = (firstNumberExponent >= secondNumberExponent) ? firstNumberSign : secondNumberSign;
    // Определяем результирующий знак для итога и суммируем или вычитаем итоговые мантиссы
    if (firstNumberSign === secondNumberSign)
    {
        resultMantissa = additionMantissas(firstMantissa, secondMantissa);

        const normalResult = normalizeMantissa(resultMantissa);
        const normalExponent = createExponentView(resultExponent + normalResult.shiftExponent);


        return [greatestExponentSign, ...normalExponent, ...normalResult.mantissa];
    }
    else
    {
        if (firstNumberExponent > secondNumberExponent)
            { resultMantissa = substractMantissas(firstMantissa, secondMantissa); }

        else if (secondNumberExponent > firstNumberExponent)
            { resultMantissa = substractMantissas(secondMantissa, firstMantissa); }

        else if (firstNumberExponent === secondNumberExponent)
        {
            if (compareMantissas(firstMantissa, secondMantissa) === 1)
            {
                greatestExponentSign = firstNumberSign;
                resultMantissa = substractMantissas(firstMantissa, secondMantissa);
            }
            else if (compareMantissas(firstMantissa, secondMantissa) === -1)
            {
                greatestExponentSign = secondNumberSign;
                resultMantissa = substractMantissas(secondMantissa, firstMantissa);
            }
            else
                { return Array(32).fill(0); }
        }

        const normalResult = normalizeMantissa(resultMantissa);
        const normalExponent = createExponentView(resultExponent + normalResult.shiftExponent);


        return [greatestExponentSign, ...normalExponent, ...normalResult.mantissa];
    }
}

