# 🎯 Requirement Management – **UI MOCKUP**

> 📝 **Important Note:** This is a **UI mockup only**.  
> ❌ **No real AI chatbot integration** or actual logic has been implemented.  
> ✅ Purpose: Present workflow, demonstrate user journey, and generate mock UI.

---

## 📄 Screen 1: Requirement List

### ✅ Purpose:
Simulate a UI screen to manage all requirements created via the AI chatbot mockup.

### 📊 Table Columns:
| Field               | Description                                  |
|---------------------|----------------------------------------------|
| Requirement Name    | Title of the requirement                     |
| Customer            | Customer name                                |
| Assignee            | Person in charge                             |
| Status              | Pending / In Discussion / Confirmed          |
| Expected Deadline   | Client's desired delivery date               |
| Created Date        | Date the requirement was created             |

### ⚙️ Actions (mockup only):
- Search by requirement name
- Filter by: Customer, Assignee, Status
- Button: **"Create Requirement (via AI - mockup only)"**
- Click a row → open **Requirement Detail screen**
- Button: **Export to Excel (mock action)**

---

## ✨ Screen 2: Create Requirement via AI (**UI mockup only**)

> ⚠️ **All steps below are UI mockups only.**  
> The actual chatbot AI will be integrated later via API / iframe / plugin.  

---

### 🔍 Step 1: Enter initial info (static form)

| Field                | Input Type           |
|----------------------|----------------------|
| Customer             | Dropdown / Autocomplete |
| Assignee             | Dropdown             |
| Expected Deadline    | Date picker          |

→ After completing → click **“Continue”** to go to AI chat (mock only)

---

### 💬 Step 2: Interact with AI (UI mockup only)

- Text area for user to input natural language request  
  _Example:_ `"I need a warehouse system with stock-in/stock-out and low stock alerts."`

- Mock result: A table of AI-generated requirement items

| Feature              | Detail                   | Description                                 | Notes            |
|----------------------|---------------------------|---------------------------------------------|------------------|
| Stock Management      | Stock-In Entry            | Allows users to input new inventory items   | From AI (mock)   |
| Stock Management      | Stock-Out Entry           | Remove items when delivered or sold         | From AI (mock)   |
| Stock Monitoring      | Low Stock Alert           | Alert users when quantity drops below limit | From AI (mock)   |

---

### ✏️ Step 3: Edit Requirement Table (UI mockup)
- Edit Feature or Detail text
- Add or remove Feature / Detail
- Button **“Regenerate”** (mockup only, no real AI logic)

---

### ✅ Step 4: Save Requirement (UI mockup)
- Button **“Confirm & Save”**
- → Redirect to **Requirement Detail Screen (mock only)**

---

### ✏️ Step 3: Edit Requirement Table (UI mockup)
- Edit Feature / Detail / Description
- Add or remove Feature or Detail
- Button **“Regenerate”** (mockup only, no real AI logic)

### ✅ Step 4: Save Requirement (UI mockup)
- Button **“Confirm & Save”**
- → Redirect to **Requirement Detail Screen (mock only)**

### ⚙️ UI Actions (mockup):
- Edit Feature or Detail
- Add new Feature / Detail
- Delete row
- Add notes
- Button **“Export to Excel (mock)”**
- Button **“Back to list”**

---

## 📌 Summary

- ✅ All screens are **UI mockups only** for:
  - Presenting AI-driven requirement creation workflow
  - Demonstrating user interaction steps
  - Generating frontend UI code from `.md`
- ❌ No real AI integration yet.
- ⚙️ AI chatbot will be integrated later via script / API / iframe if needed.

# Update
## 🧾 Screen 3: Requirement Detail View (UI mockup only)

> This screen appears after clicking a row in the Requirement List.  
> It displays **full detail** of a saved requirement, including user input and AI-generated breakdown.

### 📌 Basic Info

| Field             | Description                                  |
|------------------|----------------------------------------------|
| Requirement Name | Title of the requirement                     |
| Customer         | Customer associated with the requirement     |
| Assignee         | Person responsible for this requirement      |
| Status           | Pending / In Discussion / Confirmed          |
| Expected Deadline| Client’s expected delivery date              |
| Created Date     | When this requirement was originally created |

---

### 📝 Original User Input

> Mô tả chi tiết do người dùng nhập ở bước tương tác với AI:

### 🤖 AI-Generated Requirement Breakdown