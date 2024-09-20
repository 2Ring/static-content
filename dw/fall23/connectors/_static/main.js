let content = null;
let toTop = null;
let navigation = null;
let headers = [];
let scrolledHeader;

window.addEventListener('load', function () {
  content = document.querySelector('.documentwrapper');
  navigation = document.querySelector('.sphinxsidebar');
  addToTop();
  headers = getAllHeadersSorted();

  addCodeWrapper();
  addCopyHandlers();
  addTitles();
  addCollapsers();
  highlightScrolledChapter();
  setTimeout(function () {
    scrollToHighlightedText()
  }, 300);

  content.addEventListener('scroll', function () {
    controlToTopVisibility();
  });
});

/**
 * Add a toTop button to the page
 */
function addToTop() {
  toTop = document.createElement('button');
  toTop.classList.add('toTop');
  toTop.addEventListener('click', scrollToTop);
  const ico = document.createElement('span');
  ico.classList.add('fas', 'fa-angle-up');
  toTop.appendChild(ico);
  document.body.appendChild(toTop);
  controlToTopVisibility();
}

/**
 * Hides toTop button when it's not necessary.
 */
function controlToTopVisibility() {
  if (toTop) {
    if (content.scrollTop <= 50) {
      toTop.classList.remove('show');
    } else {
      toTop.classList.add('show');
    }
  }
}

/**
 * Scrolls content element to the top.
 */
function scrollToTop() {
  content.scrollTop = 0;
}

/**
 * Adds handlers for code copy buttons that allow CopyToClipboard.
 */
function addCopyHandlers() {
  querySelectToArray(document.querySelectorAll('div.highlight')).forEach(function (element) {
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-clipboard');

    let text = document.createElement('span');
    text.innerText = 'Copy';

    let copier = document.createElement('div');
    copier.classList.add('copyToClipboard');
    copier.appendChild(icon);
    copier.appendChild(text);

    element.appendChild(copier);
  });
  new ClipboardJS('.copyToClipboard', {
    text: function (trigger) {
      const textElement = trigger.querySelector('span');
      textElement.innerText = 'Copied';
      setTimeout(function () {
        textElement.innerText = 'Copy';
      }, 2000);
      return trigger.previousElementSibling.innerText;
    }
  });
}

/**
 * Add span wrapper to code items with content.
 */
function addCodeWrapper() {
  querySelectToArray(document.querySelectorAll('div.highlight pre')).forEach(function (code) {
    if (code.hasChildNodes || code.innerHTML !== '') {
      let codeWrapper = document.createElement('span');
      codeWrapper.classList.add('codeWrapper');
      codeWrapper.innerHTML = code.innerHTML;
      code.innerHTML = codeWrapper.outerHTML;
    }
  });
}

/**
 * Add titles to all nav items.
 */
function addTitles() {
  querySelectToArray(document.querySelectorAll('.sphinxsidebarwrapper .current a')).forEach(function (anchor) {
    anchor.setAttribute('title', anchor.innerText);
  });
}

/**
 * Add collapsing functionality to nested description lists
 */
function addCollapsers() {
  let items = new Set(querySelectToArray(document.querySelectorAll('ul:not(.not-collapsable) > li > dl > dd > ul > li > dl'))
    .map(function (dl) {
        return dl.parentElement.parentElement.parentElement.parentElement;
    })
  );
  items.forEach(function (dl) {
    const li = dl.parentElement;
    li.classList.add('parent-property', 'collapsed');
    li.style.listStyleType = 'none';
    let span = document.createElement('span');
    span.classList.add('fa-li');
    let icon = document.createElement('i');
    icon.classList.add('fas', 'fa-angle-right');
    span.append(icon);
    li.prepend(span);
    li.parentElement.classList.add('fa-ul');

    let callback = function () {
      let replacedIcon = span.children[0]
      if (li.classList.contains('expanded')) {
        li.classList.replace('expanded', 'collapsed');
        replacedIcon.classList.replace('fa-angle-down', 'fa-angle-right');
      } else {
        li.classList.replace('collapsed', 'expanded');
        replacedIcon.classList.replace('fa-angle-right', 'fa-angle-down');
      }
    };

    span.addEventListener('click', callback);
    dl.querySelector(':scope > dt').addEventListener('click', callback);
  });
}

