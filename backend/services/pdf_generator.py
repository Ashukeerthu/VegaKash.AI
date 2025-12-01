"""
PDF Generation Service
Creates professional PDF exports of financial plans
"""
from weasyprint import HTML, CSS
from jinja2 import Template
from datetime import datetime
from typing import Optional
import io
from schemas import FinancialInput, SummaryOutput, AIPlanOutput


def generate_pdf_bytes(
    input_data: FinancialInput,
    summary: SummaryOutput,
    ai_plan: Optional[AIPlanOutput] = None,
    include_branding: bool = True
) -> bytes:
    """
    Generate PDF as bytes from financial data
    """
    html_content = _generate_html(input_data, summary, ai_plan, include_branding)
    css_content = _get_pdf_styles()
    
    # Generate PDF
    pdf_file = io.BytesIO()
    HTML(string=html_content).write_pdf(
        pdf_file,
        stylesheets=[CSS(string=css_content)]
    )
    
    pdf_file.seek(0)
    return pdf_file.getvalue()


def _generate_html(
    input_data: FinancialInput,
    summary: SummaryOutput,
    ai_plan: Optional[AIPlanOutput],
    include_branding: bool
) -> str:
    """
    Generate HTML content for PDF
    """
    template = Template("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VegaKash.AI Financial Plan</title>
</head>
<body>
    <div class="header">
        {% if include_branding %}
        <div class="branding">
            <h1 class="logo">🌟 VegaKash.AI</h1>
            <p class="tagline">Your AI-Powered Financial Planning Assistant</p>
        </div>
        {% endif %}
        <div class="date">Generated on: {{ current_date }}</div>
    </div>

    <div class="content">
        <section class="section">
            <h2 class="section-title">📊 Financial Summary</h2>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Total Monthly Income</div>
                    <div class="info-value">{{ currency }}{{ "{:,.2f}".format(summary.total_income) }}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Total Monthly Expenses</div>
                    <div class="info-value expense">{{ currency }}{{ "{:,.2f}".format(summary.total_expenses) }}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Net Savings</div>
                    <div class="info-value {{ 'deficit' if summary.has_deficit else 'positive' }}">
                        {{ currency }}{{ "{:,.2f}".format(summary.net_savings) }}
                    </div>
                </div>
                <div class="info-card">
                    <div class="info-label">Savings Rate</div>
                    <div class="info-value">{{ "{:.1f}".format(summary.savings_rate_percent) }}%</div>
                </div>
            </div>

            <div class="subsection">
                <h3>50-30-20 Budget Rule</h3>
                <table class="budget-table">
                    <tr>
                        <td>Needs (50%)</td>
                        <td class="amount">{{ currency }}{{ "{:,.2f}".format(summary.rule_50_30_20_needs) }}</td>
                    </tr>
                    <tr>
                        <td>Wants (30%)</td>
                        <td class="amount">{{ currency }}{{ "{:,.2f}".format(summary.rule_50_30_20_wants) }}</td>
                    </tr>
                    <tr>
                        <td>Savings (20%)</td>
                        <td class="amount">{{ currency }}{{ "{:,.2f}".format(summary.rule_50_30_20_savings) }}</td>
                    </tr>
                </table>
            </div>

            <div class="advice-box">
                <strong>Quick Advice:</strong> {{ summary.basic_advice }}
            </div>
        </section>

        <section class="section">
            <h2 class="section-title">💰 Expense Breakdown</h2>
            <table class="expense-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>% of Income</th>
                    </tr>
                </thead>
                <tbody>
                    {% for category, amount in expenses.items() %}
                    {% if amount > 0 %}
                    <tr>
                        <td>{{ category }}</td>
                        <td>{{ currency }}{{ "{:,.2f}".format(amount) }}</td>
                        <td>{{ "{:.1f}".format((amount / summary.total_income) * 100) }}%</td>
                    </tr>
                    {% endif %}
                    {% endfor %}
                </tbody>
            </table>
        </section>

        {% if loans %}
        <section class="section">
            <h2 class="section-title">🏦 Active Loans</h2>
            <table class="loan-table">
                <thead>
                    <tr>
                        <th>Loan Type</th>
                        <th>Outstanding</th>
                        <th>Interest Rate</th>
                        <th>Months Left</th>
                    </tr>
                </thead>
                <tbody>
                    {% for loan in loans %}
                    <tr>
                        <td>{{ loan.name }}</td>
                        <td>{{ currency }}{{ "{:,.2f}".format(loan.outstanding_principal) }}</td>
                        <td>{{ "{:.2f}".format(loan.interest_rate_annual) }}%</td>
                        <td>{{ loan.remaining_months }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
            <div class="debt-ratio">
                <strong>Debt-to-Income Ratio:</strong> {{ "{:.1f}".format(summary.debt_to_income_ratio_percent) }}%
                {% if summary.debt_to_income_ratio_percent > 40 %}
                <span class="warning">(High - Consider debt consolidation)</span>
                {% endif %}
            </div>
        </section>
        {% endif %}

        {% if ai_plan %}
        <section class="section">
            <h2 class="section-title">🤖 AI-Powered Personalized Plan</h2>
            
            <div class="ai-section">
                <h3>Financial Situation Analysis</h3>
                <p>{{ ai_plan.summary_text }}</p>
            </div>

            <div class="ai-section">
                <h3>Recommended Budget Breakdown</h3>
                <p>{{ ai_plan.budget_breakdown }}</p>
            </div>

            <div class="ai-section">
                <h3>💡 Expense Optimization Tips</h3>
                <ul>
                    {% for tip in ai_plan.expense_optimizations %}
                    <li>{{ tip }}</li>
                    {% endfor %}
                </ul>
            </div>

            <div class="ai-section">
                <h3>📈 Savings & Investment Strategy</h3>
                <p>{{ ai_plan.savings_and_investment_plan }}</p>
            </div>

            <div class="ai-section">
                <h3>🎯 Debt Repayment Strategy</h3>
                <p>{{ ai_plan.debt_strategy }}</p>
            </div>

            <div class="ai-section">
                <h3>🏆 Goal Achievement Plan</h3>
                <p>{{ ai_plan.goal_plan }}</p>
            </div>

            <div class="ai-section action-items">
                <h3>✅ Action Items (Next 30 Days)</h3>
                <ol>
                    {% for action in ai_plan.action_items_30_days %}
                    <li>{{ action }}</li>
                    {% endfor %}
                </ol>
            </div>

            <div class="disclaimer">
                <strong>Disclaimer:</strong> {{ ai_plan.disclaimer }}
            </div>
        </section>
        {% endif %}
    </div>

    <div class="footer">
        <p>Generated by VegaKash.AI - AI-Powered Financial Planning Assistant</p>
        <p>This report is for informational purposes only. Consult a certified financial advisor for personalized advice.</p>
    </div>
</body>
</html>
    """)
    
    # Prepare expense dictionary
    expenses_dict = {
        "Housing/Rent": input_data.expenses.housing_rent,
        "Groceries & Food": input_data.expenses.groceries_food,
        "Transport": input_data.expenses.transport,
        "Utilities": input_data.expenses.utilities,
        "Insurance": input_data.expenses.insurance,
        "EMI/Loans": input_data.expenses.emi_loans,
        "Entertainment": input_data.expenses.entertainment,
        "Subscriptions": input_data.expenses.subscriptions,
        "Others": input_data.expenses.others
    }
    
    return template.render(
        current_date=datetime.now().strftime("%B %d, %Y %I:%M %p"),
        currency="₹" if input_data.currency == "INR" else input_data.currency + " ",
        summary=summary,
        ai_plan=ai_plan,
        expenses=expenses_dict,
        loans=input_data.loans,
        include_branding=include_branding
    )


def _get_pdf_styles() -> str:
    """
    CSS styles for PDF
    """
    return """
        @page {
            size: A4;
            margin: 1.5cm;
        }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            font-size: 11pt;
        }

        .header {
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .branding {
            text-align: center;
        }

        .logo {
            color: #3498db;
            font-size: 28pt;
            margin: 0;
            font-weight: bold;
        }

        .tagline {
            color: #7f8c8d;
            font-size: 10pt;
            margin: 5px 0;
        }

        .date {
            text-align: right;
            color: #95a5a6;
            font-size: 9pt;
            margin-top: 10px;
        }

        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .section-title {
            color: #2c3e50;
            font-size: 16pt;
            border-left: 4px solid #3498db;
            padding-left: 10px;
            margin-bottom: 15px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .info-card {
            border: 1px solid #e0e0e0;
            padding: 12px;
            border-radius: 5px;
            background-color: #f8f9fa;
        }

        .info-label {
            font-size: 9pt;
            color: #7f8c8d;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 14pt;
            font-weight: bold;
            color: #2c3e50;
        }

        .info-value.positive {
            color: #27ae60;
        }

        .info-value.deficit {
            color: #e74c3c;
        }

        .info-value.expense {
            color: #e67e22;
        }

        .budget-table, .expense-table, .loan-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        .budget-table td, .expense-table td, .expense-table th, .loan-table td, .loan-table th {
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
        }

        .expense-table thead, .loan-table thead {
            background-color: #3498db;
            color: white;
        }

        .amount {
            text-align: right;
            font-weight: bold;
        }

        .advice-box {
            background-color: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 12px;
            margin-top: 15px;
        }

        .debt-ratio {
            background-color: #fff9e6;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
        }

        .debt-ratio .warning {
            color: #e74c3c;
            margin-left: 10px;
        }

        .ai-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .ai-section h3 {
            color: #3498db;
            font-size: 12pt;
            margin-bottom: 8px;
        }

        .ai-section ul, .ai-section ol {
            margin-left: 20px;
        }

        .ai-section li {
            margin-bottom: 6px;
        }

        .action-items {
            background-color: #e8f8f5;
            padding: 15px;
            border-radius: 5px;
        }

        .disclaimer {
            background-color: #fef5e7;
            padding: 12px;
            border-left: 3px solid #f39c12;
            font-size: 9pt;
            margin-top: 20px;
        }

        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
            font-size: 9pt;
            color: #95a5a6;
        }

        .footer p {
            margin: 5px 0;
        }
    """
