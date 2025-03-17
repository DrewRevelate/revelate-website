// RevOps Assessment Tool
// This script initializes the RevOps Maturity Assessment tool

document.addEventListener('DOMContentLoaded', function() {
  // Find the container for the assessment
  const assessmentContainer = document.getElementById('assessment-container');
  if (!assessmentContainer) return;

  // Create assessment structure
  createAssessmentUI(assessmentContainer);
  
  // Initialize event listeners and functionality
  initializeAssessment();
});

// Helper function to create the UI structure
function createAssessmentUI(container) {
  // Create the assessment HTML structure
  container.innerHTML = `
    <div class="assessment-wrapper">
      <!-- Progress indicators -->
      <div class="assessment-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
        <div class="progress-steps">
          <div class="step active" data-step="intro">
            <div class="step-number">1</div>
            <div class="step-label">About You</div>
          </div>
          <div class="step" data-step="data">
            <div class="step-number">2</div>
            <div class="step-label">Data Management</div>
          </div>
          <div class="step" data-step="process">
            <div class="step-number">3</div>
            <div class="step-label">Process Optimization</div>
          </div>
          <div class="step" data-step="alignment">
            <div class="step-number">4</div>
            <div class="step-label">Cross-Functional Alignment</div>
          </div>
          <div class="step" data-step="technology">
            <div class="step-number">5</div>
            <div class="step-label">Technology Stack</div>
          </div>
          <div class="step" data-step="analytics">
            <div class="step-number">6</div>
            <div class="step-label">Analytics & Insights</div>
          </div>
          <div class="step" data-step="results">
            <div class="step-number">7</div>
            <div class="step-label">Results</div>
          </div>
        </div>
      </div>

      <!-- Section header -->
      <div class="section-header">
        <h3 id="section-title" class="section-title">About You</h3>
        <p id="section-description" class="section-description">Help us personalize your assessment results</p>
      </div>

      <!-- Content sections -->
      <div class="assessment-content">
        <!-- Intro Section (User Info Form) -->
        <div id="intro-section" class="assessment-section active">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" class="form-control" placeholder="John Smith">
          </div>
          <div class="form-group">
            <label for="email">Work Email</label>
            <input type="email" id="email" name="email" class="form-control" placeholder="john@company.com">
          </div>
          <div class="form-group">
            <label for="company">Company Name</label>
            <input type="text" id="company" name="company" class="form-control" placeholder="Acme Inc.">
          </div>
          <div class="form-group">
            <label for="role">Your Role</label>
            <select id="role" name="role" class="form-control">
              <option value="">Select your role</option>
              <option value="C-Level Executive">C-Level Executive</option>
              <option value="VP / Director">VP / Director</option>
              <option value="Manager">Manager</option>
              <option value="RevOps Professional">RevOps Professional</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Customer Success">Customer Success</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="privacy-note">
            <p>Your information will be used to personalize your assessment results. We respect your privacy and will not share your information with third parties.</p>
          </div>
        </div>

        <!-- Data Management Section -->
        <div id="data-section" class="assessment-section">
          <div class="question">
            <h4>1. How would you rate the quality and consistency of your customer and revenue data?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="data_quality">
                <div class="option-radio"></div>
                <div class="option-text">Our data is largely incomplete and inconsistent across systems</div>
              </div>
              <div class="option" data-value="2" data-question="data_quality">
                <div class="option-radio"></div>
                <div class="option-text">We have reasonable data in some systems, but significant quality issues exist</div>
              </div>
              <div class="option" data-value="3" data-question="data_quality">
                <div class="option-radio"></div>
                <div class="option-text">Our data is generally reliable, with occasional inconsistencies</div>
              </div>
              <div class="option" data-value="4" data-question="data_quality">
                <div class="option-radio"></div>
                <div class="option-text">We maintain high-quality data with established governance processes</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>2. How well integrated are your various data sources and systems?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="data_integration">
                <div class="option-radio"></div>
                <div class="option-text">Our systems are largely siloed with manual data transfers</div>
              </div>
              <div class="option" data-value="2" data-question="data_integration">
                <div class="option-radio"></div>
                <div class="option-text">We have some basic integrations, but many manual processes remain</div>
              </div>
              <div class="option" data-value="3" data-question="data_integration">
                <div class="option-radio"></div>
                <div class="option-text">Most key systems are integrated with some automated data flows</div>
              </div>
              <div class="option" data-value="4" data-question="data_integration">
                <div class="option-radio"></div>
                <div class="option-text">We have a well-integrated tech stack with automated data synchronization</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>3. How accessible is critical business data to stakeholders who need it?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="data_access">
                <div class="option-radio"></div>
                <div class="option-text">Data access requires IT involvement or specialized technical skills</div>
              </div>
              <div class="option" data-value="2" data-question="data_access">
                <div class="option-radio"></div>
                <div class="option-text">Basic reports are available, but custom insights require technical expertise</div>
              </div>
              <div class="option" data-value="3" data-question="data_access">
                <div class="option-radio"></div>
                <div class="option-text">Most teams have self-service access to the data they need</div>
              </div>
              <div class="option" data-value="4" data-question="data_access">
                <div class="option-radio"></div>
                <div class="option-text">Comprehensive self-service analytics with appropriate governance</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Optimization Section -->
        <div id="process-section" class="assessment-section">
          <div class="question">
            <h4>1. To what extent have you automated your key revenue processes?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="process_automation">
                <div class="option-radio"></div>
                <div class="option-text">Mostly manual processes with minimal automation</div>
              </div>
              <div class="option" data-value="2" data-question="process_automation">
                <div class="option-radio"></div>
                <div class="option-text">Basic automation for simple tasks, but most work is manual</div>
              </div>
              <div class="option" data-value="3" data-question="process_automation">
                <div class="option-radio"></div>
                <div class="option-text">Significant automation of routine processes and workflows</div>
              </div>
              <div class="option" data-value="4" data-question="process_automation">
                <div class="option-radio"></div>
                <div class="option-text">Comprehensive automation with exception handling and monitoring</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>2. How visible is your end-to-end customer journey across teams?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="process_visibility">
                <div class="option-radio"></div>
                <div class="option-text">Limited visibility with each team working in isolation</div>
              </div>
              <div class="option" data-value="2" data-question="process_visibility">
                <div class="option-radio"></div>
                <div class="option-text">Some shared visibility at key handoff points between teams</div>
              </div>
              <div class="option" data-value="3" data-question="process_visibility">
                <div class="option-radio"></div>
                <div class="option-text">Good visibility across most of the customer journey</div>
              </div>
              <div class="option" data-value="4" data-question="process_visibility">
                <div class="option-radio"></div>
                <div class="option-text">Complete visibility with real-time tracking and alerting</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>3. How do you approach continuous improvement of your revenue processes?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="process_optimization">
                <div class="option-radio"></div>
                <div class="option-text">Reactive changes when problems become significant</div>
              </div>
              <div class="option" data-value="2" data-question="process_optimization">
                <div class="option-radio"></div>
                <div class="option-text">Occasional review and updates based on team feedback</div>
              </div>
              <div class="option" data-value="3" data-question="process_optimization">
                <div class="option-radio"></div>
                <div class="option-text">Regular process reviews with defined improvement cycles</div>
              </div>
              <div class="option" data-value="4" data-question="process_optimization">
                <div class="option-radio"></div>
                <div class="option-text">Data-driven optimization with measurable performance targets</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cross-Functional Alignment Section -->
        <div id="alignment-section" class="assessment-section">
          <div class="question">
            <h4>1. How aligned are goals and KPIs across marketing, sales, and customer success?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="goal_alignment">
                <div class="option-radio"></div>
                <div class="option-text">Each team has separate goals with little coordination</div>
              </div>
              <div class="option" data-value="2" data-question="goal_alignment">
                <div class="option-radio"></div>
                <div class="option-text">Some shared metrics, but priorities often conflict</div>
              </div>
              <div class="option" data-value="3" data-question="goal_alignment">
                <div class="option-radio"></div>
                <div class="option-text">Good alignment on key outcomes with some shared metrics</div>
              </div>
              <div class="option" data-value="4" data-question="goal_alignment">
                <div class="option-radio"></div>
                <div class="option-text">Fully aligned goals with cascading metrics and shared incentives</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>2. How effectively do your revenue teams collaborate on day-to-day operations?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="team_collaboration">
                <div class="option-radio"></div>
                <div class="option-text">Siloed teams with minimal cross-functional interaction</div>
              </div>
              <div class="option" data-value="2" data-question="team_collaboration">
                <div class="option-radio"></div>
                <div class="option-text">Ad-hoc collaboration when issues arise</div>
              </div>
              <div class="option" data-value="3" data-question="team_collaboration">
                <div class="option-radio"></div>
                <div class="option-text">Regular cross-team meetings with defined coordination points</div>
              </div>
              <div class="option" data-value="4" data-question="team_collaboration">
                <div class="option-radio"></div>
                <div class="option-text">Seamless collaboration with shared processes and tools</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>3. How smooth are the handoffs between different stages of your revenue process?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="handoff_quality">
                <div class="option-radio"></div>
                <div class="option-text">Frequently problematic with lost information and delays</div>
              </div>
              <div class="option" data-value="2" data-question="handoff_quality">
                <div class="option-radio"></div>
                <div class="option-text">Inconsistent quality with some friction points</div>
              </div>
              <div class="option" data-value="3" data-question="handoff_quality">
                <div class="option-radio"></div>
                <div class="option-text">Generally smooth with established handoff protocols</div>
              </div>
              <div class="option" data-value="4" data-question="handoff_quality">
                <div class="option-radio"></div>
                <div class="option-text">Highly efficient with clear ownership and accountability</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Stack Section -->
        <div id="technology-section" class="assessment-section">
          <div class="question">
            <h4>1. What is the level of adoption and utilization of your revenue tech stack?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="tech_adoption">
                <div class="option-radio"></div>
                <div class="option-text">Low adoption with many users working around systems</div>
              </div>
              <div class="option" data-value="2" data-question="tech_adoption">
                <div class="option-radio"></div>
                <div class="option-text">Moderate adoption of core features, many capabilities unused</div>
              </div>
              <div class="option" data-value="3" data-question="tech_adoption">
                <div class="option-radio"></div>
                <div class="option-text">Good adoption with most key features being utilized</div>
              </div>
              <div class="option" data-value="4" data-question="tech_adoption">
                <div class="option-radio"></div>
                <div class="option-text">High adoption with continuous training and optimization</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>2. How well does your technology stack support your business requirements?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="tech_capability">
                <div class="option-radio"></div>
                <div class="option-text">Significant capability gaps requiring manual workarounds</div>
              </div>
              <div class="option" data-value="2" data-question="tech_capability">
                <div class="option-radio"></div>
                <div class="option-text">Meets basic needs but lacks advanced capabilities</div>
              </div>
              <div class="option" data-value="3" data-question="tech_capability">
                <div class="option-radio"></div>
                <div class="option-text">Good alignment with current business requirements</div>
              </div>
              <div class="option" data-value="4" data-question="tech_capability">
                <div class="option-radio"></div>
                <div class="option-text">Comprehensive capabilities with room for future growth</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>3. How scalable is your technology infrastructure for future growth?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="tech_scalability">
                <div class="option-radio"></div>
                <div class="option-text">Already at capacity with performance issues</div>
              </div>
              <div class="option" data-value="2" data-question="tech_scalability">
                <div class="option-radio"></div>
                <div class="option-text">Can handle modest growth but with limitations</div>
              </div>
              <div class="option" data-value="3" data-question="tech_scalability">
                <div class="option-radio"></div>
                <div class="option-text">Scalable for significant growth with some adjustments</div>
              </div>
              <div class="option" data-value="4" data-question="tech_scalability">
                <div class="option-radio"></div>
                <div class="option-text">Highly scalable architecture designed for long-term growth</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics & Insights Section -->
        <div id="analytics-section" class="assessment-section">
          <div class="question">
            <h4>1. How would you characterize your reporting and analytics capabilities?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="reporting_quality">
                <div class="option-radio"></div>
                <div class="option-text">Basic static reports with limited insights</div>
              </div>
              <div class="option" data-value="2" data-question="reporting_quality">
                <div class="option-radio"></div>
                <div class="option-text">Standard reports with some ad-hoc analysis capabilities</div>
              </div>
              <div class="option" data-value="3" data-question="reporting_quality">
                <div class="option-radio"></div>
                <div class="option-text">Good analytics with trend analysis and some predictive insights</div>
              </div>
              <div class="option" data-value="4" data-question="reporting_quality">
                <div class="option-radio"></div>
                <div class="option-text">Advanced analytics with predictive modeling and prescriptive recommendations</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>2. How well defined are your key performance indicators (KPIs)?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="metric_definition">
                <div class="option-radio"></div>
                <div class="option-text">Inconsistent definitions with metrics tracked differently across teams</div>
              </div>
              <div class="option" data-value="2" data-question="metric_definition">
                <div class="option-radio"></div>
                <div class="option-text">Core metrics defined but calculation methods vary</div>
              </div>
              <div class="option" data-value="3" data-question="metric_definition">
                <div class="option-radio"></div>
                <div class="option-text">Well-defined metrics with standardized calculation methods</div>
              </div>
              <div class="option" data-value="4" data-question="metric_definition">
                <div class="option-radio"></div>
                <div class="option-text">Comprehensive metric framework with clear business alignment</div>
              </div>
            </div>
          </div>

          <div class="question">
            <h4>3. To what extent are business decisions data-driven within your organization?</h4>
            <div class="options">
              <div class="option" data-value="1" data-question="data_driven_decisions">
                <div class="option-radio"></div>
                <div class="option-text">Decisions are largely intuition-based with minimal data input</div>
              </div>
              <div class="option" data-value="2" data-question="data_driven_decisions">
                <div class="option-radio"></div>
                <div class="option-text">Data is considered but often overridden by intuition</div>
              </div>
              <div class="option" data-value="3" data-question="data_driven_decisions">
                <div class="option-radio"></div>
                <div class="option-text">Most decisions incorporate relevant data analysis</div>
              </div>
              <div class="option" data-value="4" data-question="data_driven_decisions">
                <div class="option-radio"></div>
                <div class="option-text">Systematic data-driven decision frameworks across the organization</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div id="results-section" class="assessment-section">
          <div class="results-loading">
            <div class="spinner"></div>
            <p>Analyzing your responses...</p>
          </div>
          
          <div class="results-content" style="display: none;">
            <div class="results-summary">
              <div class="results-score">
                <div class="score-circle">
                  <span id="overall-score">0</span><span>%</span>
                </div>
                <h4>Overall Maturity Score</h4>
              </div>
              <div class="maturity-level">
                <h4>Maturity Level: <span id="maturity-level">Developing</span></h4>
                <p id="maturity-description">Your RevOps capabilities are in the early stages of development. There are significant opportunities to build foundational processes and systems.</p>
              </div>
            </div>
            
            <div class="results-details">
              <h3>Maturity By Category</h3>
              <div class="category-scores">
                <div id="category-chart" class="chart-container"></div>
              </div>
              
              <div class="insights-container">
                <div class="strengths-section">
                  <h3>Key Strengths</h3>
                  <ul id="strengths-list" class="insights-list"></ul>
                </div>
                
                <div class="weaknesses-section">
                  <h3>Improvement Areas</h3>
                  <ul id="weaknesses-list" class="insights-list"></ul>
                </div>
              </div>
            </div>
            
            <div class="recommendations-section">
              <h3>Personalized Recommendations</h3>
              <div id="recommendations-list" class="recommendations-container"></div>
            </div>
            
            <div class="next-steps-section">
              <h3>Next Steps</h3>
              <p>Based on your assessment results, we recommend the following next steps to enhance your RevOps capabilities:</p>
              
              <div class="next-steps-list">
                <div class="next-step">
                  <div class="step-number">1</div>
                  <div>
                    <h4>Schedule a RevOps Strategy Call</h4>
                    <p>Connect with our experts to discuss your assessment results and explore targeted solutions for your highest-priority challenges.</p>
                  </div>
                </div>
                
                <div class="next-step">
                  <div class="step-number">2</div>
                  <div>
                    <h4>Download Your Custom Roadmap Template</h4>
                    <p>Access our RevOps transformation roadmap template, pre-populated with recommendations based on your maturity assessment.</p>
                  </div>
                </div>
                
                <div class="next-step">
                  <div class="step-number">3</div>
                  <div>
                    <h4>Join Our RevOps Community</h4>
                    <p>Connect with peers facing similar challenges and access exclusive resources to accelerate your RevOps transformation.</p>
                  </div>
                </div>
              </div>
              
              <div class="results-cta">
                <a href="/contact/" class="btn btn-primary">Schedule Strategy Call</a>
                <a href="#" id="download-results" class="btn btn-secondary">Download Results</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="assessment-navigation">
        <button id="prev-btn" class="btn btn-secondary" disabled>Previous</button>
        <button id="next-btn" class="btn btn-primary">Next</button>
      </div>
    </div>
  `;
}

