# NunesAuto Traders UI – Final Submission Document

## 1. Problem Statement

The NunesAuto Traders UI is a frontend web application designed to support a modern vehicle dealership platform. The system aims to provide users with a clean, responsive, and easy-to-use interface for browsing products, creating an account, logging in securely, managing personal details, viewing order and inventory information, and interacting with the dealership.

The primary problem addressed by this project is the lack of a reliable, user-friendly frontend for managing a dealership's inventory and customer interactions. The application should allow customers to:

- Sign up and log in to a secure account
- View available products or vehicle listings
- Search and filter inventory
- Add items to a cart
- View order details and account information
- Navigate through the dealership pages such as Home, About Us, Contact, and Dashboard

The frontend must be organized, component-based, and functionally consistent with the design flow expected from the project proposal. It should include a proper navigation system, structured pages, and clearly defined user interactions such as form input handling, API calls, state updates, and protected routes for authenticated users.

This project reflects a real-world business need: dealership businesses require an intuitive interface for presenting products, enabling secure user access, and managing customer actions in a smooth digital experience. The solution aims to deliver that experience through a React-based front-end with route-based navigation and modular component design.

---

## 2. Project Objective

The objective of this project is to build a complete front-end application for NunesAuto Traders that demonstrates the following:

- Clean and organized code structure
- Reusable React components
- User authentication flow
- Product/inventory browsing
- Cart and order-related actions
- User profile and dashboard experience
- Responsive design and good UX
- Integration-ready logic for API communication and state management

---

## 3. Functional Requirements

### Core Features

1. Authentication
   - User registration
   - User login
   - Protected routes for authenticated pages
   - Session storage for logged-in user state

2. Product / Inventory View
   - Display available listings
   - View product information
   - Search and filter functionality
   - Inventory management page

3. Cart and Orders
   - Add products to cart
   - Review items selected by user
   - View order information and status
   - Connect cart operations to state-driven update flow

4. User Profile and Dashboard
   - Profile page for personal details
   - Dashboard for account overview
   - Logout and route protection

5. Extra Pages
   - Home page
   - About Us page
   - Contact page
   - Inventory page

---

## 4. XMind-Style Layout (Concept Map)

Below is a simple XMind-style design structure that can be used as a planning layout for the project if you need to convert it into a visual concept or diagram in Word.

```text
NunesAuto Traders UI
├── 1. User Experience
│   ├── Home Page
│   │   ├── Navigation Bar
│   │   ├── Hero Section
│   │   ├── Featured Listings
│   │   └── Quick Links
│   ├── About Us Page
│   │   ├── Company Story
│   │   ├── Mission / Values
│   │   └── Brand Identity
│   ├── Contact Page
│   │   ├── Contact Form
│   │   ├── Business Details
│   │   └── Social / Map Info
│   └── Profile Page
│       ├── User Details
│       ├── Update Preferences
│       └── Logout Action
├── 2. Authentication
│   ├── Login Screen
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Submit Button
│   │   └── Redirect to Home / Dashboard
│   └── Sign Up Screen
│       ├── Full Name Input
│       ├── Email Input
│       ├── Password Input
│       └── Register Button
├── 3. Inventory / Product Management
│   ├── Inventory Page
│   │   ├── Search Input
│   │   ├── Filter Options
│   │   ├── Product Cards
│   │   └── Add to Cart Button
│   └── Dashboard
│       ├── Overview Stats
│       ├── Recent Orders
│       ├── Inventory Summary
│       └── User Actions
├── 4. Cart and Orders
│   ├── Add to Cart
│   ├── Review Cart Items
│   ├── Order Summary
│   └── View Orders / Order History
├── 5. State and Logic Layer
│   ├── useState for form inputs and data stores
│   ├── useEffect for API calls and session loading
│   ├── onClick for buttons and actions
│   ├── Protected Routes for auth
│   └── Session Storage / Auth Context decisions
└── 6. Non-Functional Requirements
    ├── Responsive layout
    ├── Clean code structure
    ├── Consistent styling
    ├── User-friendly navigation
    └── Smooth application flow
```

