# [<img src="./browser/icon.png" width="40" align="left" alt="FanCord">](https://github.com/FanCord/FanCord) FanCord

[![Equibop](https://img.shields.io/badge/Equibop-grey?style=flat)](https://github.com/FanCord/Equibop)
[![Tests](https://github.com/FanCord/FanCord/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/FanCord/FanCord/actions/workflows/test.yml)
[![Discord](https://img.shields.io/discord/1173279886065029291.svg?color=768AD4&label=Discord&logo=discord&logoColor=white)](https://FanCord.org/discord)

FanCord is a fork of [Vencord](https://github.com/Vendicated/Vencord), with over 300+ plugins.

You can join our [Discord server](https://FanCord.org/discord) for commits, changes, chatting, or even support.

### Included Plugins

Our included plugins can be found [here](https://FanCord.org/plugins).

## Installing / Uninstalling

Windows

| | X64 | ARM64 |
| --- | --- | --- |
| GUI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl.exe) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-arm64.exe) |
| CLI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli.exe) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-arm64.exe) |

MacOS

| | Universal | X64 | ARM64 |
| --- | --- | --- | --- |
| GUI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl.dmg) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-x64.dmg) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-arm64.dmg) |
| CLI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-universal) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-x64) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-arm64) |

The CLI builds are plain binaries, so run `chmod +x <file>` after downloading.

Linux

| | X64 | ARM64 |
| --- | --- | --- |
| Combined GUI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-arm64) |
| X11 GUI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-x11) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-x11-arm64) |
| Wayland GUI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-wayland) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/Equilotl-wayland-arm64) |
| CLI | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-linux) | [Download](https://github.com/FanCord/Equilotl/releases/latest/download/EquilotlCli-linux-arm64) |

```shell
bash -c "$(curl -sS https://raw.githubusercontent.com/FanCord/Equilotl/refs/heads/main/install.sh)"
```

## Installing FanCord Devbuild

### Dependencies

[Git](https://git-scm.com/download) and [Node.JS LTS](https://nodejs.dev/en/) are required.

Install `pnpm`:

> :exclamation: This next command may need to be run as admin/root depending on your system, and you may need to close and reopen your terminal for pnpm to be in your PATH.

```shell
npm i -g pnpm
```

> :exclamation: **IMPORTANT** Make sure you aren't using an admin/root terminal from here onwards. It **will** mess up your Discord/FanCord instance and you **will** most likely have to reinstall.

Clone FanCord:

```shell
git clone https://github.com/FanCord/FanCord
cd FanCord
```

Install dependencies:

```shell
pnpm install --frozen-lockfile
```

Build FanCord:

```shell
pnpm build
```

Inject FanCord into your desktop client:

```shell
pnpm inject
```

Build FanCord for web:

```shell
pnpm buildWeb
```

After building FanCord's web extension, locate the appropriate ZIP file in the `dist` directory and follow your browser’s guide for installing custom extensions, if supported.

Note: Firefox extension zip requires Firefox for developers

## Credits

Thank you to [Vendicated](https://github.com/Vendicated) for creating [Vencord](https://github.com/Vendicated/Vencord) & [Suncord](https://github.com/verticalsync/Suncord) by [verticalsync](https://github.com/verticalsync) for helping when needed.

## Star History

<a href="https://star-history.com/#FanCord/FanCord&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=FanCord/FanCord&type=Timeline&theme=dark&sealed_token=64drv2U7WiV6dQ5VRbOZdxHT3mRzxUzhVvfm5qt1VRpGjVPje0PbObjibX2FYe4zd-h36lCAGZ873gAgb_5_tAzUBixUVbtaLHqy1fNH6PkQP_PqPdKztatlI2s17T9IUFzRyhYynmJ1-H4idFFzEAMN1gRZlVvvmJ71P0LovJPOIqTT7uHIubWcHzxC" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=FanCord/FanCord&type=Timeline&sealed_token=64drv2U7WiV6dQ5VRbOZdxHT3mRzxUzhVvfm5qt1VRpGjVPje0PbObjibX2FYe4zd-h36lCAGZ873gAgb_5_tAzUBixUVbtaLHqy1fNH6PkQP_PqPdKztatlI2s17T9IUFzRyhYynmJ1-H4idFFzEAMN1gRZlVvvmJ71P0LovJPOIqTT7uHIubWcHzxC" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=FanCord/FanCord&type=Timeline&sealed_token=64drv2U7WiV6dQ5VRbOZdxHT3mRzxUzhVvfm5qt1VRpGjVPje0PbObjibX2FYe4zd-h36lCAGZ873gAgb_5_tAzUBixUVbtaLHqy1fNH6PkQP_PqPdKztatlI2s17T9IUFzRyhYynmJ1-H4idFFzEAMN1gRZlVvvmJ71P0LovJPOIqTT7uHIubWcHzxC" />
  </picture>
</a>

## Disclaimer

Discord is trademark of Discord Inc., and solely mentioned for the sake of descriptivity.
Mentioning it does not imply any affiliation with or endorsement by Discord Inc.
Vencord is not connected to FanCord and as such, all donation links go to Vendicated's donation link.

<details>
<summary>Using FanCord violates Discord's terms of service</summary>

Client modifications are against Discord’s Terms of Service.

However, Discord is pretty indifferent about them and there are no known cases of users getting banned for using client mods! So you should generally be fine if you don’t use plugins that implement abusive behaviour. But no worries, all inbuilt plugins are safe to use!

Regardless, if your account is essential to you and getting disabled would be a disaster for you, you should probably not use any client mods (not exclusive to FanCord), just to be safe.

Additionally, make sure not to post screenshots with FanCord in a server where you might get banned for it.

</details>
