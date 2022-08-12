// ========== //
// Переменные //
// ========== //

let NumberItem = 1;
let idActiveSlide = 1;

const sliderContainer = document.getElementsByClassName("slider"); 
const galleryItems = document.querySelectorAll(".photos > div");
const gallery = document.getElementsByClassName("gallery");
const slidesTrack = document.getElementsByClassName("photos");

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

    slidesTrack[0].prepend(galleryItems[galleryItems.length - 1].cloneNode(true));

    slidesTrack[0].append(galleryItems[0].cloneNode(true));

    // Подготовка слайдов //
    
    function classIndent(){
        
        const galleryItems = document.querySelectorAll(".photos > div");
        
        for (let j = 0; j < galleryItems.length; j++){
        
            galleryItems[j].classList = "slide";
            galleryItems[j].setAttribute("indexItem", j - 1)
        
        }

        document.getElementsByClassName("slide")[1].classList.add("active");
        
    }

    // Подготовка стрелочек к работе //

    function preparingButtons(){

        let arrowRight = document.createElement("button");
        let arrowLeft = document.createElement("button");
    
        arrowRight.classList = "button"; arrowRight.id = "right";
        arrowLeft.classList = "button"; arrowLeft.id = "left";

        sliderContainer[0].append(arrowRight);
        sliderContainer[0].prepend(arrowLeft);
    
    }

    // Подготовка индикации слайдера //

    switch(settings.dots){

        case "on":

            function preparingDotsBar(){

                let dotsBar = document.createElement("div");
        
                dotsBar.classList = "dots-bar";
                sliderContainer[0].append(dotsBar);
        
                // Генератор точек //
        
                function dotsGenerator(){
        
                    let dotsBarContainer = document.getElementsByClassName("dots-bar");
        
                    for (let i = 0; i < galleryItems.length; i++){
        
                        let dot = document.createElement("div");
            
                        dot.classList = "dot"; dot.id = i;
        
                        dotsBarContainer[0].append(dot);
            
                    }
        
                }
        
                dotsGenerator();
        
            }
        
            preparingDotsBar();
        
            document.getElementsByClassName("dot")[0].classList.add("dot-active");

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

    let left = document.getElementById("left");
    let right = document.getElementById("right");

    let items = document.getElementsByClassName("slide");

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

    slidesTrack[0].style.transition = settings.speedAnimation + "ms " + settings.transition;

    switch(direction){

        case "left":

            NumberItem--;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == 0){
                
                    NumberItem = countSlides - 1;

                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

                
                }
        
            }, settings.speedAnimation);
        
            break;

        case "right":

            NumberItem++;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * NumberItem) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == countSlides){

                    NumberItem = 1;
            
                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                }
    
            }, settings.speedAnimation)

            break;

    }

}

// =============================== //
// Индентификация активного слайда //
// =============================== //

function ActiveSlide(item, count, direction){

    let i = document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem");

    let dots = document.getElementsByClassName("dot");

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
            
    dots[document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem")].classList.add("dot-active");

}

// =========================== //
// Функция для запуска скрипта //
// =========================== //

function startGallery(){

    preparingGallery();

    sliderNavigation();

}

startGallery();