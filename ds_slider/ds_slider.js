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
        presentationMode: false, //its a experimental function. recommended off this parameter
        speedAnimation: 400,

    }

    var className = sliderClassName.slice(1, sliderClassName.length);

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined){ settings = defaultSettings; }
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] === undefined || settings[defaultParameter] === null) { settings[defaultParameter] = defaultSettings[defaultParameter]; }

        }

    }

    var timeAnim = settings.speedAnimation,
        delayAP = settings.autoPlayDelay;

    // ======================= //
    // Вспомогательные функции //
    // ======================= //

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

    // ============================================================================================================= //
    // Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
    // ============================================================================================================= //

    function buildCarousel(){

        // Перенос слайдов в родительский тег //

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

                if(checkIMG === true) { 

                    while(_.length != 1) {

                        if (_[index].nodeName == "IMG"){index++;} 
                        else { div.append(_[index]); }

                    }

                } else { while(_.length != 0) div.append(_[index]); }

                slide.append(div);
 
            }


            div.className = className + "-track";
    
            for (let i = 0; i < countDivs; i++){

                div.append(slides[i]);
    
            }
    
            document.querySelectorAll(sliderClassName)[0].append(div);

        }; 

        slideBuild();

        // Временные переменные, созданные для удобства //

        var container = document.querySelectorAll(sliderClassName)[0],
            track = document.querySelectorAll(sliderClassName + "-track")[0];

        let items = track.childNodes;

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

        // Подготовка слайдов //
        
        function classIndent(items){

            for (let j = 0; j < items.length; j++){
                
                if(settings.endlessSlider === true){ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - 1); }
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
    
        // Подготовка стрелочек к работе //
    
        function buildButtons(){
    
            var slideRight = document.createElement("button"),
                slideLeft = document.createElement("button");
        
            slideRight.classList = "a-bar"; slideRight.id = "a_right";
            slideLeft.classList = "a-bar"; slideLeft.id = "a_left";
    
            container.append(slideRight); container.prepend(slideLeft);
        
        }
    
        // Подготовка индикации слайдера //
    
        switch(settings.dots){
    
            case true:
    
                function buildDotsBar(){
    
                    let dotsBar = document.createElement("div");
            
                    dotsBar.classList = "dots-bar"; container.append(dotsBar);
            
                    // Генератор точек //
            
                    function dotsGenerator(){
            
                        let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar"),
                            countItems;

                        if (settings.endlessSlider === true){countItems = items.length - 2;} 
                        else { countItems = items.length; }

                        for (let i = 0; i < countItems; i++){
                    
                            let dot = document.createElement("div");
                    
                            dot.classList = "dot"; dot.setAttribute("indexItem", i);
                            dot.style.transition = timeAnim + "ms " + settings.transition;
        
                            dotsBarContainer.append(dot);
                    
                        }
            
                    }
            
                    dotsGenerator();
            
                }
            
                buildDotsBar();

                document.querySelector(sliderClassName + " .dots-bar").firstChild.classList.add(settings.dotsEffect);
    
                break;
    
            case false: break;
    
        }

        let mainSlides = [],
            allSlides = Array.from(document.querySelector(sliderClassName + "-track").childNodes);

        switch(settings.endlessSlider){

            case true:  mainSlides = allSlides.slice(1, allSlides.length - 1);
                        break;

            case false: mainSlides = allSlides;
                        break;

        }

        // Применение настроек стрелочек //

        switch(settings.arrows){ 
    
            case true: buildButtons(); break;
            case false: break;
        
        }

        // Вызов функции подготовки слайдов //
        
        classIndent(items);

        // experimental, разделение галереи и предпросмотра эскизов на блоки //

        function elemBlocks(){

            // =================== //
            // Создаём первый блок //
            // =================== //

            let sliderBlock = Array.from(document.querySelectorAll(sliderClassName)[0].childNodes),
                SBlenght = sliderBlock.length;
            
            let firstBlock = document.createElement("div");
            firstBlock.className = className + "-block";

            document.querySelector(sliderClassName).append(firstBlock);

            for (let i = 0; i < SBlenght; i++){ firstBlock.append(sliderBlock[i]); }

            // =================== //
            // Создаём второй блок //
            // =================== //

            let mainItems;

            if (settings.endlessSlider === true) { 
                
                let mainItemsTemp = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
                mainItems = mainItemsTemp.slice(1, mainItemsTemp.length - 1);

            } else {

                mainItems = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
                
            }

            var MIlenght = mainItems.length,
                MSlenght = mainSlides.length,
                MSFsize = [],
                MSFSset = [],
                iMSFSS = 0;

            if (settings.presentationMode == true && MIlenght >= 3){

                let secondBlock = document.createElement("div"),
                    sliderThumbCont = document.createElement("div"),
                    sliderThumb = document.createElement("div");

                secondBlock.className = className + "-thumb-block";
                sliderThumbCont.className = className + "-thumb-container";
                sliderThumb.className = className + "-thumb";

                for (let i = 0; i < MSlenght; i++){ 

                    mainThumbsSlide = mainSlides[i].cloneNode(true);

                    sliderThumb.append(mainThumbsSlide);

                }
                
                document.querySelectorAll(sliderClassName)[0].append(sliderThumbCont);
                sliderThumbCont.append(sliderThumb);

                // ========================================================= //
                // Создаём стили эскизов для масштабирование шрифта/картинок //
                // ========================================================= //

                let thumbnailDiv = document.querySelectorAll(sliderClassName + "-thumb > div"),
                    countDivs = thumbnailDiv.length,
                    SSProperties;

                for (let slideIndex = 0; slideIndex < countDivs; slideIndex++){

                    thumbnailDiv[slideIndex].classList.add("slide-thumb");

                    let thumb = document.querySelectorAll(sliderClassName + " .slide-thumb")[slideIndex],
                        slide = document.querySelectorAll(sliderClassName + " .slide")[slideIndex];
                        k = parseFloat(getComputedStyle(thumb, true).height)/parseFloat(getComputedStyle(slide, true).height) - 0.05;
                        sizeText = parseFloat(window.getComputedStyle(thumb, null).getPropertyValue('font-size'));
                    
                    if (thumb.style.fontSize){ thumb.style.fontSize = null; } // Если в атрибуте есть свойство, имеющее значение font-size,
                                                                              // то он убирает для корректной работы

                    MSFsize[slideIndex] = (sizeText * k) * 0.75; // Из px в pt

                    thumb.classList.add(`fontThumb-${Math.round((sizeText * k) * 0.75)}pt`); // Добавляем класс к эскизу
                }

                if (document.querySelectorAll("head > style").length === 0){ // Если нет атрибута style в теле head, то добавляем

                    let SSBody = document.createElement("style");
                    document.querySelectorAll("head")[0].append(SSBody);

                } 

                SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута

                for (let j = 0; j < MSFsize.length; j++){ // Прогоняемся циклом для ликвидации дубликатов элементов

                    if (MSFSset.includes(MSFsize[j]) != true){

                        MSFSset[iMSFSS] = MSFsize[j];
                        iMSFSS++;

                    }

                }
                
                for (let l = 0; l < MSFSset.length; l++){ // Создаём стили

                    let fontStyle = `\t\t\t.fontThumb-${Math.round(MSFSset[l])}pt{\n\t\t\t\tfont-size: ${MSFSset[l]}pt;\n\t\t\t}\n`;

                    SSProperties.append(fontStyle);

                }

                let img = `.img-slide{\nwidth: inherit;\nheight: inherit;\npointer-events: none;\nborder-radius: inherit;\nposition: absolute;\n}\n
                .thumb-active::after{\nposition: absolute;\ncontent: "";\nopacity: 0.3;\nwidth: inherit;\nheight: inherit;\nbackground-color: white;\nborder-radius: inherit;\n}\n
                ._objects{\nz-index:2;}\n`;
                        

                SSProperties.append(img);

                let thumbSlides = document.querySelectorAll(".slide-thumb"),
                    thumbBlock = document.querySelectorAll("div" + sliderClassName + "-thumb-container")[0],
                    allSlides = Array.from(document.querySelector(sliderClassName + "-track").childNodes);

                try{

                    for (let _ of thumbSlides){ 
    
                        for (let tSlide of _.childNodes){ if(tSlide.nodeName == "IMG"){ tSlide.classList.add("img-slide"); } }
    
                    }

                    for (let _ of allSlides){

                        for (let aSlide of _.childNodes){ if(aSlide.nodeName == "IMG"){ aSlide.classList.add("img-slide"); } }
    
                    }

                } catch (error) { }

                document.querySelectorAll(sliderClassName)[0].append(secondBlock);
                secondBlock.append(thumbBlock);

                (Array.from(document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes)[0]).classList.remove("active");

                let mainSlide = document.querySelectorAll(sliderClassName + "-thumb-container .slide-thumb")[0];
                mainSlide.classList.add('thumb-active');

            }

        } elemBlocks();

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
        
    if (settings.dots === true){ var dots = Array.from(document.querySelector(sliderClassName + " .dots-bar").childNodes);}
    if (settings.presentationMode === true){ var thumbnails = document.querySelectorAll(sliderClassName + " .slide-thumb");}

    let isDelayed = false,
        targetSlide,
        currentSlide = document.querySelector(sliderClassName + "-track .slide.active").getAttribute("indexItem");

    if (settings.endlessSlider === true){
        mainItems = mainItems.slice(1, Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide")).length - 1);
    }

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let countSlides = mainItems.length;

        // Если стрелочки включены, то они видимы и рабочие //

        if (settings.arrows === true){

            // Переменные, нужные для стрелочек //

            let left = document.querySelector(sliderClassName + " #a_left"),
                right = document.querySelector(sliderClassName + " #a_right");
                lastSlide = document.querySelectorAll(sliderClassName + "-track .slide").length - 1;

            console.log(left, right);
            
            // ================================================ //
            // Автопрокрутка слайдера, когда стрелочки включены //
            // ================================================ //

            if(settings.autoPlaySlider === true){

                // Функция автопрокрутки при включённых стрелочках //

                function autoPlayWithArrows(){

                    if(isDelayed === false){ slideScroll(settings.autoPlayDirrection, countSlides, mainItems); }
    
                }

                // Зацикливание функции автопрокрутки /
    
                var autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); 

            }

            // Слайд влево //

            function slideLeft(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                if (isDelayed === false){

                    slideScroll("left", countSlides, mainItems);

                    setTimeout(() => {right.onclick = throttle(slideRight, timeAnim);}, timeAnim);
        
                    if (indexItem == 0 && settings.endlessSlider === false){
        
                        left.onclick = null;
        
                    }

                    if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); } // Если включена автопрокрутка, то интервал запускается
        
                }

            }

            // Слайд вправо //
    
            function slideRight(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                if(isDelayed === false){
                
                    slideScroll("right", countSlides, mainItems);

                    setTimeout(() => {left.onclick = throttle(slideLeft, timeAnim);}, timeAnim);
        
                    if (indexItem == lastSlide && settings.endlessSlider === false){
        
                        right.onclick = null;
        
                    }

                    if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, delayAP); } // Если включена автопрокрутка, то интервал запускается

                }
    
            }
            
            // ================= //
            // События на кнопки //
            // ================= //

            left.onclick = throttle(slideLeft, timeAnim);
            right.onclick = throttle(slideRight, timeAnim);

        }

        // ============================================================== //
        // Зацикливание функции автопрокрутки, если стрелочки не включены //
        // ============================================================== //

        if (settings.autoPlaySlider === true && settings.arrows === false){

            setInterval((function(){

                slideScroll(settings.autoPlayDirrection, countSlides, items); ActiveSlide(items, countSlides, settings.autoPlayDirrection);

            }), delayAP);

        }
        
    }

    if (settings.arrows === false && settings.autoPlaySlider === false){

        alert("Please turn on either autoplay or arrows");

    } else { 
        
        if (delayAP < timeAnim) { alert("Please change the value of autoPlayDelay so that it is greater than speedAnimation"); }
        else{ sliderNavigation(); }

    }

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideScroll(direction, countSlides, items){

        if (direction == "left" && 
            ((indexItem > 0 && settings.endlessSlider === false) || 
            (indexItem >= 0 && settings.endlessSlider === true))){ 

                isDelayed = true;
                changeSlide(direction, countSlides, items); 
                setTimeout(()=>{isDelayed = false;}, timeAnim);

        } 

        else if (direction == "right" && 
                 ((indexItem < countSlides - 1 && settings.endlessSlider === false) || 
                 (indexItem < countSlides && settings.endlessSlider === true))){ 
                    
                    isDelayed = true;
                    changeSlide(direction, countSlides, items); 
                    setTimeout(()=>{isDelayed = false;}, timeAnim);
                
        }

    }

    // ============= //
    // Пролистование //
    // ============= //

    function scrollingSlide(direction, countSlides, items, width){

        sliderTrack.style.transition = `${timeAnim}ms ${settings.transition}`;

        if (Object.is("right", direction) === true){ indexItem++; } else { indexItem--;};

        currentSlide = indexItem;

        let offsetKoef;

        if (settings.endlessSlider === true){offsetKoef = indexItem + 1;}
        else {offsetKoef = indexItem;}

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((function(){

            sliderTrack.style.transition = null;
            
            if (Object.is("right", direction) === true){ 
                
                if (offsetKoef == countSlides + 1 && settings.endlessSlider === true){ indexItem = 0; offsetKoef = indexItem + 1; currentSlide = indexItem;}
        
            } else {

                if (offsetKoef == 0 && settings.endlessSlider === true){ indexItem = countSlides - 1; offsetKoef = countSlides; currentSlide = indexItem;}

            };

            sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        }), timeAnim);

        if (Object.is("right", direction) === true){

            if (offsetKoef == countSlides + 1 && settings.endlessSlider === true){ items[0].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        } else {

            if (offsetKoef == 0 && settings.endlessSlider === true){ items[countSlides - 1].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        }

    }

    // ==================== //
    // Функция смены слайда //
    // ==================== //

    function changeSlide(direction, countSlides, items){

        const slideWidth = items[0].clientWidth;
        let i = document.querySelectorAll(sliderClassName + "-track div.slide.active")[0].getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации

        items[indexItem].classList.remove("active");
    
        scrollingSlide(direction, countSlides, items, slideWidth);

        decorationAnim(dots, thumbnails, i);

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function decorationAnim(dots, thumbnails, index){

        if (settings.dots === true){

            dots[index].classList.remove(settings.dotsEffect);
                    
            dots[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add(settings.dotsEffect);

        }

        try{

            if (settings.presentationMode === true && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3){

                thumbnails[index].classList.remove('thumb-active');
                    
                thumbnails[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add('thumb-active');

            }

        } catch (err) { }

    }

    // ---------------------- //
    // эксперементальные фичи //
    // ---------------------- //

    // режим презентации //

    function presentationMode(){

        const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

        // Объекты //

        let thumbTrack = document.querySelectorAll(sliderClassName + "-thumb")[0],
            thumbContainer = document.querySelectorAll(sliderClassName + "-thumb-container")[0];

        // Int значения //

        let thumbSlide = thumbTrack.firstChild,
            thumbSlides = thumbTrack.childNodes,
            marginSlide = parseInt(getComputedStyle(thumbSlide, true).marginLeft);

        let widthTrack = (-1 * (thumbSlide.clientWidth + (2 * marginSlide))) * (thumbSlides.length - 3);

        // Boolean значения //

        let touch = false,
            isTouched = false,
            isDelayed = false;

        function logBase(x, y){
            return Math.log(y) / Math.log(x);
        }

        function logAnimGraphic(x){
            return Math.round((10*((logBase(2, x-z) ** 3)))** 0.5);
        }

        function touchUp(){

            isDelayed = true;
            touch = false;
            isTouched = false;

            if (thumbTrack.offsetLeft >= 0){

                thumbTrack.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
                thumbTrack.style.left = "0px";

            } else if (thumbTrack.offsetLeft < widthTrack){

                thumbTrack.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
                thumbTrack.style.left = `${-(thumbSlides.length - 3) * (thumbSlide.clientWidth + (marginSlide * 2))}`;

            }

            setTimeout((function() {

                thumbTrack.style.transition = "none";
                isDelayed = false;

            }), timeAnim/2);

        }

        var onMouseDown = throttle((e) => {

            touch = true;
            isTouched = true;
            
            startPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2)) - thumbTrack.offsetLeft);
            startContPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2))); 

        }, (1/144) * 1000);
        
        var onMouseMove = throttle((e) => { 

            e.preventDefault();
                
            if (touch === true && isDelayed === false){

                let mousePosX = e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2);

                if (logAnimGraphic(mousePosX - startPosX) >= 23){ thumbTrack.style.left = `${logAnimGraphic(mousePosX - startPosX)}px`; }
                else if ((mousePosX - startPosX) < 0 && -1 * (mousePosX - startPosX) + widthTrack >= 23){ 

                    thumbTrack.style.left = `${widthTrack - (logAnimGraphic(Math.abs((-1 * widthTrack) + (mousePosX - startPosX))))}px`; 

                }
                else { thumbTrack.style.left = `${mousePosX - startPosX}px`;}

            }

        }, (1/144) * 1000);

        var onMouseUp = throttle(() => {

            if(isDelayed === false){ touchUp(); }

        }, (1/144) * 1000);

        thumbTrack.onmouseenter = thumbTrack.onmouseleave = function(event){

            event.preventDefault();

            let _ = document.querySelectorAll(sliderClassName + "-thumb")[0];

            if(event.type === "mouseenter" && isDelayed === false) {

                _.onmousedown = onMouseDown;
                _.onmousemove = onMouseMove;
                _.onmouseup = onMouseUp;

            }
            else if(event.type === "mouseleave" && isTouched === true && isDelayed === false){ touchUp(); }
            else { touch = false; isTouched = false; }

        };

    }

    let PMerror = "Please, add slides for correctly working Presentation Mode \nCode error: "

    try{ if (settings.presentationMode === true && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3){ presentationMode();} }
    catch(e){ alert(PMerror + e);}

    // Навигация по точкам //

    function target(target, width){

        sliderTrack.style.transition = timeAnim + "ms " + settings.transition;

        var offsetKoef;
        
        if (settings.endlessSlider === false){offsetKoef = target;}
        else {offsetKoef = target+1;}

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((function(){

            sliderTrack.style.transition = null;

        }), timeAnim);

    }

    let dotsBar = document.querySelector(sliderClassName + " .dots-bar").childNodes;

    for (var i = 0; i < dotsBar.length; i++) {

        dotsBar[i].addEventListener("click", (function() {

            if (isDelayed === false){
                
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

}  // жырнаяъ галереяъ