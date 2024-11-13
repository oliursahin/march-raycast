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
}

declare namespace Arguments {
  /** Arguments passed to the `quick-add-item-in-inbox` command */
  export type QuickAddItemInInbox = {
  /** title */
  "title": string,
  /**  description (optional) */
  "notes": string
}
}

