/* Oakline — Fit Check wizard (contact.html). No dependencies.
   Without JavaScript the form shows every question and posts normally.
   With JavaScript it becomes a one-question-per-screen wizard. */
(function () {
  "use strict";

  var form = document.getElementById("fit-check");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".fc-step"));
  var total = steps.length;
  var status = document.getElementById("fc-status");
  var bar = form.querySelector(".fc-progress__bar span");
  var backBtn = form.querySelector(".fc-back");
  var nextBtn = form.querySelector(".fc-next");
  var sendBtn = form.querySelector(".fc-send");
  var errorBox = form.querySelector(".fc-error");
  var done = document.getElementById("fc-done");
  var current = 0;

  var NOT_CONNECTED = /YOUR_FORM_ID/.test(form.getAttribute("action") || "");

  var LABELS = {
    need: "Need",
    urgent_issue: "What's happening",
    urgent_since: "Since",
    site_count: "Client sites",
    sprint_type: "Problem",
    task: "Task",
    hours_estimate: "Estimated hours",
    build_type: "Build",
    design_ready: "Design",
    launch_target: "Target launch",
    who: "Who",
    team_size: "Team size",
    budget: "Budget",
    name: "Name",
    email: "Email",
    website: "Website",
    message: "Note"
  };
  var NEEDS = {
    urgent: "Something is broken",
    backstop: "Ongoing technical backup",
    sprint: "Fix one specific problem",
    build: "A full build",
    care: "Care for a stable site",
    hours: "A small one-off fix (Senior Hours)",
    review: "Not sure yet"
  };

  form.noValidate = true;
  form.classList.add("is-wizard");
  form.elements.came_from.value = document.referrer || "direct";

  /* ---------- Pre-select from ?need= ---------- */
  var param = new URLSearchParams(window.location.search).get("need");
  if (param && NEEDS[param]) {
    var pre = form.querySelector('input[name="need"][value="' + param + '"]');
    if (pre) pre.checked = true;
  }

  function needValue() {
    var c = form.querySelector('input[name="need"]:checked');
    return c ? c.value : "";
  }

  /* ---------- Branching: show the step 2 branch for the chosen need ---------- */
  function syncBranches() {
    var need = needValue();
    form.querySelectorAll(".fc-branch").forEach(function (b) {
      var on = b.getAttribute("data-for").split(" ").indexOf(need) !== -1;
      b.hidden = !on;
      b.querySelectorAll("input, select, textarea").forEach(function (el) { el.disabled = !on; });
    });
    form.querySelectorAll("[data-show-for]").forEach(function (el) {
      el.hidden = el.getAttribute("data-show-for") !== need;
    });
  }

  /* ---------- Step display ---------- */
  function show(i, focus) {
    current = i;
    steps.forEach(function (s, n) { s.classList.toggle("is-current", n === i); });
    status.textContent = "Step " + (i + 1) + " of " + total;
    bar.style.width = ((i + 1) / total * 100) + "%";
    backBtn.hidden = i === 0;
    nextBtn.hidden = i === total - 1;
    sendBtn.hidden = i !== total - 1;
    clearError();
    if (focus) {
      var t = steps[i].querySelector(".fc-step__title");
      if (t) t.focus({ preventScroll: true });
      var top = form.getBoundingClientRect().top;
      if (top < 80) window.scrollTo({ top: top + window.scrollY - 96, behavior: "smooth" });
    }
  }

  /* ---------- Validation (current step only, enabled fields only) ---------- */
  function fieldsIn(step) {
    return Array.prototype.slice.call(step.querySelectorAll("input, select, textarea"))
      .filter(function (el) { return !el.disabled && el.type !== "hidden"; });
  }

  function validate(step) {
    clearError();
    var seenRadio = {};
    var fields = fieldsIn(step);
    for (var k = 0; k < fields.length; k++) {
      var el = fields[k];
      if (el.type === "radio") {
        if (seenRadio[el.name]) continue;
        seenRadio[el.name] = true;
        if ((el.required || el.hasAttribute("data-required")) && !step.querySelector('input[name="' + el.name + '"]:checked:not(:disabled)')) {
          return fail(el, "Choose one option to continue.");
        }
        continue;
      }
      var v = (el.value || "").trim();
      if ((el.required || el.hasAttribute("data-required")) && !v) {
        if (el.name === "email") return fail(el, "Enter a work email so we can reply.");
        if (el.name === "name") return fail(el, "Enter your name.");
        if (el.name === "task") return fail(el, "Add a short description of what needs doing.");
        return fail(el, "Choose an option to continue.");
      }
      if (el.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        return fail(el, "That email address doesn't look complete.");
      }
    }
    return true;
  }

  function fail(el, msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    el.setAttribute("aria-invalid", "true");
    el.focus();
    return false;
  }
  function clearError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute("aria-invalid"); });
  }

  /* ---------- Navigation ---------- */
  nextBtn.addEventListener("click", function () {
    if (!validate(steps[current])) return;
    if (current === 0) syncBranches();
    show(current + 1, true);
  });
  backBtn.addEventListener("click", function () { show(current - 1, true); });

  form.addEventListener("change", function (e) {
    if (e.target.name === "need") syncBranches();
    /* Choices and dropdowns clear their error as soon as one is picked */
    if ((e.target.type === "radio" || e.target.tagName === "SELECT") && !errorBox.hidden) clearError();
  });
  /* Text fields clear their error while typing, so nothing shifts under
     the cursor when the visitor then clicks Continue */
  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid")) clearError();
  });

  /* Enter key moves forward instead of submitting early */
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "BUTTON" && current < total - 1) {
      e.preventDefault();
      nextBtn.click();
    }
  });

  /* ---------- Summary ---------- */
  function collect() {
    var data = new FormData(form);
    var rows = [];
    data.forEach(function (value, key) {
      if (!LABELS[key] || !String(value).trim()) return;
      rows.push([LABELS[key], key === "need" ? (NEEDS[value] || value) : String(value).trim()]);
    });
    return { data: data, rows: rows };
  }

  function renderSummary(rows) {
    var dl = done.querySelector("[data-summary]");
    dl.innerHTML = "";
    rows.forEach(function (r) {
      if (r[0] === "Note") return;
      var wrap = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = r[0];
      var dd = document.createElement("dd"); dd.textContent = r[1];
      wrap.appendChild(dt); wrap.appendChild(dd); dl.appendChild(wrap);
    });
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (current !== total - 1) { nextBtn.click(); return; }
    if (!validate(steps[current])) return;

    var website = form.elements.website;
    if (website.value.trim() && !/^https?:\/\//i.test(website.value.trim())) {
      website.value = "https://" + website.value.trim();
    }
    var need = NEEDS[needValue()] || "Fit check";
    form.elements._subject.value = "Fit check: " + need + " (" + form.elements.name.value.trim() + ")";

    var c = collect();

    if (NOT_CONNECTED) {
      errorBox.textContent = "This form isn't connected yet, so nothing was sent. Please email hello@oaklinetech.net instead.";
      errorBox.hidden = false;
      return;
    }

    sendBtn.disabled = true;
    sendBtn.firstChild.textContent = "Sending… ";

    fetch(form.action, { method: "POST", body: c.data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        finish(c.rows);
      })
      .catch(function () {
        sendBtn.disabled = false;
        sendBtn.firstChild.textContent = "Send fit check ";
        errorBox.textContent = "Your fit check couldn't be sent. Check your connection and try again, or email hello@oaklinetech.net.";
        errorBox.hidden = false;
      });
  });

  function finish(rows) {
    var first = form.elements.name.value.trim().split(/\s+/)[0];
    done.querySelector("[data-done-name]").textContent = first ? ", " + first : "";
    renderSummary(rows);
    var url = form.getAttribute("data-booking-url");
    var book = done.querySelector(".fc-book");
    if (url) { book.href = url; book.hidden = false; }
    form.hidden = true;
    done.hidden = false;
    done.querySelector(".fc-done__title").focus();
    window.scrollTo({ top: done.getBoundingClientRect().top + window.scrollY - 120 });
  }

  syncBranches();
  show(0, false);
})();
