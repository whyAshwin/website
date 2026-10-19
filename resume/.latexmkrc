# latexmk configuration (optional — `make` uses tectonic).
#   latexmk -pdf main.tex
$pdf_mode = 1;
$pdflatex = 'pdflatex -interaction=nonstopmode -halt-on-error %O %S';
$out_dir = 'out';
$aux_dir = 'out';
$clean_ext = 'synctex.gz run.xml bbl fdb_latexmk fls';
