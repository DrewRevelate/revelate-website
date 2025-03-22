/**
 * Sanity Initialization Script
 * This script initializes Sanity with sample data
 * 
 * Usage:
 * node src/scripts/init-sanity.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const { client } = require('../sanity/client');

/**
 * Create a sample logo image in Sanity
 */
async function createSampleImages() {
  try {
    console.log('🚀 Creating sample images in Sanity...');
    
    // Check if the logo images already exist
    const existingLogos = await client.fetch(`*[_type == "siteImages" && identifier in ["main-logo", "footer-logo"]]`);
    
    if (existingLogos && existingLogos.length > 0) {
      console.log('⚠️ Logo images already exist in Sanity. Skipping creation.');
      return;
    }
    
    // Create a sample main logo
    const mainLogo = {
      _type: 'siteImages',
      name: 'Revelate Operations Logo',
      category: 'logos',
      identifier: 'main-logo',
      alt: 'Revelate Operations Logo',
      caption: 'Official logo of Revelate Operations',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-sample-logo-ref' // This will be replaced with an actual image reference
        }
      }
    };
    
    // Create a sample footer logo
    const footerLogo = {
      _type: 'siteImages',
      name: 'Revelate Operations Footer Logo',
      category: 'logos',
      identifier: 'footer-logo',
      alt: 'Revelate Operations Logo (White)',
      caption: 'White version of the Revelate Operations logo used in the footer',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-sample-footer-logo-ref' // This will be replaced with an actual image reference
        }
      }
    };
    
    // Create a sample hero image
    const heroImage = {
      _type: 'siteImages',
      name: 'Homepage Hero Image',
      category: 'hero',
      identifier: 'home-hero',
      alt: 'Data visualization and analytics dashboard',
      caption: 'Interactive data visualization showing business analytics',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: 'image-sample-hero-ref' // This will be replaced with an actual image reference
        }
      }
    };
    
    // Upload and create the images
    await client.create(mainLogo);
    await client.create(footerLogo);
    await client.create(heroImage);
    
    console.log('✅ Sample images created successfully!');
    console.log('ℹ️ Note: You will need to upload the actual image files in the Sanity Studio.');
    
  } catch (error) {
    console.error('❌ Error creating sample images:', error);
  }
}

/**
 * Create sample team members in Sanity
 */
