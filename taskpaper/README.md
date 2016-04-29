this so called *taskpaper-app* is inspired by my personal use of [TaskPaper for iOS](http://taskpaper.com/).

**TaskPaper** is as from january 2014 discontinued by its developer, focussing soly to developing the Mac-OS version of the program. After discontinuing he published the [source code](http://blog.hogbaysoftware.com/post/72672157477/taskpaper-for-ios-source-code) on [GitHub](https://github.com/jessegrosjean/NOTTaskPaperForIOS). He requests not to use the name 'TaskPaper' for (iOS) apps, to not confuse people to "think any apps derived from this code are made by Hog Bay Software".

This particular implementation is for HTML/Javascript (or HTML5/CSS/jQuery if you wish) and is not inspired upon the published source code, but backward-programmed to fit the needs of becomming an element to implement into [Bubbel.js](http://xltrace.nl/bubbel.js/). As such:
- the name 'taskpaper' is associated with (only) the way to format a file, filled with tasks, tags, notes and projects.
- the eventual application is not going to be named **TaskPaper**, but will only support '.taskpaper'-files, as the human-readable free-formed way to organise data. The eventual application will be part of my [Hades](#)-webplatform and be called: Ergo (a greek translation of 'work', 'task' or 'doing').

The provided code is only a proof-of-concept before integration into [Bubbel.js](http://xltrace.nl/bubbel.js/). Afterwards everyone will be able to use the taskpaper capabilities within their website, when they use *Bubbel.js*.

To understand the philosophy of **TaskPaper**, you should read the first 3 chapters of the [guide](http://guide.taskpaper.com/). And combine this with what you learn when you google "Getting things done" or "GTD", or even in combination with "taskpaper".

## Already Extended upon TaskPaper:
- `@icon()` uses the [Font Awesome](https://fortawesome.github.io/Font-Awesome/icons/) icons. (note: typed without the 'fa-'-prefix)
- it supports some irc-flavoured markdown: *bold*, /italic/, _underscore_, `code` and [link](url) --- might switch to regular markdown!
- '.taskpaper.editable' will give tools to *check*, *edit*, *remove*. '.taskpaper.editable.sortable' will also add a *sortable bar*.
- '.taskpaper.clean' will filter the tasks marked with `@done`
- the textarea is extended to accept `[tab]` ('.tabable') and *direct* ('.direct') processing the onChange-command.
- reverting '.taskpaper' to '.non-taskpaper' will give a normal HTML summary of `ul` `li` -elements