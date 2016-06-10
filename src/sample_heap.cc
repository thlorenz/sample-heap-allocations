#include <node.h>
#include <nan.h>
#include <v8-profiler.h>
#include <stdio.h>
#include <stdlib.h>

using v8::AllocationProfile;
using v8::Array;
using v8::Isolate;
using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::HeapProfiler;
using v8::Local;
using v8::Integer;
using v8::Object;
using v8::String;
using v8::Value;

static Local<String> Identify(Isolate* isolate,
                              int script_id,
                              int line_number,
                              int column_number) {
    const char* id = (std::to_string(script_id) + ":" +
                      std::to_string(line_number) +  ":" +
                      std::to_string(column_number)).c_str();
    return String::NewFromUtf8(isolate, id);
}

static void ReportChild(Isolate* isolate,
                        Local<Value> recv,
                        AllocationProfile::Node *child,
                        Local<Function> child_callback_fn) {
  Local<String> child_id = Identify(
      isolate,
      child->script_id,
      child->line_number,
      child->column_number);
  Local<Value> child_argv[] = { child_id };
  child_callback_fn->Call(recv, 1, child_argv);
}

static void ReportAllocation(Isolate* isolate,
                            Local<Value> recv,
                            AllocationProfile::Allocation allocation,
                            Local<Function> allocation_callback_fn) {
  Local<Value> alloc_argv[] = {
    Nan::New(allocation.count),
    Nan::New((uint32_t)allocation.size)
  };
  allocation_callback_fn->Call(recv, 2, alloc_argv);
}

static void VisitNodesImpl(Isolate* isolate,
                           Local<Value> recv,
                           Local<Function> node_callback_fn,
                           Local<Function> allocation_callback_fn,
                           Local<Function> child_callback_fn,
                           AllocationProfile::Node *node) {
  Local<String> id = Identify(isolate, node->script_id, node->line_number, node->column_number);
  Local<Integer> script_id = Nan::New(node->script_id);
  Local<String> script_name = node->script_name;
  Local<String> name = node->name;
  Local<Integer> line_number = Nan::New(node->line_number);
  Local<Integer> column_number = Nan::New(node->column_number);

  Local<Value> node_argv[] = {
    id,
    script_id,
    script_name,
    name,
    line_number,
    column_number,
  };

  // report the node we are looking at
  node_callback_fn->Call(recv, 6, node_argv);

  // report the allocations of the node
  for (auto allocation : node->allocations) {
    ReportAllocation(isolate, recv, allocation, allocation_callback_fn);
  }

  // report the child ids of the node
  for (auto child : node->children) {
    ReportChild(isolate, recv, child, child_callback_fn);
  }

  for (auto child : node->children) {
    VisitNodesImpl(isolate,
                   recv,
                   node_callback_fn,
                   allocation_callback_fn,
                   child_callback_fn,
                   child);
  }
}

NAN_METHOD(VisitNodes) {
  Local<Function> node_callback_fn = info[0].As<Function>();
  Local<Function> allocation_callback_fn = info[1].As<Function>();
  Local<Function> child_callback_fn = info[2].As<Function>();

  HeapProfiler* hp = info.GetIsolate()->GetHeapProfiler();
  v8::AllocationProfile *profile = hp->GetAllocationProfile();
  VisitNodesImpl(info.GetIsolate(),
             Null(info.GetIsolate()),
             node_callback_fn,
             allocation_callback_fn,
             child_callback_fn,
             profile->GetRootNode());
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

static void Init(Handle<Object> exports) {
  exports->Set(Nan::New<String>("startSampling").ToLocalChecked(),
    Nan::New<FunctionTemplate>(StartSampling)->GetFunction());
  exports->Set(Nan::New<String>("stopSampling").ToLocalChecked(),
    Nan::New<FunctionTemplate>(StopSampling)->GetFunction());
  exports->Set(Nan::New<String>("visitNodes").ToLocalChecked(),
    Nan::New<FunctionTemplate>(VisitNodes)->GetFunction());
}

NODE_MODULE(_heap_sampler, Init)
