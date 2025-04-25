# Campus Doctor Listing Tool 🏥

A responsive, client-side doctor listing page built as part of the **Campus Assessment**. It allows users to search, filter, and sort doctors based on various criteria. All filtering and searching are done on the frontend using data fetched from a provided API.

---

## 🌟 Features Implemented

### 🔍 Autocomplete Search Bar
- Displays top 3 matching doctor names.
- Works with both **Enter key** and **click on suggestion**.
- Hides suggestions when no matches are found.

### 🧰 Dynamic Filter Panel
- **Consultation Type** (Radio): Video Consult, In Clinic.
- **Specialties** (Checkbox): Multiple selections allowed.
- **Sort Options**:
  - Fees (Ascending)
  - Experience (Descending)

> All filters work **in combination** and update the URL query parameters accordingly.

---

## ⚙️ API Used

- **URL**: `https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json`
- Fetched once on load — all filtering and searching are performed on the frontend.

---

## 🧪 Test Case Support (data-testid)

All elements are integrated with the required `data-testid` values as listed in the problem statement. These help support automated testing of the following:

- Autocomplete input and suggestions.
- Doctor cards and details.
- Filtering (Consultation Mode, Specialties).
- Sorting options.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/stutig123/campus-doctor-listing.git
cd campus-doctor-listing

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

