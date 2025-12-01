"""
PDF Generation Service using ReportLab
Creates professional PDF exports of financial plans without GTK dependencies
"""
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from datetime import datetime
from typing import Optional, List
import io
from schemas import FinancialInput, SummaryOutput, AIPlanOutput


def generate_pdf_bytes(
    input_data: FinancialInput,
    summary: SummaryOutput,
    ai_plan: Optional[AIPlanOutput] = None,
    include_branding: bool = True
) -> bytes:
    """
    Generate PDF as bytes from financial data using ReportLab
    """
    buffer = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=1*inch,
        bottomMargin=0.75*inch,
        title="VegaKash.AI Financial Plan"
    )
    
    # Container for PDF elements
    elements: List[Flowable] = []
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10,
        leading=14
    )
    
    # Add branding header
    if include_branding:
        elements.append(Paragraph("VegaKash.AI", title_style))
        elements.append(Paragraph("AI-Powered Financial Plan Report", subtitle_style))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%B %d, %Y')}", body_style))
        elements.append(Spacer(1, 0.3*inch))
    
    # Financial Summary Section
    elements.append(Paragraph("Financial Summary", heading_style))
    
    summary_data = [
        ['Metric', 'Amount'],
        ['Monthly Income', f'₹{summary.total_income:,.2f}'],
        ['Monthly Expenses', f'₹{summary.total_expenses:,.2f}'],
        ['Net Savings', f'₹{summary.net_savings:,.2f}'],
        ['Savings Rate', f'{summary.savings_rate_percent:.1f}%'],
        ['Debt-to-Income Ratio', f'{summary.debt_to_income_ratio_percent:.1f}%'],
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # 50-30-20 Rule Section
    elements.append(Paragraph("50-30-20 Budget Rule", heading_style))
    
    rule_data = [
        ['Category', 'Recommended', 'Percentage'],
        ['Needs (50%)', f'₹{summary.rule_50_30_20_needs:,.2f}', '50%'],
        ['Wants (30%)', f'₹{summary.rule_50_30_20_wants:,.2f}', '30%'],
        ['Savings (20%)', f'₹{summary.rule_50_30_20_savings:,.2f}', '20%'],
    ]
    
    rule_table = Table(rule_data, colWidths=[2*inch, 2*inch, 1*inch])
    rule_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#059669')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(rule_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Expense Breakdown Section
    elements.append(Paragraph("Monthly Expense Breakdown", heading_style))
    
    expense_data = [
        ['Category', 'Amount', '% of Income'],
        ['Housing/Rent', f'₹{input_data.expenses.housing_rent:,.2f}', 
         f'{(input_data.expenses.housing_rent/summary.total_income*100):.1f}%'],
        ['Groceries & Food', f'₹{input_data.expenses.groceries_food:,.2f}',
         f'{(input_data.expenses.groceries_food/summary.total_income*100):.1f}%'],
        ['Transport', f'₹{input_data.expenses.transport:,.2f}',
         f'{(input_data.expenses.transport/summary.total_income*100):.1f}%'],
        ['Utilities', f'₹{input_data.expenses.utilities:,.2f}',
         f'{(input_data.expenses.utilities/summary.total_income*100):.1f}%'],
        ['Insurance', f'₹{input_data.expenses.insurance:,.2f}',
         f'{(input_data.expenses.insurance/summary.total_income*100):.1f}%'],
        ['Entertainment', f'₹{input_data.expenses.entertainment:,.2f}',
         f'{(input_data.expenses.entertainment/summary.total_income*100):.1f}%'],
        ['Subscriptions', f'₹{input_data.expenses.subscriptions:,.2f}',
         f'{(input_data.expenses.subscriptions/summary.total_income*100):.1f}%'],
        ['Others', f'₹{input_data.expenses.others:,.2f}',
         f'{(input_data.expenses.others/summary.total_income*100):.1f}%'],
    ]
    
    expense_table = Table(expense_data, colWidths=[2.5*inch, 1.5*inch, 1*inch])
    expense_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(expense_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Active Loans Section
    if input_data.loans and len(input_data.loans) > 0:
        elements.append(Paragraph("Active Loans", heading_style))
        
        loan_data = [['Loan Name', 'Principal', 'Interest Rate', 'Remaining Months']]
        for loan in input_data.loans:
            loan_data.append([
                loan.name,
                f'₹{loan.outstanding_principal:,.2f}',
                f'{loan.interest_rate_annual}%',
                str(loan.remaining_months)
            ])
        
        loan_table = Table(loan_data, colWidths=[2*inch, 1.5*inch, 1*inch, 1.5*inch])
        loan_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7c3aed')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        
        elements.append(loan_table)
        elements.append(Spacer(1, 0.3*inch))
    
    # AI Plan Section
    if ai_plan:
        elements.append(PageBreak())
        elements.append(Paragraph("AI-Generated Financial Plan", heading_style))
        
        # Summary
        elements.append(Paragraph("<b>Summary</b>", body_style))
        elements.append(Paragraph(ai_plan.summary_text, body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Budget Breakdown
        elements.append(Paragraph("<b>Budget Recommendations</b>", body_style))
        for line in ai_plan.budget_breakdown.split('\n'):
            if line.strip():
                elements.append(Paragraph(line.strip(), body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Expense Optimizations
        elements.append(Paragraph("<b>Expense Optimization Tips</b>", body_style))
        for i, tip in enumerate(ai_plan.expense_optimizations, 1):
            elements.append(Paragraph(f"{i}. {tip}", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Savings and Investment Plan
        elements.append(Paragraph("<b>Savings & Investment Strategy</b>", body_style))
        for line in ai_plan.savings_and_investment_plan.split('\n'):
            if line.strip():
                elements.append(Paragraph(line.strip(), body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Debt Strategy
        elements.append(Paragraph("<b>Debt Management Strategy</b>", body_style))
        elements.append(Paragraph(ai_plan.debt_strategy, body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Goal Plan
        elements.append(Paragraph("<b>Goal Achievement Plan</b>", body_style))
        for line in ai_plan.goal_plan.split('\n'):
            if line.strip():
                elements.append(Paragraph(line.strip(), body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Action Items
        elements.append(Paragraph("<b>30-Day Action Plan</b>", body_style))
        for i, action in enumerate(ai_plan.action_items_30_days, 1):
            elements.append(Paragraph(f"{i}. {action}", body_style))
        elements.append(Spacer(1, 0.3*inch))
    
    # Disclaimer
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=10,
        spaceBefore=20,
        leading=10,
        borderColor=colors.HexColor('#e2e8f0'),
        borderWidth=1,
        borderPadding=10
    )
    
    disclaimer_text = ai_plan.disclaimer if ai_plan else (
        "This report is for informational purposes only and does not constitute financial advice. "
        "Please consult with a certified financial advisor for personalized recommendations."
    )
    
    elements.append(Paragraph("<b>Disclaimer:</b> " + disclaimer_text, disclaimer_style))
    
    # Build PDF
    doc.build(elements)
    
    buffer.seek(0)
    return buffer.getvalue()
