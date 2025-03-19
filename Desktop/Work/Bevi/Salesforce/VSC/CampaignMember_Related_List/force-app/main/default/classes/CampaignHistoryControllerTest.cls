/**
 * Test class for CampaignHistoryController
 */
@isTest
private class CampaignHistoryControllerTest {
    
    @testSetup
    static void setupTestData() {
        // Create test lead
        Lead testLead = new Lead(
            FirstName = 'Test',
            LastName = 'Lead',
            Company = 'Test Company',
            Email = 'test@example.com',
            Status = 'Open'
        );
        insert testLead;
        
        // Create test campaigns
        List<Campaign> campaigns = new List<Campaign>();
        
        Campaign activeCampaign = new Campaign(
            Name = 'Test Active Campaign',
            IsActive = true
        );
        campaigns.add(activeCampaign);
        
        Campaign inactiveCampaign = new Campaign(
            Name = 'Test Inactive Campaign',
            IsActive = false
        );
        campaigns.add(inactiveCampaign);
        
        insert campaigns;
        
        // Create test campaign member
        CampaignMember member = new CampaignMember(
            LeadId = testLead.Id,
            CampaignId = activeCampaign.Id
        );
        insert member;
    }
    
    @isTest
    static void testGetCampaignMembers() {
        // Get the test lead
        Lead testLead = [SELECT Id FROM Lead WHERE LastName = 'Lead' LIMIT 1];
        
        Test.startTest();
        List<CampaignMember> members = CampaignHistoryController.getCampaignMembers(testLead.Id);
        Test.stopTest();
        
        System.assertEquals(1, members.size(), 'Should return 1 campaign member');
        System.assertEquals('Test Active Campaign', members[0].Campaign.Name, 'Should match the campaign name');
    }
    
    @isTest
    static void testGetActiveCampaigns() {
        Test.startTest();
        List<Campaign> campaigns = CampaignHistoryController.getActiveCampaigns();
        Test.stopTest();
        
        System.assertEquals(1, campaigns.size(), 'Should return 1 active campaign');
        System.assertEquals('Test Active Campaign', campaigns[0].Name, 'Should match the active campaign name');
    }
    
    @isTest
    static void testAddLeadToCampaign() {
        // Get the test lead and campaign
        Lead testLead = [SELECT Id FROM Lead WHERE LastName = 'Lead' LIMIT 1];
        Campaign testCampaign = [SELECT Id FROM Campaign WHERE IsActive = true LIMIT 1];
        
        // Create a new campaign for testing
        Campaign newCampaign = new Campaign(
            Name = 'New Test Campaign',
            IsActive = true
        );
        insert newCampaign;
        
        Test.startTest();
        // Add lead to new campaign
        Id memberId = CampaignHistoryController.addLeadToCampaign(testLead.Id, newCampaign.Id);
        
        // Try adding to existing campaign (should return existing ID)
        Id existingMemberId = CampaignHistoryController.addLeadToCampaign(testLead.Id, testCampaign.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, memberId, 'Should return a valid member ID for new campaign');
        System.assertNotEquals(null, existingMemberId, 'Should return the existing member ID');
        
        // Verify members
        List<CampaignMember> members = [
            SELECT Id, CampaignId 
            FROM CampaignMember 
            WHERE LeadId = :testLead.Id
        ];
        
        System.assertEquals(2, members.size(), 'Should have 2 campaign members');
    }
    
    @isTest
    static void testAddLeadToCampaignError() {
        // Invalid IDs
        try {
            Test.startTest();
            CampaignHistoryController.addLeadToCampaign(null, null);
            Test.stopTest();
            System.assert(false, 'Should have thrown an exception');
        } catch (AuraHandledException e) {
            System.assert(true, 'Exception was thrown as expected');
        }
    }
}