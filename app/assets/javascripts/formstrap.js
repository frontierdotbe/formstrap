var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module, copyDefault, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/tom-select/dist/js/tom-select.complete.js
var require_tom_select_complete = __commonJS({
  "node_modules/tom-select/dist/js/tom-select.complete.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.TomSelect = factory());
    })(exports, function() {
      "use strict";
      function forEvents(events, callback) {
        events.split(/\s+/).forEach((event) => {
          callback(event);
        });
      }
      class MicroEvent {
        constructor() {
          this._events = {};
        }
        on(events, fct) {
          forEvents(events, (event) => {
            this._events[event] = this._events[event] || [];
            this._events[event].push(fct);
          });
        }
        off(events, fct) {
          var n = arguments.length;
          if (n === 0) {
            this._events = {};
            return;
          }
          forEvents(events, (event) => {
            if (n === 1)
              return delete this._events[event];
            if (event in this._events === false)
              return;
            this._events[event].splice(this._events[event].indexOf(fct), 1);
          });
        }
        trigger(events, ...args) {
          var self2 = this;
          forEvents(events, (event) => {
            if (event in self2._events === false)
              return;
            for (let fct of self2._events[event]) {
              fct.apply(self2, args);
            }
          });
        }
      }
      function MicroPlugin(Interface) {
        Interface.plugins = {};
        return class extends Interface {
          constructor(...args) {
            super(...args);
            this.plugins = {
              names: [],
              settings: {},
              requested: {},
              loaded: {}
            };
          }
          static define(name, fn2) {
            Interface.plugins[name] = {
              "name": name,
              "fn": fn2
            };
          }
          initializePlugins(plugins2) {
            var key, name;
            const self2 = this;
            const queue = [];
            if (Array.isArray(plugins2)) {
              plugins2.forEach((plugin) => {
                if (typeof plugin === "string") {
                  queue.push(plugin);
                } else {
                  self2.plugins.settings[plugin.name] = plugin.options;
                  queue.push(plugin.name);
                }
              });
            } else if (plugins2) {
              for (key in plugins2) {
                if (plugins2.hasOwnProperty(key)) {
                  self2.plugins.settings[key] = plugins2[key];
                  queue.push(key);
                }
              }
            }
            while (name = queue.shift()) {
              self2.require(name);
            }
          }
          loadPlugin(name) {
            var self2 = this;
            var plugins2 = self2.plugins;
            var plugin = Interface.plugins[name];
            if (!Interface.plugins.hasOwnProperty(name)) {
              throw new Error('Unable to find "' + name + '" plugin');
            }
            plugins2.requested[name] = true;
            plugins2.loaded[name] = plugin.fn.apply(self2, [self2.plugins.settings[name] || {}]);
            plugins2.names.push(name);
          }
          require(name) {
            var self2 = this;
            var plugins2 = self2.plugins;
            if (!self2.plugins.loaded.hasOwnProperty(name)) {
              if (plugins2.requested[name]) {
                throw new Error('Plugin has circular dependency ("' + name + '")');
              }
              self2.loadPlugin(name);
            }
            return plugins2.loaded[name];
          }
        };
      }
      var latin_pat;
      const accent_pat = "[\u0300-\u036F\xB7\u02BE]";
      const accent_reg = new RegExp(accent_pat, "g");
      var diacritic_patterns;
      const latin_convert = {
        "\xE6": "ae",
        "\u2C65": "a",
        "\xF8": "o"
      };
      const convert_pat = new RegExp(Object.keys(latin_convert).join("|"), "g");
      const code_points = [[67, 67], [160, 160], [192, 438], [452, 652], [961, 961], [1019, 1019], [1083, 1083], [1281, 1289], [1984, 1984], [5095, 5095], [7429, 7441], [7545, 7549], [7680, 7935], [8580, 8580], [9398, 9449], [11360, 11391], [42792, 42793], [42802, 42851], [42873, 42897], [42912, 42922], [64256, 64260], [65313, 65338], [65345, 65370]];
      const asciifold = (str) => {
        return str.normalize("NFKD").replace(accent_reg, "").toLowerCase().replace(convert_pat, function(foreignletter) {
          return latin_convert[foreignletter];
        });
      };
      const arrayToPattern = (chars, glue = "|") => {
        if (chars.length == 1) {
          return chars[0];
        }
        var longest = 1;
        chars.forEach((a) => {
          longest = Math.max(longest, a.length);
        });
        if (longest == 1) {
          return "[" + chars.join("") + "]";
        }
        return "(?:" + chars.join(glue) + ")";
      };
      const allSubstrings = (input) => {
        if (input.length === 1)
          return [[input]];
        var result = [];
        allSubstrings(input.substring(1)).forEach(function(subresult) {
          var tmp = subresult.slice(0);
          tmp[0] = input.charAt(0) + tmp[0];
          result.push(tmp);
          tmp = subresult.slice(0);
          tmp.unshift(input.charAt(0));
          result.push(tmp);
        });
        return result;
      };
      const generateDiacritics = () => {
        var diacritics = {};
        code_points.forEach((code_range) => {
          for (let i = code_range[0]; i <= code_range[1]; i++) {
            let diacritic = String.fromCharCode(i);
            let latin = asciifold(diacritic);
            if (latin == diacritic.toLowerCase()) {
              continue;
            }
            if (!(latin in diacritics)) {
              diacritics[latin] = [latin];
            }
            var patt = new RegExp(arrayToPattern(diacritics[latin]), "iu");
            if (diacritic.match(patt)) {
              continue;
            }
            diacritics[latin].push(diacritic);
          }
        });
        var latin_chars = Object.keys(diacritics);
        latin_chars = latin_chars.sort((a, b) => b.length - a.length);
        latin_pat = new RegExp("(" + arrayToPattern(latin_chars) + accent_pat + "*)", "g");
        var diacritic_patterns2 = {};
        latin_chars.sort((a, b) => a.length - b.length).forEach((latin) => {
          var substrings = allSubstrings(latin);
          var pattern = substrings.map((sub_pat) => {
            sub_pat = sub_pat.map((l) => {
              if (diacritics.hasOwnProperty(l)) {
                return arrayToPattern(diacritics[l]);
              }
              return l;
            });
            return arrayToPattern(sub_pat, "");
          });
          diacritic_patterns2[latin] = arrayToPattern(pattern);
        });
        return diacritic_patterns2;
      };
      const diacriticRegexPoints = (regex) => {
        if (diacritic_patterns === void 0) {
          diacritic_patterns = generateDiacritics();
        }
        const decomposed = regex.normalize("NFKD").toLowerCase();
        return decomposed.split(latin_pat).map((part) => {
          if (part == "") {
            return "";
          }
          const no_accent = asciifold(part);
          if (diacritic_patterns.hasOwnProperty(no_accent)) {
            return diacritic_patterns[no_accent];
          }
          const composed_part = part.normalize("NFC");
          if (composed_part != part) {
            return arrayToPattern([part, composed_part]);
          }
          return part;
        }).join("");
      };
      const getAttr = (obj, name) => {
        if (!obj)
          return;
        return obj[name];
      };
      const getAttrNesting = (obj, name) => {
        if (!obj)
          return;
        var part, names = name.split(".");
        while ((part = names.shift()) && (obj = obj[part]))
          ;
        return obj;
      };
      const scoreValue = (value, token, weight) => {
        var score, pos;
        if (!value)
          return 0;
        value = value + "";
        pos = value.search(token.regex);
        if (pos === -1)
          return 0;
        score = token.string.length / value.length;
        if (pos === 0)
          score += 0.5;
        return score * weight;
      };
      const escape_regex = (str) => {
        return (str + "").replace(/([\$\(-\+\.\?\[-\^\{-\}])/g, "\\$1");
      };
      const propToArray = (obj, key) => {
        var value = obj[key];
        if (typeof value == "function")
          return value;
        if (value && !Array.isArray(value)) {
          obj[key] = [value];
        }
      };
      const iterate = (object, callback) => {
        if (Array.isArray(object)) {
          object.forEach(callback);
        } else {
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              callback(object[key], key);
            }
          }
        }
      };
      const cmp = (a, b) => {
        if (typeof a === "number" && typeof b === "number") {
          return a > b ? 1 : a < b ? -1 : 0;
        }
        a = asciifold(a + "").toLowerCase();
        b = asciifold(b + "").toLowerCase();
        if (a > b)
          return 1;
        if (b > a)
          return -1;
        return 0;
      };
      class Sifter {
        constructor(items, settings) {
          this.items = items;
          this.settings = settings || {
            diacritics: true
          };
        }
        tokenize(query, respect_word_boundaries, weights) {
          if (!query || !query.length)
            return [];
          const tokens = [];
          const words = query.split(/\s+/);
          var field_regex;
          if (weights) {
            field_regex = new RegExp("^(" + Object.keys(weights).map(escape_regex).join("|") + "):(.*)$");
          }
          words.forEach((word) => {
            let field_match;
            let field = null;
            let regex = null;
            if (field_regex && (field_match = word.match(field_regex))) {
              field = field_match[1];
              word = field_match[2];
            }
            if (word.length > 0) {
              regex = escape_regex(word);
              if (this.settings.diacritics) {
                regex = diacriticRegexPoints(regex);
              }
              if (respect_word_boundaries)
                regex = "\\b" + regex;
            }
            tokens.push({
              string: word,
              regex: regex ? new RegExp(regex, "iu") : null,
              field
            });
          });
          return tokens;
        }
        getScoreFunction(query, options) {
          var search = this.prepareSearch(query, options);
          return this._getScoreFunction(search);
        }
        _getScoreFunction(search) {
          const tokens = search.tokens, token_count = tokens.length;
          if (!token_count) {
            return function() {
              return 0;
            };
          }
          const fields = search.options.fields, weights = search.weights, field_count = fields.length, getAttrFn = search.getAttrFn;
          if (!field_count) {
            return function() {
              return 1;
            };
          }
          const scoreObject = function() {
            if (field_count === 1) {
              return function(token, data) {
                const field = fields[0].field;
                return scoreValue(getAttrFn(data, field), token, weights[field]);
              };
            }
            return function(token, data) {
              var sum = 0;
              if (token.field) {
                const value = getAttrFn(data, token.field);
                if (!token.regex && value) {
                  sum += 1 / field_count;
                } else {
                  sum += scoreValue(value, token, 1);
                }
              } else {
                iterate(weights, (weight, field) => {
                  sum += scoreValue(getAttrFn(data, field), token, weight);
                });
              }
              return sum / field_count;
            };
          }();
          if (token_count === 1) {
            return function(data) {
              return scoreObject(tokens[0], data);
            };
          }
          if (search.options.conjunction === "and") {
            return function(data) {
              var i = 0, score, sum = 0;
              for (; i < token_count; i++) {
                score = scoreObject(tokens[i], data);
                if (score <= 0)
                  return 0;
                sum += score;
              }
              return sum / token_count;
            };
          } else {
            return function(data) {
              var sum = 0;
              iterate(tokens, (token) => {
                sum += scoreObject(token, data);
              });
              return sum / token_count;
            };
          }
        }
        getSortFunction(query, options) {
          var search = this.prepareSearch(query, options);
          return this._getSortFunction(search);
        }
        _getSortFunction(search) {
          var i, n, implicit_score;
          const self2 = this, options = search.options, sort2 = !search.query && options.sort_empty ? options.sort_empty : options.sort, sort_flds = [], multipliers = [];
          if (typeof sort2 == "function") {
            return sort2.bind(this);
          }
          const get_field = function get_field2(name, result) {
            if (name === "$score")
              return result.score;
            return search.getAttrFn(self2.items[result.id], name);
          };
          if (sort2) {
            for (i = 0, n = sort2.length; i < n; i++) {
              if (search.query || sort2[i].field !== "$score") {
                sort_flds.push(sort2[i]);
              }
            }
          }
          if (search.query) {
            implicit_score = true;
            for (i = 0, n = sort_flds.length; i < n; i++) {
              if (sort_flds[i].field === "$score") {
                implicit_score = false;
                break;
              }
            }
            if (implicit_score) {
              sort_flds.unshift({
                field: "$score",
                direction: "desc"
              });
            }
          } else {
            for (i = 0, n = sort_flds.length; i < n; i++) {
              if (sort_flds[i].field === "$score") {
                sort_flds.splice(i, 1);
                break;
              }
            }
          }
          for (i = 0, n = sort_flds.length; i < n; i++) {
            multipliers.push(sort_flds[i].direction === "desc" ? -1 : 1);
          }
          const sort_flds_count = sort_flds.length;
          if (!sort_flds_count) {
            return null;
          } else if (sort_flds_count === 1) {
            const sort_fld = sort_flds[0].field;
            const multiplier = multipliers[0];
            return function(a, b) {
              return multiplier * cmp(get_field(sort_fld, a), get_field(sort_fld, b));
            };
          } else {
            return function(a, b) {
              var i2, result, field;
              for (i2 = 0; i2 < sort_flds_count; i2++) {
                field = sort_flds[i2].field;
                result = multipliers[i2] * cmp(get_field(field, a), get_field(field, b));
                if (result)
                  return result;
              }
              return 0;
            };
          }
        }
        prepareSearch(query, optsUser) {
          const weights = {};
          var options = Object.assign({}, optsUser);
          propToArray(options, "sort");
          propToArray(options, "sort_empty");
          if (options.fields) {
            propToArray(options, "fields");
            const fields = [];
            options.fields.forEach((field) => {
              if (typeof field == "string") {
                field = {
                  field,
                  weight: 1
                };
              }
              fields.push(field);
              weights[field.field] = "weight" in field ? field.weight : 1;
            });
            options.fields = fields;
          }
          return {
            options,
            query: query.toLowerCase().trim(),
            tokens: this.tokenize(query, options.respect_word_boundaries, weights),
            total: 0,
            items: [],
            weights,
            getAttrFn: options.nesting ? getAttrNesting : getAttr
          };
        }
        search(query, options) {
          var self2 = this, score, search;
          search = this.prepareSearch(query, options);
          options = search.options;
          query = search.query;
          const fn_score = options.score || self2._getScoreFunction(search);
          if (query.length) {
            iterate(self2.items, (item, id) => {
              score = fn_score(item);
              if (options.filter === false || score > 0) {
                search.items.push({
                  "score": score,
                  "id": id
                });
              }
            });
          } else {
            iterate(self2.items, (item, id) => {
              search.items.push({
                "score": 1,
                "id": id
              });
            });
          }
          const fn_sort = self2._getSortFunction(search);
          if (fn_sort)
            search.items.sort(fn_sort);
          search.total = search.items.length;
          if (typeof options.limit === "number") {
            search.items = search.items.slice(0, options.limit);
          }
          return search;
        }
      }
      const getDom = (query) => {
        if (query.jquery) {
          return query[0];
        }
        if (query instanceof HTMLElement) {
          return query;
        }
        if (isHtmlString(query)) {
          let div = document.createElement("div");
          div.innerHTML = query.trim();
          return div.firstChild;
        }
        return document.querySelector(query);
      };
      const isHtmlString = (arg) => {
        if (typeof arg === "string" && arg.indexOf("<") > -1) {
          return true;
        }
        return false;
      };
      const escapeQuery = (query) => {
        return query.replace(/['"\\]/g, "\\$&");
      };
      const triggerEvent = (dom_el, event_name) => {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(event_name, true, false);
        dom_el.dispatchEvent(event);
      };
      const applyCSS = (dom_el, css2) => {
        Object.assign(dom_el.style, css2);
      };
      const addClasses = (elmts, ...classes) => {
        var norm_classes = classesArray(classes);
        elmts = castAsArray(elmts);
        elmts.map((el) => {
          norm_classes.map((cls) => {
            el.classList.add(cls);
          });
        });
      };
      const removeClasses = (elmts, ...classes) => {
        var norm_classes = classesArray(classes);
        elmts = castAsArray(elmts);
        elmts.map((el) => {
          norm_classes.map((cls) => {
            el.classList.remove(cls);
          });
        });
      };
      const classesArray = (args) => {
        var classes = [];
        iterate(args, (_classes) => {
          if (typeof _classes === "string") {
            _classes = _classes.trim().split(/[\11\12\14\15\40]/);
          }
          if (Array.isArray(_classes)) {
            classes = classes.concat(_classes);
          }
        });
        return classes.filter(Boolean);
      };
      const castAsArray = (arg) => {
        if (!Array.isArray(arg)) {
          arg = [arg];
        }
        return arg;
      };
      const parentMatch = (target, selector, wrapper) => {
        if (wrapper && !wrapper.contains(target)) {
          return;
        }
        while (target && target.matches) {
          if (target.matches(selector)) {
            return target;
          }
          target = target.parentNode;
        }
      };
      const getTail = (list, direction = 0) => {
        if (direction > 0) {
          return list[list.length - 1];
        }
        return list[0];
      };
      const isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0;
      };
      const nodeIndex = (el, amongst) => {
        if (!el)
          return -1;
        amongst = amongst || el.nodeName;
        var i = 0;
        while (el = el.previousElementSibling) {
          if (el.matches(amongst)) {
            i++;
          }
        }
        return i;
      };
      const setAttr = (el, attrs) => {
        iterate(attrs, (val, attr) => {
          if (val == null) {
            el.removeAttribute(attr);
          } else {
            el.setAttribute(attr, "" + val);
          }
        });
      };
      const replaceNode = (existing, replacement) => {
        if (existing.parentNode)
          existing.parentNode.replaceChild(replacement, existing);
      };
      const highlight = (element, regex) => {
        if (regex === null)
          return;
        if (typeof regex === "string") {
          if (!regex.length)
            return;
          regex = new RegExp(regex, "i");
        }
        const highlightText = (node) => {
          var match = node.data.match(regex);
          if (match && node.data.length > 0) {
            var spannode = document.createElement("span");
            spannode.className = "highlight";
            var middlebit = node.splitText(match.index);
            middlebit.splitText(match[0].length);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            replaceNode(middlebit, spannode);
            return 1;
          }
          return 0;
        };
        const highlightChildren = (node) => {
          if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== "highlight" || node.tagName !== "SPAN")) {
            for (var i = 0; i < node.childNodes.length; ++i) {
              i += highlightRecursive(node.childNodes[i]);
            }
          }
        };
        const highlightRecursive = (node) => {
          if (node.nodeType === 3) {
            return highlightText(node);
          }
          highlightChildren(node);
          return 0;
        };
        highlightRecursive(element);
      };
      const removeHighlight = (el) => {
        var elements = el.querySelectorAll("span.highlight");
        Array.prototype.forEach.call(elements, function(el2) {
          var parent = el2.parentNode;
          parent.replaceChild(el2.firstChild, el2);
          parent.normalize();
        });
      };
      const KEY_A = 65;
      const KEY_RETURN = 13;
      const KEY_ESC = 27;
      const KEY_LEFT = 37;
      const KEY_UP = 38;
      const KEY_RIGHT = 39;
      const KEY_DOWN = 40;
      const KEY_BACKSPACE = 8;
      const KEY_DELETE = 46;
      const KEY_TAB = 9;
      const IS_MAC = typeof navigator === "undefined" ? false : /Mac/.test(navigator.userAgent);
      const KEY_SHORTCUT = IS_MAC ? "metaKey" : "ctrlKey";
      var defaults3 = {
        options: [],
        optgroups: [],
        plugins: [],
        delimiter: ",",
        splitOn: null,
        persist: true,
        diacritics: true,
        create: null,
        createOnBlur: false,
        createFilter: null,
        highlight: true,
        openOnFocus: true,
        shouldOpen: null,
        maxOptions: 50,
        maxItems: null,
        hideSelected: null,
        duplicates: false,
        addPrecedence: false,
        selectOnTab: false,
        preload: null,
        allowEmptyOption: false,
        loadThrottle: 300,
        loadingClass: "loading",
        dataAttr: null,
        optgroupField: "optgroup",
        valueField: "value",
        labelField: "text",
        disabledField: "disabled",
        optgroupLabelField: "label",
        optgroupValueField: "value",
        lockOptgroupOrder: false,
        sortField: "$order",
        searchField: ["text"],
        searchConjunction: "and",
        mode: null,
        wrapperClass: "ts-wrapper",
        controlClass: "ts-control",
        dropdownClass: "ts-dropdown",
        dropdownContentClass: "ts-dropdown-content",
        itemClass: "item",
        optionClass: "option",
        dropdownParent: null,
        controlInput: '<input type="text" autocomplete="off" size="1" />',
        copyClassesToDropdown: false,
        placeholder: null,
        hidePlaceholder: null,
        shouldLoad: function(query) {
          return query.length > 0;
        },
        render: {}
      };
      const hash_key = (value) => {
        if (typeof value === "undefined" || value === null)
          return null;
        return get_hash(value);
      };
      const get_hash = (value) => {
        if (typeof value === "boolean")
          return value ? "1" : "0";
        return value + "";
      };
      const escape_html = (str) => {
        return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      };
      const loadDebounce = (fn2, delay) => {
        var timeout;
        return function(value, callback) {
          var self2 = this;
          if (timeout) {
            self2.loading = Math.max(self2.loading - 1, 0);
            clearTimeout(timeout);
          }
          timeout = setTimeout(function() {
            timeout = null;
            self2.loadedSearches[value] = true;
            fn2.call(self2, value, callback);
          }, delay);
        };
      };
      const debounce_events = (self2, types, fn2) => {
        var type;
        var trigger = self2.trigger;
        var event_args = {};
        self2.trigger = function() {
          var type2 = arguments[0];
          if (types.indexOf(type2) !== -1) {
            event_args[type2] = arguments;
          } else {
            return trigger.apply(self2, arguments);
          }
        };
        fn2.apply(self2, []);
        self2.trigger = trigger;
        for (type of types) {
          if (type in event_args) {
            trigger.apply(self2, event_args[type]);
          }
        }
      };
      const getSelection = (input) => {
        return {
          start: input.selectionStart || 0,
          length: (input.selectionEnd || 0) - (input.selectionStart || 0)
        };
      };
      const preventDefault = (evt, stop = false) => {
        if (evt) {
          evt.preventDefault();
          if (stop) {
            evt.stopPropagation();
          }
        }
      };
      const addEvent = (target, type, callback, options) => {
        target.addEventListener(type, callback, options);
      };
      const isKeyDown = (key_name, evt) => {
        if (!evt) {
          return false;
        }
        if (!evt[key_name]) {
          return false;
        }
        var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);
        if (count === 1) {
          return true;
        }
        return false;
      };
      const getId = (el, id) => {
        const existing_id = el.getAttribute("id");
        if (existing_id) {
          return existing_id;
        }
        el.setAttribute("id", id);
        return id;
      };
      const addSlashes = (str) => {
        return str.replace(/[\\"']/g, "\\$&");
      };
      const append = (parent, node) => {
        if (node)
          parent.append(node);
      };
      function getSettings(input, settings_user) {
        var settings = Object.assign({}, defaults3, settings_user);
        var attr_data = settings.dataAttr;
        var field_label = settings.labelField;
        var field_value = settings.valueField;
        var field_disabled = settings.disabledField;
        var field_optgroup = settings.optgroupField;
        var field_optgroup_label = settings.optgroupLabelField;
        var field_optgroup_value = settings.optgroupValueField;
        var tag_name = input.tagName.toLowerCase();
        var placeholder = input.getAttribute("placeholder") || input.getAttribute("data-placeholder");
        if (!placeholder && !settings.allowEmptyOption) {
          let option2 = input.querySelector('option[value=""]');
          if (option2) {
            placeholder = option2.textContent;
          }
        }
        var settings_element = {
          placeholder,
          options: [],
          optgroups: [],
          items: [],
          maxItems: null
        };
        var init_select = () => {
          var tagName;
          var options = settings_element.options;
          var optionsMap = {};
          var group_count = 1;
          var readData = (el) => {
            var data = Object.assign({}, el.dataset);
            var json = attr_data && data[attr_data];
            if (typeof json === "string" && json.length) {
              data = Object.assign(data, JSON.parse(json));
            }
            return data;
          };
          var addOption = (option2, group) => {
            var value = hash_key(option2.value);
            if (value == null)
              return;
            if (!value && !settings.allowEmptyOption)
              return;
            if (optionsMap.hasOwnProperty(value)) {
              if (group) {
                var arr = optionsMap[value][field_optgroup];
                if (!arr) {
                  optionsMap[value][field_optgroup] = group;
                } else if (!Array.isArray(arr)) {
                  optionsMap[value][field_optgroup] = [arr, group];
                } else {
                  arr.push(group);
                }
              }
            } else {
              var option_data = readData(option2);
              option_data[field_label] = option_data[field_label] || option2.textContent;
              option_data[field_value] = option_data[field_value] || value;
              option_data[field_disabled] = option_data[field_disabled] || option2.disabled;
              option_data[field_optgroup] = option_data[field_optgroup] || group;
              option_data.$option = option2;
              optionsMap[value] = option_data;
              options.push(option_data);
            }
            if (option2.selected) {
              settings_element.items.push(value);
            }
          };
          var addGroup = (optgroup) => {
            var id, optgroup_data;
            optgroup_data = readData(optgroup);
            optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute("label") || "";
            optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
            optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
            settings_element.optgroups.push(optgroup_data);
            id = optgroup_data[field_optgroup_value];
            iterate(optgroup.children, (option2) => {
              addOption(option2, id);
            });
          };
          settings_element.maxItems = input.hasAttribute("multiple") ? null : 1;
          iterate(input.children, (child) => {
            tagName = child.tagName.toLowerCase();
            if (tagName === "optgroup") {
              addGroup(child);
            } else if (tagName === "option") {
              addOption(child);
            }
          });
        };
        var init_textbox = () => {
          const data_raw = input.getAttribute(attr_data);
          if (!data_raw) {
            var value = input.value.trim() || "";
            if (!settings.allowEmptyOption && !value.length)
              return;
            const values = value.split(settings.delimiter);
            iterate(values, (value2) => {
              const option2 = {};
              option2[field_label] = value2;
              option2[field_value] = value2;
              settings_element.options.push(option2);
            });
            settings_element.items = values;
          } else {
            settings_element.options = JSON.parse(data_raw);
            iterate(settings_element.options, (opt) => {
              settings_element.items.push(opt[field_value]);
            });
          }
        };
        if (tag_name === "select") {
          init_select();
        } else {
          init_textbox();
        }
        return Object.assign({}, defaults3, settings_element, settings_user);
      }
      var instance_i = 0;
      class TomSelect3 extends MicroPlugin(MicroEvent) {
        constructor(input_arg, user_settings) {
          super();
          this.order = 0;
          this.isOpen = false;
          this.isDisabled = false;
          this.isInvalid = false;
          this.isValid = true;
          this.isLocked = false;
          this.isFocused = false;
          this.isInputHidden = false;
          this.isSetup = false;
          this.ignoreFocus = false;
          this.hasOptions = false;
          this.lastValue = "";
          this.caretPos = 0;
          this.loading = 0;
          this.loadedSearches = {};
          this.activeOption = null;
          this.activeItems = [];
          this.optgroups = {};
          this.options = {};
          this.userOptions = {};
          this.items = [];
          instance_i++;
          var dir;
          var input = getDom(input_arg);
          if (input.tomselect) {
            throw new Error("Tom Select already initialized on this element");
          }
          input.tomselect = this;
          var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
          dir = computedStyle.getPropertyValue("direction");
          const settings = getSettings(input, user_settings);
          this.settings = settings;
          this.input = input;
          this.tabIndex = input.tabIndex || 0;
          this.is_select_tag = input.tagName.toLowerCase() === "select";
          this.rtl = /rtl/i.test(dir);
          this.inputId = getId(input, "tomselect-" + instance_i);
          this.isRequired = input.required;
          this.sifter = new Sifter(this.options, {
            diacritics: settings.diacritics
          });
          settings.mode = settings.mode || (settings.maxItems === 1 ? "single" : "multi");
          if (typeof settings.hideSelected !== "boolean") {
            settings.hideSelected = settings.mode === "multi";
          }
          if (typeof settings.hidePlaceholder !== "boolean") {
            settings.hidePlaceholder = settings.mode !== "multi";
          }
          var filter = settings.createFilter;
          if (typeof filter !== "function") {
            if (typeof filter === "string") {
              filter = new RegExp(filter);
            }
            if (filter instanceof RegExp) {
              settings.createFilter = (input2) => filter.test(input2);
            } else {
              settings.createFilter = () => true;
            }
          }
          this.initializePlugins(settings.plugins);
          this.setupCallbacks();
          this.setupTemplates();
          const wrapper = getDom("<div>");
          const control = getDom("<div>");
          const dropdown = this._render("dropdown");
          const dropdown_content = getDom(`<div role="listbox" tabindex="-1">`);
          const classes = this.input.getAttribute("class") || "";
          const inputMode = settings.mode;
          var control_input;
          addClasses(wrapper, settings.wrapperClass, classes, inputMode);
          addClasses(control, settings.controlClass);
          append(wrapper, control);
          addClasses(dropdown, settings.dropdownClass, inputMode);
          if (settings.copyClassesToDropdown) {
            addClasses(dropdown, classes);
          }
          addClasses(dropdown_content, settings.dropdownContentClass);
          append(dropdown, dropdown_content);
          getDom(settings.dropdownParent || wrapper).appendChild(dropdown);
          if (isHtmlString(settings.controlInput)) {
            control_input = getDom(settings.controlInput);
            var attrs = ["autocorrect", "autocapitalize", "autocomplete"];
            iterate(attrs, (attr) => {
              if (input.getAttribute(attr)) {
                setAttr(control_input, {
                  [attr]: input.getAttribute(attr)
                });
              }
            });
            control_input.tabIndex = -1;
            control.appendChild(control_input);
            this.focus_node = control_input;
          } else if (settings.controlInput) {
            control_input = getDom(settings.controlInput);
            this.focus_node = control_input;
          } else {
            control_input = getDom("<input/>");
            this.focus_node = control;
          }
          this.wrapper = wrapper;
          this.dropdown = dropdown;
          this.dropdown_content = dropdown_content;
          this.control = control;
          this.control_input = control_input;
          this.setup();
        }
        setup() {
          const self2 = this;
          const settings = self2.settings;
          const control_input = self2.control_input;
          const dropdown = self2.dropdown;
          const dropdown_content = self2.dropdown_content;
          const wrapper = self2.wrapper;
          const control = self2.control;
          const input = self2.input;
          const focus_node = self2.focus_node;
          const passive_event = {
            passive: true
          };
          const listboxId = self2.inputId + "-ts-dropdown";
          setAttr(dropdown_content, {
            id: listboxId
          });
          setAttr(focus_node, {
            role: "combobox",
            "aria-haspopup": "listbox",
            "aria-expanded": "false",
            "aria-controls": listboxId
          });
          const control_id = getId(focus_node, self2.inputId + "-ts-control");
          const query = "label[for='" + escapeQuery(self2.inputId) + "']";
          const label = document.querySelector(query);
          const label_click = self2.focus.bind(self2);
          if (label) {
            addEvent(label, "click", label_click);
            setAttr(label, {
              for: control_id
            });
            const label_id = getId(label, self2.inputId + "-ts-label");
            setAttr(focus_node, {
              "aria-labelledby": label_id
            });
            setAttr(dropdown_content, {
              "aria-labelledby": label_id
            });
          }
          wrapper.style.width = input.style.width;
          if (self2.plugins.names.length) {
            const classes_plugins = "plugin-" + self2.plugins.names.join(" plugin-");
            addClasses([wrapper, dropdown], classes_plugins);
          }
          if ((settings.maxItems === null || settings.maxItems > 1) && self2.is_select_tag) {
            setAttr(input, {
              multiple: "multiple"
            });
          }
          if (self2.settings.placeholder) {
            setAttr(control_input, {
              placeholder: settings.placeholder
            });
          }
          if (!self2.settings.splitOn && self2.settings.delimiter) {
            self2.settings.splitOn = new RegExp("\\s*" + escape_regex(self2.settings.delimiter) + "+\\s*");
          }
          if (settings.load && settings.loadThrottle) {
            settings.load = loadDebounce(settings.load, settings.loadThrottle);
          }
          self2.control_input.type = input.type;
          addEvent(dropdown, "click", (evt) => {
            const option2 = parentMatch(evt.target, "[data-selectable]");
            if (option2) {
              self2.onOptionSelect(evt, option2);
              preventDefault(evt, true);
            }
          });
          addEvent(control, "click", (evt) => {
            var target_match = parentMatch(evt.target, "[data-ts-item]", control);
            if (target_match && self2.onItemSelect(evt, target_match)) {
              preventDefault(evt, true);
              return;
            }
            if (control_input.value != "") {
              return;
            }
            self2.onClick();
            preventDefault(evt, true);
          });
          addEvent(focus_node, "keydown", (e) => self2.onKeyDown(e));
          addEvent(control_input, "keypress", (e) => self2.onKeyPress(e));
          addEvent(control_input, "input", (e) => self2.onInput(e));
          addEvent(focus_node, "resize", () => self2.positionDropdown(), passive_event);
          addEvent(focus_node, "blur", (e) => self2.onBlur(e));
          addEvent(focus_node, "focus", (e) => self2.onFocus(e));
          addEvent(focus_node, "paste", (e) => self2.onPaste(e));
          const doc_mousedown = (evt) => {
            const target = evt.composedPath()[0];
            if (!wrapper.contains(target) && !dropdown.contains(target)) {
              if (self2.isFocused) {
                self2.blur();
              }
              self2.inputState();
              return;
            }
            if (target == control_input && self2.isOpen) {
              evt.stopPropagation();
            } else {
              preventDefault(evt, true);
            }
          };
          var win_scroll = () => {
            if (self2.isOpen) {
              self2.positionDropdown();
            }
          };
          addEvent(document, "mousedown", doc_mousedown);
          addEvent(window, "scroll", win_scroll, passive_event);
          addEvent(window, "resize", win_scroll, passive_event);
          this._destroy = () => {
            document.removeEventListener("mousedown", doc_mousedown);
            window.removeEventListener("sroll", win_scroll);
            window.removeEventListener("resize", win_scroll);
            if (label)
              label.removeEventListener("click", label_click);
          };
          this.revertSettings = {
            innerHTML: input.innerHTML,
            tabIndex: input.tabIndex
          };
          input.tabIndex = -1;
          input.insertAdjacentElement("afterend", self2.wrapper);
          self2.sync(false);
          settings.items = [];
          delete settings.optgroups;
          delete settings.options;
          addEvent(input, "invalid", (e) => {
            if (self2.isValid) {
              self2.isValid = false;
              self2.isInvalid = true;
              self2.refreshState();
            }
          });
          self2.updateOriginalInput();
          self2.refreshItems();
          self2.close(false);
          self2.inputState();
          self2.isSetup = true;
          if (input.disabled) {
            self2.disable();
          } else {
            self2.enable();
          }
          self2.on("change", this.onChange);
          addClasses(input, "tomselected", "ts-hidden-accessible");
          self2.trigger("initialize");
          if (settings.preload === true) {
            self2.preload();
          }
        }
        setupOptions(options = [], optgroups = []) {
          this.addOptions(options);
          iterate(optgroups, (optgroup) => {
            this.registerOptionGroup(optgroup);
          });
        }
        setupTemplates() {
          var self2 = this;
          var field_label = self2.settings.labelField;
          var field_optgroup = self2.settings.optgroupLabelField;
          var templates = {
            "optgroup": (data) => {
              let optgroup = document.createElement("div");
              optgroup.className = "optgroup";
              optgroup.appendChild(data.options);
              return optgroup;
            },
            "optgroup_header": (data, escape) => {
              return '<div class="optgroup-header">' + escape(data[field_optgroup]) + "</div>";
            },
            "option": (data, escape) => {
              return "<div>" + escape(data[field_label]) + "</div>";
            },
            "item": (data, escape) => {
              return "<div>" + escape(data[field_label]) + "</div>";
            },
            "option_create": (data, escape) => {
              return '<div class="create">Add <strong>' + escape(data.input) + "</strong>&hellip;</div>";
            },
            "no_results": () => {
              return '<div class="no-results">No results found</div>';
            },
            "loading": () => {
              return '<div class="spinner"></div>';
            },
            "not_loading": () => {
            },
            "dropdown": () => {
              return "<div></div>";
            }
          };
          self2.settings.render = Object.assign({}, templates, self2.settings.render);
        }
        setupCallbacks() {
          var key, fn2;
          var callbacks = {
            "initialize": "onInitialize",
            "change": "onChange",
            "item_add": "onItemAdd",
            "item_remove": "onItemRemove",
            "item_select": "onItemSelect",
            "clear": "onClear",
            "option_add": "onOptionAdd",
            "option_remove": "onOptionRemove",
            "option_clear": "onOptionClear",
            "optgroup_add": "onOptionGroupAdd",
            "optgroup_remove": "onOptionGroupRemove",
            "optgroup_clear": "onOptionGroupClear",
            "dropdown_open": "onDropdownOpen",
            "dropdown_close": "onDropdownClose",
            "type": "onType",
            "load": "onLoad",
            "focus": "onFocus",
            "blur": "onBlur"
          };
          for (key in callbacks) {
            fn2 = this.settings[callbacks[key]];
            if (fn2)
              this.on(key, fn2);
          }
        }
        sync(get_settings = true) {
          const self2 = this;
          const settings = get_settings ? getSettings(self2.input, {
            delimiter: self2.settings.delimiter
          }) : self2.settings;
          self2.setupOptions(settings.options, settings.optgroups);
          self2.setValue(settings.items, true);
          self2.lastQuery = null;
        }
        onClick() {
          var self2 = this;
          if (self2.activeItems.length > 0) {
            self2.clearActiveItems();
            self2.focus();
            return;
          }
          if (self2.isFocused && self2.isOpen) {
            self2.blur();
          } else {
            self2.focus();
          }
        }
        onMouseDown() {
        }
        onChange() {
          triggerEvent(this.input, "input");
          triggerEvent(this.input, "change");
        }
        onPaste(e) {
          var self2 = this;
          if (self2.isInputHidden || self2.isLocked) {
            preventDefault(e);
            return;
          }
          if (self2.settings.splitOn) {
            setTimeout(() => {
              var pastedText = self2.inputValue();
              if (!pastedText.match(self2.settings.splitOn)) {
                return;
              }
              var splitInput = pastedText.trim().split(self2.settings.splitOn);
              iterate(splitInput, (piece) => {
                self2.createItem(piece);
              });
            }, 0);
          }
        }
        onKeyPress(e) {
          var self2 = this;
          if (self2.isLocked) {
            preventDefault(e);
            return;
          }
          var character = String.fromCharCode(e.keyCode || e.which);
          if (self2.settings.create && self2.settings.mode === "multi" && character === self2.settings.delimiter) {
            self2.createItem();
            preventDefault(e);
            return;
          }
        }
        onKeyDown(e) {
          var self2 = this;
          if (self2.isLocked) {
            if (e.keyCode !== KEY_TAB) {
              preventDefault(e);
            }
            return;
          }
          switch (e.keyCode) {
            case KEY_A:
              if (isKeyDown(KEY_SHORTCUT, e)) {
                if (self2.control_input.value == "") {
                  preventDefault(e);
                  self2.selectAll();
                  return;
                }
              }
              break;
            case KEY_ESC:
              if (self2.isOpen) {
                preventDefault(e, true);
                self2.close();
              }
              self2.clearActiveItems();
              return;
            case KEY_DOWN:
              if (!self2.isOpen && self2.hasOptions) {
                self2.open();
              } else if (self2.activeOption) {
                let next = self2.getAdjacent(self2.activeOption, 1);
                if (next)
                  self2.setActiveOption(next);
              }
              preventDefault(e);
              return;
            case KEY_UP:
              if (self2.activeOption) {
                let prev = self2.getAdjacent(self2.activeOption, -1);
                if (prev)
                  self2.setActiveOption(prev);
              }
              preventDefault(e);
              return;
            case KEY_RETURN:
              if (self2.canSelect(self2.activeOption)) {
                self2.onOptionSelect(e, self2.activeOption);
                preventDefault(e);
              } else if (self2.settings.create && self2.createItem()) {
                preventDefault(e);
              }
              return;
            case KEY_LEFT:
              self2.advanceSelection(-1, e);
              return;
            case KEY_RIGHT:
              self2.advanceSelection(1, e);
              return;
            case KEY_TAB:
              if (self2.settings.selectOnTab) {
                if (self2.canSelect(self2.activeOption)) {
                  self2.onOptionSelect(e, self2.activeOption);
                  preventDefault(e);
                }
                if (self2.settings.create && self2.createItem()) {
                  preventDefault(e);
                }
              }
              return;
            case KEY_BACKSPACE:
            case KEY_DELETE:
              self2.deleteSelection(e);
              return;
          }
          if (self2.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) {
            preventDefault(e);
          }
        }
        onInput(e) {
          var self2 = this;
          if (self2.isLocked) {
            return;
          }
          var value = self2.inputValue();
          if (self2.lastValue !== value) {
            self2.lastValue = value;
            if (self2.settings.shouldLoad.call(self2, value)) {
              self2.load(value);
            }
            self2.refreshOptions();
            self2.trigger("type", value);
          }
        }
        onFocus(e) {
          var self2 = this;
          var wasFocused = self2.isFocused;
          if (self2.isDisabled) {
            self2.blur();
            preventDefault(e);
            return;
          }
          if (self2.ignoreFocus)
            return;
          self2.isFocused = true;
          if (self2.settings.preload === "focus")
            self2.preload();
          if (!wasFocused)
            self2.trigger("focus");
          if (!self2.activeItems.length) {
            self2.showInput();
            self2.refreshOptions(!!self2.settings.openOnFocus);
          }
          self2.refreshState();
        }
        onBlur(e) {
          if (document.hasFocus() === false)
            return;
          var self2 = this;
          if (!self2.isFocused)
            return;
          self2.isFocused = false;
          self2.ignoreFocus = false;
          var deactivate = () => {
            self2.close();
            self2.setActiveItem();
            self2.setCaret(self2.items.length);
            self2.trigger("blur");
          };
          if (self2.settings.create && self2.settings.createOnBlur) {
            self2.createItem(null, false, deactivate);
          } else {
            deactivate();
          }
        }
        onOptionSelect(evt, option2) {
          var value, self2 = this;
          if (option2.parentElement && option2.parentElement.matches("[data-disabled]")) {
            return;
          }
          if (option2.classList.contains("create")) {
            self2.createItem(null, true, () => {
              if (self2.settings.closeAfterSelect) {
                self2.close();
              }
            });
          } else {
            value = option2.dataset.value;
            if (typeof value !== "undefined") {
              self2.lastQuery = null;
              self2.addItem(value);
              if (self2.settings.closeAfterSelect) {
                self2.close();
              }
              if (!self2.settings.hideSelected && evt.type && /click/.test(evt.type)) {
                self2.setActiveOption(option2);
              }
            }
          }
        }
        canSelect(option2) {
          if (this.isOpen && option2 && this.dropdown_content.contains(option2)) {
            return true;
          }
          return false;
        }
        onItemSelect(evt, item) {
          var self2 = this;
          if (!self2.isLocked && self2.settings.mode === "multi") {
            preventDefault(evt);
            self2.setActiveItem(item, evt);
            return true;
          }
          return false;
        }
        canLoad(value) {
          if (!this.settings.load)
            return false;
          if (this.loadedSearches.hasOwnProperty(value))
            return false;
          return true;
        }
        load(value) {
          const self2 = this;
          if (!self2.canLoad(value))
            return;
          addClasses(self2.wrapper, self2.settings.loadingClass);
          self2.loading++;
          const callback = self2.loadCallback.bind(self2);
          self2.settings.load.call(self2, value, callback);
        }
        loadCallback(options, optgroups) {
          const self2 = this;
          self2.loading = Math.max(self2.loading - 1, 0);
          self2.lastQuery = null;
          self2.clearActiveOption();
          self2.setupOptions(options, optgroups);
          self2.refreshOptions(self2.isFocused && !self2.isInputHidden);
          if (!self2.loading) {
            removeClasses(self2.wrapper, self2.settings.loadingClass);
          }
          self2.trigger("load", options, optgroups);
        }
        preload() {
          var classList = this.wrapper.classList;
          if (classList.contains("preloaded"))
            return;
          classList.add("preloaded");
          this.load("");
        }
        setTextboxValue(value = "") {
          var input = this.control_input;
          var changed = input.value !== value;
          if (changed) {
            input.value = value;
            triggerEvent(input, "update");
            this.lastValue = value;
          }
        }
        getValue() {
          if (this.is_select_tag && this.input.hasAttribute("multiple")) {
            return this.items;
          }
          return this.items.join(this.settings.delimiter);
        }
        setValue(value, silent) {
          var events = silent ? [] : ["change"];
          debounce_events(this, events, () => {
            this.clear(silent);
            this.addItems(value, silent);
          });
        }
        setMaxItems(value) {
          if (value === 0)
            value = null;
          this.settings.maxItems = value;
          this.refreshState();
        }
        setActiveItem(item, e) {
          var self2 = this;
          var eventName;
          var i, begin, end2, swap;
          var last;
          if (self2.settings.mode === "single")
            return;
          if (!item) {
            self2.clearActiveItems();
            if (self2.isFocused) {
              self2.showInput();
            }
            return;
          }
          eventName = e && e.type.toLowerCase();
          if (eventName === "click" && isKeyDown("shiftKey", e) && self2.activeItems.length) {
            last = self2.getLastActive();
            begin = Array.prototype.indexOf.call(self2.control.children, last);
            end2 = Array.prototype.indexOf.call(self2.control.children, item);
            if (begin > end2) {
              swap = begin;
              begin = end2;
              end2 = swap;
            }
            for (i = begin; i <= end2; i++) {
              item = self2.control.children[i];
              if (self2.activeItems.indexOf(item) === -1) {
                self2.setActiveItemClass(item);
              }
            }
            preventDefault(e);
          } else if (eventName === "click" && isKeyDown(KEY_SHORTCUT, e) || eventName === "keydown" && isKeyDown("shiftKey", e)) {
            if (item.classList.contains("active")) {
              self2.removeActiveItem(item);
            } else {
              self2.setActiveItemClass(item);
            }
          } else {
            self2.clearActiveItems();
            self2.setActiveItemClass(item);
          }
          self2.hideInput();
          if (!self2.isFocused) {
            self2.focus();
          }
        }
        setActiveItemClass(item) {
          const self2 = this;
          const last_active = self2.control.querySelector(".last-active");
          if (last_active)
            removeClasses(last_active, "last-active");
          addClasses(item, "active last-active");
          self2.trigger("item_select", item);
          if (self2.activeItems.indexOf(item) == -1) {
            self2.activeItems.push(item);
          }
        }
        removeActiveItem(item) {
          var idx = this.activeItems.indexOf(item);
          this.activeItems.splice(idx, 1);
          removeClasses(item, "active");
        }
        clearActiveItems() {
          removeClasses(this.activeItems, "active");
          this.activeItems = [];
        }
        setActiveOption(option2) {
          if (option2 === this.activeOption) {
            return;
          }
          this.clearActiveOption();
          if (!option2)
            return;
          this.activeOption = option2;
          setAttr(this.focus_node, {
            "aria-activedescendant": option2.getAttribute("id")
          });
          setAttr(option2, {
            "aria-selected": "true"
          });
          addClasses(option2, "active");
          this.scrollToOption(option2);
        }
        scrollToOption(option2, behavior) {
          if (!option2)
            return;
          const content = this.dropdown_content;
          const height_menu = content.clientHeight;
          const scrollTop = content.scrollTop || 0;
          const height_item = option2.offsetHeight;
          const y = option2.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;
          if (y + height_item > height_menu + scrollTop) {
            this.scroll(y - height_menu + height_item, behavior);
          } else if (y < scrollTop) {
            this.scroll(y, behavior);
          }
        }
        scroll(scrollTop, behavior) {
          const content = this.dropdown_content;
          if (behavior) {
            content.style.scrollBehavior = behavior;
          }
          content.scrollTop = scrollTop;
          content.style.scrollBehavior = "";
        }
        clearActiveOption() {
          if (this.activeOption) {
            removeClasses(this.activeOption, "active");
            setAttr(this.activeOption, {
              "aria-selected": null
            });
          }
          this.activeOption = null;
          setAttr(this.focus_node, {
            "aria-activedescendant": null
          });
        }
        selectAll() {
          if (this.settings.mode === "single")
            return;
          const activeItems = this.controlChildren();
          if (!activeItems.length)
            return;
          this.hideInput();
          this.close();
          this.activeItems = activeItems;
          addClasses(activeItems, "active");
        }
        inputState() {
          var self2 = this;
          if (!self2.control.contains(self2.control_input))
            return;
          setAttr(self2.control_input, {
            placeholder: self2.settings.placeholder
          });
          if (self2.activeItems.length > 0 || !self2.isFocused && self2.settings.hidePlaceholder && self2.items.length > 0) {
            self2.setTextboxValue();
            self2.isInputHidden = true;
          } else {
            if (self2.settings.hidePlaceholder && self2.items.length > 0) {
              setAttr(self2.control_input, {
                placeholder: ""
              });
            }
            self2.isInputHidden = false;
          }
          self2.wrapper.classList.toggle("input-hidden", self2.isInputHidden);
        }
        hideInput() {
          this.inputState();
        }
        showInput() {
          this.inputState();
        }
        inputValue() {
          return this.control_input.value.trim();
        }
        focus() {
          var self2 = this;
          if (self2.isDisabled)
            return;
          self2.ignoreFocus = true;
          if (self2.control_input.offsetWidth) {
            self2.control_input.focus();
          } else {
            self2.focus_node.focus();
          }
          setTimeout(() => {
            self2.ignoreFocus = false;
            self2.onFocus();
          }, 0);
        }
        blur() {
          this.focus_node.blur();
          this.onBlur();
        }
        getScoreFunction(query) {
          return this.sifter.getScoreFunction(query, this.getSearchOptions());
        }
        getSearchOptions() {
          var settings = this.settings;
          var sort2 = settings.sortField;
          if (typeof settings.sortField === "string") {
            sort2 = [{
              field: settings.sortField
            }];
          }
          return {
            fields: settings.searchField,
            conjunction: settings.searchConjunction,
            sort: sort2,
            nesting: settings.nesting
          };
        }
        search(query) {
          var i, result, calculateScore;
          var self2 = this;
          var options = this.getSearchOptions();
          if (self2.settings.score) {
            calculateScore = self2.settings.score.call(self2, query);
            if (typeof calculateScore !== "function") {
              throw new Error('Tom Select "score" setting must be a function that returns a function');
            }
          }
          if (query !== self2.lastQuery) {
            self2.lastQuery = query;
            result = self2.sifter.search(query, Object.assign(options, {
              score: calculateScore
            }));
            self2.currentResults = result;
          } else {
            result = Object.assign({}, self2.currentResults);
          }
          if (self2.settings.hideSelected) {
            for (i = result.items.length - 1; i >= 0; i--) {
              let hashed = hash_key(result.items[i].id);
              if (hashed && self2.items.indexOf(hashed) !== -1) {
                result.items.splice(i, 1);
              }
            }
          }
          return result;
        }
        refreshOptions(triggerDropdown = true) {
          var i, j, k, n, optgroup, optgroups, html, has_create_option, active_value, active_group;
          var create;
          const groups = {};
          const groups_order = [];
          var self2 = this;
          var query = self2.inputValue();
          var results = self2.search(query);
          var active_option = self2.activeOption;
          var show_dropdown = self2.settings.shouldOpen || false;
          var dropdown_content = self2.dropdown_content;
          if (active_option) {
            active_value = active_option.dataset.value;
            active_group = active_option.closest("[data-group]");
          }
          n = results.items.length;
          if (typeof self2.settings.maxOptions === "number") {
            n = Math.min(n, self2.settings.maxOptions);
          }
          if (n > 0) {
            show_dropdown = true;
          }
          for (i = 0; i < n; i++) {
            let opt_value = results.items[i].id;
            let option2 = self2.options[opt_value];
            let option_el = self2.getOption(opt_value, true);
            if (!self2.settings.hideSelected) {
              option_el.classList.toggle("selected", self2.items.includes(opt_value));
            }
            optgroup = option2[self2.settings.optgroupField] || "";
            optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];
            for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
              optgroup = optgroups[j];
              if (!self2.optgroups.hasOwnProperty(optgroup)) {
                optgroup = "";
              }
              if (!groups.hasOwnProperty(optgroup)) {
                groups[optgroup] = document.createDocumentFragment();
                groups_order.push(optgroup);
              }
              if (j > 0) {
                option_el = option_el.cloneNode(true);
                setAttr(option_el, {
                  id: option2.$id + "-clone-" + j,
                  "aria-selected": null
                });
                option_el.classList.add("ts-cloned");
                removeClasses(option_el, "active");
              }
              if (active_value == opt_value && active_group && active_group.dataset.group === optgroup) {
                active_option = option_el;
              }
              groups[optgroup].appendChild(option_el);
            }
          }
          if (this.settings.lockOptgroupOrder) {
            groups_order.sort((a, b) => {
              var a_order = self2.optgroups[a] && self2.optgroups[a].$order || 0;
              var b_order = self2.optgroups[b] && self2.optgroups[b].$order || 0;
              return a_order - b_order;
            });
          }
          html = document.createDocumentFragment();
          iterate(groups_order, (optgroup2) => {
            if (self2.optgroups.hasOwnProperty(optgroup2) && groups[optgroup2].children.length) {
              let group_options = document.createDocumentFragment();
              let header = self2.render("optgroup_header", self2.optgroups[optgroup2]);
              append(group_options, header);
              append(group_options, groups[optgroup2]);
              let group_html = self2.render("optgroup", {
                group: self2.optgroups[optgroup2],
                options: group_options
              });
              append(html, group_html);
            } else {
              append(html, groups[optgroup2]);
            }
          });
          dropdown_content.innerHTML = "";
          append(dropdown_content, html);
          if (self2.settings.highlight) {
            removeHighlight(dropdown_content);
            if (results.query.length && results.tokens.length) {
              iterate(results.tokens, (tok) => {
                highlight(dropdown_content, tok.regex);
              });
            }
          }
          var add_template = (template) => {
            let content = self2.render(template, {
              input: query
            });
            if (content) {
              show_dropdown = true;
              dropdown_content.insertBefore(content, dropdown_content.firstChild);
            }
            return content;
          };
          if (self2.loading) {
            add_template("loading");
          } else if (!self2.settings.shouldLoad.call(self2, query)) {
            add_template("not_loading");
          } else if (results.items.length === 0) {
            add_template("no_results");
          }
          has_create_option = self2.canCreate(query);
          if (has_create_option) {
            create = add_template("option_create");
          }
          self2.hasOptions = results.items.length > 0 || has_create_option;
          if (show_dropdown) {
            if (results.items.length > 0) {
              if (!dropdown_content.contains(active_option) && self2.settings.mode === "single" && self2.items.length) {
                active_option = self2.getOption(self2.items[0]);
              }
              if (!dropdown_content.contains(active_option)) {
                let active_index = 0;
                if (create && !self2.settings.addPrecedence) {
                  active_index = 1;
                }
                active_option = self2.selectable()[active_index];
              }
            } else if (create) {
              active_option = create;
            }
            if (triggerDropdown && !self2.isOpen) {
              self2.open();
              self2.scrollToOption(active_option, "auto");
            }
            self2.setActiveOption(active_option);
          } else {
            self2.clearActiveOption();
            if (triggerDropdown && self2.isOpen) {
              self2.close(false);
            }
          }
        }
        selectable() {
          return this.dropdown_content.querySelectorAll("[data-selectable]");
        }
        addOption(data, user_created = false) {
          const self2 = this;
          if (Array.isArray(data)) {
            self2.addOptions(data, user_created);
            return false;
          }
          const key = hash_key(data[self2.settings.valueField]);
          if (key === null || self2.options.hasOwnProperty(key)) {
            return false;
          }
          data.$order = data.$order || ++self2.order;
          data.$id = self2.inputId + "-opt-" + data.$order;
          self2.options[key] = data;
          self2.lastQuery = null;
          if (user_created) {
            self2.userOptions[key] = user_created;
            self2.trigger("option_add", key, data);
          }
          return key;
        }
        addOptions(data, user_created = false) {
          iterate(data, (dat) => {
            this.addOption(dat, user_created);
          });
        }
        registerOption(data) {
          return this.addOption(data);
        }
        registerOptionGroup(data) {
          var key = hash_key(data[this.settings.optgroupValueField]);
          if (key === null)
            return false;
          data.$order = data.$order || ++this.order;
          this.optgroups[key] = data;
          return key;
        }
        addOptionGroup(id, data) {
          var hashed_id;
          data[this.settings.optgroupValueField] = id;
          if (hashed_id = this.registerOptionGroup(data)) {
            this.trigger("optgroup_add", hashed_id, data);
          }
        }
        removeOptionGroup(id) {
          if (this.optgroups.hasOwnProperty(id)) {
            delete this.optgroups[id];
            this.clearCache();
            this.trigger("optgroup_remove", id);
          }
        }
        clearOptionGroups() {
          this.optgroups = {};
          this.clearCache();
          this.trigger("optgroup_clear");
        }
        updateOption(value, data) {
          const self2 = this;
          var item_new;
          var index_item;
          const value_old = hash_key(value);
          const value_new = hash_key(data[self2.settings.valueField]);
          if (value_old === null)
            return;
          if (!self2.options.hasOwnProperty(value_old))
            return;
          if (typeof value_new !== "string")
            throw new Error("Value must be set in option data");
          const option2 = self2.getOption(value_old);
          const item = self2.getItem(value_old);
          data.$order = data.$order || self2.options[value_old].$order;
          delete self2.options[value_old];
          self2.uncacheValue(value_new);
          self2.options[value_new] = data;
          if (option2) {
            if (self2.dropdown_content.contains(option2)) {
              const option_new = self2._render("option", data);
              replaceNode(option2, option_new);
              if (self2.activeOption === option2) {
                self2.setActiveOption(option_new);
              }
            }
            option2.remove();
          }
          if (item) {
            index_item = self2.items.indexOf(value_old);
            if (index_item !== -1) {
              self2.items.splice(index_item, 1, value_new);
            }
            item_new = self2._render("item", data);
            if (item.classList.contains("active"))
              addClasses(item_new, "active");
            replaceNode(item, item_new);
          }
          self2.lastQuery = null;
        }
        removeOption(value, silent) {
          const self2 = this;
          value = get_hash(value);
          self2.uncacheValue(value);
          delete self2.userOptions[value];
          delete self2.options[value];
          self2.lastQuery = null;
          self2.trigger("option_remove", value);
          self2.removeItem(value, silent);
        }
        clearOptions() {
          this.loadedSearches = {};
          this.userOptions = {};
          this.clearCache();
          var selected = {};
          iterate(this.options, (option2, key) => {
            if (this.items.indexOf(key) >= 0) {
              selected[key] = this.options[key];
            }
          });
          this.options = this.sifter.items = selected;
          this.lastQuery = null;
          this.trigger("option_clear");
        }
        getOption(value, create = false) {
          const hashed = hash_key(value);
          if (hashed !== null && this.options.hasOwnProperty(hashed)) {
            const option2 = this.options[hashed];
            if (option2.$div) {
              return option2.$div;
            }
            if (create) {
              return this._render("option", option2);
            }
          }
          return null;
        }
        getAdjacent(option2, direction, type = "option") {
          var self2 = this, all;
          if (!option2) {
            return null;
          }
          if (type == "item") {
            all = self2.controlChildren();
          } else {
            all = self2.dropdown_content.querySelectorAll("[data-selectable]");
          }
          for (let i = 0; i < all.length; i++) {
            if (all[i] != option2) {
              continue;
            }
            if (direction > 0) {
              return all[i + 1];
            }
            return all[i - 1];
          }
          return null;
        }
        getItem(item) {
          if (typeof item == "object") {
            return item;
          }
          var value = hash_key(item);
          return value !== null ? this.control.querySelector(`[data-value="${addSlashes(value)}"]`) : null;
        }
        addItems(values, silent) {
          var self2 = this;
          var items = Array.isArray(values) ? values : [values];
          items = items.filter((x) => self2.items.indexOf(x) === -1);
          for (let i = 0, n = items.length; i < n; i++) {
            self2.isPending = i < n - 1;
            self2.addItem(items[i], silent);
          }
        }
        addItem(value, silent) {
          var events = silent ? [] : ["change", "dropdown_close"];
          debounce_events(this, events, () => {
            var item, wasFull;
            const self2 = this;
            const inputMode = self2.settings.mode;
            const hashed = hash_key(value);
            if (hashed && self2.items.indexOf(hashed) !== -1) {
              if (inputMode === "single") {
                self2.close();
              }
              if (inputMode === "single" || !self2.settings.duplicates) {
                return;
              }
            }
            if (hashed === null || !self2.options.hasOwnProperty(hashed))
              return;
            if (inputMode === "single")
              self2.clear(silent);
            if (inputMode === "multi" && self2.isFull())
              return;
            item = self2._render("item", self2.options[hashed]);
            if (self2.control.contains(item)) {
              item = item.cloneNode(true);
            }
            wasFull = self2.isFull();
            self2.items.splice(self2.caretPos, 0, hashed);
            self2.insertAtCaret(item);
            if (self2.isSetup) {
              if (!self2.isPending && self2.settings.hideSelected) {
                let option2 = self2.getOption(hashed);
                let next = self2.getAdjacent(option2, 1);
                if (next) {
                  self2.setActiveOption(next);
                }
              }
              if (!self2.isPending && !self2.settings.closeAfterSelect) {
                self2.refreshOptions(self2.isFocused && inputMode !== "single");
              }
              if (self2.settings.closeAfterSelect != false && self2.isFull()) {
                self2.close();
              } else if (!self2.isPending) {
                self2.positionDropdown();
              }
              self2.trigger("item_add", hashed, item);
              if (!self2.isPending) {
                self2.updateOriginalInput({
                  silent
                });
              }
            }
            if (!self2.isPending || !wasFull && self2.isFull()) {
              self2.inputState();
              self2.refreshState();
            }
          });
        }
        removeItem(item = null, silent) {
          const self2 = this;
          item = self2.getItem(item);
          if (!item)
            return;
          var i, idx;
          const value = item.dataset.value;
          i = nodeIndex(item);
          item.remove();
          if (item.classList.contains("active")) {
            idx = self2.activeItems.indexOf(item);
            self2.activeItems.splice(idx, 1);
            removeClasses(item, "active");
          }
          self2.items.splice(i, 1);
          self2.lastQuery = null;
          if (!self2.settings.persist && self2.userOptions.hasOwnProperty(value)) {
            self2.removeOption(value, silent);
          }
          if (i < self2.caretPos) {
            self2.setCaret(self2.caretPos - 1);
          }
          self2.updateOriginalInput({
            silent
          });
          self2.refreshState();
          self2.positionDropdown();
          self2.trigger("item_remove", value, item);
        }
        createItem(input = null, triggerDropdown = true, callback = () => {
        }) {
          var self2 = this;
          var caret = self2.caretPos;
          var output;
          input = input || self2.inputValue();
          if (!self2.canCreate(input)) {
            callback();
            return false;
          }
          self2.lock();
          var created = false;
          var create = (data) => {
            self2.unlock();
            if (!data || typeof data !== "object")
              return callback();
            var value = hash_key(data[self2.settings.valueField]);
            if (typeof value !== "string") {
              return callback();
            }
            self2.setTextboxValue();
            self2.addOption(data, true);
            self2.setCaret(caret);
            self2.addItem(value);
            callback(data);
            created = true;
          };
          if (typeof self2.settings.create === "function") {
            output = self2.settings.create.call(this, input, create);
          } else {
            output = {
              [self2.settings.labelField]: input,
              [self2.settings.valueField]: input
            };
          }
          if (!created) {
            create(output);
          }
          return true;
        }
        refreshItems() {
          var self2 = this;
          self2.lastQuery = null;
          if (self2.isSetup) {
            self2.addItems(self2.items);
          }
          self2.updateOriginalInput();
          self2.refreshState();
        }
        refreshState() {
          const self2 = this;
          self2.refreshValidityState();
          const isFull = self2.isFull();
          const isLocked = self2.isLocked;
          self2.wrapper.classList.toggle("rtl", self2.rtl);
          const wrap_classList = self2.wrapper.classList;
          wrap_classList.toggle("focus", self2.isFocused);
          wrap_classList.toggle("disabled", self2.isDisabled);
          wrap_classList.toggle("required", self2.isRequired);
          wrap_classList.toggle("invalid", !self2.isValid);
          wrap_classList.toggle("locked", isLocked);
          wrap_classList.toggle("full", isFull);
          wrap_classList.toggle("input-active", self2.isFocused && !self2.isInputHidden);
          wrap_classList.toggle("dropdown-active", self2.isOpen);
          wrap_classList.toggle("has-options", isEmptyObject(self2.options));
          wrap_classList.toggle("has-items", self2.items.length > 0);
        }
        refreshValidityState() {
          var self2 = this;
          if (!self2.input.checkValidity) {
            return;
          }
          self2.isValid = self2.input.checkValidity();
          self2.isInvalid = !self2.isValid;
        }
        isFull() {
          return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
        }
        updateOriginalInput(opts = {}) {
          const self2 = this;
          var option2, label;
          const empty_option = self2.input.querySelector('option[value=""]');
          if (self2.is_select_tag) {
            let AddSelected = function(option_el, value, label2) {
              if (!option_el) {
                option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label2) + "</option>");
              }
              if (option_el != empty_option) {
                self2.input.append(option_el);
              }
              selected.push(option_el);
              option_el.selected = true;
              return option_el;
            };
            const selected = [];
            self2.input.querySelectorAll("option:checked").forEach((option_el) => {
              option_el.selected = false;
            });
            if (self2.items.length == 0 && self2.settings.mode == "single") {
              AddSelected(empty_option, "", "");
            } else {
              self2.items.forEach((value) => {
                option2 = self2.options[value];
                label = option2[self2.settings.labelField] || "";
                if (selected.includes(option2.$option)) {
                  const reuse_opt = self2.input.querySelector(`option[value="${addSlashes(value)}"]:not(:checked)`);
                  AddSelected(reuse_opt, value, label);
                } else {
                  option2.$option = AddSelected(option2.$option, value, label);
                }
              });
            }
          } else {
            self2.input.value = self2.getValue();
          }
          if (self2.isSetup) {
            if (!opts.silent) {
              self2.trigger("change", self2.getValue());
            }
          }
        }
        open() {
          var self2 = this;
          if (self2.isLocked || self2.isOpen || self2.settings.mode === "multi" && self2.isFull())
            return;
          self2.isOpen = true;
          setAttr(self2.focus_node, {
            "aria-expanded": "true"
          });
          self2.refreshState();
          applyCSS(self2.dropdown, {
            visibility: "hidden",
            display: "block"
          });
          self2.positionDropdown();
          applyCSS(self2.dropdown, {
            visibility: "visible",
            display: "block"
          });
          self2.focus();
          self2.trigger("dropdown_open", self2.dropdown);
        }
        close(setTextboxValue = true) {
          var self2 = this;
          var trigger = self2.isOpen;
          if (setTextboxValue) {
            self2.setTextboxValue();
            if (self2.settings.mode === "single" && self2.items.length) {
              self2.hideInput();
            }
          }
          self2.isOpen = false;
          setAttr(self2.focus_node, {
            "aria-expanded": "false"
          });
          applyCSS(self2.dropdown, {
            display: "none"
          });
          if (self2.settings.hideSelected) {
            self2.clearActiveOption();
          }
          self2.refreshState();
          if (trigger)
            self2.trigger("dropdown_close", self2.dropdown);
        }
        positionDropdown() {
          if (this.settings.dropdownParent !== "body") {
            return;
          }
          var context = this.control;
          var rect = context.getBoundingClientRect();
          var top2 = context.offsetHeight + rect.top + window.scrollY;
          var left2 = rect.left + window.scrollX;
          applyCSS(this.dropdown, {
            width: rect.width + "px",
            top: top2 + "px",
            left: left2 + "px"
          });
        }
        clear(silent) {
          var self2 = this;
          if (!self2.items.length)
            return;
          var items = self2.controlChildren();
          iterate(items, (item) => {
            self2.removeItem(item, true);
          });
          self2.showInput();
          if (!silent)
            self2.updateOriginalInput();
          self2.trigger("clear");
        }
        insertAtCaret(el) {
          const self2 = this;
          const caret = self2.caretPos;
          const target = self2.control;
          target.insertBefore(el, target.children[caret]);
          self2.setCaret(caret + 1);
        }
        deleteSelection(e) {
          var direction, selection, caret, tail;
          var self2 = this;
          direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
          selection = getSelection(self2.control_input);
          const rm_items = [];
          if (self2.activeItems.length) {
            tail = getTail(self2.activeItems, direction);
            caret = nodeIndex(tail);
            if (direction > 0) {
              caret++;
            }
            iterate(self2.activeItems, (item) => rm_items.push(item));
          } else if ((self2.isFocused || self2.settings.mode === "single") && self2.items.length) {
            const items = self2.controlChildren();
            if (direction < 0 && selection.start === 0 && selection.length === 0) {
              rm_items.push(items[self2.caretPos - 1]);
            } else if (direction > 0 && selection.start === self2.inputValue().length) {
              rm_items.push(items[self2.caretPos]);
            }
          }
          const values = rm_items.map((item) => item.dataset.value);
          if (!values.length || typeof self2.settings.onDelete === "function" && self2.settings.onDelete.call(self2, values, e) === false) {
            return false;
          }
          preventDefault(e, true);
          if (typeof caret !== "undefined") {
            self2.setCaret(caret);
          }
          while (rm_items.length) {
            self2.removeItem(rm_items.pop());
          }
          self2.showInput();
          self2.positionDropdown();
          self2.refreshOptions(false);
          return true;
        }
        advanceSelection(direction, e) {
          var last_active, adjacent, self2 = this;
          if (self2.rtl)
            direction *= -1;
          if (self2.inputValue().length)
            return;
          if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown("shiftKey", e)) {
            last_active = self2.getLastActive(direction);
            if (last_active) {
              if (!last_active.classList.contains("active")) {
                adjacent = last_active;
              } else {
                adjacent = self2.getAdjacent(last_active, direction, "item");
              }
            } else if (direction > 0) {
              adjacent = self2.control_input.nextElementSibling;
            } else {
              adjacent = self2.control_input.previousElementSibling;
            }
            if (adjacent) {
              if (adjacent.classList.contains("active")) {
                self2.removeActiveItem(last_active);
              }
              self2.setActiveItemClass(adjacent);
            }
          } else {
            self2.moveCaret(direction);
          }
        }
        moveCaret(direction) {
        }
        getLastActive(direction) {
          let last_active = this.control.querySelector(".last-active");
          if (last_active) {
            return last_active;
          }
          var result = this.control.querySelectorAll(".active");
          if (result) {
            return getTail(result, direction);
          }
        }
        setCaret(new_pos) {
          this.caretPos = this.items.length;
        }
        controlChildren() {
          return Array.from(this.control.querySelectorAll("[data-ts-item]"));
        }
        lock() {
          this.isLocked = true;
          this.refreshState();
        }
        unlock() {
          this.isLocked = false;
          this.refreshState();
        }
        disable() {
          var self2 = this;
          self2.input.disabled = true;
          self2.control_input.disabled = true;
          self2.focus_node.tabIndex = -1;
          self2.isDisabled = true;
          this.close();
          self2.lock();
        }
        enable() {
          var self2 = this;
          self2.input.disabled = false;
          self2.control_input.disabled = false;
          self2.focus_node.tabIndex = self2.tabIndex;
          self2.isDisabled = false;
          self2.unlock();
        }
        destroy() {
          var self2 = this;
          var revertSettings = self2.revertSettings;
          self2.trigger("destroy");
          self2.off();
          self2.wrapper.remove();
          self2.dropdown.remove();
          self2.input.innerHTML = revertSettings.innerHTML;
          self2.input.tabIndex = revertSettings.tabIndex;
          removeClasses(self2.input, "tomselected", "ts-hidden-accessible");
          self2._destroy();
          delete self2.input.tomselect;
        }
        render(templateName, data) {
          if (typeof this.settings.render[templateName] !== "function") {
            return null;
          }
          return this._render(templateName, data);
        }
        _render(templateName, data) {
          var value = "", id, html;
          const self2 = this;
          if (templateName === "option" || templateName == "item") {
            value = get_hash(data[self2.settings.valueField]);
          }
          html = self2.settings.render[templateName].call(this, data, escape_html);
          if (html == null) {
            return html;
          }
          html = getDom(html);
          if (templateName === "option" || templateName === "option_create") {
            if (data[self2.settings.disabledField]) {
              setAttr(html, {
                "aria-disabled": "true"
              });
            } else {
              setAttr(html, {
                "data-selectable": ""
              });
            }
          } else if (templateName === "optgroup") {
            id = data.group[self2.settings.optgroupValueField];
            setAttr(html, {
              "data-group": id
            });
            if (data.group[self2.settings.disabledField]) {
              setAttr(html, {
                "data-disabled": ""
              });
            }
          }
          if (templateName === "option" || templateName === "item") {
            setAttr(html, {
              "data-value": value
            });
            if (templateName === "item") {
              addClasses(html, self2.settings.itemClass);
              setAttr(html, {
                "data-ts-item": ""
              });
            } else {
              addClasses(html, self2.settings.optionClass);
              setAttr(html, {
                role: "option",
                id: data.$id
              });
              self2.options[value].$div = html;
            }
          }
          return html;
        }
        clearCache() {
          iterate(this.options, (option2, value) => {
            if (option2.$div) {
              option2.$div.remove();
              delete option2.$div;
            }
          });
        }
        uncacheValue(value) {
          const option_el = this.getOption(value);
          if (option_el)
            option_el.remove();
        }
        canCreate(input) {
          return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
        }
        hook(when, method, new_fn) {
          var self2 = this;
          var orig_method = self2[method];
          self2[method] = function() {
            var result, result_new;
            if (when === "after") {
              result = orig_method.apply(self2, arguments);
            }
            result_new = new_fn.apply(self2, arguments);
            if (when === "instead") {
              return result_new;
            }
            if (when === "before") {
              result = orig_method.apply(self2, arguments);
            }
            return result;
          };
        }
      }
      function change_listener() {
        addEvent(this.input, "change", () => {
          this.sync();
        });
      }
      function checkbox_options() {
        var self2 = this;
        var orig_onOptionSelect = self2.onOptionSelect;
        self2.settings.hideSelected = false;
        var UpdateCheckbox = function UpdateCheckbox2(option2) {
          setTimeout(() => {
            var checkbox = option2.querySelector("input");
            if (option2.classList.contains("selected")) {
              checkbox.checked = true;
            } else {
              checkbox.checked = false;
            }
          }, 1);
        };
        self2.hook("after", "setupTemplates", () => {
          var orig_render_option = self2.settings.render.option;
          self2.settings.render.option = (data, escape_html2) => {
            var rendered = getDom(orig_render_option.call(self2, data, escape_html2));
            var checkbox = document.createElement("input");
            checkbox.addEventListener("click", function(evt) {
              preventDefault(evt);
            });
            checkbox.type = "checkbox";
            const hashed = hash_key(data[self2.settings.valueField]);
            if (hashed && self2.items.indexOf(hashed) > -1) {
              checkbox.checked = true;
            }
            rendered.prepend(checkbox);
            return rendered;
          };
        });
        self2.on("item_remove", (value) => {
          var option2 = self2.getOption(value);
          if (option2) {
            option2.classList.remove("selected");
            UpdateCheckbox(option2);
          }
        });
        self2.hook("instead", "onOptionSelect", (evt, option2) => {
          if (option2.classList.contains("selected")) {
            option2.classList.remove("selected");
            self2.removeItem(option2.dataset.value);
            self2.refreshOptions();
            preventDefault(evt, true);
            return;
          }
          orig_onOptionSelect.call(self2, evt, option2);
          UpdateCheckbox(option2);
        });
      }
      function clear_button(userOptions) {
        const self2 = this;
        const options = Object.assign({
          className: "clear-button",
          title: "Clear All",
          html: (data) => {
            return `<div class="${data.className}" title="${data.title}">&times;</div>`;
          }
        }, userOptions);
        self2.on("initialize", () => {
          var button = getDom(options.html(options));
          button.addEventListener("click", (evt) => {
            self2.clear();
            if (self2.settings.mode === "single" && self2.settings.allowEmptyOption) {
              self2.addItem("");
            }
            evt.preventDefault();
            evt.stopPropagation();
          });
          self2.control.appendChild(button);
        });
      }
      function drag_drop() {
        var self2 = this;
        if (!$.fn.sortable)
          throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
        if (self2.settings.mode !== "multi")
          return;
        var orig_lock = self2.lock;
        var orig_unlock = self2.unlock;
        self2.hook("instead", "lock", () => {
          var sortable = $(self2.control).data("sortable");
          if (sortable)
            sortable.disable();
          return orig_lock.call(self2);
        });
        self2.hook("instead", "unlock", () => {
          var sortable = $(self2.control).data("sortable");
          if (sortable)
            sortable.enable();
          return orig_unlock.call(self2);
        });
        self2.on("initialize", () => {
          var $control = $(self2.control).sortable({
            items: "[data-value]",
            forcePlaceholderSize: true,
            disabled: self2.isLocked,
            start: (e, ui) => {
              ui.placeholder.css("width", ui.helper.css("width"));
              $control.css({
                overflow: "visible"
              });
            },
            stop: () => {
              $control.css({
                overflow: "hidden"
              });
              var values = [];
              $control.children("[data-value]").each(function() {
                if (this.dataset.value)
                  values.push(this.dataset.value);
              });
              self2.setValue(values);
            }
          });
        });
      }
      function dropdown_header(userOptions) {
        const self2 = this;
        const options = Object.assign({
          title: "Untitled",
          headerClass: "dropdown-header",
          titleRowClass: "dropdown-header-title",
          labelClass: "dropdown-header-label",
          closeClass: "dropdown-header-close",
          html: (data) => {
            return '<div class="' + data.headerClass + '"><div class="' + data.titleRowClass + '"><span class="' + data.labelClass + '">' + data.title + '</span><a class="' + data.closeClass + '">&times;</a></div></div>';
          }
        }, userOptions);
        self2.on("initialize", () => {
          var header = getDom(options.html(options));
          var close_link = header.querySelector("." + options.closeClass);
          if (close_link) {
            close_link.addEventListener("click", (evt) => {
              preventDefault(evt, true);
              self2.close();
            });
          }
          self2.dropdown.insertBefore(header, self2.dropdown.firstChild);
        });
      }
      function caret_position() {
        var self2 = this;
        self2.hook("instead", "setCaret", (new_pos) => {
          if (self2.settings.mode === "single" || !self2.control.contains(self2.control_input)) {
            new_pos = self2.items.length;
          } else {
            new_pos = Math.max(0, Math.min(self2.items.length, new_pos));
            if (new_pos != self2.caretPos && !self2.isPending) {
              self2.controlChildren().forEach((child, j) => {
                if (j < new_pos) {
                  self2.control_input.insertAdjacentElement("beforebegin", child);
                } else {
                  self2.control.appendChild(child);
                }
              });
            }
          }
          self2.caretPos = new_pos;
        });
        self2.hook("instead", "moveCaret", (direction) => {
          if (!self2.isFocused)
            return;
          const last_active = self2.getLastActive(direction);
          if (last_active) {
            const idx = nodeIndex(last_active);
            self2.setCaret(direction > 0 ? idx + 1 : idx);
            self2.setActiveItem();
          } else {
            self2.setCaret(self2.caretPos + direction);
          }
        });
      }
      function dropdown_input() {
        var self2 = this;
        self2.settings.shouldOpen = true;
        self2.hook("before", "setup", () => {
          self2.focus_node = self2.control;
          addClasses(self2.control_input, "dropdown-input");
          const div = getDom('<div class="dropdown-input-wrap">');
          div.append(self2.control_input);
          self2.dropdown.insertBefore(div, self2.dropdown.firstChild);
        });
        self2.on("initialize", () => {
          self2.control_input.addEventListener("keydown", (evt) => {
            switch (evt.keyCode) {
              case KEY_ESC:
                if (self2.isOpen) {
                  preventDefault(evt, true);
                  self2.close();
                }
                self2.clearActiveItems();
                return;
              case KEY_TAB:
                self2.focus_node.tabIndex = -1;
                break;
            }
            return self2.onKeyDown.call(self2, evt);
          });
          self2.on("blur", () => {
            self2.focus_node.tabIndex = self2.isDisabled ? -1 : self2.tabIndex;
          });
          self2.on("dropdown_open", () => {
            self2.control_input.focus();
          });
          const orig_onBlur = self2.onBlur;
          self2.hook("instead", "onBlur", (evt) => {
            if (evt && evt.relatedTarget == self2.control_input)
              return;
            return orig_onBlur.call(self2);
          });
          addEvent(self2.control_input, "blur", () => self2.onBlur());
          self2.hook("before", "close", () => {
            if (!self2.isOpen)
              return;
            self2.focus_node.focus();
          });
        });
      }
      function input_autogrow() {
        var self2 = this;
        self2.on("initialize", () => {
          var test_input = document.createElement("span");
          var control = self2.control_input;
          test_input.style.cssText = "position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ";
          self2.wrapper.appendChild(test_input);
          var transfer_styles = ["letterSpacing", "fontSize", "fontFamily", "fontWeight", "textTransform"];
          for (const style_name of transfer_styles) {
            test_input.style[style_name] = control.style[style_name];
          }
          var resize = () => {
            if (self2.items.length > 0) {
              test_input.textContent = control.value;
              control.style.width = test_input.clientWidth + "px";
            } else {
              control.style.width = "";
            }
          };
          resize();
          self2.on("update item_add item_remove", resize);
          addEvent(control, "input", resize);
          addEvent(control, "keyup", resize);
          addEvent(control, "blur", resize);
          addEvent(control, "update", resize);
        });
      }
      function no_backspace_delete() {
        var self2 = this;
        var orig_deleteSelection = self2.deleteSelection;
        this.hook("instead", "deleteSelection", (evt) => {
          if (self2.activeItems.length) {
            return orig_deleteSelection.call(self2, evt);
          }
          return false;
        });
      }
      function no_active_items() {
        this.hook("instead", "setActiveItem", () => {
        });
        this.hook("instead", "selectAll", () => {
        });
      }
      function optgroup_columns() {
        var self2 = this;
        var orig_keydown = self2.onKeyDown;
        self2.hook("instead", "onKeyDown", (evt) => {
          var index2, option2, options, optgroup;
          if (!self2.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
            return orig_keydown.call(self2, evt);
          }
          optgroup = parentMatch(self2.activeOption, "[data-group]");
          index2 = nodeIndex(self2.activeOption, "[data-selectable]");
          if (!optgroup) {
            return;
          }
          if (evt.keyCode === KEY_LEFT) {
            optgroup = optgroup.previousSibling;
          } else {
            optgroup = optgroup.nextSibling;
          }
          if (!optgroup) {
            return;
          }
          options = optgroup.querySelectorAll("[data-selectable]");
          option2 = options[Math.min(options.length - 1, index2)];
          if (option2) {
            self2.setActiveOption(option2);
          }
        });
      }
      function remove_button(userOptions) {
        const options = Object.assign({
          label: "&times;",
          title: "Remove",
          className: "remove",
          append: true
        }, userOptions);
        var self2 = this;
        if (!options.append) {
          return;
        }
        var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + "</a>";
        self2.hook("after", "setupTemplates", () => {
          var orig_render_item = self2.settings.render.item;
          self2.settings.render.item = (data, escape) => {
            var rendered = getDom(orig_render_item.call(self2, data, escape));
            var close_button = getDom(html);
            rendered.appendChild(close_button);
            addEvent(close_button, "mousedown", (evt) => {
              preventDefault(evt, true);
            });
            addEvent(close_button, "click", (evt) => {
              preventDefault(evt, true);
              if (self2.isLocked)
                return;
              var value = rendered.dataset.value;
              self2.removeItem(value);
              self2.refreshOptions(false);
            });
            return rendered;
          };
        });
      }
      function restore_on_backspace(userOptions) {
        const self2 = this;
        const options = Object.assign({
          text: (option2) => {
            return option2[self2.settings.labelField];
          }
        }, userOptions);
        self2.on("item_remove", function(value) {
          if (self2.control_input.value.trim() === "") {
            var option2 = self2.options[value];
            if (option2) {
              self2.setTextboxValue(options.text.call(self2, option2));
            }
          }
        });
      }
      function virtual_scroll() {
        const self2 = this;
        const orig_canLoad = self2.canLoad;
        const orig_clearActiveOption = self2.clearActiveOption;
        const orig_loadCallback = self2.loadCallback;
        var pagination = {};
        var dropdown_content;
        var loading_more = false;
        if (!self2.settings.firstUrl) {
          throw "virtual_scroll plugin requires a firstUrl() method";
        }
        self2.settings.sortField = [{
          field: "$order"
        }, {
          field: "$score"
        }];
        function canLoadMore(query) {
          if (typeof self2.settings.maxOptions === "number" && dropdown_content.children.length >= self2.settings.maxOptions) {
            return false;
          }
          if (query in pagination && pagination[query]) {
            return true;
          }
          return false;
        }
        self2.setNextUrl = function(value, next_url) {
          pagination[value] = next_url;
        };
        self2.getUrl = function(query) {
          if (query in pagination) {
            const next_url = pagination[query];
            pagination[query] = false;
            return next_url;
          }
          pagination = {};
          return self2.settings.firstUrl(query);
        };
        self2.hook("instead", "clearActiveOption", () => {
          if (loading_more) {
            return;
          }
          return orig_clearActiveOption.call(self2);
        });
        self2.hook("instead", "canLoad", (query) => {
          if (!(query in pagination)) {
            return orig_canLoad.call(self2, query);
          }
          return canLoadMore(query);
        });
        self2.hook("instead", "loadCallback", (options, optgroups) => {
          if (!loading_more) {
            self2.clearOptions();
          }
          orig_loadCallback.call(self2, options, optgroups);
          loading_more = false;
        });
        self2.hook("after", "refreshOptions", () => {
          const query = self2.lastValue;
          var option2;
          if (canLoadMore(query)) {
            option2 = self2.render("loading_more", {
              query
            });
            if (option2)
              option2.setAttribute("data-selectable", "");
          } else if (query in pagination && !dropdown_content.querySelector(".no-results")) {
            option2 = self2.render("no_more_results", {
              query
            });
          }
          if (option2) {
            addClasses(option2, self2.settings.optionClass);
            dropdown_content.append(option2);
          }
        });
        self2.on("initialize", () => {
          dropdown_content = self2.dropdown_content;
          self2.settings.render = Object.assign({}, {
            loading_more: function() {
              return `<div class="loading-more-results">Loading more results ... </div>`;
            },
            no_more_results: function() {
              return `<div class="no-more-results">No more results</div>`;
            }
          }, self2.settings.render);
          dropdown_content.addEventListener("scroll", function() {
            const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
            if (scroll_percent < 0.95) {
              return;
            }
            if (!canLoadMore(self2.lastValue)) {
              return;
            }
            if (loading_more)
              return;
            loading_more = true;
            self2.load.call(self2, self2.lastValue);
          });
        });
      }
      TomSelect3.define("change_listener", change_listener);
      TomSelect3.define("checkbox_options", checkbox_options);
      TomSelect3.define("clear_button", clear_button);
      TomSelect3.define("drag_drop", drag_drop);
      TomSelect3.define("dropdown_header", dropdown_header);
      TomSelect3.define("caret_position", caret_position);
      TomSelect3.define("dropdown_input", dropdown_input);
      TomSelect3.define("input_autogrow", input_autogrow);
      TomSelect3.define("no_backspace_delete", no_backspace_delete);
      TomSelect3.define("no_active_items", no_active_items);
      TomSelect3.define("optgroup_columns", optgroup_columns);
      TomSelect3.define("remove_button", remove_button);
      TomSelect3.define("restore_on_backspace", restore_on_backspace);
      TomSelect3.define("virtual_scroll", virtual_scroll);
      return TomSelect3;
    });
  }
});

// node_modules/@hotwired/stimulus/dist/stimulus.js
var EventListener = class {
  constructor(eventTarget, eventName, eventOptions) {
    this.eventTarget = eventTarget;
    this.eventName = eventName;
    this.eventOptions = eventOptions;
    this.unorderedBindings = /* @__PURE__ */ new Set();
  }
  connect() {
    this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
  }
  disconnect() {
    this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
  }
  bindingConnected(binding) {
    this.unorderedBindings.add(binding);
  }
  bindingDisconnected(binding) {
    this.unorderedBindings.delete(binding);
  }
  handleEvent(event) {
    const extendedEvent = extendEvent(event);
    for (const binding of this.bindings) {
      if (extendedEvent.immediatePropagationStopped) {
        break;
      } else {
        binding.handleEvent(extendedEvent);
      }
    }
  }
  get bindings() {
    return Array.from(this.unorderedBindings).sort((left2, right2) => {
      const leftIndex = left2.index, rightIndex = right2.index;
      return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
    });
  }
};
function extendEvent(event) {
  if ("immediatePropagationStopped" in event) {
    return event;
  } else {
    const { stopImmediatePropagation } = event;
    return Object.assign(event, {
      immediatePropagationStopped: false,
      stopImmediatePropagation() {
        this.immediatePropagationStopped = true;
        stopImmediatePropagation.call(this);
      }
    });
  }
}
var Dispatcher = class {
  constructor(application) {
    this.application = application;
    this.eventListenerMaps = /* @__PURE__ */ new Map();
    this.started = false;
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.eventListeners.forEach((eventListener) => eventListener.connect());
    }
  }
  stop() {
    if (this.started) {
      this.started = false;
      this.eventListeners.forEach((eventListener) => eventListener.disconnect());
    }
  }
  get eventListeners() {
    return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
  }
  bindingConnected(binding) {
    this.fetchEventListenerForBinding(binding).bindingConnected(binding);
  }
  bindingDisconnected(binding) {
    this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
  }
  handleError(error2, message, detail = {}) {
    this.application.handleError(error2, `Error ${message}`, detail);
  }
  fetchEventListenerForBinding(binding) {
    const { eventTarget, eventName, eventOptions } = binding;
    return this.fetchEventListener(eventTarget, eventName, eventOptions);
  }
  fetchEventListener(eventTarget, eventName, eventOptions) {
    const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
    const cacheKey = this.cacheKey(eventName, eventOptions);
    let eventListener = eventListenerMap.get(cacheKey);
    if (!eventListener) {
      eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
      eventListenerMap.set(cacheKey, eventListener);
    }
    return eventListener;
  }
  createEventListener(eventTarget, eventName, eventOptions) {
    const eventListener = new EventListener(eventTarget, eventName, eventOptions);
    if (this.started) {
      eventListener.connect();
    }
    return eventListener;
  }
  fetchEventListenerMapForEventTarget(eventTarget) {
    let eventListenerMap = this.eventListenerMaps.get(eventTarget);
    if (!eventListenerMap) {
      eventListenerMap = /* @__PURE__ */ new Map();
      this.eventListenerMaps.set(eventTarget, eventListenerMap);
    }
    return eventListenerMap;
  }
  cacheKey(eventName, eventOptions) {
    const parts = [eventName];
    Object.keys(eventOptions).sort().forEach((key) => {
      parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
    });
    return parts.join(":");
  }
};
var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
function parseActionDescriptorString(descriptorString) {
  const source = descriptorString.trim();
  const matches2 = source.match(descriptorPattern) || [];
  return {
    eventTarget: parseEventTarget(matches2[4]),
    eventName: matches2[2],
    eventOptions: matches2[9] ? parseEventOptions(matches2[9]) : {},
    identifier: matches2[5],
    methodName: matches2[7]
  };
}
function parseEventTarget(eventTargetName) {
  if (eventTargetName == "window") {
    return window;
  } else if (eventTargetName == "document") {
    return document;
  }
}
function parseEventOptions(eventOptions) {
  return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
}
function stringifyEventTarget(eventTarget) {
  if (eventTarget == window) {
    return "window";
  } else if (eventTarget == document) {
    return "document";
  }
}
function camelize(value) {
  return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}
function tokenize(value) {
  return value.match(/[^\s]+/g) || [];
}
var Action = class {
  constructor(element, index2, descriptor) {
    this.element = element;
    this.index = index2;
    this.eventTarget = descriptor.eventTarget || element;
    this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
    this.eventOptions = descriptor.eventOptions || {};
    this.identifier = descriptor.identifier || error("missing identifier");
    this.methodName = descriptor.methodName || error("missing method name");
  }
  static forToken(token) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content));
  }
  toString() {
    const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
    return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
  }
  get params() {
    if (this.eventTarget instanceof Element) {
      return this.getParamsFromEventTargetAttributes(this.eventTarget);
    } else {
      return {};
    }
  }
  getParamsFromEventTargetAttributes(eventTarget) {
    const params = {};
    const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
    const attributes = Array.from(eventTarget.attributes);
    attributes.forEach(({ name, value }) => {
      const match = name.match(pattern);
      const key = match && match[1];
      if (key) {
        Object.assign(params, { [camelize(key)]: typecast(value) });
      }
    });
    return params;
  }
  get eventTargetName() {
    return stringifyEventTarget(this.eventTarget);
  }
};
var defaultEventNames = {
  "a": (e) => "click",
  "button": (e) => "click",
  "form": (e) => "submit",
  "details": (e) => "toggle",
  "input": (e) => e.getAttribute("type") == "submit" ? "click" : "input",
  "select": (e) => "change",
  "textarea": (e) => "input"
};
function getDefaultEventNameForElement(element) {
  const tagName = element.tagName.toLowerCase();
  if (tagName in defaultEventNames) {
    return defaultEventNames[tagName](element);
  }
}
function error(message) {
  throw new Error(message);
}
function typecast(value) {
  try {
    return JSON.parse(value);
  } catch (o_O) {
    return value;
  }
}
var Binding = class {
  constructor(context, action) {
    this.context = context;
    this.action = action;
  }
  get index() {
    return this.action.index;
  }
  get eventTarget() {
    return this.action.eventTarget;
  }
  get eventOptions() {
    return this.action.eventOptions;
  }
  get identifier() {
    return this.context.identifier;
  }
  handleEvent(event) {
    if (this.willBeInvokedByEvent(event)) {
      this.invokeWithEvent(event);
    }
  }
  get eventName() {
    return this.action.eventName;
  }
  get method() {
    const method = this.controller[this.methodName];
    if (typeof method == "function") {
      return method;
    }
    throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
  }
  invokeWithEvent(event) {
    const { target, currentTarget } = event;
    try {
      const { params } = this.action;
      const actionEvent = Object.assign(event, { params });
      this.method.call(this.controller, actionEvent);
      this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
    } catch (error2) {
      const { identifier, controller, element, index: index2 } = this;
      const detail = { identifier, controller, element, index: index2, event };
      this.context.handleError(error2, `invoking action "${this.action}"`, detail);
    }
  }
  willBeInvokedByEvent(event) {
    const eventTarget = event.target;
    if (this.element === eventTarget) {
      return true;
    } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
      return this.scope.containsElement(eventTarget);
    } else {
      return this.scope.containsElement(this.action.element);
    }
  }
  get controller() {
    return this.context.controller;
  }
  get methodName() {
    return this.action.methodName;
  }
  get element() {
    return this.scope.element;
  }
  get scope() {
    return this.context.scope;
  }
};
var ElementObserver = class {
  constructor(element, delegate) {
    this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
    this.element = element;
    this.started = false;
    this.delegate = delegate;
    this.elements = /* @__PURE__ */ new Set();
    this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.mutationObserver.observe(this.element, this.mutationObserverInit);
      this.refresh();
    }
  }
  pause(callback) {
    if (this.started) {
      this.mutationObserver.disconnect();
      this.started = false;
    }
    callback();
    if (!this.started) {
      this.mutationObserver.observe(this.element, this.mutationObserverInit);
      this.started = true;
    }
  }
  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords();
      this.mutationObserver.disconnect();
      this.started = false;
    }
  }
  refresh() {
    if (this.started) {
      const matches2 = new Set(this.matchElementsInTree());
      for (const element of Array.from(this.elements)) {
        if (!matches2.has(element)) {
          this.removeElement(element);
        }
      }
      for (const element of Array.from(matches2)) {
        this.addElement(element);
      }
    }
  }
  processMutations(mutations) {
    if (this.started) {
      for (const mutation of mutations) {
        this.processMutation(mutation);
      }
    }
  }
  processMutation(mutation) {
    if (mutation.type == "attributes") {
      this.processAttributeChange(mutation.target, mutation.attributeName);
    } else if (mutation.type == "childList") {
      this.processRemovedNodes(mutation.removedNodes);
      this.processAddedNodes(mutation.addedNodes);
    }
  }
  processAttributeChange(node, attributeName) {
    const element = node;
    if (this.elements.has(element)) {
      if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
        this.delegate.elementAttributeChanged(element, attributeName);
      } else {
        this.removeElement(element);
      }
    } else if (this.matchElement(element)) {
      this.addElement(element);
    }
  }
  processRemovedNodes(nodes) {
    for (const node of Array.from(nodes)) {
      const element = this.elementFromNode(node);
      if (element) {
        this.processTree(element, this.removeElement);
      }
    }
  }
  processAddedNodes(nodes) {
    for (const node of Array.from(nodes)) {
      const element = this.elementFromNode(node);
      if (element && this.elementIsActive(element)) {
        this.processTree(element, this.addElement);
      }
    }
  }
  matchElement(element) {
    return this.delegate.matchElement(element);
  }
  matchElementsInTree(tree = this.element) {
    return this.delegate.matchElementsInTree(tree);
  }
  processTree(tree, processor) {
    for (const element of this.matchElementsInTree(tree)) {
      processor.call(this, element);
    }
  }
  elementFromNode(node) {
    if (node.nodeType == Node.ELEMENT_NODE) {
      return node;
    }
  }
  elementIsActive(element) {
    if (element.isConnected != this.element.isConnected) {
      return false;
    } else {
      return this.element.contains(element);
    }
  }
  addElement(element) {
    if (!this.elements.has(element)) {
      if (this.elementIsActive(element)) {
        this.elements.add(element);
        if (this.delegate.elementMatched) {
          this.delegate.elementMatched(element);
        }
      }
    }
  }
  removeElement(element) {
    if (this.elements.has(element)) {
      this.elements.delete(element);
      if (this.delegate.elementUnmatched) {
        this.delegate.elementUnmatched(element);
      }
    }
  }
};
var AttributeObserver = class {
  constructor(element, attributeName, delegate) {
    this.attributeName = attributeName;
    this.delegate = delegate;
    this.elementObserver = new ElementObserver(element, this);
  }
  get element() {
    return this.elementObserver.element;
  }
  get selector() {
    return `[${this.attributeName}]`;
  }
  start() {
    this.elementObserver.start();
  }
  pause(callback) {
    this.elementObserver.pause(callback);
  }
  stop() {
    this.elementObserver.stop();
  }
  refresh() {
    this.elementObserver.refresh();
  }
  get started() {
    return this.elementObserver.started;
  }
  matchElement(element) {
    return element.hasAttribute(this.attributeName);
  }
  matchElementsInTree(tree) {
    const match = this.matchElement(tree) ? [tree] : [];
    const matches2 = Array.from(tree.querySelectorAll(this.selector));
    return match.concat(matches2);
  }
  elementMatched(element) {
    if (this.delegate.elementMatchedAttribute) {
      this.delegate.elementMatchedAttribute(element, this.attributeName);
    }
  }
  elementUnmatched(element) {
    if (this.delegate.elementUnmatchedAttribute) {
      this.delegate.elementUnmatchedAttribute(element, this.attributeName);
    }
  }
  elementAttributeChanged(element, attributeName) {
    if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
      this.delegate.elementAttributeValueChanged(element, attributeName);
    }
  }
};
var StringMapObserver = class {
  constructor(element, delegate) {
    this.element = element;
    this.delegate = delegate;
    this.started = false;
    this.stringMap = /* @__PURE__ */ new Map();
    this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
  }
  start() {
    if (!this.started) {
      this.started = true;
      this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
      this.refresh();
    }
  }
  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords();
      this.mutationObserver.disconnect();
      this.started = false;
    }
  }
  refresh() {
    if (this.started) {
      for (const attributeName of this.knownAttributeNames) {
        this.refreshAttribute(attributeName, null);
      }
    }
  }
  processMutations(mutations) {
    if (this.started) {
      for (const mutation of mutations) {
        this.processMutation(mutation);
      }
    }
  }
  processMutation(mutation) {
    const attributeName = mutation.attributeName;
    if (attributeName) {
      this.refreshAttribute(attributeName, mutation.oldValue);
    }
  }
  refreshAttribute(attributeName, oldValue) {
    const key = this.delegate.getStringMapKeyForAttribute(attributeName);
    if (key != null) {
      if (!this.stringMap.has(attributeName)) {
        this.stringMapKeyAdded(key, attributeName);
      }
      const value = this.element.getAttribute(attributeName);
      if (this.stringMap.get(attributeName) != value) {
        this.stringMapValueChanged(value, key, oldValue);
      }
      if (value == null) {
        const oldValue2 = this.stringMap.get(attributeName);
        this.stringMap.delete(attributeName);
        if (oldValue2)
          this.stringMapKeyRemoved(key, attributeName, oldValue2);
      } else {
        this.stringMap.set(attributeName, value);
      }
    }
  }
  stringMapKeyAdded(key, attributeName) {
    if (this.delegate.stringMapKeyAdded) {
      this.delegate.stringMapKeyAdded(key, attributeName);
    }
  }
  stringMapValueChanged(value, key, oldValue) {
    if (this.delegate.stringMapValueChanged) {
      this.delegate.stringMapValueChanged(value, key, oldValue);
    }
  }
  stringMapKeyRemoved(key, attributeName, oldValue) {
    if (this.delegate.stringMapKeyRemoved) {
      this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
    }
  }
  get knownAttributeNames() {
    return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
  }
  get currentAttributeNames() {
    return Array.from(this.element.attributes).map((attribute) => attribute.name);
  }
  get recordedAttributeNames() {
    return Array.from(this.stringMap.keys());
  }
};
function add(map, key, value) {
  fetch2(map, key).add(value);
}
function del(map, key, value) {
  fetch2(map, key).delete(value);
  prune(map, key);
}
function fetch2(map, key) {
  let values = map.get(key);
  if (!values) {
    values = /* @__PURE__ */ new Set();
    map.set(key, values);
  }
  return values;
}
function prune(map, key) {
  const values = map.get(key);
  if (values != null && values.size == 0) {
    map.delete(key);
  }
}
var Multimap = class {
  constructor() {
    this.valuesByKey = /* @__PURE__ */ new Map();
  }
  get keys() {
    return Array.from(this.valuesByKey.keys());
  }
  get values() {
    const sets = Array.from(this.valuesByKey.values());
    return sets.reduce((values, set) => values.concat(Array.from(set)), []);
  }
  get size() {
    const sets = Array.from(this.valuesByKey.values());
    return sets.reduce((size, set) => size + set.size, 0);
  }
  add(key, value) {
    add(this.valuesByKey, key, value);
  }
  delete(key, value) {
    del(this.valuesByKey, key, value);
  }
  has(key, value) {
    const values = this.valuesByKey.get(key);
    return values != null && values.has(value);
  }
  hasKey(key) {
    return this.valuesByKey.has(key);
  }
  hasValue(value) {
    const sets = Array.from(this.valuesByKey.values());
    return sets.some((set) => set.has(value));
  }
  getValuesForKey(key) {
    const values = this.valuesByKey.get(key);
    return values ? Array.from(values) : [];
  }
  getKeysForValue(value) {
    return Array.from(this.valuesByKey).filter(([key, values]) => values.has(value)).map(([key, values]) => key);
  }
};
var TokenListObserver = class {
  constructor(element, attributeName, delegate) {
    this.attributeObserver = new AttributeObserver(element, attributeName, this);
    this.delegate = delegate;
    this.tokensByElement = new Multimap();
  }
  get started() {
    return this.attributeObserver.started;
  }
  start() {
    this.attributeObserver.start();
  }
  pause(callback) {
    this.attributeObserver.pause(callback);
  }
  stop() {
    this.attributeObserver.stop();
  }
  refresh() {
    this.attributeObserver.refresh();
  }
  get element() {
    return this.attributeObserver.element;
  }
  get attributeName() {
    return this.attributeObserver.attributeName;
  }
  elementMatchedAttribute(element) {
    this.tokensMatched(this.readTokensForElement(element));
  }
  elementAttributeValueChanged(element) {
    const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
    this.tokensUnmatched(unmatchedTokens);
    this.tokensMatched(matchedTokens);
  }
  elementUnmatchedAttribute(element) {
    this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
  }
  tokensMatched(tokens) {
    tokens.forEach((token) => this.tokenMatched(token));
  }
  tokensUnmatched(tokens) {
    tokens.forEach((token) => this.tokenUnmatched(token));
  }
  tokenMatched(token) {
    this.delegate.tokenMatched(token);
    this.tokensByElement.add(token.element, token);
  }
  tokenUnmatched(token) {
    this.delegate.tokenUnmatched(token);
    this.tokensByElement.delete(token.element, token);
  }
  refreshTokensForElement(element) {
    const previousTokens = this.tokensByElement.getValuesForKey(element);
    const currentTokens = this.readTokensForElement(element);
    const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
    if (firstDifferingIndex == -1) {
      return [[], []];
    } else {
      return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
    }
  }
  readTokensForElement(element) {
    const attributeName = this.attributeName;
    const tokenString = element.getAttribute(attributeName) || "";
    return parseTokenString(tokenString, element, attributeName);
  }
};
function parseTokenString(tokenString, element, attributeName) {
  return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index2) => ({ element, attributeName, content, index: index2 }));
}
function zip(left2, right2) {
  const length = Math.max(left2.length, right2.length);
  return Array.from({ length }, (_, index2) => [left2[index2], right2[index2]]);
}
function tokensAreEqual(left2, right2) {
  return left2 && right2 && left2.index == right2.index && left2.content == right2.content;
}
var ValueListObserver = class {
  constructor(element, attributeName, delegate) {
    this.tokenListObserver = new TokenListObserver(element, attributeName, this);
    this.delegate = delegate;
    this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
    this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
  }
  get started() {
    return this.tokenListObserver.started;
  }
  start() {
    this.tokenListObserver.start();
  }
  stop() {
    this.tokenListObserver.stop();
  }
  refresh() {
    this.tokenListObserver.refresh();
  }
  get element() {
    return this.tokenListObserver.element;
  }
  get attributeName() {
    return this.tokenListObserver.attributeName;
  }
  tokenMatched(token) {
    const { element } = token;
    const { value } = this.fetchParseResultForToken(token);
    if (value) {
      this.fetchValuesByTokenForElement(element).set(token, value);
      this.delegate.elementMatchedValue(element, value);
    }
  }
  tokenUnmatched(token) {
    const { element } = token;
    const { value } = this.fetchParseResultForToken(token);
    if (value) {
      this.fetchValuesByTokenForElement(element).delete(token);
      this.delegate.elementUnmatchedValue(element, value);
    }
  }
  fetchParseResultForToken(token) {
    let parseResult = this.parseResultsByToken.get(token);
    if (!parseResult) {
      parseResult = this.parseToken(token);
      this.parseResultsByToken.set(token, parseResult);
    }
    return parseResult;
  }
  fetchValuesByTokenForElement(element) {
    let valuesByToken = this.valuesByTokenByElement.get(element);
    if (!valuesByToken) {
      valuesByToken = /* @__PURE__ */ new Map();
      this.valuesByTokenByElement.set(element, valuesByToken);
    }
    return valuesByToken;
  }
  parseToken(token) {
    try {
      const value = this.delegate.parseValueForToken(token);
      return { value };
    } catch (error2) {
      return { error: error2 };
    }
  }
};
var BindingObserver = class {
  constructor(context, delegate) {
    this.context = context;
    this.delegate = delegate;
    this.bindingsByAction = /* @__PURE__ */ new Map();
  }
  start() {
    if (!this.valueListObserver) {
      this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
      this.valueListObserver.start();
    }
  }
  stop() {
    if (this.valueListObserver) {
      this.valueListObserver.stop();
      delete this.valueListObserver;
      this.disconnectAllActions();
    }
  }
  get element() {
    return this.context.element;
  }
  get identifier() {
    return this.context.identifier;
  }
  get actionAttribute() {
    return this.schema.actionAttribute;
  }
  get schema() {
    return this.context.schema;
  }
  get bindings() {
    return Array.from(this.bindingsByAction.values());
  }
  connectAction(action) {
    const binding = new Binding(this.context, action);
    this.bindingsByAction.set(action, binding);
    this.delegate.bindingConnected(binding);
  }
  disconnectAction(action) {
    const binding = this.bindingsByAction.get(action);
    if (binding) {
      this.bindingsByAction.delete(action);
      this.delegate.bindingDisconnected(binding);
    }
  }
  disconnectAllActions() {
    this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding));
    this.bindingsByAction.clear();
  }
  parseValueForToken(token) {
    const action = Action.forToken(token);
    if (action.identifier == this.identifier) {
      return action;
    }
  }
  elementMatchedValue(element, action) {
    this.connectAction(action);
  }
  elementUnmatchedValue(element, action) {
    this.disconnectAction(action);
  }
};
var ValueObserver = class {
  constructor(context, receiver) {
    this.context = context;
    this.receiver = receiver;
    this.stringMapObserver = new StringMapObserver(this.element, this);
    this.valueDescriptorMap = this.controller.valueDescriptorMap;
    this.invokeChangedCallbacksForDefaultValues();
  }
  start() {
    this.stringMapObserver.start();
  }
  stop() {
    this.stringMapObserver.stop();
  }
  get element() {
    return this.context.element;
  }
  get controller() {
    return this.context.controller;
  }
  getStringMapKeyForAttribute(attributeName) {
    if (attributeName in this.valueDescriptorMap) {
      return this.valueDescriptorMap[attributeName].name;
    }
  }
  stringMapKeyAdded(key, attributeName) {
    const descriptor = this.valueDescriptorMap[attributeName];
    if (!this.hasValue(key)) {
      this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
    }
  }
  stringMapValueChanged(value, name, oldValue) {
    const descriptor = this.valueDescriptorNameMap[name];
    if (value === null)
      return;
    if (oldValue === null) {
      oldValue = descriptor.writer(descriptor.defaultValue);
    }
    this.invokeChangedCallback(name, value, oldValue);
  }
  stringMapKeyRemoved(key, attributeName, oldValue) {
    const descriptor = this.valueDescriptorNameMap[key];
    if (this.hasValue(key)) {
      this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
    } else {
      this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
    }
  }
  invokeChangedCallbacksForDefaultValues() {
    for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
      if (defaultValue != void 0 && !this.controller.data.has(key)) {
        this.invokeChangedCallback(name, writer(defaultValue), void 0);
      }
    }
  }
  invokeChangedCallback(name, rawValue, rawOldValue) {
    const changedMethodName = `${name}Changed`;
    const changedMethod = this.receiver[changedMethodName];
    if (typeof changedMethod == "function") {
      const descriptor = this.valueDescriptorNameMap[name];
      const value = descriptor.reader(rawValue);
      let oldValue = rawOldValue;
      if (rawOldValue) {
        oldValue = descriptor.reader(rawOldValue);
      }
      changedMethod.call(this.receiver, value, oldValue);
    }
  }
  get valueDescriptors() {
    const { valueDescriptorMap } = this;
    return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
  }
  get valueDescriptorNameMap() {
    const descriptors = {};
    Object.keys(this.valueDescriptorMap).forEach((key) => {
      const descriptor = this.valueDescriptorMap[key];
      descriptors[descriptor.name] = descriptor;
    });
    return descriptors;
  }
  hasValue(attributeName) {
    const descriptor = this.valueDescriptorNameMap[attributeName];
    const hasMethodName = `has${capitalize(descriptor.name)}`;
    return this.receiver[hasMethodName];
  }
};
var TargetObserver = class {
  constructor(context, delegate) {
    this.context = context;
    this.delegate = delegate;
    this.targetsByName = new Multimap();
  }
  start() {
    if (!this.tokenListObserver) {
      this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
      this.tokenListObserver.start();
    }
  }
  stop() {
    if (this.tokenListObserver) {
      this.disconnectAllTargets();
      this.tokenListObserver.stop();
      delete this.tokenListObserver;
    }
  }
  tokenMatched({ element, content: name }) {
    if (this.scope.containsElement(element)) {
      this.connectTarget(element, name);
    }
  }
  tokenUnmatched({ element, content: name }) {
    this.disconnectTarget(element, name);
  }
  connectTarget(element, name) {
    var _a;
    if (!this.targetsByName.has(name, element)) {
      this.targetsByName.add(name, element);
      (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
    }
  }
  disconnectTarget(element, name) {
    var _a;
    if (this.targetsByName.has(name, element)) {
      this.targetsByName.delete(name, element);
      (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
    }
  }
  disconnectAllTargets() {
    for (const name of this.targetsByName.keys) {
      for (const element of this.targetsByName.getValuesForKey(name)) {
        this.disconnectTarget(element, name);
      }
    }
  }
  get attributeName() {
    return `data-${this.context.identifier}-target`;
  }
  get element() {
    return this.context.element;
  }
  get scope() {
    return this.context.scope;
  }
};
var Context = class {
  constructor(module, scope) {
    this.logDebugActivity = (functionName, detail = {}) => {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.logDebugActivity(this.identifier, functionName, detail);
    };
    this.module = module;
    this.scope = scope;
    this.controller = new module.controllerConstructor(this);
    this.bindingObserver = new BindingObserver(this, this.dispatcher);
    this.valueObserver = new ValueObserver(this, this.controller);
    this.targetObserver = new TargetObserver(this, this);
    try {
      this.controller.initialize();
      this.logDebugActivity("initialize");
    } catch (error2) {
      this.handleError(error2, "initializing controller");
    }
  }
  connect() {
    this.bindingObserver.start();
    this.valueObserver.start();
    this.targetObserver.start();
    try {
      this.controller.connect();
      this.logDebugActivity("connect");
    } catch (error2) {
      this.handleError(error2, "connecting controller");
    }
  }
  disconnect() {
    try {
      this.controller.disconnect();
      this.logDebugActivity("disconnect");
    } catch (error2) {
      this.handleError(error2, "disconnecting controller");
    }
    this.targetObserver.stop();
    this.valueObserver.stop();
    this.bindingObserver.stop();
  }
  get application() {
    return this.module.application;
  }
  get identifier() {
    return this.module.identifier;
  }
  get schema() {
    return this.application.schema;
  }
  get dispatcher() {
    return this.application.dispatcher;
  }
  get element() {
    return this.scope.element;
  }
  get parentElement() {
    return this.element.parentElement;
  }
  handleError(error2, message, detail = {}) {
    const { identifier, controller, element } = this;
    detail = Object.assign({ identifier, controller, element }, detail);
    this.application.handleError(error2, `Error ${message}`, detail);
  }
  targetConnected(element, name) {
    this.invokeControllerMethod(`${name}TargetConnected`, element);
  }
  targetDisconnected(element, name) {
    this.invokeControllerMethod(`${name}TargetDisconnected`, element);
  }
  invokeControllerMethod(methodName, ...args) {
    const controller = this.controller;
    if (typeof controller[methodName] == "function") {
      controller[methodName](...args);
    }
  }
};
function readInheritableStaticArrayValues(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return Array.from(ancestors.reduce((values, constructor2) => {
    getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
    return values;
  }, /* @__PURE__ */ new Set()));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
  const ancestors = getAncestorsForConstructor(constructor);
  return ancestors.reduce((pairs, constructor2) => {
    pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
    return pairs;
  }, []);
}
function getAncestorsForConstructor(constructor) {
  const ancestors = [];
  while (constructor) {
    ancestors.push(constructor);
    constructor = Object.getPrototypeOf(constructor);
  }
  return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
  const definition = constructor[propertyName];
  return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
  const definition = constructor[propertyName];
  return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
}
function bless(constructor) {
  return shadow(constructor, getBlessedProperties(constructor));
}
function shadow(constructor, properties) {
  const shadowConstructor = extend(constructor);
  const shadowProperties = getShadowProperties(constructor.prototype, properties);
  Object.defineProperties(shadowConstructor.prototype, shadowProperties);
  return shadowConstructor;
}
function getBlessedProperties(constructor) {
  const blessings = readInheritableStaticArrayValues(constructor, "blessings");
  return blessings.reduce((blessedProperties, blessing) => {
    const properties = blessing(constructor);
    for (const key in properties) {
      const descriptor = blessedProperties[key] || {};
      blessedProperties[key] = Object.assign(descriptor, properties[key]);
    }
    return blessedProperties;
  }, {});
}
function getShadowProperties(prototype, properties) {
  return getOwnKeys(properties).reduce((shadowProperties, key) => {
    const descriptor = getShadowedDescriptor(prototype, properties, key);
    if (descriptor) {
      Object.assign(shadowProperties, { [key]: descriptor });
    }
    return shadowProperties;
  }, {});
}
function getShadowedDescriptor(prototype, properties, key) {
  const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
  const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
  if (!shadowedByValue) {
    const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
    if (shadowingDescriptor) {
      descriptor.get = shadowingDescriptor.get || descriptor.get;
      descriptor.set = shadowingDescriptor.set || descriptor.set;
    }
    return descriptor;
  }
}
var getOwnKeys = (() => {
  if (typeof Object.getOwnPropertySymbols == "function") {
    return (object) => [
      ...Object.getOwnPropertyNames(object),
      ...Object.getOwnPropertySymbols(object)
    ];
  } else {
    return Object.getOwnPropertyNames;
  }
})();
var extend = (() => {
  function extendWithReflect(constructor) {
    function extended() {
      return Reflect.construct(constructor, arguments, new.target);
    }
    extended.prototype = Object.create(constructor.prototype, {
      constructor: { value: extended }
    });
    Reflect.setPrototypeOf(extended, constructor);
    return extended;
  }
  function testReflectExtension() {
    const a = function() {
      this.a.call(this);
    };
    const b = extendWithReflect(a);
    b.prototype.a = function() {
    };
    return new b();
  }
  try {
    testReflectExtension();
    return extendWithReflect;
  } catch (error2) {
    return (constructor) => class extended extends constructor {
    };
  }
})();
function blessDefinition(definition) {
  return {
    identifier: definition.identifier,
    controllerConstructor: bless(definition.controllerConstructor)
  };
}
var Module = class {
  constructor(application, definition) {
    this.application = application;
    this.definition = blessDefinition(definition);
    this.contextsByScope = /* @__PURE__ */ new WeakMap();
    this.connectedContexts = /* @__PURE__ */ new Set();
  }
  get identifier() {
    return this.definition.identifier;
  }
  get controllerConstructor() {
    return this.definition.controllerConstructor;
  }
  get contexts() {
    return Array.from(this.connectedContexts);
  }
  connectContextForScope(scope) {
    const context = this.fetchContextForScope(scope);
    this.connectedContexts.add(context);
    context.connect();
  }
  disconnectContextForScope(scope) {
    const context = this.contextsByScope.get(scope);
    if (context) {
      this.connectedContexts.delete(context);
      context.disconnect();
    }
  }
  fetchContextForScope(scope) {
    let context = this.contextsByScope.get(scope);
    if (!context) {
      context = new Context(this, scope);
      this.contextsByScope.set(scope, context);
    }
    return context;
  }
};
var ClassMap = class {
  constructor(scope) {
    this.scope = scope;
  }
  has(name) {
    return this.data.has(this.getDataKey(name));
  }
  get(name) {
    return this.getAll(name)[0];
  }
  getAll(name) {
    const tokenString = this.data.get(this.getDataKey(name)) || "";
    return tokenize(tokenString);
  }
  getAttributeName(name) {
    return this.data.getAttributeNameForKey(this.getDataKey(name));
  }
  getDataKey(name) {
    return `${name}-class`;
  }
  get data() {
    return this.scope.data;
  }
};
var DataMap = class {
  constructor(scope) {
    this.scope = scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get(key) {
    const name = this.getAttributeNameForKey(key);
    return this.element.getAttribute(name);
  }
  set(key, value) {
    const name = this.getAttributeNameForKey(key);
    this.element.setAttribute(name, value);
    return this.get(key);
  }
  has(key) {
    const name = this.getAttributeNameForKey(key);
    return this.element.hasAttribute(name);
  }
  delete(key) {
    if (this.has(key)) {
      const name = this.getAttributeNameForKey(key);
      this.element.removeAttribute(name);
      return true;
    } else {
      return false;
    }
  }
  getAttributeNameForKey(key) {
    return `data-${this.identifier}-${dasherize(key)}`;
  }
};
var Guide = class {
  constructor(logger) {
    this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
    this.logger = logger;
  }
  warn(object, key, message) {
    let warnedKeys = this.warnedKeysByObject.get(object);
    if (!warnedKeys) {
      warnedKeys = /* @__PURE__ */ new Set();
      this.warnedKeysByObject.set(object, warnedKeys);
    }
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      this.logger.warn(message, object);
    }
  }
};
function attributeValueContainsToken(attributeName, token) {
  return `[${attributeName}~="${token}"]`;
}
var TargetSet = class {
  constructor(scope) {
    this.scope = scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get schema() {
    return this.scope.schema;
  }
  has(targetName) {
    return this.find(targetName) != null;
  }
  find(...targetNames) {
    return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
  }
  findAll(...targetNames) {
    return targetNames.reduce((targets, targetName) => [
      ...targets,
      ...this.findAllTargets(targetName),
      ...this.findAllLegacyTargets(targetName)
    ], []);
  }
  findTarget(targetName) {
    const selector = this.getSelectorForTargetName(targetName);
    return this.scope.findElement(selector);
  }
  findAllTargets(targetName) {
    const selector = this.getSelectorForTargetName(targetName);
    return this.scope.findAllElements(selector);
  }
  getSelectorForTargetName(targetName) {
    const attributeName = this.schema.targetAttributeForScope(this.identifier);
    return attributeValueContainsToken(attributeName, targetName);
  }
  findLegacyTarget(targetName) {
    const selector = this.getLegacySelectorForTargetName(targetName);
    return this.deprecate(this.scope.findElement(selector), targetName);
  }
  findAllLegacyTargets(targetName) {
    const selector = this.getLegacySelectorForTargetName(targetName);
    return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
  }
  getLegacySelectorForTargetName(targetName) {
    const targetDescriptor = `${this.identifier}.${targetName}`;
    return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
  }
  deprecate(element, targetName) {
    if (element) {
      const { identifier } = this;
      const attributeName = this.schema.targetAttribute;
      const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
      this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
    }
    return element;
  }
  get guide() {
    return this.scope.guide;
  }
};
var Scope = class {
  constructor(schema, element, identifier, logger) {
    this.targets = new TargetSet(this);
    this.classes = new ClassMap(this);
    this.data = new DataMap(this);
    this.containsElement = (element2) => {
      return element2.closest(this.controllerSelector) === this.element;
    };
    this.schema = schema;
    this.element = element;
    this.identifier = identifier;
    this.guide = new Guide(logger);
  }
  findElement(selector) {
    return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
  }
  findAllElements(selector) {
    return [
      ...this.element.matches(selector) ? [this.element] : [],
      ...this.queryElements(selector).filter(this.containsElement)
    ];
  }
  queryElements(selector) {
    return Array.from(this.element.querySelectorAll(selector));
  }
  get controllerSelector() {
    return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
  }
};
var ScopeObserver = class {
  constructor(element, schema, delegate) {
    this.element = element;
    this.schema = schema;
    this.delegate = delegate;
    this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
    this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
    this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
  }
  start() {
    this.valueListObserver.start();
  }
  stop() {
    this.valueListObserver.stop();
  }
  get controllerAttribute() {
    return this.schema.controllerAttribute;
  }
  parseValueForToken(token) {
    const { element, content: identifier } = token;
    const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
    let scope = scopesByIdentifier.get(identifier);
    if (!scope) {
      scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
      scopesByIdentifier.set(identifier, scope);
    }
    return scope;
  }
  elementMatchedValue(element, value) {
    const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
    this.scopeReferenceCounts.set(value, referenceCount);
    if (referenceCount == 1) {
      this.delegate.scopeConnected(value);
    }
  }
  elementUnmatchedValue(element, value) {
    const referenceCount = this.scopeReferenceCounts.get(value);
    if (referenceCount) {
      this.scopeReferenceCounts.set(value, referenceCount - 1);
      if (referenceCount == 1) {
        this.delegate.scopeDisconnected(value);
      }
    }
  }
  fetchScopesByIdentifierForElement(element) {
    let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
    if (!scopesByIdentifier) {
      scopesByIdentifier = /* @__PURE__ */ new Map();
      this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
    }
    return scopesByIdentifier;
  }
};
var Router = class {
  constructor(application) {
    this.application = application;
    this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
    this.scopesByIdentifier = new Multimap();
    this.modulesByIdentifier = /* @__PURE__ */ new Map();
  }
  get element() {
    return this.application.element;
  }
  get schema() {
    return this.application.schema;
  }
  get logger() {
    return this.application.logger;
  }
  get controllerAttribute() {
    return this.schema.controllerAttribute;
  }
  get modules() {
    return Array.from(this.modulesByIdentifier.values());
  }
  get contexts() {
    return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
  }
  start() {
    this.scopeObserver.start();
  }
  stop() {
    this.scopeObserver.stop();
  }
  loadDefinition(definition) {
    this.unloadIdentifier(definition.identifier);
    const module = new Module(this.application, definition);
    this.connectModule(module);
  }
  unloadIdentifier(identifier) {
    const module = this.modulesByIdentifier.get(identifier);
    if (module) {
      this.disconnectModule(module);
    }
  }
  getContextForElementAndIdentifier(element, identifier) {
    const module = this.modulesByIdentifier.get(identifier);
    if (module) {
      return module.contexts.find((context) => context.element == element);
    }
  }
  handleError(error2, message, detail) {
    this.application.handleError(error2, message, detail);
  }
  createScopeForElementAndIdentifier(element, identifier) {
    return new Scope(this.schema, element, identifier, this.logger);
  }
  scopeConnected(scope) {
    this.scopesByIdentifier.add(scope.identifier, scope);
    const module = this.modulesByIdentifier.get(scope.identifier);
    if (module) {
      module.connectContextForScope(scope);
    }
  }
  scopeDisconnected(scope) {
    this.scopesByIdentifier.delete(scope.identifier, scope);
    const module = this.modulesByIdentifier.get(scope.identifier);
    if (module) {
      module.disconnectContextForScope(scope);
    }
  }
  connectModule(module) {
    this.modulesByIdentifier.set(module.identifier, module);
    const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
    scopes.forEach((scope) => module.connectContextForScope(scope));
  }
  disconnectModule(module) {
    this.modulesByIdentifier.delete(module.identifier);
    const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
    scopes.forEach((scope) => module.disconnectContextForScope(scope));
  }
};
var defaultSchema = {
  controllerAttribute: "data-controller",
  actionAttribute: "data-action",
  targetAttribute: "data-target",
  targetAttributeForScope: (identifier) => `data-${identifier}-target`
};
var Application = class {
  constructor(element = document.documentElement, schema = defaultSchema) {
    this.logger = console;
    this.debug = false;
    this.logDebugActivity = (identifier, functionName, detail = {}) => {
      if (this.debug) {
        this.logFormattedMessage(identifier, functionName, detail);
      }
    };
    this.element = element;
    this.schema = schema;
    this.dispatcher = new Dispatcher(this);
    this.router = new Router(this);
  }
  static start(element, schema) {
    const application = new Application(element, schema);
    application.start();
    return application;
  }
  async start() {
    await domReady();
    this.logDebugActivity("application", "starting");
    this.dispatcher.start();
    this.router.start();
    this.logDebugActivity("application", "start");
  }
  stop() {
    this.logDebugActivity("application", "stopping");
    this.dispatcher.stop();
    this.router.stop();
    this.logDebugActivity("application", "stop");
  }
  register(identifier, controllerConstructor) {
    if (controllerConstructor.shouldLoad) {
      this.load({ identifier, controllerConstructor });
    }
  }
  load(head, ...rest) {
    const definitions = Array.isArray(head) ? head : [head, ...rest];
    definitions.forEach((definition) => this.router.loadDefinition(definition));
  }
  unload(head, ...rest) {
    const identifiers = Array.isArray(head) ? head : [head, ...rest];
    identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
  }
  get controllers() {
    return this.router.contexts.map((context) => context.controller);
  }
  getControllerForElementAndIdentifier(element, identifier) {
    const context = this.router.getContextForElementAndIdentifier(element, identifier);
    return context ? context.controller : null;
  }
  handleError(error2, message, detail) {
    var _a;
    this.logger.error(`%s

%o

%o`, message, error2, detail);
    (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
  }
  logFormattedMessage(identifier, functionName, detail = {}) {
    detail = Object.assign({ application: this }, detail);
    this.logger.groupCollapsed(`${identifier} #${functionName}`);
    this.logger.log("details:", Object.assign({}, detail));
    this.logger.groupEnd();
  }
};
function domReady() {
  return new Promise((resolve) => {
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  });
}
function ClassPropertiesBlessing(constructor) {
  const classes = readInheritableStaticArrayValues(constructor, "classes");
  return classes.reduce((properties, classDefinition) => {
    return Object.assign(properties, propertiesForClassDefinition(classDefinition));
  }, {});
}
function propertiesForClassDefinition(key) {
  return {
    [`${key}Class`]: {
      get() {
        const { classes } = this;
        if (classes.has(key)) {
          return classes.get(key);
        } else {
          const attribute = classes.getAttributeName(key);
          throw new Error(`Missing attribute "${attribute}"`);
        }
      }
    },
    [`${key}Classes`]: {
      get() {
        return this.classes.getAll(key);
      }
    },
    [`has${capitalize(key)}Class`]: {
      get() {
        return this.classes.has(key);
      }
    }
  };
}
function TargetPropertiesBlessing(constructor) {
  const targets = readInheritableStaticArrayValues(constructor, "targets");
  return targets.reduce((properties, targetDefinition) => {
    return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
  }, {});
}
function propertiesForTargetDefinition(name) {
  return {
    [`${name}Target`]: {
      get() {
        const target = this.targets.find(name);
        if (target) {
          return target;
        } else {
          throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
        }
      }
    },
    [`${name}Targets`]: {
      get() {
        return this.targets.findAll(name);
      }
    },
    [`has${capitalize(name)}Target`]: {
      get() {
        return this.targets.has(name);
      }
    }
  };
}
function ValuePropertiesBlessing(constructor) {
  const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
  const propertyDescriptorMap = {
    valueDescriptorMap: {
      get() {
        return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
          const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
          return Object.assign(result, { [attributeName]: valueDescriptor });
        }, {});
      }
    }
  };
  return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
    return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
  }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair) {
  const definition = parseValueDefinitionPair(valueDefinitionPair);
  const { key, name, reader: read2, writer: write2 } = definition;
  return {
    [name]: {
      get() {
        const value = this.data.get(key);
        if (value !== null) {
          return read2(value);
        } else {
          return definition.defaultValue;
        }
      },
      set(value) {
        if (value === void 0) {
          this.data.delete(key);
        } else {
          this.data.set(key, write2(value));
        }
      }
    },
    [`has${capitalize(name)}`]: {
      get() {
        return this.data.has(key) || definition.hasCustomDefaultValue;
      }
    }
  };
}
function parseValueDefinitionPair([token, typeDefinition]) {
  return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
}
function parseValueTypeConstant(constant) {
  switch (constant) {
    case Array:
      return "array";
    case Boolean:
      return "boolean";
    case Number:
      return "number";
    case Object:
      return "object";
    case String:
      return "string";
  }
}
function parseValueTypeDefault(defaultValue) {
  switch (typeof defaultValue) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
  }
  if (Array.isArray(defaultValue))
    return "array";
  if (Object.prototype.toString.call(defaultValue) === "[object Object]")
    return "object";
}
function parseValueTypeObject(typeObject) {
  const typeFromObject = parseValueTypeConstant(typeObject.type);
  if (typeFromObject) {
    const defaultValueType = parseValueTypeDefault(typeObject.default);
    if (typeFromObject !== defaultValueType) {
      throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
    }
    return typeFromObject;
  }
}
function parseValueTypeDefinition(typeDefinition) {
  const typeFromObject = parseValueTypeObject(typeDefinition);
  const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
  const typeFromConstant = parseValueTypeConstant(typeDefinition);
  const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
  if (type)
    return type;
  throw new Error(`Unknown value type "${typeDefinition}"`);
}
function defaultValueForDefinition(typeDefinition) {
  const constant = parseValueTypeConstant(typeDefinition);
  if (constant)
    return defaultValuesByType[constant];
  const defaultValue = typeDefinition.default;
  if (defaultValue !== void 0)
    return defaultValue;
  return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
  const key = `${dasherize(token)}-value`;
  const type = parseValueTypeDefinition(typeDefinition);
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() {
      return defaultValueForDefinition(typeDefinition);
    },
    get hasCustomDefaultValue() {
      return parseValueTypeDefault(typeDefinition) !== void 0;
    },
    reader: readers[type],
    writer: writers[type] || writers.default
  };
}
var defaultValuesByType = {
  get array() {
    return [];
  },
  boolean: false,
  number: 0,
  get object() {
    return {};
  },
  string: ""
};
var readers = {
  array(value) {
    const array = JSON.parse(value);
    if (!Array.isArray(array)) {
      throw new TypeError("Expected array");
    }
    return array;
  },
  boolean(value) {
    return !(value == "0" || value == "false");
  },
  number(value) {
    return Number(value);
  },
  object(value) {
    const object = JSON.parse(value);
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError("Expected object");
    }
    return object;
  },
  string(value) {
    return value;
  }
};
var writers = {
  default: writeString,
  array: writeJSON,
  object: writeJSON
};
function writeJSON(value) {
  return JSON.stringify(value);
}
function writeString(value) {
  return `${value}`;
}
var Controller = class {
  constructor(context) {
    this.context = context;
  }
  static get shouldLoad() {
    return true;
  }
  get application() {
    return this.context.application;
  }
  get scope() {
    return this.context.scope;
  }
  get element() {
    return this.scope.element;
  }
  get identifier() {
    return this.scope.identifier;
  }
  get targets() {
    return this.scope.targets;
  }
  get classes() {
    return this.scope.classes;
  }
  get data() {
    return this.scope.data;
  }
  initialize() {
  }
  connect() {
  }
  disconnect() {
  }
  dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
    const type = prefix ? `${prefix}:${eventName}` : eventName;
    const event = new CustomEvent(type, { detail, bubbles, cancelable });
    target.dispatchEvent(event);
    return event;
  }
};
Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
Controller.targets = [];
Controller.values = {};

// app/assets/javascripts/formstrap/controllers/autocomplete_controller.js
var autocomplete_controller_default = class extends Controller {
  static get targets() {
    return ["input", "dropdown", "dropdownItem"];
  }
  static get values() {
    return {
      url: String
    };
  }
  connect() {
    this.inputTarget.addEventListener("focus", (event) => {
      this.show();
    });
    this.inputTarget.addEventListener("keydown", (event) => {
      this.handleKeydown(event);
    });
    this.inputTarget.addEventListener("keyup", (event) => {
      this.handleKeyup(event);
    });
    document.addEventListener("click", (event) => {
      this.handleOutsideClick(event);
    });
  }
  handleKeydown(event) {
    const keyCode = parseInt(event.keyCode, 10);
    if (this.isArrowKey(keyCode)) {
      this.handleArrowKey(keyCode);
    }
    if (this.isEnterKey(keyCode)) {
      this.selectActiveItem(event);
    }
  }
  handleKeyup(event) {
    const keyCode = parseInt(event.keyCode, 10);
    if (this.isArrowKey(keyCode) || this.isEnterKey(keyCode)) {
      return false;
    }
    this.handleTextKey();
  }
  selectActiveItem(event) {
    const activeItem = this.activeItem();
    if (activeItem) {
      this.deselectAll();
      this.setValue(activeItem.getAttribute("value"));
      event.preventDefault();
    }
  }
  isEnterKey(keyCode) {
    return keyCode === 13;
  }
  handleArrowKey(keyCode) {
    this.show();
    switch (keyCode) {
      case 38:
        this.handleArrowUp();
        break;
      case 40:
        this.handleArrowDown();
        break;
      default:
    }
  }
  handleArrowUp() {
    this.selectPreviousItem();
  }
  handleArrowDown() {
    this.selectNextItem();
  }
  selectNextItem() {
    const next = this.nextItem();
    if (next) {
      this.deselectAll();
      next.classList.add("active");
    }
  }
  nextItem() {
    const current = this.activeItem();
    if (!this.hasSelectedItem()) {
      return this.firstItem();
    }
    if (this.isItemLast(current)) {
      return this.firstItem();
    } else {
      const index2 = this.itemIndex(current);
      return this.itemAtIndex(index2 + 1);
    }
  }
  selectPreviousItem() {
    const previous = this.previousItem();
    if (previous) {
      this.deselectAll();
      previous.classList.add("active");
    }
  }
  previousItem() {
    const current = this.activeItem();
    if (!this.hasSelectedItem()) {
      return this.lastItem();
    }
    if (this.isItemFirst(current)) {
      return this.lastItem();
    } else {
      const index2 = this.itemIndex(current);
      return this.itemAtIndex(index2 - 1);
    }
  }
  deselectAll() {
    this.dropdownItemTargets.forEach((dropdownItem) => {
      dropdownItem.classList.remove("active");
    });
  }
  itemAtIndex(index2) {
    return this.dropdownItemTargets[index2];
  }
  firstItem() {
    return this.itemAtIndex(0);
  }
  lastItem() {
    return this.itemAtIndex(this.dropdownItemTargets.length - 1);
  }
  hasSelectedItem() {
    return this.activeItem() !== void 0;
  }
  activeItem() {
    return this.dropdownItemTargets.find((item) => {
      return item.classList.contains("active");
    });
  }
  isItemLast(item) {
    return this.itemIndex(item) === this.dropdownItemTargets.length - 1;
  }
  isItemFirst(item) {
    return this.itemIndex(item) === 0;
  }
  itemIndex(item) {
    return Array.from(this.dropdownItemTargets).indexOf(item);
  }
  handleTextKey() {
    this.fetchCollection().then((html) => {
      this.renderCollection(html);
    }).then(() => {
      this.highlight();
    }).then(() => {
      this.activateFirstItem();
    }).then(() => {
      this.show();
    });
  }
  activateFirstItem() {
    this.deselectAll();
    this.firstItem().classList.add("active");
  }
  show() {
    if (this.isDropdownEmpty()) {
      this.dropdownTarget.classList.remove("d-none");
    } else {
      this.hide();
    }
  }
  hide() {
    this.dropdownTarget.classList.add("d-none");
  }
  isDropdownEmpty() {
    return this.dropdownTarget.textContent.trim().length > 0;
  }
  isArrowKey(keyCode) {
    const arrowKeyCodes = [37, 38, 39, 40];
    return arrowKeyCodes.includes(keyCode);
  }
  fetchCollection() {
    if (this.isRemote()) {
      return fetch(this.remoteURL()).then((response) => {
        return response.text();
      }).catch((error2) => {
        console.error("The URL you provided for the autocomplete collection didn't return a successful result", error2);
      });
    } else {
      return Promise.resolve(this.dropdownTarget.innerHTML);
    }
  }
  remoteURL() {
    const base = "https://example.com";
    const url = new URL(this.urlValue, base);
    const params = new URLSearchParams(url.search);
    params.set("search", this.value());
    params.set("page", "1");
    params.set("per_page", "6");
    url.search = params.toString();
    let urlString = url.toString();
    if (urlString.includes(base)) {
      urlString = urlString.replace(base, "");
    }
    return urlString;
  }
  renderCollection(html) {
    this.dropdownTarget.innerHTML = html;
  }
  isRemote() {
    return this.hasUrlValue;
  }
  highlight() {
    const query = this.value();
    this.dropdownItemTargets.forEach((dropdownItem) => {
      let text = dropdownItem.innerHTML;
      text = text.replace(/<mark.*?>(.*?)<\/mark>/ig, "$1");
      if (query && query.length > 0) {
        const regex2 = new RegExp(`(?<!<[^>]*?)(&nbsp;)?(${query})`, "gi");
        text = text.replace(regex2, "<mark>$2</mark>");
      }
      dropdownItem.innerHTML = text;
    });
  }
  select(event) {
    this.setValue(event.currentTarget.getAttribute("value"));
  }
  setValue(value) {
    this.inputTarget.value = value;
    this.inputTarget.dispatchEvent(new Event("change"));
    this.hide();
  }
  value() {
    return this.inputTarget.value;
  }
  numberOfCharacters() {
    return this.value().length;
  }
  handleOutsideClick(event) {
    if (!this.isClickedInside(event)) {
      this.hide();
    }
  }
  isClickedInside(event) {
    if (!event) {
      return false;
    }
    const inInput = this.inputTarget.contains(event.target);
    const inDropdown = this.dropdownTarget.contains(event.target);
    return inInput || inDropdown;
  }
};

// node_modules/sortablejs/modular/sortable.esm.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
var version = "1.14.0";
function userAgent(pattern) {
  if (typeof window !== "undefined" && window.navigator) {
    return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
  }
}
var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
var captureMode = {
  capture: false,
  passive: false
};
function on(el, event, fn2) {
  el.addEventListener(event, fn2, !IE11OrLess && captureMode);
}
function off(el, event, fn2) {
  el.removeEventListener(event, fn2, !IE11OrLess && captureMode);
}
function matches(el, selector) {
  if (!selector)
    return;
  selector[0] === ">" && (selector = selector.substring(1));
  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }
  return false;
}
function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}
function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;
    do {
      if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }
      if (el === ctx)
        break;
    } while (el = getParentOrHost(el));
  }
  return null;
}
var R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? "add" : "remove"](name);
    } else {
      var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
      el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
    }
  }
}
function css(el, prop, val) {
  var style = el && el.style;
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, "");
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }
      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf("webkit") === -1) {
        prop = "-webkit-" + prop;
      }
      style[prop] = val + (typeof val === "string" ? "" : "px");
    }
  }
}
function matrix(el, selfOnly) {
  var appliedTransforms = "";
  if (typeof el === "string") {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, "transform");
      if (transform && transform !== "none") {
        appliedTransforms = transform + " " + appliedTransforms;
      }
    } while (!selfOnly && (el = el.parentNode));
  }
  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return matrixFn && new matrixFn(appliedTransforms);
}
function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }
    return list;
  }
  return [];
}
function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;
  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window)
    return;
  var elRect, top2, left2, bottom2, right2, height, width;
  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top2 = elRect.top;
    left2 = elRect.left;
    bottom2 = elRect.bottom;
    right2 = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top2 = 0;
    left2 = 0;
    bottom2 = window.innerHeight;
    right2 = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }
  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    container = container || el.parentNode;
    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
          var containerRect = container.getBoundingClientRect();
          top2 -= containerRect.top + parseInt(css(container, "border-top-width"));
          left2 -= containerRect.left + parseInt(css(container, "border-left-width"));
          bottom2 = top2 + elRect.height;
          right2 = left2 + elRect.width;
          break;
        }
      } while (container = container.parentNode);
    }
  }
  if (undoScale && el !== window) {
    var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
    if (elMatrix) {
      top2 /= scaleY;
      left2 /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom2 = top2 + height;
      right2 = left2 + width;
    }
  }
  return {
    top: top2,
    left: left2,
    bottom: bottom2,
    right: right2,
    width,
    height
  };
}
function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
  while (parent) {
    var parentSideVal = getRect(parent)[parentSide], visible = void 0;
    if (parentSide === "top" || parentSide === "left") {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }
    if (!visible)
      return parent;
    if (parent === getWindowScrollingElement())
      break;
    parent = getParentAutoScrollElement(parent, false);
  }
  return false;
}
function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0, i = 0, children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }
    i++;
  }
  return null;
}
function lastChild(el, selector) {
  var last = el.lastElementChild;
  while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }
  return last || null;
}
function index(el, selector) {
  var index2 = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index2++;
    }
  }
  return index2;
}
function getRelativeScrollOffset(el) {
  var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
  if (el) {
    do {
      var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }
  return [offsetLeft, offsetTop];
}
function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i))
      continue;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key])
        return Number(i);
    }
  }
  return -1;
}
function getParentAutoScrollElement(el, includeSelf) {
  if (!el || !el.getBoundingClientRect)
    return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;
  do {
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);
      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
        if (!elem.getBoundingClientRect || elem === document.body)
          return getWindowScrollingElement();
        if (gotSelf || includeSelf)
          return elem;
        gotSelf = true;
      }
    }
  } while (elem = elem.parentNode);
  return getWindowScrollingElement();
}
function extend2(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }
  return dst;
}
function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}
var _throttleTimeout;
function throttle(callback, ms) {
  return function() {
    if (!_throttleTimeout) {
      var args = arguments, _this = this;
      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }
      _throttleTimeout = setTimeout(function() {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}
function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}
function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}
function clone(el) {
  var Polymer = window.Polymer;
  var $2 = window.jQuery || window.Zepto;
  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($2) {
    return $2(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}
var expando = "Sortable" + new Date().getTime();
function AnimationStateManager() {
  var animationStates = [], animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation)
        return;
      var children = [].slice.call(this.el.children);
      children.forEach(function(child) {
        if (css(child, "display") === "none" || child === Sortable.ghost)
          return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });
        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);
          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }
        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;
      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === "function")
          callback();
        return;
      }
      var animating = false, animationTime = 0;
      animationStates.forEach(function(state) {
        var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
        if (targetMatrix) {
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }
        target.toRect = toRect;
        if (target.thisAnimationDuration) {
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        }
        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;
          if (!time) {
            time = _this.options.animation;
          }
          _this.animate(target, animatingRect, toRect, time);
        }
        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function() {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);
      if (!animating) {
        if (typeof callback === "function")
          callback();
      } else {
        animationCallbackId = setTimeout(function() {
          if (typeof callback === "function")
            callback();
        }, animationTime);
      }
      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration2) {
      if (duration2) {
        css(target, "transition", "");
        css(target, "transform", "");
        var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
        this.forRepaintDummy = repaint(target);
        css(target, "transition", "transform " + duration2 + "ms" + (this.options.easing ? " " + this.options.easing : ""));
        css(target, "transform", "translate3d(0,0,0)");
        typeof target.animated === "number" && clearTimeout(target.animated);
        target.animated = setTimeout(function() {
          css(target, "transition", "");
          css(target, "transform", "");
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration2);
      }
    }
  };
}
function repaint(target) {
  return target.offsetWidth;
}
function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}
var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults) {
      if (defaults.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults[option2];
      }
    }
    plugins.forEach(function(p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;
    this.eventCanceled = false;
    evt.cancel = function() {
      _this.eventCanceled = true;
    };
    var eventNameGlobal = eventName + "Global";
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable
        }, evt));
      }
      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults3, options) {
    plugins.forEach(function(plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault)
        return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;
      _extends(defaults3, initialized.defaults);
    });
    for (var option2 in sortable.options) {
      if (!sortable.options.hasOwnProperty(option2))
        continue;
      var modified = this.modifyOption(sortable, option2, sortable.options[option2]);
      if (typeof modified !== "undefined") {
        sortable.options[option2] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function(plugin) {
      if (typeof plugin.eventProperties !== "function")
        return;
      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function(plugin) {
      if (!sortable[plugin.pluginName])
        return;
      if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};
function dispatchEvent(_ref) {
  var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl2 && rootEl2[expando];
  if (!sortable)
    return;
  var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent(name, true, true);
  }
  evt.to = toEl || rootEl2;
  evt.from = fromEl || rootEl2;
  evt.item = targetEl || rootEl2;
  evt.clone = cloneEl2;
  evt.oldIndex = oldIndex2;
  evt.newIndex = newIndex2;
  evt.oldDraggableIndex = oldDraggableIndex2;
  evt.newDraggableIndex = newDraggableIndex2;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
  for (var option2 in allEventProperties) {
    evt[option2] = allEventProperties[option2];
  }
  if (rootEl2) {
    rootEl2.dispatchEvent(evt);
  }
  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}
var _excluded = ["evt"];
var pluginEvent2 = function pluginEvent3(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    dragStarted: moved,
    putSortable,
    activeSortable: Sortable.active,
    originalEvent,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable,
        name,
        originalEvent
      });
    }
  }, data));
};
function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable,
    cloneEl,
    targetEl: dragEl,
    rootEl,
    oldIndex,
    oldDraggableIndex,
    newIndex,
    newDraggableIndex
  }, info));
}
var dragEl;
var parentEl;
var ghostEl;
var rootEl;
var nextEl;
var lastDownEl;
var cloneEl;
var cloneHidden;
var oldIndex;
var newIndex;
var oldDraggableIndex;
var newDraggableIndex;
var activeGroup;
var putSortable;
var awaitingDragStarted = false;
var ignoreNextClick = false;
var sortables = [];
var tapEvt;
var touchEvt;
var lastDx;
var lastDy;
var tapDistanceLeft;
var tapDistanceTop;
var moved;
var lastTarget;
var lastDirection;
var pastFirstInvertThresh = false;
var isCircumstantialInvert = false;
var targetMoveDistance;
var ghostRelativeParent;
var ghostRelativeParentInitialScroll = [];
var _silent = false;
var savedInputChecked = [];
var documentExists = typeof document !== "undefined";
var PositionGhostAbsolutely = IOS;
var CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float";
var supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div");
var supportCssPointerEvents = function() {
  if (!documentExists)
    return;
  if (IE11OrLess) {
    return false;
  }
  var el = document.createElement("x");
  el.style.cssText = "pointer-events:auto";
  return el.style.pointerEvents === "auto";
}();
var _detectDirection = function _detectDirection2(el, options) {
  var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
  if (elCSS.display === "flex") {
    return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  }
  if (elCSS.display === "grid") {
    return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  }
  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
    var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
    return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
  }
  return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
};
var _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
};
var _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
  var ret;
  sortables.some(function(sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable))
      return;
    var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
};
var _prepareGroup = function _prepareGroup2(options) {
  function toFn(value, pull) {
    return function(to, from, dragEl2, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
      if (value == null && (pull || sameGroup)) {
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === "clone") {
        return value;
      } else if (typeof value === "function") {
        return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }
  var group = {};
  var originalGroup = options.group;
  if (!originalGroup || _typeof(originalGroup) != "object") {
    originalGroup = {
      name: originalGroup
    };
  }
  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
};
var _hideGhostForTarget = function _hideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "none");
  }
};
var _unhideGhostForTarget = function _unhideGhostForTarget2() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, "display", "");
  }
};
if (documentExists) {
  document.addEventListener("click", function(evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}
var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;
    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
    if (nearest) {
      var event = {};
      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }
      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;
      nearest[expando]._onDragOver(event);
    }
  }
};
var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }
  this.el = el;
  this.options = options = _extends({}, options);
  el[expando] = this;
  var defaults3 = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
    swapThreshold: 1,
    invertSwap: false,
    invertedSwapThreshold: null,
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    ignore: "a, img",
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl2) {
      dataTransfer.setData("Text", dragEl2.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: "data-id",
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: "sortable-fallback",
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults3);
  for (var name in defaults3) {
    !(name in options) && (options[name] = defaults3[name]);
  }
  _prepareGroup(options);
  for (var fn2 in this) {
    if (fn2.charAt(0) === "_" && typeof this[fn2] === "function") {
      this[fn2] = this[fn2].bind(this);
    }
  }
  this.nativeDraggable = options.forceFallback ? false : supportDraggable;
  if (this.nativeDraggable) {
    this.options.touchStartThreshold = 1;
  }
  if (options.supportPointer) {
    on(el, "pointerdown", this._onTapStart);
  } else {
    on(el, "mousedown", this._onTapStart);
    on(el, "touchstart", this._onTapStart);
  }
  if (this.nativeDraggable) {
    on(el, "dragover", this);
    on(el, "dragenter", this);
  }
  sortables.push(this.el);
  options.store && options.store.get && this.sort(options.store.get(this) || []);
  _extends(this, AnimationStateManager());
}
Sortable.prototype = {
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(evt) {
    if (!evt.cancelable)
      return;
    var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
    _saveInputCheckedState(el);
    if (dragEl) {
      return;
    }
    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return;
    }
    if (originalTarget.isContentEditable) {
      return;
    }
    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
      return;
    }
    target = closest(target, options.draggable, el, false);
    if (target && target.animated) {
      return;
    }
    if (lastDownEl === target) {
      return;
    }
    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable);
    if (typeof filter === "function") {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: "filter",
          targetEl: target,
          toEl: el,
          fromEl: el
        });
        pluginEvent2("filter", _this, {
          evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    } else if (filter) {
      filter = filter.split(",").some(function(criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);
        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: "filter",
            targetEl: target,
            fromEl: el,
            toEl: el
          });
          pluginEvent2("filter", _this, {
            evt
          });
          return true;
        }
      });
      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return;
      }
    }
    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    }
    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(evt, touch, target) {
    var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style["will-change"] = "all";
      dragStartFn = function dragStartFn2() {
        pluginEvent2("delayEnded", _this, {
          evt
        });
        if (Sortable.eventCanceled) {
          _this._onDrop();
          return;
        }
        _this._disableDelayedDragEvents();
        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        }
        _this._triggerDragStart(evt, touch);
        _dispatchEvent({
          sortable: _this,
          name: "choose",
          originalEvent: evt
        });
        toggleClass(dragEl, options.chosenClass, true);
      };
      options.ignore.split(",").forEach(function(criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
      on(ownerDocument, "mouseup", _this._onDrop);
      on(ownerDocument, "touchend", _this._onDrop);
      on(ownerDocument, "touchcancel", _this._onDrop);
      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }
      pluginEvent2("delayStart", this, {
        evt
      });
      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();
          return;
        }
        on(ownerDocument, "mouseup", _this._disableDelayedDrag);
        on(ownerDocument, "touchend", _this._disableDelayedDrag);
        on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
        on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
        on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
    var touch = e.touches ? e.touches[0] : e;
    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);
    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._disableDelayedDrag);
    off(ownerDocument, "touchend", this._disableDelayedDrag);
    off(ownerDocument, "touchcancel", this._disableDelayedDrag);
    off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
    off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(evt, touch) {
    touch = touch || evt.pointerType == "touch" && evt;
    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, "pointermove", this._onTouchMove);
      } else if (touch) {
        on(document, "touchmove", this._onTouchMove);
      } else {
        on(document, "mousemove", this._onTouchMove);
      }
    } else {
      on(dragEl, "dragend", this);
      on(rootEl, "dragstart", this._onDragStart);
    }
    try {
      if (document.selection) {
        _nextTick(function() {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {
    }
  },
  _dragStarted: function _dragStarted(fallback, evt) {
    awaitingDragStarted = false;
    if (rootEl && dragEl) {
      pluginEvent2("dragStarted", this, {
        evt
      });
      if (this.nativeDraggable) {
        on(document, "dragover", _checkOutsideTargetEl);
      }
      var options = this.options;
      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost();
      _dispatchEvent({
        sortable: this,
        name: "start",
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;
      _hideGhostForTarget();
      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;
      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent)
          break;
        parent = target;
      }
      dragEl.parentNode[expando]._isOutsideThisEl(target);
      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target,
              rootEl: parent
            });
            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }
          target = parent;
        } while (parent = parent.parentNode);
      }
      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(evt) {
    if (tapEvt) {
      var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }
        this._onDragStart(evt, true);
      }
      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }
        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, "webkitTransform", cssMatrix);
        css(ghostEl, "mozTransform", cssMatrix);
        css(ghostEl, "msTransform", cssMatrix);
        css(ghostEl, "transform", cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }
      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
      if (PositionGhostAbsolutely) {
        ghostRelativeParent = container;
        while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }
        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document)
            ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }
        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }
      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, "transition", "");
      css(ghostEl, "transform", "");
      css(ghostEl, "box-sizing", "border-box");
      css(ghostEl, "margin", 0);
      css(ghostEl, "top", rect.top);
      css(ghostEl, "left", rect.left);
      css(ghostEl, "width", rect.width);
      css(ghostEl, "height", rect.height);
      css(ghostEl, "opacity", "0.8");
      css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
      css(ghostEl, "zIndex", "100000");
      css(ghostEl, "pointerEvents", "none");
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl);
      css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
    }
  },
  _onDragStart: function _onDragStart(evt, fallback) {
    var _this = this;
    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent2("dragStart", this, {
      evt
    });
    if (Sortable.eventCanceled) {
      this._onDrop();
      return;
    }
    pluginEvent2("setupClone", this);
    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    }
    _this.cloneId = _nextTick(function() {
      pluginEvent2("clone", _this);
      if (Sortable.eventCanceled)
        return;
      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }
      _this._hideClone();
      _dispatchEvent({
        sortable: _this,
        name: "clone"
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true);
    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      off(document, "mouseup", _this._onDrop);
      off(document, "touchend", _this._onDrop);
      off(document, "touchcancel", _this._onDrop);
      if (dataTransfer) {
        dataTransfer.effectAllowed = "move";
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }
      on(document, "drop", _this);
      css(dragEl, "transform", "translateZ(0)");
    }
    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, "selectstart", _this);
    moved = true;
    if (Safari) {
      css(document.body, "user-select", "none");
    }
  },
  _onDragOver: function _onDragOver(evt) {
    var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
    if (_silent)
      return;
    function dragOverEvent(name, extra) {
      pluginEvent2(name, _this, _objectSpread2({
        evt,
        isOwner,
        axis: vertical ? "vertical" : "horizontal",
        revert,
        dragRect,
        targetRect,
        canSort,
        fromSortable,
        target,
        completed,
        onMove: function onMove(target2, after2) {
          return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
        },
        changed
      }, extra));
    }
    function capture() {
      dragOverEvent("dragOverAnimationCapture");
      _this.captureAnimationState();
      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    }
    function completed(insertion) {
      dragOverEvent("dragOverCompleted", {
        insertion
      });
      if (insertion) {
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }
        if (_this !== fromSortable) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }
        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        }
        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }
        _this.animateAll(function() {
          dragOverEvent("dragOverAnimationComplete");
          _this._ignoreWhileAnimating = null;
        });
        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      }
      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      }
      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
        !insertion && nearestEmptyInsertDetectEvent(evt);
      }
      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    }
    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);
      _dispatchEvent({
        sortable: _this,
        name: "change",
        toEl: el,
        newIndex,
        newDraggableIndex,
        originalEvent: evt
      });
    }
    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }
    target = closest(target, options.draggable, el, true);
    dragOverEvent("dragOver");
    if (Sortable.eventCanceled)
      return completedFired;
    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }
    ignoreNextClick = false;
    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === "vertical";
      dragRect = getRect(dragEl);
      dragOverEvent("dragOverValid");
      if (Sortable.eventCanceled)
        return completedFired;
      if (revert) {
        parentEl = rootEl;
        capture();
        this._hideClone();
        dragOverEvent("revert");
        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }
        return completed(true);
      }
      var elLastChild = lastChild(el, options.draggable);
      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        if (elLastChild === dragEl) {
          return completed(false);
        }
        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }
        if (target) {
          targetRect = getRect(target);
        }
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        var firstChild = getChild(el, 0, options, true);
        if (firstChild === dragEl) {
          return completed(false);
        }
        target = firstChild;
        targetRect = getRect(target);
        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el;
          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }
        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;
        if (direction !== 0) {
          var dragIndex = index(dragEl);
          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
        }
        if (direction === 0 || sibling === target) {
          return completed(false);
        }
        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling, after = false;
        after = direction === 1;
        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }
          _silent = true;
          setTimeout(_unsilent, 30);
          capture();
          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          }
          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }
          parentEl = dragEl.parentNode;
          if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }
          changed();
          return completed(true);
        }
      }
      if (el.contains(dragEl)) {
        return completed(false);
      }
    }
    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, "mousemove", this._onTouchMove);
    off(document, "touchmove", this._onTouchMove);
    off(document, "pointermove", this._onTouchMove);
    off(document, "dragover", nearestEmptyInsertDetectEvent);
    off(document, "mousemove", nearestEmptyInsertDetectEvent);
    off(document, "touchmove", nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, "mouseup", this._onDrop);
    off(ownerDocument, "touchend", this._onDrop);
    off(ownerDocument, "pointerup", this._onDrop);
    off(ownerDocument, "touchcancel", this._onDrop);
    off(document, "selectstart", this);
  },
  _onDrop: function _onDrop(evt) {
    var el = this.el, options = this.options;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent2("drop", this, {
      evt
    });
    parentEl = dragEl && dragEl.parentNode;
    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    if (Sortable.eventCanceled) {
      this._nulling();
      return;
    }
    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);
    _cancelNextTick(this.cloneId);
    _cancelNextTick(this._dragStartId);
    if (this.nativeDraggable) {
      off(document, "drop", this);
      off(el, "dragstart", this._onDragStart);
    }
    this._offMoveEvents();
    this._offUpEvents();
    if (Safari) {
      css(document.body, "user-select", "");
    }
    css(dragEl, "transform", "");
    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }
      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }
      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, "dragend", this);
        }
        _disableDraggable(dragEl);
        dragEl.style["will-change"] = "";
        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass(dragEl, this.options.chosenClass, false);
        _dispatchEvent({
          sortable: this,
          name: "unchoose",
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });
        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            _dispatchEvent({
              rootEl: parentEl,
              name: "add",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "remove",
              toEl: parentEl,
              originalEvent: evt
            });
            _dispatchEvent({
              rootEl: parentEl,
              name: "sort",
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });
            _dispatchEvent({
              sortable: this,
              name: "sort",
              toEl: parentEl,
              originalEvent: evt
            });
          }
          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              _dispatchEvent({
                sortable: this,
                name: "update",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }
        if (Sortable.active) {
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }
          _dispatchEvent({
            sortable: this,
            name: "end",
            toEl: parentEl,
            originalEvent: evt
          });
          this.save();
        }
      }
    }
    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent2("nulling", this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function(el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(evt) {
    switch (evt.type) {
      case "drop":
      case "dragend":
        this._onDrop(evt);
        break;
      case "dragenter":
      case "dragover":
        if (dragEl) {
          this._onDragOver(evt);
          _globalDragOver(evt);
        }
        break;
      case "selectstart":
        evt.preventDefault();
        break;
    }
  },
  toArray: function toArray() {
    var order2 = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
    for (; i < n; i++) {
      el = children[i];
      if (closest(el, options.draggable, this.el, false)) {
        order2.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }
    return order2;
  },
  sort: function sort(order2, useAnimation) {
    var items = {}, rootEl2 = this.el;
    this.toArray().forEach(function(id, i) {
      var el = rootEl2.children[i];
      if (closest(el, this.options.draggable, rootEl2, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order2.forEach(function(id) {
      if (items[id]) {
        rootEl2.removeChild(items[id]);
        rootEl2.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },
  option: function option(name, value) {
    var options = this.options;
    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);
      if (typeof modifiedValue !== "undefined") {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }
      if (name === "group") {
        _prepareGroup(options);
      }
    }
  },
  destroy: function destroy() {
    pluginEvent2("destroy", this);
    var el = this.el;
    el[expando] = null;
    off(el, "mousedown", this._onTapStart);
    off(el, "touchstart", this._onTapStart);
    off(el, "pointerdown", this._onTapStart);
    if (this.nativeDraggable) {
      off(el, "dragover", this);
      off(el, "dragenter", this);
    }
    Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
      el2.removeAttribute("draggable");
    });
    this._onDrop();
    this._disableDelayedDragEvents();
    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent2("hideClone", this);
      if (Sortable.eventCanceled)
        return;
      css(cloneEl, "display", "none");
      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }
      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable2) {
    if (putSortable2.lastPutMode !== "clone") {
      this._hideClone();
      return;
    }
    if (cloneHidden) {
      pluginEvent2("showClone", this);
      if (Sortable.eventCanceled)
        return;
      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }
      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }
      css(cloneEl, "display", "");
      cloneHidden = false;
    }
  }
};
function _globalDragOver(evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = "move";
  }
  evt.cancelable && evt.preventDefault();
}
function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent("move", {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent("Event");
    evt.initEvent("move", true, true);
  }
  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl2;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);
  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }
  return retVal;
}
function _disableDraggable(el) {
  el.draggable = false;
}
function _unsilent() {
  _silent = false;
}
function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}
function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}
function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
  if (!invertSwap) {
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        pastFirstInvertThresh = true;
      }
      if (!pastFirstInvertThresh) {
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }
  invert = invert || invertSwap;
  if (invert) {
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }
  return 0;
}
function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
  while (i--) {
    sum += str.charCodeAt(i);
  }
  return sum.toString(36);
}
function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName("input");
  var idx = inputs.length;
  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}
function _nextTick(fn2) {
  return setTimeout(fn2, 0);
}
function _cancelNextTick(id) {
  return clearTimeout(id);
}
if (documentExists) {
  on(document, "touchmove", function(evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
}
Sortable.utils = {
  on,
  off,
  css,
  find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend2,
  throttle,
  closest,
  toggleClass,
  clone,
  index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild
};
Sortable.get = function(element) {
  return element[expando];
};
Sortable.mount = function() {
  for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins2[_key] = arguments[_key];
  }
  if (plugins2[0].constructor === Array)
    plugins2 = plugins2[0];
  plugins2.forEach(function(plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }
    if (plugin.utils)
      Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
Sortable.create = function(el, options) {
  return new Sortable(el, options);
};
Sortable.version = version;
var autoScrolls = [];
var scrollEl;
var scrollRootEl;
var scrolling = false;
var lastAutoScrollX;
var lastAutoScrollY;
var touchEvt$1;
var pointerElemChangedInterval;
function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    };
    for (var fn2 in this) {
      if (fn2.charAt(0) === "_" && typeof this[fn2] === "function") {
        this[fn2] = this[fn2].bind(this);
      }
    }
  }
  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;
      if (this.sortable.nativeDraggable) {
        on(document, "dragover", this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, "touchmove", this._handleFallbackAutoScroll);
        } else {
          on(document, "mousemove", this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop3() {
      if (this.sortable.nativeDraggable) {
        off(document, "dragover", this._handleAutoScroll);
      } else {
        off(document, "pointermove", this._handleFallbackAutoScroll);
        off(document, "touchmove", this._handleFallbackAutoScroll);
        off(document, "mousemove", this._handleFallbackAutoScroll);
      }
      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;
      var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt;
      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback);
        var ogElemScroller = getParentAutoScrollElement(elem, true);
        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval();
          pointerElemChangedInterval = setInterval(function() {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }
            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }
        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: "scroll",
    initializeByDefault: true
  });
}
function clearAutoScrolls() {
  autoScrolls.forEach(function(autoScroll2) {
    clearInterval(autoScroll2.pid);
  });
  autoScrolls = [];
}
function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}
var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
  if (!options.scroll)
    return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
  var scrollThisInstance = false, scrollCustomFn;
  if (scrollRootEl !== rootEl2) {
    scrollRootEl = rootEl2;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;
    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl2, true);
    }
  }
  var layersOut = 0;
  var currentParent = scrollEl;
  do {
    var el = currentParent, rect = getRect(el), top2 = rect.top, bottom2 = rect.bottom, left2 = rect.left, right2 = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
      canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
    }
    var vx = canScrollX && (Math.abs(right2 - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left2 - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom2 - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top2 - y) <= sens && !!scrollPosY);
    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }
    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);
      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        autoScrolls[layersOut].pid = setInterval(function() {
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1);
          }
          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
          if (typeof scrollCustomFn === "function") {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
              return;
            }
          }
          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }
    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
  scrolling = scrollThisInstance;
}, 30);
var drop = function drop2(_ref) {
  var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent)
    return;
  var toSortable = putSortable2 || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();
  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent("spill");
    this.onSpill({
      dragEl: dragEl2,
      putSortable: putSortable2
    });
  }
};
function Revert() {
}
Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex2 = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex2;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
    this.sortable.captureAnimationState();
    if (putSortable2) {
      putSortable2.captureAnimationState();
    }
    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl2, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl2);
    }
    this.sortable.animateAll();
    if (putSortable2) {
      putSortable2.animateAll();
    }
  },
  drop
};
_extends(Revert, {
  pluginName: "revertOnSpill"
});
function Remove() {
}
Remove.prototype = {
  onSpill: function onSpill2(_ref4) {
    var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
    var parentSortable = putSortable2 || this.sortable;
    parentSortable.captureAnimationState();
    dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
    parentSortable.animateAll();
  },
  drop
};
_extends(Remove, {
  pluginName: "removeOnSpill"
});
Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);
var sortable_esm_default = Sortable;

// app/assets/javascripts/formstrap/controllers/blocks_controller.js
var blocks_controller_default = class extends Controller {
  static get targets() {
    return ["templateBlock", "block", "blocks", "templateEmpty", "button", "buttons"];
  }
  connect() {
    sortable_esm_default.create(this.blocksTarget, {
      onEnd: () => {
        this.reorderPositions();
      }
    });
    this.toggleEmpty();
  }
  toggleEmpty() {
    if (this.blockCount() > 0) {
      const empty = this.blocksTarget.querySelector("#blocks-empty");
      if (empty) {
        empty.remove();
      }
    } else {
      const empty = this.templateEmptyTarget.innerHTML;
      this.blocksTarget.insertAdjacentHTML("beforeend", empty);
    }
  }
  add(event) {
    event.preventDefault();
    const blockType = event.target.dataset.type;
    let html = this.templateBlockTargets.filter((blockTarget) => blockTarget.id === blockType)[0].innerHTML;
    html = this.setPosition(html);
    const element = this.blocksTarget.querySelector(`li[data-position='${event.target.dataset.position}']`);
    if (element) {
      element.insertAdjacentHTML("afterend", html);
    } else {
      this.blocksTarget.insertAdjacentHTML("afterbegin", html);
    }
    this.reorderPositions();
    this.toggleEmpty();
  }
  remove(event) {
    event.preventDefault();
    const block = event.target.closest(".list-group-item");
    const destroyInput = block.querySelector("input[name*='_destroy']");
    if (destroyInput) {
      destroyInput.value = 1;
      block.style.display = "none";
    } else {
      block.remove();
    }
    this.reorderPositions();
    this.toggleEmpty();
  }
  setPosition(html) {
    const position = this.retrieveLastPosition() + 1;
    return html.replace(/99999/g, position);
  }
  retrieveLastPosition() {
    const blocks = Array.from(this.blockTargets);
    if (blocks.length < 1) {
      return 0;
    }
    const lastBlock = blocks.slice(-1)[0];
    return parseInt(lastBlock.querySelector("[name*='position']").value);
  }
  reorderPositions() {
    for (const [index2, block] of this.blockTargets.entries()) {
      this.changePositionInfo(block, index2);
    }
  }
  changePositionInfo(block, index2) {
    block.setAttribute("data-position", index2);
    block.querySelector("input[name*='position']").value = index2;
  }
  blockCount() {
    return this.blockTargets.length;
  }
};

// app/assets/javascripts/formstrap/controllers/date_range_controller.js
var date_range_controller_default = class extends Controller {
  update(event) {
    const flatpickr2 = event.target._flatpickr;
    const startDate = flatpickr2.selectedDates[0];
    const endDate = flatpickr2.selectedDates[1];
    this.setStartDateInputValue(this.formatDate(startDate));
    this.setEndDateInputValue(this.formatDate(endDate));
  }
  setStartDateInputValue(value) {
    const startDateInput = this.startDateInput();
    startDateInput.value = value;
  }
  setEndDateInputValue(value) {
    const endDateInput = this.endDateInput();
    endDateInput.value = value;
  }
  startDateInput() {
    return this.element.nextElementSibling;
  }
  endDateInput() {
    return this.startDateInput().nextElementSibling;
  }
  formatDate(date) {
    if (date instanceof Date) {
      return date.toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } else {
      return null;
    }
  }
};

// app/assets/javascripts/formstrap/controllers/dropzone_controller.js
var dropzone_controller_default = class extends Controller {
  static get targets() {
    return ["input"];
  }
  connect() {
    this.inputTarget.addEventListener("dragover", (event) => {
      this.element.classList.add("focus");
    });
    this.inputTarget.addEventListener("dragleave", (event) => {
      this.element.classList.remove("focus");
    });
    this.inputTarget.addEventListener("drop", (event) => {
      this.element.classList.remove("focus");
    });
    this.inputTarget.addEventListener("focusin", (event) => {
      this.element.classList.add("focus");
    });
    this.inputTarget.addEventListener("focusout", (event) => {
      this.element.classList.remove("focus");
    });
  }
};

// app/assets/javascripts/formstrap/controllers/file_preview_controller.js
var file_preview_controller_default = class extends Controller {
  static get targets() {
    return ["thumbnails", "template", "input", "placeholder", "thumbnail", "thumbnailDestroy"];
  }
  connect() {
    this.thumbnailWidth = this.firstThumbnailWidth();
    this.thumbnailHeight = this.firstThumbnailHeight();
  }
  preview() {
    this.removeThumbnails();
    this.addThumbnails();
    this.togglePlaceholder();
  }
  togglePlaceholder() {
    if (this.hasFilesSelected()) {
      this.hidePlaceholder();
    } else {
      this.showPlaceholder();
    }
  }
  hasFilesSelected() {
    return this.hasInputFiles() || this.hasVisibleAttachments();
  }
  hasVisibleAttachments() {
    return this.visibleAttachments().length > 0;
  }
  hasAttachments() {
    return this.attachments().length > 0;
  }
  hasInputFiles() {
    return this.inputFiles().length > 0;
  }
  attachments() {
    return this.thumbnailTargets.filter((thumbnail) => {
      return this.isAttachment(thumbnail);
    });
  }
  visibleAttachments() {
    return this.attachments().filter((thumbnail) => {
      return !thumbnail.classList.contains("d-none");
    });
  }
  inputFiles() {
    return Array.from(this.inputTarget.files);
  }
  writeInputFiles(files) {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(file);
    });
    this.inputTarget.files = dataTransfer.files;
  }
  remove(event) {
    const thumbnail = event.target.closest('[data-file-preview-target="thumbnail"]');
    this.removeThumbnail(thumbnail, event.params.name);
    this.togglePlaceholder();
  }
  isAttachment(thumbnail) {
    return thumbnail.querySelector('[data-file-preview-target="thumbnailDestroy"]');
  }
  removeInputFile(thumbnail, fileName) {
    let files = this.inputFiles();
    files = files.filter((file) => {
      return file.name !== fileName;
    });
    thumbnail.remove();
    this.writeInputFiles(files);
  }
  removeAttachment(thumbnail) {
    const destroyInput = thumbnail.querySelector('[data-file-preview-target="thumbnailDestroy"]');
    destroyInput.value = "1";
    thumbnail.classList.add("d-none");
  }
  showPlaceholder() {
    this.placeholderTarget.classList.remove("d-none");
  }
  hidePlaceholder() {
    this.placeholderTarget.classList.add("d-none");
  }
  removeThumbnails() {
    this.thumbnailTargets.forEach((thumbnail) => {
      this.removeThumbnail(thumbnail);
    });
  }
  removeThumbnail(thumbnail, filename) {
    if (this.isAttachment(thumbnail)) {
      this.removeAttachment(thumbnail);
    } else {
      this.removeInputFile(thumbnail, filename);
    }
  }
  addThumbnails() {
    const files = this.inputFiles();
    files.forEach((file) => {
      const thumbnail = this.generateDummyThumbnail();
      this.appendThumbnail(thumbnail);
      this.updateThumbnail(this.lastThumbnail(), file);
    });
  }
  generateDummyThumbnail() {
    return this.templateTarget.content.cloneNode(true);
  }
  appendThumbnail(thumbnail) {
    return this.thumbnailsTarget.appendChild(thumbnail);
  }
  updateThumbnail(thumbnail, file) {
    this.updateThumbnailRemoveButton(thumbnail, file.name);
    const title = this.titleForFile(file);
    this.updateThumbnailTitle(thumbnail, title);
    const icon = this.iconForMimeType(file.type);
    this.updateThumbnailIcon(thumbnail, icon);
    if (this.isImage(file)) {
      this.updateThumbnailImage(thumbnail, file);
    }
  }
  updateThumbnailImage(thumbnail, file) {
    this.fileToBase64(file).then((base64) => {
      this.updateThumbnailBackground(thumbnail, base64);
      this.removeThumbnailIcon(thumbnail);
    });
  }
  titleForFile(file) {
    const byteSizeString = this.bytesToString(file.size);
    return `${file.name} (${byteSizeString})`;
  }
  bytesToString(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
  }
  updateThumbnailRemoveButton(thumbnail, fileName) {
    const removeButton = thumbnail.querySelector(".h-form-file-thumbnail-remove");
    if (removeButton) {
      removeButton.dataset.filePreviewNameParam = fileName;
    }
  }
  updateThumbnailTitle(thumbnail, title) {
    thumbnail.title = title;
  }
  updateThumbnailBackground(thumbnail, url) {
    const thumbnailBackground = thumbnail.querySelector(".h-thumbnail-bg");
    thumbnailBackground.style.backgroundImage = `url('${url}')`;
  }
  removeThumbnailIcon(thumbnail) {
    thumbnail.querySelector(".h-thumbnail-bg").innerHTML = "";
  }
  updateThumbnailIcon(thumbnail, icon) {
    thumbnail.querySelector(".h-thumbnail-bg").innerHTML = icon;
  }
  iconForMimeType(mimeType) {
    const typeMap = {
      image: ["image/bmp", "image/gif", "image/vnd.microsoft.icon", "image/jpeg", "image/png", "image/svg+xml", "image/tiff", "image/webp"],
      play: ["video/mp4", "video/mpeg", "video/ogg", "video/mp2t", "video/webm", "video/3gpp", "video/3gpp2"],
      music: ["audio/aac", "audio/midi", "audio/x-midi", "audio/mpeg", "audio/ogg", "audio/opus", "audio/wav", "audio/webm", "audio/3gpp", "audio/3gpp2"],
      word: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      ppt: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      excel: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      slides: ["application/vnd.oasis.opendocument.presentation"],
      spreadsheet: ["application/vnd.oasis.opendocument.spreadsheet"],
      richtext: ["application/vnd.oasis.opendocument.text"],
      zip: ["application/zip application/x-7z-compressed", "application/x-bzip application/x-bzip2 application/gzip application/vnd.rar"],
      pdf: ["application/pdf"]
    };
    const iconName = Object.keys(typeMap).find((key) => typeMap[key].includes(mimeType));
    const fullIconName = ["bi", "file", "earmark", iconName].filter((e) => typeof e === "string" && e !== "").join("-");
    return `<i class="bi ${fullIconName} h-thumbnail-icon"></i>`;
  }
  isImage(file) {
    return file.type.match(/^image/) !== null;
  }
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error2) => reject(error2);
    });
  }
  thumbnails() {
    return this.thumbnailsTarget.querySelectorAll(".img-thumbnail");
  }
  firstThumbnail() {
    return this.thumbnailsTarget.firstElementChild;
  }
  lastThumbnail() {
    return this.thumbnailsTarget.lastElementChild;
  }
  firstThumbnailWidth() {
    return this.firstThumbnail().style.width;
  }
  firstThumbnailHeight() {
    return this.firstThumbnail().style.height;
  }
};

// app/assets/javascripts/formstrap/controllers/filter_controller.js
var filter_controller_default = class extends Controller {
  static get targets() {
    return ["button", "popup", "conditional", "operator", "value", "hidden", "wrapper", "template", "row"];
  }
  static get values() {
    return {
      name: String
    };
  }
  connect() {
    this.element.controller = this;
  }
  toggle(event) {
    const expanded = this.buttonTarget.getAttribute("aria-expanded") === "true";
    if (expanded) {
      this.close(null);
    } else {
      this.open();
    }
  }
  open() {
    this.buttonTarget.setAttribute("aria-expanded", "true");
    this.popupTarget.classList.remove("closed");
  }
  close(event) {
    this.buttonTarget.setAttribute("aria-expanded", "false");
    this.popupTarget.classList.add("closed");
  }
  add(event) {
    event.preventDefault();
    const html = this.getTemplateHTML();
    this.wrapperTarget.insertAdjacentHTML("beforeend", html);
  }
  remove(event) {
    event.preventDefault();
    const inputGroup = event.currentTarget.closest('[data-filter-target="row"]');
    const conditional = inputGroup.previousElementSibling != null ? inputGroup.previousElementSibling : inputGroup.nextElementSibling;
    inputGroup.remove();
    if (conditional != null)
      conditional.remove();
    this.updateHiddenValue();
    if (this.valueTargets.length === 0) {
      this.removeFilter();
    }
  }
  removeFilter() {
    const form = this.buttonTarget.closest("form");
    this.buttonTarget.remove();
    this.popupTarget.remove();
    form.submit();
  }
  isClickedInside(event) {
    if (!event) {
      return false;
    }
    const inPopup = this.popupTarget.contains(event.target);
    const inButton = this.buttonTarget.contains(event.target);
    const inAddButton = event.target.dataset.action === "click->filters#add";
    return inPopup || inButton || inAddButton;
  }
  updateHiddenValue() {
    this.hiddenTarget.value = this.buildInstructionString();
  }
  buildInstructionString() {
    let string = "";
    for (const row of this.rowTargets) {
      const conditional = row.previousElementSibling ? row.previousElementSibling.querySelector('[data-filter-target="conditional"]').value : null;
      const operator = row.querySelector('[data-filter-target="operator"]').value;
      let values = Array.from(row.querySelectorAll('[data-filter-target="value"]'));
      values = values.filter((element) => {
        return element.style.display;
      });
      values = values.map((element) => {
        return element.value;
      });
      const value = values.join(",");
      string += `${conditional || ""}${operator}:${value}`;
    }
    return string;
  }
  getTemplateHTML() {
    const template = this.templateTarget;
    return template.innerHTML;
  }
};

// app/assets/javascripts/formstrap/controllers/filter_row_controller.js
var filter_row_controller_default = class extends Controller {
  static get targets() {
    return ["original", "operator", "null"];
  }
  connect() {
    this.operatorTarget.addEventListener("change", () => this.handleOperatorChange());
    this.handleOperatorChange();
  }
  handleOperatorChange() {
    if (this.operatorTarget.value === "is_null" || this.operatorTarget.value === "is_not_null") {
      this.toggleNullInput();
    } else if (this.operatorTarget.value === "between" || this.operatorTarget.value === "not_between") {
      this.toggleSecondaryInput();
    } else {
      this.toggleOriginalInput();
    }
  }
  toggleNullInput() {
    this.hideOriginal();
    this.hideSecondary();
    this.showNull();
  }
  toggleOriginalInput() {
    this.showOriginal();
    this.hideSecondary();
    this.hideNull();
  }
  toggleSecondaryInput() {
    this.showSecondary();
    this.hideOriginal();
    this.hideNull();
  }
  hideOriginal() {
    this.originalTarget.style.display = "none";
    this.originalTarget.setAttribute("data-filter-target", "value_original");
  }
  showOriginal() {
    this.originalTarget.style.display = "block";
    this.originalTarget.setAttribute("data-filter-target", "value");
  }
  hideSecondary() {
    for (const [index2, value] of this.originalTargets.entries()) {
      if (index2 !== 0) {
        value.style.display = "none";
        value.setAttribute("data-filter-target", "value_original");
      }
    }
  }
  showSecondary() {
    for (const [index2, value] of this.originalTargets.entries()) {
      if (index2 !== 0) {
        value.style.display = "block";
        value.setAttribute("data-filter-target", "value");
      }
    }
  }
  hideNull() {
    this.nullTarget.style.display = "none";
    this.nullTarget.setAttribute("data-filter-target", "value_null");
  }
  showNull() {
    this.nullTarget.style.display = "block";
    this.nullTarget.setAttribute("data-filter-target", "value");
  }
};

// app/assets/javascripts/formstrap/controllers/filters_controller.js
var filters_controller_default = class extends Controller {
  static get targets() {
    return ["form", "list", "input", "template", "button", "menuItem"];
  }
  add(event) {
    event.preventDefault();
    const name = event.target.dataset.filterName;
    const button = this.getButtonByName(name);
    if (button) {
      this.openFilter(button);
    } else {
      this.createFilter(name);
    }
  }
  createFilter(name) {
    let html = this.getTemplateHTML(name);
    html = this.replaceIdsWithTimestamps(html);
    this.listTarget.insertAdjacentHTML("beforeend", html);
  }
  remove(event) {
    const filter = event.currentTarget.closest(".h-filter");
    filter.remove();
    this.formTarget.submit();
  }
  removeAll(event) {
    this.listTarget.innerHTML = "";
    this.formTarget.submit();
  }
  update(event) {
    this.formTarget.submit();
  }
  getButtonByName(name) {
    return this.buttonTargets.find(function(element) {
      return element.dataset.filterName === name;
    });
  }
  openFilter(button) {
    button.controller.open();
  }
  getTemplateHTML(name) {
    const template = this.templateTargets.filter((element) => {
      return element.dataset.filterName === name;
    })[0];
    return template.innerHTML;
  }
  replaceIdsWithTimestamps(html) {
    return html.replace(/template_id/g, new Date().getTime());
  }
};

// node_modules/flatpickr/dist/esm/types/options.js
var HOOKS = [
  "onChange",
  "onClose",
  "onDayCreate",
  "onDestroy",
  "onKeyDown",
  "onMonthChange",
  "onOpen",
  "onParseConfig",
  "onReady",
  "onValueUpdate",
  "onYearChange",
  "onPreCalendarPosition"
];
var defaults2 = {
  _disable: [],
  allowInput: false,
  allowInvalidPreload: false,
  altFormat: "F j, Y",
  altInput: false,
  altInputClass: "form-control input",
  animate: typeof window === "object" && window.navigator.userAgent.indexOf("MSIE") === -1,
  ariaDateFormat: "F j, Y",
  autoFillDefaultTime: true,
  clickOpens: true,
  closeOnSelect: true,
  conjunction: ", ",
  dateFormat: "Y-m-d",
  defaultHour: 12,
  defaultMinute: 0,
  defaultSeconds: 0,
  disable: [],
  disableMobile: false,
  enableSeconds: false,
  enableTime: false,
  errorHandler: (err) => typeof console !== "undefined" && console.warn(err),
  getWeek: (givenDate) => {
    const date = new Date(givenDate.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 864e5 - 3 + (week1.getDay() + 6) % 7) / 7);
  },
  hourIncrement: 1,
  ignoredFocusElements: [],
  inline: false,
  locale: "default",
  minuteIncrement: 5,
  mode: "single",
  monthSelectorType: "dropdown",
  nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
  noCalendar: false,
  now: new Date(),
  onChange: [],
  onClose: [],
  onDayCreate: [],
  onDestroy: [],
  onKeyDown: [],
  onMonthChange: [],
  onOpen: [],
  onParseConfig: [],
  onReady: [],
  onValueUpdate: [],
  onYearChange: [],
  onPreCalendarPosition: [],
  plugins: [],
  position: "auto",
  positionElement: void 0,
  prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
  shorthandCurrentMonth: false,
  showMonths: 1,
  static: false,
  time_24hr: false,
  weekNumbers: false,
  wrap: false
};

// node_modules/flatpickr/dist/esm/l10n/default.js
var english = {
  weekdays: {
    shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longhand: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  },
  months: {
    shorthand: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    longhand: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  },
  daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  firstDayOfWeek: 0,
  ordinal: (nth) => {
    const s = nth % 100;
    if (s > 3 && s < 21)
      return "th";
    switch (s % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  },
  rangeSeparator: " to ",
  weekAbbreviation: "Wk",
  scrollTitle: "Scroll to increment",
  toggleTitle: "Click to toggle",
  amPM: ["AM", "PM"],
  yearAriaLabel: "Year",
  monthAriaLabel: "Month",
  hourAriaLabel: "Hour",
  minuteAriaLabel: "Minute",
  time_24hr: false
};
var default_default = english;

// node_modules/flatpickr/dist/esm/utils/index.js
var pad = (number, length = 2) => `000${number}`.slice(length * -1);
var int = (bool) => bool === true ? 1 : 0;
function debounce(fn2, wait) {
  let t;
  return function() {
    clearTimeout(t);
    t = setTimeout(() => fn2.apply(this, arguments), wait);
  };
}
var arrayify = (obj) => obj instanceof Array ? obj : [obj];

// node_modules/flatpickr/dist/esm/utils/dom.js
function toggleClass2(elem, className, bool) {
  if (bool === true)
    return elem.classList.add(className);
  elem.classList.remove(className);
}
function createElement(tag, className, content) {
  const e = window.document.createElement(tag);
  className = className || "";
  content = content || "";
  e.className = className;
  if (content !== void 0)
    e.textContent = content;
  return e;
}
function clearNode(node) {
  while (node.firstChild)
    node.removeChild(node.firstChild);
}
function findParent(node, condition) {
  if (condition(node))
    return node;
  else if (node.parentNode)
    return findParent(node.parentNode, condition);
  return void 0;
}
function createNumberInput(inputClassName, opts) {
  const wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
  if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
    numInput.type = "number";
  } else {
    numInput.type = "text";
    numInput.pattern = "\\d*";
  }
  if (opts !== void 0)
    for (const key in opts)
      numInput.setAttribute(key, opts[key]);
  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);
  return wrapper;
}
function getEventTarget(event) {
  try {
    if (typeof event.composedPath === "function") {
      const path = event.composedPath();
      return path[0];
    }
    return event.target;
  } catch (error2) {
    return event.target;
  }
}

// node_modules/flatpickr/dist/esm/utils/formatting.js
var doNothing = () => void 0;
var monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
var revFormat = {
  D: doNothing,
  F: function(dateObj, monthName, locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  H: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  J: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  K: (dateObj, amPM, locale) => {
    dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
  },
  M: function(dateObj, shortMonth, locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  S: (dateObj, seconds) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1e3),
  W: function(dateObj, weekNum, locale) {
    const weekNumber = parseInt(weekNum);
    const date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
    return date;
  },
  Y: (dateObj, year) => {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: (_, ISODate) => new Date(ISODate),
  d: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  h: (dateObj, hour) => {
    dateObj.setHours(parseFloat(hour));
  },
  i: (dateObj, minutes) => {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: (dateObj, day) => {
    dateObj.setDate(parseFloat(day));
  },
  l: doNothing,
  m: (dateObj, month) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: (dateObj, month) => {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: (dateObj, seconds) => {
    dateObj.setSeconds(parseFloat(seconds));
  },
  u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
  w: doNothing,
  y: (dateObj, year) => {
    dateObj.setFullYear(2e3 + parseFloat(year));
  }
};
var tokenRegex = {
  D: "(\\w+)",
  F: "(\\w+)",
  G: "(\\d\\d|\\d)",
  H: "(\\d\\d|\\d)",
  J: "(\\d\\d|\\d)\\w+",
  K: "",
  M: "(\\w+)",
  S: "(\\d\\d|\\d)",
  U: "(.+)",
  W: "(\\d\\d|\\d)",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d\\d|\\d)",
  h: "(\\d\\d|\\d)",
  i: "(\\d\\d|\\d)",
  j: "(\\d\\d|\\d)",
  l: "(\\w+)",
  m: "(\\d\\d|\\d)",
  n: "(\\d\\d|\\d)",
  s: "(\\d\\d|\\d)",
  u: "(.+)",
  w: "(\\d\\d|\\d)",
  y: "(\\d{2})"
};
var formats = {
  Z: (date) => date.toISOString(),
  D: function(date, locale, options) {
    return locale.weekdays.shorthand[formats.w(date, locale, options)];
  },
  F: function(date, locale, options) {
    return monthToStr(formats.n(date, locale, options) - 1, false, locale);
  },
  G: function(date, locale, options) {
    return pad(formats.h(date, locale, options));
  },
  H: (date) => pad(date.getHours()),
  J: function(date, locale) {
    return locale.ordinal !== void 0 ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
  },
  K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
  M: function(date, locale) {
    return monthToStr(date.getMonth(), true, locale);
  },
  S: (date) => pad(date.getSeconds()),
  U: (date) => date.getTime() / 1e3,
  W: function(date, _, options) {
    return options.getWeek(date);
  },
  Y: (date) => pad(date.getFullYear(), 4),
  d: (date) => pad(date.getDate()),
  h: (date) => date.getHours() % 12 ? date.getHours() % 12 : 12,
  i: (date) => pad(date.getMinutes()),
  j: (date) => date.getDate(),
  l: function(date, locale) {
    return locale.weekdays.longhand[date.getDay()];
  },
  m: (date) => pad(date.getMonth() + 1),
  n: (date) => date.getMonth() + 1,
  s: (date) => date.getSeconds(),
  u: (date) => date.getTime(),
  w: (date) => date.getDay(),
  y: (date) => String(date.getFullYear()).substring(2)
};

// node_modules/flatpickr/dist/esm/utils/dates.js
var createDateFormatter = ({ config = defaults2, l10n = english, isMobile = false }) => (dateObj, frmt, overrideLocale) => {
  const locale = overrideLocale || l10n;
  if (config.formatDate !== void 0 && !isMobile) {
    return config.formatDate(dateObj, frmt, locale);
  }
  return frmt.split("").map((c, i, arr) => formats[c] && arr[i - 1] !== "\\" ? formats[c](dateObj, locale, config) : c !== "\\" ? c : "").join("");
};
var createDateParser = ({ config = defaults2, l10n = english }) => (date, givenFormat, timeless, customLocale) => {
  if (date !== 0 && !date)
    return void 0;
  const locale = customLocale || l10n;
  let parsedDate;
  const dateOrig = date;
  if (date instanceof Date)
    parsedDate = new Date(date.getTime());
  else if (typeof date !== "string" && date.toFixed !== void 0)
    parsedDate = new Date(date);
  else if (typeof date === "string") {
    const format2 = givenFormat || (config || defaults2).dateFormat;
    const datestr = String(date).trim();
    if (datestr === "today") {
      parsedDate = new Date();
      timeless = true;
    } else if (/Z$/.test(datestr) || /GMT$/.test(datestr))
      parsedDate = new Date(date);
    else if (config && config.parseDate)
      parsedDate = config.parseDate(date, format2);
    else {
      parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
      let matched, ops = [];
      for (let i = 0, matchIndex = 0, regexStr = ""; i < format2.length; i++) {
        const token = format2[i];
        const isBackSlash = token === "\\";
        const escaped = format2[i - 1] === "\\" || isBackSlash;
        if (tokenRegex[token] && !escaped) {
          regexStr += tokenRegex[token];
          const match = new RegExp(regexStr).exec(date);
          if (match && (matched = true)) {
            ops[token !== "Y" ? "push" : "unshift"]({
              fn: revFormat[token],
              val: match[++matchIndex]
            });
          }
        } else if (!isBackSlash)
          regexStr += ".";
        ops.forEach(({ fn: fn2, val }) => parsedDate = fn2(parsedDate, val, locale) || parsedDate);
      }
      parsedDate = matched ? parsedDate : void 0;
    }
  }
  if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
    config.errorHandler(new Error(`Invalid date provided: ${dateOrig}`));
    return void 0;
  }
  if (timeless === true)
    parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};
function compareDates(date1, date2, timeless = true) {
  if (timeless !== false) {
    return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
  }
  return date1.getTime() - date2.getTime();
}
var isBetween = (ts, ts1, ts2) => {
  return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
var duration = {
  DAY: 864e5
};
function getDefaultHours(config) {
  let hours = config.defaultHour;
  let minutes = config.defaultMinute;
  let seconds = config.defaultSeconds;
  if (config.minDate !== void 0) {
    const minHour = config.minDate.getHours();
    const minMinutes = config.minDate.getMinutes();
    const minSeconds = config.minDate.getSeconds();
    if (hours < minHour) {
      hours = minHour;
    }
    if (hours === minHour && minutes < minMinutes) {
      minutes = minMinutes;
    }
    if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
      seconds = config.minDate.getSeconds();
  }
  if (config.maxDate !== void 0) {
    const maxHr = config.maxDate.getHours();
    const maxMinutes = config.maxDate.getMinutes();
    hours = Math.min(hours, maxHr);
    if (hours === maxHr)
      minutes = Math.min(maxMinutes, minutes);
    if (hours === maxHr && minutes === maxMinutes)
      seconds = config.maxDate.getSeconds();
  }
  return { hours, minutes, seconds };
}

// node_modules/flatpickr/dist/esm/utils/polyfills.js
if (typeof Object.assign !== "function") {
  Object.assign = function(target, ...args) {
    if (!target) {
      throw TypeError("Cannot convert undefined or null to object");
    }
    for (const source of args) {
      if (source) {
        Object.keys(source).forEach((key) => target[key] = source[key]);
      }
    }
    return target;
  };
}

// node_modules/flatpickr/dist/esm/index.js
var DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
  const self2 = {
    config: Object.assign(Object.assign({}, defaults2), flatpickr.defaultConfig),
    l10n: default_default
  };
  self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
  self2._handlers = [];
  self2.pluginElements = [];
  self2.loadedPlugins = [];
  self2._bind = bind;
  self2._setHoursFromDate = setHoursFromDate;
  self2._positionCalendar = positionCalendar;
  self2.changeMonth = changeMonth;
  self2.changeYear = changeYear;
  self2.clear = clear;
  self2.close = close;
  self2._createElement = createElement;
  self2.destroy = destroy2;
  self2.isEnabled = isEnabled;
  self2.jumpToDate = jumpToDate;
  self2.open = open;
  self2.redraw = redraw;
  self2.set = set;
  self2.setDate = setDate;
  self2.toggle = toggle;
  function setupHelperFunctions() {
    self2.utils = {
      getDaysInMonth(month = self2.currentMonth, yr = self2.currentYear) {
        if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0))
          return 29;
        return self2.l10n.daysInMonth[month];
      }
    };
  }
  function init() {
    self2.element = self2.input = element;
    self2.isOpen = false;
    parseConfig();
    setupLocale();
    setupInputs();
    setupDates();
    setupHelperFunctions();
    if (!self2.isMobile)
      build();
    bindEvents();
    if (self2.selectedDates.length || self2.config.noCalendar) {
      if (self2.config.enableTime) {
        setHoursFromDate(self2.config.noCalendar ? self2.latestSelectedDateObj : void 0);
      }
      updateValue(false);
    }
    setCalendarWidth();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!self2.isMobile && isSafari) {
      positionCalendar();
    }
    triggerEvent("onReady");
  }
  function bindToInstance(fn2) {
    return fn2.bind(self2);
  }
  function setCalendarWidth() {
    const config = self2.config;
    if (config.weekNumbers === false && config.showMonths === 1) {
      return;
    } else if (config.noCalendar !== true) {
      window.requestAnimationFrame(function() {
        if (self2.calendarContainer !== void 0) {
          self2.calendarContainer.style.visibility = "hidden";
          self2.calendarContainer.style.display = "block";
        }
        if (self2.daysContainer !== void 0) {
          const daysWidth = (self2.days.offsetWidth + 1) * config.showMonths;
          self2.daysContainer.style.width = daysWidth + "px";
          self2.calendarContainer.style.width = daysWidth + (self2.weekWrapper !== void 0 ? self2.weekWrapper.offsetWidth : 0) + "px";
          self2.calendarContainer.style.removeProperty("visibility");
          self2.calendarContainer.style.removeProperty("display");
        }
      });
    }
  }
  function updateTime(e) {
    if (self2.selectedDates.length === 0) {
      const defaultDate = self2.config.minDate === void 0 || compareDates(new Date(), self2.config.minDate) >= 0 ? new Date() : new Date(self2.config.minDate.getTime());
      const defaults3 = getDefaultHours(self2.config);
      defaultDate.setHours(defaults3.hours, defaults3.minutes, defaults3.seconds, defaultDate.getMilliseconds());
      self2.selectedDates = [defaultDate];
      self2.latestSelectedDateObj = defaultDate;
    }
    if (e !== void 0 && e.type !== "blur") {
      timeWrapper(e);
    }
    const prevValue = self2._input.value;
    setHoursFromInputs();
    updateValue();
    if (self2._input.value !== prevValue) {
      self2._debouncedChange();
    }
  }
  function ampm2military(hour, amPM) {
    return hour % 12 + 12 * int(amPM === self2.l10n.amPM[1]);
  }
  function military2ampm(hour) {
    switch (hour % 24) {
      case 0:
      case 12:
        return 12;
      default:
        return hour % 12;
    }
  }
  function setHoursFromInputs() {
    if (self2.hourElement === void 0 || self2.minuteElement === void 0)
      return;
    let hours = (parseInt(self2.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self2.minuteElement.value, 10) || 0) % 60, seconds = self2.secondElement !== void 0 ? (parseInt(self2.secondElement.value, 10) || 0) % 60 : 0;
    if (self2.amPM !== void 0) {
      hours = ampm2military(hours, self2.amPM.textContent);
    }
    const limitMinHours = self2.config.minTime !== void 0 || self2.config.minDate && self2.minDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.minDate, true) === 0;
    const limitMaxHours = self2.config.maxTime !== void 0 || self2.config.maxDate && self2.maxDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.maxDate, true) === 0;
    if (limitMaxHours) {
      const maxTime = self2.config.maxTime !== void 0 ? self2.config.maxTime : self2.config.maxDate;
      hours = Math.min(hours, maxTime.getHours());
      if (hours === maxTime.getHours())
        minutes = Math.min(minutes, maxTime.getMinutes());
      if (minutes === maxTime.getMinutes())
        seconds = Math.min(seconds, maxTime.getSeconds());
    }
    if (limitMinHours) {
      const minTime = self2.config.minTime !== void 0 ? self2.config.minTime : self2.config.minDate;
      hours = Math.max(hours, minTime.getHours());
      if (hours === minTime.getHours() && minutes < minTime.getMinutes())
        minutes = minTime.getMinutes();
      if (minutes === minTime.getMinutes())
        seconds = Math.max(seconds, minTime.getSeconds());
    }
    setHours(hours, minutes, seconds);
  }
  function setHoursFromDate(dateObj) {
    const date = dateObj || self2.latestSelectedDateObj;
    if (date) {
      setHours(date.getHours(), date.getMinutes(), date.getSeconds());
    }
  }
  function setHours(hours, minutes, seconds) {
    if (self2.latestSelectedDateObj !== void 0) {
      self2.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
    }
    if (!self2.hourElement || !self2.minuteElement || self2.isMobile)
      return;
    self2.hourElement.value = pad(!self2.config.time_24hr ? (12 + hours) % 12 + 12 * int(hours % 12 === 0) : hours);
    self2.minuteElement.value = pad(minutes);
    if (self2.amPM !== void 0)
      self2.amPM.textContent = self2.l10n.amPM[int(hours >= 12)];
    if (self2.secondElement !== void 0)
      self2.secondElement.value = pad(seconds);
  }
  function onYearInput(event) {
    const eventTarget = getEventTarget(event);
    const year = parseInt(eventTarget.value) + (event.delta || 0);
    if (year / 1e3 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
      changeYear(year);
    }
  }
  function bind(element2, event, handler, options) {
    if (event instanceof Array)
      return event.forEach((ev) => bind(element2, ev, handler, options));
    if (element2 instanceof Array)
      return element2.forEach((el) => bind(el, event, handler, options));
    element2.addEventListener(event, handler, options);
    self2._handlers.push({
      remove: () => element2.removeEventListener(event, handler)
    });
  }
  function triggerChange() {
    triggerEvent("onChange");
  }
  function bindEvents() {
    if (self2.config.wrap) {
      ["open", "close", "toggle", "clear"].forEach((evt) => {
        Array.prototype.forEach.call(self2.element.querySelectorAll(`[data-${evt}]`), (el) => bind(el, "click", self2[evt]));
      });
    }
    if (self2.isMobile) {
      setupMobile();
      return;
    }
    const debouncedResize = debounce(onResize, 50);
    self2._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
    if (self2.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
      bind(self2.daysContainer, "mouseover", (e) => {
        if (self2.config.mode === "range")
          onMouseOver(getEventTarget(e));
      });
    bind(window.document.body, "keydown", onKeyDown);
    if (!self2.config.inline && !self2.config.static)
      bind(window, "resize", debouncedResize);
    if (window.ontouchstart !== void 0)
      bind(window.document, "touchstart", documentClick);
    else
      bind(window.document, "mousedown", documentClick);
    bind(window.document, "focus", documentClick, { capture: true });
    if (self2.config.clickOpens === true) {
      bind(self2._input, "focus", self2.open);
      bind(self2._input, "click", self2.open);
    }
    if (self2.daysContainer !== void 0) {
      bind(self2.monthNav, "click", onMonthNavClick);
      bind(self2.monthNav, ["keyup", "increment"], onYearInput);
      bind(self2.daysContainer, "click", selectDate);
    }
    if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0) {
      const selText = (e) => getEventTarget(e).select();
      bind(self2.timeContainer, ["increment"], updateTime);
      bind(self2.timeContainer, "blur", updateTime, { capture: true });
      bind(self2.timeContainer, "click", timeIncrement);
      bind([self2.hourElement, self2.minuteElement], ["focus", "click"], selText);
      if (self2.secondElement !== void 0)
        bind(self2.secondElement, "focus", () => self2.secondElement && self2.secondElement.select());
      if (self2.amPM !== void 0) {
        bind(self2.amPM, "click", (e) => {
          updateTime(e);
          triggerChange();
        });
      }
    }
    if (self2.config.allowInput) {
      bind(self2._input, "blur", onBlur);
    }
  }
  function jumpToDate(jumpDate, triggerChange2) {
    const jumpTo = jumpDate !== void 0 ? self2.parseDate(jumpDate) : self2.latestSelectedDateObj || (self2.config.minDate && self2.config.minDate > self2.now ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate < self2.now ? self2.config.maxDate : self2.now);
    const oldYear = self2.currentYear;
    const oldMonth = self2.currentMonth;
    try {
      if (jumpTo !== void 0) {
        self2.currentYear = jumpTo.getFullYear();
        self2.currentMonth = jumpTo.getMonth();
      }
    } catch (e) {
      e.message = "Invalid date supplied: " + jumpTo;
      self2.config.errorHandler(e);
    }
    if (triggerChange2 && self2.currentYear !== oldYear) {
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    if (triggerChange2 && (self2.currentYear !== oldYear || self2.currentMonth !== oldMonth)) {
      triggerEvent("onMonthChange");
    }
    self2.redraw();
  }
  function timeIncrement(e) {
    const eventTarget = getEventTarget(e);
    if (~eventTarget.className.indexOf("arrow"))
      incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
  }
  function incrementNumInput(e, delta, inputElem) {
    const target = e && getEventTarget(e);
    const input = inputElem || target && target.parentNode && target.parentNode.firstChild;
    const event = createEvent("increment");
    event.delta = delta;
    input && input.dispatchEvent(event);
  }
  function build() {
    const fragment = window.document.createDocumentFragment();
    self2.calendarContainer = createElement("div", "flatpickr-calendar");
    self2.calendarContainer.tabIndex = -1;
    if (!self2.config.noCalendar) {
      fragment.appendChild(buildMonthNav());
      self2.innerContainer = createElement("div", "flatpickr-innerContainer");
      if (self2.config.weekNumbers) {
        const { weekWrapper, weekNumbers } = buildWeeks();
        self2.innerContainer.appendChild(weekWrapper);
        self2.weekNumbers = weekNumbers;
        self2.weekWrapper = weekWrapper;
      }
      self2.rContainer = createElement("div", "flatpickr-rContainer");
      self2.rContainer.appendChild(buildWeekdays());
      if (!self2.daysContainer) {
        self2.daysContainer = createElement("div", "flatpickr-days");
        self2.daysContainer.tabIndex = -1;
      }
      buildDays();
      self2.rContainer.appendChild(self2.daysContainer);
      self2.innerContainer.appendChild(self2.rContainer);
      fragment.appendChild(self2.innerContainer);
    }
    if (self2.config.enableTime) {
      fragment.appendChild(buildTime());
    }
    toggleClass2(self2.calendarContainer, "rangeMode", self2.config.mode === "range");
    toggleClass2(self2.calendarContainer, "animate", self2.config.animate === true);
    toggleClass2(self2.calendarContainer, "multiMonth", self2.config.showMonths > 1);
    self2.calendarContainer.appendChild(fragment);
    const customAppend = self2.config.appendTo !== void 0 && self2.config.appendTo.nodeType !== void 0;
    if (self2.config.inline || self2.config.static) {
      self2.calendarContainer.classList.add(self2.config.inline ? "inline" : "static");
      if (self2.config.inline) {
        if (!customAppend && self2.element.parentNode)
          self2.element.parentNode.insertBefore(self2.calendarContainer, self2._input.nextSibling);
        else if (self2.config.appendTo !== void 0)
          self2.config.appendTo.appendChild(self2.calendarContainer);
      }
      if (self2.config.static) {
        const wrapper = createElement("div", "flatpickr-wrapper");
        if (self2.element.parentNode)
          self2.element.parentNode.insertBefore(wrapper, self2.element);
        wrapper.appendChild(self2.element);
        if (self2.altInput)
          wrapper.appendChild(self2.altInput);
        wrapper.appendChild(self2.calendarContainer);
      }
    }
    if (!self2.config.static && !self2.config.inline)
      (self2.config.appendTo !== void 0 ? self2.config.appendTo : window.document.body).appendChild(self2.calendarContainer);
  }
  function createDay(className, date, dayNumber, i) {
    const dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
    dayElement.dateObj = date;
    dayElement.$i = i;
    dayElement.setAttribute("aria-label", self2.formatDate(date, self2.config.ariaDateFormat));
    if (className.indexOf("hidden") === -1 && compareDates(date, self2.now) === 0) {
      self2.todayDateElem = dayElement;
      dayElement.classList.add("today");
      dayElement.setAttribute("aria-current", "date");
    }
    if (dateIsEnabled) {
      dayElement.tabIndex = -1;
      if (isDateSelected(date)) {
        dayElement.classList.add("selected");
        self2.selectedDateElem = dayElement;
        if (self2.config.mode === "range") {
          toggleClass2(dayElement, "startRange", self2.selectedDates[0] && compareDates(date, self2.selectedDates[0], true) === 0);
          toggleClass2(dayElement, "endRange", self2.selectedDates[1] && compareDates(date, self2.selectedDates[1], true) === 0);
          if (className === "nextMonthDay")
            dayElement.classList.add("inRange");
        }
      }
    } else {
      dayElement.classList.add("flatpickr-disabled");
    }
    if (self2.config.mode === "range") {
      if (isDateInRange(date) && !isDateSelected(date))
        dayElement.classList.add("inRange");
    }
    if (self2.weekNumbers && self2.config.showMonths === 1 && className !== "prevMonthDay" && dayNumber % 7 === 1) {
      self2.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self2.config.getWeek(date) + "</span>");
    }
    triggerEvent("onDayCreate", dayElement);
    return dayElement;
  }
  function focusOnDayElem(targetNode) {
    targetNode.focus();
    if (self2.config.mode === "range")
      onMouseOver(targetNode);
  }
  function getFirstAvailableDay(delta) {
    const startMonth = delta > 0 ? 0 : self2.config.showMonths - 1;
    const endMonth = delta > 0 ? self2.config.showMonths : -1;
    for (let m = startMonth; m != endMonth; m += delta) {
      const month = self2.daysContainer.children[m];
      const startIndex = delta > 0 ? 0 : month.children.length - 1;
      const endIndex = delta > 0 ? month.children.length : -1;
      for (let i = startIndex; i != endIndex; i += delta) {
        const c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
          return c;
      }
    }
    return void 0;
  }
  function getNextAvailableDay(current, delta) {
    const givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self2.currentMonth;
    const endMonth = delta > 0 ? self2.config.showMonths : -1;
    const loopDelta = delta > 0 ? 1 : -1;
    for (let m = givenMonth - self2.currentMonth; m != endMonth; m += loopDelta) {
      const month = self2.daysContainer.children[m];
      const startIndex = givenMonth - self2.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
      const numMonthDays = month.children.length;
      for (let i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
        const c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta))
          return focusOnDayElem(c);
      }
    }
    self2.changeMonth(loopDelta);
    focusOnDay(getFirstAvailableDay(loopDelta), 0);
    return void 0;
  }
  function focusOnDay(current, offset2) {
    const dayFocused = isInView(document.activeElement || document.body);
    const startElem = current !== void 0 ? current : dayFocused ? document.activeElement : self2.selectedDateElem !== void 0 && isInView(self2.selectedDateElem) ? self2.selectedDateElem : self2.todayDateElem !== void 0 && isInView(self2.todayDateElem) ? self2.todayDateElem : getFirstAvailableDay(offset2 > 0 ? 1 : -1);
    if (startElem === void 0) {
      self2._input.focus();
    } else if (!dayFocused) {
      focusOnDayElem(startElem);
    } else {
      getNextAvailableDay(startElem, offset2);
    }
  }
  function buildMonthDays(year, month) {
    const firstOfMonth = (new Date(year, month, 1).getDay() - self2.l10n.firstDayOfWeek + 7) % 7;
    const prevMonthDays = self2.utils.getDaysInMonth((month - 1 + 12) % 12, year);
    const daysInMonth = self2.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self2.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
    let dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
    for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
      days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
    }
    for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
      days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
    }
    for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self2.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
      days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
    }
    const dayContainer = createElement("div", "dayContainer");
    dayContainer.appendChild(days);
    return dayContainer;
  }
  function buildDays() {
    if (self2.daysContainer === void 0) {
      return;
    }
    clearNode(self2.daysContainer);
    if (self2.weekNumbers)
      clearNode(self2.weekNumbers);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < self2.config.showMonths; i++) {
      const d = new Date(self2.currentYear, self2.currentMonth, 1);
      d.setMonth(self2.currentMonth + i);
      frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
    }
    self2.daysContainer.appendChild(frag);
    self2.days = self2.daysContainer.firstChild;
    if (self2.config.mode === "range" && self2.selectedDates.length === 1) {
      onMouseOver();
    }
  }
  function buildMonthSwitch() {
    if (self2.config.showMonths > 1 || self2.config.monthSelectorType !== "dropdown")
      return;
    const shouldBuildMonth = function(month) {
      if (self2.config.minDate !== void 0 && self2.currentYear === self2.config.minDate.getFullYear() && month < self2.config.minDate.getMonth()) {
        return false;
      }
      return !(self2.config.maxDate !== void 0 && self2.currentYear === self2.config.maxDate.getFullYear() && month > self2.config.maxDate.getMonth());
    };
    self2.monthsDropdownContainer.tabIndex = -1;
    self2.monthsDropdownContainer.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      if (!shouldBuildMonth(i))
        continue;
      const month = createElement("option", "flatpickr-monthDropdown-month");
      month.value = new Date(self2.currentYear, i).getMonth().toString();
      month.textContent = monthToStr(i, self2.config.shorthandCurrentMonth, self2.l10n);
      month.tabIndex = -1;
      if (self2.currentMonth === i) {
        month.selected = true;
      }
      self2.monthsDropdownContainer.appendChild(month);
    }
  }
  function buildMonth() {
    const container = createElement("div", "flatpickr-month");
    const monthNavFragment = window.document.createDocumentFragment();
    let monthElement;
    if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
      monthElement = createElement("span", "cur-month");
    } else {
      self2.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
      self2.monthsDropdownContainer.setAttribute("aria-label", self2.l10n.monthAriaLabel);
      bind(self2.monthsDropdownContainer, "change", (e) => {
        const target = getEventTarget(e);
        const selectedMonth = parseInt(target.value, 10);
        self2.changeMonth(selectedMonth - self2.currentMonth);
        triggerEvent("onMonthChange");
      });
      buildMonthSwitch();
      monthElement = self2.monthsDropdownContainer;
    }
    const yearInput = createNumberInput("cur-year", { tabindex: "-1" });
    const yearElement = yearInput.getElementsByTagName("input")[0];
    yearElement.setAttribute("aria-label", self2.l10n.yearAriaLabel);
    if (self2.config.minDate) {
      yearElement.setAttribute("min", self2.config.minDate.getFullYear().toString());
    }
    if (self2.config.maxDate) {
      yearElement.setAttribute("max", self2.config.maxDate.getFullYear().toString());
      yearElement.disabled = !!self2.config.minDate && self2.config.minDate.getFullYear() === self2.config.maxDate.getFullYear();
    }
    const currentMonth = createElement("div", "flatpickr-current-month");
    currentMonth.appendChild(monthElement);
    currentMonth.appendChild(yearInput);
    monthNavFragment.appendChild(currentMonth);
    container.appendChild(monthNavFragment);
    return {
      container,
      yearElement,
      monthElement
    };
  }
  function buildMonths() {
    clearNode(self2.monthNav);
    self2.monthNav.appendChild(self2.prevMonthNav);
    if (self2.config.showMonths) {
      self2.yearElements = [];
      self2.monthElements = [];
    }
    for (let m = self2.config.showMonths; m--; ) {
      const month = buildMonth();
      self2.yearElements.push(month.yearElement);
      self2.monthElements.push(month.monthElement);
      self2.monthNav.appendChild(month.container);
    }
    self2.monthNav.appendChild(self2.nextMonthNav);
  }
  function buildMonthNav() {
    self2.monthNav = createElement("div", "flatpickr-months");
    self2.yearElements = [];
    self2.monthElements = [];
    self2.prevMonthNav = createElement("span", "flatpickr-prev-month");
    self2.prevMonthNav.innerHTML = self2.config.prevArrow;
    self2.nextMonthNav = createElement("span", "flatpickr-next-month");
    self2.nextMonthNav.innerHTML = self2.config.nextArrow;
    buildMonths();
    Object.defineProperty(self2, "_hidePrevMonthArrow", {
      get: () => self2.__hidePrevMonthArrow,
      set(bool) {
        if (self2.__hidePrevMonthArrow !== bool) {
          toggleClass2(self2.prevMonthNav, "flatpickr-disabled", bool);
          self2.__hidePrevMonthArrow = bool;
        }
      }
    });
    Object.defineProperty(self2, "_hideNextMonthArrow", {
      get: () => self2.__hideNextMonthArrow,
      set(bool) {
        if (self2.__hideNextMonthArrow !== bool) {
          toggleClass2(self2.nextMonthNav, "flatpickr-disabled", bool);
          self2.__hideNextMonthArrow = bool;
        }
      }
    });
    self2.currentYearElement = self2.yearElements[0];
    updateNavigationCurrentMonth();
    return self2.monthNav;
  }
  function buildTime() {
    self2.calendarContainer.classList.add("hasTime");
    if (self2.config.noCalendar)
      self2.calendarContainer.classList.add("noCalendar");
    const defaults3 = getDefaultHours(self2.config);
    self2.timeContainer = createElement("div", "flatpickr-time");
    self2.timeContainer.tabIndex = -1;
    const separator = createElement("span", "flatpickr-time-separator", ":");
    const hourInput = createNumberInput("flatpickr-hour", {
      "aria-label": self2.l10n.hourAriaLabel
    });
    self2.hourElement = hourInput.getElementsByTagName("input")[0];
    const minuteInput = createNumberInput("flatpickr-minute", {
      "aria-label": self2.l10n.minuteAriaLabel
    });
    self2.minuteElement = minuteInput.getElementsByTagName("input")[0];
    self2.hourElement.tabIndex = self2.minuteElement.tabIndex = -1;
    self2.hourElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getHours() : self2.config.time_24hr ? defaults3.hours : military2ampm(defaults3.hours));
    self2.minuteElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getMinutes() : defaults3.minutes);
    self2.hourElement.setAttribute("step", self2.config.hourIncrement.toString());
    self2.minuteElement.setAttribute("step", self2.config.minuteIncrement.toString());
    self2.hourElement.setAttribute("min", self2.config.time_24hr ? "0" : "1");
    self2.hourElement.setAttribute("max", self2.config.time_24hr ? "23" : "12");
    self2.hourElement.setAttribute("maxlength", "2");
    self2.minuteElement.setAttribute("min", "0");
    self2.minuteElement.setAttribute("max", "59");
    self2.minuteElement.setAttribute("maxlength", "2");
    self2.timeContainer.appendChild(hourInput);
    self2.timeContainer.appendChild(separator);
    self2.timeContainer.appendChild(minuteInput);
    if (self2.config.time_24hr)
      self2.timeContainer.classList.add("time24hr");
    if (self2.config.enableSeconds) {
      self2.timeContainer.classList.add("hasSeconds");
      const secondInput = createNumberInput("flatpickr-second");
      self2.secondElement = secondInput.getElementsByTagName("input")[0];
      self2.secondElement.value = pad(self2.latestSelectedDateObj ? self2.latestSelectedDateObj.getSeconds() : defaults3.seconds);
      self2.secondElement.setAttribute("step", self2.minuteElement.getAttribute("step"));
      self2.secondElement.setAttribute("min", "0");
      self2.secondElement.setAttribute("max", "59");
      self2.secondElement.setAttribute("maxlength", "2");
      self2.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
      self2.timeContainer.appendChild(secondInput);
    }
    if (!self2.config.time_24hr) {
      self2.amPM = createElement("span", "flatpickr-am-pm", self2.l10n.amPM[int((self2.latestSelectedDateObj ? self2.hourElement.value : self2.config.defaultHour) > 11)]);
      self2.amPM.title = self2.l10n.toggleTitle;
      self2.amPM.tabIndex = -1;
      self2.timeContainer.appendChild(self2.amPM);
    }
    return self2.timeContainer;
  }
  function buildWeekdays() {
    if (!self2.weekdayContainer)
      self2.weekdayContainer = createElement("div", "flatpickr-weekdays");
    else
      clearNode(self2.weekdayContainer);
    for (let i = self2.config.showMonths; i--; ) {
      const container = createElement("div", "flatpickr-weekdaycontainer");
      self2.weekdayContainer.appendChild(container);
    }
    updateWeekdays();
    return self2.weekdayContainer;
  }
  function updateWeekdays() {
    if (!self2.weekdayContainer) {
      return;
    }
    const firstDayOfWeek = self2.l10n.firstDayOfWeek;
    let weekdays = [...self2.l10n.weekdays.shorthand];
    if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
      weekdays = [
        ...weekdays.splice(firstDayOfWeek, weekdays.length),
        ...weekdays.splice(0, firstDayOfWeek)
      ];
    }
    for (let i = self2.config.showMonths; i--; ) {
      self2.weekdayContainer.children[i].innerHTML = `
      <span class='flatpickr-weekday'>
        ${weekdays.join("</span><span class='flatpickr-weekday'>")}
      </span>
      `;
    }
  }
  function buildWeeks() {
    self2.calendarContainer.classList.add("hasWeeks");
    const weekWrapper = createElement("div", "flatpickr-weekwrapper");
    weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self2.l10n.weekAbbreviation));
    const weekNumbers = createElement("div", "flatpickr-weeks");
    weekWrapper.appendChild(weekNumbers);
    return {
      weekWrapper,
      weekNumbers
    };
  }
  function changeMonth(value, isOffset = true) {
    const delta = isOffset ? value : value - self2.currentMonth;
    if (delta < 0 && self2._hidePrevMonthArrow === true || delta > 0 && self2._hideNextMonthArrow === true)
      return;
    self2.currentMonth += delta;
    if (self2.currentMonth < 0 || self2.currentMonth > 11) {
      self2.currentYear += self2.currentMonth > 11 ? 1 : -1;
      self2.currentMonth = (self2.currentMonth + 12) % 12;
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
    buildDays();
    triggerEvent("onMonthChange");
    updateNavigationCurrentMonth();
  }
  function clear(triggerChangeEvent = true, toInitial = true) {
    self2.input.value = "";
    if (self2.altInput !== void 0)
      self2.altInput.value = "";
    if (self2.mobileInput !== void 0)
      self2.mobileInput.value = "";
    self2.selectedDates = [];
    self2.latestSelectedDateObj = void 0;
    if (toInitial === true) {
      self2.currentYear = self2._initialDate.getFullYear();
      self2.currentMonth = self2._initialDate.getMonth();
    }
    if (self2.config.enableTime === true) {
      const { hours, minutes, seconds } = getDefaultHours(self2.config);
      setHours(hours, minutes, seconds);
    }
    self2.redraw();
    if (triggerChangeEvent)
      triggerEvent("onChange");
  }
  function close() {
    self2.isOpen = false;
    if (!self2.isMobile) {
      if (self2.calendarContainer !== void 0) {
        self2.calendarContainer.classList.remove("open");
      }
      if (self2._input !== void 0) {
        self2._input.classList.remove("active");
      }
    }
    triggerEvent("onClose");
  }
  function destroy2() {
    if (self2.config !== void 0)
      triggerEvent("onDestroy");
    for (let i = self2._handlers.length; i--; ) {
      self2._handlers[i].remove();
    }
    self2._handlers = [];
    if (self2.mobileInput) {
      if (self2.mobileInput.parentNode)
        self2.mobileInput.parentNode.removeChild(self2.mobileInput);
      self2.mobileInput = void 0;
    } else if (self2.calendarContainer && self2.calendarContainer.parentNode) {
      if (self2.config.static && self2.calendarContainer.parentNode) {
        const wrapper = self2.calendarContainer.parentNode;
        wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
        if (wrapper.parentNode) {
          while (wrapper.firstChild)
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
      } else
        self2.calendarContainer.parentNode.removeChild(self2.calendarContainer);
    }
    if (self2.altInput) {
      self2.input.type = "text";
      if (self2.altInput.parentNode)
        self2.altInput.parentNode.removeChild(self2.altInput);
      delete self2.altInput;
    }
    if (self2.input) {
      self2.input.type = self2.input._type;
      self2.input.classList.remove("flatpickr-input");
      self2.input.removeAttribute("readonly");
    }
    [
      "_showTimeInput",
      "latestSelectedDateObj",
      "_hideNextMonthArrow",
      "_hidePrevMonthArrow",
      "__hideNextMonthArrow",
      "__hidePrevMonthArrow",
      "isMobile",
      "isOpen",
      "selectedDateElem",
      "minDateHasTime",
      "maxDateHasTime",
      "days",
      "daysContainer",
      "_input",
      "_positionElement",
      "innerContainer",
      "rContainer",
      "monthNav",
      "todayDateElem",
      "calendarContainer",
      "weekdayContainer",
      "prevMonthNav",
      "nextMonthNav",
      "monthsDropdownContainer",
      "currentMonthElement",
      "currentYearElement",
      "navigationCurrentMonth",
      "selectedDateElem",
      "config"
    ].forEach((k) => {
      try {
        delete self2[k];
      } catch (_) {
      }
    });
  }
  function isCalendarElem(elem) {
    if (self2.config.appendTo && self2.config.appendTo.contains(elem))
      return true;
    return self2.calendarContainer.contains(elem);
  }
  function documentClick(e) {
    if (self2.isOpen && !self2.config.inline) {
      const eventTarget = getEventTarget(e);
      const isCalendarElement = isCalendarElem(eventTarget);
      const isInput = eventTarget === self2.input || eventTarget === self2.altInput || self2.element.contains(eventTarget) || e.path && e.path.indexOf && (~e.path.indexOf(self2.input) || ~e.path.indexOf(self2.altInput));
      const lostFocus = e.type === "blur" ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget) : !isInput && !isCalendarElement && !isCalendarElem(e.relatedTarget);
      const isIgnored = !self2.config.ignoredFocusElements.some((elem) => elem.contains(eventTarget));
      if (lostFocus && isIgnored) {
        if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0 && self2.input.value !== "" && self2.input.value !== void 0) {
          updateTime();
        }
        self2.close();
        if (self2.config && self2.config.mode === "range" && self2.selectedDates.length === 1) {
          self2.clear(false);
          self2.redraw();
        }
      }
    }
  }
  function changeYear(newYear) {
    if (!newYear || self2.config.minDate && newYear < self2.config.minDate.getFullYear() || self2.config.maxDate && newYear > self2.config.maxDate.getFullYear())
      return;
    const newYearNum = newYear, isNewYear = self2.currentYear !== newYearNum;
    self2.currentYear = newYearNum || self2.currentYear;
    if (self2.config.maxDate && self2.currentYear === self2.config.maxDate.getFullYear()) {
      self2.currentMonth = Math.min(self2.config.maxDate.getMonth(), self2.currentMonth);
    } else if (self2.config.minDate && self2.currentYear === self2.config.minDate.getFullYear()) {
      self2.currentMonth = Math.max(self2.config.minDate.getMonth(), self2.currentMonth);
    }
    if (isNewYear) {
      self2.redraw();
      triggerEvent("onYearChange");
      buildMonthSwitch();
    }
  }
  function isEnabled(date, timeless = true) {
    var _a;
    const dateToCheck = self2.parseDate(date, void 0, timeless);
    if (self2.config.minDate && dateToCheck && compareDates(dateToCheck, self2.config.minDate, timeless !== void 0 ? timeless : !self2.minDateHasTime) < 0 || self2.config.maxDate && dateToCheck && compareDates(dateToCheck, self2.config.maxDate, timeless !== void 0 ? timeless : !self2.maxDateHasTime) > 0)
      return false;
    if (!self2.config.enable && self2.config.disable.length === 0)
      return true;
    if (dateToCheck === void 0)
      return false;
    const bool = !!self2.config.enable, array = (_a = self2.config.enable) !== null && _a !== void 0 ? _a : self2.config.disable;
    for (let i = 0, d; i < array.length; i++) {
      d = array[i];
      if (typeof d === "function" && d(dateToCheck))
        return bool;
      else if (d instanceof Date && dateToCheck !== void 0 && d.getTime() === dateToCheck.getTime())
        return bool;
      else if (typeof d === "string") {
        const parsed = self2.parseDate(d, void 0, true);
        return parsed && parsed.getTime() === dateToCheck.getTime() ? bool : !bool;
      } else if (typeof d === "object" && dateToCheck !== void 0 && d.from && d.to && dateToCheck.getTime() >= d.from.getTime() && dateToCheck.getTime() <= d.to.getTime())
        return bool;
    }
    return !bool;
  }
  function isInView(elem) {
    if (self2.daysContainer !== void 0)
      return elem.className.indexOf("hidden") === -1 && elem.className.indexOf("flatpickr-disabled") === -1 && self2.daysContainer.contains(elem);
    return false;
  }
  function onBlur(e) {
    const isInput = e.target === self2._input;
    if (isInput && (self2.selectedDates.length > 0 || self2._input.value.length > 0) && !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
      self2.setDate(self2._input.value, true, e.target === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
    }
  }
  function onKeyDown(e) {
    const eventTarget = getEventTarget(e);
    const isInput = self2.config.wrap ? element.contains(eventTarget) : eventTarget === self2._input;
    const allowInput = self2.config.allowInput;
    const allowKeydown = self2.isOpen && (!allowInput || !isInput);
    const allowInlineKeydown = self2.config.inline && isInput && !allowInput;
    if (e.keyCode === 13 && isInput) {
      if (allowInput) {
        self2.setDate(self2._input.value, true, eventTarget === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
        return eventTarget.blur();
      } else {
        self2.open();
      }
    } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
      const isTimeObj = !!self2.timeContainer && self2.timeContainer.contains(eventTarget);
      switch (e.keyCode) {
        case 13:
          if (isTimeObj) {
            e.preventDefault();
            updateTime();
            focusAndClose();
          } else
            selectDate(e);
          break;
        case 27:
          e.preventDefault();
          focusAndClose();
          break;
        case 8:
        case 46:
          if (isInput && !self2.config.allowInput) {
            e.preventDefault();
            self2.clear();
          }
          break;
        case 37:
        case 39:
          if (!isTimeObj && !isInput) {
            e.preventDefault();
            if (self2.daysContainer !== void 0 && (allowInput === false || document.activeElement && isInView(document.activeElement))) {
              const delta2 = e.keyCode === 39 ? 1 : -1;
              if (!e.ctrlKey)
                focusOnDay(void 0, delta2);
              else {
                e.stopPropagation();
                changeMonth(delta2);
                focusOnDay(getFirstAvailableDay(1), 0);
              }
            }
          } else if (self2.hourElement)
            self2.hourElement.focus();
          break;
        case 38:
        case 40:
          e.preventDefault();
          const delta = e.keyCode === 40 ? 1 : -1;
          if (self2.daysContainer && eventTarget.$i !== void 0 || eventTarget === self2.input || eventTarget === self2.altInput) {
            if (e.ctrlKey) {
              e.stopPropagation();
              changeYear(self2.currentYear - delta);
              focusOnDay(getFirstAvailableDay(1), 0);
            } else if (!isTimeObj)
              focusOnDay(void 0, delta * 7);
          } else if (eventTarget === self2.currentYearElement) {
            changeYear(self2.currentYear - delta);
          } else if (self2.config.enableTime) {
            if (!isTimeObj && self2.hourElement)
              self2.hourElement.focus();
            updateTime(e);
            self2._debouncedChange();
          }
          break;
        case 9:
          if (isTimeObj) {
            const elems = [
              self2.hourElement,
              self2.minuteElement,
              self2.secondElement,
              self2.amPM
            ].concat(self2.pluginElements).filter((x) => x);
            const i = elems.indexOf(eventTarget);
            if (i !== -1) {
              const target = elems[i + (e.shiftKey ? -1 : 1)];
              e.preventDefault();
              (target || self2._input).focus();
            }
          } else if (!self2.config.noCalendar && self2.daysContainer && self2.daysContainer.contains(eventTarget) && e.shiftKey) {
            e.preventDefault();
            self2._input.focus();
          }
          break;
        default:
          break;
      }
    }
    if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
      switch (e.key) {
        case self2.l10n.amPM[0].charAt(0):
        case self2.l10n.amPM[0].charAt(0).toLowerCase():
          self2.amPM.textContent = self2.l10n.amPM[0];
          setHoursFromInputs();
          updateValue();
          break;
        case self2.l10n.amPM[1].charAt(0):
        case self2.l10n.amPM[1].charAt(0).toLowerCase():
          self2.amPM.textContent = self2.l10n.amPM[1];
          setHoursFromInputs();
          updateValue();
          break;
      }
    }
    if (isInput || isCalendarElem(eventTarget)) {
      triggerEvent("onKeyDown", e);
    }
  }
  function onMouseOver(elem) {
    if (self2.selectedDates.length !== 1 || elem && (!elem.classList.contains("flatpickr-day") || elem.classList.contains("flatpickr-disabled")))
      return;
    const hoverDate = elem ? elem.dateObj.getTime() : self2.days.firstElementChild.dateObj.getTime(), initialDate = self2.parseDate(self2.selectedDates[0], void 0, true).getTime(), rangeStartDate = Math.min(hoverDate, self2.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self2.selectedDates[0].getTime());
    let containsDisabled = false;
    let minRange = 0, maxRange = 0;
    for (let t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
      if (!isEnabled(new Date(t), true)) {
        containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
        if (t < initialDate && (!minRange || t > minRange))
          minRange = t;
        else if (t > initialDate && (!maxRange || t < maxRange))
          maxRange = t;
      }
    }
    for (let m = 0; m < self2.config.showMonths; m++) {
      const month = self2.daysContainer.children[m];
      for (let i = 0, l = month.children.length; i < l; i++) {
        const dayElem = month.children[i], date = dayElem.dateObj;
        const timestamp = date.getTime();
        const outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
        if (outOfRange) {
          dayElem.classList.add("notAllowed");
          ["inRange", "startRange", "endRange"].forEach((c) => {
            dayElem.classList.remove(c);
          });
          continue;
        } else if (containsDisabled && !outOfRange)
          continue;
        ["startRange", "inRange", "endRange", "notAllowed"].forEach((c) => {
          dayElem.classList.remove(c);
        });
        if (elem !== void 0) {
          elem.classList.add(hoverDate <= self2.selectedDates[0].getTime() ? "startRange" : "endRange");
          if (initialDate < hoverDate && timestamp === initialDate)
            dayElem.classList.add("startRange");
          else if (initialDate > hoverDate && timestamp === initialDate)
            dayElem.classList.add("endRange");
          if (timestamp >= minRange && (maxRange === 0 || timestamp <= maxRange) && isBetween(timestamp, initialDate, hoverDate))
            dayElem.classList.add("inRange");
        }
      }
    }
  }
  function onResize() {
    if (self2.isOpen && !self2.config.static && !self2.config.inline)
      positionCalendar();
  }
  function open(e, positionElement = self2._positionElement) {
    if (self2.isMobile === true) {
      if (e) {
        e.preventDefault();
        const eventTarget = getEventTarget(e);
        if (eventTarget) {
          eventTarget.blur();
        }
      }
      if (self2.mobileInput !== void 0) {
        self2.mobileInput.focus();
        self2.mobileInput.click();
      }
      triggerEvent("onOpen");
      return;
    } else if (self2._input.disabled || self2.config.inline) {
      return;
    }
    const wasOpen = self2.isOpen;
    self2.isOpen = true;
    if (!wasOpen) {
      self2.calendarContainer.classList.add("open");
      self2._input.classList.add("active");
      triggerEvent("onOpen");
      positionCalendar(positionElement);
    }
    if (self2.config.enableTime === true && self2.config.noCalendar === true) {
      if (self2.config.allowInput === false && (e === void 0 || !self2.timeContainer.contains(e.relatedTarget))) {
        setTimeout(() => self2.hourElement.select(), 50);
      }
    }
  }
  function minMaxDateSetter(type) {
    return (date) => {
      const dateObj = self2.config[`_${type}Date`] = self2.parseDate(date, self2.config.dateFormat);
      const inverseDateObj = self2.config[`_${type === "min" ? "max" : "min"}Date`];
      if (dateObj !== void 0) {
        self2[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
      }
      if (self2.selectedDates) {
        self2.selectedDates = self2.selectedDates.filter((d) => isEnabled(d));
        if (!self2.selectedDates.length && type === "min")
          setHoursFromDate(dateObj);
        updateValue();
      }
      if (self2.daysContainer) {
        redraw();
        if (dateObj !== void 0)
          self2.currentYearElement[type] = dateObj.getFullYear().toString();
        else
          self2.currentYearElement.removeAttribute(type);
        self2.currentYearElement.disabled = !!inverseDateObj && dateObj !== void 0 && inverseDateObj.getFullYear() === dateObj.getFullYear();
      }
    };
  }
  function parseConfig() {
    const boolOpts = [
      "wrap",
      "weekNumbers",
      "allowInput",
      "allowInvalidPreload",
      "clickOpens",
      "time_24hr",
      "enableTime",
      "noCalendar",
      "altInput",
      "shorthandCurrentMonth",
      "inline",
      "static",
      "enableSeconds",
      "disableMobile"
    ];
    const userConfig = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
    const formats2 = {};
    self2.config.parseDate = userConfig.parseDate;
    self2.config.formatDate = userConfig.formatDate;
    Object.defineProperty(self2.config, "enable", {
      get: () => self2.config._enable,
      set: (dates) => {
        self2.config._enable = parseDateRules(dates);
      }
    });
    Object.defineProperty(self2.config, "disable", {
      get: () => self2.config._disable,
      set: (dates) => {
        self2.config._disable = parseDateRules(dates);
      }
    });
    const timeMode = userConfig.mode === "time";
    if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
      const defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults2.dateFormat;
      formats2.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
    }
    if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
      const defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults2.altFormat;
      formats2.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
    }
    Object.defineProperty(self2.config, "minDate", {
      get: () => self2.config._minDate,
      set: minMaxDateSetter("min")
    });
    Object.defineProperty(self2.config, "maxDate", {
      get: () => self2.config._maxDate,
      set: minMaxDateSetter("max")
    });
    const minMaxTimeSetter = (type) => (val) => {
      self2.config[type === "min" ? "_minTime" : "_maxTime"] = self2.parseDate(val, "H:i:S");
    };
    Object.defineProperty(self2.config, "minTime", {
      get: () => self2.config._minTime,
      set: minMaxTimeSetter("min")
    });
    Object.defineProperty(self2.config, "maxTime", {
      get: () => self2.config._maxTime,
      set: minMaxTimeSetter("max")
    });
    if (userConfig.mode === "time") {
      self2.config.noCalendar = true;
      self2.config.enableTime = true;
    }
    Object.assign(self2.config, formats2, userConfig);
    for (let i = 0; i < boolOpts.length; i++)
      self2.config[boolOpts[i]] = self2.config[boolOpts[i]] === true || self2.config[boolOpts[i]] === "true";
    HOOKS.filter((hook) => self2.config[hook] !== void 0).forEach((hook) => {
      self2.config[hook] = arrayify(self2.config[hook] || []).map(bindToInstance);
    });
    self2.isMobile = !self2.config.disableMobile && !self2.config.inline && self2.config.mode === "single" && !self2.config.disable.length && !self2.config.enable && !self2.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    for (let i = 0; i < self2.config.plugins.length; i++) {
      const pluginConf = self2.config.plugins[i](self2) || {};
      for (const key in pluginConf) {
        if (HOOKS.indexOf(key) > -1) {
          self2.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self2.config[key]);
        } else if (typeof userConfig[key] === "undefined")
          self2.config[key] = pluginConf[key];
      }
    }
    if (!userConfig.altInputClass) {
      self2.config.altInputClass = getInputElem().className + " " + self2.config.altInputClass;
    }
    triggerEvent("onParseConfig");
  }
  function getInputElem() {
    return self2.config.wrap ? element.querySelector("[data-input]") : element;
  }
  function setupLocale() {
    if (typeof self2.config.locale !== "object" && typeof flatpickr.l10ns[self2.config.locale] === "undefined")
      self2.config.errorHandler(new Error(`flatpickr: invalid locale ${self2.config.locale}`));
    self2.l10n = Object.assign(Object.assign({}, flatpickr.l10ns.default), typeof self2.config.locale === "object" ? self2.config.locale : self2.config.locale !== "default" ? flatpickr.l10ns[self2.config.locale] : void 0);
    tokenRegex.K = `(${self2.l10n.amPM[0]}|${self2.l10n.amPM[1]}|${self2.l10n.amPM[0].toLowerCase()}|${self2.l10n.amPM[1].toLowerCase()})`;
    const userConfig = Object.assign(Object.assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
    if (userConfig.time_24hr === void 0 && flatpickr.defaultConfig.time_24hr === void 0) {
      self2.config.time_24hr = self2.l10n.time_24hr;
    }
    self2.formatDate = createDateFormatter(self2);
    self2.parseDate = createDateParser({ config: self2.config, l10n: self2.l10n });
  }
  function positionCalendar(customPositionElement) {
    if (typeof self2.config.position === "function") {
      return void self2.config.position(self2, customPositionElement);
    }
    if (self2.calendarContainer === void 0)
      return;
    triggerEvent("onPreCalendarPosition");
    const positionElement = customPositionElement || self2._positionElement;
    const calendarHeight = Array.prototype.reduce.call(self2.calendarContainer.children, (acc, child) => acc + child.offsetHeight, 0), calendarWidth = self2.calendarContainer.offsetWidth, configPos = self2.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
    const top2 = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
    toggleClass2(self2.calendarContainer, "arrowTop", !showOnTop);
    toggleClass2(self2.calendarContainer, "arrowBottom", showOnTop);
    if (self2.config.inline)
      return;
    let left2 = window.pageXOffset + inputBounds.left;
    let isCenter = false;
    let isRight = false;
    if (configPosHorizontal === "center") {
      left2 -= (calendarWidth - inputBounds.width) / 2;
      isCenter = true;
    } else if (configPosHorizontal === "right") {
      left2 -= calendarWidth - inputBounds.width;
      isRight = true;
    }
    toggleClass2(self2.calendarContainer, "arrowLeft", !isCenter && !isRight);
    toggleClass2(self2.calendarContainer, "arrowCenter", isCenter);
    toggleClass2(self2.calendarContainer, "arrowRight", isRight);
    const right2 = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
    const rightMost = left2 + calendarWidth > window.document.body.offsetWidth;
    const centerMost = right2 + calendarWidth > window.document.body.offsetWidth;
    toggleClass2(self2.calendarContainer, "rightMost", rightMost);
    if (self2.config.static)
      return;
    self2.calendarContainer.style.top = `${top2}px`;
    if (!rightMost) {
      self2.calendarContainer.style.left = `${left2}px`;
      self2.calendarContainer.style.right = "auto";
    } else if (!centerMost) {
      self2.calendarContainer.style.left = "auto";
      self2.calendarContainer.style.right = `${right2}px`;
    } else {
      const doc = getDocumentStyleSheet();
      if (doc === void 0)
        return;
      const bodyWidth = window.document.body.offsetWidth;
      const centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
      const centerBefore = ".flatpickr-calendar.centerMost:before";
      const centerAfter = ".flatpickr-calendar.centerMost:after";
      const centerIndex = doc.cssRules.length;
      const centerStyle = `{left:${inputBounds.left}px;right:auto;}`;
      toggleClass2(self2.calendarContainer, "rightMost", false);
      toggleClass2(self2.calendarContainer, "centerMost", true);
      doc.insertRule(`${centerBefore},${centerAfter}${centerStyle}`, centerIndex);
      self2.calendarContainer.style.left = `${centerLeft}px`;
      self2.calendarContainer.style.right = "auto";
    }
  }
  function getDocumentStyleSheet() {
    let editableSheet = null;
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        sheet.cssRules;
      } catch (err) {
        continue;
      }
      editableSheet = sheet;
      break;
    }
    return editableSheet != null ? editableSheet : createStyleSheet();
  }
  function createStyleSheet() {
    const style = document.createElement("style");
    document.head.appendChild(style);
    return style.sheet;
  }
  function redraw() {
    if (self2.config.noCalendar || self2.isMobile)
      return;
    buildMonthSwitch();
    updateNavigationCurrentMonth();
    buildDays();
  }
  function focusAndClose() {
    self2._input.focus();
    if (window.navigator.userAgent.indexOf("MSIE") !== -1 || navigator.msMaxTouchPoints !== void 0) {
      setTimeout(self2.close, 0);
    } else {
      self2.close();
    }
  }
  function selectDate(e) {
    e.preventDefault();
    e.stopPropagation();
    const isSelectable = (day) => day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
    const t = findParent(getEventTarget(e), isSelectable);
    if (t === void 0)
      return;
    const target = t;
    const selectedDate = self2.latestSelectedDateObj = new Date(target.dateObj.getTime());
    const shouldChangeMonth = (selectedDate.getMonth() < self2.currentMonth || selectedDate.getMonth() > self2.currentMonth + self2.config.showMonths - 1) && self2.config.mode !== "range";
    self2.selectedDateElem = target;
    if (self2.config.mode === "single")
      self2.selectedDates = [selectedDate];
    else if (self2.config.mode === "multiple") {
      const selectedIndex = isDateSelected(selectedDate);
      if (selectedIndex)
        self2.selectedDates.splice(parseInt(selectedIndex), 1);
      else
        self2.selectedDates.push(selectedDate);
    } else if (self2.config.mode === "range") {
      if (self2.selectedDates.length === 2) {
        self2.clear(false, false);
      }
      self2.latestSelectedDateObj = selectedDate;
      self2.selectedDates.push(selectedDate);
      if (compareDates(selectedDate, self2.selectedDates[0], true) !== 0)
        self2.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }
    setHoursFromInputs();
    if (shouldChangeMonth) {
      const isNewYear = self2.currentYear !== selectedDate.getFullYear();
      self2.currentYear = selectedDate.getFullYear();
      self2.currentMonth = selectedDate.getMonth();
      if (isNewYear) {
        triggerEvent("onYearChange");
        buildMonthSwitch();
      }
      triggerEvent("onMonthChange");
    }
    updateNavigationCurrentMonth();
    buildDays();
    updateValue();
    if (!shouldChangeMonth && self2.config.mode !== "range" && self2.config.showMonths === 1)
      focusOnDayElem(target);
    else if (self2.selectedDateElem !== void 0 && self2.hourElement === void 0) {
      self2.selectedDateElem && self2.selectedDateElem.focus();
    }
    if (self2.hourElement !== void 0)
      self2.hourElement !== void 0 && self2.hourElement.focus();
    if (self2.config.closeOnSelect) {
      const single = self2.config.mode === "single" && !self2.config.enableTime;
      const range = self2.config.mode === "range" && self2.selectedDates.length === 2 && !self2.config.enableTime;
      if (single || range) {
        focusAndClose();
      }
    }
    triggerChange();
  }
  const CALLBACKS = {
    locale: [setupLocale, updateWeekdays],
    showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
    minDate: [jumpToDate],
    maxDate: [jumpToDate],
    clickOpens: [
      () => {
        if (self2.config.clickOpens === true) {
          bind(self2._input, "focus", self2.open);
          bind(self2._input, "click", self2.open);
        } else {
          self2._input.removeEventListener("focus", self2.open);
          self2._input.removeEventListener("click", self2.open);
        }
      }
    ]
  };
  function set(option2, value) {
    if (option2 !== null && typeof option2 === "object") {
      Object.assign(self2.config, option2);
      for (const key in option2) {
        if (CALLBACKS[key] !== void 0)
          CALLBACKS[key].forEach((x) => x());
      }
    } else {
      self2.config[option2] = value;
      if (CALLBACKS[option2] !== void 0)
        CALLBACKS[option2].forEach((x) => x());
      else if (HOOKS.indexOf(option2) > -1)
        self2.config[option2] = arrayify(value);
    }
    self2.redraw();
    updateValue(true);
  }
  function setSelectedDate(inputDate, format2) {
    let dates = [];
    if (inputDate instanceof Array)
      dates = inputDate.map((d) => self2.parseDate(d, format2));
    else if (inputDate instanceof Date || typeof inputDate === "number")
      dates = [self2.parseDate(inputDate, format2)];
    else if (typeof inputDate === "string") {
      switch (self2.config.mode) {
        case "single":
        case "time":
          dates = [self2.parseDate(inputDate, format2)];
          break;
        case "multiple":
          dates = inputDate.split(self2.config.conjunction).map((date) => self2.parseDate(date, format2));
          break;
        case "range":
          dates = inputDate.split(self2.l10n.rangeSeparator).map((date) => self2.parseDate(date, format2));
          break;
        default:
          break;
      }
    } else
      self2.config.errorHandler(new Error(`Invalid date supplied: ${JSON.stringify(inputDate)}`));
    self2.selectedDates = self2.config.allowInvalidPreload ? dates : dates.filter((d) => d instanceof Date && isEnabled(d, false));
    if (self2.config.mode === "range")
      self2.selectedDates.sort((a, b) => a.getTime() - b.getTime());
  }
  function setDate(date, triggerChange2 = false, format2 = self2.config.dateFormat) {
    if (date !== 0 && !date || date instanceof Array && date.length === 0)
      return self2.clear(triggerChange2);
    setSelectedDate(date, format2);
    self2.latestSelectedDateObj = self2.selectedDates[self2.selectedDates.length - 1];
    self2.redraw();
    jumpToDate(void 0, triggerChange2);
    setHoursFromDate();
    if (self2.selectedDates.length === 0) {
      self2.clear(false);
    }
    updateValue(triggerChange2);
    if (triggerChange2)
      triggerEvent("onChange");
  }
  function parseDateRules(arr) {
    return arr.slice().map((rule) => {
      if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
        return self2.parseDate(rule, void 0, true);
      } else if (rule && typeof rule === "object" && rule.from && rule.to)
        return {
          from: self2.parseDate(rule.from, void 0),
          to: self2.parseDate(rule.to, void 0)
        };
      return rule;
    }).filter((x) => x);
  }
  function setupDates() {
    self2.selectedDates = [];
    self2.now = self2.parseDate(self2.config.now) || new Date();
    const preloadedDate = self2.config.defaultDate || ((self2.input.nodeName === "INPUT" || self2.input.nodeName === "TEXTAREA") && self2.input.placeholder && self2.input.value === self2.input.placeholder ? null : self2.input.value);
    if (preloadedDate)
      setSelectedDate(preloadedDate, self2.config.dateFormat);
    self2._initialDate = self2.selectedDates.length > 0 ? self2.selectedDates[0] : self2.config.minDate && self2.config.minDate.getTime() > self2.now.getTime() ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate.getTime() < self2.now.getTime() ? self2.config.maxDate : self2.now;
    self2.currentYear = self2._initialDate.getFullYear();
    self2.currentMonth = self2._initialDate.getMonth();
    if (self2.selectedDates.length > 0)
      self2.latestSelectedDateObj = self2.selectedDates[0];
    if (self2.config.minTime !== void 0)
      self2.config.minTime = self2.parseDate(self2.config.minTime, "H:i");
    if (self2.config.maxTime !== void 0)
      self2.config.maxTime = self2.parseDate(self2.config.maxTime, "H:i");
    self2.minDateHasTime = !!self2.config.minDate && (self2.config.minDate.getHours() > 0 || self2.config.minDate.getMinutes() > 0 || self2.config.minDate.getSeconds() > 0);
    self2.maxDateHasTime = !!self2.config.maxDate && (self2.config.maxDate.getHours() > 0 || self2.config.maxDate.getMinutes() > 0 || self2.config.maxDate.getSeconds() > 0);
  }
  function setupInputs() {
    self2.input = getInputElem();
    if (!self2.input) {
      self2.config.errorHandler(new Error("Invalid input element specified"));
      return;
    }
    self2.input._type = self2.input.type;
    self2.input.type = "text";
    self2.input.classList.add("flatpickr-input");
    self2._input = self2.input;
    if (self2.config.altInput) {
      self2.altInput = createElement(self2.input.nodeName, self2.config.altInputClass);
      self2._input = self2.altInput;
      self2.altInput.placeholder = self2.input.placeholder;
      self2.altInput.disabled = self2.input.disabled;
      self2.altInput.required = self2.input.required;
      self2.altInput.tabIndex = self2.input.tabIndex;
      self2.altInput.type = "text";
      self2.input.setAttribute("type", "hidden");
      if (!self2.config.static && self2.input.parentNode)
        self2.input.parentNode.insertBefore(self2.altInput, self2.input.nextSibling);
    }
    if (!self2.config.allowInput)
      self2._input.setAttribute("readonly", "readonly");
    self2._positionElement = self2.config.positionElement || self2._input;
  }
  function setupMobile() {
    const inputType = self2.config.enableTime ? self2.config.noCalendar ? "time" : "datetime-local" : "date";
    self2.mobileInput = createElement("input", self2.input.className + " flatpickr-mobile");
    self2.mobileInput.tabIndex = 1;
    self2.mobileInput.type = inputType;
    self2.mobileInput.disabled = self2.input.disabled;
    self2.mobileInput.required = self2.input.required;
    self2.mobileInput.placeholder = self2.input.placeholder;
    self2.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";
    if (self2.selectedDates.length > 0) {
      self2.mobileInput.defaultValue = self2.mobileInput.value = self2.formatDate(self2.selectedDates[0], self2.mobileFormatStr);
    }
    if (self2.config.minDate)
      self2.mobileInput.min = self2.formatDate(self2.config.minDate, "Y-m-d");
    if (self2.config.maxDate)
      self2.mobileInput.max = self2.formatDate(self2.config.maxDate, "Y-m-d");
    if (self2.input.getAttribute("step"))
      self2.mobileInput.step = String(self2.input.getAttribute("step"));
    self2.input.type = "hidden";
    if (self2.altInput !== void 0)
      self2.altInput.type = "hidden";
    try {
      if (self2.input.parentNode)
        self2.input.parentNode.insertBefore(self2.mobileInput, self2.input.nextSibling);
    } catch (_a) {
    }
    bind(self2.mobileInput, "change", (e) => {
      self2.setDate(getEventTarget(e).value, false, self2.mobileFormatStr);
      triggerEvent("onChange");
      triggerEvent("onClose");
    });
  }
  function toggle(e) {
    if (self2.isOpen === true)
      return self2.close();
    self2.open(e);
  }
  function triggerEvent(event, data) {
    if (self2.config === void 0)
      return;
    const hooks = self2.config[event];
    if (hooks !== void 0 && hooks.length > 0) {
      for (let i = 0; hooks[i] && i < hooks.length; i++)
        hooks[i](self2.selectedDates, self2.input.value, self2, data);
    }
    if (event === "onChange") {
      self2.input.dispatchEvent(createEvent("change"));
      self2.input.dispatchEvent(createEvent("input"));
    }
  }
  function createEvent(name) {
    const e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  }
  function isDateSelected(date) {
    for (let i = 0; i < self2.selectedDates.length; i++) {
      if (compareDates(self2.selectedDates[i], date) === 0)
        return "" + i;
    }
    return false;
  }
  function isDateInRange(date) {
    if (self2.config.mode !== "range" || self2.selectedDates.length < 2)
      return false;
    return compareDates(date, self2.selectedDates[0]) >= 0 && compareDates(date, self2.selectedDates[1]) <= 0;
  }
  function updateNavigationCurrentMonth() {
    if (self2.config.noCalendar || self2.isMobile || !self2.monthNav)
      return;
    self2.yearElements.forEach((yearElement, i) => {
      const d = new Date(self2.currentYear, self2.currentMonth, 1);
      d.setMonth(self2.currentMonth + i);
      if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
        self2.monthElements[i].textContent = monthToStr(d.getMonth(), self2.config.shorthandCurrentMonth, self2.l10n) + " ";
      } else {
        self2.monthsDropdownContainer.value = d.getMonth().toString();
      }
      yearElement.value = d.getFullYear().toString();
    });
    self2._hidePrevMonthArrow = self2.config.minDate !== void 0 && (self2.currentYear === self2.config.minDate.getFullYear() ? self2.currentMonth <= self2.config.minDate.getMonth() : self2.currentYear < self2.config.minDate.getFullYear());
    self2._hideNextMonthArrow = self2.config.maxDate !== void 0 && (self2.currentYear === self2.config.maxDate.getFullYear() ? self2.currentMonth + 1 > self2.config.maxDate.getMonth() : self2.currentYear > self2.config.maxDate.getFullYear());
  }
  function getDateStr(format2) {
    return self2.selectedDates.map((dObj) => self2.formatDate(dObj, format2)).filter((d, i, arr) => self2.config.mode !== "range" || self2.config.enableTime || arr.indexOf(d) === i).join(self2.config.mode !== "range" ? self2.config.conjunction : self2.l10n.rangeSeparator);
  }
  function updateValue(triggerChange2 = true) {
    if (self2.mobileInput !== void 0 && self2.mobileFormatStr) {
      self2.mobileInput.value = self2.latestSelectedDateObj !== void 0 ? self2.formatDate(self2.latestSelectedDateObj, self2.mobileFormatStr) : "";
    }
    self2.input.value = getDateStr(self2.config.dateFormat);
    if (self2.altInput !== void 0) {
      self2.altInput.value = getDateStr(self2.config.altFormat);
    }
    if (triggerChange2 !== false)
      triggerEvent("onValueUpdate");
  }
  function onMonthNavClick(e) {
    const eventTarget = getEventTarget(e);
    const isPrevMonth = self2.prevMonthNav.contains(eventTarget);
    const isNextMonth = self2.nextMonthNav.contains(eventTarget);
    if (isPrevMonth || isNextMonth) {
      changeMonth(isPrevMonth ? -1 : 1);
    } else if (self2.yearElements.indexOf(eventTarget) >= 0) {
      eventTarget.select();
    } else if (eventTarget.classList.contains("arrowUp")) {
      self2.changeYear(self2.currentYear + 1);
    } else if (eventTarget.classList.contains("arrowDown")) {
      self2.changeYear(self2.currentYear - 1);
    }
  }
  function timeWrapper(e) {
    e.preventDefault();
    const isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
    if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
      self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
    }
    const min2 = parseFloat(input.getAttribute("min")), max2 = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
    let newValue = curValue + step * delta;
    if (typeof input.value !== "undefined" && input.value.length === 2) {
      const isHourElem = input === self2.hourElement, isMinuteElem = input === self2.minuteElement;
      if (newValue < min2) {
        newValue = max2 + newValue + int(!isHourElem) + (int(isHourElem) && int(!self2.amPM));
        if (isMinuteElem)
          incrementNumInput(void 0, -1, self2.hourElement);
      } else if (newValue > max2) {
        newValue = input === self2.hourElement ? newValue - max2 - int(!self2.amPM) : min2;
        if (isMinuteElem)
          incrementNumInput(void 0, 1, self2.hourElement);
      }
      if (self2.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) {
        self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
      }
      input.value = pad(newValue);
    }
  }
  init();
  return self2;
}
function _flatpickr(nodeList, config) {
  const nodes = Array.prototype.slice.call(nodeList).filter((x) => x instanceof HTMLElement);
  const instances = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    try {
      if (node.getAttribute("data-fp-omit") !== null)
        continue;
      if (node._flatpickr !== void 0) {
        node._flatpickr.destroy();
        node._flatpickr = void 0;
      }
      node._flatpickr = FlatpickrInstance(node, config || {});
      instances.push(node._flatpickr);
    } catch (e) {
      console.error(e);
    }
  }
  return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" && typeof HTMLCollection !== "undefined" && typeof NodeList !== "undefined") {
  HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(config) {
    return _flatpickr(this, config);
  };
  HTMLElement.prototype.flatpickr = function(config) {
    return _flatpickr([this], config);
  };
}
var flatpickr = function(selector, config) {
  if (typeof selector === "string") {
    return _flatpickr(window.document.querySelectorAll(selector), config);
  } else if (selector instanceof Node) {
    return _flatpickr([selector], config);
  } else {
    return _flatpickr(selector, config);
  }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
  en: Object.assign({}, default_default),
  default: Object.assign({}, default_default)
};
flatpickr.localize = (l10n) => {
  flatpickr.l10ns.default = Object.assign(Object.assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = (config) => {
  flatpickr.defaultConfig = Object.assign(Object.assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = createDateParser({});
flatpickr.formatDate = createDateFormatter({});
flatpickr.compareDates = compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
  jQuery.fn.flatpickr = function(config) {
    return _flatpickr(this, config);
  };
}
Date.prototype.fp_incr = function(days) {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
  window.flatpickr = flatpickr;
}
var esm_default = flatpickr;

// node_modules/flatpickr/dist/esm/l10n/nl.js
var fp = typeof window !== "undefined" && window.flatpickr !== void 0 ? window.flatpickr : {
  l10ns: {}
};
var Dutch = {
  weekdays: {
    shorthand: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    longhand: [
      "zondag",
      "maandag",
      "dinsdag",
      "woensdag",
      "donderdag",
      "vrijdag",
      "zaterdag"
    ]
  },
  months: {
    shorthand: [
      "jan",
      "feb",
      "mrt",
      "apr",
      "mei",
      "jun",
      "jul",
      "aug",
      "sept",
      "okt",
      "nov",
      "dec"
    ],
    longhand: [
      "januari",
      "februari",
      "maart",
      "april",
      "mei",
      "juni",
      "juli",
      "augustus",
      "september",
      "oktober",
      "november",
      "december"
    ]
  },
  firstDayOfWeek: 1,
  weekAbbreviation: "wk",
  rangeSeparator: " t/m ",
  scrollTitle: "Scroll voor volgende / vorige",
  toggleTitle: "Klik om te wisselen",
  time_24hr: true,
  ordinal: (nth) => {
    if (nth === 1 || nth === 8 || nth >= 20)
      return "ste";
    return "de";
  }
};
fp.l10ns.nl = Dutch;
var nl_default = fp.l10ns;

// app/assets/javascripts/formstrap/config/i18n.js
var i18n_default = class {
  static get locale() {
    if (window.I18n === void 0) {
      const locale = document.querySelector("html").getAttribute("lang");
      window.I18n = {
        locale: locale || "en"
      };
    }
    return window.I18n.locale;
  }
};

// app/assets/javascripts/formstrap/controllers/flatpickr_controller.js
var flatpickr_controller_default = class extends Controller {
  connect() {
    const options = { ...this.defaultOptions(), ...this.options() };
    esm_default(this.element, options);
  }
  options() {
    return JSON.parse(this.element.getAttribute("data-flatpickr"));
  }
  defaultOptions() {
    return {
      allowInput: true,
      dateFormat: "d/m/Y",
      locale: this.getLocale(i18n_default.locale)
    };
  }
  getLocale(locale) {
    const locales = this.locales();
    return locales[locale];
  }
  locales() {
    return {
      en: null,
      nl: Dutch
    };
  }
};

// app/assets/javascripts/formstrap/controllers/hello_controller.js
var hello_controller_default = class extends Controller {
  connect() {
    this.element.textContent = "Hello world";
  }
};

// app/assets/javascripts/formstrap/controllers/infinite_scroller_controller.js
var infinite_scroller_controller_default = class extends Controller {
  connect() {
    this.clickWhenInViewport();
    document.querySelector(".modal-body").addEventListener("scroll", () => {
      this.clickWhenInViewport();
    });
  }
  clickWhenInViewport() {
    if (!this.isLoading() && this.isInViewport()) {
      this.element.setAttribute("clicked", 1);
      this.element.click();
    }
  }
  isLoading() {
    return this.element.hasAttribute("clicked");
  }
  isInViewport() {
    const rect = this.element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
};

// app/assets/javascripts/formstrap/controllers/media_controller.js
var media_controller_default = class extends Controller {
  static get targets() {
    return ["item", "template", "thumbnails", "modalButton", "placeholder", "count", "editButton", "validationInput"];
  }
  connect() {
    document.addEventListener("mediaSelectionSubmitted", (event) => {
      if (event.detail.name === this.element.dataset.name) {
        this.selectItems(event.detail.items);
      }
    });
    if (this.hasSorting()) {
      this.initSortable();
    }
    this.validate();
  }
  destroy(event) {
    const item = event.currentTarget.closest("[data-media-target='item']");
    this.destroyItem(item);
  }
  syncIds() {
    const ids = this.activeIds();
    this.modalButtonTargets.forEach((button) => {
      const url = new URL(button.getAttribute("href"));
      url.searchParams.delete("ids[]");
      ids.forEach((id) => {
        url.searchParams.append("ids[]", id);
      });
      button.setAttribute("href", url.toString());
    });
  }
  initSortable() {
    sortable_esm_default.create(this.thumbnailsTarget, {
      handle: ".media-drag-sort-handle",
      onEnd: (event) => {
        this.resetPositions();
      }
    });
  }
  hasSorting() {
    return this.element.dataset.sort === "true";
  }
  destroyItem(item) {
    this.removeItem(item);
    this.postProcess();
  }
  selectItems(items) {
    this.removeAllDeselectedItems(items);
    this.addNewItems(items);
    this.postProcess();
  }
  postProcess() {
    this.resetPositions();
    this.syncIds();
    this.togglePlaceholder();
    this.validate();
  }
  validate() {
    this.clearValidation();
    this.validateMinimum();
    this.validateMaximum();
  }
  clearValidation() {
    this.validationInputTarget.setCustomValidity("");
  }
  validateMinimum() {
    const count = this.activeItems().length;
    if (count < this.minActiveItems()) {
      this.validationInputTarget.setCustomValidity(this.validationInputTarget.dataset.minMessage);
    }
  }
  validateMaximum() {
    const count = this.activeItems().length;
    if (count > this.maxActiveItems()) {
      this.validationInputTarget.setCustomValidity(this.validationInputTarget.dataset.maxMessage);
    }
  }
  minActiveItems() {
    return parseInt(this.element.dataset.min, 10) || 0;
  }
  maxActiveItems() {
    return parseInt(this.element.dataset.max, 10) || Infinity;
  }
  resetPositions() {
    this.activeItems().forEach((item, index2) => {
      const positionInput = item.querySelector("input[name*='position']");
      if (positionInput) {
        positionInput.value = index2;
      }
    });
  }
  addNewItems(items) {
    const itemTargetIds = this.itemTargets.map((i) => {
      return parseInt(i.querySelectorAll("input")[1].value);
    });
    items.forEach((item) => {
      if (itemTargetIds.includes(item.blobId)) {
        return;
      }
      this.addItem(item);
    });
  }
  addItem(item) {
    const currentItem = this.itemByBlobId(item.blobId);
    if (currentItem) {
      this.enableItem(currentItem);
    } else {
      this.createItem(item);
    }
  }
  togglePlaceholder() {
    if (this.activeItems().length > 0) {
      this.hidePlaceholder();
    } else {
      this.showPlaceholder();
    }
  }
  showPlaceholder() {
    this.placeholderTarget.classList.remove("d-none");
  }
  hidePlaceholder() {
    this.placeholderTarget.classList.add("d-none");
  }
  enableItem(item) {
    item.querySelector("input[name*='_destroy']").value = false;
    item.classList.remove("d-none");
  }
  createItem(item) {
    const template = this.templateTarget;
    const html = this.randomizeIds(template);
    this.thumbnailsTarget.insertAdjacentHTML("beforeend", html);
    const newItem = this.itemTargets.pop();
    newItem.querySelector('input[name*="[blob_id]"]').value = item.blobId;
    newItem.querySelector('input[name*="[_destroy]"]').value = false;
    const editButton = newItem.querySelector('[data-media-target="editButton"]');
    editButton.setAttribute("href", editButton.getAttribute("href").replace("$1", item.blobId));
    const oldThumbnail = newItem.querySelector(".h-thumbnail");
    const newThumbnail = item.thumbnail.cloneNode(true);
    oldThumbnail.parentNode.replaceChild(newThumbnail, oldThumbnail);
  }
  randomizeIds(template) {
    const regex = new RegExp(template.dataset.templateIdRegex, "g");
    const randomNumber = Math.floor(1e8 + Math.random() * 9e8);
    return template.innerHTML.replace(regex, randomNumber);
  }
  removeAllDeselectedItems(items) {
    this.removeDeselectedItems(items, this.itemTargets);
  }
  removeDeselectedItems(elements, items) {
    const returnedBlobIds = elements.map((e) => {
      return e.blobId;
    });
    items.forEach((item) => {
      const blobId = parseInt(item.querySelectorAll("input")[1].value);
      if (returnedBlobIds.includes(blobId)) {
        return;
      }
      this.removeItem(item);
    });
  }
  removeItem(item) {
    item.querySelector("input[name*='_destroy']").value = 1;
    item.classList.add("d-none");
    this.resetPositions();
    this.syncIds();
    this.togglePlaceholder();
  }
  itemByBlobId(blobId) {
    return this.itemTargets.find((item) => {
      return item.querySelector("input[name*='blob_id']").value === blobId;
    });
  }
  activeItems() {
    return this.itemTargets.filter((item) => {
      return item.querySelector("input[name$='[_destroy]']").value === "false";
    });
  }
  activeIds() {
    return this.activeItems().map((item) => {
      return item.querySelector("input[name$='[blob_id]']").value;
    });
  }
};

// app/assets/javascripts/formstrap/controllers/media_modal_controller.js
var media_modal_controller_default = class extends Controller {
  static get targets() {
    return ["idCheckbox", "item", "form", "selectButton", "placeholder", "count"];
  }
  static get values() {
    return { ids: Array };
  }
  connect() {
    this.validate();
    this.updateCount();
  }
  select() {
    this.dispatchSelectionEvent();
  }
  submitForm() {
    this.hidePlaceholder();
    this.triggerFormSubmission();
  }
  inputChange(event) {
    this.handleIdsUpdate(event.target);
    this.updateCount();
  }
  hidePlaceholder() {
    this.placeholderTarget.classList.add("d-none");
  }
  handleIdsUpdate(element) {
    if (element.checked) {
      const arr = this.idsValue;
      arr.push(element.value);
      this.idsValue = arr;
    } else {
      this.idsValue = this.idsValue.filter((value) => {
        return element.value !== value;
      });
    }
  }
  itemTargetConnected(element) {
    this.updateItem(element.querySelector("input"));
  }
  updateItem(element) {
    const arr = this.idsValue;
    if (arr.includes(element.value)) {
      element.checked = true;
    } else {
      element.checked = false;
    }
  }
  idsValueChanged() {
    for (const item of this.itemTargets) {
      this.updateItem(item.querySelector("input"));
    }
    this.validate();
  }
  dispatchSelectionEvent() {
    document.dispatchEvent(new CustomEvent("mediaSelectionSubmitted", {
      detail: {
        name: this.element.dataset.name,
        items: this.renderItemsForEvent()
      }
    }));
  }
  triggerFormSubmission() {
    this.formTarget.requestSubmit();
  }
  renderItemsForEvent() {
    return this.idsValue.map((item) => this.renderItemForEvent(item)).filter((i) => {
      return i !== void 0;
    });
  }
  renderItemForEvent(item) {
    const id = parseInt(item);
    const blobId = `#blob_${id}`;
    const element = this.element.querySelector(blobId);
    return {
      blobId: id,
      thumbnail: element ? element.querySelector(".h-thumbnail") : ""
    };
  }
  selectedItems() {
    return this.itemTargets.filter((item) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      return checkbox.checked;
    });
  }
  selectedItemsCount() {
    return this.idsValue.length;
  }
  minSelectedItems() {
    return parseInt(this.element.dataset.min, 10) || 0;
  }
  maxSelectedItems() {
    return parseInt(this.element.dataset.max, 10) || Infinity;
  }
  validate() {
    if (this.isValid()) {
      this.enableSelectButton();
    } else {
      this.disableSelectButton();
    }
  }
  enableSelectButton() {
    this.selectButtonTarget.removeAttribute("disabled");
  }
  disableSelectButton() {
    this.selectButtonTarget.setAttribute("disabled", "");
  }
  isValid() {
    const count = this.selectedItemsCount();
    return count >= this.minSelectedItems() && count <= this.maxSelectedItems();
  }
  updateCount() {
    this.countTarget.innerHTML = this.selectedItemsCount();
  }
};

// node_modules/@popperjs/core/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  afterMain: () => afterMain,
  afterRead: () => afterRead,
  afterWrite: () => afterWrite,
  applyStyles: () => applyStyles_default,
  arrow: () => arrow_default,
  auto: () => auto,
  basePlacements: () => basePlacements,
  beforeMain: () => beforeMain,
  beforeRead: () => beforeRead,
  beforeWrite: () => beforeWrite,
  bottom: () => bottom,
  clippingParents: () => clippingParents,
  computeStyles: () => computeStyles_default,
  createPopper: () => createPopper3,
  createPopperBase: () => createPopper,
  createPopperLite: () => createPopper2,
  detectOverflow: () => detectOverflow,
  end: () => end,
  eventListeners: () => eventListeners_default,
  flip: () => flip_default,
  hide: () => hide_default,
  left: () => left,
  main: () => main,
  modifierPhases: () => modifierPhases,
  offset: () => offset_default,
  placements: () => placements,
  popper: () => popper,
  popperGenerator: () => popperGenerator,
  popperOffsets: () => popperOffsets_default,
  preventOverflow: () => preventOverflow_default,
  read: () => read,
  reference: () => reference,
  right: () => right,
  start: () => start,
  top: () => top,
  variationPlacements: () => variationPlacements,
  viewport: () => viewport,
  write: () => write
});

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle2(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css2 = getComputedStyle2(currentNode);
    if (css2.transform !== "none" || css2.perspective !== "none" || css2.contain === "paint" || ["transform", "perspective"].indexOf(css2.willChange) !== -1 || isFirefox && css2.willChange === "filter" || isFirefox && css2.filter && css2.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect2(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (true) {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "));
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    if (true) {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
    }
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  if (true) {
    var transitionProperty = getComputedStyle2(state.elements.popper).transitionProperty || "";
    if (adaptive && ["transform", "top", "right", "bottom", "left"].some(function(property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
    }
  }
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle2(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
    if (true) {
      console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" "));
    }
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort2(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort2(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort2(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce2(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/format.js
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return [].concat(args).reduce(function(p, c) {
    return p.replace(/%s/, c);
  }, str);
}

// node_modules/@popperjs/core/lib/utils/validateModifiers.js
var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function validateModifiers(modifiers) {
  modifiers.forEach(function(modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES).filter(function(value, index2, self2) {
      return self2.indexOf(value) === index2;
    }).forEach(function(key) {
      switch (key) {
        case "name":
          if (typeof modifier.name !== "string") {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'));
          }
          break;
        case "enabled":
          if (typeof modifier.enabled !== "boolean") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'));
          }
          break;
        case "phase":
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(modifier.phase) + '"'));
          }
          break;
        case "fn":
          if (typeof modifier.fn !== "function") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'));
          }
          break;
        case "effect":
          if (modifier.effect != null && typeof modifier.effect !== "function") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'));
          }
          break;
        case "requires":
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'));
          }
          break;
        case "requiresIfExists":
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'));
          }
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(s) {
            return '"' + s + '"';
          }).join(", ") + '; but "' + key + '" was provided.');
      }
      modifier.requires && modifier.requires.forEach(function(requirement) {
        if (modifiers.find(function(mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

// node_modules/@popperjs/core/lib/utils/uniqueBy.js
function uniqueBy(arr, fn2) {
  var identifiers = /* @__PURE__ */ new Set();
  return arr.filter(function(item) {
    var identifier = fn2(item);
    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers3 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper4(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers3, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        if (true) {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function(_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);
          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function(_ref2) {
              var name = _ref2.name;
              return name === "flip";
            });
            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
            }
          }
          var _getComputedStyle = getComputedStyle2(popper2), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
          if ([marginTop, marginRight, marginBottom, marginLeft].some(function(margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
          }
        }
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          if (true) {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (true) {
            __debug_loops__ += 1;
            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce2(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy2() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      if (true) {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect4 = _ref3.effect;
        if (typeof effect4 === "function") {
          var cleanupFn = effect4({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var createPopper = /* @__PURE__ */ popperGenerator();

// node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper2 = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers2 = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper3 = /* @__PURE__ */ popperGenerator({
  defaultModifiers: defaultModifiers2
});

// node_modules/bootstrap/dist/js/bootstrap.esm.js
var MAX_UID = 1e6;
var MILLISECONDS_MULTIPLIER = 1e3;
var TRANSITION_END = "transitionend";
var toType = (obj) => {
  if (obj === null || obj === void 0) {
    return `${obj}`;
  }
  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
};
var getUID = (prefix) => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
var getSelector = (element) => {
  let selector = element.getAttribute("data-bs-target");
  if (!selector || selector === "#") {
    let hrefAttr = element.getAttribute("href");
    if (!hrefAttr || !hrefAttr.includes("#") && !hrefAttr.startsWith(".")) {
      return null;
    }
    if (hrefAttr.includes("#") && !hrefAttr.startsWith("#")) {
      hrefAttr = `#${hrefAttr.split("#")[1]}`;
    }
    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
  }
  return selector;
};
var getSelectorFromElement = (element) => {
  const selector = getSelector(element);
  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }
  return null;
};
var getElementFromSelector = (element) => {
  const selector = getSelector(element);
  return selector ? document.querySelector(selector) : null;
};
var getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0;
  }
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }
  transitionDuration = transitionDuration.split(",")[0];
  transitionDelay = transitionDelay.split(",")[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
var triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
var isElement2 = (obj) => {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (typeof obj.jquery !== "undefined") {
    obj = obj[0];
  }
  return typeof obj.nodeType !== "undefined";
};
var getElement = (obj) => {
  if (isElement2(obj)) {
    return obj.jquery ? obj[0] : obj;
  }
  if (typeof obj === "string" && obj.length > 0) {
    return document.querySelector(obj);
  }
  return null;
};
var typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement2(value) ? "element" : toType(value);
    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
    }
  });
};
var isVisible = (element) => {
  if (!isElement2(element) || element.getClientRects().length === 0) {
    return false;
  }
  return getComputedStyle(element).getPropertyValue("visibility") === "visible";
};
var isDisabled = (element) => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains("disabled")) {
    return true;
  }
  if (typeof element.disabled !== "undefined") {
    return element.disabled;
  }
  return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
};
var findShadowRoot = (element) => {
  if (!document.documentElement.attachShadow) {
    return null;
  }
  if (typeof element.getRootNode === "function") {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
var noop = () => {
};
var reflow = (element) => {
  element.offsetHeight;
};
var getjQuery = () => {
  const {
    jQuery: jQuery2
  } = window;
  if (jQuery2 && !document.body.hasAttribute("data-bs-no-jquery")) {
    return jQuery2;
  }
  return null;
};
var DOMContentLoadedCallbacks = [];
var onDOMContentLoaded = (callback) => {
  if (document.readyState === "loading") {
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener("DOMContentLoaded", () => {
        DOMContentLoadedCallbacks.forEach((callback2) => callback2());
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
var isRTL = () => document.documentElement.dir === "rtl";
var defineJQueryPlugin = (plugin) => {
  onDOMContentLoaded(() => {
    const $2 = getjQuery();
    if ($2) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $2.fn[name];
      $2.fn[name] = plugin.jQueryInterface;
      $2.fn[name].Constructor = plugin;
      $2.fn[name].noConflict = () => {
        $2.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
var execute = (callback) => {
  if (typeof callback === "function") {
    callback();
  }
};
var executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
var getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  let index2 = list.indexOf(activeElement);
  if (index2 === -1) {
    return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
  }
  const listLength = list.length;
  index2 += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index2 = (index2 + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index2, listLength - 1))];
};
var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {};
var uidEvent = 1;
var customEvents = {
  mouseenter: "mouseover",
  mouseleave: "mouseout"
};
var customEventsRegex = /^(mouseenter|mouseleave)/i;
var nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
function getUidEvent(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getEvent(element) {
  const uid = getUidEvent(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn2) {
  return function handler(event) {
    event.delegateTarget = element;
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn2);
    }
    return fn2.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn2) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (let i = domElements.length; i--; ) {
        if (domElements[i] === target) {
          event.delegateTarget = target;
          if (handler.oneOff) {
            EventHandler.off(element, event.type, selector, fn2);
          }
          return fn2.apply(target, [event]);
        }
      }
    }
    return null;
  };
}
function findHandler(events, handler, delegationSelector = null) {
  const uidEventList = Object.keys(events);
  for (let i = 0, len = uidEventList.length; i < len; i++) {
    const event = events[uidEventList[i]];
    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
      return event;
    }
  }
  return null;
}
function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === "string";
  const originalHandler = delegation ? delegationFn : handler;
  let typeEvent = getTypeEvent(originalTypeEvent);
  const isNative = nativeEvents.has(typeEvent);
  if (!isNative) {
    typeEvent = originalTypeEvent;
  }
  return [delegation, originalHandler, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== "string" || !element) {
    return;
  }
  if (!handler) {
    handler = delegationFn;
    delegationFn = null;
  }
  if (customEventsRegex.test(originalTypeEvent)) {
    const wrapFn = (fn3) => {
      return function(event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn3.call(this, event);
        }
      };
    };
    if (delegationFn) {
      delegationFn = wrapFn(delegationFn);
    } else {
      handler = wrapFn(handler);
    }
  }
  const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);
  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff;
    return;
  }
  const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ""));
  const fn2 = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
  fn2.delegationSelector = delegation ? handler : null;
  fn2.originalHandler = originalHandler;
  fn2.oneOff = oneOff;
  fn2.uidEvent = uid;
  handlers[uid] = fn2;
  element.addEventListener(typeEvent, fn2, delegation);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn2 = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn2) {
    return;
  }
  element.removeEventListener(typeEvent, fn2, Boolean(delegationSelector));
  delete events[typeEvent][fn2.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach((handlerKey) => {
    if (handlerKey.includes(namespace)) {
      const event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  });
}
function getTypeEvent(event) {
  event = event.replace(stripNameRegex, "");
  return customEvents[event] || event;
}
var EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false);
  },
  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true);
  },
  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }
    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.startsWith(".");
    if (typeof originalHandler !== "undefined") {
      if (!events || !events[typeEvent]) {
        return;
      }
      removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
      return;
    }
    if (isNamespace) {
      Object.keys(events).forEach((elementEvent) => {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      });
    }
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach((keyHandlers) => {
      const handlerKey = keyHandlers.replace(stripUidRegex, "");
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        const event = storeElementEvent[keyHandlers];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  },
  trigger(element, event, args) {
    if (typeof event !== "string" || !element) {
      return null;
    }
    const $2 = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    const isNative = nativeEvents.has(typeEvent);
    let jQueryEvent;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;
    if (inNamespace && $2) {
      jQueryEvent = $2.Event(event, args);
      $2(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    if (isNative) {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(typeEvent, bubbles, true);
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true
      });
    }
    if (typeof args !== "undefined") {
      Object.keys(args).forEach((key) => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          }
        });
      });
    }
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && typeof jQueryEvent !== "undefined") {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
var elementMap = /* @__PURE__ */ new Map();
var Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, /* @__PURE__ */ new Map());
    }
    const instanceMap = elementMap.get(element);
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};
var VERSION = "5.1.3";
var BaseComponent = class {
  constructor(element) {
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      this[propertyName] = null;
    });
  }
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
};
var enableDismissTrigger = (component, method = "hide") => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);
    instance[method]();
  });
};
var NAME$d = "alert";
var DATA_KEY$c = "bs.alert";
var EVENT_KEY$c = `.${DATA_KEY$c}`;
var EVENT_CLOSE = `close${EVENT_KEY$c}`;
var EVENT_CLOSED = `closed${EVENT_KEY$c}`;
var CLASS_NAME_FADE$5 = "fade";
var CLASS_NAME_SHOW$8 = "show";
var Alert = class extends BaseComponent {
  static get NAME() {
    return NAME$d;
  }
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Alert.getOrCreateInstance(this);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
};
enableDismissTrigger(Alert, "close");
defineJQueryPlugin(Alert);
var NAME$c = "button";
var DATA_KEY$b = "bs.button";
var EVENT_KEY$b = `.${DATA_KEY$b}`;
var DATA_API_KEY$7 = ".data-api";
var CLASS_NAME_ACTIVE$3 = "active";
var SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
var EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
var Button = class extends BaseComponent {
  static get NAME() {
    return NAME$c;
  }
  toggle() {
    this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Button.getOrCreateInstance(this);
      if (config === "toggle") {
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event) => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});
defineJQueryPlugin(Button);
function normalizeData(val) {
  if (val === "true") {
    return true;
  }
  if (val === "false") {
    return false;
  }
  if (val === Number(val).toString()) {
    return Number(val);
  }
  if (val === "" || val === "null") {
    return null;
  }
  return val;
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}
var Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    Object.keys(element.dataset).filter((key) => key.startsWith("bs")).forEach((key) => {
      let pureKey = key.replace(/^bs/, "");
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    });
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  },
  offset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },
  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  }
};
var NODE_TEXT = 3;
var SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter((child) => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode;
    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      if (ancestor.matches(selector)) {
        parents.push(ancestor);
      }
      ancestor = ancestor.parentNode;
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(", ");
    return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
  }
};
var NAME$b = "carousel";
var DATA_KEY$a = "bs.carousel";
var EVENT_KEY$a = `.${DATA_KEY$a}`;
var DATA_API_KEY$6 = ".data-api";
var ARROW_LEFT_KEY = "ArrowLeft";
var ARROW_RIGHT_KEY = "ArrowRight";
var TOUCHEVENT_COMPAT_WAIT = 500;
var SWIPE_THRESHOLD = 40;
var Default$a = {
  interval: 5e3,
  keyboard: true,
  slide: false,
  pause: "hover",
  wrap: true,
  touch: true
};
var DefaultType$a = {
  interval: "(number|boolean)",
  keyboard: "boolean",
  slide: "(boolean|string)",
  pause: "(string|boolean)",
  wrap: "boolean",
  touch: "boolean"
};
var ORDER_NEXT = "next";
var ORDER_PREV = "prev";
var DIRECTION_LEFT = "left";
var DIRECTION_RIGHT = "right";
var KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT
};
var EVENT_SLIDE = `slide${EVENT_KEY$a}`;
var EVENT_SLID = `slid${EVENT_KEY$a}`;
var EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
var EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
var EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
var EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
var EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
var EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
var EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
var EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
var EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
var EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
var EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
var CLASS_NAME_CAROUSEL = "carousel";
var CLASS_NAME_ACTIVE$2 = "active";
var CLASS_NAME_SLIDE = "slide";
var CLASS_NAME_END = "carousel-item-end";
var CLASS_NAME_START = "carousel-item-start";
var CLASS_NAME_NEXT = "carousel-item-next";
var CLASS_NAME_PREV = "carousel-item-prev";
var CLASS_NAME_POINTER_EVENT = "pointer-event";
var SELECTOR_ACTIVE$1 = ".active";
var SELECTOR_ACTIVE_ITEM = ".active.carousel-item";
var SELECTOR_ITEM = ".carousel-item";
var SELECTOR_ITEM_IMG = ".carousel-item img";
var SELECTOR_NEXT_PREV = ".carousel-item-next, .carousel-item-prev";
var SELECTOR_INDICATORS = ".carousel-indicators";
var SELECTOR_INDICATOR = "[data-bs-target]";
var SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
var SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
var POINTER_TYPE_TOUCH = "touch";
var POINTER_TYPE_PEN = "pen";
var Carousel = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isPaused = false;
    this._isSliding = false;
    this.touchTimeout = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;
    this._config = this._getConfig(config);
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
    this._pointerEvent = Boolean(window.PointerEvent);
    this._addEventListeners();
  }
  static get Default() {
    return Default$a;
  }
  static get NAME() {
    return NAME$b;
  }
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause(event) {
    if (!event) {
      this._isPaused = true;
    }
    if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element);
      this.cycle(true);
    }
    clearInterval(this._interval);
    this._interval = null;
  }
  cycle(event) {
    if (!event) {
      this._isPaused = false;
    }
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._config && this._config.interval && !this._isPaused) {
      this._updateInterval();
      this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
    }
  }
  to(index2) {
    this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    const activeIndex = this._getItemIndex(this._activeElement);
    if (index2 > this._items.length - 1 || index2 < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index2));
      return;
    }
    if (activeIndex === index2) {
      this.pause();
      this.cycle();
      return;
    }
    const order2 = index2 > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order2, this._items[index2]);
  }
  _getConfig(config) {
    config = {
      ...Default$a,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === "object" ? config : {}
    };
    typeCheckConfig(NAME$b, config, DefaultType$a);
    return config;
  }
  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX);
    if (absDeltax <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltax / this.touchDeltaX;
    this.touchDeltaX = 0;
    if (!direction) {
      return;
    }
    this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, (event) => this._keydown(event));
    }
    if (this._config.pause === "hover") {
      EventHandler.on(this._element, EVENT_MOUSEENTER, (event) => this.pause(event));
      EventHandler.on(this._element, EVENT_MOUSELEAVE, (event) => this.cycle(event));
    }
    if (this._config.touch && this._touchSupported) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    const hasPointerPenTouch = (event) => {
      return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
    };
    const start2 = (event) => {
      if (hasPointerPenTouch(event)) {
        this.touchStartX = event.clientX;
      } else if (!this._pointerEvent) {
        this.touchStartX = event.touches[0].clientX;
      }
    };
    const move = (event) => {
      this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
    };
    const end2 = (event) => {
      if (hasPointerPenTouch(event)) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }
      this._handleSwipe();
      if (this._config.pause === "hover") {
        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }
        this.touchTimeout = setTimeout((event2) => this.cycle(event2), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
      }
    };
    SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach((itemImg) => {
      EventHandler.on(itemImg, EVENT_DRAG_START, (event) => event.preventDefault());
    });
    if (this._pointerEvent) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, (event) => start2(event));
      EventHandler.on(this._element, EVENT_POINTERUP, (event) => end2(event));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => start2(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, (event) => end2(event));
    }
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(direction);
    }
  }
  _getItemIndex(element) {
    this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
    return this._items.indexOf(element);
  }
  _getItemByOrder(order2, activeElement) {
    const isNext = order2 === ORDER_NEXT;
    return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
  }
  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget);
    const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));
    return EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex
    });
  }
  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute("aria-current");
      const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);
      for (let i = 0; i < indicators.length; i++) {
        if (Number.parseInt(indicators[i].getAttribute("data-bs-slide-to"), 10) === this._getItemIndex(element)) {
          indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
          indicators[i].setAttribute("aria-current", "true");
          break;
        }
      }
    }
  }
  _updateInterval() {
    const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
    if (elementInterval) {
      this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
      this._config.interval = elementInterval;
    } else {
      this._config.interval = this._config.defaultInterval || this._config.interval;
    }
  }
  _slide(directionOrOrder, element) {
    const order2 = this._directionToOrder(directionOrOrder);
    const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
    const activeElementIndex = this._getItemIndex(activeElement);
    const nextElement = element || this._getItemByOrder(order2, activeElement);
    const nextElementIndex = this._getItemIndex(nextElement);
    const isCycling = Boolean(this._interval);
    const isNext = order2 === ORDER_NEXT;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    const eventDirectionName = this._orderToDirection(order2);
    if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
      this._isSliding = false;
      return;
    }
    if (this._isSliding) {
      return;
    }
    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      return;
    }
    this._isSliding = true;
    if (isCycling) {
      this.pause();
    }
    this._setActiveIndicatorElement(nextElement);
    this._activeElement = nextElement;
    const triggerSlidEvent = () => {
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });
    };
    if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
      nextElement.classList.add(orderClassName);
      reflow(nextElement);
      activeElement.classList.add(directionalClassName);
      nextElement.classList.add(directionalClassName);
      const completeCallBack = () => {
        nextElement.classList.remove(directionalClassName, orderClassName);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
        this._isSliding = false;
        setTimeout(triggerSlidEvent, 0);
      };
      this._queueCallback(completeCallBack, activeElement, true);
    } else {
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      this._isSliding = false;
      triggerSlidEvent();
    }
    if (isCycling) {
      this.cycle();
    }
  }
  _directionToOrder(direction) {
    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
      return direction;
    }
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order2) {
    if (![ORDER_NEXT, ORDER_PREV].includes(order2)) {
      return order2;
    }
    if (isRTL()) {
      return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }
  static carouselInterface(element, config) {
    const data = Carousel.getOrCreateInstance(element, config);
    let {
      _config
    } = data;
    if (typeof config === "object") {
      _config = {
        ..._config,
        ...config
      };
    }
    const action = typeof config === "string" ? config : _config.slide;
    if (typeof config === "number") {
      data.to(config);
    } else if (typeof action === "string") {
      if (typeof data[action] === "undefined") {
        throw new TypeError(`No method named "${action}"`);
      }
      data[action]();
    } else if (_config.interval && _config.ride) {
      data.pause();
      data.cycle();
    }
  }
  static jQueryInterface(config) {
    return this.each(function() {
      Carousel.carouselInterface(this, config);
    });
  }
  static dataApiClickHandler(event) {
    const target = getElementFromSelector(this);
    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
      return;
    }
    const config = {
      ...Manipulator.getDataAttributes(target),
      ...Manipulator.getDataAttributes(this)
    };
    const slideIndex = this.getAttribute("data-bs-slide-to");
    if (slideIndex) {
      config.interval = false;
    }
    Carousel.carouselInterface(target, config);
    if (slideIndex) {
      Carousel.getInstance(target).to(slideIndex);
    }
    event.preventDefault();
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (let i = 0, len = carousels.length; i < len; i++) {
    Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
  }
});
defineJQueryPlugin(Carousel);
var NAME$a = "collapse";
var DATA_KEY$9 = "bs.collapse";
var EVENT_KEY$9 = `.${DATA_KEY$9}`;
var DATA_API_KEY$5 = ".data-api";
var Default$9 = {
  toggle: true,
  parent: null
};
var DefaultType$9 = {
  toggle: "boolean",
  parent: "(null|element)"
};
var EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
var EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
var EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
var EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
var EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
var CLASS_NAME_SHOW$7 = "show";
var CLASS_NAME_COLLAPSE = "collapse";
var CLASS_NAME_COLLAPSING = "collapsing";
var CLASS_NAME_COLLAPSED = "collapsed";
var CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
var CLASS_NAME_HORIZONTAL = "collapse-horizontal";
var WIDTH = "width";
var HEIGHT = "height";
var SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
var SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
var Collapse = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._isTransitioning = false;
    this._config = this._getConfig(config);
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i];
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter((foundElem) => foundElem === this._element);
      if (selector !== null && filterElement.length) {
        this._selector = selector;
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }
  static get Default() {
    return Default$9;
  }
  static get NAME() {
    return NAME$a;
  }
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let actives = [];
    let activesData;
    if (this._config.parent) {
      const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
      actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter((elem) => !children.includes(elem));
    }
    const container = SelectorEngine.findOne(this._selector);
    if (actives.length) {
      const tempActiveData = actives.find((elem) => container !== elem);
      activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;
      if (activesData && activesData._isTransitioning) {
        return;
      }
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);
    if (startEvent.defaultPrevented) {
      return;
    }
    actives.forEach((elemActive) => {
      if (container !== elemActive) {
        Collapse.getOrCreateInstance(elemActive, {
          toggle: false
        }).hide();
      }
      if (!activesData) {
        Data.set(elemActive, DATA_KEY$9, null);
      }
    });
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = "";
      EventHandler.trigger(this._element, EVENT_SHOWN$5);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    const triggerArrayLength = this._triggerArray.length;
    for (let i = 0; i < triggerArrayLength; i++) {
      const trigger = this._triggerArray[i];
      const elem = getElementFromSelector(trigger);
      if (elem && !this._isShown(elem)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$5);
    };
    this._element.style[dimension] = "";
    this._queueCallback(complete, this._element, true);
  }
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }
  _getConfig(config) {
    config = {
      ...Default$9,
      ...Manipulator.getDataAttributes(this._element),
      ...config
    };
    config.toggle = Boolean(config.toggle);
    config.parent = getElement(config.parent);
    typeCheckConfig(NAME$a, config, DefaultType$9);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter((elem) => !children.includes(elem)).forEach((element) => {
      const selected = getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    });
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    triggerArray.forEach((elem) => {
      if (isOpen) {
        elem.classList.remove(CLASS_NAME_COLLAPSED);
      } else {
        elem.classList.add(CLASS_NAME_COLLAPSED);
      }
      elem.setAttribute("aria-expanded", isOpen);
    });
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const _config = {};
      if (typeof config === "string" && /show|hide/.test(config)) {
        _config.toggle = false;
      }
      const data = Collapse.getOrCreateInstance(this, _config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event) {
  if (event.target.tagName === "A" || event.delegateTarget && event.delegateTarget.tagName === "A") {
    event.preventDefault();
  }
  const selector = getSelectorFromElement(this);
  const selectorElements = SelectorEngine.find(selector);
  selectorElements.forEach((element) => {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  });
});
defineJQueryPlugin(Collapse);
var NAME$9 = "dropdown";
var DATA_KEY$8 = "bs.dropdown";
var EVENT_KEY$8 = `.${DATA_KEY$8}`;
var DATA_API_KEY$4 = ".data-api";
var ESCAPE_KEY$2 = "Escape";
var SPACE_KEY = "Space";
var TAB_KEY$1 = "Tab";
var ARROW_UP_KEY = "ArrowUp";
var ARROW_DOWN_KEY = "ArrowDown";
var RIGHT_MOUSE_BUTTON = 2;
var REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
var EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
var EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
var EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
var EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
var EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
var EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
var EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
var CLASS_NAME_SHOW$6 = "show";
var CLASS_NAME_DROPUP = "dropup";
var CLASS_NAME_DROPEND = "dropend";
var CLASS_NAME_DROPSTART = "dropstart";
var CLASS_NAME_NAVBAR = "navbar";
var SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
var SELECTOR_MENU = ".dropdown-menu";
var SELECTOR_NAVBAR_NAV = ".navbar-nav";
var SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
var PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
var PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
var PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
var PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
var PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
var PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
var Default$8 = {
  offset: [0, 2],
  boundary: "clippingParents",
  reference: "toggle",
  display: "dynamic",
  popperConfig: null,
  autoClose: true
};
var DefaultType$8 = {
  offset: "(array|string|function)",
  boundary: "(string|element)",
  reference: "(string|element|object)",
  display: "string",
  popperConfig: "(null|object|function)",
  autoClose: "(boolean|string)"
};
var Dropdown = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();
  }
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown(this._menu)) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    const parent = Dropdown.getParentFromElement(this._element);
    if (this._inNavbar) {
      Manipulator.setDataAttribute(this._menu, "popper", "none");
    } else {
      this._createPopper(parent);
    }
    if ("ontouchstart" in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
      [].concat(...document.body.children).forEach((elem) => EventHandler.on(elem, "mouseover", noop));
    }
    this._element.focus();
    this._element.setAttribute("aria-expanded", true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown(this._menu)) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    if ("ontouchstart" in document.documentElement) {
      [].concat(...document.body.children).forEach((elem) => EventHandler.off(elem, "mouseover", noop));
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute("aria-expanded", "false");
    Manipulator.removeDataAttribute(this._menu, "popper");
    EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
  }
  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config
    };
    typeCheckConfig(NAME$9, config, this.constructor.DefaultType);
    if (typeof config.reference === "object" && !isElement2(config.reference) && typeof config.reference.getBoundingClientRect !== "function") {
      throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper(parent) {
    if (typeof lib_exports === "undefined") {
      throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
    }
    let referenceElement = this._element;
    if (this._config.reference === "parent") {
      referenceElement = parent;
    } else if (isElement2(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === "object") {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    const isDisplayStatic = popperConfig.modifiers.find((modifier) => modifier.name === "applyStyles" && modifier.enabled === false);
    this._popper = createPopper3(referenceElement, this._menu, popperConfig);
    if (isDisplayStatic) {
      Manipulator.setDataAttribute(this._menu, "popper", "static");
    }
  }
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getMenuElement() {
    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
  }
  _getPlacement() {
    const parentDropdown = this._element.parentNode;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
  }
  _getOffset() {
    const {
      offset: offset2
    } = this._config;
    if (typeof offset2 === "string") {
      return offset2.split(",").map((val) => Number.parseInt(val, 10));
    }
    if (typeof offset2 === "function") {
      return (popperData) => offset2(popperData, this._element);
    }
    return offset2;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }]
    };
    if (this._config.display === "static") {
      defaultBsPopperConfig.modifiers = [{
        name: "applyStyles",
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...typeof this._config.popperConfig === "function" ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);
    if (!items.length) {
      return;
    }
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === "keyup" && event.key !== TAB_KEY$1)) {
      return;
    }
    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);
    for (let i = 0, len = toggles.length; i < len; i++) {
      const context = Dropdown.getInstance(toggles[i]);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      if (!context._isShown()) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event) {
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) {
          continue;
        }
        if (context._menu.contains(event.target) && (event.type === "keyup" && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
          continue;
        }
        if (event.type === "click") {
          relatedTarget.clickEvent = event;
        }
      }
      context._completeHide(relatedTarget);
    }
  }
  static getParentFromElement(element) {
    return getElementFromSelector(element) || element.parentNode;
  }
  static dataApiKeydownHandler(event) {
    if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
      return;
    }
    const isActive = this.classList.contains(CLASS_NAME_SHOW$6);
    if (!isActive && event.key === ESCAPE_KEY$2) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled(this)) {
      return;
    }
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
    const instance = Dropdown.getOrCreateInstance(getToggleButton);
    if (event.key === ESCAPE_KEY$2) {
      instance.hide();
      return;
    }
    if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
      if (!isActive) {
        instance.show();
      }
      instance._selectMenuItem(event);
      return;
    }
    if (!isActive || event.key === SPACE_KEY) {
      Dropdown.clearMenus();
    }
  }
};
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
defineJQueryPlugin(Dropdown);
var SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
var SELECTOR_STICKY_CONTENT = ".sticky-top";
var ScrollBarHelper = class {
  constructor() {
    this._element = document.body;
  }
  getWidth() {
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    this._setElementAttributes(this._element, "paddingRight", (calculatedValue) => calculatedValue + width);
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight", (calculatedValue) => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight", (calculatedValue) => calculatedValue - width);
  }
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow");
    this._element.style.overflow = "hidden";
  }
  _setElementAttributes(selector, styleProp, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = (element) => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProp);
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow");
    this._resetElementAttributes(this._element, "paddingRight");
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight");
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight");
  }
  _saveInitialAttribute(element, styleProp) {
    const actualValue = element.style[styleProp];
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProp, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProp) {
    const manipulationCallBack = (element) => {
      const value = Manipulator.getDataAttribute(element, styleProp);
      if (typeof value === "undefined") {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement2(selector)) {
      callBack(selector);
    } else {
      SelectorEngine.find(selector, this._element).forEach(callBack);
    }
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
};
var Default$7 = {
  className: "modal-backdrop",
  isVisible: true,
  isAnimated: false,
  rootElement: "body",
  clickCallback: null
};
var DefaultType$7 = {
  className: "string",
  isVisible: "boolean",
  isAnimated: "boolean",
  rootElement: "(element|string)",
  clickCallback: "(function|null)"
};
var NAME$8 = "backdrop";
var CLASS_NAME_FADE$4 = "fade";
var CLASS_NAME_SHOW$5 = "show";
var EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;
var Backdrop = class {
  constructor(config) {
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    if (this._config.isAnimated) {
      reflow(this._getElement());
    }
    this._getElement().classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement("div");
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _getConfig(config) {
    config = {
      ...Default$7,
      ...typeof config === "object" ? config : {}
    };
    config.rootElement = getElement(config.rootElement);
    typeCheckConfig(NAME$8, config, DefaultType$7);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    this._config.rootElement.append(this._getElement());
    EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
};
var Default$6 = {
  trapElement: null,
  autofocus: true
};
var DefaultType$6 = {
  trapElement: "element",
  autofocus: "boolean"
};
var NAME$7 = "focustrap";
var DATA_KEY$7 = "bs.focustrap";
var EVENT_KEY$7 = `.${DATA_KEY$7}`;
var EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
var EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
var TAB_KEY = "Tab";
var TAB_NAV_FORWARD = "forward";
var TAB_NAV_BACKWARD = "backward";
var FocusTrap = class {
  constructor(config) {
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }
  activate() {
    const {
      trapElement,
      autofocus
    } = this._config;
    if (this._isActive) {
      return;
    }
    if (autofocus) {
      trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$7);
    EventHandler.on(document, EVENT_FOCUSIN$1, (event) => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$7);
  }
  _handleFocusin(event) {
    const {
      target
    } = event;
    const {
      trapElement
    } = this._config;
    if (target === document || target === trapElement || trapElement.contains(target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
  _getConfig(config) {
    config = {
      ...Default$6,
      ...typeof config === "object" ? config : {}
    };
    typeCheckConfig(NAME$7, config, DefaultType$6);
    return config;
  }
};
var NAME$6 = "modal";
var DATA_KEY$6 = "bs.modal";
var EVENT_KEY$6 = `.${DATA_KEY$6}`;
var DATA_API_KEY$3 = ".data-api";
var ESCAPE_KEY$1 = "Escape";
var Default$5 = {
  backdrop: true,
  keyboard: true,
  focus: true
};
var DefaultType$5 = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  focus: "boolean"
};
var EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
var EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
var EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
var EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
var EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
var EVENT_RESIZE = `resize${EVENT_KEY$6}`;
var EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
var EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
var EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
var EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
var EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
var CLASS_NAME_OPEN = "modal-open";
var CLASS_NAME_FADE$3 = "fade";
var CLASS_NAME_SHOW$4 = "show";
var CLASS_NAME_STATIC = "modal-static";
var OPEN_SELECTOR$1 = ".modal.show";
var SELECTOR_DIALOG = ".modal-dialog";
var SELECTOR_MODAL_BODY = ".modal-body";
var SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
var Modal = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
  }
  static get Default() {
    return Default$5;
  }
  static get NAME() {
    return NAME$6;
  }
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    if (this._isAnimated()) {
      this._isTransitioning = true;
    }
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._setEscapeEvent();
    this._setResizeEvent();
    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, (event) => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });
    this._showBackdrop(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    const isAnimated = this._isAnimated();
    if (isAnimated) {
      this._isTransitioning = true;
    }
    this._setEscapeEvent();
    this._setResizeEvent();
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    EventHandler.off(this._element, EVENT_CLICK_DISMISS);
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);
    this._queueCallback(() => this._hideModal(), this._element, isAnimated);
  }
  dispose() {
    [window, this._dialog].forEach((htmlElement) => EventHandler.off(htmlElement, EVENT_KEY$6));
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _getConfig(config) {
    config = {
      ...Default$5,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === "object" ? config : {}
    };
    typeCheckConfig(NAME$6, config, DefaultType$5);
    return config;
  }
  _showElement(relatedTarget) {
    const isAnimated = this._isAnimated();
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
      document.body.append(this._element);
    }
    this._element.style.display = "block";
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.scrollTop = 0;
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    if (isAnimated) {
      reflow(this._element);
    }
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, isAnimated);
  }
  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event) => {
        if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
          event.preventDefault();
          this.hide();
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
          this._triggerBackdropTransition();
        }
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
    }
  }
  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
    } else {
      EventHandler.off(window, EVENT_RESIZE);
    }
  }
  _hideModal() {
    this._element.style.display = "none";
    this._element.setAttribute("aria-hidden", true);
    this._element.removeAttribute("aria-modal");
    this._element.removeAttribute("role");
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    });
  }
  _showBackdrop(callback) {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, (event) => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = false;
        return;
      }
      if (event.target !== event.currentTarget) {
        return;
      }
      if (this._config.backdrop === true) {
        this.hide();
      } else if (this._config.backdrop === "static") {
        this._triggerBackdropTransition();
      }
    });
    this._backdrop.show(callback);
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const {
      classList,
      scrollHeight,
      style
    } = this._element;
    const isModalOverflowing = scrollHeight > document.documentElement.clientHeight;
    if (!isModalOverflowing && style.overflowY === "hidden" || classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      style.overflowY = "hidden";
    }
    classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      classList.remove(CLASS_NAME_STATIC);
      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = "";
        }, this._dialog);
      }
    }, this._dialog);
    this._element.focus();
  }
  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`;
    }
    if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
      this._element.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = "";
    this._element.style.paddingRight = "";
  }
  static jQueryInterface(config, relatedTarget) {
    return this.each(function() {
      const data = Modal.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event) {
  const target = getElementFromSelector(this);
  if (["A", "AREA"].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$3, (showEvent) => {
    if (showEvent.defaultPrevented) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$3, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });
  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (allReadyOpen) {
    Modal.getInstance(allReadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);
defineJQueryPlugin(Modal);
var NAME$5 = "offcanvas";
var DATA_KEY$5 = "bs.offcanvas";
var EVENT_KEY$5 = `.${DATA_KEY$5}`;
var DATA_API_KEY$2 = ".data-api";
var EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
var ESCAPE_KEY = "Escape";
var Default$4 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
var DefaultType$4 = {
  backdrop: "boolean",
  keyboard: "boolean",
  scroll: "boolean"
};
var CLASS_NAME_SHOW$3 = "show";
var CLASS_NAME_BACKDROP = "offcanvas-backdrop";
var OPEN_SELECTOR = ".offcanvas.show";
var EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
var EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
var EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
var EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
var EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
var EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
var SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
var Offcanvas = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }
  static get NAME() {
    return NAME$5;
  }
  static get Default() {
    return Default$4;
  }
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._element.style.visibility = "visible";
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.classList.add(CLASS_NAME_SHOW$3);
    const completeCallBack = () => {
      if (!this._config.scroll) {
        this._focustrap.activate();
      }
      EventHandler.trigger(this._element, EVENT_SHOWN$2, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.remove(CLASS_NAME_SHOW$3);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.setAttribute("aria-hidden", true);
      this._element.removeAttribute("aria-modal");
      this._element.removeAttribute("role");
      this._element.style.visibility = "hidden";
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$2);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  _getConfig(config) {
    config = {
      ...Default$4,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === "object" ? config : {}
    };
    typeCheckConfig(NAME$5, config, DefaultType$4);
    return config;
  }
  _initializeBackDrop() {
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: this._config.backdrop,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
      if (this._config.keyboard && event.key === ESCAPE_KEY) {
        this.hide();
      }
    });
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event) {
  const target = getElementFromSelector(this);
  if (["A", "AREA"].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$2, () => {
    if (isVisible(this)) {
      this.focus();
    }
  });
  const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (allReadyOpen && allReadyOpen !== target) {
    Offcanvas.getInstance(allReadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach((el) => Offcanvas.getOrCreateInstance(el).show()));
enableDismissTrigger(Offcanvas);
defineJQueryPlugin(Offcanvas);
var uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
var allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }
  const regExp = allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp);
  for (let i = 0, len = regExp.length; i < len; i++) {
    if (regExp[i].test(attributeName)) {
      return true;
    }
  }
  return false;
};
var DefaultAllowlist = {
  "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
  a: ["target", "href", "title", "rel"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFn && typeof sanitizeFn === "function") {
    return sanitizeFn(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
  const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
  for (let i = 0, len = elements.length; i < len; i++) {
    const element = elements[i];
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
    attributeList.forEach((attribute) => {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    });
  }
  return createdDocument.body.innerHTML;
}
var NAME$4 = "tooltip";
var DATA_KEY$4 = "bs.tooltip";
var EVENT_KEY$4 = `.${DATA_KEY$4}`;
var CLASS_PREFIX$1 = "bs-tooltip";
var DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]);
var DefaultType$3 = {
  animation: "boolean",
  template: "string",
  title: "(string|element|function)",
  trigger: "string",
  delay: "(number|object)",
  html: "boolean",
  selector: "(string|boolean)",
  placement: "(string|function)",
  offset: "(array|string|function)",
  container: "(string|element|boolean)",
  fallbackPlacements: "array",
  boundary: "(string|element)",
  customClass: "(string|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  allowList: "object",
  popperConfig: "(null|object|function)"
};
var AttachmentMap = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: isRTL() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: isRTL() ? "right" : "left"
};
var Default$3 = {
  animation: true,
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  trigger: "hover focus",
  title: "",
  delay: 0,
  html: false,
  selector: false,
  placement: "top",
  offset: [0, 0],
  container: false,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  boundary: "clippingParents",
  customClass: "",
  sanitize: true,
  sanitizeFn: null,
  allowList: DefaultAllowlist,
  popperConfig: null
};
var Event$2 = {
  HIDE: `hide${EVENT_KEY$4}`,
  HIDDEN: `hidden${EVENT_KEY$4}`,
  SHOW: `show${EVENT_KEY$4}`,
  SHOWN: `shown${EVENT_KEY$4}`,
  INSERTED: `inserted${EVENT_KEY$4}`,
  CLICK: `click${EVENT_KEY$4}`,
  FOCUSIN: `focusin${EVENT_KEY$4}`,
  FOCUSOUT: `focusout${EVENT_KEY$4}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
};
var CLASS_NAME_FADE$2 = "fade";
var CLASS_NAME_MODAL = "modal";
var CLASS_NAME_SHOW$2 = "show";
var HOVER_STATE_SHOW = "show";
var HOVER_STATE_OUT = "out";
var SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
var SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
var EVENT_MODAL_HIDE = "hide.bs.modal";
var TRIGGER_HOVER = "hover";
var TRIGGER_FOCUS = "focus";
var TRIGGER_CLICK = "click";
var TRIGGER_MANUAL = "manual";
var Tooltip = class extends BaseComponent {
  constructor(element, config) {
    if (typeof lib_exports === "undefined") {
      throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
    }
    super(element);
    this._isEnabled = true;
    this._timeout = 0;
    this._hoverState = "";
    this._activeTrigger = {};
    this._popper = null;
    this._config = this._getConfig(config);
    this.tip = null;
    this._setListeners();
  }
  static get Default() {
    return Default$3;
  }
  static get NAME() {
    return NAME$4;
  }
  static get Event() {
    return Event$2;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle(event) {
    if (!this._isEnabled) {
      return;
    }
    if (event) {
      const context = this._initializeOnDelegatedTarget(event);
      context._activeTrigger.click = !context._activeTrigger.click;
      if (context._isWithActiveTrigger()) {
        context._enter(null, context);
      } else {
        context._leave(null, context);
      }
    } else {
      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
        this._leave(null, this);
        return;
      }
      this._enter(null, this);
    }
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this.tip) {
      this.tip.remove();
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === "none") {
      throw new Error("Please use show on visible elements");
    }
    if (!(this.isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }
    if (this.constructor.NAME === "tooltip" && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
      this._disposePopper();
      this.tip.remove();
      this.tip = null;
    }
    const tip = this.getTipElement();
    const tipId = getUID(this.constructor.NAME);
    tip.setAttribute("id", tipId);
    this._element.setAttribute("aria-describedby", tipId);
    if (this._config.animation) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    const placement = typeof this._config.placement === "function" ? this._config.placement.call(this, tip, this._element) : this._config.placement;
    const attachment = this._getAttachment(placement);
    this._addAttachmentClass(attachment);
    const {
      container
    } = this._config;
    Data.set(tip, this.constructor.DATA_KEY, this);
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
    }
    if (this._popper) {
      this._popper.update();
    } else {
      this._popper = createPopper3(this._element, tip, this._getPopperConfig(attachment));
    }
    tip.classList.add(CLASS_NAME_SHOW$2);
    const customClass = this._resolvePossibleFunction(this._config.customClass);
    if (customClass) {
      tip.classList.add(...customClass.split(" "));
    }
    if ("ontouchstart" in document.documentElement) {
      [].concat(...document.body.children).forEach((element) => {
        EventHandler.on(element, "mouseover", noop);
      });
    }
    const complete = () => {
      const prevHoverState = this._hoverState;
      this._hoverState = null;
      EventHandler.trigger(this._element, this.constructor.Event.SHOWN);
      if (prevHoverState === HOVER_STATE_OUT) {
        this._leave(null, this);
      }
    };
    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
    this._queueCallback(complete, this.tip, isAnimated);
  }
  hide() {
    if (!this._popper) {
      return;
    }
    const tip = this.getTipElement();
    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (this._hoverState !== HOVER_STATE_SHOW) {
        tip.remove();
      }
      this._cleanTipClass();
      this._element.removeAttribute("aria-describedby");
      EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);
      this._disposePopper();
    };
    const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    tip.classList.remove(CLASS_NAME_SHOW$2);
    if ("ontouchstart" in document.documentElement) {
      [].concat(...document.body.children).forEach((element) => EventHandler.off(element, "mouseover", noop));
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);
    this._queueCallback(complete, this.tip, isAnimated);
    this._hoverState = "";
  }
  update() {
    if (this._popper !== null) {
      this._popper.update();
    }
  }
  isWithContent() {
    return Boolean(this.getTitle());
  }
  getTipElement() {
    if (this.tip) {
      return this.tip;
    }
    const element = document.createElement("div");
    element.innerHTML = this._config.template;
    const tip = element.children[0];
    this.setContent(tip);
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    this.tip = tip;
    return this.tip;
  }
  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
  }
  _sanitizeAndSetContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!content && templateElement) {
      templateElement.remove();
      return;
    }
    this.setElementContent(templateElement, content);
  }
  setElementContent(element, content) {
    if (element === null) {
      return;
    }
    if (isElement2(content)) {
      content = getElement(content);
      if (this._config.html) {
        if (content.parentNode !== element) {
          element.innerHTML = "";
          element.append(content);
        }
      } else {
        element.textContent = content.textContent;
      }
      return;
    }
    if (this._config.html) {
      if (this._config.sanitize) {
        content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
      }
      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  }
  getTitle() {
    const title = this._element.getAttribute("data-bs-original-title") || this._config.title;
    return this._resolvePossibleFunction(title);
  }
  updateAttachment(attachment) {
    if (attachment === "right") {
      return "end";
    }
    if (attachment === "left") {
      return "start";
    }
    return attachment;
  }
  _initializeOnDelegatedTarget(event, context) {
    return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }
  _getOffset() {
    const {
      offset: offset2
    } = this._config;
    if (typeof offset2 === "string") {
      return offset2.split(",").map((val) => Number.parseInt(val, 10));
    }
    if (typeof offset2 === "function") {
      return (popperData) => offset2(popperData, this._element);
    }
    return offset2;
  }
  _resolvePossibleFunction(content) {
    return typeof content === "function" ? content.call(this._element) : content;
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: "flip",
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }, {
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "arrow",
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: "onChange",
        enabled: true,
        phase: "afterWrite",
        fn: (data) => this._handlePopperPlacementChange(data)
      }],
      onFirstUpdate: (data) => {
        if (data.options.placement !== data.placement) {
          this._handlePopperPlacementChange(data);
        }
      }
    };
    return {
      ...defaultBsPopperConfig,
      ...typeof this._config.popperConfig === "function" ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig
    };
  }
  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
  }
  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()];
  }
  _setListeners() {
    const triggers = this._config.trigger.split(" ");
    triggers.forEach((trigger) => {
      if (trigger === "click") {
        EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, (event) => this.toggle(event));
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        EventHandler.on(this._element, eventIn, this._config.selector, (event) => this._enter(event));
        EventHandler.on(this._element, eventOut, this._config.selector, (event) => this._leave(event));
      }
    });
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._config.selector) {
      this._config = {
        ...this._config,
        trigger: "manual",
        selector: ""
      };
    } else {
      this._fixTitle();
    }
  }
  _fixTitle() {
    const title = this._element.getAttribute("title");
    const originalTitleType = typeof this._element.getAttribute("data-bs-original-title");
    if (title || originalTitleType !== "string") {
      this._element.setAttribute("data-bs-original-title", title || "");
      if (title && !this._element.getAttribute("aria-label") && !this._element.textContent) {
        this._element.setAttribute("aria-label", title);
      }
      this._element.setAttribute("title", "");
    }
  }
  _enter(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);
    if (event) {
      context._activeTrigger[event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
    }
    if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
      context._hoverState = HOVER_STATE_SHOW;
      return;
    }
    clearTimeout(context._timeout);
    context._hoverState = HOVER_STATE_SHOW;
    if (!context._config.delay || !context._config.delay.show) {
      context.show();
      return;
    }
    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show();
      }
    }, context._config.delay.show);
  }
  _leave(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);
    if (event) {
      context._activeTrigger[event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
    }
    if (context._isWithActiveTrigger()) {
      return;
    }
    clearTimeout(context._timeout);
    context._hoverState = HOVER_STATE_OUT;
    if (!context._config.delay || !context._config.delay.hide) {
      context.hide();
      return;
    }
    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide();
      }
    }, context._config.delay.hide);
  }
  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true;
      }
    }
    return false;
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    Object.keys(dataAttributes).forEach((dataAttr) => {
      if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
        delete dataAttributes[dataAttr];
      }
    });
    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...typeof config === "object" && config ? config : {}
    };
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === "number") {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === "number") {
      config.title = config.title.toString();
    }
    if (typeof config.content === "number") {
      config.content = config.content.toString();
    }
    typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
    if (config.sanitize) {
      config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config[key] = this._config[key];
      }
    }
    return config;
  }
  _cleanTipClass() {
    const tip = this.getTipElement();
    const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, "g");
    const tabClass = tip.getAttribute("class").match(basicClassPrefixRegex);
    if (tabClass !== null && tabClass.length > 0) {
      tabClass.map((token) => token.trim()).forEach((tClass) => tip.classList.remove(tClass));
    }
  }
  _getBasicClassPrefix() {
    return CLASS_PREFIX$1;
  }
  _handlePopperPlacementChange(popperData) {
    const {
      state
    } = popperData;
    if (!state) {
      return;
    }
    this.tip = state.elements.popper;
    this._cleanTipClass();
    this._addAttachmentClass(this._getAttachment(state.placement));
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Tooltip.getOrCreateInstance(this, config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
defineJQueryPlugin(Tooltip);
var NAME$3 = "popover";
var DATA_KEY$3 = "bs.popover";
var EVENT_KEY$3 = `.${DATA_KEY$3}`;
var CLASS_PREFIX = "bs-popover";
var Default$2 = {
  ...Tooltip.Default,
  placement: "right",
  offset: [0, 8],
  trigger: "click",
  content: "",
  template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
};
var DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: "(string|element|function)"
};
var Event$1 = {
  HIDE: `hide${EVENT_KEY$3}`,
  HIDDEN: `hidden${EVENT_KEY$3}`,
  SHOW: `show${EVENT_KEY$3}`,
  SHOWN: `shown${EVENT_KEY$3}`,
  INSERTED: `inserted${EVENT_KEY$3}`,
  CLICK: `click${EVENT_KEY$3}`,
  FOCUSIN: `focusin${EVENT_KEY$3}`,
  FOCUSOUT: `focusout${EVENT_KEY$3}`,
  MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
};
var SELECTOR_TITLE = ".popover-header";
var SELECTOR_CONTENT = ".popover-body";
var Popover = class extends Tooltip {
  static get Default() {
    return Default$2;
  }
  static get NAME() {
    return NAME$3;
  }
  static get Event() {
    return Event$1;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  isWithContent() {
    return this.getTitle() || this._getContent();
  }
  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);
    this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  _getBasicClassPrefix() {
    return CLASS_PREFIX;
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Popover.getOrCreateInstance(this, config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
defineJQueryPlugin(Popover);
var NAME$2 = "scrollspy";
var DATA_KEY$2 = "bs.scrollspy";
var EVENT_KEY$2 = `.${DATA_KEY$2}`;
var DATA_API_KEY$1 = ".data-api";
var Default$1 = {
  offset: 10,
  method: "auto",
  target: ""
};
var DefaultType$1 = {
  offset: "number",
  method: "string",
  target: "(string|element)"
};
var EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
var EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
var EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
var CLASS_NAME_DROPDOWN_ITEM = "dropdown-item";
var CLASS_NAME_ACTIVE$1 = "active";
var SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
var SELECTOR_NAV_LIST_GROUP$1 = ".nav, .list-group";
var SELECTOR_NAV_LINKS = ".nav-link";
var SELECTOR_NAV_ITEMS = ".nav-item";
var SELECTOR_LIST_ITEMS = ".list-group-item";
var SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
var SELECTOR_DROPDOWN$1 = ".dropdown";
var SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle";
var METHOD_OFFSET = "offset";
var METHOD_POSITION = "position";
var ScrollSpy = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._scrollElement = this._element.tagName === "BODY" ? window : this._element;
    this._config = this._getConfig(config);
    this._offsets = [];
    this._targets = [];
    this._activeTarget = null;
    this._scrollHeight = 0;
    EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
    this.refresh();
    this._process();
  }
  static get Default() {
    return Default$1;
  }
  static get NAME() {
    return NAME$2;
  }
  refresh() {
    const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
    const offsetMethod = this._config.method === "auto" ? autoMethod : this._config.method;
    const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
    this._offsets = [];
    this._targets = [];
    this._scrollHeight = this._getScrollHeight();
    const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
    targets.map((element) => {
      const targetSelector = getSelectorFromElement(element);
      const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;
      if (target) {
        const targetBCR = target.getBoundingClientRect();
        if (targetBCR.width || targetBCR.height) {
          return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
        }
      }
      return null;
    }).filter((item) => item).sort((a, b) => a[0] - b[0]).forEach((item) => {
      this._offsets.push(item[0]);
      this._targets.push(item[1]);
    });
  }
  dispose() {
    EventHandler.off(this._scrollElement, EVENT_KEY$2);
    super.dispose();
  }
  _getConfig(config) {
    config = {
      ...Default$1,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === "object" && config ? config : {}
    };
    config.target = getElement(config.target) || document.documentElement;
    typeCheckConfig(NAME$2, config, DefaultType$1);
    return config;
  }
  _getScrollTop() {
    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
  }
  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }
  _getOffsetHeight() {
    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
  }
  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset;
    const scrollHeight = this._getScrollHeight();
    const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();
    if (this._scrollHeight !== scrollHeight) {
      this.refresh();
    }
    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1];
      if (this._activeTarget !== target) {
        this._activate(target);
      }
      return;
    }
    if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null;
      this._clear();
      return;
    }
    for (let i = this._offsets.length; i--; ) {
      const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === "undefined" || scrollTop < this._offsets[i + 1]);
      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }
  _activate(target) {
    this._activeTarget = target;
    this._clear();
    const queries = SELECTOR_LINK_ITEMS.split(",").map((selector) => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
    const link = SelectorEngine.findOne(queries.join(","), this._config.target);
    link.classList.add(CLASS_NAME_ACTIVE$1);
    if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach((listGroup) => {
        SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach((item) => item.classList.add(CLASS_NAME_ACTIVE$1));
        SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach((navItem) => {
          SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach((item) => item.classList.add(CLASS_NAME_ACTIVE$1));
        });
      });
    }
    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _clear() {
    SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter((node) => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach((node) => node.classList.remove(CLASS_NAME_ACTIVE$1));
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
};
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_SPY).forEach((spy) => new ScrollSpy(spy));
});
defineJQueryPlugin(ScrollSpy);
var NAME$1 = "tab";
var DATA_KEY$1 = "bs.tab";
var EVENT_KEY$1 = `.${DATA_KEY$1}`;
var DATA_API_KEY = ".data-api";
var EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
var EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
var EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
var EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
var EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
var CLASS_NAME_DROPDOWN_MENU = "dropdown-menu";
var CLASS_NAME_ACTIVE = "active";
var CLASS_NAME_FADE$1 = "fade";
var CLASS_NAME_SHOW$1 = "show";
var SELECTOR_DROPDOWN = ".dropdown";
var SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
var SELECTOR_ACTIVE = ".active";
var SELECTOR_ACTIVE_UL = ":scope > li > .active";
var SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
var SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
var SELECTOR_DROPDOWN_ACTIVE_CHILD = ":scope > .dropdown-menu .active";
var Tab = class extends BaseComponent {
  static get NAME() {
    return NAME$1;
  }
  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
      return;
    }
    let previous;
    const target = getElementFromSelector(this._element);
    const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);
    if (listElement) {
      const itemSelector = listElement.nodeName === "UL" || listElement.nodeName === "OL" ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
      previous = SelectorEngine.find(itemSelector, listElement);
      previous = previous[previous.length - 1];
    }
    const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
      relatedTarget: this._element
    }) : null;
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
      relatedTarget: previous
    });
    if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
      return;
    }
    this._activate(this._element, listElement);
    const complete = () => {
      EventHandler.trigger(previous, EVENT_HIDDEN$1, {
        relatedTarget: this._element
      });
      EventHandler.trigger(this._element, EVENT_SHOWN$1, {
        relatedTarget: previous
      });
    };
    if (target) {
      this._activate(target, target.parentNode, complete);
    } else {
      complete();
    }
  }
  _activate(element, container, callback) {
    const activeElements = container && (container.nodeName === "UL" || container.nodeName === "OL") ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
    const active = activeElements[0];
    const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);
    const complete = () => this._transitionComplete(element, active, callback);
    if (active && isTransitioning) {
      active.classList.remove(CLASS_NAME_SHOW$1);
      this._queueCallback(complete, element, true);
    } else {
      complete();
    }
  }
  _transitionComplete(element, active, callback) {
    if (active) {
      active.classList.remove(CLASS_NAME_ACTIVE);
      const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);
      if (dropdownChild) {
        dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
      }
      if (active.getAttribute("role") === "tab") {
        active.setAttribute("aria-selected", false);
      }
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    if (element.getAttribute("role") === "tab") {
      element.setAttribute("aria-selected", true);
    }
    reflow(element);
    if (element.classList.contains(CLASS_NAME_FADE$1)) {
      element.classList.add(CLASS_NAME_SHOW$1);
    }
    let parent = element.parentNode;
    if (parent && parent.nodeName === "LI") {
      parent = parent.parentNode;
    }
    if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
      const dropdownElement = element.closest(SELECTOR_DROPDOWN);
      if (dropdownElement) {
        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach((dropdown) => dropdown.classList.add(CLASS_NAME_ACTIVE));
      }
      element.setAttribute("aria-expanded", true);
    }
    if (callback) {
      callback();
    }
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Tab.getOrCreateInstance(this);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
  if (["A", "AREA"].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  const data = Tab.getOrCreateInstance(this);
  data.show();
});
defineJQueryPlugin(Tab);
var NAME = "toast";
var DATA_KEY = "bs.toast";
var EVENT_KEY = `.${DATA_KEY}`;
var EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
var EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
var EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
var EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
var EVENT_HIDE = `hide${EVENT_KEY}`;
var EVENT_HIDDEN = `hidden${EVENT_KEY}`;
var EVENT_SHOW = `show${EVENT_KEY}`;
var EVENT_SHOWN = `shown${EVENT_KEY}`;
var CLASS_NAME_FADE = "fade";
var CLASS_NAME_HIDE = "hide";
var CLASS_NAME_SHOW = "show";
var CLASS_NAME_SHOWING = "showing";
var DefaultType = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
};
var Default = {
  animation: true,
  autohide: true,
  delay: 5e3
};
var Toast = class extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get Default() {
    return Default;
  }
  static get NAME() {
    return NAME;
  }
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE);
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW);
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE);
      this._element.classList.remove(CLASS_NAME_SHOWING);
      this._element.classList.remove(CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this._element.classList.contains(CLASS_NAME_SHOW)) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...typeof config === "object" && config ? config : {}
    };
    typeCheckConfig(NAME, config, this.constructor.DefaultType);
    return config;
  }
  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case "mouseover":
      case "mouseout":
        this._hasMouseInteraction = isInteracting;
        break;
      case "focusin":
      case "focusout":
        this._hasKeyboardInteraction = isInteracting;
        break;
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, (event) => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, (event) => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, (event) => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, (event) => this._onInteraction(event, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }
  static jQueryInterface(config) {
    return this.each(function() {
      const data = Toast.getOrCreateInstance(this, config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
};
enableDismissTrigger(Toast);
defineJQueryPlugin(Toast);

// app/assets/javascripts/formstrap/controllers/notification_controller.js
var notification_controller_default = class extends Controller {
  connect() {
    new Toast(this.element, {});
  }
};

// app/assets/javascripts/formstrap/controllers/popup_controller.js
var popup_controller_default = class extends Controller {
  static get targets() {
    return ["popup", "button"];
  }
  static get values() {
    return { id: String };
  }
  connect() {
    document.addEventListener("click", (event) => {
      this.handleOutsideClick(event);
    });
  }
  handleOutsideClick(event) {
    const itemRemoved = !document.body.contains(event.target);
    if (itemRemoved)
      return;
    const inPopup = event.target.closest('[data-popup-target="popup"]') !== null;
    const inButton = event.target.closest('[data-popup-target="button"]') !== null;
    const openPopup = document.querySelector('[data-popup-target="popup"]:not(.closed)');
    if (!inButton && !inPopup && openPopup) {
      this.closePopup(openPopup);
    }
  }
  open(event) {
    const button = event.target.closest('[data-popup-target="button"]');
    const popup = this.popupById(button.dataset.popupId);
    const passThru = button.dataset.popupPassThru;
    createPopper3(button, popup);
    this.openPopup(popup);
    if (passThru) {
      const passThruElement = popup.querySelector(passThru);
      passThruElement.click();
      if (passThruElement instanceof HTMLInputElement) {
        passThruElement.focus();
        passThruElement.select();
      }
    }
  }
  close(event) {
    const button = event.target.closest('[data-popup-target="button"]');
    const popup = this.popupById(button.dataset.popupId);
    this.closePopup(popup);
  }
  popupById(id) {
    return this.popupTargets.find((popup) => {
      return popup.dataset.popupId === id;
    });
  }
  openPopup(popup) {
    popup.classList.remove("closed");
  }
  closePopup(popup) {
    popup.classList.add("closed");
  }
};

// app/assets/javascripts/formstrap/controllers/redactorx_controller.js
var redactorx_controller_default = class extends Controller {
  connect() {
    this.initRedactor();
  }
  initRedactor() {
    if (typeof RedactorX === "undefined") {
      console.error("RedactorX is a paid module and is not included in Headmin. Please purchase it and import it as a JS module");
      return false;
    }
    const defaultOptions = {
      editor: {
        minHeight: "57px"
      },
      subscribe: {
        "app.start": () => {
          this.stylize();
        }
      }
    };
    const options = JSON.parse(this.element.getAttribute("data-redactor-options"));
    RedactorX(this.element, { ...defaultOptions, ...options });
  }
  stylize() {
    const container = this.element.nextElementSibling;
    const inputClasses = this.element.classList;
    container.classList.add(...inputClasses);
  }
};

// app/assets/javascripts/formstrap/controllers/remote_modal_controller.js
var remote_modal_controller_default = class extends Controller {
  connect() {
    this.modal = new Modal(this.element);
    this.modal.show();
  }
};

// app/assets/javascripts/formstrap/controllers/repeater_controller.js
var repeater_controller_default = class extends Controller {
  static get values() {
    return {
      id: String
    };
  }
  static get targets() {
    return ["repeater", "footer", "template", "row", "list", "empty", "addButton"];
  }
  connect() {
    sortable_esm_default.create(this.listTarget, {
      animation: 150,
      ghostClass: "list-group-item-dark",
      draggable: ".repeater-row",
      handle: ".repeater-row-handle",
      onEnd: () => {
        this.resetIndices();
        this.resetPositions();
      }
    });
    this.toggleEmpty();
  }
  resetButtonIndices(event) {
    const row = event.target.closest(".repeater-row");
    const index2 = this.containsRow(row) ? row.dataset.rowIndex : "";
    this.updatePopupButtonIndices(index2);
  }
  containsRow(row) {
    return this.rowTargets.includes(row);
  }
  updatePopupButtonIndices(index2) {
    const popup = document.querySelector(`[data-popup-target="popup"][data-popup-id="repeater-buttons-${this.idValue}"]`);
    const buttons = popup.querySelectorAll("a");
    buttons.forEach((button) => {
      button.dataset.rowIndex = index2;
    });
  }
  addRow(event) {
    event.preventDefault();
    const button = event.target;
    const templateName = button.dataset.templateName;
    const rowIndex = button.dataset.rowIndex;
    const template = this.getTemplate(templateName);
    const html = this.replaceIdsWithTimestamps(template);
    if (rowIndex) {
      const row = this.rowTargets[rowIndex];
      row.insertAdjacentHTML("afterend", html);
    } else {
      this.footerTarget.insertAdjacentHTML("beforebegin", html);
    }
    this.resetIndices();
    this.resetPositions();
    this.toggleEmpty();
  }
  removeRow(event) {
    event.preventDefault();
    const row = event.target.closest(".repeater-row");
    if (row.dataset.newRecord === "true") {
      row.remove();
    } else {
      this.flagRowForDeletion(row);
      row.remove();
    }
    this.resetIndices();
    this.resetPositions();
    this.toggleEmpty();
  }
  flagRowForDeletion(row) {
    const destroyInput = row.querySelector("input[name*='_destroy']");
    const idInput = row.querySelector("input[name*='[id]']");
    destroyInput.value = 1;
    this.listTarget.parentNode.appendChild(destroyInput);
    this.listTarget.parentNode.appendChild(idInput);
  }
  getTemplate(name) {
    return this.templateTargets.filter((template) => {
      return template.dataset.templateName === name;
    })[0];
  }
  replaceIdsWithTimestamps(template) {
    const regex = new RegExp(template.dataset.templateIdRegex, "g");
    return template.innerHTML.replace(regex, new Date().getTime());
  }
  visibleRowsCount() {
    return this.visibleRows().length;
  }
  visibleRows() {
    const rows = this.rowTargets;
    return rows.filter((row) => {
      return row.querySelector("input[name*='_destroy']").value !== "1";
    });
  }
  toggleEmpty() {
    if (this.visibleRowsCount() > 0) {
      this.emptyTarget.classList.add("invisible");
    } else {
      this.emptyTarget.classList.remove("invisible");
    }
  }
  resetPositions() {
    this.visibleRows().forEach((row, index2) => {
      const positionInput = row.querySelector("input[name*='position']");
      if (positionInput) {
        positionInput.value = index2;
      }
    });
  }
  resetIndices() {
    this.visibleRows().forEach((row, index2) => {
      row.dataset.rowIndex = index2;
    });
  }
};

// app/assets/javascripts/formstrap/controllers/select_controller.js
var import_tom_select = __toESM(require_tom_select_complete());
var select_controller_default = class extends Controller {
  connect() {
    if (this.element.hasAttribute("multiple")) {
      this.initTomSelect();
    }
  }
  defaultOptions(locale) {
    const defaultOptions = {
      en: {
        render: {
          option_create: function(data, escape) {
            return '<div class="create">Add <strong>' + escape(data.input) + "</strong>&hellip;</div>";
          },
          no_results: function(data, escape) {
            return '<div class="no-results">No results found</div>';
          }
        }
      },
      nl: {
        render: {
          option_create: function(data, escape) {
            return '<div class="create">Voeg <strong>' + escape(data.input) + "</strong> toe &hellip;</div>";
          },
          no_results: function(data, escape) {
            return '<div class="no-results">Geen resultaten gevonden</div>';
          }
        }
      }
    };
    return defaultOptions[locale];
  }
  hasTags() {
    return this.element.dataset.tags === "true";
  }
  initTomSelect() {
    const defaultOptions = this.defaultOptions(i18n_default.locale);
    const options = { create: this.hasTags() };
    new import_tom_select.default(this.element, { ...defaultOptions, ...options });
  }
};

// app/assets/javascripts/formstrap/controllers/table_actions_controller.js
var table_actions_controller_default = class extends Controller {
  static get targets() {
    return ["wrapper", "form", "select", "method", "button", "idInput", "counter"];
  }
  connect() {
    this.wrapperTarget.addEventListener("idSelectionChanged", (event) => {
      this.updateIdInput(event.detail.ids);
      this.updateCounter(event.detail.count);
      this.toggleCounter(event.detail.count);
    });
  }
  update(event) {
    event.preventDefault();
    this.updateFormAction();
    this.updateFormMethod();
    this.updateFormDataAttributes();
    this.enableButton();
  }
  updateIdInput(ids) {
    if (ids == null) {
      this.disableIdInput();
      this.idInputTarget.value = "";
    } else {
      this.enableIdInput();
      this.idInputTarget.value = `in:${ids.join(",")}`;
    }
  }
  disableIdInput() {
    this.idInputTarget.removeAttribute("name");
  }
  enableIdInput() {
    this.idInputTarget.setAttribute("name", "id");
  }
  updateCounter(count) {
    let htmlString = "";
    switch (count) {
      case 0:
        htmlString = this.counterTarget.getAttribute("data-items-zero");
        break;
      case 1:
        htmlString = this.counterTarget.getAttribute("data-items-one");
        break;
      default:
        htmlString = this.counterTarget.getAttribute("data-items-other");
        htmlString = htmlString.replace(/<b>[\s\S]*?<\/b>/, `<b>${count}</b>`);
    }
    this.counterTarget.innerHTML = htmlString;
  }
  toggleCounter(count) {
    if (count > 0) {
      this.wrapperTarget.classList.remove("d-none");
    } else {
      this.wrapperTarget.classList.add("d-none");
    }
  }
  updateFormAction() {
    this.formTarget.action = this.selectTarget.value;
  }
  updateFormMethod() {
    const option2 = this.selectedOption();
    this.methodTarget.value = option2.dataset.method;
  }
  updateFormDataAttributes() {
    const option2 = this.selectedOption();
    this.updateFormDataConfirm(option2.dataset.turboConfirm);
    this.updateFormDataTurbo(option2.dataset.turbo);
  }
  updateFormDataConfirm(confirm) {
    if (confirm) {
      this.formTarget.dataset.turboConfirm = confirm;
    } else {
      this.formTarget.removeAttribute("data-turbo-confirm");
    }
  }
  updateFormDataTurbo(turbo) {
    if (turbo) {
      this.formTarget.dataset.turbo = turbo;
    } else {
      this.formTarget.removeAttribute("data-turbo");
    }
  }
  selectedOption() {
    return this.selectTarget.options[this.selectTarget.selectedIndex];
  }
  enableButton() {
    this.buttonTarget.removeAttribute("disabled");
  }
};

// app/assets/javascripts/formstrap/controllers/table_controller.js
var table_controller_default = class extends Controller {
  static get values() {
    return {
      url: String,
      count: Number
    };
  }
  static get targets() {
    return ["table", "body", "actions", "idCheckbox", "idsCheckbox", "row"];
  }
  connect() {
    sortable_esm_default.create(this.bodyTarget, {
      handle: ".table-drag-sort-handle",
      onEnd: (event) => {
        this.submitPositions();
      }
    });
  }
  submitPositions() {
    fetch(this.urlValue, {
      method: "PATCH",
      body: this.idsFormData(),
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      }
    }).then((response) => {
      return response.text();
    }).catch((err) => {
      console.warn("Fetch went wrong", err);
    });
  }
  positions() {
    const handles = [...this.tableTarget.querySelectorAll(".table-drag-sort-handle")];
    return handles.map((handle) => {
      return handle.dataset.id;
    });
  }
  idsFormData() {
    const formData = new FormData();
    this.positions().forEach((id) => {
      formData.append("ids[]", id);
    });
    return formData;
  }
  toggleIds(event) {
    const checkbox = event.target;
    this.toggleIdsCheckboxes(checkbox.checked);
    this.toggleIdCheckboxes(checkbox.checked);
    this.updateActions();
  }
  toggleId(event) {
    this.toggleIdsCheckboxes(false);
    this.updateActions();
  }
  updateActions() {
    this.actionsTarget.dispatchEvent(new CustomEvent("idSelectionChanged", {
      detail: {
        ids: this.ids(),
        count: this.selectedIdsCount()
      }
    }));
  }
  selectedIdsCount() {
    if (this.ids() instanceof Array) {
      return this.ids().length;
    } else {
      return this.totalCount();
    }
  }
  totalCount() {
    if (this.countValue === 0) {
      return this.rowTargets.length;
    } else {
      return this.countValue;
    }
  }
  ids() {
    if (this.idsCheckboxTarget.checked) {
      return null;
    } else {
      return this.selectedIdCheckboxes().map((checkbox) => {
        return checkbox.value;
      });
    }
  }
  selectedIdCheckboxes() {
    return this.idCheckboxTargets.filter((checkbox) => {
      return checkbox.checked;
    });
  }
  toggleIdsCheckboxes(checked) {
    this.idsCheckboxTargets.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }
  toggleIdCheckboxes(checked) {
    this.idCheckboxTargets.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }
};

// app/assets/javascripts/formstrap/controllers/textarea_controller.js
var textarea_controller_default = class extends Controller {
  static get targets() {
    return ["textarea", "count"];
  }
  connect() {
    onVisible(this.textareaTarget, () => {
      this.update();
    });
  }
  update() {
    this.resize();
    this.updateCount();
  }
  resize() {
    this.textareaTarget.style.height = "auto";
    this.textareaTarget.setAttribute("style", "height:" + this.textareaTarget.scrollHeight + "px;overflow-y:hidden;");
  }
  updateCount() {
    if (this.textareaTarget.getAttribute("maxlength")) {
      this.updateCountLength();
    }
  }
  updateCountLength() {
    const currentLength = this.textareaTarget.value.length;
    const maximumLength = this.textareaTarget.getAttribute("maxlength");
    this.countTarget.textContent = `${currentLength}/${maximumLength}`;
  }
};
function onVisible(element, callback) {
  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        callback(element);
        observer.disconnect();
      }
    });
  }).observe(element);
}

// app/assets/javascripts/formstrap/index.js
var Formstrap = class {
  static start() {
    window.Stimulus = window.Stimulus || Application.start();
    Stimulus.register("autocomplete", autocomplete_controller_default);
    Stimulus.register("blocks", blocks_controller_default);
    Stimulus.register("date-range", date_range_controller_default);
    Stimulus.register("dropzone", dropzone_controller_default);
    Stimulus.register("file-preview", file_preview_controller_default);
    Stimulus.register("filter", filter_controller_default);
    Stimulus.register("filter-row", filter_row_controller_default);
    Stimulus.register("filters", filters_controller_default);
    Stimulus.register("flatpickr", flatpickr_controller_default);
    Stimulus.register("hello", hello_controller_default);
    Stimulus.register("infinite-scroller", infinite_scroller_controller_default);
    Stimulus.register("media", media_controller_default);
    Stimulus.register("media-modal", media_modal_controller_default);
    Stimulus.register("notification", notification_controller_default);
    Stimulus.register("popup", popup_controller_default);
    Stimulus.register("redactorx", redactorx_controller_default);
    Stimulus.register("remote-modal", remote_modal_controller_default);
    Stimulus.register("repeater", repeater_controller_default);
    Stimulus.register("select", select_controller_default);
    Stimulus.register("table", table_controller_default);
    Stimulus.register("table-actions", table_actions_controller_default);
    Stimulus.register("textarea", textarea_controller_default);
  }
};
export {
  Formstrap
};
/*!
  * Bootstrap v5.1.3 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
