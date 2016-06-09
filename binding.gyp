{
  'make_global_settings': [
    ['CXX','/usr/bin/clang++'],
    ['LINK','/usr/bin/clang++'],
  ],
  "targets": [{
    "target_name": "sample_heap",
    "include_dirs": [
      "<!(node -e \"require('nan')\")",
    ],
    "sources": [
      "src/sample_heap.cc",
      "src/sample_heap.h"
    ], 
    'conditions': [
      [ 'OS=="mac"', {

        'xcode_settings': {
          'OTHER_CPLUSPLUSFLAGS' : ['-std=c++11','-stdlib=libc++'],
          'OTHER_LDFLAGS': ['-stdlib=libc++'],
          },

      }],
    ],
  }]
}
