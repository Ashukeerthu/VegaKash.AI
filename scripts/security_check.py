#!/usr/bin/env python3
"""
Pre-commit Security Check
Ensures no sensitive files are accidentally committed to git
"""

import os
import sys
import subprocess

def check_git_status():
    """Check if any sensitive files are staged for commit"""
    
    # Files that should NEVER be committed
    sensitive_files = ['.env', 'backend/.env', '.env.local']
    
    try:
        # Get list of staged files
        result = subprocess.run(
            ['git', 'diff', '--cached', '--name-only'],
            capture_output=True,
            text=True,
            check=True
        )
        
        staged_files = result.stdout.strip().split('\n')
        
        # Check for sensitive files
        found_sensitive = []
        for file in staged_files:
            if any(sensitive in file for sensitive in sensitive_files):
                found_sensitive.append(file)
        
        if found_sensitive:
            print("❌ ERROR: Sensitive files detected in commit!")
            print("\nThe following files should NOT be committed:")
            for file in found_sensitive:
                print(f"  - {file}")
            print("\nThese files contain API keys and secrets.")
            print("Remove them from the commit with:")
            print(f"  git reset HEAD {' '.join(found_sensitive)}")
            return False
        
        print("✅ Security check passed - no sensitive files detected")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Warning: Could not check git status: {e}")
        return True  # Don't block if git command fails

if __name__ == '__main__':
    if not check_git_status():
        sys.exit(1)
    sys.exit(0)
