#!/bin/sh
# Install ultrafast, the GPU video engine for agents: https://ultrafast.mov
#
#   curl -fsSL https://ultrafast.mov/install.sh | sh
#
# Downloads the prebuilt release for this machine from GitHub
# (github.com/ultrafastmov/ultrafast/releases), checks its SHA-256, unpacks it
# into ~/.ultrafast and links `ultrafast` and `uf` into ~/.local/bin.
# Prebuilt for macOS on Apple silicon and Linux x86_64 (glibc 2.28 or newer).
#
# Settings, all optional:
#   ULTRAFAST_VERSION=0.1.1        a release instead of the latest
#   ULTRAFAST_HOME=~/.ultrafast    where the release is unpacked
#   ULTRAFAST_BIN=~/.local/bin     where the commands are linked
#   ULTRAFAST_NO_MODIFY_PATH=1     never add the bin folder to a shell profile
#
# To uninstall: rm -rf ~/.ultrafast ~/.local/bin/ultrafast ~/.local/bin/uf

set -eu

REPO="ultrafastmov/ultrafast"

say() { printf '%s\n' "$*"; }
err() { printf 'ultrafast install: %s\n' "$*" >&2; exit 1; }
has() { command -v "$1" >/dev/null 2>&1; }

target() {
    os=$(uname -s)
    arch=$(uname -m)
    case "$os" in
    Darwin)
        # A shell under Rosetta reports x86_64 on an Apple silicon Mac.
        if [ "$arch" = x86_64 ] && [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || true)" = 1 ]; then
            arch=arm64
        fi
        case "$arch" in
        arm64 | aarch64) echo aarch64-apple-darwin ;;
        *) err "there is no prebuilt ultrafast for Intel Macs yet. Build it from source with Rust 1.91 or later: cargo install ultrafast" ;;
        esac
        ;;
    Linux)
        case "$arch" in
        x86_64 | amd64)
            if ls /lib/ld-musl-* >/dev/null 2>&1; then
                err "the prebuilt ultrafast needs glibc 2.28 or newer, and this Linux uses musl. Use the Docker image ghcr.io/$REPO, or build from source: cargo install ultrafast"
            fi
            echo x86_64-unknown-linux-gnu
            ;;
        *) err "there is no prebuilt ultrafast for Linux on $arch yet. Build it from source with Rust 1.91 or later: cargo install ultrafast" ;;
        esac
        ;;
    MINGW* | MSYS* | CYGWIN* | Windows_NT)
        err "ultrafast on Windows is built from WSL2 for now: https://github.com/$REPO/blob/main/docs/WINDOWS.md"
        ;;
    *) err "there is no prebuilt ultrafast for $os. Build it from source: cargo install ultrafast" ;;
    esac
}

fetch() { # url dest
    if has curl; then
        curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$2" "$1"
    elif has wget; then
        wget -q --https-only -O "$2" "$1"
    else
        err "needs curl or wget"
    fi
}

latest() {
    # The latest release's tag, from where /releases/latest redirects to. No API, so no rate limit.
    if has curl; then
        url=$(curl --proto '=https' -fsSLI -o /dev/null -w '%{url_effective}' "https://github.com/$REPO/releases/latest")
    else
        url=$(wget --https-only -q -S --spider "https://github.com/$REPO/releases/latest" 2>&1 | sed -n 's/^ *[Ll]ocation: *//p' | tail -n 1)
    fi
    tag=${url##*/tag/}
    tag=$(printf '%s' "$tag" | tr -d '\r')
    case "$tag" in
    v[0-9]*) echo "${tag#v}" ;;
    *) err "could not find the latest release on github.com/$REPO" ;;
    esac
}

sha256() {
    if has sha256sum; then
        sha256sum "$1" | cut -d ' ' -f 1
    elif has shasum; then
        shasum -a 256 "$1" | cut -d ' ' -f 1
    else
        err "needs sha256sum or shasum to check the download"
    fi
}

