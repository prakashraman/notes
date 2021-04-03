# @prakashraman/notes

![Test Suite](https://github.com/prakashraman/notes/workflows/Test%20Suite/badge.svg?branch=main)
![](https://img.shields.io/github/package-json/v/prakashraman/notes)
[![codecov](https://codecov.io/gh/prakashraman/notes/branch/main/graph/badge.svg?token=B7C8VS9P25)](https://codecov.io/gh/prakashraman/notes)

Build and maintain your blog with just Markdown.

`notes` is an open-source blogging platform written in TypeScript.

Take a look at a running instance at [www.prakashraman.info](http://www.prakashraman.info).

## Installation & basic setup

```sh
npm i --save @prakashraman/notes
npx pr-notes setup # sets up the local json database
npx pr-notes notes:create # creates an article
npx pr-notes publish # build and creates you static website at ./dist
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
  pages:create    creates a page
  publish         publishes the notes to dist folder
  help [command]  display help for command
```

_Most of the command are interactive_

### Need to know files and folders

| File/Folder              | Comment                                                                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ./contents               | Holds all the posts and blog index file (manifest.json)                                                                                                                       |
| ./contents/manifest.json | The blog index file. Holds references to all the notes and pages of the blog                                                                                                  |
| ./dist                   | Re-created during the publish/build process. Contains all the viewable article (converted from Markdown to HTML). This folder can be exported/uploaded as in to your web host |
| ./dist/index.html        | The main home-page of your website                                                                                                                                            |
| ./contents/header.md     | Website header content goes here                                                                                                                                              |
| ./contents/footer.md     | Website footer content goes here                                                                                                                                              |
| ./contents/head.html     | HTML code which will injected at the bottom of the \<head\> tag                                                                                                               |

### Create a blog post (note)

```sh
npx pr-notes notes:create
```

Brings up an interactive prompt which asks for the title of the note. Further the platform creates an `.md` file

### Publish or build the website

```sh
npx pr-notes publish
```

This command deletes and recreates the `./dist` folder. It creates all the requires html files and the content of this folder should ideally be uploaded as is to your web host
