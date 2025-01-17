/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** March Access Token - Your March access token */
  "accessToken": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `quick-add-item-in-inbox` command */
  export type QuickAddItemInInbox = ExtensionPreferences & {}
  /** Preferences accessible in the `today` command */
  export type Today = ExtensionPreferences & {}
  /** Preferences accessible in the `inbox` command */
  export type Inbox = ExtensionPreferences & {}
  /** Preferences accessible in the `all-objects` command */
  export type AllObjects = ExtensionPreferences & {}
  /** Preferences accessible in the `search` command */
  export type Search = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `quick-add-item-in-inbox` command */
  export type QuickAddItemInInbox = {
  /** Title */
  "title": string,
  /** Description */
  "notes": string
}
  /** Arguments passed to the `today` command */
  export type Today = {}
  /** Arguments passed to the `inbox` command */
  export type Inbox = {}
  /** Arguments passed to the `all-objects` command */
  export type AllObjects = {}
  /** Arguments passed to the `search` command */
  export type Search = {}
}

