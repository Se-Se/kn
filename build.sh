#!/bin/bash

npm install
GENERATE_SOURCEMAP=false npm run build
mkdir web
mv build/* web
mv web build/web
