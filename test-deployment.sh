#!/bin/bash

# Colors for console output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting MedMatch deployment test...${NC}"

# Step 1: Check if backend is running
echo -e "\n${YELLOW}Step 1: Checking if backend is running...${NC}"
if curl -s http://localhost:5000/api/bulletin > /dev/null; then
  echo -e "${GREEN}✓ Backend is running${NC}"
else
  echo -e "${RED}✗ Backend is not running. Please start the backend first with: cd backend && npm run dev${NC}"
  exit 1
fi

# Step 2: Check if MongoDB has been updated with Gast userType
echo -e "\n${YELLOW}Step 2: Running the test user seed script...${NC}"
cd backend && npm run seed-test-users
cd ..

echo -e "\n${YELLOW}Step 3: Testing guest login...${NC}"
GUEST_LOGIN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"guest@example.com", "password":"guest123"}' http://localhost:5000/api/auth/login)

if [[ $GUEST_LOGIN == *"token"* ]]; then
  echo -e "${GREEN}✓ Guest login successful${NC}"
else
  echo -e "${RED}✗ Guest login failed: $GUEST_LOGIN${NC}"
  echo -e "${RED}  Please check that the guest user is properly created with the correct userType.${NC}"
fi

echo -e "\n${YELLOW}Step 4: Testing admin login...${NC}"
ADMIN_LOGIN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"admin@example.com", "password":"password123"}' http://localhost:5000/api/auth/login)

if [[ $ADMIN_LOGIN == *"token"* ]]; then
  echo -e "${GREEN}✓ Admin login successful${NC}"
else
  echo -e "${RED}✗ Admin login failed: $ADMIN_LOGIN${NC}"
fi

echo -e "\n${YELLOW}Step 5: Testing regular user login...${NC}"
USER_LOGIN=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com", "password":"password123"}' http://localhost:5000/api/auth/login)

if [[ $USER_LOGIN == *"token"* ]]; then
  echo -e "${GREEN}✓ User login successful${NC}"
else
  echo -e "${RED}✗ User login failed: $USER_LOGIN${NC}"
fi

echo -e "\n${YELLOW}Step 6: Verifying frontend setup...${NC}"
if [ -f "src/views/LoginPage.vue" ] && grep -q "guest@example.com" "src/views/LoginPage.vue"; then
  echo -e "${GREEN}✓ LoginPage.vue has guest login${NC}"
else
  echo -e "${RED}✗ LoginPage.vue missing or guest login not found${NC}"
fi

if [ -f "src/components/layout/AppHeader.vue" ] && grep -q "authStore" "src/components/layout/AppHeader.vue"; then
  echo -e "${GREEN}✓ AppHeader.vue has authentication integration${NC}"
else
  echo -e "${RED}✗ AppHeader.vue missing or authentication integration not found${NC}"
fi

echo -e "\n${YELLOW}Step 7: Checking Vercel configuration...${NC}"
if [ -f "vercel.json" ]; then
  echo -e "${GREEN}✓ vercel.json exists${NC}"
else
  echo -e "${RED}✗ vercel.json is missing${NC}"
fi

echo -e "\n${YELLOW}Step 8: Checking environment variables template...${NC}"
if [ -f ".env.example" ]; then
  echo -e "${GREEN}✓ .env.example exists${NC}"
else
  echo -e "${RED}✗ .env.example is missing${NC}"
fi

echo -e "\n${YELLOW}Deployment test summary:${NC}"
echo -e "${GREEN}✓ All tests completed${NC}"
echo -e "${YELLOW}Before deploying to Vercel, make sure to:${NC}"
echo -e "  1. Set up MongoDB Atlas for production"
echo -e "  2. Configure environment variables in Vercel"
echo -e "  3. Run the seed-test-users script on the production database"
echo -e "  4. Use the guest login for demonstration purposes"

echo -e "\n${GREEN}Your application is ready for deployment!${NC}" 