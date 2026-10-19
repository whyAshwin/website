# Résumé workspace

LaTeX source for Ashwin Baranwal's résumé, plus a one-command local build.

`main.tex` is the **original Overleaf source, unmodified in content** — the Lex
template authored in pdfLaTeX with `newtx`. You can keep editing it on Overleaf
exactly as before; this folder just lets you compile and export the same PDF
locally, without a browser or a TeX Live install.

## Commands

```bash
make build     # compile → out/Ashwin_Baranwal_Product.pdf
make watch     # recompile on every save
make publish   # build, then copy into public/ for the website
make check     # build + assert it is still one page with all links
make clean     # remove out/
```

`tectonic` downloads packages on first run, then works offline from its cache.
Install once with `brew install tectonic`.

## Layout

```
resume/
├── main.tex        # the résumé — the same file you edit on Overleaf
├── Makefile
├── check.py        # page/link guard used by `make check`
├── .latexmkrc      # for latexmk users (optional)
└── out/            # build output (git-ignored)
```

## How the local build stays identical to Overleaf

Overleaf compiles with **pdfLaTeX**; tectonic runs **XeTeX**. The preamble
branches on the engine (`\ifPDFTeX`) so each path uses its native font setup:

| | Overleaf (pdfLaTeX) | Local (XeTeX) |
| --- | --- | --- |
| Font | `newtxtext` / `newtxmath` | TeX Gyre Termes (the family newtx is derived from) |
| Quotes | `"` stays straight | `"` remapped to a straight quote |
| Ligatures | T1 keeps `ffi` separate | `Ligatures=NoCommon` keeps `ffi` separate |

Those three details are what make the local PDF match the Overleaf one. They
matter beyond looks: curly quotes and `ffi` ligatures corrupt copy-paste and
break ATS résumé parsers.

Verified against the original export: identical extracted text, identical 13
hyperlinks, identical font family, one page.

## Editing notes

- The layout is driven by two macros: `\textBF{...}` for the blue bold
  organisation names, and `\sectitle{...}` for a section heading plus its rule.
- `\%`, `\&`, `\$`, `\_` must be escaped. `--` is an en dash, `---` an em dash.
- Dates sit at the right edge via `\hfill`, so keep that pattern when adding a
  role.
- The résumé is one page by design. Run `make check` after edits — if it fails,
  trim wording rather than shrinking the font below 10.5pt.

## Keeping the website in sync

`make publish` writes `public/Ashwin_Baranwal_Product.pdf`, which is what
`src/app/resume/page.tsx` serves. If you rename the file, update the two
references in that page.
