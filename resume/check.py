#!/usr/bin/env python3
"""Sanity-check the built résumé PDF.

Guards the two things that silently break a résumé: it spills to a second page,
or the hyperlinks vanish. Run via `make check`.

Tectonic writes object streams (compressed xref), so the PDF is searched both
raw and after inflating every FlateDecode stream.
"""
import re
import sys
import zlib

EXPECTED_PAGES = 1
EXPECTED_LINKS = 13


def searchable(data: bytes) -> bytes:
    """Raw PDF plus every inflatable stream, so object-stream content is seen."""
    chunks = [data]
    for match in re.finditer(rb"stream\r?\n", data):
        start = match.end()
        end = data.find(b"endstream", start)
        if end == -1:
            continue
        try:
            chunks.append(zlib.decompress(data[start:end]))
        except zlib.error:
            continue
    return b"\n".join(chunks)


def main(path: str) -> int:
    data = open(path, "rb").read()
    body = searchable(data)

    pages = len(re.findall(rb"/Type\s*/Page[^s]", body))
    links = len(re.findall(rb"/Subtype\s*/Link", body))

    print(f"pages: {pages}")
    print(f"links: {links}")
    print(f"size:  {len(data) / 1024:.0f} KB")

    ok = True
    if pages != EXPECTED_PAGES:
        print(f"FAIL: expected {EXPECTED_PAGES} page, got {pages}")
        ok = False
    if links != EXPECTED_LINKS:
        print(f"FAIL: expected {EXPECTED_LINKS} links, got {links}")
        ok = False

    if ok:
        print("ok — single page, all links intact")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
