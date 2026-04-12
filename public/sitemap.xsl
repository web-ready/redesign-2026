<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — Oasis of Change</title>
        <style>
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8faf8;color:#1a2e1a;line-height:1.6;padding:2rem 1rem}
          .container{max-width:960px;margin:0 auto}
          header{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:2px solid #d1e7d1}
          h1{font-size:1.75rem;font-weight:700;color:#1a2e1a;margin-bottom:.25rem}
          .subtitle{font-size:.95rem;color:#4a6a4a}
          .stats{display:flex;gap:1.5rem;margin-top:1rem;flex-wrap:wrap}
          .stat{background:#fff;border:1px solid #d1e7d1;border-radius:8px;padding:.6rem 1rem;font-size:.85rem;color:#2d5a2d;font-weight:600}
          table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)}
          thead{background:#2d5a2d;color:#fff}
          th{text-align:left;padding:.75rem 1rem;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
          td{padding:.65rem 1rem;font-size:.875rem;border-bottom:1px solid #eef4ee}
          tr:last-child td{border-bottom:none}
          tbody tr:hover{background:#f0f7f0}
          a{color:#2d5a2d;text-decoration:none;word-break:break-all}
          a:hover{text-decoration:underline}
          .priority{display:inline-block;padding:.15rem .5rem;border-radius:4px;font-size:.75rem;font-weight:600;text-align:center;min-width:2.5rem}
          .priority-high{background:#dcfce7;color:#166534}
          .priority-medium{background:#fef9c3;color:#854d0e}
          .priority-low{background:#f1f5f9;color:#475569}
          .freq{font-size:.8rem;color:#6b8a6b;text-transform:capitalize}
          .lastmod{font-size:.8rem;color:#4a6a4a;white-space:nowrap}
          footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #d1e7d1;font-size:.8rem;color:#6b8a6b;text-align:center}
          @media(max-width:640px){th:nth-child(3),td:nth-child(3),th:nth-child(4),td:nth-child(4){display:none}}
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>XML Sitemap</h1>
            <p class="subtitle">Oasis of Change, Inc. — oasisofchange.com</p>
            <div class="stats">
              <span class="stat">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs
              </span>
              <span class="stat">
                Last updated: <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/>
              </span>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td class="lastmod">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td class="freq">
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.7">
                        <span class="priority priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <footer>
            This is an XML sitemap intended for search engines. Learn more at <a href="https://www.sitemaps.org/">sitemaps.org</a>.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
