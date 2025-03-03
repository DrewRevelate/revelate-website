/* 
---------------------------------------
REVELATE OPERATIONS MAIN STYLESHEET
----------------------------------------
1. Variables
2. Base Styles
3. Typography
4. Layout
5. Buttons
6. Navbar
7. Footer
8. Hero Section
9. Section Styling
10. Cards & Components 
11. Forms
12. Modals
13. Animations
14. Utilities
15. Responsive
---------------------------------------
*/

/* 
---------------------------------------
1. Variables
---------------------------------------
*/
:root {
    /* Colors */
    --primary: #4361ee;
    --primary-light: #4895ef;
    --secondary: #7209b7;
    --secondary-light: #9d4edd;
    --accent: #ff6b6b;
    --accent-hover: #ff5252;
    --dark: #0d1b2a;
    --gray-dark: #1b263b;
    --gray: #415a77;
    --gray-light: #778da9;
    --light: #f8f9fa;
    --light-alt: #f0f2f5;
    --success: #2ecc71;
    --warning: #f39c12;
    --error: #e74c3c;
    
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-round: 50px;
    
    /* Shadows */
    --shadow-sm: 0 2px 10px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
    --shadow-focus: 0 0 0 3px rgba(67, 97, 238, 0.3);
    
    /* Animation */
    --transition-fast: 0.2s;
    --transition-medium: 0.3s;
    --transition-slow: 0.5s;
    
    /* Layout */
    --container-max-width: 1280px;
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 2rem;
    --space-lg: 4rem;
    --space-xl: 6rem;
    
    /* Z-index layers */
    --z-back: -1;
    --z-normal: 1;
    --z-raised: 10;
    --z-higher: 100;
    --z-modal: 1000;
    --z-overlay: 2000;
    --z-tooltip: 3000;
}

/* 
---------------------------------------
2. Base Styles
---------------------------------------
*/
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px; /* Account for fixed navbar */
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: var(--dark);
    line-height: 1.6;
    background-color: var(--light);
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
}

/* Smooth section transitions */
section {
    position: relative;
    z-index: var(--z-normal);
    padding: var(--space-xl) 0;
    transition: background 0.5s ease;
}

img {
    display: block;
    max-width: 100%;
    height: auto;
}

a {
    text-decoration: none;
    color: var(--primary);
    transition: color var(--transition-medium) ease;
}

a:hover, a:focus {
    color: var(--primary-light);
}

button {
    cursor: pointer;
    font-family: inherit;
}

ul {
    list-style-position: inside;
}

/* Focus styles */
:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
}

/* Selection style */
::selection {
    background-color: var(--primary-light);
    color: white;
}

/* 
---------------------------------------
3. Typography
---------------------------------------
*/
h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: var(--dark);
}

h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
}

h2 {
    font-size: clamp(2rem, 4vw, 3rem);
}

h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
}

h4 {
    font-size: clamp(1.25rem, 2vw, 1.5rem);
}

p {
    margin-bottom: 1.5rem;
}

.text-gradient {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
}

.text-center {
    text-align: center;
}

.section-title {
    margin-bottom: 1.5rem;
    position: relative;
    z-index: var(--z-normal);
}

.section-subtitle {
    color: var(--gray);
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto 3rem;
}

.pre-title {
    display: inline-block;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--primary);
    margin-bottom: 1rem;
    padding: 0.4rem 1rem;
    background-color: rgba(67, 97, 238, 0.1);
    border-radius: var(--radius-round);
}

.required {
    color: var(--accent);
}

/* 
---------------------------------------
4. Layout
---------------------------------------
*/
.container {
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.col-md-8 {
    width: 66.666667%;
    padding: 0 15px;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

/* 
---------------------------------------
5. Buttons
---------------------------------------
*/
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-round);
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-medium) ease;
    border: none;
    position: relative;
    overflow: hidden;
    z-index: var(--z-normal);
}

.btn::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -25%;
    height: 200%;
    width: 150%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(25deg);
    transition: transform var(--transition-medium) ease;
    z-index: -1;
}

.btn:hover::after, .btn:focus::after {
    transform: rotate(25deg) translateY(-15%);
}

.btn-primary {
    background: linear-gradient(90deg, var(--primary), var(--primary-light));
    color: white;
    box-shadow: 0 4px 14px rgba(67, 97, 238, 0.3);
}

.btn-primary:hover, .btn-primary:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
    color: white;
}

