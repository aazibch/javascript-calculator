$(document).ready(() => {
  const inputs = [];
  const mathOperators = ['*', '/', '+', '-'];

  const updateScreen = (output) => {
    if (output.length > 17) {
      $('#display').html("<span id='message'>CHAR LIMIT MET</span>");
      inputs.splice(0, inputs.length);
    } else {
      $('#display').html("<span id='math'>" + output + '</span>');
    }
  };

  // Numbers + decimal point
  $('button')
    .not('.functional-button')
    .on('click', function () {
      const enteredValue = $(this).attr('value');

      if (
        (inputs.length === 0 && enteredValue === '.') ||
        (inputs.length === 0 && enteredValue === '0') ||
        (inputs.length > 0 &&
          mathOperators.indexOf(inputs[inputs.length - 1]) > -1 &&
          enteredValue === '0') ||
        (inputs.length > 0 &&
          inputs[inputs.length - 1].length === 1 &&
          inputs[inputs.length - 1][0] !== '0' &&
          enteredValue === '0') ||
        (inputs.length > 0 &&
          inputs[inputs.length - 1].length > 1 &&
          enteredValue === '0') ||
        (inputs.length > 0 &&
          !inputs[inputs.length - 1].includes('.') &&
          enteredValue === '.') ||
        (enteredValue !== '.' && enteredValue !== '0')
      ) {
        if (
          (inputs.length === 1 &&
            mathOperators.indexOf(inputs[inputs.length - 1]) >= 2) ||
          (inputs.length > 1 &&
            mathOperators.indexOf(inputs[inputs.length - 2]) > -1 &&
            mathOperators.indexOf(inputs[inputs.length - 1]) >= 2) ||
          (inputs.length >= 1 &&
            mathOperators.indexOf(inputs[inputs.length - 1]) === -1)
        ) {
          if (inputs[inputs.length - 1] === '0' && enteredValue !== '.') {
            inputs[inputs.length - 1] = enteredValue;
          } else {
            inputs[inputs.length - 1] += enteredValue;
          }
        } else {
          if (enteredValue === '.') {
            inputs.push('0' + enteredValue);
          } else {
            inputs.push(enteredValue);
          }
        }
      }

      if (inputs.length > 0) {
        updateScreen(inputs.join(''));
      }
    });

  // Mathematical operators
  $('.functional-button')
    .not('#equals, #ce-button, #clear #ac-button')
    .on('click', function () {
      const enteredValue = $(this).attr('value');

      /* Push new value */

      if (
        // No input,
        // And plus or minus operators are entered
        (inputs.length === 0 && mathOperators.indexOf(enteredValue) >= 2) ||
        // Some input
        // And the last input isn't an operator
        (inputs.length > 0 &&
          mathOperators.indexOf(inputs[inputs.length - 1]) === -1) ||
        // Some input
        // The entered value is "-"
        // And the last input is an operator
        // And the second last input is not an operator
        (inputs.length > 0 &&
          enteredValue === '-' &&
          mathOperators.indexOf(inputs[inputs.length - 1]) !== -1 &&
          mathOperators.indexOf(inputs[inputs.length - 2]) === -1)
      ) {
        inputs.push(enteredValue);
      } else if (
        /* Replace Values */
        // Some input
        // and the last value is an operator
        // and the second last value is also an operator
        inputs.length > 0 &&
        mathOperators.indexOf(inputs[inputs.length - 1]) !== -1 &&
        mathOperators.indexOf(inputs[inputs.length - 2]) !== -1
      ) {
        inputs.splice(inputs.length - 2, 2);
        inputs.push(enteredValue);
      } else if (
        // There is one input,
        // It is a math operator (plus or minus)
        // And the entered value is either plus or minus operator
        (inputs.length === 1 &&
          mathOperators.indexOf(inputs[inputs.length - 1]) !== -1 &&
          mathOperators.indexOf(enteredValue) >= 2) ||
        // There is input
        // The entered value is not the minus sign
        // And the last value is a math operator
        (inputs.length > 0 &&
          enteredValue !== '-' &&
          mathOperators.indexOf(inputs[inputs.length - 1]) !== -1)
      ) {
        // replace last input value
        inputs[inputs.length - 1] = enteredValue;
      }

      // if (
      //   // No input yet,
      //   // and plus or minus sign in added.
      //   (inputs.length === 0 && mathOperators.indexOf(enteredValue) >= 2) ||
      //   // Input is present,
      //   // and the last input is not a mathematical operator
      //   (inputs.length > 0 &&
      //     mathOperators.indexOf(inputs[inputs.length - 1]) === -1) ||
      //   // Input is present,
      //   // and the entered operator is either plus or minus
      //   // and the second last input is not a math operator.
      //   (inputs.length > 1 &&
      //     mathOperators.indexOf(enteredValue) >= 2 &&
      //     mathOperators.indexOf(inputs[inputs.length - 2]) === -1)
      // ) {
      //   inputs.push(enteredValue);
      // }

      if (inputs.length > 0) {
        updateScreen(inputs.join(''));
      }
    });

  //Equals button
  $('#equals').on('click', function () {
    if (mathOperators.indexOf(inputs[inputs.length - 1]) === -1) {
      updateScreen(calculateOutput(inputs));
    }
  });

  //AC button
  $('#clear').on('click', function () {
    inputs.splice(0, inputs.length);
    updateScreen(0);
  });

  //CE button
  $('#ce-button').on('click', function () {
    inputs.pop();
    updateScreen(inputs.join(''));
  });

  const calculateOutput = (inputs) => {
    let totalCalculations = inputs.length / 2 - 0.5;
    let i = 0;

    while (i < totalCalculations) {
      let opIndex;

      if (
        (inputs.indexOf('*') !== -1 &&
          inputs.indexOf('*') < inputs.indexOf('/')) ||
        (inputs.indexOf('*') !== -1 && inputs.indexOf('/') === -1)
      ) {
        opIndex = inputs.indexOf('*');
      } else if (
        (inputs.indexOf('/') !== -1 &&
          inputs.indexOf('/') < inputs.indexOf('*')) ||
        (inputs.indexOf('/') !== -1 && inputs.indexOf('*') === -1)
      ) {
        opIndex = inputs.indexOf('/');
      } else if (inputs.indexOf('/') !== -1 && inputs.indexOf('*') !== -1) {
        if (
          (inputs.indexOf('+') !== -1 &&
            inputs.indexOf('+') < inputs.indexOf('-')) ||
          (inputs.indexOf('+') !== -1 && inputs.indexOf('-') === -1)
        ) {
          opIndex = inputs.indexOf('+');
        } else if (
          (inputs.indexOf('-') !== -1 &&
            inputs.indexOf('-') < inputs.indexOf('+')) ||
          (inputs.indexOf('-') !== -1 && inputs.indexOf('+') === -1)
        ) {
          opIndex = inputs.indexOf('-');
        }
      }

      let calculation = inputs.splice(opIndex - 1, 3);
      calculation = eval(
        calculation[0] + ' ' + calculation[1] + ' ' + calculation[2]
      );
      inputs.splice(opIndex - 1, null, calculation);
      i++;
    }

    inputs[0] = Math.round((inputs[0] + Number.EPSILON) * 10000) / 10000;
    return inputs[0].toString();
  };
});
