// lazyload
"use strict";window.lazyload=function(e){function v(e,t){return(t=t||document).querySelectorAll(e)}var t,b=window.lazyload;for(t in b.options=e||{},b.defaults={selector:".lazy",rootMargin:"250px"},b.defaults)b.options[t]||(b.options[t]=b.defaults[t]);b.settings=b.options,b.observer=new IntersectionObserver(function(e){for(var t=0,s=e.length;t<s;t++)if(e[t].isIntersecting){var a,r=e[t].target,n=r.getAttribute("data-src")||"#",o=r.getAttribute("data-srcset")||"#";switch(r.tagName){case"VIDEO":case"AUDIO":case"PICTURE":case"IFRAME":case"IMG":"#"!==n&&(r.src=n),"#"!==o&&(r.srcset=o);var i=v("source, img",r);if(i)for(var c=0,d=i.length;c<d;c++){var l=i[c].getAttribute("data-src"),g=i[c].getAttribute("data-srcset");l&&(i[c].src=l),g&&(i[c].srcset=g)}break;default:"#"!==n?r.style.backgroundImage=n:"#"!==o&&(a="image-set("+o+")",r.style.backgroundImage=a,r.style.backgroundImage||(r.style.backgroundImage="-webkit-"+a))}r.classList.add("lazyloaded");var u=void 0;"function"==typeof Event?u=new Event("lazyloaded"):(u=document.createEvent("Event")).initEvent("lazyloaded",!0,!0),r.dispatchEvent(u),b.observer.unobserve(r)}},{rootMargin:b.options.rootMargin}),b.startObserve=function(e,t){"init"===e&&(t=b.elements=v(b.settings.selector));for(var s=0,a=t.length;s<a;s++)"add"===e&&(t[s].classList.add("lazy"),b.elements[b.elements.length]=t[s]),b.observer.observe(t[s])},b.add=function(e){"string"==typeof e&&(e=v(e)),e&&(console.log(e),b.startObserve("add",e))},b.startObserve("init")};

lazyload();

const featuresBlock = document.getElementById('hero-features');
if (featuresBlock) {
  const items = featuresBlock.querySelectorAll('.hero__features-item');
  let currentIndex = 0;

  function cycleItems() {
    items.forEach(function(item, index) {
      item.classList.toggle('hero__features-item--is-active', index === currentIndex);
    });
    currentIndex = (currentIndex + 1) % items.length;
  }

  setInterval(cycleItems, 3000);

  cycleItems();
}

const setVh = function() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

setVh();
window.addEventListener('resize', setVh);

const dispatchEvent = function(eventName, element) {
  let event;
  if (typeof(Event) === 'function') {
    event = new Event(eventName);
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
  }
  element.dispatchEvent(event);
}

const pageScroll = function(disallow) {
  document.body.classList.toggle('no-scroll', disallow);
}

