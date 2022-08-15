function startGallery(sliderClassName, trackClassName){

    // ========== //
    // Переменные //
    // ========== //

    var NumberItem = 1;
    var idActiveSlide = 1;

    const sliderContainer = document.querySelectorAll(sliderClassName)[0]; 
    const sliderItems = document.querySelectorAll(sliderClassName + " " + trackClassName + " > div");
    const sliderTrack = document.querySelectorAll(trackClassName)[0];

    // Настройки слайдера //

    const settings = {
        transition: "ease-in-out",
        dots: "on",
        speedAnimation: 500,
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

    // ============================================================================================================= //
    // Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
    // ============================================================================================================= //

    function preparingGallery(){

        sliderTrack.prepend(sliderItems[sliderItems.length - 1].cloneNode(true));

        sliderTrack.append(sliderItems[0].cloneNode(true));

        // Подготовка слайдов //
        
        function classIndent(){
            
            var sliderItems = document.querySelectorAll(sliderClassName + " " + trackClassName + " > div");
            
            for (let j = 0; j < sliderItems.length; j++){
            
                sliderItems[j].classList = "slide";
                sliderItems[j].setAttribute("indexItem", j - 1)
            
            }

            document.querySelectorAll(sliderClassName + " " + trackClassName + " " + ".slide")[1].classList.add("active");
            
        }

        // Подготовка стрелочек к работе //

        function preparingButtons(){

            let arrowRight = document.createElement("button");
            let arrowLeft = document.createElement("button");
        
            arrowRight.classList = "button"; arrowRight.id = "right";
            arrowLeft.classList = "button"; arrowLeft.id = "left";

            sliderContainer.append(arrowRight);
            sliderContainer.prepend(arrowLeft);
        
        }

        // Подготовка индикации слайдера //

        switch(settings.dots){

            case "on":

                function preparingDotsBar(){

                    let dotsBar = document.createElement("div");
            
                    dotsBar.classList = "dots-bar";
                    sliderContainer.append(dotsBar);
            
                    // Генератор точек //
            
                    function dotsGenerator(){
            
                        let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar");
            
                        for (let i = 0; i < sliderItems.length; i++){
            
                            let dot = document.createElement("div");
                
                            dot.classList = "dot"; dot.id = i;
            
                            dotsBarContainer.append(dot);
                
                        }
            
                    }
            
                    dotsGenerator();
            
                }
            
                preparingDotsBar();
            
                document.querySelectorAll(sliderClassName + " .dots-bar .dot")[0].classList.add("dot-active");

                break;

            case "off":

                break;

        }

        preparingButtons();
        classIndent();

    }

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let left = document.querySelector(sliderClassName + " #left");
        let right = document.querySelector(sliderClassName + " #right");

        let items = document.querySelectorAll(sliderClassName + " " + trackClassName + " .slide");

        const countSlides = items.length - 1; 

        function leftArrow(){

            right.onclick = null;

            slideScroll(left.id, countSlides, items);
                        
            ActiveSlide(items, countSlides, left.id);

            setTimeout(() => {right.onclick = throttle(rightArrow, settings.speedAnimation);}, settings.speedAnimation);

        }

        function rightArrow(){

            left.onclick = null;

            slideScroll(right.id, countSlides, items);
                        
            ActiveSlide(items, countSlides, right.id);

            setTimeout(() => {left.onclick = throttle(leftArrow, settings.speedAnimation);}, settings.speedAnimation);

        }

        left.onclick = throttle(leftArrow, settings.speedAnimation);

        right.onclick = throttle(rightArrow, settings.speedAnimation);

    }

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideScroll(direction, countSlides, items){

        if (direction == "left" && NumberItem > 0){

            animationSlide(direction, countSlides, items);

        } else if (direction == "right" && NumberItem < countSlides){

            animationSlide(direction, countSlides, items);

        }

    }

    // =============================== //
    // Анимация пролистывания слайдера //
    // =============================== //

    function animationSlide(direction, countSlides, items){

        const slide = items[0].clientWidth;

        sliderTrack.style.transition = settings.speedAnimation + "ms " + settings.transition;

        switch(direction){

            case "left":

                NumberItem--;

                sliderTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

                setTimeout(function(){

                    sliderTrack.style.transition = null;

                    if (NumberItem == 0){
                    
                        NumberItem = countSlides - 1;

                        sliderTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

                    
                    }
            
                }, settings.speedAnimation);
            
                break;

            case "right":

                NumberItem++;

                sliderTrack.style.transform = "translateX(-"+ ((slide) * NumberItem) +"px)";

                setTimeout(function(){

                    sliderTrack.style.transition = null;

                    if (NumberItem == countSlides){

                        NumberItem = 1;
                
                        sliderTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
                
                    }
        
                }, settings.speedAnimation)

                break;

        }

    }

    // =============================== //
    // Индентификация активного слайда //
    // =============================== //

    function ActiveSlide(item, count, direction){

        let i = document.querySelectorAll(sliderClassName + " " + trackClassName + " div.slide.active")[0].getAttribute("indexitem");

        let dots = document.querySelectorAll(sliderClassName + " .dots-bar .dot");

        item[idActiveSlide].classList.remove("active");

        switch(direction){

            case "left":
        
                if (idActiveSlide > 1) { idActiveSlide--; }

                else { idActiveSlide = count - 1; }

                break;

            case "right":
        
                if (idActiveSlide < count - 1) { idActiveSlide++; }
                
                else { idActiveSlide = 1; }

                break;
        
        }

        item[idActiveSlide].classList.add("active");

        try {

            dotsAnimation(dots, i);

        } catch {

            return;

        }

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function dotsAnimation(dots, indexDot){

        dots[indexDot].classList.remove("dot-active");
                
        dots[document.querySelectorAll(sliderClassName + " " + trackClassName + " div.slide.active")[0].getAttribute("indexitem")].classList.add("dot-active");

    }

    preparingGallery();

    sliderNavigation();

}