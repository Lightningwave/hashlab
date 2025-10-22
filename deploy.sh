#!/bin/bash

# HashLab Deployment Script
# This script will prepare and guide you through deploying to GitHub Pages

set -e  # Exit on error

echo "=========================================="
echo "  HashLab - GitHub Pages Deployment"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "⚠️  wasm-pack is not installed."
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

echo "✅ Prerequisites check passed"
echo ""

# Build WASM
echo "📦 Building WASM module..."
cd rust-wasm
wasm-pack build --release --target web --out-dir ../pkg --out-name rust_wasm
cd ..
echo "✅ WASM module built successfully"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Build frontend
echo "🏗️  Building frontend..."
npm run build
echo "✅ Frontend built successfully"
cd ..
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
frontend/dist/

# Rust
rust-wasm/target/
**/*.rs.bk
*.pdb

# Logs
*.log

# Editor
.vscode/
.idea/
.DS_Store
EOF
    echo "✅ .gitignore created"
    echo ""
fi

echo "=========================================="
echo "  Ready to Deploy!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Name it 'hashlab' (or your preferred name)"
echo "   - Don't initialize with README"
echo ""
echo "2. Run these commands (replace YOUR_USERNAME):"
echo ""
echo "   git add ."
echo "   git commit -m \"Initial commit: HashLab cryptographic tools\""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/hashlab.git"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to repository Settings → Pages"
echo "   - Source: Select 'GitHub Actions'"
echo ""
echo "4. Your site will be live at:"
echo "   https://YOUR_USERNAME.github.io/hashlab/"
echo ""
echo "=========================================="
echo "✨ Build complete! Ready to push to GitHub"
echo "=========================================="

