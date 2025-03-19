import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { formatDate } from 'lightning/uiRecordApi';

// Import Apex methods
import getCampaignMembers from '@salesforce/apex/CampaignHistoryController.getCampaignMembers';
import getActiveCampaigns from '@salesforce/apex/CampaignHistoryController.getActiveCampaigns';
import addLeadToCampaign from '@salesforce/apex/CampaignHistoryController.addLeadToCampaign';

export default class Campign_Members_LWC extends NavigationMixin(LightningElement) {
    @api recordId; // Lead Id
    
    // Configuration properties
    @api componentTitle = 'Campaign History';
    @api componentIcon = 'standard:campaign';
    @api tableHeight = 350;
    @api cardBorderRadius = 4;
    @api cardSpacing = 16;
    @api cardBackgroundColor = '#FFFFFF';
    @api tableHeaderColor = '#F3F3F3';
    @api buttonColor = '#0070D2';
    @api hoverRowColor = '#F3F3F3';
    @api linkColor = '#0070D2';
    @api headerFontSize = '0.75rem';
    @api headerFontWeight = 'bold';
    @api contentFontSize = '0.875rem'; // Renamed from dataFontSize
    @api emptyStateTextColor = '#706E6B';
    @api emptyStateFontSize = '0.875rem';
    @api showRefreshButton = false; // Changed from true to false
    @api enableRowHighlight = false; // Changed from true to false
    @api openLinksInNewTab = false; // Changed from true to false
    @api showCampaignStatusColor = false; // Changed from true to false
    @api showDateAdded = false; // Changed from true to false
    @api dateFormat = 'MMM d, yyyy';
    @api maxCampaignsShown = 10;
    @api emptyCardIcon = 'utility:campaign';
    @api emptyStateMessage = 'No campaigns found. Click + to add this Lead to a Campaign.';
    
    @track campaignMembers = [];
    @track campaignOptions = [];
    @track isModalOpen = false;
    @track selectedCampaignId = '';
    @track showToast = false;
    @track toastMessage = '';
    @track toastVariant = 'success';
    @track lastRefreshTime = '';
    
    wiredMembersResult;
    isLoading = false;
    
    connectedCallback() {
        this.setLastRefreshTime();
    }
    
    renderedCallback() {
        this.applyCustomStyles();
    }
    
    // Apply custom styles based on configuration
    applyCustomStyles() {
        // Use static id for the style element to prevent duplicates
        const styleId = 'campaign-history-custom-styles';
        
        // Remove existing style element if it exists
        const existingStyle = this.template.querySelector(`#${styleId}`);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Create style element
        const style = document.createElement('style');
        style.id = styleId;
        
        // Build custom CSS based on configuration properties
        style.textContent = `
            .campaign-table-container {
                max-height: ${this.tableHeight}px;
                overflow-y: auto;
            }
            
            .campaign-card {
                border-radius: ${this.cardBorderRadius}px;
                background-color: ${this.cardBackgroundColor};
                padding: ${this.cardSpacing/16}rem;
            }
            
            .campaign-table th {
                background-color: ${this.tableHeaderColor};
                font-size: ${this.headerFontSize};
                font-weight: ${this.headerFontWeight};
            }
            
            .campaign-table td {
                font-size: ${this.contentFontSize};
            }
            
            .campaign-table a {
                color: ${this.linkColor};
            }
            
            ${this.enableRowHighlight ? `.campaign-table tbody tr:hover {
                background-color: ${this.hoverRowColor};
            }` : ''}
            
            .custom-button {
                --sds-c-button-brand-color-background: ${this.buttonColor};
                --sds-c-button-brand-color-border: ${this.buttonColor};
                --slds-c-button-brand-color-background: ${this.buttonColor};
                --slds-c-button-brand-color-border: ${this.buttonColor};
            }
            
            .custom-icon-button {
                --sds-c-button-color-background: ${this.buttonColor};
                --sds-c-button-color-border: ${this.buttonColor};
                --slds-c-button-color-background: ${this.buttonColor};
                --slds-c-button-color-border: ${this.buttonColor};
            }
            
            .empty-state-text {
                color: ${this.emptyStateTextColor};
                font-size: ${this.emptyStateFontSize};
            }
            
            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 0.5rem;
            }
            
            .status-active {
                background-color: #2E844A;
            }
            
            .status-inactive {
                background-color: #706E6B;
            }
        `;
        
        // Append style to template
        this.template.querySelector('lightning-card').appendChild(style);
    }
    
