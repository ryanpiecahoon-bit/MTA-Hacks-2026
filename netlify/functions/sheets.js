/**
 * Netlify serverless function that proxies POST requests to the Google Apps Script Web app.
 * Use this when the frontend cannot reach script.google.com directly (e.g. firewall blocking).
 *
 * Environment variables (set in Netlify UI, not exposed to client):
 *   APPS_SCRIPT_URL - the real Google Apps Script Web app URL
 *
 * Frontend config: set VITE_APPS_SCRIPT_URL to this function's URL
 *   e.g. https://your-site.netlify.app/.netlify/functions/sheets
 */

exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "APPS_SCRIPT_URL is not configured. Set it in Netlify Environment variables."
      })
    };
  }

  let body = event.body || "{}";
  if (event.isBase64Encoded) {
    body = Buffer.from(body, "base64").toString("utf8");
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers,
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Proxy failed to reach Apps Script",
        details: err.message
      })
    };
  }
};
