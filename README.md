# wc-mic-input
[![NPM](https://nodei.co/npm/wc-mic-input.png?mini=true)](https://www.npmjs.com/package/wc-mic-input)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/wc-mic-input)


Speech recognition input web component.


## Install

    $ npm install wc-mic-input

## Syntax

```html
<script src="mic-input.js"></script>

<form action="#" method="POST">
    <label for="mic-input">Enter something:</label>
    <mic-input height="36"></mic-input>
    <input type="submit" value="submit" />
</form>
```

## Demo page
The demo page: https://yishiashia.github.io/mic-input.html
## Usage

If you want to customize this web component, you can import the library and 
implement your new class by extend `MicInput`.

```js
import MicInput from "wc-mic-input";

class customizedMicInput extends MicInput {
    // override here
}

```

### Options

- [name (optional)](#name-optional)
- [height (optional)](#height-optional)

#### name (optional)

The name of input, it would be the POST parameter name.

#### height (optional)

The height of input field.
