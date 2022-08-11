// ========== //
// Переменные //
// ========== //

let NumberItem = 1;
let idActiveSlide = 1;

const sliderContainer = document.getElementsByClassName("slider"); 
const galleryItems = document.querySelectorAll(".photos > div");
const gallery = document.getElementsByClassName("gallery");
const slidesTrack = document.getElementsByClassName("photos");

const time = 0.5;

function throttle(func, ms) {

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

        }, ms);

    }

}

// ============================================================================================================= //
// Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
// ============================================================================================================= //

function preparingGallery(toggle){

    slidesTrack[0].prepend(galleryItems[galleryItems.length - 1].cloneNode(true));

    slidesTrack[0].append(galleryItems[0].cloneNode(true));

    // Подготовка слайдов //
    
    function classIndent(){
        
        const galleryItems = document.querySelectorAll(".photos > div");
        
        for (let j = 0; j < galleryItems.length; j++){
        
            galleryItems[j].classList = "slide";
            galleryItems[j].setAttribute("indexItem", j - 1);
        
        }

        document.getElementsByClassName("slide")[1].classList.add("active");
        
    }

    // Подготовка стрелочек к работе //

    function preparingButtons(){

        let arrowRight = document.createElement("button");
        let arrowLeft = document.createElement("button");
    
        arrowRight.classList = "button"; arrowRight.id = "next";
        sliderContainer[0].append(arrowRight);
    
        arrowLeft.classList = "button"; arrowLeft.id = "prev";
        sliderContainer[0].prepend(arrowLeft);
    
    }

    // Подготовка индикации слайдера //

    switch(toggle){

        case true:

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

        case false:

            break;

    }

    preparingButtons();
    classIndent();

}

// ===================================================================================================================== //
// Функция, отвечающая за покраску слайдов в цвета радуги, если не имеются картинок для слайдера (можно не использовать) //
// ===================================================================================================================== //

function rainbowItems(){

    let items = document.getElementsByClassName("slide");

    for (let j = 0; j < items.length; j++){

        items[j].style.backgroundColor = "hsl(" + (50 * (j+1)) +", 100%, 23%)";

    }

}

// ============================================ //
// Функция, отвечающая за навигацию по слайдеру //
// ============================================ //

function sliderNavigation(prevButton, nextButton, items, transition, toggle){

    const countSlides = items.length - 1;

    // Левая стрелочка //

    prevButton.addEventListener("click", throttle(function(){

        slideScroll("left", countSlides, transition, items, toggle);

        ActiveSlide(items, countSlides, "prev", toggle);

    }, time * 1000));

    // Правая стрелочка //

    nextButton.addEventListener("click", throttle(function(){

        slideScroll("right", countSlides, transition, items);

        ActiveSlide(items, countSlides, "next", toggle);

    }, time * 1000));

}

// ====================================== //
// Запуск анимации пролистывания слайдера //
// ====================================== //

function slideScroll(direction, countSlides, transition, items, toggle){

    if (direction == "left" && NumberItem > 0){

        animationSlide(direction, countSlides, time, transition, items, toggle);

    } else if (direction == "right" && NumberItem < countSlides){

        animationSlide(direction, countSlides, time, transition, items,);

    }

}

// =============================== //
// Анимация пролистывания слайдера //
// =============================== //

function animationSlide(direction, countSlides, ms, transitionType, items){

    const slide = items[0].clientWidth;

    slidesTrack[0].style.transition = ms + "s " + transitionType;

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
        
            }, ms * 1000);
        
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
    
            }, ms * 1000)

            break;

    }

}

// =============================== //
// Индентификация активного слайда //
// =============================== //

function ActiveSlide(item, count, direction, toggle){

    let i = document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem");

    let dots = document.getElementsByClassName("dot");

    item[idActiveSlide].classList.remove("active");

    switch(direction){

        case "prev":
    
            if (idActiveSlide > 1) { idActiveSlide--; }

            else { idActiveSlide = count - 1; }

            break;

        case "next":
    
            if (idActiveSlide < count - 1) { idActiveSlide++; }
            
            else { idActiveSlide = 1; }

            break;
    
    }

    item[idActiveSlide].classList.add("active");

    switch(toggle){

        case true:

            dotsAnimation(dots, i);

        case false:
            
            return 0;

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

    dotsToggle = true;

    preparingGallery(dotsToggle);

    let items = document.getElementsByClassName("slide");

    sliderNavigation(document.getElementById("prev"), document.getElementById("next"), items, "ease-in-out", dotsToggle);

}

startGallery();