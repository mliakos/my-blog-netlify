---
title: "CRLF: Mind the line"
date: 2021-06-15T15:30:19.374Z
description: ""
slug: crlf-mind-the-line
tags:
  - post
  - git
draft: false
---
# Introduction

Have you ever had an issue with line endings, because the file was created on another OS? I actually had line endings cause a weird and hard-to-troubleshoot bug in one of my dependencies that used `txt`files. No, I'm serious. **I ended up using a HEX editor to keep my sanity from going bananas.** That's what you could end up doing after a long and tiresome coding session, so go ahead and make yourself a favor by reading the rest of this post (jk) 🤣

In this article I am going to briefly discuss this problem, as well as why different operating systems sometimes use different line endings - DOS/Windows uses `CR` AND `LF` as `EOL` character, while UNIX uses only `LF`. Line endings, as any other character, are encoded in numbers which are in turn encoded in bytes. The [ASCII](https://en.wikipedia.org/wiki/ASCII) character encoding standard is responsible for mapping those characters to numbers. Technically, `CRLF` is more accurate, but more on this later.

Line ending characters (`EOL`, `CR` and `LF)` are [control characters](https://en.wikipedia.org/wiki/Control_character), meaning that they are not visible. Their role is to inform the computer about certain actions and are of no visual value to the user. **The fact that they are not visible can cause anger and frustration while observing two seemingly identical files which could have different line-endings.** The only way you could tell the difference is to compare them byte-by-byte using a HEX editor. Finally, it is important to note that Git uses "native" as a default value for `core.eol` configuration which means that **it will use whatever line-ending is specified by the OS.**

## `LF`: Line feed

`LF` stands for "Line Feed". The well-known **newline** escape sequence is `\n`. This control character indicates a new line and tells the computer to move the cursor one line below.

## `CR`: Carriage Return

`CR` stands for "Carriage Return". The escape sequence is `\r` and it informs the computer to return to the beginning of the current line.

## `CRLF`: Carriage Return - Line Feed

You might've guessed it by now: Combining those two characters would result in what one expects when pressing the "Enter" key in a word processor.

1. Return the cursor to the beginning of the line.
2. Move one line to the bottom.

That is actually how early typewriters worked.

# The bug

The problem with line-endings is that, by default, **Git WILL convert them** to `CRLF` if using Windows and `LF` if using UNIX/OS X, no matter what. In case you haven't configured Git to handle line-endings in a certain way, pulling from a repo which doesn't have a `.gitattributes` file to enforce a specific `EOL` character is going to cause you headaches. That's exactly what I encountered when a dependency, which happened to be committed in a different OS, was reading `txt` files from the filesystem and splitting them by `\n` (`LF`). I was using a Windows machine, so Git was quietly converting them to `CRLF` (`\r\n`). Thus the application would produce weird bugs.

What was even more frustrating is that `git-diff` would not show any differences between the original files and my local copies. The files were seemingly identical! In the past, I had messed with line-endings, but not to this extent. Having a brain-fog due to long hours of coding, I decided to just open a HEX editor and inspect the bytes. Boom! I started to notice differences right away. So, I was at least sure that the files were indeed different. By taking a closer look, one could see that the bytes would differ after each word (it was a stopwords file, so there were many words separated by new lines). And that's the point when everything started to make sense.

# The fix

 After inspecting the original files' `EOL` which was `LF`, I immediately added a `.gitattributes` file enforcing `LF` line-endings on `txt` files:

```gitattributes
* text=auto eol=lf
```

This rule is going utilize Git's filetype detection algorithm to resolve `txt` files and enforce `LF` line-endings **on both checkout and commit**. 

Any file committed before the addition of the `.gitattributes` file, should be renormalized. This is done by running the following command:

```shell
git add --renormalize .
```

This command will update the line-endings in [Git index](https://shafiul.github.io/gitbook/1_the_git_index.html), effectively staging the files for commit. **Current working tree WILL NOT be updated**- you have to re-`fetch`. To ensure that all files are using `LF` you can run:

```shell
git ls-files --eol

# This will print:
# i/lf    w/crlf  attr/text=auto eol=lf   file.txt
#
# Where:
# i = Index line-endings
# w = Working tree line-endings
# attr = Any .gitattributes rules that may apply
```

# Some quick history

While researching the issue, I found some really interesting historical context which I really encourage you to read, in order to understand the topic more thoroughly.

As stated in the [](#Introduction)**Introduction** part of this post, `EOL` characters were inspired by early typewriters. Back in the day, when typing on such a machine, the typist needed to feed a paper sheet to the machine. On each keystroke the  machine would print the letter onto the sheet and move the **carriage** so that the next letter would appear to the right of the previous one. Additionally, the **carriage** needed to be reset when inserting a new line. So, the process of writing into a new line involved resetting the **carriage**, as well as rotating it to move the sheet upwards. Resetting the carriage amounts to `CR` and rotating the carriage to `LF`. Who would've though, eh?

Now, regarding Windows vs UNIX (`CRLF` vs `LF`), it's obvious that, while redundant nowadays, `CRLF` represents the whole process of "inserting a new line", abiding to the original convention. To me, as long as everything is configured correctly, I don't really care at all 😅 



# References

* https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/
* https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings#global-settings-for-line-endings
* https://en.wikipedia.org/wiki/Control_character