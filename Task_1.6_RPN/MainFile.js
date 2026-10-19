/* 
Видеть некорректно расставленые скобки закрывающаяся скобка + несколько открывющих
Деление на нуль

*/



function isAsciiLetter(symbol) { return ('a' <= symbol && symbol <= 'z') ? (true) : (false); }

tablePriorities = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '(': -1,          // В скобках действует свой порядок приоритетов, поэтому посути мы обнулям текущую величинут last operation
    undefined: -1     // Для тех случаев, когда стэк пустой, поэтому любая операция должна быть добавлена
};

function computingSimpleExpression(firstNumber, secondNumber, rpn_expression)
{
    switch (rpn_expression) {
        case '+': return firstNumber + secondNumber;
        case '-': return firstNumber - secondNumber;
        case '*': return firstNumber * secondNumber;
        case '/': return firstNumber / secondNumber;
    };
}


function createExpressionRPN(expression)
{
    expression = expression.toLowerCase();
    let bracketStatus = 0; // Флаг будет равен нулю если скобки расставлены верно, открывающая +1, а закр -1
    let resultString = "";
    let stackOperations = [];

    for (let index = 0; index < expression.length; ++index)
    {
        if (isAsciiLetter(expression[index]))
            { resultString += expression[index]; }
        else
        {
            if (expression[index] === '(') {
                stackOperations.push(expression[index]);
                ++bracketStatus;
            }
            else if (tablePriorities[stackOperations.at(-1)] < tablePriorities[expression[index]] && expression[index] !== ')') {
                stackOperations.push(expression[index]);
            }
            else
            {
                if (expression[index] === ')')
                {
                    if (bracketStatus <= 0)  { return null; }
                    else                     { --bracketStatus; }

                    while (stackOperations.at(-1) !== "(")
                        { resultString += stackOperations.pop(); }
                    stackOperations.pop();
                }
                else if (tablePriorities[stackOperations.at(-1)] >= tablePriorities[expression[index]])
                {
                    while (tablePriorities[stackOperations.at(-1)] >= tablePriorities[expression[index]])
                        { resultString += stackOperations.pop(); }
                    stackOperations.push(expression[index]);
                }
            }
        }
    }
    // Закидываем оставшиеся знаки в выражение
    while (stackOperations.length) {
        const operation = stackOperations.pop();

        if (operation === "(") { return null; }
        resultString += operation;
    }

    return resultString;
}


function computingResultRPN(rpn_expression, hashMapValues)
{
    if (rpn_expression === null) {
        console.log("Error('Ошибка в расстановке скобок')");
        return null;
    }
    let stackElements = [];

    for (let index = 0; index < rpn_expression.length; ++index)
    {
        if (isAsciiLetter(rpn_expression[index]))
        {
            stackElements.push(hashMapValues[rpn_expression[index]]);
        }
        else
        {
            const secondNumber = stackElements.pop();
            const firstNumber = stackElements.pop();

            if ((secondNumber === 0) && (rpn_expression[index] === "/")) { // Обработка деления на ноль
                console.log("Error('Попытка деления на ноль')");
                return null;
            }

            const resultComputing = computingSimpleExpression(firstNumber, secondNumber, rpn_expression[index]);
            stackElements.push(resultComputing);
        }
    }

    return stackElements.pop();
}





/* Тесты */

const expressions = [
    "(((a/b", "(a*b+c))", "a+b*c",
    "a-b-c", "a/b*c", "(a+b)*c",
    "a*(b+c)", "(a+b)*(c-d)/a",
    "a/(b*c-d)", "a+b*(c-d)",
    "(a+b)*(c-d)/a"
];

values = {'a': 5, 'b': 0, 'c': 1, 'd': 7.35};

for (const expression of expressions) {
    const rpnExpression = createExpressionRPN(expression);
    const result = computingResultRPN(rpnExpression, values);

    console.log(expression, "=>", rpnExpression, "==>", result, "\n\n");
}