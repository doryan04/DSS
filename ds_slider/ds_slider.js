function DSS_start(sliderClassName, settings){

    // ===================== //
    // Стандартные настройки //
    // ===================== //

    // Лучше их не трогай пожалуйста //

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

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined){ settings = defaultSettings; }
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] === undefined || settings[defaultParameter] === null) { settings[defaultParameter] = defaultSettings[defaultParameter]; }

        }

    }

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
    
            setTimeout(function() {

                isThrottled = false;

                if (savedArgs) {

                    wrapper.apply(savedThis, savedArgs);

                    savedArgs = savedThis = null;

                }

            }, delay);

        }

    }

    // эксперементальная фича //

    if (settings.presentationMode === true){
        let index = 0;
        let thumbTrack = document.querySelectorAll(".thumbTrack")[0];
        let thumbContainer = document.querySelectorAll(".thumbTrackContainer")[0];
        let thumbSlide = document.querySelectorAll(".thumbTrack > div")[0];
        let marginSlide = parseInt(getComputedStyle(thumbSlide, true).margin);
        function transition(animation){
            thumbTrack.style.transition = `${animation} ${settings.speedAnimation/2}ms`;
            thumbTrack.style.left = `${-((thumbSlide.offsetWidth + (marginSlide * 2)) * index)}px`;
            setTimeout(() => {thumbTrack.style.transition = `none`;}, settings.speedAnimation/2);
        }
        thumbTrack.onmouseenter = thumbTrack.onmouseleave = function(event){
            event.preventDefault();
            var touch = false;
            if(event.type == "mouseenter") {
                thumbTrack.addEventListener("mousedown", (e) => {
                    startPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2)) - thumbTrack.offsetLeft);
                    startContPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2))); 
                    touch = true;
                })
                thumbTrack.onmousemove = (e) => {
                    e.preventDefault();
                    if (touch == true){
                        mousePosX = e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2);
                        thumbTrack.style.left = `${(mousePosX - startPosX)}px`;
                        if (Math.abs(mousePosX - startContPosX) >= (thumbSlide.clientWidth * (2 / 3))){
                            if ((mousePosX - startContPosX) > 0 && index > 0){
                                index--;
                                transition("ease-out");
                            }
                            else if ((mousePosX - startContPosX) > 0 && index == 0){
                                transition(settings.transition);
                            }
                            else if ((mousePosX - startContPosX) < 0 && index < 1){
                                index++;
                                transition("ease-out");
                            } 
                            else {
                                transition(settings.transition);
                            }
                            touch = false;
                        }
                    }
                }
                thumbTrack.onmouseup = () => {
                    if (Math.abs(mousePosX - startContPosX) < (thumbSlide.clientWidth * (2 / 3))){
                        transition(settings.transition);
                    }
                    touch = false;
                }
            }
            else{
                transition(settings.transition);
                touch = false;
            }
        }
    }

    // ============================================================================================================= //
    // Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
    // ============================================================================================================= //

    function preparingGallery(){

        // Перенос слайдов в родительский тег //

        let slideMigtation = new function(){

            var track = document.createElement("div");
            var slide = document.querySelectorAll(sliderClassName + " div");
            var countDivs = slide.length;
    
            track.className = "slider-track";
    
            for (let i = 0; i < countDivs; i++){
    
                track.append(slide[i]);
    
            }
    
            document.querySelectorAll(sliderClassName)[0].append(track);
    
        }; slideMigtation;

        // Временные переменные, созданные для удобства //

        var container = document.querySelectorAll(sliderClassName)[0];
        var items = document.querySelectorAll(sliderClassName + " .slider-track > div");
        var track = document.querySelectorAll(sliderClassName + " .slider-track")[0];

        // Создание родительских тегов //

        let sliderWindow = document.createElement('div');
    
        sliderWindow.classList.add("slider-container")

        track.before(sliderWindow); sliderWindow.append(track);

        // Настройка, отвечающая за безграничный скролл слайдера //
    
        switch(settings.endlessSlider){ 
    
            case true: track.prepend(items[items.length - 1].cloneNode(true)); 
                       track.append(items[0].cloneNode(true));
                       break;
    
            case false: break;
    
        }
    
        // Подготовка слайдов //
        
        function classIndent(){
            
            var items = document.querySelectorAll(sliderClassName + " " + ".slider-track" + " > div");
            
            for (let j = 0; j < items.length; j++){
                
                if(settings.endlessSlider === true){ items[j].classList = "slide"; items[j].setAttribute("indexItem", j - 1); }
                else{ items[j].classList = "slide"; items[j].setAttribute("indexItem", j); }
            
            }
            
            switch(settings.endlessSlider){

                case true:  document.querySelectorAll(sliderClassName + " .slider-track .slide")[1].classList.add("active");
                            track.style.transform = "translateX(-"+ (document.querySelectorAll(sliderClassName + " .slider-track > div")[0].clientWidth) +"px)"
                            break;

                case false: document.querySelectorAll(sliderClassName + " .slider-track .slide")[0].classList.add("active");
                            break;

            }
            
        }
    
        // Подготовка стрелочек к работе //
    
        function preparingButtons(){
    
            var slideRight = document.createElement("button");
            var slideLeft = document.createElement("button");
        
            slideRight.classList = "button"; slideRight.id = "right";
            slideLeft.classList = "button"; slideLeft.id = "left";
    
            container.append(slideRight); container.prepend(slideLeft);
        
        }
    
        // Подготовка индикации слайдера //
    
        switch(settings.dots){
    
            case true:
    
                function preparingDotsBar(){
    
                    let dotsBar = document.createElement("div");
            
                    dotsBar.classList = "dots-bar"; container.append(dotsBar);
            
                    // Генератор точек //
            
                    function dotsGenerator(){
            
                        let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar");
            
                        for (let i = 0; i < items.length; i++){
            
                            let dot = document.createElement("div");
                
                            dot.classList = "dot"; dot.id = i + 1;
                            dot.style.transition = settings.speedAnimation + "ms " + settings.transition;
    
                            dotsBarContainer.append(dot);
                
                        }
            
                    }
            
                    dotsGenerator();
            
                }
            
                preparingDotsBar();
            
                document.querySelectorAll(sliderClassName + " .dots-bar .dot")[0].classList.add(settings.dotsEffect);
    
                break;
    
            case false: break;
    
        }
        
        // Применение настроек стрелочек //

        switch(settings.arrows){ 
    
            case true: preparingButtons(); break;
            case false: break;
        
        }

        // Вызов функции подготовки слайдов //
        
        classIndent();

        // Возврат переменной, в которой находится трек слайдера //

        return track;
    
    }

    // Вызов функции и объявление переменной, отвечающей за трек слайдера //
    
    const sliderTrack = preparingGallery();

    // ========== //
    // Переменные //
    // ========== //
    
    if (settings.endlessSlider === true){ var indexItem = 1; } else { var indexItem = 0; }
    let dots = document.querySelectorAll(sliderClassName + " .dots-bar .dot");

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        // Переменные, необходимые для данной функции //

        let items = document.querySelectorAll(sliderClassName + " .slider-track .slide");
        let countSlides = items.length - 1;

        // Если стрелочки включены, то они видимы и рабочие //

        if (settings.arrows === true){

            // Переменные, нужные для стрелочек //

            let left = document.querySelector(sliderClassName + " #left");
            let right = document.querySelector(sliderClassName + " #right");

            // ================================================ //
            // Автопрокрутка слайдера, когда стрелочки включены //
            // ================================================ //

            if(settings.autoPlaySlider === true){

                // Функция автопрокрутки при включённых стрелочках //

                function autoPlayWithArrows(){

                    left.onclick = null;
                    right.onclick = null;
    
                    slideScroll(settings.autoPlayDirrection, countSlides, items);
    
                    setTimeout(() => {  left.onclick = throttle(slideLeft, settings.speedAnimation);
                                        right.onclick = throttle(slideRight, settings.speedAnimation);}, 
                                        settings.speedAnimation);
    
                }

                // Зацикливание функции автопрокрутки //
    
                var autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); 

            }

            // Слайд влево //

            function slideLeft(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                right.onclick = null;

                slideScroll(left.id, countSlides, items);
    
                setTimeout(() => {right.onclick = throttle(slideRight, settings.speedAnimation);}, settings.speedAnimation);
    
                if (indexItem == 0 && settings.endlessSlider === false){
    
                    left.onclick = null;
    
                }

                if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); } // Если включена автопрокрутка, то интервал запускается
    
            }

            // Слайд вправо //
    
            function slideRight(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
    
                left.onclick = null;
                
                slideScroll(right.id, countSlides, items);
    
                setTimeout(() => {left.onclick = throttle(slideLeft, settings.speedAnimation);}, settings.speedAnimation);
    
                if (indexItem == document.querySelectorAll(sliderClassName + " .slider-container .slider-track .slide").length - 1 && settings.endlessSlider === false){
    
                    right.onclick = null;
    
                }

                if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); } // Если включена автопрокрутка, то интервал запускается
    
            }
            
            // ================= //
            // События на кнопки //
            // ================= //

            left.onclick = throttle(slideLeft, settings.speedAnimation);
            right.onclick = throttle(slideRight, settings.speedAnimation);

        }

        // ============================================================== //
        // Зацикливание функции автопрокрутки, если стрелочки не включены //
        // ============================================================== //

        if (settings.autoPlaySlider === true && settings.arrows === false){

            setInterval(function(){

                slideScroll(settings.autoPlayDirrection, countSlides, items); ActiveSlide(items, countSlides, settings.autoPlayDirrection);

            }, settings.autoPlayDelay);

        }
        
    }

    if (settings.arrows === false && settings.autoPlaySlider === false){

        alert("Please turn on either autoplay or arrows");

    } else { 
        
        if (settings.autoPlayDelay < settings.speedAnimation) { alert("Please change the value of autoPlayDelay so that it is greater than speedAnimation"); }
        else{ sliderNavigation(); }

    }

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideScroll(direction, countSlides, items){

        if (direction == "left" && indexItem > 0){ changeSlide(direction, countSlides, items); } 
        else if (direction == "right" && indexItem < countSlides){ changeSlide(direction, countSlides, items); }

    }

    // ============= //
    // Пролистование //
    // ============= //

    function scrollingSlide(direction, countSlides, items, width){

        sliderTrack.style.transition = settings.speedAnimation + "ms " + settings.transition;

        if (Object.is("right", direction) === true){ indexItem++; } else { indexItem--;};

        sliderTrack.style.transform = "translateX(-"+ ((width) * indexItem) +"px)";

        setTimeout(function(){

            sliderTrack.style.transition = null;
            
            if (Object.is("right", direction) === true){ 
                
                if (indexItem == countSlides && settings.endlessSlider === true){ indexItem = 1; }
        
            } else {

                if (indexItem == 0 && settings.endlessSlider === true){ indexItem = countSlides - 1; }

            };

            sliderTrack.style.transform = "translateX(-"+ ((width) * indexItem) +"px)";

        }, settings.speedAnimation);

        if (Object.is("right", direction) === true){

            if (indexItem == countSlides && settings.endlessSlider === true){ items[1].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        } else {

            if (indexItem == 0 && settings.endlessSlider === true){ items[countSlides - 1].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        }

    }

    // ==================== //
    // Функция смены слайда //
    // ==================== //

    function changeSlide(direction, countSlides, items){

        const slideWidth = items[0].clientWidth;
        let i = document.querySelectorAll(sliderClassName + " " + ".slider-track" + " div.slide.active")[0].getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации

        items[indexItem].classList.remove("active");
    
        scrollingSlide(direction, countSlides, items, slideWidth);

        if (settings.dots === true){ dotsAnimation(dots, i); }

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function dotsAnimation(dots, indexDot){

        dots[indexDot].classList.remove(settings.dotsEffect);
                
        dots[document.querySelectorAll(sliderClassName + " " + ".slider-track" + " div.slide.active")[0].getAttribute("indexitem")].classList.add(settings.dotsEffect);

    }

}