    // Check if recordId is available
    get hasRecordId() {
        return this.recordId != null && this.recordId !== '';
    }
    
    // Format target attribute for links
    get linkTarget() {
        return this.openLinksInNewTab ? '_blank' : '_self';
    }
    
    // Get Campaign Members
    @wire(getCampaignMembers, { leadId: '$recordId' })
    wiredCampaignMembers(result) {
        // Only process if we have a record ID
        if (!this.hasRecordId) {
            return;
        }
        
        this.wiredMembersResult = result;
        if (result.data) {
            let campaignData = [...result.data];
            
            // Limit number of campaigns if configured
            if (this.maxCampaignsShown > 0) {
                campaignData = campaignData.slice(0, this.maxCampaignsShown);
            }
            
            this.campaignMembers = campaignData.map(member => {
                return {
                    ...member,
                    campaignUrl: this.getCampaignUrl(member.CampaignId),
                    createdDate: this.formatDateValue(member.CreatedDate),
                    statusClass: member.Campaign?.IsActive ? 'status-indicator status-active' : 'status-indicator status-inactive',
                    statusLabel: member.Campaign?.IsActive ? 'Active' : 'Inactive'
                };
            });
        } else if (result.error) {
            this.showNotification('Error loading campaign history', 'error');
            console.error('Error loading campaign members', result.error);
        }
    }
    
    // Handle + button click
    handleAddClick() {
        if (!this.hasRecordId) {
            this.showNotification('No Lead record selected', 'error');
            return;
        }
        
        this.isLoading = true;
        this.isModalOpen = true;
        
        // Get active campaigns
        getActiveCampaigns()
            .then(result => {
                this.campaignOptions = result.map(campaign => {
                    return {
                        label: campaign.Name,
                        value: campaign.Id
                    };
                });
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.closeModal();
                this.showNotification('Error loading campaigns', 'error');
                console.error('Error loading campaigns', error);
            });
    }
    
    // Handle refresh button click
    handleRefresh() {
        this.refreshData();
        this.setLastRefreshTime();
        
        this.showNotification('Campaign data refreshed', 'success');
    }
    
    // Set last refresh time
    setLastRefreshTime() {
        const now = new Date();
        const options = { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true
        };
        this.lastRefreshTime = now.toLocaleTimeString(undefined, options);
    }
    
    // Format date according to configuration
    formatDateValue(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date', error);
            return dateString;
        }
    }
    
    // Handle campaign selection
    handleCampaignChange(event) {
        this.selectedCampaignId = event.detail.value;
    }
    
    // Handle save button click
    handleSave() {
        if (!this.selectedCampaignId || !this.hasRecordId) {
            return;
        }
        
        this.isLoading = true;
        
        addLeadToCampaign({ 
            leadId: this.recordId, 
            campaignId: this.selectedCampaignId 
        })
            .then(() => {
                this.isLoading = false;
                this.closeModal();
                this.showNotification('Lead added to campaign successfully', 'success');
                this.refreshData();
            })
            .catch(error => {
                this.isLoading = false;
                this.closeModal();
                this.showNotification('Error adding lead to campaign', 'error');
                console.error('Error adding lead to campaign', error);
            });
    }
    
    // Refresh data
    refreshData() {
        return refreshApex(this.wiredMembersResult);
    }
    
    // Close modal
    closeModal() {
        this.isModalOpen = false;
        this.selectedCampaignId = '';
    }
    
    // Show toast notification
    showNotification(message, variant) {
        this.toastMessage = message;
        this.toastVariant = variant;
        this.showToast = true;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.closeToast();
        }, 3000);
    }
    
    // Close toast
    closeToast() {
        this.showToast = false;
    }
    
    // Get Campaign URL
    getCampaignUrl(campaignId) {
        return '/lightning/r/Campaign/' + campaignId + '/view';
    }
    
    // Computed properties
    get isSaveDisabled() {
        return !this.selectedCampaignId || this.isLoading || !this.hasRecordId;
    }
    
    get toastClass() {
        return `slds-notify slds-notify_toast slds-theme_${this.toastVariant}`;
    }
    
    get toastIcon() {
        return this.toastVariant === 'success' ? 'utility:success' : 'utility:error';
    }
    
    get showDateColumn() {
        return this.showDateAdded === true;
    }
    
    get showStatusIndicator() {
        return this.showCampaignStatusColor === true;
    }
    
    get showRefreshButtonInFooter() {
        return this.showRefreshButton === true;
    }
    
    get hasData() {
        return this.campaignMembers && this.campaignMembers.length > 0;
    }
}