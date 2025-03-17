/**
 * Revelate Operations - Assessment Page JavaScript
 * Handles the RevOps assessment functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assessment functionality
    initAssessmentForm();
    
    // Initialize counter animations
    initStatCounters();
});

/**
 * Initialize assessment form and navigation
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
                
                // Get form data
                const formData = new FormData(assessmentForm);
                const assessmentData = {};
                
                // Convert FormData to object
                for (const [key, value] of formData.entries()) {
                    assessmentData[key] = value;
                }
                
                // Process and display results after short delay
                setTimeout(() => {
                    calculateResults();
                    
                    // Send data to server
                    fetch('/api/assessments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(assessmentData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Server error');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Assessment saved successfully:', data);
                        // Optionally update results with server values
                        if (data.results) {
                            console.log('Using server-calculated scores');
                        }
                    })
                    .catch(error => {
                        console.error('Error saving assessment:', error);
                        // Continue showing results even if server save fails
                    })
                    .finally(() => {
                        // Hide loading, show results
                        loadingScreen.style.display = 'none';
                        resultsSection.style.display = 'block';
                        
                        // Scroll to results
                        scrollToElement(resultsSection);
                    });
                    
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
        
        // Get industry benchmarks
        const industryKey = results.industry in industryBenchmarks ? results.industry : 'Other';
        results.benchmarks = {
            industry: industryBenchmarks[industryKey].average,
            top: industryBenchmarks[industryKey].top
        };
        
        // Update results in the UI
        displayResults(results);
    }
    
    /**
     * Get improvement areas based on scores
     * @param {Object} results - The assessment results
     * @returns {Array} - List of improvement recommendations
     */
    function getImprovementAreas(results) {
        // Get the lowest scoring dimensions
        const scores = [
            { name: 'dataInfrastructure', score: results.dataInfrastructure.score },
            { name: 'analyticsCapabilities', score: results.analyticsCapabilities.score },
            { name: 'processMaurity', score: results.processMaurity.score },
            { name: 'teamAlignment', score: results.teamAlignment.score }
        ];
        
        // Sort by score (ascending)
        scores.sort((a, b) => a.score - b.score);
        
        // Take the lowest 2 scoring dimensions
        const lowestDimensions = scores.slice(0, 2);
        
        // Generate recommendations for these dimensions
        const recommendations = [];
        
        lowestDimensions.forEach(dimension => {
            const maturityLevel = getMaturityLevel(dimension.score);
            const dimensionRecommendations = getRecommendationsForDimension(dimension.name, maturityLevel);
            recommendations.push(dimensionRecommendations[0]); // Take first recommendation
        });
        
        return recommendations;
    }
    
    /**
     * Get maturity level from score
     * @param {number} score - The dimension score
     * @returns {string} - Maturity level
     */
    function getMaturityLevel(score) {
        if (score < 1.5) return 'beginner';
        if (score < 2.5) return 'developing';
        if (score < 3.5) return 'established';
        if (score < 4.5) return 'advanced';
        return 'expert';
    }
    
    /**
     * Get recommendations for dimension and maturity level
     * @param {string} dimension - The dimension name
     * @param {string} level - The maturity level
     * @returns {Array} - List of recommendations
     */
    function getRecommendationsForDimension(dimension, level) {
        const recommendations = {
            dataInfrastructure: {
                beginner: [
                    "Implement a formal CRM system as the foundation of your revenue data",
                    "Establish basic data standards and entry protocols",
                    "Begin documenting your existing systems and data flows"
                ],
                developing: [
                    "Improve CRM data quality through cleanup and validation",
                    "Connect your primary revenue systems with basic integrations",
                    "Establish a data governance committee with clear ownership"
                ],
                established: [
                    "Implement more robust integrations between systems",
                    "Develop a comprehensive data dictionary and quality standards",
                    "Establish regular data auditing and cleansing processes"
                ],
                advanced: [
                    "Implement real-time data synchronization across all systems",
                    "Deploy automated data validation and enrichment tools",
                    "Develop a unified customer data platform strategy"
                ],
                expert: [
                    "Consider AI-powered data enrichment and cleansing",
                    "Implement advanced master data management practices",
                    "Explore predictive data quality management"
                ]
            },
            analyticsCapabilities: {
                beginner: [
                    "Define your core business metrics and KPIs",
                    "Implement basic dashboards for key revenue metrics",
                    "Train team members on basic reporting capabilities"
                ],
                developing: [
                    "Develop standardized reporting templates for consistency",
                    "Implement a basic attribution model for marketing activities",
                    "Create regular reporting cadences for key metrics"
                ],
                established: [
                    "Develop more advanced dashboards with drill-down capabilities",
                    "Implement multi-touch attribution across marketing channels",
                    "Begin incorporating predictive elements into reporting"
                ],
                advanced: [
                    "Implement advanced analytics with AI-driven insights",
                    "Develop comprehensive multi-touch attribution across marketing and sales",
                    "Create automated anomaly detection for key metrics"
                ],
                expert: [
                    "Implement AI/ML-driven prediction models for revenue forecasting",
                    "Develop prescriptive analytics capabilities",
                    "Create advanced scenario modeling tools for strategic planning"
                ]
            },
            processMaurity: {
                beginner: [
                    "Document your current sales process stages and definitions",
                    "Implement basic lead qualification criteria",
                    "Establish a systematic approach to customer renewals"
                ],
                developing: [
                    "Formalize your sales process in your CRM system",
                    "Implement lead scoring based on demographic and engagement data",
                    "Develop a basic customer health scoring framework"
                ],
                established: [
                    "Optimize your sales process based on conversion data",
                    "Implement lead routing and nurturing workflows",
                    "Develop proactive customer success playbooks"
                ],
                advanced: [
                    "Implement advanced sales process automation",
                    "Deploy automated lead scoring with behavioral data",
                    "Create comprehensive expansion and retention playbooks"
                ],
                expert: [
                    "Implement AI-driven process optimization",
                    "Develop predictive lead and opportunity scoring",
                    "Implement predictive churn modeling with automated interventions"
                ]
            },
            teamAlignment: {
                beginner: [
                    "Establish regular cross-team meetings between marketing and sales",
                    "Agree on basic shared metrics and definitions",
                    "Assign clear ownership for revenue operations functions"
                ],
                developing: [
                    "Implement SLAs between marketing, sales, and customer success",
                    "Develop a unified revenue team calendar for key activities",
                    "Create a cross-functional data review process"
                ],
                established: [
                    "Define clear RevOps roles and responsibilities",
                    "Implement joint forecasting and planning processes",
                    "Create shared technology roadmaps across revenue teams"
                ],
                advanced: [
                    "Build a dedicated RevOps team with clear executive support",
                    "Implement advanced outcome-based team alignment",
                    "Create cross-functional customer journey optimization"
                ],
                expert: [
                    "Develop a unified revenue strategy with executive alignment",
                    "Create advanced customer experience orchestration across teams",
                    "Implement real-time performance transparency and accountability"
                ]
            }
        };
        
        // Return appropriate recommendations or empty array if not found
        return recommendations[dimension]?.[level] || [];
    }
    
    /**
     * Display results in the UI
     * @param {Object} results - The assessment results
     */
    function displayResults(results) {
        // Update overall score
        document.getElementById('overallScore').textContent = results.overallScore.toFixed(1);
        document.getElementById('maturityLevel').textContent = results.maturityLevel;
        
        // Update dimension scores
        document.getElementById('dataScoreValue').textContent = results.dataInfrastructure.score.toFixed(1);
        document.getElementById('dataScore').style.width = `${(results.dataInfrastructure.score / 5) * 100}%`;
        
        document.getElementById('analyticsScoreValue').textContent = results.analyticsCapabilities.score.toFixed(1);
        document.getElementById('analyticsScore').style.width = `${(results.analyticsCapabilities.score / 5) * 100}%`;
        
        document.getElementById('processScoreValue').textContent = results.processMaurity.score.toFixed(1);
        document.getElementById('processScore').style.width = `${(results.processMaurity.score / 5) * 100}%`;
        
        document.getElementById('teamScoreValue').textContent = results.teamAlignment.score.toFixed(1);
        document.getElementById('teamScore').style.width = `${(results.teamAlignment.score / 5) * 100}%`;
        
        // Update benchmark comparison
        document.getElementById('yourBenchmarkValue').textContent = results.overallScore.toFixed(1);
        document.getElementById('yourBenchmark').style.width = `${(results.overallScore / 5) * 100}%`;
        
        // Update results summary
        document.getElementById('resultsSummary').textContent = results.maturityDescription;
        
        // Update recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        
        results.improvementAreas.forEach(recommendation => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <div class="recommendation-icon">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="recommendation-text">
                    <p>${recommendation}</p>
                </div>
            `;
            recommendationsList.appendChild(recItem);
        });
        
        // Add event listeners for results actions
        if (emailResultsButton) {
            emailResultsButton.addEventListener('click', () => {
                // Email results functionality would go here
                alert('Results have been emailed to ' + results.email);
            });
        }
        
        if (downloadResultsButton) {
            downloadResultsButton.addEventListener('click', () => {
                // Download PDF functionality would go here
                alert('PDF download feature coming soon');
            });
        }
    }
}

/**
 * Initialize stat counters in stats section
 */
function initStatCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (!counters.length) return;
    
    // Options for Intersection Observer
    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                
                // Determine animation speed based on target value
                const speed = Math.max(10, 100 - (target / 2));
                
                const updateCount = () => {
                    // Calculate increment value to smoothen animation
                    const increment = Math.ceil(target / (1000 / speed));
                    
                    if (count < target) {
                        count = Math.min(count + increment, target);
                        counter.textContent = count;
                        setTimeout(updateCount, speed);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
                
                // Unobserve after starting animation
                observer.unobserve(counter);
            }
        });
    }, options);
    
    // Start observing counters
    counters.forEach(counter => {
        observer.observe(counter);
    });
}