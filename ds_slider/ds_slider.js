'use strict'

async function DSS_start(sliderClass, settings){

    // ===================== //
    // Стандартные настройки //
    // ===================== // 
    
    let currentSettings = {

        // Слайд-шоу

        autoPlaySlider:         false,
        autoPlayDelay:          1000,
        autoPlayDirrection:     "left",

        // Стрелки

        arrows:                 false,
        prewArrow:              "a_left",
        nextArrow:              "a_right",

        // Точки навигации

        bullets:                false,
        bulletsEffect:          "bullet-pull",

        // Бесконечный слайдер

        endlessSlider:          true,

        // Автоматическая настройка внешних отступов

        autoSetterMargins:      false,

        // Режим презентации

        presentationMode:       true,
        thumbSlidesClassName:   "slide-thumb",

        // Анимации

        speedAnimation:         400,
        transition:             "ease-in-out",

        // Свайпы

        swipeScroll:            false,

    }

    let className = sliderClass.slice(1, sliderClass.length),
        slider = document.querySelector(sliderClass),
        bulletsBarContainer, ttpTemp, margin;


    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined) settings = currentSettings;
    else{
        for (let defaultParameter in currentSettings){
            if(settings[defaultParameter] !== undefined) currentSettings[defaultParameter] = settings[defaultParameter];
        }
    }

    let timeAnim = currentSettings.speedAnimation,
        delayAP = currentSettings.autoPlayDelay,
        infSlider = currentSettings.endlessSlider,
        autoMargin = currentSettings.autoSetterMargins,
        PMtoggle = currentSettings.presentationMode,
        PMslidesClassName = currentSettings.thumbSlidesClassName,
        leftArrow = currentSettings.prewArrow,
        rightArrow = currentSettings.nextArrow,
        countES;

    // =========================== //
    // Функции построения слайдера //
    // =========================== //

    // Функция мигрирования элементов слайдера в родительский тег //

    function slideBuild(){

        let div = document.createElement("div"),
            slides = document.querySelectorAll(sliderClass + " > div"),
            countDivs = slides.length;

        // Перенос текста в отдельный <div> элемент //

        for (let slide of slides){

            let _ = slide.childNodes,
                div = document.createElement("div"),
                checkIMG = false, index = 0;
                
            div.classList.add("_objects");

            for (let j of _) { 
                if (j.nodeName === "IMG") checkIMG = true;
            }

            if(checkIMG) { 
                while(_.length !== 1) _[index].nodeName === "IMG" ? index++ : div.append(_[index]);
            } else { 
                while(_.length !== 0) div.append(_[index]);
            }

            slide.append(div);

        }


        div.className = className + "-track";

        for (let i = 0; i < countDivs; i++) div.append(slides[i]);

        slider.append(div);

    }

    // Функция присвайвания ID слайдам //

    function classIndent(items, track){

        for (let j = 0; j < items.length; j++){
            if(infSlider) { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - countES); }
            else { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        }
        
        if(infSlider) {
            items[countES].classList.add("active");
            track.style.transform = `translate3d(-${(track.querySelector("div").clientWidth * (countES - 1))}px, 0px, 0px)`;
        } else {
            track.firstChild.classList.add("active");
        }
        
    }

    // Функция построения стрелок //

    function buildButtons(container){

        for (let _ of [leftArrow, rightArrow]) {

            let el = document.createElement("button");
            el.classList.add("a-bar"); el.id = _;
            _ === leftArrow ? container.prepend(el) : container.append(el);

        }

    }

    // Функция построения дотс-бара //

    function buildBulletsBar(container, bulletsBar, items){

        bulletsBar.classList = "bullets-bar";
        container.append(bulletsBar);

        bulletsBarContainer = slider.querySelector(sliderClass + " .bullets-bar");

        let countItems = infSlider === true ? items.length - (2 * countES) : items.length;

        for (let i = 0; i < countItems; i++){  
    
            let bullet = document.createElement("div");

            bullet.classList = "bullet";
            bullet.setAttribute("indexItem", i);
            bullet.style.transition = `${timeAnim}ms ${(settings.transition)}`;
            bulletsBarContainer.append(bullet);
    
        }

    }

    function buildPM(props, arrayMS, width){

        // secondBlock это <slider_name>-thumb-block .aka containers[0]
        // sliderThumbCont это <slider_name>-thumb-container .aka containers[1]
        // sliderThumb это <slider_name>-thumb .aka containers[2]
        // MS - Main Slides; MSFS - Main Slides Fonts Size; iMSFSS - index of Main Slides Fonts Size Set

        let classes = [className + "-thumb-block", className + "-thumb-container", className + "-thumb"];

        for (let elem = 0; elem < 3; elem++) {

            let _ = document.createElement("div");

            _.className = classes[elem];
            classes[elem] = _;

        }

        for (let _ of arrayMS) {
            let temp = _.cloneNode(true);
            temp.style.marginLeft = temp.style.marginRight = temp.style.width = null;
            temp.classList.remove("slide");
            classes[2].append(temp);
        }

        slider.append(classes[1]);
        classes[1].append(classes[2]);

        // Создаём стили эскизов для масштабирование шрифта/картинок //

        let thumbnailDiv = slider.querySelectorAll(sliderClass + "-thumb > div"),
            countDivs = thumbnailDiv.length;

        for (let i = 0; i < countDivs; i++) thumbnailDiv[i].classList.add(PMslidesClassName);

        let allT = slider.querySelectorAll(sliderClass + " ." + PMslidesClassName),
            allS = slider.querySelectorAll(sliderClass + " .slide"),
            MSFSset = new Set();

        for (let i = 0; i < countDivs; i++){

            let k = parseFloat(getComputedStyle(allT[i], true).height)/parseFloat(getComputedStyle(allS[i], true).height) - 0.05,
                sizeText = parseFloat(window.getComputedStyle(allT[i], null).getPropertyValue('font-size'));

            if (allT[i].style.fontSize) allT[i].style.fontSize = null;  // Если в атрибуте есть свойство, имеющее значение font-size, то он убирает для корректной работы

            MSFSset.add((sizeText * k) * 0.8); // Из px в pt

            allT[i].classList.add(`fontThumb-${Math.round((sizeText * k) * 0.8)}pt`); // Добавляем класс к эскизу

        }

        if (document.querySelectorAll("head > style").length === 0){ // Если нет атрибута style в теле head, то добавляем
           document.querySelector("head").append(document.createElement("style"));
        }

        for (let size of MSFSset) props.append(`.fontThumb-${Math.round(size)}pt{\nfont-size: ${Math.ceil(size)}pt;\n}\n`);

        let imgThumb = `.thumb-active::after{
                        \nposition: absolute;
                        \ncontent: "";
                        \nopacity: 0.3;
                        \nwidth: inherit;
                        \nheight: inherit;
                        \nbackground-color: white;
                        \nborder-radius: inherit;
                        \n}\n`;

        props.append(imgThumb);

        let thumbContainer = slider.querySelector(sliderClass + "-thumb-container");

        for (let tSlide of Array.from(allT)){
            for (let content of Array.from(tSlide.childNodes)){
                if(content.nodeName === "IMG") content.classList.add("img-slide");
            }
        }

        slider.append(classes[0]);
        classes[0].append(thumbContainer);

        let tt = thumbContainer.firstChild, // thumb track
            mt = parseInt(getComputedStyle(tt.firstChild, true).marginLeft), // left and right margin thumb
            ttw = Math.ceil(((tt.firstChild.clientWidth) + (2 * mt)) * Array.from(tt.childNodes).length); // thumb track width

        if (ttw <= width) tt.parentElement.style.justifyContent = "center";

        tt.firstChild.classList.remove("active");
        tt.firstChild.classList.add('thumb-active');

    }

    // Подгонка картинок под нужный размер //

    function imgFix(array){
        for (let slide of array){
            for (let element of slide.childNodes){ 
                if(element.nodeName === "IMG") element.classList.add("img-slide");
            }
        }
    }

    // Разделение галереи и предпросмотра эскизов на блоки //

    let imageProp = `.img-slide{\nwidth: inherit;\nheight: inherit;\npointer-events: none;\nborder-radius: inherit;
                    \nposition: absolute;\n}\n._objects{\nz-index:2;\n}\n`,
    SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута
    SSProperties.append(imageProp);

    function firstBlockCreate(){

        let sliderBlock = Array.from(document.querySelectorAll(sliderClass)[0].childNodes),
            firstBlock = document.createElement("div");

        firstBlock.className = className + "-block";

        slider.append(firstBlock);

        for (let i = 0; i < sliderBlock.length; i++) firstBlock.append(sliderBlock[i]);

    }

    let secondBlockCreate = (array) => mainItems = infSlider ? array.slice(countES, array.length - countES) : array;

    function elemBlocks(array1, array2, width){

        imgFix(array2); // Подгоняем картинки под нужный размер //
        firstBlockCreate();  // Создаём первый блок //
        secondBlockCreate(array2); // Создаём второй блок //

        if(PMtoggle) buildPM(SSProperties, array1, width);

    }

    // Создание родительских тегов //

    function sliderContainerBuild(track){

        let sliderWindow = document.createElement('div');

        sliderWindow.classList.add(className + "-container")
        track.before(sliderWindow); sliderWindow.append(track);

    }

    // Настройка, отвечающая за безграничный скролл слайдера //

    function endlessSlider(track, items){
        for (let i = 1; i <= countES; i++) track.prepend(items[items.length - i].cloneNode(true));
        for (let j = 1; j <= countES; j++) track.append(items[j + (countES - 1)].cloneNode(true));
    }

    // Подготовка индикации слайдера //

    function bullets(array){

        let bulletsBar = document.createElement("div");

        buildBulletsBar(slider, bulletsBar, array);
        bulletsBarContainer.firstChild.classList.add(currentSettings.bulletsEffect);
        return bulletsBarContainer;

    }

    // Подготовка отступов //

    function marginsBuild(width1, width2, _obj){

        margin = autoMargin ? width1 < width2 ? Math.abs(width2 - width1) / 2 : 0 : 0;

        if(autoMargin && width1 < width2){ 
            for (let i of _obj.childNodes) i.style.marginLeft = i.style.marginRight = `${margin}px`;
        }

    }

    // Построение карусели //

    function buildCarousel(){

        slideBuild();

        let track = slider.querySelector(sliderClass + "-track"),
            items = track.childNodes, cw, sw;

        sliderContainerBuild(track);

        cw = slider.querySelector(sliderClass + "-container").clientWidth; // width container
        sw = track.firstChild.clientWidth; // width slide

        if ((!infSlider && !autoMargin) && sw > cw) autoMargin = true;

        if (autoMargin) marginsBuild(sw, cw, track);

        countES = infSlider && !autoMargin ? Math.floor(cw / sw) + 1: 
                 !infSlider && !autoMargin ? 1 : 1; // ES - extra slides

        if (infSlider) endlessSlider(track, items);

        if (!infSlider && !autoMargin && sw < cw) track.style.marginLeft = `${(cw - sw)/2}`;

        let allSlides = Array.from(items),
            mainSlides = infSlider ? allSlides.slice(countES, allSlides.length - countES) : allSlides;

        if (currentSettings.arrows) buildButtons(slider);
        if (currentSettings.bullets) bullets(items);
        classIndent(items, track);
        elemBlocks(mainSlides, allSlides, cw);

        return _ = { track: track, items: items, sw: sw, cw: cw};

    }

    var _ = buildCarousel();
    const track = _.track,
        items = _.items,
        sw = _.sw,
        cw = _.cw;

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

    // ================================================== //
    // Вспомогательные методы и функции для смены слайдов //
    // ================================================== //

    // Функция на проверку возможности прокрутки слайдера //

    function checkingScroll(callback, direction){

        if(infSlider) callback(direction);
        else {
            if ((indexTarget > 0 && direction === -1) || (indexTarget < countSlides - 1 && direction === 1)) callback(direction);
        }

    }

    // Функция для рассчёта позиции в пикселях //

    function calcPos(index) {

        let half = (cw - sw)/2;
        return  (autoMargin && (infSlider || !infSlider)) ? (sw > cw ? ((-sw + half) * index) - (half * (index - 1)) : -cw * index) :
                (!autoMargin && !infSlider) ? (sw > cw ? half * index : -sw * index) :
                (sw < cw ? ((-sw * index) + half) : ((-sw + half) * index) - (half * (index - 1)));

    }

    // Метод для контроля свойством transition //

    Object.prototype.toggleAnimation = function(toggle, speed) {
        this.style.transition = toggle ? `${(speed)}ms ${settings.transition}` : "";
    }

    // Метод анимации трека слайдера //

    Object.prototype.setPosition = function (target, cond1, cond2) {

        let _target = target

        this.style.transform = "translate3d(" + calcPos(_target) + "px, 0px, 0px)";

        if(cond1 || cond2){

            _target = cond1 ? countES : cond2 ? countSlides - (countES + 1): target;

            setTimeout(() => {

                this.toggleAnimation(false, timeAnim);
                this.style.transform = "translate3d(" + calcPos(_target) + "px, 0px, 0px)";

            }, timeAnim)

        }

        stp = calcPos(_target);

    }

    // ============================================ //
    // Функции, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function scroll(target){

        if(isDelayed) return;

        isDelayed = true;

        controlAutoPlay(false);
        track.toggleAnimation(true, timeAnim);

        indexTarget += target;
        firstCondition = (target === 1 && indexTarget === countSlides - countES && infSlider);
        secondCondition = (target === -1 && indexTarget === countES - 1 && infSlider);

        track.setPosition(indexTarget, firstCondition, secondCondition);
        changeActiveSlide(indexTarget, indexCurrent, firstCondition, secondCondition);

        setTimeout(() => {

            controlAutoPlay(true);
            track.toggleAnimation(false, timeAnim);
            isDelayed = false;

        }, timeAnim);

    }

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

    // =================== //
    // Навигация по точкам //
    // =================== //

    // Функция переключение слайдов для точек навигации //

    function target(targetSlide){

        controlAutoPlay(false);

        let targetIndex = !infSlider ? targetSlide : targetSlide + (countES - 1);

        track.toggleAnimation(true, timeAnim);
        track.setPosition(targetIndex);

        setTimeout(() => {

            track.toggleAnimation(false, timeAnim);
            controlAutoPlay(true);

        }, timeAnim);

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

    // Фунция смены активного слайда //

    function changeActiveSlide(target, current, cond1, cond2) {

        indexTarget = cond1 ? countES : cond2 ? countSlides - (countES + 1) : target;

        let args = [indexTarget, indexCurrent];

        for (let i of args) {

            animElements(i, mainItems)
            if(currentSettings.bullets) animElements(i, allBullets)
            if(PMtoggle) animElements(i, thumbnails)

        }

        indexCurrent = indexTarget;

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

    // Эвенты для стрелок //

    function arrowsEvents(sliderClass, callback){

        for (let arrow of sliderClass) {

            arrow.addEventListener("click", function () {

                let target = this.id === leftArrow ? -1 : 1;

                checkingScroll(callback, target)

            })

        }

    }

    // Эвенты для точек навигации //

    function bulletsEventsCreate(toggle){

        let bulletsBar = currentSettings.bullets ? bulletsBarContainer.childNodes : null;

        function actionBullets(obj) {

            if(isDelayed) return;

            isDelayed = true;

            let targetIndex = parseInt(obj.getAttribute("indexItem")),
                targetSlide = infSlider ? targetIndex + countES : targetIndex;

            changeActiveSlide(targetSlide, indexCurrent);
            target(targetSlide, mainItems[0].clientWidth);

            setTimeout(() => isDelayed = false, timeAnim);

        }

        if(toggle){

            for (let i = 0; i < bulletsBar.length; i++) bulletsBar[i].addEventListener("click", function(){ return actionBullets(this); });

        }

    }

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

    // Создание эвентов //

    function eventsToggle(toggle){

        let _argsPM = [], _argsS = [];

        for (let allArgs of ["argsPM", "argsS"]) {
            if (allArgs === "argsPM" && PMtoggle){ for (let parsedArgs of argsPM) _argsPM.push(parsedArgs); }
            else{ for (let parsedArgs of argsS) _argsS.push(parsedArgs); }
        }
        for (let args of [_argsPM, _argsS]) args.push(toggle);

        window.onresize = !toggle ? null : debounce(() => ws = window.innerWidth, 1/60 * 1000);

        if (currentSettings.bullets) bulletsEventsCreate(toggle);
        if (currentSettings.arrows) arrowsEvents(slider.querySelectorAll(sliderClass + " .a-bar"), scroll);

        controlAutoPlay(toggle);

        if (PMtoggle) pointerEvents.apply(this, _argsPM);
        if (currentSettings.swipeScroll) pointerEvents.apply(this, _argsS);

    }

    eventsToggle(true);

    // Контроль эвентов //

    // <==[coming soon...]==> //

}

// ======================= //
// Вспомогательные функции //
// ======================= //

function logBase(x, y){ 

    return Math.log(y) / Math.log(x);

}

function logAnimGraphic(x, constant){ 

    return Math.round((10*((logBase(2, x - constant) ** 3)))** 0.5); 
    
}

function throttle(func, delay) {

    let isThrottled = false,
        savedArgs,
        savedThis;

    return function wrapper() {

        if (isThrottled) {

            savedArgs = arguments;
            savedThis = this;

            return;

        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout((function() {

            isThrottled = false;

            if (savedArgs) {

                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;

            }

        }), delay);

    }

}

function debounce(func, delay) {

    let isDebounced = false;
    
    return function() {

        if (isDebounced) return;
    
        func.apply(this, arguments);
    
        isDebounced = true;
    
        setTimeout(() => isDebounced = false, delay);

    };
    
}