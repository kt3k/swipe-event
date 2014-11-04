# SwipeEvent v0.3.1

[![Build Status](https://travis-ci.org/kt3k/SwipeEvent.svg?branch=master)](https://travis-ci.org/kt3k/SwipeEvent)

> Handle swipe events

# Usage

Load script:

```html```
<script src="path/to/swipe-event.js"></script>
```

Bind events:

```
var dom = getDom();

var swipe = new SwipeCross({elm: dom});
swipe.bindEvents();
```

You'll get `swipeup`, `swipeleft`, `swiperight`, `swipedown` events when the specified dom are swiped:

```
// you can handle the following events
dom.addEventListener('swipeup', function () {...}, false);
dom.addEventListener('swipeleft', function () {...}, false);
dom.addEventListener('swiperight', function () {...}, false);
dom.addEventListener('swipedown', function () {...}, false);
```

You can unbind events when it become unnecessary:

```
swipe.unbindEvents();
```

If you have jquery loaded, you can bind events through jquery object:

```
$('#swipe').swipeCross();

$('#swipe').on('swipeup', function () {...});
$('#swipe').on('swipeleft', function () {...});
$('#swipe').on('swiperight', function () {...});
$('#swipe').on('swipedown', function () {...});

...

$('#swipe').swipeCrossUnbind();
```