.btn-secondary {
    background: linear-gradient(90deg, var(--secondary), var(--secondary-light));
    color: white;
    box-shadow: 0 4px 14px rgba(114, 9, 183, 0.3);
}

.btn-secondary:hover, .btn-secondary:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(114, 9, 183, 0.4);
    color: white;
}

.btn-accent {
    background: linear-gradient(90deg, var(--accent), var(--accent-hover));
    color: white;
    box-shadow: 0 4px 14px rgba(255, 107, 107, 0.3);
}

.btn-accent:hover, .btn-accent:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    color: white;
}

.btn-outline {
    background: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    box-shadow: none;
}

.btn-outline:hover, .btn-outline:focus {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 14px rgba(67, 97, 238, 0.3);
}

.btn-light {
    background: white;
    color: var(--primary);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-light:hover, .btn-light:focus {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    color: var(--primary);
}

.btn-large {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

/* 
---------------------------------------
6. Navbar
---------------------------------------
*/
#navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: var(--z-higher);
    transition: all var(--transition-medium) ease;
    padding: 1rem 0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}

#navbar.scrolled {
    background-color: white;
    box-shadow: var(--shadow-sm);
    padding: 0.75rem 0;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--dark);
    text-decoration: none;
}

.logo img {
    height: 50px;
    width: auto;
    transition: all 0.5s ease;
}

.logo:hover img {
    transform: rotate(30deg) scale(1.1);
    filter: drop-shadow(0 0 8px rgba(67, 97, 238, 0.6));
}

.logo h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0;
    background: linear-gradient(-45deg, #4361ee, #7209b7, #4895ef, #9d4edd);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 6s ease infinite;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-link {
    color: var(--gray-dark);
    text-decoration: none;
    font-weight: 500;
    position: relative;
    transition: all var(--transition-medium) ease;
    font-size: 0.95rem;
    padding: 0.5rem 0;
}

.nav-link:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    transition: width var(--transition-medium) ease;
}

.nav-link:hover, .nav-link.active {
    color: var(--primary);
}

.nav-link:hover:after, .nav-link.active:after {
    width: 100%;
}

.nav-cta {
    margin-left: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
}

.mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--primary);
    font-size: 1.5rem;
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: all var(--transition-medium) ease;
    align-items: center;
    justify-content: center;
}

.mobile-toggle:hover {
    background-color: rgba(67, 97, 238, 0.1);
}

/* 
---------------------------------------
7. Footer
---------------------------------------
*/
.footer {
    background: linear-gradient(to bottom,
        rgba(13, 27, 42, 0.95) 0%,
        rgba(13, 27, 42, 1) 100%);
    position: relative;
    padding-top: 5rem;
    color: white;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
}

.footer-brand {
    display: flex;
    flex-direction: column;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.footer-logo img {
    height: 40px;
    filter: brightness(0) invert(1);
}

.footer-logo h2 {
    font-size: 1.5rem;
    margin-bottom: 0;
    color: white;
}

.footer-about {
    color: #adb5bd;
    margin-bottom: 1.5rem;
}

.footer-social {
    display: flex;
    gap: 1rem;
}

.footer-social .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: white;
    transition: all var(--transition-medium) ease;
}

.footer-social .social-link:hover {
    background: var(--primary);
    transform: translateY(-5px);
}

.footer-heading {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: white;
    position: relative;
    padding-bottom: 0.75rem;
}

.footer-heading::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--primary-light);
}

.footer-links {
    list-style: none;
}

.footer-link {
    margin-bottom: 0.75rem;
}

.footer-link a {
    color: #adb5bd;
    text-decoration: none;
    transition: color var(--transition-medium) ease, transform var(--transition-medium) ease;
    display: inline-block;
    padding: 0.25rem 0;
}

.footer-link a:hover {
    color: var(--primary-light);
    transform: translateX(4px);
}

.footer-contact-item {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: #adb5bd;
}

.footer-contact-icon {
    color: var(--primary-light);
    margin-top: 0.25rem;
}

.footer-divider {
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 2rem;
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #adb5bd;
    font-size: 0.9rem;
    padding-bottom: 2rem;
}

.footer-legal a {
    color: var(--primary-light);
    text-decoration: none;
    transition: color var(--transition-medium) ease;
}

.footer-legal a:hover {
    color: white;
}

