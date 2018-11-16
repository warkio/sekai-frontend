build:
	./build.sh
.PHONY: build

clean:
	rm -f public/index.production.html public/bundle.js
.PHONY: clean
