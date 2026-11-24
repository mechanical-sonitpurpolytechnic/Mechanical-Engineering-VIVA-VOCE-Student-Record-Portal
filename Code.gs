/**
 * Multi-exam and viva report mailer for the Sonitpur Polytechnic exam pages.
 * Deploy as a web app that executes as the owner's Google account with access set to Anyone.
 */
const DESTINATION_EMAIL = "kabyanilk@gmail.com";
const ACCESS_KEY = "TEIC-2026-Exam-Report-Key-r9F4cT8p2Lm7Xq1B";
const MAX_REPORTS_PER_DAY = 100;
const MAX_REPORT_LENGTH = 40000;

function doGet() {
  return HtmlService.createHtmlOutput(
    "<h2>Exam & Viva report endpoint is ready.</h2><p>Submit reports from the portal page.</p>"
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (!constantTimeEquals_(String(params.accessKey || ""), ACCESS_KEY)) {
      return resultPage_({ ok: false, message: "The report access key was rejected." });
    }

    let payload;
    try {
      payload = JSON.parse(String(params.payload || ""));
    } catch (_) {
      return resultPage_({ ok: false, message: "The report data was not valid JSON." });
    }

    const report = String(payload.report || "").trim();
    const attemptId = String(payload.attemptId || "").trim().slice(0, 100);
    const rollNumber = String(payload.rollNumber || "").trim().slice(0, 80);
    if (!report || report.length > MAX_REPORT_LENGTH ||
        !report.includes("SECURE EXAMINATION REPORT") || !attemptId || !rollNumber) {
      return resultPage_({ ok: false, message: "The report is incomplete or exceeds the size limit." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const props = PropertiesService.getScriptProperties();
      const recent = JSON.parse(props.getProperty("recentAttempts") || "[]");
      if (recent.indexOf(attemptId) !== -1) {
        return resultPage_({ ok: true, duplicate: true, message: "This report was already received." });
      }

      const day = Utilities.formatDate(new Date(), "UTC", "yyyyMMdd");
      const countKey = "reportCount_" + day;
      const count = Number(props.getProperty(countKey) || 0);
      if (count >= MAX_REPORTS_PER_DAY) {
        return resultPage_({ ok: false, message: "The daily report limit has been reached." });
      }

      const filename = "Viva_Report_" + rollNumber.replace(/[^a-z0-9_-]/gi, "_") + ".txt";
      const examTitle = (report.match(/^Examination\s*:\s*(.+)$/mi) || [])[1] || "Viva Voce Examination";
      MailApp.sendEmail({
        to: DESTINATION_EMAIL,
        subject: examTitle.trim().replace(/\s+/g, " ").slice(0, 100) + " — " + rollNumber,
        body: report,
        attachments: [Utilities.newBlob(report, "text/plain", filename)]
      });

      recent.push(attemptId);
      props.setProperty("recentAttempts", JSON.stringify(recent.slice(-500)));
      props.setProperty(countKey, String(count + 1));
      return resultPage_({ ok: true, message: "Report emailed successfully to " + DESTINATION_EMAIL + "." });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return resultPage_({ ok: false, message: "Email delivery failed: " + String(err && err.message || err) });
  }
}

function resultPage_(result) {
  const safeJson = JSON.stringify(result).replace(/</g, "\\u003c");
  const html = "<!doctype html><meta charset=\"utf-8\"><script>" +
    "try{if(window.parent&&window.parent!==window){window.parent.postMessage(" + safeJson + ",'*');}}" +
    "catch(_){}</script><p>" + String(result.message || "Processed.") + "</p>";
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}