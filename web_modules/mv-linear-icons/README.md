# mv-linear-icons

 MvLinearIcon is a Meveo icon component (based on lit-element) that renders [Linearicons Free](https://linearicons.com/free) library icons.

## Features
* Written in vanilla javascript
* Simplifies icon loading from the library using only the icon name without the prefix


## Quick Start

To experiment with the MvLinearIcon component.

1. Clone this repo.
2. Serve the project from the root directory with some http server (best served with meveo itself)
3. Make sure the following style is declared.

   ```html
    <style>
      @font-face {
        font-family: 'Linearicons-Free';
        src: url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.eot?w118d');
        src: url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.eot?#iefixw118d') format('embedded-opentype'),
          url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.woff2?w118d') format('woff2'),
          url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.woff?w118d') format('woff'),
          url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.ttf?w118d') format('truetype'),
          url('{REPLACE_WITH_PATH_TO}/fonts/Linearicons-Free.svg?w118d#Linearicons-Free') format('svg');
        font-weight: normal;
        font-style: normal;
      }
    </style>
    ```

4. View the index.html to see available icons, then use the component to load the chosen icon e.g.

   ```html
   <mv-lnr icon="home"></mv-lnr>
   ```

## Acknowledgements

* Uses [Linearicons Free](https://linearicons.com/free) library icons by [Perxis](https://perxis.com/)
