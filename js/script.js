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
  rightTranslateX = xTrans;
  slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
  slider.style.transition = 'transform 0.3s ease-out';
  rightTranslateX = xTrans2;
  endSlider();
  closestPosition = '';
  checkSlidersPos = checkSlider;
}
function endSlider() {
  noneTransion = true;
  slider.addEventListener('transitionend', function () {
    slider.style.transition = 'none';
    console.log(rightTranslateX);

    slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;

  }, { once: true });
};

sliderParent.addEventListener('mousedown', function () {
  sliderParent.style.cursor = 'grabbing';
});

slider.addEventListener('mousedown', function (e) {
  clearInterval(sliderAnimation);
  dragStart = true;
  sliderX = e.pageX;
  slider.style.transition = 'none';
  slider.style.cursor = 'grabbing';
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

slider.addEventListener('mousemove', function (event) {
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
});

slider.addEventListener('mouseup', function (e) {
  sliderAnimation = setInterval(sliderAnimationWork, 2500);
  sliderRightPos();
  stopDragging();
  sliderX = e.pageX;
});
slider.addEventListener('mouseleave', function (e) {
  if (dragStart) {
    sliderRightPos();
    dragStart = false;
  };
  sliderX = e.pageX;
  stopDragging();
});

var leftSliderBut = document.getElementById('arroow-left');
var rightSliderBut = document.getElementById('arroow-right');

function sliderClick() {
  XTranslate = rightTranslateX;
  var position = [sliderStart, endPo];
  closestPosition = position.indexOf(rightTranslateX);
  if (rightTranslateX == position[0]) {
    endSlide(sliderStart, sliderPositions[2], [false, false, true]);
  } else if (rightTranslateX == position[1]) {
    endSlide(endPo, sliderPositions[0], [true, false, false]);
  } else {
    slider.style.transform = `translate3d(${rightTranslateX}px, 0, 0)`;
    slider.style.transition = 'transform 0.3s ease-out';
  };
  closestPosition = '';
};

rightSliderBut.onclick = function () {
  rightTranslateX -= itemSize;
  sliderClick();
};

leftSliderBut.onclick = function () {
  rightTranslateX += itemSize;
  sliderClick();
};

var checkEndPos = false;
littleBut.forEach(function (button, index) {
  button.onclick = function () {
    clearInterval(sliderAnimation);
    function littleButWork(position) {
      slider.style.transform = `translateX(${position}px)`;
      slider.style.transition = 'transform 0.3s ease-out';
      closestPosition = '';
      deActive();
    };
    switch (index) {
      case 0:
        if (littleBut[2].classList.contains('active')) {
          littleButWork(endPo);
          checkEndPos = true;
          XTranslate = endPo;
          rightTranslateX = endPo;
        } else {
          littleButWork(sliderPositions[0]);
          XTranslate = sliderPositions[0];
          rightTranslateX = sliderPositions[0];
        };
        littleBut[0].classList.add('active');
        checkSlidersPos = [true, false, false];
        break;
      case 1:
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${sliderPositions[0]}px)`;
        setTimeout(() => {
          littleButWork(sliderPositions[1]);
          littleBut[1].classList.add('active');
        }, 10);
        checkSlidersPos = [false, true, false];
        XTranslate = sliderPositions[1];
        rightTranslateX = sliderPositions[1];
        break;
      case 2:
        if (littleBut[0].classList.contains('active')) {
          slider.style.transition = 'none';
          slider.style.transform = `translateX(${endPo}px)`;
          setTimeout(() => {
            littleButWork(sliderPositions[2]);
            littleBut[2].classList.add('active');
          }, 10);
        } else {
          littleButWork(sliderPositions[2]);
          littleBut[2].classList.add('active');
        };
        checkSlidersPos = [false, false, true];
        XTranslate = sliderPositions[2];
        rightTranslateX = sliderPositions[2];
        break;
    };
    setTimeout(() => {
      sliderAnimation = setInterval(sliderAnimationWork, 2500)
    }, 10);
  };
});

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
  function changePos(pos) {
    slider.style.transform = `translateX(${pos}px)`;
    slider.style.transition = 'transform 0.5s ease-out';
    deActive();
  };

  if (Number(witchPos) + Number(itemSize) == sliderPositions[1]) {
    changePos(Number(witchPos) + Number(itemSize));
    littleBut[1].classList.add('active');
    closestPosition = 1;
    XTranslate = Number(witchPos) + Number(itemSize);
    rightTranslateX = Number(witchPos) + Number(itemSize);
  } else if (Number(witchPos) + Number(itemSize) == sliderPositions[2]) {
    changePos(Number(witchPos) + Number(itemSize));
    littleBut[2].classList.add('active');
    closestPosition = 2;
    XTranslate = Number(witchPos) + Number(itemSize);
    rightTranslateX = Number(witchPos) + Number(itemSize);
  } else if (Number(witchPos) + Number(itemSize) == endPo) {
    changePos(Number(witchPos) + Number(itemSize));
    setTimeout(() => {
      slider.style.transition = 'none';
      slider.style.transform = `translateX(${sliderPositions[0]}px)`;
    }, 1000);
    closestPosition = 0;
    XTranslate = sliderPositions[0];
    rightTranslateX = sliderPositions[0];
    littleBut[0].classList.add('active');
  };
};
var sliderAnimation = setInterval(sliderAnimationWork, 2500);