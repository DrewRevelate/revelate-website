/**
 * Controller for Campaign History LWC on Lead records
 */
public with sharing class CampaignHistoryController {
    
    /**
     * Get campaign members for a lead
     * @param leadId The lead ID
     * @return List of CampaignMember records
     */
    @AuraEnabled(cacheable=true)
    public static List<CampaignMember> getCampaignMembers(String leadId) {
        if (String.isBlank(leadId)) {
            return new List<CampaignMember>();
        }
        
        return [
            SELECT Id, CampaignId, Campaign.Name, Status, CreatedDate
            FROM CampaignMember
            WHERE LeadId = :leadId
            ORDER BY CreatedDate DESC
        ];
    }
    
    /**
     * Get active campaigns for selection
     * @return List of active Campaign records
     */
    @AuraEnabled
    public static List<Campaign> getActiveCampaigns() {
        return [
            SELECT Id, Name
            FROM Campaign
            WHERE IsActive = true
            ORDER BY Name
            LIMIT 1000
        ];
    }
    
    /**
     * Add a lead to a campaign
     * @param leadId The lead ID
     * @param campaignId The campaign ID
     * @return The ID of the created CampaignMember
     */
    @AuraEnabled
    public static Id addLeadToCampaign(String leadId, String campaignId) {
        if (String.isBlank(leadId) || String.isBlank(campaignId)) {
            throw new AuraHandledException('Lead ID and Campaign ID are required');
        }
        
        // Check if member already exists to avoid duplicates
        List<CampaignMember> existingMembers = [
            SELECT Id
            FROM CampaignMember
            WHERE LeadId = :leadId AND CampaignId = :campaignId
            LIMIT 1
        ];
        
        if (!existingMembers.isEmpty()) {
            return existingMembers[0].Id;
        }
        
        // Create new member
        CampaignMember member = new CampaignMember(
            LeadId = leadId,
            CampaignId = campaignId
        );
        
        try {
            insert member;
            return member.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error adding lead to campaign: ' + e.getMessage());
        }
    }
}