/**
 * Gets a sorted list of the h1, h2 and h3 elements.
 *
 * @returns {Array<Element>} Array of headers.
 */
function getAllHeadersSorted() {
  // IE compatible equivalent to Array.from
  return querySelectToArray(content.querySelectorAll('h1, h2, h3'))
    .sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
}

/**
 * Highlights the current viewed chapter.
 */
function highlightScrolledChapter() {
    // Highlights next chapter only after its content is barely visible...
    // To highlight next chapter right after the current is not visible(its content is still visible), change direction of for and statement to >= 0

    let documentHeader = document.body.getElementsByTagName("header")[0];
    let documentHeaderText = documentHeader.getElementsByTagName("span")[0].innerText;
    let documentHeaderTextFormatted = documentHeaderText.replace("\n", " ");

    let headerNav = getChapterNav(documentHeaderTextFormatted);

    if (headerNav) {
        scrollToChapter(headerNav);
        headerNav.parentNode.classList.add('active');
    }
}

/**
 * Scrolls to chapter.
 */
function scrollToChapter(chapter) {
  if (chapter.getBoundingClientRect().bottom > navigation.offsetTop + navigation.offsetHeight) {
    chapter.scrollIntoView({ block: 'end' });
  } else if (chapter.getBoundingClientRect().top < navigation.offsetTop) {
    chapter.scrollIntoView({ block: 'start' });
  }
}

function scrollToHighlightedText() {
  let highlighted = content.querySelector('.section .highlighted');
  if (highlighted) {
    highlighted.scrollIntoView();
  }
}

/**
 * Removes highlighting from the active header.
 */
function unhighlightScrolledHeader() {
  querySelectToArray(document.querySelectorAll('.sphinxsidebarwrapper ul li a')).forEach(function (chapter) {
    chapter.parentNode.classList.remove('active');
  });
}

/**
 * Get the nav element of a chapter based on its ID.
 *
 * @param {string} name ID of the chapter.
 * @returns {HTMLAnchorElement} Returns the proper nav element.
 */
function getChapterNav(chapterTitle) {
  // Equivalent to Array.from(nav.querySelectorAll('nav ul li a')).find(a => a.getAttribute('href').includes(name))
  let chapterNav = querySelectToArray(document.querySelectorAll('.sphinxsidebarwrapper ul li a'))
    .filter(function (chapter) {
      return chapter.innerText === chapterTitle;
    })[0];
  if (!chapterNav) {
    chapterNav = document.querySelector('.sphinxsidebarwrapper ul li a.current');
    if (chapterNav && chapterNav.innerText === chapterTitle) {
      return chapterNav;
    }
  }

  return chapterNav;
}

// Utils

/**
 * Cycles through the array in reverse order.
 *
 * @param {Array<any>} array Array to cycle through.
 * @param {Function} callback Function to execute on each element, taking three arguments: `currentValue`, `index`, `array`. Stops when the function returns `null`.
 */
function forEachReverse(array, callback) {
  for (let i = array.length - 1; i >= 0; i--) {
    let val = callback(array[i], i, array);
    if (val === null) return;
  }
}

/**
 * Converts a NodeList of elements into an Array.
 *
 * @param {NodeListOf<Element> | HTMLCollection} selectedList Node list to convert.
 * @returns {Array<Element>} Node list converted to an array.
 */
function querySelectToArray(selectedList) {
  return Array.prototype.slice.call(selectedList);
}

/**
 * Converts the text to kebab-case.
 *
 * @param {string} text Text to convert.
 * @returns {string} Converted text.
 */
function toKebabCase(text) {
  return text.trim().toLowerCase().replace(/[. _]/g, '-').replace(/[^\w\-]/g, '');
}

// Polyfill scope support
(function (doc, proto) {
  try { // check if browser supports :scope natively
    doc.querySelector(':scope body');
  } catch (err) { // polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function (method) {
      let native = proto[method];
      proto[method] = function (selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          let id = this.id; // remember current element id
          this.id = 'ID_' + new Date().getTime(); // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          let result = doc[method](selectors);
          this.id = id; // restore previous id
          return result;
        } else {
          return native.call(this, selectors); // use native code for other selectors
        }
      }
    });
  }
})(window.document, Element.prototype);