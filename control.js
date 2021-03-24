const SettingsCategories = {
  ENV: "Envorionment",
  FIELD: "Flowfield",
  PARTICLE: "Particle",
};

class SliderControl {
  constructor(
    label,
    minValue,
    maxValue,
    stepSize,
    settingsKey,
    category,
    onUpdateCallback
  ) {
    this.label = label;
    this.settingsKey = settingsKey;
    this.category = category;
    this.onUpdateCallback = onUpdateCallback;

    this.labelElement = createElement(
      "label",
      this.getLabelText(Settings[settingsKey])
    );

    this.sliderElement = createSlider(
      minValue,
      maxValue,
      Settings[settingsKey],
      stepSize
    );
    this.sliderElement.style("width", "100%");
    this.labelElement.parent("controls");
    this.sliderElement.parent("controls");
  }

  getLabelText(value) {
    return `${this.label} (${value})`;
  }

  getValue() {
    return this.sliderElement.value();
  }

  update() {
    const val = this.getValue();
    if (val !== Settings[this.settingsKey]) {
      noLoop();

      Settings[this.settingsKey] = val;

      if (this.onUpdateCallback) this.onUpdateCallback();

      this.labelElement.html(this.getLabelText(val));
      loop();
    }
  }
}

class CheckboxControl {
  constructor(label, settingsKey, category, onUpdateCallback) {
    this.label = label;
    this.settingsKey = settingsKey;
    this.category = category;
    this.onUpdateCallback = onUpdateCallback;

    this.checkboxElement = createCheckbox(
      this.label,
      Settings[this.settingsKey]
    );

    this.checkboxElement.class("cb-wrapper");

    this.checkboxElement.changed(() => {
      Settings[this.settingsKey] = this.checkboxElement.checked();
      if (this.onUpdateCallback) this.onUpdateCallback();
    });

    this.checkboxElement.parent("controls");
  }
}

class HeadingControl {
  constructor(label) {
    this.label = label;
    this.headingElement = createElement("h3", this.label);
    this.headingElement.parent("controls");
  }
}
