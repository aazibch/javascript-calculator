$(document).ready(() => {
    const inputs = [];
    const mathOperators = ["*", "/", "+", "-"];

    const updateScreen = (output) => {
        if (output.length > 17) {
            $("#screen").html("<span id='message'>CHAR LIMIT MET</span>");
            inputs.splice(0,inputs.length);
        } else {
            $("#screen").html("<span id='math'>" + output + "</span>");
        }
    }

    // Numbers + decimal point
    $("button").not(".functional-button").on("click", function () {
        const enteredValue = $(this).attr("value");

        if (inputs.length === 0 && enteredValue === "." ||
            inputs.length === 0 && enteredValue === "0"||
            inputs.length > 0 && mathOperators.indexOf(inputs[inputs.length - 1]) > -1 && enteredValue === "0" ||
            inputs.length > 0 && inputs[inputs.length - 1].length === 1 && inputs[inputs.length - 1][0] !== "0" && enteredValue === "0" ||
            inputs.length > 0 && inputs[inputs.length - 1].length > 1 && enteredValue === "0" ||
            inputs.length > 0 && !inputs[inputs.length - 1].includes(".") && enteredValue === "." ||
            enteredValue !== "." && enteredValue !== "0") {
            
            if (inputs.length === 1 && mathOperators.indexOf(inputs[inputs.length - 1]) >= 2 ||
                inputs.length > 1 && mathOperators.indexOf(inputs[inputs.length - 2]) > -1 && mathOperators.indexOf(inputs[inputs.length - 1]) >= 2 ||
                inputs.length >= 1 && mathOperators.indexOf(inputs[inputs.length - 1]) === -1) {
                
                if (inputs[inputs.length - 1] === "0" && enteredValue !== ".") {
                    inputs[inputs.length - 1] = enteredValue;
                } else {
                    inputs[inputs.length - 1] += enteredValue;
                }
            } else {
                if (enteredValue === ".") {
                    inputs.push("0" + enteredValue);
                } else {
                    inputs.push(enteredValue);
                }
            }
        }

        if (inputs.length > 0) {
            updateScreen(inputs.join(""));
        }
    });

    // Mathematical operators
    $(".functional-button").not("#equal-button, #ce-button, #ac-button").on("click", function() {
        const enteredValue = $(this).attr("value");

        if (inputs.length === 0 && mathOperators.indexOf(enteredValue) >= 2 ||
            inputs.length > 0 && mathOperators.indexOf(inputs[inputs.length - 1]) === -1 ||
            inputs.length > 1 && mathOperators.indexOf(enteredValue) >= 2 && mathOperators.indexOf(inputs[inputs.length - 2]) === -1) {
            inputs.push(enteredValue);
        }

        if (inputs.length > 0) {
            updateScreen(inputs.join(""));
        }
    });

    //Equals button
    $("#equal-button").on("click", function() {
        if (mathOperators.indexOf(inputs[inputs.length - 1]) === -1) {
            updateScreen(calculateOutput(inputs));
        }
    });

    //AC button
    $("#ac-button").on("click", function () {
        inputs.splice(0, inputs.length);
        updateScreen(0);
    });

    //CE button
    $("#ce-button").on("click", function () {
        inputs.pop()
        updateScreen(inputs.join(""));
    });
    
    const calculateOutput = (inputs) => {
        let totalCalculations = inputs.length / 2 - .5;
        let i = 0;
    
        while (i < totalCalculations) {
            let opIndex;
    
            if (inputs.indexOf("*") !== -1 && inputs.indexOf("*") < inputs.indexOf("/") ||
                inputs.indexOf("*") !== -1 && inputs.indexOf("/") === -1) {
                opIndex = inputs.indexOf("*");
            } else if (inputs.indexOf("/") !== -1 && inputs.indexOf("/") < inputs.indexOf("*") ||
                inputs.indexOf("/") !== -1 && inputs.indexOf("*") === -1) {
                opIndex = inputs.indexOf("/");
            } else if (inputs.indexOf("/") !== -1 && inputs.indexOf("*") !== -1) {
                if (inputs.indexOf("+") !== -1 && inputs.indexOf("+") < inputs.indexOf("-") ||
                    inputs.indexOf("+") !== -1 && inputs.indexOf("-") === -1) {
                    opIndex = inputs.indexOf("+");
                } else if (inputs.indexOf("-") !== -1 && inputs.indexOf("-") < inputs.indexOf("+") ||
                    inputs.indexOf("-") !== -1 && inputs.indexOf("+") === -1) {
                    opIndex = inputs.indexOf("-");                
                }
            }
    
            let calculation = inputs.splice(opIndex - 1, 3);
            calculation = eval(calculation[0] + " " + calculation[1] + " " + calculation[2]);
            inputs.splice(opIndex - 1, null, calculation);
            i++;
        }

        inputs[0] = inputs[0].toString();
        return inputs[0];
    }
});