> If you need a visual version for Word, you can draw this as a central topic with branches and sub-branches, similar to an XMind map, using shapes and connectors in Microsoft Word.

---

## 5. Component Design Notes and Annotations

This section provides the component-level design annotations expected by the rubric.

### 5.1 Login Component

- Purpose: Authenticate the user and redirect them to the main application.
- State:
  - `email` or `username`
  - `password`
  - `errorMessage`
  - `isLoading` (optional)
- useEffect:
  - Check if user is already logged in from session storage
  - Redirect to the home or dashboard page if session exists
- onClick:
  - Login button triggers authentication request
  - Toggle show/hide password if implemented
- Context:
  - Authenticated user state is passed to the app using session storage or props
  - Prevents access to protected screens without valid login

### 5.2 Sign Up Component

- Purpose: Create a new user account.
- State:
  - `fullName`
  - `email`
  - `password`
  - `confirmPassword`
  - `signupError`
- useEffect:
  - Check for pre-existing session or redirect condition
- onClick:
  - Submit registration form
  - Trigger validation checks before account creation
- Context:
  - After account creation, user is stored and redirected to the relevant page

### 5.3 Home Component

- Purpose: Main landing page of the application.
- State:
  - `searchTerm` (if used)
  - `featuredItems`
  - navigation state
- useEffect:
  - Load homepage data or featured listings
  - Fetch dynamic content from API if connected
- onClick:
  - Navigation buttons
  - CTA buttons to inventory or login
- Context:
  - Displays user session status (logged in/out)
  - Controls login/logout actions displayed in the navbar

### 5.4 Inventory Component

- Purpose: Display available products and allow selection or purchase exploration.
- State:
  - `inventoryItems`
  - `searchQuery`
  - `selectedCategory`
  - `cartCount`
- useEffect:
  - Fetch inventory data from backend or mock data source
  - Update UI when filtered data changes
- onClick:
  - Product card click
  - Add to cart button
  - Search or filter controls
- Context:
  - Inventory is displayed for all users and can integrate with cart state

### 5.5 Dashboard Component

- Purpose: User overview screen showing operations and account information.
- State:
  - `userData`
  - `orders`
  - `stats`
- useEffect:
  - Fetch user details and recent orders
  - Validate access if token or session is present
- onClick:
  - View order details
  - Open actions or navigation shortcuts
- Context:
  - Shows information only for authenticated users
  - Protected access for private account functions

### 5.6 Profile Component

- Purpose: Show, manage, and review personal information.
- State:
  - `profile` object
  - `isEditing`
  - `updatedFields`
- useEffect:
  - Load user profile from storage or API
- onClick:
  - Edit profile
  - Save changes
  - Logout button
- Context:
  - User profile belongs to authenticated session
  - Ensures personalized account experience

### 5.7 About Us / Contact Components

- Purpose: Provide company information and contact details.
- State:
  - `formData` for contact forms
  - `submitted` status
- useEffect:
  - Optional auto-load business info or contact details
- onClick:
  - Submit contact form
  - Navigate to contact actions
- Context:
  - Public content pages available for general visitors

---

## 6. Application Features Checklist

### Authentication
- [x] Login screen implemented
- [x] Sign up screen implemented
- [x] Protected route logic included
- [x] Session-based user state established

### Product / Inventory
- [x] Main inventory page included
- [x] Product display implemented
- [x] Search/filter state included
- [x] Add-to-cart or product interaction logic included

### Orders and Cart
- [x] Cart-related actions represented
- [x] Order review or dashboard info included
- [x] State is managed for user interaction flow

### UI / UX
- [x] Navigation implemented
- [x] Reusable page layout present
- [x] Responsive design structure included
- [x] Pages are styled in a consistent format

---

## 7. Submission Requirements and Rubric Mapping

### Component Screens and Code Completeness

