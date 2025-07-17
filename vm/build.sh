#!/bin/bash

# Set output filenames
OUTPUT_NAME=vm

# Run the Emscripten compiler with proper options
emcc vm.c \
  -o $OUTPUT_NAME.js \
-s EXPORTED_FUNCTIONS="['_run_vm', '_malloc', '_get_memory', '_get_register']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap', 'getValue', 'HEAPU8']" \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="createVM" \
  -s 'ENVIRONMENT=web' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -O2
