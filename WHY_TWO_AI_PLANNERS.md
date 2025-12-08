# Why We Have Two AI Planner Files

## Overview
The codebase contains **two distinct AI planner implementations**:
- `backend/services/ai_planner.py` (V1)
- `backend/services/ai_planner_v2.py` (V2)

## Both Are Active and Required

### ✅ V1: `ai_planner.py`
**Purpose:** Legacy AI-powered financial planning with narrative output
**Used by:** `/api/v1/generate-ai-plan` endpoint (line 324 in main.py)
**Features:**
- Text narrative generation
- Practical, conservative financial advice
- Robust error handling with retry logic
- Used by older frontend components and API clients

**When to use V1:**
- Legacy API clients still calling `/api/v1/generate-ai-plan`
- When you need narrative/text-based output
- Backward compatibility

---

### ✅ V2: `ai_planner_v2.py`
**Purpose:** Modern context-aware AI budget planner with structured output
**Used by:** `/api/v2/generate-ai-plan` endpoint (line 143 in main.py)
**Features:**
- City tier awareness
- Lifestyle considerations
- Cost-of-living multipliers
- Structured JSON output
- Detailed breakdown by category
- Enhanced metadata and reasoning
- New Budget Planner feature

**When to use V2:**
- New frontend Budget Planner interface
- Structured JSON output needed
- Advanced city/lifestyle analysis
- Current best practices

---

## Usage in main.py

```python
# Line 40: Import V1
from services.ai_planner import generate_ai_plan

# Line 41: Import V2  
from services.ai_planner_v2 import generate_ai_plan_v2

# Line 143: V2 endpoint (Budget Planner)
ai_plan = generate_ai_plan_v2(ai_request.input, ai_request.summary)

# Line 324: V1 endpoint (Legacy)
ai_plan = generate_ai_plan(ai_request.input, ai_request.summary)
```

---

## Migration Path
✅ **DO NOT REMOVE** either file - both are in active production use

If you want to deprecate V1 in the future:
1. Update all clients to use V2 endpoint
2. Set deprecation warnings in V1 endpoint
3. Monitor usage for 6+ months
4. Then safely remove V1

---

## File Status

| File | Errors | Status | Action |
|------|--------|--------|--------|
| ai_planner.py | 0 | ✅ Clean | Keep as-is |
| ai_planner_v2.py | 8 (non-critical type hints) | ✅ Fixed | Keep & monitor |

---

## Summary
**Both files are needed.** They serve different API versions and client needs.
- **V1** = Legacy text-based planning (backward compatibility)
- **V2** = Modern structured budget planning (current feature)

Keep both for now. Consider creating a migration guide if planning to sunset V1.