async function createSampleTeamMembers() {
  try {
    console.log('🚀 Creating sample team members in Sanity...');
    
    // Check if the team members already exist
    const existingMembers = await client.fetch(`*[_type == "teamMember" && name in ["Drew Lambert", "Melanie Tummino"]]`);
    
    if (existingMembers && existingMembers.length > 0) {
      console.log('⚠️ Team members already exist in Sanity. Skipping creation.');
      return;
    }
    
    // Create Drew Lambert
    const drewLambert = {
      _type: 'teamMember',
      name: 'Drew Lambert',
      slug: {
        _type: 'slug',
        current: 'drew-lambert'
      },
      role: 'Co-Founder & SaaS Expert',
      isFounder: true,
      shortBio: 'A Salesforce architect and SaaS consultant with deep expertise in Salesforce ecosystems, revenue operations, customer retention, and lead generation.',
      bio: [
        {
          _type: 'block',
          style: 'normal',
          _key: 'drew-bio-1',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Drew Lambert is a Salesforce architect and SaaS consultant with deep expertise in Salesforce ecosystems, revenue operations, customer retention, and lead generation. With over 300 Salesforce Trailhead badges and 20+ super badges, Drew demonstrates extensive technical and strategic knowledge in the field.',
              _key: 'drew-bio-1-span'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          _key: 'drew-bio-2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Having worked with over 150 different company tech stacks, Drew helps organizations optimize their CRM, analytics, and revenue workflows. He specializes in building scalable, efficient, and revenue-focused software architectures for companies of all sizes.',
              _key: 'drew-bio-2-span'
            }
          ]
        }
      ],
      expertise: ['Salesforce Architecture', 'CRM Implementation', 'Revenue Operations', 'Lead Generation', 'Customer Retention'],
      credentials: [
        {
          name: 'Salesforce Certified Application Architect',
          organization: 'Salesforce',
          description: 'Expert-level certification for designing and implementing Salesforce applications.'
        },
        {
          name: '300+ Salesforce Trailhead Badges',
          organization: 'Salesforce',
          description: 'Comprehensive demonstration of Salesforce platform knowledge.'
        },
        {
          name: '20+ Salesforce Superbadges',
          organization: 'Salesforce',
          description: 'Advanced skill certification in specific Salesforce domains.'
        }
      ],
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/drewlambert/'
      },
      order: 1
    };
    
    // Create Melanie Tummino
    const melanieTummino = {
      _type: 'teamMember',
      name: 'Melanie Tummino',
      slug: {
        _type: 'slug',
        current: 'melanie-tummino'
      },
      role: 'Co-Founder & Data Expert',
      isFounder: true,
      shortBio: 'A data scientist and analytics leader with expertise in data warehousing, data science, business intelligence, and dashboard development.',
      bio: [
        {
          _type: 'block',
          style: 'normal',
          _key: 'melanie-bio-1',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Melanie Tummino is a data scientist and analytics leader with expertise in data warehousing, data science, business intelligence, and dashboard development. With over six years of experience designing real-time analytics dashboards and predictive business intelligence models, she brings a wealth of knowledge to every project.',
              _key: 'melanie-bio-1-span'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          _key: 'melanie-bio-2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Melanie works to bridge the gap between raw data and actionable business strategy, ensuring companies make data-driven decisions with confidence. She develops data architectures that track key business trends, forecast outcomes, and drive operational success.',
              _key: 'melanie-bio-2-span'
            }
          ]
        }
      ],
      expertise: ['Data Science', 'Business Intelligence', 'Dashboard Development', 'Data Warehousing', 'Predictive Analytics'],
      credentials: [
        {
          name: 'MBA with Data Analytics Concentration',
          organization: 'UCLA Anderson School of Management',
          description: 'Advanced business administration degree with focus on data analytics.'
        },
        {
          name: 'Certified Data Scientist',
          organization: 'Data Science Council of America',
          description: 'Professional certification in data science methodologies and applications.'
        }
      ],
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/melanietummino/'
      },
      order: 2
    };
    
    // Create the team members
    await client.create(drewLambert);
    await client.create(melanieTummino);
    
    console.log('✅ Sample team members created successfully!');
    console.log('ℹ️ Note: You will need to upload profile photos in the Sanity Studio.');
    
  } catch (error) {
    console.error('❌ Error creating sample team members:', error);
  }
}

/**
 * Create sample service cards in Sanity
 */
