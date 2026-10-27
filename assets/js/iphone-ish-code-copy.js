(function () {
  'use strict';
  var prose = document.getElementById('prose');
  if (!prose) return;

  function fallbackCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';
    document.body.appendChild(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, field.value.length);
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { /* Show manual copy hint. */ }
    field.remove();
    return copied;
  }

  var en = document.documentElement.lang === 'en';
  prose.querySelectorAll('pre').forEach(function (pre, index) {
    var block = pre.closest('.highlighter-rouge') || pre;
    if (block.previousElementSibling && block.previousElementSibling.classList.contains('ish-copybar')) return;
    var toolbar = document.createElement('div');
    toolbar.className = 'ish-copybar';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'ish-copybtn';
    button.textContent = en ? 'Copy code' : '코드 복사';
    button.setAttribute('aria-label', en ? 'Copy code block ' + (index + 1) : (index + 1) + '번 코드 복사');
    button.setAttribute('aria-live', 'polite');
    toolbar.appendChild(button);
    block.before(toolbar);

    button.addEventListener('click', async function () {
      var code = pre.querySelector('code') || pre;
      var text = code.textContent;
      var copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch (error) { /* Try the older selection API. */ }
      }
      if (!copied) copied = fallbackCopy(text);
      button.focus({ preventScroll: true });
      button.textContent = copied ? (en ? 'Copied' : '복사 완료') : (en ? 'Long-press the code to copy' : '코드를 길게 눌러 복사');
    });
  });
})();