/* 
---------------------------------------
8. Hero Section
---------------------------------------
*/
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 5rem;
    overflow: visible;
    position: relative;
    background: linear-gradient(135deg, 
        rgba(248, 249, 250, 0.9) 0%, 
        rgba(233, 236, 239, 0.9) 100%);
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        radial-gradient(circle at 15% 15%, rgba(72, 149, 239, 0.08) 0%, transparent 70%),
        radial-gradient(circle at 85% 85%, rgba(157, 78, 221, 0.08) 0%, transparent 70%);
}

.hero-container {
    display: flex;
    align-items: center;
    position: relative;
    z-index: var(--z-normal);
}

.hero-content {
    flex: 1;
    max-width: 600px;
    position: relative;
    z-index: var(--z-normal);
}

.hero-title {
    margin-bottom: 1.5rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--gray);
    margin-bottom: 2rem;
}

.hero-metrics {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.hero-metric {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.metric-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
    line-height: 1;
}

.metric-label {
    font-size: 0.9rem;
    color: var(--gray);
    margin-top: 0.5rem;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2.5rem;
}

.hero-image-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.hero-image {
    width: 100%;
    max-width: 650px;
    z-index: var(--z-normal);
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.hero-shape {
    position: absolute;
    z-index: var(--z-back);
    opacity: 0.5;
}

.shape-1 {
    top: 15%;
    left: 5%;
    width: 80px;
    height: 80px;
    background: var(--primary-light);
    border-radius: 50%;
    filter: blur(30px);
    animation: float 12s ease-in-out infinite;
}

.shape-2 {
    bottom: 15%;
    left: 10%;
    width: 60px;
    height: 60px;
    background: var(--secondary-light);
    border-radius: 50%;
    filter: blur(20px);
    animation: float 12s ease-in-out infinite 1s;
}

.shape-3 {
    top: 25%;
    right: 30%;
    width: 100px;
    height: 100px;
    background: var(--primary);
    border-radius: 50%;
    filter: blur(40px);
    animation: float 12s ease-in-out infinite 2s;
}

/* 
---------------------------------------
9. Section Styling
---------------------------------------
*/
.light {
    background: linear-gradient(to bottom,
        rgba(255, 255, 255, 1) 0%,
        rgba(250, 252, 255, 0.8) 50%,
        rgba(255, 255, 255, 1) 100%);
}

.light::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 85% 15%, rgba(72, 149, 239, 0.05) 0%, transparent 70%),
        radial-gradient(circle at 15% 85%, rgba(157, 78, 221, 0.05) 0%, transparent 70%);
}

.gray {
    background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 1) 0%,
        rgba(245, 247, 250, 0.8) 30%,
        rgba(245, 247, 250, 0.8) 70%,
        rgba(255, 255, 255, 1) 100%);
}

.gray::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
        radial-gradient(circle at 75% 25%, rgba(72, 149, 239, 0.05) 0%, transparent 60%),
        radial-gradient(circle at 25% 75%, rgba(157, 78, 221, 0.05) 0%, transparent 60%);
}

.page-header {
    background: linear-gradient(135deg, 
        rgba(67, 97, 238, 0.9) 0%, 
        rgba(114, 9, 183, 0.9) 100%);
    color: white;
    text-align: center;
    padding: 8rem 0 4rem;
    margin-top: 80px;
    position: relative;
    overflow: hidden;
}

.page-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
}

.page-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    margin-bottom: 1.5rem;
    color: white;
    position: relative;
}

.page-subtitle {
    font-size: 1.25rem;
    max-width: 700px;
    margin: 0 auto;
    color: rgba(255, 255, 255, 0.9);
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

.breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color var(--transition-medium) ease;
}

.breadcrumb a:hover {
    color: white;
}

.breadcrumb i {
    font-size: 0.7rem;
}

.cta {
    background: linear-gradient(135deg, 
        rgba(27, 38, 59, 0.95) 0%, 
        rgba(13, 27, 42, 0.95) 100%);
    color: white;
    text-align: center;
    padding: 5rem 0;
    position: relative;
    overflow: hidden;
}

.cta::before {
    content: '';
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 1) 0%,
        rgba(27, 38, 59, 0.95) 100%);
    border-radius: 50% 50% 0 0 / 100px;
}

.cta::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to top, 
        rgba(13, 27, 42, 0.95) 0%,
        rgba(255, 255, 255, 1) 100%);
    border-radius: 0 0 50% 50% / 100px;
}

.cta-content {
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: var(--z-normal);
}

.cta-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: white;
}

.cta-description {
    margin-bottom: 2.5rem;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
}

