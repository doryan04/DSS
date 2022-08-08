let NumberItem = 1;

function preparingGallery(){

    const galleryItems = document.querySelectorAll(".photos > div");
    const slidesTrack = document.getElementsByClassName("photos")[0];

    let lastElem = document.createElement("div");
    lastElem.textContent = galleryItems.length;
    slidesTrack.prepend(lastElem); 

    let firstElem = document.createElement("div");
    firstElem.textContent = 1;
    slidesTrack.append(firstElem);

}

function startGallery(){

    preparingGallery();
    classIndent();
    rainbowItems();

}

function classIndent(){

    const galleryItems = document.querySelectorAll(".photos > div");
    let countItems = galleryItems.length;

    for (let i = 0; i < countItems; i++){

        galleryItems[i].classList = "slide";
        galleryItems[i].setAttribute("indexItem", i);

    }

}


function rainbowItems(){

    let items = document.getElementsByClassName("slide");

    for (let j = 0; j < items.length; j++){

        items[j].style.backgroundColor = "hsl(" + (50 * (j+1)) +", 100%, 23%)";

    }

}

function scrollPrewPic(){

    if (NumberItem > 0){

        NumberItem--;
        let track = document.getElementsByClassName("photos")[0];
        let widthItem = document.getElementsByClassName("slide")[0].clientWidth;

        track.style.transform = "translateX(-"+ (widthItem * (NumberItem)) +"px)";

    }

}

function scrollNextPic(){

    if (NumberItem < 9){

        NumberItem++;
        let track = document.getElementsByClassName("photos")[0];
        let widthItem = document.getElementsByClassName("slide")[0].clientWidth;

        track.style.transform = "translateX(-"+ (widthItem * NumberItem) +"px)";

    }

}