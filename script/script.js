document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const errorDiv = document.getElementById('form-error');
    const responseDiv = document.getElementById('form-response');
    const messageInput = document.getElementById('message');
    const wordCountDisplay = document.getElementById('word-count');
    const phoneInput = document.getElementById('phone');
    const countrySelect = document.getElementById('country-code'); // Country dropdown

    // Initialize intl-tel-input plugin
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: countrySelect.value, // Set initial country based on dropdown
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input/build/js/utils.js" // For validation and formatting
    });

    // Update the phone input field when a country is selected
    countrySelect.addEventListener('change', function() {
        const countryCode = countrySelect.options[countrySelect.selectedIndex].dataset.countryCode;
        iti.setCountry(countryCode);
    });

    // Function to count words and enforce the 1000-word limit
    function updateWordCount() {
        const text = messageInput.value.trim();
        const wordArray = text.split(/\s+/).filter(function(word) {
            return word.length > 0; // Filter out empty words (e.g., extra spaces)
        });
        const wordCount = wordArray.length;

        const maxWords = 1000;

        // If word count exceeds max limit, prevent user from typing more
        if (wordCount > maxWords) {
            wordCountDisplay.textContent = `Word count: ${maxWords} / ${maxWords} (Maximum reached)`;
            messageInput.value = wordArray.slice(0, maxWords).join(' '); // Trim the message to 1000 words
        } else {
            wordCountDisplay.textContent = `Word count: ${wordCount} / ${maxWords}`;
        }
    }

    // Event listener for input to update word count and prevent exceeding limit
    messageInput.addEventListener('input', updateWordCount);

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        errorDiv.innerHTML = ''; // Clear previous errors
        responseDiv.innerHTML = ''; // Clear previous responses

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = messageInput.value.trim();
        const phoneNumber = phoneInput.value.trim();

        // Validate required fields
        let errors = [];
        if (name === '') errors.push('Full Name is required.');
        if (email === '') errors.push('Email Address is required.');
        else {
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) errors.push('Please enter a valid email address.');
        }
        if (message === '') errors.push('Message is required.');
        if (!iti.isValidNumber()) errors.push('Please enter a valid phone number.');

        // Display errors if there are any
        if (errors.length > 0) {
            errorDiv.innerHTML = errors.join('<br>');
            return;
        }

        // Proceed with AJAX submission if validation passes
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '../PHP/server.php', true); // Replace with your server URL
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                responseDiv.innerHTML = '<div class="alert alert-success">Message sent successfully!</div>';
                form.reset();
                updateWordCount();  // Reset word count after submission
            } else {
                responseDiv.innerHTML = '<div class="alert alert-danger">Error sending message. Please try again.</div>';
            }
        };

        xhr.onerror = function() {
            responseDiv.innerHTML = '<div class="alert alert-danger">Network error. Please try again later.</div>';
        };

        // Send the form data
        const formData = `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}&phone=${encodeURIComponent(phoneNumber)}`;
        xhr.send(formData);
    });
});
