export function floatViewToDecimal(bitsArray)
{
    // Проверка на нули
    let arrayFillZeros = true;
    for (let index = 1; index < 32; ++index)
        { if (bitsArray[index] !== 0) { arrayFillZeros = false; break; }}

    if (arrayFillZeros)
        { return (bitsArray[0] === 0) ? (0) : (-0); }


    let exponent = -127;
    for (let index = 1; index < 9; ++index)
        { exponent += bitsArray[index] * (2 ** (8 - index)); }


    let integerPart = 0;
    let fractionalPart = 0;


    // Если запятая будет сдвината вправо
    if (exponent >= 0)
    {
        // Подсчет целой части до точки
        integerPart += 1 * (2 ** exponent);
        for (let index = 9; index < 9 + exponent; ++index)
            { integerPart += bitsArray[index] * (2 ** (9 + exponent - index - 1)); }

        // Подсчет дробной части после точки
        for (let index = 9 + exponent; index < 32; ++index)
            { fractionalPart += bitsArray[index] * ((1/2) ** (index - (exponent + 9) + 1)); }
    }
    else
    {
        exponent = Math.abs(exponent);
        fractionalPart += 1 * ((1/2) ** (exponent));

        for (let index = 9; index < 32; ++index)
            { fractionalPart += bitsArray[index] * ((1/2) ** (exponent + index - 9 + 1)); }
    }
    
    return (((-1) ** bitsArray[0]) * (integerPart + fractionalPart));
}