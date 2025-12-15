// Enhanced PDF export with branding, header, and pagination for amortization
// Ensure these are installed: npm i jspdf html2canvas
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportCalculatorPDF(
  rootSelector = '.calculator-container',
  filename = 'emi-summary.pdf',
  options = {}
) {
  const {
    title = 'EMI Calculator Report',
    subtitle = 'VegaKash.AI',
    includeTimestamp = true
  } = options;

  const root = document.querySelector(rootSelector);
  if (!root) throw new Error('Calculator container not found');

  // Build a dedicated, print-friendly container rather than screenshotting interactive UI
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.background = '#ffffff';
  container.style.padding = '16px';
  container.style.fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif';

  // Extract key summary values from the existing DOM safely
  const emiEl = root.querySelector('.result-card.highlight .result-value');
  const emiValue = emiEl ? emiEl.textContent.trim() : '';

  const readValueByLabel = (labelText) => {
    const labels = Array.from(root.querySelectorAll('.result-card .result-label'));
    const match = labels.find((l) => (l.textContent || '').includes(labelText));
    if (!match) return '';
    const valEl = match.parentElement?.querySelector('.result-value');
    return valEl ? valEl.textContent.trim() : '';
  };

  const principalValue = readValueByLabel('Principal');
  const interestValue = readValueByLabel('Total Interest');
  const totalValue = readValueByLabel('Total Amount');

  // Header block
  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px;">
      <div>
        <div style="font-size:18px;font-weight:800;color:#374151;letter-spacing:-0.2px;">${title}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">${subtitle}</div>
      </div>
      ${includeTimestamp ? `<div style=\"font-size:11px;color:#9ca3af;\">Generated: ${new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</div>` : ''}
    </div>
    <div style="height:1px;background:#e5e7eb;margin-bottom:12px;"></div>
  `;
  container.appendChild(header);

  // Highlight EMI card
  const highlight = document.createElement('div');
  highlight.setAttribute('style','background:#667eea;color:#ffffff;border-radius:10px;padding:12px;margin-bottom:10px;');
  highlight.innerHTML = `
    <div style="font-size:12px;font-weight:700;opacity:0.9;">Monthly EMI</div>
    <div style="font-size:22px;font-weight:800;letter-spacing:-0.3px;">${emiValue}</div>
  `;
  container.appendChild(highlight);

  // 3-up summary grid
  const grid = document.createElement('div');
  grid.setAttribute('style','display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;');
  function summaryCard(label, value){
    const d = document.createElement('div');
    d.setAttribute('style','background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:10px;');
    d.innerHTML = `<div style="font-size:11px;font-weight:600;color:#6b7280;">${label}</div><div style="font-size:16px;font-weight:700;color:#1f2937;">${value}</div>`;
    return d;
  }
  grid.appendChild(summaryCard('Principal Amount', principalValue));
  grid.appendChild(summaryCard('Total Interest', interestValue));
  grid.appendChild(summaryCard('Total Payable', totalValue));
  container.appendChild(grid);

  // Append for rendering
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(102, 126, 234);
    pdf.text(title, margin, margin);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(subtitle, margin, margin + 20);
    
    if (includeTimestamp) {
      const timestamp = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      pdf.setFontSize(10);
      pdf.text(`Generated: ${timestamp}`, margin, margin + 35);
    }

    // Draw separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, margin + 45, pageWidth - margin, margin + 45);

    // Content
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let yPosition = margin + 60;

    if (yPosition + imgHeight <= pageHeight - margin) {
      // Fits on one page
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    } else {
      // Multi-page with pagination
      let remainingHeight = imgHeight;
      let srcY = 0;
      let pageNum = 1;

      while (remainingHeight > 0) {
        const availableHeight = pageHeight - yPosition - margin;
        const sliceHeight = Math.min(remainingHeight, availableHeight);
        const sliceRatio = sliceHeight / imgHeight;
        
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          yPosition,
          imgWidth,
          imgHeight,
          '',
          'FAST',
          0,
          -srcY
        );

        // Footer with page number
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${pageNum} - VegaKash.AI`,
          pageWidth / 2,
          pageHeight - 20,
          { align: 'center' }
        );

        remainingHeight -= availableHeight;
        srcY += availableHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          yPosition = margin;
          pageNum++;
        }
      }
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
