
BIN=./node_modules/.bin
WATCHIFY=$(BIN)/watchify
BROWSERIFY=$(BIN)/browserify

REQUIRE_VENDORS=-r d3 
EXCLUDE_MODULES=-x d3
ENTRY=demo.js
OUTPUT=build/bundle.js

watch:
	$(WATCHIFY) -d $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

watch-raw:
	$(WATCHIFY) $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

bundle:
	$(BROWSERIFY) -d $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

bundle-raw:
	$(BROWSERIFY) $(EXCLUDE_MODULES) $(ENTRY) -o $(OUTPUT)

vendor:
	$(BROWSERIFY) -d $(REQUIRE_VENDORS) -o build/vendor.js

vendor-raw:
	$(BROWSERIFY) $(REQUIRE_VENDORS) -o build/vendor.js
