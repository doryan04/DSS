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

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined) settings = defaultSettings; 
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] == (undefined || null)) settings[defaultParameter] = defaultSettings[defaultParameter];

        }

    }

    const timeAnim = settings.speedAnimation,
          delayAP = settings.autoPlayDelay;

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

            let _ = slide.childNodes,
                div = document.createElement("div");
                div.classList.add("_objects"),
                checkIMG = false;
                index = 0;

            for (let j of _) { if (j.nodeName == "IMG") checkIMG = true; }

            if(checkIMG) { 

                while(_.length != 1) {

                    _[index].nodeName == "IMG" ? index++ : div.append(_[index]);

                }

            } else { while(_.length != 0) div.append(_[index]); }

            slide.append(div);

        }


        div.className = className + "-track";

        for (let i = 0; i < countDivs; i++) div.append(slides[i]);

        document.querySelectorAll(sliderClassName)[0].append(div);

    };

    // Функция присвайвания ID слайдам //

    function classIndent(items, track){

        for (let j = 0; j < items.length; j++){
            
            if(settings.endlessSlider){ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - 1); }
            else{ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        
        }
        
        switch(settings.endlessSlider){

            case true:  document.querySelector(sliderClassName + "-track").childNodes[1].classList.add("active");
                        track.style.transform = "translateX(-"+ (document.querySelectorAll(sliderClassName + "-track > div")[0].clientWidth) +"px)";
                        break;

            case false: document.querySelector(sliderClassName + "-track").firstChild.classList.add("active");
                        break;

        }
        
    }
    
    // Функция построения стрелок //
    
    function buildButtons(container){

        let obj = ['a_left', 'a_right'];

        for (let _ of obj) {

            let el = document.createElement("button");
            el.classList.add("a-bar"); el.id = _;
            _ == "a_left" ? container.prepend(el) : container.append(el);

        }
    
    }

    // Функция построения дотс-бара //

    function buildDotsBar(container, dotsBar, items){

        dotsBar.classList = "dots-bar"; container.append(dotsBar);

        // Генератор точек //

        function dotsGenerator(){

            let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar"),
                countItems = settings.endlessSlider == true ? items.length - 2 : items.length;

            for (let i = 0; i < countItems; i++){
        
                let dot = document.createElement("div");
        
                dot.classList = "dot"; dot.setAttribute("indexItem", i);
                dot.style.transition = timeAnim + "ms " + settings.transition;

                dotsBarContainer.append(dot);
        
            }

        }

        dotsGenerator();

    }

    function buildPM(props, arrayMS){

        let secondBlock = document.createElement("div"),
            sliderThumbCont = document.createElement("div"),
            sliderThumb = document.createElement("div");

        secondBlock.className = className + "-thumb-block";
        sliderThumbCont.className = className + "-thumb-container";
        sliderThumb.className = className + "-thumb";
            
        // MS - Main Slides; MSFS - Main Slides Fonts Size; iMSFSS - index of Main Slides Fonts Size Set
        
        var MSFsize = [],
            MSFSset = [],
            iMSFSS = 0;

        for (let _ of arrayMS) sliderThumb.append(_.cloneNode(true));
        
        document.querySelectorAll(sliderClassName)[0].append(sliderThumbCont);
        sliderThumbCont.append(sliderThumb);

        // ========================================================= //
        // Создаём стили эскизов для масштабирование шрифта/картинок //
        // ========================================================= //

        let thumbnailDiv = document.querySelectorAll(sliderClassName + "-thumb > div"),
            countDivs = thumbnailDiv.length;

        for (let slideIndex = 0; slideIndex < countDivs; slideIndex++){

            thumbnailDiv[slideIndex].classList.add("slide-thumb");

            var thumb = document.querySelectorAll(sliderClassName + " .slide-thumb")[slideIndex],
                slide = document.querySelectorAll(sliderClassName + " .slide")[slideIndex];
                k = parseFloat(getComputedStyle(thumb, true).height)/parseFloat(getComputedStyle(slide, true).height) - 0.05;
                sizeText = parseFloat(window.getComputedStyle(thumb, null).getPropertyValue('font-size'));

            if (thumb.style.fontSize) thumb.style.fontSize = null; // Если в атрибуте есть свойство, имеющее значение font-size,
                                                                   // то он убирает для корректной работы

            MSFsize[slideIndex] = (sizeText * k) * 0.8; // Из px в pt

            thumb.classList.add(`fontThumb-${Math.round(MSFsize[slideIndex])}pt`); // Добавляем класс к эскизу
        }

        if (document.querySelectorAll("head > style").length === 0){ // Если нет атрибута style в теле head, то добавляем

            document.querySelectorAll("head")[0].append(document.createElement("style"));

        } 

        for (let j = 0; j < MSFsize.length; j++){ // Прогоняемся циклом для ликвидации дубликатов элементов

            if (MSFSset.includes(MSFsize[j]) != true){

                MSFSset[iMSFSS] = MSFsize[j];
                iMSFSS++;

            }

        }
        
        for (let size of MSFSset){ // Создаём стили

            props.append(`\t\t\t.fontThumb-${Math.round(size)}pt{\n\t\t\t\tfont-size: ${Math.ceil(size)}pt;\n\t\t\t}\n`);

        }

        let imgThumb = `.thumb-active::after{\nposition: absolute;\ncontent: "";\nopacity: 0.3;\nwidth: inherit;\nheight: inherit;\nbackground-color: white;\nborder-radius: inherit;\n}\n`;
                
        props.append(imgThumb);

        let thumbSlides = document.querySelectorAll(".slide-thumb"),
            thumbBlock = document.querySelectorAll("div" + sliderClassName + "-thumb-container")[0];

        for (let _ of thumbSlides){ 

            for (let tSlide of _.childNodes){ if(tSlide.nodeName == "IMG"){ tSlide.classList.add("img-slide"); } }

        }

        document.querySelectorAll(sliderClassName)[0].append(secondBlock);
        secondBlock.append(thumbBlock);

        (Array.from(document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes)[0]).classList.remove("active");

        let mainSlide = document.querySelectorAll(sliderClassName + "-thumb-container .slide-thumb")[0];
        mainSlide.classList.add('thumb-active');

    }

    // Подгонка картинок под нужный размер //

    function imgFix(){

        let allSlides = Array.from(document.querySelector(sliderClassName + "-track").childNodes);

        for (let _ of allSlides){

            for (let aSlide of _.childNodes){ if(aSlide.nodeName == "IMG"){ aSlide.classList.add("img-slide"); } }

        }

    }

    // Разделение галереи и предпросмотра эскизов на блоки //

    function elemBlocks(array){

        let imageProp = `.img-slide{\nwidth: inherit;\nheight: inherit;\npointer-events: none;\nborder-radius: inherit;\nposition: absolute;\n}\n
                         ._objects{\nz-index:2;}\n`,
            SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута

        SSProperties.append(imageProp);

        // ==================================== //
        // Подгоняем картинки под нужный размер //
        // ==================================== //

        imgFix();

        // =================== //
        // Создаём первый блок //
        // =================== //

        let sliderBlock = Array.from(document.querySelectorAll(sliderClassName)[0].childNodes),
            SBlenght = sliderBlock.length;
        
        let firstBlock = document.createElement("div");
        firstBlock.className = className + "-block";

        document.querySelector(sliderClassName).append(firstBlock);

        for (let i = 0; i < SBlenght; i++) firstBlock.append(sliderBlock[i]);

        // =================== //
        // Создаём второй блок //
        // =================== //

        let arrTrack = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes);

        mainItems = settings.endlessSlider == true ? arrTrack.slice(1, arrTrack - 1) : arrTrack;

        // Постройка трека с эскизами //

        switch(settings.presentationMode){

            case true: buildPM(SSProperties, array); 
                       break;

            default: break;
            
        }

    }

    function buildCarousel(){

        slideBuild();

        // Временные переменные, созданные для удобства //
    
        let container = document.querySelectorAll(sliderClassName)[0],
            dotsBar = document.createElement("div"),
            track = document.querySelectorAll(sliderClassName + "-track")[0],
            items = track.childNodes;

        // Создание родительских тегов //

        let sliderWindow = document.createElement('div');
    
        sliderWindow.classList.add(className + "-container")
        track.before(sliderWindow); sliderWindow.append(track);

        // Настройка, отвечающая за безграничный скролл слайдера //
    
        switch(settings.endlessSlider){ 
    
            case true: track.prepend(items[items.length - 1].cloneNode(true)); 
                       track.append(items[1].cloneNode(true));
                       break;
    
            case false: break;
    
        }
    
        // Подготовка индикации слайдера //
    
        switch(settings.dots){
    
            case true:
            
                buildDotsBar(container, dotsBar, items);

                document.querySelector(sliderClassName + " .dots-bar").firstChild.classList.add(settings.dotsEffect);
    
                break;
    
            case false: break;
    
        }

        let allSlides = Array.from(document.querySelector(sliderClassName + "-track").childNodes),
            mainSlides = settings.endlessSlider == true ? allSlides.slice(1, allSlides.length - 1) : allSlides;

        // Применение настроек стрелочек //

        switch(settings.arrows){ 
    
            case true: buildButtons(container); break;
            case false: break;
        
        }

        // Вызов функции подготовки слайдов //
        
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
    var position = settings.endlessSlider ? -(document.querySelector(sliderClassName +"-track .slide").clientWidth) : 0;
    var indexItem = 0,
        mainItems = Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide"));
        stpTemp = 0, stp = settings.endlessSlider ? -(document.querySelector(sliderClassName +"-track .slide").clientWidth) : 0;
        
    if (settings.dots) var dots = Array.from(document.querySelector(sliderClassName + " .dots-bar").childNodes);
    if (settings.presentationMode) var thumbnails = document.querySelectorAll(sliderClassName + " .slide-thumb");

    let isDelayed = false,
        targetSlide,
        currentSlide = document.querySelector(sliderClassName + "-track .slide.active").getAttribute("indexItem"),
        slideTrack = document.querySelector(sliderClassName + "-track");

    if (settings.endlessSlider){
        mainItems = mainItems.slice(1, Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide")).length - 1);
    }

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let countSlides = mainItems.length;

        let APtarget = settings.autoPlayDirrection == "left" ? -1 : 1;

        // Скролл в опр. направление //

        var swipeSlide = function(target) {

            if (settings.autoPlaySlider) clearInterval(autoPlayInterval);  // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
            if (!isDelayed){

                slideScroll(countSlides, mainItems, target).then(() => { isDelayed = false; });
            
                if (settings.autoPlaySlider) autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); // Если включена автопрокрутка, то интервал запускается

            }

        }

        // Если стрелочки включены, то они видимы и рабочие //

        if (settings.arrows){

            // Переменные, нужные для стрелочек //

            let arrows = document.querySelectorAll(sliderClassName + " .a-bar");
            
            // Автопрокрутка слайдера, когда стрелочки включены //

            if(settings.autoPlaySlider){

                // Функция автопрокрутки при включённых стрелочках //

                var autoPlayWithArrows = () => { 
                    
                    if(!isDelayed) {

                        slideScroll(countSlides, mainItems, APtarget).then(() => { isDelayed = false; }); 

                    }

                }

                // Зацикливание функции автопрокрутки /
    
                var autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); 

            }
            
            // События на кнопки //

            for (let arrow of arrows){
            
                arrow.onclick = throttle(function(){ 

                    let target = this.id == 'a_left' ? -1 : 1;

                    swipeSlide(target);

                } , timeAnim);

            }

        }

        // Зацикливание функции автопрокрутки, если стрелочки не включены //

        if (settings.autoPlaySlider && !settings.arrows){

            setInterval((() => {

                slideScroll(countSlides, items, APtarget).then(() => { isDelayed = false; }); 
                ActiveSlide(items, countSlides, APtarget);

            }), delayAP);

        }
        
    }

    if (!settings.arrows && !settings.autoPlaySlider){

        alert("Please turn on either autoplay or arrows");

    } else { 
    
        if (delayAP < timeAnim) alert("Please change the value of autoPlayDelay so that it is greater than speedAnimation");
        else sliderNavigation();

    }

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideTrackPosUpdate(){

        stpTemp = new WebKitCSSMatrix(window.getComputedStyle(slideTrack).transform).m41;
        stp = stpTemp;

    }

    var slideScroll = function(countSlides, items, target){

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


    // ==================== //
    // Функция смены слайда //
    // ==================== //

    var changeSlide = function (countSlides, items, target){

        const slideWidth = items[0].clientWidth;

        let i = document.querySelectorAll(sliderClassName + "-track div.slide.active")[0].getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации
        
        items[indexItem].classList.remove("active");
    
        scrollingSlide(countSlides, items, slideWidth, target).then(() => {

        slideTrackPosUpdate();
            isDelayed = false;

        });
        decorationAnim(dots, thumbnails, i);

    }

    // ============= //
    // Пролистование //
    // ============= //

    function scrollingSlide(countSlides, items, width, target){

        return new Promise((resolve, reject) => {

            sliderTrack.style.transition = `${timeAnim}ms ${settings.transition}`;

            indexItem += target;
            currentSlide = indexItem;

            let indexTarget = settings.endlessSlider ? indexItem + 1 : indexItem;

            let firstCondition = (indexTarget == countSlides + 1 && settings.endlessSlider),
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

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function decorationAnim(dots, thumbnails, index){

        let _ = (object, _class, i) => {
            object[i].classList.remove(_class);
            object[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add(_class);
        }

        switch (settings.dots){

            case true:  _(dots, settings.dotsEffect, index);
                        break;

            case false: break;

        }

        switch (settings.presentationMode){

            case true:  // TT - Thumb track
                        let TTlenght = document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length,
                            condition = (settings.presentationMode && TTlenght >= 3); 
                        if (condition) _(thumbnails, 'thumb-active', index); 
                        break;

            case false: break;

        }

    }

    function pointerEvents(object1, object2, onDown, onMove, onUp, temporyValue, callback1, callback2, hasTemp){

        object1.onpointerenter = () => {

            object2.onpointerdown = (event) => onDown(event);
            object2.onpointermove = (event) => onMove(event);
            object2.onpointerup = () => onUp();

        }

        object1.onpointerleave = () => {

            if(isTouched && !Delayed){

                if(hasTemp) ttp = temporyValue;

                callback1();
                callback2(false, false);

            }

        }

    }

    // ===================== //
    // experimental function //
    // ===================== //

    function swipeSlide(){

        let sc = slideTrack.parentElement, sp = 0, touched = false,
            ws = window.innerWidth, scw = sc.clientWidth, moving, move,
            countSlides = mainItems.length, sw = slideTrack.firstChild.clientWidth,
            condition = settings.endlessSlider ? countSlides : countSlides - 1,
            ml = sw * condition;

        slideTrack.style.transform = `translateX(${position}px)`;

        window.onresize = () => ws = window.innerWidth;

        let booleanEdit = (t, d) => {
            touched = t;
            isDelayed = d;

        }

        function overscrollAnim(){

            booleanEdit(false, true);

            slideTrack.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
            slideTrack.style.transform = `translateX(${stp}px)`;

            setTimeout((() => {

                slideTrack.style.transition = "none";
                isDelayed = false;

            }), timeAnim/2);

        }
        var onDown = (event) => {

            if (!isDelayed){

                sp = (event.pageX - ((ws - scw)/2));
                touched = true;

            }

        };

        var slide = () => {

            if (move < -150 || move > 150){

                booleanEdit(false, true);

                var target = move < -150 ? 1 : -1;
                
                slideScroll(countSlides, mainItems, target).then(() => { isDelayed = false; } );

            }

        }

        var onMove = throttle((event) => {

            moving = stp + ((event.pageX - ((ws - scw)/2)) - sp);
            move = (event.pageX - ((ws - scw)/2)) - sp;

            if(touched && !isDelayed){

                if(settings.endlessSlider){ slideTrack.style.transform = `translateX(${moving}px)`; slide(); }

                else {

                    if (moving > 0) slideTrack.style.transform = `translateX(${logAnimGraphic(moving, z)}px)`;
                    else if (moving < -1*ml - 23) slideTrack.style.transform = `translateX(${-1 * ml - (logAnimGraphic(Math.abs((ml) + (moving)), z))}px)`;
                    else{ slideTrack.style.transform = `translateX(${moving}px)`; slide(); }
    
                }
                
            }

            stpTemp = new WebKitCSSMatrix(window.getComputedStyle(slideTrack).transform).m41;
            
        }, 1/60 * 1000);

        var onUp = () => {

            if (touched){

                overscrollAnim();
                touched = false;

            }

        }

        pointerEvents(sc, slideTrack, onDown, onMove, onUp, null, overscrollAnim, booleanEdit, false);

    }

    switch (settings.swipeScroll){

        case true:  swipeSlide();
                    break;

        case false: break;
        
    }

    // ================= //
    // Режим презентации //
    // ================= //

    function presentationMode(){
        
        // tt - thumb track; sw - slide width; sm - slide margin; ml - moving limit; tcw - thumb container width
        // sp - start position; mpx - mouse position x; ttp - thumb track position on X

        let tt = document.querySelector(sliderClassName + "-thumb"), 
            sp = 0, ttp = 0, mpx = 0, tcw = tt.parentElement.clientWidth, ws = window.innerWidth;
            ml = -(((2 * parseInt(getComputedStyle(tt.firstChild, true).marginLeft)) + tt.firstChild.clientWidth) * ((tt.childNodes).length - 3));
            isTouched = false, Delayed = false;

        tt.style.transform = `translateX(0px)`

        ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        let booleanEdit = (t, d) => {

            isTouched = t;
            Delayed = d;

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
                booleanEdit(isTouched, false);

            }), timeAnim/2);

        }

        window.onresize = () => ws = window.innerWidth;
        
        var pd = (event) => {

            ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

            booleanEdit(true, Delayed);

            sp = (event.pageX - ((ws - tcw)/2)); // стартовая позиция мышки по оси X относительно контейнера с эскизами

        }

        var pm = throttle((event) => {

            event.preventDefault();

            if(isTouched && !Delayed) {

                mpx = event.pageX - ((ws - tcw)/2); // позиция мышки по оси X относительно контейнера с эскизами

                let moving = ttp + (mpx - sp);

                if (logAnimGraphic(moving, z) >= 23){ 

                    tt.style.transform = `translateX(${logAnimGraphic(moving, z)}px)`;

                }
                else if ((moving) < 0 && -1 * (moving) + ml >= 23){ 

                    tt.style.transform = `translateX(${ml - (logAnimGraphic(Math.abs((-1 * ml) + (moving)), z))}px)`;

                }
                else { 

                    tt.style.transform = `translateX(${moving}px)`;

                }

            }

            ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        }, 1/60 * 1000)

        var pu = () => { 

            if (ttpTemp >= 0 || ttpTemp < -1*ml) overscrollAnim(ttpTemp);

            ttp = ttpTemp;
            booleanEdit(false, Delayed);

        }

        pointerEvents(tt, tt, pd, pm, pu, ttpTemp, overscrollAnim, booleanEdit, true);

    }

    let PMerror = "Please, add slides for correctly working Presentation Mode \nCode error: "

    try{ if (settings.presentationMode && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3) presentationMode(); }
    catch(e){ alert(PMerror + e);}

    // Навигация по точкам //

    var target = function(targetSlide, width){

        return new Promise((resolve, reject) => {

            sliderTrack.style.transition = timeAnim + "ms " + settings.transition;

            let targetIndex = !settings.endlessSlider ? targetSlide : targetSlide + 1;

            sliderTrack.style.transform = `translateX(-${ ((width) * targetIndex) }px)`;

            setTimeout((() => { 
                sliderTrack.style.transition = null; 
                resolve();
            }), timeAnim);

        });

    }


    let dotsBar = document.querySelector(sliderClassName + " .dots-bar").childNodes;

    for (var i = 0; i < dotsBar.length; i++) {

        dotsBar[i].addEventListener("click", (function() {

            if (!isDelayed){
                
                isDelayed = true;

                console.log(currentSlide);

                mainItems[currentSlide].classList.remove("active");

                targetSlide = parseInt(this.getAttribute("indexItem"));

                mainItems[targetSlide].classList.add("active");

                target(targetSlide, mainItems[0].clientWidth).then(() => {
                    slideTrackPosUpdate();
                });

                decorationAnim(dotsBar, thumbnails, currentSlide);

                indexItem = currentSlide = targetSlide;

                setTimeout(() => {isDelayed = false}, timeAnim);

            }
            
        }))

    }

}