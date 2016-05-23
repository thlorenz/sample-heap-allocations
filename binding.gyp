{
  "targets": [{
    "target_name": "sample_heap",
    "include_dirs": [
      "<!(node -e \"require('nan')\")",
    ],
    "sources": [
      "src/sample_heap.cc",
      "src/sample_heap.h"
    ]
  }],
}
