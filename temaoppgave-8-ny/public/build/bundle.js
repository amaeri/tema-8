
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.19.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* node_modules/svelte-eva-icons/src/icons/CloseCircleIcon.svelte generated by Svelte v3.19.1 */

    const file = "node_modules/svelte-eva-icons/src/icons/CloseCircleIcon.svelte";

    function create_fragment(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file, 0, 138, 138);
    			attr_dev(path, "d", "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm2.71 11.29a1 1 0 0 1 0 1.42 1 1 0 0 1-1.42 0L12 13.41l-1.29 1.3a1 1 0 0 1-1.42 0 1 1 0 0 1 0-1.42l1.3-1.29-1.3-1.29a1 1 0 0 1 1.42-1.42l1.29 1.3 1.29-1.3a1 1 0 0 1 1.42 1.42L13.41 12z");
    			add_location(path, file, 0, 180, 180);
    			attr_dev(g0, "data-name", "close-circle");
    			add_location(g0, file, 0, 110, 110);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file, 0, 87, 87);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class CloseCircleIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CloseCircleIcon",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* node_modules/svelte-eva-icons/src/icons/InfoIcon.svelte generated by Svelte v3.19.1 */

    const file$1 = "node_modules/svelte-eva-icons/src/icons/InfoIcon.svelte";

    function create_fragment$1(ctx) {
    	let svg;
    	let g1;
    	let g0;
    	let rect;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path = svg_element("path");
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "transform", "rotate(180 12 12)");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file$1, 0, 130, 130);
    			attr_dev(path, "d", "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm-1-7a1 1 0 1 1 1-1 1 1 0 0 1-1 1z");
    			add_location(path, file$1, 0, 202, 202);
    			attr_dev(g0, "data-name", "info");
    			add_location(g0, file$1, 0, 110, 110);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file$1, 0, 87, 87);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class InfoIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoIcon",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.19.1 */
    const file$2 = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (82:3) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t2;
    	let button;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Hipp hurra! Du har nådd sparemålet!";
    			t2 = space();
    			button = element("button");
    			button.textContent = "Nytt sparemål";
    			attr_dev(img, "id", "balloons");
    			if (img.src !== (img_src_value = "./assets/balloons.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "ballonger");
    			attr_dev(img, "class", "svelte-1ant18e");
    			add_location(img, file$2, 83, 4, 2156);
    			add_location(p, file$2, 84, 4, 2224);
    			attr_dev(button, "class", "svelte-1ant18e");
    			add_location(button, file$2, 85, 4, 2271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button, anchor);
    			dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[19], false, false, false);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(82:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:3) {#if !achieved}
    function create_if_block_2(ctx) {
    	let h3;
    	let t1;
    	let input;
    	let t2;
    	let div4;
    	let div0;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let t5;
    	let div3;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Registrer arbeidsoppgave og beløp";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			div2 = element("div");
    			t5 = space();
    			div3 = element("div");
    			add_location(h3, file$2, 71, 4, 1451);
    			attr_dev(input, "placeholder", "Arbeidsoppgave");
    			attr_dev(input, "class", "svelte-1ant18e");
    			add_location(input, file$2, 72, 4, 1498);
    			attr_dev(div0, "id", "ti");
    			attr_dev(div0, "class", "knapper svelte-1ant18e");
    			add_location(div0, file$2, 74, 5, 1586);
    			attr_dev(div1, "id", "tyve");
    			attr_dev(div1, "class", "knapper svelte-1ant18e");
    			add_location(div1, file$2, 75, 5, 1674);
    			attr_dev(div2, "id", "femti");
    			attr_dev(div2, "class", "knapper svelte-1ant18e");
    			add_location(div2, file$2, 76, 5, 1764);
    			attr_dev(div3, "id", "hundre");
    			attr_dev(div3, "class", "knapper svelte-1ant18e");
    			add_location(div3, file$2, 77, 5, 1855);
    			attr_dev(div4, "id", "verdiknapper");
    			attr_dev(div4, "class", "svelte-1ant18e");
    			add_location(div4, file$2, 73, 4, 1557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[14](input);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);

    			dispose = [
    				listen_dev(div0, "click", /*click_handler_1*/ ctx[15], false, false, false),
    				listen_dev(div0, "click", /*addTask*/ ctx[11], false, false, false),
    				listen_dev(div1, "click", /*click_handler_2*/ ctx[16], false, false, false),
    				listen_dev(div1, "click", /*addTask*/ ctx[11], false, false, false),
    				listen_dev(div2, "click", /*click_handler_3*/ ctx[17], false, false, false),
    				listen_dev(div2, "click", /*addTask*/ ctx[11], false, false, false),
    				listen_dev(div3, "click", /*click_handler_4*/ ctx[18], false, false, false),
    				listen_dev(div3, "click", /*addTask*/ ctx[11], false, false, false)
    			];
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[14](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(70:3) {#if !achieved}",
    		ctx
    	});

    	return block;
    }

    // (54:3) {#if !regGoal}
    function create_if_block_1(ctx) {
    	let h3;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let input1_updating = false;
    	let t3;
    	let button;
    	let dispose;

    	function input1_input_handler() {
    		input1_updating = true;
    		/*input1_input_handler*/ ctx[13].call(input1);
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Registrer sparemål og kostnad";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Neste";
    			add_location(h3, file$2, 55, 3, 1092);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Sparemål");
    			attr_dev(input0, "class", "svelte-1ant18e");
    			add_location(input0, file$2, 56, 3, 1134);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Kostnad");
    			attr_dev(input1, "class", "svelte-1ant18e");
    			add_location(input1, file$2, 62, 3, 1257);
    			attr_dev(button, "class", "next svelte-1ant18e");
    			add_location(button, file$2, 67, 3, 1334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*goal*/ ctx[0]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*cost*/ ctx[1]);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, button, anchor);

    			dispose = [
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    				listen_dev(input0, "click", click_handler, false, false, false),
    				listen_dev(input1, "input", input1_input_handler),
    				listen_dev(button, "click", /*startSaving*/ ctx[10], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*goal*/ 1 && input0.value !== /*goal*/ ctx[0]) {
    				set_input_value(input0, /*goal*/ ctx[0]);
    			}

    			if (!input1_updating && dirty & /*cost*/ 2) {
    				set_input_value(input1, /*cost*/ ctx[1]);
    			}

    			input1_updating = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(54:3) {#if !regGoal}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let h40;
    	let t2;
    	let h41;
    	let t4;
    	let current;
    	let dispose;
    	const closecircleicon = new CloseCircleIcon({ $$inline: true });
    	let each_value = /*taskList*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(closecircleicon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Arbeidsoppgaver";
    			t2 = space();
    			h41 = element("h4");
    			h41.textContent = "Beløp";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "closeIcon svelte-1ant18e");
    			add_location(div0, file$2, 103, 5, 2692);
    			add_location(h40, file$2, 108, 6, 2831);
    			add_location(h41, file$2, 109, 6, 2862);
    			attr_dev(div1, "class", "taskList svelte-1ant18e");
    			add_location(div1, file$2, 107, 5, 2802);
    			attr_dev(div2, "class", "tasks svelte-1ant18e");
    			add_location(div2, file$2, 102, 4, 2667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(closecircleicon, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h40);
    			append_dev(div1, t2);
    			append_dev(div1, h41);
    			append_dev(div1, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    			dispose = listen_dev(div0, "click", /*click_handler_7*/ ctx[21], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*taskList*/ 32) {
    				each_value = /*taskList*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closecircleicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closecircleicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(closecircleicon);
    			destroy_each(each_blocks, detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(102:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#if !showTasklist}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let div0;
    	let current;
    	let dispose;
    	const infoicon = new InfoIcon({ $$inline: true });

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*savings*/ ctx[2]);
    			t2 = text(" kr\n\t\t\t\t\t");
    			div0 = element("div");
    			create_component(infoicon.$$.fragment);
    			if (img.src !== (img_src_value = "./assets/piggybank.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sparegris");
    			attr_dev(img, "class", "svelte-1ant18e");
    			add_location(img, file$2, 93, 4, 2443);
    			attr_dev(div0, "class", "infoIcon svelte-1ant18e");
    			add_location(div0, file$2, 96, 5, 2543);
    			attr_dev(div1, "class", "savings svelte-1ant18e");
    			add_location(div1, file$2, 94, 4, 2498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(infoicon, div0, null);
    			current = true;
    			dispose = listen_dev(div0, "click", /*click_handler_6*/ ctx[20], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*savings*/ 4) set_data_dev(t1, /*savings*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infoicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infoicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(infoicon);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(93:4) {#if !showTasklist}",
    		ctx
    	});

    	return block;
    }

    // (111:6) {#each taskList as item}
    function create_each_block(ctx) {
    	let p0;
    	let t0_value = /*item*/ ctx[22].title + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*item*/ ctx[22].cost + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = text(" kr");
    			add_location(p0, file$2, 111, 7, 2915);
    			add_location(p1, file$2, 112, 7, 2942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t2);
    			append_dev(p1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*taskList*/ 32 && t0_value !== (t0_value = /*item*/ ctx[22].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*taskList*/ 32 && t2_value !== (t2_value = /*item*/ ctx[22].cost + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(111:6) {#each taskList as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let img;
    	let img_src_value;
    	let t0;
    	let section;
    	let div0;
    	let t1;
    	let div3;
    	let div1;
    	let current_block_type_index;
    	let if_block1;
    	let t2;
    	let div2;
    	let p0;
    	let label0;
    	let b0;
    	let t4;
    	let t5;
    	let t6;
    	let p1;
    	let label1;
    	let b1;
    	let t8;
    	let t9;
    	let t10;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (!/*regGoal*/ ctx[3]) return create_if_block_1;
    		if (!/*achieved*/ ctx[9]) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*showTasklist*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			img = element("img");
    			t0 = space();
    			section = element("section");
    			div0 = element("div");
    			if_block0.c();
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			p0 = element("p");
    			label0 = element("label");
    			b0 = element("b");
    			b0.textContent = "Sparemål";
    			t4 = space();
    			t5 = text(/*goal*/ ctx[0]);
    			t6 = space();
    			p1 = element("p");
    			label1 = element("label");
    			b1 = element("b");
    			b1.textContent = "Gjenstående beløp";
    			t8 = space();
    			t9 = text(/*diff*/ ctx[8]);
    			t10 = text(" kr");
    			attr_dev(img, "id", "logo");
    			if (img.src !== (img_src_value = "./assets/logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-1ant18e");
    			add_location(img, file$2, 49, 1, 948);
    			attr_dev(div0, "class", "inputs svelte-1ant18e");
    			add_location(div0, file$2, 52, 2, 1031);
    			attr_dev(div1, "class", "pig svelte-1ant18e");
    			add_location(div1, file$2, 91, 3, 2394);
    			add_location(b0, file$2, 120, 14, 3055);
    			add_location(label0, file$2, 120, 7, 3048);
    			add_location(p0, file$2, 120, 4, 3045);
    			add_location(b1, file$2, 121, 14, 3104);
    			add_location(label1, file$2, 121, 7, 3097);
    			add_location(p1, file$2, 121, 4, 3094);
    			attr_dev(div2, "id", "goal");
    			attr_dev(div2, "class", "svelte-1ant18e");
    			add_location(div2, file$2, 119, 3, 3025);
    			attr_dev(div3, "class", "piggybank svelte-1ant18e");
    			add_location(div3, file$2, 90, 2, 2367);
    			attr_dev(section, "class", "svelte-1ant18e");
    			add_location(section, file$2, 51, 1, 1019);
    			attr_dev(main, "class", "svelte-1ant18e");
    			add_location(main, file$2, 48, 0, 940);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, img);
    			append_dev(main, t0);
    			append_dev(main, section);
    			append_dev(section, div0);
    			if_block0.m(div0, null);
    			append_dev(section, t1);
    			append_dev(section, div3);
    			append_dev(div3, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, label0);
    			append_dev(label0, b0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, p1);
    			append_dev(p1, label1);
    			append_dev(label1, b1);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}

    			if (!current || dirty & /*goal*/ 1) set_data_dev(t5, /*goal*/ ctx[0]);
    			if (!current || dirty & /*diff*/ 256) set_data_dev(t9, /*diff*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = event => event.target.value = "";

    function instance($$self, $$props, $$invalidate) {
    	let goal = "Lego"; //tøm for å restarte
    	let cost = 200; //bytt til 0 for å restarte
    	let savings = 0;
    	let regGoal = true; //bytt til false for å restarte
    	let showTasklist = false;
    	let taskList = [];
    	let task;
    	let taskPrice = 10;

    	// let fillPiggybank = true
    	const startSaving = () => {
    		$$invalidate(3, regGoal = true);
    	};

    	const addTask = () => {
    		if (task.value == "") {
    			$$invalidate(6, task.placeholder = "Du må fylle inn arbeidsoppgave", task);
    			return;
    		}

    		$$invalidate(2, savings = savings + taskPrice);
    		$$invalidate(5, taskList = [{ title: task.value, cost: taskPrice }, ...taskList]);
    		$$invalidate(6, task.value = "", task);
    		$$invalidate(7, taskPrice = 10);
    	};

    	function input0_input_handler() {
    		goal = this.value;
    		$$invalidate(0, goal);
    	}

    	function input1_input_handler() {
    		cost = to_number(this.value);
    		$$invalidate(1, cost);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(6, task = $$value);
    		});
    	}

    	const click_handler_1 = () => $$invalidate(7, taskPrice = 10);
    	const click_handler_2 = () => $$invalidate(7, taskPrice = 20);
    	const click_handler_3 = () => $$invalidate(7, taskPrice = 50);
    	const click_handler_4 = () => $$invalidate(7, taskPrice = 100);
    	const click_handler_5 = () => $$invalidate(3, regGoal = false);
    	const click_handler_6 = () => $$invalidate(4, showTasklist = true);
    	const click_handler_7 = () => $$invalidate(4, showTasklist = false);

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		scale,
    		InfoIcon,
    		CloseCircleIcon,
    		goal,
    		cost,
    		savings,
    		regGoal,
    		showTasklist,
    		taskList,
    		task,
    		taskPrice,
    		startSaving,
    		addTask,
    		diff,
    		achieved,
    		console
    	});

    	$$self.$inject_state = $$props => {
    		if ("goal" in $$props) $$invalidate(0, goal = $$props.goal);
    		if ("cost" in $$props) $$invalidate(1, cost = $$props.cost);
    		if ("savings" in $$props) $$invalidate(2, savings = $$props.savings);
    		if ("regGoal" in $$props) $$invalidate(3, regGoal = $$props.regGoal);
    		if ("showTasklist" in $$props) $$invalidate(4, showTasklist = $$props.showTasklist);
    		if ("taskList" in $$props) $$invalidate(5, taskList = $$props.taskList);
    		if ("task" in $$props) $$invalidate(6, task = $$props.task);
    		if ("taskPrice" in $$props) $$invalidate(7, taskPrice = $$props.taskPrice);
    		if ("diff" in $$props) $$invalidate(8, diff = $$props.diff);
    		if ("achieved" in $$props) $$invalidate(9, achieved = $$props.achieved);
    	};

    	let diff;
    	let achieved;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*cost, savings*/ 6) {
    			 $$invalidate(8, diff = cost - savings);
    		}

    		if ($$self.$$.dirty & /*diff*/ 256) {
    			 $$invalidate(9, achieved = diff <= 0 ? true : false);
    		}

    		if ($$self.$$.dirty & /*taskList*/ 32) {
    			 console.log(taskList);
    		}
    	};

    	return [
    		goal,
    		cost,
    		savings,
    		regGoal,
    		showTasklist,
    		taskList,
    		task,
    		taskPrice,
    		diff,
    		achieved,
    		startSaving,
    		addTask,
    		input0_input_handler,
    		input1_input_handler,
    		input_binding,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
