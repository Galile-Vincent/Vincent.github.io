// Form submission handling
const form = document.getElementById('application-form');
const successMessage = document.getElementById('success-message');

// Toggle Intro Function
function toggleIntro() {
    const introContent = document.querySelector('.intro-content');
    introContent.classList.toggle('collapsed');
    introContent.classList.toggle('expanded');
}

// Helper function to show error
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('has-error');

    // Remove existing error message if any
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    input.parentNode.insertBefore(errorDiv, input.nextSibling);

    // Scroll to error
    formGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove error on input
    input.addEventListener('input', function () {
        formGroup.classList.remove('has-error');
        const error = formGroup.querySelector('.error-message');
        if (error) {
            error.classList.remove('show');
            setTimeout(() => error.remove(), 300);
        }
    }, { once: true });
}

// Helper function to clear all errors
function clearErrors() {
    document.querySelectorAll('.form-group.has-error').forEach(group => {
        group.classList.remove('has-error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
}

if (form) {
    // Real-time validation for URL fields
    const urlInput = document.getElementById('resume');
    if (urlInput) {
        urlInput.addEventListener('blur', function () {
            if (this.value && !this.validity.valid) {
                showError(this, 'Please enter a valid URL (e.g., https://example.com)');
            }
        });
    }

    // Real-time validation for email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            if (this.value && !this.validity.valid) {
                showError(this, 'Please enter a valid email address');
            }
        });
    }

    // Device selection logic (None vs Others)
    const deviceCheckboxes = document.querySelectorAll('input[name="devices"]');
    deviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.value === 'None') {
                if (this.checked) {
                    // If None is checked, uncheck all others
                    deviceCheckboxes.forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });
                }
            } else {
                if (this.checked) {
                    // If any other device is checked, uncheck None
                    const noneCheckbox = document.querySelector('input[name="devices"][value="None"]');
                    if (noneCheckbox) noneCheckbox.checked = false;
                }
            }
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearErrors();

        // Validate all required fields
        let hasError = false;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                hasError = true;
            } else if (!field.validity.valid) {
                if (field.type === 'email') {
                    showError(field, 'Please enter a valid email address');
                } else if (field.type === 'url') {
                    showError(field, 'Please enter a valid URL (e.g., https://example.com)');
                } else {
                    showError(field, 'Please check this field');
                }
                hasError = true;
            }
        });

        // Validate checkboxes (AI tools only - devices are optional)
        const aiTools = document.querySelectorAll('input[name="ai-tools"]:checked');

        if (aiTools.length === 0) {
            const aiToolsGroup = document.querySelector('input[name="ai-tools"]').closest('.form-group');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.textContent = 'Please select at least one AI tool you are using';
            aiToolsGroup.querySelector('.checkbox-group').parentNode.insertBefore(errorDiv, aiToolsGroup.querySelector('.checkbox-group').nextSibling);
            aiToolsGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        try {
            // Create FormData object
            const formData = new FormData(form);

            // Convert FormData to JSON object for n8n
            const jsonData = {};
            formData.forEach((value, key) => {
                // Handle multiple values (checkboxes)
                if (jsonData[key]) {
                    if (Array.isArray(jsonData[key])) {
                        jsonData[key].push(value);
                    } else {
                        jsonData[key] = [jsonData[key], value];
                    }
                } else {
                    jsonData[key] = value;
                }
            });

            // Submit to n8n webhook
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (response.ok) {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                alert('There was an error submitting your application. Please try again.');

                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your application. Please try again or contact Vincent directly.');

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Smooth scroll for page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe form groups for animation
document.querySelectorAll('.form-group').forEach(group => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(group);
});
