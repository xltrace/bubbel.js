# bubbel.js
*breidt HTML5 invoer elementen uit*

**bubbel.js** (uitgesproken als *bubbeltjes*, vanwege *bubbel-punt-js*) breidt HTML5 invoerelementen uit met meer complexe structuren door de ruwe HTML te vervangen.

### elements
Als conventie worden de namen van ``type=""`` in het Nederlands geschreven. De rest in het Engels.

```html
<input name="example[]" value='{"1":"a","2":"b"}' multiple="true" />
```

```html
<input assigned="true" multiple="true" />
```

```html
<input type="link" value="from~link:(extra)(extra)/description" data-search="/search.php" />
```

```html
<input type="qTranslate" value="[:en]English[:nl]Nederlands[:]" />
<textarea class="qTranslate" mode="short"></textarea>
```

```html
<input type="datum" require="year" disable="day" />
```

```html
<input type="recept" />
```

```html
<input type="frequentie" /><input type="periode" /><input type="hoeveelheid" />
```

```html
<input type="adres" data-lookup="/postcode-checker.php" />
```

```html
<input type="wetsartikel" />
```

### requirements
* jQuery
* Bootstrap CSS
* Font Awesome
* (mogelijk onbekende andere elementen aanwezig op de websites die gebruikt worden tijdens de ontwikkeling)
