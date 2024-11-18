export class JsonCodecs {
    #jsonUrl;
    #objects;
    #mode;
    #node;

    constructor(jsonUrl) {
        this.#jsonUrl = jsonUrl;
        this.serialize();
    }

    serialize() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.#jsonUrl, false);
        try {
            xhr.send(null);
        } catch (error) {
            this.#mode = "encode";
            return;
        }

        if (xhr.status === 200) {
            try {
                this.#objects = JSON.parse(xhr.responseText);
                this.#mode = "decode";
            } catch (error) {
                console.error(`Failed to decode JSON ${this.#jsonUrl}: ${error.message} at position ${error.position}`);
                this.#objects = null;
            }
        } else {
            this.#mode = "encode";
        }
    }

    createNode() {
        this.#node = null;
        return this;
    }
    getNode(node) {
        if (this.#node != null) {
            if (this.#node[node]) {
                this.#node = this.#node[node];
            } else if (typeof this.#node.get === 'function') {
                this.#node = this.#node.get(node);
            } else {
                this.#node = null;
            }
        } else if (this.#objects[node]) {
            this.#node = this.#objects[node];
        } else {
            this.#node = null;
        }
        return this;
    }

    forEachNode(f) {
        if (typeof f === 'function' && Array.isArray(this.#node)) {
            this.#node.forEach((node) => f(node));
        }
        return this;
    }

    getNodeValue() {
        return this.#node;
    }

    nodeApply(f) {
        if (typeof f === 'function') {
            f(this.#node);
        }
        return this;
    }

    apply(f) {
        if (typeof f === 'function') {
            f(this.#objects);
        }
        return this;
    }

    toObject() {
        return this.#objects;
    }

    toJson(object) {
        let jsonStr = JSON.stringify(object);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    static create(jsonUrl) {
        return new JsonCodecs(jsonUrl);
    }
}

export class YamlCodecs {
    #yamlUrl;
    #objects;
    #mode;
    #node;

    constructor(yamlUrl) {
        this.#yamlUrl = yamlUrl;
        this.serialize();
    }

    serialize() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.#yamlUrl, false);
        try {
            xhr.send(null);
        } catch (error) {
            this.#mode = "encode";
            return;
        }

        if (xhr.status === 200) {
            try {
                this.#objects = YAML.parse(xhr.responseText);
                this.#mode = "decode";
            } catch (error) {
                console.error(`Failed to decode YAML ${this.#yamlUrl}: ${error.message} at position ${error.position}`);
                this.#objects = null;
            }
        } else {
            this.#mode = "encode";
        }
    }

    createNode() {
        this.#node = null;
        return this;
    }
    getNode(node) {
        if (this.#node != null) {
            if (this.#node[node]) {
                this.#node = this.#node[node];
            } else if (typeof this.#node.get === 'function') {
                this.#node = this.#node.get(node);
            } else {
                this.#node = null;
            }
        } else if (this.#objects[node]) {
            this.#node = this.#objects[node];
        } else {
            this.#node = null;
        }
        return this;
    }

    forEachNode(f) {
        if (typeof f === 'function' && Array.isArray(this.#node)) {
            this.#node.forEach((node) => f(node));
        }
        return this;
    }

    getNodeValue() {
        return this.#node;
    }

    nodeApply(f) {
        if (typeof f === 'function') {
            f(this.#node);
        }
        return this;
    }

    apply(f) {
        if (typeof f === 'function') {
            f(this.#objects);
        }
        return this;
    }

    toObject() {
        return this.#objects;
    }

    toYaml(object) {
        let yamlStr = YAML.stringify(object);
        const blob = new Blob([yamlStr], { type: 'application/yaml' });
        return URL.createObjectURL(blob);
    }

    static create(yamlUrl) {
        return new YamlCodecs(yamlUrl);
    }
}