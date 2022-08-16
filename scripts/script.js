function startGallery(sliderClassName, settings){

    // ========== //
    // Переменные //
    // ========== //

    var indexItem = 0; var indexActiveItem = 0;

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
    
            let arrowRight = document.createElement("button");
            let arrowLeft = document.createElement("button");
        
            arrowRight.classList = "button"; arrowRight.id = "right";
            arrowLeft.classList = "button"; arrowLeft.id = "left";
    
            container.append(arrowRight); container.prepend(arrowLeft);
        
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
                
                            dot.classList = "dot"; dot.id = i;
                            dot.style.transition = settings.speedAnimation + "ms " + settings.transition;
    
                            dotsBarContainer.append(dot);
                
                        }
            
                    }
            
                    dotsGenerator();
            
                }
            
                preparingDotsBar();
            
                document.querySelectorAll(sliderClassName + " .dots-bar .dot")[0].classList.add("dot-active");
    
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

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let left = document.querySelector(sliderClassName + " #left");
        let right = document.querySelector(sliderClassName + " #right");
        let items = document.querySelectorAll(sliderClassName + " .slider-track .slide");

        const countSlides = items.length - 1; 

        function leftArrow(){

            right.onclick = null;

            slideScroll(left.id, countSlides, items); ActiveSlide(items, countSlides, left.id);

            setTimeout(() => {right.onclick = throttle(rightArrow, settings.speedAnimation);}, settings.speedAnimation);

            if (indexItem == 0 && settings.endlessSlider === false){

                left.onclick = null;

            }

        }

        function rightArrow(){

            left.onclick = null;

            slideScroll(right.id, countSlides, items); ActiveSlide(items, countSlides, right.id);

            setTimeout(() => {left.onclick = throttle(leftArrow, settings.speedAnimation);}, settings.speedAnimation);

            if (indexItem == document.querySelectorAll(sliderClassName + " .slider-container .slider-track .slide").length - 1 && settings.endlessSlider === false){

                right.onclick = null;

            }

        }

        left.onclick = throttle(leftArrow, settings.speedAnimation);
        right.onclick = throttle(rightArrow, settings.speedAnimation);

    }

    // Так же настройка стрелочек, но отвечающая за отключение навигации посредством отключения стрелочек //

    switch(settings.arrows){ 

        case true: sliderNavigation(); break;
        case false: break;
    
    } 

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideScroll(direction, countSlides, items){

        if (direction == "left" && indexItem > 0){ animationSlide(direction, countSlides, items); } 
        else if (direction == "right" && indexItem < countSlides){ animationSlide(direction, countSlides, items); }

    }

    // =============================== //
    // Анимация пролистывания слайдера //
    // =============================== //

    function animationSlide(direction, countSlides, items){

        const slide = items[0].clientWidth;

        sliderTrack.style.transition = settings.speedAnimation + "ms " + settings.transition;
    
        switch(direction){

            case "left":

                indexItem--;

                sliderTrack.style.transform = "translateX(-"+ ((slide) * (indexItem)) +"px)";

                setTimeout(function(){

                    sliderTrack.style.transition = null;

                    if (indexItem == 0 && settings.endlessSlider === true){
                    
                        indexItem = countSlides - 1;

                        sliderTrack.style.transform = "translateX(-"+ ((slide) * (indexItem)) +"px)";

                    }
            
                }, settings.speedAnimation);
            
                break;

            case "right":

                indexItem++;

                sliderTrack.style.transform = "translateX(-"+ ((slide) * indexItem) +"px)";

                setTimeout(function(){

                    sliderTrack.style.transition = null;

                    if (indexItem == countSlides && settings.endlessSlider === true){

                        indexItem = 1;
                
                        sliderTrack.style.transform = "translateX(-"+ ((slide) * (indexItem)) +"px)";
                
                    }
        
                }, settings.speedAnimation)

            break;

        }

    }

    // =============================== //
    // Индентификация активного слайда //
    // =============================== //

    function ActiveSlide(item, count, direction){

        let i = document.querySelectorAll(sliderClassName + " " + ".slider-track" + " div.slide.active")[0].getAttribute("indexitem");
        let dots = document.querySelectorAll(sliderClassName + " .dots-bar .dot");

        item[indexActiveItem].classList.remove("active");

        if(direction == "left" && settings.endlessSlider === true){

            if (indexActiveItem > 1) { indexActiveItem--; }
            else { indexActiveItem = count - 1; }

        } else if (direction == "left" && settings.endlessSlider === false){

            if (indexActiveItem > 0) { indexActiveItem--; }

        }

        if(direction == "right" && settings.endlessSlider === true){ 

            if (indexActiveItem < count - 1) { indexActiveItem++; }
            else { indexActiveItem = 1; }

        } else if (direction == "right" && settings.endlessSlider === false){

            if (indexActiveItem < count) { indexActiveItem++; }

        }

        item[indexActiveItem].classList.add("active");

        try { dotsAnimation(dots, i); } 
        
        catch { return; }

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function dotsAnimation(dots, indexDot){

        dots[indexDot].classList.remove("dot-active");
                
        dots[document.querySelectorAll(sliderClassName + " " + ".slider-track" + " div.slide.active")[0].getAttribute("indexitem")].classList.add("dot-active");

    }

}