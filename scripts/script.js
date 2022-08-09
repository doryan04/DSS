// ========== //
// Переменные //
// ========== //

let NumberItem = 1;

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

// ===================================================================================================================== //
//   //
// ===================================================================================================================== //

function dotsAnimation(prevButton, nextButton, items){
    
    let dots = document.getElementsByClassName("dot");

    let indexDot = 0;

    dots[indexDot].classList.add("dot-active");

    prevButton.addEventListener('click', function(){

        if(indexDot != 0){

            dots[indexDot].classList.remove("dot-active");

            indexDot--;

            dots[indexDot].classList.add("dot-active");

        } else {

            dots[indexDot].classList.remove("dot-active");

            indexDot = dots.length - 1;

            dots[indexDot].classList.add("dot-active");

        }

    });

    nextButton.addEventListener('click', function(){

        if (indexDot != items.length - 3){

            dots[indexDot].classList.remove("dot-active");

            indexDot++;

            dots[indexDot].classList.add("dot-active");

        } else {

            dots[indexDot].classList.remove("dot-active");

            indexDot = 0;

            dots[indexDot].classList.add("dot-active");

        }

    });

}

// ============================ //
// Функция для работы стрелочек //
// ============================ //

function arrows(prevButton, nextButton, items){

    const slide = items[0].clientWidth;
    const countSlides = items.length - 1;

    prevButton.addEventListener('click', function(){

        prevButton.disabled = true;

        setTimeout(function(){

            prevButton.disabled = false;

        }, time * 1000);

        prev();

    });

    nextButton.addEventListener('click', function(){

        nextButton.disabled = true;
        
        setTimeout(function(){

            nextButton.disabled = false;

        }, time * 1000);

        next();

    });

    function prev(){

        if (NumberItem > 0){
            
            items[NumberItem].classList.remove("active");

            slidesTrack[0].style.transition = time + "s ease-out";

            NumberItem--;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == 0){

                    items[NumberItem].classList.remove("active");
            
                    NumberItem = countSlides - 1;
            
                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                    items[NumberItem].classList.add("active");
            
                }
    
            }, time * 1000);

            if (NumberItem != 0){

                items[NumberItem].classList.add("active");

            }

        }

    }

    function next(){

        if (NumberItem < countSlides){

            items[NumberItem].classList.remove("active");

            slidesTrack[0].style.transition = time + "s ease-out";

            NumberItem++;

            slidesTrack[0].style.transform = "translateX(-"+ ((slide) * NumberItem) +"px)";

            setTimeout(function(){

                slidesTrack[0].style.transition = null;

                if (NumberItem == countSlides){

                    items[NumberItem].classList.remove("active");
            
                    NumberItem = 1;
            
                    slidesTrack[0].style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                    items[NumberItem].classList.add("active");
            
                }
    
            }, time * 1000)

                items[NumberItem].classList.add("active");

        }

    }

}

// =========================== //
// Функция для запуска скрипта //
// =========================== //

function startGallery(){

    preparingGallery();

    let items = document.getElementsByClassName("slide");

    items[NumberItem].classList.add("active");

    arrows(document.getElementById("prev"), document.getElementById("next"), items);
    dotsAnimation(document.getElementById("prev"), document.getElementById("next"), items);

}

startGallery();