//https://github.com/GoogleChrome/chrome-extensions-samples/blob/master/extensions/constant_context/content_script.js
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.storage.local.get(['words'], function(object) {
  let regExp = new RegExp('\\b(' + object.words.join('|') + ')\\b');
  const kSets = [
    {selectors: 'p, span', color: '#f7d68f'},
    {selectors: 'li, td', color: '#89b1ed'},
    {selectors: 'h1, h2, h3, th', color: '#8ae2a0'}
  ];
  for (let set of kSets) {
    let elements = Array.from(document.querySelectorAll(set.selectors));
    for (let element of elements) {
      if (regExp.test(element.innerText))
        element.style.backgroundColor = set.color;
    }
  }
});

//https://github.com/GoogleChrome/chrome-extensions-samples/blob/master/extensions/email_this_page/content_script.js

// Copyright (c) 2009 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var additionalInfo = {
  "title": document.title,
  "selection": window.getSelection().toString()
};

chrome.runtime.connect().postMessage(additionalInfo);
