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

    }

    var className = sliderClassName.slice(1, sliderClassName.length);

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined) settings = defaultSettings; 
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] === undefined || settings[defaultParameter] === null) settings[defaultParameter] = defaultSettings[defaultParameter];

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

                    if (_[index].nodeName == "IMG") index++;
                    else div.append(_[index]);

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
    
        var slideRight = document.createElement("button"),
            slideLeft = document.createElement("button");
    
        slideRight.classList = "a-bar"; slideRight.id = "a_right";
        slideLeft.classList = "a-bar"; slideLeft.id = "a_left";

        container.append(slideRight); container.prepend(slideLeft);
    
    }

    // Функция построения дотс-бара //

    function buildDotsBar(container, dotsBar, items){

        dotsBar.classList = "dots-bar"; container.append(dotsBar);

        // Генератор точек //

        function dotsGenerator(){

            let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar"),
                countItems;

            if (settings.endlessSlider) countItems = items.length - 2;
            else countItems = items.length;

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
            sliderThumb = document.createElement("div"),
            mainThumbsSlide;
            
        // MS - Main Slides; MSFS - Main Slides Fonts Size; iMSFSS - index of Main Slides Fonts Size Set
        
        var MSlenght = arrayMS.length,
            MSFsize = [],
            MSFSset = [],
            iMSFSS = 0;

        secondBlock.className = className + "-thumb-block";
        sliderThumbCont.className = className + "-thumb-container";
        sliderThumb.className = className + "-thumb";

        for (let i = 0; i < MSlenght; i++){ 

            mainThumbsSlide = arrayMS[i].cloneNode(true);
            sliderThumb.append(mainThumbsSlide);

        }
        
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

            MSFsize[slideIndex] = (sizeText * k) * 0.75; // Из px в pt

            thumb.classList.add(`fontThumb-${Math.round((sizeText * k) * 0.75)}pt`); // Добавляем класс к эскизу
        }

        if (document.querySelectorAll("head > style").length === 0){ // Если нет атрибута style в теле head, то добавляем

            let SSBody = document.createElement("style");
            document.querySelectorAll("head")[0].append(SSBody);

        } 

        for (let j = 0; j < MSFsize.length; j++){ // Прогоняемся циклом для ликвидации дубликатов элементов

            if (MSFSset.includes(MSFsize[j]) != true){

                MSFSset[iMSFSS] = MSFsize[j];
                iMSFSS++;

            }

        }
        
        for (let l = 0; l < MSFSset.length; l++){ // Создаём стили

            props.append(`\t\t\t.fontThumb-${Math.round(MSFSset[l])}pt{\n\t\t\t\tfont-size: ${MSFSset[l]}pt;\n\t\t\t}\n`);

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

        if (settings.endlessSlider) { 
            
            let mainItemsTemp = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
            mainItems = mainItemsTemp.slice(1, mainItemsTemp.length - 1);

        } else {

            mainItems = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
            
        }

        // Постройка трека с эскизами //

        switch(settings.presentationMode){

            case true: buildPM(SSProperties, array); 
                       break;

            case false: break;
            
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
            mainSlides = [];

        switch(settings.endlessSlider){

            case true:  mainSlides = allSlides.slice(1, allSlides.length - 1);
                        break;

            case false: mainSlides = allSlides;
                        break;

        }

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

    // ========== //
    // Переменные //
    // ========== //
    
    var indexItem = 0,
        mainItems = Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide"));
        
    if (settings.dots) var dots = Array.from(document.querySelector(sliderClassName + " .dots-bar").childNodes);
    if (settings.presentationMode) var thumbnails = document.querySelectorAll(sliderClassName + " .slide-thumb");

    let isDelayed = false,
        targetSlide,
        currentSlide = document.querySelector(sliderClassName + "-track .slide.active").getAttribute("indexItem");

    if (settings.endlessSlider){
        mainItems = mainItems.slice(1, Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide")).length - 1);
    }

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let countSlides = mainItems.length;
        let APtarget = 0
        if (settings.autoPlayDirrection == "left") APtarget = -1;
        else APtarget = 1;

        // Если стрелочки включены, то они видимы и рабочие //

        if (settings.arrows){

            // Переменные, нужные для стрелочек //

            let arrows = document.querySelectorAll(sliderClassName + " .a-bar");
            
            // ================================================ //
            // Автопрокрутка слайдера, когда стрелочки включены //
            // ================================================ //

            if(settings.autoPlaySlider){

                // Функция автопрокрутки при включённых стрелочках //

                function autoPlayWithArrows(){

                    if(!isDelayed) slideScroll(countSlides, mainItems, APtarget);
    
                }

                // Зацикливание функции автопрокрутки /
    
                var autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); 

            }

            // Скролл в опр. направление //

            function swipeSlide(target){

                if (settings.autoPlaySlider) clearInterval(autoPlayInterval);  // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                if (!isDelayed){

                    slideScroll(countSlides, mainItems, target);
                    
                    if (settings.autoPlaySlider) autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); // Если включена автопрокрутка, то интервал запускается
        
                }

            }
            
            // ================= //
            // События на кнопки //
            // ================= //

            for (let arrow of arrows) arrow.onclick = throttle(function() { 

                let target = 0

                if (this.id == "a_left") target = -1;
                else target = 1;

                swipeSlide(target);

            } , timeAnim);


        }

        // ============================================================== //
        // Зацикливание функции автопрокрутки, если стрелочки не включены //
        // ============================================================== //

        if (settings.autoPlaySlider && !settings.arrows){

            setInterval((function(){

                slideScroll(countSlides, items, APtarget); 
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

    function slideScroll(countSlides, items, target){

        let firstCondition = (indexItem + target < countSlides && indexItem + target >= 0) && !settings.endlessSlider,
            secondConfition = settings.endlessSlider;

        if (firstCondition || secondConfition){ 

            isDelayed = true;
            changeSlide(countSlides, items, target); 
            setTimeout( () => { isDelayed = false; }, timeAnim);

        } 

    }

    // ==================== //
    // Функция смены слайда //
    // ==================== //

    function changeSlide(countSlides, items, target){

        const slideWidth = items[0].clientWidth;
        let i = document.querySelectorAll(sliderClassName + "-track div.slide.active")[0].getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации

        items[indexItem].classList.remove("active");
    
        scrollingSlide(countSlides, items, slideWidth, target);
        decorationAnim(dots, thumbnails, i);

    }

    // ============= //
    // Пролистование //
    // ============= //

    function scrollingSlide(countSlides, items, width, target){

        sliderTrack.style.transition = `${timeAnim}ms ${settings.transition}`;

        indexItem += target;
        currentSlide = indexItem;

        let offsetKoef;

        if (settings.endlessSlider) offsetKoef = indexItem + 1;
        else offsetKoef = indexItem;

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((function(){

            sliderTrack.style.transition = null;
            
            if (target == 1 && firstCondition) {indexItem = 0; offsetKoef = indexItem + 1; currentSlide = indexItem;}
            else if (target == -1 && secondCondition) {indexItem = countSlides - 1; offsetKoef = countSlides; currentSlide = indexItem;}

            sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        }), timeAnim);

        let firstCondition = (offsetKoef == countSlides + 1 && settings.endlessSlider),
            secondCondition = (offsetKoef == 0 && settings.endlessSlider);

        let _ = (cond, limit, index) => {
            if (cond) items[limit].classList.add("active");
            else items[index].classList.add("active");
        }

        if (target == 1) _(firstCondition, 0, indexItem);
        else _(secondCondition, countSlides - 1, indexItem);

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function decorationAnim(dots, thumbnails, index){

        // TT - Thumb track

        let TTlenght = document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length,
            condition = (settings.presentationMode && TTlenght >= 3);

        let _ = (object, _class, i) => {
            object[i].classList.remove(_class);
            object[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add(_class);
        }

        if (settings.dots) _(dots, settings.dotsEffect, index)

        try{ if (condition) _(thumbnails, 'thumb-active', index); } 
        catch (err) { alert.err(); }

    }

    // ================= //
    // Режим презентации //
    // ================= //

    function presentationMode(){

        function touchUp(track, width, margin, slides, slide){

            isDelayed = true;
            touch = false;
            isTouched = false;
    
            track.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
    
            if (track.offsetLeft >= 0) track.style.left = "0px";
            else if (track.offsetLeft < width){
                track.style.left = `${-(slides.length - 3) * (slide.clientWidth + (margin * 2))}`;
            }
    
            setTimeout((function() {
    
                track.style.transition = "none";
                isDelayed = false;
    
            }), timeAnim/2);
    
        }

        const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

        // Объекты //

        let thumbTrack = document.querySelectorAll(sliderClassName + "-thumb")[0],
            thumbContainer = document.querySelectorAll(sliderClassName + "-thumb-container")[0],
            thumbSlide = thumbTrack.firstChild,
            thumbSlides = thumbTrack.childNodes,
            marginSlide = parseInt(getComputedStyle(thumbSlide, true).marginLeft);

        let widthTrack = (-1 * (thumbSlide.clientWidth + (2 * marginSlide))) * (thumbSlides.length - 3);

        // Boolean значения //

        let touch = false,
            isTouched = false,
            isDelayed = false;

        var onMouseDown = throttle((e) => {

            touch = true;
            isTouched = true;
            
            startPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2)) - thumbTrack.offsetLeft);
            startContPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2))); 

        }, (1/144) * 1000);
        
        var onMouseMove = throttle((e) => { 

            e.preventDefault();
                
            if (touch && !isDelayed){

                let mousePosX = e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2);

                if (logAnimGraphic(mousePosX - startPosX, z) >= 23){ 

                    thumbTrack.style.left = `${logAnimGraphic(mousePosX - startPosX, z)}px`; 

                }
                else if ((mousePosX - startPosX) < 0 && -1 * (mousePosX - startPosX) + widthTrack >= 23){ 

                    thumbTrack.style.left = `${widthTrack - (logAnimGraphic(Math.abs((-1 * widthTrack) + (mousePosX - startPosX)), z))}px`; 

                }
                else { 

                    thumbTrack.style.left = `${mousePosX - startPosX}px`;

                }

            }

        }, (1/144) * 1000);

        var onMouseUp = throttle(() => {

            if(!isDelayed) touchUp(thumbTrack, widthTrack, marginSlide, thumbSlides, thumbSlide, isDelayed, touch, isTouched);

        }, (1/144) * 1000);

        thumbTrack.onpointerenter = thumbTrack.onpointerleave = function(event){

            event.preventDefault();

            let _ = document.querySelectorAll(sliderClassName + "-thumb")[0];

            if(event.type === "pointerenter" && !isDelayed) {

                _.onpointerdown = onMouseDown;
                _.onpointermove = onMouseMove;
                _.onpointerup = onMouseUp;

            }
            else if(event.type === "pointerleave" && isTouched && !isDelayed){ 

                touchUp(thumbTrack, widthTrack, marginSlide, thumbSlides, thumbSlide, isDelayed, touch, isTouched); 
            
            }
            else { 
                
                touch = false; isTouched = false; 
            
            }

        };

    }

    let PMerror = "Please, add slides for correctly working Presentation Mode \nCode error: "

    try{ if (settings.presentationMode && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3) presentationMode(); }
    catch(e){ alert(PMerror + e);}

    // Навигация по точкам //

    function target(target, width){

        sliderTrack.style.transition = timeAnim + "ms " + settings.transition;

        var offsetKoef;
        
        if (!settings.endlessSlider) offsetKoef = target;
        else offsetKoef = target + 1;

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((() => { sliderTrack.style.transition = null; }), timeAnim);

    }

    let dotsBar = document.querySelector(sliderClassName + " .dots-bar").childNodes;

    for (var i = 0; i < dotsBar.length; i++) {

        dotsBar[i].addEventListener("click", (function() {

            if (!isDelayed){
                
                isDelayed = true;

                mainItems[currentSlide].classList.remove("active");

                targetSlide = parseInt(this.getAttribute("indexItem"));

                mainItems[targetSlide].classList.add("active");

                decorationAnim(dotsBar, thumbnails, currentSlide);
                target(targetSlide, mainItems[0].clientWidth);

                indexItem = currentSlide = targetSlide;

                setTimeout(() => {isDelayed = false}, timeAnim);

            }
            
        }))

    }

}