// ========== //
// Переменные //
// ========== //

let NumberItem = 1;

const prewButton = document.getElementById("prew");
const nextButton = document.getElementById("next");
const buttons = document.getElementsByClassName("button");
const galleryItems = document.querySelectorAll(".photos > div");
const slidesTrack = document.getElementsByClassName("photos")[0];
const time = 0.45;

// ============================================================================================================= //
// Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
// ============================================================================================================= //

function preparingGallery(){

    let lastElem = document.createElement("div");
    lastElem.textContent = galleryItems.length;
    slidesTrack.prepend(lastElem); 

    let firstElem = document.createElement("div");
    firstElem.textContent = 1;
    slidesTrack.append(firstElem);

    function classIndent(){

        const galleryItems = document.querySelectorAll(".photos > div");
        let countItems = galleryItems.length;
    
        for (let i = 0; i < countItems; i++){
    
            galleryItems[i].classList = "slide";
            galleryItems[i].setAttribute("indexItem", i);
    
        }
    
    }
    
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

// =========================== //
// Функция для запуска скрипта //
// =========================== //

function startGallery(){

    preparingGallery();
    //rainbowItems();

    const slide = document.getElementsByClassName("slide")[0].clientWidth;
    const countSlides = document.getElementsByClassName("slide").length - 1;

    let items = document.getElementsByClassName("slide");

    items[NumberItem].classList.add("active");

    prewButton.addEventListener('click', function(){

        prewButton.disabled = true;

        setTimeout(function(){

            prewButton.disabled = false;

        }, time * 1000);

        prew();

    });

    nextButton.addEventListener('click', function(){

        nextButton.disabled = true;
        
        setTimeout(function(){

            nextButton.disabled = false;

        }, time * 1000);

        next();

    });

    function prew(){

        if (NumberItem > 0){
            
            items[NumberItem].classList.remove("active");

            slidesTrack.style.transition = time + "s ease-out";

            NumberItem--;

            slidesTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";

            setTimeout(function(){

                slidesTrack.style.transition = null;

                if (NumberItem == 0){

                    items[NumberItem].classList.remove("active");
            
                    NumberItem = countSlides - 1;
            
                    slidesTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                    items[NumberItem].classList.add("active");
            
                }
    
            }, time * 1000);

            items[NumberItem].classList.add("active");

            console.log(NumberItem);

        }

    }

    function next(){

        if (NumberItem < countSlides){

            items[NumberItem].classList.remove("active");

            slidesTrack.style.transition = time + "s ease-out";

            NumberItem++;

            slidesTrack.style.transform = "translateX(-"+ ((slide) * NumberItem) +"px)";

            setTimeout(function(){

                slidesTrack.style.transition = null;

                if (NumberItem == countSlides){

                    items[NumberItem].classList.remove("active");
            
                    NumberItem = 1;
            
                    slidesTrack.style.transform = "translateX(-"+ ((slide) * (NumberItem)) +"px)";
            
                    items[NumberItem].classList.add("active");
            
                }
    
            }, time * 1000);

            items[NumberItem].classList.add("active");

            console.log(NumberItem);

        }

    }

}