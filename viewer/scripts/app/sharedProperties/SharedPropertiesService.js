class SharedPropertiesService {
    constructor() {
        this.engine = null;
    }
    setEngine(engine) {
        this.engine = engine;
    }
    getEngine() {
        return this.engine;
    }
}

SharedPropertiesService.$inject = [];

module.exports = SharedPropertiesService;
