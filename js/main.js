(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _PostEffect = require('./modules/PostEffect.js');

var _PostEffect2 = _interopRequireDefault(_PostEffect);

var _Plane = require('./modules/Plane.js');

var _Plane2 = _interopRequireDefault(_Plane);

var _Hover = require('./modules/Hover.js');

var _Hover2 = _interopRequireDefault(_Hover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hovers = document.getElementsByClassName('js-hover');

var canvas = document.getElementById('canvas-webgl');
var renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas: canvas
});
var renderBack = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
var scene = new THREE.Scene();
var sceneBack = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
var cameraBack = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
var clock = new THREE.Clock();

var postEffect = new _PostEffect2.default(renderBack.texture);
var plane = new _Plane2.default();

var resizeWindow = function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cameraBack.aspect = window.innerWidth / window.innerHeight;
  cameraBack.updateProjectionMatrix();
  renderBack.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
};
var on = function on() {
  window.addEventListener('resize', function () {
    resizeWindow();
  });
};
var render = function render() {
  plane.render(clock.getDelta());
  renderer.render(sceneBack, cameraBack, renderBack);
  postEffect.render(clock.getDelta());
  renderer.render(scene, camera);
};
var renderLoop = function renderLoop() {
  render();
  requestAnimationFrame(renderLoop);
};

var init = function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee, 1.0);
  cameraBack.position.set(0, 16, 128);
  cameraBack.lookAt(new THREE.Vector3(0, 28, 0));

  scene.add(postEffect.mesh);
  sceneBack.add(plane.mesh);

  on();
  resizeWindow();
  renderLoop();

  for (var i = 0; i < hovers.length; i++) {
    new _Hover2.default(hovers[i]);
  }
};
init();

},{"./modules/Hover.js":2,"./modules/Plane.js":3,"./modules/PostEffect.js":4}],2:[function(require,module,exports){
'use strict';

module.exports = function (elm) {
  var self = this;
  self.elm = elm;
  self.isTouched = false;

  self.elm.addEventListener('touchstart', function () {
    self.isTouched = true;
  }, false);
  self.elm.addEventListener('touchstartend', function () {
    self.isTouched = true;
  }, false);
  self.elm.addEventListener('mouseover', function () {
    if (self.isTouched) return;
    self.elm.classList.remove('is-leave');
    self.elm.classList.add('is-over');
  }, false);
  self.elm.addEventListener('mouseleave', function () {
    if (self.isTouched) return;
    self.elm.classList.remove('is-over');
    self.elm.classList.add('is-leave');
  }, false);
  self.elm.addEventListener('transitionend', function () {
    if (self.elm.classList.contains('is-leave')) {
      self.elm.classList.remove('is-leave');
    }
  }, false);
  self.elm.addEventListener('animationend', function () {
    if (self.elm.classList.contains('is-leave')) {
      self.elm.classList.remove('is-leave');
    }
  }, false);
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Plane = function () {
  function Plane() {
    _classCallCheck(this, Plane);

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.mesh = this.createMesh();
    this.time = 1;
  }

  _createClass(Plane, [{
    key: 'createMesh',
    value: function createMesh() {
      return new THREE.Mesh(new THREE.PlaneGeometry(256, 256, 256, 256), new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: "#define GLSLIFY 1\nattribute vec3 position;\n\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nuniform float time;\n\nvarying vec3 vPosition;\n\nmat4 rotateMatrixX(float radian) {\n  return mat4(\n    1.0, 0.0, 0.0, 0.0,\n    0.0, cos(radian), -sin(radian), 0.0,\n    0.0, sin(radian), cos(radian), 0.0,\n    0.0, 0.0, 0.0, 1.0\n  );\n}\n\n//\n// GLSL textureless classic 3D noise \"cnoise\",\n// with an RSL-style periodic variant \"pnoise\".\n// Author:  Stefan Gustavson (stefan.gustavson@liu.se)\n// Version: 2011-10-11\n//\n// Many thanks to Ian McEwan of Ashima Arts for the\n// ideas for permutation and gradient selection.\n//\n// Copyright (c) 2011 Stefan Gustavson. All rights reserved.\n// Distributed under the MIT license. See LICENSE file.\n// https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289(Pi0);\n  Pi1 = mod289(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\nvoid main(void) {\n  vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;\n  float sin1 = sin(radians(updatePosition.x / 128.0 * 90.0));\n  vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -30.0);\n  float noise1 = cnoise(noisePosition * 0.08);\n  float noise2 = cnoise(noisePosition * 0.06);\n  float noise3 = cnoise(noisePosition * 0.4);\n  vec3 lastPosition = updatePosition + vec3(0.0,\n    noise1 * sin1 * 8.0\n    + noise2 * sin1 * 8.0\n    + noise3 * (abs(sin1) * 2.0 + 0.5)\n    + pow(sin1, 2.0) * 40.0, 0.0);\n\n  vPosition = lastPosition;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);\n}\n",
        fragmentShader: "precision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPosition;\n\nvoid main(void) {\n  float opacity = (96.0 - length(vPosition)) / 256.0 * 0.8;\n  vec3 color = vec3(0.6);\n  gl_FragColor = vec4(color, opacity);\n}\n",
        transparent: true
      }));
    }
  }, {
    key: 'render',
    value: function render(time) {
      this.uniforms.time.value += time * this.time;
    }
  }]);

  return Plane;
}();

exports.default = Plane;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var PostEffect = function () {
  function PostEffect(texture) {
    _classCallCheck(this, PostEffect);

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.mesh = this.createMesh(texture);
    this.time = 1;
  }

  _createClass(PostEffect, [{
    key: 'createMesh',
    value: function createMesh() {
      return new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: "#define GLSLIFY 1\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nvoid main() {\n  vPosition = position;\n  vUv = uv;\n  gl_Position = vec4(position, 1.0);\n}\n",
        fragmentShader: "precision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D texture;\n\nvarying vec3 vPosition;\nvarying vec2 vUv;\n\nfloat random(vec2 c){\n  return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvoid main() {\n  float noise = random(vPosition.xy + time);\n  vec4 color = texture2D(texture, vUv);\n  gl_FragColor = color + vec4(vec3(noise * 0.1), 1.0);\n}\n"
      }));
    }
  }, {
    key: 'render',
    value: function render(time) {
      this.uniforms.time.value += time * this.time;
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
  }]);

  return PostEffect;
}();

exports.default = PostEffect;

},{}]},{},[1]);
