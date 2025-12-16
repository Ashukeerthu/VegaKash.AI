# 📋 Quick Reference: Copy-Paste Code Snippets

## 🚀 5-Minute Implementation

### 1️⃣ Import Components (Top of file)
```jsx
import DirectAnswerBox from '../components/DirectAnswerBox';
import StepByStepGuide from '../components/StepByStepGuide';
import FormulaDisplay from '../components/FormulaDisplay';
import FAQSection from '../components/FAQSection';
import { generateCompleteAEO } from '../utils/aeoOptimization';
import { getCalculatorFAQs } from '../schemas/faq';
import { howToTemplates } from '../schemas/howto';
```

---

### 2️⃣ Get Pre-built Content (Inside component)
```jsx
// Choose calculator type: 'emi', 'sip', 'fd', 'mortgage', 'vat'
const aeo = generateCompleteAEO('emi');
const faqs = getCalculatorFAQs('emi', 'India');
const steps = howToTemplates.emi.steps;
```

---

### 3️⃣ Add DirectAnswerBox (Top of page)
```jsx
<DirectAnswerBox 
  question={aeo.directAnswer.question}
  answer={aeo.directAnswer.answer}
  useCase={aeo.directAnswer.useCase}
  benefit={aeo.directAnswer.benefit}
  aiSummary={aeo.directAnswer.aiSummary}
/>
```

---

### 4️⃣ Add StepByStepGuide (After calculator)
```jsx
<StepByStepGuide 
  title="How to Use This Calculator"
  steps={steps}
  estimatedTime="PT5M"
  difficulty="Easy"
  tool="Calculator Name"
/>
```

---

### 5️⃣ Add FormulaDisplay (After guide)
```jsx
<FormulaDisplay 
  title="Calculation Formula"
  formula={<>Your Formula with <sup>superscript</sup></>}
  plainText="Plain text version: P × r × (1 + r)^n"
  variables={[
    { symbol: 'P', description: 'Principal amount', unit: '₹' },
    { symbol: 'r', description: 'Monthly rate' },
    { symbol: 'n', description: 'Tenure', unit: 'months' }
  ]}
  example={{
    input: 'P=500000, r=10%, n=60',
    calculation: 'EMI calculation steps',
    result: 'EMI = ₹10,624'
  }}
/>
```

---

### 6️⃣ Add FAQSection (Bottom of page)
```jsx
<FAQSection 
  title="Frequently Asked Questions"
  faqs={faqs}
  url={window.location.href}
  defaultOpen={0}
/>
```

---

## 📦 Complete Calculators Ready

### EMI Calculator
```jsx
const aeo = generateCompleteAEO('emi');
const faqs = getCalculatorFAQs('emi', 'India');
// Includes: Direct answer, 5 steps, formula, 4 FAQs
```

### SIP Calculator
```jsx
const aeo = generateCompleteAEO('sip');
const faqs = getCalculatorFAQs('sip', 'India');
// Includes: Direct answer, 5 steps, formula, 4 FAQs
```

### Mortgage Calculator (US)
```jsx
const aeo = generateCompleteAEO('mortgage');
const faqs = getCalculatorFAQs('mortgage', 'US');
// Includes: Direct answer, 7 steps, formula, 4 FAQs
```

### VAT Calculator (UK)
```jsx
const aeo = generateCompleteAEO('vat');
const faqs = getCalculatorFAQs('vat', 'UK');
// Includes: Direct answer, 4 steps, formula, 4 FAQs
```

---

## 🎨 Custom Components

### Custom DirectAnswerBox
```jsx
<DirectAnswerBox 
  question="Your custom question?"
  answer="Your 1-2 sentence direct answer here."
  useCase="Best for: Your primary use case"
  benefit="Key Benefit: Main advantage"
/>
```

### Custom Steps
```jsx
<StepByStepGuide 
  title="How to..."
  steps={[
    {
      title: 'Step 1',
      description: 'Step description',
      tip: 'Optional tip',
      example: 'Optional example'
    }
  ]}
/>
```

### Custom Formula
```jsx
<FormulaDisplay 
  title="Your Formula"
  formula={<>EMI = P × r<sup>n</sup></>}
  plainText="EMI = P × r^n"
  variables={[
    { symbol: 'P', description: 'Description' }
  ]}
/>
```

### Custom FAQ
```jsx
<FAQSection 
  faqs={[
    {
      question: 'Your question?',
      answer: 'Your answer here.'
    }
  ]}
/>
```

---

## 📊 Schema Integration

### Add Calculator Schema
```jsx
import { generateCompleteCalculatorSchemas } from '../schemas/calculator';

const schemas = generateCompleteCalculatorSchemas({
  calculator: {
    name: 'Calculator Name',
    description: 'Calculator description',
    url: 'https://vegakash.ai/calculators/name',
    country: 'India'
  },
  breadcrumb: [
    { name: 'Home', url: 'https://vegakash.ai' },
    { name: 'Calculators', url: 'https://vegakash.ai/calculators' },
    { name: 'Calculator', url: 'https://vegakash.ai/calculators/name' }
  ]
});

// Pass to SEO component
<SEO structuredData={schemas} />
```

---

## 🔍 Testing Checklist

- [ ] Component imports working
- [ ] Content displays correctly
- [ ] Mobile responsive
- [ ] Schema validates (Google Rich Results Test)
- [ ] AI extraction works (test with ChatGPT)
- [ ] Accessibility (keyboard navigation)
- [ ] Print preview looks good

---

## 📁 File Locations

```
frontend/src/
├── components/
│   ├── DirectAnswerBox.jsx
│   ├── DirectAnswerBox.css
│   ├── StepByStepGuide.jsx
│   ├── StepByStepGuide.css
│   ├── FormulaDisplay.jsx
│   ├── FormulaDisplay.css
│   ├── FAQSection.jsx
│   └── FAQSection.css
├── schemas/
│   ├── calculator.js
│   ├── faq.js
│   └── howto.js
├── utils/
│   └── aeoOptimization.js
└── pages/
    └── EMICalculatorExample.jsx (Reference)
```

---

## 🆘 Need Help?

1. **Quick Start**: `QUICK_START_AEO_IMPLEMENTATION.md`
2. **Full Example**: `frontend/src/pages/EMICalculatorExample.jsx`
3. **Complete Plan**: `SEO_AEO_GEO_MASTER_PLAN.md`

---

## ⚡ Speed Tips

- Use `generateCompleteAEO()` for instant content
- Use `getCalculatorFAQs()` for instant FAQs
- Copy `EMICalculatorExample.jsx` as template
- All components work independently
- No configuration needed - just import and use

---

**🎉 Ready to implement in 5 minutes!**
