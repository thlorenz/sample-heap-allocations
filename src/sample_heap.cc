#include <node.h>
#include <nan.h>
#include <v8-profiler.h>
#include <stdio.h>
#include <stdlib.h>

using v8::AllocationProfile;
using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::HeapProfiler;
using v8::Local;
using v8::Integer;
using v8::Object;
using v8::String;
using v8::Value;

static void WalkAllocationStack(
    Local<Value> recv,
    Local<Function> alloc_fn,
    Local<Function> function_fn,
    AllocationProfile::Node *node,
    uint32_t depth = 0) {

  // report current callsite information
  Local<Value> argv[] = {
    Nan::New(depth),
    node->name,
    node->script_name,
    Nan::New(node->script_id),
    Nan::New(node->start_position),
    Nan::New(node->line_number),
    Nan::New(node->column_number),
  };
  function_fn->Call(recv, 7, argv);

  // report all allocations for this callsite
  auto allocations = node->allocations;
  for (v8::AllocationProfile::Allocation allocation : allocations) {
    Local<Value> alloc_argv[] = {
      Nan::New((uint32_t)allocation.size),
      Nan::New(allocation.count)
    };
    alloc_fn->Call(recv, 2, alloc_argv);
  }

  // walk all children of the current callsite and report the above for all of them
  auto children = node->children;
  for (v8::AllocationProfile::Node* child : children) {
    WalkAllocationStack(
        recv,
        alloc_fn,
        function_fn,
        child,
        depth + 1);
  }
}

NAN_METHOD(StartSampling) {
  Local<Integer> interval = info[0].As<Integer>();
  Local<Integer> stack_depth = info[1].As<Integer>();
  HeapProfiler* hp = info.GetIsolate()->GetHeapProfiler();
  hp->StartSamplingHeapProfiler(interval->Value(), stack_depth->Value());
}

NAN_METHOD(StopSampling) {
  HeapProfiler* hp = info.GetIsolate()->GetHeapProfiler();
  hp->StopSamplingHeapProfiler();
}

NAN_METHOD(AllocationProfile) {
  Local<Function> alloc_fn = info[0].As<Function>();
  Local<Function> function_fn = info[1].As<Function>();

  HeapProfiler* hp = info.GetIsolate()->GetHeapProfiler();
  v8::AllocationProfile *profile = hp->GetAllocationProfile();
  WalkAllocationStack(
      Null(info.GetIsolate()),
      alloc_fn,
      function_fn,
      profile->GetRootNode());
}

static void Init(Handle<Object> exports) {
  exports->Set(Nan::New<String>("startSampling").ToLocalChecked(),
    Nan::New<FunctionTemplate>(StartSampling)->GetFunction());
  exports->Set(Nan::New<String>("stopSampling").ToLocalChecked(),
    Nan::New<FunctionTemplate>(StopSampling)->GetFunction());
  exports->Set(Nan::New<String>("allocationProfile").ToLocalChecked(),
    Nan::New<FunctionTemplate>(AllocationProfile)->GetFunction());
}

NODE_MODULE(_heap_sampler, Init)