// Initialize assessment functionality
function initializeAssessment() {
  // Store the assessment data
  const assessmentData = {
    currentStep: 0,
    answers: {},
    userInfo: {
      name: '',
      email: '',
      company: '',
      role: ''
    },
    results: null
  };

  // Section information
  const sections = [
    {
      id: 'intro',
      title: 'About You',
      description: 'Help us personalize your assessment results',
      element: document.getElementById('intro-section'),
      validate: validateUserInfo
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Evaluate how your organization captures, manages, and integrates business data',
      element: document.getElementById('data-section'),
      validate: validateQuestionSection
    },
    {
      id: 'process',
      title: 'Process Optimization',
      description: 'Assess the effectiveness and efficiency of your revenue-generating processes',
      element: document.getElementById('process-section'),
      validate: validateQuestionSection
    },
    {
      id: 'alignment',
      title: 'Cross-Functional Alignment',
      description: 'Evaluate how well your revenue teams collaborate and align around common goals',
      element: document.getElementById('alignment-section'),
      validate: validateQuestionSection
    },
    {
      id: 'technology',
      title: 'Technology Stack',
      description: 'Assess the effectiveness of your technology tools and infrastructure',
      element: document.getElementById('technology-section'),
      validate: validateQuestionSection
    },
    {
      id: 'analytics',
      title: 'Analytics & Insights',
      description: 'Evaluate how you leverage data for business intelligence and decision-making',
      element: document.getElementById('analytics-section'),
      validate: validateQuestionSection
    },
    {
      id: 'results',
      title: 'Your Assessment Results',
      description: 'Based on your responses, here\'s your personalized RevOps maturity analysis',
      element: document.getElementById('results-section'),
      validate: () => true
    }
  ];

  // Get UI elements
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const sectionTitle = document.getElementById('section-title');
  const sectionDescription = document.getElementById('section-description');
  const progressSteps = document.querySelectorAll('.step');
  const progressFill = document.querySelector('.progress-fill');

  // Handle option selection
  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
      const questionId = this.dataset.question;
      const value = parseInt(this.dataset.value);
      
      // Remove active class from all options in this question
      const questionOptions = this.closest('.question').querySelectorAll('.option');
      questionOptions.forEach(opt => opt.classList.remove('active'));
      
      // Add active class to selected option
      this.classList.add('active');
      
      // Store the answer
      assessmentData.answers[questionId] = value;
    });
  });

  // Handle form inputs in intro section
  document.querySelectorAll('#intro-section input, #intro-section select').forEach(input => {
    input.addEventListener('input', function() {
      assessmentData.userInfo[this.name] = this.value.trim();
    });
  });

  // Navigation event listeners
  prevBtn.addEventListener('click', goToPreviousStep);
  nextBtn.addEventListener('click', goToNextStep);

  // Function to go to the next step
  function goToNextStep() {
    // Check if current section is valid
    if (!sections[assessmentData.currentStep].validate()) {
      return;
    }
    
    // Hide current section
    sections[assessmentData.currentStep].element.classList.remove('active');
    
    // Update current step
    assessmentData.currentStep++;
    
    // Enable/disable navigation buttons
    updateNavigation();
    
    // Update progress indicators
    updateProgress();
    
    // Update section title and description
    sectionTitle.textContent = sections[assessmentData.currentStep].title;
    sectionDescription.textContent = sections[assessmentData.currentStep].description;
    
    // Show new section
    sections[assessmentData.currentStep].element.classList.add('active');
    
    // If this is the results section, calculate and display results
    if (sections[assessmentData.currentStep].id === 'results') {
      calculateResults();
    }
  }

  // Function to go to the previous step
  function goToPreviousStep() {
    // Hide current section
    sections[assessmentData.currentStep].element.classList.remove('active');
    
    // Update current step
    assessmentData.currentStep--;
    
    // Enable/disable navigation buttons
    updateNavigation();
    
    // Update progress indicators
    updateProgress();
    
    // Update section title and description
    sectionTitle.textContent = sections[assessmentData.currentStep].title;
    sectionDescription.textContent = sections[assessmentData.currentStep].description;
    
    // Show new section
    sections[assessmentData.currentStep].element.classList.add('active');
  }

  // Update navigation buttons
  function updateNavigation() {
    // Enable/disable previous button
    prevBtn.disabled = assessmentData.currentStep === 0;
    
    // Update next button text for last step
    if (assessmentData.currentStep === sections.length - 1) {
      nextBtn.textContent = 'Finish';
      nextBtn.classList.add('btn-success');
      nextBtn.disabled = true; // Disable next button on results page
    } else {
      nextBtn.textContent = 'Next';
      nextBtn.classList.remove('btn-success');
      nextBtn.disabled = false;
    }
  }

  // Update progress indicators
  function updateProgress() {
    // Calculate progress percentage
    const progressPercentage = (assessmentData.currentStep / (sections.length - 1)) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    // Update step indicators
    progressSteps.forEach((step, index) => {
      if (index <= assessmentData.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Validate user info section
  function validateUserInfo() {
    const requiredFields = ['name', 'email', 'company', 'role'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      const input = document.getElementById(field);
      
      if (!assessmentData.userInfo[field]) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    if (!isValid) {
      alert('Please fill in all required fields to continue.');
    }
    
    return isValid;
  }

  // Validate question section
  function validateQuestionSection() {
    const currentSectionId = sections[assessmentData.currentStep].id;
    const questions = document.querySelectorAll(`#${currentSectionId}-section .question`);
    let isValid = true;
    
    questions.forEach(question => {
      const options = question.querySelectorAll('.option');
      const questionId = options[0].dataset.question;
      
      if (!assessmentData.answers[questionId]) {
        question.classList.add('error');
        isValid = false;
      } else {
        question.classList.remove('error');
      }
    });
    
    if (!isValid) {
      alert('Please answer all questions to continue.');
    }
    
    return isValid;
  }

  // Calculate assessment results
  function calculateResults() {
    // Show loading indicator
    document.querySelector('.results-loading').style.display = 'flex';
    document.querySelector('.results-content').style.display = 'none';
    
    // Simulate processing time
    setTimeout(function() {
      // Calculate category scores
      const categoryScores = {
        data: calculateCategoryScore('data'),
        process: calculateCategoryScore('process'),
        alignment: calculateCategoryScore('alignment'),
        technology: calculateCategoryScore('technology'),
        analytics: calculateCategoryScore('analytics')
      };
      
      // Calculate overall score
      const overallScore = Math.round(
        (categoryScores.data + categoryScores.process + categoryScores.alignment + 
         categoryScores.technology + categoryScores.analytics) / 5
      );
      
      // Determine maturity level
      let maturityLevel, maturityDescription;
      
      if (overallScore < 40) {
        maturityLevel = 'Developing';
        maturityDescription = 'Your RevOps capabilities are in the early stages of development. There are significant opportunities to build foundational processes and systems.';
      } else if (overallScore < 65) {
        maturityLevel = 'Emerging';
        maturityDescription = 'You have established basic RevOps practices but have considerable room for improvement in creating integrated processes and systems.';
      } else if (overallScore < 85) {
        maturityLevel = 'Advanced';
        maturityDescription = 'Your organization demonstrates strong RevOps capabilities with good integration across functions, though opportunities exist for further optimization.';
      } else {
        maturityLevel = 'Leading';
        maturityDescription = 'Your RevOps capabilities are highly mature with sophisticated integration, automation, and analytics driving exceptional business results.';
      }
      
      // Store results
      assessmentData.results = {
        overallScore,
        maturityLevel,
        maturityDescription,
        categoryScores,
        recommendations: generateRecommendations(categoryScores)
      };
      
      // Display results
      displayResults();
      
      // Hide loading indicator and show results
      document.querySelector('.results-loading').style.display = 'none';
      document.querySelector('.results-content').style.display = 'block';
    }, 2000);
  }

  // Calculate category score
  function calculateCategoryScore(category) {
    let score = 0;
    let questionCount = 0;
    
    // Find all questions for this category
    Object.keys(assessmentData.answers).forEach(questionId => {
      if (questionId.startsWith(category)) {
        score += assessmentData.answers[questionId];
        questionCount++;
      }
    });
    
    // Calculate percentage score
    return Math.round((score / (questionCount * 4)) * 100);
  }

  // Generate recommendations based on scores
  function generateRecommendations(scores) {
    const recommendations = [];
    
    // Data recommendations
    if (scores.data < 50) {
      recommendations.push({
        category: 'Data Management',
        priority: 'High',
        title: 'Establish data quality fundamentals',
        description: 'Implement basic data governance practices to improve data quality and consistency across key systems. Start by standardizing customer and account data fields and implementing validation rules.'
      });
    } else if (scores.data < 75) {
      recommendations.push({
        category: 'Data Management',
        priority: 'Medium',
        title: 'Enhance data integration capabilities',
        description: 'Build more robust integrations between your core systems to reduce manual data transfers and improve data consistency. Consider implementing middleware or iPaaS solutions to streamline data flows.'
      });
    } else {
      recommendations.push({
        category: 'Data Management',
        priority: 'Low',
        title: 'Advance your data governance program',
        description: 'Formalize your data governance program with clear ownership, policies, and metrics. Consider implementing master data management tools and processes to maintain data integrity at scale.'
      });
    }
    
    // Process recommendations
    if (scores.process < 50) {
      recommendations.push({
        category: 'Process Optimization',
        priority: 'High',
        title: 'Document and standardize core processes',
        description: 'Identify and document your key revenue processes, focusing on customer acquisition, onboarding, and renewal. Standardize these processes across teams to create consistency and establish a foundation for improvement.'
      });
    } else if (scores.process < 75) {
      recommendations.push({
        category: 'Process Optimization',
        priority: 'Medium',
        title: 'Implement process automation',
        description: 'Identify high-volume, repetitive tasks within your revenue processes that could benefit from automation. Focus on lead routing, opportunity management, and customer communications as initial automation targets.'
      });
    } else {
      recommendations.push({
        category: 'Process Optimization',
        priority: 'Low',
        title: 'Implement advanced process optimization',
        description: 'Establish formal process improvement methodologies such as Lean or Six Sigma. Use advanced analytics to identify optimization opportunities and implement continuous improvement cycles.'
      });
    }
    
    // Add one more high priority recommendation
    if (scores.alignment < 50) {
      recommendations.push({
        category: 'Cross-Functional Alignment',
        priority: 'High',
        title: 'Create shared goals and metrics',
        description: 'Establish common goals and metrics across marketing, sales, and customer success teams. Implement regular cross-functional meetings to track progress and address issues collaboratively.'
      });
    } else if (scores.technology < 50) {
      recommendations.push({
        category: 'Technology Stack',
        priority: 'High',
        title: 'Address critical technology gaps',
        description: 'Conduct a comprehensive technology audit to identify critical gaps and redundancies. Prioritize investments in core CRM, marketing automation, and customer success platforms to establish a solid foundation.'
      });
    } else if (scores.analytics < 50) {
      recommendations.push({
        category: 'Analytics & Insights',
        priority: 'High',
        title: 'Establish core reporting capabilities',
        description: 'Define and implement standard reports for key business metrics. Focus on creating reliable data sources and consistent calculation methods for critical KPIs like pipeline velocity, conversion rates, and customer retention.'
      });
    }
    
    return recommendations;
  }

  // Display results
  function displayResults() {
    const results = assessmentData.results;
    
    // Update overall score and maturity level
    document.getElementById('overall-score').textContent = results.overallScore;
    document.getElementById('maturity-level').textContent = results.maturityLevel;
    document.getElementById('maturity-description').textContent = results.maturityDescription;
    
    // Create strengths and weaknesses lists
    const categoryLabels = {
      data: 'Data Management',
      process: 'Process Optimization',
      alignment: 'Cross-Functional Alignment',
      technology: 'Technology Stack',
      analytics: 'Analytics & Insights'
    };
    
    // Sort categories by score
    const sortedCategories = Object.entries(results.categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => ({ key, value }));
    
    // Display strengths (top 2)
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    
    sortedCategories.slice(0, 2).forEach(category => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span class="strength-icon"><i class="fas fa-check-circle"></i></span>
                           <div><strong>${categoryLabels[category.key]}</strong><br>
                           Score: ${category.value}%</div>`;
      strengthsList.appendChild(listItem);
    });
    
    // Display weaknesses (bottom 2)
    const weaknessesList = document.getElementById('weaknesses-list');
    weaknessesList.innerHTML = '';
    
    sortedCategories.slice(-2).reverse().forEach(category => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span class="weakness-icon"><i class="fas fa-exclamation-triangle"></i></span>
                           <div><strong>${categoryLabels[category.key]}</strong><br>
                           Score: ${category.value}%</div>`;
      weaknessesList.appendChild(listItem);
    });
    
    // Display recommendations
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    results.recommendations.forEach(rec => {
      const priorityClass = rec.priority === 'High' ? 'high-priority' :
                           rec.priority === 'Medium' ? 'medium-priority' : 'low-priority';
      
      const recItem = document.createElement('div');
      recItem.className = 'recommendation-item';
      
      recItem.innerHTML = `
        <div class="recommendation-header">
          <h4>${rec.title}</h4>
          <div class="recommendation-meta">
            <span>${rec.category}</span>
            <span class="priority-badge ${priorityClass}">${rec.priority} Priority</span>
          </div>
        </div>
        <p>${rec.description}</p>
      `;
      
      recommendationsList.appendChild(recItem);
    });
    
    // Create basic bar chart
    createBarChart(results.categoryScores);
    
    // Add download functionality
    document.getElementById('download-results').addEventListener('click', downloadResults);
  }

  // Create bar chart for category scores
  function createBarChart(categoryScores) {
    const chartContainer = document.getElementById('category-chart');
    chartContainer.innerHTML = '';
    
    const categoryLabels = {
      data: 'Data Management',
      process: 'Process Optimization',
      alignment: 'Cross-Functional Alignment',
      technology: 'Technology Stack',
      analytics: 'Analytics & Insights'
    };
    
    // Create SVG for chart
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 500 300');
    chartContainer.appendChild(svg);
    
    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 150 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Create chart group
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    chart.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(chart);
    
    // Create scales
    const xScale = value => (value / 100) * width;
    const yScale = (i, total) => (i * height / total) + (height / (2 * total));
    
    // Create categories array
    const categories = Object.entries(categoryScores).map(([key, value], i) => ({
      category: categoryLabels[key],
      score: value,
      index: i
    }));
    
    // Create bars
    categories.forEach((item, i) => {
      const barHeight = height / categories.length * 0.7;
      const barY = yScale(i, categories.length) - (barHeight / 2);
      
      // Bar background
      const barBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      barBg.setAttribute('x', 0);
      barBg.setAttribute('y', barY);
      barBg.setAttribute('width', width);
      barBg.setAttribute('height', barHeight);
      barBg.setAttribute('fill', '#eee');
      barBg.setAttribute('rx', 4);
      chart.appendChild(barBg);
      
      // Bar value
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', 0);
      bar.setAttribute('y', barY);
      bar.setAttribute('width', xScale(item.score));
      bar.setAttribute('height', barHeight);
      bar.setAttribute('fill', getBarColor(item.score));
      bar.setAttribute('rx', 4);
      chart.appendChild(bar);
      
      // Category label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', -10);
      label.setAttribute('y', yScale(i, categories.length));
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('alignment-baseline', 'middle');
      label.setAttribute('font-size', '14px');
      label.textContent = item.category;
      chart.appendChild(label);
      
      // Score label
      const scoreLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      scoreLabel.setAttribute('x', xScale(item.score) + 10);
      scoreLabel.setAttribute('y', yScale(i, categories.length));
      scoreLabel.setAttribute('text-anchor', 'start');
      scoreLabel.setAttribute('alignment-baseline', 'middle');
      scoreLabel.setAttribute('font-size', '14px');
      scoreLabel.setAttribute('font-weight', 'bold');
      scoreLabel.textContent = `${item.score}%`;
      chart.appendChild(scoreLabel);
    });
  }

  // Get color based on score value
  function getBarColor(score) {
    if (score < 40) return '#ff6b6b'; // Red
    if (score < 65) return '#feca57'; // Yellow
    if (score < 85) return '#54a0ff'; // Blue
    return '#1dd1a1'; // Green
  }

  // Download results as PDF (simulated)
  function downloadResults(e) {
    e.preventDefault();
    alert('This feature would generate a PDF with your assessment results. For demo purposes, we\'re showing this alert instead.');
  }
}

/* Add these styles directly to ensure the assessment functions properly */
document.head.insertAdjacentHTML('beforeend', `
<style>
  /* Assessment Styles */
  .assessment-wrapper {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .assessment-progress {
    margin-bottom: 2rem;
  }

  .progress-bar {
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4361ee, #3a56d4);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-steps {
    display: flex;
    justify-content: space-between;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }

  .step.active {
    opacity: 1;
  }

  .step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 8px;
    transition: background-color 0.3s ease;
  }

  .step.active .step-number {
    background-color: #4361ee;
    color: white;
  }

  .step-label {
    font-size: 12px;
    text-align: center;
  }

  .section-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .assessment-section {
    display: none;
  }

  .assessment-section.active {
    display: block;
  }

  .question {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
  }

  .question:last-child {
    border-bottom: none;
  }

  .question h4 {
    margin-bottom: 1rem;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .option {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border: 2px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .option:hover {
    border-color: #4361ee;
  }

  .option.active {
    border-color: #4361ee;
    background-color: rgba(67, 97, 238, 0.05);
  }

  .option-radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ccc;
    margin-right: 1rem;
    margin-top: 3px;
    position: relative;
    flex-shrink: 0;
  }

  .option.active .option-radio {
    border-color: #4361ee;
  }

  .option.active .option-radio:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #4361ee;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-control:focus {
    outline: none;
    border-color: #4361ee;
  }

  .form-control.error {
    border-color: #ff6b6b;
  }

  .question.error {
    border-left: 4px solid #ff6b6b;
    padding-left: 1rem;
  }

  .privacy-note {
    margin-top: 2rem;
    font-size: 0.875rem;
    color: #777;
  }

  .assessment-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: #4361ee;
    color: white;
  }

  .btn-primary:hover {
    background-color: #3a56d4;
  }

  .btn-secondary {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #ddd;
  }

  .btn-secondary:hover {
    background-color: #e9ecef;
  }

  .btn-success {
    background-color: #1dd1a1;
    color: white;
  }

  .btn-success:hover {
    background-color: #10ac84;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Results styling */
  .results-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(67, 97, 238, 0.2);
    border-top-color: #4361ee;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .results-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 3rem;
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
  }

  .results-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 200px;
  }

  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4361ee, #3a56d4);
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .maturity-level {
    flex: 2;
    min-width: 300px;
  }

  .results-details {
    margin-bottom: 3rem;
  }

  .category-scores {
    margin-bottom: 2rem;
  }

  .chart-container {
    height: 300px;
    margin-bottom: 2rem;
  }

  .insights-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .strengths-section, .weaknesses-section {
    flex: 1;
    min-width: 300px;
  }

  .insights-list {
    list-style: none;
    padding: 0;
  }

  .insights-list li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
  }

  .strength-icon, .weakness-icon {
    margin-right: 1rem;
  }

  .strength-icon {
    color: #1dd1a1;
  }

  .weakness-icon {
    color: #ff6b6b;
  }

  .recommendations-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .recommendation-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .recommendation-header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .recommendation-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .high-priority {
    background-color: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
  }

  .medium-priority {
    background-color: rgba(254, 202, 87, 0.1);
    color: #feca57;
  }

  .low-priority {
    background-color: rgba(29, 209, 161, 0.1);
    color: #1dd1a1;
  }

  .next-steps-section {
    margin-bottom: 2rem;
  }

  .next-steps-list {
    margin-bottom: 2rem;
  }

  .next-step {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .next-step .step-number {
    width: 35px;
    height: 35px;
    margin-right: 1rem;
    background-color: #4361ee;
    color: white;
  }

  .results-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .assessment-wrapper {
      padding: 1.5rem;
    }
    
    .progress-steps {
      display: none;
    }
    
    .results-summary, .insights-container {
      flex-direction: column;
    }
    
    .recommendation-header {
      flex-direction: column;
    }
    
    .recommendation-meta {
      margin-top: 0.5rem;
    }
  }
</style>
`);