const mobileMenu = function(_) {
  let setMenuStyles = function(trf, trs) {
      let args = [trf, trs],
        props = ['transform', 'transition'],
        values = ['translate3d(' + trf + ', 0px, 0px)', 'transform ' + trs];

      for (let i = args.length - 1; i >= 0; i--) {
        if (args[i] !== 0) {
          if (args[i] === '') {
            args[i] = '';
          } else {
            args[i] = values[i];
          }
          menuCnt.style[props[i]] = args[i];
        }
      }
    },
    checkForString = function(variable) {
      return variable.constructor === String ? q(variable) : variable;
    },
    openMenu = function() {
      if (!opened) {
        dispatchEvent('beforeopen', menu);
        if (menu.hasAttribute('style')) {
          menu.removeAttribute('style');
          menu.offsetHeight;
        }
        menu.classList.add('active');
        openBtn.classList.add('active');
        menuCnt.scrollTop = 0;

        if (!fade) {
          setMenuStyles('0px', '.5s');
          menuWidth = menuCnt.offsetWidth;
        }
        if (!allowPageScroll) {
          pageScroll(true);
        }
      }
    },
    closeMenu = function(e, forSwipe) {
      if (opened) {
        dispatchEvent('beforeclose', menu);
        let target = e && e.target;
        // Если меню открыто и произошел свайп или нет события (закрыто вызовом функции close()) или есть евент и его св-ва
        if (forSwipe || !e || (e.type === 'keyup' && e.keyCode === 27 || target === menu || target === closeBtn)) {
          menu.classList.remove('active');
          openBtn.classList.remove('active');
          menu.removeEventListener('touchstart', swipeStart);

          if (!fade) {
            setMenuStyles(initialTransformX, '.5s');
          }
        }
      }
    },
    swipeStart = function(e) {
      if (allowSwipe) {
        let evt = e.touches[0] || window.e.touches[0];

        isSwipe = isScroll = false;
        posInitX = posX1 = evt.clientX;
        posInitY = posY1 = evt.clientY;
        swipeStartTime = Date.now();

        menuCnt.addEventListener('touchend', swipeEnd);
        menuCnt.addEventListener('touchmove', swipeAction);
        setMenuStyles(0, '');
      }
    },
    swipeAction = function(e) {
      if (allowSwipe) {
        let evt = e.touches[0] || window.e.touches[0],
          style = menuCnt.style.transform,
          transform = +style.match(trfRegExp)[0];

        posX2 = posX1 - evt.clientX;
        posX1 = evt.clientX;

        posY2 = posY1 - evt.clientY;
        posY1 = evt.clientY;

        // Если еще не определено свайп или скролл (двигаемся в бок или вверх/вниз)
        if (!isSwipe && !isScroll) {
          let posY = Math.abs(posY2),
            posX = Math.abs(posX2);

          if (posY > 7 || posX2 === 0) {
            isScroll = true;
          } else if (posY < 7) {
            isSwipe = true;
          }
        }

        if (isSwipe) {
          // Если двигаемся влево или вправо при уже открытом меню, фиксируем позицию
          if ((toLeft && posInitX > posX1) || (toRight && posInitX < posX1)) {
            setMenuStyles('0px', 0);
            return;
          }
          setMenuStyles(transform - posX2 + 'px', 0);
        }
      }
    },
    swipeEnd = function(e) {
      posFinal = posInitX - posX1;

      let absPosFinal = Math.abs(posFinal);

      swipeEndTime = Date.now();

      if (absPosFinal > 1 && isSwipe) {
        if (toLeft && posFinal < 0 || toRight && posFinal > 0) {
          if (absPosFinal >= menuWidth * swipeThreshold || swipeEndTime - swipeStartTime < 300) {
            closeMenu(e, true);
          } else {
            opened = false;
            openMenu(e, true);
          }
        }
        allowSwipe = false;
      }

      menu.removeEventListener('touchend', swipeEnd);
      menu.removeEventListener('touchmove', swipeAction);

    },
    transitionEnd = function(e) {
      if (fade) {
        if (e.propertyName === 'opacity') {
          transitionEndEvents();
        }
      } else {
        if (e.propertyName === 'transform') {
          transitionEndEvents();
        }
      } 
      allowSwipe = true;
    },
    transitionEndEvents = function() {
      if (opened) {
        dispatchEvent('close', menu);
        menu.isOpened = opened = false;
        openBtn.addEventListener('click', openMenu);
        closeBtn.removeEventListener('click', closeMenu);
        if (!allowPageScroll) {
          pageScroll(false);
        }
      } else {
        dispatchEvent('open', menu);
        menu.isOpened = opened = true;
        openBtn.removeEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        menu.addEventListener('touchstart', swipeStart);
      }
    },
    init = function() {
      menu = checkForString(_.menu);
      menuCnt = checkForString(_.menuCnt);
      openBtn = checkForString(_.openBtn);
      closeBtn = checkForString(_.closeBtn);
      allowPageScroll = options.allowPageScroll;
      toRight = options.toRight;
      toLeft = options.toLeft;
      initialTransformX = toLeft ? '100%' : toRight ? '-100%' : 0;
      fade = options.fade;

      setListeners('add');

      if (fade) {
        toRight = toLeft = false;
      } else {
        setMenuStyles(initialTransformX, 0);
        // menu.addEventListener('touchstart', swipeStart);
      }
      menu.isOpened = false;
    },
    setListeners = function(action) {
      openBtn[action + 'EventListener']('click', openMenu);
      menu[action + 'EventListener']('click', closeMenu);
      menu[action + 'EventListener']('transitionend', transitionEnd);
      document[action + 'EventListener']('keyup', closeMenu);
    },
    destroy = function() {
      if (opened) {
        closeMenu();
      }

      if (fade) {
        toRight = toLeft = false;
      } else {
        setMenuStyles('', '');
        menu.removeEventListener('touchstart', swipeStart);
      }

      setListeners('remove');
      menu = null;
      menuCnt = null;
      openBtn = null;
      closeBtn = null;
    },
    applyMediaParams = function() {
      // console.log('applyMediaParams');
      if (targetMediaQuery) {
        // console.log('set ' + targetMediaQuery + ' params');
        for (let option in responsive[targetMediaQuery]) {
          options[option] = responsive[targetMediaQuery][option];
        }
        currentMediaQuery = targetMediaQuery;
      } else { // set initial params
        for (let option in initialOptions) {
          options[option] = initialOptions[option];
        }
        currentMediaQuery = null;
      }
      if (menu) {
        destroy();
        init();
      }
    },
    checkMedia = function() {
      if (responsive) {
        targetMediaQuery = null;
        for (let mediaQuery in responsive) {
          if (media(mediaQuery)) {
            targetMediaQuery = mediaQuery;
          }
        }
        if (targetMediaQuery !== currentMediaQuery) {
          applyMediaParams();
        }
      }
      if (!menu) {
        init();
      }
    },
    options = JSON.parse(JSON.stringify(_)),
    initialOptions = JSON.parse(JSON.stringify(_)),
    responsive = _.responsive,
    targetMediaQuery = null,
    currentMediaQuery = null,
    menu,
    menuCnt,
    openBtn,
    closeBtn,
    swipeStartTime,
    swipeEndTime,
    allowPageScroll,
    swipeThreshold = 0.5,
    toRight,
    toLeft,
    initialTransformX,
    fade,
    startPageY = pageYOffset,
    trfRegExp = /([-0-9.]+(?=px))/,
    isSwipe = false,
    isScroll = false,
    allowSwipe = false,
    opened = false,
    posX1 = 0,
    posX2 = 0,
    posY1 = 0,
    posY2 = 0,
    posInitX = 0,
    posInitY = 0,
    posFinal = 0,
    menuWidth = 0;

  if (_.menu) {
    // Элементы не изменяются через responsive
    checkMedia();

    window.addEventListener('resize', checkMedia);

    return {
      options: options,
      menu: menu,
      menuCnt: menuCnt,
      openBtn: openBtn,
      closeBtn: closeBtn,
      open: openMenu,
      close: closeMenu,
      destroy: destroy,
      init: init,
      opened: opened
    };
  }
}

