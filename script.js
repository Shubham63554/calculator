document.addEventListener('DOMContentLoaded', function() {
    let currentInput = '0';
    let operation = '';
    let operationJustCompleted = false;

    const display = document.getElementById('result');
    const operationDisplay = document.getElementById('operation');
    const buttons = document.querySelectorAll('.buttons button');

    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            
            if (this.classList.contains('clear')) {
                clearDisplay();
            } else if (this.classList.contains('backspace')) {
                backspace();
            } else if (this.classList.contains('equals')) {
                calculate();
            } else if (this.classList.contains('special')) {
                handleSpecialButton(buttonText);
            } else if (this.classList.contains('operator')) {
                handleOperator(buttonText);
            } else {
                appendNumber(buttonText);
            }
            
            animateButton(this);
        });
    });


    function updateDisplay() {
        display.textContent = currentInput;
        operationDisplay.textContent = operation;
    }

    // Add number to current input
    function appendNumber(number) {
        if (operationJustCompleted) {
            currentInput = '0';
            operation = '';
            operationJustCompleted = false;
        }

        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
        
        updateDisplay();
    }

    // Handle operator buttons
    function handleOperator(operator) {
        if (operationJustCompleted) {
            operationJustCompleted = false;
        }
        
        // Replace operator symbols for display
        const displayOperator = operator === '×' ? '*' : 
                              operator === '÷' ? '/' : 
                              operator === '−' ? '-' : 
                              operator;
        
        currentInput += displayOperator;
        updateDisplay();
    }

    // Handle special function buttons
    function handleSpecialButton(button) {
        switch(button) {
            case '√':
                currentInput += '√(';
                break;
            case '%':
                currentInput += '%';
                break;
            case '(':
            case ')':
            case '^':
                currentInput += button;
                break;
        }
        updateDisplay();
    }

    // Clear the display
    function clearDisplay() {
        currentInput = '0';
        operation = '';
        updateDisplay();
    }

    // Remove last character
    function backspace() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    // Calculate the result
    function calculate() {
        try {
           
            let expression = currentInput
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/\^/g, '**')
                .replace(/%/g, '/100*');
            
            // Handle square root operation
            expression = expression.replace(/√\(([^)]+)\)/g, (match, num) => {
                return `Math.sqrt(${num})`;
            });

            // Evaluate the expression
            let result = eval(expression);

            // Format the result
            if (isNaN(result) || !isFinite(result)) {
                result = 'Error';
            } else {
                result = parseFloat(result.toFixed(10));
                
                // Remove trailing .0 if it's an integer
                if (result % 1 === 0) {
                    result = result.toString();
                    if (result.includes('.')) {
                        result = result.replace(/\.0+$/, '');
                    }
                } else {
                    result = result.toString();
                }
            }

            operation = currentInput + '=';
            currentInput = result;
            operationJustCompleted = true;
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
        }
    }

    // Button press animation
    function animateButton(button) {
        button.classList.add('press-animation');
        setTimeout(() => {
            button.classList.remove('press-animation');
        }, 200);
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        
        if (/[0-9]/.test(key)) {
            appendNumber(key);
        } else if (key === '.') {
            appendNumber(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            backspace();
        } else if (key === 'Escape') {
            clearDisplay();
        } else if (key === '%') {
            handleSpecialButton('%');
        } else if (key === '^') {
            handleSpecialButton('^');
        } else if (key === '(') {
            handleSpecialButton('(');
        } else if (key === ')') {
            handleSpecialButton(')');
        }
    });

    // Initial display update
    updateDisplay();
});
