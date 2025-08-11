## Role
You are a **senior front-end developer**.

## Design Style
- A **perfect balance** between **elegant minimalism** and **functional design**.
- **Soft, refreshing gradient colors** that seamlessly integrate with the brand palette.
- **Well-proportioned white space** for a clean layout.
- **Light and immersive** user experience.
- **Clear information hierarchy** using **subtle shadows and modular card layouts**.
- **Natural focus on core functionalities**.
- **Refined rounded corners**.
- **Delicate micro-interactions**.
- **Comfortable visual proportions**.
- **Gradient Colors**: Stick with 2–3 tones matching the brand (e.g., light #EDE5D6 → mint → white)
- **Rounded Corners**: Use large radius such as `2xl` (24px) or `3xl` (32px) for a softer feel
- **Micro-interactions**: Subtle hover effects, skeleton loading, animated checkmarks on actions
- **Typography**: Use clean sans-serif fonts like **Inter**, **DM Sans**, or **Public Sans**

## Technical Specifications
1. **Each page should be 1140x1280 PX**
2. **Icons**: must be vector-based and clean — no background blocks, baseplates, or outer frames. You may use MUI Icons or other modern SVG icon sets.
3. **Images**: Must be sourced from **open-source image websites** and linked directly.
4. **Styles**: should be handled using your chosen React styling solution (e.g., Material UI, Emotion, or Styled Components)
5. **Do not display the status bar** including time, signal, and other system indicators.
6. **Do not display non-mobile elements**, such as scrollbars.
7. **All text should be only black or white**.
8. **Icon Library**: Use  **MUI Icons**, **Tabler**, **Lucide**, or custom inline SVGs as long as they are lightweight and visually clean.
9. **Image Source**: Recommended: **Unsplash**, **Pexels**, or **OpenPeeps** (for user avatars or scenes)
10. **Typography & spacing**: Use MUI Typography component with these style values
11. **Card Styling**:  Use MUI Card with the following enhancements:
12. **No Status Bar / Scrollbars**: Absolutely right – keep mockup screens clean and focused on content

## Global UI Elements

### Topbar

- **Logo:** "CRM ITV"

- **Notification icon**

- **Profile avatar**
  - When tapping on the avatar, a dropdown appears with:
    - **Settings** → Leads to the user settings page
    - **Logout** → Logs the user out and returns to the Login screen

### Sidebar (Left Menu Navigation)

- A fixed vertical sidebar on the left side of the screen.
- Menu items include:
  - **Dashboard báo cáo**
  - **Quản lý khách hàng**
  - **Quản lý cơ hội bán hàng (Deal)**
  - **Quản lý Requirement**
  - **Quản lý báo giá / ước tính (Quotation / Estimation)**
  - **Quản lý hợp đồng & template hợp đồng**
  - **Quản lý Biên bản nghiệm thu**
  - **Quản lý Hóa đơn**

- Each item should:
  - Be clearly labeled.
  - Use a clean vector icon (e.g., from **Lucide**, **MUI**, or similar).
  - Highlight the active section.
  - Collapse into icons only on smaller widths if responsive design is required.

## Task
- Follow the **design style** and **technical specifications** to generate a complete **UI design plan**.
<!-- - Create a **Quản lý khách hàng** now. Following the **manage_customer.md**. -->
