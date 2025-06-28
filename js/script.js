'use strict';

// slider
var sliderParent = document.getElementById('comments-parent');
var slider = document.getElementById('comments');
var dragStart = false;
var sliderMousePosition = 0;
var sliderStart = 0;
var sliderX = 0;
var sliderSpeed = 0.8;
var sliderChangeXValue = 20;
var XTranslate = 1336;
var checkMouseMove = false;
var MoveTranslateX = 1336;
var endPo = 5344;
var sliderPositions = [1336, 2672, 4008];
var closestPosition = 0;
var checkSlidersPos = [true, false, false];
var rightTranslateX = 1336;
var itemSize = 1336;
var noneTransion = false;
var littleBut = document.querySelectorAll('.slide__but');
function stopDragging() {
  dragStart = false;
  slider.style.cursor = 'grab';
};

function changeTreanslateX(witchPos, checkSlider) {
  rightTranslateX = witchPos;
  closestPosition = '';
  checkSlidersPos = checkSlider;
};

function deActive() {
  littleBut.forEach(function (button) {
    button.classList.remove('active');
  });
};

function endSlide(xTrans, xTrans2, checkSlider) {
  deActive();
  rightTranslateX = xTrans;
  slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
  slider.style.transition = 'transform 0.3s ease-out';
  rightTranslateX = xTrans2;
  noneTransion = true;
  slider.addEventListener('transitionend', function () {
    slider.style.transition = 'none';
    slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;

  }, { once: true }); closestPosition = '';
  checkSlidersPos = checkSlider;
}
function endSlider(pos) {
  slider.style.transition = 'none';
  slider.style.transform = `translateX(${pos}px)`;
};

sliderParent.addEventListener('mousedown', function () {
  sliderParent.style.cursor = 'grabbing';
});

slider.addEventListener('mousedown', function (e) {
  sliderDown(e);
});


function sliderRightPos() {
  var position = [sliderPositions[0], sliderPositions[1], sliderPositions[2]];

  noneTransion = false;

  if (closestPosition == '') {
    closestPosition = position.indexOf(XTranslate);
  };



  if (checkMouseMove) {
    switch (closestPosition) {

      case 0:
        if (XTranslate < MoveTranslateX) {
          changeTreanslateX(sliderPositions[1], [false, true, false]);
          deActive();
          littleBut[1].classList.add('active');
        } else {
          endSlide(sliderStart, sliderPositions[2], [false, false, true]);
          deActive();
          littleBut[2].classList.add('active');
        };
        break;
      case 1:
        if (XTranslate < MoveTranslateX) {
          changeTreanslateX(sliderPositions[2], [false, false, true]);
          deActive();
          littleBut[2].classList.add('active');
        } else {
          changeTreanslateX(sliderPositions[0], [true, false, false]);
          deActive();
          littleBut[0].classList.add('active');
        };
        break;
      case 2:
        if (XTranslate < MoveTranslateX) {
          endSlide(endPo, sliderPositions[0], [true, false, false]);
          deActive();
          littleBut[0].classList.add('active');
        } else {
          changeTreanslateX(sliderPositions[1], [false, true, false]);
          deActive();
          littleBut[1].classList.add('active');
        };
        break;
    };
    checkMouseMove = false;

    slider.addEventListener('transitionend', function () {
      var transformValue = window.getComputedStyle(slider).transform;
      if (transformValue !== 'none') {
        var regex3d = /matrix3d\(([^)]+)\)/;
        var match3d = transformValue.match(regex3d);

        if (match3d) {
          var matrix3d = match3d[1].split(',').map(parseFloat);
          XTranslate = matrix3d[12];
        } else {
          var regex2d = /matrix\(([^)]+)\)/;
          var match2d = transformValue.match(regex2d);

          if (match2d) {
            var matrix2d = match2d[1].split(',').map(parseFloat);
            XTranslate = matrix2d[4];
          };
        };
      };
    }, { once: true });
    if (!noneTransion) {
      slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
      slider.style.transition = 'transform 0.3s ease-out';
    };

  };
};

