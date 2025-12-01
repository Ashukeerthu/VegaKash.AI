"""
PDF Generator Service using ReportLab
Pure Python PDF generation without GTK dependencies
"""
from io import BytesIO
from datetime import datetime
from typing import Optional, List
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.platypus import Flowable
from reportlab.lib.enums import TA_CENTER

from schemas import FinancialInput, SummaryOutput, AIPlanOutput


def generate_pdf_bytes(
    financial_input: FinancialInput,
    summary: SummaryOutput,
    ai_plan: Optional[AIPlanOutput] = None
) -> bytes:
    """
    Generate a professional PDF financial report using ReportLab
    
    Args:
        financial_input: User's financial input data
        summary: Calculated financial summary
        ai_plan: Optional AI-generated financial plan
        
    Returns:
        PDF file as bytes
    """
    buffer = BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch,
        title="VegaKash.AI Financial Report"
    )
    
    # Container for PDF elements
    elements: List[Flowable] = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a237e'),
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#666666'),
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1a237e'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    # Header
    elements.append(Paragraph("VegaKash.AI", title_style))
    elements.append(Paragraph("Personal Financial Report", subtitle_style))
    elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Summary Section
    elements.append(Paragraph("Financial Summary", heading_style))
    
    summary_data = [
        ['Metric', 'Amount'],
        ['Total Monthly Income', f"₹{summary.total_income:,.2f}"],
        ['Total Monthly Expenses', f"₹{summary.total_expenses:,.2f}"],
        ['Net Savings', f"₹{summary.net_savings:,.2f}"],
        ['Savings Rate', f"{summary.savings_rate_percent:.1f}%"],
        ['Debt-to-Income Ratio', f"{summary.debt_to_income_ratio_percent:.1f}%"],
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # 50-30-20 Rule Section
    elements.append(Paragraph("50-30-20 Rule Recommendation", heading_style))
    
    rule_data = [
        ['Category', 'Recommended Amount', 'Percentage'],
        ['Needs (Essential)', f"₹{summary.rule_50_30_20_needs:,.2f}", '50%'],
        ['Wants (Lifestyle)', f"₹{summary.rule_50_30_20_wants:,.2f}", '30%'],
        ['Savings & Investments', f"₹{summary.rule_50_30_20_savings:,.2f}", '20%'],
    ]
    
    rule_table = Table(rule_data, colWidths=[2*inch, 2*inch, 1*inch])
    rule_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.lightblue, colors.lightgreen, colors.lightyellow]),
    ]))
    elements.append(rule_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Expense Breakdown
    elements.append(Paragraph("Monthly Expense Breakdown", heading_style))
    
    expense_data = [
        ['Category', 'Amount', 'Percentage'],
        ['Housing/Rent', f"₹{financial_input.expenses.housing_rent:,.2f}", 
         f"{(financial_input.expenses.housing_rent/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Groceries & Food', f"₹{financial_input.expenses.groceries_food:,.2f}",
         f"{(financial_input.expenses.groceries_food/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Transport', f"₹{financial_input.expenses.transport:,.2f}",
         f"{(financial_input.expenses.transport/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Utilities', f"₹{financial_input.expenses.utilities:,.2f}",
         f"{(financial_input.expenses.utilities/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Insurance', f"₹{financial_input.expenses.insurance:,.2f}",
         f"{(financial_input.expenses.insurance/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Entertainment', f"₹{financial_input.expenses.entertainment:,.2f}",
         f"{(financial_input.expenses.entertainment/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Subscriptions', f"₹{financial_input.expenses.subscriptions:,.2f}",
         f"{(financial_input.expenses.subscriptions/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
        ['Others', f"₹{financial_input.expenses.others:,.2f}",
         f"{(financial_input.expenses.others/summary.total_expenses*100):.1f}%" if summary.total_expenses > 0 else "0%"],
    ]
    
    expense_table = Table(expense_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
    expense_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(expense_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Active Loans Section
    if financial_input.loans and len(financial_input.loans) > 0:
        elements.append(Paragraph("Active Loans", heading_style))
        
        loan_data = [['Loan Name', 'Principal', 'Interest Rate', 'Remaining Months']]
        for loan in financial_input.loans:
            loan_data.append([
                loan.name,
                f"₹{loan.outstanding_principal:,.2f}",
                f"{loan.interest_rate_annual}%",
                str(loan.remaining_months)
            ])
        
        loan_table = Table(loan_data, colWidths=[2*inch, 1.5*inch, 1*inch, 1.5*inch])
        loan_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a237e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(loan_table)
        elements.append(Spacer(1, 0.2*inch))
    
    # AI Plan Section (if available)
    if ai_plan:
        elements.append(PageBreak())
        elements.append(Paragraph("AI-Generated Financial Plan", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        
        # Summary
        elements.append(Paragraph("<b>Summary</b>", styles['Heading3']))
        elements.append(Paragraph(ai_plan.summary_text, styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # Budget Breakdown
        elements.append(Paragraph("<b>Budget Breakdown</b>", styles['Heading3']))
        for line in ai_plan.budget_breakdown.split('\n'):
            if line.strip():
                elements.append(Paragraph(line, styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # Expense Optimizations
        elements.append(Paragraph("<b>Expense Optimization Tips</b>", styles['Heading3']))
        for i, tip in enumerate(ai_plan.expense_optimizations, 1):
            elements.append(Paragraph(f"{i}. {tip}", styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # Savings & Investment Plan
        elements.append(Paragraph("<b>Savings & Investment Plan</b>", styles['Heading3']))
        for line in ai_plan.savings_and_investment_plan.split('\n'):
            if line.strip():
                elements.append(Paragraph(line, styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # Debt Strategy
        elements.append(Paragraph("<b>Debt Management Strategy</b>", styles['Heading3']))
        elements.append(Paragraph(ai_plan.debt_strategy, styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # Goal Plan
        elements.append(Paragraph("<b>Goal Achievement Plan</b>", styles['Heading3']))
        for line in ai_plan.goal_plan.split('\n'):
            if line.strip():
                elements.append(Paragraph(line, styles['Normal']))
        elements.append(Spacer(1, 0.15*inch))
        
        # 30-Day Action Items
        elements.append(Paragraph("<b>30-Day Action Plan</b>", styles['Heading3']))
        for i, action in enumerate(ai_plan.action_items_30_days, 1):
            elements.append(Paragraph(f"{i}. {action}", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Disclaimer
        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            leftIndent=20,
            rightIndent=20,
            spaceAfter=10
        )
        elements.append(Paragraph("<b>Disclaimer:</b>", disclaimer_style))
        elements.append(Paragraph(ai_plan.disclaimer, disclaimer_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
