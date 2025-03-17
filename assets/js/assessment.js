/**
 * Revelate Operations - Assessment Page JavaScript
 * This file handles the RevOps assessment functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assessment page functionality
    initAssessmentForm();
    initFaqAccordion();
    initStatCounters();
});

/**
 * Initialize assessment form functionality
 */
function initAssessmentForm() {
    // Cache DOM elements
    const assessmentForm = document.getElementById('revopsAssessment');
    if (!assessmentForm) return;

    const assessmentSteps = document.querySelectorAll('.assessment-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.querySelector('.progress-fill');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const submitButton = document.querySelector('.submit-assessment');
    const loadingScreen = document.querySelector('.assessment-loading');
    const resultsSection = document.querySelector('.assessment-results');
    const emailResultsButton = document.getElementById('emailResults');
    const downloadResultsButton = document.getElementById('downloadResults');
    
    // Initialize variables
    let currentStep = 1;
    const totalSteps = assessmentSteps.length;
    
    // Industry benchmarks data
    const industryBenchmarks = {
        'SaaS': { average: 3.25, top: 4.5 },
        'Technology': { average: 3.4, top: 4.6 },
        'Financial Services': { average: 3.1, top: 4.3 },
        'Healthcare': { average: 2.9, top: 4.1 },
        'Manufacturing': { average: 2.7, top: 3.9 },
        'Retail': { average: 2.8, top: 4.0 },
        'Professional Services': { average: 3.0, top: 4.2 },
        'Education': { average: 2.5, top: 3.8 },
        'Nonprofit': { average: 2.3, top: 3.5 },
        'Other': { average: 2.9, top: 4.0 }
    };

    /**
     * Update progress bar and step indicators
     */
    function updateProgress() {
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    /**
     * Validate current step
     * @param {number} stepNumber - Step to validate
     * @returns {boolean} - Whether step is valid
     */
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.assessment-step[data-step="${stepNumber}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Reset previous validation feedback
            const feedbackElement = field.closest('.form-group, .question-item').querySelector('.form-feedback');
            if (feedbackElement) {
                feedbackElement.textContent = '';
                feedbackElement.style.display = 'none';
            }
            
            if (field.classList.contains('is-invalid')) {
                field.classList.remove('is-invalid');
            }
            
            const questionItem = field.closest('.question-item');
            if (questionItem && questionItem.classList.contains('error')) {
                questionItem.classList.remove('error');
            }
            
            // Check if field is radio button group
            if (field.type === 'radio') {
                const name = field.name;
                const checkedRadio = currentStepElement.querySelector(`input[name="${name}"]:checked`);
                
                if (!checkedRadio) {
                    isValid = false;
                    const questionItem = field.closest('.question-item');
                    const feedbackElement = questionItem.querySelector('.form-feedback');
                    if (feedbackElement) {
                        feedbackElement.textContent = 'Please select an option';
                        feedbackElement.style.display = 'block';
                    }
                    questionItem.classList.add('error');
                }
            } 
            // Check text, email, or select inputs
            else if (field.value.trim() === '') {
                isValid = false;
                field.classList.add('is-invalid');
                const feedbackElement = field.closest('.form-group').querySelector('.form-feedback');
                if (feedbackElement) {
                    feedbackElement.textContent = 'This field is required';
                    feedbackElement.style.display = 'block';
                }
            }
            // Email validation
            else if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                field.classList.add('is-invalid');
                const feedbackElement = field.closest('.form-group').querySelector('.form-feedback');
                if (feedbackElement) {
                    feedbackElement.textContent = 'Please enter a valid email address';
                    feedbackElement.style.display = 'block';
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Navigate to specific step
     * @param {number} stepNumber - Step to navigate to
     */
    function goToStep(stepNumber) {
        // Hide all steps
        assessmentSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        document.querySelector(`.assessment-step[data-step="${stepNumber}"]`).classList.add('active');
        
        // Update current step and progress
        currentStep = stepNumber;
        updateProgress();
        
        // Scroll to top of form
        scrollToElement(assessmentForm);
    }
    
    /**
     * Scroll to element with smooth scrolling
     * @param {HTMLElement} element - Element to scroll to
     */
    function scrollToElement(element) {
        if (!element) return;
        
        const headerOffset = 100; // Adjust for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });
    
    // Handle form submission
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                // Show loading screen
                assessmentForm.style.display = 'none';
                loadingScreen.style.display = 'flex';
                
                // Process and display results after short delay
                setTimeout(() => {
                    calculateResults();
                    
                    // Hide loading, show results
                    loadingScreen.style.display = 'none';
                    resultsSection.style.display = 'block';
                    
                    // Scroll to results
                    scrollToElement(resultsSection);
                }, 2000);
            }
        });
    }
    
    /**
     * Calculate assessment results
     */
    function calculateResults() {
        // Get form data
        const formData = new FormData(assessmentForm);
        const results = {
            // Personal info
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            companyName: formData.get('companyName'),
            jobTitle: formData.get('jobTitle'),
            industry: formData.get('industry'),
            companySize: formData.get('companySize'),
            
            // Calculate dimension scores
            dataInfrastructure: {
                score: (
                    parseInt(formData.get('crmImplementation') || 0) +
                    parseInt(formData.get('systemIntegration') || 0) +
                    parseInt(formData.get('dataQuality') || 0)
                ) / 3
            },
            analyticsCapabilities: {
                score: (
                    parseInt(formData.get('analyticsCapabilities') || 0) +
                    parseInt(formData.get('revenueAttribution') || 0) +
                    parseInt(formData.get('dataDrivenDecisions') || 0)
                ) / 3
            },
            processMaurity: {
                score: (
                    parseInt(formData.get('salesProcess') || 0) +
                    parseInt(formData.get('leadProcess') || 0) +
                    parseInt(formData.get('retentionProcess') || 0)
                ) / 3
            },
            teamAlignment: {
                score: (
                    parseInt(formData.get('teamAlignment') || 0) +
                    parseInt(formData.get('revenueForecasting') || 0) +
                    parseInt(formData.get('revopsLeadership') || 0)
                ) / 3
            }
        };
        
        // Calculate overall score
        results.overallScore = (
            results.dataInfrastructure.score +
            results.analyticsCapabilities.score +
            results.processMaurity.score +
            results.teamAlignment.score
        ) / 4;
        
        // Determine maturity level
        if (results.overallScore < 1.5) {
            results.maturityLevel = 'Beginner';
            results.maturityDescription = 'Your organization is in the early stages of Revenue Operations development. There are significant opportunities to establish foundational elements that will drive growth.';
        } else if (results.overallScore < 2.5) {
            results.maturityLevel = 'Developing';
            results.maturityDescription = 'Your organization has established some Revenue Operations fundamentals but has room to enhance processes, data infrastructure, and team alignment.';
        } else if (results.overallScore < 3.5) {
            results.maturityLevel = 'Established';
            results.maturityDescription = 'Your organization has solid Revenue Operations practices in place. Focus on optimization and automation to further enhance performance.';
        } else if (results.overallScore < 4.5) {
            results.maturityLevel = 'Advanced';
            results.maturityDescription = 'Your organization demonstrates sophisticated Revenue Operations capabilities. Continue refining strategies and exploring innovative approaches.';
        } else {
            results.maturityLevel = 'Expert';
            results.maturityDescription = 'Your organization exemplifies Revenue Operations excellence with industry-leading practices. Focus on maintaining your advantage through continuous innovation.';
        }
        
        // Determine the most critical improvement areas
        results.improvementAreas = getImprovementAreas(results);
        
        // Get
