#!/usr/bin/env bash
# ==============================================================================
# Gran Trade Inc. — One-Click GitHub Push Script
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================="
echo "  Gran Trade Inc. — Git & GitHub Deployment"
echo "=========================================="
echo "Working directory: $DIR"
echo ""

# 1. Initialize git if not already initialized
if [ ! -d ".git" ]; then
  echo "[1/4] Initializing Git repository..."
  git init
else
  echo "[1/4] Git repository already initialized."
fi

# 2. Stage all files
echo "[2/4] Staging files..."
git add .

# 3. Create commit
echo "[3/4] Creating commit..."
git commit -m "feat: Gran Trade Inc. production modular website & documentation" || echo "Nothing new to commit."

# 4. Set branch to main
git branch -M main

echo ""
echo "------------------------------------------"
# Check if remote already exists
if git remote | grep -q "origin"; then
  REMOTE_URL=$(git remote get-url origin)
  echo "Existing remote origin found: $REMOTE_URL"
  echo "Pushing to $REMOTE_URL..."
  git push -u origin main
  echo ""
  echo "SUCCESS! Pushed to GitHub: $REMOTE_URL"
else
  # Check if gh CLI is available and authenticated
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    echo "GitHub CLI detected and authenticated."
    echo "Creating GitHub repository 'grantrade'..."
    gh repo create grantrade --public --source=. --remote=origin --push
    echo ""
    echo "SUCCESS! Created repository and pushed to GitHub."
  else
    echo "Please enter your GitHub repository URL (e.g. https://github.com/username/grantrade.git):"
    read -r REPO_URL
    if [ -n "$REPO_URL" ]; then
      git remote add origin "$REPO_URL"
      echo "Pushing to $REPO_URL..."
      git push -u origin main
      echo ""
      echo "SUCCESS! Pushed to GitHub: $REPO_URL"
    else
      echo "No remote URL provided. Commit created locally."
      echo "To push later, run:"
      echo "  git remote add origin https://github.com/<your-username>/grantrade.git"
      echo "  git push -u origin main"
    fi
  fi
fi
echo "=========================================="
