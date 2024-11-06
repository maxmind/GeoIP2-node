#!/bin/bash

chmod +x git/hooks/*
cd .git/hooks || exit
rm -f pre-commit.sample
ln -s ../../git/hooks/pre-commit .
git config --local core.hooksPath .git/hooks
