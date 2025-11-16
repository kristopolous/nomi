#!/bin/bash
query="$1"
extra="be extremly brief and not conversational" 
echo "## summary"        
git ls-files | llm "$extra. what kind of technology and tools does this project likely use "

echo "## libraries"
cat requirements.txt package.json | llm "$extra. list the libraries that may correspond to the query: $query"

cat README.md readme.md REAMDE.MD | llm "$extra. based on this readme, list the likely general tools and technology in this project."
