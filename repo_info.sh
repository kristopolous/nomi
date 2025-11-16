#!/bin/bash

_cat() {
  while [[ $# -gt 0 ]]; do
    [[ -e "$1" ]] && cat "$1"
    shift;
  done
}

query="$1"
extra="be extremly brief and not conversational"

echo "## summary"
git ls-files | llm "$extra. what kind of technology and tools does this project likely use "

echo "## libraries"
_cat requrements.txt package.json | llm "$extra. list the libraries that may correspond to the query: $query"
_cat README.md readme.md REAMDE.MD | llm "$extra. based on this readme, list the likely general tools and technology in this project."
