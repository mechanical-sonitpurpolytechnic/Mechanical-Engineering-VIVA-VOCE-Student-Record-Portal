# Apps Script setup

1. Open the Google Apps Script project currently used by the subject exam pages.
2. Replace its server source with `Code.gs` if you want the combined email format supported by this kit.
3. Keep the destination address and access key consistent with the values in `index.html`.
4. Deploy as a web app that executes as your account and can be reached by the exam page. Update the endpoint in `index.html` if Google provides a different `/exec` URL.
5. Test with a sample submission and confirm that the email arrives before the live exam.

The exam page discloses the report contents and recipient before login and again before final submission. Browser cross-origin restrictions mean the page can show that it handed the submission to the Apps Script service, but cannot verify Gmail delivery.
