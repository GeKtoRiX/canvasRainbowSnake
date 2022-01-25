/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@chriscourses/perlin-noise/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@chriscourses/perlin-noise/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noise": () => (/* binding */ noise),
/* harmony export */   "noiseDetail": () => (/* binding */ noiseDetail),
/* harmony export */   "noiseSeed": () => (/* binding */ noiseSeed)
/* harmony export */ });
//////////////////////////////////////////////////////////////

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/main/introduction/Noise1D/noise.js

/**
 * @module Math
 * @submodule Noise
 * @for p5
 * @requires core
 */

const PERLIN_YWRAPB = 4
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB
const PERLIN_ZWRAPB = 8
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB
const PERLIN_SIZE = 4095

let perlin_octaves = 4 // default to medium smooth
let perlin_amp_falloff = 0.5 // 50% reduction/octave

const scaled_cosine = (i) => 0.5 * (1.0 - Math.cos(i * Math.PI))

let perlin // will be initialized lazily by noise() or noiseSeed()

/**
 * Returns the Perlin noise value at specified coordinates. Perlin noise is
 * a random sequence generator producing a more naturally ordered, harmonic
 * succession of numbers compared to the standard <b>random()</b> function.
 * It was invented by Ken Perlin in the 1980s and been used since in
 * graphical applications to produce procedural textures, natural motion,
 * shapes, terrains etc.<br /><br /> The main difference to the
 * <b>random()</b> function is that Perlin noise is defined in an infinite
 * n-dimensional space where each pair of coordinates corresponds to a
 * fixed semi-random value (fixed only for the lifespan of the program; see
 * the <a href="#/p5/noiseSeed">noiseSeed()</a> function). p5.js can compute 1D, 2D and 3D noise,
 * depending on the number of coordinates given. The resulting value will
 * always be between 0.0 and 1.0. The noise value can be animated by moving
 * through the noise space as demonstrated in the example above. The 2nd
 * and 3rd dimension can also be interpreted as time.<br /><br />The actual
 * noise is structured similar to an audio signal, in respect to the
 * function's use of frequencies. Similar to the concept of harmonics in
 * physics, perlin noise is computed over several octaves which are added
 * together for the final result. <br /><br />Another way to adjust the
 * character of the resulting sequence is the scale of the input
 * coordinates. As the function works within an infinite space the value of
 * the coordinates doesn't matter as such, only the distance between
 * successive coordinates does (eg. when using <b>noise()</b> within a
 * loop). As a general rule the smaller the difference between coordinates,
 * the smoother the resulting noise sequence will be. Steps of 0.005-0.03
 * work best for most applications, but this will differ depending on use.
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space
 * @param  {Number} [y] y-coordinate in noise space
 * @param  {Number} [z] z-coordinate in noise space
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates
 * @example
 * <div>
 * <code>
 * let xoff = 0.0;
 *
 * function draw() {
 *   background(204);
 *   xoff = xoff + 0.01;
 *   let n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 * <div>
 * <code>let noiseScale=0.02;
 *
 * function draw() {
 *   background(0);
 *   for (let x=0; x < width; x++) {
 *     let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
 *     stroke(noiseVal*255);
 *     line(x, mouseY+noiseVal*80, x, height);
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical line moves left to right with updating noise values.
 * horizontal wave pattern effected by mouse x-position & updating noise values.
 */