add_to_path() { # bin
    case ":${PATH}:" in *":$1:"*) return 0 ;; esac
    line="export PATH=\"$1:\$PATH\""
    if [ "${ULTRAFAST_NO_MODIFY_PATH:-}" = 1 ]; then
        say ""
        say "$1 is not on your PATH. Add it with:"
        say "  $line"
        return 0
    fi
    case "$(basename "${SHELL:-sh}")" in
    zsh) profile="${ZDOTDIR:-$HOME}/.zshrc" ;;
    bash) if [ "$(uname -s)" = Darwin ]; then profile="$HOME/.bash_profile"; else profile="$HOME/.bashrc"; fi ;;
    fish)
        line="fish_add_path $1"
        profile="${XDG_CONFIG_HOME:-$HOME/.config}/fish/config.fish"
        ;;
    *) profile="$HOME/.profile" ;;
    esac
    if ! grep -qsF "$line" "$profile"; then
        mkdir -p "$(dirname "$profile")"
        printf '\n# ultrafast\n%s\n' "$line" >>"$profile"
    fi
    say ""
    say "Added $1 to your PATH in $profile. Open a new terminal, or run:"
    say "  $line"
}

linux_notes() {
    missing=""
    if ! { has ldconfig && ldconfig -p 2>/dev/null | grep -q 'libvulkan\.so\.1'; } &&
        ! ls /usr/lib/libvulkan.so.1 /usr/lib64/libvulkan.so.1 /usr/lib/x86_64-linux-gnu/libvulkan.so.1 >/dev/null 2>&1; then
        missing="$missing
  - the Vulkan loader and your GPU's Vulkan driver (ultrafast renders with Vulkan)"
    fi
    has ffmpeg || missing="$missing
  - ffmpeg (exports)"
    if [ -n "$missing" ]; then
        say ""
        say "Also install with your package manager:$missing"
        say "uf voiceover uses espeak-ng, and uf ocr uses tesseract."
    fi
    if grep -qi microsoft /proc/version 2>/dev/null; then
        say ""
        say "This is WSL2, which has no Vulkan driver for NVIDIA GPUs: this build will render on the CPU."
        say "For the GPU, build the Windows program: https://github.com/$REPO/blob/main/docs/WINDOWS.md"
    fi
}

main() {
    t=$(target)
    version=${ULTRAFAST_VERSION:-$(latest)}
    version=${version#v}
    home=${ULTRAFAST_HOME:-$HOME/.ultrafast}
    bin=${ULTRAFAST_BIN:-$HOME/.local/bin}
    name="ultrafast-$version-$t"
    base="https://github.com/$REPO/releases/download/v$version"

    tmp=$(mktemp -d 2>/dev/null || mktemp -d -t ultrafast)
    trap 'rm -rf "$tmp"' EXIT INT TERM

    say "Downloading ultrafast $version for $t"
    fetch "$base/$name.tar.gz" "$tmp/$name.tar.gz" || err "could not download $base/$name.tar.gz"
    fetch "$base/$name.tar.gz.sha256" "$tmp/$name.tar.gz.sha256" || err "could not download the checksum for $name.tar.gz"
    want=$(cut -d ' ' -f 1 <"$tmp/$name.tar.gz.sha256")
    got=$(sha256 "$tmp/$name.tar.gz")
    [ "$want" = "$got" ] || err "the download's SHA-256 is $got, but the release says $want"

    tar -xzf "$tmp/$name.tar.gz" -C "$tmp"
    [ -x "$tmp/$name/ultrafast" ] || err "the archive has no ultrafast binary"

    # Replace any earlier install in one move.
    mkdir -p "$(dirname "$home")" "$bin"
    rm -rf "$home.new"
    mv "$tmp/$name" "$home.new"
    rm -rf "$home"
    mv "$home.new" "$home"
    ln -sf "$home/ultrafast" "$bin/ultrafast"
    ln -sf "$home/uf" "$bin/uf"

    v=$("$home/ultrafast" --version) || err "$home/ultrafast does not run on this machine"
    say "Installed $v in $home"
    say "Linked ultrafast and uf in $bin"
    [ "$(uname -s)" = Linux ] && linux_notes
    add_to_path "$bin"
    say ""
    say "Next:"
    say "  uf info                 # the GPU it will render on"
    say "  uf new vertical film.json && uf export film.json film.mp4"
    say "  uf mcp                  # ultrafast as MCP tools for your agent"
    say "Docs: https://ultrafast.mov/docs/"
}

main "$@"
