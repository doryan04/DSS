# DSS (Doryan Simple Slider)

![photo](pic/DSS.png)

Slider on native javascript and contains nothing extra.

## This is a very simple to use slider.

# How to use?

1. Create a construction in the "body" that looks like this:

```
<div class="YourSliderName">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
</div>
```
### WARNING


In case of using two or more sliders, please don't use the same name for all the sliders on the site or you will end up with a semi-non-working slider

To avoid the problem described above, do as indicated in the code below:
```
...
        <div class="YourSliderName_1">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </div>

        <div class="YourSliderName_2">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
        </div>

    </body>
    <script>
    
        startGallery(".YourSliderName_1,
        
            YourSettings_1 = {
                transition: "ease-in-out",
                dots: true,
                arrows: true,
                endlessSlider: false,
                speedAnimation: 500,
            }

        );

        startGallery(".YourSliderName_2",

            YourSettings_2 = {
                transition: "ease-in",
                dots: true,
                arrows: true,
                endlessSlider: true,
                speedAnimation: 200,
            }
        
        );
    </script>
</html>
```


2. Append in HTML document after tags ```<bodу>...</bodу>``` script tag:

```
<script type="text/javascript" src="scripts/script.js"> startGallery(".YourSliderName"); </script>
```
as shown in the code:

```
...
    <body>
        <div class="YourSliderName">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </div>
    </body>
    <script>
        startGallery(".YourSliderName");
    </script>
</html>
```

3. Configure the slider in the CSS file:

```
:root{
    --width: 640px;     //default width
    --height: 400px;    //default height
    --dots-size: 15px;  //default size a dots
}
```
4. Configure the slider in the js file:
```
const settings = {
    transition: "ease-in-out", // default transition for animation
    dots: "on",                // default toggle value
    speedAnimation: 500,       // default speed animation
}
```
5. All ready to go

## What on stady "work in progress"?

- [X] Support two or more sliders
- [ ] Dots navigation
- [X] Arrow toggle
- [X] Endless slider toggle
- [ ] Swipes on smartphones

## Did you find the bug? Make sure to [leave an issue](https://github.com/doryan04/DSS/issues/new) in case of any problems.

### Check out @tfk004 on Telegram. https://t.me/tfk004