const noise = function(x, y = 0, z = 0) {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1)
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random()
    }
  }

  if (x < 0) {
    x = -x
  }
  if (y < 0) {
    y = -y
  }
  if (z < 0) {
    z = -z
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z)
  let xf = x - xi
  let yf = y - yi
  let zf = z - zi
  let rxf, ryf

  let r = 0
  let ampl = 0.5

  let n1, n2, n3

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB)

    rxf = scaled_cosine(xf)
    ryf = scaled_cosine(yf)

    n1 = perlin[of & PERLIN_SIZE]
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1)
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2)
    n1 += ryf * (n2 - n1)

    of += PERLIN_ZWRAP
    n2 = perlin[of & PERLIN_SIZE]
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2)
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE]
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3)
    n2 += ryf * (n3 - n2)

    n1 += scaled_cosine(zf) * (n2 - n1)

    r += n1 * ampl
    ampl *= perlin_amp_falloff
    xi <<= 1
    xf *= 2
    yi <<= 1
    yf *= 2
    zi <<= 1
    zf *= 2

    if (xf >= 1.0) {
      xi++
      xf--
    }
    if (yf >= 1.0) {
      yi++
      yf--
    }
    if (zf >= 1.0) {
      zi++
      zf--
    }
  }
  return r
}

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence.
 *
 * By default, noise is computed over 4 octaves with each octave contributing
 * exactly half than its predecessor, starting at 50% strength for the 1st
 * octave. This falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.
 *
 * By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 * let noiseVal;
 * let noiseScale = 0.02;
 *
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (let y = 0; y < height; y++) {
 *     for (let x = 0; x < width / 2; x++) {
 *       noiseDetail(2, 0.2);
 *       noiseVal = noise((mouseX + x) * noiseScale, (mouseY + y) * noiseScale);
 *       stroke(noiseVal * 255);
 *       point(x, y);
 *       noiseDetail(8, 0.65);
 *       noiseVal = noise(
 *         (mouseX + x + width / 2) * noiseScale,
 *         (mouseY + y) * noiseScale
 *       );
 *       stroke(noiseVal * 255);
 *       point(x + width / 2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 vertical grey smokey patterns affected my mouse x-position and noise.
 */
const noiseDetail = function(lod, falloff) {
  if (lod > 0) {
    perlin_octaves = lod
  }
  if (falloff > 0) {
    perlin_amp_falloff = falloff
  }
}

/**
 * Sets the seed value for <b>noise()</b>. By default, <b>noise()</b>
 * produces different results each time the program is run. Set the
 * <b>value</b> parameter to a constant to return the same pseudo-random
 * numbers each time the software is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>let xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   let n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical grey lines drawing in pattern affected by noise.
 */
const noiseSeed = function(seed) {
  // Linear Congruential Generator
  // Variant of a Lehman Generator
  const lcg = (() => {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    const m = 4294967296
    // a - 1 should be divisible by m's prime factors
    const a = 1664525
    // c and m should be co-prime
    const c = 1013904223
    let seed, z
    return {
      setSeed(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0
      },
      getSeed() {
        return seed
      },
      rand() {
        // define the recurrence relationship
        z = (a * z + c) % m
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m
      }
    }
  })()

  lcg.setSeed(seed)
  perlin = new Array(PERLIN_SIZE + 1)
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand()
  }
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/main.css":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/main.css ***!
  \************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body{\r\n    margin: 0;\r\n}", "",{"version":3,"sources":["webpack://./src/main.css"],"names":[],"mappings":"AAAA;IACI,SAAS;AACb","sourcesContent":["body{\r\n    margin: 0;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./main.css */ "./node_modules/css-loader/dist/cjs.js!./src/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ "./src/main.css");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }



var _require = __webpack_require__(/*! @chriscourses/perlin-noise */ "./node_modules/@chriscourses/perlin-noise/index.js"),
    noise = _require.noise;

var htmlCanvas = document.getElementById('canvas');
var canvas = htmlCanvas.getContext('2d');
htmlCanvas.width = window.innerWidth - 4;
htmlCanvas.height = window.innerHeight - 4;
addEventListener('resize', function () {
  htmlCanvas.width = window.innerWidth - 4;
  htmlCanvas.height = window.innerHeight - 4;
});

var Circle = /*#__PURE__*/function () {
  function Circle(x, y, radius, color, offset) {
    _classCallCheck(this, Circle);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.offset = offset;
    this.color = color;
  }

  _createClass(Circle, [{
    key: "draw",
    value: function draw() {
      canvas.beginPath();
      canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 180, false);
      canvas.fillStyle = this.color;
      canvas.fill();
      canvas.closePath();
    }
  }, {
    key: "update",
    value: function update() {
      this.draw();
    }
  }]);

  return Circle;
}();

var circles = [];

for (var i = 0; i < 100; i++) {
  circles.push(new Circle(-30, -30, "25", "hsl(".concat(Math.random() * 360, ",50%,50%)"), i * 0.01));
}

var time = 0;

function animate() {
  canvas.fillStyle = 'rgba(0, 0, 0, 0.01)';
  canvas.fillRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  circles.forEach(function (circle) {
    circle.update();
    circle.x = noise(time + circle.offset + 20) * htmlCanvas.width;
    circle.y = noise(time + circle.offset) * htmlCanvas.height;
  });
  time += 0.005;
  requestAnimationFrame(animate);
}

animate();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LElBQUksSUFBSSxLQUFSO0FBQ0FNLEVBQUFBLHFCQUFxQixDQUFDTCxPQUFELENBQXJCO0FBQ0g7O0FBQ0RBLE9BQU8sRyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvZGUvLi9ub2RlX21vZHVsZXMvQGNocmlzY291cnNlcy9wZXJsaW4tbm9pc2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY29kZS8uL3NyYy9tYWluLmNzcyIsIndlYnBhY2s6Ly9jb2RlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9jb2RlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vY29kZS8uL3NyYy9tYWluLmNzcz9kZGQzIiwid2VicGFjazovL2NvZGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vY29kZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vY29kZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9jb2RlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2NvZGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9jb2RlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vY29kZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jb2RlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NvZGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NvZGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jb2RlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY29kZS8uL3NyYy9jYW52YXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8gaHR0cDovL21ybC5ueXUuZWR1L35wZXJsaW4vbm9pc2UvXG4vLyBBZGFwdGluZyBmcm9tIFBBcHBsZXQuamF2YVxuLy8gd2hpY2ggd2FzIGFkYXB0ZWQgZnJvbSB0b3hpXG4vLyB3aGljaCB3YXMgYWRhcHRlZCBmcm9tIHRoZSBnZXJtYW4gZGVtbyBncm91cCBmYXJicmF1c2NoXG4vLyBhcyB1c2VkIGluIHRoZWlyIGRlbW8gXCJhcnRcIjogaHR0cDovL3d3dy5mYXJiLXJhdXNjaC5kZS9mcjAxMHNyYy56aXBcblxuLy8gc29tZWRheSB3ZSBtaWdodCBjb25zaWRlciB1c2luZyBcImltcHJvdmVkIG5vaXNlXCJcbi8vIGh0dHA6Ly9tcmwubnl1LmVkdS9+cGVybGluL3BhcGVyNDQ1LnBkZlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vc2hpZmZtYW4vVGhlLU5hdHVyZS1vZi1Db2RlLUV4YW1wbGVzLXA1LmpzL1xuLy8gICAgICBibG9iL21haW4vaW50cm9kdWN0aW9uL05vaXNlMUQvbm9pc2UuanNcblxuLyoqXG4gKiBAbW9kdWxlIE1hdGhcbiAqIEBzdWJtb2R1bGUgTm9pc2VcbiAqIEBmb3IgcDVcbiAqIEByZXF1aXJlcyBjb3JlXG4gKi9cblxuY29uc3QgUEVSTElOX1lXUkFQQiA9IDRcbmNvbnN0IFBFUkxJTl9ZV1JBUCA9IDEgPDwgUEVSTElOX1lXUkFQQlxuY29uc3QgUEVSTElOX1pXUkFQQiA9IDhcbmNvbnN0IFBFUkxJTl9aV1JBUCA9IDEgPDwgUEVSTElOX1pXUkFQQlxuY29uc3QgUEVSTElOX1NJWkUgPSA0MDk1XG5cbmxldCBwZXJsaW5fb2N0YXZlcyA9IDQgLy8gZGVmYXVsdCB0byBtZWRpdW0gc21vb3RoXG5sZXQgcGVybGluX2FtcF9mYWxsb2ZmID0gMC41IC8vIDUwJSByZWR1Y3Rpb24vb2N0YXZlXG5cbmNvbnN0IHNjYWxlZF9jb3NpbmUgPSAoaSkgPT4gMC41ICogKDEuMCAtIE1hdGguY29zKGkgKiBNYXRoLlBJKSlcblxubGV0IHBlcmxpbiAvLyB3aWxsIGJlIGluaXRpYWxpemVkIGxhemlseSBieSBub2lzZSgpIG9yIG5vaXNlU2VlZCgpXG5cbi8qKlxuICogUmV0dXJucyB0aGUgUGVybGluIG5vaXNlIHZhbHVlIGF0IHNwZWNpZmllZCBjb29yZGluYXRlcy4gUGVybGluIG5vaXNlIGlzXG4gKiBhIHJhbmRvbSBzZXF1ZW5jZSBnZW5lcmF0b3IgcHJvZHVjaW5nIGEgbW9yZSBuYXR1cmFsbHkgb3JkZXJlZCwgaGFybW9uaWNcbiAqIHN1Y2Nlc3Npb24gb2YgbnVtYmVycyBjb21wYXJlZCB0byB0aGUgc3RhbmRhcmQgPGI+cmFuZG9tKCk8L2I+IGZ1bmN0aW9uLlxuICogSXQgd2FzIGludmVudGVkIGJ5IEtlbiBQZXJsaW4gaW4gdGhlIDE5ODBzIGFuZCBiZWVuIHVzZWQgc2luY2UgaW5cbiAqIGdyYXBoaWNhbCBhcHBsaWNhdGlvbnMgdG8gcHJvZHVjZSBwcm9jZWR1cmFsIHRleHR1cmVzLCBuYXR1cmFsIG1vdGlvbixcbiAqIHNoYXBlcywgdGVycmFpbnMgZXRjLjxiciAvPjxiciAvPiBUaGUgbWFpbiBkaWZmZXJlbmNlIHRvIHRoZVxuICogPGI+cmFuZG9tKCk8L2I+IGZ1bmN0aW9uIGlzIHRoYXQgUGVybGluIG5vaXNlIGlzIGRlZmluZWQgaW4gYW4gaW5maW5pdGVcbiAqIG4tZGltZW5zaW9uYWwgc3BhY2Ugd2hlcmUgZWFjaCBwYWlyIG9mIGNvb3JkaW5hdGVzIGNvcnJlc3BvbmRzIHRvIGFcbiAqIGZpeGVkIHNlbWktcmFuZG9tIHZhbHVlIChmaXhlZCBvbmx5IGZvciB0aGUgbGlmZXNwYW4gb2YgdGhlIHByb2dyYW07IHNlZVxuICogdGhlIDxhIGhyZWY9XCIjL3A1L25vaXNlU2VlZFwiPm5vaXNlU2VlZCgpPC9hPiBmdW5jdGlvbikuIHA1LmpzIGNhbiBjb21wdXRlIDFELCAyRCBhbmQgM0Qgbm9pc2UsXG4gKiBkZXBlbmRpbmcgb24gdGhlIG51bWJlciBvZiBjb29yZGluYXRlcyBnaXZlbi4gVGhlIHJlc3VsdGluZyB2YWx1ZSB3aWxsXG4gKiBhbHdheXMgYmUgYmV0d2VlbiAwLjAgYW5kIDEuMC4gVGhlIG5vaXNlIHZhbHVlIGNhbiBiZSBhbmltYXRlZCBieSBtb3ZpbmdcbiAqIHRocm91Z2ggdGhlIG5vaXNlIHNwYWNlIGFzIGRlbW9uc3RyYXRlZCBpbiB0aGUgZXhhbXBsZSBhYm92ZS4gVGhlIDJuZFxuICogYW5kIDNyZCBkaW1lbnNpb24gY2FuIGFsc28gYmUgaW50ZXJwcmV0ZWQgYXMgdGltZS48YnIgLz48YnIgLz5UaGUgYWN0dWFsXG4gKiBub2lzZSBpcyBzdHJ1Y3R1cmVkIHNpbWlsYXIgdG8gYW4gYXVkaW8gc2lnbmFsLCBpbiByZXNwZWN0IHRvIHRoZVxuICogZnVuY3Rpb24ncyB1c2Ugb2YgZnJlcXVlbmNpZXMuIFNpbWlsYXIgdG8gdGhlIGNvbmNlcHQgb2YgaGFybW9uaWNzIGluXG4gKiBwaHlzaWNzLCBwZXJsaW4gbm9pc2UgaXMgY29tcHV0ZWQgb3ZlciBzZXZlcmFsIG9jdGF2ZXMgd2hpY2ggYXJlIGFkZGVkXG4gKiB0b2dldGhlciBmb3IgdGhlIGZpbmFsIHJlc3VsdC4gPGJyIC8+PGJyIC8+QW5vdGhlciB3YXkgdG8gYWRqdXN0IHRoZVxuICogY2hhcmFjdGVyIG9mIHRoZSByZXN1bHRpbmcgc2VxdWVuY2UgaXMgdGhlIHNjYWxlIG9mIHRoZSBpbnB1dFxuICogY29vcmRpbmF0ZXMuIEFzIHRoZSBmdW5jdGlvbiB3b3JrcyB3aXRoaW4gYW4gaW5maW5pdGUgc3BhY2UgdGhlIHZhbHVlIG9mXG4gKiB0aGUgY29vcmRpbmF0ZXMgZG9lc24ndCBtYXR0ZXIgYXMgc3VjaCwgb25seSB0aGUgZGlzdGFuY2UgYmV0d2VlblxuICogc3VjY2Vzc2l2ZSBjb29yZGluYXRlcyBkb2VzIChlZy4gd2hlbiB1c2luZyA8Yj5ub2lzZSgpPC9iPiB3aXRoaW4gYVxuICogbG9vcCkuIEFzIGEgZ2VuZXJhbCBydWxlIHRoZSBzbWFsbGVyIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gY29vcmRpbmF0ZXMsXG4gKiB0aGUgc21vb3RoZXIgdGhlIHJlc3VsdGluZyBub2lzZSBzZXF1ZW5jZSB3aWxsIGJlLiBTdGVwcyBvZiAwLjAwNS0wLjAzXG4gKiB3b3JrIGJlc3QgZm9yIG1vc3QgYXBwbGljYXRpb25zLCBidXQgdGhpcyB3aWxsIGRpZmZlciBkZXBlbmRpbmcgb24gdXNlLlxuICpcbiAqIEBtZXRob2Qgbm9pc2VcbiAqIEBwYXJhbSAge051bWJlcn0geCAgIHgtY29vcmRpbmF0ZSBpbiBub2lzZSBzcGFjZVxuICogQHBhcmFtICB7TnVtYmVyfSBbeV0geS1jb29yZGluYXRlIGluIG5vaXNlIHNwYWNlXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFt6XSB6LWNvb3JkaW5hdGUgaW4gbm9pc2Ugc3BhY2VcbiAqIEByZXR1cm4ge051bWJlcn0gICAgIFBlcmxpbiBub2lzZSB2YWx1ZSAoYmV0d2VlbiAwIGFuZCAxKSBhdCBzcGVjaWZpZWRcbiAqICAgICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGVzXG4gKiBAZXhhbXBsZVxuICogPGRpdj5cbiAqIDxjb2RlPlxuICogbGV0IHhvZmYgPSAwLjA7XG4gKlxuICogZnVuY3Rpb24gZHJhdygpIHtcbiAqICAgYmFja2dyb3VuZCgyMDQpO1xuICogICB4b2ZmID0geG9mZiArIDAuMDE7XG4gKiAgIGxldCBuID0gbm9pc2UoeG9mZikgKiB3aWR0aDtcbiAqICAgbGluZShuLCAwLCBuLCBoZWlnaHQpO1xuICogfVxuICogPC9jb2RlPlxuICogPC9kaXY+XG4gKiA8ZGl2PlxuICogPGNvZGU+bGV0IG5vaXNlU2NhbGU9MC4wMjtcbiAqXG4gKiBmdW5jdGlvbiBkcmF3KCkge1xuICogICBiYWNrZ3JvdW5kKDApO1xuICogICBmb3IgKGxldCB4PTA7IHggPCB3aWR0aDsgeCsrKSB7XG4gKiAgICAgbGV0IG5vaXNlVmFsID0gbm9pc2UoKG1vdXNlWCt4KSpub2lzZVNjYWxlLCBtb3VzZVkqbm9pc2VTY2FsZSk7XG4gKiAgICAgc3Ryb2tlKG5vaXNlVmFsKjI1NSk7XG4gKiAgICAgbGluZSh4LCBtb3VzZVkrbm9pc2VWYWwqODAsIHgsIGhlaWdodCk7XG4gKiAgIH1cbiAqIH1cbiAqIDwvY29kZT5cbiAqIDwvZGl2PlxuICpcbiAqIEBhbHRcbiAqIHZlcnRpY2FsIGxpbmUgbW92ZXMgbGVmdCB0byByaWdodCB3aXRoIHVwZGF0aW5nIG5vaXNlIHZhbHVlcy5cbiAqIGhvcml6b250YWwgd2F2ZSBwYXR0ZXJuIGVmZmVjdGVkIGJ5IG1vdXNlIHgtcG9zaXRpb24gJiB1cGRhdGluZyBub2lzZSB2YWx1ZXMuXG4gKi9cblxuZXhwb3J0IGNvbnN0IG5vaXNlID0gZnVuY3Rpb24oeCwgeSA9IDAsIHogPSAwKSB7XG4gIGlmIChwZXJsaW4gPT0gbnVsbCkge1xuICAgIHBlcmxpbiA9IG5ldyBBcnJheShQRVJMSU5fU0laRSArIDEpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBQRVJMSU5fU0laRSArIDE7IGkrKykge1xuICAgICAgcGVybGluW2ldID0gTWF0aC5yYW5kb20oKVxuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgMCkge1xuICAgIHggPSAteFxuICB9XG4gIGlmICh5IDwgMCkge1xuICAgIHkgPSAteVxuICB9XG4gIGlmICh6IDwgMCkge1xuICAgIHogPSAtelxuICB9XG5cbiAgbGV0IHhpID0gTWF0aC5mbG9vcih4KSxcbiAgICB5aSA9IE1hdGguZmxvb3IoeSksXG4gICAgemkgPSBNYXRoLmZsb29yKHopXG4gIGxldCB4ZiA9IHggLSB4aVxuICBsZXQgeWYgPSB5IC0geWlcbiAgbGV0IHpmID0geiAtIHppXG4gIGxldCByeGYsIHJ5ZlxuXG4gIGxldCByID0gMFxuICBsZXQgYW1wbCA9IDAuNVxuXG4gIGxldCBuMSwgbjIsIG4zXG5cbiAgZm9yIChsZXQgbyA9IDA7IG8gPCBwZXJsaW5fb2N0YXZlczsgbysrKSB7XG4gICAgbGV0IG9mID0geGkgKyAoeWkgPDwgUEVSTElOX1lXUkFQQikgKyAoemkgPDwgUEVSTElOX1pXUkFQQilcblxuICAgIHJ4ZiA9IHNjYWxlZF9jb3NpbmUoeGYpXG4gICAgcnlmID0gc2NhbGVkX2Nvc2luZSh5ZilcblxuICAgIG4xID0gcGVybGluW29mICYgUEVSTElOX1NJWkVdXG4gICAgbjEgKz0gcnhmICogKHBlcmxpblsob2YgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4xKVxuICAgIG4yID0gcGVybGluWyhvZiArIFBFUkxJTl9ZV1JBUCkgJiBQRVJMSU5fU0laRV1cbiAgICBuMiArPSByeGYgKiAocGVybGluWyhvZiArIFBFUkxJTl9ZV1JBUCArIDEpICYgUEVSTElOX1NJWkVdIC0gbjIpXG4gICAgbjEgKz0gcnlmICogKG4yIC0gbjEpXG5cbiAgICBvZiArPSBQRVJMSU5fWldSQVBcbiAgICBuMiA9IHBlcmxpbltvZiAmIFBFUkxJTl9TSVpFXVxuICAgIG4yICs9IHJ4ZiAqIChwZXJsaW5bKG9mICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMilcbiAgICBuMyA9IHBlcmxpblsob2YgKyBQRVJMSU5fWVdSQVApICYgUEVSTElOX1NJWkVdXG4gICAgbjMgKz0gcnhmICogKHBlcmxpblsob2YgKyBQRVJMSU5fWVdSQVAgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4zKVxuICAgIG4yICs9IHJ5ZiAqIChuMyAtIG4yKVxuXG4gICAgbjEgKz0gc2NhbGVkX2Nvc2luZSh6ZikgKiAobjIgLSBuMSlcblxuICAgIHIgKz0gbjEgKiBhbXBsXG4gICAgYW1wbCAqPSBwZXJsaW5fYW1wX2ZhbGxvZmZcbiAgICB4aSA8PD0gMVxuICAgIHhmICo9IDJcbiAgICB5aSA8PD0gMVxuICAgIHlmICo9IDJcbiAgICB6aSA8PD0gMVxuICAgIHpmICo9IDJcblxuICAgIGlmICh4ZiA+PSAxLjApIHtcbiAgICAgIHhpKytcbiAgICAgIHhmLS1cbiAgICB9XG4gICAgaWYgKHlmID49IDEuMCkge1xuICAgICAgeWkrK1xuICAgICAgeWYtLVxuICAgIH1cbiAgICBpZiAoemYgPj0gMS4wKSB7XG4gICAgICB6aSsrXG4gICAgICB6Zi0tXG4gICAgfVxuICB9XG4gIHJldHVybiByXG59XG5cbi8qKlxuICpcbiAqIEFkanVzdHMgdGhlIGNoYXJhY3RlciBhbmQgbGV2ZWwgb2YgZGV0YWlsIHByb2R1Y2VkIGJ5IHRoZSBQZXJsaW4gbm9pc2VcbiAqIGZ1bmN0aW9uLiBTaW1pbGFyIHRvIGhhcm1vbmljcyBpbiBwaHlzaWNzLCBub2lzZSBpcyBjb21wdXRlZCBvdmVyXG4gKiBzZXZlcmFsIG9jdGF2ZXMuIExvd2VyIG9jdGF2ZXMgY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBvdXRwdXQgc2lnbmFsIGFuZFxuICogYXMgc3VjaCBkZWZpbmUgdGhlIG92ZXJhbGwgaW50ZW5zaXR5IG9mIHRoZSBub2lzZSwgd2hlcmVhcyBoaWdoZXIgb2N0YXZlc1xuICogY3JlYXRlIGZpbmVyIGdyYWluZWQgZGV0YWlscyBpbiB0aGUgbm9pc2Ugc2VxdWVuY2UuXG4gKlxuICogQnkgZGVmYXVsdCwgbm9pc2UgaXMgY29tcHV0ZWQgb3ZlciA0IG9jdGF2ZXMgd2l0aCBlYWNoIG9jdGF2ZSBjb250cmlidXRpbmdcbiAqIGV4YWN0bHkgaGFsZiB0aGFuIGl0cyBwcmVkZWNlc3Nvciwgc3RhcnRpbmcgYXQgNTAlIHN0cmVuZ3RoIGZvciB0aGUgMXN0XG4gKiBvY3RhdmUuIFRoaXMgZmFsbG9mZiBhbW91bnQgY2FuIGJlIGNoYW5nZWQgYnkgYWRkaW5nIGFuIGFkZGl0aW9uYWwgZnVuY3Rpb25cbiAqIHBhcmFtZXRlci4gRWcuIGEgZmFsbG9mZiBmYWN0b3Igb2YgMC43NSBtZWFucyBlYWNoIG9jdGF2ZSB3aWxsIG5vdyBoYXZlXG4gKiA3NSUgaW1wYWN0ICgyNSUgbGVzcykgb2YgdGhlIHByZXZpb3VzIGxvd2VyIG9jdGF2ZS4gQW55IHZhbHVlIGJldHdlZW5cbiAqIDAuMCBhbmQgMS4wIGlzIHZhbGlkLCBob3dldmVyIG5vdGUgdGhhdCB2YWx1ZXMgZ3JlYXRlciB0aGFuIDAuNSBtaWdodFxuICogcmVzdWx0IGluIGdyZWF0ZXIgdGhhbiAxLjAgdmFsdWVzIHJldHVybmVkIGJ5IDxiPm5vaXNlKCk8L2I+LlxuICpcbiAqIEJ5IGNoYW5naW5nIHRoZXNlIHBhcmFtZXRlcnMsIHRoZSBzaWduYWwgY3JlYXRlZCBieSB0aGUgPGI+bm9pc2UoKTwvYj5cbiAqIGZ1bmN0aW9uIGNhbiBiZSBhZGFwdGVkIHRvIGZpdCB2ZXJ5IHNwZWNpZmljIG5lZWRzIGFuZCBjaGFyYWN0ZXJpc3RpY3MuXG4gKlxuICogQG1ldGhvZCBub2lzZURldGFpbFxuICogQHBhcmFtIHtOdW1iZXJ9IGxvZCBudW1iZXIgb2Ygb2N0YXZlcyB0byBiZSB1c2VkIGJ5IHRoZSBub2lzZVxuICogQHBhcmFtIHtOdW1iZXJ9IGZhbGxvZmYgZmFsbG9mZiBmYWN0b3IgZm9yIGVhY2ggb2N0YXZlXG4gKiBAZXhhbXBsZVxuICogPGRpdj5cbiAqIDxjb2RlPlxuICogbGV0IG5vaXNlVmFsO1xuICogbGV0IG5vaXNlU2NhbGUgPSAwLjAyO1xuICpcbiAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICogICBjcmVhdGVDYW52YXMoMTAwLCAxMDApO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGRyYXcoKSB7XG4gKiAgIGJhY2tncm91bmQoMCk7XG4gKiAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAqICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHdpZHRoIC8gMjsgeCsrKSB7XG4gKiAgICAgICBub2lzZURldGFpbCgyLCAwLjIpO1xuICogICAgICAgbm9pc2VWYWwgPSBub2lzZSgobW91c2VYICsgeCkgKiBub2lzZVNjYWxlLCAobW91c2VZICsgeSkgKiBub2lzZVNjYWxlKTtcbiAqICAgICAgIHN0cm9rZShub2lzZVZhbCAqIDI1NSk7XG4gKiAgICAgICBwb2ludCh4LCB5KTtcbiAqICAgICAgIG5vaXNlRGV0YWlsKDgsIDAuNjUpO1xuICogICAgICAgbm9pc2VWYWwgPSBub2lzZShcbiAqICAgICAgICAgKG1vdXNlWCArIHggKyB3aWR0aCAvIDIpICogbm9pc2VTY2FsZSxcbiAqICAgICAgICAgKG1vdXNlWSArIHkpICogbm9pc2VTY2FsZVxuICogICAgICAgKTtcbiAqICAgICAgIHN0cm9rZShub2lzZVZhbCAqIDI1NSk7XG4gKiAgICAgICBwb2ludCh4ICsgd2lkdGggLyAyLCB5KTtcbiAqICAgICB9XG4gKiAgIH1cbiAqIH1cbiAqIDwvY29kZT5cbiAqIDwvZGl2PlxuICpcbiAqIEBhbHRcbiAqIDIgdmVydGljYWwgZ3JleSBzbW9rZXkgcGF0dGVybnMgYWZmZWN0ZWQgbXkgbW91c2UgeC1wb3NpdGlvbiBhbmQgbm9pc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBub2lzZURldGFpbCA9IGZ1bmN0aW9uKGxvZCwgZmFsbG9mZikge1xuICBpZiAobG9kID4gMCkge1xuICAgIHBlcmxpbl9vY3RhdmVzID0gbG9kXG4gIH1cbiAgaWYgKGZhbGxvZmYgPiAwKSB7XG4gICAgcGVybGluX2FtcF9mYWxsb2ZmID0gZmFsbG9mZlxuICB9XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc2VlZCB2YWx1ZSBmb3IgPGI+bm9pc2UoKTwvYj4uIEJ5IGRlZmF1bHQsIDxiPm5vaXNlKCk8L2I+XG4gKiBwcm9kdWNlcyBkaWZmZXJlbnQgcmVzdWx0cyBlYWNoIHRpbWUgdGhlIHByb2dyYW0gaXMgcnVuLiBTZXQgdGhlXG4gKiA8Yj52YWx1ZTwvYj4gcGFyYW1ldGVyIHRvIGEgY29uc3RhbnQgdG8gcmV0dXJuIHRoZSBzYW1lIHBzZXVkby1yYW5kb21cbiAqIG51bWJlcnMgZWFjaCB0aW1lIHRoZSBzb2Z0d2FyZSBpcyBydW4uXG4gKlxuICogQG1ldGhvZCBub2lzZVNlZWRcbiAqIEBwYXJhbSB7TnVtYmVyfSBzZWVkICAgdGhlIHNlZWQgdmFsdWVcbiAqIEBleGFtcGxlXG4gKiA8ZGl2PlxuICogPGNvZGU+bGV0IHhvZmYgPSAwLjA7XG4gKlxuICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gKiAgIG5vaXNlU2VlZCg5OSk7XG4gKiAgIHN0cm9rZSgwLCAxMCk7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gZHJhdygpIHtcbiAqICAgeG9mZiA9IHhvZmYgKyAuMDE7XG4gKiAgIGxldCBuID0gbm9pc2UoeG9mZikgKiB3aWR0aDtcbiAqICAgbGluZShuLCAwLCBuLCBoZWlnaHQpO1xuICogfVxuICogPC9jb2RlPlxuICogPC9kaXY+XG4gKlxuICogQGFsdFxuICogdmVydGljYWwgZ3JleSBsaW5lcyBkcmF3aW5nIGluIHBhdHRlcm4gYWZmZWN0ZWQgYnkgbm9pc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBub2lzZVNlZWQgPSBmdW5jdGlvbihzZWVkKSB7XG4gIC8vIExpbmVhciBDb25ncnVlbnRpYWwgR2VuZXJhdG9yXG4gIC8vIFZhcmlhbnQgb2YgYSBMZWhtYW4gR2VuZXJhdG9yXG4gIGNvbnN0IGxjZyA9ICgoKSA9PiB7XG4gICAgLy8gU2V0IHRvIHZhbHVlcyBmcm9tIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTnVtZXJpY2FsX1JlY2lwZXNcbiAgICAvLyBtIGlzIGJhc2ljYWxseSBjaG9zZW4gdG8gYmUgbGFyZ2UgKGFzIGl0IGlzIHRoZSBtYXggcGVyaW9kKVxuICAgIC8vIGFuZCBmb3IgaXRzIHJlbGF0aW9uc2hpcHMgdG8gYSBhbmQgY1xuICAgIGNvbnN0IG0gPSA0Mjk0OTY3Mjk2XG4gICAgLy8gYSAtIDEgc2hvdWxkIGJlIGRpdmlzaWJsZSBieSBtJ3MgcHJpbWUgZmFjdG9yc1xuICAgIGNvbnN0IGEgPSAxNjY0NTI1XG4gICAgLy8gYyBhbmQgbSBzaG91bGQgYmUgY28tcHJpbWVcbiAgICBjb25zdCBjID0gMTAxMzkwNDIyM1xuICAgIGxldCBzZWVkLCB6XG4gICAgcmV0dXJuIHtcbiAgICAgIHNldFNlZWQodmFsKSB7XG4gICAgICAgIC8vIHBpY2sgYSByYW5kb20gc2VlZCBpZiB2YWwgaXMgdW5kZWZpbmVkIG9yIG51bGxcbiAgICAgICAgLy8gdGhlID4+PiAwIGNhc3RzIHRoZSBzZWVkIHRvIGFuIHVuc2lnbmVkIDMyLWJpdCBpbnRlZ2VyXG4gICAgICAgIHogPSBzZWVkID0gKHZhbCA9PSBudWxsID8gTWF0aC5yYW5kb20oKSAqIG0gOiB2YWwpID4+PiAwXG4gICAgICB9LFxuICAgICAgZ2V0U2VlZCgpIHtcbiAgICAgICAgcmV0dXJuIHNlZWRcbiAgICAgIH0sXG4gICAgICByYW5kKCkge1xuICAgICAgICAvLyBkZWZpbmUgdGhlIHJlY3VycmVuY2UgcmVsYXRpb25zaGlwXG4gICAgICAgIHogPSAoYSAqIHogKyBjKSAlIG1cbiAgICAgICAgLy8gcmV0dXJuIGEgZmxvYXQgaW4gWzAsIDEpXG4gICAgICAgIC8vIGlmIHogPSBtIHRoZW4geiAvIG0gPSAwIHRoZXJlZm9yZSAoeiAlIG0pIC8gbSA8IDEgYWx3YXlzXG4gICAgICAgIHJldHVybiB6IC8gbVxuICAgICAgfVxuICAgIH1cbiAgfSkoKVxuXG4gIGxjZy5zZXRTZWVkKHNlZWQpXG4gIHBlcmxpbiA9IG5ldyBBcnJheShQRVJMSU5fU0laRSArIDEpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgUEVSTElOX1NJWkUgKyAxOyBpKyspIHtcbiAgICBwZXJsaW5baV0gPSBsY2cucmFuZCgpXG4gIH1cbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keXtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbWFpbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0FBQ2JcIixcInNvdXJjZXNDb250ZW50XCI6W1wiYm9keXtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXG5cbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cblxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcblxuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuXG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgXCJcIikuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tYWluLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHN0eWxlIGZyb20gJy4vbWFpbi5jc3MnO1xyXG5jb25zdCB7IG5vaXNlIH0gPSByZXF1aXJlKCdAY2hyaXNjb3Vyc2VzL3Blcmxpbi1ub2lzZScpO1xyXG5jb25zdCBodG1sQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG5jb25zdCBjYW52YXMgPSBodG1sQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5odG1sQ2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSA0O1xyXG5odG1sQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDQ7XHJcbmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgIGh0bWxDYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDQ7XHJcbiAgICBodG1sQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDQ7XHJcbn0pXHJcblxyXG5jbGFzcyBDaXJjbGUge1xyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgcmFkaXVzLCBjb2xvciwgb2Zmc2V0KSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBjYW52YXMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY2FudmFzLmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAxODAsIGZhbHNlKTtcclxuICAgICAgICBjYW52YXMuZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjYW52YXMuZmlsbCgpO1xyXG4gICAgICAgIGNhbnZhcy5jbG9zZVBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICB9XHJcbn1cclxuY29uc3QgY2lyY2xlcyA9IFtdO1xyXG5cclxuZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xyXG4gICAgY2lyY2xlcy5wdXNoKG5ldyBDaXJjbGUoLTMwLCAtMzAsIGAyNWAsIGBoc2woJHtNYXRoLnJhbmRvbSgpICogMzYwfSw1MCUsNTAlKWAsIGkgKiAwLjAxKSk7XHJcbn1cclxuXHJcbmxldCB0aW1lID0gMDtcclxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuICAgIGNhbnZhcy5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjAxKSc7XHJcbiAgICBjYW52YXMuZmlsbFJlY3QoMCwgMCwgaHRtbENhbnZhcy53aWR0aCwgaHRtbENhbnZhcy5oZWlnaHQpO1xyXG4gICAgY2lyY2xlcy5mb3JFYWNoKChjaXJjbGUpID0+IHtcclxuICAgICAgICBjaXJjbGUudXBkYXRlKCk7XHJcbiAgICAgICAgY2lyY2xlLnggPSBub2lzZSh0aW1lICsgY2lyY2xlLm9mZnNldCArIDIwKSAqIGh0bWxDYW52YXMud2lkdGg7XHJcbiAgICAgICAgY2lyY2xlLnkgPSBub2lzZSh0aW1lICsgY2lyY2xlLm9mZnNldCkgKiBodG1sQ2FudmFzLmhlaWdodDtcclxuICAgIH0pO1xyXG4gICAgdGltZSArPSAwLjAwNTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxufVxyXG5hbmltYXRlKCk7XHJcblxyXG4iXSwibmFtZXMiOlsic3R5bGUiLCJyZXF1aXJlIiwibm9pc2UiLCJodG1sQ2FudmFzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNhbnZhcyIsImdldENvbnRleHQiLCJ3aWR0aCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImFkZEV2ZW50TGlzdGVuZXIiLCJDaXJjbGUiLCJ4IiwieSIsInJhZGl1cyIsImNvbG9yIiwib2Zmc2V0IiwiYmVnaW5QYXRoIiwiYXJjIiwiTWF0aCIsIlBJIiwiZmlsbFN0eWxlIiwiZmlsbCIsImNsb3NlUGF0aCIsImRyYXciLCJjaXJjbGVzIiwiaSIsInB1c2giLCJyYW5kb20iLCJ0aW1lIiwiYW5pbWF0ZSIsImZpbGxSZWN0IiwiZm9yRWFjaCIsImNpcmNsZSIsInVwZGF0ZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSJdLCJzb3VyY2VSb290IjoiIn0=