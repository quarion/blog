---
title: "Notes"
description: Early notes on Markdown publishing and the Proton API documentation tool.
publishedAt: 2016-02-07
slug: drafts/notes
draft: true
---


# Beginning

Diving deeper into markdown and related tools, I start to make some notes, that might be published as a blog



# OSS Projects - Proton

Getting some inspiration lately, I started to analyze and prototype on a new tool that would be useful to me.

## Name

## Features

### Modeling the API

### Extensibility

### Creating documentation

### Formats

### Rendering

### Automated testing

### Non functional requirements

 - Should use a sub-set of .NET framework that is Mono compatible.

 One of the goal is to test what restrictions may be encountered when taking .NET from Windows only to multiplatform. Going more open and interoperable is a goal worth pursuing. Microsoft is making moves in this area, and maturity of mono seems to be promising.

 -


## Process

I have started the process with hacking a proof of concept that was tightly coupled with an API that I have recently developed at work. It was a success and proven that there should be no blocking issues to have a full workflow, going from code to a document in multiple formats.  

 The implementation of this API is pretty non-standard, so it tested the customization aspect hard. So it an extra proof, that retrofitting the Proton to work with already existing APIs should be viable.  

I have cut some corners thought to get it ready quickly, and now need too take a few steps back, and work on a good models. I am not sure yet, if I will be doing TDD. I'm a big fan of TDD in medium and big projects, but in this case I think I might just hack to try different concepts quickly.


# Tools for authoring and publishing content