function sliderMove(event) {
  if (dragStart) {
    MoveTranslateX = event.pageX;
    var deltaX = MoveTranslateX - sliderX;
    deltaX = Math.max(Math.min(deltaX, sliderChangeXValue), -sliderChangeXValue);
    rightTranslateX += deltaX * sliderSpeed;
    if (rightTranslateX < sliderStart) {
      rightTranslateX = endPo;
    } else if (rightTranslateX > endPo) {
      rightTranslateX = sliderStart;
    };
    slider.style.transition = 'none';
    slider.style.transform = `translateX(${rightTranslateX}px)`;
    sliderX = event.pageX;
    MoveTranslateX = 0;

    var transformValue = window.getComputedStyle(slider).transform;
    if (transformValue !== 'none') {
      var regex3d = /matrix3d\(([^)]+)\)/;
      var match3d = transformValue.match(regex3d);

      if (match3d) {
        var matrix3d = match3d[1].split(',').map(parseFloat);
        MoveTranslateX = matrix3d[12];
      } else {
        var regex2d = /matrix\(([^)]+)\)/;
        var match2d = transformValue.match(regex2d);

        if (match2d) {
          var matrix2d = match2d[1].split(',').map(parseFloat);
          MoveTranslateX = matrix2d[4];
        };
      };
    };
    checkMouseMove = true;
  };
};

function sliderUp(e) {
  sliderAnimation = setInterval(sliderAnimationWork, 2500);
  sliderRightPos();
  stopDragging();
  sliderX = e.pageX;
};

function sliderLeave(e) {
  if (dragStart) {
    sliderRightPos();
    dragStart = false;
  };
  sliderX = e.pageX;
  stopDragging();
};

function sliderDown(e) {
  clearInterval(sliderAnimation);
  dragStart = true;
  sliderX = e.pageX;
  slider.style.transition = 'none';
  slider.style.cursor = 'grabbing';
}

slider.addEventListener('mousemove', function (event) {
  sliderMove(event);
});

slider.addEventListener('mouseup', function (e) {
  sliderUp(e);
});
slider.addEventListener('mouseleave', function (e) {
  sliderLeave(e);
});

sliderParent.addEventListener('touchstart', function () {
  sliderParent.style.cursor = 'grabbing';
});

slider.addEventListener('touchstart', function (e) {
  sliderDown(e.changedTouches[0]);
});

slider.addEventListener('touchmove', function (e) {
  sliderMove(e.changedTouches[0]);
});

slider.addEventListener('touchend', function (e) {
  sliderUp(e.changedTouches[0]);
});

slider.addEventListener('touchcancel', function (e) {
  sliderLeave(e.changedTouches[0]);
});


var leftSliderBut = document.getElementById('arroow-left');
var rightSliderBut = document.getElementById('arroow-right');

function sliderClick() {
  XTranslate = rightTranslateX;
  switch (rightTranslateX) {
    case sliderStart:
      endSlide(sliderStart, sliderPositions[2], [false, false, true]);
      littleBut[2].classList.add('active');
      break;

    case endPo:
      endSlide(endPo, sliderPositions[0], [true, false, false]);
      littleBut[0].classList.add('active');
      break;

    case sliderPositions[0]:
      changePos(rightTranslateX, 0, [true, false, false]);
      littleBut[0].classList.add('active');
      break;

    case sliderPositions[1]:
      changePos(rightTranslateX, 1, [false, true, false]);
      littleBut[1].classList.add('active');
      break;

    case sliderPositions[2]:
      changePos(rightTranslateX, 2, [false, false, true]);
      littleBut[2].classList.add('active');
      break;

  };
  sliderAnimation = setInterval(sliderAnimationWork, 2500);
  closestPosition = '';
};

rightSliderBut.onclick = function () {
  clearInterval(sliderAnimation);
  rightTranslateX -= itemSize;
  sliderClick();
};

leftSliderBut.onclick = function () {
  clearInterval(sliderAnimation);
  rightTranslateX += itemSize;
  sliderClick();
};

var checkEndPos = false;
littleBut.forEach(function (button, index) {
  button.onclick = function () {
    clearInterval(sliderAnimation);
    switch (index) {
      case 0:
        if (littleBut[2].classList.contains('active')) {
          changePos(endPo, '', [true, false, false]);
          checkEndPos = true;
        } else {
          changePos(sliderPositions[0], '', [true, false, false]);
        };
        littleBut[0].classList.add('active');
        break;
      case 1:
        endSlider(sliderPositions[0]);
        setTimeout(() => {
          changePos(sliderPositions[1], '', [false, true, false]);
          littleBut[1].classList.add('active');
        }, 10);
        break;
      case 2:
        sliderPositions[endPo];
        setTimeout(() => {
          changePos(sliderPositions[2], '', [false, false, true]);
          littleBut[2].classList.add('active');
        }, 10);
        break;
    };
    setTimeout(() => {
      sliderAnimation = setInterval(sliderAnimationWork, 2500)
    }, 10);
  };
});

