const SettingsCategories = {
	ENV: "Envorionment",
	FIELD: "Flowfield",
	PARTICLE: "Particle",
}

class SliderControl {

    constructor(label, minValue, maxValue, startValue, stepSize, settingsKey, category, onUpdateCallback){
        this.label = label;
        this.settingsKey = settingsKey;
        this.category = category;

        this.labelElement = createElement('label', this.getLabelText(startValue));
        this.sliderElement = createSlider(minValue, maxValue, startValue,stepSize);
        this.sliderElement.style('width', '100%');
        this.labelElement.parent('controls');
        this.sliderElement.parent('controls');

        this.onUpdateCallback = onUpdateCallback;
    }

    getLabelText(value) {
        return `${this.label} (${value})`
    }

    getValue() {
        return this.sliderElement.value();
    }

    update() {
        const val = this.getValue();
        if(val !== Settings[this.settingsKey]){
            noLoop();
            
            Settings[this.settingsKey] = val;

            if(this.onUpdateCallback)
                this.onUpdateCallback();

            this.labelElement.html(this.getLabelText(val));
            loop();           
        }
    }
}