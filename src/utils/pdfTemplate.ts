export const quotationHtmlTemplate = (quotation: any) => {
  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        td { padding: 6px; }
        .title { font-size: 22px; font-weight: bold; }
        .section-title { font-size: 18px; margin-top: 25px; font-weight: bold; }
        .table-header { background: #f2f2f2; font-weight: bold; }
        .signatures { margin-top: 60px; width: 100%; }
      </style>
    </head>

    <body>

      <div class="title">${quotation.title}</div>
      <p><b>Ref No:</b> ${quotation.refNo}</p>
      <p><b>Subject:</b> ${quotation.subject}</p>
      <p><b>Issue Date:</b> ${new Date(quotation.issueDate).toLocaleDateString()}</p>

      <div class="section-title">Project Goal</div>
      <p>${quotation.projectGoal}</p>

      <div class="section-title">Scope of Work</div>
      <p>${quotation.scopeOfWork}</p>

      <div class="section-title">Tech Stack</div>
      <table border="1">
        <tr class="table-header">
          <td>Component</td>
          <td>Technology</td>
        </tr>
        ${quotation.techStackItems
          .map(
            (x: any) => `
            <tr>
              <td>${x.component}</td>
              <td>${x.technology}</td>
            </tr>
        `
          )
          .join("")}
      </table>

      <div class="section-title">Cost Breakdown</div>
      <table border="1">
        <tr class="table-header">
          <td>Module</td>
          <td>Technology</td>
          <td>Cost</td>
        </tr>
        ${quotation.costBreakdownItems
          .map(
            (x: any) => `
            <tr>
              <td>${x.moduleName}</td>
              <td>${x.technology}</td>
              <td>${x.cost}</td>
            </tr>
        `
          )
          .join("")}
      </table>

      <div class="section-title">Project Investment</div>
      <p><b>Total:</b> ₹${quotation.totalProjectInvestment}</p>

      <table class="signatures">
        <tr>
          <td align="left">
            <b>Authorised Signatory</b><br>
            ${quotation.proSignCompanyName}<br>
            ${quotation.proSignName}<br>
            ${quotation.proSignDesignation}<br>
            ${quotation.proSignPhone}
          </td>

          <td align="right">
            <b>Client Signatory</b><br>
            ${quotation.clientSignCompanyName || ""}<br>
            ${quotation.clientSignName || ""}<br>
            ${quotation.clientSignDesignation || ""}<br>
            ${quotation.clientSignPhone || ""}
          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
};