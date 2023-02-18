
const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

// ========== //
// Переменные //
// ========== //

let position = (autoMargin && infSlider) ? (sw > cw ? -sw + (cw - sw)/2 : -cw) :
               (autoMargin && !infSlider) || (!autoMargin && !infSlider) ? (sw > cw ? (cw - sw)/2 : 0):
               (!autoMargin && infSlider) ? (sw > cw ? -sw + (cw - sw)/2 :
                (sw < cw ? (-sw * countES) + (cw - sw)/2 : ((-cw * countES) - (cw - sw)/2))) : null,
    stp = position, ttp = 0;

var mainItems = Array.from(items);

if (currentSettings.bullets) var allBullets = Array.from(bulletsBarContainer.childNodes);
if (PMtoggle) var thumbnails = slider.querySelectorAll(sliderClass + " ." + PMslidesClassName);

let isDelayed = false, indexCurrent = infSlider ? countES : 0,
    indexTarget = infSlider ? countES : 0, firstCondition, secondCondition;

var countSlides = mainItems.length,
    APtarget = currentSettings.autoPlayDirrection === "left" ? -1 : 1;

let ws = window.innerWidth;

// ===================== //
// Функция автопрокрутки //
// ===================== //

let autoplay = 0,
    paused = true;

function controlAutoPlay(toggle){

    if(currentSettings.autoPlaySlider){
        if (toggle) autoplay = setInterval(() => checkingScroll(scroll, APtarget), delayAP);
        else if (!toggle) clearInterval(autoplay)
    }

}


// ===================================== //
// Функции переключения активного слайда //
// ===================================== //

// Фунция смены классов //

function animElements(index, className){

    let _index = infSlider ? index - countES: index;

    if(className === mainItems) className[index].classList.toggle("active");
    else if (className === allBullets) className[_index].classList.toggle(currentSettings.bulletsEffect);
    else if (className === thumbnails) className[_index].classList.toggle("thumb-active");

}

// ===================================== //
// Скроллинг слайдов посредством свайпов //
// ===================================== //

let isTouchedPM = false, isDelayedPM = false, // Булеаны для режима презентации
    isTouched = false; // Булеан для свайпов

// Функция определения лимитов позиции //

let limits = (l, half) => {

    return ((autoMargin && infSlider) || (autoMargin && !infSlider)) ?
        (sw > cw ? ((-sw + half) * l) - (half * (l - 1)) : -cw * l):
        (!autoMargin && !infSlider) ? (sw > cw ? half * l : -sw * l):
            (sw < cw ? ((-sw * l) + half) : ((-sw + half) * l) - (half * (l - 1)));

}

function swipeSlide(){

    let sc = track.parentElement, sp = 0, scw = sc.clientWidth, moving, move,
        sw = track.firstChild.clientWidth,
        lastSlide = infSlider ? countSlides : countSlides - 1,
        firstSlide = infSlider ? 1 : 0,
        half = (cw - sw)/2, sl = cw * 0.3,
        mle = limits(lastSlide, half), // move limit on start pos
        mls = limits(firstSlide, half); // move limit on end pos

    mle += mls === 0 ? -cw * (5 / 17) : mls * (8 / 17);
    mls -= mls === 0 ? -cw * (5 / 17) : mls * (8 / 17);

    track.style.transform = `translate3d(${position}px, 0px, 0px)`;

    let booleanEdit = (t, d) => {

        isTouched = t;
        isDelayed = d;

    }

    function overscrollAnim(){

        booleanEdit(false, true);

        track.toggleAnimation(true, timeAnim/2);
        track.style.transform = `translate3d(${stp}px, 0px, 0px)`;

        setTimeout((() => {

            track.toggleAnimation(false, timeAnim/2);

            isDelayed = false;

            controlAutoPlay(true);

        }), timeAnim/2);

    }
    let onDown = (event) => {

        controlAutoPlay(false);

        if (!isDelayed){

            sp = (event.pageX - ((ws - scw)/2));
            isTouched = true;

        }

    };
    let slide = () => {

        if (move < -sl || move > sl){

            booleanEdit(false, isDelayed);

            let target = move < -sl ? 1 : -1;

            checkingScroll(scroll, target)

            setTimeout(() => controlAutoPlay(true), timeAnim);

        }

    }
    let onMove = throttle((event) => {

        moving = stp + ((event.pageX - ((ws - scw)/2)) - sp);
        move = (event.pageX - ((ws - scw)/2)) - sp;

        if(isTouched && !isDelayed){
            if(infSlider){
                track.style.transform = `translate3d(${moving}px, 0px, 0px)`; slide();
            }
            else {
                if (moving > mls || moving < mle) overscrollAnim();
                else { track.style.transform = `translate3d(${moving}px, 0px, 0px)`; slide(); }
            }
        }

    }, 1/400 * 1000);
    let onUp = () => {

        if (isTouched) overscrollAnim();

    };

    return [sc, track, onDown, onMove, onUp, overscrollAnim, booleanEdit, "swipe"];

}

