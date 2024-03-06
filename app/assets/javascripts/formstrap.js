var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
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
          this._events = void 0;
          this._events = {};
        }
        on(events, fct) {
          forEvents(events, (event) => {
            const event_array = this._events[event] || [];
            event_array.push(fct);
            this._events[event] = event_array;
          });
        }
        off(events, fct) {
          var n = arguments.length;
          if (n === 0) {
            this._events = {};
            return;
          }
          forEvents(events, (event) => {
            if (n === 1) {
              delete this._events[event];
              return;
            }
            const event_array = this._events[event];
            if (event_array === void 0)
              return;
            event_array.splice(event_array.indexOf(fct), 1);
            this._events[event] = event_array;
          });
        }
        trigger(events, ...args) {
          var self2 = this;
          forEvents(events, (event) => {
            const event_array = self2._events[event];
            if (event_array === void 0)
              return;
            event_array.forEach((fct) => {
              fct.apply(self2, args);
            });
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
      const arrayToPattern = (chars) => {
        chars = chars.filter(Boolean);
        if (chars.length < 2) {
          return chars[0] || "";
        }
        return maxValueLength(chars) == 1 ? "[" + chars.join("") + "]" : "(?:" + chars.join("|") + ")";
      };
      const sequencePattern = (array) => {
        if (!hasDuplicates(array)) {
          return array.join("");
        }
        let pattern = "";
        let prev_char_count = 0;
        const prev_pattern = () => {
          if (prev_char_count > 1) {
            pattern += "{" + prev_char_count + "}";
          }
        };
        array.forEach((char, i) => {
          if (char === array[i - 1]) {
            prev_char_count++;
            return;
          }
          prev_pattern();
          pattern += char;
          prev_char_count = 1;
        });
        prev_pattern();
        return pattern;
      };
      const setToPattern = (chars) => {
        let array = toArray2(chars);
        return arrayToPattern(array);
      };
      const hasDuplicates = (array) => {
        return new Set(array).size !== array.length;
      };
      const escape_regex = (str) => {
        return (str + "").replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, "\\$1");
      };
      const maxValueLength = (array) => {
        return array.reduce((longest, value) => Math.max(longest, unicodeLength(value)), 0);
      };
      const unicodeLength = (str) => {
        return toArray2(str).length;
      };
      const toArray2 = (p) => Array.from(p);
      const allSubstrings = (input) => {
        if (input.length === 1)
          return [[input]];
        let result = [];
        const start2 = input.substring(1);
        const suba = allSubstrings(start2);
        suba.forEach(function(subresult) {
          let tmp = subresult.slice(0);
          tmp[0] = input.charAt(0) + tmp[0];
          result.push(tmp);
          tmp = subresult.slice(0);
          tmp.unshift(input.charAt(0));
          result.push(tmp);
        });
        return result;
      };
      const code_points = [[0, 65535]];
      const accent_pat = "[\u0300-\u036F\xB7\u02BE\u02BC]";
      let unicode_map;
      let multi_char_reg;
      const max_char_length = 3;
      const latin_convert = {};
      const latin_condensed = {
        "/": "\u2044\u2215",
        "0": "\u07C0",
        "a": "\u2C65\u0250\u0251",
        "aa": "\uA733",
        "ae": "\xE6\u01FD\u01E3",
        "ao": "\uA735",
        "au": "\uA737",
        "av": "\uA739\uA73B",
        "ay": "\uA73D",
        "b": "\u0180\u0253\u0183",
        "c": "\uA73F\u0188\u023C\u2184",
        "d": "\u0111\u0257\u0256\u1D05\u018C\uABB7\u0501\u0266",
        "e": "\u025B\u01DD\u1D07\u0247",
        "f": "\uA77C\u0192",
        "g": "\u01E5\u0260\uA7A1\u1D79\uA77F\u0262",
        "h": "\u0127\u2C68\u2C76\u0265",
        "i": "\u0268\u0131",
        "j": "\u0249\u0237",
        "k": "\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
        "l": "\u0142\u019A\u026B\u2C61\uA749\uA747\uA781\u026D",
        "m": "\u0271\u026F\u03FB",
        "n": "\uA7A5\u019E\u0272\uA791\u1D0E\u043B\u0509",
        "o": "\xF8\u01FF\u0254\u0275\uA74B\uA74D\u1D11",
        "oe": "\u0153",
        "oi": "\u01A3",
        "oo": "\uA74F",
        "ou": "\u0223",
        "p": "\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
        "q": "\uA757\uA759\u024B",
        "r": "\u024D\u027D\uA75B\uA7A7\uA783",
        "s": "\xDF\u023F\uA7A9\uA785\u0282",
        "t": "\u0167\u01AD\u0288\u2C66\uA787",
        "th": "\xFE",
        "tz": "\uA729",
        "u": "\u0289",
        "v": "\u028B\uA75F\u028C",
        "vy": "\uA761",
        "w": "\u2C73",
        "y": "\u01B4\u024F\u1EFF",
        "z": "\u01B6\u0225\u0240\u2C6C\uA763",
        "hv": "\u0195"
      };
      for (let latin in latin_condensed) {
        let unicode = latin_condensed[latin] || "";
        for (let i = 0; i < unicode.length; i++) {
          let char = unicode.substring(i, i + 1);
          latin_convert[char] = latin;
        }
      }
      const convert_pat = new RegExp(Object.keys(latin_convert).join("|") + "|" + accent_pat, "gu");
      const initialize = (_code_points) => {
        if (unicode_map !== void 0)
          return;
        unicode_map = generateMap(_code_points || code_points);
      };
      const normalize = (str, form = "NFKD") => str.normalize(form);
      const asciifold = (str) => {
        return toArray2(str).reduce(
          (result, char) => {
            return result + _asciifold(char);
          },
          ""
        );
      };
      const _asciifold = (str) => {
        str = normalize(str).toLowerCase().replace(convert_pat, (char) => {
          return latin_convert[char] || "";
        });
        return normalize(str, "NFC");
      };
      function* generator(code_points2) {
        for (const [code_point_min, code_point_max] of code_points2) {
          for (let i = code_point_min; i <= code_point_max; i++) {
            let composed = String.fromCharCode(i);
            let folded = asciifold(composed);
            if (folded == composed.toLowerCase()) {
              continue;
            }
            if (folded.length > max_char_length) {
              continue;
            }
            if (folded.length == 0) {
              continue;
            }
            yield {
              folded,
              composed,
              code_point: i
            };
          }
        }
      }
      const generateSets = (code_points2) => {
        const unicode_sets = {};
        const addMatching = (folded, to_add) => {
          const folded_set = unicode_sets[folded] || /* @__PURE__ */ new Set();
          const patt = new RegExp("^" + setToPattern(folded_set) + "$", "iu");
          if (to_add.match(patt)) {
            return;
          }
          folded_set.add(escape_regex(to_add));
          unicode_sets[folded] = folded_set;
        };
        for (let value of generator(code_points2)) {
          addMatching(value.folded, value.folded);
          addMatching(value.folded, value.composed);
        }
        return unicode_sets;
      };
      const generateMap = (code_points2) => {
        const unicode_sets = generateSets(code_points2);
        const unicode_map2 = {};
        let multi_char = [];
        for (let folded in unicode_sets) {
          let set = unicode_sets[folded];
          if (set) {
            unicode_map2[folded] = setToPattern(set);
          }
          if (folded.length > 1) {
            multi_char.push(escape_regex(folded));
          }
        }
        multi_char.sort((a, b) => b.length - a.length);
        const multi_char_patt = arrayToPattern(multi_char);
        multi_char_reg = new RegExp("^" + multi_char_patt, "u");
        return unicode_map2;
      };
      const mapSequence = (strings, min_replacement = 1) => {
        let chars_replaced = 0;
        strings = strings.map((str) => {
          if (unicode_map[str]) {
            chars_replaced += str.length;
          }
          return unicode_map[str] || str;
        });
        if (chars_replaced >= min_replacement) {
          return sequencePattern(strings);
        }
        return "";
      };
      const substringsToPattern = (str, min_replacement = 1) => {
        min_replacement = Math.max(min_replacement, str.length - 1);
        return arrayToPattern(allSubstrings(str).map((sub_pat) => {
          return mapSequence(sub_pat, min_replacement);
        }));
      };
      const sequencesToPattern = (sequences, all = true) => {
        let min_replacement = sequences.length > 1 ? 1 : 0;
        return arrayToPattern(sequences.map((sequence) => {
          let seq = [];
          const len = all ? sequence.length() : sequence.length() - 1;
          for (let j = 0; j < len; j++) {
            seq.push(substringsToPattern(sequence.substrs[j] || "", min_replacement));
          }
          return sequencePattern(seq);
        }));
      };
      const inSequences = (needle_seq, sequences) => {
        for (const seq of sequences) {
          if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
            continue;
          }
          if (seq.substrs.join("") !== needle_seq.substrs.join("")) {
            continue;
          }
          let needle_parts = needle_seq.parts;
          const filter = (part) => {
            for (const needle_part of needle_parts) {
              if (needle_part.start === part.start && needle_part.substr === part.substr) {
                return false;
              }
              if (part.length == 1 || needle_part.length == 1) {
                continue;
              }
              if (part.start < needle_part.start && part.end > needle_part.start) {
                return true;
              }
              if (needle_part.start < part.start && needle_part.end > part.start) {
                return true;
              }
            }
            return false;
          };
          let filtered = seq.parts.filter(filter);
          if (filtered.length > 0) {
            continue;
          }
          return true;
        }
        return false;
      };
      class Sequence {
        constructor() {
          this.parts = [];
          this.substrs = [];
          this.start = 0;
          this.end = 0;
        }
        add(part) {
          if (part) {
            this.parts.push(part);
            this.substrs.push(part.substr);
            this.start = Math.min(part.start, this.start);
            this.end = Math.max(part.end, this.end);
          }
        }
        last() {
          return this.parts[this.parts.length - 1];
        }
        length() {
          return this.parts.length;
        }
        clone(position, last_piece) {
          let clone2 = new Sequence();
          let parts = JSON.parse(JSON.stringify(this.parts));
          let last_part = parts.pop();
          for (const part of parts) {
            clone2.add(part);
          }
          let last_substr = last_piece.substr.substring(0, position - last_part.start);
          let clone_last_len = last_substr.length;
          clone2.add({
            start: last_part.start,
            end: last_part.start + clone_last_len,
            length: clone_last_len,
            substr: last_substr
          });
          return clone2;
        }
      }
      const getPattern = (str) => {
        initialize();
        str = asciifold(str);
        let pattern = "";
        let sequences = [new Sequence()];
        for (let i = 0; i < str.length; i++) {
          let substr = str.substring(i);
          let match = substr.match(multi_char_reg);
          const char = str.substring(i, i + 1);
          const match_str = match ? match[0] : null;
          let overlapping = [];
          let added_types = /* @__PURE__ */ new Set();
          for (const sequence of sequences) {
            const last_piece = sequence.last();
            if (!last_piece || last_piece.length == 1 || last_piece.end <= i) {
              if (match_str) {
                const len = match_str.length;
                sequence.add({
                  start: i,
                  end: i + len,
                  length: len,
                  substr: match_str
                });
                added_types.add("1");
              } else {
                sequence.add({
                  start: i,
                  end: i + 1,
                  length: 1,
                  substr: char
                });
                added_types.add("2");
              }
            } else if (match_str) {
              let clone2 = sequence.clone(i, last_piece);
              const len = match_str.length;
              clone2.add({
                start: i,
                end: i + len,
                length: len,
                substr: match_str
              });
              overlapping.push(clone2);
            } else {
              added_types.add("3");
            }
          }
          if (overlapping.length > 0) {
            overlapping = overlapping.sort((a, b) => {
              return a.length() - b.length();
            });
            for (let clone2 of overlapping) {
              if (inSequences(clone2, sequences)) {
                continue;
              }
              sequences.push(clone2);
            }
            continue;
          }
          if (i > 0 && added_types.size == 1 && !added_types.has("3")) {
            pattern += sequencesToPattern(sequences, false);
            let new_seq = new Sequence();
            const old_seq = sequences[0];
            if (old_seq) {
              new_seq.add(old_seq.last());
            }
            sequences = [new_seq];
          }
        }
        pattern += sequencesToPattern(sequences, true);
        return pattern;
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
        if (token.regex == null)
          return 0;
        pos = value.search(token.regex);
        if (pos === -1)
          return 0;
        score = token.string.length / value.length;
        if (pos === 0)
          score += 0.5;
        return score * weight;
      };
      const propToArray = (obj, key) => {
        var value = obj[key];
        if (typeof value == "function")
          return value;
        if (value && !Array.isArray(value)) {
          obj[key] = [value];
        }
      };
      const iterate$1 = (object, callback) => {
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
          this.items = void 0;
          this.settings = void 0;
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
              if (this.settings.diacritics) {
                regex = getPattern(word) || null;
              } else {
                regex = escape_regex(word);
              }
              if (regex && respect_word_boundaries)
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
                return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
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
                iterate$1(weights, (weight, field) => {
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
              var score, sum = 0;
              for (let token of tokens) {
                score = scoreObject(token, data);
                if (score <= 0)
                  return 0;
                sum += score;
              }
              return sum / token_count;
            };
          } else {
            return function(data) {
              var sum = 0;
              iterate$1(tokens, (token) => {
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
          var implicit_score, sort_flds = [];
          const self2 = this, options = search.options, sort2 = !search.query && options.sort_empty ? options.sort_empty : options.sort;
          if (typeof sort2 == "function") {
            return sort2.bind(this);
          }
          const get_field = function get_field2(name, result) {
            if (name === "$score")
              return result.score;
            return search.getAttrFn(self2.items[result.id], name);
          };
          if (sort2) {
            for (let s of sort2) {
              if (search.query || s.field !== "$score") {
                sort_flds.push(s);
              }
            }
          }
          if (search.query) {
            implicit_score = true;
            for (let fld of sort_flds) {
              if (fld.field === "$score") {
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
            sort_flds = sort_flds.filter((fld) => fld.field !== "$score");
          }
          const sort_flds_count = sort_flds.length;
          if (!sort_flds_count) {
            return null;
          }
          return function(a, b) {
            var result, field;
            for (let sort_fld of sort_flds) {
              field = sort_fld.field;
              let multiplier = sort_fld.direction === "desc" ? -1 : 1;
              result = multiplier * cmp(get_field(field, a), get_field(field, b));
              if (result)
                return result;
            }
            return 0;
          };
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
            iterate$1(self2.items, (item, id) => {
              score = fn_score(item);
              if (options.filter === false || score > 0) {
                search.items.push({
                  "score": score,
                  "id": id
                });
              }
            });
          } else {
            iterate$1(self2.items, (_, id) => {
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
      const getDom = (query) => {
        if (query.jquery) {
          return query[0];
        }
        if (query instanceof HTMLElement) {
          return query;
        }
        if (isHtmlString(query)) {
          var tpl = document.createElement("template");
          tpl.innerHTML = query.trim();
          return tpl.content.firstChild;
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
            Array.from(node.childNodes).forEach((element2) => {
              highlightRecursive(element2);
            });
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
          this.control_input = void 0;
          this.wrapper = void 0;
          this.dropdown = void 0;
          this.control = void 0;
          this.dropdown_content = void 0;
          this.focus_node = void 0;
          this.order = 0;
          this.settings = void 0;
          this.input = void 0;
          this.tabIndex = void 0;
          this.is_select_tag = void 0;
          this.rtl = void 0;
          this.inputId = void 0;
          this._destroy = void 0;
          this.sifter = void 0;
          this.isOpen = false;
          this.isDisabled = false;
          this.isRequired = void 0;
          this.isInvalid = false;
          this.isValid = true;
          this.isLocked = false;
          this.isFocused = false;
          this.isInputHidden = false;
          this.isSetup = false;
          this.ignoreFocus = false;
          this.ignoreHover = false;
          this.hasOptions = false;
          this.currentResults = void 0;
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
              settings.createFilter = (value) => {
                return this.settings.duplicates || !this.options[value];
              };
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
            iterate$1(attrs, (attr) => {
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
          if (settings.placeholder) {
            setAttr(control_input, {
              placeholder: settings.placeholder
            });
          }
          if (!settings.splitOn && settings.delimiter) {
            settings.splitOn = new RegExp("\\s*" + escape_regex(settings.delimiter) + "+\\s*");
          }
          if (settings.load && settings.loadThrottle) {
            settings.load = loadDebounce(settings.load, settings.loadThrottle);
          }
          self2.control_input.type = input.type;
          addEvent(dropdown, "mousemove", () => {
            self2.ignoreHover = false;
          });
          addEvent(dropdown, "mouseenter", (e) => {
            var target_match = parentMatch(e.target, "[data-selectable]", dropdown);
            if (target_match)
              self2.onOptionHover(e, target_match);
          }, {
            capture: true
          });
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
          addEvent(focus_node, "blur", (e) => self2.onBlur(e));
          addEvent(focus_node, "focus", (e) => self2.onFocus(e));
          addEvent(control_input, "paste", (e) => self2.onPaste(e));
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
          const win_scroll = () => {
            if (self2.isOpen) {
              self2.positionDropdown();
            }
          };
          addEvent(document, "mousedown", doc_mousedown);
          addEvent(window, "scroll", win_scroll, passive_event);
          addEvent(window, "resize", win_scroll, passive_event);
          this._destroy = () => {
            document.removeEventListener("mousedown", doc_mousedown);
            window.removeEventListener("scroll", win_scroll);
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
          addEvent(input, "invalid", () => {
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
          iterate$1(optgroups, (optgroup) => {
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
          self2.setValue(settings.items || [], true);
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
          if (!self2.settings.splitOn) {
            return;
          }
          setTimeout(() => {
            var pastedText = self2.inputValue();
            if (!pastedText.match(self2.settings.splitOn)) {
              return;
            }
            var splitInput = pastedText.trim().split(self2.settings.splitOn);
            iterate$1(splitInput, (piece) => {
              const hash3 = hash_key(piece);
              if (hash3) {
                if (this.options[piece]) {
                  self2.addItem(piece);
                } else {
                  self2.createItem(piece);
                }
              }
            });
          }, 0);
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
          self2.ignoreHover = true;
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
              } else if (document.activeElement == self2.control_input && self2.isOpen) {
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
        onOptionHover(evt, option2) {
          if (this.ignoreHover)
            return;
          this.setActiveOption(option2, false);
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
            self2.createItem(null, deactivate);
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
            self2.createItem(null, () => {
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
        setActiveOption(option2, scroll = true) {
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
          if (scroll)
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
          const self2 = this;
          if (self2.settings.mode === "single")
            return;
          const activeItems = self2.controlChildren();
          if (!activeItems.length)
            return;
          self2.hideInput();
          self2.close();
          self2.activeItems = activeItems;
          iterate$1(activeItems, (item) => {
            self2.setActiveItemClass(item);
          });
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
          var result, calculateScore;
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
            result.items = result.items.filter((item) => {
              let hashed = hash_key(item.id);
              return !(hashed && self2.items.indexOf(hashed) !== -1);
            });
          }
          return result;
        }
        refreshOptions(triggerDropdown = true) {
          var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
          var create;
          const groups = {};
          const groups_order = [];
          var self2 = this;
          var query = self2.inputValue();
          const same_query = query === self2.lastQuery || query == "" && self2.lastQuery == null;
          var results = self2.search(query);
          var active_option = null;
          var show_dropdown = self2.settings.shouldOpen || false;
          var dropdown_content = self2.dropdown_content;
          if (same_query) {
            active_option = self2.activeOption;
            if (active_option) {
              active_group = active_option.closest("[data-group]");
            }
          }
          n = results.items.length;
          if (typeof self2.settings.maxOptions === "number") {
            n = Math.min(n, self2.settings.maxOptions);
          }
          if (n > 0) {
            show_dropdown = true;
          }
          for (i = 0; i < n; i++) {
            let item = results.items[i];
            if (!item)
              continue;
            let opt_value = item.id;
            let option2 = self2.options[opt_value];
            if (option2 === void 0)
              continue;
            let opt_hash = get_hash(opt_value);
            let option_el = self2.getOption(opt_hash, true);
            if (!self2.settings.hideSelected) {
              option_el.classList.toggle("selected", self2.items.includes(opt_hash));
            }
            optgroup = option2[self2.settings.optgroupField] || "";
            optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];
            for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
              optgroup = optgroups[j];
              if (!self2.optgroups.hasOwnProperty(optgroup)) {
                optgroup = "";
              }
              let group_fragment = groups[optgroup];
              if (group_fragment === void 0) {
                group_fragment = document.createDocumentFragment();
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
                if (self2.activeOption && self2.activeOption.dataset.value == opt_value) {
                  if (active_group && active_group.dataset.group === optgroup.toString()) {
                    active_option = option_el;
                  }
                }
              }
              group_fragment.appendChild(option_el);
              groups[optgroup] = group_fragment;
            }
          }
          if (self2.settings.lockOptgroupOrder) {
            groups_order.sort((a, b) => {
              const grp_a = self2.optgroups[a];
              const grp_b = self2.optgroups[b];
              const a_order = grp_a && grp_a.$order || 0;
              const b_order = grp_b && grp_b.$order || 0;
              return a_order - b_order;
            });
          }
          html = document.createDocumentFragment();
          iterate$1(groups_order, (optgroup2) => {
            let group_fragment = groups[optgroup2];
            if (!group_fragment || !group_fragment.children.length)
              return;
            let group_heading = self2.optgroups[optgroup2];
            if (group_heading !== void 0) {
              let group_options = document.createDocumentFragment();
              let header = self2.render("optgroup_header", group_heading);
              append(group_options, header);
              append(group_options, group_fragment);
              let group_html = self2.render("optgroup", {
                group: group_heading,
                options: group_options
              });
              append(html, group_html);
            } else {
              append(html, group_fragment);
            }
          });
          dropdown_content.innerHTML = "";
          append(dropdown_content, html);
          if (self2.settings.highlight) {
            removeHighlight(dropdown_content);
            if (results.query.length && results.tokens.length) {
              iterate$1(results.tokens, (tok) => {
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
              if (!active_option && self2.settings.mode === "single" && self2.items[0] != void 0) {
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
          iterate$1(data, (dat) => {
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
          const data_old = self2.options[value_old];
          if (data_old == void 0)
            return;
          if (typeof value_new !== "string")
            throw new Error("Value must be set in option data");
          const option2 = self2.getOption(value_old);
          const item = self2.getItem(value_old);
          data.$order = data.$order || data_old.$order;
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
        clearOptions(filter) {
          const boundFilter = (filter || this.clearFilter).bind(this);
          this.loadedSearches = {};
          this.userOptions = {};
          this.clearCache();
          const selected = {};
          iterate$1(this.options, (option2, key) => {
            if (boundFilter(option2, key)) {
              selected[key] = option2;
            }
          });
          this.options = this.sifter.items = selected;
          this.lastQuery = null;
          this.trigger("option_clear");
        }
        clearFilter(option2, value) {
          if (this.items.indexOf(value) >= 0) {
            return true;
          }
          return false;
        }
        getOption(value, create = false) {
          const hashed = hash_key(value);
          if (hashed === null)
            return null;
          const option2 = this.options[hashed];
          if (option2 != void 0) {
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
          const last_item = items[items.length - 1];
          items.forEach((item) => {
            self2.isPending = item !== last_item;
            self2.addItem(item, silent);
          });
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
        createItem(input = null, callback = () => {
        }) {
          if (arguments.length === 3) {
            callback = arguments[2];
          }
          if (typeof callback != "function") {
            callback = () => {
            };
          }
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
          if (!self2.input.validity) {
            return;
          }
          self2.isValid = self2.input.validity.valid;
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
              if (option_el != empty_option || has_selected > 0) {
                option_el.selected = true;
              }
              return option_el;
            };
            const selected = [];
            const has_selected = self2.input.querySelectorAll("option:checked").length;
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
          iterate$1(items, (item) => {
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
          target.insertBefore(el, target.children[caret] || null);
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
            iterate$1(self2.activeItems, (item) => rm_items.push(item));
          } else if ((self2.isFocused || self2.settings.mode === "single") && self2.items.length) {
            const items = self2.controlChildren();
            let rm_item;
            if (direction < 0 && selection.start === 0 && selection.length === 0) {
              rm_item = items[self2.caretPos - 1];
            } else if (direction > 0 && selection.start === self2.inputValue().length) {
              rm_item = items[self2.caretPos];
            }
            if (rm_item !== void 0) {
              rm_items.push(rm_item);
            }
          }
          if (!self2.shouldDelete(rm_items, e)) {
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
        shouldDelete(items, evt) {
          const values = items.map((item) => item.dataset.value);
          if (!values.length || typeof this.settings.onDelete === "function" && this.settings.onDelete(values, evt) === false) {
            return false;
          }
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
          var id, html;
          const self2 = this;
          if (typeof this.settings.render[templateName] !== "function") {
            return null;
          }
          html = self2.settings.render[templateName].call(this, data, escape_html);
          if (!html) {
            return null;
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
            const value = get_hash(data[self2.settings.valueField]);
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
              data.$div = html;
              self2.options[value] = data;
            }
          }
          return html;
        }
        _render(templateName, data) {
          const html = this.render(templateName, data);
          if (html == null) {
            throw "HTMLElement expected";
          }
          return html;
        }
        clearCache() {
          iterate$1(this.options, (option2) => {
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
            if (checkbox instanceof HTMLInputElement) {
              if (option2.classList.contains("selected")) {
                checkbox.checked = true;
              } else {
                checkbox.checked = false;
              }
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
        self2.on("item_add", (value) => {
          var option2 = self2.getOption(value);
          if (option2) {
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
            return `<div class="${data.className}" title="${data.title}">&#10799;</div>`;
          }
        }, userOptions);
        self2.on("initialize", () => {
          var button = getDom(options.html(options));
          button.addEventListener("click", (evt) => {
            if (self2.isDisabled) {
              return;
            }
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
            removeClasses(last_active, "last-active");
          } else {
            self2.setCaret(self2.caretPos + direction);
          }
        });
      }
      function dropdown_input() {
        const self2 = this;
        self2.settings.shouldOpen = true;
        self2.hook("before", "setup", () => {
          self2.focus_node = self2.control;
          addClasses(self2.control_input, "dropdown-input");
          const div = getDom('<div class="dropdown-input-wrap">');
          div.append(self2.control_input);
          self2.dropdown.insertBefore(div, self2.dropdown.firstChild);
          const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
          placeholder.placeholder = self2.settings.placeholder || "";
          self2.control.append(placeholder);
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
            self2.focus_node.focus({
              preventScroll: true
            });
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
            test_input.textContent = control.value;
            control.style.width = test_input.clientWidth + "px";
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
          self2.ignoreHover = true;
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
            var item = getDom(orig_render_item.call(self2, data, escape));
            var close_button = getDom(html);
            item.appendChild(close_button);
            addEvent(close_button, "mousedown", (evt) => {
              preventDefault(evt, true);
            });
            addEvent(close_button, "click", (evt) => {
              preventDefault(evt, true);
              if (self2.isLocked)
                return;
              if (!self2.shouldDelete([item], evt))
                return;
              self2.removeItem(item);
              self2.refreshOptions(false);
              self2.inputState();
            });
            return item;
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
          if (!self2.isFocused) {
            return;
          }
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
        var load_more_opt;
        var default_values = [];
        if (!self2.settings.shouldLoadMore) {
          self2.settings.shouldLoadMore = () => {
            const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
            if (scroll_percent > 0.9) {
              return true;
            }
            if (self2.activeOption) {
              var selectable = self2.selectable();
              var index2 = Array.from(selectable).indexOf(self2.activeOption);
              if (index2 >= selectable.length - 2) {
                return true;
              }
            }
            return false;
          };
        }
        if (!self2.settings.firstUrl) {
          throw "virtual_scroll plugin requires a firstUrl() method";
        }
        self2.settings.sortField = [{
          field: "$order"
        }, {
          field: "$score"
        }];
        const canLoadMore = (query) => {
          if (typeof self2.settings.maxOptions === "number" && dropdown_content.children.length >= self2.settings.maxOptions) {
            return false;
          }
          if (query in pagination && pagination[query]) {
            return true;
          }
          return false;
        };
        const clearFilter = (option2, value) => {
          if (self2.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
            return true;
          }
          return false;
        };
        self2.setNextUrl = (value, next_url) => {
          pagination[value] = next_url;
        };
        self2.getUrl = (query) => {
          if (query in pagination) {
            const next_url = pagination[query];
            pagination[query] = false;
            return next_url;
          }
          pagination = {};
          return self2.settings.firstUrl.call(self2, query);
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
            self2.clearOptions(clearFilter);
          } else if (load_more_opt) {
            const first_option = options[0];
            if (first_option !== void 0) {
              load_more_opt.dataset.value = first_option[self2.settings.valueField];
            }
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
            if (option2) {
              option2.setAttribute("data-selectable", "");
              load_more_opt = option2;
            }
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
          default_values = Object.keys(self2.options);
          dropdown_content = self2.dropdown_content;
          self2.settings.render = Object.assign({}, {
            loading_more: () => {
              return `<div class="loading-more-results">Loading more results ... </div>`;
            },
            no_more_results: () => {
              return `<div class="no-more-results">No more results</div>`;
            }
          }, self2.settings.render);
          dropdown_content.addEventListener("scroll", () => {
            if (!self2.settings.shouldLoadMore.call(self2)) {
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
  hasBindings() {
    return this.unorderedBindings.size > 0;
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
  bindingDisconnected(binding, clearEventListeners = false) {
    this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    if (clearEventListeners)
      this.clearEventListenersForBinding(binding);
  }
  handleError(error2, message, detail = {}) {
    this.application.handleError(error2, `Error ${message}`, detail);
  }
  clearEventListenersForBinding(binding) {
    const eventListener = this.fetchEventListenerForBinding(binding);
    if (!eventListener.hasBindings()) {
      eventListener.disconnect();
      this.removeMappedEventListenerFor(binding);
    }
  }
  removeMappedEventListenerFor(binding) {
    const { eventTarget, eventName, eventOptions } = binding;
    const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
    const cacheKey = this.cacheKey(eventName, eventOptions);
    eventListenerMap.delete(cacheKey);
    if (eventListenerMap.size == 0)
      this.eventListenerMaps.delete(eventTarget);
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
var defaultActionDescriptorFilters = {
  stop({ event, value }) {
    if (value)
      event.stopPropagation();
    return true;
  },
  prevent({ event, value }) {
    if (value)
      event.preventDefault();
    return true;
  },
  self({ event, value, element }) {
    if (value) {
      return element === event.target;
    } else {
      return true;
    }
  }
};
var descriptorPattern = /^(?:(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
function parseActionDescriptorString(descriptorString) {
  const source = descriptorString.trim();
  const matches2 = source.match(descriptorPattern) || [];
  let eventName = matches2[1];
  let keyFilter = matches2[2];
  if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
    eventName += `.${keyFilter}`;
    keyFilter = "";
  }
  return {
    eventTarget: parseEventTarget(matches2[3]),
    eventName,
    eventOptions: matches2[6] ? parseEventOptions(matches2[6]) : {},
    identifier: matches2[4],
    methodName: matches2[5],
    keyFilter
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
function namespaceCamelize(value) {
  return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
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
  constructor(element, index2, descriptor, schema) {
    this.element = element;
    this.index = index2;
    this.eventTarget = descriptor.eventTarget || element;
    this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
    this.eventOptions = descriptor.eventOptions || {};
    this.identifier = descriptor.identifier || error("missing identifier");
    this.methodName = descriptor.methodName || error("missing method name");
    this.keyFilter = descriptor.keyFilter || "";
    this.schema = schema;
  }
  static forToken(token, schema) {
    return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
  }
  toString() {
    const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
    const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
    return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
  }
  isFilterTarget(event) {
    if (!this.keyFilter) {
      return false;
    }
    const filteres = this.keyFilter.split("+");
    const modifiers = ["meta", "ctrl", "alt", "shift"];
    const [meta, ctrl, alt, shift] = modifiers.map((modifier) => filteres.includes(modifier));
    if (event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift) {
      return true;
    }
    const standardFilter = filteres.filter((key) => !modifiers.includes(key))[0];
    if (!standardFilter) {
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(this.keyMappings, standardFilter)) {
      error(`contains unknown key filter: ${this.keyFilter}`);
    }
    return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
  }
  get params() {
    const params = {};
    const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
    for (const { name, value } of Array.from(this.element.attributes)) {
      const match = name.match(pattern);
      const key = match && match[1];
      if (key) {
        params[camelize(key)] = typecast(value);
      }
    }
    return params;
  }
  get eventTargetName() {
    return stringifyEventTarget(this.eventTarget);
  }
  get keyMappings() {
    return this.schema.keyMappings;
  }
};
var defaultEventNames = {
  a: () => "click",
  button: () => "click",
  form: () => "submit",
  details: () => "toggle",
  input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
  select: () => "change",
  textarea: () => "input"
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
    if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(event)) {
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
  applyEventModifiers(event) {
    const { element } = this.action;
    const { actionDescriptorFilters } = this.context.application;
    let passes = true;
    for (const [name, value] of Object.entries(this.eventOptions)) {
      if (name in actionDescriptorFilters) {
        const filter = actionDescriptorFilters[name];
        passes = passes && filter({ name, value, event, element });
      } else {
        continue;
      }
    }
    return passes;
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
    if (event instanceof KeyboardEvent && this.action.isFilterTarget(event)) {
      return false;
    }
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
    return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
  }
};
var SelectorObserver = class {
  constructor(element, selector, delegate, details = {}) {
    this.selector = selector;
    this.details = details;
    this.elementObserver = new ElementObserver(element, this);
    this.delegate = delegate;
    this.matchesByElement = new Multimap();
  }
  get started() {
    return this.elementObserver.started;
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
  get element() {
    return this.elementObserver.element;
  }
  matchElement(element) {
    const matches2 = element.matches(this.selector);
    if (this.delegate.selectorMatchElement) {
      return matches2 && this.delegate.selectorMatchElement(element, this.details);
    }
    return matches2;
  }
  matchElementsInTree(tree) {
    const match = this.matchElement(tree) ? [tree] : [];
    const matches2 = Array.from(tree.querySelectorAll(this.selector)).filter((match2) => this.matchElement(match2));
    return match.concat(matches2);
  }
  elementMatched(element) {
    this.selectorMatched(element);
  }
  elementUnmatched(element) {
    this.selectorUnmatched(element);
  }
  elementAttributeChanged(element, _attributeName) {
    const matches2 = this.matchElement(element);
    const matchedBefore = this.matchesByElement.has(this.selector, element);
    if (!matches2 && matchedBefore) {
      this.selectorUnmatched(element);
    }
  }
  selectorMatched(element) {
    if (this.delegate.selectorMatched) {
      this.delegate.selectorMatched(element, this.selector, this.details);
      this.matchesByElement.add(this.selector, element);
    }
  }
  selectorUnmatched(element) {
    this.delegate.selectorUnmatched(element, this.selector, this.details);
    this.matchesByElement.delete(this.selector, element);
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
    this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
    this.bindingsByAction.clear();
  }
  parseValueForToken(token) {
    const action = Action.forToken(token, this.schema);
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
  }
  start() {
    this.stringMapObserver.start();
    this.invokeChangedCallbacksForDefaultValues();
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
      try {
        const value = descriptor.reader(rawValue);
        let oldValue = rawOldValue;
        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue);
        }
        changedMethod.call(this.receiver, value, oldValue);
      } catch (error2) {
        if (error2 instanceof TypeError) {
          error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
        }
        throw error2;
      }
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
var OutletObserver = class {
  constructor(context, delegate) {
    this.context = context;
    this.delegate = delegate;
    this.outletsByName = new Multimap();
    this.outletElementsByName = new Multimap();
    this.selectorObserverMap = /* @__PURE__ */ new Map();
  }
  start() {
    if (this.selectorObserverMap.size === 0) {
      this.outletDefinitions.forEach((outletName) => {
        const selector = this.selector(outletName);
        const details = { outletName };
        if (selector) {
          this.selectorObserverMap.set(outletName, new SelectorObserver(document.body, selector, this, details));
        }
      });
      this.selectorObserverMap.forEach((observer) => observer.start());
    }
    this.dependentContexts.forEach((context) => context.refresh());
  }
  stop() {
    if (this.selectorObserverMap.size > 0) {
      this.disconnectAllOutlets();
      this.selectorObserverMap.forEach((observer) => observer.stop());
      this.selectorObserverMap.clear();
    }
  }
  refresh() {
    this.selectorObserverMap.forEach((observer) => observer.refresh());
  }
  selectorMatched(element, _selector, { outletName }) {
    const outlet = this.getOutlet(element, outletName);
    if (outlet) {
      this.connectOutlet(outlet, element, outletName);
    }
  }
  selectorUnmatched(element, _selector, { outletName }) {
    const outlet = this.getOutletFromMap(element, outletName);
    if (outlet) {
      this.disconnectOutlet(outlet, element, outletName);
    }
  }
  selectorMatchElement(element, { outletName }) {
    return this.hasOutlet(element, outletName) && element.matches(`[${this.context.application.schema.controllerAttribute}~=${outletName}]`);
  }
  connectOutlet(outlet, element, outletName) {
    var _a;
    if (!this.outletElementsByName.has(outletName, element)) {
      this.outletsByName.add(outletName, outlet);
      this.outletElementsByName.add(outletName, element);
      (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
    }
  }
  disconnectOutlet(outlet, element, outletName) {
    var _a;
    if (this.outletElementsByName.has(outletName, element)) {
      this.outletsByName.delete(outletName, outlet);
      this.outletElementsByName.delete(outletName, element);
      (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
    }
  }
  disconnectAllOutlets() {
    for (const outletName of this.outletElementsByName.keys) {
      for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
        for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
          this.disconnectOutlet(outlet, element, outletName);
        }
      }
    }
  }
  selector(outletName) {
    return this.scope.outlets.getSelectorForOutletName(outletName);
  }
  get outletDependencies() {
    const dependencies = new Multimap();
    this.router.modules.forEach((module) => {
      const constructor = module.definition.controllerConstructor;
      const outlets = readInheritableStaticArrayValues(constructor, "outlets");
      outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
    });
    return dependencies;
  }
  get outletDefinitions() {
    return this.outletDependencies.getKeysForValue(this.identifier);
  }
  get dependentControllerIdentifiers() {
    return this.outletDependencies.getValuesForKey(this.identifier);
  }
  get dependentContexts() {
    const identifiers = this.dependentControllerIdentifiers;
    return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
  }
  hasOutlet(element, outletName) {
    return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
  }
  getOutlet(element, outletName) {
    return this.application.getControllerForElementAndIdentifier(element, outletName);
  }
  getOutletFromMap(element, outletName) {
    return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
  }
  get scope() {
    return this.context.scope;
  }
  get identifier() {
    return this.context.identifier;
  }
  get application() {
    return this.context.application;
  }
  get router() {
    return this.application.router;
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
    this.outletObserver = new OutletObserver(this, this);
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
    this.outletObserver.start();
    try {
      this.controller.connect();
      this.logDebugActivity("connect");
    } catch (error2) {
      this.handleError(error2, "connecting controller");
    }
  }
  refresh() {
    this.outletObserver.refresh();
  }
  disconnect() {
    try {
      this.controller.disconnect();
      this.logDebugActivity("disconnect");
    } catch (error2) {
      this.handleError(error2, "disconnecting controller");
    }
    this.outletObserver.stop();
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
  outletConnected(outlet, element, name) {
    this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
  }
  outletDisconnected(outlet, element, name) {
    this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
  }
  invokeControllerMethod(methodName, ...args) {
    const controller = this.controller;
    if (typeof controller[methodName] == "function") {
      controller[methodName](...args);
    }
  }
};
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
    return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
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
var OutletSet = class {
  constructor(scope, controllerElement) {
    this.scope = scope;
    this.controllerElement = controllerElement;
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
  has(outletName) {
    return this.find(outletName) != null;
  }
  find(...outletNames) {
    return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
  }
  findAll(...outletNames) {
    return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
  }
  getSelectorForOutletName(outletName) {
    const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
    return this.controllerElement.getAttribute(attributeName);
  }
  findOutlet(outletName) {
    const selector = this.getSelectorForOutletName(outletName);
    if (selector)
      return this.findElement(selector, outletName);
  }
  findAllOutlets(outletName) {
    const selector = this.getSelectorForOutletName(outletName);
    return selector ? this.findAllElements(selector, outletName) : [];
  }
  findElement(selector, outletName) {
    const elements = this.scope.queryElements(selector);
    return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
  }
  findAllElements(selector, outletName) {
    const elements = this.scope.queryElements(selector);
    return elements.filter((element) => this.matchesElement(element, selector, outletName));
  }
  matchesElement(element, selector, outletName) {
    const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
    return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
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
    this.outlets = new OutletSet(this.documentScope, element);
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
  get isDocumentScope() {
    return this.element === document.documentElement;
  }
  get documentScope() {
    return this.isDocumentScope ? this : new Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
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
    const afterLoad = definition.controllerConstructor.afterLoad;
    if (afterLoad) {
      afterLoad(definition.identifier, this.application);
    }
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
  targetAttributeForScope: (identifier) => `data-${identifier}-target`,
  outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
  keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
};
function objectFromEntries(array) {
  return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
}
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
    this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
  }
  static start(element, schema) {
    const application = new this(element, schema);
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
    this.load({ identifier, controllerConstructor });
  }
  registerActionOption(name, filter) {
    this.actionDescriptorFilters[name] = filter;
  }
  load(head, ...rest) {
    const definitions = Array.isArray(head) ? head : [head, ...rest];
    definitions.forEach((definition) => {
      if (definition.controllerConstructor.shouldLoad) {
        this.router.loadDefinition(definition);
      }
    });
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
function OutletPropertiesBlessing(constructor) {
  const outlets = readInheritableStaticArrayValues(constructor, "outlets");
  return outlets.reduce((properties, outletDefinition) => {
    return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
  }, {});
}
function propertiesForOutletDefinition(name) {
  const camelizedName = namespaceCamelize(name);
  return {
    [`${camelizedName}Outlet`]: {
      get() {
        const outlet = this.outlets.find(name);
        if (outlet) {
          const outletController = this.application.getControllerForElementAndIdentifier(outlet, name);
          if (outletController) {
            return outletController;
          } else {
            throw new Error(`Missing "data-controller=${name}" attribute on outlet element for "${this.identifier}" controller`);
          }
        }
        throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
      }
    },
    [`${camelizedName}Outlets`]: {
      get() {
        const outlets = this.outlets.findAll(name);
        if (outlets.length > 0) {
          return outlets.map((outlet) => {
            const controller = this.application.getControllerForElementAndIdentifier(outlet, name);
            if (controller) {
              return controller;
            } else {
              console.warn(`The provided outlet element is missing the outlet controller "${name}" for "${this.identifier}"`, outlet);
            }
          }).filter((controller) => controller);
        }
        return [];
      }
    },
    [`${camelizedName}OutletElement`]: {
      get() {
        const outlet = this.outlets.find(name);
        if (outlet) {
          return outlet;
        } else {
          throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`);
        }
      }
    },
    [`${camelizedName}OutletElements`]: {
      get() {
        return this.outlets.findAll(name);
      }
    },
    [`has${capitalize(camelizedName)}Outlet`]: {
      get() {
        return this.outlets.has(name);
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
          const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
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
function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
  const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
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
function parseValueDefinitionPair([token, typeDefinition], controller) {
  return valueDescriptorForTokenAndTypeDefinition({
    controller,
    token,
    typeDefinition
  });
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
function parseValueTypeObject(payload) {
  const typeFromObject = parseValueTypeConstant(payload.typeObject.type);
  if (!typeFromObject)
    return;
  const defaultValueType = parseValueTypeDefault(payload.typeObject.default);
  if (typeFromObject !== defaultValueType) {
    const propertyPath = payload.controller ? `${payload.controller}.${payload.token}` : payload.token;
    throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${payload.typeObject.default}" is of type "${defaultValueType}".`);
  }
  return typeFromObject;
}
function parseValueTypeDefinition(payload) {
  const typeFromObject = parseValueTypeObject({
    controller: payload.controller,
    token: payload.token,
    typeObject: payload.typeDefinition
  });
  const typeFromDefaultValue = parseValueTypeDefault(payload.typeDefinition);
  const typeFromConstant = parseValueTypeConstant(payload.typeDefinition);
  const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
  if (type)
    return type;
  const propertyPath = payload.controller ? `${payload.controller}.${payload.typeDefinition}` : payload.token;
  throw new Error(`Unknown value type "${propertyPath}" for "${payload.token}" value`);
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
function valueDescriptorForTokenAndTypeDefinition(payload) {
  const key = `${dasherize(payload.token)}-value`;
  const type = parseValueTypeDefinition(payload);
  return {
    type,
    key,
    name: camelize(key),
    get defaultValue() {
      return defaultValueForDefinition(payload.typeDefinition);
    },
    get hasCustomDefaultValue() {
      return parseValueTypeDefault(payload.typeDefinition) !== void 0;
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
      throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
    }
    return array;
  },
  boolean(value) {
    return !(value == "0" || String(value).toLowerCase() == "false");
  },
  number(value) {
    return Number(value);
  },
  object(value) {
    const object = JSON.parse(value);
    if (object === null || typeof object != "object" || Array.isArray(object)) {
      throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
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
  static afterLoad(_identifier, _application) {
    return;
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
  get outlets() {
    return this.scope.outlets;
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
Controller.blessings = [
  ClassPropertiesBlessing,
  TargetPropertiesBlessing,
  ValuePropertiesBlessing,
  OutletPropertiesBlessing
];
Controller.targets = [];
Controller.outlets = [];
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
    const removeButton = thumbnail.querySelector(".formstrap-file-thumbnail-remove");
    if (removeButton) {
      removeButton.dataset.filePreviewNameParam = fileName;
    }
  }
  updateThumbnailTitle(thumbnail, title) {
    thumbnail.title = title;
  }
  updateThumbnailBackground(thumbnail, url) {
    const thumbnailBackground = thumbnail.querySelector(".formstrap-thumbnail-bg");
    thumbnailBackground.style.backgroundImage = `url('${url}')`;
  }
  removeThumbnailIcon(thumbnail) {
    thumbnail.querySelector(".formstrap-thumbnail-bg").innerHTML = "";
  }
  updateThumbnailIcon(thumbnail, icon) {
    thumbnail.querySelector(".formstrap-thumbnail-bg").innerHTML = icon;
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
    return `<i class="bi ${fullIconName} formstrap-thumbnail-icon"></i>`;
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
var defaults = {
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
  errorHandler: function(err) {
    return typeof console !== "undefined" && console.warn(err);
  },
  getWeek: function(givenDate) {
    var date = new Date(givenDate.getTime());
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
  ordinal: function(nth) {
    var s = nth % 100;
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
var pad = function(number, length) {
  if (length === void 0) {
    length = 2;
  }
  return ("000" + number).slice(length * -1);
};
var int = function(bool) {
  return bool === true ? 1 : 0;
};
function debounce(fn2, wait) {
  var t;
  return function() {
    var _this = this;
    var args = arguments;
    clearTimeout(t);
    t = setTimeout(function() {
      return fn2.apply(_this, args);
    }, wait);
  };
}
var arrayify = function(obj) {
  return obj instanceof Array ? obj : [obj];
};

// node_modules/flatpickr/dist/esm/utils/dom.js
function toggleClass(elem, className, bool) {
  if (bool === true)
    return elem.classList.add(className);
  elem.classList.remove(className);
}
function createElement(tag, className, content) {
  var e = window.document.createElement(tag);
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
  var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
  if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
    numInput.type = "number";
  } else {
    numInput.type = "text";
    numInput.pattern = "\\d*";
  }
  if (opts !== void 0)
    for (var key in opts)
      numInput.setAttribute(key, opts[key]);
  wrapper.appendChild(numInput);
  wrapper.appendChild(arrowUp);
  wrapper.appendChild(arrowDown);
  return wrapper;
}
function getEventTarget(event) {
  try {
    if (typeof event.composedPath === "function") {
      var path = event.composedPath();
      return path[0];
    }
    return event.target;
  } catch (error2) {
    return event.target;
  }
}

// node_modules/flatpickr/dist/esm/utils/formatting.js
var doNothing = function() {
  return void 0;
};
var monthToStr = function(monthNumber, shorthand, locale) {
  return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
};
var revFormat = {
  D: doNothing,
  F: function(dateObj, monthName, locale) {
    dateObj.setMonth(locale.months.longhand.indexOf(monthName));
  },
  G: function(dateObj, hour) {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
  },
  H: function(dateObj, hour) {
    dateObj.setHours(parseFloat(hour));
  },
  J: function(dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  K: function(dateObj, amPM, locale) {
    dateObj.setHours(dateObj.getHours() % 12 + 12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
  },
  M: function(dateObj, shortMonth, locale) {
    dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
  },
  S: function(dateObj, seconds) {
    dateObj.setSeconds(parseFloat(seconds));
  },
  U: function(_, unixSeconds) {
    return new Date(parseFloat(unixSeconds) * 1e3);
  },
  W: function(dateObj, weekNum, locale) {
    var weekNumber = parseInt(weekNum);
    var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
    return date;
  },
  Y: function(dateObj, year) {
    dateObj.setFullYear(parseFloat(year));
  },
  Z: function(_, ISODate) {
    return new Date(ISODate);
  },
  d: function(dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  h: function(dateObj, hour) {
    dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
  },
  i: function(dateObj, minutes) {
    dateObj.setMinutes(parseFloat(minutes));
  },
  j: function(dateObj, day) {
    dateObj.setDate(parseFloat(day));
  },
  l: doNothing,
  m: function(dateObj, month) {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  n: function(dateObj, month) {
    dateObj.setMonth(parseFloat(month) - 1);
  },
  s: function(dateObj, seconds) {
    dateObj.setSeconds(parseFloat(seconds));
  },
  u: function(_, unixMillSeconds) {
    return new Date(parseFloat(unixMillSeconds));
  },
  w: doNothing,
  y: function(dateObj, year) {
    dateObj.setFullYear(2e3 + parseFloat(year));
  }
};
var tokenRegex = {
  D: "",
  F: "",
  G: "(\\d\\d|\\d)",
  H: "(\\d\\d|\\d)",
  J: "(\\d\\d|\\d)\\w+",
  K: "",
  M: "",
  S: "(\\d\\d|\\d)",
  U: "(.+)",
  W: "(\\d\\d|\\d)",
  Y: "(\\d{4})",
  Z: "(.+)",
  d: "(\\d\\d|\\d)",
  h: "(\\d\\d|\\d)",
  i: "(\\d\\d|\\d)",
  j: "(\\d\\d|\\d)",
  l: "",
  m: "(\\d\\d|\\d)",
  n: "(\\d\\d|\\d)",
  s: "(\\d\\d|\\d)",
  u: "(.+)",
  w: "(\\d\\d|\\d)",
  y: "(\\d{2})"
};
var formats = {
  Z: function(date) {
    return date.toISOString();
  },
  D: function(date, locale, options) {
    return locale.weekdays.shorthand[formats.w(date, locale, options)];
  },
  F: function(date, locale, options) {
    return monthToStr(formats.n(date, locale, options) - 1, false, locale);
  },
  G: function(date, locale, options) {
    return pad(formats.h(date, locale, options));
  },
  H: function(date) {
    return pad(date.getHours());
  },
  J: function(date, locale) {
    return locale.ordinal !== void 0 ? date.getDate() + locale.ordinal(date.getDate()) : date.getDate();
  },
  K: function(date, locale) {
    return locale.amPM[int(date.getHours() > 11)];
  },
  M: function(date, locale) {
    return monthToStr(date.getMonth(), true, locale);
  },
  S: function(date) {
    return pad(date.getSeconds());
  },
  U: function(date) {
    return date.getTime() / 1e3;
  },
  W: function(date, _, options) {
    return options.getWeek(date);
  },
  Y: function(date) {
    return pad(date.getFullYear(), 4);
  },
  d: function(date) {
    return pad(date.getDate());
  },
  h: function(date) {
    return date.getHours() % 12 ? date.getHours() % 12 : 12;
  },
  i: function(date) {
    return pad(date.getMinutes());
  },
  j: function(date) {
    return date.getDate();
  },
  l: function(date, locale) {
    return locale.weekdays.longhand[date.getDay()];
  },
  m: function(date) {
    return pad(date.getMonth() + 1);
  },
  n: function(date) {
    return date.getMonth() + 1;
  },
  s: function(date) {
    return date.getSeconds();
  },
  u: function(date) {
    return date.getTime();
  },
  w: function(date) {
    return date.getDay();
  },
  y: function(date) {
    return String(date.getFullYear()).substring(2);
  }
};

// node_modules/flatpickr/dist/esm/utils/dates.js
var createDateFormatter = function(_a) {
  var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
  return function(dateObj, frmt, overrideLocale) {
    var locale = overrideLocale || l10n;
    if (config.formatDate !== void 0 && !isMobile) {
      return config.formatDate(dateObj, frmt, locale);
    }
    return frmt.split("").map(function(c, i, arr) {
      return formats[c] && arr[i - 1] !== "\\" ? formats[c](dateObj, locale, config) : c !== "\\" ? c : "";
    }).join("");
  };
};
var createDateParser = function(_a) {
  var _b = _a.config, config = _b === void 0 ? defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? english : _c;
  return function(date, givenFormat, timeless, customLocale) {
    if (date !== 0 && !date)
      return void 0;
    var locale = customLocale || l10n;
    var parsedDate;
    var dateOrig = date;
    if (date instanceof Date)
      parsedDate = new Date(date.getTime());
    else if (typeof date !== "string" && date.toFixed !== void 0)
      parsedDate = new Date(date);
    else if (typeof date === "string") {
      var format2 = givenFormat || (config || defaults).dateFormat;
      var datestr = String(date).trim();
      if (datestr === "today") {
        parsedDate = new Date();
        timeless = true;
      } else if (config && config.parseDate) {
        parsedDate = config.parseDate(date, format2);
      } else if (/Z$/.test(datestr) || /GMT$/.test(datestr)) {
        parsedDate = new Date(date);
      } else {
        var matched = void 0, ops = [];
        for (var i = 0, matchIndex = 0, regexStr = ""; i < format2.length; i++) {
          var token = format2[i];
          var isBackSlash = token === "\\";
          var escaped = format2[i - 1] === "\\" || isBackSlash;
          if (tokenRegex[token] && !escaped) {
            regexStr += tokenRegex[token];
            var match = new RegExp(regexStr).exec(date);
            if (match && (matched = true)) {
              ops[token !== "Y" ? "push" : "unshift"]({
                fn: revFormat[token],
                val: match[++matchIndex]
              });
            }
          } else if (!isBackSlash)
            regexStr += ".";
        }
        parsedDate = !config || !config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));
        ops.forEach(function(_a2) {
          var fn2 = _a2.fn, val = _a2.val;
          return parsedDate = fn2(parsedDate, val, locale) || parsedDate;
        });
        parsedDate = matched ? parsedDate : void 0;
      }
    }
    if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
      config.errorHandler(new Error("Invalid date provided: " + dateOrig));
      return void 0;
    }
    if (timeless === true)
      parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
  };
};
function compareDates(date1, date2, timeless) {
  if (timeless === void 0) {
    timeless = true;
  }
  if (timeless !== false) {
    return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
  }
  return date1.getTime() - date2.getTime();
}
var isBetween = function(ts, ts1, ts2) {
  return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
var calculateSecondsSinceMidnight = function(hours, minutes, seconds) {
  return hours * 3600 + minutes * 60 + seconds;
};
var parseSeconds = function(secondsSinceMidnight) {
  var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
  return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
};
var duration = {
  DAY: 864e5
};
function getDefaultHours(config) {
  var hours = config.defaultHour;
  var minutes = config.defaultMinute;
  var seconds = config.defaultSeconds;
  if (config.minDate !== void 0) {
    var minHour = config.minDate.getHours();
    var minMinutes = config.minDate.getMinutes();
    var minSeconds = config.minDate.getSeconds();
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
    var maxHr = config.maxDate.getHours();
    var maxMinutes = config.maxDate.getMinutes();
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
  Object.assign = function(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    if (!target) {
      throw TypeError("Cannot convert undefined or null to object");
    }
    var _loop_1 = function(source2) {
      if (source2) {
        Object.keys(source2).forEach(function(key) {
          return target[key] = source2[key];
        });
      }
    };
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
      var source = args_1[_a];
      _loop_1(source);
    }
    return target;
  };
}

// node_modules/flatpickr/dist/esm/index.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArrays = function() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
  var self2 = {
    config: __assign(__assign({}, defaults), flatpickr.defaultConfig),
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
  self2.onMouseOver = onMouseOver;
  self2._createElement = createElement;
  self2.createDay = createDay;
  self2.destroy = destroy2;
  self2.isEnabled = isEnabled;
  self2.jumpToDate = jumpToDate;
  self2.updateValue = updateValue;
  self2.open = open;
  self2.redraw = redraw;
  self2.set = set;
  self2.setDate = setDate;
  self2.toggle = toggle;
  function setupHelperFunctions() {
    self2.utils = {
      getDaysInMonth: function(month, yr) {
        if (month === void 0) {
          month = self2.currentMonth;
        }
        if (yr === void 0) {
          yr = self2.currentYear;
        }
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
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!self2.isMobile && isSafari) {
      positionCalendar();
    }
    triggerEvent("onReady");
  }
  function getClosestActiveElement() {
    var _a;
    return ((_a = self2.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode()).activeElement || document.activeElement;
  }
  function bindToInstance(fn2) {
    return fn2.bind(self2);
  }
  function setCalendarWidth() {
    var config = self2.config;
    if (config.weekNumbers === false && config.showMonths === 1) {
      return;
    } else if (config.noCalendar !== true) {
      window.requestAnimationFrame(function() {
        if (self2.calendarContainer !== void 0) {
          self2.calendarContainer.style.visibility = "hidden";
          self2.calendarContainer.style.display = "block";
        }
        if (self2.daysContainer !== void 0) {
          var daysWidth = (self2.days.offsetWidth + 1) * config.showMonths;
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
      var defaultDate = self2.config.minDate === void 0 || compareDates(new Date(), self2.config.minDate) >= 0 ? new Date() : new Date(self2.config.minDate.getTime());
      var defaults3 = getDefaultHours(self2.config);
      defaultDate.setHours(defaults3.hours, defaults3.minutes, defaults3.seconds, defaultDate.getMilliseconds());
      self2.selectedDates = [defaultDate];
      self2.latestSelectedDateObj = defaultDate;
    }
    if (e !== void 0 && e.type !== "blur") {
      timeWrapper(e);
    }
    var prevValue = self2._input.value;
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
    var hours = (parseInt(self2.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self2.minuteElement.value, 10) || 0) % 60, seconds = self2.secondElement !== void 0 ? (parseInt(self2.secondElement.value, 10) || 0) % 60 : 0;
    if (self2.amPM !== void 0) {
      hours = ampm2military(hours, self2.amPM.textContent);
    }
    var limitMinHours = self2.config.minTime !== void 0 || self2.config.minDate && self2.minDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.minDate, true) === 0;
    var limitMaxHours = self2.config.maxTime !== void 0 || self2.config.maxDate && self2.maxDateHasTime && self2.latestSelectedDateObj && compareDates(self2.latestSelectedDateObj, self2.config.maxDate, true) === 0;
    if (self2.config.maxTime !== void 0 && self2.config.minTime !== void 0 && self2.config.minTime > self2.config.maxTime) {
      var minBound = calculateSecondsSinceMidnight(self2.config.minTime.getHours(), self2.config.minTime.getMinutes(), self2.config.minTime.getSeconds());
      var maxBound = calculateSecondsSinceMidnight(self2.config.maxTime.getHours(), self2.config.maxTime.getMinutes(), self2.config.maxTime.getSeconds());
      var currentTime = calculateSecondsSinceMidnight(hours, minutes, seconds);
      if (currentTime > maxBound && currentTime < minBound) {
        var result = parseSeconds(minBound);
        hours = result[0];
        minutes = result[1];
        seconds = result[2];
      }
    } else {
      if (limitMaxHours) {
        var maxTime = self2.config.maxTime !== void 0 ? self2.config.maxTime : self2.config.maxDate;
        hours = Math.min(hours, maxTime.getHours());
        if (hours === maxTime.getHours())
          minutes = Math.min(minutes, maxTime.getMinutes());
        if (minutes === maxTime.getMinutes())
          seconds = Math.min(seconds, maxTime.getSeconds());
      }
      if (limitMinHours) {
        var minTime = self2.config.minTime !== void 0 ? self2.config.minTime : self2.config.minDate;
        hours = Math.max(hours, minTime.getHours());
        if (hours === minTime.getHours() && minutes < minTime.getMinutes())
          minutes = minTime.getMinutes();
        if (minutes === minTime.getMinutes())
          seconds = Math.max(seconds, minTime.getSeconds());
      }
    }
    setHours(hours, minutes, seconds);
  }
  function setHoursFromDate(dateObj) {
    var date = dateObj || self2.latestSelectedDateObj;
    if (date && date instanceof Date) {
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
    var eventTarget = getEventTarget(event);
    var year = parseInt(eventTarget.value) + (event.delta || 0);
    if (year / 1e3 > 1 || event.key === "Enter" && !/[^\d]/.test(year.toString())) {
      changeYear(year);
    }
  }
  function bind(element2, event, handler, options) {
    if (event instanceof Array)
      return event.forEach(function(ev) {
        return bind(element2, ev, handler, options);
      });
    if (element2 instanceof Array)
      return element2.forEach(function(el) {
        return bind(el, event, handler, options);
      });
    element2.addEventListener(event, handler, options);
    self2._handlers.push({
      remove: function() {
        return element2.removeEventListener(event, handler, options);
      }
    });
  }
  function triggerChange() {
    triggerEvent("onChange");
  }
  function bindEvents() {
    if (self2.config.wrap) {
      ["open", "close", "toggle", "clear"].forEach(function(evt) {
        Array.prototype.forEach.call(self2.element.querySelectorAll("[data-" + evt + "]"), function(el) {
          return bind(el, "click", self2[evt]);
        });
      });
    }
    if (self2.isMobile) {
      setupMobile();
      return;
    }
    var debouncedResize = debounce(onResize, 50);
    self2._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
    if (self2.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
      bind(self2.daysContainer, "mouseover", function(e) {
        if (self2.config.mode === "range")
          onMouseOver(getEventTarget(e));
      });
    bind(self2._input, "keydown", onKeyDown);
    if (self2.calendarContainer !== void 0) {
      bind(self2.calendarContainer, "keydown", onKeyDown);
    }
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
      var selText = function(e) {
        return getEventTarget(e).select();
      };
      bind(self2.timeContainer, ["increment"], updateTime);
      bind(self2.timeContainer, "blur", updateTime, { capture: true });
      bind(self2.timeContainer, "click", timeIncrement);
      bind([self2.hourElement, self2.minuteElement], ["focus", "click"], selText);
      if (self2.secondElement !== void 0)
        bind(self2.secondElement, "focus", function() {
          return self2.secondElement && self2.secondElement.select();
        });
      if (self2.amPM !== void 0) {
        bind(self2.amPM, "click", function(e) {
          updateTime(e);
        });
      }
    }
    if (self2.config.allowInput) {
      bind(self2._input, "blur", onBlur);
    }
  }
  function jumpToDate(jumpDate, triggerChange2) {
    var jumpTo = jumpDate !== void 0 ? self2.parseDate(jumpDate) : self2.latestSelectedDateObj || (self2.config.minDate && self2.config.minDate > self2.now ? self2.config.minDate : self2.config.maxDate && self2.config.maxDate < self2.now ? self2.config.maxDate : self2.now);
    var oldYear = self2.currentYear;
    var oldMonth = self2.currentMonth;
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
    var eventTarget = getEventTarget(e);
    if (~eventTarget.className.indexOf("arrow"))
      incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
  }
  function incrementNumInput(e, delta, inputElem) {
    var target = e && getEventTarget(e);
    var input = inputElem || target && target.parentNode && target.parentNode.firstChild;
    var event = createEvent("increment");
    event.delta = delta;
    input && input.dispatchEvent(event);
  }
  function build() {
    var fragment = window.document.createDocumentFragment();
    self2.calendarContainer = createElement("div", "flatpickr-calendar");
    self2.calendarContainer.tabIndex = -1;
    if (!self2.config.noCalendar) {
      fragment.appendChild(buildMonthNav());
      self2.innerContainer = createElement("div", "flatpickr-innerContainer");
      if (self2.config.weekNumbers) {
        var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
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
    toggleClass(self2.calendarContainer, "rangeMode", self2.config.mode === "range");
    toggleClass(self2.calendarContainer, "animate", self2.config.animate === true);
    toggleClass(self2.calendarContainer, "multiMonth", self2.config.showMonths > 1);
    self2.calendarContainer.appendChild(fragment);
    var customAppend = self2.config.appendTo !== void 0 && self2.config.appendTo.nodeType !== void 0;
    if (self2.config.inline || self2.config.static) {
      self2.calendarContainer.classList.add(self2.config.inline ? "inline" : "static");
      if (self2.config.inline) {
        if (!customAppend && self2.element.parentNode)
          self2.element.parentNode.insertBefore(self2.calendarContainer, self2._input.nextSibling);
        else if (self2.config.appendTo !== void 0)
          self2.config.appendTo.appendChild(self2.calendarContainer);
      }
      if (self2.config.static) {
        var wrapper = createElement("div", "flatpickr-wrapper");
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
  function createDay(className, date, _dayNumber, i) {
    var dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", className, date.getDate().toString());
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
          toggleClass(dayElement, "startRange", self2.selectedDates[0] && compareDates(date, self2.selectedDates[0], true) === 0);
          toggleClass(dayElement, "endRange", self2.selectedDates[1] && compareDates(date, self2.selectedDates[1], true) === 0);
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
    if (self2.weekNumbers && self2.config.showMonths === 1 && className !== "prevMonthDay" && i % 7 === 6) {
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
    var startMonth = delta > 0 ? 0 : self2.config.showMonths - 1;
    var endMonth = delta > 0 ? self2.config.showMonths : -1;
    for (var m = startMonth; m != endMonth; m += delta) {
      var month = self2.daysContainer.children[m];
      var startIndex = delta > 0 ? 0 : month.children.length - 1;
      var endIndex = delta > 0 ? month.children.length : -1;
      for (var i = startIndex; i != endIndex; i += delta) {
        var c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
          return c;
      }
    }
    return void 0;
  }
  function getNextAvailableDay(current, delta) {
    var givenMonth = current.className.indexOf("Month") === -1 ? current.dateObj.getMonth() : self2.currentMonth;
    var endMonth = delta > 0 ? self2.config.showMonths : -1;
    var loopDelta = delta > 0 ? 1 : -1;
    for (var m = givenMonth - self2.currentMonth; m != endMonth; m += loopDelta) {
      var month = self2.daysContainer.children[m];
      var startIndex = givenMonth - self2.currentMonth === m ? current.$i + delta : delta < 0 ? month.children.length - 1 : 0;
      var numMonthDays = month.children.length;
      for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
        var c = month.children[i];
        if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj) && Math.abs(current.$i - i) >= Math.abs(delta))
          return focusOnDayElem(c);
      }
    }
    self2.changeMonth(loopDelta);
    focusOnDay(getFirstAvailableDay(loopDelta), 0);
    return void 0;
  }
  function focusOnDay(current, offset2) {
    var activeElement = getClosestActiveElement();
    var dayFocused = isInView(activeElement || document.body);
    var startElem = current !== void 0 ? current : dayFocused ? activeElement : self2.selectedDateElem !== void 0 && isInView(self2.selectedDateElem) ? self2.selectedDateElem : self2.todayDateElem !== void 0 && isInView(self2.todayDateElem) ? self2.todayDateElem : getFirstAvailableDay(offset2 > 0 ? 1 : -1);
    if (startElem === void 0) {
      self2._input.focus();
    } else if (!dayFocused) {
      focusOnDayElem(startElem);
    } else {
      getNextAvailableDay(startElem, offset2);
    }
  }
  function buildMonthDays(year, month) {
    var firstOfMonth = (new Date(year, month, 1).getDay() - self2.l10n.firstDayOfWeek + 7) % 7;
    var prevMonthDays = self2.utils.getDaysInMonth((month - 1 + 12) % 12, year);
    var daysInMonth = self2.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self2.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
    var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
    for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
    }
    for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
    }
    for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth && (self2.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
      days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
    }
    var dayContainer = createElement("div", "dayContainer");
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
    var frag = document.createDocumentFragment();
    for (var i = 0; i < self2.config.showMonths; i++) {
      var d = new Date(self2.currentYear, self2.currentMonth, 1);
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
    var shouldBuildMonth = function(month2) {
      if (self2.config.minDate !== void 0 && self2.currentYear === self2.config.minDate.getFullYear() && month2 < self2.config.minDate.getMonth()) {
        return false;
      }
      return !(self2.config.maxDate !== void 0 && self2.currentYear === self2.config.maxDate.getFullYear() && month2 > self2.config.maxDate.getMonth());
    };
    self2.monthsDropdownContainer.tabIndex = -1;
    self2.monthsDropdownContainer.innerHTML = "";
    for (var i = 0; i < 12; i++) {
      if (!shouldBuildMonth(i))
        continue;
      var month = createElement("option", "flatpickr-monthDropdown-month");
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
    var container = createElement("div", "flatpickr-month");
    var monthNavFragment = window.document.createDocumentFragment();
    var monthElement;
    if (self2.config.showMonths > 1 || self2.config.monthSelectorType === "static") {
      monthElement = createElement("span", "cur-month");
    } else {
      self2.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
      self2.monthsDropdownContainer.setAttribute("aria-label", self2.l10n.monthAriaLabel);
      bind(self2.monthsDropdownContainer, "change", function(e) {
        var target = getEventTarget(e);
        var selectedMonth = parseInt(target.value, 10);
        self2.changeMonth(selectedMonth - self2.currentMonth);
        triggerEvent("onMonthChange");
      });
      buildMonthSwitch();
      monthElement = self2.monthsDropdownContainer;
    }
    var yearInput = createNumberInput("cur-year", { tabindex: "-1" });
    var yearElement = yearInput.getElementsByTagName("input")[0];
    yearElement.setAttribute("aria-label", self2.l10n.yearAriaLabel);
    if (self2.config.minDate) {
      yearElement.setAttribute("min", self2.config.minDate.getFullYear().toString());
    }
    if (self2.config.maxDate) {
      yearElement.setAttribute("max", self2.config.maxDate.getFullYear().toString());
      yearElement.disabled = !!self2.config.minDate && self2.config.minDate.getFullYear() === self2.config.maxDate.getFullYear();
    }
    var currentMonth = createElement("div", "flatpickr-current-month");
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
    for (var m = self2.config.showMonths; m--; ) {
      var month = buildMonth();
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
      get: function() {
        return self2.__hidePrevMonthArrow;
      },
      set: function(bool) {
        if (self2.__hidePrevMonthArrow !== bool) {
          toggleClass(self2.prevMonthNav, "flatpickr-disabled", bool);
          self2.__hidePrevMonthArrow = bool;
        }
      }
    });
    Object.defineProperty(self2, "_hideNextMonthArrow", {
      get: function() {
        return self2.__hideNextMonthArrow;
      },
      set: function(bool) {
        if (self2.__hideNextMonthArrow !== bool) {
          toggleClass(self2.nextMonthNav, "flatpickr-disabled", bool);
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
    var defaults3 = getDefaultHours(self2.config);
    self2.timeContainer = createElement("div", "flatpickr-time");
    self2.timeContainer.tabIndex = -1;
    var separator = createElement("span", "flatpickr-time-separator", ":");
    var hourInput = createNumberInput("flatpickr-hour", {
      "aria-label": self2.l10n.hourAriaLabel
    });
    self2.hourElement = hourInput.getElementsByTagName("input")[0];
    var minuteInput = createNumberInput("flatpickr-minute", {
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
      var secondInput = createNumberInput("flatpickr-second");
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
    for (var i = self2.config.showMonths; i--; ) {
      var container = createElement("div", "flatpickr-weekdaycontainer");
      self2.weekdayContainer.appendChild(container);
    }
    updateWeekdays();
    return self2.weekdayContainer;
  }
  function updateWeekdays() {
    if (!self2.weekdayContainer) {
      return;
    }
    var firstDayOfWeek = self2.l10n.firstDayOfWeek;
    var weekdays = __spreadArrays(self2.l10n.weekdays.shorthand);
    if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
      weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
    }
    for (var i = self2.config.showMonths; i--; ) {
      self2.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
    }
  }
  function buildWeeks() {
    self2.calendarContainer.classList.add("hasWeeks");
    var weekWrapper = createElement("div", "flatpickr-weekwrapper");
    weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self2.l10n.weekAbbreviation));
    var weekNumbers = createElement("div", "flatpickr-weeks");
    weekWrapper.appendChild(weekNumbers);
    return {
      weekWrapper,
      weekNumbers
    };
  }
  function changeMonth(value, isOffset) {
    if (isOffset === void 0) {
      isOffset = true;
    }
    var delta = isOffset ? value : value - self2.currentMonth;
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
  function clear(triggerChangeEvent, toInitial) {
    if (triggerChangeEvent === void 0) {
      triggerChangeEvent = true;
    }
    if (toInitial === void 0) {
      toInitial = true;
    }
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
      var _a = getDefaultHours(self2.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
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
    for (var i = self2._handlers.length; i--; ) {
      self2._handlers[i].remove();
    }
    self2._handlers = [];
    if (self2.mobileInput) {
      if (self2.mobileInput.parentNode)
        self2.mobileInput.parentNode.removeChild(self2.mobileInput);
      self2.mobileInput = void 0;
    } else if (self2.calendarContainer && self2.calendarContainer.parentNode) {
      if (self2.config.static && self2.calendarContainer.parentNode) {
        var wrapper = self2.calendarContainer.parentNode;
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
    ].forEach(function(k) {
      try {
        delete self2[k];
      } catch (_) {
      }
    });
  }
  function isCalendarElem(elem) {
    return self2.calendarContainer.contains(elem);
  }
  function documentClick(e) {
    if (self2.isOpen && !self2.config.inline) {
      var eventTarget_1 = getEventTarget(e);
      var isCalendarElement = isCalendarElem(eventTarget_1);
      var isInput = eventTarget_1 === self2.input || eventTarget_1 === self2.altInput || self2.element.contains(eventTarget_1) || e.path && e.path.indexOf && (~e.path.indexOf(self2.input) || ~e.path.indexOf(self2.altInput));
      var lostFocus = !isInput && !isCalendarElement && !isCalendarElem(e.relatedTarget);
      var isIgnored = !self2.config.ignoredFocusElements.some(function(elem) {
        return elem.contains(eventTarget_1);
      });
      if (lostFocus && isIgnored) {
        if (self2.config.allowInput) {
          self2.setDate(self2._input.value, false, self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
        }
        if (self2.timeContainer !== void 0 && self2.minuteElement !== void 0 && self2.hourElement !== void 0 && self2.input.value !== "" && self2.input.value !== void 0) {
          updateTime();
        }
        self2.close();
        if (self2.config && self2.config.mode === "range" && self2.selectedDates.length === 1)
          self2.clear(false);
      }
    }
  }
  function changeYear(newYear) {
    if (!newYear || self2.config.minDate && newYear < self2.config.minDate.getFullYear() || self2.config.maxDate && newYear > self2.config.maxDate.getFullYear())
      return;
    var newYearNum = newYear, isNewYear = self2.currentYear !== newYearNum;
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
  function isEnabled(date, timeless) {
    var _a;
    if (timeless === void 0) {
      timeless = true;
    }
    var dateToCheck = self2.parseDate(date, void 0, timeless);
    if (self2.config.minDate && dateToCheck && compareDates(dateToCheck, self2.config.minDate, timeless !== void 0 ? timeless : !self2.minDateHasTime) < 0 || self2.config.maxDate && dateToCheck && compareDates(dateToCheck, self2.config.maxDate, timeless !== void 0 ? timeless : !self2.maxDateHasTime) > 0)
      return false;
    if (!self2.config.enable && self2.config.disable.length === 0)
      return true;
    if (dateToCheck === void 0)
      return false;
    var bool = !!self2.config.enable, array = (_a = self2.config.enable) !== null && _a !== void 0 ? _a : self2.config.disable;
    for (var i = 0, d = void 0; i < array.length; i++) {
      d = array[i];
      if (typeof d === "function" && d(dateToCheck))
        return bool;
      else if (d instanceof Date && dateToCheck !== void 0 && d.getTime() === dateToCheck.getTime())
        return bool;
      else if (typeof d === "string") {
        var parsed = self2.parseDate(d, void 0, true);
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
    var isInput = e.target === self2._input;
    var valueChanged = self2._input.value.trimEnd() !== getDateStr();
    if (isInput && valueChanged && !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
      self2.setDate(self2._input.value, true, e.target === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
    }
  }
  function onKeyDown(e) {
    var eventTarget = getEventTarget(e);
    var isInput = self2.config.wrap ? element.contains(eventTarget) : eventTarget === self2._input;
    var allowInput = self2.config.allowInput;
    var allowKeydown = self2.isOpen && (!allowInput || !isInput);
    var allowInlineKeydown = self2.config.inline && isInput && !allowInput;
    if (e.keyCode === 13 && isInput) {
      if (allowInput) {
        self2.setDate(self2._input.value, true, eventTarget === self2.altInput ? self2.config.altFormat : self2.config.dateFormat);
        self2.close();
        return eventTarget.blur();
      } else {
        self2.open();
      }
    } else if (isCalendarElem(eventTarget) || allowKeydown || allowInlineKeydown) {
      var isTimeObj = !!self2.timeContainer && self2.timeContainer.contains(eventTarget);
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
            var activeElement = getClosestActiveElement();
            if (self2.daysContainer !== void 0 && (allowInput === false || activeElement && isInView(activeElement))) {
              var delta_1 = e.keyCode === 39 ? 1 : -1;
              if (!e.ctrlKey)
                focusOnDay(void 0, delta_1);
              else {
                e.stopPropagation();
                changeMonth(delta_1);
                focusOnDay(getFirstAvailableDay(1), 0);
              }
            }
          } else if (self2.hourElement)
            self2.hourElement.focus();
          break;
        case 38:
        case 40:
          e.preventDefault();
          var delta = e.keyCode === 40 ? 1 : -1;
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
            var elems = [
              self2.hourElement,
              self2.minuteElement,
              self2.secondElement,
              self2.amPM
            ].concat(self2.pluginElements).filter(function(x) {
              return x;
            });
            var i = elems.indexOf(eventTarget);
            if (i !== -1) {
              var target = elems[i + (e.shiftKey ? -1 : 1)];
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
  function onMouseOver(elem, cellClass) {
    if (cellClass === void 0) {
      cellClass = "flatpickr-day";
    }
    if (self2.selectedDates.length !== 1 || elem && (!elem.classList.contains(cellClass) || elem.classList.contains("flatpickr-disabled")))
      return;
    var hoverDate = elem ? elem.dateObj.getTime() : self2.days.firstElementChild.dateObj.getTime(), initialDate = self2.parseDate(self2.selectedDates[0], void 0, true).getTime(), rangeStartDate = Math.min(hoverDate, self2.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self2.selectedDates[0].getTime());
    var containsDisabled = false;
    var minRange = 0, maxRange = 0;
    for (var t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
      if (!isEnabled(new Date(t), true)) {
        containsDisabled = containsDisabled || t > rangeStartDate && t < rangeEndDate;
        if (t < initialDate && (!minRange || t > minRange))
          minRange = t;
        else if (t > initialDate && (!maxRange || t < maxRange))
          maxRange = t;
      }
    }
    var hoverableCells = Array.from(self2.rContainer.querySelectorAll("*:nth-child(-n+" + self2.config.showMonths + ") > ." + cellClass));
    hoverableCells.forEach(function(dayElem) {
      var date = dayElem.dateObj;
      var timestamp = date.getTime();
      var outOfRange = minRange > 0 && timestamp < minRange || maxRange > 0 && timestamp > maxRange;
      if (outOfRange) {
        dayElem.classList.add("notAllowed");
        ["inRange", "startRange", "endRange"].forEach(function(c) {
          dayElem.classList.remove(c);
        });
        return;
      } else if (containsDisabled && !outOfRange)
        return;
      ["startRange", "inRange", "endRange", "notAllowed"].forEach(function(c) {
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
    });
  }
  function onResize() {
    if (self2.isOpen && !self2.config.static && !self2.config.inline)
      positionCalendar();
  }
  function open(e, positionElement) {
    if (positionElement === void 0) {
      positionElement = self2._positionElement;
    }
    if (self2.isMobile === true) {
      if (e) {
        e.preventDefault();
        var eventTarget = getEventTarget(e);
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
    var wasOpen = self2.isOpen;
    self2.isOpen = true;
    if (!wasOpen) {
      self2.calendarContainer.classList.add("open");
      self2._input.classList.add("active");
      triggerEvent("onOpen");
      positionCalendar(positionElement);
    }
    if (self2.config.enableTime === true && self2.config.noCalendar === true) {
      if (self2.config.allowInput === false && (e === void 0 || !self2.timeContainer.contains(e.relatedTarget))) {
        setTimeout(function() {
          return self2.hourElement.select();
        }, 50);
      }
    }
  }
  function minMaxDateSetter(type) {
    return function(date) {
      var dateObj = self2.config["_" + type + "Date"] = self2.parseDate(date, self2.config.dateFormat);
      var inverseDateObj = self2.config["_" + (type === "min" ? "max" : "min") + "Date"];
      if (dateObj !== void 0) {
        self2[type === "min" ? "minDateHasTime" : "maxDateHasTime"] = dateObj.getHours() > 0 || dateObj.getMinutes() > 0 || dateObj.getSeconds() > 0;
      }
      if (self2.selectedDates) {
        self2.selectedDates = self2.selectedDates.filter(function(d) {
          return isEnabled(d);
        });
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
    var boolOpts = [
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
    var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
    var formats2 = {};
    self2.config.parseDate = userConfig.parseDate;
    self2.config.formatDate = userConfig.formatDate;
    Object.defineProperty(self2.config, "enable", {
      get: function() {
        return self2.config._enable;
      },
      set: function(dates) {
        self2.config._enable = parseDateRules(dates);
      }
    });
    Object.defineProperty(self2.config, "disable", {
      get: function() {
        return self2.config._disable;
      },
      set: function(dates) {
        self2.config._disable = parseDateRules(dates);
      }
    });
    var timeMode = userConfig.mode === "time";
    if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
      var defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
      formats2.dateFormat = userConfig.noCalendar || timeMode ? "H:i" + (userConfig.enableSeconds ? ":S" : "") : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
    }
    if (userConfig.altInput && (userConfig.enableTime || timeMode) && !userConfig.altFormat) {
      var defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
      formats2.altFormat = userConfig.noCalendar || timeMode ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K") : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
    }
    Object.defineProperty(self2.config, "minDate", {
      get: function() {
        return self2.config._minDate;
      },
      set: minMaxDateSetter("min")
    });
    Object.defineProperty(self2.config, "maxDate", {
      get: function() {
        return self2.config._maxDate;
      },
      set: minMaxDateSetter("max")
    });
    var minMaxTimeSetter = function(type) {
      return function(val) {
        self2.config[type === "min" ? "_minTime" : "_maxTime"] = self2.parseDate(val, "H:i:S");
      };
    };
    Object.defineProperty(self2.config, "minTime", {
      get: function() {
        return self2.config._minTime;
      },
      set: minMaxTimeSetter("min")
    });
    Object.defineProperty(self2.config, "maxTime", {
      get: function() {
        return self2.config._maxTime;
      },
      set: minMaxTimeSetter("max")
    });
    if (userConfig.mode === "time") {
      self2.config.noCalendar = true;
      self2.config.enableTime = true;
    }
    Object.assign(self2.config, formats2, userConfig);
    for (var i = 0; i < boolOpts.length; i++)
      self2.config[boolOpts[i]] = self2.config[boolOpts[i]] === true || self2.config[boolOpts[i]] === "true";
    HOOKS.filter(function(hook) {
      return self2.config[hook] !== void 0;
    }).forEach(function(hook) {
      self2.config[hook] = arrayify(self2.config[hook] || []).map(bindToInstance);
    });
    self2.isMobile = !self2.config.disableMobile && !self2.config.inline && self2.config.mode === "single" && !self2.config.disable.length && !self2.config.enable && !self2.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    for (var i = 0; i < self2.config.plugins.length; i++) {
      var pluginConf = self2.config.plugins[i](self2) || {};
      for (var key in pluginConf) {
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
      self2.config.errorHandler(new Error("flatpickr: invalid locale " + self2.config.locale));
    self2.l10n = __assign(__assign({}, flatpickr.l10ns.default), typeof self2.config.locale === "object" ? self2.config.locale : self2.config.locale !== "default" ? flatpickr.l10ns[self2.config.locale] : void 0);
    tokenRegex.D = "(" + self2.l10n.weekdays.shorthand.join("|") + ")";
    tokenRegex.l = "(" + self2.l10n.weekdays.longhand.join("|") + ")";
    tokenRegex.M = "(" + self2.l10n.months.shorthand.join("|") + ")";
    tokenRegex.F = "(" + self2.l10n.months.longhand.join("|") + ")";
    tokenRegex.K = "(" + self2.l10n.amPM[0] + "|" + self2.l10n.amPM[1] + "|" + self2.l10n.amPM[0].toLowerCase() + "|" + self2.l10n.amPM[1].toLowerCase() + ")";
    var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
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
    var positionElement = customPositionElement || self2._positionElement;
    var calendarHeight = Array.prototype.reduce.call(self2.calendarContainer.children, function(acc, child) {
      return acc + child.offsetHeight;
    }, 0), calendarWidth = self2.calendarContainer.offsetWidth, configPos = self2.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" || configPosVertical !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;
    var top2 = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
    toggleClass(self2.calendarContainer, "arrowTop", !showOnTop);
    toggleClass(self2.calendarContainer, "arrowBottom", showOnTop);
    if (self2.config.inline)
      return;
    var left2 = window.pageXOffset + inputBounds.left;
    var isCenter = false;
    var isRight = false;
    if (configPosHorizontal === "center") {
      left2 -= (calendarWidth - inputBounds.width) / 2;
      isCenter = true;
    } else if (configPosHorizontal === "right") {
      left2 -= calendarWidth - inputBounds.width;
      isRight = true;
    }
    toggleClass(self2.calendarContainer, "arrowLeft", !isCenter && !isRight);
    toggleClass(self2.calendarContainer, "arrowCenter", isCenter);
    toggleClass(self2.calendarContainer, "arrowRight", isRight);
    var right2 = window.document.body.offsetWidth - (window.pageXOffset + inputBounds.right);
    var rightMost = left2 + calendarWidth > window.document.body.offsetWidth;
    var centerMost = right2 + calendarWidth > window.document.body.offsetWidth;
    toggleClass(self2.calendarContainer, "rightMost", rightMost);
    if (self2.config.static)
      return;
    self2.calendarContainer.style.top = top2 + "px";
    if (!rightMost) {
      self2.calendarContainer.style.left = left2 + "px";
      self2.calendarContainer.style.right = "auto";
    } else if (!centerMost) {
      self2.calendarContainer.style.left = "auto";
      self2.calendarContainer.style.right = right2 + "px";
    } else {
      var doc = getDocumentStyleSheet();
      if (doc === void 0)
        return;
      var bodyWidth = window.document.body.offsetWidth;
      var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
      var centerBefore = ".flatpickr-calendar.centerMost:before";
      var centerAfter = ".flatpickr-calendar.centerMost:after";
      var centerIndex = doc.cssRules.length;
      var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
      toggleClass(self2.calendarContainer, "rightMost", false);
      toggleClass(self2.calendarContainer, "centerMost", true);
      doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
      self2.calendarContainer.style.left = centerLeft + "px";
      self2.calendarContainer.style.right = "auto";
    }
  }
  function getDocumentStyleSheet() {
    var editableSheet = null;
    for (var i = 0; i < document.styleSheets.length; i++) {
      var sheet = document.styleSheets[i];
      if (!sheet.cssRules)
        continue;
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
    var style = document.createElement("style");
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
    var isSelectable = function(day) {
      return day.classList && day.classList.contains("flatpickr-day") && !day.classList.contains("flatpickr-disabled") && !day.classList.contains("notAllowed");
    };
    var t = findParent(getEventTarget(e), isSelectable);
    if (t === void 0)
      return;
    var target = t;
    var selectedDate = self2.latestSelectedDateObj = new Date(target.dateObj.getTime());
    var shouldChangeMonth = (selectedDate.getMonth() < self2.currentMonth || selectedDate.getMonth() > self2.currentMonth + self2.config.showMonths - 1) && self2.config.mode !== "range";
    self2.selectedDateElem = target;
    if (self2.config.mode === "single")
      self2.selectedDates = [selectedDate];
    else if (self2.config.mode === "multiple") {
      var selectedIndex = isDateSelected(selectedDate);
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
        self2.selectedDates.sort(function(a, b) {
          return a.getTime() - b.getTime();
        });
    }
    setHoursFromInputs();
    if (shouldChangeMonth) {
      var isNewYear = self2.currentYear !== selectedDate.getFullYear();
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
      var single = self2.config.mode === "single" && !self2.config.enableTime;
      var range = self2.config.mode === "range" && self2.selectedDates.length === 2 && !self2.config.enableTime;
      if (single || range) {
        focusAndClose();
      }
    }
    triggerChange();
  }
  var CALLBACKS = {
    locale: [setupLocale, updateWeekdays],
    showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
    minDate: [jumpToDate],
    maxDate: [jumpToDate],
    positionElement: [updatePositionElement],
    clickOpens: [
      function() {
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
      for (var key in option2) {
        if (CALLBACKS[key] !== void 0)
          CALLBACKS[key].forEach(function(x) {
            return x();
          });
      }
    } else {
      self2.config[option2] = value;
      if (CALLBACKS[option2] !== void 0)
        CALLBACKS[option2].forEach(function(x) {
          return x();
        });
      else if (HOOKS.indexOf(option2) > -1)
        self2.config[option2] = arrayify(value);
    }
    self2.redraw();
    updateValue(true);
  }
  function setSelectedDate(inputDate, format2) {
    var dates = [];
    if (inputDate instanceof Array)
      dates = inputDate.map(function(d) {
        return self2.parseDate(d, format2);
      });
    else if (inputDate instanceof Date || typeof inputDate === "number")
      dates = [self2.parseDate(inputDate, format2)];
    else if (typeof inputDate === "string") {
      switch (self2.config.mode) {
        case "single":
        case "time":
          dates = [self2.parseDate(inputDate, format2)];
          break;
        case "multiple":
          dates = inputDate.split(self2.config.conjunction).map(function(date) {
            return self2.parseDate(date, format2);
          });
          break;
        case "range":
          dates = inputDate.split(self2.l10n.rangeSeparator).map(function(date) {
            return self2.parseDate(date, format2);
          });
          break;
        default:
          break;
      }
    } else
      self2.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
    self2.selectedDates = self2.config.allowInvalidPreload ? dates : dates.filter(function(d) {
      return d instanceof Date && isEnabled(d, false);
    });
    if (self2.config.mode === "range")
      self2.selectedDates.sort(function(a, b) {
        return a.getTime() - b.getTime();
      });
  }
  function setDate(date, triggerChange2, format2) {
    if (triggerChange2 === void 0) {
      triggerChange2 = false;
    }
    if (format2 === void 0) {
      format2 = self2.config.dateFormat;
    }
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
    return arr.slice().map(function(rule) {
      if (typeof rule === "string" || typeof rule === "number" || rule instanceof Date) {
        return self2.parseDate(rule, void 0, true);
      } else if (rule && typeof rule === "object" && rule.from && rule.to)
        return {
          from: self2.parseDate(rule.from, void 0),
          to: self2.parseDate(rule.to, void 0)
        };
      return rule;
    }).filter(function(x) {
      return x;
    });
  }
  function setupDates() {
    self2.selectedDates = [];
    self2.now = self2.parseDate(self2.config.now) || new Date();
    var preloadedDate = self2.config.defaultDate || ((self2.input.nodeName === "INPUT" || self2.input.nodeName === "TEXTAREA") && self2.input.placeholder && self2.input.value === self2.input.placeholder ? null : self2.input.value);
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
    updatePositionElement();
  }
  function updatePositionElement() {
    self2._positionElement = self2.config.positionElement || self2._input;
  }
  function setupMobile() {
    var inputType = self2.config.enableTime ? self2.config.noCalendar ? "time" : "datetime-local" : "date";
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
    bind(self2.mobileInput, "change", function(e) {
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
    var hooks = self2.config[event];
    if (hooks !== void 0 && hooks.length > 0) {
      for (var i = 0; hooks[i] && i < hooks.length; i++)
        hooks[i](self2.selectedDates, self2.input.value, self2, data);
    }
    if (event === "onChange") {
      self2.input.dispatchEvent(createEvent("change"));
      self2.input.dispatchEvent(createEvent("input"));
    }
  }
  function createEvent(name) {
    var e = document.createEvent("Event");
    e.initEvent(name, true, true);
    return e;
  }
  function isDateSelected(date) {
    for (var i = 0; i < self2.selectedDates.length; i++) {
      var selectedDate = self2.selectedDates[i];
      if (selectedDate instanceof Date && compareDates(selectedDate, date) === 0)
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
    self2.yearElements.forEach(function(yearElement, i) {
      var d = new Date(self2.currentYear, self2.currentMonth, 1);
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
  function getDateStr(specificFormat) {
    var format2 = specificFormat || (self2.config.altInput ? self2.config.altFormat : self2.config.dateFormat);
    return self2.selectedDates.map(function(dObj) {
      return self2.formatDate(dObj, format2);
    }).filter(function(d, i, arr) {
      return self2.config.mode !== "range" || self2.config.enableTime || arr.indexOf(d) === i;
    }).join(self2.config.mode !== "range" ? self2.config.conjunction : self2.l10n.rangeSeparator);
  }
  function updateValue(triggerChange2) {
    if (triggerChange2 === void 0) {
      triggerChange2 = true;
    }
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
    var eventTarget = getEventTarget(e);
    var isPrevMonth = self2.prevMonthNav.contains(eventTarget);
    var isNextMonth = self2.nextMonthNav.contains(eventTarget);
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
    var isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
    if (self2.amPM !== void 0 && eventTarget === self2.amPM) {
      self2.amPM.textContent = self2.l10n.amPM[int(self2.amPM.textContent === self2.l10n.amPM[0])];
    }
    var min2 = parseFloat(input.getAttribute("min")), max2 = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta || (isKeyDown ? e.which === 38 ? 1 : -1 : 0);
    var newValue = curValue + step * delta;
    if (typeof input.value !== "undefined" && input.value.length === 2) {
      var isHourElem = input === self2.hourElement, isMinuteElem = input === self2.minuteElement;
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
  var nodes = Array.prototype.slice.call(nodeList).filter(function(x) {
    return x instanceof HTMLElement;
  });
  var instances = [];
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
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
  en: __assign({}, default_default),
  default: __assign({}, default_default)
};
flatpickr.localize = function(l10n) {
  flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = function(config) {
  flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
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
  ordinal: function(nth) {
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
var version = "1.15.0";
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
function toggleClass2(el, name, state) {
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
var defaults2 = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    for (var option2 in defaults2) {
      if (defaults2.hasOwnProperty(option2) && !(option2 in plugin)) {
        plugin[option2] = defaults2[option2];
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
if (documentExists && !ChromeForAndroid) {
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
        toggleClass2(dragEl, options.chosenClass, true);
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
      !fallback && toggleClass2(dragEl, options.dragClass, false);
      toggleClass2(dragEl, options.ghostClass, true);
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
      toggleClass2(ghostEl, options.ghostClass, false);
      toggleClass2(ghostEl, options.fallbackClass, true);
      toggleClass2(ghostEl, options.dragClass, true);
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
      cloneEl.removeAttribute("id");
      cloneEl.draggable = false;
      cloneEl.style["will-change"] = "";
      this._hideClone();
      toggleClass2(cloneEl, this.options.chosenClass, false);
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
    !fallback && toggleClass2(dragEl, options.dragClass, true);
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
          toggleClass2(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass2(dragEl, options.ghostClass, true);
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
          if (elLastChild && elLastChild.nextSibling) {
            el.insertBefore(dragEl, elLastChild.nextSibling);
          } else {
            el.appendChild(dragEl);
          }
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
          toggleClass2(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }
        toggleClass2(dragEl, this.options.chosenClass, false);
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
  toggleClass: toggleClass2,
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
      const sourceLocation = window.location.protocol + "//" + window.location.host;
      const url = new URL(button.getAttribute("href"), sourceLocation);
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
    if (editButton) {
      editButton.setAttribute("href", editButton.getAttribute("href").replace(":id", item.blobId));
    }
    const oldThumbnail = newItem.querySelector(".formstrap-thumbnail");
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
    return ["idCheckbox", "item", "form", "selectButton", "placeholder", "count", "search", "searchId"];
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
    this.search("");
    this.triggerFormSubmission();
  }
  inputChange(event) {
    this.handleIdsUpdate(event.target);
    this.updateCount();
  }
  hidePlaceholder() {
    this.placeholderTarget.classList.add("d-none");
  }
  search(string) {
    const search = this.searchTarget.querySelector("input[name='search']");
    search.value = string;
    this.searchTarget.requestSubmit();
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
    this.handleSearchdIdsUpdate();
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
    document.dispatchEvent(
      new CustomEvent(
        "mediaSelectionSubmitted",
        {
          detail: {
            name: this.element.dataset.name,
            items: this.renderItemsForEvent()
          }
        }
      )
    );
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
      thumbnail: element ? element.querySelector(".formstrap-thumbnail") : ""
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
  handleSearchdIdsUpdate() {
    this.deleteSearchIdInputs();
    this.createSearchIdInputs();
  }
  deleteSearchIdInputs() {
    for (const searchId of this.searchIdTargets) {
      searchId.remove();
    }
  }
  createSearchIdInputs() {
    for (const id of this.idsValue) {
      this.createSearchIdInput(id);
    }
  }
  createSearchIdInput(value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "ids[]";
    input.setAttribute("data-media-modal-target", "searchId");
    input.value = value;
    this.searchTarget.appendChild(input);
  }
};

// app/assets/javascripts/formstrap/controllers/nested_preview_controller.js
var nested_preview_controller_default = class extends Controller {
  static get targets() {
    return ["fields", "preview", "previewContent"];
  }
  static get values() {
    return {
      url: String
    };
  }
  connect() {
    this.requestPreview();
  }
  requestPreview() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.urlValue, false);
    const formData = this.buildFormData();
    xhr.send(formData);
    this.handleRequest(xhr);
  }
  handleRequest(request) {
    if (request.status === 200) {
      this.updatePreview(request.responseText);
    } else {
      console.error("Upload failed");
    }
  }
  buildFormData() {
    const fields = this.fieldsTarget;
    const formData = new FormData();
    const regex = /page\[blocks_attributes\]\[\d+\]/g;
    const replacement = "block";
    const formElements = fields.querySelectorAll('input[name]:not([name$="[id]"]), select[name]:not([name$="[id]"]), textarea[name]:not([name$="[id]"]), button[name]:not([name$="[id]"])');
    formElements.forEach(function(element) {
      const currentName = element.getAttribute("name");
      const newName = currentName.replace(regex, replacement);
      formData.append(newName, element.value);
    });
    formData.append("authenticity_token", this.getAuthenticityToken());
    return formData;
  }
  updatePreview(html) {
    const shadowRoot = this.previewShadowRoot();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    shadowRoot.innerHTML = "";
    shadowRoot.appendChild(wrapper);
  }
  previewShadowRoot() {
    const shadowRoot = this.previewContentTarget.shadowRoot;
    if (shadowRoot !== null) {
      return shadowRoot;
    } else {
      return this.previewContentTarget.attachShadow({ mode: "open" });
    }
  }
  getAuthenticityToken() {
    const tokenTag = document.querySelector('meta[name="csrf-token"]');
    return tokenTag.getAttribute("content");
  }
};

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

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
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
function getComputedStyle(element) {
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
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css2 = getComputedStyle(currentNode);
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
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
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
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
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
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || "";
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
function getViewportRect(element, strategy) {
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
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
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
  if (getComputedStyle(body || html).direction === "rtl") {
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
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
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
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
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
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
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
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
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
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
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
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
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
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
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
          var _getComputedStyle = getComputedStyle(popper2), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
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

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

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
    createPopper(button, popup);
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

// app/assets/javascripts/formstrap/controllers/preview_controller.js
var preview_controller_default = class extends Controller {
  connect() {
    this.button = this.element;
    this.button.addEventListener("click", (event) => {
      event.preventDefault();
      this.requestPreview();
    });
  }
  requestPreview() {
    const form = this.buildFakeForm();
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
  buildFakeForm() {
    const form = this.form().cloneNode(true);
    const idInputs = form.querySelectorAll('input[name$="[id]"], select[name$="[id]"], textarea[name$="[id]"], button[name$="[id]"]');
    idInputs.forEach((input) => {
      input.value = "";
    });
    form.setAttribute("action", this.urlValue);
    form.setAttribute("target", "_blank");
    const authenticityTokenInput = form.querySelector('input[name="authenticity_token"]');
    authenticityTokenInput.value = this.getAuthenticityToken();
    form.querySelector('input[name="_method"]')?.remove();
    form.setAttribute("method", "POST");
    return form;
  }
  getAuthenticityToken() {
    const tokenTag = document.querySelector('meta[name="csrf-token"]');
    return tokenTag.getAttribute("content");
  }
  form() {
    return this.button.closest("form");
  }
};
__publicField(preview_controller_default, "values", {
  url: String
});

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
      draggable: ".formstrap-repeater-row",
      handle: ".formstrap-repeater-row-handle",
      onEnd: () => {
        this.resetIndices();
        this.resetPositions();
      }
    });
    this.toggleEmpty();
  }
  resetButtonIndices(event) {
    const row = event.target.closest(".formstrap-repeater-row");
    const index2 = this.containsRow(row) ? row.dataset.rowIndex : "";
    this.updatePopupButtonIndices(index2);
  }
  containsRow(row) {
    return this.rowTargets.includes(row);
  }
  updatePopupButtonIndices(index2) {
    const popup = document.querySelector(`[data-popup-target="popup"][data-popup-id="repeater-buttons-${this.idValue}"]`);
    const buttons = popup.querySelectorAll('[data-popup-target="button"]');
    buttons.forEach((button) => {
      button.dataset.rowIndex = index2;
    });
  }
  addRow(event) {
    event.preventDefault();
    const button = event.target;
    const templateName = button.dataset.templateName;
    const rowIndex = button.dataset.rowIndex;
    let template = this.getTemplate(templateName).content.cloneNode(true);
    template = this.replaceIdsWithTimestamps(template);
    if (rowIndex) {
      const row = this.rowTargets[rowIndex];
      this.listTarget.insertBefore(template, row.nextSibling);
    } else {
      this.listTarget.insertBefore(template, this.footerTarget);
    }
    this.resetIndices();
    this.resetPositions();
    this.toggleEmpty();
  }
  removeRow(event) {
    event.preventDefault();
    const row = event.target.closest(".formstrap-repeater-row");
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
    const pattern = "rrrrrrrrr";
    const replacement = new Date().getTime().toString();
    template.querySelectorAll(`input[id*="${pattern}"], select[id*="${pattern}"], textarea[id*="${pattern}"], button[id*="${pattern}"]`).forEach((node) => {
      const idValue = node.getAttribute("id");
      node.setAttribute("id", idValue.replace(pattern, replacement));
    });
    template.querySelectorAll(`label[for*="${pattern}"]`).forEach((node) => {
      const forValue = node.getAttribute("for");
      node.setAttribute("for", forValue.replace(pattern, replacement));
    });
    template.querySelectorAll(`input[name*="${pattern}"], select[name*="${pattern}"], textarea[name*="${pattern}"], button[name*="${pattern}"]`).forEach((node) => {
      const nameValue = node.getAttribute("name");
      node.setAttribute("name", nameValue.replace(pattern, replacement));
    });
    template.querySelectorAll(`div[data-bs-target="#offcanvas-${pattern}"]`).forEach((node) => {
      const targetValue = node.getAttribute("data-bs-target");
      node.setAttribute("data-bs-target", targetValue.replace(pattern, replacement));
    });
    template.querySelectorAll(`.offcanvas[id="offcanvas-${pattern}"]`).forEach((node) => {
      const idValue = node.getAttribute("id");
      node.setAttribute("id", idValue.replace(pattern, replacement));
    });
    return template;
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
    Stimulus.register("date-range", date_range_controller_default);
    Stimulus.register("dropzone", dropzone_controller_default);
    Stimulus.register("file-preview", file_preview_controller_default);
    Stimulus.register("flatpickr", flatpickr_controller_default);
    Stimulus.register("infinite-scroller", infinite_scroller_controller_default);
    Stimulus.register("media", media_controller_default);
    Stimulus.register("media-modal", media_modal_controller_default);
    Stimulus.register("nested-preview", nested_preview_controller_default);
    Stimulus.register("popup", popup_controller_default);
    Stimulus.register("preview", preview_controller_default);
    Stimulus.register("redactorx", redactorx_controller_default);
    Stimulus.register("repeater", repeater_controller_default);
    Stimulus.register("select", select_controller_default);
    Stimulus.register("textarea", textarea_controller_default);
  }
};
export {
  Formstrap
};
/*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) */
/*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) */
/**!
 * Sortable 1.15.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