const menu = mobileMenu({
  menu: document.querySelector('.mobile-menu'),
  menuCnt: document.querySelector('.mobile-menu__content'),
  openBtn: document.querySelector('.header__burger'),
  closeBtn: document.querySelector('.header__burger'),
  fade: true,
  allowPageScroll: false
});

const sticky = function($el, fixThresholdDir, className) {
  $el = typeof $el === 'string' ? q($el) : $el;
  className = className || 'fixed';
  fixThresholdDir = fixThresholdDir || 'bottom';

  let fixThreshold = $el.getBoundingClientRect()[fixThresholdDir] + scrollY;
  let $elClone = $el.cloneNode(true);
  let $elParent = $el.parentElement;
  let fixElement = function() {
    if (!$el.classList.contains(className) && scrollY >= fixThreshold) {
      $elParent.appendChild($elParent.replaceChild($elClone, $el));
      $el.classList.add(className);

      window.removeEventListener('scroll', fixElement);
      window.addEventListener('scroll', unfixElement);
    }
  };
  let unfixElement = function() {
    if ($el.classList.contains(className) && scrollY <= fixThreshold) {
      $elParent.replaceChild($el, $elClone);
      $el.classList.remove(className);

      window.removeEventListener('scroll', unfixElement);
      window.addEventListener('scroll', fixElement);
    }
  };

  $elClone.classList.add('clone');
  fixElement();
  window.addEventListener('scroll', fixElement);
}

sticky(document.querySelector('.header'));