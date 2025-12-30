// JavaScript for iOS Number Picker

// DOM Elements
const passwordScreen = document.getElementById('password-screen');
const pickerScreen = document.getElementById('picker-screen');
const passwordDots = document.querySelectorAll('.password-dots .dot');
const errorMessage = document.getElementById('error-message');
const keys = document.querySelectorAll('.key[data-number]');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const numberWheel = document.getElementById('number-wheel');
const numbers = document.querySelectorAll('.number');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.querySelector('.status-text');
const resetButton = document.getElementById('reset-button');

// Constants
const CORRECT_PASSWORD = '111115';
const SCROLL_DURATION = 3000; // 3 seconds
const SCROLL_INTERVAL = 100; // 100ms per step
const NUMBER_HEIGHT = 66.67; // Height of each number in pixels

// Variables
let currentPassword = '';
let isScrolling = false;
let scrollInterval;
let currentNumberIndex = 0;

// Initialize the application
function init() {
    // Show password screen initially
    showScreen(passwordScreen);
    
    // Add event listeners
    addEventListeners();
}

// Add event listeners to all interactive elements
function addEventListeners() {
    // Number keys
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (currentPassword.length < 6) {
                currentPassword += key.dataset.number;
                updatePasswordDots();
                
                // Auto-verify when 6 digits are entered
                if (currentPassword.length === 6) {
                    setTimeout(verifyPassword, 300);
                }
            }
        });
    });
    
    // Clear button
    clearButton.addEventListener('click', clearPassword);
    
    // Delete button
    deleteButton.addEventListener('click', deleteLastDigit);
    
    // Reset button
    resetButton.addEventListener('click', resetApp);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeydown);
}

// Update the password dots visualization
function updatePasswordDots() {
    passwordDots.forEach((dot, index) => {
        if (index < currentPassword.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Verify the entered password
function verifyPassword() {
    if (currentPassword === CORRECT_PASSWORD) {
        showSuccess();
        setTimeout(() => {
            showScreen(pickerScreen);
            startNumberScroll();
        }, 1000);
    } else {
        showError();
        setTimeout(clearPassword, 1500);
    }
}

// Show success feedback
function showSuccess() {
    passwordDots.forEach(dot => {
        dot.style.backgroundColor = 'var(--success-color)';
    });
}

// Show error feedback
function showError() {
    errorMessage.textContent = '密码错误，请重试。';
    errorMessage.style.opacity = '1';
    
    // Shake animation for password dots
    passwordDots.forEach(dot => {
        dot.classList.add('shake');
    });
    
    setTimeout(() => {
        passwordDots.forEach(dot => {
            dot.classList.remove('shake');
        });
    }, 500);
}

// Clear the entered password
function clearPassword() {
    currentPassword = '';
    updatePasswordDots();
    errorMessage.style.opacity = '0';
    
    // Reset dot colors
    passwordDots.forEach(dot => {
        dot.style.backgroundColor = '';
    });
}

// Delete the last entered digit
function deleteLastDigit() {
    if (currentPassword.length > 0) {
        currentPassword = currentPassword.slice(0, -1);
        updatePasswordDots();
        errorMessage.style.opacity = '0';
    }
}

// Show a specific screen with transition
function showScreen(screen) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show the target screen
    screen.classList.add('active');
}

// Start the number flipping animation
function startNumberScroll() {
    isScrolling = true;
    const digitElement = document.querySelector('.digit');
    const digitValueElement = document.querySelector('.digit-value');
    
    // Reset to initial state
    digitValueElement.textContent = '1';
    digitElement.classList.remove('flipping');
    
    // Wait a short moment before starting the animation
    setTimeout(() => {
        let currentNumber = 1;
        let cycleCount = 0;
        const totalCycles = 2;
        const numbersPerCycle = 13;
        const totalNumbers = totalCycles * numbersPerCycle;
        
        // Calculate timing for each flip
        const flipInterval = SCROLL_DURATION / (totalNumbers + 10); // Add extra time for smooth ending
        let flipIndex = 0;
        
        // Start the flipping interval
        scrollInterval = setInterval(() => {
            flipIndex++;
            
            // Increment number (1-13循环)
            currentNumber = currentNumber % 13 + 1;
            
            // Apply flip animation
            digitElement.classList.add('flipping');
            
            // Update number after a short delay to sync with animation
            setTimeout(() => {
                digitValueElement.textContent = currentNumber;
                digitElement.classList.remove('flipping');
            }, 300); // Halfway through the flip animation
            
            // Check if we've completed a full cycle
            if (currentNumber === 13) {
                cycleCount++;
            }
            
            // Stop the animation when we've completed 2 cycles and shown number 1 again
            if (cycleCount >= totalCycles && currentNumber === 1) {
                clearInterval(scrollInterval);
                isScrolling = false;
                
                // Add a final flip to ensure number 1 is clearly displayed
                setTimeout(() => {
                    digitElement.classList.add('flipping');
                    setTimeout(() => {
                        digitValueElement.textContent = '1';
                        digitElement.classList.remove('flipping');
                        completeSelection();
                    }, 300);
                }, 500);
            }
        }, flipInterval);
    }, 500);
}

// This function is no longer used with the flip animation
// It's kept here for compatibility but not called in the current implementation
function updateActiveNumber(position) {
    // This function was used for the wheel animation and is now replaced by direct DOM manipulation
    console.log('updateActiveNumber is deprecated in the flip animation mode');
}

// Complete the selection process
function completeSelection() {
    // Update the status indicator
    statusIndicator.classList.add('completed');
    statusText.textContent = '取号完成';
    
    // Ensure number 1 is shown
    const digitValueElement = document.querySelector('.digit-value');
    digitValueElement.textContent = '1';
}

// Reset the number picker to start a new selection
function resetApp() {
    // Stop any ongoing scroll animation
    if (isScrolling) {
        clearInterval(scrollInterval);
        isScrolling = false;
    }
    
    // Reset the digit display
    const digitElement = document.querySelector('.digit');
    const digitValueElement = document.querySelector('.digit-value');
    digitElement.classList.remove('flipping');
    digitValueElement.textContent = '1';
    
    // Reset the status indicator
    statusIndicator.classList.remove('completed');
    statusText.textContent = '取号中……';
    
    // Start a new number scroll
    setTimeout(startNumberScroll, 500);
}

// Handle keyboard input for desktop users
function handleKeydown(event) {
    // Only handle keyboard input on the password screen
    if (!passwordScreen.classList.contains('active')) return;
    
    const key = event.key;
    
    // Handle number keys
    if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        const numberKey = document.querySelector(`.key[data-number="${key}"]`);
        if (numberKey) numberKey.click();
    }
    // Handle Enter key (verify)
    else if (key === 'Enter' && currentPassword.length === 6) {
        event.preventDefault();
        verifyPassword();
    }
    // Handle Backspace (delete)
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLastDigit();
    }
    // Handle Escape (clear)
    else if (key === 'Escape') {
        event.preventDefault();
        clearPassword();
    }
}

// Easing function for smooth deceleration
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Add shake animation for error feedback
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .dot.shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
`;
document.head.appendChild(shakeStyle);

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);