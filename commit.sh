#!/bin/bash

# Add all changes
git add .

# Ask for commit message
echo "Enter commit message:"
read msg

# Commit with message
git commit -m "$msg"

# Push to current branch
git push