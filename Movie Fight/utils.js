// DEBOUNCING AN INPUT
// Waiting for some time to pass after the last event to actually do something

// Eg ->  Causing delay between when the user stops writing input and the api call 
// other wise we will be making an api call on every change input
const debounce = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
      if(timeoutId){
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    }
}

