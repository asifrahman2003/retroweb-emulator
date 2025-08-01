#!/bin/bash

OUTPUT_NAME=vm

emcc vm.c \
  -o ${OUTPUT_NAME}.js \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="createVM" \
  -s 'ENVIRONMENT=web' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -O2 \
  -s EXPORTED_FUNCTIONS="['_run_vm','_step_vm','_get_pc','_reset_vm','_get_memory','_get_register']" \
  -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','getValue','HEAPU8','HEAP32']"
