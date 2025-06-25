const fs = require("fs");
const path = require("path");

/**
 * Loads an HTML email template and replaces placeholders with actual values.
 * @param {string} filename - The HTML file name (e.g., "welcomeEmail.html")
 * @param {object} replacements - An object of key-value pairs to replace in the template
 * @returns {string} HTML content with replacements applied
 */
function loadTemplate(filename, replacements = {}) {
    const filePath = path.join(__dirname, `./emailTemplates/${filename}`);
    let html = fs.readFileSync(filePath, "utf8");

    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, "g"); // Global replace for all instances
        html = html.replace(regex, replacements[key]);
    }

    return html;
}

module.exports = loadTemplate;