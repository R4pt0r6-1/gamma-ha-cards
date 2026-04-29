/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = Symbol(), J = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (W && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const $t = (r) => new ht(typeof r == "string" ? r : r + "", void 0, q), ct = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new ht(e, r, q);
}, mt = (r, t) => {
  if (W) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = H.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, Y = W ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return $t(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: yt, getOwnPropertyDescriptor: vt, getOwnPropertyNames: bt, getOwnPropertySymbols: wt, getPrototypeOf: At } = Object, m = globalThis, Q = m.trustedTypes, xt = Q ? Q.emptyScript : "", I = m.reactiveElementPolyfillSupport, C = (r, t) => r, L = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? xt : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, dt = (r, t) => !_t(r, t), X = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = X) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && yt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const l = s == null ? void 0 : s.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? X;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = At(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...bt(e), ...wt(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Y(s));
    } else t !== void 0 && e.push(Y(t));
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
    return mt(t, this.constructor.elementStyles), t;
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
    var o;
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : L).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : L;
      this._$Em = s;
      const c = a.fromAttribute(e, l.type);
      this[s] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(s)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    var n;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? dt)(o, e) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, n] of s) {
        const { wrapped: l } = n, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((s) => {
        var o;
        return (o = s.hostUpdate) == null ? void 0 : o.call(s);
      }), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), I == null || I({ ReactiveElement: w }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis, G = (r) => r, N = P.trustedTypes, tt = N ? N.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, pt = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + f, Et = `<${ut}>`, b = document, T = () => b.createComment(""), O = (r) => r === null || typeof r != "object" && typeof r != "function", F = Array.isArray, St = (r) => F(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", D = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, it = />/g, _ = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, rt = /"/g, gt = /^(?:script|style|textarea|title)$/i, Ct = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), $ = Ct(1), x = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), y = b.createTreeWalker(b, 129);