/* 
---------------------------------------
10. Cards & Components
---------------------------------------
*/
.feature-card {
    background-color: white;
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-medium) ease;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: rgba(67, 97, 238, 0.1);
}

.feature-card-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
}

.feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 60px;
    border-radius: 12px;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--primary-light), var(--primary));
    color: white;
    font-size: 1.5rem;
    transition: all var(--transition-medium) ease;
    box-shadow: 0 4px 10px rgba(67, 97, 238, 0.2);
}

.feature-card:hover .feature-icon {
    transform: scale(1.1) rotate(5deg);
}

.feature-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    transition: all var(--transition-medium) ease;
}

.feature-description {
    color: var(--gray);
    margin-bottom: 1.5rem;
    transition: all var(--transition-medium) ease;
}

.feature-details {
    display: none;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    margin-bottom: 1.5rem;
}

.feature-details h4 {
    margin-bottom: 0.75rem;
    color: var(--primary);
}

.feature-details ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.feature-details li {
    margin-bottom: 0.5rem;
    color: var(--gray-dark);
}

.feature-card.expanded .feature-details {
    display: block;
    opacity: 1;
    max-height: 1000px;
    animation: fadeIn 0.5s ease forwards;
}

.feature-link {
    color: var(--primary);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all var(--transition-medium) ease;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    margin-top: auto;
    border-radius: var(--radius-md);
    position: relative;
    overflow: hidden;
}

.feature-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(67, 97, 238, 0.08);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform var(--transition-medium) ease;
    z-index: -1;
}

.feature-link:hover::before {
    transform: scaleX(1);
    transform-origin: left;
}

.feature-link i {
    transition: transform var(--transition-medium) ease;
}

.feature-link:hover i {
    transform: translateX(4px);
}

.feature-card.expanded .feature-link i {
    transform: rotate(90deg);
}

.feature-card.expanded .feature-link:hover i {
    transform: rotate(90deg) translateX(4px);
}

.highlight-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
}

.highlight-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    font-size: 1.25rem;
    flex-shrink: 0;
}

.highlight-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
}

.tech-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(67, 97, 238, 0.1);
    border-radius: var(--radius-round);
    font-size: 0.9rem;
    color: var(--primary);
    transition: all var(--transition-medium) ease;
}

.tech-tag:hover {
    background: rgba(67, 97, 238, 0.2);
    transform: translateY(-2px);
}

.tech-logos {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
}

.tech-logo {
    text-align: center;
}

.tech-logo img {
    height: 60px;
    width: auto;
    object-fit: contain;
    margin-bottom: 0.5rem;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all var(--transition-medium) ease;
}

.tech-logo:hover img {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.1);
}

.tech-logo span {
    font-size: 0.9rem;
    color: var(--gray);
}