function changePos(pos, nowPos, arrayValue) {
  slider.style.transform = `translateX(${pos}px)`;
  slider.style.transition = 'transform 0.5s ease-out';
  deActive();
  XTranslate = pos;
  rightTranslateX = pos;
  MoveTranslateX = pos;
  closestPosition = nowPos;
  checkSlidersPos = arrayValue;
};

function sliderAnimationWork() {
  var witchPos = '';
  var transformValue = window.getComputedStyle(slider).transform;
  if (transformValue !== 'none') {
    var regex3d = /matrix3d\(([^)]+)\)/;
    var match3d = transformValue.match(regex3d);

    if (match3d) {
      var matrix3d = match3d[1].split(',').map(parseFloat);
      witchPos = matrix3d[12];
    } else {
      var regex2d = /matrix\(([^)]+)\)/;
      var match2d = transformValue.match(regex2d);

      if (match2d) {
        var matrix2d = match2d[1].split(',').map(parseFloat);
        witchPos = matrix2d[4];
      };
    };
  };

  if (Number(witchPos) + Number(itemSize) == sliderPositions[1]) {
    changePos(Number(witchPos) + Number(itemSize), '', [false, true, false]);
    littleBut[1].classList.add('active');
  } else if (Number(witchPos) + Number(itemSize) == sliderPositions[2]) {
    changePos(Number(witchPos) + Number(itemSize), '', [false, false, true]);
    littleBut[2].classList.add('active');
  } else if (Number(witchPos) + Number(itemSize) == endPo) {
    changePos(Number(witchPos) + Number(itemSize), '', [true, false, false]);
    setTimeout(() => {
      endSlider(sliderPositions[0]);
    }, 1000);
    littleBut[0].classList.add('active');
  };
};
var sliderAnimation = setInterval(sliderAnimationWork, 2500);

function sliderResponsive() {
  function backToPos(size) {
    itemSize = size;
    endPo = itemSize * 4;
    sliderPositions = [itemSize, itemSize * 2, itemSize * 3];
    if (checkSlidersPos[0]) {
      changePos(sliderPositions[0], 0, [true, false, false]);
      littleBut[0].classList.add('active');
    } else if (checkSlidersPos[1]) {
      changePos(sliderPositions[1], 1, [false, true, false]);
      littleBut[1].classList.add('active');
    } else if (checkSlidersPos[2]) {
      changePos(sliderPositions[2], 2, [false, false, true]);
      littleBut[2].classList.add('active');
    };
  };
  if (window.innerWidth < 1336) {
    backToPos(window.innerWidth);
  } else {
    backToPos(1336);
  };
};
sliderResponsive();
window.addEventListener('resize', function () {
  sliderResponsive();
});
// slider

// mobile menu 
var mobileMenuButton = document.querySelectorAll('.mobile__menu-button');
var menu = document.querySelectorAll('.menu');
var checkMenu = false;
mobileMenuButton.forEach(function (div, index) {
  div.onclick = function () {
    var target = menu[index];
    if (target.classList.contains('scaleY-0')) {
      target.classList.add('scaleY-1');
      target.classList.remove('scaleY-0');
      div.classList.add('mobile__menu-button-close');
      div.classList.remove('mobile__menu-button-open');
      checkMenu = true;
    } else if (target.classList.contains('scaleY-1')) {
      target.classList.add('scaleY-0');
      target.classList.remove('scaleY-1');
      div.classList.add('mobile__menu-button-open');
      div.classList.remove('mobile__menu-button-close');
      checkMenu = false;
    };
  };
});

function media_1065(index) {
  var deviceSize = window.innerWidth;
  var minSize = 565;
  var target = menu[index];
  if (deviceSize <= minSize && checkMenu == false) {
    target.classList.add('scaleY-0');
    target.classList.remove('scaleY-1');
  } else if (deviceSize >= minSize) {
    target.classList.add('scaleY-1');
    target.classList.remove('scaleY-0');
  };
};
window.addEventListener('resize', function () {
  menu.forEach(function (_, index) {
    media_1065(index);
  });
});
menu.forEach(function (_, index) {
  media_1065(index);
});
//mobile menu