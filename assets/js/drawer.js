(function () {
  var STATES = ['drawer-peek', 'drawer-half'];
  var mql = window.matchMedia('(max-width: 991px)');
  var sidebar, handle;
  var currentState = 0; // index into STATES
  var startY = 0;
  var startTranslate = 0;
  var dragging = false;
  var didDrag = false; // true if pointer moved enough to count as a drag

  function getTranslateY(el) {
    var style = window.getComputedStyle(el);
    var matrix = new DOMMatrix(style.transform);
    return matrix.m42;
  }

  function setState(index) {
    currentState = Math.max(0, Math.min(index, STATES.length - 1));
    sidebar.classList.remove(STATES[0], STATES[1], 'drawer-dragging');
    sidebar.classList.add(STATES[currentState]);
  }

  function snapToNearest(currentY) {
    var height = sidebar.offsetHeight;
    var visible = height - currentY;
    var peekVisible = 220;
    var halfVisible = window.innerHeight * 0.5;

    var distances = [
      Math.abs(visible - peekVisible),
      Math.abs(visible - halfVisible)
    ];

    return distances[1] < distances[0] ? 1 : 0;
  }

  function applyDrag(clientY) {
    var deltaY = clientY - startY;
    if (Math.abs(deltaY) > 4) didDrag = true;
    var newTranslate = startTranslate + deltaY;
    var maxTranslate = sidebar.offsetHeight - 220;
    newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));
    sidebar.style.transform = 'translateY(' + newTranslate + 'px)';
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    var finalY = getTranslateY(sidebar);
    sidebar.style.transform = '';
    sidebar.classList.remove('drawer-dragging');
    setState(snapToNearest(finalY));
  }

  // --- Touch events ---
  function onTouchStart(e) {
    if (!mql.matches) return;
    dragging = true;
    didDrag = false;
    startY = e.touches[0].clientY;
    startTranslate = getTranslateY(sidebar);
    sidebar.classList.add('drawer-dragging');
  }

  function onTouchMove(e) {
    if (!dragging) return;
    applyDrag(e.touches[0].clientY);
    e.preventDefault();
  }

  function onTouchEnd() {
    endDrag();
  }

  // --- Mouse events ---
  function onMouseDown(e) {
    if (!mql.matches) return;
    e.preventDefault(); // prevent text selection
    dragging = true;
    didDrag = false;
    startY = e.clientY;
    startTranslate = getTranslateY(sidebar);
    sidebar.classList.add('drawer-dragging');
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    applyDrag(e.clientY);
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    endDrag();
  }

  // --- Click to cycle (only if no drag happened) ---
  function onHandleClick() {
    if (!mql.matches) return;
    if (didDrag) {
      didDrag = false;
      return;
    }
    var next = (currentState + 1) % STATES.length;
    setState(next);
  }

  function activate() {
    sidebar = document.getElementById('sidebar');
    handle = document.getElementById('drawer-handle');
    if (!sidebar || !handle) return;

    if (mql.matches) {
      setState(0);
    } else {
      sidebar.classList.remove(STATES[0], STATES[1], 'drawer-dragging');
      sidebar.style.transform = '';
    }

    // Prevent browser scroll-into-view on input focus inside drawer
    var inputs = sidebar.querySelectorAll('input, select');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('focus', function () {
        if (!mql.matches) return;
        // Open drawer to half so input is visible without browser scrolling
        setState(1);
        // Undo any browser scroll the focus caused
        window.scrollTo(0, 0);
      });
    }

    handle.addEventListener('touchstart', onTouchStart, { passive: true });
    handle.addEventListener('touchmove', onTouchMove, { passive: false });
    handle.addEventListener('touchend', onTouchEnd);

    handle.addEventListener('mousedown', onMouseDown);

    handle.addEventListener('click', onHandleClick);

    mql.addEventListener('change', function () {
      if (!mql.matches) {
        sidebar.classList.remove(STATES[0], STATES[1], 'drawer-dragging');
        sidebar.style.transform = '';
      } else {
        setState(0);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }
})();
