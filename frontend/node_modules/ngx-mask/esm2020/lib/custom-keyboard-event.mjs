const commonjsGlobal = typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
            ? global
            : typeof self !== 'undefined'
                ? self
                : {};
(function () {
    if (!commonjsGlobal.KeyboardEvent) {
        commonjsGlobal.KeyboardEvent = function (_eventType, _init) { };
    }
})();
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWtleWJvYXJkLWV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LW1hc2stbGliL3NyYy9saWIvY3VzdG9tLWtleWJvYXJkLWV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sY0FBYyxHQUNuQixPQUFPLFVBQVUsS0FBSyxXQUFXO0lBQ2hDLENBQUMsQ0FBQyxVQUFVO0lBQ1osQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVc7UUFDL0IsQ0FBQyxDQUFDLE1BQU07UUFDUixDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVztZQUMvQixDQUFDLENBQUMsTUFBTTtZQUNSLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxXQUFXO2dCQUM3QixDQUFDLENBQUMsSUFBSTtnQkFDTixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRVAsQ0FBQztJQUNBLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFO1FBQ2xDLGNBQWMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxVQUFlLEVBQUUsS0FBVSxJQUFHLENBQUMsQ0FBQztLQUN6RTtBQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5kZWNsYXJlIHZhciBnbG9iYWw6IGFueTtcblxuY29uc3QgY29tbW9uanNHbG9iYWwgPVxuXHR0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCdcblx0XHQ/IGdsb2JhbFRoaXNcblx0XHQ6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5cdFx0PyB3aW5kb3dcblx0XHQ6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG5cdFx0PyBnbG9iYWxcblx0XHQ6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJ1xuXHRcdD8gc2VsZlxuXHRcdDoge307XG5cbihmdW5jdGlvbiAoKSB7XG5cdGlmICghY29tbW9uanNHbG9iYWwuS2V5Ym9hcmRFdmVudCkge1xuXHRcdGNvbW1vbmpzR2xvYmFsLktleWJvYXJkRXZlbnQgPSBmdW5jdGlvbiAoX2V2ZW50VHlwZTogYW55LCBfaW5pdDogYW55KSB7fTtcblx0fVxufSkoKTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tS2V5Ym9hcmRFdmVudCA9IEtleWJvYXJkRXZlbnQ7XG4iXX0=