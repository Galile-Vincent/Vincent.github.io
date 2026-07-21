# Team Application Form

This is a standalone application form for Vincent's team recruitment.

## Features

- Clean, Apple-inspired design matching the main website
- All 12 required questions included
- Form validation for required fields
- File upload for resume (optional)
- Success message with redirect button back to main site
- Fully responsive design
- Smooth animations and transitions

## Setup Instructions

### Option 1: Using Formspree (Recommended)

1. Go to [Formspree.io](https://formspree.io) and create a free account
2. Create a new form and get your form ID
3. Open `index.html` and replace `YOUR_FORM_ID` in the form action with your actual Formspree form ID:
   ```html
   <form id="application-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Formspree will send all submissions to your email

### Option 2: Using Your Own Backend

If you want to use your own backend:

1. Create an API endpoint to handle form submissions
2. Update the form action in `index.html` to point to your endpoint
3. Modify the JavaScript in `apply.js` if needed to handle your specific backend response

### Option 3: Email Submission (Simple Alternative)

Replace the form action with a mailto link:
```html
<form action="mailto:your-email@example.com" method="POST" enctype="text/plain">
```

Note: This method is less reliable and doesn't support file uploads well.

## Deployment

This folder can be deployed separately on any static hosting service:

- **GitHub Pages**: Create a separate repository or branch
- **Netlify**: Drag and drop the `apply` folder
- **Vercel**: Deploy the folder directly
- **Any static hosting**: Upload the files via FTP/SFTP

## Files Structure

- `index.html` - Main application form page
- `apply.css` - Stylesheet matching the main site design
- `apply.js` - Form validation and submission handling
- `README.md` - This file

## Questions Included

1. Contact Email (required)
2. Name (required)
3. Major (required)
4. Year in School (required, dropdown)
5. Why join the team (required, textarea)
6. What can you do (required, textarea)
7. Time commitment (required, dropdown)
8. AI opinion (required, textarea)
9. AI tools used (required, checkboxes: ChatGPT, Claude, Grok, Gemini, Deepseek)
10. Devices owned (required, checkboxes: iPhone, Macbook, iPad)
11. Resume upload (optional, file upload)
12. Additional comments (optional, textarea)

## After Submission

Users will see a success message with a button to return to the main site at:
https://galile-vincent.github.io/Vincent.github.io/index

## Customization

To customize the form:
- Edit colors in `apply.css` (currently using #0071e3 blue)
- Modify questions in `index.html`
- Adjust validation rules in `apply.js`
