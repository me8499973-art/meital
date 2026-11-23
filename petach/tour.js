/* מסך פתיחה של סדר בעסק.
   מוסיפים לאתר שורה אחת:
   <script src="https://me8499973-art.github.io/meital/petach/tour.js" data-tour="כתובת הסיור" data-name="שם העסק"></script>
   הסיור נפתח על כל המסך בכניסה הראשונה. בסוף מופיע "כניסה לאתר", ולאורך כל הדרך יש "דלג".
   מי שכבר ראה את הסיור לא יראה אותו שוב (נשמר בדפדפן שלו). כדי לראות שוב: מוסיפים לכתובת ?tour=1 */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var src = me.getAttribute('data-tour');
  var name = me.getAttribute('data-name') || '';
  if (!src) return;
  var key = 'seder-tour-seen:' + src;
  var force = /[?&]tour=1\b/.test(location.search);
  try { if (!force && localStorage.getItem(key)) return; } catch (e) {}

  var css = '' +
    '#seder-tour{position:fixed;inset:0;z-index:2147483000;background:#000;opacity:0;transition:opacity .5s ease}' +
    '#seder-tour.on{opacity:1}#seder-tour.off{opacity:0;pointer-events:none}' +
    '#seder-tour iframe{position:absolute;inset:0;width:100%;height:100%;border:0}' +
    '#seder-tour .st-skip{position:absolute;top:14px;left:14px;z-index:2;border:0;border-radius:999px;padding:9px 18px;font:600 15px Heebo,Arial,sans-serif;color:#fff;background:rgba(0,0,0,.45);backdrop-filter:blur(6px);cursor:pointer}' +
    '#seder-tour .st-enter{position:absolute;left:50%;bottom:34px;z-index:2;transform:translate(-50%,30px);opacity:0;transition:all .5s ease;border:0;border-radius:999px;padding:16px 34px;font:800 19px Heebo,Arial,sans-serif;color:#1F1A14;background:linear-gradient(100deg,#8C6A22,#E6C87A 50%,#B8913A);box-shadow:0 12px 30px rgba(0,0,0,.45);cursor:pointer;white-space:nowrap;direction:rtl}' +
    '#seder-tour .st-enter.show{opacity:1;transform:translate(-50%,0)}' +
    '#seder-tour .st-by{position:absolute;bottom:8px;right:12px;z-index:2;font:400 11px Heebo,Arial,sans-serif;color:rgba(255,255,255,.55);direction:rtl}';

  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var box = document.createElement('div'); box.id = 'seder-tour'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'סיור פתיחה');
    var fr = document.createElement('iframe');
    fr.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'intro=1';
    fr.title = 'סיור'; fr.setAttribute('allow', 'autoplay');
    var skip = document.createElement('button'); skip.className = 'st-skip'; skip.type = 'button'; skip.textContent = 'דלג ›';
    var enter = document.createElement('button'); enter.className = 'st-enter'; enter.type = 'button'; enter.textContent = 'כניסה לאתר' + (name ? ' של ' + name : '') + ' ←';
    var by = document.createElement('div'); by.className = 'st-by'; by.textContent = 'סיור קניות · סדר בעסק';
    box.appendChild(fr); box.appendChild(skip); box.appendChild(enter); box.appendChild(by);
    document.body.appendChild(box);
    var prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('on'); });

    function close() {
      try { localStorage.setItem(key, '1'); } catch (e) {}
      box.classList.add('off');
      document.documentElement.style.overflow = prev;
      setTimeout(function () { box.remove(); }, 550);
    }
    skip.onclick = close; enter.onclick = close;
    window.addEventListener('message', function (ev) { if (ev.data === 'seder-tour-done') enter.classList.add('show'); });
    setTimeout(function () { enter.classList.add('show'); }, 25000); /* ליתר ביטחון */
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
