---
title: Installation
---

## Ready-made packages

If you're using **Arch Linux**, you can install the Timelens command line tool from the [AUR](https://aur.archlinux.org/packages/timelens/), using your AUR helper of choice, e.g.

    $ yay -S timelens

For **other platforms**, there are no packages or binaries yet ([let me know](https://blinry.org/about/) if you want to help change that). But you can build Timelens yourself, here's how:

## Building from source

Timelens is written in the Rust programming language, so you'll need a working [Rust installation](https://www.rust-lang.org). On Unix-based systems, you'll probably want to run these commands to install `rustup` and `cargo` (which are like `pip` or `npm`, but for Rust):

    $ curl -f https://sh.rustup.rs > rust.sh
    $ sh rust.sh
    $ source ~/.cargo/env

There's also a single dependency: The multimedia framework *GStreamer*. To install the required components for your platform, follow [these instructions](https://github.com/sdroege/gstreamer-rs#installation).

You can then compile Timelens like this:

    $ git clone https://github.com/timelens/timelens
    $ cd timelens
    $ cargo build --release

This will create the binary `target/release/timelens`, which you can use like this:

    $ ./target/release/timelens video.mp4

## Installed successfully?

[Learn how to use it](/usage/){:.button} or, if something didn't work: [Get help](/about/){:.button}
