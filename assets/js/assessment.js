// RevOps Assessment Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const assessmentForm = document.getElementById('revopsAssessment');
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
    
    // Recommendations by maturity level and dimension
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
                "Develop a structured forecasting process with regular reviews",
                "Create a dedicated RevOps function, even if part-time"
            ],
            established: [
                "Align compensation and incentives across revenue teams",
                "Implement a more advanced forecasting methodology",
                "Develop a dedicated RevOps team with clear charter"
            ],
            advanced: [
                "Consider reorganizing into a unified revenue operations structure",
                "Implement advanced forecasting with multiple data inputs",
                "Elevate RevOps leadership to strategic level with cross-functional authority"
            ],
            expert: [
                "Implement full organizational alignment around customer journey",
                "Deploy AI/ML forecasting with scenario planning",
                "Position RevOps leadership at executive level with strategic influence"
            ]
        }
    };
    
    // Update progress bar
    function updateProgress() {
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        progressSteps.forEach((step, index) => {
            if (index + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Validate current step
    function validateStep(stepNumber) {
        const currentStepElement = document.querySelector(`.assessment-step[data-step="${stepNumber}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Reset previous validation feedback
            const feedbackElement = field.closest('.form-group, .question-item').querySelector('.form-feedback');
            feedbackElement.textContent = '';
            
            // Check if field is radio button group
            if (field.type === 'radio') {
                const name = field.name;
                const checkedRadio = currentStepElement.querySelector(`input[name="${name}"]:checked`);
                
                if (!checkedRadio) {
                    isValid = false;
                    const questionItem = field.closest('.question-item');
                    const feedbackElement = questionItem.querySelector('.form-feedback');
                    feedbackElement.textContent = 'Please select an option';
                }
            } 
            // Check text, email, or select inputs
            else if (field.value.trim() === '') {
                isValid = false;
                const feedbackElement = field.closest('.form-group').querySelector('.form-feedback');
                feedbackElement.textContent = 'This field is required';
            }
            // Email validation
            else if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                const feedbackElement = field.closest('.form-group').querySelector('.form-feedback');
                feedbackElement.textContent = 'Please enter a valid email address';
            }
        });
        
        return isValid;
    }
    
    // Validate email format
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Navigate to specific step
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
        assessmentForm.scrollIntoView({ behavior: 'smooth' });
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
                loadingScreen.style.display = 'block';
                
                // Simulate processing (remove in production and replace with actual submission)
                setTimeout(() => {
                    calculateResults();
                    
                    // Hide loading, show results
                    loadingScreen.style.display = 'none';
                    resultsSection.style.display = 'block';
                    
                    // Scroll to results
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                }, 1500);
            }
        });
    }
    
    // Calculate assessment results
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
        
        // Determine dimension maturity levels
        const dimensionMaturity = (score) => {
            if (score < 1.5) return 'beginner';
            if (score < 2.5) return 'developing';
            if (score < 3.5) return 'established';
            if (score < 4.5) return 'advanced';
            return 'expert';
        };
        
        results.dataInfrastructure.level = dimensionMaturity(results.dataInfrastructure.score);
        results.analyticsCapabilities.level = dimensionMaturity(results.analyticsCapabilities.score);
        results.processMaurity.level = dimensionMaturity(results.processMaurity.score);
        results.teamAlignment.level = dimensionMaturity(results.teamAlignment.score);
        
        // Get recommendations based on dimension levels
        results.recommendations = [
            recommendations.dataInfrastructure[results.dataInfrastructure.level][0],
            recommendations.analyticsCapabilities[results.analyticsCapabilities.level][0],
            recommendations.processMaurity[results.processMaurity.level][0],
            recommendations.teamAlignment[results.teamAlignment.level][0]
        ];
        
        // Get industry benchmarks
        const industryKey = results.industry in industryBenchmarks ? results.industry : 'Other';
        results.benchmarks = {
            industry: industryBenchmarks[industryKey].average,
            top: industryBenchmarks[industryKey].top
        };
        
        // Update results in the UI
        displayResults(results);
    }
    
    // Display results in the UI
    function displayResults(results) {
        // Update overall score and level
        document.getElementById('overallScore').textContent = results.overallScore.toFixed(1);
        document.getElementById('maturityLevel').textContent = results.maturityLevel;
        
        // Update dimension scores
        document.getElementById('dataScoreValue').textContent = results.dataInfrastructure.score.toFixed(1);
        document.getElementById('dataScore').style.width = `${results.dataInfrastructure.score * 20}%`;
        
        document.getElementById('analyticsScoreValue').textContent = results.analyticsCapabilities.score.toFixed(1);
        document.getElementById('analyticsScore').style.width = `${results.analyticsCapabilities.score * 20}%`;
        
        document.getElementById('processScoreValue').textContent = results.processMaurity.score.toFixed(1);
        document.getElementById('processScore').style.width = `${results.processMaurity.score * 20}%`;
        
        document.getElementById('teamScoreValue').textContent = results.teamAlignment.score.toFixed(1);
        document.getElementById('teamScore').style.width = `${results.teamAlignment.score * 20}%`;
        
        // Update summary
        document.getElementById('resultsSummary').textContent = results.maturityDescription;
        
        // Update recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        results.recommendations.forEach(recommendation => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <i class="fas fa-lightbulb"></i>
                <p>${recommendation}</p>
            `;
            recommendationsList.appendChild(recItem);
        });
        
        // Update benchmark comparison
        document.getElementById('yourBenchmarkValue').textContent = results.overallScore.toFixed(1);
        document.getElementById('yourBenchmark').style.width = `${results.overallScore * 20}%`;
        
        // Store results in sessionStorage for email/download
        sessionStorage.setItem('assessmentResults', JSON.stringify(results));
    }
    
    // Handle email results button
    if (emailResultsButton) {
        emailResultsButton.addEventListener('click', function() {
            const results = JSON.parse(sessionStorage.getItem('assessmentResults'));
            if (!results) return;
            
            // In a real implementation, this would make an AJAX call to send email
            alert(`Thank you, ${results.fullName}! Your results have been emailed to ${results.email}.`);
        });
    }
    
    // Handle download results button
    if (downloadResultsButton) {
        downloadResultsButton.addEventListener('click', function() {
            const results = JSON.parse(sessionStorage.getItem('assessmentResults'));
            if (!results) return;
            
            // In a real implementation, this would generate and download a PDF
            alert(`Generating PDF report for ${results.companyName}. Your download will begin shortly.`);
        });
    }
    
    // Initialize progress bar
    updateProgress();
    
    // Make progress steps clickable for navigation (if already completed)
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const stepNumber = index + 1;
            if (stepNumber < currentStep) {
                goToStep(stepNumber);
            }
        });
    });
});
