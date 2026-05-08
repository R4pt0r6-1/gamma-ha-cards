/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, pt = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ut = Symbol(), It = /* @__PURE__ */ new WeakMap();
let ie = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (pt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = It.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && It.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pe = (n) => new ie(typeof n == "string" ? n : n + "", void 0, ut), f = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + n[o + 1], n[0]);
  return new ie(e, n, ut);
}, ue = (n, t) => {
  if (pt) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = L.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, n.appendChild(i);
  }
}, zt = pt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return pe(e);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ge, defineProperty: fe, getOwnPropertyDescriptor: me, getOwnPropertyNames: be, getOwnPropertySymbols: xe, getPrototypeOf: ve } = Object, w = globalThis, Ut = w.trustedTypes, we = Ut ? Ut.emptyScript : "", H = w.reactiveElementPolyfillSupport, A = (n, t) => n, K = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? we : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, re = (n, t) => !ge(n, t), Dt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: re };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Dt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && fe(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = me(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      o == null || o.call(this, a), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(A("elementProperties"))) return;
    const t = ve(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(A("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(A("properties"))) {
      const e = this.properties, i = [...be(e), ...xe(e)];
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
      for (const r of i) e.unshift(zt(r));
    } else t !== void 0 && e.push(zt(t));
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
    return ue(t, this.constructor.elementStyles), t;
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
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const a = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : K).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, a;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), c = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : K;
      this._$Em = r;
      const d = c.fromAttribute(e, l.type);
      this[r] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? re)(o, e) || i.useDefault && i.reflect && o === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, a] of r) {
        const { wrapped: l } = a, c = this[o];
        l !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, a, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[A("elementProperties")] = /* @__PURE__ */ new Map(), S[A("finalized")] = /* @__PURE__ */ new Map(), H == null || H({ ReactiveElement: S }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, Ft = (n) => n, R = M.trustedTypes, Nt = R ? R.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, oe = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + v, ye = `<${ne}>`, C = document, I = () => C.createComment(""), z = (n) => n === null || typeof n != "object" && typeof n != "function", gt = Array.isArray, $e = (n) => gt(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", V = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Lt = /-->/g, Rt = />/g, y = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Bt = /'/g, jt = /"/g, se = /^(?:script|style|textarea|title)$/i, _e = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), s = _e(1), T = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), Ht = /* @__PURE__ */ new WeakMap(), $ = C.createTreeWalker(C, 129);
function ae(n, t) {
  if (!gt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Nt !== void 0 ? Nt.createHTML(t) : t;
}
const ke = (n, t) => {
  const e = n.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = P;
  for (let l = 0; l < e; l++) {
    const c = n[l];
    let d, u, p = -1, m = 0;
    for (; m < c.length && (a.lastIndex = m, u = a.exec(c), u !== null); ) m = a.lastIndex, a === P ? u[1] === "!--" ? a = Lt : u[1] !== void 0 ? a = Rt : u[2] !== void 0 ? (se.test(u[2]) && (r = RegExp("</" + u[2], "g")), a = y) : u[3] !== void 0 && (a = y) : a === y ? u[0] === ">" ? (a = r ?? P, p = -1) : u[1] === void 0 ? p = -2 : (p = a.lastIndex - u[2].length, d = u[1], a = u[3] === void 0 ? y : u[3] === '"' ? jt : Bt) : a === jt || a === Bt ? a = y : a === Lt || a === Rt ? a = P : (a = y, r = void 0);
    const x = a === y && n[l + 1].startsWith("/>") ? " " : "";
    o += a === P ? c + ye : p >= 0 ? (i.push(d), c.slice(0, p) + oe + c.slice(p) + v + x) : c + v + (p === -2 ? l : x);
  }
  return [ae(n, o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const l = t.length - 1, c = this.parts, [d, u] = ke(t, e);
    if (this.el = U.createElement(d, i), $.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = $.nextNode()) !== null && c.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(oe)) {
          const m = u[a++], x = r.getAttribute(p).split(v), F = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: o, name: F[2], strings: x, ctor: F[1] === "." ? Se : F[1] === "?" ? Te : F[1] === "@" ? Oe : j }), r.removeAttribute(p);
        } else p.startsWith(v) && (c.push({ type: 6, index: o }), r.removeAttribute(p));
        if (se.test(r.tagName)) {
          const p = r.textContent.split(v), m = p.length - 1;
          if (m > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let x = 0; x < m; x++) r.append(p[x], I()), $.nextNode(), c.push({ type: 2, index: ++o });
            r.append(p[m], I());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ne) c.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(v, p + 1)) !== -1; ) c.push({ type: 7, index: o }), p += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = C.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(n, t, e = n, i) {
  var a, l;
  if (t === T) return t;
  let r = i !== void 0 ? (a = e._$Co) == null ? void 0 : a[i] : e._$Cl;
  const o = z(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), o === void 0 ? r = void 0 : (r = new o(n), r._$AT(n, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = O(n, r._$AS(n, t.values), r, i)), t;
}
class Ce {
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? C).importNode(e, !0);
    $.currentNode = r;
    let o = $.nextNode(), a = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let d;
        c.type === 2 ? d = new D(o, o.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (d = new Pe(o, this, t)), this._$AV.push(d), c = i[++l];
      }
      a !== (c == null ? void 0 : c.index) && (o = $.nextNode(), a++);
    }
    return $.currentNode = C, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class D {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = O(this, t, e), z(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : $e(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(ae(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const a = new Ce(r, this), l = a.u(this.options);
      a.p(e), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = Ht.get(t.strings);
    return e === void 0 && Ht.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    gt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new D(this.O(I()), this.O(I()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = Ft(t).nextSibling;
      Ft(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = O(this, t, e, 0), a = !z(t) || t !== this._$AH && t !== T, a && (this._$AH = t);
    else {
      const l = t;
      let c, d;
      for (t = o[0], c = 0; c < o.length - 1; c++) d = O(this, l[i + c], e, c), d === T && (d = this._$AH[c]), a || (a = !z(d) || d !== this._$AH[c]), d === h ? t = h : t !== h && (t += (d ?? "") + o[c + 1]), this._$AH[c] = d;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Se extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Te extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class Oe extends j {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? h) === T) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Pe {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const W = M.litHtmlPolyfillSupport;
W == null || W(U, D), (M.litHtmlVersions ?? (M.litHtmlVersions = [])).push("3.3.2");
const Ee = (n, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new D(t.insertBefore(I(), o), o, void 0, e ?? {});
  }
  return r._$AI(n), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _ = globalThis;
class g extends S {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ee(e, this.renderRoot, this.renderOptions);
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
    return T;
  }
}
var ee;
g._$litElement$ = !0, g.finalized = !0, (ee = _.litElementHydrateSupport) == null || ee.call(_, { LitElement: g });
const G = _.litElementPolyfillSupport;
G == null || G({ LitElement: g });
(_.litElementVersions ?? (_.litElementVersions = [])).push("4.2.2");
const Vt = {
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
}, Wt = ["toggle", "more-info", "none"], Ae = ["state", "brightness", "auto"], Me = {
  color: "Color",
  temperature: "Temp",
  effect: "Effect"
}, Ie = [
  { name: "Amber", rgb_color: [255, 146, 66] },
  { name: "Peach", rgb_color: [255, 191, 142] },
  { name: "Cream", rgb_color: [255, 225, 194] },
  { name: "White", rgb_color: [255, 255, 244] },
  { name: "Sky", rgb_color: [89, 164, 255] },
  { name: "Rose", rgb_color: [255, 112, 182] }
], Gt = [
  { name: "Warm", color_temp_kelvin: 2700 },
  { name: "Soft", color_temp_kelvin: 3200 },
  { name: "Neutral", color_temp_kelvin: 4e3 },
  { name: "Day", color_temp_kelvin: 5e3 }
];
function ze(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const bt = class bt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.isDimming = !1, this.pendingDimmerPointer = !1, this.pointerStartX = 0, this.pointerStartY = 0, this.suppressClick = !1;
  }
  static get styles() {
    return f`
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
        gap: 3px;
        grid-template-columns: 1fr;
        min-height: max(108px, var(--glow-card-height));
        padding: 5px 10px;
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
        gap: 7px;
        grid-template-columns: 26px minmax(0, 1fr) auto;
        min-height: 26px;
      }

      .panel .icon-shell {
        height: 26px;
        width: 26px;
      }

      .panel .icon-shell ha-icon {
        --mdc-icon-size: 15px;
      }

      .panel .name {
        font-size: 11px;
        font-weight: 650;
      }

      .panel .state {
        font-size: 10px;
        line-height: 1.1;
        margin-top: 1px;
      }

      .level {
        color: var(--primary-text-color, #f4f7fb);
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        min-width: 30px;
        text-align: right;
      }

      .brightness-control {
        appearance: none;
        background: rgb(255 255 255 / 10%);
        border: 1px solid rgb(255 255 255 / 11%);
        border-radius: 10px;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
        cursor: pointer;
        display: block;
        height: 12px;
        overflow: hidden;
        padding: 0;
        touch-action: pan-y;
        width: 100%;
      }

      .brightness-fill {
        background:
          linear-gradient(
            90deg,
            color-mix(in srgb, var(--glow-state-color) 70%, #ff9a52),
            #fff6eb
          );
        border-radius: inherit;
        display: block;
        height: 100%;
        width: var(--glow-slider-percent);
      }

      .mode-tabs {
        background: rgb(0 0 0 / 16%);
        border: 1px solid rgb(255 255 255 / 10%);
        border-radius: 999px;
        display: grid;
        gap: 2px;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        min-height: 19px;
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
        font-size: 9px;
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
        gap: 0;
      }

      .swatches {
        background: var(--swatch-line);
        border: 1px solid rgb(255 255 255 / 12%);
        border-radius: 999px;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 22%),
          0 8px 14px rgb(0 0 0 / 14%);
        display: grid;
        gap: 0;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        height: 24px;
        overflow: hidden;
      }

      .swatch,
      .effect-chip {
        appearance: none;
        cursor: pointer;
        font: inherit;
      }

      .swatch {
        align-items: center;
        background: transparent;
        border: 0;
        border-left: 1px solid rgb(255 255 255 / 16%);
        border-radius: 0;
        box-shadow: none;
        display: inline-flex;
        height: 100%;
        justify-content: center;
        padding: 0;
        position: relative;
      }

      .swatch:first-child {
        border-left: 0;
      }

      .swatch.active {
        background: rgb(255 255 255 / 18%);
      }

      .swatch.active::after {
        align-items: center;
        background: rgb(0 0 0 / 42%);
        border: 1px solid rgb(255 255 255 / 34%);
        border-radius: 999px;
        color: #ffffff;
        content: '✓';
        display: inline-flex;
        font-size: 10px;
        font-weight: 800;
        height: 14px;
        justify-content: center;
        line-height: 1;
        width: 14px;
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
      ...Vt,
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
    const t = (e = this.entity) == null ? void 0 : e.attributes.rgb_color;
    if (!(!Array.isArray(t) || t.length < 3))
      return t.slice(0, 3).map(
        (i) => Math.max(0, Math.min(255, Math.round(Number(i) || 0)))
      );
  }
  get currentKelvin() {
    var e;
    const t = (e = this.entity) == null ? void 0 : e.attributes.color_temp_kelvin;
    return typeof t == "number" ? t : void 0;
  }
  get colorPresets() {
    var t;
    return (t = this.config.color_presets) != null && t.length ? this.config.color_presets : Ie;
  }
  get stateColor() {
    if (!this.isOn)
      return this.config.off_color ?? "#697382";
    const t = this.currentRgb;
    return t ? this.rgbToCss(t) : this.config.on_color ?? "#ff8a1c";
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
  get icon() {
    var t;
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || Vt.icon;
  }
  rgbToCss(t) {
    return `rgb(${t[0]} ${t[1]} ${t[2]})`;
  }
  kelvinToCss(t) {
    return t <= 3e3 ? "#ffb56f" : t <= 3800 ? "#ffd9a6" : t <= 4600 ? "#fff1d6" : "#f2f7ff";
  }
  colorDistance(t, e) {
    return Math.sqrt(
      t.reduce((i, r, o) => {
        const a = r - (e[o] ?? 0);
        return i + a * a;
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
    window.clearTimeout(this.optimisticTimer), this.optimisticOn = void 0, this.optimisticBrightnessPercent = void 0;
  }
  trackServiceResult(t) {
    t && typeof t.catch == "function" && t.catch(() => this.clearOptimisticState());
  }
  performAction(t) {
    var e;
    if (!(this.isUnavailable || !t || t === "none")) {
      if (t === "more-info") {
        this.dispatchMoreInfo();
        return;
      }
      this.hasDimmer ? this.setOptimisticBrightness(
        this.isOn ? 0 : this.brightnessPercent ?? 100
      ) : this.setOptimisticOn(!this.isOn), this.trackServiceResult(
        (e = this.hass) == null ? void 0 : e.callService(this.domain, "toggle", {
          entity_id: this.config.entity
        })
      );
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
    var o;
    if (this.isUnavailable || this.domain !== "light")
      return;
    const e = this.brightnessPercent && this.brightnessPercent > 0 ? this.brightnessPercent : 100, i = typeof t.brightness_pct == "number" ? t.brightness_pct : this.isOn && this.activeBrightnessPercent || e, r = {
      entity_id: this.config.entity,
      ...t
    };
    (typeof t.brightness_pct == "number" || !this.isOn) && (r.brightness_pct = Math.max(1, i)), this.setOptimisticOn(!0, i), this.trackServiceResult((o = this.hass) == null ? void 0 : o.callService("light", "turn_on", r));
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
    return t.length <= 1 ? h : s`
      <span class="mode-tabs" aria-label="Light control modes">
        ${t.map(
      (e) => s`
            <button
              type="button"
              class="mode-tab ${e === this.activeControlMode ? "active" : ""}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(i) => this.handleControlModeClick(i, e)}
            >
              ${Me[e]}
            </button>
          `
    )}
      </span>
    `;
  }
  renderColorControls() {
    const t = this.colorPresets.filter(
      (i) => Array.isArray(i.rgb_color)
    ), e = `linear-gradient(90deg, ${t.map((i) => this.rgbToCss(i.rgb_color ?? [255, 255, 255])).join(", ")})`;
    return s`
      <span class="swatches" style="--swatch-line: ${e}" aria-label="Color presets">
        ${t.map(
      (i) => s`
            <button
              type="button"
              class="swatch ${this.isColorPresetActive(i) ? "active" : ""}"
              aria-label=${`Set ${i.name}`}
              title=${i.name}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(r) => this.handleColorPresetClick(r, i)}
            ></button>
          `
    )}
      </span>
    `;
  }
  renderTemperatureControls() {
    const t = `linear-gradient(90deg, ${Gt.map(
      (e) => this.kelvinToCss(e.color_temp_kelvin ?? 3e3)
    ).join(", ")})`;
    return s`
      <span
        class="swatches"
        style="--swatch-line: ${t}"
        aria-label="Color temperature presets"
      >
        ${Gt.map(
      (e) => s`
            <button
              type="button"
              class="swatch ${this.isTemperaturePresetActive(e) ? "active" : ""}"
              aria-label=${`Set ${e.name}`}
              title=${`${e.name} ${e.color_temp_kelvin}K`}
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(i) => this.handleTemperaturePresetClick(i, e)}
            ></button>
          `
    )}
      </span>
    `;
  }
  renderEffectControls() {
    var e;
    const t = String(((e = this.entity) == null ? void 0 : e.attributes.effect) || "");
    return s`
      <span class="effect-list" aria-label="Light effects">
        ${this.effectList.map(
      (i) => s`
            <button
              type="button"
              class="effect-chip ${i === t ? "active" : ""}"
              @pointerdown=${this.stopControlEvent}
              @pointerup=${this.stopControlEvent}
              @pointercancel=${this.stopControlEvent}
              @click=${(r) => this.handleEffectClick(r, i)}
            >
              ${i}
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
        return h;
    }
  }
  renderCompactButton() {
    return s`
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
          ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
        </span>
      </button>
    `;
  }
  renderLightPanel() {
    return s`
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="level">${this.activeBrightnessPercent}%</span>
        </span>
        ${this.hasDimmer ? s`
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
            ` : h}
        ${this.renderControlTabs()}
        <span class="control-panel">${this.renderActiveControls()}</span>
      </div>
    `;
  }
  render() {
    if (!this.config)
      return s``;
    const t = this.stateColor, e = this.isOn ? "1" : "0", i = this.hasDimmer ? `${this.activeBrightnessPercent}%` : "0%", r = this.hasDimmer && this.activeBrightnessPercent > 0 ? "1" : "0", o = this.hasDimmer && this.activeBrightnessPercent > 5 ? "1" : "0";
    return s`
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
          --glow-slider-handle-opacity: ${o};
        "
      >
        ${this.hasLightControls ? this.renderLightPanel() : this.renderCompactButton()}
      </ha-card>
    `;
  }
};
bt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  dimmingPercent: { state: !0 },
  controlMode: { state: !0 },
  optimisticOn: { state: !0 },
  optimisticBrightnessPercent: { state: !0 }
};
let J = bt;
customElements.get("glow-light-card") || customElements.define("glow-light-card", J);
const xt = class xt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, ze(this, e);
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
  renderEntityPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
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
        selector: { entity: { domain: "light" } }
      }
    ], e = {
      entity: "Light Entity"
    };
    return s`
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
    return s`
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
      Ae,
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
            ${this.renderSelect("Tap Action", "tap_action", Wt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Wt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
xt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let X = xt;
customElements.get("glow-light-card-editor") || customElements.define("glow-light-card-editor", X);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-light-card",
  name: "Glow Light Card",
  description: "A compact glowing light card for Home Assistant."
});
const qt = {
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
}, Kt = ["toggle", "more-info", "none"];
function Ue(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const vt = class vt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return f`
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
      ...qt,
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
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || qt.icon;
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
      return s``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return s`
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
vt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticOn: { state: !0 }
};
let Y = vt;
customElements.get("glow-switch-card") || customElements.define("glow-switch-card", Y);
const wt = class wt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, Ue(this, e);
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
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
    return s`
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
    return s`
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
            ${this.renderSelect("Tap Action", "tap_action", Kt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Kt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
wt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let Z = wt;
customElements.get("glow-switch-card-editor") || customElements.define("glow-switch-card-editor", Z);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-switch-card",
  name: "Glow Switch Card",
  description: "A compact glowing switch card for Home Assistant."
});
const De = {
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
}, Jt = ["toggle", "lock", "unlock", "more-info", "none"];
function Fe(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const yt = class yt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1;
  }
  static get styles() {
    return f`
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
      ...De,
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
      return s``;
    const t = this.isUnavailable ? this.config.off_color ?? "#697382" : this.isJammed ? this.config.jammed_color ?? "#ff3b30" : this.isPending ? this.config.pending_color ?? "#ff8a1c" : this.isLocked ? this.config.locked_color ?? "#45d158" : this.config.unlocked_color ?? "#ff3b30", e = this.isUnavailable ? "0" : "1", i = this.isPending ? "pending" : this.isLocked ? "locked" : this.isJammed ? "jammed" : "unlocked";
    return s`
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="status-dot"></span>
        </button>
      </ha-card>
    `;
  }
};
yt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLocked: { state: !0 },
  optimisticState: { state: !0 }
};
let Q = yt;
customElements.get("glow-lock-card") || customElements.define("glow-lock-card", Q);
const $t = class $t extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, Fe(this, e);
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
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
            ${this.renderSelect("Tap Action", "tap_action", Jt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Jt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
$t.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let tt = $t;
customElements.get("glow-lock-card-editor") || customElements.define("glow-lock-card-editor", tt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-lock-card",
  name: "Glow Lock Card",
  description: "A compact smart lock card with instant locked and unlocked states."
});
const Ne = {
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
}, Xt = ["more-info", "none"], Yt = {
  auto: "Auto",
  cool: "Cool",
  dry: "Dry",
  fan_only: "Fan",
  heat: "Heat",
  heat_cool: "Auto",
  off: "Off"
};
function Le(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function N(n, t) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string") {
    const e = Number(n);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
function Re(n, t, e) {
  const i = (n == null ? void 0 : n.trim()) || t, r = /^(\d+(?:\.\d+)?)px$/.exec(i);
  return r ? `${Math.max(e, Number(r[1]))}px` : i === "auto" || i === "initial" || i === "inherit" ? t : `max(${e}px, ${i})`;
}
const _t = class _t extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledControlPointer = !1;
  }
  static get styles() {
    return f`
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
      ...Ne,
      ...t,
      temperature_step: N(t.temperature_step, 1)
    }, this.style.setProperty(
      "--thermostat-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "320px"
    ), this.style.setProperty(
      "--thermostat-card-height",
      Re(t.height, "auto", 0)
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
    return Array.isArray(t) ? t.filter((i) => typeof i == "string").filter((i, r, o) => o.indexOf(i) === r) : [];
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
    return N((t = this.entity) == null ? void 0 : t.attributes.min_temp, 55);
  }
  get maxTemperature() {
    var t;
    return N((t = this.entity) == null ? void 0 : t.attributes.max_temp, 85);
  }
  get targetTemperature() {
    var r, o, a;
    if (this.optimisticTemperature !== void 0)
      return this.optimisticTemperature;
    const t = (r = this.entity) == null ? void 0 : r.attributes.temperature;
    if (typeof t == "number")
      return t;
    const e = (o = this.entity) == null ? void 0 : o.attributes.target_temp_low, i = (a = this.entity) == null ? void 0 : a.attributes.target_temp_high;
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
    var o;
    if (this.isUnavailable || this.isOff)
      return;
    const e = this.minTemperature, i = this.maxTemperature, r = Math.min(i, Math.max(e, t));
    this.setOptimisticTemperature(r), this.trackServiceResult(
      (o = this.hass) == null ? void 0 : o.callService("climate", "set_temperature", {
        entity_id: this.config.entity,
        temperature: r
      })
    );
  }
  adjustTemperature(t) {
    const e = N(this.config.temperature_step, 1);
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
    const i = t.map((o) => String(o)), r = Math.max(0, i.indexOf(e ?? i[0]));
    return i[(r + 1) % i.length];
  }
  renderOffFeature() {
    var e;
    const t = ((e = this.entity) == null ? void 0 : e.state) === "off";
    return s`
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
  renderClimateSelect(t, e, i, r, o, a) {
    if (!Array.isArray(r) || r.length === 0)
      return h;
    const l = i ?? String(r[0]);
    return s`
      <button
        class="feature-button ${l !== "off" ? "on" : ""}"
        ?disabled=${this.isUnavailable}
        title=${`${t}: ${l}`}
        aria-label=${`${t}: ${l}. Tap to change.`}
        @click=${(c) => {
      c.stopPropagation();
      const d = this.nextOption(r, l);
      d && this.setClimateMode(a, o, d);
    }}
      >
        <ha-icon class="feature-icon" .icon=${e}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${l}</span>
      </button>
    `;
  }
  renderSelectEntity(t, e, i) {
    const r = this.getFeatureEntity(i);
    return !r || !Array.isArray(r.attributes.options) ? h : s`
      <button
        class="feature-button ${r.state !== "Off" && r.state !== "off" && r.state !== "Unknown" ? "on" : ""}"
        ?disabled=${["unavailable", "unknown"].includes(r.state)}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}. Tap to change.`}
        @click=${(o) => {
      o.stopPropagation();
      const a = this.nextOption(r.attributes.options, r.state);
      a && this.selectFeatureOption(r.entity_id, a);
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
      return h;
    const o = ["unavailable", "unknown"].includes(r.state), a = r.state === "on", l = r.attributes.device_class === "problem" && r.state === "on";
    return s`
      <button
        class="feature-button ${a ? "on" : ""} ${l ? "problem" : ""} ${o ? "unavailable" : ""}"
        ?disabled=${o || r.entity_id.startsWith("binary_sensor.")}
        title=${`${t}: ${r.state}`}
        aria-label=${`${t}: ${r.state}`}
        @click=${(c) => {
      c.stopPropagation(), this.toggleFeatureEntity(r.entity_id);
    }}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${a ? "on" : "off"}</span>
      </button>
    `;
  }
  renderSensorFeature(t, e, i) {
    const r = this.getFeatureEntity(e);
    if (!r)
      return h;
    const o = ["unavailable", "unknown"].includes(r.state), a = r.attributes.device_class === "problem" && r.state === "on", l = r.attributes.unit_of_measurement ? ` ${r.attributes.unit_of_measurement}` : "";
    return s`
      <span
        class="feature-status ${a ? "problem" : ""} ${o ? "unavailable" : ""}"
        title=${`${t}: ${r.state}${l}`}
        aria-label=${`${t}: ${r.state}${l}`}
      >
        <ha-icon class="feature-icon" .icon=${r.attributes.icon || i}></ha-icon>
        <span class="feature-label">${t}</span>
        <span class="feature-value">${r.state}${l}</span>
      </span>
    `;
  }
  renderFeatures() {
    var o, a;
    if (!this.config.show_features || !this.hasConfiguredFeatures)
      return h;
    const t = ((o = this.entity) == null ? void 0 : o.attributes) ?? {}, e = this.hasPrimaryModeButtons, i = [], r = (l) => {
      l !== h && i.length < 4 && i.push(l);
    };
    return this.config.show_hvac_modes && !e && r(
      this.renderClimateSelect(
        "Mode",
        "mdi:tune-variant",
        (a = this.entity) == null ? void 0 : a.state,
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
    ), r(this.renderToggleFeature("Sound", this.config.sound_switch_entity, "mdi:volume-high")), i.length === 0 ? h : s`<span class="features">${i}</span>`;
  }
  renderModeButtons() {
    const t = this.availableModes;
    return t.length ? s`
      <span class="mode-controls" aria-label="HVAC mode controls">
        ${t.map(
      (e) => s`
            <button
              class="mode-button ${e === this.hvacMode ? "active" : ""}"
              ?disabled=${this.isUnavailable}
              aria-label=${`Set mode to ${Yt[e] ?? e}`}
              @click=${(i) => this.handleModeClick(i, e)}
            >
              ${Yt[e] ?? e}
            </button>
          `
    )}
      </span>
    ` : h;
  }
  renderControls() {
    return s`
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
      return s``;
    const t = this.stateColor, e = !this.isOff && !this.isUnavailable, i = e ? "1" : "0", r = this.isCooling;
    return s`
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          <span class="dial">
            <span class="dial-center">
              <span class="mode">${this.modeLabel}</span>
              <span class="target">
                <span>${this.formatTemperatureValue(this.targetTemperature)}</span>
                <span class="unit">${this.unit}</span>
              </span>
              ${this.config.show_current ? s`<span class="current">${this.currentLabel}</span>` : h}
            </span>
          </span>
          ${this.config.show_controls ? this.renderControls() : h}
          ${this.config.show_mode_buttons ? this.renderModeButtons() : h}
          ${this.renderFeatures()}
        </div>
      </ha-card>
    `;
  }
};
_t.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticMode: { state: !0 },
  optimisticTemperature: { state: !0 }
};
let et = _t;
customElements.get("glow-thermostat-card") || customElements.define("glow-thermostat-card", et);
const kt = class kt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, Le(this, e);
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
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
            ${this.renderSelect("Tap Action", "tap_action", Xt, "more-info")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Xt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
kt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let it = kt;
customElements.get("glow-thermostat-card-editor") || customElements.define("glow-thermostat-card-editor", it);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "glow-thermostat-card",
  name: "Glow Thermostat Card",
  description: "A dial-style thermostat card with instant setpoint controls."
});
const Zt = {
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
}, Qt = ["toggle", "more-info", "none"], Be = ["duplex", "grid", "stack"];
function je(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
const Ct = class Ct extends g {
  constructor() {
    super(...arguments), this.optimisticTimers = {}, this.optimisticStates = {}, this.holdActive = !1;
  }
  static get styles() {
    return f`
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
      ...Zt,
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
    return t.icon || (e == null ? void 0 : e.attributes.icon) || Zt.icon_1;
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
    const e = this.getEntity(t.entityId), i = this.isOn(e, t.entityId), r = this.isUnavailable(e), o = i ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", a = i ? "1" : "0";
    return s`
      <button
        class="outlet ${i ? "on" : "off"} ${r ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${o};
          --outlet-warm-color: ${i ? "color-mix(in srgb, " + o + " 86%, #ff9a64)" : o};
          --outlet-hot-color: ${i ? "color-mix(in srgb, " + o + " 80%, #ff1d1d)" : o};
          --outlet-on-opacity: ${a};
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
          ${this.config.show_state ? s`<span class="state"
                >${this.displayState(e, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplexOutlet(t, e) {
    const i = this.getEntity(t.entityId), r = this.isOn(i, t.entityId), o = this.isUnavailable(i), a = r ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382", l = r ? "1" : "0";
    return s`
      <button
        class="duplex-outlet ${e} ${r ? "on" : "off"} ${o ? "unavailable" : ""} ${this.config.animated ? "animated" : ""}"
        style="
          --outlet-state-color: ${a};
          --outlet-warm-color: ${r ? "color-mix(in srgb, " + a + " 86%, #ff9a64)" : a};
          --outlet-hot-color: ${r ? "color-mix(in srgb, " + a + " 80%, #ff1d1d)" : a};
          --outlet-on-opacity: ${l};
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
          ${this.config.show_state ? s`<span class="state"
                >${this.displayState(i, t.entityId)}</span
              >` : h}
        </span>
        <span class="status-light"></span>
      </button>
    `;
  }
  renderDuplex() {
    const t = this.anyOutletOn, e = t ? this.config.on_color ?? "#ff3b30" : this.config.off_color ?? "#697382";
    return s`
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
      (i, r) => s`
            ${r > 0 ? s`<span class="duplex-divider"></span>` : h}
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
      return s``;
    const t = this.config.layout ?? "duplex";
    return s`
      <ha-card>
        <div class="card">
          ${this.config.show_title ? s`
                <div class="title">
                  <span>${this.config.title}</span>
                </div>
              ` : h}
          ${t === "duplex" ? this.renderDuplex() : s`
                <div class="outlets layout-${t}">
                  ${this.outlets.map((e) => this.renderOutlet(e))}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
Ct.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticStates: { state: !0 }
};
let rt = Ct;
customElements.get("dual-outlet-card") || customElements.define("dual-outlet-card", rt);
const St = class St extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, je(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
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
            ${this.renderSelect("Layout", "layout", Be, "duplex")}
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
            ${this.renderSelect("Tap Action", "tap_action", Qt, "toggle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Qt,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
St.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let ot = St;
customElements.get("dual-outlet-card-editor") || customElements.define("dual-outlet-card-editor", ot);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "dual-outlet-card",
  name: "Dual Outlet Card",
  description: "A two-outlet toggle card with red on-state glow."
});
const te = {
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
}, He = ["cycle", "more-info", "none"], Ve = ["more-info", "none"];
function We(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function E(n, t) {
  if (typeof n == "number" && Number.isFinite(n))
    return n;
  if (typeof n == "string") {
    const e = Number(n);
    if (Number.isFinite(e))
      return e;
  }
  return t;
}
const Tt = class Tt extends g {
  constructor() {
    super(...arguments), this.holdActive = !1, this.handledSpeedPointer = !1;
  }
  static get styles() {
    return f`
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
      ...te,
      ...t,
      speed_1_percentage: E(t.speed_1_percentage, 33),
      speed_2_percentage: E(t.speed_2_percentage, 66),
      speed_3_percentage: E(t.speed_3_percentage, 100)
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
    return this.optimisticLevel !== void 0 ? this.optimisticLevel === 0 ? 0 : this.percentageForLevel(this.optimisticLevel) : this.isOn ? E((t = this.entity) == null ? void 0 : t.attributes.percentage, 100) : 0;
  }
  get entityPercentage() {
    var t, e;
    return ((t = this.entity) == null ? void 0 : t.state) !== "on" ? 0 : E((e = this.entity) == null ? void 0 : e.attributes.percentage, 100);
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
    return this.config.icon || ((t = this.entity) == null ? void 0 : t.attributes.icon) || te.icon;
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
    return s`
      <div class="speed-buttons" aria-label="Fan speed">
        ${t.map(
      (e) => s`
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
      return s``;
    const t = this.isOn ? this.config.on_color ?? "#45d158" : this.config.off_color ?? "#697382", e = this.isOn ? "1" : "0";
    return s`
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
            ${this.config.show_state ? s`<span class="state">${this.displayState}</span>` : h}
          </span>
          ${this.config.show_speed_buttons ? this.renderSpeedButtons() : h}
        </div>
      </ha-card>
    `;
  }
};
Tt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  holdActive: { state: !0 },
  optimisticLevel: { state: !0 }
};
let nt = Tt;
customElements.get("speed-fan-card") || customElements.define("speed-fan-card", nt);
const Ot = class Ot extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, We(this, e);
  }
  valueChanged(t) {
    var r;
    const e = t.target, i = t;
    e.configValue && this.updateConfig({
      [e.configValue]: e.checked !== void 0 ? e.checked : ((r = i.detail) == null ? void 0 : r.value) ?? e.value
    });
  }
  renderEntityPicker(t, e) {
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
          `
    )}
      </ha-select>
    `;
  }
  render() {
    return s`
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
            ${this.renderSelect("Tap Action", "tap_action", He, "cycle")}
            ${this.renderSelect(
      "Hold Action",
      "hold_action",
      Ve,
      "more-info"
    )}
          </div>
        </section>
      </div>
    `;
  }
};
Ot.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let st = Ot;
customElements.get("speed-fan-card-editor") || customElements.define("speed-fan-card-editor", st);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "speed-fan-card",
  name: "Speed Fan Card",
  description: "A compact fan card with off, 1, 2, and 3 speed controls."
});
const Ge = {
  kind: "washer",
  width: "100%",
  fill_container: !0,
  border_radius: "14px",
  background: "#101722",
  paused_color: "#ff8a1c",
  error_color: "#ff3b5c",
  off_color: "#697382",
  show_details: !1,
  animated: !0
}, qe = ["washer", "dryer"], Ke = /* @__PURE__ */ new Set([
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
]), Je = /* @__PURE__ */ new Set(["end"]), Xe = /* @__PURE__ */ new Set(["pause", "reserved", "rinse_hold"]), Ye = /* @__PURE__ */ new Set(["power_off", "initial"]), Ze = /* @__PURE__ */ new Set(["error"]);
function Qe(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function b(n) {
  return !n || ["unavailable", "unknown"].includes(n.state);
}
function B(n) {
  return !n || n === "unknown" || n === "unavailable" ? "Unknown" : n.replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase());
}
function k(n) {
  if (n === void 0 || n < 0)
    return "--";
  const t = Math.ceil(n), e = Math.floor(t / 60), i = t % 60;
  return e <= 0 ? `${i}m` : i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function at(n) {
  if (b(n))
    return "Unknown";
  if ((n == null ? void 0 : n.attributes.device_class) === "timestamp") {
    const o = ft(n.state);
    if (o)
      return o.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      });
  }
  if ((n == null ? void 0 : n.attributes.device_class) === "duration")
    return k(
      mt(n.state, n.attributes.unit_of_measurement)
    );
  const t = n == null ? void 0 : n.attributes.unit_of_measurement, i = (n == null ? void 0 : n.attributes.event_type) || (n == null ? void 0 : n.state) || "", r = B(i);
  return t ? `${r} ${t}` : r;
}
function ft(n) {
  const t = n.trim();
  if (!/^\d{4}-\d{2}-\d{2}(T|\s)/.test(t))
    return;
  const e = new Date(t);
  if (!Number.isNaN(e.getTime()))
    return e;
}
function ti(n) {
  const t = ft(n);
  if (t)
    return Math.max(0, (t.getTime() - Date.now()) / 6e4);
}
function ei(n, t) {
  const e = t == null ? void 0 : t.trim().toLowerCase();
  return ["ms", "millisecond", "milliseconds"].includes(e ?? "") ? n / 6e4 : ["s", "sec", "secs", "second", "seconds"].includes(e ?? "") ? n / 60 : ["h", "hr", "hrs", "hour", "hours"].includes(e ?? "") ? n * 60 : n;
}
function mt(n, t) {
  const e = String(n ?? "").trim();
  if (!e || ["unknown", "unavailable"].includes(e))
    return;
  const i = Number(e);
  if (Number.isFinite(i))
    return ei(i, t);
  const r = e.match(
    /^P(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)$/i
  );
  if (r) {
    const l = Number(r[1] ?? 0), c = Number(r[2] ?? 0), d = Number(r[3] ?? 0);
    return l * 60 + c + d / 60;
  }
  const o = e.match(/^(\d+):([0-5]\d)(?::([0-5]\d))?$/);
  if (o) {
    const l = Number(o[1]), c = Number(o[2]), d = o[3] ? Number(o[3]) : void 0;
    return d !== void 0 ? l * 60 + c + d / 60 : l > 12 ? l + c / 60 : l * 60 + c;
  }
  const a = e.match(
    /^(?:(\d+(?:\.\d+)?)\s*h(?:ours?|rs?)?)?\s*(?:(\d+(?:\.\d+)?)\s*m(?:in(?:ute)?s?)?)?\s*(?:(\d+(?:\.\d+)?)\s*s(?:ec(?:ond)?s?)?)?$/i
  );
  if (a != null && a[1] || a != null && a[2] || a != null && a[3]) {
    const l = Number(a[1] ?? 0), c = Number(a[2] ?? 0), d = Number(a[3] ?? 0);
    return l * 60 + c + d / 60;
  }
}
function le(n) {
  if (!b(n))
    return mt(n == null ? void 0 : n.state, n == null ? void 0 : n.attributes.unit_of_measurement);
}
function ce(n) {
  if (!b(n))
    return ti((n == null ? void 0 : n.state) ?? "") ?? mt(n == null ? void 0 : n.state, n == null ? void 0 : n.attributes.unit_of_measurement);
}
const Pt = class Pt extends g {
  constructor() {
    super(...arguments), this.detailsOpen = !1;
  }
  static get styles() {
    return f`
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
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-background) 94%, #ffffff 4%),
            var(--laundry-background)
          );
        border: 1px solid rgb(255 255 255 / 6%);
        border-left: 3px solid
          color-mix(in srgb, var(--laundry-accent-color) 78%, transparent);
        border-radius: var(--laundry-card-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 4%),
          0 2px 6px rgb(0 0 0 / 16%);
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
        flex: 0 1 auto;
        gap: 1px;
        justify-items: end;
        max-width: 55%;
        min-width: 0;
        text-align: right;
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

      .controls {
        display: grid;
        gap: 5px;
        grid-template-columns: repeat(4, minmax(0, 1fr));
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
      (o) => o.startsWith("sensor.") && (o.includes("washer_current_status") || o.includes("dryer_current_status"))
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
      ...Ge,
      ...t
    }, this.detailsOpen = !!this.config.show_details, this.style.setProperty(
      "--laundry-card-width",
      this.config.fill_container ? "100%" : this.config.width ?? "100%"
    ), this.style.setProperty(
      "--laundry-card-radius",
      this.config.border_radius ?? "14px"
    ), this.style.setProperty("--laundry-background", this.config.background ?? "#101722");
  }
  getCardSize() {
    return this.detailsOpen ? 6 : 4;
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
    return b(this.statusEntity) ? "Unavailable" : this.rawStatus === "end" ? "Complete" : B(this.rawStatus);
  }
  get stateGroup() {
    var e, i;
    const t = this.rawStatus;
    return Ze.has(t) || (e = this.entity(this.config.error_entity)) != null && e.attributes.event_type ? "error" : Ke.has(t) ? "running" : Je.has(t) ? "complete" : Xe.has(t) ? "paused" : (Ye.has(t) || ((i = this.entity(this.config.power_entity)) == null ? void 0 : i.state) === "off", "off");
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
    return ce(this.entity(this.config.remaining_time_entity));
  }
  get totalMinutes() {
    return le(this.entity(this.config.total_time_entity));
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
    return this.stateGroup === "complete" ? "Done" : this.stateGroup === "off" ? "--" : k(this.remainingMinutes);
  }
  get timeSubtext() {
    const t = this.entity(this.config.remaining_time_entity);
    if (this.stateGroup === "complete")
      return "Cycle complete";
    if (this.stateGroup === "off") {
      const e = k(this.totalMinutes);
      return e === "--" ? "Ready for next cycle" : `${e} default cycle`;
    }
    if (!b(t) && t) {
      const e = ft(t.state);
      if (e)
        return `Finishes around ${e.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        })}`;
      const i = this.remainingMinutes;
      if (i !== void 0)
        return `${k(i)} remaining`;
    }
    return "Waiting for LG update";
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
    if (this.setOptimisticOperation(t ? "initial" : "power_off"), this.config.power_entity && !b(e)) {
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
  toggleDetails() {
    this.detailsOpen = !this.detailsOpen;
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
    return [...new Set(t)];
  }
  renderImage() {
    const t = this.config.image ?? `/hacsfiles/gamma-ha-cards/assets/laundry-${this.kind}.svg`;
    return s`
      <img
        class="appliance-image"
        alt=${this.displayName}
        src=${t}
        loading="lazy"
      />
    `;
  }
  renderStat(t, e) {
    const i = this.entity(e);
    return s`
      <div class="stat">
        <span class="stat-label">${t}</span>
        <span class="stat-value">${at(i)}</span>
      </div>
    `;
  }
  renderControl(t, e, i, r, o = "") {
    return s`
      <button
        type="button"
        class="control ${o}"
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
    const e = this.entity(t), i = (e == null ? void 0 : e.attributes.options) ?? [], r = t.startsWith("select.");
    return s`
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
            <span class="detail-state">${at(e)}</span>
          </span>
        </button>
        ${i.length ? s`
              <div class="chips">
                ${i.map(
      (o) => s`
                    <button
                      type="button"
                      class="chip ${(e == null ? void 0 : e.state) === o ? "active" : ""}"
                      @click=${(a) => {
        var l;
        a.stopPropagation(), r && ((l = this.hass) == null || l.callService("select", "select_option", {
          entity_id: t,
          option: o
        }));
      }}
                    >
                      ${B(o)}
                    </button>
                  `
    )}
              </div>
            ` : h}
      </div>
    `;
  }
  render() {
    if (!this.config)
      return s``;
    const t = this.entity(this.config.power_entity), e = this.entity(this.config.operation_entity), i = this.stateGroup === "running", r = this.stateGroup === "running" || this.stateGroup === "paused", o = !!(this.config.power_entity && t), a = !e || e.state === "unavailable", l = a || !this.canCallOperation("start") || !this.isRemoteStartReady() || i, c = a || !this.canCallOperation("stop") || !r, d = o ? b(t) || (t == null ? void 0 : t.state) === "on" : !this.canCallOperation("power_on"), u = o ? b(t) || (t == null ? void 0 : t.state) === "off" : !this.canCallOperation("power_off"), p = this.kindContrastColor;
    return s`
      <ha-card>
        <article
          class="laundry-card ${this.config.animated ? "animated" : ""}"
          style="
            --laundry-state-color: ${this.stateColor};
            --laundry-contrast-color: ${p};
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
            <div class="time-block">
              <span class="time-value">${this.timeDisplay}</span>
              <span class="time-subtext">${this.timeSubtext}</span>
            </div>
          </header>

          <div class="progress" aria-hidden="true">
            <div class="progress-bar"></div>
          </div>

          <div class="stats">
            ${this.renderStat("Total", this.config.total_time_entity)}
            ${this.renderStat("Remote", this.config.remote_start_entity)}
            ${this.renderStat("Energy", this.config.energy_entity)}
          </div>

          <div class="controls">
            ${this.renderControl(
      "Power",
      "mdi:power",
      () => this.setPower(!0),
      d
    )}
            ${this.renderControl(
      "Start",
      "mdi:play",
      () => this.callOperation("start"),
      l,
      "primary"
    )}
            ${this.renderControl(
      "Stop",
      "mdi:stop",
      () => this.callOperation("stop"),
      c
    )}
            ${this.renderControl(
      "Off",
      "mdi:power-standby",
      () => this.setPower(!1),
      u,
      "warning"
    )}
          </div>

          ${this.detailsOpen ? s`
                <section class="details">
                  <div class="detail-header">
                    <span class="detail-title">Available settings</span>
                    <button
                      type="button"
                      class="details-close"
                      aria-label="Close settings"
                      title="Close settings"
                      @click=${this.toggleDetails}
                    >
                      <ha-icon icon="mdi:chevron-up"></ha-icon>
                      <span>Close</span>
                    </button>
                  </div>
                  <div class="detail-grid">
                    ${this.configuredDetailEntities().map(
      (m) => this.renderDetailEntity(m)
    )}
                  </div>
                </section>
              ` : h}
        </article>
      </ha-card>
    `;
  }
};
Pt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  detailsOpen: { state: !0 },
  optimisticOperation: { state: !0 }
};
let lt = Pt;
customElements.get("lg-laundry-card") || customElements.define("lg-laundry-card", lt);
const Et = class Et extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
    }), this.config = e, Qe(this, e);
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
    return s`
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
    return s`
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
    return s`
      <ha-select
        .label=${t}
        .value=${this.config[e] ?? r}
        .configValue=${e}
        @selected=${this.valueChanged}
        @closed=${(o) => o.stopPropagation()}
        fixedMenuPosition
        naturalMenuWidth
      >
        ${i.map(
      (o) => s`
            <mwc-list-item .value=${o}>${o}</mwc-list-item>
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
      detail_entities: "Extra Detail Entities"
    };
    return s`
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
      detail_entities: this.config.detail_entities
    }}
        .schema=${t}
        .computeLabel=${(i) => e[i.name] ?? i.name}
        @value-changed=${this.formChanged}
      ></ha-form>
    `;
  }
  render() {
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          ${this.renderEntityForm()}
          <div class="grid">
            ${this.renderTextInput("Name", "name", "Washer")}
            ${this.renderSelect("Kind", "kind", qe, "washer")}
            ${this.renderTextInput("Image URL", "image", "/hacsfiles/gamma-ha-cards/assets/laundry-washer.svg")}
          </div>
        </section>

        <section class="section">
          <h3>Style</h3>
          <div class="grid">
            ${this.renderTextInput("Width", "width", "100%")}
            ${this.renderTextInput("Radius", "border_radius", "14px")}
            ${this.renderTextInput("Background", "background", "#101722")}
            ${this.renderTextInput("Running Color", "running_color", "washer #2f8cff, dryer #ff5a2f")}
            ${this.renderTextInput("Complete Color", "complete_color", "washer #2f8cff, dryer #ff5a2f")}
            ${this.renderTextInput("Paused Color", "paused_color", "#ff8a1c")}
            ${this.renderTextInput("Error Color", "error_color", "#ff3b5c")}
            ${this.renderTextInput("Off Color", "off_color", "#697382")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !0)}
            ${this.renderSwitch("Show Details Open", "show_details", !1)}
            ${this.renderSwitch("Animated Glow", "animated", !0)}
          </div>
        </section>
      </div>
    `;
  }
};
Et.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let ct = Et;
customElements.get("lg-laundry-card-editor") || customElements.define("lg-laundry-card-editor", ct);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "lg-laundry-card",
  name: "LG Laundry Card",
  description: "A polished LG ThinQ washer and dryer dashboard card."
});
const he = {
  name: "Laundry",
  width: "420px",
  fill_container: !1,
  border_radius: "14px",
  background: "#101722",
  show_controls: !0,
  show_stats: !0,
  animated: !0
}, ii = /* @__PURE__ */ new Set([
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
]), ri = /* @__PURE__ */ new Set(["end"]), oi = /* @__PURE__ */ new Set(["pause", "reserved", "rinse_hold"]), ni = /* @__PURE__ */ new Set(["power_off", "initial"]), si = /* @__PURE__ */ new Set(["error"]);
function ai(n, t) {
  n.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: t },
      bubbles: !0,
      composed: !0
    })
  );
}
function q(n) {
  return n === "dryer" ? "#ff5a2f" : "#2f8cff";
}
function li(n) {
  return n === "dryer" ? "#ff9a1f" : "#4ad7ff";
}
function de(n) {
  return `/hacsfiles/gamma-ha-cards/assets/laundry-${n}.svg`;
}
const At = class At extends g {
  constructor() {
    super(...arguments), this.optimisticOperations = {}, this.optimisticTimers = {};
  }
  static get styles() {
    return f`
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
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--laundry-pair-background) 94%, #ffffff 4%),
            var(--laundry-pair-background)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-radius: var(--laundry-pair-radius);
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 5%),
          0 3px 10px rgb(0 0 0 / 16%);
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
        color: var(--primary-text-color, #f4f7fb);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .pair-badge {
        color: var(--secondary-text-color, #9aa3b1);
        flex: 0 0 auto;
        font-size: 10px;
      }

      .machines {
        display: grid;
        gap: 8px;
      }

      .machine {
        background:
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--machine-accent-color) 7%, rgb(255 255 255 / 4%)),
            rgb(255 255 255 / 3%)
          );
        border: 1px solid rgb(255 255 255 / 7%);
        border-left: 3px solid
          color-mix(in srgb, var(--machine-accent-color) 78%, transparent);
        border-radius: 11px;
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
      .stats,
      .controls {
        position: relative;
        z-index: 1;
      }

      .machine-head {
        align-items: center;
        display: grid;
        gap: 8px;
        grid-template-columns: 34px minmax(0, 1fr) minmax(58px, auto);
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
        max-width: 96px;
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
        grid-template-columns: repeat(4, minmax(0, 1fr));
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
          grid-template-columns: 32px minmax(0, 1fr) minmax(52px, auto);
        }

        .image-wrap {
          height: 32px;
          width: 32px;
        }

        .time-value {
          font-size: 18px;
        }

        .time-subtext {
          max-width: 72px;
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

        .machine-head {
          grid-template-columns: 32px minmax(0, 1fr);
        }

        .time {
          grid-column: 1 / -1;
          justify-items: start;
          text-align: left;
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
      (o) => o.startsWith("sensor.") && o.includes("washer_current_status")
    ), r = e.find(
      (o) => o.startsWith("sensor.") && o.includes("dryer_current_status")
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
      ...he,
      ...t,
      washer: {
        name: "Washer",
        ...t.washer
      },
      dryer: {
        name: "Dryer",
        ...t.dryer
      }
    }, this.style.setProperty(
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
    return this.config.show_stats === !1 ? 5 : 6;
  }
  getGridOptions() {
    return {
      rows: "auto",
      columns: 5,
      min_rows: 5,
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
    if (b(this.entity(e.entity)))
      return "Unavailable";
    const i = this.rawStatus(t, e);
    return i === "end" ? "Complete" : B(i);
  }
  stateGroup(t, e) {
    var r, o;
    const i = this.rawStatus(t, e);
    return si.has(i) || (r = this.entity(e.error_entity)) != null && r.attributes.event_type ? "error" : ii.has(i) ? "running" : ri.has(i) ? "complete" : oi.has(i) ? "paused" : (ni.has(i) || ((o = this.entity(e.power_entity)) == null ? void 0 : o.state) === "off", "off");
  }
  stateColor(t, e, i) {
    return {
      running: e.running_color ?? q(t),
      complete: e.complete_color ?? q(t),
      paused: e.paused_color ?? "#ff8a1c",
      error: e.error_color ?? "#ff3b5c",
      off: e.off_color ?? "#697382"
    }[i];
  }
  remainingMinutes(t) {
    return ce(this.entity(t.remaining_time_entity));
  }
  totalMinutes(t) {
    return le(this.entity(t.total_time_entity));
  }
  progress(t, e, i) {
    if (i === "complete")
      return 100;
    if (i !== "running" && i !== "paused")
      return 0;
    const r = this.totalMinutes(e), o = this.remainingMinutes(e);
    return !r || o === void 0 ? i === "running" ? 18 : 0 : Math.min(100, Math.max(0, (r - o) / r * 100));
  }
  timeDisplay(t, e) {
    return e === "complete" ? "Done" : e === "off" ? "--" : k(this.remainingMinutes(t));
  }
  timeSubtext(t, e) {
    if (e === "complete")
      return "Cycle complete";
    if (e === "off") {
      const r = k(this.totalMinutes(t));
      return r === "--" ? "Ready" : `${r} cycle`;
    }
    const i = this.remainingMinutes(t);
    return i === void 0 ? "Waiting for LG" : `${k(i)} left`;
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
    var a;
    const r = this.entity(e.power_entity);
    if (this.setOptimisticOperation(t, i ? "initial" : "power_off"), e.power_entity && !b(r)) {
      this.trackServiceResult(
        t,
        (a = this.hass) == null ? void 0 : a.callService("switch", i ? "turn_on" : "turn_off", {
          entity_id: e.power_entity
        })
      );
      return;
    }
    const o = i ? "power_on" : "power_off";
    this.hasOperation(e, o) && this.callOperation(t, e, o);
  }
  renderStat(t, e) {
    return s`
      <div class="stat">
        <span class="stat-label">${t}</span>
        <span class="stat-value">${at(this.entity(e))}</span>
      </div>
    `;
  }
  renderControl(t, e, i, r, o = "") {
    return s`
      <button
        type="button"
        class="control ${o}"
        aria-label=${t}
        ?disabled=${r}
        title=${t}
        @click=${i}
      >
        <ha-icon icon=${e}></ha-icon>
      </button>
    `;
  }
  renderMachine(t, e) {
    const i = this.stateGroup(t, e), r = this.entity(e.power_entity), o = this.entity(e.operation_entity), a = !!(e.power_entity && r), l = !o || o.state === "unavailable", c = i === "running", d = i === "running" || i === "paused", u = l || !this.canCallOperation(e, "start") || !this.isRemoteStartReady(e) || c, p = l || !this.canCallOperation(e, "stop") || !d, m = a ? b(r) || (r == null ? void 0 : r.state) === "on" : !this.canCallOperation(e, "power_on"), x = a ? b(r) || (r == null ? void 0 : r.state) === "off" : !this.canCallOperation(e, "power_off");
    return s`
      <section
        class="machine ${t} ${i}"
        style="
          --machine-state-color: ${this.stateColor(t, e, i)};
          --machine-accent-color: ${q(t)};
          --machine-contrast-color: ${li(t)};
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
              src=${e.image ?? de(t)}
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
          <div class="time">
            <span class="time-value">${this.timeDisplay(e, i)}</span>
            <span class="time-subtext">${this.timeSubtext(e, i)}</span>
          </div>
        </div>

        <div class="progress" aria-hidden="true">
          <div class="progress-bar"></div>
        </div>

        ${this.config.show_stats === !1 ? h : s`
              <div class="stats">
                ${this.renderStat("Total", e.total_time_entity)}
                ${this.renderStat("Remote", e.remote_start_entity)}
                ${this.renderStat("Energy", e.energy_entity)}
              </div>
            `}

        ${this.config.show_controls === !1 ? h : s`
              <div class="controls">
                ${this.renderControl(
      "Power",
      "mdi:power",
      () => this.setPower(t, e, !0),
      m
    )}
                ${this.renderControl(
      "Start",
      "mdi:play",
      () => this.callOperation(t, e, "start"),
      u,
      "primary"
    )}
                ${this.renderControl(
      "Stop",
      "mdi:stop",
      () => this.callOperation(t, e, "stop"),
      p
    )}
                ${this.renderControl(
      "Off",
      "mdi:power-standby",
      () => this.setPower(t, e, !1),
      x,
      "warning"
    )}
              </div>
            `}
      </section>
    `;
  }
  render() {
    return this.config ? s`
      <ha-card>
        <article class="pair-card">
          <header class="pair-header">
            <span class="pair-title">${this.config.name ?? "Laundry"}</span>
            <span class="pair-badge">Washer + Dryer</span>
          </header>
          <div class="machines">
            ${this.renderMachine("washer", this.config.washer)}
            ${this.renderMachine("dryer", this.config.dryer)}
          </div>
        </article>
      </ha-card>
    ` : s``;
  }
};
At.properties = {
  hass: { attribute: !1 },
  config: { state: !0 },
  optimisticOperations: { state: !0 }
};
let ht = At;
customElements.get("lg-laundry-pair-card") || customElements.define("lg-laundry-pair-card", ht);
const Mt = class Mt extends g {
  constructor() {
    super(...arguments), this.config = {};
  }
  static get styles() {
    return f`
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
      ...he,
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
    }, ai(this, this.config);
  }
  updatePath(t, e) {
    const [i, r] = t.split(".");
    if (!r) {
      this.updateConfig({ [i]: e });
      return;
    }
    const o = {
      ...this.config,
      [i]: {
        ...this.config[i] ?? {},
        [r]: e
      }
    };
    this.updateConfig(o);
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
    return s`
      <ha-textfield
        .label=${t}
        .placeholder=${i}
        .value=${this.valueFor(e) ?? ""}
        .configPath=${e}
        @input=${this.valueChanged}
      ></ha-textfield>
    `;
  }
  renderSwitch(t, e, i) {
    return s`
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
    return s`
      <section class="section">
        <h3>${e}</h3>
        <div class="grid">
          ${this.renderTextInput(`${e} Name`, `${t}.name`, e)}
          ${this.renderTextInput(`${e} Status Sensor`, `${t}.entity`, `sensor.${t}_current_status`)}
          ${this.renderTextInput(`${e} Image URL`, `${t}.image`, de(t))}
          ${this.renderTextInput(`${e} Power Switch`, `${t}.power_entity`, `switch.${t}_power`)}
          ${this.renderTextInput(`${e} Operation Select`, `${t}.operation_entity`, `select.${t}_operation`)}
          ${this.renderTextInput(`${e} Remaining Time`, `${t}.remaining_time_entity`, `sensor.${t}_remaining_time`)}
          ${this.renderTextInput(`${e} Total Time`, `${t}.total_time_entity`, `sensor.${t}_total_time`)}
          ${this.renderTextInput(`${e} Remote Start`, `${t}.remote_start_entity`, `binary_sensor.${t}_remote_start`)}
          ${this.renderTextInput(`${e} Energy`, `${t}.energy_entity`, `sensor.${t}_energy_this_month`)}
          ${this.renderTextInput(`${e} Error Event`, `${t}.error_entity`, `event.${t}_error`)}
        </div>
      </section>
    `;
  }
  render() {
    return s`
      <div class="editor">
        <section class="section">
          <h3>Main</h3>
          <div class="grid">
            ${this.renderTextInput("Card Name", "name", "Laundry Room")}
            ${this.renderTextInput("Width", "width", "420px")}
            ${this.renderTextInput("Radius", "border_radius", "14px")}
            ${this.renderTextInput("Background", "background", "#101722")}
          </div>
          <div class="grid">
            ${this.renderSwitch("Fill Container", "fill_container", !1)}
            ${this.renderSwitch("Show Controls", "show_controls", !0)}
            ${this.renderSwitch("Show Stats", "show_stats", !0)}
            ${this.renderSwitch("Animated", "animated", !0)}
          </div>
        </section>

        ${this.renderMachineFields("washer")}
        ${this.renderMachineFields("dryer")}
      </div>
    `;
  }
};
Mt.properties = {
  hass: { attribute: !1 },
  config: { state: !0 }
};
let dt = Mt;
customElements.get("lg-laundry-pair-card-editor") || customElements.define("lg-laundry-pair-card-editor", dt);
window.customCards = window.customCards || [];
window.customCards.push({
  preview: !0,
  type: "lg-laundry-pair-card",
  name: "LG Laundry Pair Card",
  description: "One compact named LG ThinQ washer and dryer dashboard card."
});
//# sourceMappingURL=gamma-ha-cards.js.map
