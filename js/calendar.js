/* ==========================================================================
   Academic calendar
   ========================================================================== */

(function () {
  "use strict";

  var section = document.querySelector("[data-calendar]");
  if (!section) {
    return;
  }

  var grid = section.querySelector("[data-calendar-grid]");
  var weekdays = section.querySelector("[data-calendar-weekdays]");
  var monthLabel = section.querySelector("[data-calendar-month]");
  var layout = section.querySelector("[data-calendar-layout]");
  var details = section.querySelector("[data-calendar-details]");
  var selectedDateLabel = section.querySelector("[data-calendar-selected-date]");
  var eventList = section.querySelector("[data-calendar-events]");
  var emptyState = section.querySelector("[data-calendar-empty]");
  var prompt = section.querySelector("[data-calendar-prompt]");

  var LABELS = {
    th: {
      weekday: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."],
      weekdayFull: [
        "วันจันทร์",
        "วันอังคาร",
        "วันพุธ",
        "วันพฤหัสบดี",
        "วันศุกร์",
        "วันเสาร์",
        "วันอาทิตย์"
      ],
      monthGrid: "ปฏิทิน",
      event: "กำหนดการ",
      viewEvent: "ดูรายละเอียด",
      download: "ดาวน์โหลดเอกสาร"
    },
    en: {
      weekday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekdayFull: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      monthGrid: "Calendar",
      event: "Schedule",
      viewEvent: "View details",
      download: "Download document"
    }
  };

  /* Do not show demo events; official dates and document URLs are not available yet. */
  var EVENTS = [];
  var today = startOfDay(new Date());
  var viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var selectedDate = null;

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function currentLanguage() {
    return document.documentElement.getAttribute("data-lang") === "en" ? "en" : "th";
  }

  function dateKey(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  function dateFromKey(key) {
    var parts = key.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function formatDate(date) {
    var locale = currentLanguage() === "en" ? "en-US" : "th-TH";
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatMonth(date) {
    var thai = new Intl.DateTimeFormat("th-TH", {
      month: "long",
      year: "numeric"
    }).format(date);
    var english = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(date);
    return thai + " / " + english;
  }

  function eventText(value) {
    if (typeof value === "string") {
      return value;
    }
    return value && value[currentLanguage()] ? value[currentLanguage()] : "";
  }

  function eventsForDate(date) {
    var key = dateKey(date);
    return EVENTS.filter(function (event) {
      return event.date === key;
    });
  }

  function renderWeekdays() {
    var lang = currentLanguage();
    var fragment = document.createDocumentFragment();

    LABELS[lang].weekday.forEach(function (label, index) {
      var cell = document.createElement("span");
      cell.className = "calendar__weekday";
      cell.setAttribute("role", "columnheader");
      cell.setAttribute("aria-label", LABELS[lang].weekdayFull[index]);
      cell.textContent = label;
      fragment.appendChild(cell);
    });

    weekdays.replaceChildren(fragment);
  }

  function createDayCell(date, focusKey) {
    var cell = document.createElement("div");
    cell.className = "calendar__cell";
    cell.setAttribute("role", "gridcell");

    var isCurrentMonth = date.getMonth() === viewedMonth.getMonth();
    if (!isCurrentMonth) {
      var outside = document.createElement("span");
      outside.className = "calendar__outside-day";
      outside.textContent = String(date.getDate());
      cell.appendChild(outside);
      return cell;
    }

    var key = dateKey(date);
    var events = eventsForDate(date);
    var button = document.createElement("button");
    button.className = "calendar__day";
    button.type = "button";
    button.dataset.calendarDate = key;
    button.setAttribute("aria-label", formatDate(date));
    button.setAttribute(
      "aria-pressed",
      String(Boolean(selectedDate && dateKey(selectedDate) === key))
    );
    button.tabIndex = focusKey === key ? 0 : -1;

    if (dateKey(today) === key) {
      button.classList.add("calendar__day--today");
    }

    if (selectedDate && dateKey(selectedDate) === key) {
      button.classList.add("is-selected");
    }

    var number = document.createElement("span");
    number.className = "calendar__day-number";
    number.textContent = String(date.getDate());
    button.appendChild(number);

    if (events.length) {
      var dot = document.createElement("span");
      dot.className = "calendar__event-dot";
      dot.setAttribute("aria-hidden", "true");
      button.appendChild(dot);

      var title = eventText(events[0].title);
      if (title) {
        var eventLabel = document.createElement("span");
        eventLabel.className = "calendar__event-label";
        eventLabel.textContent = title;
        button.appendChild(eventLabel);
      }

      button.setAttribute(
        "aria-label",
        formatDate(date) + ", " + events.length + " " + LABELS[currentLanguage()].event
      );
    }

    cell.appendChild(button);
    return cell;
  }

  function renderMonth(focusSelected) {
    var lang = currentLanguage();
    monthLabel.textContent = formatMonth(viewedMonth);
    grid.setAttribute(
      "aria-label",
      LABELS[lang].monthGrid + " " + monthLabel.textContent
    );

    var firstOfMonth = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1);
    var mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    var gridStart = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth(),
      1 - mondayOffset
    );
    var focusKey = selectedDate && focusSelected
      ? dateKey(selectedDate)
      : dateKey(
          today.getMonth() === viewedMonth.getMonth() &&
          today.getFullYear() === viewedMonth.getFullYear()
            ? today
            : firstOfMonth
        );
    var fragment = document.createDocumentFragment();

    for (var weekIndex = 0; weekIndex < 6; weekIndex += 1) {
      var week = document.createElement("div");
      week.className = "calendar__week";
      week.setAttribute("role", "row");

      for (var dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        var date = new Date(gridStart);
        date.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
        week.appendChild(createDayCell(date, focusKey));
      }

      fragment.appendChild(week);
    }

    grid.replaceChildren(fragment);
  }

  function appendLocalizedText(parent, tagName, className, value) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = eventText(value);
    parent.appendChild(element);
    return element;
  }

  function renderEvent(event) {
    var card = document.createElement("article");
    card.className = "calendar-event";

    if (event.category) {
      appendLocalizedText(card, "span", "calendar-event__category", event.category);
    }
    appendLocalizedText(card, "h4", "", event.title);

    if (event.description) {
      appendLocalizedText(card, "p", "", event.description);
    }

    var actions = document.createElement("div");
    actions.className = "calendar-event__actions";

    if (event.href) {
      var detailsLink = document.createElement("a");
      detailsLink.className = "calendar-event__link";
      detailsLink.href = event.href;
      detailsLink.target = "_blank";
      detailsLink.rel = "noopener noreferrer";
      detailsLink.textContent = LABELS[currentLanguage()].viewEvent;
      actions.appendChild(detailsLink);
    }

    if (event.documentUrl) {
      var downloadLink = document.createElement("a");
      downloadLink.className = "calendar-event__link";
      downloadLink.href = event.documentUrl;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";
      downloadLink.download = "";
      downloadLink.textContent =
        eventText(event.documentLabel) || LABELS[currentLanguage()].download;
      actions.appendChild(downloadLink);
    }

    if (actions.childElementCount) {
      card.appendChild(actions);
    }
    eventList.appendChild(card);
  }

  function renderDetails() {
    if (!selectedDate) {
      details.hidden = true;
      layout.classList.remove("is-selected");
      prompt.hidden = false;
      return;
    }

    details.hidden = false;
    layout.classList.add("is-selected");
    prompt.hidden = true;
    selectedDateLabel.textContent = formatDate(selectedDate);

    var events = eventsForDate(selectedDate);
    eventList.replaceChildren();
    emptyState.hidden = events.length > 0;
    events.forEach(renderEvent);
  }

  function selectDate(date, focusButton) {
    selectedDate = startOfDay(date);
    renderMonth(true);
    renderDetails();

    if (focusButton) {
      var selectedButton = grid.querySelector(
        '[data-calendar-date="' + dateKey(selectedDate) + '"]'
      );
      if (selectedButton) {
        selectedButton.focus();
      }
    }
  }

  function shiftMonth(amount) {
    viewedMonth = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth() + amount,
      1
    );
    selectedDate = null;
    renderMonth(false);
    renderDetails();
  }

  function onGridClick(event) {
    var button = event.target.closest("[data-calendar-date]");
    if (!button) {
      return;
    }
    selectDate(dateFromKey(button.dataset.calendarDate), true);
  }

  function onGridKeydown(event) {
    var button = event.target.closest("[data-calendar-date]");
    if (!button) {
      return;
    }

    var moves = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7
    };
    var amount = moves[event.key];
    if (!amount) {
      return;
    }

    event.preventDefault();
    var targetDate = dateFromKey(button.dataset.calendarDate);
    targetDate.setDate(targetDate.getDate() + amount);

    if (
      targetDate.getMonth() !== viewedMonth.getMonth() ||
      targetDate.getFullYear() !== viewedMonth.getFullYear()
    ) {
      viewedMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    }

    selectedDate = targetDate;
    renderMonth(true);
    renderDetails();
    var nextButton = grid.querySelector(
      '[data-calendar-date="' + dateKey(targetDate) + '"]'
    );
    if (nextButton) {
      nextButton.focus();
    }
  }

  function initScrollAnimation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var visible = false;

    function show() {
      section.classList.remove("is-armed", "is-in");
      section.classList.add("is-armed");
      void section.offsetWidth;
      section.classList.add("is-in");
    }

    function syncVisibility(nextVisible) {
      if (nextVisible === visible) {
        return;
      }
      visible = nextVisible;
      if (visible) {
        show();
      } else {
        section.classList.remove("is-armed", "is-in");
      }
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            syncVisibility(entry.isIntersecting);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(section);
    } else {
      function checkVisibility() {
        var rect = section.getBoundingClientRect();
        syncVisibility(
          rect.top < window.innerHeight * 0.9 &&
            rect.bottom > window.innerHeight * 0.1
        );
      }
      window.addEventListener("scroll", checkVisibility, { passive: true });
      window.addEventListener("resize", checkVisibility);
      checkVisibility();
    }
  }

  section.querySelector("[data-calendar-prev]").addEventListener("click", function () {
    shiftMonth(-1);
  });
  section.querySelector("[data-calendar-next]").addEventListener("click", function () {
    shiftMonth(1);
  });
  section.querySelector("[data-calendar-today]").addEventListener("click", function () {
    viewedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectDate(today, true);
  });
  section.querySelector("[data-calendar-back]").addEventListener("click", function () {
    selectedDate = null;
    renderMonth(false);
    renderDetails();
    section.querySelector("[data-calendar-today]").focus();
  });

  grid.addEventListener("click", onGridClick);
  grid.addEventListener("keydown", onGridKeydown);
  document.addEventListener("gu:languagechange", function () {
    renderWeekdays();
    renderMonth(Boolean(selectedDate));
    renderDetails();
  });

  renderWeekdays();
  renderMonth(false);
  initScrollAnimation();
})();
