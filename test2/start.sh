#!/usr/bin/env sh

echo "Booting up test script"
cd /app/
npm -v
echo "Installing dependencies"
yarn
echo "Starting test script"
npx nodemon test.js