.testimonial-card {
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem;
    position: relative;
    border-radius: var(--radius-lg);
    display: none;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.5s ease;
    height: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.testimonial-card.active {
    display: block;
    transform: translateX(0);
    opacity: 1;
}

.testimonial-content {
    color: var(--dark);
    font-size: 1.25rem;
    line-height: 1.8;
    margin-bottom: 2.5rem;
    position: relative;
    font-weight: 300;
    font-style: italic;
}

.testimonial-content:before {
    content: """;
    position: absolute;
    top: -1.5rem;
    left: -1.5rem;
    font-size: 5rem;
    font-family: Georgia, serif;
    color: var(--primary-light);
    opacity: 0.2;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding-top: 1.5rem;
    margin-top: auto;
}

.author-image {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.author-info h4 {
    margin-bottom: 0.25rem;
    font-size: 1.2rem;
    color: var(--dark);
    font-weight: 700;
}

.author-company {
    color: var(--gray);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.testimonial-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
    gap: 1.5rem;
}

.testimonial-control {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9));
    border: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-medium) ease;
    color: var(--primary);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.testimonial-control:hover {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    transform: translateY(-3px);
}

.testimonial-dots {
    display: flex;
    gap: 0.8rem;
}

.testimonial-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all var(--transition-medium) ease;
}

.testimonial-dot.active {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    transform: scale(1.2);
}

/* 
---------------------------------------
11. Forms
---------------------------------------
*/
.form-group {
    margin-bottom: 2rem;
    position: relative;
}

.form-label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: var(--dark);
    font-size: 1rem;
}

.form-control {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: all var(--transition-medium) ease;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.form-control:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    background: white;
}

.form-control.is-invalid {
    border-color: var(--error);
    background-color: rgba(231, 76, 60, 0.05);
}

.form-feedback {
    font-size: 0.85rem;
    color: var(--error);
    margin-top: 0.5rem;
    min-height: 1.2rem;
}

textarea.form-control {
    min-height: 150px;
    resize: vertical;
}

.form-success {
    background: rgba(46, 204, 113, 0.1);
    border-radius: var(--radius-md);
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
}

.success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: white;
    font-size: 2rem;
    border-radius: 50%;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

.form-success h4 {
    color: var(--dark);
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.form-success p {
    color: var(--gray);
    margin-bottom: 0;
    font-size: 1.1rem;
}

/* 
---------------------------------------
12. Modals
---------------------------------------
*/
.modal {
    display: none;
    position: fixed;
    z-index: var(--z-modal);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    width: 100%;
    max-width: 450px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
    animation: modalOpen 0.3s ease forwards;
}

@keyframes modalOpen {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    text-align: center;
}

.modal-title {
    margin-bottom: 0;
    font-size: 1.5rem;
}

.close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition-medium) ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-modal:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 2rem;
}

.modal-footer {
    padding: 1rem 2rem;
    text-align: center;
    border-top: 1px solid #eee;
}

.modal-footer a {
    color: var(--primary);
    text-decoration: none;
}

/* 
---------------------------------------
13. Animations
---------------------------------------
*/
@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate.in-view {
    opacity: 1;
    transform: translateY(0);
}

/* 
---------------------------------------
14. Utilities
---------------------------------------
*/
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }

.scroll-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: var(--z-higher);
    border: none;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-medium) ease;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
}

.scroll-top-btn.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-top-btn:hover {
    background: var(--primary-light);
    transform: translateY(-5px);
}

/* 
---------------------------------------
15. Responsive
---------------------------------------
*/
@media (max-width: 1280px) {
    :root {
        --space-xl: 5rem;
    }
    
    .container {
        max-width: 1140px;
    }
}

@media (max-width: 1024px) {
    :root {
        --space-xl: 4rem;
    }
    
    .container {
        max-width: 960px;
    }
    
    .hero-container {
        flex-direction: column;
        text-align: center;
        gap: 3rem;
    }
    
    .hero-metrics, .hero-buttons {
        justify-content: center;
    }
    
    .hero-metric {
        align-items: center;
    }
    
    .hero-content {
        max-width: 100%;
    }
    
    .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }
}

@media (max-width: 992px) {
    :root {
        --space-xl: 3rem;
    }
    
    .container {
        max-width: 720px;
    }
    
    .mobile-toggle {
        display: flex;
    }
    
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        padding: 1.5rem;
        flex-direction: column;
        gap: 1rem;
        box-shadow: var(--shadow-md);
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        border-top: 1px solid #eee;
        z-index: var(--z-higher);
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .nav-link {
        padding: 0.75rem 0;
        border-bottom: 1px solid #f5f5f5;
        width: 100%;
    }
    
    .nav-cta {
        margin: 0.5rem 0 0;
        width: 100%;
        text-align: center;
    }
}

@media (max-width: 768px) {
    :root {
        --space-xl: 3rem;
        --space-lg: 2.5rem;
    }
    
    .container {
        max-width: 540px;
        padding: 0 1.25rem;
    }
    
    h1 {
        font-size: clamp(2rem, 4vw, 3rem);
    }
    
    h2 {
        font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    }
    
    .hero-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

@media (max-width: 576px) {
    :root {
        --space-xl: 2.5rem;
        --space-lg: 2rem;
    }
    
    .container {
        padding: 0 1rem;
    }
    
    .hero-metrics {
        flex-direction: column;
        gap: 1rem;
    }
    
    .scroll-top-btn {
        right: 1rem;
        bottom: 1rem;
        width: 40px;
        height: 40px;
    }
}

/**
 * Revelate Operations Website JavaScript
 * This file contains functionality for animations, forms, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated elements
    initAnimations();
    
    // Initialize expandable service cards
    initServiceCards();
    
    // Initialize testimonial slider if present
    if (document.querySelector('.testimonials-slider')) {
        initTestimonialSlider();
    }
    
    // Initialize contact form if present
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize statistics animation
    initStatsAnimation();
});

/**
 * Initialize scroll animations for elements
 */
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate, .feature-card, .approach-step, .team-card, .case-study-card');
    
    function checkVisibility() {
        animateElements.forEach(el => {
            if (isElementInViewport(el, 0.15)) {
                el.classList.add('in-view');
            }
        });
    }
    
    // Check visibility initially and on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

/**
 * Check if an element is in the viewport
 */
function isElementInViewport(el, threshold = 0) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // If threshold is set, element must be at least that % in view
    const visiblePart = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const thresholdPixels = threshold * rect.height;
    
    return (
        visiblePart >= thresholdPixels && 
        rect.top < windowHeight && 
        rect.bottom > 0
    );
}

/**
 * Initialize expandable service cards
 */
function initServiceCards() {
    const featureLinks = document.querySelectorAll('.feature-link');
    
    featureLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.feature-card');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // If this card is already expanded, collapse it
            if (isExpanded) {
                card.classList.remove('expanded');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.link-text').textContent = 'Learn More';
            } else {
                // First collapse any other expanded cards
                document.querySelectorAll('.feature-card.expanded').forEach(expandedCard => {
                    expandedCard.classList.remove('expanded');
                    expandedCard.querySelector('.feature-link').setAttribute('aria-expanded', 'false');
                    expandedCard.querySelector('.link-text').textContent = 'Learn More';
                });
                
                // Now expand this card
                card.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.link-text').textContent = 'Close';
                
                // Smooth scroll to this card if it's not in view
                const cardRect = card.getBoundingClientRect();
                if (cardRect.top < 100 || cardRect.bottom > window.innerHeight) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
}

/**
 * Initialize testimonial slider/carousel
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    if (!testimonials.length) return; // Guard clause
    
    let currentTestimonial = 0;
    const testimonialCount = testimonials.length;
    
    // Function to display a specific testimonial
    function showTestimonial(index) {
        // Handle index bounds
        if (index < 0) index = testimonialCount - 1;
        if (index >= testimonialCount) index = 0;
        
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
            testimonial.style.display = 'none';
        });
        
        // Show the selected testimonial
        testimonials[index].classList.add('active');
        testimonials[index].style.display = 'block';
        
        // Update current index
        currentTestimonial = index;
        
        // Update dots
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }
    
    // Initialize first testimonial
    showTestimonial(0);
    
    // Add click handlers for navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            showTestimonial(currentTestimonial - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            showTestimonial(currentTestimonial + 1);
        });
    }
    
    // Add click handlers to dots
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showTestimonial(index);
        });
    });
    
    // Auto advance testimonials every 6 seconds
    const autoAdvanceInterval = setInterval(function() {
        showTestimonial(currentTestimonial + 1);
    }, 6000);
    
    // Stop auto-advance when user interacts
    [prevButton, nextButton, ...testimonialDots].forEach(el => {
        if (el) {
            el.addEventListener('click', function() {
                clearInterval(autoAdvanceInterval);
            });
        }
    });
}

/**
 * Initialize contact form with validation
 */
function initContactForm(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate the form
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Get feedback elements
        const nameFeedback = name.nextElementSibling;
        const emailFeedback = email.nextElementSibling;
        const messageFeedback = message.nextElementSibling;
        
        // Reset previous validation
        name.classList.remove('is-invalid');
        email.classList.remove('is-invalid');
        message.classList.remove('is-invalid');
        nameFeedback.textContent = '';
        emailFeedback.textContent = '';
        messageFeedback.textContent = '';
        
        // Name validation
        if (!name.value.trim()) {
            name.classList.add('is-invalid');
            nameFeedback.textContent = 'Name is required';
            isValid = false;
        }
        
        // Email validation
        if (!email.value.trim()) {
            email.classList.add('is-invalid');
            emailFeedback.textContent = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('is-invalid');
            emailFeedback.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Message validation
        if (!message.value.trim()) {
            message.classList.add('is-invalid');
            messageFeedback.textContent = 'Message is required';
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission success
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate async operation
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h4>Thank you for your message!</h4>
                    <p>We'll get back to you shortly.</p>
                `;
                
                // Insert success message
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                contactForm.style.display = 'none';
                
                // Reset form
                contactForm.reset();
                
                // Restore button after 5 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 5000);
            }, 1500);
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or id doesn't exist
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize statistics animation
 */
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            if (isElementInViewport(stat) && !stat.classList.contains('counted')) {
                stat.classList.add('counted');
                
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // ms
                const step = Math.ceil(target / (duration / 16)); // approx 60fps
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = current;
                    }
                }, 16);
            }
        });
    }
    
    window.addEventListener('scroll', animateStats);
    // Call once on load
    setTimeout(animateStats, 1000);
}
