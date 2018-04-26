dev:
	cat lib/*.js app.js > build.js

dist: dev
	uglifyjs --mangle --compress -- build.js > docs/build.js
	html-minifier --keep-closing-slash --minify-css --remove-tag-whitespace index.html > docs/index.html
	inliner docs/index.html > out
	mv out docs/index.html
	rm docs/build.js
