// ========== //
// Переменные //
// ========== //

let NumberItem = 1;
let idActiveSlide = 0;

const sliderContainer = document.getElementsByClassName("slider"); 
const galleryItems = document.querySelectorAll(".photos > div");
const gallery = document.getElementsByClassName("gallery");
const slidesTrack = document.getElementsByClassName("photos");

const time = 0.5;

// ============================================================================================================= //
// Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
// ============================================================================================================= //

function preparingGallery(){

    slidesTrack[0].prepend(galleryItems[galleryItems.length - 1].cloneNode(true));

    slidesTrack[0].append(galleryItems[0].cloneNode(true));
    
    function classIndent(){
        
        const galleryItems = document.querySelectorAll(".photos > div");
        
        for (let j = 0; j < galleryItems.length; j++){
        
            galleryItems[j].classList = "slide";
            galleryItems[j].setAttribute("indexItem", j - 1);
        
        }
        
    }

    function preparingButtons(){

        let arrowRight = document.createElement("button");
        let arrowLeft = document.createElement("button");
    
        arrowRight.classList = "button"; arrowRight.id = "next";
        sliderContainer[0].append(arrowRight);
    
        arrowLeft.classList = "button"; arrowLeft.id = "prev";
        sliderContainer[0].prepend(arrowLeft);
    
    }

    function preparingDotsBar(){

        let dotsBar = document.createElement("div");

        dotsBar.classList = "dots-bar";
        sliderContainer[0].append(dotsBar);

        function dotsGenerator(){

            let dotsBarContainer = document.getElementsByClassName("dots-bar");

            for (let i = 0; i < galleryItems.length; i++){

                let dot = document.createElement("div");
    
                dot.classList = "dot"; dot.id = i + 1;

                dotsBarContainer[0].append(dot);
    
            }

        }

        dotsGenerator();

    }

    preparingDotsBar();
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

// ======================================== //
// Функция, отвечающая за индикацию слайдов //
// ======================================== //

function dotsAnimation(prevButton, nextButton, items, toggle){

    switch(toggle){

        case true:

            let dots = document.getElementsByClassName("dot");

            let indexDot = document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem");

            dots[indexDot].classList.add("dot-active");

            prevButton.addEventListener('click', function(){

                dots[indexDot].classList.remove("dot-active");

                if(indexDot != 0){ indexDot = document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem"); } 
                
                else { indexDot = dots.length - 1; }

                dots[indexDot].classList.add("dot-active");

            });

            nextButton.addEventListener('click', function(){
                
                dots[indexDot].classList.remove("dot-active");

                if (indexDot != items.length - 3){ indexDot = document.querySelectorAll("div.slide.active")[0].getAttribute("indexitem");} 
                
                else { indexDot = 0; }

                dots[indexDot].classList.add("dot-active");

            });

            break;
        
        case false:
    
            sliderContainer[0].removeChild(document.getElementsByClassName("dots-bar")[0]);

            break;

    }

}

// ============================ //
// Функция для работы стрелочек //
// ============================ //

function arrows(prevButton, nextButton, items, transition){

    const slide = items[0].clientWidth;
    const countSlides = items.length - 1;

    let itemsActive = document.getElementsByClassName("slide");

    itemsActive = Array.from(items).slice(1, countSlides);

    itemsActive[0].classList.add("active");

    prevButton.addEventListener('click', function(){

        this.disabled = true;

        prev(transition);

        ActiveSlide(itemsActive, countSlides, "prev");

        setTimeout(() => prevButton.disabled = false, time * 1000);

    });

    nextButton.addEventListener('click', function(){

        this.disabled = true;

        next(transition);

        ActiveSlide(itemsActive, countSlides, "next");
        
        setTimeout(() => nextButton.disabled = false, time * 1000);

    });

    function prev(transitionType){


        if (NumberItem > 0){

            slidesTrack[0].style.transition = time + "s " + transitionType;

            NumberItem--;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == 0){
            
                    NumberItem = countSlides - 1;
            
                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                }
    
            }, time * 1000);

        }

    }

    function next(transitionType){

        if (NumberItem < countSlides){

            slidesTrack[0].style.transition = time + "s " + transitionType;

            NumberItem++;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * NumberItem) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == countSlides){

                    NumberItem = 1;
            
                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                }
    
            }, time * 1000)

        }

    }

}

function ActiveSlide(item, count, direction){

    item[idActiveSlide].classList.remove("active");

    switch(direction){

        case "prev":
    
            if (idActiveSlide > 0) { idActiveSlide--; }

            else { idActiveSlide = count - 2; }

            break;

        case "next":
    
            if (idActiveSlide < count - 2) { idActiveSlide++; }
            
            else { idActiveSlide = 0; }

            break;
    
    }

    item[idActiveSlide].classList.add("active");

}

// =========================== //
// Функция для запуска скрипта //
// =========================== //

function startGallery(){

    preparingGallery();

    let items = document.getElementsByClassName("slide");

    arrows(document.getElementById("prev"), document.getElementById("next"), items, "ease-in-out");
    dotsAnimation(document.getElementById("prev"), document.getElementById("next"), items, true);

}

startGallery();