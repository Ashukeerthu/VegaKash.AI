# 🗂️ Legacy Backend Files

**Status**: DEPRECATED  
**Date Moved**: December 8, 2025  
**Reason**: Structural cleanup and consolidation

---

## 📋 Why These Files Are Here

These files have been moved to `backend/legacy/` as part of a repository cleanup to eliminate confusion and duplication. They are **NOT** used in the current application.

---

## 📁 Legacy Files

### `models.py` (DEPRECATED)
- **Original Purpose**: Database models using SQLAlchemy
- **Current Status**: Not used - Phase 1 has no database/authentication
- **Canonical Location**: N/A (Phase 2 feature - not yet implemented)
- **What to Use Instead**: None needed for Phase 1

**Notes**:
- This was a placeholder for Phase 2 when user accounts and persistent storage would be added
- Contains example SQLAlchemy models (User, BudgetPlan, FinancialGoal)
- No database is used in current Phase 1 implementation

---

### `schemas.py` (DEPRECATED)
- **Original Purpose**: Pydantic request/response schemas
- **Current Status**: Replaced by modular schema structure
- **Canonical Location**: `backend/schemas/` directory (organized by feature)
- **What to Use Instead**:
  - For Budget Planner V1.2: `backend/schemas/budget_planner_v12.py`
  - For other features: Check `backend/schemas/` directory

**Migration Path**:
```python
# OLD (deprecated - don't use)
from backend.schemas import BudgetPlannerRequest

# NEW (current - use this)
from backend.schemas.budget_planner_v12 import BudgetPlannerRequestV12
```

**Why Changed?**:
1. **Name Conflict**: Having both `schemas.py` file AND `schemas/` directory was confusing
2. **Scalability**: Monolithic `schemas.py` would become too large with multiple features
3. **Organization**: Feature-based schema organization is clearer
4. **Maintainability**: Easier to find and update schemas when grouped by feature

---

## ⚠️ Important - Do NOT Edit These Files

These files are kept for reference only. **Do not edit or use them in your code.**

If you need to:
- **Add new API models** → Create new schema in `backend/schemas/`
- **Modify existing schemas** → Edit files in `backend/schemas/` directory
- **Add database models** → Wait for Phase 2 or create in new `backend/models/` directory

---

## 📚 Project Structure Reference

Current canonical locations:

```
backend/
├── schemas/                    # ✅ Canonical Pydantic Models
│   ├── __init__.py
│   ├── budget_planner_v12.py  # Budget Planner V1.2 models
│   └── [other feature schemas]
│
├── models/                     # 🔜 Future Database Models (Phase 2)
│   └── [SQLAlchemy models when needed]
│
└── legacy/                     # ⚠️ DO NOT USE
    ├── README.md              # This file
    ├── models.py              # Old placeholder file
    └── schemas.py             # Old monolithic schemas
```

---

## 📖 History

- **Dec 5, 2025**: Original files created as placeholders
- **Dec 8, 2025**: Moved to `backend/legacy/` during structure cleanup
  - ChatGPT feedback identified name conflicts (`schemas.py` vs `schemas/`)
  - Moved to legacy to eliminate confusion
  - Created modular `backend/schemas/` directory structure

---

## 🔗 Related Documentation

- **Current Structure**: See `PROJECT_FOLDER_STRUCTURE.md`
- **Budget Planner V1.2**: See `BUDGET_PLANNER_V1.2_REQUIREMENTS.md`
- **API Schemas**: Check `backend/schemas/` directory

---

**If you found this README, you're in the right place! These files are intentionally deprecated.** ✅

**For current code, go to `backend/schemas/` directory.** 🚀
