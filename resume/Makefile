# Résumé build — tectonic (no TeX Live required)
#
#   make build     compile to out/Ashwin_Baranwal_Product.pdf
#   make watch     recompile on save
#   make publish   build + copy into public/ for the Next.js site
#   make clean     remove out/
#   make check     build + sanity-check the PDF

SRC      := main.tex
OUTDIR   := out
NAME     := Ashwin_Baranwal_Product
PDF      := $(OUTDIR)/$(NAME).pdf
PUBLIC   := ../public/$(NAME).pdf

TECTONIC ?= tectonic
FLAGS    := --outdir $(OUTDIR) --keep-logs

.PHONY: all build watch publish clean check

all: build

build: $(PDF)

$(PDF): $(SRC)
	@mkdir -p $(OUTDIR)
	$(TECTONIC) $(FLAGS) $(SRC)
	@mv $(OUTDIR)/main.pdf $(PDF)
	@echo "→ $(PDF)"

watch:
	$(TECTONIC) -X watch --outdir $(OUTDIR) $(SRC)

publish: build
	@cp $(PDF) $(PUBLIC)
	@echo "→ $(PUBLIC)"

clean:
	@rm -rf $(OUTDIR)
	@echo "cleaned $(OUTDIR)/"

# Fails loudly if the résumé grows past one page or loses its links.
check: build
	@python3 check.py $(PDF)