// ================= //
// Режим презентации //
// ================= //

function presentationMode(){

    // tt - thumb track; sw - slide width; sm - slide margin; ml - moving limit; tcw - thumb container width
    // sp - start position; mpx - mouse position x; ttp - thumb track position on X

    let tt = slider.querySelector(sliderClass + "-thumb"),
        ts = tt.firstChild, ws = window.innerWidth,
        tsm = 2 * parseFloat(getComputedStyle(ts, true).marginLeft),
        tsw = parseFloat(getComputedStyle(ts, true).width),
        tcw = tt.parentElement.clientWidth, sp = 0, mpx = 0,
        ml = -((tsm + tsw) * (tt.childNodes).length) > -tcw ? 0 :
            -((tsm + tsw) * (tt.childNodes).length) + tcw;

    tt.style.transform = `translate3d(0px, 0px, 0px)`

    ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

    let booleanEdit = (t, d) => {

        isTouchedPM = t;
        isDelayedPM = d;

    }

    function overscrollAnim(){

        tt.toggleAnimation(true, timeAnim/2);

        booleanEdit(false, true);

        let condition = ttpTemp > 0 ? 0 : ttpTemp < ml ? ml : ttpTemp;

        let limiter = (returnTo) => {

            tt.style.transform = `translate3d(${returnTo}px, 0px, 0px)`;
            ttp = returnTo; ttpTemp = returnTo;

        }
        limiter(condition);
        setTimeout((() => {

            tt.toggleAnimation(false, timeAnim/2);
            booleanEdit(isTouchedPM, false);

        }), timeAnim/2);

    }

    let pd = (event) => {

        ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        booleanEdit(true, isDelayedPM);

        sp = (event.pageX - ((ws - tcw)/2)); // стартовая позиция мышки по оси X относительно контейнера с эскизами

    }

    let pm = throttle((event) => {

        event.preventDefault();

        if(isTouchedPM && !isDelayedPM) {

            mpx = event.pageX - ((ws - tcw)/2); // позиция мышки по оси X относительно контейнера с эскизами

            let moving = ttp + (mpx - sp);

            if (logAnimGraphic(moving, z) >= 23) {
                tt.style.transform = `translate3d(${logAnimGraphic(moving, z)}px, 0px, 0px)`;
            } else if ((moving) < 0 && -1 * (moving) + ml >= 23) {
                tt.style.transform = `translate3d(${ml - (logAnimGraphic(Math.abs((-1 * ml) + (moving)), z))}px, 0px, 0px)`;
            } else {
                tt.style.transform = `translate3d(${moving}px, 0px, 0px)`;
            }

            ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        }

    }, 1/400 * 1000)

    let pu = () => {

        if (ttpTemp >= 0 || ttpTemp < -1*ml) overscrollAnim(ttpTemp);

        ttp = ttpTemp;
        booleanEdit(false, isDelayedPM);

    }

    return [tt, tt, pd, pm, pu, overscrollAnim, booleanEdit, "pm"];

}

// ======================== //
// Все для создание эвентов //
// ======================== //

// Аргументы для эвентов //

let PMerror = "Please, add slides for correctly working Presentation Mode \nCode error: "

try{
    if (PMtoggle && slider.querySelector(sliderClass + "-thumb").childNodes.length >= 3) var argsPM = presentationMode();
} catch(e) {
    alert(PMerror + e);
}

let argsS = swipeSlide();

// Универсальная функция, предназначение которого создавать эвенты для свайпов //

function pointerEvents(object1, object2, onDown, onMove, onUp, callback1, callback2, typeObj, toggle){

    let condition;

    function afterEnter(object2, toggle){

        object2.onpointerdown = !toggle ? null : (event) => onDown(event)
        object2.onpointermove = !toggle ? null : (event) => onMove(event)
        object2.onpointerup = !toggle ? null : () => onUp()

    }

    object1.onpointerenter = !toggle ? null :  () => afterEnter(object2, toggle);
    object1.onpointerleave = !toggle ? null : () => {

        condition = typeObj === 'pm' ? isTouchedPM && !isDelayedPM : isTouched && !isDelayed;

        if(condition){

            ttp = ttpTemp;

            callback1();
            callback2(false, false);

        }

    }

}