| Criteria | Description | Expected Level |
|---|---|---|
| Fully coded screens | All screens are implemented in a clean and organized way | Excellent / Good |
| Mostly complete screens | Most screens are done with minor omissions | Good / Satisfactory |
| Partial implementation | Some screens are missing or broken | Needs Improvement |
| Unfinished code | Many screens are missing or non-functional | Poor |

Suggested scoring box:

- Excellent: 25 pts
- Good: 20 pts
- Satisfactory: 13 pts
- Needs Improvement: 0–12 pts

### Detailed Architectural Annotations

| Criteria | Description | Expected Level |
|---|---|---|
| Full annotation | useEffects, states, onClicks, and context are clearly documented | Excellent |
| Mostly complete | Most major elements are annotated with minor gaps | Good |
| Some detail | Some pieces are annotated but not all | Needs Improvement |
| Minimal explanation | Details are absent or vague | Satisfactory / Poor |

Suggested scoring box:

- Excellent: 25 pts
- Good: 19 pts
- Needs Improvement: 14 pts
- Satisfactory: 9 pts

### Functional Features

| Criteria | Description | Expected Level |
|---|---|---|
| Fully functional | Authentication, products, cart, orders work smoothly | Excellent |
| Mostly functional | Minor issues in one feature area | Good |
| Partially functional | Several features incomplete | Satisfactory |
| Non-functional | Features largely missing | Needs Improvement |

Suggested scoring box:

- Excellent: 25 pts
- Good: 19 pts
- Satisfactory: 14 pts
- Needs Improvement: 9 pts

### Submission Quality and Evidence

| Criteria | Description | Expected Level |
|---|---|---|
| Complete package | Code, screenshots, and Loom are uploaded and labeled properly | Excellent |
| Mostly complete | Minor issues in screenshots or video quality | Good |
| Partial package | Missing or unclear evidence | Needs Improvement |
| Incomplete | No working code or proof of functionality | Satisfactory |

Suggested scoring box:

- Excellent: 15 pts
- Good: 11 pts
- Needs Improvement: 8 pts
- Satisfactory: 5 pts

---

## 8. Self-Evaluation Score Sheet

Use this section to estimate your score before handing in the final document.

| Section | Max Score | Your Score |
|---|---:|---:|
| Component screens fully coded | 25 |  |
| Detailed design annotations | 25 |  |
| Functional features and integration | 25 |  |
| Submission quality with code + screenshots + Loom | 15 |  |
| Total | 90 |  |

---

## 9. Screenshot and Loom Checklist

Before final submission, confirm all of the following:

- [ ] Code is uploaded and organized
- [ ] Screenshot of login page included
- [ ] Screenshot of signup page included
- [ ] Screenshot of inventory/product page included
- [ ] Screenshot of cart or order flow included
- [ ] Screenshot of dashboard/profile page included
- [ ] Loom/video explanation included
- [ ] Each screenshot is labeled clearly
- [ ] All images are readable and properly formatted
- [ ] Final PDF is prepared and saved for submission

---

## 10. Suggested Final Project Summary

This project demonstrates a complete frontend web application for NunesAuto Traders, using React and modern page routing to deliver a user-friendly dealership experience. It covers key business flows including user authentication, inventory display, shopping interaction, dashboard accessibility, and general company information. The implementation is designed to be organized, readable, and easy to extend for future backend integration.

The document above can be converted into a Word document and then exported as a PDF. It also includes a simple XMind-style concept map to support the design flow and make the visual planning easier for academic submission.

---

## 11. Quick Word/PDF Conversion Instructions

1. Copy the entire content of this markdown file into Microsoft Word.
2. Set the document title as: "NunesAuto Traders UI – Project Submission"
3. Add headings and formatting to improve readability.
4. Insert screenshots in the relevant sections.
5. Add the Loom link beneath the screenshot section.
6. Save the file as a Word document.
7. Export to PDF for final submission.

---

## 12. Optional Final Statement for the Assignment

“I hereby submit the NunesAuto Traders UI project as a structured frontend application demonstrating user authentication, product/inventory browsing, and account/order management functionality. The submission includes code, design annotations, screenshots, and a Loom explanation to support the implementation and evaluation process.”
