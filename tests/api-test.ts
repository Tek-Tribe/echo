import { apiClient } from '../shared/api/client';

// Test data
const testBusiness = {
  email: 'testbusiness@echo.com',
  password: 'securepass123',
  userType: 'business' as const,
  firstName: 'John',
  lastName: 'Smith',
  phone: '+1-555-0123',
  profileData: {
    companyName: 'TechCorp Inc',
    companyWebsite: 'https://techcorp.com',
    industry: 'Technology',
    description: 'Leading technology company specializing in AI solutions'
  }
};

const testInfluencer = {
  email: 'testinfluencer@echo.com',
  password: 'securepass123',
  userType: 'influencer' as const,
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+1-555-0124',
  profileData: {
    instagramHandle: '@janedoe_official',
    instagramFollowers: 50000,
    engagementRate: 4.5,
    bio: 'Lifestyle blogger and fashion enthusiast',
    niche: 'Fashion & Lifestyle',
    location: 'New York, NY',
    ratePerStory: 150.00,
    ratePerPost: 300.00
  }
};

// Test runner
async function runTests() {
  console.log('🧪 Starting Echo Platform API Tests\n');

  try {
    // Test 1: Business Registration
    console.log('📋 Test 1: Business Registration');
    const businessResponse = await apiClient.auth.register(testBusiness);
    console.log('✅ Business registered successfully');
    console.log('Business ID:', businessResponse.user.id);
    console.log('Profile Data:', businessResponse.profile || 'Created');

    // Test 2: Business Login
    console.log('\n🔐 Test 2: Business Login');
    const businessLogin = await apiClient.auth.login(testBusiness.email, testBusiness.password);
    console.log('✅ Business login successful');
    console.log('User Type:', businessLogin.user.userType);
    console.log('Company:', businessLogin.profile?.companyName);

    // Test 3: Influencer Registration
    console.log('\n👑 Test 3: Influencer Registration');
    const influencerResponse = await apiClient.auth.register(testInfluencer);
    console.log('✅ Influencer registered successfully');
    console.log('Influencer ID:', influencerResponse.user.id);
    console.log('Instagram Handle:', influencerResponse.profile?.instagramHandle);

    // Test 4: Influencer Login
    console.log('\n🔐 Test 4: Influencer Login');
    const influencerLogin = await apiClient.auth.login(testInfluencer.email, testInfluencer.password);
    console.log('✅ Influencer login successful');
    console.log('User Type:', influencerLogin.user.userType);
    console.log('Followers:', influencerLogin.profile?.instagramFollowers);

    // Test 5: Create Campaign
    console.log('\n🚀 Test 5: Create Campaign');
    const campaign = await apiClient.campaigns.create({
      businessId: businessResponse.user.id,
      title: 'Summer Fashion Collection Launch',
      description: 'Promote our new summer collection with authentic lifestyle content',
      campaignType: 'story_reshare',
      budget: 5000.00,
      requirements: 'Must include brand hashtags and tag our account',
      targetAudience: 'Fashion-conscious women aged 18-35'
    });
    console.log('✅ Campaign created successfully');
    console.log('Campaign ID:', campaign.campaign.id);
    console.log('Campaign Title:', campaign.campaign.title);

    // Test 6: Activate Campaign
    console.log('\n⚡ Test 6: Activate Campaign');
    await apiClient.campaigns.updateStatus(campaign.campaign.id, 'active');
    console.log('✅ Campaign activated successfully');

    // Test 7: Browse Active Campaigns
    console.log('\n🔍 Test 7: Browse Active Campaigns');
    const activeCampaigns = await apiClient.campaigns.getActive();
    console.log('✅ Retrieved active campaigns');
    console.log('Active campaigns count:', activeCampaigns.campaigns.length);

    // Test 8: Submit Bid
    console.log('\n💰 Test 8: Submit Bid');
    const bid = await apiClient.bids.create({
      campaignId: campaign.campaign.id,
      influencerId: influencerResponse.user.id,
      proposedRate: 200.00,
      message: 'I love this brand and would create authentic content showcasing the summer collection to my engaged audience.'
    });
    console.log('✅ Bid submitted successfully');
    console.log('Bid ID:', bid.bid.id);
    console.log('Proposed Rate:', bid.bid.proposedRate);

    // Test 9: View Campaign Bids
    console.log('\n📊 Test 9: View Campaign Bids');
    const campaignBids = await apiClient.bids.getByCampaign(campaign.campaign.id);
    console.log('✅ Retrieved campaign bids');
    console.log('Bids count:', campaignBids.bids.length);

    // Test 10: Accept Bid
    console.log('\n✅ Test 10: Accept Bid');
    await apiClient.bids.updateStatus(bid.bid.id, 'accepted', businessResponse.user.id);
    console.log('✅ Bid accepted successfully');

    // Test 11: Complete Work
    console.log('\n🎯 Test 11: Complete Work');
    await apiClient.bids.complete(bid.bid.id, influencerResponse.user.id);
    console.log('✅ Work marked as complete');

    console.log('\n🎉 All tests completed successfully!');
    console.log('✨ The Echo Platform API is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Export for use in other files
export { runTests, testBusiness, testInfluencer };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}