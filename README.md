# Sonitpur Polytechnic Multi-Subject Exam

Static, mobile-friendly exam portal for Thermal Engineering — IC Engine, Automobile Engineering II, and Industrial Engineering and Productivity (IEM).

## Use

- Publish `index.html` with GitHub Pages, or open it in a current browser.
- Students log in once, complete all three exams in any order, and return to the subject home after each submission.
- Each subject has an independent 36-minute timer. Submitted scores, responses, and monitoring events are saved in that browser's local storage.
- After all exams are completed, students can review and download the combined report. **Final submit** sends the combined report to the configured teacher email through Google Apps Script.

## Email delivery

The page is configured for the existing Sonitpur Polytechnic Apps Script web app. `apps-script/Code.gs` is included for reference and redeployment. If the email address, endpoint, or access key changes, update both the page and Apps Script, then deploy the Apps Script as a web app.

The browser uses a static Apps Script endpoint and key, so this is suitable for a classroom GitHub Pages workflow but is not a secure identity system. Local saved progress is limited to the same browser/device. Monitoring is best-effort and cannot reliably detect screenshots or activity in other mobile apps. Monitoring events do not affect marks.
