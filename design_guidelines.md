# Tatekulu Mobile App - Design Guidelines

## 1. Brand Identity

**Purpose**: Tatekulu connects barbershop clients with stylists, streamlining appointment booking and shop management.

**Aesthetic Direction**: **Refined Masculine** - Sharp, confident, premium without being pretentious. Think high-end barbershop meets modern tech. Clean lines, strong contrast, breathing room, subtle luxe details.

**Memorable Element**: Diagonal accent lines reminiscent of barber poles, used sparingly as visual punctuation (dividers, loading indicators, success states).

---

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs) with Floating Action Button for core "Book" action

**Tabs**:
1. **Home** - Dashboard with upcoming appointments, featured shops
2. **Explore** - Browse barbershops, stylists, services
3. **Appointments** - Booking history, upcoming visits
4. **Profile** - User settings, favorites, payment methods

**Floating Action Button**: Centered above tab bar, labeled "Book Now" - primary action

**Auth Flow**: Apple Sign-In + Google Sign-In (mandatory for booking features)

---

## 3. Screen-by-Screen Specifications

### Authentication Screens

**Login/Signup Screen**
- Layout: Centered content, logo at top third
- Components: SSO buttons (Apple primary, Google secondary), "Terms & Privacy" links footer
- No navigation header
- Safe area: top: insets.top + 40, bottom: insets.bottom + 40

### Home Tab Stack

**Home Screen**
- Header: Transparent, left: user avatar (touchable), right: notification bell icon
- Content: Scrollable with sections:
  - Welcome banner with user's next appointment (card)
  - "Popular Near You" horizontal scroll (shop cards)
  - "Your Stylists" section if user has favorites
- Empty state (no appointments): empty-home.png illustration
- Safe area: top: headerHeight + 24, bottom: tabBarHeight + 24

### Explore Tab Stack

**Explore Screen**
- Header: Non-transparent white background, search bar embedded
- Content: Vertical list of barbershop cards with filters chip row below search
- Filter chips: "Near Me", "Top Rated", "Available Today"
- Empty state (no results): empty-search.png illustration
- Safe area: top: 16, bottom: tabBarHeight + 16

**Shop Detail Screen** (Modal)
- Header: Transparent over hero image, left: back button, right: favorite icon
- Content: Scrollable
  - Hero image (shop photo)
  - Shop name, rating, distance
  - Services expandable list
  - Stylists horizontal scroll (avatar cards)
  - Reviews section
  - "Book Appointment" sticky button at bottom
- Safe area: bottom: insets.bottom + 16

**Booking Flow Screen** (Modal)
- Header: Non-transparent, left: close, center: "New Booking"
- Content: Scrollable form
  - Service selection (single choice chips)
  - Stylist selection (avatar cards)
  - Date picker (calendar view)
  - Time slot selection (grid of available times)
  - Notes textarea (optional)
- Submit: "Confirm Booking" button at bottom, outside scroll
- Safe area: top: 16, bottom: insets.bottom + 80 (button height + spacing)

### Appointments Tab Stack

**Appointments Screen**
- Header: Non-transparent, center: "Appointments", right: filter icon (upcoming/past toggle)
- Content: Segmented list (Upcoming section, Past section)
- Empty state (no appointments): empty-appointments.png illustration
- Safe area: top: 16, bottom: tabBarHeight + 24

**Appointment Detail Screen**
- Header: Non-transparent, left: back, right: more menu (reschedule/cancel)
- Content: Scrollable card with:
  - Shop info with thumbnail
  - Stylist info
  - Date/time/service
  - QR code (for check-in)
  - "Get Directions" button
  - "Reschedule" and "Cancel" buttons at bottom
- Safe area: top: 16, bottom: insets.bottom + 16

### Profile Tab Stack

**Profile Screen**
- Header: Transparent, right: settings gear icon
- Content: Scrollable
  - User avatar (large, editable on tap)
  - Display name (editable)
  - Stats row (total visits, favorite shops)
  - Menu items: Payment Methods, Favorite Shops, Notifications, Support, Log Out
- Safe area: top: headerHeight + 24, bottom: tabBarHeight + 24

**Settings Screen**
- Header: Non-transparent, left: back, center: "Settings"
- Content: Scrollable form with sections:
  - Notifications toggles
  - Theme toggle (Light/Dark)
  - Account section (nested Delete Account)
- Safe area: top: 16, bottom: insets.bottom + 16

---

## 4. Color Palette

**Primary**: #1A1A1A (Charcoal Black) - dominant color for headers, buttons, primary text
**Accent**: #C9A668 (Gold) - for CTAs, highlights, premium touches
**Background**: #FAFAFA (Off-White) - main app background
**Surface**: #FFFFFF (Pure White) - cards, modals
**Text Primary**: #1A1A1A
**Text Secondary**: #6B6B6B
**Text Tertiary**: #9E9E9E
**Border**: #E5E5E5
**Success**: #2E7D32
**Error**: #C62828
**Warning**: #F57C00

**Dark Mode** (if implemented later):
- Invert primary/background, reduce accent brightness to #B8935A

---

## 5. Typography

**Primary Font**: Montserrat (Google Font) - Bold, confident, modern
**Secondary Font**: Inter (Google Font) - Body text, legible at small sizes

**Type Scale**:
- Hero: Montserrat Bold, 32px
- H1: Montserrat Bold, 24px
- H2: Montserrat SemiBold, 20px
- H3: Montserrat SemiBold, 18px
- Body: Inter Regular, 16px
- Body Small: Inter Regular, 14px
- Caption: Inter Regular, 12px
- Button: Montserrat SemiBold, 16px

---

## 6. Assets to Generate

**icon.png**
- 1024x1024 app icon
- Minimalist "T" lettermark in gold (#C9A668) on charcoal (#1A1A1A) background with subtle diagonal barber pole stripe accent

**splash-icon.png**
- 1024x1024 splash screen icon
- Same as app icon

**empty-home.png**
- Illustration: Modern barber chair silhouette with dotted circle frame, gold accent
- WHERE USED: Home screen when user has no upcoming appointments

**empty-search.png**
- Illustration: Magnifying glass with location pin, minimalist line art style
- WHERE USED: Explore screen when no shops match search/filter

**empty-appointments.png**
- Illustration: Calendar with checkmark, simple line drawing with gold accent
- WHERE USED: Appointments screen when user has no bookings

**avatar-default-1.png** through **avatar-default-3.png**
- 3 preset user avatars: abstract geometric patterns in brand colors
- WHERE USED: Profile screen default avatar options

**success-booking.png**
- Illustration: Checkmark with confetti burst, celebratory but refined
- WHERE USED: Booking confirmation modal

---

## Visual Design Notes

- All buttons have 0.2s opacity transition on press (opacity: 0.7)
- Floating "Book Now" button has drop shadow: offset (0, 2), opacity 0.10, radius 2
- Cards have subtle border (#E5E5E5, 1px) with 12px corner radius
- Avatar images: 50% border radius (circular)
- Use Feather icons (@expo/vector-icons) throughout for consistency
- Diagonal accent lines: 2px width, 20px length, gold color, 45° rotation