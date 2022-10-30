function DSS_start(sliderClassName, settings){

    // ===================== //
    // Стандартные настройки //
    // ===================== // 
    
    var defaultSettings = {

        autoPlaySlider: true,
        autoPlayDelay: 5000,
        autoPlayDirrection: "right",
        arrows: true,
        dots: true,
        dotsEffect: "dot-default",
        endlessSlider: true,
        transition: "ease-in-out",
        presentationMode: false,
        speedAnimation: 400,
        swipeScroll: false,

    }

    var className = sliderClassName.slice(1, sliderClassName.length);
        slider = document.querySelector(sliderClassName);


    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined) settingsSlider = defaultSettings; 
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] == (undefined || null)) settings[defaultParameter] = defaultSettings[defaultParameter];

        }

    }

    let timeAnim = settings.speedAnimation,
        delayAP = settings.autoPlayDelay;

    // =========================== //
    // Функции построения слайдера //
    // =========================== //

    // Функция мигрирования элементов слайдера в родительский тег //

    function slideBuild(){

        var div = document.createElement("div"),
            slides = document.querySelectorAll(sliderClassName + " > div"),
            countDivs = slides.length;

        // Перенос текста в отдельный <div> элемент //

        for (let slide of slides){

            let _ = slide.childNodes, div = document.createElement("div");
                div.classList.add("_objects"),
                checkIMG = false; index = 0;

            for (let j of _) { if (j.nodeName == "IMG") checkIMG = true; }

            if(checkIMG) { 
                while(_.length != 1) _[index].nodeName == "IMG" ? index++ : div.append(_[index]);
            } else { while(_.length != 0) div.append(_[index]); }

            slide.append(div);

        }


        div.className = className + "-track";

        for (let i = 0; i < countDivs; i++) div.append(slides[i]);

        slider.append(div);

    };

    // Функция присвайвания ID слайдам //

    function classIndent(items, track){

        for (let j = 0; j < items.length; j++){
            
            if(settings.endlessSlider){ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - 1); }
            else{ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        
        }
        
        switch(settings.endlessSlider){

            case true:  slider.querySelector(sliderClassName + "-track").childNodes[1].classList.add("active");
                        track.style.transform = "translateX(-"+ (slider.querySelector(sliderClassName + "-track > div").clientWidth) +"px)";
                        break;
            case false: slider.querySelector(sliderClassName + "-track").firstChild.classList.add("active");
                        break;

        }
        
    }

    // Функция построения стрелок //

    function buildButtons(container){

        for (let _ of ['a_left', 'a_right']) {

            let el = document.createElement("button");
            el.classList.add("a-bar"); el.id = _;
            _ == "a_left" ? container.prepend(el) : container.append(el);

        }

    }

    // Функция построения дотс-бара //

    function buildDotsBar(container, dotsBar, items){

        dotsBar.classList = "dots-bar"; container.append(dotsBar);

        // Генератор точек //

        return new function() {

            let dotsBarContainer = slider.querySelector(sliderClassName + " .dots-bar"),
                countItems = settings.endlessSlider == true ? items.length - 2 : items.length;

            for (let i = 0; i < countItems; i++){  
        
                let dot = document.createElement("div");
            
                dot.classList = "dot"; dot.setAttribute("indexItem", i);
                dot.style.transition = timeAnim + "ms " + settings.transition;

                dotsBarContainer.append(dot);
        
            }

        }

    }

    function buildPM(props, arrayMS){

        // secondBlock это <slider_name>-thumb-block .aka containers[0]
        // sliderThumbCont это <slider_name>-thumb-container .aka containers[1]
        // sliderThumb это <slider_name>-thumb .aka containers[2]
        // MS - Main Slides; MSFS - Main Slides Fonts Size; iMSFSS - index of Main Slides Fonts Size Set

        let containers = [], 
            classes = [className + "-thumb-block", className + "-thumb-container", className + "-thumb"];
        var MSFsize = [], 
            MSFSset = new Set();

        for (let elem = 0; elem < 3; elem++) containers[elem] = document.createElement("div");
        for (let i = 0; i < 3; i++) containers[i].className = classes[i];
        for (let _ of arrayMS) containers[2].append(_.cloneNode(true));
        
        slider.append(containers[1]);
        containers[1].append(containers[2]);

        // Создаём стили эскизов для масштабирование шрифта/картинок //

        let thumbnailDiv = slider.querySelectorAll(sliderClassName + "-thumb > div"),
            countDivs = thumbnailDiv.length;

        for (let slideIndex = 0; slideIndex < countDivs; slideIndex++){

            thumbnailDiv[slideIndex].classList.add("slide-thumb");

            var thumb = slider.querySelectorAll(sliderClassName + " .slide-thumb")[slideIndex],
                slide = slider.querySelectorAll(sliderClassName + " .slide")[slideIndex];
                k = parseFloat(getComputedStyle(thumb, true).height)/parseFloat(getComputedStyle(slide, true).height) - 0.05;
                sizeText = parseFloat(window.getComputedStyle(thumb, null).getPropertyValue('font-size'));

            if (thumb.style.fontSize) thumb.style.fontSize = null;  // Если в атрибуте есть свойство, имеющее значение font-size,
                                                                    // то он убирает для корректной работы

            MSFsize[slideIndex] = (sizeText * k) * 0.8; // Из px в pt

            thumb.classList.add(`fontThumb-${Math.round((sizeText * k) * 0.8)}pt`); // Добавляем класс к эскизу
            
        }

        if (document.querySelectorAll("head > style").length === 0){ // Если нет атрибута style в теле head, то добавляем

            document.querySelector("head").append(document.createElement("style"));

        } 

        for (let j = 0; j < MSFsize.length; j++) MSFSset.add(MSFsize[j]);
        for (let size of MSFSset){ props.append(`.fontThumb-${Math.round(size)}pt{\nfont-size: ${Math.ceil(size)}pt;\n}\n`); }

        let imgThumb = `.thumb-active::after{\nposition: absolute;\ncontent: "";\nopacity: 0.3;\nwidth: inherit;\nheight: inherit;\nbackground-color: white;\nborder-radius: inherit;\n}\n`;
                
        props.append(imgThumb);

        let thumbContainer = slider.querySelector(sliderClassName + "-thumb-container"),
            thumbSlides = thumbContainer.childNodes;

        for (let _ of thumbSlides){ 
            for (let tSlide of _.childNodes){ if(tSlide.nodeName == "IMG"){ tSlide.classList.add("img-slide"); } }
        }

        slider.append(containers[0]);
        containers[0].append(thumbContainer);

        slider.querySelector(sliderClassName + "-thumb").firstChild.classList.remove("active");

        let mainSlide = slider.querySelector(sliderClassName + "-thumb").firstChild;
        mainSlide.classList.add('thumb-active');

    }

    // Подгонка картинок под нужный размер //

    function imgFix(){

        let allSlides = Array.from(slider.querySelector(sliderClassName + "-track").childNodes);

        for (let _ of allSlides){
            for (let aSlide of _.childNodes){ if(aSlide.nodeName == "IMG"){ aSlide.classList.add("img-slide"); } }
        }

    }

    // Разделение галереи и предпросмотра эскизов на блоки //

    var imageProp = `.img-slide{\nwidth: inherit;\nheight: inherit;\npointer-events: none;\nborder-radius: inherit;\nposition: absolute;\n}\n
                    ._objects{\nz-index:2;}\n`,
        SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута

    SSProperties.append(imageProp);

    function firstBlockCreate(){

        let sliderBlock = Array.from(document.querySelectorAll(sliderClassName)[0].childNodes),
            firstBlock = document.createElement("div");

        firstBlock.className = className + "-block";

        slider.append(firstBlock);

        for (let i = 0; i < sliderBlock.length; i++) firstBlock.append(sliderBlock[i]);

    }

    function secondBlockCreate(){

        let arrTrack = Array.from(slider.querySelectorAll(sliderClassName + "-track")[0].childNodes);

        mainItems = settings.endlessSlider ? arrTrack.slice(1, arrTrack - 1) : arrTrack;

    }

    function elemBlocks(array){

        imgFix(); // Подгоняем картинки под нужный размер //
        firstBlockCreate();  // Создаём первый блок //
        secondBlockCreate(); // Создаём второй блок //

        switch(settings.presentationMode){ // Постройка трека с эскизами //

            case true:  buildPM(SSProperties, array); 
                        break;
            case false: return 3;
            
        }

    }

    // Создание родительских тегов //

    var sliderContainerBuild = () =>{

        let sliderWindow = document.createElement('div'),
            track = slider.querySelector(sliderClassName + "-track");

        sliderWindow.classList.add(className + "-container")
        track.before(sliderWindow); sliderWindow.append(track);

    }

    // Настройка, отвечающая за безграничный скролл слайдера //

    var endlessSlider = () => {

        let track = slider.querySelector(sliderClassName + "-track"),
            items = track.childNodes;

        switch(settings.endlessSlider){ 

            case true:  track.prepend(items[items.length - 1].cloneNode(true)); 
                        track.append(items[1].cloneNode(true));
                        break;
            case false: return 0;

        }

    }

    // Применение настроек стрелочек //

    var arrows = () => {

        switch(settings.arrows){ 

            case true: buildButtons(slider); break;
            case false: return 1;
        
        }

    }

    // Подготовка индикации слайдера //

    var dots = () =>{

        let dotsBar = document.createElement("div"),
            track = slider.querySelector(sliderClassName + "-track"),
            items = track.childNodes;

        switch(settings.dots){

            case true:  buildDotsBar(slider, dotsBar, items);
                        slider.querySelector(sliderClassName + " .dots-bar").firstChild.classList.add(settings.dotsEffect);
                        break;
            case false: return 2;

        }

    }

    // ================== //
    // Постройка карусели //
    // ================== //

    function buildCarousel(){

        slideBuild();

        // Временные переменные, созданные для удобства //

        let track = slider.querySelector(sliderClassName + "-track"),
            items = track.childNodes,
            allSlides = Array.from(slider.querySelector(sliderClassName + "-track").childNodes),
            mainSlides = allSlides;

        sliderContainerBuild();
        endlessSlider();
        arrows();
        dots();
        classIndent(items, track);
        elemBlocks(mainSlides);

        // Возврат переменной, в которой находится трек слайдера //

        return track;

    }

    // Вызов функции и объявление переменной, отвечающей за трек слайдера //

    const sliderTrack = buildCarousel();
    const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

    // ========== //
    // Переменные //
    // ========== //

    var position = settings.endlessSlider ? -(slider.querySelector(sliderClassName +"-track .slide").clientWidth) : 0;
    var indexItem = 0,
        mainItems = Array.from(slider.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide"));
        stpTemp = 0, stp = settings.endlessSlider ? -(slider.querySelector(sliderClassName +"-track .slide").clientWidth) : 0;
        
    if (settings.dots) var dots = Array.from(slider.querySelector(sliderClassName + " .dots-bar").childNodes);
    if (settings.presentationMode) var thumbnails = slider.querySelectorAll(sliderClassName + " .slide-thumb");

    let isDelayed = false,
        targetSlide,
        currentSlide = slider.querySelector(sliderClassName + "-track .slide.active").getAttribute("indexItem"),
        slideTrack = slider.querySelector(sliderClassName + "-track");

    if (settings.endlessSlider){
        mainItems = mainItems.slice(1, Array.from(slider.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide")).length - 1);
    }

    // ============================================ //
    // Функции, отвечающая за навигацию по слайдеру //
    // ============================================ //

    // Функции автопрокрутки //

    var autoplay = 0;

    let countSlides = mainItems.length,
        APtarget = settings.autoPlayDirrection == "left" ? -1 : 1;

    function setInter(slides, mainItems, target){
        
        if (settings.autoPlaySlider) autoplay = setInterval(()=>{intervalFunc(slides, mainItems, target)}, delayAP);

    }

    function intervalFunc(slides, mainItems, target){

        if(!isDelayed) prepareToChangeSlide(slides, mainItems, target).then(() => { isDelayed = false; })

    } 

    // Проверка настроек слайдера //

    if (!settings.arrows && !settings.autoPlaySlider) alert("Please turn on either autoplay or arrows");
    else { if (delayAP < timeAnim) alert("Please change the value of autoPlayDelay so that it is greater than speedAnimation"); }

    // Проверка и обновление значения позиции слайд-трека по оси Х //

    function slideTrackPosUpdate(){

        stpTemp = new WebKitCSSMatrix(window.getComputedStyle(slideTrack).transform).m41;
        stp = stpTemp;

    }

    // Функция скроллинга слайдера по стрелкам //

    function arrowScrollSlide(target, APtarget){

        let countSlides = mainItems.length;

        prepareToChangeSlide(countSlides, mainItems, target).then(() => { 

            isDelayed = false;
            setInter(countSlides, mainItems, APtarget);

        });

    }

    // Функция подготовки к смене слайда //

    function prepareToChangeSlide(countSlides, items, target){

        return new Promise((resolve, reject) => {

            let firstCondition = (indexItem + target < countSlides && indexItem + target >= 0) && !settings.endlessSlider,
                secondConfition = settings.endlessSlider;

            if (firstCondition || secondConfition){ 

                isDelayed = true;

                changeSlide(countSlides, items, target); 
                setTimeout(() => { 

                    if(!isDelayed) resolve();
                    else reject(); 

                }, timeAnim);

            }

        });

    }

    // Функция смены слайда //

    function changeSlide(countSlides, items, target){

        const slideWidth = items[0].clientWidth;
        let i = slider.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации
        
        items[indexItem].classList.remove("active");

        scrollingSlide(countSlides, items, slideWidth, target).then(() => { slideTrackPosUpdate(); isDelayed = false; });
        indicationAnim(dots, thumbnails, i);

    }

    // Функция, анимирующая смену слайда, ставящая пределы смен слайдов при необходимости //

    function scrollingSlide(countSlides, items, width, target){

        return new Promise((resolve, reject) => {

            sliderTrack.style.transition = `${timeAnim}ms ${settings.transition}`;

            indexItem += target;
            currentSlide = indexItem;

            let indexTarget = settings.endlessSlider ? indexItem + 1 : indexItem,
                firstCondition = (indexTarget == countSlides + 1 && settings.endlessSlider),
                secondCondition = (indexTarget == 0 && settings.endlessSlider);

            sliderTrack.style.transform = `translateX(-${ ((width) * indexTarget) }px)`;

            setTimeout((() => {

                sliderTrack.style.transition = null;
                    
                if (target == 1 && firstCondition) {indexItem = 0; indexTarget = 1; currentSlide = indexTarget - 1;}
                else if (target == -1 && secondCondition) {indexItem = countSlides - 1; indexTarget = countSlides; currentSlide = indexTarget - 1;}

                sliderTrack.style.transform = `translateX(-${ ((width) * indexTarget) }px)`;
                resolve();
            
            }), timeAnim);

            let _ = (cond, limit, index) => {
                if (cond) items[limit].classList.add("active");
                else items[index].classList.add("active");
            }

            if (target == 1) _(firstCondition, 0, indexItem);
            else _(secondCondition, countSlides - 1, indexItem);

        })

    }

    // Анимация индикации слайдера //

    function indicationAnim(dots, thumbnails, index){

        let _ = (object, _class, i) => {
            object[i].classList.remove(_class);
            object[slider.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add(_class);
        }

        if(settings.dots)  _(dots, settings.dotsEffect, index);

        if(settings.presentationMode){

            let TTlenght = slider.querySelector(sliderClassName + "-thumb").childNodes.length, // TT - Thumb track
                condition = (settings.presentationMode && TTlenght >= 3); 
            
            if (condition) _(thumbnails, 'thumb-active', index); 

        }

    }

    // =================== //
    // Навигация по точкам //
    // =================== //

    var ws = window.innerWidth;
    let dotsBar = slider.querySelector(sliderClassName + " .dots-bar").childNodes;

    // Функция переключение слайдов для точек навигации //

    function target(targetSlide, width){

        return new Promise((resolve, reject) => {

            clearInterval(autoplay);

            let targetIndex = !settings.endlessSlider ? targetSlide : targetSlide + 1;

            sliderTrack.style.transition = timeAnim + "ms " + settings.transition;
            sliderTrack.style.transform = `translateX(-${ ((width) * targetIndex) }px)`;

            setTimeout((() => { 

                sliderTrack.style.transition = null; 

                setInter(countSlides, mainItems, APtarget);
                resolve();

            }), timeAnim);

        });

    }

    // Переключение активного слайда //

    function changeActiveSlide(current, target) { for (let i of arguments) mainItems[i].classList.toggle("active"); }

    // Скроллинг слайдов //

    let isTouchedPM = false, isDelayedPM = false, // Булеаны для режима презентации
        isTouched = false; // Булеан для свайпов

    function swipeSlide(){

        let sc = slideTrack.parentElement, sp = 0, scw = sc.clientWidth, moving, move,
            countSlides = mainItems.length, sw = slideTrack.firstChild.clientWidth,
            condition = settings.endlessSlider ? countSlides : countSlides - 1,
            ml = sw * condition;

        slideTrack.style.transform = `translateX(${position}px)`;

        let booleanEdit = (t, d) => {

            isTouched = t; isDelayed = d;

        }
        function overscrollAnim(){

            booleanEdit(false, true);

            slideTrack.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
            slideTrack.style.transform = `translateX(${stp}px)`;

            setTimeout((() => {
                
                slideTrack.style.transition = "none";

                isDelayed = false;

                setInter(countSlides, mainItems, APtarget);

            }), timeAnim/2);

        }
        var onDown = (event) => {

            clearInterval(autoplay);

            if (!isDelayed){

                sp = (event.pageX - ((ws - scw)/2));
                isTouched = true;

            }

        };
        var slide = () => {

            if (move < -150 || move > 150){

                booleanEdit(false, true);

                var target = move < -150 ? 1 : -1;
                
                prepareToChangeSlide(countSlides, mainItems, target).then(() => { 

                    isDelayed = false; 

                    setInter(countSlides, mainItems, APtarget);

                });

            }

        }
        var onMove = throttle((event) => {

            moving = stp + ((event.pageX - ((ws - scw)/2)) - sp);
            move = (event.pageX - ((ws - scw)/2)) - sp;

            if(isTouched && !isDelayed){

                if(settings.endlessSlider){ 
                    slideTrack.style.transform = `translateX(${moving}px)`; slide(); 
                }
                else {

                    if (moving > 0) slideTrack.style.transform = `translateX(${logAnimGraphic(moving, z)}px)`;
                    else if (moving < -1*ml - 23) slideTrack.style.transform = `translateX(${-1 * ml - (logAnimGraphic(Math.abs((ml) + (moving)), z))}px)`;
                    else{ slideTrack.style.transform = `translateX(${moving}px)`; slide(); }

                }

            }

            stpTemp = new WebKitCSSMatrix(window.getComputedStyle(slideTrack).transform).m41;
            
        }, 1/144 * 1000);
        var onUp = () => {

            if (isTouched){

                overscrollAnim();
                isTouched = false;

            }

        }

        return [sc, slideTrack, onDown, onMove, onUp, overscrollAnim, booleanEdit, "swipe"];

    }

    // Режим презентации //

    function presentationMode(){
        
        // tt - thumb track; sw - slide width; sm - slide margin; ml - moving limit; tcw - thumb container width
        // sp - start position; mpx - mouse position x; ttp - thumb track position on X

        let tt = slider.querySelector(sliderClassName + "-thumb"), sp = 0, ttp = 0, mpx = 0, tcw = tt.parentElement.clientWidth, ws = window.innerWidth;
            ml = -(((2 * parseInt(getComputedStyle(tt.firstChild, true).marginLeft)) + tt.firstChild.clientWidth) * ((tt.childNodes).length - 3));

        tt.style.transform = `translateX(0px)`

        ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        let booleanEdit = (t, d) => {
            isTouchedPM = t; isDelayedPM = d;
        }

        function overscrollAnim(){

            booleanEdit(false, true);

            tt.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
            
            let condition = ttpTemp > 0 ? 0 : ttpTemp < ml ? ml : ttpTemp;
            let limiter = (returnTo) => {

                tt.style.transform = `translateX(${returnTo}px)`;
                ttp = returnTo; ttpTemp = returnTo;

            }

            limiter(condition);
            setTimeout((() => {

                tt.style.transition = "none";
                booleanEdit(isTouchedPM, false);

            }), timeAnim/2);

        }
        
        var pd = (event) => {

            ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

            booleanEdit(true, isDelayedPM);

            sp = (event.pageX - ((ws - tcw)/2)); // стартовая позиция мышки по оси X относительно контейнера с эскизами

        }

        var pm = throttle((event) => {

            event.preventDefault();

            if(isTouchedPM && !isDelayedPM) {

                mpx = event.pageX - ((ws - tcw)/2); // позиция мышки по оси X относительно контейнера с эскизами

                let moving = ttp + (mpx - sp);

                if (logAnimGraphic(moving, z) >= 23) tt.style.transform = `translateX(${logAnimGraphic(moving, z)}px)`;
                else if ((moving) < 0 && -1 * (moving) + ml >= 23) tt.style.transform = `translateX(${ml - (logAnimGraphic(Math.abs((-1 * ml) + (moving)), z))}px)`;
                else tt.style.transform = `translateX(${moving}px)`;

            }

            ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        }, 1/144 * 1000)

        var pu = () => { 

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

        if (settings.presentationMode && slider.querySelector(sliderClassName + "-thumb").childNodes.length >= 3) var argsPM = presentationMode();

    } catch(e) { alert(PMerror + e); }

    var argsS = swipeSlide();

    // Эвенты для стрелок //

    function arrowsEvents(object, callback, APtarget, toggle){

        for (let arrow of object){
            
            arrow.onclick = !toggle ? null : throttle(function(){ 

                let target = this.id == 'a_left' ? -1 : 1;

                if(!isDelayed) {

                    callback(target, APtarget);
                    clearInterval(autoplay);

                }

            } , timeAnim);

        }
        
    }

    // Эвенты для точек навигации //

    function dotsEventsCreate(toggle){

        function actionDots(obj) {

            if (!isDelayed){
                
                isDelayed = true;

                targetSlide = parseInt(obj.getAttribute("indexItem"));

                changeActiveSlide(currentSlide, targetSlide);
                target(targetSlide, mainItems[0].clientWidth).then(() => {slideTrackPosUpdate();});
                indicationAnim(dotsBar, thumbnails, currentSlide);

                indexItem = currentSlide = targetSlide;

                setTimeout(() => {isDelayed = false}, timeAnim);

            }
            
        }

        for (var i = 0; i < dotsBar.length; i++) {

            switch(toggle) {
                case true:  dotsBar[i].addEventListener("click", function(){ return actionDots(this) });
                            break;
                case false: dotsBar[i].removeEventListener("click", function(){ return actionDots(this) });
                            break;
            }

        }

    }

    // Универсальная функция для создания эвентов для свайпов //

    function pointerEvents(object1, object2, onDown, onMove, onUp, callback1, callback2, typeObj, toggle){

        let condition;

        function afterEnter(object2, toggle){

            object2.onpointerdown = !toggle ? null : (event) => { onDown(event) } 
            object2.onpointermove = !toggle ? null : (event) => { onMove(event) }
            object2.onpointerup = !toggle ? null : () => { onUp() }

        }

        object1.onpointerenter = !toggle ? null :  () => afterEnter(object2, toggle);
        object1.onpointerleave = !toggle ? null : () => {

            condition = typeObj == 'pm' ? isTouchedPM && !isDelayedPM : isTouched && !isDelayed;

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
            if (allArgs === "argsPM"){ for (let parsedArgs of argsPM) _argsPM.push(parsedArgs); }
            else{ for (let parsedArgs of argsS) _argsS.push(parsedArgs); }
        }
        for (let args of [_argsPM, _argsS]) args.push(toggle);

        window.onresize = !toggle ? null : debounce(() => { ws = window.innerWidth; }, 1/30 * 1000);

        dotsEventsCreate(toggle);
        if (settings.arrows){

            let arrows = slider.querySelectorAll(sliderClassName + " .a-bar");
            arrowsEvents(arrows, arrowScrollSlide, APtarget, toggle);

        }
        if (settings.autoPlaySlider){ 
            if (toggle) setInter(countSlides, mainItems, APtarget);
            else clearInterval(autoplay);
        }
        if (settings.presentationMode) { pointerEvents.apply(this, _argsPM); }
        if (settings.swipeScroll) { pointerEvents.apply(this, _argsS); }

        delete _argsPM, _argsS;

    }

    // Эвенты для проверки видимости вкладки //

    function eventsController(){

        var status;

        function afterload(){
            if (document.visibilityState === "hidden") {
                eventsToggle(false); status = false;
            } else {
                eventsToggle(true); status = true;
            }
        }
        window.addEventListener('load', () => afterload())
        window.removeEventListener('load', () => afterload());
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "hidden") eventsToggle(false);
            else eventsToggle(true);
        });
        window.addEventListener('focus', () => { 
            if (!status) {
                eventsToggle(true); 
                status = true;
            }
        });
        window.addEventListener('blur', () => { 
            if (!status) eventsToggle(false);
        });

    }

    eventsController();

}

// ======================= //
// Вспомогательные функции //
// ======================= //

function logBase(x, y){ return Math.log(y) / Math.log(x); }
function logAnimGraphic(x, constant){ return Math.round((10*((logBase(2, x - constant) ** 3)))** 0.5); }
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