async function DSS_start(sliderClass, settings){

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
        endlessSlider:  {
            toggle: true,
            autoMargin: false,
        },
        transition: "ease-in-out",
        presentationMode: {
            toggle: true,
            slidesClassName: "slide-thumb",
        },
        speedAnimation: 400,
        swipeScroll: false,

    }

    var className = sliderClass.slice(1, sliderClass.length),
        slider = document.querySelector(sliderClass),
        dotsBarContainer, stp, ttpTemp, margin;

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined) settingsSlider = defaultSettings; 
    else{
        for (var defaultParameter in defaultSettings){
            if (settings[defaultParameter] == (undefined || null)) settings[defaultParameter] = defaultSettings[defaultParameter];
        }
    }

    var timeAnim = settings.speedAnimation,
        delayAP = settings.autoPlayDelay,
        infSlider = settings.endlessSlider.toggle,
        autoMargin = settings.endlessSlider.autoMargin,
        PMtoggle = settings.presentationMode.toggle,
        PMslidesClassName = settings.presentationMode.slidesClassName,
        countES;

    // =========================== //
    // Функции построения слайдера //
    // =========================== //

    // Функция мигрирования элементов слайдера в родительский тег //

    function slideBuild(){

        var div = document.createElement("div"),
            slides = document.querySelectorAll(sliderClass + " > div"),
            countDivs = slides.length;

        // Перенос текста в отдельный <div> элемент //

        for (let slide of slides){

            let _ = slide.childNodes, 
                div = document.createElement("div"),
                checkIMG = false; index = 0;
                
            div.classList.add("_objects");

            for (let j of _) { 
                if (j.nodeName == "IMG") checkIMG = true; 
            }

            if(checkIMG) { 
                while(_.length != 1) _[index].nodeName == "IMG" ? index++ : div.append(_[index]);
            } else { 
                while(_.length != 0) div.append(_[index]); 
            }

            slide.append(div);

        }


        div.className = className + "-track";

        for (let i = 0; i < countDivs; i++) div.append(slides[i]);

        slider.append(div);

    };

    // Функция присвайвания ID слайдам //

    function classIndent(items, track){

        for (let j = 0; j < items.length; j++){
            
            if(infSlider) { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - countES); }
            else { items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
        
        }
        
        switch(infSlider){
            case true:  items[countES].classList.add("active");
                        track.style.transform = `translateX(-${(parseInt(track.querySelector("div").clientWidth) * (countES - 1))}px)`;
                        break;
            case false: track.firstChild.classList.add("active");
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

        dotsBarContainer = slider.querySelector(sliderClass + " .dots-bar");

        let countItems = infSlider == true ? items.length - (2 * countES) : items.length;

        for (let i = 0; i < countItems; i++){  
    
            let dot = document.createElement("div");
        
            dot.classList = "dot"; dot.setAttribute("indexItem", i);
            dot.style.transition = timeAnim + "ms " + settings.transition;

            dotsBarContainer.append(dot);
    
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

            delete _;

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
        
        var allT = slider.querySelectorAll(sliderClass + " ." + PMslidesClassName),
            allS = slider.querySelectorAll(sliderClass + " .slide"),
            MSFSset = new Set();

        for (let i = 0; i < countDivs; i++){

            var k = parseFloat(getComputedStyle(allT[i], true).height)/parseFloat(getComputedStyle(allS[i], true).height) - 0.05;
                sizeText = parseFloat(window.getComputedStyle(allT[i], null).getPropertyValue('font-size'));

            if (allT[i].style.fontSize) allT[i].style.fontSize = null;  // Если в атрибуте есть свойство, имеющее значение font-size,
                                                                        // то он убирает для корректной работы

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
                if(content.nodeName == "IMG") content.classList.add("img-slide");
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
                if(element.nodeName == "IMG") element.classList.add("img-slide"); 
            }
        }
    }

    // Разделение галереи и предпросмотра эскизов на блоки //

    var imageProp = `.img-slide{
                    \nwidth: inherit;
                    \nheight: inherit;
                    \npointer-events: none;
                    \nborder-radius: inherit;
                    \nposition: absolute;
                    \n}\n
                    ._objects{
                    \nz-index:2;
                    \n}\n`,
    SSProperties = document.querySelectorAll("head > style")[0]; // Все стили тута
    SSProperties.append(imageProp);

    function firstBlockCreate(){

        let sliderBlock = Array.from(document.querySelectorAll(sliderClass)[0].childNodes),
            firstBlock = document.createElement("div");

        firstBlock.className = className + "-block";

        slider.append(firstBlock);

        for (let i = 0; i < sliderBlock.length; i++) firstBlock.append(sliderBlock[i]);

    }

    var secondBlockCreate = (array) =>{ mainItems = infSlider ? array.slice(countES, array - countES) : array;}

    function elemBlocks(array1, array2, width){

        imgFix(array2); // Подгоняем картинки под нужный размер //
        firstBlockCreate();  // Создаём первый блок //
        secondBlockCreate(array2); // Создаём второй блок //

        switch(PMtoggle){ // Постройка трека с эскизами //
            case true:  buildPM(SSProperties, array1, width); 
                        break;
            case false: return 3;
        }

    }

    // Создание родительских тегов //

    function sliderContainerBuild(track){

        let sliderWindow = document.createElement('div');

        sliderWindow.classList.add(className + "-container")
        track.before(sliderWindow); sliderWindow.append(track);

    }

    // Настройка, отвечающая за безграничный скролл слайдера //

    function endlessSlider(track, items){
        switch(infSlider){ 
            case true:  for (let i = 1; i <= countES; i++) track.prepend(items[items.length - i].cloneNode(true)); 
                        for (let j = 1; j <= countES; j++) track.append(items[j + (countES - 1)].cloneNode(true));
                        break;
            case false: break;
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

    function dots(array){

        let dotsBar = document.createElement("div");

        switch(settings.dots){
            case true:  buildDotsBar(slider, dotsBar, array);
                        dotsBarContainer.firstChild.classList.add(settings.dotsEffect);
                        return dotsBarContainer;
            case false: return 2;
        }

    }

    function marginsBuild(widht1, widht2, _obj){

        margin = autoMargin ? widht1 < widht2 ? Math.abs(widht2 - widht1) / 2 : 0 : 0;

        if(infSlider) _obj.style.marginLeft = `${margin}px`;
        if(autoMargin && widht1 < widht2) { for (let i of _obj.childNodes) i.style.marginRight = `${margin * 2}px`; }

    }

    // ================== //
    // Постройка карусели //
    // ================== //

    function buildCarousel(){

        slideBuild();

        var track = slider.querySelector(sliderClass + "-track"),
            items = track.childNodes, cw, sw, koef;

        sliderContainerBuild(track);

        cw = slider.querySelector(sliderClass + "-container").clientWidth; // width container
        sw = track.firstChild.clientWidth; // width slide

        if((!infSlider && !autoMargin) && sw > cw) autoMargin = true;

        marginsBuild(sw, cw, track);

        countES = infSlider && !autoMargin ? Math.floor(cw / sw) + 1: 
                 !infSlider && !autoMargin ? 1 : 1; // ES - extra slides

        endlessSlider(track, items);

        if (!infSlider && !autoMargin && sw < cw) track.style.marginLeft = `${(cw - sw)/2}`;

        var allSlides = Array.from(items),
            mainSlides = infSlider ? allSlides.slice(countES, allSlides.length - countES) : allSlides;

        arrows();
        dots(items);
        classIndent(items, track);
        elemBlocks(mainSlides, allSlides, cw);

        return _ = { track: track, items: items, sw: sw, cw: cw};

    }

    var _ = buildCarousel(),
        track = _.track,
        items = _.items,
        sw = _.sw,
        cw = _.cw;

    // Вызов функции и объявление переменной, отвечающей за трек слайдера //

    const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

    // ========== //
    // Переменные //
    // ========== //

    var localCountES = countES > (cw/sw) ? countES : countES,
        position = infSlider ? -(((2*margin) + sw) * (countES + 0.5) - (0.5 * cw)) : autoMargin ? (cw - sw)/2 : 0,
        indexItem = 0,  mainItems = Array.from(items),
        stp = position;

    if (settings.dots) var dots = Array.from(dotsBarContainer.childNodes);
    if (PMtoggle) var thumbnails = slider.querySelectorAll(sliderClass + " ." + PMslidesClassName);

    let isDelayed = false,
        targetSlide,
        currentSlide = parseInt(track.querySelector(".slide.active").getAttribute("indexItem"));

    if (infSlider) mainItems = mainItems.slice(countES, (mainItems).length - countES);


    // ============================================ //
    // Функции, отвечающая за навигацию по слайдеру //
    // ============================================ //

    // Функции автопрокрутки //

    var autoplay = 0;

    var countSlides = mainItems.length,
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

    // Функция скроллинга слайдера по стрелкам //

    function arrowScrollSlide(target, APtarget){

        prepareToChangeSlide(mainItems, target).then(() => { 

            isDelayed = false;
            setInter(mainItems, APtarget);

        });

    }

    // Функция подготовки к смене слайда //

    function prepareToChangeSlide(items, target){

        return new Promise((resolve, reject) => {

            let firstCondition = (indexItem + target < countSlides && indexItem + target >= 0) && !infSlider,
                secondConfition = infSlider;

            if (firstCondition || secondConfition){ 

                isDelayed = true;

                changeSlide(items, target); 
                setTimeout(() => { 

                    if(!isDelayed) resolve();
                    else reject(); 

                }, timeAnim);

            }

        });

    }

    // Функция смены слайда //

    function changeSlide(items, target){

        let i = slider.querySelector(sliderClass + "-track div.slide.active").getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации)
        
        items[indexItem].classList.remove("active");

        scrollingSlide(items, target).then(() => { 

            isDelayed = false;
            stp = Math.round(new WebKitCSSMatrix(getComputedStyle(track).transform).m41);

        });
        indicationAnim(dots, thumbnails, i);

    }

    // Функция, анимирующая смену слайда, ставящая пределы смен слайдов при необходимости //

    function scrollingSlide(items, target){

        return new Promise((resolve, reject) => {

            track.style.transition = `${timeAnim}ms ${settings.transition}`;

            indexItem += target;
            currentSlide = indexItem;
            
            let indexTarget = infSlider ? indexItem + localCountES : indexItem,
                firstCondition = (target == 1 && indexTarget == countSlides + localCountES && infSlider),
                secondCondition = (target == -1 && indexTarget == localCountES - 1 && infSlider);

            track.style.transform = `translateX(${ 
                infSlider? -(((2*margin) + sw) * (indexTarget + 0.5) - (0.5 * cw)) :
                autoMargin && sw > cw && !infSlider? indexTarget < 1 ? ((cw - sw)/2) : 
                -(((2*margin) + sw) * (indexTarget + 0.5) - (0.5 * cw)) : 
                autoMargin && sw < cw && !infSlider? indexTarget < 1 ? ((cw - sw)/2) : 
                -cw * indexTarget + ((cw - sw)/2) : -sw * indexTarget}px)`;


            setTimeout((() => {

                track.style.transition = null;
                    
                indexItem = firstCondition ? 0 : secondCondition ? countSlides - 1 : indexItem; 
                indexTarget = firstCondition ? localCountES : secondCondition ? countSlides + (localCountES - 1) : indexTarget; 
                currentSlide = firstCondition ? indexTarget - localCountES : secondCondition ? indexTarget - localCountES : currentSlide;

                if (firstCondition || secondCondition){
                    track.style.transform = `translateX(${ 
                        infSlider? -(((2*margin) + sw) * (indexTarget + 0.5) - (0.5 * cw)) :
                        autoMargin && sw > cw && !infSlider? indexTarget < 1 ? ((cw - sw)/2) : 
                        -(((2*margin) + sw) * (indexTarget + 0.5) - (0.5 * cw)) : 
                        autoMargin && sw < cw && !infSlider? indexTarget < 1 ? ((cw - sw)/2) : 
                        -cw * indexTarget + ((cw - sw)/2) : -sw * indexTarget}px)`;
                }

                resolve();
            
            }), timeAnim + 20);

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
            object[slider.querySelector(sliderClass + "-track div.slide.active").getAttribute("indexitem")].classList.add(_class);
        }

        if(settings.dots)  _(dots, settings.dotsEffect, index);

        if(PMtoggle){

            let TTlenght = slider.querySelector(sliderClass + "-thumb").childNodes.length, // TT - Thumb track
                condition = (PMtoggle && TTlenght >= 3); 
            
            if (condition) _(thumbnails, 'thumb-active', index); 

        }

    }

    // =================== //
    // Навигация по точкам //
    // =================== //

    var ws = window.innerWidth;
    let dotsBar = dotsBarContainer.childNodes;

    // Функция переключение слайдов для точек навигации //

    function target(targetSlide){

        return new Promise((resolve, reject) => {

            clearInterval(autoplay);

            let targetIndex = !infSlider ? targetSlide : targetSlide + localCountES;

            track.style.transition = timeAnim + "ms " + settings.transition;

            track.style.transform = `translateX(${ 
                infSlider? -(((2*margin) + sw) * (targetIndex + 0.5) - (0.5 * cw)) :
                autoMargin && sw > cw && !infSlider? targetIndex < 1 ? ((cw - sw)/2) : 
                -(((2*margin) + sw) * (targetIndex + 0.5) - (0.5 * cw)) : 
                autoMargin && sw < cw && !infSlider? targetIndex < 1 ? ((cw - sw)/2) : 
                -cw * targetIndex + ((cw - sw)/2) : -sw * targetIndex}px)`;

            setTimeout((() => { 

                track.style.transition = null; 

                setInter(mainItems, APtarget);
                resolve();

            }), timeAnim + 20);

        });

    }

    // Переключение активного слайда //

    function changeActiveSlide(current, target) { for (let i of arguments) mainItems[i].classList.toggle("active"); }

    // Скроллинг слайдов //

    let isTouchedPM = false, isDelayedPM = false, // Булеаны для режима презентации
        isTouched = false; // Булеан для свайпов

    function swipeSlide(){

        let sc = track.parentElement, sp = 0, scw = sc.clientWidth, moving, move,
            sw = track.firstChild.clientWidth,
            condition = infSlider ? countSlides : countSlides - 1,
            ml = autoMargin && sw > cw ? sw * condition + (sw - cw): sw * condition, 
            sl = cw * 0.5;

        track.style.transform = `translateX(${position}px)`;

        let booleanEdit = (t, d) => {

            isTouched = t; isDelayed = d;

        }

        function overscrollAnim(){

            booleanEdit(false, true);

            track.style.transition = "ease-out" + ` ${timeAnim/2}ms`;
            track.style.transform = `translateX(${stp}px)`;

            setTimeout((() => {
                
                track.style.transition = "none";

                isDelayed = false;

                setInter(mainItems, APtarget);

                stp = Math.round(new WebKitCSSMatrix(getComputedStyle(track).transform).m41);

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

            if (move < -sl || move > sl){

                booleanEdit(false, true);

                var target = move < -sl ? 1 : -1;

                prepareToChangeSlide(mainItems, target).then(() => { 

                    isDelayed = false; 

                    setInter(mainItems, APtarget);

                    stp = Math.round(new WebKitCSSMatrix(getComputedStyle(track).transform).m41);

                });

            }

        }
        var onMove = throttle((event) => {

            moving = stp + ((event.pageX - ((ws - scw)/2)) - sp);
            move = (event.pageX - ((ws - scw)/2)) - sp;

            if(isTouched && !isDelayed){
                if(infSlider){ 
                    track.style.transform = `translateX(${moving}px)`; slide(); 
                }
                else {
                    if (moving > 23){
                        track.style.transform = `translateX(${logAnimGraphic(moving, z)}px)`;
                    }
                    else if (moving < -1*ml - 23) {
                        console.log(ml, "its works", moving)
                        track.style.transform = `translateX(${-1 * ml - (logAnimGraphic(Math.abs((ml) + (moving)), z))}px)`;
                    }
                    else{ 
                        track.style.transform = `translateX(${moving}px)`; slide(); 
                    }
                }
            }
            
        }, 1/144 * 1000);
        var onUp = () => {

            if (isTouched){

                overscrollAnim();
                isTouched = false;

            }

        };

        return [sc, track, onDown, onMove, onUp, overscrollAnim, booleanEdit, "swipe"];

    }

    // Режим презентации //

    function presentationMode(){
        
        // tt - thumb track; sw - slide width; sm - slide margin; ml - moving limit; tcw - thumb container width
        // sp - start position; mpx - mouse position x; ttp - thumb track position on X

        let tt = slider.querySelector(sliderClass + "-thumb"),
            ts = tt.firstChild, ws = window.innerWidth,
            tsm = 2 * parseFloat(getComputedStyle(ts, true).marginLeft),
            tsw = parseFloat(getComputedStyle(ts, true).width),
            tcw = tt.parentElement.clientWidth, sp = 0, ttp = 0, mpx = 0,
            ml = -((tsm + tsw) * (tt.childNodes).length) > -tcw ? 0 : 
                 -((tsm + tsw) * (tt.childNodes).length) + tcw;

        tt.style.transform = `translateX(0px)`

        ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

        let booleanEdit = (t, d) => {
            isTouchedPM = t; isDelayedPM = d;
        }

        function overscrollAnim(){

            tt.style.transition = "ease-out" + ` ${timeAnim/2}ms`;

            booleanEdit(false, true);
            
            let condition = ttpTemp > 0 ? 0 : ttpTemp < ml ? ml : ttpTemp;

            var limiter = (returnTo) => {

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

                ttpTemp = new WebKitCSSMatrix(window.getComputedStyle(tt).transform).m41;

            }

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

        if (PMtoggle && slider.querySelector(sliderClass + "-thumb").childNodes.length >= 3) var argsPM = presentationMode();

    } catch(e) { alert(PMerror + e); }

    var argsS = swipeSlide();

    // Эвенты для стрелок //

    function arrowsEvents(sliderClass, callback, APtarget, toggle){

        for (let arrow of sliderClass){
            
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
                target(targetSlide, mainItems[0].clientWidth).then(() => {
                    stp = Math.round(new WebKitCSSMatrix(getComputedStyle(track).transform).m41);

                    console.log(stp)
                });
                indicationAnim(dotsBar, thumbnails, currentSlide);

                indexItem = currentSlide = targetSlide;

                setTimeout(() => {
                    isDelayed = false;
                    stp = Math.round(new WebKitCSSMatrix(getComputedStyle(track).transform).m41);
                }, timeAnim);

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

            object2.onpointerdown = !toggle ? null : (event) => onDown(event) 
            object2.onpointermove = !toggle ? null : (event) => onMove(event) 
            object2.onpointerup = !toggle ? null : () => onUp() 

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

            let arrows = slider.querySelectorAll(sliderClass + " .a-bar");
            arrowsEvents(arrows, arrowScrollSlide, APtarget, toggle);

        }
        if (settings.autoPlaySlider){ 
            if (toggle) setInter(mainItems, APtarget);
            else clearInterval(autoplay);
        }
        if (PMtoggle) { pointerEvents.apply(this, _argsPM); }
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