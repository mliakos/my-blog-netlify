---
title: Debug Electron production binaries on Windows, Mac & Linux
cover: /media/electron2.jpg
date: 2021-10-20T08:46:23.078Z
description: In this short article, I would like to show you how to debug
  Electron production binaries in Windows, Mac & Linux.
slug: debug-electron-binaries
tags:
  - electron
  - javascript
---
In this short article, I would like to show you how to debug Electron production binaries in Windows, Mac & Linux. 

Sometimes you might want to see the log output of a production binary built with Electron and for some reason the web resources on this subject are extremely limited, rendering this a non-trivial task.

# Windows

If you are using Windows, it's pretty straightforward. Just provide the path of your executable with the `--debug` flag and it should do the trick.

```powershell
& 'path/to/MyElectronApp.exe' --debug
```

# Mac

For MacOS, it gets a bit more complicating - as is always the case with Apple 😀. You have to follow a different approach based on whether you have code-signed your application or not. Essentially, if the binary is code-signed with a certificate, **then you have to strip it in order for the debugger to work.**

In any case you have to use the **[lldb Debugger](https://lldb.llvm.org/)** and your application's path (probably something like `/Applications/MyElectronApp.app`).

## Unsigned binary

For an unsigned binary run:

```shell
  lldb /Applications/MyElectronApp.app
```

Once the target has been created, run `run` to open the app.

When you are finished, run `exit` to close the debugger.

## Signed binary

The methodology for a signed binary is essentially the same, but requires an extra step before proceeding. If you try to debug a code-signed binary you will likely get the following error message:

`error: process exited with status -1 (attach failed (Not allowed to attach to process. Look in the console messages (Console.app), near the debugserver entries when the attached failed. The subsystem that denied the attach permission will likely have logged an informative message about why it was denied.))`

To bypass this, you have to strip the certificate using the following [script](https://gist.github.com/talaviram/1f21e141a137744c89e81b58f73e23c3):

```shell
#! /bin/bash
# Simple Utility Script for allowing debug of hardened macOS apps.
# This is useful mostly for plug-in developer that would like keep developing without turning SIP off.
# Credit for idea goes to (McMartin): https://forum.juce.com/t/apple-gatekeeper-notarised-distributables/29952/57?u=ttg
app_path=$1

if [ -z "$app_path" ];
then
    echo "You need to specify app to re-codesign!"
    exit 0
fi

# This uses local codesign. so it'll be valid ONLY on the machine you've re-signed with.
entitlements_plist=/tmp/debug_entitlements.plist
echo "Grabbing entitlements from app..."
codesign -d --entitlements :- "$app_path" >> $entitlements_plist || { exit 1; }
echo "Patch entitlements (if missing)..."
/usr/libexec/PlistBuddy -c "Add :com.apple.security.cs.disable-library-validation bool true" $entitlements_plist
/usr/libexec/PlistBuddy -c "Add :com.apple.security.cs.allow-unsigned-executable-memory bool true" $entitlements_plist
/usr/libexec/PlistBuddy -c "Add :com.apple.security.get-task-allow bool true" $entitlements_plist
echo "Re-applying entitlements (if missing)..."
codesign --force --options runtime --sign - --entitlements $entitlements_plist "$app_path" || { echo "codesign failed!"; }
echo "Removing temporary plist..."
rm $entitlements_plist
```

Save this in a file locally and run it, while also providing the application's path:

```shell
bash ~/path/to/script.sh ~/path/to/MyElectronApp.app
```

Finally you can run the debugger in the exact same way as with the unsigned binary (using the `lldb` command).

You can of course chain the commands to **strip the certificate and run** the app in one go:

```shell
bash ~/path/to/script.sh ~/path/to/MyElectronApp.app && lldb ~/path/to/MyElectronApp.app   
```

# Linux

This is the easiest of the three. Just open the app from a terminal and you shall see the output:

```
'path/to/my/ElectronApp.AppImage'
```

Note: I haven't tried it with any target other than `AppImage`, but I presume that it should work in the same way.



Hope this was useful, thanks for reading! 🤓