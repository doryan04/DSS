# DSS (Doryan Simple Slider)

![photo](png/dss.png)

Slider on native javascript and contains nothing extra.

## This is a very simple to use slider.

# How to use?

1. Create a construction in the ```<body>...</body>``` that looks like this:

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
    
        DSS_start(".YourSliderName"_1,
        
            exampleSettings = {

                autoPlaySlider:         false,
                arrows:                 true,
                prewArrow:              "a_left",
                nextArrow:              "a_right",
                bullets:                true,
                bulletsEffect:          "bullet-pull",
                endlessSlider:          true,
                autoSetterMargins:      false,
                presentationMode:       true,
                thumbSlidesClassName:   "slide-thumb",
                speedAnimation:         400,
                transition:             "ease-in-out",
                swipeScroll:            false,
                
            }
        
        );

        DSS_start(".YourSliderNam_2",
        
            exampleSettings = {

                autoPlaySlider:         true,
                autoPlayDelay:          1000,
                autoPlayDirrection:     "right",
                arrows:                 false,
                bullets:                false,
                bulletsEffect:          "bullet-pull",
                endlessSlider:          false,
                autoSetterMargins:      false,
                presentationMode:       true,
                thumbSlidesClassName:   "slide-thumb",
                speedAnimation:         400,
                transition:             "ease-in-out",
                swipeScroll:            true,
                
            }
        
        );

    </script>
</html>
```
You can not configure the slider, but just call the function where you passed the slider class name:

```
...
        DSS_start(".YourSliderName");
    </script>
</html>
```

2. Insert the line with the JavaScript file in the ```<head>...</head>``` tags:

```
<script type="text/javascript" src="ds_slider/ds_slider.js"></script>
```
as shown in the code:

```
<html>
    <head>
        ...
        <script type="text/javascript" src="ds_slider/ds_slider.js"></script>
    </head>
    <body>
        <div class="YourSliderName">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
        </div>
    </body>
    <script>
        DSS_start(".YourSliderName");
    </script>
</html>
```
and only then after ```</body>``` tag insert the ```<script>``` tag, where you call the function to run the slider, like in the example above.

3. Configure the slider in the SASS files:

```
$width-container: 800px     //default width of main visible slider part 
$width: 1600px              //default width
$height: 300px              //default height
$dots-size: 15px            //default size a dots
```

4. Configure the slider to your liking:
```
settings = {

    autoPlaySlider: true,                   // Auto play toggle
    autoPlayDelay: 1000,                    // Auto play delay
    autoPlayDirrection: "left",             // Auto play dirrection
    arrows: true,                           // Arrows toggle
    prewArrow:              "a_left",       // Class name for left arrow
    nextArrow:              "a_right",      // Class name for right arrow
    bullets:                true,           // Bullets (dots), which are responsible for the indication of the active slide
    bulletsEffect:          "bullet-pull",  // Appearance of bullets (dots)
    endlessSlider:          true,           // Endless slider toggle (infinity slider)
    autoSetterMargins:      false,          // Auto setter margins for slides
    presentationMode:       true,           // Slider with thumbtrack under gallery
    thumbSlidesClassName:   "slide-thumb",  // Class name for thumbnails
    speedAnimation:         500,            // Speed of scrolling animation
    transition:             "ease",         // Animation type for the slider scrolling
    swipeScroll:            true,           // Scrolling with swipes (working on PC and smartphones)

}
```
Then enter all the settings into the slider function, as shown in the example below:
```
        ...
    </body>
    <script>
        DSS_start(".YourSliderName",
        
            exampleSettings = {

                autoPlaySlider:         false,
                autoPlayDelay:          1000,
                autoPlayDirrection:     "left",
                arrows:                 false,
                prewArrow:              "a_left",
                nextArrow:              "a_right",
                bullets:                false,
                bulletsEffect:          "bullet-pull",
                endlessSlider:          true,
                autoSetterMargins:      false,
                presentationMode:       true,
                thumbSlidesClassName:   "slide-thumb",
                speedAnimation:         400,
                transition:             "ease-in-out",
                swipeScroll:            false,
                
            }
        
        );
    </script>
</html>
```
5. All ready to go

## At the moment the slider is built into my website and works great (v0.2.0 BETA):

![photo](pic/site_update.png)

## What on stady "work in progress"?

- [X] Dots navigation
- [X] Swipes on smartphones
- [ ] Events controller

## Did you find the bug? Make sure to [leave an issue](https://github.com/doryan04/DSS/issues/new) in case of any problems.

### Check out @tfk004 on Telegram. https://t.me/doryanProjects
