# NTR Properties - Pages Structure

## Public Pages (No Login Required)

### 1. Home Page - `/`
- Landing page with hero section
- Browse by Phase (Phase 1, 2, 4)
- Property types (Residential/Commercial)
- Latest listings preview
- Call-to-action buttons

### 2. All Listings - `/listings`
- Browse all approved properties
- Filters sidebar (Phase, Block, Type, Price, Features)
- Search functionality
- Sort options
- Property cards with details

### 3. Single Property - `/listings/[id]`
- Full property details
- Image gallery
- Location info (Phase, Block)
- Contact information
- Similar properties

## User Pages (Login Required)

### 4. Login Page - `/auth/login`
- Phone number OTP authentication
- Works for both new users and existing users
- Auto-creates profile on first login

### 5. User Dashboard - `/dashboard`
- View all your listings
- Stats (Total, Pending, Approved, Rejected)
- Edit pending listings
- Delete listings
- View rejection reasons

### 6. Post New Listing - `/dashboard/post`
- 4-step form:
  - Step 1: Location (Phase, Block)
  - Step 2: Property Details (Type, Size, Price)
  - Step 3: Features (Corner, Road Facing, etc.)
  - Step 4: Images/Videos (up to 10 files)
- Submit for admin approval

### 7. Edit Listing - `/dashboard/listings/[id]/edit`
- Edit pending listings only
- Same form as post page
- Cannot edit approved/rejected listings

**Note:** Logged in users can also access ALL public pages (Home, Listings, Property Details)

## Admin Pages (Admin Role Required)

### 8. Admin Dashboard - `/admin`
- Statistics overview
- Storage usage tracking
- Recent submissions
- Quick actions

### 9. Manage Listings - `/admin/listings`
- View all listings (pending/approved/rejected)
- Approve/Reject with reasons
- Feature listings
- Search and filter

### 10. Manage Users - `/admin/users`
- View all users
- Block/Unblock users
- View user stats
- Search users

### 11. Settings - `/admin/settings`
- Manage Phases
- Manage Blocks
- Add/Edit/Activate/Deactivate

### 12. Activity Logs - `/admin/logs`
- View all admin actions
- Track approvals/rejections
- Audit trail

## Navigation Flow

### For Visitors (Not Logged In):
1. Visit Home (`/`) → Browse listings
2. Click "Browse Properties" → Go to `/listings`
3. Click any property → View details at `/listings/[id]`
4. Click "Post Ad" or "Sign In" → Go to `/auth/login`

### For Logged In Users:
1. After login → Can go anywhere:
   - `/` - Home page (same as public)
   - `/listings` - All listings (same as public)
   - `/listings/[id]` - Property details (same as public)
   - `/dashboard` - YOUR listings (new access)
   - `/dashboard/post` - Post new ad (new access)
2. Navbar shows: Home | Properties | Post Ad | [User Menu]
3. User Menu dropdown:
   - Dashboard (view your listings)
   - Admin Panel (if admin)
   - Sign Out

**Key Point:** Login does NOT restrict access. It ADDS access to dashboard and post features.

### For Admin Users:
1. Same as regular users PLUS
2. Admin Panel link in user menu
3. Access to `/admin/*` pages

## Important Notes

1. **Dashboard vs Listings**:
   - `/dashboard` = YOUR listings only (requires login)
   - `/listings` = ALL approved listings (public, accessible by everyone including logged in users)

2. **Authentication**:
   - Login required ONLY for: `/dashboard/*` and `/admin/*`
   - Public access (with or without login): `/`, `/listings`, `/listings/[id]`
   - Login ADDS features, doesn't restrict access

3. **Navbar Behavior**:
   - Shows "Sign In" when NOT logged in
   - Shows user menu with name when logged in
   - Updates in real-time based on auth state
   - "Home" and "Properties" links always visible

4. **Post Ad Button**:
   - Not logged in → Goes to `/auth/login`
   - Logged in → Goes to `/dashboard/post`

5. **After Login**:
   - User can browse home page, all listings, view properties
   - PLUS can access dashboard to manage their own ads
   - PLUS can post new ads