function ft(r, t) {
  if (!F(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tt !== void 0 ? tt.createHTML(t) : t;
}
const Pt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let c, p, h = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, p = n.exec(a), p !== null); ) u = n.lastIndex, n === S ? p[1] === "!--" ? n = et : p[1] !== void 0 ? n = it : p[2] !== void 0 ? (gt.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = _) : p[3] !== void 0 && (n = _) : n === _ ? p[0] === ">" ? (n = s ?? S, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? _ : p[3] === '"' ? rt : st) : n === rt || n === st ? n = _ : n === et || n === it ? n = S : (n = _, s = void 0);
    const g = n === _ && r[l + 1].startsWith("/>") ? " " : "";
    o += n === S ? a + Et : h >= 0 ? (i.push(c), a.slice(0, h) + pt + a.slice(h) + f + g) : a + f + (h === -2 ? l : g);
  }
  return [ft(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [c, p] = Pt(t, e);
    if (this.el = U.createElement(c, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = y.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(pt)) {
          const u = p[n++], g = s.getAttribute(h).split(f), k = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: k[2], strings: g, ctor: k[1] === "." ? Ot : k[1] === "?" ? Ut : k[1] === "@" ? Mt : R }), s.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: o }), s.removeAttribute(h));
        if (gt.test(s.tagName)) {
          const h = s.textContent.split(f), u = h.length - 1;
          if (u > 0) {
            s.textContent = N ? N.emptyScript : "";
            for (let g = 0; g < u; g++) s.append(h[g], T()), y.nextNode(), a.push({ type: 2, index: ++o });
            s.append(h[u], T());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ut) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += f.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(r, t, e = r, i) {
  var n, l;
  if (t === x) return t;
  let s = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const o = O(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== o && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = s : e._$Cl = s), s !== void 0 && (t = E(r, s._$AS(r, t.values), s, i)), t;
}
class Tt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? b).importNode(e, !0);
    y.currentNode = s;
    let o = y.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new M(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new kt(o, this, t)), this._$AV.push(c), a = i[++l];
      }
      n !== (a == null ? void 0 : a.index) && (o = y.nextNode(), n++);
    }
    return y.currentNode = b, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = E(this, t, e), O(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(ft(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(e);
    else {
      const n = new Tt(s, this), l = n.u(this.options);
      n.p(e), this.T(l), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new M(this.O(T()), this.O(T()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const s = G(t).nextSibling;
      G(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = E(this, t, e, 0), n = !O(t) || t !== this._$AH && t !== x, n && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = E(this, l[i + a], e, a), c === x && (c = this._$AH[a]), n || (n = !O(c) || c !== this._$AH[a]), c === d ? t = d : t !== d && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ut extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Mt extends R {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? d) === x) return;
    const i = this._$AH, s = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== d && (i === d || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class kt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const z = P.litHtmlPolyfillSupport;
z == null || z(U, M), (P.litHtmlVersions ?? (P.litHtmlVersions = [])).push("3.3.2");
const Ht = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = s = new M(t.insertBefore(T(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v = globalThis;
class A extends w {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
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
    return x;
  }
}
var lt;
A._$litElement$ = !0, A.finalized = !0, (lt = v.litElementHydrateSupport) == null || lt.call(v, { LitElement: A });
const j = v.litElementPolyfillSupport;
j == null || j({ LitElement: A });
(v.litElementVersions ?? (v.litElementVersions = [])).push("4.2.2");
const nt = {
  icon: "mdi:ceiling-light",
  width: "260px",
  height: "64px",
  border_radius: "999px",
  show_state: !0,
  state_display: "state",
  on_color: "#ff8a1c",
  off_color: "#697382",
  background: "#101722",
  tap_action: "toggle",
  hold_action: "more-info",
  animated: !0
}, at = ["toggle", "more-info", "none"], Nt = ["state", "brightness", "auto"];
function Rt(r, t) {
  r.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const K = class K extends A {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return ct`
      :host {
        --glow-card-width: 260px;
        --glow-card-height: 64px;
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
            color-mix(in srgb, var(--glow-state-color) 20%, transparent),
            transparent 42%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--glow-background) 92%, #ffffff 6%),
            color-mix(in srgb, var(--glow-background) 92%, #000000 12%)
          );
        border: 1px solid
          color-mix(in srgb, var(--glow-border-color) 70%, transparent);
        border-radius: var(--glow-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 7%),
          0 12px 24px rgb(0 0 0 / 22%);
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

      .button::before {
        background:
          radial-gradient(
            circle at 22% 50%,
            color-mix(in srgb, var(--glow-state-color) 48%, transparent),
            transparent 34%
          ),
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 13%, transparent),
            transparent 72%
          );
        content: '';
        inset: 0;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
      }

      .button::after {
        border-radius: inherit;
        box-shadow:
          0 0 24px
            color-mix(in srgb, var(--glow-state-color) 48%, transparent),
          0 0 42px
            color-mix(in srgb, var(--glow-state-color) 28%, transparent);
        content: '';
        inset: -1px;
        opacity: var(--glow-on-opacity);
        pointer-events: none;
        position: absolute;
        transition: opacity 160ms ease;
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
        min-width: 0;
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
      (s) => s.startsWith("light.")
    );
    return {
      entity: i ?? ""
    };
  }
  setConfig(t) {
    if (!(t != null && t.entity))
      throw new Error("Entity is required");
    this.config = {
      ...nt,
      ...t
    }, this.style.setProperty("--glow-card-width", this.config.width ?? "260px"), this.style.setProperty("--glow-card-height", this.config.height ?? "64px"), this.style.setProperty(
      "--glow-card-radius",
      this.config.border_radius ?? "999px"
    ), this.style.setProperty("--glow-on-color", this.config.on_color ?? "#ff8a1c"), this.style.setProperty("--glow-off-color", this.config.off_color ?? "#697382"), this.style.setProperty(
      "--glow-background",
      this.config.background ?? "#101722"
    );
  }
  getCardSize() {
    return 1;
  }
  get entity() {
    var t;
    return (t = this.hass) == null ? void 0 : t.states[this.config.entity];
  }
  get isOn() {
    var t;
    return ((t = this.entity) == null ? void 0 : t.state) === "on";
  }
  get isUnavailable() {
    return !this.entity || ["unavailable", "unknown"].includes(this.entity.state);
  }
  get domain() {
    return this.config.entity.split(".")[0] ?? "light";
  }
  get brightnessPercent() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.brightness;
    if (typeof t == "number")
      return Math.round(t / 255 * 100);
  }
  get displayName() {
    var t;
    return this.config.name || ((t = this.entity) == null ? void 0 : t.attributes.friendly_name) || this.config.entity;
  }
  get displayState() {
    if (this.isUnavailable)
      return "Unavailable";
    const t = this.config.state_display ?? "state", e = this.brightnessPercent;
    return this.isOn && e !== void 0 && (t === "brightness" || t === "auto") ? `${e}%` : this.isOn ? "On" : "Off";
  }
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || nt.icon;
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
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      (e = this.hass) == null || e.callService(this.domain, "toggle", {
        entity_id: this.config.entity
      });
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
      return $``;
    const t = this.isOn ? this.config.on_color : this.config.off_color, e = this.isOn ? "1" : "0";
    return $`
      <ha-card
        style="
          --glow-state-color: ${t};
          --glow-border-color: ${t};
          --glow-icon-color: ${t};
          --glow-on-opacity: ${e};
        "
      >
        <button
          class="button ${this.isOn ? "on" : "off"} ${this.isUnavailable ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
          aria-label=${this.displayName}
          @click=${this.handleClick}
          @pointerdown=${this.handlePointerDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerUp}
        >
          <span class="icon-shell">
            <ha-icon icon=${this.icon}></ha-icon>
          </span>
          <span class="content">
            <span class="name">${this.displayName}</span>
            ${this.config.show_state ? $`<span class="state">${this.displayState}</span>` : d}
          </span>
        </button>
      </ha-card>
    `;
  }
};
K.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 }
};
let B = K;
customElements.get("glow-light-card") || customElements.define("glow-light-card", B);
const Z = class Z extends A {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return ct`
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

      paper-input,
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
      const s = i;
      e[s] === "" && delete e[s];
    }), this.config = e, Rt(this, e);
  }
  valueChanged(t) {
    const e = t.target;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : e.value
    });
  }
  renderTextInput(t, e, i = "") {
    return $`
      <paper-input
        label=${t}
        placeholder=${i}
        .value=${this.config[e] ?? ""}
        .configValue=${e}
        @value-changed=${this.valueChanged}
      ></paper-input>
    `;
  }
  renderSwitch(t, e, i) {
    return $`
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
  renderSelect(t, e, i, s) {
    return $`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? s}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => $`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return $`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Entity", "entity", "light.bar_lights")}
            ${this.renderTextInput("Name", "name", "Bar Lights")}
            ${this.renderTextInput("Icon", "icon", "mdi:ceiling-light")}
            ${this.renderTextInput("Width", "width", "260px")}
            ${this.renderTextInput("Height", "height", "64px")}
            ${this.renderTextInput("Radius", "border_radius", "999px")}
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
      Nt,
      "state"
    )}
          </div>
          <div class="grid">
            ${this.renderSwitch("Show State", "show_state", !0)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>

        <section class="section">
          <h3>Actions</h3>
          <div class="grid">
            ${this.renderSelect("Tap Action", "tap_action", at, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      at,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Z.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let V = Z;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", V);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
export {
  B as GlowLightCard
};
//# sourceMappingURL=glow-light-card.js.map
