#!/bin/bash
EXT=svg
UGLY=ugly.svg
SRC=$1
DEST=$(echo $SRC | sed -e 's/src\//eps\//' -e "s/\.dot$/.$EXT/") && \
PNG=$(echo $DEST | sed -e "s/\.$EXT/.png/") && \
echo $SRC '->' $UGLY &&\
dot -T$EXT -Nshape=record -Nmargin=0.05 -Nfontsize=10pt -Nfontname=helvetica -Efontsize=10pt -Efontname=helvetica -Ecolor=maroon -Efontcolor=navy -Gnodesep=0.2 -o $UGLY $SRC && \
#echo "$UGLY + prettyup.xsl = $DEST" && \
#xsltproc prettyup.xsl $UGLY > $DEST && \
#echo $DEST '->' $PNG && \
#convert $DEST $PNG && \
#convert $UGLY $PNG && \
#brew install libsrvg
#rsvg-convert -h 130 $UGLY > $PNG
#npm i -g svgexport
svgexport $UGLY $PNG
echo 'Cleanup..' && \
rm $UGLY && \
echo 'Done.'
