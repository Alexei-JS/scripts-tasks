function customToString(fractionalPartNumber, accuracy = 20)
{
    let viewString = "";
    let counter = 0;

    while ((fractionalPartNumber !== 0) && counter < accuracy)
    {
        fractionalPartNumber *= 2;
        viewString += (fractionalPartNumber >= 1) ? ('1') : ('0');

        fractionalPartNumber %= 1;
        counter += 1;
    }

    return viewString;
}


export function createViewFloat(number)
{
    let indexView = 0;
    const floatView = new Array(32).fill(0);

    // Определяем бит знака = первый бит floatView
    floatView[indexView] = (number >= 0) ? (0) : (1);
    if (number === 0) {
        floatView[indexView] = (Object.is(number, -0)) ? (1) : (0);
        return floatView; 
    }
    number = Math.abs(number);

    if (number > 16 * Math.pow(10, 6)) {
        return [floatView[0], ...Array(8).fill(1), ...Array(23).fill(0)];
    }



    // Переводим числа до точки (/2) и после точки (*2) в двоичную форму
    let beforeDot = Math.trunc(number);     // Отбрасываем все числа, идущие после точки
    let afterDot = number % 1;              // Отбрасываем все числоа, идущие до запятой

    // Представим наши числа оба в строковом виде, чтобы потом привести его к экспоненциальному
    beforeDot = beforeDot.toString(2);
    afterDot = customToString(afterDot);

    // Определяем положение запятой так, чтобы можно было записать число в экспоненциальной форме
    // Т.к. мы уже находимся в двоичной системе, то сдвиг будет характеризовать значение экспоненты, т.е. 2^shift
    let exponent = 0;
    if (number >= 1) {
        exponent = beforeDot.length - beforeDot.indexOf('1') - 1; // Ищем первую единицу с начала числа, чтобы узнать сдвиг запятой
    }
    else {
        exponent = -(afterDot.indexOf('1') + 1); // Ищем первую единицу числа, чтобы узнать сдвиг запятой, но уже в случае для дробной части
    }
    
    // Заполняем экспоненту по соглашению IEEE 754.
    // Идея в том, что числа > 127 положительная степень, а < 127 отрицательная, а само 127 будет +-1, в завис от бита зн.
    let stringExponent = ((exponent + 127).toString(2)).padStart(8, '0'); // Заполним еще незначащие нули функцией padStart
    for (indexView = 1; indexView < 9; ++indexView)
        { floatView[indexView] = parseInt(stringExponent[indexView - 1], 10); }




    // Получив степень сдвига - экспоненту, можно приступать к заполнению оставшихся бит - мантиссы
    let mantissa = "";
    if (number >= 1) {
        mantissa += beforeDot.slice(1) + afterDot; // Будет отсчет начинаться с первого элемента после первой единицы, а она гарантированно первая или -exponent
    }
    else {
        const firstOneIndex = afterDot.indexOf("1"); // Нашли первую единицу
        mantissa = afterDot.slice(firstOneIndex + 1); // Взяли все что после нее
    }

    // Заполнение мантиссы
    for (indexView = 9; indexView < 32 && (indexView < 9 + mantissa.length); ++indexView)
        { floatView[indexView] = parseInt(mantissa[indexView - 9], 10); }


    return floatView;
}
