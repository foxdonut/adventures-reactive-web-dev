#!/bin/bash
elm make Debug/Main.elm --output elm.js
elm reactor -p 3000