async function createSampleServiceCards() {
  try {
    console.log('🚀 Creating sample service cards in Sanity...');
    
    // Check if service cards already exist
    const existingServices = await client.fetch(`*[_type == "serviceCard" && category in ["data-analytics", "revenue-operations", "crm-integration"]]`);
    
    if (existingServices && existingServices.length > 0) {
      console.log('⚠️ Service cards already exist in Sanity. Skipping creation.');
      return;
    }
    
    // Create Data & Analytics service
    const dataAnalytics = {
      _type: 'serviceCard',
      title: 'Data & Analytics',
      slug: {
        _type: 'slug',
        current: 'data-analytics'
      },
      iconClass: 'fa-chart-bar',
      shortDescription: 'Custom dashboards and business intelligence reporting to drive data-driven decision making.',
      description: [
        {
          _type: 'block',
          style: 'normal',
          _key: 'data-analytics-desc-1',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Our Data & Analytics services help you transform raw data into actionable insights. We develop interactive, real-time dashboards that track business metrics, customer behavior, and performance trends.',
              _key: 'data-analytics-desc-1-span'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          _key: 'data-analytics-desc-2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'We create analytics solutions designed for data-driven decision-making at every organizational level, ensuring you have the right information at the right time to make informed business decisions.',
              _key: 'data-analytics-desc-2-span'
            }
          ]
        }
      ],
      features: [
        {
          title: 'Custom Business Intelligence Dashboards',
          description: 'Interactive data visualizations tailored to your specific business needs and KPIs.'
        },
        {
          title: 'Predictive Analytics Models',
          description: 'Forecasting tools to help you anticipate future trends and make proactive decisions.'
        },
        {
          title: 'Data Warehouse Implementation',
          description: 'Centralized data repositories that consolidate information from multiple sources.'
        },
        {
          title: 'Data Quality Management',
          description: 'Processes and tools to ensure your data is accurate, complete, and consistent.'
        }
      ],
      category: 'data-analytics',
      order: 1,
      featured: true
    };
    
    // Create Revenue Operations service
    const revenueOperations = {
      _type: 'serviceCard',
      title: 'Revenue Operations',
      slug: {
        _type: 'slug',
        current: 'revenue-operations'
      },
      iconClass: 'fa-dollar-sign',
      shortDescription: 'Optimize sales cycles, streamline processes, and improve customer engagement.',
      description: [
        {
          _type: 'block',
          style: 'normal',
          _key: 'revenue-ops-desc-1',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Our Revenue Operations services help you streamline and optimize your revenue-generating activities across marketing, sales, and customer success. We implement scalable CRM solutions, including Salesforce architecture and automation, to enhance your team\'s effectiveness.',
              _key: 'revenue-ops-desc-1-span'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          _key: 'revenue-ops-desc-2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'We optimize lead generation, customer engagement, and sales retention strategies to create a unified revenue engine that drives sustainable growth for your business.',
              _key: 'revenue-ops-desc-2-span'
            }
          ]
        }
      ],
      features: [
        {
          title: 'Sales Process Optimization',
          description: 'Streamlined deal management, pipeline tracking, and revenue forecasting tools.'
        },
        {
          title: 'Marketing Automation Integration',
          description: 'Connected systems that align marketing campaigns with sales activities.'
        },
        {
          title: 'Customer Success Workflows',
          description: 'Processes designed to maximize customer retention and expansion opportunities.'
        },
        {
          title: 'Revenue Performance Analytics',
          description: 'Comprehensive reporting on key revenue metrics and growth indicators.'
        }
      ],
      category: 'revenue-operations',
      order: 2,
      featured: true
    };
    
    // Create CRM Integration service
    const crmIntegration = {
      _type: 'serviceCard',
      title: 'CRM Integration',
      slug: {
        _type: 'slug',
        current: 'crm-integration'
      },
      iconClass: 'fa-users',
      shortDescription: 'Implement and optimize Salesforce and other CRM solutions for your business.',
      description: [
        {
          _type: 'block',
          style: 'normal',
          _key: 'crm-desc-1',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'Our CRM Integration services focus on implementing and optimizing customer relationship management platforms, with a specialization in Salesforce. We design and build custom CRM solutions that align with your specific business processes and goals.',
              _key: 'crm-desc-1-span'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          _key: 'crm-desc-2',
          markDefs: [],
          children: [
            {
              _type: 'span',
              marks: [],
              text: 'From initial setup to complex customizations and system integrations, we ensure your CRM becomes a powerful tool for managing customer relationships and driving revenue growth.',
              _key: 'crm-desc-2-span'
            }
          ]
        }
      ],
      features: [
        {
          title: 'Salesforce Implementation',
          description: 'Expert setup and configuration of Sales Cloud, Service Cloud, and other Salesforce products.'
        },
        {
          title: 'Custom Object Development',
          description: 'Tailored data models that reflect your unique business requirements.'
        },
        {
          title: 'Workflow Automation',
          description: 'Time-saving processes that reduce manual work and increase consistency.'
        },
        {
          title: 'Third-Party Integrations',
          description: 'Seamless connections with marketing, finance, and operational systems.'
        }
      ],
      category: 'crm-integration',
      order: 3,
      featured: true
    };
    
    // Create the service cards
    await client.create(dataAnalytics);
    await client.create(revenueOperations);
    await client.create(crmIntegration);
    
    console.log('✅ Sample service cards created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample service cards:', error);
  }
}

/**
 * Main function to run all setup tasks
 */
async function runSetup() {
  console.log('🔧 Setting up Sanity with sample data...');
  
  try {
    await createSampleImages();
    await createSampleTeamMembers();
    await createSampleServiceCards();
    
    console.log('🎉 Sanity setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start the Sanity Studio with: cd sanity-studio && npm run dev');
    console.log('2. Upload images for the created content items');
    console.log('3. Create additional content as needed');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the setup
runSetup();
