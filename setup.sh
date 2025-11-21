#!/bin/bash

# Quick Start Script for Hedera + Neuron DePIN IoT MVP

echo "🚀 Starting Hedera + Neuron DePIN IoT Streaming MVP..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Backend dependencies already installed"
fi
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "   Please edit backend/.env with your Hedera credentials"
    echo "   Or run without Hedera integration (app will still work)"
fi
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "   Frontend dependencies already installed"
fi
echo ""

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm start"
echo ""
echo "Or use the provided start-*.sh scripts"
