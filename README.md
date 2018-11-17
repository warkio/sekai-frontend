# Sekai front-end

Front-end for the Sekai forum.

## Installation

```sh
git clone https://github.com/warkio/sekai-frontend
cd sekai-frontend/public

# Ideally you'd use something actually decent.
python -m http.server
```

## Goals

* Must work as-is, with zero build steps *required*.
* Keep dependencies at a reasonable minimum.

## Non-goals

* Compatibility with old browsers.

## Assumptions

* The files under `public` will be served through an HTTP server, with
  the `public` directory being mounted at the `/` path.

## License

MPL 2.0, incompatible with secondary licenses.

(Note: Files under `public/vendor` are from third-parties and might have
different licenses. Check them for details.)
