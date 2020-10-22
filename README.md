# @prakashraman/notes

![Test Suite](https://github.com/prakashraman/notes/workflows/Test%20Suite/badge.svg?branch=main)
![](https://img.shields.io/github/package-json/v/prakashraman/notes)

A static personal blog generator which does not require an application server, and the notes can be written in markdown.

## Installation

```
npm i --save @prakashraman/notes
```

## How it works

There are few commands which allow complete control over the blog. Namely, `setup`, `notes:create`, `publish`

```
              _
  _ __   ___ | |_ ___  ___
 | '_ \ / _ \| __/ _ \/ __|
 | | | | (_) | ||  __/\__ \
 |_| |_|\___/ \__\___||___/

Usage: npx pr-notes command

Options:
  -h, --help      display help for command

Commands:
  setup           sets up the structure. You don't need to run this more than once
  set:title       sets the title of the homepage
  notes:create    creates a new note
  notes:list      list all the notes
  publish         publishes the notes to dist folder
  help [command]  display help for command
```

### 1. Setup the blog

```
npx pr-notes setup
```

Once run, you should see a `contents` folder in the root of your project. All your notes (markdown) files will reside in this project

**manifest.json**

This file is also created during the `setup` process and is the index of your blog. Do your best to not manually edit this file, however, if you plan to, just be careful.

### 2. Create a note

```
npx pr-notes notes:create
```

### 3. Publish the note

```
npx pr-notes publish
```

And that's it!
