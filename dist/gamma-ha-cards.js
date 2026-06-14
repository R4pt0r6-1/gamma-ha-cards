/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, Mt = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zt = Symbol(), se = /* @__PURE__ */ new WeakMap();
let Oe = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Mt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = se.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && se.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Re = (o) => new Oe(typeof o == "string" ? o : o + "", void 0, zt), m = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, r, n) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + o[n + 1], o[0]);
  return new Oe(e, o, zt);
}, Be = (o, t) => {
  if (Mt) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = X.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, o.appendChild(i);
  }
}, ae = Mt ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Re(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: je, defineProperty: Ve, getOwnPropertyDescriptor: He, getOwnPropertyNames: We, getOwnPropertySymbols: Ge, getPrototypeOf: Ke } = Object, y = globalThis, ce = y.trustedTypes, qe = ce ? ce.emptyScript : "", et = y.reactiveElementPolyfillSupport, D = (o, t) => o, at = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? qe : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Me = (o, t) => !je(o, t), le = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: Me };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), y.litPropertyMetadata ?? (y.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = le) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Ve(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = He(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: r, set(s) {
      const c = r == null ? void 0 : r.call(this);
      n == null || n.call(this, s), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? le;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Ke(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, i = [...We(e), ...Ge(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(ae(r));
    } else t !== void 0 && e.push(ae(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Be(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const s = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : at).toAttribute(e, i.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, s;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const c = i.getPropertyOptions(r), l = typeof c.converter == "function" ? { fromAttribute: c.converter } : ((n = c.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? c.converter : at;
      this._$Em = r;
      const h = l.fromAttribute(e, c.type);
      this[r] = h ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var s;
    if (t !== void 0) {
      const c = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = c.getPropertyOptions(t)), !((i.hasChanged ?? Me)(n, e) || i.useDefault && i.reflect && n === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(c._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, s] of r) {
        const { wrapped: c } = s, l = this[n];
        c !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, s, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[D("elementProperties")] = /* @__PURE__ */ new Map(), A[D("finalized")] = /* @__PURE__ */ new Map(), et == null || et({ ReactiveElement: A }), (y.reactiveElementVersions ?? (y.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, de = (o) => o, Z = N.trustedTypes, he = Z ? Z.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ze = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Ie = "?" + v, Je = `<${Ie}>`, T = document, R = () => T.createComment(""), B = (o) => o === null || typeof o != "object" && typeof o != "function", It = Array.isArray, Ye = (o) => It(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", it = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, ge = />/g, $ = RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, fe = /"/g, Fe = /^(?:script|style|textarea|title)$/i, Xe = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), a = Xe(1), O = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), me = /* @__PURE__ */ new WeakMap(), k = T.createTreeWalker(T, 129);
function Ue(o, t) {
  if (!It(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return he !== void 0 ? he.createHTML(t) : t;
}
const Ze = (o, t) => {
  const e = o.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = z;
  for (let c = 0; c < e; c++) {
    const l = o[c];
    let h, p, g = -1, b = 0;
    for (; b < l.length && (s.lastIndex = b, p = s.exec(l), p !== null); ) b = s.lastIndex, s === z ? p[1] === "!--" ? s = pe : p[1] !== void 0 ? s = ge : p[2] !== void 0 ? (Fe.test(p[2]) && (r = RegExp("</" + p[2], "g")), s = $) : p[3] !== void 0 && (s = $) : s === $ ? p[0] === ">" ? (s = r ?? z, g = -1) : p[1] === void 0 ? g = -2 : (g = s.lastIndex - p[2].length, h = p[1], s = p[3] === void 0 ? $ : p[3] === '"' ? fe : ue) : s === fe || s === ue ? s = $ : s === pe || s === ge ? s = z : (s = $, r = void 0);
    const x = s === $ && o[c + 1].startsWith("/>") ? " " : "";
    n += s === z ? l + Je : g >= 0 ? (i.push(h), l.slice(0, g) + ze + l.slice(g) + v + x) : l + v + (g === -2 ? c : x);
  }
  return [Ue(o, n + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const c = t.length - 1, l = this.parts, [h, p] = Ze(t, e);
    if (this.el = j.createElement(h, i), k.currentNode = this.el.content, e === 2 || e === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = k.nextNode()) !== null && l.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(ze)) {
          const b = p[s++], x = r.getAttribute(g).split(v), _ = /([.?@])?(.*)/.exec(b);
          l.push({ type: 1, index: n, name: _[2], strings: x, ctor: _[1] === "." ? ti : _[1] === "?" ? ei : _[1] === "@" ? ii : tt }), r.removeAttribute(g);
        } else g.startsWith(v) && (l.push({ type: 6, index: n }), r.removeAttribute(g));
        if (Fe.test(r.tagName)) {
          const g = r.textContent.split(v), b = g.length - 1;
          if (b > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let x = 0; x < b; x++) r.append(g[x], R()), k.nextNode(), l.push({ type: 2, index: ++n });
            r.append(g[b], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ie) l.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(v, g + 1)) !== -1; ) l.push({ type: 7, index: n }), g += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = T.createElement("template");
    return i.innerHTML = t, i;
  }
}
function M(o, t, e = o, i) {
  var s, c;
  if (t === O) return t;
  let r = i !== void 0 ? (s = e._$Co) == null ? void 0 : s[i] : e._$Cl;
  const n = B(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((c = r == null ? void 0 : r._$AO) == null || c.call(r, !1), n === void 0 ? r = void 0 : (r = new n(o), r._$AT(o, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = M(o, r._$AS(o, t.values), r, i)), t;
}
class Qe {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? T).importNode(e, !0);
    k.currentNode = r;
    let n = k.nextNode(), s = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let h;
        l.type === 2 ? h = new W(n, n.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (h = new ri(n, this, t)), this._$AV.push(h), l = i[++c];
      }
      s !== (l == null ? void 0 : l.index) && (n = k.nextNode(), s++);
    }
    return k.currentNode = T, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class W {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = M(this, t, e), B(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== O && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ye(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && B(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement(Ue(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const s = new Qe(r, this), c = s.u(this.options);
      s.p(e), this.T(c), this._$AH = s;
    }
  }
  _$AC(t) {
    let e = me.get(t.strings);
    return e === void 0 && me.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    It(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new W(this.O(R()), this.O(R()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = de(t).nextSibling;
      de(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class tt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = M(this, t, e, 0), s = !B(t) || t !== this._$AH && t !== O, s && (this._$AH = t);
    else {
      const c = t;
      let l, h;
      for (t = n[0], l = 0; l < n.length - 1; l++) h = M(this, c[i + l], e, l), h === O && (h = this._$AH[l]), s || (s = !B(h) || h !== this._$AH[l]), h === d ? t = d : t !== d && (t += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ti extends tt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class ei extends tt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class ii extends tt {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = M(this, t, e, 0) ?? d) === O) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ri {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const rt = N.litHtmlPolyfillSupport;
rt == null || rt(j, W), (N.litHtmlVersions ?? (N.litHtmlVersions = [])).push("3.3.2");
const ni = (o, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new W(t.insertBefore(R(), n), n, void 0, e ?? {});
  }
  return r._$AI(o), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class u extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ni(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return O;
  }
}
var Ae;
u._$litElement$ = !0, u.finalized = !0, (Ae = S.litElementHydrateSupport) == null || Ae.call(S, { LitElement: u });
const nt = S.litElementPolyfillSupport;
nt == null || nt({ LitElement: u });
(S.litElementVersions ?? (S.litElementVersions = [])).push("4.2.2");
const be = {
  icon: "mdi:ceiling-light",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  has_dimmer: !1,
  show_light_controls: !1,
  show_color_presets: !0,
  show_color_temp: !0,
  show_effects: !1,
  show_state: !0,
  state_display: "state",
  on_color: "#ff8a1c",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, xe = [
  "toggle",
  "more-info",
  "none",
  "call-service",
  "script"
], oi = ["state", "brightness", "auto"], si = {
  color: "Color",
  temperature: "Temp",
  effect: "Effect"
}, ai = [
  { name: "Amber", rgb_color: [255, 146, 66] },
  { name: "Peach", rgb_color: [255, 191, 142] },
  { name: "Cream", rgb_color: [255, 225, 194] },
  { name: "White", rgb_color: [255, 255, 244] },
  { name: "Sky", rgb_color: [89, 164, 255] },
  { name: "Rose", rgb_color: [255, 112, 182] }
], ci = [
  { name: "Warm", color_temp_kelvin: 2700 },
  { name: "Soft", color_temp_kelvin: 3200 },
  { name: "Neutral", color_temp_kelvin: 4e3 },
  { name: "Day", color_temp_kelvin: 5e3 }
];
function li(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Dt = class Dt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1, this.isDimming = !1, this.pendingDimmerPointer = !1, this.pointerStartX = 0, this.pointerStartY = 0, this.suppressClick = !1;
  }
  static get styles() {
    return m`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 56px;
        --glow-card-radius: 999px;
        --glow-on-color: #ff8a1c;
        --glow-off-color: #697382;
        --glow-background: #101722;

        display: block;
        max-width: var(--glow-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--glow-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--glow-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--glow-state-color) 8%, transparent) 42%,
            color-mix(in srgb, var(--glow-hot-color) 13%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid color-mix(
          in srgb,
          var(--glow-border-color) var(--glow-border-strength),
          transparent
        );
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          inset 0 0 0 var(--glow-inner-ring-width)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--glow-outer-blur)
            color-mix(
              in srgb,
              var(--glow-state-color) var(--glow-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        grid-template-columns: 46px minmax(0, 1fr);
        gap: 8px;
        min-height: var(--glow-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .button.dimmer {
        touch-action: pan-y;
      }

      .button.panel {
        border-radius: min(var(--glow-card-radius), 22px);
        cursor: default;
        display: grid;
        gap: 7px;
        grid-template-columns: 1fr;
        min-height: max(122px, var(--glow-card-height));
        padding: 9px 11px 10px;
      }

      .button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--glow-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--glow-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent)
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--glow-hot-color) 11%, transparent),
            transparent 32%,
            transparent 70%,
            color-mix(in srgb, var(--glow-warm-color) 9%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--glow-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--glow-state-color) 8%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .button .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--glow-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .button .slider-fill {
        background:
          radial-gradient(
            circle at 18% 50%,
            color-mix(in srgb, var(--glow-hot-color) 22%, transparent),
            transparent 48%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-warm-color) 44%, transparent),
            color-mix(in srgb, var(--glow-state-color) 32%, transparent)
          );
        border-radius: inherit;
        box-shadow:
          inset 0 0 18px
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
          0 0 18px
            color-mix(in srgb, var(--glow-state-color) 22%, transparent);
        inset: 0 auto 0 0;
        opacity: var(--glow-slider-opacity);
        pointer-events: none;
        position: absolute;
        transition:
          opacity 160ms ease,
          width 120ms ease;
        width: var(--glow-slider-percent);
        z-index: 0;
      }

      .button .slider-fill::after {
        background: color-mix(in srgb, var(--glow-state-color) 86%, #ffffff 10%);
        border-radius: 999px;
        box-shadow:
          0 0 10px
            color-mix(in srgb, var(--glow-state-color) 62%, transparent),
          0 0 24px
            color-mix(in srgb, var(--glow-state-color) 36%, transparent);
        content: '';
        height: calc(100% - 18px);
        opacity: var(--glow-slider-handle-opacity);
        position: absolute;
        right: 2px;
        top: 9px;
        width: 2px;
      }

      .button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .button:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      .button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 1;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--glow-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--glow-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--glow-icon-color);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        height: 38px;
        justify-content: center;
        padding: 0;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1.15;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .panel-header,
      .brightness-control,
      .mode-tabs,
      .control-panel {
        position: relative;
        z-index: 2;
      }

      .panel-header {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 30px minmax(0, 1fr) auto;
        min-height: 30px;
      }

      .panel .icon-shell {
        height: 30px;
        width: 30px;
      }

      .panel .icon-shell ha-icon {
        --mdc-icon-size: 17px;
      }

      .panel .name {
        font-size: 13px;
        font-weight: 720;
      }

      .panel .state {
        font-size: 11px;
        line-height: 1.1;
        margin-top: 2px;
      }

      .level {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 760;
        line-height: 1;
        min-width: 34px;
        text-align: right;
      }

      .brightness-control {
        appearance: none;
        background: rgb(255 255 255 / 12%);
        border: 0;
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 -1px 0 rgb(0 0 0 / 18%);
        cursor: pointer;
        display: block;
        height: 8px;
        overflow: hidden;
        padding: 0;
        touch-action: pan-y;
        width: 100%;
      }

      .brightness-fill {
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 76%, #ffffff 8%),
            color-mix(in srgb, var(--glow-state-color) 38%, #ffffff 42%)
          );
        border-radius: inherit;
        box-shadow: 0 0 14px color-mix(in srgb, var(--glow-state-color) 34%, transparent);
        display: block;
        height: 100%;
        transition: width 140ms ease;
        width: var(--glow-slider-percent);
      }

      .mode-tabs {
        background: rgb(0 0 0 / 14%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 12px;
        display: grid;
        gap: 2px;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        min-height: 24px;
        padding: 2px;
      }

      .mode-tab {
        appearance: none;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        font: inherit;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0;
        padding: 0 8px;
      }

      .mode-tab.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--glow-state-color) 24%, transparent),
            transparent 84%
          ),
          color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .control-panel {
        display: grid;
        gap: 6px;
      }

      .swatches {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        min-height: 28px;
        overflow: visible;
        padding: 0;
      }

      .swatch,
      .effect-chip {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .swatch {
        align-items: center;
        background:
          radial-gradient(circle at 34% 28%, rgb(255 255 255 / 42%), transparent 30%),
          var(--swatch-color, #ffffff);
        border: 1px solid rgb(255 255 255 / 22%);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 22%),
          inset 0 -8px 12px rgb(0 0 0 / 14%),
          0 4px 10px rgb(0 0 0 / 16%);
        display: inline-flex;
        flex: 0 0 26px;
        height: 26px;
        justify-content: center;
        padding: 0;
        position: relative;
        transition:
          border-color 140ms ease,
          box-shadow 140ms ease,
          transform 140ms ease;
        width: 26px;
      }

      .swatch:active {
        transform: scale(0.94);
      }

      .swatch.active {
        border-color: rgb(255 255 255 / 82%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 28%),
          inset 0 -8px 12px rgb(0 0 0 / 14%),
          0 0 0 2px rgb(255 255 255 / 22%),
          0 0 0 5px color-mix(in srgb, var(--glow-state-color) 28%, transparent),
          0 8px 16px rgb(0 0 0 / 20%);
      }

      .swatch.active::after {
        background: rgb(255 255 255 / 92%);
        border-radius: 999px;
        box-shadow:
          0 1px 4px rgb(0 0 0 / 34%),
          0 0 10px rgb(255 255 255 / 24%);
        content: '';
        height: 7px;
        width: 7px;
      }

      .effect-list {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        overflow: hidden;
      }

      .effect-chip {
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        flex: 1 1 0;
        font-size: 10px;
        font-weight: 700;
        min-height: 28px;
        min-width: 0;
        overflow: hidden;
        padding: 0 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .effect-chip.active {
        background: color-mix(in srgb, var(--glow-state-color) 24%, #ffffff 4%);
        border-color: color-mix(in srgb, var(--glow-state-color) 42%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .brightness-control:focus-visible,
      .icon-shell:focus-visible,
      .mode-tab:focus-visible,
      .swatch:focus-visible,
      .effect-chip:focus-visible {
        outline: 2px solid var(--glow-state-color);
        outline-offset: 3px;
      }

      @keyframes glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-light-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("light.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...be,
      ...t
    }, this.style.setProperty(
      "--glow-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--glow-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--glow-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--glow-on-color", this.config.on_color ?? "#ff8a1c"), this.style.setProperty("--glow-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--glow-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.hasLightControls ? 2 : 1;
  }
  getGridOptions() {
    const t = this.hasLightControls;
    return {
      rows: t ? 2 : 1,
      columns: 6,
      min_rows: t ? 2 : 1,
      max_rows: t ? 2 : 1,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticBrightnessPercent !== void 0 ? this.optimisticBrightnessPercent > 0 : this.optimisticOn !== void 0 ? this.optimisticOn : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] ?? "light";
  }
  get hasDimmer() {
    return !!this.config.has_dimmer && this.domain === "light";
  }
  get hasLightControls() {
    return !!this.config.show_light_controls && this.domain === "light";
  }
  get supportedColorModes() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.supported_color_modes;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string") : [];
  }
  get effectList() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.effect_list;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string") : [];
  }
  get supportsColorTemp() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes;
    return !!(this.supportedColorModes.includes("color_temp") || typeof (t == null ? void 0 : t.color_temp_kelvin) == "number" || typeof (t == null ? void 0 : t.min_color_temp_kelvin) == "number" || typeof (t == null ? void 0 : t.max_color_temp_kelvin) == "number");
  }
  get controlModes() {
    if (!this.hasLightControls)
      return [];
    const t = [];
    return this.config.show_color_presets !== !1 && t.push("color"), this.config.show_color_temp !== !1 && this.supportsColorTemp && t.push("temperature"), this.config.show_effects !== !1 && this.effectList.length > 0 && t.push("effect"), t;
  }
  get activeControlMode() {
    const t = this.controlModes;
    if (t.length !== 0)
      return this.controlMode && t.includes(this.controlMode) ? this.controlMode : t[0];
  }
  get currentRgb() {
    var e;
    if (this.optimisticRgb)
      return this.optimisticRgb;
    const t = (e = this.entity) == null ? void 0 : e.attributes.rgb_color;
    if (!(!Array.isArray(t) || t.length < 3))
      return t.slice(0, 3).map(
        (i) => Math.max(0, Math.min(255, Math.round(Number(i) || 0)))
      );
  }
  get currentKelvin() {
    var e;
    if (typeof this.optimisticKelvin == "number")
      return this.optimisticKelvin;
    const t = (e = this.entity) == null ? void 0 : e.attributes.color_temp_kelvin;
    return typeof t == "number" ? t : void 0;
  }
  get currentEffect() {
    var t;
    return this.optimisticEffect ?? String(((t = this.entity) == null ? void 0 : t.attributes.effect) || "");
  }
  get colorPresets() {
    var t;
    return (t = this.config.color_presets) != null && t.length ? this.config.color_presets : ai;
  }
  get stateColor() {
    if (!this.isOn)
      return this.config.off_color ?? "#697382";
    const t = this.currentRgb, e = this.currentKelvin;
    return t ? this.rgbToCss(t) : typeof e == "number" ? this.kelvinToCss(e) : this.config.on_color ?? "#ff8a1c";
  }
  get brightnessPercent() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.brightness;
    if (typeof t == "number")
      return Math.round(t / 255 * 100);
  }
  get activeBrightnessPercent() {
    return this.dimmingPercent !== void 0 ? this.dimmingPercent : this.optimisticBrightnessPercent !== void 0 ? this.optimisticBrightnessPercent : this.isOn ? this.brightnessPercent ?? 100 : 0;
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.config.state_display ?? "state", e = this.brightnessPercent;
    return this.isOn && this.hasDimmer ? `${this.activeBrightnessPercent}%` : this.isOn && e !== void 0 && (t === "brightness" || t === "auto") ? `${e}%` : this.isOn ? "On" : "Off";
  }
  get displayPowerState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || be.icon;
  }
  rgbToCss(t) {
    return `rgb(${t[0]} ${t[1]} ${t[2]})`;
  }
  kelvinToCss(t) {
    return t <= 3e3 ? "#ffb56f" : t <= 3800 ? "#ffd9a6" : t <= 4600 ? "#fff1d6" : "#f2f7ff";
  }
  colorDistance(t, e) {
    return Math.sqrt(
      t.reduce((i, r, n) => {
        const s = r - (e[n] ?? 0);
        return i + s * s;
      }, 0)
    );
  }
  isColorPresetActive(t) {
    return !this.isOn || !t.rgb_color || !this.currentRgb ? !1 : this.colorDistance(t.rgb_color, this.currentRgb) < 44;
  }
  isTemperaturePresetActive(t) {
    return !this.isOn || !t.color_temp_kelvin || !this.currentKelvin ? !1 : Math.abs(t.color_temp_kelvin - this.currentKelvin) < 220;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticOn(t, e) {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = t, this.optimisticBrightnessPercent = e, this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticState();
    }, 1800);
  }
  setOptimisticBrightness(t) {
    this.setOptimisticOn(t > 0, Math.max(0, Math.min(100, t)));
  }
  clearOptimisticState() {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = void 0, this.optimisticBrightnessPercent = void 0, this.optimisticRgb = void 0, this.optimisticKelvin = void 0, this.optimisticEffect = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticState());
  }
  performAction(t) {
    var e, i, r, n, s;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (typeof t == "string") {
        if (t === "more-info") {
          this.dispatchMoreInfo();
          return;
        }
        if (t === "toggle") {
          this.hasDimmer ? this.setOptimisticBrightness(
            this.isOn ? 0 : this.brightnessPercent ?? 100
          ) : this.setOptimisticOn(!this.isOn), this.trackServiceResult(
            (e = this.hass) == null ? void 0 : e.callService(this.domain, "toggle", {
              entity_id: this.config.entity
            })
          );
          return;
        }
        return;
      }
      if (t.action === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      if (t.action === "toggle") {
        this.hasDimmer ? this.setOptimisticBrightness(
          this.isOn ? 0 : this.brightnessPercent ?? 100
        ) : this.setOptimisticOn(!this.isOn), this.trackServiceResult(
          (i = this.hass) == null ? void 0 : i.callService(this.domain, "toggle", {
            entity_id: this.config.entity
          })
        );
        return;
      }
      if (t.action === "call-service") {
        const c = String(t.service || "").trim(), [l, h] = c.split(".");
        if (!l || !h)
          return;
        const p = {
          ...t.service_data ?? t.data ?? {}
        };
        if (!Object.prototype.hasOwnProperty.call(p, "entity_id")) {
          const g = (r = t.target) == null ? void 0 : r.entity_id;
          typeof g == "string" && g.startsWith("script.") ? p.entity_id = g : p.entity_id = this.config.entity;
        }
        t.target ? this.trackServiceResult(
          (n = this.hass) == null ? void 0 : n.callService(l, h, p, t.target)
        ) : this.trackServiceResult(
          (s = this.hass) == null ? void 0 : s.callService(l, h, p)
        );
        return;
      }
    }
  }
  brightnessFromPointer(t) {
    const i = t.currentTarget.getBoundingClientRect(), r = (t.clientX - i.left) / i.width * 100;
    return Math.max(0, Math.min(100, Math.round(r)));
  }
  commitBrightness(t) {
    var e, i;
    if (!(!this.hasDimmer || this.isUnavailable)) {
      if (t <= 5) {
        this.setOptimisticBrightness(0), this.trackServiceResult(
          (e = this.hass) == null ? void 0 : e.callService("light", "turn_off", {
            entity_id: this.config.entity
          })
        );
        return;
      }
      this.setOptimisticBrightness(t), this.trackServiceResult(
        (i = this.hass) == null ? void 0 : i.callService("light", "turn_on", {
          entity_id: this.config.entity,
          brightness_pct: Math.max(1, t)
        })
      );
    }
  }
  turnOnWithOptions(t) {
    var n;
    if (this.isUnavailable || this.domain !== "light")
      return;
    const e = this.brightnessPercent && this.brightnessPercent > 0 ? this.brightnessPercent : 100, i = typeof t.brightness_pct == "number" ? t.brightness_pct : this.isOn && this.activeBrightnessPercent || e, r = {
      entity_id: this.config.entity,
      ...t
    };
    (typeof t.brightness_pct == "number" || !this.isOn) && (r.brightness_pct = Math.max(1, i)), this.setOptimisticOn(!0, i), Array.isArray(t.rgb_color) && (this.optimisticRgb = t.rgb_color.slice(0, 3).map((s) => Math.max(0, Math.min(255, Math.round(Number(s) || 0)))), this.optimisticKelvin = void 0), typeof t.color_temp_kelvin == "number" && (this.optimisticKelvin = t.color_temp_kelvin, this.optimisticRgb = void 0), typeof t.effect == "string" && (this.optimisticEffect = t.effect), this.trackServiceResult((n = this.hass) == null ? void 0 : n.callService("light", "turn_on", r));
  }
  handleControlModeClick(t, e) {
    t.stopPropagation(), this.controlMode = e;
  }
  handleColorPresetClick(t, e) {
    t.stopPropagation(), e.rgb_color && this.turnOnWithOptions({
      rgb_color: e.rgb_color
    });
  }
  handleTemperaturePresetClick(t, e) {
    t.stopPropagation(), e.color_temp_kelvin && this.turnOnWithOptions({
      color_temp_kelvin: e.color_temp_kelvin
    });
  }
  handleEffectClick(t, e) {
    t.stopPropagation(), this.turnOnWithOptions({ effect: e });
  }
  stopControlEvent(t) {
    t.stopPropagation();
  }
  handleBrightnessPointerDown(t) {
    t.stopPropagation(), this.handlePointerDown(t);
  }
  handleBrightnessPointerMove(t) {
    t.stopPropagation(), this.handlePointerMove(t);
  }
  handleBrightnessPointerUp(t) {
    t.stopPropagation(), this.handlePointerUp(t);
  }
  handleBrightnessPointerCancel(t) {
    t.stopPropagation(), this.handlePointerCancel();
  }
  handlePointerDown(t) {
    var e, i;
    if (window.clearTimeout(this.holdTimer), this.holdActive = !1, this.suppressClick = !1, this.hasDimmer && !this.isUnavailable) {
      this.pendingDimmerPointer = !0, this.isDimming = !1, this.pointerStartX = t.clientX, this.pointerStartY = t.clientY, (i = (e = t.currentTarget).setPointerCapture) == null || i.call(e, t.pointerId), this.holdTimer = window.setTimeout(() => {
        !this.pendingDimmerPointer || this.isDimming || (this.holdActive = !0, this.pendingDimmerPointer = !1, this.suppressClick = !0, this.performAction(this.config.hold_action));
      }, 500);
      return;
    }
    this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerMove(t) {
    if (!this.hasDimmer || !this.pendingDimmerPointer && !this.isDimming)
      return;
    const e = Math.abs(t.clientX - this.pointerStartX), i = Math.abs(t.clientY - this.pointerStartY);
    if (!this.isDimming) {
      if (e < 9 || i > e * 1.4)
        return;
      window.clearTimeout(this.holdTimer), this.isDimming = !0, this.pendingDimmerPointer = !1, this.suppressClick = !0;
    }
    this.dimmingPercent = this.brightnessFromPointer(t), t.preventDefault();
  }
  handlePointerUp(t) {
    if (window.clearTimeout(this.holdTimer), this.hasDimmer && this.isDimming) {
      const e = this.brightnessFromPointer(t);
      this.dimmingPercent = e, this.commitBrightness(e), this.isDimming = !1, this.pendingDimmerPointer = !1, window.setTimeout(() => {
        this.dimmingPercent = void 0, this.suppressClick = !1;
      }, 180), t.preventDefault();
      return;
    }
    this.hasDimmer && (this.pendingDimmerPointer = !1);
  }
  handlePointerCancel() {
    window.clearTimeout(this.holdTimer), this.isDimming = !1, this.pendingDimmerPointer = !1, this.dimmingPercent = void 0, window.setTimeout(() => {
      this.suppressClick = !1;
    }, 0);
  }
  handleClick(t) {
    if (this.hasDimmer && this.suppressClick) {
      t.preventDefault(), t.stopPropagation();
      return;
    }
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  handleIconPointerDown(t) {
    !this.hasDimmer && !this.hasLightControls || (t.stopPropagation(), window.clearTimeout(this.holdTimer), this.holdActive = !1, this.pendingDimmerPointer = !1, this.isDimming = !1);
  }
  handleIconClick(t) {
    !this.hasDimmer && !this.hasLightControls || (t.preventDefault(), t.stopPropagation(), this.performAction(this.config.tap_action));
  }
  renderControlTabs() {
    const t = this.controlModes;
    return t.length <= 1 ? d : a`
      <span class="mode-tabs" aria-label="Light control modes">
        ${t.map(
      (e) => a`
            <button
              type="button"
              class="mode-tab ${e === this.activeControlMode ? "active" : ""}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(i) => this.handleControlModeClick(i, e)}
            >
              ${si[e]}
            </button>
          `
    )}
      </span>
    `;
  }
  renderColorControls() {
    const t = this.colorPresets.filter(
      (e) => Array.isArray(e.rgb_color)
    );
    return a`
      <span class="swatches" aria-label="Color presets">
        ${t.map(
      (e) => a`
            <button
              type="button"
              class="swatch ${this.isColorPresetActive(e) ? "active" : ""}"
              style=${`--swatch-color: ${this.rgbToCss(e.rgb_color ?? [255, 255, 255])}`}
              aria-label=${`Set ${e.name}`}
              title=${e.name}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(i) => this.handleColorPresetClick(i, e)}
            ></button>
          `
    )}
      </span>
    `;
  }
  renderTemperatureControls() {
    return a`
      <span
        class="swatches"
        aria-label="Color temperature presets"
      >
        ${ci.map(
      (t) => a`
            <button
              type="button"
              class="swatch ${this.isTemperaturePresetActive(t) ? "active" : ""}"
              style=${`--swatch-color: ${this.kelvinToCss(t.color_temp_kelvin ?? 3e3)}`}
              aria-label=${`Set ${t.name}`}
              title=${`${t.name} ${t.color_temp_kelvin}K`}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(e) => this.handleTemperaturePresetClick(e, t)}
            ></button>
          `
    )}
      </span>
    `;
  }
  renderEffectControls() {
    const t = this.currentEffect;
    return a`
      <span class="effect-list" aria-label="Light effects">
        ${this.effectList.map(
      (e) => a`
            <button
              type="button"
              class="effect-chip ${e === t ? "active" : ""}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(i) => this.handleEffectClick(i, e)}
            >
              ${e}
            </button>
          `
    )}
      </span>
    `;
  }
  renderActiveControls() {
    switch (this.activeControlMode) {
      case "color":
        return this.renderColorControls();
      case "temperature":
        return this.renderTemperatureControls();
      case "effect":
        return this.renderEffectControls();
      default:
        return d;
    }
  }
  renderCompactButton() {
    return a`
      <button
        type="button"
        class="button ${this.hasDimmer ? "dimmer" : ""} ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        aria-label=${this.displayName}
        @click=${this.handleClick}
        @pointerdown=${this.handlePointerDown}
        @pointermove=${this.handlePointerMove}
        @pointerup=${this.handlePointerUp}
        @pointercancel=${this.handlePointerCancel}
      >
        <span class="ambient-glow"></span>
        <span class="slider-fill"></span>
        <span class="outline-glow"></span>
        <span
          class="icon-shell"
          @pointerdown=${this.handleIconPointerDown}
          @click=${this.handleIconClick}
        >
          <ha-icon icon=${this.icon}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName}</span>
          ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
        </span>
      </button>
    `;
  }
  renderLightPanel() {
    return a`
      <div
        class="button panel ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        @click=${this.stopControlEvent}
        @pointerdown=${this.stopControlEvent}
        @pointerup=${this.stopControlEvent}
        @pointercancel=${this.stopControlEvent}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="panel-header">
          <button
            type="button"
            class="icon-shell"
            aria-label=${`${this.isOn ? "Turn off" : "Turn on"} ${this.displayName}`}
            @pointerdown=${this.handleIconPointerDown}
            @click=${this.handleIconClick}
          >
            <ha-icon icon=${this.icon}></ha-icon>
          </button>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayPowerState}</span>` : d}
          </span>
          <span class="level">${this.activeBrightnessPercent}%</span>
        </span>
        ${this.hasDimmer ? a`
              <button
                type="button"
                class="brightness-control"
                aria-label=${`Set ${this.displayName} brightness`}
                @click=${this.stopControlEvent}
                @pointerdown=${this.handleBrightnessPointerDown}
                @pointermove=${this.handleBrightnessPointerMove}
                @pointerup=${this.handleBrightnessPointerUp}
                @pointercancel=${this.handleBrightnessPointerCancel}
              >
                <span class="brightness-fill"></span>
              </button>
            ` : d}
        ${this.renderControlTabs()}
        <span class="control-panel">${this.renderActiveControls()}</span>
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.stateColor, e = this.isOn ? "1" : "0", i = this.hasDimmer ? `${this.activeBrightnessPercent}%` : "0%", r = this.hasDimmer && this.activeBrightnessPercent > 0 ? "1" : "0", n = this.hasDimmer && this.activeBrightnessPercent > 5 ? "1" : "0";
    return a`
      <ha-card
        style="
          --glow-state-color: ${t};
          --glow-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #ffd26a)" : t};
          --glow-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 82%, #ff4f00)" : t};
          --glow-border-color: ${t};
          --glow-icon-color: ${t};
          --glow-on-opacity: ${e};
          --glow-border-strength: ${this.isOn ? "26%" : "18%"};
          --glow-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --glow-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --glow-outer-blur: ${this.isOn ? "50px" : "0"};
          --glow-outer-strength: ${this.isOn ? "10%" : "0%"};
          --glow-slider-percent: ${i};
          --glow-slider-opacity: ${r};
          --glow-slider-handle-opacity: ${n};
        "
      >
        ${this.hasLightControls ? this.renderLightPanel() : this.renderCompactButton()}
      </ha-card>
    `;
  }
};
Dt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  dimmingPercent: { state: !0 },
  controlMode: { state: !0 },
  optimisticOn: { state: !0 },
  optimisticBrightnessPercent: { state: !0 },
  optimisticRgb: { state: !0 },
  optimisticKelvin: { state: !0 },
  optimisticEffect: { state: !0 }
};
let ct = Dt;
customElements.get("glow-light-card") || customElements.define("glow-light-card", ct);
const Nt = class Nt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select,
      select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, li(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var n;
    const e = t.currentTarget || t.target, i = ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.configValue) || e.configValue;
    if (!i)
      return;
    let r;
    if (e instanceof HTMLInputElement ? r = e.type === "checkbox" ? e.checked : e.value : (e instanceof HTMLSelectElement, r = e.value), i === "tap_action" || i === "hold_action") {
      const s = String(r);
      if (s === "script") {
        this.updateConfig({
          [i]: {
            action: "call-service",
            service: "script.turn_on"
          }
        });
        return;
      }
      if (s === "call-service") {
        this.updateConfig({
          [i]: {
            action: "call-service",
            service: ""
          }
        });
        return;
      }
      this.updateConfig({
        [i]: s
      });
      return;
    }
    this.updateConfig({
      [i]: r
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: "light" } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  getEditorActionType(t) {
    var i;
    const e = this.config[t];
    return typeof e == "object" ? e.action === "call-service" && e.service === "script.turn_on" && typeof ((i = e.target) == null ? void 0 : i.entity_id) == "string" && e.target.entity_id.startsWith("script.") ? "script" : e.action : String(e ?? "more-info");
  }
  renderSelect(t, e, i, r) {
    const n = e === "tap_action" || e === "hold_action" ? this.getEditorActionType(e) : this.config[e] ?? r;
    return a`
      <label>
        <span>${t}</span>
        <select
          .value=${n}
          data-config-value=${e}
          @change=${this.valueChanged}
        >
          ${i.map(
      (s) => a`
              <option value=${s}>${s}</option>
            `
    )}
        </select>
      </label>
    `;
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "light" } }
      }
    ], e = {
      entity: "Light Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Bar Lights")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Has Dimmer", "has_dimmer", !1)}
            ${this.renderSwitch("Light Controls", "show_light_controls", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff8a1c")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderSelect(
      "State Display",
      "state_display",
      oi,
      "state"
    )}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
            ${this.renderSwitch("Color Presets", "show_color_presets", !0)}
            ${this.renderSwitch("Color Temp", "show_color_temp", !0)}
            ${this.renderSwitch("Effects", "show_effects", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", xe, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      xe,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Nt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let lt = Nt;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", lt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
const ve = {
  icon: "mdi:toggle-switch",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  show_state: !0,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, ye = ["toggle", "more-info", "none"];
function di(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Lt = class Lt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return m`
      :host {
        --switch-card-width: 260px;
        --switch-card-height: 56px;
        --switch-card-radius: 999px;
        --switch-on-color: #45d158;
        --switch-off-color: #697382;
        --switch-background: #101722;

        display: block;
        max-width: var(--switch-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .switch-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--switch-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--switch-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--switch-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--switch-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--switch-state-color) var(--switch-border-strength),
            transparent
          );
        border-radius: var(--switch-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--switch-inner-ring-width)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--switch-outer-blur)
            color-mix(
              in srgb,
              var(--switch-state-color) var(--switch-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr);
        min-height: var(--switch-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .switch-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--switch-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--switch-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--switch-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--switch-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--switch-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .switch-button::after {
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--switch-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--switch-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--switch-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--switch-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--switch-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--switch-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--switch-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--switch-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--switch-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--switch-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--switch-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .status-dot {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--switch-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--switch-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--switch-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--switch-state-color);
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-dot {
        background: color-mix(in srgb, var(--switch-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--switch-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--switch-state-color) 28%, transparent);
        height: 8px;
        opacity: var(--switch-dot-opacity);
        position: absolute;
        right: 16px;
        top: calc(50% - 4px);
        width: 8px;
      }

      .switch-button:focus-visible {
        outline: 2px solid var(--switch-state-color);
        outline-offset: 3px;
      }

      .switch-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .switch-button.on.animated::after {
        animation: switch-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes switch-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .switch-button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-switch-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("switch.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...ve,
      ...t
    }, this.style.setProperty(
      "--switch-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--switch-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--switch-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--switch-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--switch-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--switch-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticOn !== void 0 ? this.optimisticOn : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] || "switch";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || ve.icon;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticOn(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticOn = void 0;
    }, 1800);
  }
  clearOptimisticOn() {
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticOn());
  }
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.setOptimisticOn(!this.isOn), this.trackServiceResult(
        (e = this.hass) == null ? void 0 : e.callService(this.domain, "toggle", {
          entity_id: this.config.entity
        })
      );
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return a`
      <ha-card
        style="
          --switch-state-color: ${t};
          --switch-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --switch-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --switch-on-opacity: ${e};
          --switch-dot-opacity: ${this.isOn ? "1" : "0.26"};
          --switch-border-strength: ${this.isOn ? "26%" : "18%"};
          --switch-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --switch-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --switch-outer-blur: ${this.isOn ? "50px" : "0"};
          --switch-outer-strength: ${this.isOn ? "10%" : "0%"};
        "
      >
        <button
          type="button"
          class="switch-button ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
Lt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticOn: { state: !0 }
};
let dt = Lt;
customElements.get("glow-switch-card") || customElements.define("glow-switch-card", dt);
const Rt = class Rt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, di(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "switch" } }
      }
    ], e = {
      entity: "Switch Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Coffee Maker")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", ye, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      ye,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Rt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let ht = Rt;
customElements.get("glow-switch-card-editor") || customElements.define("glow-switch-card-editor", ht);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-switch-card",
  name: "Glow Switch Card",
  description: "A compact glowing switch card for Home Assistant."
});
const hi = {
  locked_icon: "mdi:lock",
  unlocked_icon: "mdi:lock-open-variant",
  jammed_icon: "mdi:lock-alert",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  show_state: !0,
  locked_color: "#45d158",
  unlocked_color: "#ff3b30",
  pending_color: "#ff8a1c",
  jammed_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, we = ["toggle", "lock", "unlock", "more-info", "none"];
function pi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Bt = class Bt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return m`
      :host {
        --lock-card-width: 260px;
        --lock-card-height: 56px;
        --lock-card-radius: 999px;
        --lock-locked-color: #45d158;
        --lock-unlocked-color: #ff3b30;
        --lock-pending-color: #ff8a1c;
        --lock-jammed-color: #ff3b30;
        --lock-off-color: #697382;
        --lock-background: #101722;

        display: block;
        max-width: var(--lock-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .lock-button {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--lock-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--lock-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--lock-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--lock-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--lock-state-color) var(--lock-border-strength),
            transparent
          );
        border-radius: var(--lock-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--lock-inner-ring-width)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--lock-outer-blur)
            color-mix(
              in srgb,
              var(--lock-state-color) var(--lock-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr);
        min-height: var(--lock-card-height);
        overflow: hidden;
        padding: 8px 14px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .lock-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--lock-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--lock-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--lock-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--lock-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--lock-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .lock-button::after {
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--lock-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--lock-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--lock-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--lock-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--lock-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--lock-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--lock-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--lock-glow-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .status-dot {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--lock-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--lock-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--lock-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--lock-state-color);
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-dot {
        background: color-mix(in srgb, var(--lock-state-color) 82%, #ffffff 2%);
        border-radius: 999px;
        box-shadow:
          0 0 10px color-mix(in srgb, var(--lock-state-color) 54%, transparent),
          0 0 20px color-mix(in srgb, var(--lock-state-color) 28%, transparent);
        height: 8px;
        opacity: var(--lock-dot-opacity);
        position: absolute;
        right: 16px;
        top: calc(50% - 4px);
        width: 8px;
      }

      .lock-button:focus-visible {
        outline: 2px solid var(--lock-state-color);
        outline-offset: 3px;
      }

      .lock-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .lock-button.active.animated::after {
        animation: lock-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes lock-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lock-button.active.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-lock-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter((r) => r.startsWith("lock."));
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...hi,
      ...t
    }, this.style.setProperty(
      "--lock-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--lock-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--lock-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--lock-locked-color", this.config.locked_color ?? "#45d158"), this.style.setProperty("--lock-unlocked-color", this.config.unlocked_color ?? "#ff3b30"), this.style.setProperty("--lock-pending-color", this.config.pending_color ?? "#ff8a1c"), this.style.setProperty("--lock-jammed-color", this.config.jammed_color ?? "#ff3b30"), this.style.setProperty("--lock-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--lock-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get isJammed() {
    var t;
    return ((t = this.entity) == null ? void 0 : t.state) === "jammed";
  }
  get effectiveState() {
    var t;
    return this.optimisticState ?? ((t = this.entity) == null ? void 0 : t.state);
  }
  get isPending() {
    return this.effectiveState === "locking" || this.effectiveState === "unlocking";
  }
  get isLocked() {
    return this.optimisticLocked !== void 0 ? this.optimisticLocked : this.effectiveState === "locked" || this.effectiveState === "locking";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.effectiveState;
    return t === "locking" ? "Locking" : t === "unlocking" ? "Unlocking" : t === "jammed" ? "Jammed" : t === "locked" ? "Locked" : "Unlocked";
  }
  get icon() {
    return this.config.icon ? this.config.icon : this.isJammed ? this.config.jammed_icon ?? "mdi:lock-alert" : this.isLocked ? this.config.locked_icon ?? "mdi:lock" : this.config.unlocked_icon ?? "mdi:lock-open-variant";
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticLockState(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticLocked = t, this.optimisticState = t ? "locking" : "unlocking", this.optimisticTimer = window.setTimeout(() => {
      this.clearOptimisticLocked();
    }, 8e3);
  }
  clearOptimisticLocked() {
    window.clearTimeout(this.optimisticTimer), this.optimisticLocked = void 0, this.optimisticState = void 0;
  }
  updated() {
    var t, e;
    if (this.optimisticState === "locking" && ((t = this.entity) == null ? void 0 : t.state) === "locked") {
      this.clearOptimisticLocked();
      return;
    }
    this.optimisticState === "unlocking" && ((e = this.entity) == null ? void 0 : e.state) === "unlocked" && this.clearOptimisticLocked();
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticLocked());
  }
  callLockService(t) {
    var e;
    this.setOptimisticLockState(t), this.trackServiceResult(
      (e = this.hass) == null ? void 0 : e.callService("lock", t ? "lock" : "unlock", {
        entity_id: this.config.entity
      })
    );
  }
  performAction(t) {
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      if (t === "lock") {
        this.callLockService(!0);
        return;
      }
      if (t === "unlock") {
        this.callLockService(!1);
        return;
      }
      this.callLockService(!this.isLocked);
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isUnavailable ? this.config.off_color ?? "#697382" : this.isJammed ? this.config.jammed_color ?? "#ff3b30" : this.isPending ? this.config.pending_color ?? "#ff8a1c" : this.isLocked ? this.config.locked_color ?? "#45d158" : this.config.unlocked_color ?? "#ff3b30", e = this.isUnavailable ? "0" : "1", i = this.isPending ? "pending" : this.isLocked ? "locked" : this.isJammed ? "jammed" : "unlocked";
    return a`
      <ha-card
        style="
          --lock-state-color: ${t};
          --lock-warm-color: ${this.isLocked ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : "color-mix(in srgb, " + t + " 86%, #ffd26a)"};
          --lock-hot-color: ${this.isLocked ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : "color-mix(in srgb, " + t + " 80%, #ff4f00)"};
          --lock-glow-opacity: ${e};
          --lock-dot-opacity: ${this.isUnavailable ? "0.26" : "1"};
          --lock-border-strength: ${this.isUnavailable ? "18%" : "26%"};
          --lock-inner-ring-width: ${this.isUnavailable ? "0px" : "1px"};
          --lock-inner-ring-strength: ${this.isUnavailable ? "0%" : "8%"};
          --lock-outer-blur: ${this.isUnavailable ? "0" : "50px"};
          --lock-outer-strength: ${this.isUnavailable ? "0%" : "10%"};
        "
      >
        <button
          type="button"
          class="lock-button active ${i} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
Bt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLocked: { state: !0 },
  optimisticState: { state: !0 }
};
let pt = Bt;
customElements.get("glow-lock-card") || customElements.define("glow-lock-card", pt);
const jt = class jt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, pi(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "lock" } }
      }
    ], e = {
      entity: "Lock Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Front Door")}
            ${this.renderIconPicker("Icon Override", "icon")}
            ${this.renderIconPicker("Locked Icon", "locked_icon")}
            ${this.renderIconPicker("Unlocked Icon", "unlocked_icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Locked Color", "locked_color", "#45d158")}
            ${this.renderTextInput("Unlocked Color", "unlocked_color", "#ff3b30")}
            ${this.renderTextInput("Pending Color", "pending_color", "#ff8a1c")}
            ${this.renderTextInput("Jammed Color", "jammed_color", "#ff3b30")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", we, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      we,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
jt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let gt = jt;
customElements.get("glow-lock-card-editor") || customElements.define("glow-lock-card-editor", gt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-lock-card",
  name: "Glow Lock Card",
  description: "A compact smart lock card with instant locked and unlocked states."
});
const gi = {
  icon: "mdi:thermostat",
  width: "320px",
  fill_container: !1,
  border_radius: "18px",
  show_state: !1,
  show_current: !0,
  show_controls: !0,
  show_mode_buttons: !0,
  show_features: !1,
  show_hvac_modes: !0,
  show_fan_modes: !0,
  show_swing_modes: !0,
  show_horizontal_swing_modes: !0,
  temperature_step: 1,
  heat_color: "#ff8a1c",
  cool_color: "#2f80ff",
  idle_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "more-info",
  hold_action: "more-info",
  animated: !0
}, _e = ["more-info", "none"], $e = {
  auto: "Auto",
  cool: "Cool",
  dry: "Dry",
  fan_only: "Fan",
  heat: "Heat",
  heat_cool: "Auto",
  off: "Off"
};
function ui(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function G(o, t) {
  if (typeof o == "number" && Number.isFinite(o))
    return o;
  if (typeof o == "string") {
    const e = Number(o);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
function fi(o, t, e) {
  const i = (o == null ? void 0 : o.trim()) || t, r = /^(\d+(?:\.\d+)?)px$/.exec(i);
  return r ? `${Math.max(e, Number(r[1]))}px` : i === "auto" || i === "initial" || i === "inherit" ? t : `max(${e}px, ${i})`;
}
const Vt = class Vt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledControlPointer = !1;
  }
  static get styles() {
    return m`
      :host {
        --thermostat-card-width: 320px;
        --thermostat-card-height: auto;
        --thermostat-card-radius: 18px;
        --thermostat-heat-color: #ff8a1c;
        --thermostat-cool-color: #2f80ff;
        --thermostat-idle-color: #45d158;
        --thermostat-off-color: #697382;
        --thermostat-background: #101722;
        --thermostat-dial-size: 188px;

        display: block;
        height: var(--thermostat-card-height);
        max-width: var(--thermostat-card-width);
        min-height: 0;
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: visible;
      }

      .thermostat {
        --thermostat-dial-size: clamp(180px, 66cqi, 214px);

        align-items: stretch;
        background:
          radial-gradient(circle at 50% 34%, color-mix(in srgb, var(--thermostat-state-color) 18%, transparent), transparent 42%),
          radial-gradient(circle at 12% 12%, rgb(255 255 255 / 7%), transparent 36%),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--thermostat-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--thermostat-state-color) var(--thermostat-border-strength),
            transparent
          );
        border-radius: var(--thermostat-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--thermostat-inner-ring-width)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--thermostat-outer-blur)
            color-mix(
              in srgb,
              var(--thermostat-state-color) var(--thermostat-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        container-type: inline-size;
        display: grid;
        align-content: start;
        gap: 10px;
        grid-template-rows: auto auto auto auto;
        height: var(--thermostat-card-height);
        min-height: 0;
        overflow: hidden;
        padding: 22px 18px 18px;
        position: relative;
        text-align: center;
        width: 100%;
      }

      .thermostat.features-visible {
        --thermostat-dial-size: clamp(164px, 54cqi, 190px);

        gap: 8px;
        padding: 20px 18px 16px;
      }

      .thermostat::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--thermostat-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--thermostat-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--thermostat-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--thermostat-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--thermostat-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .thermostat::after {
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--thermostat-glow-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--thermostat-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--thermostat-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--thermostat-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--thermostat-glow-opacity);
        z-index: 0;
      }

      .header,
      .dial,
      .controls,
      .mode-controls,
      .features {
        position: relative;
        z-index: 2;
      }

      .header {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        justify-content: center;
        min-height: 30px;
        text-align: center;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dial {
        align-self: center;
        aspect-ratio: 1;
        background:
          radial-gradient(
            circle at 50% 44%,
            color-mix(in srgb, var(--thermostat-state-color) 20%, transparent),
            transparent 52%
          ),
          radial-gradient(circle at center, color-mix(in srgb, var(--thermostat-background) 94%, #ffffff 5%) 0 52%, transparent 53%),
          conic-gradient(
            from 215deg,
            color-mix(in srgb, var(--thermostat-state-color) 96%, #ffffff 12%) 0deg,
            var(--thermostat-state-color)
              calc(var(--thermostat-arc-degrees) * 0.72),
            color-mix(in srgb, var(--thermostat-state-color) 72%, #000000 16%)
              var(--thermostat-arc-degrees),
            rgb(255 255 255 / 11%) var(--thermostat-arc-degrees) 290deg,
            transparent 290deg 360deg
          );
        border-radius: 999px;
        box-shadow:
          inset 0 0 0 1px rgb(255 255 255 / 7%),
          inset 0 12px 26px rgb(255 255 255 / 5%),
          0 0 34px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent);
        block-size: var(--thermostat-dial-size);
        display: grid;
        justify-self: center;
        inline-size: var(--thermostat-dial-size);
        min-block-size: 0;
        min-inline-size: 0;
        place-items: center;
        position: relative;
      }

      .dial::before {
        background:
          radial-gradient(
            circle at 50% 32%,
            color-mix(in srgb, var(--thermostat-state-color) 24%, transparent),
            transparent 58%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--thermostat-background) 84%, #ffffff 10%),
            color-mix(in srgb, var(--thermostat-background) 88%, #000000 24%)
          );
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: inherit;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          inset 0 -16px 28px rgb(0 0 0 / 15%);
        content: '';
        inset: 21%;
        position: absolute;
        z-index: 1;
      }

      .dial-center {
        align-items: center;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 2;
      }

      .mode {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13px;
        font-weight: 650;
        line-height: 1.1;
        margin-bottom: 9px;
      }

      .target {
        align-items: flex-start;
        color: var(--primary-text-color, #f4f7fb);
        display: inline-flex;
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
      }

      .unit {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 17px;
        font-weight: 650;
        line-height: 1;
        margin-left: 2px;
        padding-top: 5px;
      }

      .current {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.2;
        margin-top: 7px;
        white-space: nowrap;
      }

      .controls {
        align-self: end;
        background: transparent;
        border: 0;
        border-radius: 0;
        display: inline-grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding: 0;
        width: 100%;
      }

      .control {
        align-items: center;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 17px;
        font-weight: 650;
        height: 33px;
        justify-content: center;
        letter-spacing: 0;
        padding: 0;
        width: 100%;
      }

      .control:active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 22%, #ffffff 3%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .mode-controls {
        align-self: end;
        background: rgb(0 0 0 / 18%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
        display: grid;
        gap: 2px;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        min-height: 30px;
        overflow: hidden;
        padding: 2px;
        width: 100%;
      }

      .mode-button {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        justify-content: center;
        letter-spacing: 0;
        line-height: 1;
        min-width: 0;
        padding: 0 8px;
        text-transform: none;
        white-space: nowrap;
      }

      .mode-button.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--thermostat-state-color) 26%, transparent),
            transparent 86%
          ),
          color-mix(in srgb, var(--thermostat-state-color) 28%, #ffffff 4%);
        color: var(--primary-text-color, #f4f7fb);
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 9%);
      }

      .mode-button:disabled {
        cursor: default;
        opacity: 0.45;
      }

      .features,
      .feature-group {
        align-self: end;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: stretch;
        overflow: visible;
        padding: 0;
        width: 100%;
      }

      .feature-button,
      .feature-status {
        align-items: center;
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        box-sizing: border-box;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        flex: 1 1 118px;
        gap: 6px;
        grid-template-columns: 18px minmax(0, 1fr) auto;
        justify-content: center;
        justify-items: stretch;
        min-height: 32px;
        min-width: 0;
        padding: 0 10px;
        text-align: left;
      }

      .feature-button {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .feature-button.on {
        background:
          radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--thermostat-state-color) 20%, transparent), transparent 62%),
          color-mix(in srgb, var(--thermostat-state-color) 14%, transparent);
      }

      .feature-button.problem,
      .feature-status.problem {
        border-color: color-mix(in srgb, #ff3b30 50%, transparent);
        color: #ffb3ad;
      }

      .feature-button.unavailable,
      .feature-status.unavailable {
        opacity: 0.55;
      }

      .feature-icon {
        flex: 0 0 auto;
        --mdc-icon-size: 18px;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        color: color-mix(in srgb, var(--thermostat-state-color) 58%, #ffffff 42%);
        filter: drop-shadow(0 0 8px color-mix(in srgb, var(--thermostat-state-color) 18%, transparent));
        font-size: 18px;
        height: 18px;
        justify-self: center;
        line-height: 18px;
        padding: 0;
        transition:
          transform 140ms ease;
        width: 18px;
      }

      .feature-button.on .feature-icon {
        background: transparent;
        border: 0;
        box-shadow: none;
        color: #ffffff;
        filter: drop-shadow(0 0 12px color-mix(in srgb, var(--thermostat-state-color) 42%, transparent));
      }

      .feature-button:active .feature-icon {
        transform: scale(0.94);
      }

      .feature-text {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      .feature-label {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .feature-value {
        color: color-mix(in srgb, var(--secondary-text-color, #b7c0ce) 88%, transparent);
        font-size: 10px;
        font-weight: 650;
        justify-self: end;
        line-height: 1;
        max-width: 56px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        white-space: nowrap;
      }

      .thermostat:focus-visible,
      .control:focus-visible,
      .mode-button:focus-visible,
      .feature-button:focus-visible {
        outline: 2px solid var(--thermostat-state-color);
        outline-offset: 3px;
      }

      .thermostat.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .thermostat.active.animated::after {
        animation: thermostat-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes thermostat-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .thermostat.active.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-thermostat-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("climate.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...gi,
      ...t,
      temperature_step: G(t.temperature_step, 1)
    }, this.style.setProperty(
      "--thermostat-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--thermostat-card-height",
      fi(t.height, "auto", 0)
    ), this.style.setProperty(
      "--thermostat-card-radius",
      this.config.border_radius ?? "18px"
    ), this.style.setProperty("--thermostat-heat-color", this.config.heat_color ?? "#ff8a1c"), this.style.setProperty("--thermostat-cool-color", this.config.cool_color ?? "#2f80ff"), this.style.setProperty("--thermostat-idle-color", this.config.idle_color ?? "#45d158"), this.style.setProperty("--thermostat-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--thermostat-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.hasVisibleFeatureControls ? 7 : 6;
  }
  getGridOptions() {
    const t = this.hasVisibleFeatureControls;
    return {
      rows: t ? 7 : 5,
      columns: 6,
      min_rows: t ? 6 : 4,
      max_rows: 9,
      min_columns: 4,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  getFeatureEntity(t) {
    var e;
    if (t)
      return (e = this.hass) == null ? void 0 : e.states[t];
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get isOff() {
    return this.hvacMode === "off";
  }
  get hvacMode() {
    var t;
    return this.optimisticMode ?? String(((t = this.entity) == null ? void 0 : t.state) || "off");
  }
  get hvacAction() {
    var t;
    return String(((t = this.entity) == null ? void 0 : t.attributes.hvac_action) || this.hvacMode || "idle");
  }
  get isCooling() {
    return this.hvacAction === "cooling" || this.hvacMode === "cool";
  }
  get isHeating() {
    return this.hvacAction === "heating" || this.hvacMode === "heat";
  }
  get availableModes() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.hvac_modes;
    return Array.isArray(t) ? t.filter((i) => typeof i == "string").filter((i, r, n) => n.indexOf(i) === r) : [];
  }
  get unit() {
    var t;
    return String(((t = this.entity) == null ? void 0 : t.attributes.temperature_unit) || "°");
  }
  get currentTemperature() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.current_temperature;
    return typeof t == "number" ? t : void 0;
  }
  get minTemperature() {
    var t;
    return G((t = this.entity) == null ? void 0 : t.attributes.min_temp, 55);
  }
  get maxTemperature() {
    var t;
    return G((t = this.entity) == null ? void 0 : t.attributes.max_temp, 85);
  }
  get targetTemperature() {
    var r, n, s;
    if (this.optimisticTemperature !== void 0)
      return this.optimisticTemperature;
    const t = (r = this.entity) == null ? void 0 : r.attributes.temperature;
    if (typeof t == "number")
      return t;
    const e = (n = this.entity) == null ? void 0 : n.attributes.target_temp_low, i = (s = this.entity) == null ? void 0 : s.attributes.target_temp_high;
    return typeof e == "number" && typeof i == "number" ? Math.round((e + i) / 2 * 10) / 10 : this.currentTemperature ?? 72;
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOff ? "Off" : this.config.show_current && this.currentTemperature !== void 0 ? `${this.formatTemperature(this.currentTemperature)} now` : this.hvacAction;
  }
  get modeLabel() {
    return this.isUnavailable ? "Unavailable" : this.isOff ? "Off" : this.isCooling ? "Cool" : this.isHeating ? "Heat" : "Idle";
  }
  get currentLabel() {
    return this.currentTemperature === void 0 ? this.hvacAction : this.formatTemperature(this.currentTemperature);
  }
  get stateColor() {
    return this.isOff || this.isUnavailable ? this.config.off_color ?? "#697382" : this.isCooling ? this.config.cool_color ?? "#2f80ff" : this.isHeating ? this.config.heat_color ?? "#ff8a1c" : this.config.idle_color ?? "#45d158";
  }
  get hasConfiguredFeatures() {
    return !!(this.config.show_hvac_modes || this.config.show_fan_modes || this.config.show_swing_modes || this.config.show_horizontal_swing_modes || this.config.filter_entity || this.config.problem_entity || this.config.pm25_entity || this.config.display_light_entity || this.config.sleep_mode_entity || this.config.vertical_position_entity || this.config.horizontal_position_entity || this.config.anti_frost_switch_entity || this.config.anti_mildew_switch_entity || this.config.eco_switch_entity || this.config.health_switch_entity || this.config.soft_wind_switch_entity || this.config.sound_switch_entity);
  }
  get hasPrimaryModeButtons() {
    return !!this.config.show_mode_buttons && this.availableModes.length > 0;
  }
  get hasVisibleFeatureControls() {
    var e, i;
    if (!((e = this.config) != null && e.show_features) || !this.hasConfiguredFeatures)
      return !1;
    const t = ((i = this.entity) == null ? void 0 : i.attributes) ?? {};
    return this.config.show_hvac_modes && !this.hasPrimaryModeButtons && Array.isArray(t.hvac_modes) && t.hvac_modes.length > 0 || this.config.show_fan_modes && Array.isArray(t.fan_modes) && t.fan_modes.length > 0 || !this.hasPrimaryModeButtons ? !0 : !!(this.getFeatureEntity(this.config.eco_switch_entity) || this.getFeatureEntity(this.config.sleep_mode_entity) || this.getFeatureEntity(this.config.vertical_position_entity) || this.getFeatureEntity(this.config.horizontal_position_entity) || this.getFeatureEntity(this.config.filter_entity) || this.getFeatureEntity(this.config.problem_entity) || this.getFeatureEntity(this.config.pm25_entity) || this.getFeatureEntity(this.config.display_light_entity) || this.getFeatureEntity(this.config.anti_frost_switch_entity) || this.getFeatureEntity(this.config.anti_mildew_switch_entity) || this.getFeatureEntity(this.config.health_switch_entity) || this.getFeatureEntity(this.config.soft_wind_switch_entity) || this.getFeatureEntity(this.config.sound_switch_entity));
  }
  formatTemperature(t) {
    return `${Math.round(t * 10) / 10}${this.unit}`;
  }
  formatTemperatureValue(t) {
    return `${Math.round(t * 10) / 10}`;
  }
  get arcDegrees() {
    const t = this.minTemperature, e = this.maxTemperature, i = Math.max(1, e - t), r = Math.max(0, Math.min(1, (this.targetTemperature - t) / i));
    return Math.round(24 + r * 266);
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticTemperature(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticTemperature = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticTemperature = void 0;
    }, 8e3);
  }
  clearOptimisticTemperature() {
    window.clearTimeout(this.optimisticTimer), this.optimisticTemperature = void 0;
  }
  setOptimisticMode(t) {
    window.clearTimeout(this.optimisticModeTimer), this.optimisticMode = t, this.optimisticModeTimer = window.setTimeout(() => {
      this.optimisticMode = void 0;
    }, 8e3);
  }
  clearOptimisticMode() {
    window.clearTimeout(this.optimisticModeTimer), this.optimisticMode = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticTemperature());
  }
  updated() {
    var e, i;
    const t = (e = this.entity) == null ? void 0 : e.attributes.temperature;
    this.optimisticTemperature !== void 0 && typeof t == "number" && Math.abs(t - this.optimisticTemperature) < 0.1 && this.clearOptimisticTemperature(), this.optimisticMode !== void 0 && ((i = this.entity) == null ? void 0 : i.state) === this.optimisticMode && this.clearOptimisticMode();
  }
  setTargetTemperature(t) {
    var n;
    if (this.isUnavailable || this.isOff)
      return;
    const e = this.minTemperature, i = this.maxTemperature, r = Math.min(i, Math.max(e, t));
    this.setOptimisticTemperature(r), this.trackServiceResult(
      (n = this.hass) == null ? void 0 : n.callService("climate", "set_temperature", {
        entity_id: this.config.entity,
        temperature: r
      })
    );
  }
  adjustTemperature(t) {
    const e = G(this.config.temperature_step, 1);
    this.setTargetTemperature(this.targetTemperature + t * e);
  }
  setHvacMode(t) {
    var i;
    if (this.isUnavailable || t === this.hvacMode)
      return;
    this.setOptimisticMode(t);
    const e = (i = this.hass) == null ? void 0 : i.callService("climate", "set_hvac_mode", {
      entity_id: this.config.entity,
      hvac_mode: t
    });
    e && typeof e.catch == "function" && e.catch(() => this.clearOptimisticMode());
  }
  performAction(t) {
    this.isUnavailable || !t || t === "none" || this.dispatchMoreInfo();
  }
  setClimateMode(t, e, i) {
    var r;
    this.isUnavailable || !i || (r = this.hass) == null || r.callService("climate", e, {
      entity_id: this.config.entity,
      [t]: i
    });
  }
  toggleFeatureEntity(t) {
    var r;
    const e = this.getFeatureEntity(t);
    if (!e || ["unavailable", "unknown"].includes(e.state))
      return;
    const [i] = e.entity_id.split(".");
    (r = this.hass) == null || r.callService(i, "toggle", {
      entity_id: e.entity_id
    });
  }
  selectFeatureOption(t, e) {
    var r;
    const i = this.getFeatureEntity(t);
    !i || ["unavailable", "unknown"].includes(i.state) || !e || (r = this.hass) == null || r.callService("select", "select_option", {
      entity_id: i.entity_id,
      option: e
    });
  }
  nextOption(t, e) {
    if (!Array.isArray(t) || t.length === 0)
      return;
    const i = t.map((n) => String(n)), r = Math.max(0, i.indexOf(e ?? i[0]));
    return i[(r + 1) % i.length];
  }
  renderOffFeature() {
    var e;
    const t = ((e = this.entity) == null ? void 0 : e.state) === "off";
    return a`
      <button
        class="feature-button ${t ? "" : "on"}"
        ?disabled=${this.isUnavailable}
        title="Off"
        aria-label="Turn thermostat off"
        @click=${(i) => {
      i.stopPropagation(), this.setClimateMode("hvac_mode", "set_hvac_mode", "off");
    }}
      >
        <ha-icon class="feature-icon" .icon=${"mdi:power"}></ha-icon>
        <span class="feature-label">Off</span>
        <span class="feature-value">${t ? "off" : "tap"}</span>
      </button>
    `;
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(this.config.tap_action);
  }
  handleControlPointerDown(t, e) {
    t.stopPropagation(), this.handledControlPointer = !0, window.setTimeout(() => {
      this.handledControlPointer = !1;
    }, 500), this.adjustTemperature(e);
  }
  handleControlClick(t, e) {
    if (t.stopPropagation(), this.handledControlPointer) {
      this.handledControlPointer = !1;
      return;
    }
    this.adjustTemperature(e);
  }
  handleModeClick(t, e) {
    t.stopPropagation(), this.setHvacMode(e);
  }
  renderClimateSelect(t, e, i, r, n, s) {
    if (!Array.isArray(r) || r.length === 0)
      return d;
    const c = i ?? String(r[0]);
    return a`
      <button
        class="feature-button ${c !== "off" ? "on" : ""}"
        ?disabled=${this.isUnavailable}
        title=${`${t}: ${c}`}
        aria-label=${`${t}: ${c}. Tap to change.`}
        @click=${(l) => {
      l.stopPropagation();
      const h = this.nextOption(r, c);
      h && this.setClimateMode(s, n, h);
    }}
      >
        <ha-icon class="feature-icon" .icon=${e}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${c}</span>
      </button>
    `;
  }
  renderSelectEntity(t, e, i) {
    const r = this.getFeatureEntity(i);
    return !r || !Array.isArray(r.attributes.options) ? d : a`
      <button
        class="feature-button ${r.state !== "Off" && r.state !== "off" && r.state !== "Unknown" ? "on" : ""}"
        ?disabled=${["unavailable", "unknown"].includes(r.state)}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}. Tap to change.`}
        @click=${(n) => {
      n.stopPropagation();
      const s = this.nextOption(r.attributes.options, r.state);
      s && this.selectFeatureOption(r.entity_id, s);
    }}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || e}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${r.state}</span>
      </button>
    `;
  }
  renderToggleFeature(t, e, i) {
    const r = this.getFeatureEntity(e);
    if (!r)
      return d;
    const n = ["unavailable", "unknown"].includes(r.state), s = r.state === "on", c = r.attributes.device_class === "problem" && r.state === "on";
    return a`
      <button
        class="feature-button ${s ? "on" : ""} ${c ? "problem" : ""} ${n ? "unavailable" : ""}"
        ?disabled=${n || r.entity_id.startsWith("binary_sensor.")}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}`}
        @click=${(l) => {
      l.stopPropagation(), this.toggleFeatureEntity(r.entity_id);
    }}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${s ? "on" : "off"}</span>
      </button>
    `;
  }
  renderSensorFeature(t, e, i) {
    const r = this.getFeatureEntity(e);
    if (!r)
      return d;
    const n = ["unavailable", "unknown"].includes(r.state), s = r.attributes.device_class === "problem" && r.state === "on", c = r.attributes.unit_of_measurement ? ` ${r.attributes.unit_of_measurement}` : "";
    return a`
      <span
        class="feature-status ${s ? "problem" : ""} ${n ? "unavailable" : ""}"
        title=${`${t}: ${r.state}${c}`}
        aria-label=${`${t}: ${r.state}${c}`}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${r.state}${c}</span>
      </span>
    `;
  }
  renderFeatures() {
    var n, s;
    if (!this.config.show_features || !this.hasConfiguredFeatures)
      return d;
    const t = ((n = this.entity) == null ? void 0 : n.attributes) ?? {}, e = this.hasPrimaryModeButtons, i = [], r = (c) => {
      c !== d && i.length < 4 && i.push(c);
    };
    return this.config.show_hvac_modes && !e && r(
      this.renderClimateSelect(
        "Mode",
        "mdi:tune-variant",
        (s = this.entity) == null ? void 0 : s.state,
        t.hvac_modes,
        "set_hvac_mode",
        "hvac_mode"
      )
    ), this.config.show_fan_modes && r(
      this.renderClimateSelect(
        "Fan",
        "mdi:fan",
        String(t.fan_mode || ""),
        t.fan_modes,
        "set_fan_mode",
        "fan_mode"
      )
    ), r(this.renderToggleFeature("Eco", this.config.eco_switch_entity, "mdi:leaf")), e || r(this.renderOffFeature()), r(
      this.renderSelectEntity(
        "Sleep",
        "mdi:weather-night",
        this.config.sleep_mode_entity
      )
    ), r(
      this.renderSelectEntity(
        "Vertical",
        "mdi:unfold-more-horizontal",
        this.config.vertical_position_entity
      )
    ), r(
      this.renderSelectEntity(
        "Horizontal",
        "mdi:unfold-more-vertical",
        this.config.horizontal_position_entity
      )
    ), r(this.renderSensorFeature("Filter", this.config.filter_entity, "mdi:air-filter")), r(this.renderSensorFeature("Problem", this.config.problem_entity, "mdi:alert-circle")), r(this.renderSensorFeature("PM2.5", this.config.pm25_entity, "mdi:blur")), r(
      this.renderToggleFeature("Display", this.config.display_light_entity, "mdi:monitor")
    ), r(
      this.renderToggleFeature(
        "Anti-frost",
        this.config.anti_frost_switch_entity,
        "mdi:snowflake-alert"
      )
    ), r(
      this.renderToggleFeature(
        "Anti-mildew",
        this.config.anti_mildew_switch_entity,
        "mdi:water-off-outline"
      )
    ), r(
      this.renderToggleFeature("Health", this.config.health_switch_entity, "mdi:heart-outline")
    ), r(
      this.renderToggleFeature(
        "Soft wind",
        this.config.soft_wind_switch_entity,
        "mdi:weather-windy"
      )
    ), r(this.renderToggleFeature("Sound", this.config.sound_switch_entity, "mdi:volume-high")), i.length === 0 ? d : a`<span class="features">${i}</span>`;
  }
  renderModeButtons() {
    const t = this.availableModes;
    return t.length ? a`
      <span class="mode-controls" aria-label="HVAC mode controls">
        ${t.map(
      (e) => a`
            <button
              class="mode-button ${e === this.hvacMode ? "active" : ""}"
              ?disabled=${this.isUnavailable}
              aria-label=${`Set mode to ${$e[e] ?? e}`}
              @click=${(i) => this.handleModeClick(i, e)}
            >
              ${$e[e] ?? e}
            </button>
          `
    )}
      </span>
    ` : d;
  }
  renderControls() {
    return a`
      <span class="controls" aria-label="Temperature controls">
        <button
          class="control"
          aria-label="Decrease temperature"
          @pointerdown=${(t) => this.handleControlPointerDown(t, -1)}
          @click=${(t) => this.handleControlClick(t, -1)}
        >
          -
        </button>
        <button
          class="control"
          aria-label="Increase temperature"
          @pointerdown=${(t) => this.handleControlPointerDown(t, 1)}
          @click=${(t) => this.handleControlClick(t, 1)}
        >
          +
        </button>
      </span>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.stateColor, e = !this.isOff && !this.isUnavailable, i = e ? "1" : "0", r = this.isCooling;
    return a`
      <ha-card
        style="
          --thermostat-state-color: ${t};
          --thermostat-warm-color: ${r ? "color-mix(in srgb, " + t + " 86%, #94d6ff)" : "color-mix(in srgb, " + t + " 86%, #ffd26a)"};
          --thermostat-hot-color: ${r ? "color-mix(in srgb, " + t + " 80%, #4fb3ff)" : "color-mix(in srgb, " + t + " 80%, #ff4f00)"};
          --thermostat-glow-opacity: ${i};
          --thermostat-border-strength: ${e ? "26%" : "18%"};
          --thermostat-inner-ring-width: ${e ? "1px" : "0px"};
          --thermostat-inner-ring-strength: ${e ? "8%" : "0%"};
          --thermostat-outer-blur: ${e ? "50px" : "0"};
          --thermostat-outer-strength: ${e ? "10%" : "0%"};
          --thermostat-arc-degrees: ${this.arcDegrees}deg;
        "
      >
        <div
          class="thermostat ${e ? "active" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.hasVisibleFeatureControls ? "features-visible" : ""} ${this.config.animated ? "animated" : ""}"
          role="button"
          tabindex="0"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="header">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
          </span>
          <span class="dial">
            <span class="dial-center">
              <span class="mode">${this.modeLabel}</span>
              <span class="target">
                <span>${this.formatTemperatureValue(this.targetTemperature)}</span>
                <span class="unit">${this.unit}</span>
              </span>
              ${this.config.show_current ? a`<span class="current">${this.currentLabel}</span>` : d}
            </span>
          </span>
          ${this.config.show_controls ? this.renderControls() : d}
          ${this.config.show_mode_buttons ? this.renderModeButtons() : d}
          ${this.renderFeatures()}
        </div>
      </ha-card>
    `;
  }
};
Vt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticMode: { state: !0 },
  optimisticTemperature: { state: !0 }
};
let ut = Vt;
customElements.get("glow-thermostat-card") || customElements.define("glow-thermostat-card", ut);
const Ht = class Ht extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-selector,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, ui(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "climate" } }
      }
    ], e = {
      entity: "Climate Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderFeatureEntityPicker(t, e, i) {
    return a`
      <ha-selector
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: i } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderNumberInput(t, e, i = "") {
    return a`
      <ha-textfield
        type="number"
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Thermostat")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Height", "height", "auto")}
            ${this.renderTextInput("Radius", "border_radius", "18px")}
            ${this.renderNumberInput("Temperature Step", "temperature_step", "1")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Show State", "show_state", !1)}
            ${this.renderSwitch("Show Current", "show_current", !0)}
            ${this.renderSwitch("Show Controls", "show_controls", !0)}
            ${this.renderSwitch("Show Mode Buttons", "show_mode_buttons", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Heat Color", "heat_color", "#ff8a1c")}
            ${this.renderTextInput("Cool Color", "cool_color", "#2f80ff")}
            ${this.renderTextInput("Idle Color", "idle_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Features</h3>
          <div class="grid">
            ${this.renderSwitch("Show Features", "show_features", !1)}
            ${this.renderSwitch("HVAC Modes", "show_hvac_modes", !0)}
            ${this.renderSwitch("Fan Modes", "show_fan_modes", !0)}
            ${this.renderSwitch("Vertical Swing", "show_swing_modes", !0)}
            ${this.renderSwitch(
      "Horizontal Swing",
      "show_horizontal_swing_modes",
      !0
    )}
          </div>
          <div class="grid">
            ${this.renderFeatureEntityPicker(
      "Filter Sensor",
      "filter_entity",
      "binary_sensor"
    )}
            ${this.renderFeatureEntityPicker(
      "Problem Sensor",
      "problem_entity",
      "binary_sensor"
    )}
            ${this.renderFeatureEntityPicker("PM2.5 Sensor", "pm25_entity", "sensor")}
            ${this.renderFeatureEntityPicker(
      "Display Light",
      "display_light_entity",
      "light"
    )}
            ${this.renderFeatureEntityPicker(
      "Sleep Mode",
      "sleep_mode_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Vertical Position",
      "vertical_position_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Horizontal Position",
      "horizontal_position_entity",
      "select"
    )}
            ${this.renderFeatureEntityPicker(
      "Anti-frost",
      "anti_frost_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker(
      "Anti-mildew",
      "anti_mildew_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker("Eco", "eco_switch_entity", "switch")}
            ${this.renderFeatureEntityPicker("Health", "health_switch_entity", "switch")}
            ${this.renderFeatureEntityPicker(
      "Soft Wind",
      "soft_wind_switch_entity",
      "switch"
    )}
            ${this.renderFeatureEntityPicker("Sound", "sound_switch_entity", "switch")}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", _e, "more-info")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      _e,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Ht.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let ft = Ht;
customElements.get("glow-thermostat-card-editor") || customElements.define("glow-thermostat-card-editor", ft);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-thermostat-card",
  name: "Glow Thermostat Card",
  description: "A dial-style thermostat card with instant setpoint controls."
});
const K = {
  icon: "mdi:television-play",
  width: "280px",
  fill_container: !1,
  height: "120px",
  border_radius: "22px",
  show_state: !0,
  show_source: !0,
  active_color: "#ff8a1c",
  idle_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "more-info",
  hold_action: "more-info",
  animated: !0,
  active_states: ["on", "playing", "paused", "buffering", "idle"],
  off_states: ["off", "standby", "unavailable", "unknown"]
}, ke = [
  "more-info",
  "none",
  "toggle",
  "call-service",
  "script"
];
function mi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Wt = class Wt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return m`
      :host {
        --media-card-width: 280px;
        --media-card-height: 120px;
        --media-card-radius: 22px;
        --media-active-color: #ff8a1c;
        --media-idle-color: #45d158;
        --media-off-color: #697382;
        --media-background: #101722;

        display: block;
        max-width: var(--media-card-width);
        width: 100%;
      }

      :host([interactive]) {
        cursor: pointer;
      }

      :host([interactive]) ha-card,
      :host([interactive]) .media-button {
        cursor: pointer;
      }

      :host([unavailable]) {
        cursor: default;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      ha-card.unavailable {
        cursor: default;
      }

      .media-button {
        all: unset;
        cursor: default;
        display: grid;
        grid-template-columns: 86px 1fr;
        gap: 16px;
        min-height: 100%;
        position: relative;
        width: 100%;
        text-align: left;
      }

      .media-button::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--media-warm-color) 10%, transparent) 72%,
            color-mix(in srgb, var(--media-hot-color) 25%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--media-warm-color) 9%, transparent),
            transparent 34%,
            transparent 70%,
            color-mix(in srgb, var(--media-hot-color) 11%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .media-button::after {
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--media-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--media-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--media-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--media-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--media-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--media-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--media-state-color) 8%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--media-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--media-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .media-button.on.animated::after {
        animation: glow-breathe 3s ease-in-out infinite;
      }

      .media-button.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.6;
      }

      .icon-shell,
      .content {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--media-state-color) 24%, transparent),
            transparent 70%
          ),
          color-mix(in srgb, var(--media-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--media-state-color) 26%, transparent);
        border-radius: 16px;
        color: var(--media-icon-color);
        display: inline-flex;
        font: inherit;
        height: 56px;
        justify-content: center;
        width: 56px;
        transition: color 160ms ease, opacity 160ms ease;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 28px;
        color: currentColor;
        opacity: var(--media-icon-opacity, 1);
      }

      .content {
        align-self: center;
        display: grid;
        gap: 8px;
        min-width: 0;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 13px;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .details {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 13px;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .media-button:focus-visible {
        outline: 2px solid var(--media-state-color);
        outline-offset: 3px;
      }

      @keyframes glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .media-button.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("glow-media-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (r) => r.startsWith("media_player.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...K,
      ...t
    }, this.style.setProperty(
      "--media-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "280px"
    ), this.style.setProperty(
      "--media-card-height",
      this.config.height ?? "120px"
    ), this.style.setProperty(
      "--media-card-radius",
      this.config.border_radius ?? "22px"
    ), this.style.setProperty(
      "--media-active-color",
      this.config.active_color ?? "#ff8a1c"
    ), this.style.setProperty(
      "--media-idle-color",
      this.config.idle_color ?? "#45d158"
    ), this.style.setProperty(
      "--media-off-color",
      this.config.off_color ?? "#697382"
    ), this.style.setProperty(
      "--media-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return {
      rows: 2,
      columns: 6,
      min_rows: 2,
      max_rows: 2,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get state() {
    var t;
    return String(((t = this.entity) == null ? void 0 : t.state) ?? "unknown").toLowerCase();
  }
  get activeStates() {
    return Array.isArray(this.config.active_states) ? this.config.active_states.map((t) => String(t).toLowerCase()) : K.active_states ?? [];
  }
  get offStates() {
    return Array.isArray(this.config.off_states) ? this.config.off_states.map((t) => String(t).toLowerCase()) : K.off_states ?? [];
  }
  get isActive() {
    return this.activeStates.includes(this.state);
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.state);
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.entity ? (this.entity.state || "unknown").replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()) : "Unavailable";
  }
  get sourceText() {
    var n;
    if (!this.config.show_source)
      return;
    const t = (n = this.entity) == null ? void 0 : n.attributes, e = String((t == null ? void 0 : t.source) ?? "").trim(), i = String((t == null ? void 0 : t.app_name) ?? "").trim(), r = String((t == null ? void 0 : t.app_id) ?? "").trim();
    return e || i || r || void 0;
  }
  get stateColor() {
    return this.isActive ? this.state === "idle" ? this.config.idle_color ?? "#45d158" : this.config.active_color ?? "#ff8a1c" : this.config.off_color ?? "#697382";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || K.icon;
  }
  performAction(t) {
    var e, i;
    if (t) {
      if (typeof t == "string") {
        if (t === "more-info") {
          this.dispatchMoreInfo();
          return;
        }
        if (t === "toggle") {
          this.performToggle();
          return;
        }
        return;
      }
      if (t.action === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      if (t.action === "toggle") {
        this.performToggle();
        return;
      }
      if (t.action === "call-service") {
        const r = String(t.service || "").trim(), [n, s] = r.split(".");
        if (!n || !s)
          return;
        const c = {
          ...t.service_data ?? t.data ?? {}
        };
        Object.prototype.hasOwnProperty.call(c, "entity_id") || (c.entity_id = this.config.entity), t.target ? (e = this.hass) == null || e.callService(n, s, c, t.target) : (i = this.hass) == null || i.callService(n, s, c);
        return;
      }
    }
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    if (window.clearTimeout(this.holdTimer), this.holdActive) {
      this.holdActive = !1;
      return;
    }
  }
  handlePointerCancel() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1;
  }
  handleClick() {
    this.holdActive || this.performAction(this.config.tap_action);
  }
  performToggle() {
    var r, n, s, c;
    if (this.isUnavailable)
      return;
    const e = !!(Number(
      ((r = this.entity) == null ? void 0 : r.attributes.supported_features) ?? 0
    ) & 1), i = this.state;
    if (e) {
      (n = this.hass) == null || n.callService("media_player", "toggle", {
        entity_id: this.config.entity
      });
      return;
    }
    if (["off", "standby"].includes(i)) {
      (s = this.hass) == null || s.callService("media_player", "turn_on", {
        entity_id: this.config.entity
      });
      return;
    }
    if (["on", "playing", "paused", "buffering", "idle"].includes(i)) {
      (c = this.hass) == null || c.callService("media_player", "turn_off", {
        entity_id: this.config.entity
      });
      return;
    }
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isActive && !this.isUnavailable, e = this.sourceText;
    return this.toggleAttribute("unavailable", this.isUnavailable), this.toggleAttribute(
      "interactive",
      !this.isUnavailable && this.config.tap_action !== "none"
    ), a`
      <ha-card
        class=${this.isUnavailable ? "unavailable" : ""}
        style="
          --media-state-color: ${this.stateColor};
          --media-warm-color: ${t ? "color-mix(in srgb, " + this.stateColor + " 86%, #ffd26a)" : this.stateColor};
          --media-hot-color: ${t ? "color-mix(in srgb, " + this.stateColor + " 82%, #ff4f00)" : this.stateColor};
          --media-border-strength: ${t ? "26%" : "18%"};
          --media-inner-ring-width: ${t ? "1px" : "0px"};
          --media-inner-ring-strength: ${t ? "8%" : "0%"};
          --media-outer-blur: ${t ? "50px" : "0"};
          --media-outer-strength: ${t ? "10%" : "0%"};
          --media-on-opacity: ${t ? "1" : "0"};
          --media-icon-color: ${this.stateColor};
          --media-icon-opacity: ${t ? "1" : "0.55"};
        "
      >
        <button
          type="button"
          class="media-button ${t ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerCancel}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
            ${e ? a`<span class="details">${e}</span>` : this.config.show_source && !this.config.show_state ? a`<span class="details">${this.displayState}</span>` : d}
          </span>
        </button>
      </ha-card>
    `;
  }
};
Wt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 }
};
let mt = Wt;
customElements.get("glow-media-card") || customElements.define("glow-media-card", mt);
const Gt = class Gt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-form,
      ha-icon-picker,
      ha-textfield,
      ha-select,
      select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, mi(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var n;
    const e = t.currentTarget || t.target, i = ((n = e == null ? void 0 : e.dataset) == null ? void 0 : n.configValue) || e.configValue;
    if (!i)
      return;
    let r;
    if (e instanceof HTMLInputElement ? r = e.type === "checkbox" ? e.checked : e.value : (e instanceof HTMLSelectElement || e instanceof HTMLTextAreaElement, r = e.value), i === "active_states" || i === "off_states") {
      this.updateConfig({
        [i]: String(r).split(",").map((s) => s.trim()).filter(Boolean)
      });
      return;
    }
    if (i === "tap_action" || i === "hold_action") {
      const s = String(r);
      if (s === "call-service") {
        this.updateConfig({
          [i]: {
            action: "call-service",
            service: ""
          }
        });
        return;
      }
      if (s === "script") {
        this.updateConfig({
          [i]: {
            action: "call-service",
            service: "script.turn_on"
          }
        });
        return;
      }
      this.updateConfig({
        [i]: s
      });
      return;
    }
    this.updateConfig({
      [i]: r
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: "media_player" } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    const r = this.config[e];
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${Array.isArray(r) ? r.join(", ") : r ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    const n = this.config[e], s = e === "tap_action" || e === "hold_action" ? this.getEditorActionType(e) : typeof n == "string" ? n : (n == null ? void 0 : n.action) ?? r;
    return a`
      <label>
        <span>${t}</span>
        <select
          .value=${s}
          data-config-value=${e}
          @change=${this.valueChanged}
        >
          ${i.map(
      (c) => a`
              <option
                value=${c}
                ?selected=${c === s}
              >
                ${c}
              </option>
            `
    )}
        </select>
      </label>
    `;
  }
  getActionValue(t) {
    return this.config[t];
  }
  isScriptAction(t) {
    var e, i;
    return typeof t == "object" && t.action === "call-service" && String(t.service) === "script.turn_on" && typeof ((e = t.target) == null ? void 0 : e.entity_id) == "string" && String((i = t.target) == null ? void 0 : i.entity_id).startsWith("script.");
  }
  getScriptEntityId(t) {
    var i;
    const e = this.getActionValue(t);
    if (this.isScriptAction(e))
      return String(((i = e.target) == null ? void 0 : i.entity_id) || "");
  }
  getCallServiceAction(t) {
    const e = this.getActionValue(t);
    return typeof e == "object" && e.action === "call-service" ? {
      action: "call-service",
      service: e.service ?? "",
      target: e.target,
      service_data: e.service_data ?? e.data
    } : {
      action: "call-service",
      service: ""
    };
  }
  getEditorActionType(t) {
    const e = this.getActionValue(t);
    return this.isScriptAction(e) ? "script" : typeof e == "string" ? e : (e == null ? void 0 : e.action) ?? "more-info";
  }
  renderActionFields(t) {
    var i;
    const e = this.getEditorActionType(t);
    if (e === "script")
      return a`
        <div class="grid full">
          <ha-selector
            .hass=${this.hass}
            .label=${t === "tap_action" ? "Tap Script" : "Hold Script"}
            .selector=${{ entity: { domain: "script" } }}
            .value=${this.getScriptEntityId(t) ?? ""}
            data-action-key=${t}
            data-action-field="script"
            @value-changed=${this.actionFieldChanged}
          ></ha-selector>
        </div>
      `;
    if (e === "call-service") {
      const r = this.getCallServiceAction(t);
      return a`
        <div class="grid full">
          <div>
            <ha-textfield
              .label=${t === "tap_action" ? "Tap Service" : "Hold Service"}
              .placeholder=${"script.sony_source_test"}
              .value=${r.service ?? ""}
              data-action-key=${t}
              data-action-field="service"
              @input=${this.actionFieldChanged}
            ></ha-textfield>
          </div>
          <div>
            <ha-selector
              .hass=${this.hass}
              .label=${t === "tap_action" ? "Tap Target Entity" : "Hold Target Entity"}
              .selector=${{ entity: {} }}
              .value=${String(((i = r.target) == null ? void 0 : i.entity_id) ?? "")}
              data-action-key=${t}
              data-action-field="target_entity"
              @value-changed=${this.actionFieldChanged}
            ></ha-selector>
          </div>
          <div class="full">
            <label>
              ${t === "tap_action" ? "Tap Data" : "Hold Data"}
              <textarea
                .value=${this.actionDataToString(r)}
                data-action-key=${t}
                data-action-field="data"
                @change=${this.actionFieldChanged}
                rows="5"
                style="width:100%;margin-top:6px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:inherit;"
              ></textarea>
            </label>
          </div>
        </div>
      `;
    }
    if (e === "more-info") {
      const r = this.config.entity;
      return a`
        <div class="grid full">
          <ha-selector
            .hass=${this.hass}
            .label=${t === "tap_action" ? "Tap Entity" : "Hold Entity"}
            .selector=${{ entity: { domain: "media_player" } }}
            .value=${r ?? ""}
            data-action-key=${t}
            data-action-field="entity"
            @value-changed=${this.actionFieldChanged}
          ></ha-selector>
        </div>
      `;
    }
    return a``;
  }
  actionDataToString(t) {
    const e = t.service_data ?? t.data;
    if (!e || typeof e != "object")
      return "";
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return "";
    }
  }
  actionFieldChanged(t) {
    var l, h, p;
    const e = t.target, i = (l = e.dataset) == null ? void 0 : l.actionKey, r = (h = e.dataset) == null ? void 0 : h.actionField;
    if (!i || !r)
      return;
    const n = ((p = e.detail) == null ? void 0 : p.value) ?? (typeof e.value == "string" ? e.value : void 0);
    if (n === void 0)
      return;
    const s = this.getActionValue(i), c = typeof s == "object" ? { ...s } : { action: s ?? "more-info" };
    if (r === "service")
      c.service = n;
    else if (r === "script")
      c.service = "script.turn_on", c.target = n ? { ...c.target, entity_id: n } : void 0;
    else if (r === "target_entity") {
      const g = n ? { entity_id: n } : void 0;
      g ? c.target = {
        ...c.target,
        ...g
      } : delete c.target;
    } else if (r === "data") {
      const g = this.parseActionData(n);
      if (g === void 0 && n.trim().length > 0)
        return;
      delete c.service_data, delete c.data, g && Object.keys(g).length && (c.data = g);
    } else r === "entity" && (n ? c.entity = n : delete c.entity);
    this.updateConfig({ [i]: c });
  }
  parseActionData(t) {
    const e = t.trim();
    if (e)
      try {
        return JSON.parse(e);
      } catch {
        const i = e.split(/\r?\n/), r = {};
        for (const n of i) {
          const s = n.match(/^\s*([a-zA-Z0-9_]+):\s*(.*)$/);
          if (!s)
            return;
          const [, c, l] = s;
          let h = l;
          if (/^\d+$/.test(l))
            h = Number(l);
          else if (/^(true|false)$/i.test(l))
            h = l.toLowerCase() === "true";
          else if (/^\[.*\]$/.test(l) || /^\{.*\}$/.test(l))
            try {
              h = JSON.parse(l);
            } catch {
              h = l;
            }
          r[c] = h;
        }
        return r;
      }
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "media_player" } }
      }
    ], e = {
      entity: "Media Player Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{ entity: this.config.entity }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Living Room TV")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "280px")}
            ${this.renderTextInput("Height", "height", "120px")}
            ${this.renderTextInput("Radius", "border_radius", "22px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Show Source", "show_source", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Active Color", "active_color", "#ff8a1c")}
            ${this.renderTextInput("Idle Color", "idle_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderTextInput(
      "Active States",
      "active_states",
      "on, playing, paused, buffering, idle"
    )}
            ${this.renderTextInput(
      "Off States",
      "off_states",
      "off, standby, unavailable, unknown"
    )}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", ke, "more-info")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      ke,
      "more-info"
    )}
          </div>
          ${this.renderActionFields("tap_action")}
          ${this.renderActionFields("hold_action")}
        </section>
      </div>
    `;
  }
};
Gt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let bt = Gt;
customElements.get("glow-media-card-editor") || customElements.define("glow-media-card-editor", bt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-media-card",
  name: "Glow Media Card",
  description: "A glowing media player card for TV and AV devices."
});
const Ce = {
  title: "Outlets",
  icon_1: "mdi:power-socket-us",
  icon_2: "mdi:power-socket-us",
  width: "320px",
  fill_container: !1,
  button_height: "54px",
  gap: "12px",
  layout: "duplex",
  show_title: !1,
  show_state: !0,
  on_color: "#ff3b30",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, Se = ["toggle", "more-info", "none"], bi = ["duplex", "grid", "stack"];
function xi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Kt = class Kt extends u {
  constructor() {
    super(...arguments), this.optimisticTimers = {}, this.optimisticStates = {}, this.holdActive = !1;
  }
  static get styles() {
    return m`
      :host {
        --outlet-card-width: 540px;
        --outlet-button-height: 54px;
        --outlet-gap: 12px;
        --outlet-on-color: #ff3b30;
        --outlet-off-color: #697382;
        --outlet-background: #101722;

        display: block;
        max-width: var(--outlet-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .card {
        display: grid;
        gap: 10px;
        width: 100%;
      }

      .title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 14px;
        font-weight: 600;
        gap: 8px;
        letter-spacing: 0;
        line-height: 1.2;
        min-height: 20px;
      }

      .title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--outlet-off-color);
      }

      .outlets {
        display: grid;
        gap: var(--outlet-gap);
      }

      .layout-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .layout-stack {
        grid-template-columns: 1fr;
      }

      .duplex-shell {
        background:
          radial-gradient(
            circle at 18% 22%,
            color-mix(in srgb, var(--outlet-any-color) 16%, transparent),
            transparent 36%
          ),
          radial-gradient(
            circle at 82% 78%,
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent),
            transparent 40%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--outlet-background) 88%, #ffffff 8%),
            color-mix(in srgb, var(--outlet-background) 94%, #000000 16%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-any-color) var(--outlet-shell-border-strength),
            transparent
          );
        border-radius: 26px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 1px rgb(255 255 255 / 3%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--outlet-shell-glow-blur)
            color-mix(
              in srgb,
              var(--outlet-any-color) var(--outlet-shell-glow-strength),
              transparent
            );
        box-sizing: border-box;
        display: grid;
        gap: 0;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .duplex-shell::before {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-any-color) 15%, transparent),
            transparent 70%
          );
        content: '';
        filter: blur(16px);
        inset: 8px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-shell::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-any-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 12px
            color-mix(in srgb, var(--outlet-any-color) 10%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-any-color) 12%, transparent);
        content: '';
        inset: 2px;
        opacity: var(--outlet-any-on-opacity);
        pointer-events: none;
        position: absolute;
      }

      .duplex-outlet {
        align-items: center;
        background:
          linear-gradient(
            115deg,
            color-mix(in srgb, var(--outlet-warm-color) 13%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 13%, transparent) 100%
          );
        border: 0;
        border-radius: 0;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 12px;
        grid-template-columns: 48px minmax(0, 1fr) 14px;
        min-height: calc(var(--outlet-button-height) + 4px);
        overflow: hidden;
        padding: 8px 12px 8px 10px;
        position: relative;
        text-align: left;
        width: 100%;
        z-index: 1;
      }

      .duplex-outlet.top {
        border-radius: 25px 25px 0 0;
      }

      .duplex-outlet.bottom {
        border-radius: 0 0 25px 25px;
      }

      .duplex-outlet.single {
        border-radius: 25px;
      }

      .duplex-outlet::before,
      .duplex-outlet::after {
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .duplex-outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 42%,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 24%, transparent) 100%
          );
      }

      .duplex-outlet::after {
        border: 0;
        border-radius: inherit;
        box-shadow:
          inset 0 0 0 1px
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
          inset 0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
          inset 0 1px 0 rgb(255 255 255 / 7%);
      }

      .socket-face {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 18%, transparent),
            transparent 74%
          ),
          color-mix(in srgb, var(--outlet-state-color) 8%, rgb(255 255 255 / 5%));
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 34%, transparent);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            );
        display: inline-grid;
        height: 36px;
        justify-content: center;
        place-items: center;
        position: relative;
        width: 36px;
        z-index: 2;
      }

      .socket-icon {
        color: color-mix(in srgb, var(--outlet-state-color) 82%, #dce4f0 14%);
        filter: drop-shadow(
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            )
        );
        height: 23px;
        width: 23px;
      }

      .socket-icon path {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2.5;
      }

      .duplex-divider {
        background: linear-gradient(
          90deg,
          transparent,
          rgb(255 255 255 / 10%),
          transparent
        );
        height: 1px;
        margin: 0 16px;
        position: relative;
        z-index: 3;
      }

      .outlet {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--outlet-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--outlet-hot-color) 15%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--outlet-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--outlet-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--outlet-state-color) var(--outlet-border-strength),
            transparent
          );
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--outlet-inner-ring-width)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--outlet-outer-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 9px;
        grid-template-columns: 42px minmax(0, 1fr) 18px;
        min-height: var(--outlet-button-height);
        overflow: hidden;
        padding: 8px 12px 8px 9px;
        position: relative;
        text-align: left;
        width: 100%;
      }

      .outlet::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--outlet-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--outlet-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--outlet-warm-color) 11%, transparent),
            transparent 34%,
            transparent 67%,
            color-mix(in srgb, var(--outlet-hot-color) 14%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outlet::after {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
          0 0 18px
            color-mix(in srgb, var(--outlet-state-color) 20%, transparent),
          0 0 42px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 82px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 18%, transparent);
        border-radius: inherit;
        box-shadow:
          0 0 12px
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
          0 0 34px
            color-mix(in srgb, var(--outlet-state-color) 14%, transparent),
          0 0 70px
            color-mix(in srgb, var(--outlet-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--outlet-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--outlet-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
        z-index: 0;
      }

      .icon-shell,
      .socket-face,
      .content,
      .status-light {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--outlet-state-color) 22%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--outlet-state-color) 14%, #ffffff 2%);
        border: 1px solid
          color-mix(in srgb, var(--outlet-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--outlet-state-color);
        display: inline-flex;
        height: 36px;
        justify-content: center;
        width: 36px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-light {
        align-self: center;
        background: color-mix(
          in srgb,
          var(--outlet-state-color) var(--outlet-status-strength),
          #2f3642
        );
        border-radius: 999px;
        box-shadow:
          0 0 var(--outlet-status-blur)
            color-mix(
              in srgb,
              var(--outlet-state-color) var(--outlet-status-glow),
              transparent
            ),
          inset 0 1px 0 rgb(255 255 255 / 14%);
        height: 8px;
        justify-self: center;
        width: 8px;
      }

      .outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .duplex-outlet:focus-visible {
        outline: 2px solid var(--outlet-state-color);
        outline-offset: 3px;
      }

      .outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .duplex-outlet.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      .duplex-outlet.on.animated::after {
        animation: outlet-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes outlet-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @media (max-width: 620px) {
        .layout-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .outlet.on.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("dual-outlet-card-editor");
  }
  static getStubConfig(t, e) {
    const i = e.filter(
      (r) => r.startsWith("switch.") || r.startsWith("light.") || r.startsWith("input_boolean.")
    );
    return {
      entity_1: i[0] ?? "",
      entity_2: i[1] ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity_1))
      throw new Error("Entity 1 is required");
    this.config = {
      ...Ce,
      ...t
    }, this.style.setProperty(
      "--outlet-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--outlet-button-height",
      this.config.button_height ?? "54px"
    ), this.style.setProperty("--outlet-gap", this.config.gap ?? "12px"), this.style.setProperty("--outlet-on-color", this.config.on_color ?? "#ff3b30"), this.style.setProperty("--outlet-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--outlet-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return (this.config.layout === "grid" ? 2 : 3) + (this.config.show_title ? 1 : 0);
  }
  getGridOptions() {
    const e = (this.config.layout === "grid" ? 1 : this.outlets.length > 1 ? 2 : 1) + (this.config.show_title ? 1 : 0);
    return {
      rows: e,
      columns: 6,
      min_rows: e,
      max_rows: Math.max(e, 4),
      min_columns: 3,
      max_columns: 12
    };
  }
  get anyOutletOn() {
    return this.outlets.some(
      (t) => this.isOn(this.getEntity(t.entityId), t.entityId)
    );
  }
  get outlets() {
    const t = [
      {
        entityId: this.config.entity_1,
        name: this.config.name_1,
        icon: this.config.icon_1,
        fallbackName: "Outlet 1"
      }
    ];
    return this.config.entity_2 && t.push({
      entityId: this.config.entity_2,
      name: this.config.name_2,
      icon: this.config.icon_2,
      fallbackName: "Outlet 2"
    }), t;
  }
  getEntity(t) {
    var e;
    return (e = this.hass) == null ? void 0 : e.states[t];
  }
  isOn(t, e) {
    return e && this.optimisticStates[e] !== void 0 ? this.optimisticStates[e] : (t == null ? void 0 : t.state) === "on";
  }
  isUnavailable(t) {
    return !t || ["unavailable", "unknown"].includes(t.state);
  }
  domain(t) {
    return t.split(".")[0] || "switch";
  }
  displayName(t) {
    const e = this.getEntity(t.entityId);
    return t.name || (e == null ? void 0 : e.attributes.friendly_name) || t.fallbackName || t.entityId;
  }
  displayState(t, e) {
    return this.isUnavailable(t) ? "Unavailable" : this.isOn(t, e) ? "On" : "Off";
  }
  displayIcon(t) {
    const e = this.getEntity(t.entityId);
    return t.icon || (e == null ? void 0 : e.attributes.icon) || Ce.icon_1;
  }
  dispatchMoreInfo(t) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticState(t, e) {
    window.clearTimeout(this.optimisticTimers[t]), this.optimisticStates = {
      ...this.optimisticStates,
      [t]: e
    }, this.optimisticTimers[t] = window.setTimeout(() => {
      this.clearOptimisticState(t);
    }, 1800);
  }
  clearOptimisticState(t) {
    window.clearTimeout(this.optimisticTimers[t]);
    const e = { ...this.optimisticStates };
    delete e[t], this.optimisticStates = e;
  }
  trackServiceResult(t, e) {
    e && typeof e.catch == "function" && e.catch(() => this.clearOptimisticState(t));
  }
  performAction(t, e) {
    var r;
    const i = this.getEntity(t);
    if (!(this.isUnavailable(i) || !e || e === "none")) {
      if (e === "more-info") {
        this.dispatchMoreInfo(t);
        return;
      }
      this.setOptimisticState(t, !this.isOn(i, t)), this.trackServiceResult(
        t,
        (r = this.hass) == null ? void 0 : r.callService(this.domain(t), "toggle", {
          entity_id: t
        })
      );
    }
  }
  handlePointerDown(t) {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.performAction(t, this.config.hold_action);
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick(t) {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performAction(t, this.config.tap_action);
  }
  renderOutlet(t) {
    const e = this.getEntity(t.entityId), i = this.isOn(e, t.entityId), r = this.isUnavailable(e), n = i ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", s = i ? "1" : "0";
    return a`
      <button
        class="outlet ${i ? "on" : "off"} ${r ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${n};
          --outlet-warm-color: ${i ? "color-mix(in srgb, " + n + " 86%, #ff9a64)" : n};
          --outlet-hot-color: ${i ? "color-mix(in srgb, " + n + " 80%, #ff1d1d)" : n};
          --outlet-on-opacity: ${s};
          --outlet-border-strength: ${i ? "26%" : "18%"};
          --outlet-inner-ring-width: ${i ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${i ? "8%" : "0%"};
          --outlet-outer-blur: ${i ? "50px" : "0"};
          --outlet-outer-strength: ${i ? "10%" : "0%"};
          --outlet-status-strength: ${i ? "92%" : "22%"};
          --outlet-status-blur: ${i ? "18px" : "0"};
          --outlet-status-glow: ${i ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="ambient-glow"></span>
        <span class="outline-glow"></span>
        <span class="icon-shell">
          <ha-icon icon=${this.displayIcon(t)}></ha-icon>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? a`<span class="state"
                >${this.displayState(e, t.entityId)}</span
              >` : d}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplexOutlet(t, e) {
    const i = this.getEntity(t.entityId), r = this.isOn(i, t.entityId), n = this.isUnavailable(i), s = r ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", c = r ? "1" : "0";
    return a`
      <button
        class="duplex-outlet ${e} ${r ? "on" : "off"} ${n ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${s};
          --outlet-warm-color: ${r ? "color-mix(in srgb, " + s + " 86%, #ff9a64)" : s};
          --outlet-hot-color: ${r ? "color-mix(in srgb, " + s + " 80%, #ff1d1d)" : s};
          --outlet-on-opacity: ${c};
          --outlet-border-strength: ${r ? "26%" : "18%"};
          --outlet-inner-ring-width: ${r ? "1px" : "0px"};
          --outlet-inner-ring-strength: ${r ? "8%" : "0%"};
          --outlet-outer-blur: ${r ? "50px" : "0"};
          --outlet-outer-strength: ${r ? "10%" : "0%"};
          --outlet-status-strength: ${r ? "92%" : "22%"};
          --outlet-status-blur: ${r ? "18px" : "0"};
          --outlet-status-glow: ${r ? "72%" : "0%"};
        "
        aria-label=${this.displayName(t)}
        @click=${() => this.handleClick(t.entityId)}
        @pointerdown=${() => this.handlePointerDown(t.entityId)}
        @pointerup=${this.handlePointerUp}
        @pointerleave=${this.handlePointerUp}
        @pointercancel=${this.handlePointerUp}
      >
        <span class="socket-face" aria-hidden="true">
          <svg class="socket-icon" viewBox="0 0 32 32" focusable="false">
            <path d="M12 8v8"></path>
            <path d="M20 8v8"></path>
            <path d="M11.5 22.5c0 3 2 5 4.5 5s4.5-2 4.5-5"></path>
          </svg>
        </span>
        <span class="content">
          <span class="name">${this.displayName(t)}</span>
          ${this.config.show_state ? a`<span class="state"
                >${this.displayState(i, t.entityId)}</span
              >` : d}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplex() {
    const t = this.anyOutletOn, e = t ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382";
    return a`
      <div
        class="duplex-shell"
        style="
          --outlet-any-color: ${e};
          --outlet-any-on-opacity: ${t ? "1" : "0"};
          --outlet-shell-border-strength: ${t ? "22%" : "16%"};
          --outlet-shell-glow-blur: ${t ? "50px" : "0"};
          --outlet-shell-glow-strength: ${t ? "10%" : "0%"};
        "
      >
        ${this.outlets.map(
      (i, r) => a`
            ${r > 0 ? a`<span class="duplex-divider"></span>` : d}
            ${this.renderDuplexOutlet(
        i,
        this.outlets.length === 1 ? "single" : r === 0 ? "top" : "bottom"
      )}
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.config.layout ?? "duplex";
    return a`
      <ha-card>
        <div class="card">
          ${this.config.show_title ? a`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              ` : d}
          ${t === "duplex" ? this.renderDuplex() : a`
                <div class="outlets layout-${t}">
                  ${this.outlets.map((e) => this.renderOutlet(e))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
Kt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticStates: { state: !0 }
};
let xt = Kt;
customElements.get("dual-outlet-card") || customElements.define("dual-outlet-card", xt);
const qt = class qt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, xi(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: ["switch", "light", "input_boolean"] } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Outlets</h3>
          <div class="grid">
            ${this.renderEntityPicker("Outlet 1 Entity", "entity_1")}
            ${this.renderTextInput("Outlet 1 Name", "name_1", "Top Outlet")}
            ${this.renderIconPicker("Outlet 1 Icon", "icon_1")}
            ${this.renderEntityPicker("Outlet 2 Entity", "entity_2")}
            ${this.renderTextInput("Outlet 2 Name", "name_2", "Bottom Outlet")}
            ${this.renderIconPicker("Outlet 2 Icon", "icon_2")}
          </div>
        </section>

        <section class="section">
          <h3>Layout</h3>
          <div class="grid">
            ${this.renderTextInput("Title", "title", "Outlets")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Button Height", "button_height", "54px")}
            ${this.renderTextInput("Gap", "gap", "12px")}
            ${this.renderSelect("Layout", "layout", bi, "duplex")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show Title", "show_title", !1)}
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#ff3b30")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", Se, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Se,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
qt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let vt = qt;
customElements.get("dual-outlet-card-editor") || customElements.define("dual-outlet-card-editor", vt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "dual-outlet-card",
  name: "Dual Outlet Card",
  description: "A two-outlet toggle card with red on-state glow."
});
const Ee = {
  icon: "mdi:fan",
  width: "260px",
  fill_container: !1,
  height: "56px",
  border_radius: "999px",
  show_state: !0,
  show_speed_buttons: !0,
  off_label: "Off",
  speed_1_label: "1",
  speed_2_label: "2",
  speed_3_label: "3",
  speed_1_percentage: 33,
  speed_2_percentage: 66,
  speed_3_percentage: 100,
  on_color: "#45d158",
  off_color: "#697382",
  background: "#101722",
  tap_action: "cycle",
  hold_action: "more-info",
  animated: !0
}, vi = ["cycle", "more-info", "none"], yi = ["more-info", "none"];
function wi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function I(o, t) {
  if (typeof o == "number" && Number.isFinite(o))
    return o;
  if (typeof o == "string") {
    const e = Number(o);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
const Jt = class Jt extends u {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledSpeedPointer = !1;
  }
  static get styles() {
    return m`
      :host {
        --fan-card-width: 260px;
        --fan-card-height: 56px;
        --fan-card-radius: 999px;
        --fan-on-color: #45d158;
        --fan-off-color: #697382;
        --fan-background: #101722;

        display: block;
        max-width: var(--fan-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .fan {
        align-items: center;
        background:
          radial-gradient(
            circle at 15% 50%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent),
            transparent 44%
          ),
          linear-gradient(
            118deg,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 0%,
            color-mix(in srgb, var(--fan-state-color) 7%, transparent) 48%,
            color-mix(in srgb, var(--fan-hot-color) 14%, transparent) 100%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--fan-background) 92%, #ffffff 7%),
            color-mix(in srgb, var(--fan-background) 92%, #000000 13%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--fan-state-color) var(--fan-border-strength),
            transparent
          );
        border-radius: var(--fan-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 8%),
          inset 0 0 0 var(--fan-inner-ring-width)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-inner-ring-strength),
              transparent
            ),
          0 12px 24px rgb(0 0 0 / 22%),
          0 0 var(--fan-outer-blur)
            color-mix(
              in srgb,
              var(--fan-state-color) var(--fan-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 46px minmax(0, 1fr) auto;
        min-height: var(--fan-card-height);
        overflow: hidden;
        padding: 8px 10px 8px 10px;
        position: relative;
        text-align: left;
        touch-action: manipulation;
        user-select: none;
        width: 100%;
      }

      .fan::before {
        background:
          radial-gradient(
            ellipse at center,
            transparent 38%,
            color-mix(in srgb, var(--fan-warm-color) 12%, transparent) 72%,
            color-mix(in srgb, var(--fan-hot-color) 28%, transparent) 100%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--fan-warm-color) 10%, transparent),
            transparent 34%,
            transparent 68%,
            color-mix(in srgb, var(--fan-hot-color) 12%, transparent)
          );
        content: '';
        inset: 0;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .fan::after {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 24%, transparent);
        border-radius: inherit;
        box-shadow:
          inset 0 0 16px color-mix(in srgb, var(--fan-state-color) 12%, transparent),
          0 0 18px color-mix(in srgb, var(--fan-state-color) 20%, transparent),
          0 0 42px color-mix(in srgb, var(--fan-state-color) 14%, transparent),
          0 0 82px color-mix(in srgb, var(--fan-state-color) 8%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--fan-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .ambient-glow,
      .outline-glow {
        border-radius: inherit;
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .outline-glow {
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 18%, transparent);
        box-shadow:
          0 0 12px color-mix(in srgb, var(--fan-state-color) 22%, transparent),
          0 0 34px color-mix(in srgb, var(--fan-state-color) 14%, transparent),
          0 0 70px color-mix(in srgb, var(--fan-state-color) 8%, transparent);
        inset: 2px;
        opacity: var(--fan-on-opacity);
        z-index: 1;
      }

      .ambient-glow {
        background:
          radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--fan-state-color) 12%, transparent),
            transparent 78%
          );
        filter: blur(18px);
        inset: 7px;
        opacity: var(--fan-on-opacity);
        z-index: 0;
      }

      .icon-shell,
      .content,
      .speed-buttons {
        position: relative;
        z-index: 2;
      }

      .icon-shell {
        align-items: center;
        align-self: center;
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 24%, transparent),
            transparent 72%
          ),
          color-mix(in srgb, var(--fan-state-color) 14%, #ffffff 2%);
        border: 1px solid color-mix(in srgb, var(--fan-state-color) 26%, transparent);
        border-radius: 999px;
        color: var(--fan-state-color);
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .icon-shell ha-icon {
        --mdc-icon-size: 22px;
        color: currentColor;
      }

      .fan.on.animated .icon-shell ha-icon {
        animation: fan-spin 1.8s linear infinite;
      }

      .content {
        align-self: center;
        display: flex;
        flex-direction: column;
        justify-self: center;
        min-width: 0;
        text-align: center;
        width: 100%;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 550;
        letter-spacing: 0;
        line-height: 1.16;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 12px;
        line-height: 1.25;
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .speed-buttons {
        align-items: center;
        align-self: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        display: inline-grid;
        gap: 2px;
        grid-template-columns: repeat(4, minmax(26px, 1fr));
        min-width: 112px;
        padding: 3px;
      }

      .speed {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        height: 26px;
        justify-content: center;
        letter-spacing: 0;
        min-width: 0;
        padding: 0 6px;
        touch-action: manipulation;
        user-select: none;
      }

      .speed.active {
        background:
          radial-gradient(
            circle,
            color-mix(in srgb, var(--fan-state-color) 22%, transparent),
            transparent 78%
          ),
          color-mix(in srgb, var(--fan-state-color) 18%, #ffffff 3%);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 10%),
          0 0 16px color-mix(in srgb, var(--fan-state-color) 16%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .fan:focus-visible,
      .speed:focus-visible {
        outline: 2px solid var(--fan-state-color);
        outline-offset: 3px;
      }

      .fan.unavailable {
        cursor: default;
        filter: grayscale(0.75);
        opacity: 0.62;
      }

      .fan.on.animated::after {
        animation: fan-glow-breathe 3s ease-in-out infinite;
      }

      @keyframes fan-glow-breathe {
        0%,
        100% {
          opacity: 0.72;
        }

        50% {
          opacity: 1;
        }
      }

      @keyframes fan-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .fan.on.animated::after,
        .fan.on.animated .icon-shell ha-icon {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("speed-fan-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter((r) => r.startsWith("fan."));
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...Ee,
      ...t,
      speed_1_percentage: I(t.speed_1_percentage, 33),
      speed_2_percentage: I(t.speed_2_percentage, 66),
      speed_3_percentage: I(t.speed_3_percentage, 100)
    }, this.style.setProperty(
      "--fan-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "260px"
    ), this.style.setProperty("--fan-card-height", this.config.height ?? "56px"), this.style.setProperty(
      "--fan-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--fan-on-color", this.config.on_color ?? "#45d158"), this.style.setProperty("--fan-off-color", this.config.off_color ?? "#697382"), this.style.setProperty("--fan-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 1;
  }
  getGridOptions() {
    return {
      rows: 1,
      columns: 6,
      min_rows: 1,
      max_rows: 1,
      min_columns: 3,
      max_columns: 12
    };
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return this.optimisticLevel !== void 0 ? this.optimisticLevel > 0 : ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get percentage() {
    var t;
    return this.optimisticLevel !== void 0 ? this.optimisticLevel === 0 ? 0 : this.percentageForLevel(this.optimisticLevel) : this.isOn ? I((t = this.entity) == null ? void 0 : t.attributes.percentage, 100) : 0;
  }
  get entityPercentage() {
    var t, e;
    return ((t = this.entity) == null ? void 0 : t.state) !== "on" ? 0 : I((e = this.entity) == null ? void 0 : e.attributes.percentage, 100);
  }
  levelFromPercentage(t) {
    if (t <= 0)
      return 0;
    const e = this.config.speed_1_percentage ?? 33, i = this.config.speed_2_percentage ?? 66;
    return t <= (e + i) / 2 ? 1 : t < (i + (this.config.speed_3_percentage ?? 100)) / 2 ? 2 : 3;
  }
  get entityLevel() {
    return this.levelFromPercentage(this.entityPercentage);
  }
  get level() {
    return this.optimisticLevel !== void 0 ? this.optimisticLevel : this.levelFromPercentage(this.percentage);
  }
  get domain() {
    return this.config.entity.split(".")[0] || "fan";
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    return this.isUnavailable ? "Unavailable" : this.isOn ? `${this.percentage}%` : this.config.off_label ?? "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || Ee.icon;
  }
  percentageForLevel(t) {
    return t === 1 ? this.config.speed_1_percentage ?? 33 : t === 2 ? this.config.speed_2_percentage ?? 66 : this.config.speed_3_percentage ?? 100;
  }
  dispatchMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.config.entity },
        bubbles: !0,
        composed: !0
      })
    );
  }
  setOptimisticLevel(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticLevel = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticLevel = void 0;
    }, 8e3);
  }
  clearOptimisticLevel() {
    window.clearTimeout(this.optimisticTimer), this.optimisticLevel = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticLevel());
  }
  updated() {
    this.optimisticLevel !== void 0 && this.entityLevel === this.optimisticLevel && this.clearOptimisticLevel();
  }
  setLevel(t) {
    var e, i, r;
    if (!this.isUnavailable) {
      if (this.setOptimisticLevel(t), t === 0) {
        this.trackServiceResult(
          (e = this.hass) == null ? void 0 : e.callService(this.domain, "turn_off", {
            entity_id: this.config.entity
          })
        );
        return;
      }
      if (this.domain === "fan") {
        this.trackServiceResult(
          (i = this.hass) == null ? void 0 : i.callService("fan", "turn_on", {
            entity_id: this.config.entity,
            percentage: this.percentageForLevel(t)
          })
        );
        return;
      }
      this.trackServiceResult(
        (r = this.hass) == null ? void 0 : r.callService(this.domain, "turn_on", {
          entity_id: this.config.entity
        })
      );
    }
  }
  cycleSpeed() {
    const t = (this.level + 1) % 4;
    this.setLevel(t);
  }
  performTapAction() {
    if (!(this.isUnavailable || this.config.tap_action === "none")) {
      if (this.config.tap_action === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.cycleSpeed();
    }
  }
  handlePointerDown() {
    window.clearTimeout(this.holdTimer), this.holdActive = !1, this.holdTimer = window.setTimeout(() => {
      this.holdActive = !0, this.config.hold_action !== "none" && this.dispatchMoreInfo();
    }, 500);
  }
  handlePointerUp() {
    window.clearTimeout(this.holdTimer);
  }
  handleClick() {
    if (this.holdActive) {
      this.holdActive = !1;
      return;
    }
    this.performTapAction();
  }
  handleSpeedPointerDown(t, e) {
    t.preventDefault(), t.stopPropagation(), this.handledSpeedPointer = !0, window.setTimeout(() => {
      this.handledSpeedPointer = !1;
    }, 500), this.setLevel(e);
  }
  handleSpeedClick(t, e) {
    if (t.stopPropagation(), this.handledSpeedPointer) {
      this.handledSpeedPointer = !1;
      return;
    }
    this.setLevel(e);
  }
  renderSpeedButtons() {
    const t = [
      { level: 0, label: this.config.off_label ?? "Off" },
      { level: 1, label: this.config.speed_1_label ?? "1" },
      { level: 2, label: this.config.speed_2_label ?? "2" },
      { level: 3, label: this.config.speed_3_label ?? "3" }
    ];
    return a`
      <div class="speed-buttons" aria-label="Fan speed">
        ${t.map(
      (e) => a`
            <button
              class="speed ${this.level === e.level ? "active" : ""}"
              aria-label=${e.label}
              @pointerdown=${(i) => this.handleSpeedPointerDown(i, e.level)}
              @click=${(i) => this.handleSpeedClick(i, e.level)}
            >
              ${e.label}
            </button>
          `
    )}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return a`
      <ha-card
        style="
          --fan-state-color: ${t};
          --fan-warm-color: ${this.isOn ? "color-mix(in srgb, " + t + " 86%, #a8ffb2)" : t};
          --fan-hot-color: ${this.isOn ? "color-mix(in srgb, " + t + " 80%, #00ff66)" : t};
          --fan-on-opacity: ${e};
          --fan-border-strength: ${this.isOn ? "26%" : "18%"};
          --fan-inner-ring-width: ${this.isOn ? "1px" : "0px"};
          --fan-inner-ring-strength: ${this.isOn ? "8%" : "0%"};
          --fan-outer-blur: ${this.isOn ? "50px" : "0"};
          --fan-outer-strength: ${this.isOn ? "10%" : "0%"};
        "
      >
        <div
          class="fan ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          role="button"
          tabindex="0"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointerleave=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="ambient-glow"></span>
          <span class="outline-glow"></span>
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? a`<span class="state">${this.displayState}</span>` : d}
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : d}
        </div>
      </ha-card>
    `;
  }
};
Jt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLevel: { state: !0 }
};
let yt = Jt;
customElements.get("speed-fan-card") || customElements.define("speed-fan-card", yt);
const Yt = class Yt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-selector,
      ha-icon-picker,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      .full {
        grid-column: 1 / -1;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, wi(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return a`
      <ha-selector
        class="full"
        .hass=${this.hass}
        .label=${t}
        .selector=${{ entity: { domain: "fan" } }}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-selector>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderNumberInput(t, e, i = "") {
    return a`
      <ha-textfield
        type="number"
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderEntityPicker("Entity", "entity")}
            ${this.renderTextInput("Name", "name", "Fan")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "56px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Speeds</h3>
          <div class="grid">
            ${this.renderTextInput("Off Label", "off_label", "Off")}
            ${this.renderTextInput("Speed 1 Label", "speed_1_label", "1")}
            ${this.renderTextInput("Speed 2 Label", "speed_2_label", "2")}
            ${this.renderTextInput("Speed 3 Label", "speed_3_label", "3")}
            ${this.renderNumberInput("Speed 1 Percent", "speed_1_percentage", "33")}
            ${this.renderNumberInput("Speed 2 Percent", "speed_2_percentage", "66")}
            ${this.renderNumberInput("Speed 3 Percent", "speed_3_percentage", "100")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Show Speed Buttons", "show_speed_buttons", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("On Color", "on_color", "#45d158")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", vi, "cycle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      yi,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Yt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let wt = Yt;
customElements.get("speed-fan-card-editor") || customElements.define("speed-fan-card-editor", wt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "speed-fan-card",
  name: "Speed Fan Card",
  description: "A compact fan card with off, 1, 2, and 3 speed controls."
});
const _i = {
  kind: "washer",
  width: "100%",
  fill_container: !0,
  border_radius: "14px",
  background: "#101722",
  energy_price_cents_per_kwh: void 0,
  paused_color: "#ff8a1c",
  error_color: "#ff3b5c",
  off_color: "#697382",
  show_stats: !1,
  show_details: !1,
  animated: !0
}, $i = ["washer", "dryer"], ki = /* @__PURE__ */ new Set([
  "add_drain",
  "cooling",
  "detecting",
  "detergent_amount",
  "dispensing",
  "drying",
  "frozen_prevent_running",
  "prewash",
  "refreshing",
  "rinsing",
  "running",
  "soaking",
  "spinning",
  "steam_softening",
  "wrinkle_care"
]), Ci = /* @__PURE__ */ new Set(["end"]), Si = /* @__PURE__ */ new Set(["pause", "reserved", "rinse_hold"]), Ei = /* @__PURE__ */ new Set(["power_off", "initial"]), Ti = /* @__PURE__ */ new Set(["error"]);
function Pi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function f(o) {
  return !o || ["unavailable", "unknown"].includes(o.state);
}
function E(o) {
  return !o || o === "unknown" || o === "unavailable" ? "Unknown" : o.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function w(o) {
  if (o === void 0 || o < 0)
    return "--";
  const t = Math.ceil(o), e = Math.floor(t / 60), i = t % 60;
  return e <= 0 ? `${i}m` : i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function C(o) {
  if (f(o))
    return "Unknown";
  if ((o == null ? void 0 : o.attributes.device_class) === "timestamp") {
    const n = Ft(o.state);
    if (n)
      return n.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });
  }
  if ((o == null ? void 0 : o.attributes.device_class) === "duration")
    return w(
      Ut(o.state, o.attributes.unit_of_measurement)
    );
  const t = o == null ? void 0 : o.attributes.unit_of_measurement, i = (o == null ? void 0 : o.attributes.event_type) || (o == null ? void 0 : o.state) || "", r = E(i);
  return t ? `${r} ${t}` : r;
}
function _t(o) {
  var i;
  if (f(o))
    return;
  const t = Number(o == null ? void 0 : o.state);
  if (!Number.isFinite(t))
    return;
  const e = (i = o == null ? void 0 : o.attributes.unit_of_measurement) == null ? void 0 : i.trim().toLowerCase();
  if (e === "kwh")
    return t;
  if (e === "mwh")
    return t * 1e3;
  if (e === "wh" || !e)
    return t / 1e3;
}
function V(o) {
  const t = Number(o);
  return Number.isFinite(t) && t > 0 ? t : void 0;
}
function H(o, t) {
  const e = _t(o), i = V(t);
  if (!(e === void 0 || i === void 0))
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(e * i / 100);
}
function Ft(o) {
  const t = o.trim();
  if (!/^\d{4}-\d{2}-\d{2}(T|\s)/.test(t))
    return;
  const e = new Date(t);
  if (!Number.isNaN(e.getTime()))
    return e;
}
function Ai(o) {
  const t = Ft(o);
  if (t)
    return Math.max(0, (t.getTime() - Date.now()) / 6e4);
}
function Oi(o, t) {
  const e = t == null ? void 0 : t.trim().toLowerCase();
  return ["ms", "millisecond", "milliseconds"].includes(e ?? "") ? o / 6e4 : ["s", "sec", "secs", "second", "seconds"].includes(e ?? "") ? o / 60 : ["h", "hr", "hrs", "hour", "hours"].includes(e ?? "") ? o * 60 : o;
}
function Ut(o, t) {
  const e = String(o ?? "").trim();
  if (!e || ["unknown", "unavailable"].includes(e))
    return;
  const i = Number(e);
  if (Number.isFinite(i))
    return Oi(i, t);
  const r = e.match(
    /^P(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)$/i
  );
  if (r) {
    const c = Number(r[1] ?? 0), l = Number(r[2] ?? 0), h = Number(r[3] ?? 0);
    return c * 60 + l + h / 60;
  }
  const n = e.match(/^(\d+):([0-5]\d)(?::([0-5]\d))?$/);
  if (n) {
    const c = Number(n[1]), l = Number(n[2]), h = n[3] ? Number(n[3]) : void 0;
    return h !== void 0 ? c * 60 + l + h / 60 : c > 12 ? c + l / 60 : c * 60 + l;
  }
  const s = e.match(
    /^(?:(\d+(?:\.\d+)?)\s*h(?:ours?|rs?)?)?\s*(?:(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?)?\s*(?:(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?)?$/i
  );
  if (s != null && s[1] || s != null && s[2] || s != null && s[3]) {
    const c = Number(s[1] ?? 0), l = Number(s[2] ?? 0), h = Number(s[3] ?? 0);
    return c * 60 + l + h / 60;
  }
}
function Q(o) {
  if (!f(o))
    return Ut(o == null ? void 0 : o.state, o == null ? void 0 : o.attributes.unit_of_measurement);
}
function De(o) {
  if (!f(o))
    return Ai((o == null ? void 0 : o.state) ?? "") ?? Ut(o == null ? void 0 : o.state, o == null ? void 0 : o.attributes.unit_of_measurement);
}
const Xt = class Xt extends u {
  constructor() {
    super(...arguments), this.settingsOpen = !1;
  }
  static get styles() {
    return m`
      :host {
        --laundry-card-width: 100%;
        --laundry-card-radius: 14px;
        --laundry-background: #101722;

        display: block;
        max-width: var(--laundry-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .laundry-card {
        backdrop-filter: blur(16px) saturate(1.32);
        -webkit-backdrop-filter: blur(16px) saturate(1.32);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-background) 70%, transparent),
            color-mix(in srgb, var(--laundry-background) 84%, transparent)
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--laundry-accent-color) 12%, rgb(255 255 255 / 8%)),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 12%);
        border-left: 3px solid
          color-mix(in srgb, var(--laundry-accent-color) 78%, transparent);
        border-radius: var(--laundry-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 13%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 8px 22px rgb(0 0 0 / 20%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 9px;
        overflow: hidden;
        padding: 11px 13px 12px;
        position: relative;
      }

      .laundry-card::before {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--laundry-accent-color) 14%, transparent),
          transparent 60%
        );
        content: '';
        inset: 0;
        opacity: var(--laundry-active-opacity);
        pointer-events: none;
        position: absolute;
      }

      .head {
        align-items: center;
        display: flex;
        gap: 10px;
        position: relative;
        z-index: 1;
      }

      .image-wrap {
        align-items: center;
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 9px;
        display: grid;
        flex: 0 0 36px;
        height: 36px;
        justify-items: center;
        min-width: 0;
        overflow: hidden;
        padding: 3px;
        width: 36px;
      }

      .appliance-image {
        filter: drop-shadow(0 1px 1px rgb(0 0 0 / 22%));
        height: 100%;
        max-height: 28px;
        object-fit: contain;
        width: 100%;
      }

      .fallback-machine {
        aspect-ratio: 0.86;
        background:
          linear-gradient(145deg, #d8dde4, #6f7782 56%, #2a313a),
          #8b94a0;
        border: 1px solid rgb(255 255 255 / 22%);
        border-radius: 6px;
        box-shadow:
          inset 0 1px 2px rgb(255 255 255 / 26%),
          inset 0 -6px 12px rgb(0 0 0 / 22%);
        position: relative;
        width: min(100%, 26px);
      }

      .fallback-machine::before {
        background: radial-gradient(
          circle,
          #10151d 0 36%,
          #9facbb 38% 42%,
          #26313d 44% 62%,
          #0b0f15 64%
        );
        border-radius: 999px;
        content: '';
        height: 52%;
        left: 50%;
        position: absolute;
        top: 27%;
        transform: translateX(-50%);
        width: 72%;
      }

      .title {
        display: grid;
        flex: 1 1 0;
        gap: 2px;
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-line {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 10.5px;
        gap: 5px;
        min-width: 0;
      }

      .status-dot {
        background: var(--laundry-state-color);
        border-radius: 999px;
        flex: 0 0 auto;
        height: 5px;
        opacity: var(--laundry-status-opacity);
        width: 5px;
      }

      .status-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time-block {
        align-items: end;
        display: grid;
        gap: 1px;
        justify-items: end;
        min-width: 0;
        text-align: right;
      }

      .head-actions {
        align-items: center;
        display: inline-flex;
        flex: 0 1 auto;
        gap: 7px;
        max-width: 58%;
        min-width: 0;
      }

      .time-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time-subtext {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 10px;
        line-height: 1.2;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-toggle {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 8px;
        color: var(--secondary-text-color, #c2ccd9);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        height: 28px;
        justify-content: center;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          color 160ms ease,
          transform 160ms ease;
        width: 28px;
      }

      .settings-toggle ha-icon {
        --mdc-icon-size: 16px;
        color: currentColor;
      }

      .settings-toggle:hover {
        background: rgb(255 255 255 / 9%);
        border-color: rgb(255 255 255 / 14%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .settings-toggle:focus-visible {
        outline: 2px solid var(--laundry-state-color);
        outline-offset: 2px;
      }

      .settings-toggle:active {
        transform: scale(0.96);
      }

      .progress {
        background: rgb(255 255 255 / 7%);
        border-radius: 999px;
        height: 2px;
        overflow: hidden;
        position: relative;
        z-index: 1;
      }

      .progress-bar {
        background: var(--laundry-state-color);
        border-radius: inherit;
        height: 100%;
        opacity: 0.85;
        transition: width 240ms ease;
        width: var(--laundry-progress);
      }

      .stats {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .stat {
        background: rgb(255 255 255 / 4%);
        border-radius: 6px;
        display: grid;
        gap: 1px;
        min-width: 0;
        padding: 4px 7px;
      }

      .stat-label {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 8.5px;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .stat-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10.5px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .machine-metrics {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        flex-wrap: wrap;
        gap: 4px 12px;
        min-height: 14px;
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .metric {
        align-items: baseline;
        display: inline-flex;
        gap: 4px;
        min-width: 0;
      }

      .metric-label {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 10.5px;
        font-weight: 600;
        line-height: 1.1;
      }

      .metric-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10.5px;
        font-weight: 700;
        line-height: 1.1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .controls {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        position: relative;
        z-index: 1;
      }

      .control,
      .details-close {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        gap: 5px;
        justify-content: center;
        min-height: 30px;
        min-width: 0;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          opacity 160ms ease,
          transform 160ms ease;
      }

      .control ha-icon,
      .details-close ha-icon {
        --mdc-icon-size: 16px;
        color: currentColor;
        flex: 0 0 auto;
      }

      .control span,
      .details-close span {
        display: none;
      }

      .control.primary {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--laundry-state-color) 34%, rgb(255 255 255 / 8%)),
          color-mix(in srgb, var(--laundry-state-color) 12%, rgb(255 255 255 / 3%))
        );
        border-color: color-mix(in srgb, var(--laundry-state-color) 40%, transparent);
      }

      .control.warning {
        color: #ffccd4;
      }

      .control:hover:not(:disabled),
      .details-close:hover:not(:disabled) {
        background: rgb(255 255 255 / 9%);
      }

      .control.primary:hover:not(:disabled) {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--laundry-state-color) 42%, rgb(255 255 255 / 10%)),
          color-mix(in srgb, var(--laundry-state-color) 20%, rgb(255 255 255 / 4%))
        );
      }

      .control:focus-visible,
      .details-close:focus-visible {
        outline: 2px solid var(--laundry-state-color);
        outline-offset: 2px;
      }

      .control:not(:disabled):active,
      .details-close:not(:disabled):active {
        transform: scale(0.97);
      }

      .control:disabled {
        cursor: default;
        opacity: 0.34;
      }

      .details {
        border-top: 1px solid rgb(255 255 255 / 8%);
        display: grid;
        gap: 8px;
        padding-top: 9px;
        position: relative;
        z-index: 1;
      }

      .detail-header {
        align-items: center;
        display: flex;
        gap: 8px;
        justify-content: space-between;
      }

      .detail-title {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 700;
      }

      .details-close {
        border-radius: 7px;
        min-height: 24px;
        width: 26px;
      }

      .detail-grid {
        display: grid;
        gap: 6px;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      }

      .detail-row {
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 10px;
        display: grid;
        gap: 6px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-width: 0;
        padding: 8px;
      }

      .detail-main {
        align-items: center;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        gap: 8px;
        grid-template-columns: 20px minmax(0, 1fr);
        padding: 0;
        text-align: left;
      }

      .detail-main ha-icon {
        --mdc-icon-size: 16px;
        color: var(--laundry-state-color);
      }

      .detail-action {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 7px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        justify-content: center;
        letter-spacing: 0;
        min-height: 26px;
        padding: 0 10px;
      }

      .detail-action:hover {
        background: rgb(255 255 255 / 10%);
      }

      .detail-name,
      .detail-state {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .detail-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 11.5px;
        font-weight: 600;
      }

      .detail-state {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 10.5px;
        margin-top: 2px;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        grid-column: 1 / -1;
      }

      .chip {
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        cursor: pointer;
        font-size: 10.5px;
        line-height: 1;
        padding: 5px 7px;
      }

      .chip.active {
        background: color-mix(in srgb, var(--laundry-state-color) 20%, transparent);
        border-color: color-mix(in srgb, var(--laundry-state-color) 38%, transparent);
        color: var(--primary-text-color, #f4f7fb);
      }

      .settings-overlay {
        align-items: center;
        background: rgb(0 0 0 / 48%);
        display: grid;
        inset: 0;
        justify-items: center;
        padding: 16px;
        position: fixed;
        z-index: 2147483647;
      }

      .settings-dialog {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-background) 90%, #ffffff 5%),
            color-mix(in srgb, var(--laundry-background) 96%, #000000 12%)
          );
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          0 20px 60px rgb(0 0 0 / 38%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        max-height: min(680px, calc(100vh - 32px));
        overflow: hidden;
        width: min(480px, calc(100vw - 28px));
      }

      .settings-dialog-header {
        align-items: center;
        border-bottom: 1px solid rgb(255 255 255 / 8%);
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding: 15px 16px 13px;
      }

      .settings-dialog-title {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .settings-dialog-title span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .settings-dialog-title h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 750;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-dialog-close {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 9px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .settings-dialog-close ha-icon {
        --mdc-icon-size: 17px;
      }

      .settings-panel {
        display: grid;
        gap: 10px;
        overflow: auto;
        padding: 12px;
      }

      .settings-panel .detail-grid {
        grid-template-columns: 1fr;
      }

      .detail-row ha-switch {
        --switch-checked-color: var(--laundry-state-color);
        --switch-checked-button-color: var(--laundry-state-color);
      }

      @container (max-width: 360px) {
        .laundry-card {
          gap: 8px;
          padding: 10px 11px;
        }

        .head {
          gap: 8px;
          grid-template-columns: 32px minmax(0, 1fr);
        }

        .image-wrap {
          height: 32px;
          width: 32px;
        }

        .appliance-image {
          max-height: 26px;
        }

        .fallback-machine {
          width: min(100%, 24px);
        }

        .name {
          font-size: 13.5px;
        }

        .time-value {
          font-size: 16px;
        }

        .time-subtext {
          font-size: 9.5px;
        }

        .head-actions {
          gap: 6px;
          max-width: 60%;
        }

        .settings-toggle {
          height: 30px;
          width: 30px;
        }

        .stats {
          gap: 4px;
        }

        .stat {
          padding: 3px 5px;
        }

        .stat-value {
          font-size: 10px;
        }

        .controls {
          gap: 4px;
        }

        .control {
          min-height: 28px;
        }
      }

      @container (max-width: 260px) {
        .stats {
          gap: 3px;
        }

        .stat-label {
          display: none;
        }

        .stat-value {
          font-size: 9.5px;
        }

        .control ha-icon {
          --mdc-icon-size: 15px;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("lg-laundry-card-editor");
  }
  static getStubConfig(t, e) {
    const [i] = e.filter(
      (n) => n.startsWith("sensor.") && (n.includes("washer_current_status") || n.includes("dryer_current_status"))
    ), r = i != null && i.includes("dryer") ? "dryer" : "washer";
    return {
      entity: i ?? "",
      kind: r
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ..._i,
      ...t
    }, this.settingsOpen = !1, this.style.setProperty(
      "--laundry-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "100%"
    ), this.style.setProperty(
      "--laundry-card-radius",
      this.config.border_radius ?? "14px"
    ), this.style.setProperty("--laundry-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return this.config.show_stats === !1 ? 3 : 4;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 6,
      min_rows: 4,
      max_rows: 10,
      min_columns: 4,
      max_columns: 12
    };
  }
  entity(t) {
    var e;
    return t ? (e = this.hass) == null ? void 0 : e.states[t] : void 0;
  }
  get statusEntity() {
    return this.entity(this.config.entity);
  }
  get kind() {
    return this.config.kind ?? (this.config.entity.includes("dryer") ? "dryer" : "washer");
  }
  get displayName() {
    var t, e;
    return this.config.name || ((e = (t = this.statusEntity) == null ? void 0 : t.attributes.friendly_name) == null ? void 0 : e.replace(" Current status", "")) || (this.kind === "dryer" ? "Dryer" : "Washer");
  }
  get rawStatus() {
    var t;
    return this.optimisticOperation ? this.optimisticOperation : ((t = this.statusEntity) == null ? void 0 : t.state) ?? "unknown";
  }
  get statusLabel() {
    return f(this.statusEntity) ? "Unavailable" : this.rawStatus === "end" ? "Complete" : E(this.rawStatus);
  }
  get stateGroup() {
    var e, i;
    const t = this.rawStatus;
    return Ti.has(t) || (e = this.entity(this.config.error_entity)) != null && e.attributes.event_type ? "error" : ki.has(t) ? "running" : Ci.has(t) ? "complete" : Si.has(t) ? "paused" : (Ei.has(t) || ((i = this.entity(this.config.power_entity)) == null ? void 0 : i.state) === "off", "off");
  }
  get kindColor() {
    return this.kind === "dryer" ? "#ff5a2f" : "#2f8cff";
  }
  get kindContrastColor() {
    return this.kind === "dryer" ? "#ff9a1f" : "#4ad7ff";
  }
  get stateColor() {
    return {
      running: this.config.running_color ?? this.kindColor,
      complete: this.config.complete_color ?? this.kindColor,
      paused: this.config.paused_color ?? "#ff8a1c",
      error: this.config.error_color ?? "#ff3b5c",
      off: this.config.off_color ?? "#697382"
    }[this.stateGroup];
  }
  get remainingMinutes() {
    return De(this.entity(this.config.remaining_time_entity));
  }
  get totalMinutes() {
    return Q(this.entity(this.config.total_time_entity));
  }
  get progress() {
    if (this.stateGroup === "complete")
      return 100;
    if (this.stateGroup !== "running" && this.stateGroup !== "paused")
      return 0;
    const t = this.totalMinutes, e = this.remainingMinutes;
    return !t || e === void 0 ? this.stateGroup === "running" ? 18 : 0 : Math.min(100, Math.max(0, (t - e) / t * 100));
  }
  get timeDisplay() {
    return this.stateGroup === "complete" ? "Done" : this.stateGroup === "off" ? "--" : w(this.remainingMinutes);
  }
  get timeSubtext() {
    const t = this.entity(this.config.remaining_time_entity);
    if (this.stateGroup === "complete")
      return "Complete";
    if (this.stateGroup === "off") {
      const e = w(this.totalMinutes);
      return e === "--" ? "Ready" : `${e} cycle`;
    }
    if (!f(t) && t) {
      const e = Ft(t.state);
      if (e)
        return `Finishes around ${e.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        })}`;
      const i = this.remainingMinutes;
      if (i !== void 0)
        return `${w(i)} remaining`;
    }
    return "Waiting for LG";
  }
  hasOperation(t) {
    var i;
    const e = this.entity(this.config.operation_entity);
    return !!((i = e == null ? void 0 : e.attributes.options) != null && i.includes(t));
  }
  canCallOperation(t) {
    const e = this.entity(this.config.operation_entity);
    return !!(e && e.state !== "unavailable" && this.hasOperation(t));
  }
  isRemoteStartReady() {
    const t = this.entity(this.config.remote_start_entity);
    return !t || t.state === "on";
  }
  setOptimisticOperation(t) {
    window.clearTimeout(this.optimisticTimer), this.optimisticOperation = t, this.optimisticTimer = window.setTimeout(() => {
      this.optimisticOperation = void 0;
    }, 2200);
  }
  optimisticStatusForOperation(t) {
    return t === "start" ? "running" : t === "stop" ? "pause" : t === "power_on" ? "initial" : t;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => {
      window.clearTimeout(this.optimisticTimer), this.optimisticOperation = void 0;
    });
  }
  callOperation(t) {
    var e;
    !this.config.operation_entity || !this.hasOperation(t) || (this.setOptimisticOperation(this.optimisticStatusForOperation(t)), this.trackServiceResult(
      (e = this.hass) == null ? void 0 : e.callService("select", "select_option", {
        entity_id: this.config.operation_entity,
        option: t
      })
    ));
  }
  setPower(t) {
    var r;
    const e = this.entity(this.config.power_entity);
    if (this.setOptimisticOperation(t ? "initial" : "power_off"), this.config.power_entity && !f(e)) {
      this.trackServiceResult(
        (r = this.hass) == null ? void 0 : r.callService("switch", t ? "turn_on" : "turn_off", {
          entity_id: this.config.power_entity
        })
      );
      return;
    }
    const i = t ? "power_on" : "power_off";
    this.hasOperation(i) && this.callOperation(i);
  }
  toggleSettings(t) {
    t.stopPropagation(), this.settingsOpen = !this.settingsOpen;
  }
  closeSettings(t) {
    t == null || t.stopPropagation(), this.settingsOpen = !1;
  }
  isEditorPreview() {
    return this.isInEditorPreviewTree(this);
  }
  isInEditorPreviewTree(t) {
    for (; t; ) {
      if (t instanceof Element && t.matches(
        [
          "hui-card-preview",
          "hui-card-element-editor",
          "hui-dialog-edit-card",
          "hui-card-options"
        ].join(",")
      ))
        return !0;
      const e = t.getRootNode();
      if (e instanceof ShadowRoot) {
        t = e.host;
        continue;
      }
      t = t instanceof Element ? t.parentElement : null;
    }
    return !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this.optimisticTimer);
  }
  dispatchMoreInfo(t) {
    t && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  toggleSwitch(t) {
    var e;
    (e = this.hass) == null || e.callService("switch", "toggle", { entity_id: t });
  }
  pressButton(t) {
    var e;
    (e = this.hass) == null || e.callService("button", "press", { entity_id: t });
  }
  isActionableUnknown(t) {
    var i;
    const e = this.entity(t);
    return !!(t.startsWith("select.") && ((i = e == null ? void 0 : e.attributes.options) != null && i.length));
  }
  configuredDetailEntities() {
    const t = [
      ...this.config.detail_entities ?? [],
      this.config.power_entity,
      this.config.operation_entity,
      this.config.remote_start_entity,
      this.config.delayed_start_entity,
      this.config.remaining_time_entity,
      this.config.total_time_entity,
      this.config.cycles_entity,
      this.config.energy_entity,
      this.config.notification_entity,
      this.config.error_entity
    ].filter((e) => !!e);
    return [...new Set(t)].filter((e) => {
      const i = this.entity(e);
      return !f(i) || this.isActionableUnknown(e);
    });
  }
  renderImage() {
    const t = this.config.image ?? `/hacsfiles/gamma-ha-cards/assets/laundry-${this.kind}.svg`;
    return a`
      <img
        class="appliance-image"
        alt=${this.displayName}
        src=${t}
        loading="lazy"
      />
    `;
  }
  renderStat(t, e) {
    const i = this.entity(e), r = e === this.config.energy_entity ? H(i, this.config.energy_price_cents_per_kwh) : void 0;
    return a`
      <div class="stat">
        <span class="stat-label">${r ? "Cost" : t}</span>
        <span class="stat-value">${r ?? (f(i) ? "--" : C(i))}</span>
      </div>
    `;
  }
  configuredMetricEntities() {
    const t = Array.isArray(this.config.metric_entities) && this.config.metric_entities.length ? this.config.metric_entities : [this.config.energy_entity, this.config.cycles_entity];
    return [...new Set(t.filter((e) => !!e))].filter((e) => !f(this.entity(e)));
  }
  energyCostForMetric(t) {
    if (!(t !== this.config.energy_entity || V(this.config.energy_price_cents_per_kwh) === void 0))
      return H(
        this.entity(t),
        this.config.energy_price_cents_per_kwh
      );
  }
  metricLabel(t) {
    const e = this.entity(t), i = this.energyCostForMetric(t), r = (e == null ? void 0 : e.attributes.friendly_name) ?? t.split(".").slice(1).join(" "), n = this.displayName.toLowerCase(), s = r.replace(new RegExp(`^${n}\\s+`, "i"), "").replace(/^dryer\s+/i, "").replace(/^washer\s+/i, "").replace(/\s+this month$/i, "").trim();
    return i ? "Cost" : E(s || r);
  }
  renderMetric(t) {
    return a`
      <span class="metric">
        <span class="metric-label">${this.metricLabel(t)}</span>
        <span class="metric-value">
          ${this.energyCostForMetric(t) ?? C(this.entity(t))}
        </span>
      </span>
    `;
  }
  renderControl(t, e, i, r, n = "") {
    return a`
      <button
        type="button"
        class="control ${n}"
        aria-label=${t}
        ?disabled=${r}
        title=${t}
        @click=${i}
      >
        <ha-icon icon=${e}></ha-icon>
        <span>${t}</span>
      </button>
    `;
  }
  renderDetailEntity(t) {
    const e = this.entity(t), i = (e == null ? void 0 : e.attributes.options) ?? [], r = t.startsWith("select."), n = t.startsWith("switch."), s = t.startsWith("button.");
    return a`
      <div class="detail-row">
        <button
          type="button"
          class="detail-main"
          @click=${() => this.dispatchMoreInfo(t)}
        >
          <ha-icon icon=${(e == null ? void 0 : e.attributes.icon) ?? "mdi:tune-variant"}></ha-icon>
          <span>
            <span class="detail-name">
              ${(e == null ? void 0 : e.attributes.friendly_name) ?? t}
            </span>
            <span class="detail-state">${C(e)}</span>
          </span>
        </button>
        ${n && e ? a`
              <ha-switch
                .checked=${e.state === "on"}
                @click=${(c) => c.stopPropagation()}
                @change=${() => this.toggleSwitch(t)}
              ></ha-switch>
            ` : d}
        ${s ? a`
              <button
                type="button"
                class="detail-action"
                @click=${(c) => {
      c.stopPropagation(), this.pressButton(t);
    }}
              >
                Press
              </button>
            ` : d}
        ${i.length ? a`
              <div class="chips">
                ${i.map(
      (c) => a`
                    <button
                      type="button"
                      class="chip ${(e == null ? void 0 : e.state) === c ? "active" : ""}"
                      @click=${(l) => {
        var h;
        l.stopPropagation(), r && ((h = this.hass) == null || h.callService("select", "select_option", {
          entity_id: t,
          option: c
        }));
      }}
                    >
                      ${E(c)}
                    </button>
                  `
    )}
              </div>
            ` : d}
      </div>
    `;
  }
  renderSettingsDialog() {
    return !this.settingsOpen || this.isEditorPreview() ? d : a`
      <div class="settings-overlay" @click=${this.closeSettings}>
        <section
          class="settings-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Laundry settings"
          @click=${(t) => t.stopPropagation()}
        >
          <div class="settings-dialog-header">
            <div class="settings-dialog-title">
              <span>${this.displayName}</span>
              <h2>Settings & Details</h2>
            </div>
            <button
              type="button"
              class="settings-dialog-close"
              aria-label="Close settings"
              @click=${this.closeSettings}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="settings-panel">
            <div class="detail-grid">
              ${this.configuredDetailEntities().map(
      (t) => this.renderDetailEntity(t)
    )}
            </div>
          </div>
        </section>
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.entity(this.config.power_entity), e = this.entity(this.config.operation_entity), i = this.stateGroup === "running", r = this.stateGroup === "running" || this.stateGroup === "paused", n = !!(this.config.power_entity && t), s = !e || e.state === "unavailable", c = s || !this.canCallOperation("start") || !this.isRemoteStartReady() || i, l = s || !this.canCallOperation("stop") || !r, h = n ? f(t) : !this.canCallOperation("power_on") && !this.canCallOperation("power_off"), p = t ? t.state !== "on" : this.stateGroup === "off", g = this.kindContrastColor, b = this.config.show_stats === !1 ? this.configuredMetricEntities() : [];
    return a`
      <ha-card>
        <article
          class="laundry-card ${this.config.animated ? "animated" : ""}"
          style="
            --laundry-state-color: ${this.stateColor};
            --laundry-contrast-color: ${g};
            --laundry-accent-color: ${this.kindColor};
            --laundry-progress: ${this.progress}%;
            --laundry-active-opacity: ${this.stateGroup === "off" ? "0.08" : "0.4"};
            --laundry-status-opacity: ${this.stateGroup === "off" ? "0.38" : "1"};
          "
        >
          <header class="head">
            <div class="image-wrap">${this.renderImage()}</div>
            <div class="title">
              <span class="name">${this.displayName}</span>
              <span class="status-line">
                <span class="status-dot"></span>
                <span class="status-text">${this.statusLabel}</span>
              </span>
            </div>
            <div class="head-actions">
              <div class="time-block">
                <span class="time-value">${this.timeDisplay}</span>
                <span class="time-subtext">${this.timeSubtext}</span>
              </div>
              <button
                type="button"
                class="settings-toggle"
                aria-label="Open laundry settings"
                title="Settings"
                @click=${this.toggleSettings}
              >
                <ha-icon icon="mdi:cog-outline"></ha-icon>
              </button>
            </div>
          </header>

          <div class="progress" aria-hidden="true">
            <div class="progress-bar"></div>
          </div>

          ${b.length ? a`
                <div class="machine-metrics">
                  ${b.map((x) => this.renderMetric(x))}
                </div>
              ` : d}

          ${this.config.show_stats === !1 ? d : a`
                <div class="stats">
                  ${this.renderStat("Total", this.config.total_time_entity)}
                  ${this.renderStat("Remote", this.config.remote_start_entity)}
                  ${this.renderStat("Energy", this.config.energy_entity)}
                </div>
              `}

          <div class="controls">
            ${this.renderControl(
      "Power",
      "mdi:power",
      () => this.setPower(p),
      h
    )}
            ${this.renderControl(
      "Start",
      "mdi:play",
      () => this.callOperation("start"),
      c,
      "primary"
    )}
            ${this.renderControl(
      "Stop",
      "mdi:stop",
      () => this.callOperation("stop"),
      l
    )}
          </div>

        </article>
        ${this.renderSettingsDialog()}
      </ha-card>
    `;
  }
};
Xt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  settingsOpen: { state: !0 },
  optimisticOperation: { state: !0 }
};
let $t = Xt;
customElements.get("lg-laundry-card") || customElements.define("lg-laundry-card", $t);
const Zt = class Zt extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-textfield,
      ha-select {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r], Array.isArray(e[r]) && e[r].length === 0 && delete e[r];
    }), this.config = e, Pi(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  renderEntityForm() {
    const t = [
      {
        name: "entity",
        required: !0,
        selector: { entity: { domain: "sensor" } }
      },
      { name: "power_entity", selector: { entity: { domain: "switch" } } },
      { name: "operation_entity", selector: { entity: { domain: "select" } } },
      {
        name: "remaining_time_entity",
        selector: { entity: { domain: "sensor" } }
      },
      { name: "total_time_entity", selector: { entity: { domain: "sensor" } } },
      {
        name: "remote_start_entity",
        selector: { entity: { domain: "binary_sensor" } }
      },
      {
        name: "delayed_start_entity",
        selector: { entity: { domain: ["number", "sensor"] } }
      },
      { name: "notification_entity", selector: { entity: { domain: "event" } } },
      { name: "error_entity", selector: { entity: { domain: "event" } } },
      { name: "energy_entity", selector: { entity: { domain: "sensor" } } },
      { name: "cycles_entity", selector: { entity: { domain: "sensor" } } },
      {
        name: "metric_entities",
        selector: { entity: { multiple: !0 } }
      },
      {
        name: "detail_entities",
        selector: { entity: { multiple: !0 } }
      }
    ], e = {
      entity: "Status Sensor",
      power_entity: "Power Switch",
      operation_entity: "Operation Select",
      remaining_time_entity: "Remaining Time",
      total_time_entity: "Total Time",
      remote_start_entity: "Remote Start",
      delayed_start_entity: "Delayed Start",
      notification_entity: "Notification Event",
      error_entity: "Error Event",
      energy_entity: "Energy Sensor",
      cycles_entity: "Cycles Sensor",
      metric_entities: "Compact Metrics",
      detail_entities: "Extra Detail Entities"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{
      entity: this.config.entity,
      power_entity: this.config.power_entity,
      operation_entity: this.config.operation_entity,
      remaining_time_entity: this.config.remaining_time_entity,
      total_time_entity: this.config.total_time_entity,
      remote_start_entity: this.config.remote_start_entity,
      delayed_start_entity: this.config.delayed_start_entity,
      notification_entity: this.config.notification_entity,
      error_entity: this.config.error_entity,
      energy_entity: this.config.energy_entity,
      cycles_entity: this.config.cycles_entity,
      metric_entities: this.config.metric_entities,
      detail_entities: this.config.detail_entities
    }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Washer")}
            ${this.renderSelect("Kind", "kind", $i, "washer")}
            ${this.renderTextInput("Image URL", "image", "/hacsfiles/gamma-ha-cards/assets/laundry-washer.svg")}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Width", "width", "100%")}
            ${this.renderTextInput("Radius", "border_radius", "14px")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderTextInput("Energy Price Cents/kWh", "energy_price_cents_per_kwh", "16.5")}
            ${this.renderTextInput("Running Color", "running_color", "washer #2f8cff, dryer #ff5a2f")}
            ${this.renderTextInput("Complete Color", "complete_color", "washer #2f8cff, dryer #ff5a2f")}
            ${this.renderTextInput("Paused Color", "paused_color", "#ff8a1c")}
            ${this.renderTextInput("Error Color", "error_color", "#ff3b5c")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !0)}
            ${this.renderSwitch("Show Stats", "show_stats", !1)}
            ${this.renderSwitch("Show Details Open", "show_details", !1)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>
      </div>
    `;
  }
};
Zt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let kt = Zt;
customElements.get("lg-laundry-card-editor") || customElements.define("lg-laundry-card-editor", kt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "lg-laundry-card",
  name: "LG Laundry Card",
  description: "A polished LG ThinQ washer and dryer dashboard card."
});
const Ne = {
  name: "Laundry",
  width: "420px",
  fill_container: !1,
  border_radius: "14px",
  background: "#101722",
  energy_price_cents_per_kwh: void 0,
  show_controls: !0,
  show_stats: !1,
  animated: !0
}, Mi = [
  { action: "power_toggle", label: "Power", icon: "mdi:power" },
  { action: "start", label: "Start", icon: "mdi:play", className: "primary" },
  { action: "stop", label: "Stop", icon: "mdi:stop" }
], q = {
  power_toggle: { label: "Power", icon: "mdi:power" },
  power_on: { label: "Power", icon: "mdi:power" },
  start: { label: "Start", icon: "mdi:play" },
  stop: { label: "Stop", icon: "mdi:stop" },
  power_off: { label: "Off", icon: "mdi:power-standby" },
  settings: { label: "Settings", icon: "mdi:cog-outline" },
  more_info: { label: "Info", icon: "mdi:information-outline" },
  toggle: { label: "Toggle", icon: "mdi:toggle-switch-outline" },
  press: { label: "Press", icon: "mdi:gesture-tap-button" },
  select_option: { label: "Select", icon: "mdi:format-list-bulleted" },
  service: { label: "Run", icon: "mdi:flash" }
}, zi = /* @__PURE__ */ new Set([
  "add_drain",
  "cooling",
  "detecting",
  "detergent_amount",
  "dispensing",
  "drying",
  "frozen_prevent_running",
  "prewash",
  "refreshing",
  "rinsing",
  "running",
  "soaking",
  "spinning",
  "steam_softening",
  "wrinkle_care"
]), Ii = /* @__PURE__ */ new Set(["end"]), Fi = /* @__PURE__ */ new Set(["pause", "reserved", "rinse_hold"]), Ui = /* @__PURE__ */ new Set(["power_off", "initial"]), Di = /* @__PURE__ */ new Set(["error"]);
function Ni(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function J(o) {
  return o === "dryer" ? "#ff5a2f" : "#2f8cff";
}
function Li(o) {
  return o === "dryer" ? "#ff9a1f" : "#4ad7ff";
}
function Le(o) {
  return `/hacsfiles/gamma-ha-cards/assets/laundry-${o}.svg`;
}
const Qt = class Qt extends u {
  constructor() {
    super(...arguments), this.optimisticOperations = {}, this.optimisticTimers = {};
  }
  static get styles() {
    return m`
      :host {
        --laundry-pair-width: 100%;
        --laundry-pair-radius: 14px;
        --laundry-pair-background: #101722;

        display: block;
        max-width: var(--laundry-pair-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .pair-card {
        backdrop-filter: blur(18px) saturate(1.35);
        -webkit-backdrop-filter: blur(18px) saturate(1.35);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-pair-background) 72%, transparent),
            color-mix(in srgb, var(--laundry-pair-background) 84%, transparent)
          ),
          linear-gradient(135deg, rgb(255 255 255 / 11%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 13%);
        border-radius: var(--laundry-pair-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 14%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 8px 24px rgb(0 0 0 / 22%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 9px;
        overflow: hidden;
        padding: 11px;
      }

      .pair-header {
        align-items: center;
        display: flex;
        gap: 10px;
        justify-content: space-between;
        min-width: 0;
      }

      .pair-title {
        align-items: center;
        backdrop-filter: blur(10px) saturate(1.35);
        -webkit-backdrop-filter: blur(10px) saturate(1.35);
        background:
          linear-gradient(
            180deg,
            rgb(255 255 255 / 12%),
            rgb(255 255 255 / 4%)
          );
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: 9px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 12%),
          0 1px 4px rgb(0 0 0 / 12%);
        color: var(--primary-text-color, #f4f7fb);
        display: inline-flex;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        min-height: 25px;
        overflow: hidden;
        padding: 0 9px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pair-badge {
        color: var(--secondary-text-color, #9aa3b1);
        flex: 0 0 auto;
        font-size: 10px;
      }

      .settings-toggle {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 8px;
        color: var(--secondary-text-color, #c2ccd9);
        cursor: pointer;
        display: inline-flex;
        height: 28px;
        justify-content: center;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          color 160ms ease,
          transform 160ms ease;
        width: 28px;
      }

      .machine-settings-toggle {
        height: 26px;
        width: 26px;
      }

      .settings-toggle ha-icon {
        --mdc-icon-size: 16px;
        color: currentColor;
      }

      .settings-toggle:hover {
        background: rgb(255 255 255 / 9%);
        border-color: rgb(255 255 255 / 14%);
        color: var(--primary-text-color, #f4f7fb);
      }

      .settings-toggle:focus-visible {
        outline: 2px solid color-mix(in srgb, #2f8cff 70%, #ff5a2f 30%);
        outline-offset: 2px;
      }

      .settings-toggle:active {
        transform: scale(0.96);
      }

      .machines {
        display: grid;
        gap: 8px;
      }

      .machine {
        backdrop-filter: blur(12px) saturate(1.25);
        -webkit-backdrop-filter: blur(12px) saturate(1.25);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--machine-accent-color) 11%, rgb(255 255 255 / 8%)),
            rgb(255 255 255 / 4%)
          );
        border: 1px solid rgb(255 255 255 / 10%);
        border-left: 3px solid
          color-mix(in srgb, var(--machine-accent-color) 78%, transparent);
        border-radius: 11px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 9%),
          0 1px 8px rgb(0 0 0 / 10%);
        display: grid;
        gap: 7px;
        min-width: 0;
        overflow: hidden;
        padding: 8px;
        position: relative;
      }

      .machine::before {
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--machine-accent-color) 12%, transparent),
          transparent 62%
        );
        content: '';
        inset: 0;
        opacity: var(--machine-active-opacity);
        pointer-events: none;
        position: absolute;
      }

      .machine-head,
      .progress,
      .machine-metrics,
      .stats,
      .controls {
        position: relative;
        z-index: 1;
      }

      .machine-head {
        align-items: center;
        display: grid;
        column-gap: 11px;
        row-gap: 4px;
        grid-template-columns: 34px minmax(78px, 1fr) auto;
        min-width: 0;
      }

      .image-wrap {
        align-items: center;
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 9px;
        display: grid;
        height: 34px;
        justify-items: center;
        overflow: hidden;
        padding: 3px;
        width: 34px;
      }

      .appliance-image {
        filter: drop-shadow(0 1px 1px rgb(0 0 0 / 22%));
        height: 100%;
        max-height: 27px;
        object-fit: contain;
        width: 100%;
      }

      .identity {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .machine-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 13.5px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-line {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 10.5px;
        gap: 5px;
        min-width: 0;
      }

      .status-dot {
        background: var(--machine-state-color);
        border-radius: 999px;
        flex: 0 0 auto;
        height: 5px;
        opacity: var(--machine-status-opacity);
        width: 5px;
      }

      .status-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        display: grid;
        gap: 2px;
        justify-items: end;
        min-width: 0;
        text-align: right;
      }

      .machine-actions {
        align-items: center;
        display: inline-flex;
        gap: 7px;
        justify-content: end;
        max-width: 94px;
        min-width: 0;
      }

      .time-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
      }

      .time-subtext {
        color: var(--secondary-text-color, #b7c0ce);
        font-size: 9.5px;
        line-height: 1.2;
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .progress {
        background: rgb(255 255 255 / 8%);
        border-radius: 999px;
        height: 3px;
        overflow: hidden;
      }

      .progress-bar {
        background: linear-gradient(
          90deg,
          var(--machine-state-color),
          var(--machine-contrast-color)
        );
        border-radius: inherit;
        height: 100%;
        transition: width 240ms ease;
        width: var(--machine-progress);
      }

      .machine-metrics {
        color: var(--secondary-text-color, #aeb8c6);
        display: flex;
        flex-wrap: wrap;
        font-size: 10.5px;
        gap: 5px 10px;
        line-height: 1.25;
        min-width: 0;
      }

      .metric {
        align-items: baseline;
        display: inline-flex;
        gap: 4px;
        min-width: 0;
      }

      .metric-label {
        color: var(--secondary-text-color, #8f9aaa);
        font-weight: 600;
      }

      .metric-value {
        color: var(--primary-text-color, #f4f7fb);
        font-weight: 650;
        max-width: 112px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .stats {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        min-width: 0;
      }

      .stat {
        background: rgb(255 255 255 / 4%);
        border-radius: 6px;
        display: grid;
        gap: 1px;
        min-width: 0;
        padding: 4px 7px;
      }

      .stat-label {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 8.5px;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .stat-value {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 10.5px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .controls {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
      }

      .control {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        justify-content: center;
        min-height: 29px;
        min-width: 0;
        padding: 0;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          opacity 160ms ease,
          transform 160ms ease;
      }

      .control ha-icon {
        --mdc-icon-size: 15px;
        color: currentColor;
      }

      .control.primary {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--machine-state-color) 34%, rgb(255 255 255 / 8%)),
          color-mix(in srgb, var(--machine-state-color) 12%, rgb(255 255 255 / 3%))
        );
        border-color: color-mix(in srgb, var(--machine-state-color) 40%, transparent);
      }

      .control.warning {
        color: #ffccd4;
      }

      .control:hover:not(:disabled) {
        background: rgb(255 255 255 / 9%);
      }

      .control.primary:hover:not(:disabled) {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--machine-state-color) 42%, rgb(255 255 255 / 10%)),
          color-mix(in srgb, var(--machine-state-color) 20%, rgb(255 255 255 / 4%))
        );
      }

      .control:focus-visible {
        outline: 2px solid var(--machine-state-color);
        outline-offset: 2px;
      }

      .control:not(:disabled):active {
        transform: scale(0.97);
      }

      .control:disabled {
        cursor: default;
        opacity: 0.34;
      }

      .settings-overlay {
        align-items: center;
        background: rgb(0 0 0 / 48%);
        display: grid;
        inset: 0;
        justify-items: center;
        padding: 16px;
        position: fixed;
        z-index: 2147483647;
      }

      .settings-dialog {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-pair-background) 90%, #ffffff 5%),
            color-mix(in srgb, var(--laundry-pair-background) 96%, #000000 12%)
          );
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 16px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          0 20px 60px rgb(0 0 0 / 38%);
        color: var(--primary-text-color, #f4f7fb);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        max-height: min(720px, calc(100vh - 32px));
        overflow: hidden;
        width: min(520px, calc(100vw - 28px));
      }

      .settings-dialog-header {
        align-items: center;
        border-bottom: 1px solid rgb(255 255 255 / 8%);
        display: flex;
        gap: 12px;
        justify-content: space-between;
        padding: 15px 16px 13px;
      }

      .settings-dialog-title {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .settings-dialog-title span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .settings-dialog-title h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 750;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-dialog-close {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 9px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        height: 32px;
        justify-content: center;
        padding: 0;
        width: 32px;
      }

      .settings-dialog-close ha-icon {
        --mdc-icon-size: 17px;
      }

      .settings-panel {
        display: grid;
        gap: 11px;
        overflow: auto;
        padding: 12px;
      }

      .settings-group {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--settings-accent) 8%, rgb(255 255 255 / 4%)),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-left: 3px solid color-mix(in srgb, var(--settings-accent) 82%, transparent);
        border-radius: 12px;
        display: grid;
        gap: 8px;
        padding: 10px;
      }

      .settings-group-title {
        align-items: center;
        color: var(--primary-text-color, #f4f7fb);
        display: flex;
        font-size: 13px;
        font-weight: 750;
        gap: 7px;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
      }

      .settings-group-title::before {
        background: var(--settings-accent);
        border-radius: 999px;
        content: '';
        height: 7px;
        width: 7px;
      }

      .settings-list {
        display: grid;
        gap: 6px;
      }

      .settings-row {
        align-items: center;
        background: rgb(0 0 0 / 11%);
        border: 1px solid rgb(255 255 255 / 6%);
        border-radius: 9px;
        display: grid;
        gap: 7px 9px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-width: 0;
        padding: 8px;
      }

      .settings-row-main {
        align-items: center;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        font: inherit;
        gap: 9px;
        grid-template-columns: 20px minmax(0, 1fr);
        min-width: 0;
        padding: 0;
        text-align: left;
      }

      .settings-row-main ha-icon {
        --mdc-icon-size: 17px;
        color: color-mix(in srgb, var(--settings-accent) 72%, #ffffff 28%);
      }

      .settings-row-main:focus-visible {
        border-radius: 6px;
        outline: 2px solid var(--settings-accent);
        outline-offset: 2px;
      }

      .settings-row-label {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .settings-row-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 650;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-row-state {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10.5px;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .settings-state {
        align-items: center;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        font-size: 11px;
        gap: 2px;
        letter-spacing: 0;
        min-width: 0;
        white-space: nowrap;
      }

      .settings-state ha-icon {
        --mdc-icon-size: 16px;
      }

      .settings-row-button,
      .settings-chip {
        align-items: center;
        background: rgb(255 255 255 / 6%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 7px;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font: inherit;
        font-size: 11px;
        font-weight: 650;
        justify-content: center;
        letter-spacing: 0;
        min-height: 26px;
        padding: 0 10px;
      }

      .settings-row-button:hover,
      .settings-chip:hover {
        background: rgb(255 255 255 / 10%);
      }

      .settings-options {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        grid-column: 1 / -1;
      }

      .settings-chip.active {
        background: color-mix(in srgb, var(--settings-accent) 36%, rgb(255 255 255 / 8%));
        border-color: color-mix(in srgb, var(--settings-accent) 50%, transparent);
      }

      .settings-row.unavailable {
        opacity: 0.62;
      }

      .settings-row ha-switch {
        --switch-checked-color: var(--settings-accent);
        --switch-checked-button-color: var(--settings-accent);
      }

      @container (max-width: 360px) {
        .pair-card {
          gap: 8px;
          padding: 10px;
        }

        .machine {
          gap: 6px;
          padding: 7px;
        }

        .machine-head {
          column-gap: 10px;
          grid-template-columns: 32px minmax(68px, 1fr) auto;
        }

        .image-wrap {
          height: 32px;
          width: 32px;
        }

        .time-value {
          font-size: 18px;
        }

        .time-subtext {
          max-width: 52px;
        }

        .stat {
          padding: 3px 5px;
        }

        .control {
          min-height: 28px;
        }
      }

      @container (max-width: 280px) {
        .pair-badge,
        .stat-label {
          display: none;
        }

        .machine-settings-toggle {
          height: 28px;
          width: 28px;
        }

        .machine-head {
          grid-template-columns: 32px minmax(0, 1fr) 28px;
        }

        .machine-actions {
          align-self: start;
        }

        .time {
          display: none;
        }

        .time-subtext {
          max-width: 100%;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("lg-laundry-pair-card-editor");
  }
  static getStubConfig(t, e) {
    const i = e.find(
      (n) => n.startsWith("sensor.") && n.includes("washer_current_status")
    ), r = e.find(
      (n) => n.startsWith("sensor.") && n.includes("dryer_current_status")
    );
    return {
      name: "Laundry",
      washer: { entity: i ?? "", name: "Washer" },
      dryer: { entity: r ?? "", name: "Dryer" }
    };
  }
  setConfig(t) {
    var e, i;
    if (!((e = t == null ? void 0 : t.washer) != null && e.entity) || !((i = t == null ? void 0 : t.dryer) != null && i.entity))
      throw new Error("Washer and dryer status entities are required");
    this.config = {
      ...Ne,
      ...t,
      washer: {
        name: "Washer",
        ...t.washer
      },
      dryer: {
        name: "Dryer",
        ...t.dryer
      }
    }, this.settingsMachine = void 0, this.style.setProperty(
      "--laundry-pair-width",
      this.config.fill_container ? "100%" : this.config.width ?? "100%"
    ), this.style.setProperty(
      "--laundry-pair-radius",
      this.config.border_radius ?? "14px"
    ), this.style.setProperty(
      "--laundry-pair-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return this.config.show_stats === !1 ? 4 : 6;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 5,
      min_rows: 4,
      max_rows: 10,
      min_columns: 3,
      max_columns: 8
    };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Object.values(this.optimisticTimers).forEach((t) => window.clearTimeout(t));
  }
  entity(t) {
    var e;
    return t ? (e = this.hass) == null ? void 0 : e.states[t] : void 0;
  }
  entityDomain(t) {
    return t.split(".")[0] ?? "";
  }
  entityIcon(t, e) {
    if (e != null && e.attributes.icon)
      return e.attributes.icon;
    switch (this.entityDomain(t)) {
      case "binary_sensor":
        return "mdi:radiobox-marked";
      case "button":
        return "mdi:gesture-tap-button";
      case "event":
        return "mdi:bell-outline";
      case "number":
        return "mdi:numeric";
      case "select":
        return "mdi:format-list-bulleted";
      case "sensor":
        return "mdi:chart-line";
      case "switch":
        return "mdi:toggle-switch-outline";
      default:
        return "mdi:cog-outline";
    }
  }
  dispatchMoreInfo(t) {
    t && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  openSettings(t, e) {
    e.stopPropagation(), this.settingsMachine = t;
  }
  closeSettings(t) {
    t == null || t.stopPropagation(), this.settingsMachine = void 0;
  }
  isEditorPreview() {
    return this.isInEditorPreviewTree(this);
  }
  isInEditorPreviewTree(t) {
    for (; t; ) {
      if (t instanceof Element && t.matches(
        [
          "hui-card-preview",
          "hui-card-element-editor",
          "hui-dialog-edit-card",
          "hui-card-options"
        ].join(",")
      ))
        return !0;
      const e = t.getRootNode();
      if (e instanceof ShadowRoot) {
        t = e.host;
        continue;
      }
      t = t instanceof Element ? t.parentElement : null;
    }
    return !1;
  }
  rawStatus(t, e) {
    var i;
    return this.optimisticOperations[t] ?? ((i = this.entity(e.entity)) == null ? void 0 : i.state) ?? "unknown";
  }
  displayName(t, e) {
    var r;
    const i = this.entity(e.entity);
    return e.name || ((r = i == null ? void 0 : i.attributes.friendly_name) == null ? void 0 : r.replace(" Current status", "")) || (t === "dryer" ? "Dryer" : "Washer");
  }
  statusLabel(t, e) {
    if (f(this.entity(e.entity)))
      return "Unavailable";
    const i = this.rawStatus(t, e);
    return i === "end" ? "Complete" : E(i);
  }
  stateGroup(t, e) {
    var r, n;
    const i = this.rawStatus(t, e);
    return Di.has(i) || (r = this.entity(e.error_entity)) != null && r.attributes.event_type ? "error" : zi.has(i) ? "running" : Ii.has(i) ? "complete" : Fi.has(i) ? "paused" : (Ui.has(i) || ((n = this.entity(e.power_entity)) == null ? void 0 : n.state) === "off", "off");
  }
  stateColor(t, e, i) {
    return {
      running: e.running_color ?? J(t),
      complete: e.complete_color ?? J(t),
      paused: e.paused_color ?? "#ff8a1c",
      error: e.error_color ?? "#ff3b5c",
      off: e.off_color ?? "#697382"
    }[i];
  }
  remainingMinutes(t) {
    return De(this.entity(t.remaining_time_entity));
  }
  totalMinutes(t) {
    return Q(this.entity(t.total_time_entity));
  }
  progress(t, e, i) {
    if (i === "complete")
      return 100;
    if (i !== "running" && i !== "paused")
      return 0;
    const r = this.totalMinutes(e), n = this.remainingMinutes(e);
    return !r || n === void 0 ? i === "running" ? 18 : 0 : Math.min(100, Math.max(0, (r - n) / r * 100));
  }
  timeDisplay(t, e) {
    return e === "complete" ? "Done" : e === "off" ? "--" : w(this.remainingMinutes(t));
  }
  timeSubtext(t, e) {
    if (e === "complete")
      return "Complete";
    if (e === "off") {
      const r = w(this.totalMinutes(t));
      return r === "--" ? "Ready" : `${r} cycle`;
    }
    const i = this.remainingMinutes(t);
    return i === void 0 ? "Waiting for LG" : `${w(i)} left`;
  }
  hasOperation(t, e) {
    var r;
    const i = this.entity(t.operation_entity);
    return !!((r = i == null ? void 0 : i.attributes.options) != null && r.includes(e));
  }
  canCallOperation(t, e) {
    const i = this.entity(t.operation_entity);
    return !!(i && i.state !== "unavailable" && this.hasOperation(t, e));
  }
  isRemoteStartReady(t) {
    const e = this.entity(t.remote_start_entity);
    return !e || e.state === "on";
  }
  optimisticStatusForOperation(t) {
    return t === "start" ? "running" : t === "stop" ? "pause" : t === "power_on" ? "initial" : t;
  }
  setOptimisticOperation(t, e) {
    window.clearTimeout(this.optimisticTimers[t]), this.optimisticOperations = {
      ...this.optimisticOperations,
      [t]: e
    }, this.optimisticTimers[t] = window.setTimeout(() => {
      const i = { ...this.optimisticOperations };
      delete i[t], this.optimisticOperations = i;
    }, 2200);
  }
  trackServiceResult(t, e) {
    e && typeof e.catch == "function" && e.catch(() => {
      window.clearTimeout(this.optimisticTimers[t]);
      const i = { ...this.optimisticOperations };
      delete i[t], this.optimisticOperations = i;
    });
  }
  callOperation(t, e, i) {
    var r;
    !e.operation_entity || !this.hasOperation(e, i) || (this.setOptimisticOperation(t, this.optimisticStatusForOperation(i)), this.trackServiceResult(
      t,
      (r = this.hass) == null ? void 0 : r.callService("select", "select_option", {
        entity_id: e.operation_entity,
        option: i
      })
    ));
  }
  setPower(t, e, i) {
    var s;
    const r = this.entity(e.power_entity);
    if (this.setOptimisticOperation(t, i ? "initial" : "power_off"), e.power_entity && !f(r)) {
      this.trackServiceResult(
        t,
        (s = this.hass) == null ? void 0 : s.callService("switch", i ? "turn_on" : "turn_off", {
          entity_id: e.power_entity
        })
      );
      return;
    }
    const n = i ? "power_on" : "power_off";
    this.hasOperation(e, n) && this.callOperation(t, e, n);
  }
  renderStat(t, e) {
    const i = this.entity(e), r = H(i, this.config.energy_price_cents_per_kwh);
    return a`
      <div class="stat">
        <span class="stat-label">${r ? "Cost" : t}</span>
        <span class="stat-value">${r ?? (f(i) ? "--" : C(i))}</span>
      </div>
    `;
  }
  renderControl(t, e, i, r, n = "") {
    return a`
      <button
        type="button"
        class="control ${n}"
        aria-label=${t}
        ?disabled=${r}
        title=${t}
        @click=${i}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  configuredControlButtons(t) {
    return (Array.isArray(t.control_buttons) && t.control_buttons.length ? t.control_buttons : Mi).map(
      (i) => typeof i == "string" ? { action: i } : i
    ).map((i) => {
      const r = i.action && i.action in q ? i.action : "more_info", n = q[r];
      return {
        ...i,
        action: r,
        label: i.label ?? n.label,
        icon: i.icon ?? n.icon
      };
    });
  }
  callCustomService(t, e) {
    var n;
    if (!t.service)
      return;
    const [i, r] = t.service.split(".");
    !i || !r || (n = this.hass) == null || n.callService(
      i,
      r,
      t.service_data ?? {},
      t.target ?? (t.entity ? { entity_id: t.entity } : void 0)
    );
  }
  controlDisabled(t, e, i, r) {
    var x, _;
    const n = r.action ?? "more_info", s = this.entity(e.power_entity), c = this.entity(e.operation_entity), l = !!(e.power_entity && s), h = !c || c.state === "unavailable", p = i === "running", g = i === "running" || i === "paused", b = r.option ?? n;
    switch (n) {
      case "power_toggle":
        return l ? f(s) : !this.canCallOperation(e, "power_on") && !this.canCallOperation(e, "power_off");
      case "power_on":
        return l ? f(s) || (s == null ? void 0 : s.state) === "on" : !this.canCallOperation(e, "power_on");
      case "start":
        return h || !this.canCallOperation(e, b) || !this.isRemoteStartReady(e) || p;
      case "stop":
        return h || !this.canCallOperation(e, b) || !g;
      case "power_off":
        return l ? f(s) || (s == null ? void 0 : s.state) === "off" : !this.canCallOperation(e, "power_off");
      case "toggle":
        return !r.entity || f(this.entity(r.entity));
      case "press":
        return !r.entity || f(this.entity(r.entity));
      case "select_option":
        return !r.option || f(this.entity(r.entity ?? e.operation_entity)) || !((_ = (x = this.entity(r.entity ?? e.operation_entity)) == null ? void 0 : x.attributes.options) != null && _.includes(r.option));
      case "service":
        return !r.service;
      case "settings":
      case "more_info":
      default:
        return !1;
    }
  }
  runControlButton(t, e, i, r) {
    switch (r.stopPropagation(), i.action ?? "more_info") {
      case "power_toggle": {
        const s = this.entity(e.power_entity), c = s ? s.state !== "on" : this.stateGroup(t, e) === "off";
        this.setPower(t, e, c);
        break;
      }
      case "power_on":
        this.setPower(t, e, !0);
        break;
      case "start":
        this.callOperation(t, e, i.option ?? "start");
        break;
      case "stop":
        this.callOperation(t, e, i.option ?? "stop");
        break;
      case "power_off":
        this.setPower(t, e, !1);
        break;
      case "settings":
        this.openSettings(t, r);
        break;
      case "more_info":
        this.dispatchMoreInfo(i.entity ?? e.entity);
        break;
      case "toggle":
        i.entity && this.toggleSwitch(i.entity);
        break;
      case "press":
        i.entity && this.pressButton(i.entity);
        break;
      case "select_option":
        i.option && this.selectOption(i.entity ?? e.operation_entity ?? "", i.option);
        break;
      case "service":
        this.callCustomService(i, e);
        break;
    }
  }
  renderControlButton(t, e, i, r) {
    const n = r.action ?? "more_info", s = r.className ?? (n === "start" ? "primary" : n === "power_off" ? "warning" : "");
    return this.renderControl(
      r.label ?? q[n].label,
      r.icon ?? q[n].icon,
      (c) => this.runControlButton(t, e, r, c),
      this.controlDisabled(t, e, i, r),
      s
    );
  }
  isActionableUnknown(t) {
    var i;
    const e = this.entity(t);
    return !!(this.entityDomain(t) === "select" && ((i = e == null ? void 0 : e.attributes.options) != null && i.length));
  }
  configuredSettingEntities(t) {
    const e = [
      t.entity,
      t.power_entity,
      t.operation_entity,
      t.remote_start_entity,
      t.delayed_start_entity,
      t.remaining_time_entity,
      t.total_time_entity,
      t.cycles_entity,
      t.energy_entity,
      t.notification_entity,
      t.error_entity,
      ...t.detail_entities ?? []
    ].filter((i) => !!i);
    return [...new Set(e)].filter((i) => {
      const r = this.entity(i);
      return !f(r) || this.isActionableUnknown(i);
    });
  }
  configuredMetricEntities(t) {
    const e = Array.isArray(t.metric_entities) && t.metric_entities.length ? t.metric_entities : [t.energy_entity, t.cycles_entity];
    return [...new Set(e.filter((i) => !!i))].filter((i) => !f(this.entity(i)));
  }
  energyCostForMetric(t, e) {
    if (!(t !== e.energy_entity || V(this.config.energy_price_cents_per_kwh) === void 0))
      return H(
        this.entity(t),
        this.config.energy_price_cents_per_kwh
      );
  }
  metricLabel(t, e, i) {
    const r = this.entity(e), n = this.energyCostForMetric(e, i), s = (r == null ? void 0 : r.attributes.friendly_name) ?? e.split(".").slice(1).join(" "), c = this.displayName(t, i).toLowerCase(), l = s.replace(new RegExp(`^${c}\\s+`, "i"), "").replace(/^dryer\s+/i, "").replace(/^washer\s+/i, "").replace(/\s+this month$/i, "").trim();
    return n ? "Cost" : E(l || s);
  }
  renderMetric(t, e, i) {
    return a`
      <span class="metric">
        <span class="metric-label">${this.metricLabel(t, e, i)}</span>
        <span class="metric-value">
          ${this.energyCostForMetric(e, i) ?? C(this.entity(e))}
        </span>
      </span>
    `;
  }
  toggleSwitch(t) {
    var e;
    (e = this.hass) == null || e.callService("switch", "toggle", { entity_id: t });
  }
  pressButton(t) {
    var e;
    (e = this.hass) == null || e.callService("button", "press", { entity_id: t });
  }
  selectOption(t, e) {
    var i;
    (i = this.hass) == null || i.callService("select", "select_option", {
      entity_id: t,
      option: e
    });
  }
  renderSettingControl(t, e) {
    if (!e || f(e))
      return a`
        <span class="settings-state">
          Unknown
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </span>
      `;
    const i = this.entityDomain(t);
    return i === "switch" ? a`
        <ha-switch
          .checked=${e.state === "on"}
          @click=${(r) => r.stopPropagation()}
          @change=${() => this.toggleSwitch(t)}
        ></ha-switch>
      ` : i === "button" ? a`
        <button
          type="button"
          class="settings-row-button"
          @click=${(r) => {
      r.stopPropagation(), this.pressButton(t);
    }}
        >
          Press
        </button>
      ` : a`
      <span class="settings-state">
        ${C(e)}
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </span>
    `;
  }
  renderSettingEntity(t) {
    const e = this.entity(t), i = (e == null ? void 0 : e.attributes.options) ?? [], r = this.entityDomain(t) === "select";
    return a`
      <div class="settings-row ${!e || f(e) ? "unavailable" : ""}">
        <button
          type="button"
          class="settings-row-main"
          @click=${() => this.dispatchMoreInfo(t)}
        >
          <ha-icon icon=${this.entityIcon(t, e)}></ha-icon>
          <span class="settings-row-label">
            <span class="settings-row-name">
              ${(e == null ? void 0 : e.attributes.friendly_name) ?? t}
            </span>
            <span class="settings-row-state">${C(e)}</span>
          </span>
        </button>
        ${this.renderSettingControl(t, e)}
        ${r && i.length ? a`
              <div class="settings-options">
                ${i.map(
      (n) => a`
                    <button
                      type="button"
                      class="settings-chip ${(e == null ? void 0 : e.state) === n ? "active" : ""}"
                      @click=${(s) => {
        s.stopPropagation(), this.selectOption(t, n);
      }}
                    >
                      ${E(n)}
                    </button>
                  `
    )}
              </div>
            ` : d}
      </div>
    `;
  }
  renderSettingsSection(t, e) {
    return a`
      <section
        class="settings-group"
        style="--settings-accent: ${J(t)};"
      >
        <h3 class="settings-group-title">${this.displayName(t, e)}</h3>
        <div class="settings-list">
          ${this.configuredSettingEntities(e).map(
      (i) => this.renderSettingEntity(i)
    )}
        </div>
      </section>
    `;
  }
  renderSettingsDialog() {
    if (!this.settingsMachine || this.isEditorPreview())
      return d;
    const t = this.settingsMachine, e = this.config[t];
    return a`
      <div class="settings-overlay" @click=${this.closeSettings}>
        <section
          class="settings-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="${this.displayName(t, e)} settings"
          @click=${(i) => i.stopPropagation()}
        >
          <div class="settings-dialog-header">
            <div class="settings-dialog-title">
              <span>${this.config.name ?? "Laundry"}</span>
              <h2>${this.displayName(t, e)}</h2>
            </div>
            <button
              type="button"
              class="settings-dialog-close"
              aria-label="Close settings"
              @click=${this.closeSettings}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="settings-panel">
            ${this.renderSettingsSection(t, e)}
          </div>
        </section>
      </div>
    `;
  }
  renderMachine(t, e) {
    const i = this.stateGroup(t, e), r = this.configuredControlButtons(e), n = this.config.show_stats === !1 ? this.configuredMetricEntities(e) : [];
    return a`
      <section
        class="machine ${t} ${i}"
        style="
          --machine-state-color: ${this.stateColor(t, e, i)};
          --machine-accent-color: ${J(t)};
          --machine-contrast-color: ${Li(t)};
          --machine-progress: ${this.progress(t, e, i)}%;
          --machine-active-opacity: ${i === "off" ? "0.08" : "0.42"};
          --machine-status-opacity: ${i === "off" ? "0.38" : "1"};
        "
      >
        <div class="machine-head">
          <div class="image-wrap">
            <img
              class="appliance-image"
              alt=${this.displayName(t, e)}
              src=${e.image ?? Le(t)}
              loading="lazy"
            />
          </div>
          <div class="identity">
            <span class="machine-name">${this.displayName(t, e)}</span>
            <span class="status-line">
              <span class="status-dot"></span>
              <span class="status-text">${this.statusLabel(t, e)}</span>
            </span>
          </div>
          <div class="machine-actions">
            <div class="time">
              <span class="time-value">${this.timeDisplay(e, i)}</span>
              <span class="time-subtext">${this.timeSubtext(e, i)}</span>
            </div>
            <button
              type="button"
              class="settings-toggle machine-settings-toggle"
              aria-label="Open ${this.displayName(t, e)} settings"
              title="Settings"
              @click=${(s) => this.openSettings(t, s)}
            >
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </button>
          </div>
        </div>

        <div class="progress" aria-hidden="true">
          <div class="progress-bar"></div>
        </div>

        ${n.length ? a`
              <div class="machine-metrics">
                ${n.map(
      (s) => this.renderMetric(t, s, e)
    )}
              </div>
            ` : d}

        ${this.config.show_stats === !1 ? d : a`
              <div class="stats">
                ${this.renderStat("Total", e.total_time_entity)}
                ${this.renderStat("Remote", e.remote_start_entity)}
                ${this.renderStat("Energy", e.energy_entity)}
              </div>
            `}

        ${this.config.show_controls === !1 ? d : a`
              <div class="controls">
                ${r.map(
      (s) => this.renderControlButton(t, e, i, s)
    )}
              </div>
            `}
      </section>
    `;
  }
  render() {
    return this.config ? a`
      <ha-card>
        <article class="pair-card">
          <header class="pair-header">
            <span class="pair-title">${this.config.name ?? "Laundry"}</span>
          </header>
          <div class="machines">
            ${this.renderMachine("washer", this.config.washer)}
            ${this.renderMachine("dryer", this.config.dryer)}
          </div>
        </article>
        ${this.renderSettingsDialog()}
      </ha-card>
    ` : a``;
  }
};
Qt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  optimisticOperations: { state: !0 },
  settingsMachine: { state: !0 }
};
let Ct = Qt;
customElements.get("lg-laundry-pair-card") || customElements.define("lg-laundry-pair-card", Ct);
const te = class te extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-textfield {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 14px;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = {
      ...Ne,
      ...t,
      washer: {
        name: "Washer",
        ...t.washer
      },
      dryer: {
        name: "Dryer",
        ...t.dryer
      }
    };
  }
  updateConfig(t) {
    this.config = {
      ...this.config,
      ...t
    }, Ni(this, this.config);
  }
  updatePath(t, e) {
    const [i, r] = t.split(".");
    if (!r) {
      this.updateConfig({ [i]: e });
      return;
    }
    const n = {
      ...this.config,
      [i]: {
        ...this.config[i] ?? {},
        [r]: e
      }
    };
    this.updateConfig(n);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configPath && this.updatePath(
      e.configPath,
      e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    );
  }
  valueFor(t) {
    const [e, i] = t.split(".");
    if (!i)
      return this.config[e];
    const r = this.config[e];
    return (r == null ? void 0 : r[i]) ?? "";
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.valueFor(e) ?? ""}
        .configPath=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  controlButtonsValue(t) {
    const e = this.valueFor(`${t}.control_buttons`);
    return Array.isArray(e) ? e.map(
      (i) => typeof i == "string" ? i : (i == null ? void 0 : i.action) ?? (i == null ? void 0 : i.label) ?? ""
    ).filter(Boolean).join(", ") : "";
  }
  commaListValue(t, e) {
    const i = this.valueFor(`${t}.${e}`);
    return Array.isArray(i) ? i.join(", ") : "";
  }
  controlButtonsChanged(t) {
    const e = t.target;
    if (!e.configPath)
      return;
    const i = String(e.value ?? "").split(",").map((r) => r.trim()).filter(Boolean);
    this.updatePath(e.configPath, i.length ? i : void 0);
  }
  renderControlButtonsInput(t) {
    return a`
      <ha-textfield
        .label=${`${t === "dryer" ? "Dryer" : "Washer"} Bottom Buttons`}
        .helper=${"Comma list: power_toggle, start, stop, settings, more_info"}
        .placeholder=${"power_toggle, start, stop"}
        .value=${this.controlButtonsValue(t)}
        .configPath=${`${t}.control_buttons`}
        @input=${this.controlButtonsChanged}
      ></ha-textfield>
    `;
  }
  metricEntitiesChanged(t) {
    const e = t.target;
    if (!e.configPath)
      return;
    const i = String(e.value ?? "").split(",").map((r) => r.trim()).filter(Boolean);
    this.updatePath(e.configPath, i.length ? i : void 0);
  }
  renderMetricEntitiesInput(t) {
    return a`
      <ha-textfield
        .label=${`${t === "dryer" ? "Dryer" : "Washer"} Compact Metrics`}
        .helper=${"Comma-separated entity ids shown as small text when stats are hidden"}
        .placeholder=${`sensor.${t}_energy_this_month`}
        .value=${this.commaListValue(t, "metric_entities")}
        .configPath=${`${t}.metric_entities`}
        @input=${this.metricEntitiesChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configPath=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderMachineFields(t) {
    const e = t === "dryer" ? "Dryer" : "Washer";
    return a`
      <section class="section">
        <h3>${e}</h3>
        <div class="grid">
          ${this.renderTextInput(`${e} Name`, `${t}.name`, e)}
          ${this.renderTextInput(`${e} Status Sensor`, `${t}.entity`, `sensor.${t}_current_status`)}
          ${this.renderTextInput(`${e} Image URL`, `${t}.image`, Le(t))}
          ${this.renderTextInput(`${e} Power Switch`, `${t}.power_entity`, `switch.${t}_power`)}
          ${this.renderTextInput(`${e} Operation Select`, `${t}.operation_entity`, `select.${t}_operation`)}
          ${this.renderTextInput(`${e} Remaining Time`, `${t}.remaining_time_entity`, `sensor.${t}_remaining_time`)}
          ${this.renderTextInput(`${e} Total Time`, `${t}.total_time_entity`, `sensor.${t}_total_time`)}
          ${this.renderTextInput(`${e} Remote Start`, `${t}.remote_start_entity`, `binary_sensor.${t}_remote_start`)}
          ${this.renderTextInput(`${e} Delayed Start`, `${t}.delayed_start_entity`, `number.${t}_delayed_start`)}
          ${this.renderTextInput(`${e} Energy`, `${t}.energy_entity`, `sensor.${t}_energy_this_month`)}
          ${this.renderTextInput(`${e} Cycles`, `${t}.cycles_entity`, `sensor.${t}_cycles`)}
          ${this.renderTextInput(`${e} Notification Event`, `${t}.notification_entity`, `event.${t}_notification`)}
          ${this.renderTextInput(`${e} Error Event`, `${t}.error_entity`, `event.${t}_error`)}
          ${this.renderMetricEntitiesInput(t)}
          ${this.renderControlButtonsInput(t)}
        </div>
      </section>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Card Name", "name", "Laundry Room")}
            ${this.renderTextInput("Width", "width", "420px")}
            ${this.renderTextInput("Radius", "border_radius", "14px")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderTextInput("Energy Price Cents/kWh", "energy_price_cents_per_kwh", "16.5")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Show Controls", "show_controls", !0)}
            ${this.renderSwitch("Show Stats", "show_stats", !1)}
            ${this.renderSwitch("Animated", "animated", !0)}
          </div>
        </section>

        ${this.renderMachineFields("washer")}
        ${this.renderMachineFields("dryer")}
      </div>
    `;
  }
};
te.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let St = te;
customElements.get("lg-laundry-pair-card-editor") || customElements.define("lg-laundry-pair-card-editor", St);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "lg-laundry-pair-card",
  name: "LG Laundry Pair Card",
  description: "One compact named LG ThinQ washer and dryer dashboard card."
});
const Ri = {
  name: "Laundry usage",
  width: "500px",
  fill_container: !0,
  border_radius: "16px",
  background: "#101722",
  energy_price_cents_per_kwh: void 0
};
function F(o) {
  return o === void 0 ? "--" : `${new Intl.NumberFormat(void 0, {
    maximumFractionDigits: o >= 10 ? 1 : 2,
    minimumFractionDigits: o >= 10 ? 1 : 2
  }).format(o)} kWh`;
}
function Y(o) {
  return o === void 0 ? "--" : new Intl.NumberFormat(void 0, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(o);
}
function Te(o) {
  const t = Number(o);
  return Number.isFinite(t) ? new Intl.NumberFormat(void 0, {
    maximumFractionDigits: 0
  }).format(t) : "--";
}
const ee = class ee extends u {
  static get styles() {
    return m`
      :host {
        --laundry-usage-width: 500px;
        --laundry-usage-radius: 16px;
        --laundry-usage-background: #101722;
        --washer-color: #2f8cff;
        --dryer-color: #ff5a2f;

        display: block;
        max-width: var(--laundry-usage-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .usage-card {
        backdrop-filter: blur(18px) saturate(1.32);
        -webkit-backdrop-filter: blur(18px) saturate(1.32);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-usage-background) 70%, transparent),
            color-mix(in srgb, var(--laundry-usage-background) 86%, transparent)
          ),
          linear-gradient(135deg, rgb(255 255 255 / 11%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: var(--laundry-usage-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 14%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 10px 26px rgb(0 0 0 / 22%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 12px;
        overflow: hidden;
        padding: 14px;
        position: relative;
      }

      .usage-card::before {
        background:
          radial-gradient(circle at 18% 0%, rgb(47 140 255 / 18%), transparent 34%),
          radial-gradient(circle at 88% 8%, rgb(255 90 47 / 16%), transparent 32%);
        content: '';
        inset: 0;
        opacity: 0.8;
        pointer-events: none;
        position: absolute;
      }

      .header,
      .hero,
      .summary-grid,
      .report-grid,
      .footer-strip {
        position: relative;
        z-index: 1;
      }

      .header {
        align-items: start;
        display: flex;
        gap: 12px;
        justify-content: space-between;
        min-width: 0;
      }

      .title {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .eyebrow {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 9.5px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        text-transform: uppercase;
      }

      h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 15px;
        font-weight: 750;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
      }

      .rate {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 9%);
        border-radius: 999px;
        color: var(--secondary-text-color, #c0cad7);
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 10.5px;
        font-weight: 650;
        gap: 5px;
        min-height: 25px;
        padding: 0 9px;
      }

      .rate ha-icon {
        --mdc-icon-size: 14px;
        color: #ffd36a;
      }

      .hero {
        align-items: end;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .hero-main {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .hero-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10.5px;
        font-weight: 650;
      }

      .hero-value {
        color: var(--primary-text-color, #ffffff);
        font-size: 30px;
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
      }

      .hero-sub {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 11px;
        line-height: 1.25;
      }

      .split-pill {
        align-items: center;
        display: grid;
        gap: 5px;
        grid-template-columns: auto auto;
        justify-content: end;
      }

      .split-item {
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        display: grid;
        gap: 2px;
        min-width: 66px;
        padding: 6px 8px;
      }

      .split-item span {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 9.5px;
        font-weight: 650;
      }

      .split-item strong {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 750;
      }

      .summary-grid {
        display: grid;
        gap: 7px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .summary {
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 9px;
        display: grid;
        gap: 3px;
        min-width: 0;
        padding: 7px 8px;
      }

      .summary span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 9.5px;
        font-weight: 650;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .summary strong {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 760;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .report-grid {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .machine-report {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--machine-color) 11%, rgb(255 255 255 / 6%)),
            rgb(255 255 255 / 4%)
          );
        border: 1px solid rgb(255 255 255 / 9%);
        border-left: 3px solid var(--machine-color);
        border-radius: 11px;
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 9px 10px;
      }

      .machine-report-head {
        align-items: center;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      .machine-report-name {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 12px;
        font-weight: 760;
      }

      .machine-report-share {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10px;
        font-weight: 650;
      }

      .machine-report-main {
        display: grid;
        gap: 2px;
      }

      .machine-report-cost {
        color: var(--primary-text-color, #ffffff);
        font-size: 18px;
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
      }

      .machine-report-kwh {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10.5px;
        font-weight: 650;
      }

      .machine-report-meta {
        border-top: 1px solid rgb(255 255 255 / 7%);
        display: grid;
        gap: 6px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        padding-top: 7px;
      }

      .meta-item {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .meta-item span,
      .footer-item span {
        color: var(--secondary-text-color, #9aa3b1);
        font-size: 9.5px;
        font-weight: 650;
        text-transform: uppercase;
      }

      .meta-item strong,
      .footer-item strong {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 11px;
        font-weight: 740;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .footer-strip {
        background: rgb(255 255 255 / 4%);
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: 10px;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        padding: 8px 10px;
      }

      .footer-item {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      @container (max-width: 390px) {
        .usage-card {
          padding: 12px;
        }

        .hero {
          align-items: stretch;
          grid-template-columns: 1fr;
        }

        .split-pill {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          justify-content: stretch;
        }

        .summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .report-grid,
        .footer-strip {
          grid-template-columns: 1fr;
        }
      }

      @container (max-width: 280px) {
        .header {
          display: grid;
        }

        .hero-value {
          font-size: 24px;
        }

        .machine-report-meta {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
  static getStubConfig() {
    return {
      type: "custom:lg-laundry-usage-card",
      washer_energy_entity: "sensor.washer_energy_this_month",
      dryer_energy_entity: "sensor.dryer_energy_this_month"
    };
  }
  setConfig(t) {
    this.config = {
      ...Ri,
      ...t
    }, this.style.setProperty(
      "--laundry-usage-width",
      this.config.fill_container ? "100%" : this.config.width ?? "500px"
    ), this.style.setProperty(
      "--laundry-usage-radius",
      this.config.border_radius ?? "16px"
    ), this.style.setProperty(
      "--laundry-usage-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 5;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 6,
      min_rows: 4,
      max_rows: 8,
      min_columns: 4,
      max_columns: 12
    };
  }
  entity(t) {
    var e;
    return t ? (e = this.hass) == null ? void 0 : e.states[t] : void 0;
  }
  energy(t) {
    return _t(this.entity(t));
  }
  cost(t) {
    const e = this.energy(t), i = V(this.config.energy_price_cents_per_kwh);
    if (!(e === void 0 || i === void 0))
      return e * i / 100;
  }
  displayEnergy(t) {
    const e = this.entity(t);
    return H(e, this.config.energy_price_cents_per_kwh) ?? F(_t(e));
  }
  monthLabel() {
    return new Intl.DateTimeFormat(void 0, {
      month: "long",
      year: "numeric"
    }).format(/* @__PURE__ */ new Date());
  }
  displayTotal(t, e) {
    const i = this.cost(t), r = this.cost(e);
    if (i !== void 0 || r !== void 0)
      return Y((i ?? 0) + (r ?? 0));
    const n = this.energy(t), s = this.energy(e);
    return n === void 0 && s === void 0 ? "--" : F((n ?? 0) + (s ?? 0));
  }
  totalMonthCost() {
    const t = this.cost(this.config.washer_energy_entity), e = this.cost(this.config.dryer_energy_entity);
    if (!(t === void 0 && e === void 0))
      return (t ?? 0) + (e ?? 0);
  }
  totalMonthEnergy() {
    const t = this.energy(this.config.washer_energy_entity), e = this.energy(this.config.dryer_energy_entity);
    if (!(t === void 0 && e === void 0))
      return (t ?? 0) + (e ?? 0);
  }
  totalCycles() {
    const t = this.entity(this.config.washer_cycles_entity), e = this.entity(this.config.dryer_cycles_entity), i = f(t) ? void 0 : Number(t == null ? void 0 : t.state), r = f(e) ? void 0 : Number(e == null ? void 0 : e.state);
    if (Number.isFinite(i) || Number.isFinite(r)) {
      const n = Number.isFinite(i) ? Number(i) : 0, s = Number.isFinite(r) ? Number(r) : 0;
      return Te(String(n + s));
    }
    return Te(t == null ? void 0 : t.state);
  }
  totalTime() {
    const t = Q(this.entity(this.config.washer_total_time_entity)), e = Q(this.entity(this.config.dryer_total_time_entity));
    return t === void 0 && e === void 0 ? "--" : w((t ?? 0) + (e ?? 0));
  }
  dryerShare() {
    const t = this.energy(this.config.washer_energy_entity), e = this.energy(this.config.dryer_energy_entity);
    if (!e || t === void 0)
      return "Usage split";
    const i = t + e;
    return i ? `${Math.round(e / i * 100)}% dryer` : "Usage split";
  }
  machineShare(t) {
    const e = this.energy(t), i = this.totalMonthEnergy();
    return e === void 0 || !i ? "--" : `${Math.round(e / i * 100)}%`;
  }
  averageDailyCost() {
    const t = this.totalMonthCost();
    return t === void 0 ? "--" : Y(t / (/* @__PURE__ */ new Date()).getDate());
  }
  projectedCost() {
    const t = this.totalMonthCost();
    if (t === void 0)
      return "--";
    const e = /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
    return Y(t / e.getDate() * i);
  }
  renderMachineReport(t, e, i, r, n) {
    return a`
      <div class="machine-report" style="--machine-color: ${n};">
        <div class="machine-report-head">
          <span class="machine-report-name">${t}</span>
          <span class="machine-report-share">${this.machineShare(e)}</span>
        </div>
        <div class="machine-report-main">
          <span class="machine-report-cost">${this.displayEnergy(e)}</span>
          <span class="machine-report-kwh">${F(this.energy(e))}</span>
        </div>
        <div class="machine-report-meta">
          <span class="meta-item">
            <span>Yesterday</span>
            <strong>${this.displayEnergy(i)}</strong>
          </span>
          <span class="meta-item">
            <span>Last month</span>
            <strong>${this.displayEnergy(r)}</strong>
          </span>
        </div>
      </div>
    `;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.totalMonthCost(), e = this.totalMonthEnergy(), i = V(this.config.energy_price_cents_per_kwh);
    return a`
      <ha-card>
        <article class="usage-card">
          <header class="header">
            <div class="title">
              <span class="eyebrow">Laundry</span>
              <h2>${this.monthLabel()}</h2>
            </div>
            ${i ? a`
                  <span class="rate">
                    <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    ${i}c/kWh
                  </span>
                ` : d}
          </header>

          <section class="hero">
            <div class="hero-main">
              <span class="hero-label">Monthly spend</span>
              <span class="hero-value">
                ${t !== void 0 ? Y(t) : F(e)}
              </span>
              <span class="hero-sub">${this.dryerShare()}</span>
            </div>
            <div class="split-pill">
              <span class="split-item">
                <span>Washer</span>
                <strong>${this.displayEnergy(this.config.washer_energy_entity)}</strong>
              </span>
              <span class="split-item">
                <span>Dryer</span>
                <strong>${this.displayEnergy(this.config.dryer_energy_entity)}</strong>
              </span>
            </div>
          </section>

          <section class="report-grid">
            ${this.renderMachineReport(
      "Washer",
      this.config.washer_energy_entity,
      this.config.washer_energy_yesterday_entity,
      this.config.washer_energy_last_month_entity,
      "var(--washer-color)"
    )}
            ${this.renderMachineReport(
      "Dryer",
      this.config.dryer_energy_entity,
      this.config.dryer_energy_yesterday_entity,
      this.config.dryer_energy_last_month_entity,
      "var(--dryer-color)"
    )}
          </section>

          <section class="summary-grid">
            <div class="summary">
              <span>Energy</span>
              <strong>${F(e)}</strong>
            </div>
            <div class="summary">
              <span>Cycles</span>
              <strong>${this.totalCycles()}</strong>
            </div>
            <div class="summary">
              <span>Time</span>
              <strong>${this.totalTime()}</strong>
            </div>
            <div class="summary">
              <span>Last month</span>
              <strong>
                ${this.displayTotal(
      this.config.washer_energy_last_month_entity,
      this.config.dryer_energy_last_month_entity
    )}
              </strong>
            </div>
          </section>

          <section class="footer-strip">
            <span class="footer-item">
              <span>Yesterday</span>
              <strong>
                ${this.displayTotal(
      this.config.washer_energy_yesterday_entity,
      this.config.dryer_energy_yesterday_entity
    )}
              </strong>
            </span>
            <span class="footer-item">
              <span>Avg/day</span>
              <strong>${this.averageDailyCost()}</strong>
            </span>
            <span class="footer-item">
              <span>Projected</span>
              <strong>${this.projectedCost()}</strong>
            </span>
          </section>
        </article>
      </ha-card>
    `;
  }
};
ee.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Et = ee;
customElements.get("lg-laundry-usage-card") || customElements.define("lg-laundry-usage-card", Et);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "lg-laundry-usage-card",
  name: "LG Laundry Usage Card",
  description: "A glassy laundry energy and cost analytics card."
});
const Bi = {
  name: "Atom Echo Voice",
  width: "360px",
  fill_container: !1,
  border_radius: "16px",
  background: "#101722"
}, L = [
  {
    entity: "select.m5stack_atom_echo_546544_response_speaker",
    name: "Response speaker",
    icon: "mdi:speaker-wireless"
  },
  {
    entity: "select.m5stack_atom_echo_546544_assistant",
    name: "Pipeline",
    icon: "mdi:filter-outline"
  },
  {
    entity: "select.m5stack_atom_echo_546544_wake_word",
    name: "Wake word",
    icon: "mdi:microphone-outline"
  },
  {
    entity: "select.m5stack_atom_echo_546544_wake_word_engine_location",
    name: "Wake word engine",
    icon: "mdi:format-list-bulleted"
  }
];
function ji(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function Vi(o) {
  return !o || ["unknown", "unavailable"].includes(o) ? "Unknown" : o.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
const ie = class ie extends u {
  static get styles() {
    return m`
      :host {
        --voice-card-width: 360px;
        --voice-card-radius: 16px;
        --voice-background: #101722;
        --voice-accent: #82d6ff;

        display: block;
        max-width: var(--voice-card-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        overflow: visible;
      }

      .voice-card {
        backdrop-filter: blur(18px) saturate(1.3);
        -webkit-backdrop-filter: blur(18px) saturate(1.3);
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--voice-background) 70%, transparent),
            color-mix(in srgb, var(--voice-background) 86%, transparent)
          ),
          linear-gradient(135deg, rgb(255 255 255 / 11%), rgb(255 255 255 / 3%));
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: var(--voice-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 14%),
          inset 0 -1px 0 rgb(255 255 255 / 4%),
          0 10px 26px rgb(0 0 0 / 22%);
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        container-type: inline-size;
        display: grid;
        gap: 10px;
        overflow: hidden;
        padding: 14px;
        position: relative;
      }

      .voice-card::before {
        background:
          radial-gradient(circle at 16% 0%, rgb(130 214 255 / 18%), transparent 34%),
          radial-gradient(circle at 92% 10%, rgb(147 116 255 / 14%), transparent 32%);
        content: '';
        inset: 0;
        opacity: 0.75;
        pointer-events: none;
        position: absolute;
      }

      .title,
      .rows {
        position: relative;
        z-index: 1;
      }

      .title {
        align-items: center;
        display: flex;
        justify-content: space-between;
        min-width: 0;
      }

      h2 {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 18px;
        font-weight: 740;
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .badge {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 999px;
        color: var(--secondary-text-color, #b7c0ce);
        display: inline-flex;
        flex: 0 0 auto;
        height: 24px;
        justify-content: center;
        width: 24px;
      }

      .badge ha-icon {
        --mdc-icon-size: 15px;
      }

      .rows {
        display: grid;
        gap: 7px;
      }

      .row {
        align-items: center;
        background: rgb(255 255 255 / 5%);
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 10px;
        display: grid;
        gap: 9px;
        grid-template-columns: 28px minmax(0, 1fr);
        min-width: 0;
        padding: 8px 9px;
      }

      .icon-wrap {
        align-items: center;
        background: color-mix(in srgb, var(--voice-accent) 15%, rgb(255 255 255 / 6%));
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        color: var(--voice-accent);
        display: inline-flex;
        height: 28px;
        justify-content: center;
        width: 28px;
      }

      .icon-wrap ha-icon {
        --mdc-icon-size: 16px;
      }

      .row-main {
        display: grid;
        gap: 5px;
        min-width: 0;
      }

      .row-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      select {
        appearance: none;
        -webkit-appearance: none;
        background:
          linear-gradient(180deg, rgb(255 255 255 / 7%), rgb(255 255 255 / 4%)),
          linear-gradient(45deg, transparent 50%, currentColor 50%),
          linear-gradient(135deg, currentColor 50%, transparent 50%);
        background-position:
          0 0,
          calc(100% - 12px) 50%,
          calc(100% - 8px) 50%;
        background-repeat: no-repeat;
        background-size:
          100% 100%,
          4px 4px,
          4px 4px;
        border: 1px solid rgb(255 255 255 / 8%);
        border-radius: 8px;
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        font: inherit;
        font-size: 12.5px;
        font-weight: 650;
        height: 32px;
        letter-spacing: 0;
        min-width: 0;
        overflow: hidden;
        padding: 0 24px 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      select:focus-visible {
        outline: 2px solid var(--voice-accent);
        outline-offset: 2px;
      }

      select:disabled {
        cursor: default;
        opacity: 0.45;
      }

      option {
        background: #192230;
        color: #f4f7fb;
      }

      @container (max-width: 280px) {
        .voice-card {
          padding: 12px;
        }

        h2 {
          font-size: 16px;
        }

        .row {
          grid-template-columns: 24px minmax(0, 1fr);
          padding: 7px;
        }

        .icon-wrap {
          height: 24px;
          width: 24px;
        }
      }
    `;
  }
  static getStubConfig() {
    return {
      type: "custom:voice-settings-card",
      name: "Atom Echo Voice",
      rows: L
    };
  }
  static async getConfigElement() {
    return document.createElement("voice-settings-card-editor");
  }
  setConfig(t) {
    this.config = {
      ...Bi,
      ...t
    }, this.style.setProperty(
      "--voice-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "360px"
    ), this.style.setProperty(
      "--voice-card-radius",
      this.config.border_radius ?? "16px"
    ), this.style.setProperty("--voice-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 6,
      min_rows: 3,
      max_rows: 8,
      min_columns: 4,
      max_columns: 8
    };
  }
  entity(t) {
    var e;
    return (e = this.hass) == null ? void 0 : e.states[t];
  }
  rows() {
    var t;
    return (t = this.config.rows) != null && t.length ? this.config.rows : L;
  }
  optionLabel(t) {
    return Vi(t.replace(/\s+\([^)]+\)$/u, ""));
  }
  selectOption(t, e) {
    var i;
    (i = this.hass) == null || i.callService("select", "select_option", {
      entity_id: t,
      option: e
    });
  }
  renderRow(t) {
    const e = this.entity(t.entity), i = (e == null ? void 0 : e.attributes.options) ?? [], r = (e == null ? void 0 : e.state) ?? "", n = i.includes(r);
    return a`
      <div class="row">
        <span class="icon-wrap">
          <ha-icon icon=${t.icon ?? (e == null ? void 0 : e.attributes.icon) ?? "mdi:tune-variant"}></ha-icon>
        </span>
        <div class="row-main">
          <span class="row-label">
            ${t.name ?? (e == null ? void 0 : e.attributes.friendly_name) ?? t.entity}
          </span>
          <select
            .value=${r}
            ?disabled=${!i.length}
            @change=${(s) => {
      const c = s.target;
      this.selectOption(t.entity, c.value);
    }}
          >
            ${i.length ? d : a`<option value="">Entity unavailable</option>`}
            ${!n && r ? a`<option .value=${r}>${this.optionLabel(r)}</option>` : d}
            ${i.map(
      (s) => a`
                <option .value=${s}>${this.optionLabel(s)}</option>
              `
    )}
          </select>
        </div>
      </div>
    `;
  }
  render() {
    return this.config ? a`
      <ha-card>
        <article class="voice-card">
          <header class="title">
            <h2>${this.config.name ?? "Atom Echo Voice"}</h2>
            <span class="badge">
              <ha-icon icon="mdi:account-voice"></ha-icon>
            </span>
          </header>
          <div class="rows">
            ${this.rows().map((t) => this.renderRow(t))}
          </div>
        </article>
      </ha-card>
    ` : a``;
  }
};
ie.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Tt = ie;
customElements.get("voice-settings-card") || customElements.define("voice-settings-card", Tt);
const re = class re extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 14px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .rows {
        display: grid;
        gap: 10px;
      }

      .row {
        border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        display: grid;
        gap: 10px;
        padding-top: 10px;
      }

      .row:first-child {
        border-top: 0;
        padding-top: 0;
      }

      .row-title {
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-textfield {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    var e;
    this.config = {
      ...t,
      rows: (e = t.rows) != null && e.length ? t.rows : L
    };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, ji(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  rowValueChanged(t) {
    var c, l;
    const e = t.target, i = t, r = e.rowIndex, n = e.rowKey;
    if (r === void 0 || !n)
      return;
    const s = [...(c = this.config.rows) != null && c.length ? this.config.rows : L];
    s[r] = {
      ...s[r],
      [n]: ((l = i.detail) == null ? void 0 : l.value) ?? e.value
    }, Object.keys(s[r]).forEach((h) => {
      const p = h;
      s[r][p] === "" && delete s[r][p];
    }), this.updateConfig({ rows: s });
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderRowInput(t, e, i, r, n = "") {
    return a`
      <ha-textfield
        .label=${r}
        .placeholder=${n}
        .value=${t[i] ?? ""}
        .rowIndex=${e}
        .rowKey=${i}
        @input=${this.rowValueChanged}
      ></ha-textfield>
    `;
  }
  renderRows() {
    var e;
    const t = (e = this.config.rows) != null && e.length ? this.config.rows : L;
    return a`
      <div class="rows">
        ${t.map(
      (i, r) => a`
            <div class="row">
              <span class="row-title">${i.name ?? `Row ${r + 1}`}</span>
              <div class="grid">
                ${this.renderRowInput(i, r, "name", "Name", "Pipeline")}
                ${this.renderRowInput(i, r, "icon", "Icon", "mdi:microphone-outline")}
                ${this.renderRowInput(i, r, "entity", "Entity", "select.example")}
              </div>
            </div>
          `
    )}
      </div>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Card Name", "name", "Atom Echo Voice")}
            ${this.renderTextInput("Width", "width", "360px")}
            ${this.renderTextInput("Radius", "border_radius", "16px")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
          </div>
        </section>

        <section class="section">
          <h3>Rows</h3>
          ${this.renderRows()}
        </section>
      </div>
    `;
  }
};
re.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Pt = re;
customElements.get("voice-settings-card-editor") || customElements.define("voice-settings-card-editor", Pt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "voice-settings-card",
  name: "Voice Settings Card",
  description: "A compact glass card for voice assistant select controls."
});
const Pe = {
  icon: "mdi:food",
  width: "320px",
  fill_container: !1,
  fill_height: !0,
  height: "118px",
  border_radius: "18px",
  layout: "auto",
  accent_color: "#ff9f2f",
  off_color: "#778392",
  background: "#101722",
  show_battery: !0,
  show_last_amount: !0,
  show_details: !0,
  animated: !0
}, Hi = ["auto", "horizontal", "vertical"];
function Wi(o, t) {
  o.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function U(o) {
  return !o || ["unavailable", "unknown"].includes(o.state);
}
function P(o) {
  const t = Number(o);
  return Number.isFinite(t) ? t : void 0;
}
function ot(o) {
  return o === void 0 ? "--" : Number.isInteger(o) ? String(o) : o.toFixed(1);
}
function st(o, t) {
  return o != null && o.trim() ? o.trim() : t;
}
const ne = class ne extends u {
  constructor() {
    super(...arguments), this.pending = !1;
  }
  static get styles() {
    return m`
      :host {
        --pet-feeder-width: 320px;
        --pet-feeder-height: 118px;
        --pet-feeder-radius: 18px;
        --pet-feeder-accent: #ff9f2f;
        --pet-feeder-off: #778392;
        --pet-feeder-background: #101722;

        container-type: inline-size;
        display: block;
        height: var(--pet-feeder-host-height, auto);
        max-width: var(--pet-feeder-width);
        width: 100%;
      }

      ha-card {
        background: transparent;
        border: 0;
        box-shadow: none;
        display: block;
        height: 100%;
        overflow: visible;
      }

      .card {
        background:
          radial-gradient(
            circle at 17% 18%,
            color-mix(in srgb, var(--pet-feeder-accent) 18%, transparent),
            transparent 38%
          ),
          linear-gradient(
            145deg,
            color-mix(in srgb, var(--pet-feeder-background) 88%, #ffffff 7%),
            color-mix(in srgb, var(--pet-feeder-background) 94%, #000000 17%)
          );
        border: 1px solid
          color-mix(
            in srgb,
            var(--pet-feeder-state-color) var(--pet-feeder-border-strength),
            transparent
          );
        border-radius: var(--pet-feeder-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 9%),
          0 14px 28px rgb(0 0 0 / 24%),
          0 0 var(--pet-feeder-outer-blur)
            color-mix(
              in srgb,
              var(--pet-feeder-state-color) var(--pet-feeder-outer-strength),
              transparent
            );
        box-sizing: border-box;
        color: var(--primary-text-color, #f4f7fb);
        min-height: var(--pet-feeder-height);
        overflow: hidden;
        padding: 10px;
        position: relative;
        width: 100%;
      }

      .card.fill-height {
        height: 100%;
      }

      .card::before {
        background:
          linear-gradient(
            120deg,
            rgb(255 255 255 / 11%),
            transparent 42%,
            rgb(255 255 255 / 4%) 72%,
            transparent
          ),
          radial-gradient(
            circle at 92% 18%,
            color-mix(in srgb, var(--pet-feeder-state-color) 18%, transparent),
            transparent 34%
          );
        content: "";
        inset: 0;
        opacity: var(--pet-feeder-sheen-opacity);
        pointer-events: none;
        position: absolute;
      }

      .card.feeding.animated::after {
        animation: pet-feeder-pulse 2.4s ease-in-out infinite;
      }

      .card::after {
        border: 1px solid
          color-mix(
            in srgb,
            var(--pet-feeder-state-color) var(--pet-feeder-ring-strength),
            transparent
          );
        border-radius: inherit;
        content: "";
        inset: 0;
        opacity: var(--pet-feeder-ring-opacity);
        pointer-events: none;
        position: absolute;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        position: relative;
        z-index: 1;
      }

      .card.fill-height.layout-vertical .content {
        justify-content: flex-start;
      }

      .top-group {
        display: grid;
        gap: 10px;
      }

      .card.fill-height.layout-vertical .top-group {
        margin-top: clamp(2px, 4cqi, 14px);
      }

      .head {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .identity {
        align-items: center;
        appearance: none;
        background: transparent;
        border: 0;
        color: inherit;
        cursor: pointer;
        display: grid;
        font-family: inherit;
        gap: 8px;
        grid-template-columns: 34px minmax(0, 1fr);
        min-width: 0;
        padding: 0;
        text-align: left;
      }

      .icon-shell {
        align-items: center;
        background:
          radial-gradient(
            circle at 50% 35%,
            color-mix(in srgb, var(--pet-feeder-state-color) 16%, transparent),
            transparent 62%
          ),
          rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 11px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 8%);
        color: var(--pet-feeder-state-color);
        display: inline-flex;
        height: 34px;
        justify-content: center;
        width: 34px;
      }

      .icon-shell ha-icon {
        height: 19px;
        width: 19px;
      }

      .title-block {
        display: grid;
        gap: 2px;
        min-width: 0;
      }

      .name {
        font-size: 15px;
        font-weight: 760;
        letter-spacing: 0;
        line-height: 1.05;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        align-items: center;
        color: var(--secondary-text-color, #aeb8c6);
        display: inline-flex;
        font-size: 11px;
        gap: 6px;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dot {
        background: var(--pet-feeder-state-color);
        border-radius: 999px;
        box-shadow: 0 0 14px
          color-mix(in srgb, var(--pet-feeder-state-color) 58%, transparent);
        display: inline-block;
        height: 6px;
        width: 6px;
      }

      .battery {
        align-items: center;
        appearance: none;
        background: rgb(255 255 255 / 7%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        display: inline-flex;
        font-family: inherit;
        font-size: 11px;
        font-weight: 720;
        gap: 5px;
        line-height: 1;
        min-height: 26px;
        max-width: 108px;
        padding: 0 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .battery {
        color: var(--pet-feeder-battery-color);
        cursor: pointer;
      }

      .battery ha-icon {
        height: 14px;
        width: 14px;
      }

      .control-stack {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: minmax(0, 1fr) minmax(92px, 0.45fr);
      }

      .stepper {
        align-items: stretch;
        background:
          linear-gradient(
            180deg,
            rgb(255 255 255 / 8%),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 11%);
        border-radius: 999px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%);
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) 44px;
        min-height: 50px;
        overflow: hidden;
        position: relative;
      }

      .stepper::before,
      .stepper::after {
        background: rgb(255 255 255 / 9%);
        bottom: 14%;
        content: "";
        position: absolute;
        top: 14%;
        width: 1px;
      }

      .stepper::before {
        left: 44px;
      }

      .stepper::after {
        right: 44px;
      }

      .card.layout-vertical .control-stack {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .card.layout-vertical .stepper {
        grid-template-columns: 48px minmax(0, 1fr) 48px;
        min-height: 58px;
      }

      .card.layout-vertical .stepper::before {
        left: 48px;
      }

      .card.layout-vertical .stepper::after {
        right: 48px;
      }

      .card.layout-vertical .dose-value {
        font-size: clamp(26px, 11cqi, 34px);
      }

      .card.layout-vertical .feed-button,
      .card.layout-auto .feed-button {
        width: 100%;
      }

      .step-button,
      .feed-button {
        -webkit-tap-highlight-color: transparent;
        align-items: center;
        appearance: none;
        border: 0;
        color: var(--primary-text-color, #f4f7fb);
        cursor: pointer;
        display: inline-flex;
        font-family: inherit;
        justify-content: center;
      }

      .step-button {
        background: transparent;
        height: 100%;
        position: relative;
        transition: background 0.18s ease;
        width: 100%;
      }

      .step-button:hover:not(:disabled) {
        background: rgb(255 255 255 / 7%);
      }

      .step-button:active:not(:disabled) {
        background: rgb(255 255 255 / 12%);
      }

      .step-button ha-icon {
        height: 18px;
        width: 18px;
      }

      .step-button:disabled,
      .feed-button:disabled {
        cursor: default;
        opacity: 0.32;
      }

      .dose {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        gap: 2px;
        justify-content: center;
        min-height: 0;
        overflow: hidden;
        padding: 0 10px;
      }

      .dose-value {
        color: #ffffff;
        font-size: clamp(22px, 10cqi, 30px);
        font-weight: 780;
        letter-spacing: 0;
        line-height: 1;
        text-align: center;
      }

      .dose-label {
        color: var(--secondary-text-color, #aeb8c6);
        font-size: 9px;
        font-weight: 720;
        letter-spacing: 0.12em;
        line-height: 1.1;
        text-transform: uppercase;
      }

      .feed-button {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, #ffffff 18%, transparent),
            transparent 55%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--pet-feeder-state-color) 82%, #ffffff 4%),
            color-mix(in srgb, var(--pet-feeder-state-color) 70%, #000000 12%)
          );
        border: 1px solid
          color-mix(in srgb, var(--pet-feeder-state-color) 78%, #ffffff 12%);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 18%),
          0 10px 20px
            color-mix(in srgb, var(--pet-feeder-state-color) 18%, transparent);
        font-size: 12px;
        font-weight: 800;
        height: 34px;
        min-width: 0;
        overflow: hidden;
        padding: 0 12px;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .card.unavailable .feed-button {
        background: rgb(255 255 255 / 8%);
        border-color: rgb(255 255 255 / 10%);
        box-shadow: none;
      }

      .info-strip {
        border-top: 1px solid rgb(255 255 255 / 9%);
        display: none;
        gap: 7px;
        margin-top: auto;
        padding-top: 10px;
      }

      .card.layout-vertical .info-strip {
        display: grid;
      }

      .info-row {
        align-items: center;
        color: var(--secondary-text-color, #aeb8c6);
        display: flex;
        font-size: 11px;
        font-weight: 650;
        gap: 10px;
        justify-content: space-between;
        min-width: 0;
      }

      .info-label {
        letter-spacing: 0.08em;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .info-value {
        color: var(--primary-text-color, #f4f7fb);
        font-weight: 780;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @keyframes pet-feeder-pulse {
        0%,
        100% {
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 9%),
            0 14px 28px rgb(0 0 0 / 24%),
            0 0 28px color-mix(in srgb, var(--pet-feeder-state-color) 12%, transparent);
        }

        50% {
          box-shadow:
            inset 0 1px 0 rgb(255 255 255 / 10%),
            0 14px 28px rgb(0 0 0 / 24%),
            0 0 46px color-mix(in srgb, var(--pet-feeder-state-color) 22%, transparent);
        }
      }

      /* Auto layout: horizontal by default, vertical when container < 280px */
      @container (max-width: 280px) {
        .card.layout-auto {
          padding: 11px;
        }

        .card.layout-auto .head {
          gap: 6px;
        }

        .card.layout-auto .control-stack {
          gap: 10px;
          grid-template-columns: 1fr;
        }

        .card.layout-auto .stepper {
          grid-template-columns: 48px minmax(0, 1fr) 48px;
          min-height: 58px;
        }

        .card.layout-auto .stepper::before {
          left: 48px;
        }

        .card.layout-auto .stepper::after {
          right: 48px;
        }

        .card.layout-auto .dose-value {
          font-size: clamp(26px, 11cqi, 34px);
        }

        .card.layout-auto .info-strip {
          display: grid;
        }
      }

      /* Very narrow: tighten battery */
      @container (max-width: 220px) {
        .battery {
          font-size: 10px;
          min-height: 22px;
          padding: 0 6px;
        }

        .battery ha-icon {
          height: 12px;
          width: 12px;
        }

        .stepper,
        .card.layout-auto .stepper,
        .card.layout-vertical .stepper {
          grid-template-columns: 40px minmax(0, 1fr) 40px;
          min-height: 50px;
        }

        .card.layout-auto .stepper::before,
        .card.layout-vertical .stepper::before {
          left: 40px;
        }

        .card.layout-auto .stepper::after,
        .card.layout-vertical .stepper::after {
          right: 40px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .card.feeding.animated::after {
          animation: none;
        }
      }
    `;
  }
  static async getConfigElement() {
    return document.createElement("smart-pet-feeder-card-editor");
  }
  static getStubConfig(t, e) {
    const i = (p) => p.toLowerCase(), r = e.filter((p) => {
      const g = i(p);
      return p.startsWith("number.") && (g.includes("feed") || g.includes("feeder") || g.includes("portion") || g.includes("pet") || g.includes("nova"));
    }), [n] = r, [s] = e.filter(
      (p) => p.startsWith("binary_sensor.") && i(p).includes("feeding")
    ), [c] = e.filter(
      (p) => p.startsWith("sensor.") && i(p).includes("battery")
    ), [l] = e.filter(
      (p) => p.startsWith("sensor.") && (i(p).includes("last_amount") || i(p).includes("last") && i(p).includes("amount"))
    ), [h] = e.filter(
      (p) => p.startsWith("sensor.") && i(p).includes("last") && (i(p).includes("fed") || i(p).includes("feed"))
    );
    return {
      feed_entity: n ?? "",
      ...s ? { feeding_entity: s } : {},
      ...c ? { battery_entity: c } : {},
      ...l ? { last_amount_entity: l } : {},
      ...h ? { last_fed_entity: h } : {}
    };
  }
  setConfig(t) {
    if (!(t != null && t.feed_entity))
      throw new Error("Entity is required");
    this.config = {
      ...Pe,
      ...t
    }, this.style.setProperty(
      "--pet-feeder-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--pet-feeder-host-height",
      this.config.fill_height ? "100%" : "auto"
    ), this.style.setProperty(
      "--pet-feeder-height",
      this.config.height ?? "118px"
    ), this.style.setProperty(
      "--pet-feeder-radius",
      this.config.border_radius ?? "18px"
    ), this.style.setProperty(
      "--pet-feeder-accent",
      this.config.accent_color ?? "#ff9f2f"
    ), this.style.setProperty(
      "--pet-feeder-off",
      this.config.off_color ?? "#778392"
    ), this.style.setProperty(
      "--pet-feeder-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    var e;
    return {
      rows: ((e = this.config) == null ? void 0 : e.layout) === "vertical" ? 3 : 2,
      columns: 6,
      min_rows: 1,
      max_rows: 6,
      min_columns: 2,
      max_columns: 12
    };
  }
  get feedEntity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.feed_entity];
  }
  get feedingEntity() {
    var t;
    return this.config.feeding_entity ? (t = this.hass) == null ? void 0 : t.states[this.config.feeding_entity] : void 0;
  }
  get batteryEntity() {
    var t;
    return this.config.battery_entity ? (t = this.hass) == null ? void 0 : t.states[this.config.battery_entity] : void 0;
  }
  get lastAmountEntity() {
    var t;
    return this.config.last_amount_entity ? (t = this.hass) == null ? void 0 : t.states[this.config.last_amount_entity] : void 0;
  }
  get lastFedEntity() {
    var t;
    return this.config.last_fed_entity ? (t = this.hass) == null ? void 0 : t.states[this.config.last_fed_entity] : void 0;
  }
  get amountMin() {
    var t;
    return P((t = this.feedEntity) == null ? void 0 : t.attributes.min) ?? 1;
  }
  get amountMax() {
    var t;
    return P((t = this.feedEntity) == null ? void 0 : t.attributes.max) ?? 9;
  }
  get amountStep() {
    var t;
    return P((t = this.feedEntity) == null ? void 0 : t.attributes.step) ?? 1;
  }
  get entityAmount() {
    var t;
    return U(this.feedEntity) ? void 0 : P((t = this.feedEntity) == null ? void 0 : t.state);
  }
  get amount() {
    return this.selectedAmount ?? this.entityAmount ?? this.amountMin;
  }
  get batteryPercent() {
    var t;
    return U(this.batteryEntity) ? void 0 : P((t = this.batteryEntity) == null ? void 0 : t.state);
  }
  get lastAmount() {
    var t;
    return U(this.lastAmountEntity) ? void 0 : P((t = this.lastAmountEntity) == null ? void 0 : t.state);
  }
  get lastFedDisplay() {
    var r, n;
    if (U(this.lastFedEntity))
      return;
    const t = (r = this.lastFedEntity) == null ? void 0 : r.state;
    if (!t)
      return;
    const e = Date.parse(t);
    if (Number.isFinite(e)) {
      const s = Date.now() - e;
      return s >= 0 && s < 6e4 ? "Just now" : s >= 0 && s < 36e5 ? `${Math.max(1, Math.round(s / 6e4))}m ago` : s >= 0 && s < 864e5 ? `${Math.max(1, Math.round(s / 36e5))}h ago` : s >= 0 && s < 6048e5 ? `${Math.max(1, Math.round(s / 864e5))}d ago` : new Date(e).toLocaleDateString([], {
        month: "short",
        day: "numeric"
      });
    }
    const i = (n = this.lastFedEntity) == null ? void 0 : n.attributes.unit_of_measurement;
    return i ? `${t} ${i}` : t;
  }
  get isFeeding() {
    var t;
    return this.pending || ((t = this.feedingEntity) == null ? void 0 : t.state) === "on";
  }
  get cardUnavailable() {
    return U(this.feedEntity);
  }
  get displayName() {
    var e;
    const t = (e = this.feedEntity) == null ? void 0 : e.attributes.friendly_name;
    return this.config.name ? st(this.config.name, "Pet Feeder") : this.config.pet_name ? st(`${this.config.pet_name} Feeder`, "Pet Feeder") : t && /feed|feeder/i.test(t) ? st(t.replace(/\s*feed\s*$/i, " Feeder"), "Pet Feeder") : "Pet Feeder";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.feedEntity) == null ? void 0 : t.attributes.icon) || Pe.icon;
  }
  get statusText() {
    return this.cardUnavailable ? "Unavailable" : this.isFeeding ? "Feeding" : "Ready";
  }
  get statusLine() {
    const t = [this.statusText];
    return this.config.show_last_amount && this.lastAmount !== void 0 && t.push(`Last ${ot(this.lastAmount)}`), t.join(" · ");
  }
  get stateColor() {
    return this.cardUnavailable ? this.config.off_color ?? "#778392" : this.config.accent_color ?? "#ff9f2f";
  }
  get batteryColor() {
    const t = this.batteryPercent;
    return t === void 0 ? this.config.off_color ?? "#778392" : t <= 25 ? "#ff5a4f" : t <= 55 ? "#f7b84b" : "#62e58f";
  }
  clampAmount(t) {
    const e = this.amountMin, i = this.amountMax, r = this.amountStep || 1, n = Math.round((t - e) / r) * r + e, s = Math.min(i, Math.max(e, n));
    return Number(s.toFixed(3));
  }
  adjustAmount(t) {
    if (this.cardUnavailable)
      return;
    const e = this.amount ?? this.amountMin;
    this.selectedAmount = this.clampAmount(e + t);
  }
  setPending(t) {
    window.clearTimeout(this.pendingTimer), this.pending = t, t && (this.pendingTimer = window.setTimeout(() => {
      this.pending = !1, this.selectedAmount = void 0;
    }, 2400));
  }
  clearPending() {
    window.clearTimeout(this.pendingTimer), this.pending = !1, this.selectedAmount = void 0;
  }
  feedNow() {
    var i;
    if (this.cardUnavailable || this.isFeeding || this.amount === void 0)
      return;
    const t = this.clampAmount(this.amount);
    this.setPending(!0);
    const e = (i = this.hass) == null ? void 0 : i.callService("number", "set_value", {
      entity_id: this.config.feed_entity,
      value: t
    });
    e && typeof e.then == "function" && e.then(
      () => this.clearPending(),
      () => this.clearPending()
    );
  }
  dispatchMoreInfo(t) {
    t && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  renderBattery() {
    return !this.config.show_battery || this.batteryPercent === void 0 ? d : a`
      <button
        type="button"
        class="battery"
        style="--pet-feeder-battery-color: ${this.batteryColor}"
        @click=${() => this.dispatchMoreInfo(this.config.battery_entity)}
      >
        <ha-icon icon="mdi:battery"></ha-icon>
        ${Math.round(this.batteryPercent)}%
      </button>
    `;
  }
  renderInfoStrip() {
    if (!this.config.show_details)
      return d;
    const t = [];
    return this.lastFedDisplay && t.push(a`
        <div class="info-row">
          <span class="info-label">Last fed</span>
          <span class="info-value">${this.lastFedDisplay}</span>
        </div>
      `), this.config.show_last_amount && this.lastAmount !== void 0 && t.push(a`
        <div class="info-row">
          <span class="info-label">Last amount</span>
          <span class="info-value">${ot(this.lastAmount)} portions</span>
        </div>
      `), this.config.show_battery && this.batteryPercent !== void 0 && t.push(a`
        <div class="info-row">
          <span class="info-label">Battery</span>
          <span class="info-value">${Math.round(this.batteryPercent)}%</span>
        </div>
      `), t.length ? a`<div class="info-strip">${t}</div>` : d;
  }
  render() {
    if (!this.config)
      return a``;
    const t = this.amount, e = !this.cardUnavailable && t !== void 0 && t > this.amountMin, i = !this.cardUnavailable && t !== void 0 && t < this.amountMax;
    return a`
      <ha-card
        style="
          --pet-feeder-state-color: ${this.stateColor};
          --pet-feeder-border-strength: ${this.cardUnavailable ? "13%" : "32%"};
          --pet-feeder-outer-blur: ${this.isFeeding ? "44px" : "16px"};
          --pet-feeder-outer-strength: ${this.isFeeding ? "14%" : "4%"};
          --pet-feeder-sheen-opacity: ${this.cardUnavailable ? "0.36" : "0.72"};
          --pet-feeder-ring-strength: ${this.isFeeding ? "24%" : "7%"};
          --pet-feeder-ring-opacity: ${this.cardUnavailable ? "0.35" : "1"};
        "
      >
        <div
          class="card ${this.isFeeding ? "feeding" : ""} ${this.cardUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""} ${this.config.fill_height ? "fill-height" : ""} layout-${this.config.layout ?? "auto"}"
        >
          <div class="content">
            <div class="top-group">
              <div class="head">
                <button
                  type="button"
                  class="identity"
                  @click=${() => this.dispatchMoreInfo(this.config.feed_entity)}
                >
                  <span class="icon-shell">
                    <ha-icon icon=${this.icon}></ha-icon>
                  </span>
                  <span class="title-block">
                    <span class="name">${this.displayName}</span>
                    <span class="status">
                      <span class="dot"></span>
                      ${this.statusLine}
                    </span>
                  </span>
                </button>
                ${this.renderBattery()}
              </div>

              <div class="control-stack">
                <div class="stepper">
                  <button
                    type="button"
                    class="step-button"
                    aria-label="Decrease portion"
                    ?disabled=${!e || this.isFeeding}
                    @click=${() => this.adjustAmount(-this.amountStep)}
                  >
                    <ha-icon icon="mdi:minus"></ha-icon>
                  </button>

                  <div class="dose">
                    <span class="dose-value">${ot(t)}</span>
                    <span class="dose-label">Portions</span>
                  </div>

                  <button
                    type="button"
                    class="step-button"
                    aria-label="Increase portion"
                    ?disabled=${!i || this.isFeeding}
                    @click=${() => this.adjustAmount(this.amountStep)}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon>
                  </button>
                </div>

                <button
                  type="button"
                  class="feed-button"
                  ?disabled=${this.cardUnavailable || this.isFeeding}
                  @click=${this.feedNow}
                >
                  ${this.isFeeding ? "Feeding" : "Feed now"}
                </button>
              </div>
            </div>
            ${this.renderInfoStrip()}
          </div>
        </div>
      </ha-card>
    `;
  }
};
ne.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  selectedAmount: { state: !0 },
  pending: { state: !0 }
};
let At = ne;
customElements.get("smart-pet-feeder-card") || customElements.define("smart-pet-feeder-card", At);
const oe = class oe extends u {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return m`
      .editor {
        display: grid;
        gap: 14px;
      }

      .section {
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid
          color-mix(in srgb, var(--divider-color) 72%, transparent);
        border-radius: 10px;
        display: grid;
        gap: 10px;
        padding: 12px;
      }

      .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      }

      .switch-row {
        align-items: center;
        color: var(--primary-text-color);
        display: inline-flex;
        gap: 8px;
        min-height: 34px;
      }

      ha-form,
      ha-icon-picker,
      ha-select,
      ha-textfield {
        width: 100%;
      }

      h3 {
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0;
        margin: 0;
      }
    `;
  }
  setConfig(t) {
    this.config = { ...t };
  }
  updateConfig(t) {
    const e = { ...this.config, ...t };
    Object.keys(e).forEach((i) => {
      const r = i;
      e[r] === "" && delete e[r];
    }), this.config = e, Wi(this, e);
  }
  formChanged(t) {
    var i;
    const e = t;
    (i = e.detail) != null && i.value && this.updateConfig(e.detail.value);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityForm() {
    const t = [
      {
        name: "feed_entity",
        required: !0,
        selector: { entity: { domain: "number" } }
      },
      {
        name: "feeding_entity",
        selector: { entity: { domain: "binary_sensor" } }
      },
      {
        name: "battery_entity",
        selector: { entity: { domain: "sensor" } }
      },
      {
        name: "last_amount_entity",
        selector: { entity: { domain: "sensor" } }
      },
      {
        name: "last_fed_entity",
        selector: { entity: { domain: ["sensor", "input_datetime"] } }
      }
    ], e = {
      feed_entity: "Feed Amount Entity",
      feeding_entity: "Feeding State Entity",
      battery_entity: "Battery Entity",
      last_amount_entity: "Last Amount Entity",
      last_fed_entity: "Last Fed Time Entity"
    };
    return a`
      <ha-form
        .hass=${this.hass}
        .data=${{
      feed_entity: this.config.feed_entity,
      feeding_entity: this.config.feeding_entity,
      battery_entity: this.config.battery_entity,
      last_amount_entity: this.config.last_amount_entity,
      last_fed_entity: this.config.last_fed_entity
    }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  renderTextInput(t, e, i = "") {
    return a`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderIconPicker(t, e) {
    return a`
      <ha-icon-picker
        .hass=${this.hass}
        .label=${t}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></ha-icon-picker>
    `;
  }
  renderSwitch(t, e, i) {
    return a`
      <label class="switch-row">
        <ha-switch
          .checked=${!!(this.config[e] ?? i)}
          .configValue=${e}
          @change=${this.valueChanged}
        ></ha-switch>
        <span>${t}</span>
      </label>
    `;
  }
  renderSelect(t, e, i, r) {
    return a`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(n) => n.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (n) => a`
            <mwc-list-item .value=${n}>${n}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return a`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Tommy Feeder")}
            ${this.renderTextInput("Pet Name", "pet_name", "Tommy")}
            ${this.renderIconPicker("Icon", "icon")}
            ${this.renderTextInput("Width", "width", "320px")}
            ${this.renderTextInput("Height", "height", "118px")}
            ${this.renderTextInput("Radius", "border_radius", "18px")}
            ${this.renderSelect("Layout", "layout", Hi, "auto")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Fill Height", "fill_height", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Accent Color", "accent_color", "#ff9f2f")}
            ${this.renderTextInput("Off Color", "off_color", "#778392")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show Battery", "show_battery", !0)}
            ${this.renderSwitch("Show Last Amount", "show_last_amount", !0)}
            ${this.renderSwitch("Show Details", "show_details", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>
      </div>
    `;
  }
};
oe.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Ot = oe;
customElements.get("smart-pet-feeder-card-editor") || customElements.define("smart-pet-feeder-card-editor", Ot);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "smart-pet-feeder-card",
  name: "Smart Pet Feeder Card",
  description: "A compact feeding card with portion, battery, and last-feed status."
});
//# sourceMappingURL=gamma-ha-cards.js.map
